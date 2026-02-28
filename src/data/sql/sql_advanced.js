export const sqlAdvancedTopic = {
  id: "sql-advanced",
  title: "Views, Stored Procedures & Triggers",
  description:
    "Views, materialized views, stored procedures, user-defined functions, triggers, cursors, and dynamic SQL.",
  icon: "Settings",
  sections: [
    {
      id: "views",
      title: "Views — Virtual Tables",
      content: `
## Views — Saved Queries as Virtual Tables

A **view** is a named query stored in the database. It acts like a virtual table.

### Benefits
1. **Simplify complex queries** — Write once, use everywhere
2. **Security** — Expose only certain columns/rows to users
3. **Abstraction** — Hide schema complexity from applications
4. **Consistency** — Ensure all reports use the same query logic

### Views vs Materialized Views

| Feature | View | Materialized View |
|---------|------|-------------------|
| Data stored? | ❌ No (query re-runs) | ✅ Yes (cached on disk) |
| Speed | Slower (dynamic) | Faster (pre-computed) |
| Always fresh? | ✅ Yes | ❌ No (needs REFRESH) |
| Storage | None | Uses disk space |
| Updatable? | Sometimes | ❌ No |
      `,
      code: `-- ═══ CREATE VIEW ═══
-- Customer order summary view
CREATE VIEW customer_summary AS
SELECT 
    c.customer_id,
    c.first_name || ' ' || c.last_name AS full_name,
    c.email,
    c.city,
    c.country,
    COUNT(o.order_id) AS total_orders,
    COALESCE(SUM(o.total_amount), 0) AS total_spent,
    COALESCE(ROUND(AVG(o.total_amount), 2), 0) AS avg_order_value,
    MAX(o.order_date) AS last_order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status IS NULL OR o.status != 'cancelled'
GROUP BY c.customer_id, c.first_name, c.last_name, c.email, c.city, c.country;

-- Now use it like a table!
SELECT * FROM customer_summary WHERE total_spent > 500;
SELECT * FROM customer_summary WHERE country = 'USA' ORDER BY total_spent DESC;

-- ═══ CREATE VIEW — Active Products ═══
CREATE VIEW active_products AS
SELECT * FROM products WHERE stock > 0;

-- ═══ CREATE OR REPLACE VIEW ═══
CREATE OR REPLACE VIEW order_details AS
SELECT 
    o.order_id,
    c.first_name || ' ' || c.last_name AS customer,
    o.order_date,
    o.status,
    p.name AS product,
    oi.quantity,
    oi.unit_price,
    (oi.quantity * oi.unit_price) AS line_total
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id;

-- ═══ MATERIALIZED VIEW (PostgreSQL) ═══
CREATE MATERIALIZED VIEW monthly_revenue AS
SELECT 
    TO_CHAR(order_date, 'YYYY-MM') AS month,
    COUNT(*) AS order_count,
    SUM(total_amount) AS revenue
FROM orders
WHERE status != 'cancelled'
GROUP BY TO_CHAR(order_date, 'YYYY-MM')
ORDER BY month;

-- Query it (fast, uses cached data)
SELECT * FROM monthly_revenue;

-- Refresh when data changes
REFRESH MATERIALIZED VIEW monthly_revenue;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_revenue;  -- Non-blocking

-- ═══ DROP VIEW ═══
DROP VIEW IF EXISTS customer_summary;
DROP MATERIALIZED VIEW IF EXISTS monthly_revenue;
      `,
    },
    {
      id: "stored-procedures",
      title: "Stored Procedures & Functions",
      content: `
## Stored Procedures — Server-Side Logic

**Stored Procedures** are pre-compiled SQL code stored in the database. They can accept parameters, contain control flow, and execute multiple statements.

### Procedures vs Functions

| Feature | Procedure | Function |
|---------|-----------|----------|
| Returns | Nothing (or OUT params) | Must return a value |
| Called with | \`CALL procedure()\` | \`SELECT function()\` |
| In SELECT? | ❌ No | ✅ Yes |
| Side effects | ✅ Can modify data | Should be read-only |
| Transactions | Can manage transactions | Cannot |

### When to Use
✅ Complex business logic that runs frequently
✅ Data validation rules
✅ Batch processing operations
✅ Encapsulating multi-step operations
      `,
      code: `-- ═══ CREATE FUNCTION (PostgreSQL) ═══
-- Calculate total order amount
CREATE OR REPLACE FUNCTION calculate_order_total(p_order_id INT)
RETURNS DECIMAL(12, 2) AS $$
DECLARE
    v_total DECIMAL(12, 2);
BEGIN
    SELECT SUM(quantity * unit_price) INTO v_total
    FROM order_items
    WHERE order_id = p_order_id;
    
    RETURN COALESCE(v_total, 0);
END;
$$ LANGUAGE plpgsql;

-- Usage:
-- SELECT calculate_order_total(1);
-- SELECT order_id, calculate_order_total(order_id) AS total FROM orders;

-- ═══ CREATE PROCEDURE (PostgreSQL) ═══
-- Place a new order with items
CREATE OR REPLACE PROCEDURE place_order(
    p_customer_id INT,
    p_product_id INT,
    p_quantity INT
)
LANGUAGE plpgsql AS $$
DECLARE
    v_order_id INT;
    v_price DECIMAL(10, 2);
    v_stock INT;
BEGIN
    -- Check stock
    SELECT price, stock INTO v_price, v_stock
    FROM products WHERE product_id = p_product_id;
    
    IF v_stock < p_quantity THEN
        RAISE EXCEPTION 'Insufficient stock. Available: %, Requested: %', v_stock, p_quantity;
    END IF;
    
    -- Create order
    INSERT INTO orders (customer_id, status, total_amount)
    VALUES (p_customer_id, 'pending', v_price * p_quantity)
    RETURNING order_id INTO v_order_id;
    
    -- Add order item
    INSERT INTO order_items (order_id, product_id, quantity, unit_price)
    VALUES (v_order_id, p_product_id, p_quantity, v_price);
    
    -- Update stock
    UPDATE products SET stock = stock - p_quantity
    WHERE product_id = p_product_id;
    
    RAISE NOTICE 'Order % created successfully!', v_order_id;
END;
$$;

-- Usage:
-- CALL place_order(1, 2, 3);  -- Customer 1 orders 3 of product 2

-- ═══ MySQL Stored Procedure ═══
-- DELIMITER //
-- CREATE PROCEDURE GetCustomerOrders(IN p_customer_id INT)
-- BEGIN
--     SELECT o.order_id, o.order_date, o.total_amount, o.status
--     FROM orders o
--     WHERE o.customer_id = p_customer_id
--     ORDER BY o.order_date DESC;
-- END //
-- DELIMITER ;
-- CALL GetCustomerOrders(1);
      `,
    },
    {
      id: "triggers",
      title: "Triggers — Automatic Actions",
      content: `
## Triggers — Run Code Automatically on Data Changes

A **trigger** automatically executes a function when an INSERT, UPDATE, or DELETE occurs on a table.

### Trigger Timing
- **BEFORE**: Run before the operation (can modify values)
- **AFTER**: Run after the operation (for logging, cascading)
- **INSTEAD OF**: Replace the operation (used with views)

### Common Use Cases
1. **Audit logging** — Track who changed what
2. **Auto-update timestamps** — Set \`updated_at\` on every UPDATE
3. **Enforce business rules** — Beyond simple CHECK constraints
4. **Cascade updates** — Sync related data
5. **Send notifications** — Alert on specific changes
      `,
      code: `-- ═══ AUTO-UPDATE TIMESTAMP TRIGGER ═══
-- Step 1: Create the trigger function
CREATE OR REPLACE FUNCTION update_modified_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Attach to tables
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_timestamp();

-- Now every UPDATE on customers auto-sets updated_at!

-- ═══ AUDIT LOG TRIGGER ═══
CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, action, new_data, changed_at)
        VALUES (TG_TABLE_NAME, 'INSERT', row_to_json(NEW), NOW());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, action, old_data, new_data, changed_at)
        VALUES (TG_TABLE_NAME, 'UPDATE', row_to_json(OLD), row_to_json(NEW), NOW());
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, action, old_data, changed_at)
        VALUES (TG_TABLE_NAME, 'DELETE', row_to_json(OLD), NOW());
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customer_audit
    AFTER INSERT OR UPDATE OR DELETE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION log_changes();

-- ═══ STOCK VALIDATION TRIGGER ═══
CREATE OR REPLACE FUNCTION check_stock_before_order()
RETURNS TRIGGER AS $$
DECLARE
    v_stock INT;
BEGIN
    SELECT stock INTO v_stock FROM products WHERE product_id = NEW.product_id;
    
    IF v_stock < NEW.quantity THEN
        RAISE EXCEPTION 'Not enough stock for product %. Available: %, Requested: %',
            NEW.product_id, v_stock, NEW.quantity;
    END IF;
    
    -- Automatically deduct stock
    UPDATE products SET stock = stock - NEW.quantity
    WHERE product_id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_stock
    BEFORE INSERT ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION check_stock_before_order();

-- ═══ DROP TRIGGER ═══
DROP TRIGGER IF EXISTS customer_audit ON customers;
      `,
    },
  ],
};
