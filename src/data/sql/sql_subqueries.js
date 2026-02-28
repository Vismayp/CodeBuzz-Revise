export const sqlSubqueriesTopic = {
  id: "sql-subqueries",
  title: "Subqueries & CTEs",
  description:
    "Scalar, multi-row, correlated subqueries, Common Table Expressions, recursive CTEs, and EXISTS.",
  icon: "Layers",
  sections: [
    {
      id: "subquery-intro",
      title: "Subqueries — Queries Inside Queries",
      content: `
## What is a Subquery?

A **subquery** (inner query) is a SQL query nested inside another query. The outer query uses the result of the inner query.

### Types of Subqueries

| Type | Returns | Used In |
|------|---------|---------|
| **Scalar** | Single value | SELECT, WHERE, HAVING |
| **Row** | Single row | WHERE (with row comparison) |
| **Multi-Row** | Multiple rows | WHERE with IN, ANY, ALL |
| **Correlated** | Depends on outer query | WHERE, SELECT (runs per row) |
| **Table (Derived)** | Result set | FROM clause |

### Subquery Placement

\`\`\`sql
-- In WHERE clause (most common)
SELECT * FROM products WHERE price > (SELECT AVG(price) FROM products);

-- In SELECT clause (scalar subquery)
SELECT name, price, (SELECT AVG(price) FROM products) AS avg_price FROM products;

-- In FROM clause (derived table / inline view)
SELECT * FROM (SELECT * FROM products WHERE price > 100) AS expensive;

-- In HAVING clause
SELECT category, AVG(price) FROM products
GROUP BY category HAVING AVG(price) > (SELECT AVG(price) FROM products);
\`\`\`
      `,
    },
    {
      id: "scalar-subqueries",
      title: "Scalar & Multi-Row Subqueries",
      content: `
## Scalar Subqueries — Return ONE Value

A scalar subquery returns exactly one row and one column. If it returns more, you get an error.

## Multi-Row Subqueries — Return Many Values

Use with \`IN\`, \`ANY\`, \`ALL\`:
- \`IN\` — Value matches any in the list
- \`ANY\` / \`SOME\` — Comparison is true for at least one
- \`ALL\` — Comparison is true for every value
      `,
      code: `-- ═══ SCALAR SUBQUERIES ═══

-- Products above average price
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);
-- The subquery returns one number: 258.59

-- Show each product with how it compares to average
SELECT 
    name,
    price,
    (SELECT ROUND(AVG(price), 2) FROM products) AS avg_price,
    price - (SELECT ROUND(AVG(price), 2) FROM products) AS diff_from_avg
FROM products
ORDER BY price DESC;

-- Most expensive product's name
SELECT name, price
FROM products
WHERE price = (SELECT MAX(price) FROM products);

-- ═══ MULTI-ROW SUBQUERIES ═══

-- Customers who have placed at least one order
SELECT first_name, last_name
FROM customers
WHERE customer_id IN (SELECT DISTINCT customer_id FROM orders);

-- Products that have been ordered
SELECT name, price
FROM products
WHERE product_id IN (
    SELECT DISTINCT product_id FROM order_items
);

-- Products NOT ordered (never sold)
SELECT name, price
FROM products
WHERE product_id NOT IN (
    SELECT DISTINCT product_id FROM order_items
);

-- ═══ ANY / ALL ═══

-- Products cheaper than ANY electronics product
-- (i.e., cheaper than the most expensive electronics)
SELECT name, price
FROM products
WHERE price < ANY (
    SELECT price FROM products WHERE category = 'Electronics'
);

-- Products more expensive than ALL books
-- (i.e., more expensive than the most expensive book)
SELECT name, price
FROM products
WHERE price > ALL (
    SELECT price FROM products WHERE category = 'Books'
);
      `,
    },
    {
      id: "correlated-subqueries",
      title: "Correlated Subqueries",
      content: `
## Correlated Subqueries — The Powerful (but Slow) Pattern

A **correlated subquery** references the outer query's columns. It runs **once per row** of the outer query.

### How It Works
\`\`\`
For EACH row in outer query:
    1. Pass outer row's values to inner query
    2. Execute inner query
    3. Use inner query result for this row
\`\`\`

### Performance Warning
> Correlated subqueries can be slow for large datasets because they execute N times (once per outer row). Consider rewriting with JOINs or window functions when possible.

### EXISTS / NOT EXISTS
The most common use of correlated subqueries. EXISTS returns TRUE if the subquery returns at least one row.
      `,
      code: `-- ═══ CORRELATED SUBQUERY ═══

-- Products priced above their category's average
SELECT p.name, p.category, p.price
FROM products p
WHERE p.price > (
    SELECT AVG(p2.price) 
    FROM products p2 
    WHERE p2.category = p.category  -- Correlated! References outer p
);
-- For Electronics: AVG = 385.99 → shows Laptop Pro (1299.99), Monitor (399.99)
-- For Furniture: AVG = 363.32 → shows Standing Desk (599.99), Office Chair (449.99)

-- Each customer's most recent order
SELECT c.first_name, c.last_name, o.order_id, o.total_amount
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date = (
    SELECT MAX(o2.order_date)
    FROM orders o2
    WHERE o2.customer_id = c.customer_id  -- Correlated
);

-- ═══ EXISTS / NOT EXISTS ═══

-- Customers who have at least one order (same as IN but more efficient)
SELECT c.first_name, c.last_name
FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
);
-- SELECT 1 is conventional — EXISTS only checks if any row exists

-- Customers who have NEVER ordered
SELECT c.first_name, c.last_name
FROM customers c
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
);

-- Products ordered by customers from 'USA'
SELECT p.name, p.price
FROM products p
WHERE EXISTS (
    SELECT 1
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.order_id
    JOIN customers c ON o.customer_id = c.customer_id
    WHERE oi.product_id = p.product_id
      AND c.country = 'USA'
);

-- ═══ EXISTS vs IN — Performance ═══
-- EXISTS is usually faster when:
--   • Subquery table is large
--   • There's an index on the correlated column
--   • You only need to check existence

-- IN is usually faster when:
--   • Subquery result set is small
--   • Subquery only runs once (non-correlated)
      `,
    },
    {
      id: "cte-basics",
      title: "Common Table Expressions (CTEs)",
      content: `
## CTEs — Clean, Readable Subqueries

A **CTE** (Common Table Expression) is a named temporary result set that you can reference within a single SQL statement.

### Syntax
\`\`\`sql
WITH cte_name AS (
    -- Your query here
)
SELECT * FROM cte_name;
\`\`\`

### Why CTEs > Subqueries
1. **Readability**: Complex queries become self-documenting
2. **Reusability**: Reference the CTE multiple times in the same query
3. **Maintenance**: Easier to debug and modify
4. **Recursion**: CTEs support recursive queries (subqueries don't)

### CTE vs Subquery vs Temp Table

| Feature | Subquery | CTE | Temp Table |
|---------|----------|-----|------------|
| Scope | Single clause | Single statement | Session |
| Reusable | ❌ | ✅ (within query) | ✅ (any query) |
| Readable | ❌ | ✅ | ✅ |
| Recursive | ❌ | ✅ | ❌ |
| Indexed | ❌ | ❌ | ✅ |
      `,
      code: `-- ═══ BASIC CTE ═══
-- Find customers who spent above average
WITH customer_spending AS (
    SELECT 
        c.customer_id,
        c.first_name,
        c.last_name,
        SUM(o.total_amount) AS total_spent
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    WHERE o.status != 'cancelled'
    GROUP BY c.customer_id, c.first_name, c.last_name
)
SELECT 
    first_name,
    last_name,
    total_spent,
    (SELECT ROUND(AVG(total_spent), 2) FROM customer_spending) AS avg_spending
FROM customer_spending
WHERE total_spent > (SELECT AVG(total_spent) FROM customer_spending)
ORDER BY total_spent DESC;

-- ═══ MULTIPLE CTEs ═══
-- Compare each product's revenue against its category average
WITH product_revenue AS (
    SELECT 
        p.product_id,
        p.name,
        p.category,
        COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS revenue
    FROM products p
    LEFT JOIN order_items oi ON p.product_id = oi.product_id
    GROUP BY p.product_id, p.name, p.category
),
category_avg AS (
    SELECT 
        category,
        ROUND(AVG(revenue), 2) AS avg_revenue
    FROM product_revenue
    GROUP BY category
)
SELECT 
    pr.name,
    pr.category,
    pr.revenue,
    ca.avg_revenue,
    pr.revenue - ca.avg_revenue AS diff,
    CASE 
        WHEN pr.revenue > ca.avg_revenue THEN '⬆️ Above'
        WHEN pr.revenue < ca.avg_revenue THEN '⬇️ Below'
        ELSE '= Average'
    END AS performance
FROM product_revenue pr
JOIN category_avg ca ON pr.category = ca.category
ORDER BY pr.category, pr.revenue DESC;

-- ═══ CTE for De-duplication ═══
-- Find the latest order for each customer
WITH ranked_orders AS (
    SELECT 
        customer_id,
        order_id,
        total_amount,
        status,
        ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn
    FROM orders
)
SELECT * FROM ranked_orders WHERE rn = 1;
      `,
    },
    {
      id: "recursive-ctes",
      title: "Recursive CTEs",
      content: `
## Recursive CTEs — Hierarchical & Sequential Data

A **Recursive CTE** references itself, allowing you to traverse hierarchical or sequential data.

### Structure
\`\`\`sql
WITH RECURSIVE cte_name AS (
    -- 1. Anchor member (base case)
    SELECT ... 
    UNION ALL
    -- 2. Recursive member (references cte_name)
    SELECT ... FROM cte_name WHERE ...
)
SELECT * FROM cte_name;
\`\`\`

### How It Works
1. **Anchor**: Execute the base query → initial result set
2. **Recurse**: Execute recursive part using previous result → add to result set
3. **Repeat**: Keep recursing until no new rows are added
4. **Return**: Combine all results

### Common Use Cases
- Employee-Manager hierarchy tree
- Bill of Materials (BOM)
- Category/folder trees
- Generate sequences (numbers, dates)
- Graph traversal
      `,
      code: `-- ═══ GENERATE A NUMBER SEQUENCE ═══
WITH RECURSIVE numbers AS (
    SELECT 1 AS n                    -- Anchor: start at 1
    UNION ALL
    SELECT n + 1 FROM numbers        -- Recursive: add 1
    WHERE n < 10                     -- Stop condition
)
SELECT n FROM numbers;
-- Result: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

-- ═══ GENERATE DATE SERIES ═══
WITH RECURSIVE dates AS (
    SELECT DATE '2025-01-01' AS dt   -- Start date
    UNION ALL
    SELECT dt + INTERVAL '1 day'     -- Add 1 day
    FROM dates
    WHERE dt < DATE '2025-01-31'     -- End date
)
SELECT dt FROM dates;
-- Generates all dates in January 2025

-- ═══ EMPLOYEE HIERARCHY TREE ═══
-- (Using hypothetical employees_hierarchy table)
-- WITH RECURSIVE org_tree AS (
--     -- Anchor: Start with CEO (no manager)
--     SELECT 
--         emp_id, name, manager_id, salary,
--         0 AS level,
--         name AS path
--     FROM employees_hierarchy
--     WHERE manager_id IS NULL
--     
--     UNION ALL
--     
--     -- Recursive: Find direct reports
--     SELECT 
--         e.emp_id, e.name, e.manager_id, e.salary,
--         ot.level + 1,
--         ot.path || ' → ' || e.name
--     FROM employees_hierarchy e
--     JOIN org_tree ot ON e.manager_id = ot.emp_id
-- )
-- SELECT 
--     REPEAT('  ', level) || name AS org_chart,
--     level,
--     salary,
--     path
-- FROM org_tree
-- ORDER BY path;
-- Result:
-- org_chart              | level | salary  | path
-- Alice (CEO)            | 0     | 250000  | Alice (CEO)
--   Bob (VP Eng)         | 1     | 180000  | Alice (CEO) → Bob (VP Eng)
--     David (Eng)        | 2     | 120000  | ... → Bob → David
--     Eve (Eng)          | 2     | 115000  | ... → Bob → Eve
--   Carol (VP Sales)     | 1     | 170000  | Alice (CEO) → Carol
--     Frank (Sales)      | 2     | 95000   | ... → Carol → Frank

-- ═══ FIBONACCI SEQUENCE ═══
WITH RECURSIVE fib AS (
    SELECT 0 AS a, 1 AS b, 1 AS n
    UNION ALL
    SELECT b, a + b, n + 1
    FROM fib
    WHERE n < 15
)
SELECT n, a AS fibonacci FROM fib;
-- 1:0, 2:1, 3:1, 4:2, 5:3, 6:5, 7:8, 8:13, ...
      `,
    },
    {
      id: "subquery-practice",
      title: "🏋️ Practice Problems: Subqueries & CTEs",
      content: `
## Practice Problems — Subqueries & CTEs

### Problem 1: Above Average Products
Find all products whose price is above the overall average price. Show the product name, price, and the average price.

### Problem 2: Most Expensive Per Category
Find the most expensive product in each category using a correlated subquery.

### Problem 3: Customers Without Electronics
Find customers who have never ordered any product from the 'Electronics' category.

### Problem 4: Revenue Ranking (CTE)
Using a CTE, rank products by their total revenue and show their percentage of total revenue.

### Problem 5: Running Total (CTE)
Write a CTE that shows each order's running total per customer.

### Problem 6: Interview Challenge
*Find the second highest priced product in each category without using window functions.*
      `,
      code: `-- ═══ SOLUTION 1: Above Average ═══
SELECT 
    name,
    price,
    (SELECT ROUND(AVG(price), 2) FROM products) AS avg_price
FROM products
WHERE price > (SELECT AVG(price) FROM products)
ORDER BY price DESC;

-- ═══ SOLUTION 2: Most Expensive Per Category ═══
SELECT p.name, p.category, p.price
FROM products p
WHERE p.price = (
    SELECT MAX(p2.price)
    FROM products p2
    WHERE p2.category = p.category
)
ORDER BY p.category;

-- ═══ SOLUTION 3: No Electronics ═══
SELECT c.first_name, c.last_name
FROM customers c
WHERE NOT EXISTS (
    SELECT 1
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE o.customer_id = c.customer_id
      AND p.category = 'Electronics'
);

-- ═══ SOLUTION 4: Revenue Ranking ═══
WITH product_revenue AS (
    SELECT 
        p.name,
        p.category,
        SUM(oi.quantity * oi.unit_price) AS revenue
    FROM products p
    JOIN order_items oi ON p.product_id = oi.product_id
    GROUP BY p.product_id, p.name, p.category
),
total_rev AS (
    SELECT SUM(revenue) AS grand_total FROM product_revenue
)
SELECT 
    pr.name,
    pr.category,
    pr.revenue,
    ROUND(pr.revenue * 100.0 / tr.grand_total, 1) AS pct_of_total
FROM product_revenue pr
CROSS JOIN total_rev tr
ORDER BY pr.revenue DESC;

-- ═══ SOLUTION 5: Running Total ═══
WITH customer_orders AS (
    SELECT 
        c.first_name,
        o.order_id,
        o.order_date,
        o.total_amount,
        SUM(o.total_amount) OVER (
            PARTITION BY c.customer_id 
            ORDER BY o.order_date
        ) AS running_total
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
)
SELECT * FROM customer_orders ORDER BY first_name, order_date;

-- ═══ SOLUTION 6: Second Highest Per Category ═══
SELECT p.name, p.category, p.price
FROM products p
WHERE p.price = (
    SELECT MAX(p2.price)
    FROM products p2
    WHERE p2.category = p.category
      AND p2.price < (
          SELECT MAX(p3.price)
          FROM products p3
          WHERE p3.category = p.category
      )
);
      `,
    },
  ],
};
