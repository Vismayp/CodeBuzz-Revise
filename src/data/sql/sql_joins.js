export const sqlJoinsTopic = {
  id: "sql-joins",
  title: "SQL JOINs — Combining Tables",
  description:
    "Master INNER, LEFT, RIGHT, FULL, CROSS, and SELF JOINs with real-world examples and visual diagrams.",
  icon: "GitMerge",
  sections: [
    {
      id: "join-overview",
      title: "Understanding JOINs",
      content: `
## JOINs — The Heart of SQL

JOINs combine rows from two or more tables based on a related column. This is what makes relational databases powerful.

### Why JOINs?
Without JOINs, you'd need to store everything in one massive table (data redundancy nightmare). JOINs let you **normalize** data into separate tables and combine them on-demand.

### JOIN Types at a Glance

| JOIN Type | Returns |
|-----------|---------|
| **INNER JOIN** | Only matching rows from both tables |
| **LEFT JOIN** | All rows from left + matching from right |
| **RIGHT JOIN** | All rows from right + matching from left |
| **FULL OUTER JOIN** | All rows from both tables |
| **CROSS JOIN** | Cartesian product (every combination) |
| **SELF JOIN** | Table joined with itself |

### The Golden Rule
> The **ON** clause defines HOW to match rows between tables. Usually it's a Foreign Key = Primary Key relationship.
      `,
      diagram: `
graph TD
    subgraph INNER["INNER JOIN"]
        IA["A ∩ B<br/>Only matching"]
    end
    subgraph LEFT["LEFT JOIN"]
        LA["All A + matching B<br/>NULL if no match"]
    end
    subgraph RIGHT["RIGHT JOIN"]
        RA["All B + matching A<br/>NULL if no match"]
    end
    subgraph FULL["FULL OUTER JOIN"]
        FA["All A + All B<br/>NULL where no match"]
    end
      `,
    },
    {
      id: "inner-join",
      title: "INNER JOIN",
      content: `
## INNER JOIN — Only Matching Rows

Returns rows that have matching values in **both** tables. If there's no match, the row is excluded.

### Visual
\`\`\`
Table A        Table B
+---+         +---+
| 1 |    ──── | 1 | ✅ Matched
| 2 |    ──── | 2 | ✅ Matched
| 3 |         | 4 |
+---+         +---+
        ↑ 3 excluded (no match in B)
              ↑ 4 excluded (no match in A)
\`\`\`

### When to Use
- You want ONLY records that exist in both tables
- Most common JOIN type (default if you just write \`JOIN\`)
      `,
      code: `-- ═══ BASIC INNER JOIN ═══
-- Get customer names with their orders
SELECT 
    c.first_name,
    c.last_name,
    o.order_id,
    o.total_amount,
    o.status
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id;
-- Note: Customers without orders are EXCLUDED

-- ═══ THREE-TABLE JOIN ═══
-- Get customer name, order details, and product info
SELECT 
    c.first_name || ' ' || c.last_name AS customer,
    o.order_id,
    p.name AS product,
    oi.quantity,
    oi.unit_price,
    (oi.quantity * oi.unit_price) AS line_total
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
INNER JOIN order_items oi ON o.order_id = oi.order_id
INNER JOIN products p ON oi.product_id = p.product_id
ORDER BY c.first_name, o.order_id;

-- ═══ INNER JOIN with WHERE ═══
-- Delivered orders with total > $200
SELECT 
    c.first_name,
    o.order_id,
    o.total_amount,
    o.status
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'delivered' AND o.total_amount > 200
ORDER BY o.total_amount DESC;

-- ═══ INNER JOIN with Aggregation ═══
-- Total spent per customer (only customers who have ordered)
SELECT 
    c.first_name,
    c.last_name,
    COUNT(o.order_id) AS order_count,
    SUM(o.total_amount) AS total_spent
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name
ORDER BY total_spent DESC;
      `,
    },
    {
      id: "left-join",
      title: "LEFT JOIN (LEFT OUTER JOIN)",
      content: `
## LEFT JOIN — All Left + Matching Right

Returns **all** rows from the left table, and matched rows from the right table. If no match, right side columns are **NULL**.

### Visual
\`\`\`
Table A (LEFT)    Table B (RIGHT)
+---+             +---+
| 1 |    ────     | 1 | ✅ Matched
| 2 |    ────     | 2 | ✅ Matched  
| 3 |    ──── NULL    3 is included, but with NULLs for B columns
+---+             +---+
\`\`\`

### When to Use
- Find records in A that may or may not have related records in B
- **Find records with NO match** (use \`WHERE right.id IS NULL\`)
- Most common after INNER JOIN
      `,
      code: `-- ═══ BASIC LEFT JOIN ═══
-- ALL customers, even those without orders
SELECT 
    c.first_name,
    c.last_name,
    o.order_id,
    o.total_amount
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
ORDER BY c.first_name;
-- Customers without orders will show NULL for order_id and total_amount

-- ═══ FIND RECORDS WITH NO MATCH ═══
-- Customers who have NEVER placed an order
SELECT 
    c.first_name,
    c.last_name,
    c.email
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
-- This is a very common interview pattern!

-- ═══ Products never ordered ═══
SELECT 
    p.name AS product_name,
    p.price
FROM products p
LEFT JOIN order_items oi ON p.product_id = oi.product_id
WHERE oi.item_id IS NULL;
-- Shows products that have never been part of any order

-- ═══ LEFT JOIN with COALESCE ═══
-- Replace NULLs with default values
SELECT 
    c.first_name,
    c.last_name,
    COALESCE(COUNT(o.order_id), 0) AS order_count,
    COALESCE(SUM(o.total_amount), 0) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name
ORDER BY total_spent DESC;
-- Now customers with no orders show 0 instead of NULL
      `,
    },
    {
      id: "right-full-join",
      title: "RIGHT JOIN & FULL OUTER JOIN",
      content: `
## RIGHT JOIN
Returns **all** rows from the right table, and matched rows from the left. If no match, left side is NULL.

> In practice, you can always rewrite a RIGHT JOIN as a LEFT JOIN by swapping the table order. Most developers prefer LEFT JOIN.

## FULL OUTER JOIN
Returns **all** rows from both tables. NULLs where there's no match on either side.

> **MySQL Note**: MySQL does NOT support FULL OUTER JOIN directly. Use \`UNION\` of LEFT JOIN and RIGHT JOIN instead.

### When to Use FULL OUTER JOIN
- Reconciliation queries (find mismatches between two datasets)
- Data migration validation
- Finding orphaned records
      `,
      code: `-- ═══ RIGHT JOIN ═══
-- All orders, even if customer was deleted (orphaned orders)
SELECT 
    c.first_name,
    o.order_id,
    o.total_amount
FROM customers c
RIGHT JOIN orders o ON c.customer_id = o.customer_id;

-- RIGHT JOIN is equivalent to swapping tables in LEFT JOIN:
SELECT 
    c.first_name,
    o.order_id,
    o.total_amount
FROM orders o
LEFT JOIN customers c ON c.customer_id = o.customer_id;

-- ═══ FULL OUTER JOIN ═══ (PostgreSQL, SQL Server)
-- See ALL customers AND ALL orders, matched where possible
SELECT 
    c.first_name,
    c.last_name,
    o.order_id,
    o.status,
    o.total_amount
FROM customers c
FULL OUTER JOIN orders o ON c.customer_id = o.customer_id
ORDER BY c.first_name;
-- Shows:
--   Customers WITH orders (matched)
--   Customers WITHOUT orders (order columns = NULL)
--   Orders WITHOUT customers (customer columns = NULL)

-- ═══ FULL OUTER JOIN — Find Mismatches ═══
-- Records that exist in only one side
SELECT 
    c.first_name,
    o.order_id
FROM customers c
FULL OUTER JOIN orders o ON c.customer_id = o.customer_id
WHERE c.customer_id IS NULL OR o.order_id IS NULL;
-- This is great for data validation/reconciliation

-- ═══ MySQL workaround for FULL OUTER JOIN ═══
-- (SELECT c.*, o.order_id FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id)
-- UNION
-- (SELECT c.*, o.order_id FROM customers c RIGHT JOIN orders o ON c.customer_id = o.customer_id);
      `,
    },
    {
      id: "cross-join",
      title: "CROSS JOIN — Cartesian Product",
      content: `
## CROSS JOIN — Every Possible Combination

Returns the **Cartesian product** — every row from A paired with every row from B.

### Size Warning!
If Table A has **m** rows and Table B has **n** rows, the result has **m × n** rows.
- 1,000 × 1,000 = 1,000,000 rows! 😱

### When to Use (Rare but Useful)
- Generate all possible combinations (e.g., sizes × colors)
- Create calendar tables (years × months)
- Test data generation
      `,
      code: `-- ═══ BASIC CROSS JOIN ═══
-- Every customer paired with every product
SELECT 
    c.first_name,
    p.name AS product
FROM customers c
CROSS JOIN products p;
-- 10 customers × 10 products = 100 rows

-- ═══ PRACTICAL USE CASE: Generate Combinations ═══
-- All size-color combinations for a product
-- (Using inline values for demo)
SELECT sizes.size, colors.color
FROM 
    (VALUES ('S'), ('M'), ('L'), ('XL')) AS sizes(size)
CROSS JOIN 
    (VALUES ('Red'), ('Blue'), ('Black')) AS colors(color)
ORDER BY sizes.size, colors.color;
-- Result: 4 sizes × 3 colors = 12 combinations
-- S-Red, S-Blue, S-Black, M-Red, M-Blue, ...

-- ═══ PRACTICAL USE CASE: Calendar Generation ═══
-- Generate all dates for each customer (for attendance tracking)
-- SELECT 
--     c.customer_id,
--     d.date
-- FROM customers c
-- CROSS JOIN generate_series('2025-01-01'::date, '2025-12-31'::date, '1 day') AS d(date);

-- ═══ ACCIDENTAL CROSS JOIN (Bug!) ═══
-- Forgetting the ON clause creates an accidental cross join
-- ❌ BAD: Missing JOIN condition
-- SELECT * FROM customers, orders;  -- This is a CROSS JOIN!
-- ✅ GOOD: Always specify the relationship
-- SELECT * FROM customers c JOIN orders o ON c.customer_id = o.customer_id;
      `,
    },
    {
      id: "self-join",
      title: "SELF JOIN",
      content: `
## SELF JOIN — A Table Joined With Itself

A SELF JOIN joins a table to itself. Common in hierarchical data (employees → managers, categories → parent categories).

### When to Use
- **Employee-Manager hierarchy**
- **Category trees** (parent-child relationships)
- **Finding duplicates** (compare rows within same table)
- **Sequential comparisons** (current row vs previous row)

### Key Requirement
You MUST use **table aliases** to distinguish the two copies of the same table.
      `,
      code: `-- ═══ EMPLOYEE-MANAGER HIERARCHY ═══
-- First, let's create an employees table for this example
-- CREATE TABLE employees_hierarchy (
--     emp_id      INT PRIMARY KEY,
--     name        VARCHAR(50),
--     manager_id  INT REFERENCES employees_hierarchy(emp_id),
--     salary      DECIMAL(10,2)
-- );
-- 
-- INSERT INTO employees_hierarchy VALUES
-- (1, 'Alice (CEO)',    NULL,  250000),
-- (2, 'Bob (VP Eng)',   1,     180000),
-- (3, 'Carol (VP Sales)', 1,   170000),
-- (4, 'David (Eng)',    2,     120000),
-- (5, 'Eve (Eng)',      2,     115000),
-- (6, 'Frank (Sales)',  3,     95000);

-- Find each employee and their manager's name
-- SELECT 
--     e.name AS employee,
--     m.name AS manager
-- FROM employees_hierarchy e
-- LEFT JOIN employees_hierarchy m ON e.manager_id = m.emp_id;
-- Result:
-- employee        | manager
-- Alice (CEO)     | NULL          (no manager)
-- Bob (VP Eng)    | Alice (CEO)
-- Carol (VP Sales)| Alice (CEO)
-- David (Eng)     | Bob (VP Eng)
-- Eve (Eng)       | Bob (VP Eng)
-- Frank (Sales)   | Carol (VP Sales)

-- ═══ FIND CUSTOMERS IN SAME CITY ═══
SELECT 
    a.first_name AS customer_1,
    b.first_name AS customer_2,
    a.city
FROM customers a
JOIN customers b 
    ON a.city = b.city 
    AND a.customer_id < b.customer_id  -- Prevent duplicates and self-matching
ORDER BY a.city;
-- Shows pairs of customers who live in the same city

-- ═══ Products in Same Price Range ═══
SELECT 
    p1.name AS product_1,
    p2.name AS product_2,
    p1.price AS price_1,
    p2.price AS price_2,
    ABS(p1.price - p2.price) AS price_diff
FROM products p1
JOIN products p2 
    ON p1.product_id < p2.product_id
    AND ABS(p1.price - p2.price) < 20  -- Within $20 of each other
ORDER BY price_diff;
      `,
    },
    {
      id: "multi-table-joins",
      title: "Multi-Table JOINs & Complex Queries",
      content: `
## Joining Multiple Tables

Real-world queries often join 3, 4, or even more tables. The key is to chain JOINs one by one.

### Strategy for Multi-Table JOINs
1. Start with the **main** table
2. JOIN related tables one at a time
3. Think about the **relationship path**:
   \`customers → orders → order_items → products\`

### Performance Tip
> The order of JOINs can affect performance. Put the most restrictive JOINs first to reduce result set early.
      `,
      code: `-- ═══ 4-TABLE JOIN: Complete Order Details ═══
SELECT 
    c.first_name || ' ' || c.last_name AS customer,
    c.city,
    o.order_id,
    o.order_date,
    o.status,
    p.name AS product,
    p.category,
    oi.quantity,
    oi.unit_price,
    (oi.quantity * oi.unit_price) AS line_total
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE o.status = 'delivered'
ORDER BY c.first_name, o.order_id;

-- ═══ JOIN with Aggregation ═══
-- Revenue by product category with customer count
SELECT 
    p.category,
    COUNT(DISTINCT c.customer_id) AS unique_customers,
    COUNT(oi.item_id) AS items_sold,
    SUM(oi.quantity) AS total_units,
    SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
JOIN orders o ON oi.order_id = o.order_id
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.status != 'cancelled'
GROUP BY p.category
ORDER BY total_revenue DESC;

-- ═══ Mix of LEFT and INNER JOINs ═══
-- All customers with their latest order (if any)
SELECT 
    c.first_name,
    c.last_name,
    o.order_id,
    o.status,
    o.total_amount
FROM customers c
LEFT JOIN LATERAL (
    SELECT * FROM orders 
    WHERE customer_id = c.customer_id 
    ORDER BY order_date DESC 
    LIMIT 1
) o ON TRUE
ORDER BY c.first_name;
-- LATERAL JOIN is PostgreSQL's way of doing "correlated subquery in FROM"
      `,
    },
    {
      id: "join-practice-problems",
      title: "🏋️ Practice Problems: JOINs",
      content: `
## Practice Problems — JOINs

### Problem 1: Customer Orders
List all customers with their order count and total spending. Include customers with no orders (show 0).

### Problem 2: Never Ordered
Find all customers who have never placed an order.

### Problem 3: Product Popularity
Find the top 5 most ordered products (by total quantity sold).

### Problem 4: Cross-City Analysis
Find pairs of customers who live in the same city.

### Problem 5: Full Order Details
Write a query that shows: customer name, order date, product name, quantity, and total for each order item. Only include delivered orders.

### Problem 6: Interview Challenge
*Find customers who have ordered products from at least 2 different categories.*
      `,
      code: `-- ═══ SOLUTION 1: Customer Orders ═══
SELECT 
    c.first_name,
    c.last_name,
    COALESCE(COUNT(o.order_id), 0) AS order_count,
    COALESCE(SUM(o.total_amount), 0) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name
ORDER BY total_spent DESC;

-- ═══ SOLUTION 2: Never Ordered ═══
SELECT c.first_name, c.last_name, c.email
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;

-- ═══ SOLUTION 3: Product Popularity ═══
SELECT 
    p.name,
    p.category,
    SUM(oi.quantity) AS total_quantity_sold,
    COUNT(DISTINCT oi.order_id) AS times_ordered
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY p.product_id, p.name, p.category
ORDER BY total_quantity_sold DESC
LIMIT 5;

-- ═══ SOLUTION 4: Cross-City ═══
SELECT 
    a.first_name AS person_1,
    b.first_name AS person_2,
    a.city
FROM customers a
JOIN customers b ON a.city = b.city AND a.customer_id < b.customer_id;

-- ═══ SOLUTION 5: Full Order Details ═══
SELECT 
    c.first_name || ' ' || c.last_name AS customer,
    o.order_date,
    p.name AS product,
    oi.quantity,
    (oi.quantity * oi.unit_price) AS total
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE o.status = 'delivered'
ORDER BY customer, o.order_date;

-- ═══ SOLUTION 6: Multi-Category Customers ═══
SELECT 
    c.first_name,
    c.last_name,
    COUNT(DISTINCT p.category) AS categories_ordered
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
GROUP BY c.customer_id, c.first_name, c.last_name
HAVING COUNT(DISTINCT p.category) >= 2
ORDER BY categories_ordered DESC;
      `,
    },
  ],
};
