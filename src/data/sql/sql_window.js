export const sqlWindowTopic = {
  id: "sql-window-functions",
  title: "Window Functions",
  description:
    "ROW_NUMBER, RANK, DENSE_RANK, NTILE, LAG, LEAD, FIRST_VALUE, LAST_VALUE, and frame clauses.",
  icon: "BarChart3",
  sections: [
    {
      id: "window-intro",
      title: "Window Functions — Overview",
      content: `
## Window Functions — Aggregates Without Losing Rows

Window functions perform calculations across a **set of rows** related to the current row, WITHOUT collapsing rows like GROUP BY.

### Key Difference: GROUP BY vs Window Functions
\`\`\`
GROUP BY:  10 rows → 3 groups → 3 result rows
Window:    10 rows → still 10 rows, but with aggregated info added
\`\`\`

### Syntax
\`\`\`sql
function_name() OVER (
    [PARTITION BY column]   -- Optional: split into groups
    [ORDER BY column]       -- Optional: order within partition
    [frame_clause]          -- Optional: define row range
)
\`\`\`

### Window Function Categories

| Category | Functions | Purpose |
|----------|-----------|---------|
| **Ranking** | ROW_NUMBER, RANK, DENSE_RANK, NTILE | Assign positions |
| **Value** | LAG, LEAD, FIRST_VALUE, LAST_VALUE, NTH_VALUE | Access other rows |
| **Aggregate** | SUM, AVG, COUNT, MIN, MAX | Running calculations |
      `,
      code: `-- ═══ Window vs GROUP BY comparison ═══

-- GROUP BY: Collapses rows
SELECT category, AVG(price) AS avg_price
FROM products GROUP BY category;
-- Result: 3 rows (one per category)

-- WINDOW: Keeps all rows, adds aggregate column
SELECT 
    name,
    category,
    price,
    AVG(price) OVER (PARTITION BY category) AS category_avg,
    price - AVG(price) OVER (PARTITION BY category) AS diff_from_avg
FROM products;
-- Result: 10 rows (all products), each with its category average!
      `,
    },
    {
      id: "ranking-functions",
      title: "Ranking: ROW_NUMBER, RANK, DENSE_RANK",
      content: `
## Ranking Functions — Assign Positions

### The Three Ranking Functions

| Scores → | ROW_NUMBER | RANK | DENSE_RANK |
|-----------|-----------|------|------------|
| 100 | 1 | 1 | 1 |
| 95 | 2 | 2 | 2 |
| 95 | 3 | 2 | 2 |
| 90 | 4 | **4** | **3** |
| 85 | 5 | 5 | 4 |

- **ROW_NUMBER**: Always unique, no gaps (1,2,3,4,5)
- **RANK**: Ties get same rank, then **skips** (1,2,2,4,5)
- **DENSE_RANK**: Ties get same rank, **no gaps** (1,2,2,3,4)

### When to Use Each
- **ROW_NUMBER**: Pagination, de-duplication (pick 1 per group)
- **RANK**: Competitive ranking (sports, leaderboards)
- **DENSE_RANK**: Dense ranking, Nth highest queries
      `,
      code: `-- ═══ BASIC RANKING ═══
SELECT 
    name,
    category,
    price,
    ROW_NUMBER() OVER (ORDER BY price DESC) AS row_num,
    RANK() OVER (ORDER BY price DESC) AS rank,
    DENSE_RANK() OVER (ORDER BY price DESC) AS dense_rank
FROM products;

-- ═══ RANKING WITHIN PARTITIONS ═══
-- Rank products within each category by price
SELECT 
    name,
    category,
    price,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rank_in_category
FROM products;
-- Result shows: Electronics #1: Laptop Pro, #2: Monitor, ...
--               Furniture #1: Standing Desk, #2: Office Chair, ...

-- ═══ TOP N PER GROUP — The Most Common Pattern ═══
-- Get the 2 most expensive products per category
WITH ranked AS (
    SELECT 
        name, category, price,
        ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rn
    FROM products
)
SELECT name, category, price
FROM ranked
WHERE rn <= 2;

-- ═══ DE-DUPLICATION ═══
-- Keep only the latest order per customer
WITH ranked_orders AS (
    SELECT 
        *,
        ROW_NUMBER() OVER (
            PARTITION BY customer_id 
            ORDER BY order_date DESC
        ) AS rn
    FROM orders
)
SELECT * FROM ranked_orders WHERE rn = 1;

-- ═══ NTH HIGHEST / LOWEST ═══
-- Find the 3rd highest priced product
WITH ranked AS (
    SELECT name, price, DENSE_RANK() OVER (ORDER BY price DESC) AS dr
    FROM products
)
SELECT * FROM ranked WHERE dr = 3;

-- ═══ NTILE — Divide Into Buckets ═══
-- Split products into 4 equal price tiers
SELECT 
    name,
    price,
    NTILE(4) OVER (ORDER BY price) AS price_quartile
FROM products;
-- Quartile 1: cheapest 25%, Quartile 4: most expensive 25%
      `,
    },
    {
      id: "lag-lead",
      title: "LAG & LEAD — Access Previous/Next Rows",
      content: `
## LAG & LEAD — Look Backward & Forward

- **LAG(col, n)**: Value from **n rows before** current row
- **LEAD(col, n)**: Value from **n rows after** current row
- Default offset is 1 (previous/next row)

### Common Uses
- Compare current value with previous (month-over-month growth)
- Calculate differences between consecutive rows
- Find gaps in sequences
      `,
      code: `-- ═══ BASIC LAG / LEAD ═══
SELECT 
    name,
    price,
    LAG(price) OVER (ORDER BY price) AS prev_price,
    LEAD(price) OVER (ORDER BY price) AS next_price,
    price - LAG(price) OVER (ORDER BY price) AS diff_from_prev
FROM products
ORDER BY price;

-- ═══ MONTH-OVER-MONTH REVENUE GROWTH ═══
WITH monthly_revenue AS (
    SELECT 
        TO_CHAR(order_date, 'YYYY-MM') AS month,
        SUM(total_amount) AS revenue
    FROM orders
    WHERE status != 'cancelled'
    GROUP BY TO_CHAR(order_date, 'YYYY-MM')
)
SELECT 
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) AS prev_month_revenue,
    revenue - LAG(revenue) OVER (ORDER BY month) AS growth,
    ROUND(
        (revenue - LAG(revenue) OVER (ORDER BY month)) * 100.0 / 
        NULLIF(LAG(revenue) OVER (ORDER BY month), 0),
        1
    ) AS growth_pct
FROM monthly_revenue;

-- ═══ FINDING GAPS IN DATA ═══
-- Find days with no orders
WITH order_dates AS (
    SELECT DISTINCT DATE(order_date) AS dt FROM orders ORDER BY dt
)
SELECT 
    dt AS order_date,
    LAG(dt) OVER (ORDER BY dt) AS prev_order_date,
    dt - LAG(dt) OVER (ORDER BY dt) AS days_gap
FROM order_dates
HAVING dt - LAG(dt) OVER (ORDER BY dt) > 1;

-- ═══ CUSTOMER ORDER FREQUENCY ═══
SELECT 
    c.first_name,
    o.order_date,
    LAG(o.order_date) OVER (
        PARTITION BY c.customer_id ORDER BY o.order_date
    ) AS previous_order,
    o.order_date - LAG(o.order_date) OVER (
        PARTITION BY c.customer_id ORDER BY o.order_date
    ) AS days_between_orders
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
ORDER BY c.first_name, o.order_date;
      `,
    },
    {
      id: "running-aggregates",
      title: "Running Totals & Moving Averages",
      content: `
## Window Aggregate Functions — Running Calculations

Use SUM, AVG, COUNT, etc. as window functions for running totals and moving averages.

### Frame Clauses (Control the Window Scope)
\`\`\`sql
ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW     -- Running total (default)
ROWS BETWEEN 2 PRECEDING AND CURRENT ROW              -- 3-row moving average
ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING       -- Remaining total
ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING -- Grand total
\`\`\`
      `,
      code: `-- ═══ RUNNING TOTAL ═══
SELECT 
    order_id,
    customer_id,
    total_amount,
    SUM(total_amount) OVER (ORDER BY order_date) AS running_total,
    COUNT(*) OVER (ORDER BY order_date) AS cumulative_orders
FROM orders
WHERE status != 'cancelled'
ORDER BY order_date;

-- ═══ RUNNING TOTAL PER CUSTOMER ═══
SELECT 
    c.first_name,
    o.order_id,
    o.total_amount,
    SUM(o.total_amount) OVER (
        PARTITION BY c.customer_id 
        ORDER BY o.order_date
    ) AS customer_running_total
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
ORDER BY c.first_name, o.order_date;

-- ═══ 3-ROW MOVING AVERAGE ═══
SELECT 
    name,
    price,
    ROUND(AVG(price) OVER (
        ORDER BY price
        ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
    ), 2) AS moving_avg_3
FROM products;

-- ═══ PERCENTAGE OF TOTAL ═══
SELECT 
    name,
    category,
    price,
    SUM(price) OVER () AS total_all,
    ROUND(price * 100.0 / SUM(price) OVER (), 1) AS pct_of_total,
    SUM(price) OVER (PARTITION BY category) AS category_total,
    ROUND(price * 100.0 / SUM(price) OVER (PARTITION BY category), 1) AS pct_of_category
FROM products
ORDER BY category, price DESC;

-- ═══ CUMULATIVE DISTRIBUTION ═══
SELECT 
    name,
    price,
    ROUND(CUME_DIST() OVER (ORDER BY price), 3) AS cumulative_dist,
    ROUND(PERCENT_RANK() OVER (ORDER BY price), 3) AS percent_rank
FROM products;
      `,
    },
    {
      id: "window-practice",
      title: "🏋️ Practice Problems: Window Functions",
      content: `
## Practice Problems — Window Functions

### Problem 1: Product Ranking
Rank all products by price within their category. Show name, category, price, and rank.

### Problem 2: Top 1 Per Category
Find the most expensive product in each category using ROW_NUMBER.

### Problem 3: Running Revenue
Calculate the running total of revenue across all orders, sorted by date.

### Problem 4: Previous Order Comparison
For each order, show the previous order's amount and the difference.

### Problem 5: Quartile Analysis
Divide products into 4 price quartiles and show the average price per quartile.

### Problem 6: Interview Challenge
*Write a query to find the Nth highest salary (e.g., 2nd highest) without using LIMIT. This must work even if there are duplicate salaries.*
      `,
      code: `-- ═══ SOLUTION 1: Product Ranking ═══
SELECT 
    name,
    category,
    price,
    DENSE_RANK() OVER (PARTITION BY category ORDER BY price DESC) AS price_rank
FROM products
ORDER BY category, price_rank;

-- ═══ SOLUTION 2: Top 1 Per Category ═══
WITH ranked AS (
    SELECT 
        name, category, price,
        ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rn
    FROM products
)
SELECT name, category, price FROM ranked WHERE rn = 1;

-- ═══ SOLUTION 3: Running Revenue ═══
SELECT 
    order_id,
    order_date,
    total_amount,
    SUM(total_amount) OVER (ORDER BY order_date) AS running_revenue
FROM orders
WHERE status != 'cancelled'
ORDER BY order_date;

-- ═══ SOLUTION 4: Previous Order Comparison ═══
SELECT 
    order_id,
    order_date,
    total_amount,
    LAG(total_amount) OVER (ORDER BY order_date) AS prev_amount,
    total_amount - LAG(total_amount) OVER (ORDER BY order_date) AS diff
FROM orders
ORDER BY order_date;

-- ═══ SOLUTION 5: Quartile Analysis ═══
WITH quartiled AS (
    SELECT 
        name, price,
        NTILE(4) OVER (ORDER BY price) AS quartile
    FROM products
)
SELECT 
    quartile,
    COUNT(*) AS product_count,
    ROUND(AVG(price), 2) AS avg_price,
    MIN(price) AS min_price,
    MAX(price) AS max_price
FROM quartiled
GROUP BY quartile
ORDER BY quartile;

-- ═══ SOLUTION 6: Nth Highest Salary ═══
-- Find 2nd highest product price
WITH ranked AS (
    SELECT 
        name, price,
        DENSE_RANK() OVER (ORDER BY price DESC) AS dr
    FROM products
)
SELECT name, price
FROM ranked
WHERE dr = 2;  -- Change to N for Nth highest
-- Using DENSE_RANK handles duplicates correctly!
      `,
    },
  ],
};
