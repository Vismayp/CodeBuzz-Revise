export const sqlInterviewTopic = {
  id: "sql-interview",
  title: "🎯 SQL Interview Problems",
  description:
    "Production-grade interview challenges: Nth salary, duplicates, running totals, pivots, hierarchies, and real-world scenarios.",
  icon: "Target",
  sections: [
    {
      id: "nth-highest-salary",
      title: "Nth Highest Salary",
      content: `
## Classic Interview Problem: Find the Nth Highest Salary

This is asked in almost every SQL interview. Know multiple approaches!

### Problem
Find the employee with the **2nd (or Nth) highest salary**.

### Approaches
1. **DENSE_RANK** window function (best)
2. **Subquery with LIMIT/OFFSET**
3. **Correlated subquery with COUNT**
      `,
      code: `-- Setup: Employees table for interview problems
-- CREATE TABLE emp (
--     emp_id SERIAL PRIMARY KEY,
--     name VARCHAR(50),
--     department VARCHAR(50),
--     salary DECIMAL(10,2),
--     manager_id INT REFERENCES emp(emp_id),
--     hire_date DATE
-- );
-- INSERT INTO emp (name, department, salary, manager_id, hire_date) VALUES
-- ('Alice', 'Engineering', 120000, NULL, '2020-01-15'),
-- ('Bob', 'Engineering', 110000, 1, '2020-03-01'),
-- ('Carol', 'Engineering', 110000, 1, '2020-06-15'),
-- ('David', 'Sales', 95000, NULL, '2019-09-01'),
-- ('Eve', 'Sales', 85000, 4, '2021-01-10'),
-- ('Frank', 'Sales', 85000, 4, '2021-02-20'),
-- ('Grace', 'HR', 100000, NULL, '2018-05-01'),
-- ('Henry', 'HR', 78000, 7, '2022-01-01');

-- ═══ APPROACH 1: DENSE_RANK (Best) ═══
-- Handles duplicates correctly
WITH ranked AS (
    SELECT name, salary,
        DENSE_RANK() OVER (ORDER BY salary DESC) AS rank
    FROM emp
)
SELECT name, salary FROM ranked WHERE rank = 2;
-- Returns: Bob (110000) and Carol (110000) — both are 2nd highest

-- ═══ APPROACH 2: LIMIT OFFSET ═══
-- Simple but doesn't handle ties
SELECT DISTINCT salary FROM emp ORDER BY salary DESC LIMIT 1 OFFSET 1;
-- For Nth: OFFSET N-1

-- ═══ APPROACH 3: Subquery ═══
-- Generic Nth highest without window functions
SELECT name, salary FROM emp e1
WHERE (SELECT COUNT(DISTINCT salary) FROM emp e2 WHERE e2.salary > e1.salary) = 1;
-- For Nth: = N-1

-- ═══ Nth Highest Per Department ═══
WITH dept_ranked AS (
    SELECT name, department, salary,
        DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rank
    FROM emp
)
SELECT name, department, salary 
FROM dept_ranked WHERE rank = 2;
      `,
    },
    {
      id: "find-duplicates",
      title: "Finding & Removing Duplicates",
      content: `
## Finding and Removing Duplicate Records

### Problem
Find duplicate emails, then remove duplicates while keeping the first occurrence.
      `,
      code: `-- ═══ FIND DUPLICATES ═══
-- Find duplicate emails
SELECT email, COUNT(*) AS count
FROM customers
GROUP BY email
HAVING COUNT(*) > 1;

-- Show all duplicate rows with details
SELECT * FROM customers
WHERE email IN (
    SELECT email FROM customers GROUP BY email HAVING COUNT(*) > 1
)
ORDER BY email;

-- ═══ FIND DUPLICATES WITH ROW_NUMBER ═══
WITH dups AS (
    SELECT *,
        ROW_NUMBER() OVER (PARTITION BY email ORDER BY customer_id) AS rn
    FROM customers
)
SELECT * FROM dups WHERE rn > 1;  -- These are duplicates

-- ═══ DELETE DUPLICATES (Keep first occurrence) ═══
-- Method 1: Using CTE + ROW_NUMBER
WITH dups AS (
    SELECT customer_id,
        ROW_NUMBER() OVER (PARTITION BY email ORDER BY customer_id) AS rn
    FROM customers
)
DELETE FROM customers
WHERE customer_id IN (SELECT customer_id FROM dups WHERE rn > 1);

-- Method 2: Self-join
DELETE FROM customers c1
USING customers c2
WHERE c1.email = c2.email 
  AND c1.customer_id > c2.customer_id;  -- Keep the one with lower ID

-- Method 3: NOT IN with MIN
DELETE FROM customers
WHERE customer_id NOT IN (
    SELECT MIN(customer_id) FROM customers GROUP BY email
);
      `,
    },
    {
      id: "running-totals-gaps",
      title: "Running Totals & Gap Analysis",
      content: `
## Running Totals, Cumulative Sums & Gap Detection

### Running Total
Calculate cumulative sum as you go through ordered rows.

### Gap Detection
Find missing values or gaps in sequences (e.g., missing dates, IDs).
      `,
      code: `-- ═══ RUNNING TOTAL ═══
SELECT 
    order_id,
    order_date,
    total_amount,
    SUM(total_amount) OVER (ORDER BY order_date) AS running_total,
    ROUND(
        SUM(total_amount) OVER (ORDER BY order_date) * 100.0 / 
        SUM(total_amount) OVER (), 
    1) AS cumulative_pct
FROM orders
WHERE status != 'cancelled'
ORDER BY order_date;

-- ═══ RUNNING TOTAL PER CUSTOMER ═══
SELECT 
    c.first_name,
    o.order_date,
    o.total_amount,
    SUM(o.total_amount) OVER (
        PARTITION BY c.customer_id 
        ORDER BY o.order_date
        ROWS UNBOUNDED PRECEDING
    ) AS customer_running_total
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
ORDER BY c.first_name, o.order_date;

-- ═══ FIND CONSECUTIVE STREAKS ═══
-- Find customers with consecutive months of orders
-- WITH monthly_orders AS (
--     SELECT 
--         customer_id,
--         DATE_TRUNC('month', order_date) AS order_month,
--         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY DATE_TRUNC('month', order_date)) AS rn
--     FROM orders
--     GROUP BY customer_id, DATE_TRUNC('month', order_date)
-- ),
-- streaks AS (
--     SELECT 
--         customer_id,
--         order_month,
--         order_month - (rn * INTERVAL '1 month') AS streak_group
--     FROM monthly_orders
-- )
-- SELECT 
--     customer_id,
--     MIN(order_month) AS streak_start,
--     MAX(order_month) AS streak_end,
--     COUNT(*) AS streak_length
-- FROM streaks
-- GROUP BY customer_id, streak_group
-- HAVING COUNT(*) >= 3  -- At least 3 consecutive months
-- ORDER BY streak_length DESC;

-- ═══ YEAR-OVER-YEAR COMPARISON ═══
WITH yearly AS (
    SELECT 
        EXTRACT(YEAR FROM order_date) AS year,
        SUM(total_amount) AS revenue
    FROM orders WHERE status != 'cancelled'
    GROUP BY EXTRACT(YEAR FROM order_date)
)
SELECT 
    year,
    revenue,
    LAG(revenue) OVER (ORDER BY year) AS prev_year,
    revenue - LAG(revenue) OVER (ORDER BY year) AS growth,
    ROUND(
        (revenue - LAG(revenue) OVER (ORDER BY year)) * 100.0 /
        NULLIF(LAG(revenue) OVER (ORDER BY year), 0),
    1) AS growth_pct
FROM yearly;
      `,
    },
    {
      id: "pivot-unpivot",
      title: "Pivot & Unpivot",
      content: `
## Pivot — Transform Rows to Columns

Convert row-based data into a cross-tabulation report.

### Technique: CASE WHEN + GROUP BY
Since not all databases support PIVOT, use this universal approach.
      `,
      code: `-- ═══ PIVOT: Orders per status per customer ═══
SELECT 
    c.first_name,
    COUNT(CASE WHEN o.status = 'delivered' THEN 1 END) AS delivered,
    COUNT(CASE WHEN o.status = 'shipped' THEN 1 END) AS shipped,
    COUNT(CASE WHEN o.status = 'pending' THEN 1 END) AS pending,
    COUNT(CASE WHEN o.status = 'cancelled' THEN 1 END) AS cancelled,
    COUNT(*) AS total
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name
ORDER BY total DESC;

-- ═══ PIVOT: Revenue by category by month ═══
SELECT 
    TO_CHAR(o.order_date, 'YYYY-MM') AS month,
    COALESCE(SUM(CASE WHEN p.category = 'Electronics' THEN oi.quantity * oi.unit_price END), 0) AS electronics,
    COALESCE(SUM(CASE WHEN p.category = 'Furniture' THEN oi.quantity * oi.unit_price END), 0) AS furniture,
    COALESCE(SUM(CASE WHEN p.category = 'Books' THEN oi.quantity * oi.unit_price END), 0) AS books,
    SUM(oi.quantity * oi.unit_price) AS total
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
GROUP BY TO_CHAR(o.order_date, 'YYYY-MM')
ORDER BY month;

-- ═══ SQL Server PIVOT Syntax ═══
-- SELECT * FROM (
--     SELECT customer_name, status, total_amount
--     FROM orders_view
-- ) AS src
-- PIVOT (
--     SUM(total_amount) FOR status IN ([delivered], [shipped], [pending], [cancelled])
-- ) AS pvt;

-- ═══ UNPIVOT Example ═══
-- Convert columns back to rows (useful for ELT)
-- SELECT product_id, attribute, value
-- FROM products
-- UNPIVOT (value FOR attribute IN (name, category, price));
      `,
    },
    {
      id: "employee-hierarchy",
      title: "Employee-Manager Hierarchy",
      content: `
## Hierarchical Queries — Another Interview Favorite

Common questions:
1. Find all employees under a specific manager
2. Show the full org tree
3. Calculate total salary per manager (including indirect reports)
      `,
      code: `-- ═══ FIND DIRECT REPORTS ═══
SELECT 
    e.name AS employee,
    m.name AS manager
FROM emp e
LEFT JOIN emp m ON e.manager_id = m.emp_id
ORDER BY m.name NULLS FIRST, e.name;

-- ═══ FULL ORG TREE WITH RECURSIVE CTE ═══
WITH RECURSIVE org_tree AS (
    -- Base: Start with top-level managers (no manager)
    SELECT emp_id, name, manager_id, salary, 
           0 AS level, 
           name AS path
    FROM emp WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Recursive: Find reports
    SELECT e.emp_id, e.name, e.manager_id, e.salary,
           ot.level + 1,
           ot.path || ' → ' || e.name
    FROM emp e
    JOIN org_tree ot ON e.manager_id = ot.emp_id
)
SELECT 
    REPEAT('  ', level) || name AS org_chart,
    level,
    salary,
    path
FROM org_tree
ORDER BY path;

-- ═══ TOTAL TEAM SALARY (Including Indirect Reports) ═══
WITH RECURSIVE team AS (
    SELECT emp_id, name, salary, emp_id AS root_manager
    FROM emp WHERE manager_id IS NULL
    
    UNION ALL
    
    SELECT e.emp_id, e.name, e.salary, t.root_manager
    FROM emp e
    JOIN team t ON e.manager_id = t.emp_id
)
SELECT 
    root_manager,
    (SELECT name FROM emp WHERE emp_id = root_manager) AS manager_name,
    COUNT(*) - 1 AS team_size,  -- Exclude self
    SUM(salary) AS total_team_salary
FROM team
GROUP BY root_manager;

-- ═══ FIND ALL SUBORDINATES OF A SPECIFIC MANAGER ═══
WITH RECURSIVE subordinates AS (
    SELECT emp_id, name, manager_id
    FROM emp WHERE emp_id = 1  -- Alice's team
    
    UNION ALL
    
    SELECT e.emp_id, e.name, e.manager_id
    FROM emp e
    JOIN subordinates s ON e.manager_id = s.emp_id
)
SELECT * FROM subordinates WHERE emp_id != 1;  -- Exclude Alice herself
      `,
    },
    {
      id: "real-world-scenarios",
      title: "🏢 Real-World Interview Scenarios",
      content: `
## Production-Grade SQL Scenarios

These are the types of queries you'll encounter in FAANG interviews and real production systems.

### Scenario 1: E-Commerce Dashboard
Build a complete dashboard query showing KPIs.

### Scenario 2: Customer Churn Analysis
Identify customers who haven't ordered in 30+ days.

### Scenario 3: Product Recommendation
Find products frequently bought together.

### Scenario 4: Revenue Attribution
Calculate revenue contribution per product category with percentages.
      `,
      code: `-- ═══ SCENARIO 1: E-Commerce Dashboard KPIs ═══
WITH metrics AS (
    SELECT 
        COUNT(DISTINCT c.customer_id) AS total_customers,
        COUNT(DISTINCT CASE WHEN o.order_id IS NOT NULL THEN c.customer_id END) AS buying_customers,
        COUNT(o.order_id) AS total_orders,
        COALESCE(SUM(o.total_amount), 0) AS total_revenue,
        COALESCE(ROUND(AVG(o.total_amount), 2), 0) AS avg_order_value,
        COUNT(DISTINCT p.product_id) AS products_sold
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.status != 'cancelled'
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.product_id
)
SELECT 
    total_customers,
    buying_customers,
    ROUND(buying_customers * 100.0 / NULLIF(total_customers, 0), 1) AS conversion_rate,
    total_orders,
    total_revenue,
    avg_order_value,
    products_sold
FROM metrics;

-- ═══ SCENARIO 2: Customer Retention / Churn ═══
WITH customer_activity AS (
    SELECT 
        c.customer_id,
        c.first_name || ' ' || c.last_name AS customer,
        MAX(o.order_date) AS last_order_date,
        COUNT(o.order_id) AS total_orders,
        NOW() - MAX(o.order_date) AS days_since_last_order
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.status != 'cancelled'
    GROUP BY c.customer_id, c.first_name, c.last_name
)
SELECT 
    customer,
    total_orders,
    last_order_date,
    CASE 
        WHEN last_order_date IS NULL THEN 'Never Ordered'
        WHEN days_since_last_order < INTERVAL '30 days' THEN 'Active'
        WHEN days_since_last_order < INTERVAL '90 days' THEN 'At Risk'
        ELSE 'Churned'
    END AS status
FROM customer_activity
ORDER BY last_order_date NULLS LAST;

-- ═══ SCENARIO 3: Products Bought Together ═══
-- "Customers who bought X also bought Y"
SELECT 
    p1.name AS product_1,
    p2.name AS product_2,
    COUNT(*) AS times_bought_together
FROM order_items oi1
JOIN order_items oi2 ON oi1.order_id = oi2.order_id 
    AND oi1.product_id < oi2.product_id
JOIN products p1 ON oi1.product_id = p1.product_id
JOIN products p2 ON oi2.product_id = p2.product_id
GROUP BY p1.name, p2.name
ORDER BY times_bought_together DESC
LIMIT 10;

-- ═══ SCENARIO 4: Revenue Attribution ═══
WITH category_revenue AS (
    SELECT 
        p.category,
        SUM(oi.quantity * oi.unit_price) AS revenue
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    JOIN orders o ON oi.order_id = o.order_id
    WHERE o.status != 'cancelled'
    GROUP BY p.category
)
SELECT 
    category,
    revenue,
    SUM(revenue) OVER () AS total_revenue,
    ROUND(revenue * 100.0 / SUM(revenue) OVER (), 1) AS pct,
    REPEAT('█', CAST(ROUND(revenue * 50.0 / SUM(revenue) OVER ()) AS INT)) AS bar_chart
FROM category_revenue
ORDER BY revenue DESC;

-- ═══ BONUS: Moving 7-Day Average Revenue ═══
-- WITH daily_revenue AS (
--     SELECT DATE(order_date) AS day, SUM(total_amount) AS revenue
--     FROM orders WHERE status != 'cancelled'
--     GROUP BY DATE(order_date)
-- )
-- SELECT 
--     day,
--     revenue,
--     ROUND(AVG(revenue) OVER (
--         ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
--     ), 2) AS avg_7_day
-- FROM daily_revenue
-- ORDER BY day;
      `,
    },
  ],
};
