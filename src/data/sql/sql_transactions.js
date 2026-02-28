export const sqlTransactionsTopic = {
  id: "sql-transactions",
  title: "Transactions & Concurrency",
  description:
    "ACID properties, BEGIN/COMMIT/ROLLBACK, isolation levels, deadlocks, and locking strategies.",
  icon: "Lock",
  sections: [
    {
      id: "acid-properties",
      title: "ACID Properties",
      content: `
## ACID — The Foundation of Reliable Databases

Every interview asks about ACID. Here's the definitive guide:

| Property | Meaning | Example |
|----------|---------|---------|
| **A - Atomicity** | All or nothing | Bank transfer: debit AND credit both succeed, or BOTH fail |
| **C - Consistency** | Data stays valid | Constraints are never violated |
| **I - Isolation** | Concurrent transactions don't interfere | Two people buying the last item — only one succeeds |
| **D - Durability** | Committed data survives crashes | After COMMIT, data is persisted to disk |

### Atomicity Example
\`\`\`
Transfer $100 from Alice to Bob:
1. Debit Alice's account by $100
2. Credit Bob's account by $100

If step 2 fails → step 1 is rolled back (no money disappears!)
\`\`\`

### Interview Tip
> ACID is about **guarantees**. SQL databases provide ACID by default. NoSQL databases often sacrifice Isolation or Consistency for performance.
      `,
      diagram: `
graph TD
    subgraph ACID["ACID Properties"]
        A["Atomicity<br/>All or Nothing"]
        C["Consistency<br/>Valid State Always"]
        I["Isolation<br/>Transactions Don't Interfere"]
        D["Durability<br/>Committed = Permanent"]
    end
    
    TX["Transaction"] --> A
    TX --> C
    TX --> I
    TX --> D
      `,
    },
    {
      id: "transaction-basics",
      title: "Transactions — BEGIN, COMMIT, ROLLBACK",
      content: `
## Transaction Control

### Basic Transaction Flow
\`\`\`sql
BEGIN;           -- Start transaction
  -- Your SQL statements here
COMMIT;          -- Save all changes
-- OR
ROLLBACK;        -- Undo all changes
\`\`\`

### SAVEPOINT — Partial Rollback
\`\`\`sql
BEGIN;
  INSERT INTO ... ;
  SAVEPOINT sp1;     -- Create checkpoint
  INSERT INTO ... ;  -- This might fail
  ROLLBACK TO sp1;   -- Undo only since savepoint
  -- First INSERT is still intact
COMMIT;
\`\`\`
      `,
      code: `-- ═══ BASIC TRANSACTION ═══
-- Bank transfer: $100 from customer 1 to customer 2
BEGIN;
    -- Debit sender
    UPDATE accounts SET balance = balance - 100 
    WHERE customer_id = 1 AND balance >= 100;
    
    -- Credit receiver
    UPDATE accounts SET balance = balance + 100 
    WHERE customer_id = 2;
    
    -- Verify: Total balance should be unchanged
    -- SELECT SUM(balance) FROM accounts;
    
COMMIT;  -- Both changes saved atomically

-- ═══ TRANSACTION WITH ROLLBACK ═══
BEGIN;
    DELETE FROM order_items WHERE order_id = 1;
    DELETE FROM orders WHERE order_id = 1;
    
    -- Oops, wrong order!
ROLLBACK;  -- Everything undone, no data lost

-- ═══ SAVEPOINT EXAMPLE ═══
BEGIN;
    INSERT INTO customers (first_name, last_name, email)
    VALUES ('Test', 'User', 'test@email.com');
    
    SAVEPOINT before_order;
    
    INSERT INTO orders (customer_id, status, total_amount)
    VALUES (999, 'pending', 100);  -- This might fail (invalid customer_id)
    
    -- If the order insert failed:
    ROLLBACK TO before_order;
    -- Customer insert is still preserved
    
COMMIT;

-- ═══ PRACTICAL: Safe Bulk Update ═══
BEGIN;
    -- Preview changes
    SELECT product_id, name, price FROM products WHERE category = 'Electronics';
    
    -- Apply 15% price increase
    UPDATE products SET price = price * 1.15 WHERE category = 'Electronics';
    
    -- Verify changes
    SELECT product_id, name, price FROM products WHERE category = 'Electronics';
    
    -- Happy with results?
    COMMIT;
    -- Not happy?
    -- ROLLBACK;

-- ═══ Error Handling in Procedures ═══
CREATE OR REPLACE PROCEDURE safe_transfer(
    p_from INT, p_to INT, p_amount DECIMAL
)
LANGUAGE plpgsql AS $$
BEGIN
    -- Debit
    UPDATE accounts SET balance = balance - p_amount 
    WHERE customer_id = p_from AND balance >= p_amount;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Insufficient funds for customer %', p_from;
    END IF;
    
    -- Credit
    UPDATE accounts SET balance = balance + p_amount 
    WHERE customer_id = p_to;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Target account % not found', p_to;
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Transfer failed: %', SQLERRM;
        -- Transaction is auto-rolled back on exception
END;
$$;
      `,
    },
    {
      id: "isolation-levels",
      title: "Isolation Levels",
      content: `
## Isolation Levels — Controlling Concurrency

Isolation levels control how much transactions can "see" each other's uncommitted work.

### Concurrency Problems

| Problem | Description | Example |
|---------|-------------|---------|
| **Dirty Read** | Read uncommitted data | See price change before it's committed |
| **Non-Repeatable Read** | Same query, different results | Price changes between two reads |
| **Phantom Read** | New rows appear between reads | New orders appear during report |

### Isolation Levels (SQL Standard)

| Level | Dirty Read | Non-Repeatable | Phantom | Speed |
|-------|-----------|----------------|---------|-------|
| **READ UNCOMMITTED** | ✅ Possible | ✅ Possible | ✅ Possible | Fastest |
| **READ COMMITTED** | ❌ Prevented | ✅ Possible | ✅ Possible | Fast |
| **REPEATABLE READ** | ❌ Prevented | ❌ Prevented | ✅ Possible | Moderate |
| **SERIALIZABLE** | ❌ Prevented | ❌ Prevented | ❌ Prevented | Slowest |

### Database Defaults

| Database | Default Level |
|----------|--------------|
| PostgreSQL | READ COMMITTED |
| MySQL (InnoDB) | REPEATABLE READ |
| SQL Server | READ COMMITTED |
| Oracle | READ COMMITTED |

### Interview Answer
> "READ COMMITTED is the best default for most applications. Use SERIALIZABLE only for critical financial operations. The trade-off is consistency vs concurrency."
      `,
      code: `-- ═══ VIEW CURRENT ISOLATION LEVEL ═══
SHOW TRANSACTION ISOLATION LEVEL;  -- PostgreSQL
-- SELECT @@transaction_isolation;  -- MySQL

-- ═══ SET ISOLATION LEVEL ═══
-- For current transaction only
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- For the entire session
SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- ═══ DIRTY READ EXAMPLE ═══
-- Transaction A (not yet committed):
-- BEGIN;
-- UPDATE products SET price = 0 WHERE product_id = 1;  -- Price = 0 temporarily
-- (hasn't committed yet)

-- Transaction B (with READ UNCOMMITTED):
-- SELECT price FROM products WHERE product_id = 1;
-- Returns: 0 (dirty read!)  ← This data may get rolled back!

-- With READ COMMITTED, B would wait or see the OLD price

-- ═══ NON-REPEATABLE READ EXAMPLE ═══
-- Transaction A:
-- BEGIN;
-- SELECT price FROM products WHERE product_id = 1;  -- Returns 1299.99
-- ... some time passes ...

-- Transaction B commits: UPDATE products SET price = 999.99 WHERE product_id = 1;

-- Transaction A reads again:
-- SELECT price FROM products WHERE product_id = 1;  -- Returns 999.99!!!
-- (Same query, different result within same transaction)

-- With REPEATABLE READ, A would still see 1299.99

-- ═══ SERIALIZABLE for Critical Operations ═══
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    -- Check if enough stock
    SELECT stock FROM products WHERE product_id = 1;
    -- stock = 1 (last item!)
    
    -- Another transaction could also see stock = 1 and try to buy
    -- With SERIALIZABLE, one will fail with serialization error
    
    UPDATE products SET stock = stock - 1 WHERE product_id = 1;
    INSERT INTO orders (customer_id, status) VALUES (1, 'pending');
COMMIT;
      `,
    },
    {
      id: "locking",
      title: "Locking & Deadlocks",
      content: `
## Locking Strategies

### Pessimistic Locking (SELECT FOR UPDATE)
Lock rows BEFORE modifying them. Other transactions must wait.

### Optimistic Locking (Version Column)
Don't lock. Instead, check if data changed before saving. Retry if it did.

### Deadlocks
Two transactions each waiting for the other's lock.
\`\`\`
Transaction A: Locks Row 1, wants Row 2
Transaction B: Locks Row 2, wants Row 1
→ DEADLOCK! (Database detects and kills one transaction)
\`\`\`

### Best Practice
> Use **optimistic locking** for web applications (low contention).
> Use **pessimistic locking** for financial/inventory systems (high contention).
      `,
      code: `-- ═══ PESSIMISTIC LOCKING (SELECT FOR UPDATE) ═══
BEGIN;
    -- Lock the product row — no one else can modify it
    SELECT * FROM products WHERE product_id = 1 FOR UPDATE;
    
    -- Safely update (no race condition)
    UPDATE products SET stock = stock - 1 WHERE product_id = 1;
COMMIT;

-- ═══ SELECT FOR UPDATE SKIP LOCKED ═══
-- Great for job queues — grab next available task
BEGIN;
    SELECT * FROM tasks 
    WHERE status = 'pending' 
    ORDER BY created_at 
    LIMIT 1 
    FOR UPDATE SKIP LOCKED;  -- Skip rows locked by other workers
    
    -- Process the task...
    UPDATE tasks SET status = 'processing' WHERE task_id = ?;
COMMIT;

-- ═══ OPTIMISTIC LOCKING (Version Column) ═══
-- Step 1: Table has a version column
-- ALTER TABLE products ADD COLUMN version INT DEFAULT 1;

-- Step 2: Read the current version
-- SELECT product_id, price, version FROM products WHERE product_id = 1;
-- Returns: price=1299.99, version=1

-- Step 3: Update ONLY if version hasn't changed
-- UPDATE products 
-- SET price = 1199.99, version = version + 1
-- WHERE product_id = 1 AND version = 1;
-- If 0 rows updated → someone else modified it → RETRY

-- ═══ AVOIDING DEADLOCKS ═══
-- Rule 1: Always lock tables/rows in the SAME ORDER
-- ❌ BAD:
-- TX A: Lock products, then lock orders
-- TX B: Lock orders, then lock products  → DEADLOCK!

-- ✅ GOOD:
-- TX A: Lock orders, then lock products
-- TX B: Lock orders, then lock products  → Safe!

-- Rule 2: Keep transactions SHORT
-- Rule 3: Use NOWAIT to fail fast instead of waiting
-- SELECT * FROM products WHERE product_id = 1 FOR UPDATE NOWAIT;
-- Throws error immediately if row is locked
      `,
    },
  ],
};
