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

---

### Normal Forms — Quick Reference

| Form | Rule | Example Violation |
|------|------|-------------------|
| **1NF** | No repeating groups, atomic values | \`skills = "Java, Python"\` |
| **2NF** | 1NF + No partial dependencies | Non-key column depends on part of composite key |
| **3NF** | 2NF + No transitive dependencies | Column depends on another non-key column |
| **BCNF** | Every determinant is a candidate key | Rare edge cases beyond 3NF |

---

### 🧪 Step-by-Step Example — Employee Projects

We'll use **one messy table** and clean it up step by step through each normal form.

---

#### 🔴 Unnormalized Table (UNF)

| emp_id | emp_name | dept | dept_head | project_ids      | project_names             |
|--------|----------|------|-----------|------------------|---------------------------|
| 1      | Alice    | IT   | Bob       | 101, 102         | CRM, Analytics            |
| 2      | Charlie  | HR   | Diana     | 103              | Onboarding                |

**Problems:**
- \`project_ids\` and \`project_names\` store multiple values in one column (not atomic)
- Repeating groups make querying and updating very hard

---

#### ✅ 1NF — First Normal Form
**Rule:** Each cell must hold **one atomic value**. No repeating groups.

**Fix:** Split multi-value columns into separate rows.

| emp_id | emp_name | dept | dept_head | project_id | project_name |
|--------|----------|------|-----------|------------|--------------|
| 1      | Alice    | IT   | Bob       | 101        | CRM          |
| 1      | Alice    | IT   | Bob       | 102        | Analytics    |
| 2      | Charlie  | HR   | Diana     | 103        | Onboarding   |

**Primary Key:** \`(emp_id, project_id)\` — composite key

✅ No multi-value cells  
❌ Still has partial dependency: \`emp_name\`, \`dept\` depend only on \`emp_id\`, not the full composite key

---

#### ✅ 2NF — Second Normal Form
**Rule:** 1NF + Every **non-key column must depend on the WHOLE primary key** (not just part of it).

**Problem (Partial Dependency):** In our 1NF table, \`emp_name\` and \`dept\` only depend on \`emp_id\`, not \`(emp_id, project_id)\`. \`project_name\` depends only on \`project_id\`.

**Fix:** Split into separate tables — one for employees, one for projects, one for the relationship.

**employees** table:
| emp_id | emp_name | dept | dept_head |
|--------|----------|------|-----------|
| 1      | Alice    | IT   | Bob       |
| 2      | Charlie  | HR   | Diana     |

**projects** table:
| project_id | project_name |
|------------|--------------|
| 101        | CRM          |
| 102        | Analytics    |
| 103        | Onboarding   |

**emp_projects** (junction):
| emp_id | project_id |
|--------|------------|
| 1      | 101        |
| 1      | 102        |
| 2      | 103        |

✅ No partial dependencies  
❌ Still has transitive dependency: \`dept_head\` depends on \`dept\`, not directly on \`emp_id\`

---

#### ✅ 3NF — Third Normal Form
**Rule:** 2NF + No **transitive dependencies** (non-key column depending on another non-key column).

**Problem (Transitive Dependency):** \`dept_head\` depends on \`dept\`, and \`dept\` depends on \`emp_id\`. So \`dept_head\` transitively depends on \`emp_id\` via \`dept\`.

\`emp_id → dept → dept_head\`

**Fix:** Move \`dept_head\` to a departments table.

**employees** table:
| emp_id | emp_name | dept_id |
|--------|----------|---------|
| 1      | Alice    | D1      |
| 2      | Charlie  | D2      |

**departments** table:
| dept_id | dept_name | dept_head |
|---------|-----------|-----------|
| D1      | IT        | Bob       |
| D2      | HR        | Diana     |

✅ No transitive dependencies  
✅ Suitable for most production databases (OLTP)

---

#### ✅ BCNF — Boyce-Codd Normal Form
**Rule:** Every **determinant must be a candidate key**. Stronger version of 3NF.

**Example (BCNF Violation):** Suppose a course can be taught by multiple professors, and a professor teaches only one subject.

| student | subject | professor |
|---------|---------|-----------|
| Alice   | Math    | Dr. Smith |
| Bob     | Math    | Dr. Jones |
| Alice   | Physics | Dr. Brown |

- Composite key: \`(student, subject)\`
- But \`professor → subject\` (professor determines subject, yet professor is not a key!)

**Fix:** Split to remove the non-key determinant.

**professor_subjects**:
| professor  | subject |
|------------|---------|
| Dr. Smith  | Math    |
| Dr. Jones  | Math    |
| Dr. Brown  | Physics |

**student_professors**:
| student | professor  |
|---------|------------|
| Alice   | Dr. Smith  |
| Bob     | Dr. Jones  |
| Alice   | Dr. Brown  |

> 💡 BCNF violations are rare. Most 3NF tables are already in BCNF.

---

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
      code: `-- ════════════════════════════════════════════
-- NORMALIZATION — Full SQL Walkthrough
-- ════════════════════════════════════════════

-- ═══ UNF — Unnormalized (BAD) ═══
-- ❌ Multi-value columns — can't query or index efficiently
CREATE TABLE emp_projects_bad (
  emp_id       INT,
  emp_name     VARCHAR(100),
  dept         VARCHAR(50),
  dept_head    VARCHAR(100),
  project_ids  TEXT,   -- '101, 102'  ← violates atomicity
  project_names TEXT   -- 'CRM, Analytics' ← violates atomicity
);

-- ═══ 1NF FIX — One value per cell ═══
-- ✅ Explode multi-values into separate rows
CREATE TABLE emp_projects_1nf (
  emp_id       INT,
  emp_name     VARCHAR(100),
  dept         VARCHAR(50),
  dept_head    VARCHAR(100),
  project_id   INT,           -- atomic
  project_name VARCHAR(100),  -- atomic
  PRIMARY KEY (emp_id, project_id)  -- composite key
);
INSERT INTO emp_projects_1nf VALUES
  (1, 'Alice',   'IT', 'Bob',   101, 'CRM'),
  (1, 'Alice',   'IT', 'Bob',   102, 'Analytics'),
  (2, 'Charlie', 'HR', 'Diana', 103, 'Onboarding');
-- ❌ Problem: emp_name/dept depend on emp_id ONLY (partial dependency)
-- ❌ Problem: project_name depends on project_id ONLY (partial dependency)

-- ═══ 2NF FIX — Remove partial dependencies ═══
-- ✅ Split columns that depend on only PART of the composite key

CREATE TABLE employees (        -- columns that depend on emp_id only
  emp_id    INT PRIMARY KEY,
  emp_name  VARCHAR(100),
  dept      VARCHAR(50),
  dept_head VARCHAR(100)
);
CREATE TABLE projects (         -- columns that depend on project_id only
  project_id   INT PRIMARY KEY,
  project_name VARCHAR(100)
);
CREATE TABLE emp_projects (     -- junction table: only the relationship
  emp_id     INT REFERENCES employees(emp_id),
  project_id INT REFERENCES projects(project_id),
  PRIMARY KEY (emp_id, project_id)
);

INSERT INTO employees VALUES (1, 'Alice', 'IT', 'Bob'), (2, 'Charlie', 'HR', 'Diana');
INSERT INTO projects VALUES (101, 'CRM'), (102, 'Analytics'), (103, 'Onboarding');
INSERT INTO emp_projects VALUES (1, 101), (1, 102), (2, 103);
-- ❌ Problem: dept_head depends on dept (not on emp_id directly) — transitive dependency

-- ═══ 3NF FIX — Remove transitive dependencies ═══
-- ✅ emp_id → dept → dept_head   (transitive chain, fix it!)

CREATE TABLE departments (
  dept_id    CHAR(2) PRIMARY KEY,
  dept_name  VARCHAR(50),
  dept_head  VARCHAR(100)   -- now lives here, not in employees
);
ALTER TABLE employees
  DROP COLUMN dept,
  DROP COLUMN dept_head,
  ADD COLUMN dept_id CHAR(2) REFERENCES departments(dept_id);

INSERT INTO departments VALUES ('D1', 'IT', 'Bob'), ('D2', 'HR', 'Diana');
UPDATE employees SET dept_id = 'D1' WHERE emp_id = 1;
UPDATE employees SET dept_id = 'D2' WHERE emp_id = 2;
-- ✅ No partial deps, no transitive deps — ready for OLTP production!

-- ═══ BCNF FIX — Every determinant must be a candidate key ═══
-- ❌ Violation: professor → subject, but professor is NOT a key
-- CREATE TABLE student_course (student, subject, professor)  -- BCNF violation

-- ✅ Fix: Separate the functional dependency
CREATE TABLE professor_subjects (
  professor VARCHAR(100) PRIMARY KEY,  -- professor IS the key here
  subject   VARCHAR(100)
);
CREATE TABLE student_professors (
  student   VARCHAR(100),
  professor VARCHAR(100) REFERENCES professor_subjects(professor),
  PRIMARY KEY (student, professor)
);

-- ════════════════════════════════════════════
-- DENORMALIZATION EXAMPLE (for read perf)
-- ════════════════════════════════════════════
-- ✅ Add redundant column to avoid a JOIN on hot read path
ALTER TABLE emp_projects ADD COLUMN project_name_cache VARCHAR(100);
UPDATE ep
SET project_name_cache = p.project_name
FROM emp_projects ep
JOIN projects p ON ep.project_id = p.project_id;
-- Now: SELECT emp_id, project_name_cache FROM emp_projects;  -- No JOIN!

-- ═══ TABLE PARTITIONING (Production) ═══
-- Partition orders by year for faster queries
-- CREATE TABLE orders (
--     order_id SERIAL, customer_id INT,
--     order_date TIMESTAMP, total_amount DECIMAL(12,2)
-- ) PARTITION BY RANGE (order_date);
-- CREATE TABLE orders_2024 PARTITION OF orders
--     FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
-- CREATE TABLE orders_2025 PARTITION OF orders
--     FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
      `,
    },
  ],
};
