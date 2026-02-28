export const sqlAggregationsTopic = {
  id: "sql-aggregations",
  title: "Aggregations & GROUP BY",
  description:
    "COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING, ROLLUP, CUBE — master data summarization.",
  icon: "BarChart",
  sections: [
    {
      id: "aggregate-functions",
      title: "Aggregate Functions",
      content: `
## Aggregate Functions — Summarize Data

Aggregate functions perform calculations across a set of rows and return a **single result**.

### Core Aggregate Functions

| Function | Description | NULL Handling |
|----------|-------------|---------------|
| \`COUNT(*)\` | Count all rows | Counts NULLs |
| \`COUNT(col)\` | Count non-NULL values | Ignores NULLs |
| \`COUNT(DISTINCT col)\` | Count unique values | Ignores NULLs |
| \`SUM(col)\` | Total of values | Ignores NULLs |
| \`AVG(col)\` | Average of values | Ignores NULLs |
| \`MIN(col)\` | Smallest value | Ignores NULLs |
| \`MAX(col)\` | Largest value | Ignores NULLs |

### Critical Interview Point
> \`COUNT(*)\` vs \`COUNT(column)\`:
> - \`COUNT(*)\` counts ALL rows including those with NULLs
> - \`COUNT(column)\` only counts rows where column IS NOT NULL
      `,
      code: `-- ═══ BASIC AGGREGATES ═══
-- Count total customers
SELECT COUNT(*) AS total_customers FROM customers;
-- Result: 10

-- Count customers with phone numbers
SELECT COUNT(phone) AS customers_with_phone FROM customers;
-- May differ from COUNT(*) if some phones are NULL

-- Count unique countries
SELECT COUNT(DISTINCT country) AS unique_countries FROM customers;
-- Result: 4 (USA, UK, Germany, Canada, Australia → 5)

-- ═══ NUMERIC AGGREGATES on Products ═══
SELECT 
    COUNT(*) AS total_products,
    SUM(price) AS total_value,
    AVG(price) AS avg_price,
    MIN(price) AS cheapest,
    MAX(price) AS most_expensive,
    MAX(price) - MIN(price) AS price_range
FROM products;
-- Result:
-- total_products: 10
-- total_value: 2585.90
-- avg_price: 258.59
-- cheapest: 29.99
-- most_expensive: 1299.99

-- ═══ CONDITIONAL AGGREGATES ═══
SELECT 
    COUNT(*) AS total_orders,
    COUNT(CASE WHEN status = 'delivered' THEN 1 END) AS delivered,
    COUNT(CASE WHEN status = 'shipped' THEN 1 END) AS shipped,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled
FROM orders;
-- This creates a summary pivot in a single query!

-- ═══ SUM with Conditions ═══
SELECT 
    SUM(total_amount) AS total_revenue,
    SUM(CASE WHEN status = 'delivered' THEN total_amount ELSE 0 END) AS delivered_revenue,
    SUM(CASE WHEN status = 'cancelled' THEN total_amount ELSE 0 END) AS cancelled_revenue
FROM orders;
      `,
    },
    {
      id: "group-by",
      title: "GROUP BY — Grouping Data",
      content: `
## GROUP BY — Aggregate Per Group

\`GROUP BY\` divides rows into groups and applies aggregate functions to each group separately.

### Rules
1. Every column in SELECT must be either:
   - In the GROUP BY clause, OR
   - Inside an aggregate function
2. You cannot select a non-aggregated column that isn't in GROUP BY
3. WHERE filters rows BEFORE grouping, HAVING filters AFTER grouping

### Execution Flow
\`\`\`
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
       ↑ filter rows   ↑ filter groups
\`\`\`

### Common Mistake
\`\`\`sql
-- ❌ WRONG: 'name' is not in GROUP BY and not aggregated
SELECT category, name, AVG(price) FROM products GROUP BY category;

-- ✅ CORRECT
SELECT category, AVG(price) AS avg_price FROM products GROUP BY category;
\`\`\`
      `,
      code: `-- ═══ BASIC GROUP BY ═══
-- Average price per category
SELECT 
    category,
    COUNT(*) AS product_count,
    ROUND(AVG(price), 2) AS avg_price,
    MIN(price) AS cheapest,
    MAX(price) AS most_expensive
FROM products
GROUP BY category
ORDER BY avg_price DESC;
-- Result:
-- category    | product_count | avg_price | cheapest | most_expensive
-- Electronics | 5             | 385.99    | 29.99    | 1299.99
-- Furniture   | 3             | 363.32    | 39.99    | 599.99
-- Books       | 2             | 42.99     | 39.99    | 45.99

-- ═══ GROUP BY with JOIN ═══
-- Orders per customer
SELECT 
    c.first_name,
    c.last_name,
    COUNT(o.order_id) AS order_count,
    SUM(o.total_amount) AS total_spent,
    ROUND(AVG(o.total_amount), 2) AS avg_order_value
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name
ORDER BY total_spent DESC NULLS LAST;

-- ═══ GROUP BY Multiple Columns ═══
-- Orders per customer per status
SELECT 
    c.first_name,
    o.status,
    COUNT(*) AS count
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, o.status
ORDER BY c.first_name, o.status;

-- ═══ GROUP BY with Date Parts ═══
-- Orders per month (PostgreSQL)
SELECT 
    EXTRACT(YEAR FROM order_date) AS year,
    EXTRACT(MONTH FROM order_date) AS month,
    COUNT(*) AS order_count,
    SUM(total_amount) AS monthly_revenue
FROM orders
GROUP BY EXTRACT(YEAR FROM order_date), EXTRACT(MONTH FROM order_date)
ORDER BY year, month;
      `,
    },
    {
      id: "having-clause",
      title: "HAVING — Filter Groups",
      content: `
## HAVING vs WHERE — Know the Difference!

| Feature | WHERE | HAVING |
|---------|-------|--------|
| **Filters** | Individual rows | Groups (after GROUP BY) |
| **Runs** | Before GROUP BY | After GROUP BY |
| **Can use aggregates?** | ❌ No | ✅ Yes |
| **Can use columns?** | ✅ Yes | ✅ (if in GROUP BY) |

### The Key Rule
> Use **WHERE** to filter rows before grouping.
> Use **HAVING** to filter groups after aggregation.

### Common Interview Question
"What's the difference between WHERE and HAVING?"
\`\`\`
Answer: WHERE filters individual rows BEFORE they are grouped.
HAVING filters the aggregated results AFTER GROUP BY has run.
You cannot use aggregate functions in WHERE.
\`\`\`
      `,
      code: `-- ═══ HAVING with COUNT ═══
-- Customers with more than 1 order
SELECT 
    c.first_name,
    c.last_name,
    COUNT(o.order_id) AS order_count
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name
HAVING COUNT(o.order_id) > 1
ORDER BY order_count DESC;

-- ═══ HAVING with SUM ═══
-- Categories with total revenue > $500
SELECT 
    p.category,
    SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY p.category
HAVING SUM(oi.quantity * oi.unit_price) > 500;

-- ═══ WHERE + HAVING Together ═══
-- Among delivered orders only, find customers who spent > $500
SELECT 
    c.first_name,
    SUM(o.total_amount) AS total_spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'delivered'           -- Filter ROWS first
GROUP BY c.customer_id, c.first_name
HAVING SUM(o.total_amount) > 500       -- Then filter GROUPS
ORDER BY total_spent DESC;

-- ═══ HAVING with AVG ═══
-- Categories where average product price > $100
SELECT 
    category,
    COUNT(*) AS product_count,
    ROUND(AVG(price), 2) AS avg_price
FROM products
GROUP BY category
HAVING AVG(price) > 100
ORDER BY avg_price DESC;

-- ═══ HAVING with Multiple Conditions ═══
-- Categories with at least 3 products and average price under $400
SELECT 
    category,
    COUNT(*) AS product_count,
    ROUND(AVG(price), 2) AS avg_price
FROM products
GROUP BY category
HAVING COUNT(*) >= 3 AND AVG(price) < 400;
      `,
    },
    {
      id: "rollup-cube",
      title: "ROLLUP & CUBE — Advanced Grouping",
      content: `
## ROLLUP & CUBE — Subtotals and Grand Totals

### ROLLUP
Creates **hierarchical subtotals** from left to right, plus a grand total.
\`\`\`sql
GROUP BY ROLLUP(A, B, C)
-- Produces: (A,B,C), (A,B), (A), ()
\`\`\`

### CUBE
Creates subtotals for **all possible combinations**.
\`\`\`sql
GROUP BY CUBE(A, B)
-- Produces: (A,B), (A), (B), ()
\`\`\`

### GROUPING SETS
Manually specify which grouping combinations you want.

### When to Use
- **ROLLUP**: Hierarchical reports (Year → Quarter → Month)
- **CUBE**: Cross-tabulation reports (Region × Product)
- **GROUPING SETS**: Custom combinations
      `,
      code: `-- ═══ ROLLUP — Hierarchical Subtotals ═══
-- Sales by category with subtotals and grand total
SELECT 
    COALESCE(p.category, '--- GRAND TOTAL ---') AS category,
    COUNT(oi.item_id) AS items_sold,
    SUM(oi.quantity * oi.unit_price) AS revenue
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY ROLLUP(p.category)
ORDER BY category;
-- Result:
-- category         | items_sold | revenue
-- Books            | 0          | 0.00
-- Electronics      | 10         | 5609.85
-- Furniture        | 3          | 1489.97
-- --- GRAND TOTAL ---| 13       | 7099.82    ← Grand total row

-- ═══ Multi-level ROLLUP ═══
-- Revenue by country → city with subtotals
SELECT 
    COALESCE(c.country, 'ALL COUNTRIES') AS country,
    COALESCE(c.city, 'ALL CITIES') AS city,
    COUNT(o.order_id) AS orders,
    SUM(o.total_amount) AS revenue
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY ROLLUP(c.country, c.city)
ORDER BY c.country, c.city;
-- Shows revenue per city, then subtotal per country, then grand total

-- ═══ CUBE — All Combinations ═══
SELECT 
    COALESCE(p.category, 'ALL') AS category,
    COALESCE(o.status, 'ALL') AS status,
    COUNT(*) AS count,
    SUM(oi.quantity * oi.unit_price) AS revenue
FROM order_items oi
JOIN orders o ON oi.order_id = o.order_id
JOIN products p ON oi.product_id = p.product_id
GROUP BY CUBE(p.category, o.status)
ORDER BY category, status;

-- ═══ GROUPING SETS — Custom ═══
SELECT 
    p.category,
    c.country,
    SUM(oi.quantity * oi.unit_price) AS revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN orders o ON oi.order_id = o.order_id
JOIN customers c ON o.customer_id = c.customer_id
GROUP BY GROUPING SETS (
    (p.category),       -- Revenue by category
    (c.country),        -- Revenue by country
    ()                  -- Grand total
);
      `,
    },
    {
      id: "aggregation-practice",
      title: "🏋️ Practice Problems: Aggregations",
      content: `
## Practice Problems — Aggregations & GROUP BY

### Problem 1: Category Stats
Find the number of products, average price, and total stock for each product category.

### Problem 2: Big Spenders
Find customers who have spent more than $500 in total (across all their orders).

### Problem 3: Order Status Summary
Create a summary showing the count and total revenue for each order status.

### Problem 4: Popular Products
Find products that have been ordered more than once (by number of distinct orders).

### Problem 5: City Revenue
Calculate total revenue per customer city, but only show cities with revenue > $200.

### Problem 6: Interview Challenge
*Find the category with the highest average order value. Show the category name and average.*
      `,
      code: `-- ═══ SOLUTION 1: Category Stats ═══
SELECT 
    category,
    COUNT(*) AS product_count,
    ROUND(AVG(price), 2) AS avg_price,
    SUM(stock) AS total_stock
FROM products
GROUP BY category
ORDER BY avg_price DESC;

-- ═══ SOLUTION 2: Big Spenders ═══
SELECT 
    c.first_name,
    c.last_name,
    SUM(o.total_amount) AS total_spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status != 'cancelled'
GROUP BY c.customer_id, c.first_name, c.last_name
HAVING SUM(o.total_amount) > 500
ORDER BY total_spent DESC;

-- ═══ SOLUTION 3: Order Status Summary ═══
SELECT 
    status,
    COUNT(*) AS order_count,
    SUM(total_amount) AS total_revenue,
    ROUND(AVG(total_amount), 2) AS avg_order_value
FROM orders
GROUP BY status
ORDER BY total_revenue DESC;

-- ═══ SOLUTION 4: Popular Products ═══
SELECT 
    p.name,
    COUNT(DISTINCT oi.order_id) AS times_ordered,
    SUM(oi.quantity) AS total_quantity
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY p.product_id, p.name
HAVING COUNT(DISTINCT oi.order_id) > 1
ORDER BY times_ordered DESC;

-- ═══ SOLUTION 5: City Revenue ═══
SELECT 
    c.city,
    c.country,
    SUM(o.total_amount) AS city_revenue,
    COUNT(o.order_id) AS total_orders
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status != 'cancelled'
GROUP BY c.city, c.country
HAVING SUM(o.total_amount) > 200
ORDER BY city_revenue DESC;

-- ═══ SOLUTION 6: Highest Avg Order Value Category ═══
SELECT 
    p.category,
    ROUND(AVG(oi.quantity * oi.unit_price), 2) AS avg_order_value
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
JOIN orders o ON oi.order_id = o.order_id
WHERE o.status != 'cancelled'
GROUP BY p.category
ORDER BY avg_order_value DESC
LIMIT 1;
      `,
    },
  ],
};
