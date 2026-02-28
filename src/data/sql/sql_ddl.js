export const sqlDdlTopic = {
  id: "sql-ddl",
  title: "DDL — Tables & Constraints",
  description:
    "CREATE, ALTER, DROP, TRUNCATE, and constraints: PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, DEFAULT.",
  icon: "Table",
  sections: [
    {
      id: "create-table",
      title: "CREATE TABLE",
      content: `
## CREATE TABLE — Define Your Schema

\`CREATE TABLE\` defines a new table with columns, data types, and constraints.

### Best Practices
1. Use **singular** table names (\`user\` vs \`users\` — convention varies, be consistent)
2. Use **snake_case** for column names
3. Always define a **PRIMARY KEY**
4. Add **NOT NULL** where data is required
5. Use **appropriate data types** (don't use VARCHAR for dates)
6. Add **indexes** on frequently queried columns
      `,
      code: `-- ═══ BASIC CREATE TABLE ═══
CREATE TABLE departments (
    department_id   SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL UNIQUE,
    budget          DECIMAL(15, 2) DEFAULT 0,
    location        VARCHAR(100),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ═══ TABLE WITH ALL CONSTRAINT TYPES ═══
CREATE TABLE employees (
    employee_id   SERIAL PRIMARY KEY,
    first_name    VARCHAR(50) NOT NULL,
    last_name     VARCHAR(50) NOT NULL,
    email         VARCHAR(100) UNIQUE NOT NULL,
    phone         VARCHAR(20),
    hire_date     DATE NOT NULL DEFAULT CURRENT_DATE,
    salary        DECIMAL(10, 2) NOT NULL CHECK (salary > 0),
    department_id INT REFERENCES departments(department_id) ON DELETE SET NULL,
    manager_id    INT REFERENCES employees(employee_id),  -- Self-reference
    status        VARCHAR(20) DEFAULT 'active' 
                  CHECK (status IN ('active', 'on_leave', 'terminated')),
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW()
);

-- ═══ JUNCTION TABLE (Many-to-Many) ═══
CREATE TABLE project_assignments (
    employee_id   INT NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
    project_id    INT NOT NULL,
    role          VARCHAR(50) DEFAULT 'member',
    assigned_at   TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (employee_id, project_id)  -- Composite primary key
);

-- ═══ CREATE TABLE AS (from query) ═══
-- Create a table from the results of a query
CREATE TABLE high_value_customers AS
SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    SUM(o.total_amount) AS lifetime_value
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name
HAVING SUM(o.total_amount) > 500;

-- ═══ CREATE TABLE IF NOT EXISTS ═══
CREATE TABLE IF NOT EXISTS audit_log (
    log_id      SERIAL PRIMARY KEY,
    table_name  VARCHAR(50),
    action      VARCHAR(10),
    old_data    JSONB,
    new_data    JSONB,
    changed_by  VARCHAR(50),
    changed_at  TIMESTAMP DEFAULT NOW()
);
      `,
    },
    {
      id: "constraints-deep-dive",
      title: "Constraints Deep Dive",
      content: `
## Constraints — Data Integrity Rules

Constraints enforce rules on data to maintain accuracy and reliability.

### Constraint Types

| Constraint | Purpose | Level |
|------------|---------|-------|
| **PRIMARY KEY** | Unique identifier for each row | Column/Table |
| **FOREIGN KEY** | Referential integrity between tables | Column/Table |
| **UNIQUE** | No duplicate values allowed | Column/Table |
| **NOT NULL** | Value cannot be NULL | Column |
| **CHECK** | Value must satisfy a condition | Column/Table |
| **DEFAULT** | Automatic value if not specified | Column |

### Foreign Key Actions

| Action | On DELETE | On UPDATE |
|--------|-----------|-----------|
| \`CASCADE\` | Delete related rows | Update related rows |
| \`SET NULL\` | Set FK to NULL | Set FK to NULL |
| \`SET DEFAULT\` | Set FK to default | Set FK to default |
| \`RESTRICT\` | Block delete if referenced | Block update if referenced |
| \`NO ACTION\` | Same as RESTRICT (default) | Same as RESTRICT |

### Interview Question
> "What's the difference between RESTRICT and CASCADE on DELETE?"
> - **RESTRICT**: Prevents deletion if child rows exist (safe)
> - **CASCADE**: Automatically deletes all child rows (dangerous but useful)
      `,
      code: `-- ═══ PRIMARY KEY ═══
-- Single column PK (most common)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL
);

-- Composite PK (multiple columns)
CREATE TABLE enrollment (
    student_id INT,
    course_id INT,
    enrolled_at TIMESTAMP DEFAULT NOW(),
    grade CHAR(2),
    PRIMARY KEY (student_id, course_id)
);

-- ═══ FOREIGN KEY with actions ═══
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT,
    content TEXT NOT NULL,
    
    -- If post is deleted, delete all its comments
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    
    -- If user is deleted, keep comments but set user to NULL
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- ═══ CHECK CONSTRAINTS ═══
CREATE TABLE products_v2 (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) CHECK (price > 0),
    discount DECIMAL(5,2) CHECK (discount BETWEEN 0 AND 100),
    
    -- Table-level CHECK (references multiple columns)
    start_date DATE,
    end_date DATE,
    CHECK (end_date > start_date)
);

-- Named constraints (easier to debug errors)
CREATE TABLE inventory (
    item_id SERIAL PRIMARY KEY,
    quantity INT CONSTRAINT positive_qty CHECK (quantity >= 0),
    min_stock INT CONSTRAINT positive_min CHECK (min_stock >= 0),
    CONSTRAINT min_less_than_qty CHECK (min_stock <= quantity)
);

-- ═══ DEFAULT VALUES ═══
CREATE TABLE settings (
    setting_id SERIAL PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL,
    value TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    priority INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
      `,
    },
    {
      id: "alter-table",
      title: "ALTER TABLE — Modify Structure",
      content: `
## ALTER TABLE — Change Existing Tables

\`ALTER TABLE\` modifies an existing table's structure without losing data.

### Common Operations
- Add/Remove columns
- Add/Remove constraints
- Rename columns or tables
- Change data types
      `,
      code: `-- ═══ ADD COLUMN ═══
ALTER TABLE customers ADD COLUMN loyalty_points INT DEFAULT 0;
ALTER TABLE customers ADD COLUMN membership_tier VARCHAR(20) DEFAULT 'bronze';

-- ═══ DROP COLUMN ═══
ALTER TABLE customers DROP COLUMN IF EXISTS loyalty_points;

-- ═══ RENAME COLUMN ═══
ALTER TABLE customers RENAME COLUMN membership_tier TO tier;

-- ═══ CHANGE DATA TYPE ═══
ALTER TABLE products ALTER COLUMN name TYPE VARCHAR(200);  -- PostgreSQL
-- ALTER TABLE products MODIFY COLUMN name VARCHAR(200);   -- MySQL

-- ═══ ADD CONSTRAINT ═══
ALTER TABLE products ADD CONSTRAINT price_positive CHECK (price > 0);
ALTER TABLE customers ADD CONSTRAINT unique_email UNIQUE (email);

-- Add Foreign Key to existing table
ALTER TABLE orders 
ADD CONSTRAINT fk_customer 
FOREIGN KEY (customer_id) REFERENCES customers(customer_id);

-- ═══ DROP CONSTRAINT ═══
ALTER TABLE products DROP CONSTRAINT IF EXISTS price_positive;

-- ═══ SET / DROP NOT NULL ═══
ALTER TABLE customers ALTER COLUMN phone SET NOT NULL;  -- Make required
ALTER TABLE customers ALTER COLUMN phone DROP NOT NULL;  -- Make optional

-- ═══ SET DEFAULT ═══
ALTER TABLE customers ALTER COLUMN country SET DEFAULT 'USA';

-- ═══ RENAME TABLE ═══
ALTER TABLE customers RENAME TO clients;  -- PostgreSQL
-- RENAME TABLE customers TO clients;     -- MySQL

-- ═══ PRACTICAL MIGRATION EXAMPLE ═══
-- Adding a new feature: user preferences
-- Step 1: Add column with default
ALTER TABLE customers ADD COLUMN preferences JSONB DEFAULT '{}';

-- Step 2: Backfill existing data
-- UPDATE customers SET preferences = '{"newsletter": true, "theme": "dark"}';

-- Step 3: Add constraint after data is clean
-- ALTER TABLE customers ADD CONSTRAINT valid_prefs CHECK (preferences IS NOT NULL);
      `,
    },
    {
      id: "drop-truncate",
      title: "DROP vs TRUNCATE vs DELETE",
      content: `
## DROP vs TRUNCATE vs DELETE — Know the Difference!

### Comparison Table

| Feature | DELETE | TRUNCATE | DROP |
|---------|--------|----------|------|
| **Type** | DML | DDL | DDL |
| **Removes** | Specific rows | All rows | Entire table |
| **WHERE clause?** | ✅ Yes | ❌ No | ❌ No |
| **Rollback?** | ✅ Yes | ⚠️ DB-dependent | ❌ No |
| **Triggers fire?** | ✅ Yes | ❌ No | ❌ No |
| **Resets auto-increment?** | ❌ No | ✅ Yes | N/A |
| **Foreign Keys?** | Respects FKs | Fails if FK exists | CASCADE option |
| **Speed** | Slow (row by row) | Fast (deallocate pages) | Fast |
| **Logs** | Full logging | Minimal logging | Minimal |

### Interview Gold
> "When would you use TRUNCATE over DELETE?"
> - TRUNCATE is much faster for removing ALL rows (doesn't log each row)
> - TRUNCATE resets auto-increment counters
> - Use DELETE when you need WHERE clause, triggers, or rollback
      `,
      code: `-- ═══ DELETE — Remove specific rows ═══
-- Delete cancelled orders
DELETE FROM orders WHERE status = 'cancelled';

-- Delete with subquery
DELETE FROM order_items
WHERE order_id IN (
    SELECT order_id FROM orders WHERE status = 'cancelled'
);

-- Delete with JOIN (PostgreSQL)
DELETE FROM order_items oi
USING orders o
WHERE oi.order_id = o.order_id AND o.status = 'cancelled';

-- ═══ TRUNCATE — Remove ALL rows (fast) ═══
-- Remove all rows, reset auto-increment
TRUNCATE TABLE audit_log;

-- Truncate with CASCADE (also truncates referencing tables)
TRUNCATE TABLE orders CASCADE;  -- ⚠️ DANGEROUS!

-- Truncate multiple tables
TRUNCATE TABLE order_items, orders;

-- ═══ DROP — Remove entire table ═══
-- Drop table (error if doesn't exist)
DROP TABLE audit_log;

-- Drop table safely
DROP TABLE IF EXISTS audit_log;

-- Drop table with CASCADE (drops dependent objects)
DROP TABLE IF EXISTS orders CASCADE;

-- Drop multiple tables
DROP TABLE IF EXISTS order_items, orders, customers CASCADE;

-- ═══ SAFE DELETION PATTERN (Production) ═══
-- Step 1: Check what will be deleted
SELECT COUNT(*) FROM orders WHERE status = 'cancelled';

-- Step 2: Wrap in transaction
BEGIN;
    DELETE FROM order_items 
    WHERE order_id IN (SELECT order_id FROM orders WHERE status = 'cancelled');
    
    DELETE FROM orders WHERE status = 'cancelled';
    
    -- Verify
    SELECT COUNT(*) FROM orders WHERE status = 'cancelled';  -- Should be 0
    
    -- If happy:
    COMMIT;
    -- If something went wrong:
    -- ROLLBACK;
      `,
    },
  ],
};
