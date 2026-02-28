export const sqlQueriesTopic = {
  id: "sql-select-queries",
  title: "SELECT Queries & Filtering",
  description:
    "Master SELECT, WHERE, ORDER BY, DISTINCT, LIMIT, operators (LIKE, BETWEEN, IN), aliases, and NULL handling.",
  icon: "Search",
  sections: [
    {
      id: "select-basics",
      title: "SELECT Fundamentals",
      content: `
## The SELECT Statement — Reading Data

\`SELECT\` is the most-used SQL command. It retrieves data from one or more tables.

### Basic Syntax
\`\`\`sql
SELECT column1, column2, ...
FROM table_name;
\`\`\`

### Execution Order (Important for Interviews!)
SQL doesn't run top-to-bottom. The actual execution order is:

| Order | Clause | Purpose |
|-------|--------|---------|
| 1 | \`FROM\` | Choose table(s) |
| 2 | \`WHERE\` | Filter rows |
| 3 | \`GROUP BY\` | Group rows |
| 4 | \`HAVING\` | Filter groups |
| 5 | \`SELECT\` | Choose columns |
| 6 | \`DISTINCT\` | Remove duplicates |
| 7 | \`ORDER BY\` | Sort results |
| 8 | \`LIMIT/OFFSET\` | Paginate |

### Why Execution Order Matters
You can't use a column alias from SELECT in WHERE because WHERE runs before SELECT!
\`\`\`sql
-- ❌ WRONG: Alias not available in WHERE
SELECT salary * 12 AS annual_salary FROM employees WHERE annual_salary > 100000;

-- ✅ CORRECT: Repeat the expression or use subquery
SELECT salary * 12 AS annual_salary FROM employees WHERE salary * 12 > 100000;
\`\`\`
      `,
      code: `-- Select all columns
SELECT * FROM customers;

-- Select specific columns
SELECT first_name, last_name, email FROM customers;

-- Select with expressions
SELECT 
    first_name,
    last_name,
    first_name || ' ' || last_name AS full_name  -- Concatenation (PostgreSQL)
    -- CONCAT(first_name, ' ', last_name) AS full_name  -- MySQL/SQL Server
FROM customers;

-- Select with arithmetic
SELECT 
    name,
    price,
    price * 0.9 AS discounted_price,  -- 10% off
    price * 1.18 AS price_with_tax     -- 18% tax
FROM products;

-- ═══ RESULTS ═══
-- name             | price   | discounted_price | price_with_tax
-- Laptop Pro       | 1299.99 | 1169.99          | 1533.99
-- Wireless Mouse   |   29.99 |   26.99          |   35.39
      `,
    },
    {
      id: "where-clause",
      title: "WHERE Clause — Filtering Data",
      content: `
## WHERE — Filter Rows Based on Conditions

The \`WHERE\` clause filters rows BEFORE they are returned.

### Comparison Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| \`=\` | Equal to | \`WHERE city = 'New York'\` |
| \`<>\` or \`!=\` | Not equal to | \`WHERE status <> 'cancelled'\` |
| \`<\`, \`>\` | Less/Greater than | \`WHERE price > 100\` |
| \`<=\`, \`>=\` | Less/Greater or equal | \`WHERE stock >= 50\` |

### Logical Operators

| Operator | Description | Example |
|----------|-------------|---------|
| \`AND\` | Both conditions true | \`WHERE price > 100 AND stock > 0\` |
| \`OR\` | Either condition true | \`WHERE city = 'NYC' OR city = 'LA'\` |
| \`NOT\` | Negate condition | \`WHERE NOT country = 'USA'\` |

### Operator Precedence
\`NOT\` > \`AND\` > \`OR\`

Always use **parentheses** to be explicit!
      `,
      code: `-- Basic comparison
SELECT * FROM products WHERE price > 100;

-- Multiple conditions with AND
SELECT * FROM products 
WHERE category = 'Electronics' AND price < 200 AND stock > 0;

-- OR conditions
SELECT * FROM customers 
WHERE city = 'New York' OR city = 'Los Angeles';

-- NOT operator
SELECT * FROM orders WHERE NOT status = 'cancelled';

-- ⚠️ Common Gotcha: AND/OR precedence
-- This finds: (Electronics AND price > 500) OR (all Furniture)
SELECT * FROM products 
WHERE category = 'Electronics' AND price > 500 
   OR category = 'Furniture';  -- OR binds loosely!

-- This is what you probably meant:
SELECT * FROM products 
WHERE category = 'Electronics' AND (price > 500 OR stock < 30);

-- Combining multiple conditions
SELECT 
    first_name, last_name, city, country
FROM customers
WHERE country = 'USA' 
  AND city IN ('New York', 'Los Angeles')
  AND first_name NOT LIKE 'A%';
      `,
    },
    {
      id: "special-operators",
      title: "BETWEEN, IN, LIKE, IS NULL",
      content: `
## Special Filtering Operators

### BETWEEN — Range Checks
Tests if a value falls within an **inclusive** range.
\`\`\`sql
WHERE column BETWEEN low AND high
-- Equivalent to: WHERE column >= low AND column <= high
\`\`\`

### IN — Set Membership
Tests if a value matches any value in a list.
\`\`\`sql
WHERE column IN (value1, value2, value3)
-- Equivalent to: WHERE column = value1 OR column = value2 OR column = value3
\`\`\`

### LIKE — Pattern Matching
Uses wildcards for fuzzy text matching:
- \`%\` — Matches zero or more characters
- \`_\` — Matches exactly one character

| Pattern | Matches | Doesn't Match |
|---------|---------|---------------|
| \`'A%'\` | Alice, Adam, A | Bob, Charlie |
| \`'%son'\` | Johnson, Wilson | Smith |
| \`'_ob'\` | Bob, Rob | Jacob |
| \`'%an%'\` | Frank, Canada, Anderson | Bob |

### IS NULL / IS NOT NULL
**You cannot use \`=\` to compare with NULL!**
\`\`\`sql
-- ❌ WRONG: WHERE phone = NULL (always false!)
-- ✅ CORRECT: WHERE phone IS NULL
\`\`\`
      `,
      code: `-- ═══ BETWEEN ═══
-- Products priced between $30 and $200
SELECT name, price FROM products 
WHERE price BETWEEN 30.00 AND 200.00;

-- Orders from a date range
SELECT * FROM orders 
WHERE order_date BETWEEN '2025-01-01' AND '2025-12-31';

-- ═══ IN ═══
-- Customers from specific cities
SELECT first_name, city FROM customers 
WHERE city IN ('New York', 'London', 'Berlin', 'Toronto');

-- Orders with specific statuses
SELECT order_id, status FROM orders 
WHERE status IN ('shipped', 'delivered');

-- NOT IN
SELECT * FROM products WHERE category NOT IN ('Books');

-- ═══ LIKE ═══
-- Names starting with 'A'
SELECT * FROM customers WHERE first_name LIKE 'A%';

-- Emails ending with '@email.com'
SELECT * FROM customers WHERE email LIKE '%@email.com';

-- Names with exactly 3 characters
SELECT * FROM customers WHERE first_name LIKE '___';  -- Three underscores

-- Case-insensitive search (PostgreSQL)
SELECT * FROM customers WHERE first_name ILIKE 'alice';

-- ═══ IS NULL / IS NOT NULL ═══
-- Customers without phone numbers
SELECT * FROM customers WHERE phone IS NULL;

-- Customers WITH phone numbers
SELECT * FROM customers WHERE phone IS NOT NULL;

-- ═══ COMBINING OPERATORS ═══
-- Complex real-world filter
SELECT 
    name, category, price, stock
FROM products
WHERE category IN ('Electronics', 'Furniture')
  AND price BETWEEN 50 AND 500
  AND stock IS NOT NULL
  AND name NOT LIKE '%Pro%';
      `,
    },
    {
      id: "order-by-sorting",
      title: "ORDER BY — Sorting Results",
      content: `
## ORDER BY — Sort Your Results

\`ORDER BY\` sorts the result set by one or more columns.

### Syntax
\`\`\`sql
SELECT ... FROM ... 
ORDER BY column1 [ASC|DESC], column2 [ASC|DESC];
\`\`\`

### Key Points
- **ASC** (ascending) is the default — smallest to largest
- **DESC** (descending) — largest to smallest
- Multiple columns: Sort by first column, then ties broken by second column
- **NULLs**: In PostgreSQL, NULLs sort LAST by default in ASC
      `,
      code: `-- Sort alphabetically (ascending is default)
SELECT first_name, last_name FROM customers 
ORDER BY last_name;

-- Sort by price descending (most expensive first)
SELECT name, price FROM products 
ORDER BY price DESC;

-- Multi-column sort
-- First by category, then by price (cheapest first within each category)
SELECT name, category, price FROM products 
ORDER BY category ASC, price ASC;

-- Sort by expression (computed column)
SELECT name, price, price * 1.18 AS price_with_tax
FROM products 
ORDER BY price_with_tax DESC;  -- Sort by alias works in ORDER BY!

-- Sort by column position (not recommended but good to know)
SELECT first_name, last_name, city FROM customers 
ORDER BY 3, 1;  -- Sort by city (3rd column), then first_name (1st)

-- Handling NULLs in sorting
SELECT * FROM customers 
ORDER BY phone ASC NULLS LAST;  -- PostgreSQL specific

-- ═══ PRACTICAL EXAMPLE ═══
-- Get the 5 most expensive products
SELECT name, category, price 
FROM products 
ORDER BY price DESC 
LIMIT 5;
      `,
    },
    {
      id: "distinct-limit-offset",
      title: "DISTINCT, LIMIT & OFFSET",
      content: `
## DISTINCT — Remove Duplicates

\`SELECT DISTINCT\` returns only unique values.

### LIMIT & OFFSET — Pagination
- \`LIMIT n\` — Return only n rows
- \`OFFSET m\` — Skip the first m rows
- Combined for pagination: \`LIMIT pageSize OFFSET (pageNum - 1) * pageSize\`

### Database-Specific Syntax

| Database | Syntax |
|----------|--------|
| PostgreSQL, MySQL, SQLite | \`LIMIT 10 OFFSET 20\` |
| SQL Server | \`OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY\` |
| Oracle | \`FETCH FIRST 10 ROWS ONLY\` (12c+) |
      `,
      code: `-- ═══ DISTINCT ═══
-- Unique cities
SELECT DISTINCT city FROM customers;

-- Unique city + country combinations
SELECT DISTINCT city, country FROM customers;

-- Count distinct values
SELECT COUNT(DISTINCT category) AS unique_categories FROM products;
-- Result: 3 (Electronics, Furniture, Books)

-- ═══ LIMIT ═══
-- First 5 customers
SELECT * FROM customers LIMIT 5;

-- Top 3 most expensive products
SELECT name, price FROM products ORDER BY price DESC LIMIT 3;

-- ═══ OFFSET (Pagination) ═══
-- Page 1 (first 5 results)
SELECT * FROM products ORDER BY product_id LIMIT 5 OFFSET 0;

-- Page 2 (next 5 results)
SELECT * FROM products ORDER BY product_id LIMIT 5 OFFSET 5;

-- Page 3 (next 5 results)
SELECT * FROM products ORDER BY product_id LIMIT 5 OFFSET 10;

-- ═══ PAGINATION FORMULA ═══
-- For page N with page_size items:
-- LIMIT page_size OFFSET (N - 1) * page_size

-- Example: Products page 3, 10 items per page
SELECT * FROM products 
ORDER BY product_id 
LIMIT 10 OFFSET 20;  -- Skip first 20, show next 10

-- SQL Server pagination syntax
-- SELECT * FROM products 
-- ORDER BY product_id 
-- OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;

-- ═══ PRACTICAL EXAMPLE ═══
-- API-style paginated response
SELECT 
    product_id, name, price, category
FROM products 
WHERE category = 'Electronics'
ORDER BY price DESC 
LIMIT 10 OFFSET 0;
      `,
    },
    {
      id: "aliases",
      title: "Column & Table Aliases",
      content: `
## Aliases — Rename Columns and Tables

Aliases give temporary names to columns or tables for readability.

### Column Aliases
\`\`\`sql
SELECT column AS alias_name FROM table;
-- The AS keyword is optional but recommended
\`\`\`

### Table Aliases
Essential when using JOINs to avoid long table names.
\`\`\`sql
SELECT c.first_name, o.order_id
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id;
\`\`\`
      `,
      code: `-- Column aliases for readability
SELECT 
    first_name AS "First Name",   -- Quotes needed for spaces
    last_name AS "Last Name",
    email AS "Email Address",
    city || ', ' || country AS location  -- Alias without AS works too
FROM customers;

-- Computed column aliases
SELECT 
    name AS product_name,
    price AS original_price,
    price * 0.85 AS sale_price,           -- 15% discount
    price - (price * 0.85) AS savings,    -- Amount saved
    ROUND(15.0, 0) || '%' AS discount     -- Discount percentage
FROM products;

-- Table aliases (essential for JOINs)
SELECT 
    c.first_name,
    c.last_name,
    o.order_id,
    o.total_amount
FROM customers AS c       -- c is the alias for customers
JOIN orders AS o           -- o is the alias for orders
  ON c.customer_id = o.customer_id;

-- Self-referencing with aliases (employee-manager)
-- SELECT 
--     e.name AS employee,
--     m.name AS manager
-- FROM employees e
-- LEFT JOIN employees m ON e.manager_id = m.employee_id;
      `,
    },
    {
      id: "practice-problems-select",
      title: "🏋️ Practice Problems: SELECT",
      content: `
## Practice Problems — SELECT & Filtering

Using our **ecommerce** database, try solving these problems before looking at the solutions.

### Problem 1: Basic Retrieval
Get all products sorted by price (cheapest first).

### Problem 2: Filtering
Find all customers from the USA whose first name starts with a vowel.

### Problem 3: Range Query
Find all products priced between $40 and $500.

### Problem 4: Complex Filter
Find all orders that are either 'delivered' or 'shipped' and have a total amount greater than $100.

### Problem 5: Pattern Matching
Find all products whose names contain the word 'Desk' or 'Chair'.

### Problem 6: Pagination
Get the 2nd page of products (3 products per page), sorted by name alphabetically.

### Problem 7: Interview Question
*Write a query to find the top 3 most expensive products in the 'Electronics' category that are in stock (stock > 0).*
      `,
      code: `-- ═══ SOLUTION 1: Basic Retrieval ═══
SELECT name, category, price 
FROM products 
ORDER BY price ASC;

-- ═══ SOLUTION 2: Filtering ═══
SELECT first_name, last_name, city 
FROM customers 
WHERE country = 'USA' 
  AND (first_name LIKE 'A%' OR first_name LIKE 'E%' OR first_name LIKE 'I%' 
       OR first_name LIKE 'O%' OR first_name LIKE 'U%');
-- Result: Alice (New York), Eve... wait, Eve is from UK.
-- So: Alice Johnson (NY), Ivy Taylor (NY)

-- ═══ SOLUTION 3: Range Query ═══
SELECT name, price 
FROM products 
WHERE price BETWEEN 40.00 AND 500.00
ORDER BY price;

-- ═══ SOLUTION 4: Complex Filter ═══
SELECT order_id, customer_id, status, total_amount 
FROM orders 
WHERE status IN ('delivered', 'shipped') 
  AND total_amount > 100
ORDER BY total_amount DESC;

-- ═══ SOLUTION 5: Pattern Matching ═══
SELECT name, category, price 
FROM products 
WHERE name LIKE '%Desk%' OR name LIKE '%Chair%';
-- Result: Standing Desk ($599.99), Office Chair ($449.99)

-- ═══ SOLUTION 6: Pagination ═══
SELECT name, price 
FROM products 
ORDER BY name ASC 
LIMIT 3 OFFSET 3;  -- Page 2, 3 items per page

-- ═══ SOLUTION 7: Interview Question ═══
SELECT name, price, stock 
FROM products 
WHERE category = 'Electronics' 
  AND stock > 0
ORDER BY price DESC 
LIMIT 3;
-- Result:
-- Laptop Pro     | 1299.99 | 50
-- Monitor 27"    |  399.99 | 30
-- Mech. Keyboard |  149.99 | 75
      `,
    },
  ],
};
