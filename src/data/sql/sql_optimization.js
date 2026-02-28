export const sqlOptimizationTopic = {
  id: "sql-optimization",
  title: "Indexing & Query Optimization",
  description:
    "Indexes (clustered/non-clustered), EXPLAIN plans, query tuning, normalization (1NF-BCNF), and denormalization.",
  icon: "Zap",
  sections: [
    {
      id: "indexing-basics",
      title: "Indexes — Speed Up Queries",
      content: `
## Indexes — The #1 Performance Tool

An **index** is a data structure (usually B-Tree) that speeds up data retrieval. Think of it like a book's index — instead of reading every page, you look up the keyword.

### Without Index vs With Index

| Query | Without Index | With Index |
|-------|--------------|------------|
| \`WHERE email = '...'\` | O(n) full table scan | O(log n) index lookup |
| 1M rows lookup | ~500ms | ~1ms |

### Index Types

| Type | Description | Use Case |
|------|-------------|----------|
| **B-Tree** | Default, balanced tree | Most queries: =, <, >, BETWEEN |
| **Hash** | Equality only | Exact match lookups |
| **GIN** | Generalized Inverted | Arrays, JSONB, full-text search |
| **GiST** | Generalized Search Tree | Geometric/geographic data |
| **BRIN** | Block Range | Large, naturally ordered tables |

### Clustered vs Non-Clustered

| Feature | Clustered | Non-Clustered |
|---------|-----------|---------------|
| Data order | Physically sorts data | Separate structure with pointers |
| Per table | Only ONE | Multiple allowed |
| Speed | Fastest for range queries | Good for point lookups |
| Example | Primary Key (usually) | Indexes on other columns |

### When to Create Indexes
✅ Columns in WHERE clauses
✅ Columns in JOIN conditions
✅ Columns in ORDER BY
✅ High-cardinality columns (many unique values)
❌ Small tables (< 1000 rows)
❌ Columns that change frequently (high write cost)
❌ Low-cardinality columns (few unique values like boolean)
      `,
      code: `-- ═══ CREATE INDEX ═══
-- Simple B-Tree index
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Composite (multi-column) index
CREATE INDEX idx_products_category_price ON products(category, price);
-- This helps: WHERE category = 'X' AND price > 100
-- Also helps: WHERE category = 'X'  (leftmost column)
-- Does NOT help: WHERE price > 100  (skips leftmost column)

-- Unique index
CREATE UNIQUE INDEX idx_customers_email_unique ON customers(email);

-- Partial index (index only certain rows)
CREATE INDEX idx_active_orders ON orders(customer_id) 
WHERE status != 'cancelled';
-- Smaller index, only for active orders

-- Expression index
CREATE INDEX idx_customers_lower_email ON customers(LOWER(email));
-- Helps: WHERE LOWER(email) = 'alice@email.com'

-- Covering index (includes extra columns)
CREATE INDEX idx_products_cat_price_name ON products(category, price) INCLUDE (name);
-- Index-only scan: no need to access the table at all

-- ═══ DROP INDEX ═══
DROP INDEX IF EXISTS idx_customers_email;

-- ═══ CHECK EXISTING INDEXES ═══
-- PostgreSQL: See all indexes on a table
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'customers';
      `,
    },
    {
      id: "explain-plan",
      title: "EXPLAIN — Understanding Query Plans",
      content: `
## EXPLAIN — See How the Database Runs Your Query

\`EXPLAIN\` shows the **execution plan** — how the database will execute your query.

### Reading an EXPLAIN Plan

| Node Type | Meaning | Performance |
|-----------|---------|-------------|
| **Seq Scan** | Full table scan | ❌ Slow for large tables |
| **Index Scan** | Use index to find rows | ✅ Fast |
| **Index Only Scan** | Read from index alone | ✅✅ Fastest |
| **Bitmap Index Scan** | Index → bitmap → table | ✅ Good for multiple conditions |
| **Nested Loop** | Loop through inner for each outer | OK for small datasets |
| **Hash Join** | Build hash table, probe | ✅ Good for large joins |
| **Merge Join** | Merge two sorted sets | ✅ Best for sorted data |
| **Sort** | Sort intermediate results | ⚠️ Check if needed |

### Key Metrics
- **cost**: Estimated relative cost (lower is better)
- **rows**: Estimated number of rows
- **actual time**: Real execution time (with EXPLAIN ANALYZE)
- **buffers**: Disk/memory reads (with EXPLAIN BUFFERS)
      `,
      code: `-- ═══ BASIC EXPLAIN ═══
EXPLAIN SELECT * FROM products WHERE category = 'Electronics';
-- Shows estimated plan without running the query

-- ═══ EXPLAIN ANALYZE ═══ (Actually runs the query!)
EXPLAIN ANALYZE SELECT * FROM products WHERE category = 'Electronics';
-- Shows actual execution time & real row counts

-- ═══ EXPLAIN with more detail ═══
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT c.first_name, o.total_amount
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'delivered';

-- ═══ BEFORE vs AFTER Adding Index ═══
-- Before: Seq Scan on orders (cost=0.00..15.00 rows=3)
EXPLAIN ANALYZE SELECT * FROM orders WHERE status = 'delivered';

-- Add index
CREATE INDEX idx_orders_status ON orders(status);

-- After: Index Scan using idx_orders_status (cost=0.00..8.00 rows=3)
EXPLAIN ANALYZE SELECT * FROM orders WHERE status = 'delivered';

-- ═══ IDENTIFY SLOW QUERIES ═══
-- PostgreSQL: Find the slowest queries
-- SELECT query, calls, total_time, mean_time
-- FROM pg_stat_statements
-- ORDER BY mean_time DESC
-- LIMIT 10;
      `,
    },
    {
      id: "query-tuning",
      title: "Query Optimization Techniques",
      content: `
## Query Optimization — Write Faster SQL

### Top 10 Query Optimization Tips

1. **SELECT only needed columns** (never \`SELECT *\` in production)
2. **Use indexes** on WHERE, JOIN, ORDER BY columns
3. **Avoid functions on indexed columns** (breaks index usage)
4. **Use EXISTS instead of IN** for large subqueries
5. **Limit result sets** with WHERE and LIMIT
6. **Avoid SELECT DISTINCT** unless necessary
7. **Use JOINs instead of subqueries** where possible
8. **Batch operations** instead of row-by-row
9. **Partition large tables** by date/region
10. **Use connection pooling** in applications
      `,
      code: `-- ═══ ANTI-PATTERNS & FIXES ═══

-- ❌ BAD: SELECT * (fetches unnecessary data)
SELECT * FROM customers;
-- ✅ GOOD: Select only needed columns
SELECT first_name, email FROM customers;

-- ❌ BAD: Function on indexed column (can't use index)
SELECT * FROM customers WHERE UPPER(email) = 'ALICE@EMAIL.COM';
-- ✅ GOOD: Use expression index or transform the value
SELECT * FROM customers WHERE email = LOWER('ALICE@EMAIL.COM');

-- ❌ BAD: OR on different columns (hard to index)
SELECT * FROM products WHERE name LIKE '%Pro%' OR category = 'Books';
-- ✅ GOOD: Use UNION for different index paths
SELECT * FROM products WHERE name LIKE '%Pro%'
UNION
SELECT * FROM products WHERE category = 'Books';

-- ❌ BAD: Correlated subquery (runs N times)
SELECT c.first_name, 
    (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.customer_id) AS order_count
FROM customers c;
-- ✅ GOOD: Use JOIN with aggregation (runs once)
SELECT c.first_name, COUNT(o.order_id) AS order_count
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name;

-- ❌ BAD: NOT IN with NULLs (unexpected results!)
SELECT * FROM customers WHERE customer_id NOT IN (SELECT customer_id FROM orders);
-- If orders has NULL customer_id, this returns NO rows!
-- ✅ GOOD: Use NOT EXISTS or LEFT JOIN
SELECT c.* FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;

-- ═══ PAGINATION: Offset vs Cursor ═══
-- ❌ SLOW for large offsets (scans 10000 rows then discards 9990)
SELECT * FROM products ORDER BY product_id LIMIT 10 OFFSET 9990;

-- ✅ FAST: Cursor-based pagination
SELECT * FROM products 
WHERE product_id > 9990  -- Use the last seen ID
ORDER BY product_id 
LIMIT 10;
      `,
    },
    {
      id: "normalization",
      title: "Normalization & Denormalization",
      content: `
## Normalization — Organizing Data

**Normalization** is the process of organizing tables to reduce data redundancy and improve integrity.

### Normal Forms

| Form | Rule | Example Violation |
|------|------|-------------------|
| **1NF** | No repeating groups, atomic values | \`skills = "Java, Python"\` |
| **2NF** | 1NF + No partial dependencies | Non-key column depends on part of composite key |
| **3NF** | 2NF + No transitive dependencies | Column depends on another non-key column |
| **BCNF** | Every determinant is a candidate key | Rare edge cases beyond 3NF |

### Denormalization
Intentionally adding redundancy for **read performance**.

| Normalization | Denormalization |
|---------------|-----------------|
| Less redundancy | More redundancy |
| Better write perf | Better read perf |
| More JOINs needed | Fewer JOINs |
| Harder to have anomalies | Possible data inconsistency |
| OLTP (transactions) | OLAP (analytics) |

### Interview Answer
> "Normalize for correctness, denormalize for performance."
> Start with 3NF, then denormalize specific tables only when you have proven performance bottlenecks.
      `,
      code: `-- ═══ 1NF VIOLATION & FIX ═══
-- ❌ BAD: Comma-separated values (not atomic)
-- CREATE TABLE users (
--     id INT, name TEXT, skills TEXT  -- 'Java, Python, Go'
-- );

-- ✅ GOOD: Separate table
-- CREATE TABLE users (id INT, name TEXT);
-- CREATE TABLE user_skills (user_id INT, skill VARCHAR(50));
-- INSERT INTO user_skills VALUES (1, 'Java'), (1, 'Python'), (1, 'Go');

-- ═══ DENORMALIZATION EXAMPLE ═══
-- Normalized (3NF): Requires JOINs for every query
-- SELECT c.name, SUM(oi.quantity * oi.unit_price)
-- FROM customers c
-- JOIN orders o ...
-- JOIN order_items oi ...
-- (This is slow with millions of rows)

-- Denormalized: Add redundant column for fast reads
-- ALTER TABLE orders ADD COLUMN customer_name VARCHAR(100);
-- UPDATE orders o SET customer_name = (
--     SELECT first_name || ' ' || last_name 
--     FROM customers c 
--     WHERE c.customer_id = o.customer_id
-- );
-- Now: SELECT customer_name, total_amount FROM orders;  -- No JOIN!

-- ═══ TABLE PARTITIONING (Production) ═══
-- Partition orders by year for faster queries
-- CREATE TABLE orders (
--     order_id SERIAL,
--     customer_id INT,
--     order_date TIMESTAMP,
--     total_amount DECIMAL(12,2)
-- ) PARTITION BY RANGE (order_date);
-- 
-- CREATE TABLE orders_2024 PARTITION OF orders
--     FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
-- CREATE TABLE orders_2025 PARTITION OF orders
--     FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
      `,
    },
  ],
};
