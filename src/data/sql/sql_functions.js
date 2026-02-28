export const sqlFunctionsTopic = {
  id: "sql-functions",
  title: "SQL Built-in Functions",
  description:
    "String, date/time, math functions, CASE WHEN, COALESCE, CAST, and conditional logic.",
  icon: "Wrench",
  sections: [
    {
      id: "string-functions",
      title: "String Functions",
      content: `
## String Functions — Text Manipulation

| Function | Description | Example | Result |
|----------|-------------|---------|--------|
| \`UPPER(s)\` | Uppercase | \`UPPER('hello')\` | \`HELLO\` |
| \`LOWER(s)\` | Lowercase | \`LOWER('Hello')\` | \`hello\` |
| \`LENGTH(s)\` / \`LEN(s)\` | String length | \`LENGTH('abc')\` | \`3\` |
| \`TRIM(s)\` | Remove whitespace | \`TRIM('  hi  ')\` | \`hi\` |
| \`SUBSTRING(s, start, len)\` | Extract part | \`SUBSTRING('Hello', 1, 3)\` | \`Hel\` |
| \`REPLACE(s, from, to)\` | Replace text | \`REPLACE('abc', 'b', 'x')\` | \`axc\` |
| \`CONCAT(a, b)\` | Concatenate | \`CONCAT('Hi', ' ', 'there')\` | \`Hi there\` |
| \`LEFT(s, n)\` | First n chars | \`LEFT('Hello', 3)\` | \`Hel\` |
| \`RIGHT(s, n)\` | Last n chars | \`RIGHT('Hello', 3)\` | \`llo\` |
| \`POSITION(sub IN s)\` | Find position | \`POSITION('l' IN 'Hello')\` | \`3\` |
| \`REVERSE(s)\` | Reverse string | \`REVERSE('abc')\` | \`cba\` |
| \`LPAD(s, len, fill)\` | Pad left | \`LPAD('5', 3, '0')\` | \`005\` |
      `,
      code: `-- ═══ STRING MANIPULATION ═══
SELECT 
    first_name,
    UPPER(first_name) AS upper_name,
    LOWER(last_name) AS lower_name,
    LENGTH(email) AS email_length,
    first_name || ' ' || last_name AS full_name,    -- PostgreSQL concatenation
    -- CONCAT(first_name, ' ', last_name) AS full_name,  -- MySQL/SQL Server
    SUBSTRING(email FROM 1 FOR POSITION('@' IN email) - 1) AS email_username,
    REPLACE(email, '@email.com', '@company.com') AS new_email
FROM customers;

-- ═══ PRACTICAL EXAMPLES ═══
-- Format phone numbers
SELECT 
    first_name,
    phone,
    '(' || SUBSTRING(phone, 1, 3) || ') ' || 
    SUBSTRING(phone, 5, 3) || '-' || SUBSTRING(phone, 9, 4) AS formatted_phone
FROM customers
WHERE phone IS NOT NULL;

-- Extract domain from email
SELECT 
    email,
    SUBSTRING(email FROM POSITION('@' IN email) + 1) AS domain
FROM customers;

-- Capitalize first letter only (Title Case)
SELECT 
    UPPER(SUBSTRING(first_name, 1, 1)) || LOWER(SUBSTRING(first_name, 2)) AS title_case
FROM customers;

-- Generate initials
SELECT 
    LEFT(first_name, 1) || LEFT(last_name, 1) AS initials,
    first_name || ' ' || last_name AS full_name
FROM customers;

-- Search with pattern
SELECT * FROM products 
WHERE LOWER(name) LIKE '%' || LOWER('desk') || '%';
      `,
    },
    {
      id: "date-functions",
      title: "Date & Time Functions",
      content: `
## Date & Time Functions

### Key Differences by Database

| Operation | PostgreSQL | MySQL | SQL Server |
|-----------|-----------|-------|------------|
| Current date | \`CURRENT_DATE\` | \`CURDATE()\` | \`GETDATE()\` |
| Current timestamp | \`NOW()\` | \`NOW()\` | \`GETDATE()\` |
| Extract part | \`EXTRACT(YEAR FROM d)\` | \`YEAR(d)\` | \`DATEPART(yy, d)\` |
| Date diff | \`d1 - d2\` | \`DATEDIFF(d1, d2)\` | \`DATEDIFF(day, d1, d2)\` |
| Add interval | \`d + INTERVAL '1 day'\` | \`DATE_ADD(d, INTERVAL 1 DAY)\` | \`DATEADD(day, 1, d)\` |
| Format | \`TO_CHAR(d, 'YYYY-MM-DD')\` | \`DATE_FORMAT(d, '%Y-%m-%d')\` | \`FORMAT(d, 'yyyy-MM-dd')\` |
      `,
      code: `-- ═══ CURRENT DATE/TIME ═══
SELECT 
    CURRENT_DATE AS today,
    CURRENT_TIME AS time_now,
    NOW() AS right_now,
    CURRENT_TIMESTAMP AS timestamp_now;

-- ═══ EXTRACT PARTS ═══
SELECT 
    order_date,
    EXTRACT(YEAR FROM order_date) AS year,
    EXTRACT(MONTH FROM order_date) AS month,
    EXTRACT(DAY FROM order_date) AS day,
    EXTRACT(DOW FROM order_date) AS day_of_week,  -- 0=Sunday
    EXTRACT(QUARTER FROM order_date) AS quarter
FROM orders;

-- ═══ DATE ARITHMETIC ═══
SELECT 
    order_date,
    order_date + INTERVAL '7 days' AS plus_7_days,
    order_date - INTERVAL '1 month' AS minus_1_month,
    NOW() - order_date AS time_since_order,
    EXTRACT(DAY FROM NOW() - order_date) AS days_since_order
FROM orders;

-- ═══ DATE FORMATTING ═══
-- PostgreSQL
SELECT 
    TO_CHAR(order_date, 'DD Mon YYYY') AS formatted,    -- 15 Jan 2025
    TO_CHAR(order_date, 'Day, DD Month YYYY') AS long_format,
    TO_CHAR(order_date, 'YYYY-MM-DD HH24:MI:SS') AS iso_format
FROM orders;

-- ═══ PRACTICAL DATE QUERIES ═══
-- Orders from last 30 days
SELECT * FROM orders 
WHERE order_date >= NOW() - INTERVAL '30 days';

-- Orders this month
SELECT * FROM orders 
WHERE EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM NOW())
  AND EXTRACT(MONTH FROM order_date) = EXTRACT(MONTH FROM NOW());

-- Monthly revenue report
SELECT 
    TO_CHAR(order_date, 'YYYY-MM') AS month,
    COUNT(*) AS orders,
    SUM(total_amount) AS revenue
FROM orders
WHERE status != 'cancelled'
GROUP BY TO_CHAR(order_date, 'YYYY-MM')
ORDER BY month;

-- Age calculation
-- SELECT 
--     name,
--     birth_date,
--     AGE(NOW(), birth_date) AS age,
--     EXTRACT(YEAR FROM AGE(NOW(), birth_date)) AS years_old
-- FROM employees;
      `,
    },
    {
      id: "math-functions",
      title: "Math & Numeric Functions",
      content: `
## Math Functions

| Function | Description | Example | Result |
|----------|-------------|---------|--------|
| \`ROUND(n, d)\` | Round to d decimals | \`ROUND(3.14159, 2)\` | \`3.14\` |
| \`CEIL(n)\` / \`CEILING(n)\` | Round up | \`CEIL(3.1)\` | \`4\` |
| \`FLOOR(n)\` | Round down | \`FLOOR(3.9)\` | \`3\` |
| \`ABS(n)\` | Absolute value | \`ABS(-5)\` | \`5\` |
| \`MOD(n, d)\` | Remainder | \`MOD(10, 3)\` | \`1\` |
| \`POWER(n, p)\` | Exponentiation | \`POWER(2, 3)\` | \`8\` |
| \`SQRT(n)\` | Square root | \`SQRT(16)\` | \`4\` |
| \`SIGN(n)\` | Sign (-1, 0, 1) | \`SIGN(-5)\` | \`-1\` |
| \`RANDOM()\` | Random 0-1 | \`RANDOM()\` | \`0.73...\` |
      `,
      code: `-- ═══ ROUNDING ═══
SELECT 
    name,
    price,
    ROUND(price, 0) AS rounded,
    CEIL(price) AS ceiling,
    FLOOR(price) AS floor,
    ROUND(price * 1.18, 2) AS with_tax
FROM products;

-- ═══ MATH IN BUSINESS LOGIC ═══
-- Calculate profit margins
SELECT 
    name,
    price AS selling_price,
    ROUND(price * 0.6, 2) AS cost_estimate,  -- Assume 40% margin
    ROUND(price * 0.4, 2) AS profit,
    ROUND(40.0, 1) || '%' AS margin_pct
FROM products;

-- ═══ RANDOM SELECTION ═══
-- Pick 3 random products
SELECT name, price FROM products ORDER BY RANDOM() LIMIT 3;

-- ═══ PERCENTAGE CALCULATIONS ═══
SELECT 
    category,
    COUNT(*) AS count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM products), 1) AS percentage
FROM products
GROUP BY category;
      `,
    },
    {
      id: "case-coalesce",
      title: "CASE WHEN & COALESCE",
      content: `
## CASE WHEN — SQL's IF/ELSE

The \`CASE\` expression adds conditional logic to queries. It's one of the most powerful SQL features.

### Two Forms
1. **Simple CASE**: Compare one expression to multiple values
2. **Searched CASE**: Evaluate multiple independent conditions

## COALESCE — Handle NULLs
Returns the first non-NULL value from a list of arguments.
\`\`\`sql
COALESCE(value1, value2, value3, 'default')
\`\`\`
      `,
      code: `-- ═══ SIMPLE CASE ═══
SELECT 
    name, category,
    CASE category
        WHEN 'Electronics' THEN '🔌 Tech'
        WHEN 'Furniture' THEN '🪑 Home'
        WHEN 'Books' THEN '📚 Reading'
        ELSE '❓ Other'
    END AS category_emoji
FROM products;

-- ═══ SEARCHED CASE ═══
SELECT 
    name, price,
    CASE 
        WHEN price >= 1000 THEN 'Premium'
        WHEN price >= 200  THEN 'Mid-Range'
        WHEN price >= 50   THEN 'Budget'
        ELSE 'Affordable'
    END AS price_tier
FROM products
ORDER BY price DESC;

-- ═══ CASE in Aggregation (Pivot-like) ═══
SELECT 
    COUNT(*) AS total_orders,
    SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered,
    SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END) AS shipped,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled
FROM orders;

-- ═══ CASE in ORDER BY ═══
-- Custom sort order
SELECT * FROM orders
ORDER BY CASE status
    WHEN 'pending' THEN 1
    WHEN 'processing' THEN 2
    WHEN 'shipped' THEN 3
    WHEN 'delivered' THEN 4
    WHEN 'cancelled' THEN 5
END;

-- ═══ COALESCE ═══
SELECT 
    first_name,
    COALESCE(phone, 'No phone') AS phone,
    COALESCE(city, country, 'Unknown') AS location
FROM customers;

-- ═══ NULLIF ═══
-- Returns NULL if two values are equal (prevent division by zero)
SELECT 
    name,
    price,
    stock,
    ROUND(price / NULLIF(stock, 0), 2) AS price_per_unit
FROM products;
-- NULLIF(stock, 0) returns NULL if stock is 0, preventing divide-by-zero

-- ═══ CAST / CONVERT ═══
SELECT 
    CAST(price AS INTEGER) AS rounded_price,
    CAST(123 AS VARCHAR) AS text_number,
    price::TEXT AS pg_cast   -- PostgreSQL shorthand
FROM products;
      `,
    },
  ],
};
