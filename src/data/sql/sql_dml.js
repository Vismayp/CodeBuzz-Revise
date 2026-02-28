export const sqlDmlTopic = {
  id: "sql-dml",
  title: "DML — INSERT, UPDATE, DELETE",
  description:
    "Master data manipulation: INSERT, UPDATE, DELETE, MERGE/UPSERT, bulk operations, and RETURNING clause.",
  icon: "Edit",
  sections: [
    {
      id: "insert-data",
      title: "INSERT — Adding Data",
      content: `
## INSERT INTO — Add New Rows

### Syntax Variants
1. **Single row**: Insert one record
2. **Multi-row**: Insert multiple records at once
3. **INSERT...SELECT**: Insert from another query
4. **INSERT...RETURNING**: Get back the inserted data (PostgreSQL)
      `,
      code: `-- ═══ SINGLE ROW INSERT ═══
INSERT INTO customers (first_name, last_name, email, city, country)
VALUES ('Karen', 'Lee', 'karen@email.com', 'Seoul', 'South Korea');

-- ═══ MULTI-ROW INSERT ═══
INSERT INTO products (name, category, price, stock) VALUES
('Webcam HD',      'Electronics', 79.99, 100),
('Headphones Pro', 'Electronics', 199.99, 60),
('Notebook Set',   'Books',       15.99, 200);

-- ═══ INSERT with DEFAULT ═══
INSERT INTO customers (first_name, last_name, email)
VALUES ('Leo', 'Zhang', 'leo@email.com');
-- country defaults to 'USA', created_at defaults to NOW()

-- ═══ INSERT...SELECT (copy data) ═══
-- Copy premium customers to a new table
INSERT INTO high_value_customers (customer_id, first_name, last_name, lifetime_value)
SELECT 
    c.customer_id, c.first_name, c.last_name, SUM(o.total_amount)
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name
HAVING SUM(o.total_amount) > 1000;

-- ═══ INSERT...RETURNING (PostgreSQL) ═══
-- Get back the auto-generated ID after insert
INSERT INTO customers (first_name, last_name, email, city)
VALUES ('Mike', 'Chen', 'mike@email.com', 'Beijing')
RETURNING customer_id, email, created_at;
-- Returns: customer_id=12, email='mike@email.com', created_at='2025-...'

-- ═══ INSERT...ON CONFLICT (UPSERT — PostgreSQL) ═══
-- Insert or update if email already exists
INSERT INTO customers (first_name, last_name, email, city, country)
VALUES ('Alice', 'Johnson', 'alice@email.com', 'San Francisco', 'USA')
ON CONFLICT (email) 
DO UPDATE SET 
    city = EXCLUDED.city,
    country = EXCLUDED.country;
-- EXCLUDED refers to the row that was attempted to be inserted

-- ═══ MySQL equivalent (ON DUPLICATE KEY UPDATE) ═══
-- INSERT INTO customers (first_name, last_name, email, city)
-- VALUES ('Alice', 'Johnson', 'alice@email.com', 'San Francisco')
-- ON DUPLICATE KEY UPDATE city = VALUES(city);
      `,
    },
    {
      id: "update-data",
      title: "UPDATE — Modifying Data",
      content: `
## UPDATE — Change Existing Rows

### Key Safety Rules
1. **Always use WHERE** unless you intend to update ALL rows
2. **Preview with SELECT first** to see what will change
3. **Use transactions** for critical updates
4. **RETURNING** clause (PostgreSQL) to verify changes

### Common Patterns
- Simple value update
- Update with calculation
- Update from another table (JOIN update)
- Conditional update with CASE
      `,
      code: `-- ═══ BASIC UPDATE ═══
-- Change one customer's city
UPDATE customers 
SET city = 'Brooklyn', updated_at = NOW() 
WHERE customer_id = 1;

-- ═══ UPDATE multiple columns ═══
UPDATE products 
SET price = 1199.99, stock = stock - 1 
WHERE product_id = 1;

-- ═══ UPDATE with calculation ═══
-- Give 10% raise to all products in Electronics
UPDATE products 
SET price = price * 1.10 
WHERE category = 'Electronics';

-- ═══ ⚠️ DANGEROUS: UPDATE without WHERE ═══
-- This updates ALL rows!
-- UPDATE products SET price = 0;  -- DON'T DO THIS!

-- ═══ SAFE UPDATE PATTERN ═══
-- Step 1: Preview what will change
SELECT customer_id, first_name, city 
FROM customers 
WHERE country = 'USA' AND city = 'New York';

-- Step 2: Update within a transaction
BEGIN;
    UPDATE customers 
    SET city = 'NYC' 
    WHERE country = 'USA' AND city = 'New York';
    
    -- Verify
    SELECT * FROM customers WHERE city = 'NYC';
    
    COMMIT;  -- or ROLLBACK;

-- ═══ UPDATE with CASE ═══
-- Tiered pricing update
UPDATE products SET price = CASE
    WHEN price < 50 THEN price * 1.15      -- 15% increase for cheap items
    WHEN price < 200 THEN price * 1.10     -- 10% for mid-range
    WHEN price < 500 THEN price * 1.05     -- 5% for expensive
    ELSE price                              -- No change for premium
END;

-- ═══ UPDATE from another table (PostgreSQL) ═══
-- Update order totals based on order_items
UPDATE orders o
SET total_amount = (
    SELECT SUM(oi.quantity * oi.unit_price)
    FROM order_items oi
    WHERE oi.order_id = o.order_id
);

-- ═══ UPDATE with JOIN (PostgreSQL) ═══
UPDATE order_items oi
SET unit_price = p.price  -- Sync with current product price
FROM products p
WHERE oi.product_id = p.product_id;

-- ═══ UPDATE...RETURNING ═══
UPDATE products 
SET stock = stock - 5 
WHERE product_id = 1 AND stock >= 5
RETURNING product_id, name, stock AS remaining_stock;
-- Shows the updated row, useful for APIs
      `,
    },
    {
      id: "delete-data",
      title: "DELETE — Removing Data",
      content: `
## DELETE — Remove Rows

### Safety Checklist
✅ Always preview with SELECT first
✅ Use WHERE clause (unless you mean TRUNCATE)
✅ Check for CASCADE effects on child tables
✅ Use transactions for important deletes
✅ Consider soft delete instead of hard delete
      `,
      code: `-- ═══ BASIC DELETE ═══
DELETE FROM orders WHERE order_id = 8;

-- ═══ DELETE with condition ═══
DELETE FROM orders WHERE status = 'cancelled';

-- ═══ DELETE with subquery ═══
-- Delete orders from customers who no longer exist
DELETE FROM orders
WHERE customer_id NOT IN (SELECT customer_id FROM customers);

-- ═══ DELETE with JOIN (PostgreSQL) ═══
DELETE FROM order_items oi
USING orders o
WHERE oi.order_id = o.order_id AND o.status = 'cancelled';

-- ═══ DELETE...RETURNING ═══
DELETE FROM customers 
WHERE customer_id = 99
RETURNING *;
-- Returns the deleted row (great for audit logs)

-- ═══ SOFT DELETE Pattern (Production Best Practice) ═══
-- Instead of deleting, mark as deleted
-- Step 1: Add columns to table
-- ALTER TABLE customers ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;
-- ALTER TABLE customers ADD COLUMN deleted_at TIMESTAMP;

-- Step 2: "Delete" by updating
UPDATE customers 
SET is_deleted = TRUE, deleted_at = NOW() 
WHERE customer_id = 5;

-- Step 3: All queries filter out deleted records
-- SELECT * FROM customers WHERE is_deleted = FALSE;

-- Step 4: Create a view for convenience
-- CREATE VIEW active_customers AS
-- SELECT * FROM customers WHERE is_deleted = FALSE;

-- ═══ SAFE DELETE WORKFLOW ═══
BEGIN;
    -- Preview
    SELECT COUNT(*) FROM orders WHERE order_date < '2024-01-01';
    
    -- Delete child records first
    DELETE FROM order_items 
    WHERE order_id IN (
        SELECT order_id FROM orders WHERE order_date < '2024-01-01'
    );
    
    -- Delete parent records
    DELETE FROM orders WHERE order_date < '2024-01-01';
    
    -- Verify
    SELECT COUNT(*) FROM orders WHERE order_date < '2024-01-01';
    
COMMIT;
      `,
    },
    {
      id: "merge-upsert",
      title: "MERGE / UPSERT — Smart Inserts",
      content: `
## MERGE (SQL Standard) / UPSERT (PostgreSQL)

**UPSERT** = INSERT if not exists, UPDATE if exists. Extremely common in production.

### When to Use
- Syncing data from external sources
- Idempotent API endpoints (safe to retry)
- Batch data loading
- Cache updates

### Database-Specific Syntax

| Database | Syntax |
|----------|--------|
| PostgreSQL | \`INSERT...ON CONFLICT DO UPDATE\` |
| MySQL | \`INSERT...ON DUPLICATE KEY UPDATE\` |
| SQL Server | \`MERGE...WHEN MATCHED/NOT MATCHED\` |
| SQLite | \`INSERT OR REPLACE\` |
      `,
      code: `-- ═══ PostgreSQL UPSERT ═══
-- Insert new product or update price if name already exists
INSERT INTO products (name, category, price, stock)
VALUES ('Laptop Pro', 'Electronics', 1399.99, 45)
ON CONFLICT (name) 
DO UPDATE SET 
    price = EXCLUDED.price,
    stock = EXCLUDED.stock;

-- ═══ UPSERT: Do Nothing on Conflict ═══
INSERT INTO customers (first_name, last_name, email)
VALUES ('Alice', 'Johnson', 'alice@email.com')
ON CONFLICT (email) DO NOTHING;
-- Silently skip if email already exists

-- ═══ SQL Server MERGE ═══
-- MERGE INTO products AS target
-- USING (VALUES ('Laptop Pro', 'Electronics', 1399.99, 45)) 
--     AS source (name, category, price, stock)
-- ON target.name = source.name
-- WHEN MATCHED THEN
--     UPDATE SET price = source.price, stock = source.stock
-- WHEN NOT MATCHED THEN
--     INSERT (name, category, price, stock) 
--     VALUES (source.name, source.category, source.price, source.stock);

-- ═══ BULK UPSERT (Production Pattern) ═══
-- Upsert multiple rows from a staging table
-- INSERT INTO products (name, category, price, stock)
-- SELECT name, category, price, stock 
-- FROM staging_products
-- ON CONFLICT (name)
-- DO UPDATE SET 
--     price = EXCLUDED.price,
--     stock = products.stock + EXCLUDED.stock,  -- Accumulate stock
--     updated_at = NOW();

-- ═══ UPSERT with RETURNING ═══
INSERT INTO customers (first_name, last_name, email, city)
VALUES ('Alice', 'Johnson', 'alice@email.com', 'Boston')
ON CONFLICT (email) 
DO UPDATE SET city = EXCLUDED.city
RETURNING customer_id, first_name, city, 
    CASE WHEN xmax = 0 THEN 'inserted' ELSE 'updated' END AS action;
-- xmax = 0 means the row was freshly inserted
      `,
    },
    {
      id: "dml-practice",
      title: "🏋️ Practice Problems: DML",
      content: `
## Practice Problems — INSERT, UPDATE, DELETE

### Problem 1: Insert New Data
Insert 3 new customers from India in a single statement.

### Problem 2: Bulk Update
Give a 20% discount to all products in the 'Furniture' category.

### Problem 3: Conditional Update
Update order status to 'expired' for all 'pending' orders older than 30 days.

### Problem 4: Delete with Safety
Delete all order items for cancelled orders using a safe transaction.

### Problem 5: UPSERT
Write an upsert that inserts a new product or updates the stock count if the product already exists.

### Problem 6: Interview Challenge
*Write a query that recalculates the total_amount for every order based on its order_items and updates the orders table.*
      `,
      code: `-- ═══ SOLUTION 1: Bulk Insert ═══
INSERT INTO customers (first_name, last_name, email, city, country) VALUES
('Ravi',   'Kumar',   'ravi@email.com',   'Mumbai',    'India'),
('Priya',  'Sharma',  'priya@email.com',  'Delhi',     'India'),
('Arjun',  'Patel',   'arjun@email.com',  'Bangalore', 'India');

-- ═══ SOLUTION 2: Bulk Discount ═══
BEGIN;
    SELECT name, price FROM products WHERE category = 'Furniture';
    
    UPDATE products 
    SET price = ROUND(price * 0.80, 2) 
    WHERE category = 'Furniture';
    
    SELECT name, price FROM products WHERE category = 'Furniture';
COMMIT;

-- ═══ SOLUTION 3: Conditional Update ═══
UPDATE orders 
SET status = 'expired' 
WHERE status = 'pending' 
  AND order_date < NOW() - INTERVAL '30 days';

-- ═══ SOLUTION 4: Safe Delete ═══
BEGIN;
    SELECT COUNT(*) FROM order_items oi
    JOIN orders o ON oi.order_id = o.order_id
    WHERE o.status = 'cancelled';
    
    DELETE FROM order_items 
    WHERE order_id IN (SELECT order_id FROM orders WHERE status = 'cancelled');
    
    DELETE FROM orders WHERE status = 'cancelled';
COMMIT;

-- ═══ SOLUTION 5: UPSERT ═══
INSERT INTO products (name, category, price, stock)
VALUES ('USB-C Hub', 'Electronics', 49.99, 50)
ON CONFLICT (name)
DO UPDATE SET stock = products.stock + EXCLUDED.stock;

-- ═══ SOLUTION 6: Recalculate Totals ═══
UPDATE orders o
SET total_amount = sub.calculated_total
FROM (
    SELECT 
        order_id,
        SUM(quantity * unit_price) AS calculated_total
    FROM order_items
    GROUP BY order_id
) sub
WHERE o.order_id = sub.order_id;
      `,
    },
  ],
};
