export const sqlFundamentalsTopic = {
  id: "sql-fundamentals",
  title: "SQL Fundamentals & Setup",
  description:
    "What is SQL, RDBMS, SQL vs NoSQL, command categories (DDL/DML/DCL/TCL), data types, and getting started.",
  icon: "Database",
  sections: [
    {
      id: "what-is-sql",
      title: "What is SQL?",
      content: `
## SQL — Structured Query Language

**SQL** (Structured Query Language) is the standard language for managing and manipulating relational databases. Virtually every company uses SQL — from startups to FAANG companies.

### Why Learn SQL?
- **Universal**: Works across MySQL, PostgreSQL, SQL Server, Oracle, SQLite
- **In-demand**: Required for Backend, Data Science, Analytics, DevOps
- **Declarative**: You describe *what* you want, not *how* to get it
- **50+ years old**: Battle-tested, stable, and not going away

### How SQL Works
\`\`\`
You (SQL Query) → Database Engine → Data (Result Set)
\`\`\`

You write a query, the database engine optimizes it, executes it, and returns the results.

### SQL Statement Categories

| Category | Full Name | Purpose | Commands |
|----------|-----------|---------|----------|
| **DDL** | Data Definition Language | Define structure | CREATE, ALTER, DROP, TRUNCATE |
| **DML** | Data Manipulation Language | Modify data | INSERT, UPDATE, DELETE |
| **DQL** | Data Query Language | Read data | SELECT |
| **DCL** | Data Control Language | Permissions | GRANT, REVOKE |
| **TCL** | Transaction Control Language | Transactions | COMMIT, ROLLBACK, SAVEPOINT |
      `,
      diagram: `
graph TD
    subgraph SQL_Categories["SQL Command Categories"]
        DDL["DDL<br/>CREATE, ALTER, DROP"]
        DML["DML<br/>INSERT, UPDATE, DELETE"]
        DQL["DQL<br/>SELECT"]
        DCL["DCL<br/>GRANT, REVOKE"]
        TCL["TCL<br/>COMMIT, ROLLBACK"]
    end
    
    User["Developer"] --> SQL["SQL Query"]
    SQL --> Engine["Database Engine"]
    Engine --> DDL
    Engine --> DML
    Engine --> DQL
    Engine --> DCL
    Engine --> TCL
      `,
    },
    {
      id: "rdbms-concepts",
      title: "RDBMS Core Concepts",
      content: `
## Relational Database Management Systems

An **RDBMS** organizes data into **tables** (relations) with **rows** (records/tuples) and **columns** (fields/attributes).

### Key Terminology

| Term | Description | Example |
|------|-------------|---------|
| **Database** | Collection of related tables | \`ecommerce_db\` |
| **Table** | Structured collection of data | \`users\`, \`orders\` |
| **Row / Record** | Single entry in a table | One specific user |
| **Column / Field** | Attribute of data | \`name\`, \`email\` |
| **Primary Key (PK)** | Unique identifier for each row | \`user_id\` |
| **Foreign Key (FK)** | Reference to PK in another table | \`orders.user_id\` → \`users.id\` |
| **Schema** | Blueprint of database structure | Tables + relationships |
| **Index** | Speed up data lookups | Index on \`email\` column |

### The Relational Model
\`\`\`
users table:
+----+--------+-------------------+
| id | name   | email             |
+----+--------+-------------------+
|  1 | Alice  | alice@example.com |
|  2 | Bob    | bob@example.com   |
+----+--------+-------------------+

orders table:
+----+---------+---------+--------+
| id | user_id | product | amount |
+----+---------+---------+--------+
|  1 |       1 | Laptop  | 999.99 |
|  2 |       1 | Mouse   |  29.99 |
|  3 |       2 | Phone   | 699.99 |
+----+---------+---------+--------+
              ↑
         Foreign Key → users.id
\`\`\`

### Relationships
- **One-to-One**: User → Profile (each user has exactly one profile)
- **One-to-Many**: User → Orders (one user can have many orders)
- **Many-to-Many**: Students ↔ Courses (via junction table \`enrollments\`)
      `,
      diagram: `
graph LR
    subgraph DB["ecommerce_db"]
        Users["users<br/>id | name | email"]
        Orders["orders<br/>id | user_id | product"]
        Products["products<br/>id | name | price"]
    end
    
    Users -->|"1:N"| Orders
    Products -->|"1:N"| Orders
      `,
    },
    {
      id: "sql-vs-nosql",
      title: "SQL vs NoSQL",
      content: `
## SQL vs NoSQL — When to Use What?

### Comparison Table

| Feature | SQL (Relational) | NoSQL (Non-Relational) |
|---------|-------------------|------------------------|
| **Data Model** | Tables with rows & columns | Documents, Key-Value, Graph, Column |
| **Schema** | Fixed schema (rigid) | Dynamic schema (flexible) |
| **Scaling** | Vertical (upgrade hardware) | Horizontal (add more servers) |
| **ACID** | Full ACID compliance | Eventual consistency (usually) |
| **Query Language** | SQL | Varies (MongoDB Query, CQL, etc.) |
| **Best For** | Complex queries, transactions | Big data, real-time, flexible schema |
| **Examples** | PostgreSQL, MySQL, SQL Server | MongoDB, Redis, Cassandra, DynamoDB |

### When to Choose SQL
✅ Data has clear relationships (e.g., users → orders → products)
✅ You need ACID transactions (finance, banking, inventory)
✅ Complex queries with JOINs are common
✅ Data structure is well-defined and unlikely to change often

### When to Choose NoSQL
✅ Unstructured or semi-structured data (logs, social media posts)
✅ Massive horizontal scaling needed (millions of writes/sec)
✅ Schema changes frequently
✅ Simple key-value lookups or document storage

### Interview Insight
> **Don't say one is "better" than the other.** Always explain the trade-offs. Many production systems use both (Polyglot Persistence).

### Real-World Example
\`\`\`
Netflix:
├── PostgreSQL → User accounts, billing (needs ACID)
├── Cassandra  → Viewing history (massive scale, write-heavy)
└── Redis      → Session cache (low-latency reads)
\`\`\`
      `,
    },
    {
      id: "sql-data-types",
      title: "SQL Data Types",
      content: `
## SQL Data Types — Complete Reference

Understanding data types is crucial for designing efficient schemas.

### Numeric Types

| Type | Size | Range | Use Case |
|------|------|-------|----------|
| \`INT\` / \`INTEGER\` | 4 bytes | -2B to +2B | IDs, counts, quantities |
| \`BIGINT\` | 8 bytes | Very large numbers | Large IDs, timestamps |
| \`SMALLINT\` | 2 bytes | -32K to +32K | Status codes, flags |
| \`DECIMAL(p,s)\` | Variable | Exact precision | Money, financial data |
| \`FLOAT\` / \`REAL\` | 4 bytes | Approximate | Scientific calculations |
| \`DOUBLE PRECISION\` | 8 bytes | More precision | Coordinates, measurements |
| \`BOOLEAN\` | 1 byte | TRUE/FALSE | Flags, toggles |

### String Types

| Type | Max Size | Use Case |
|------|----------|----------|
| \`CHAR(n)\` | Fixed n chars | Codes (country: 'US'), fixed-length |
| \`VARCHAR(n)\` | Variable, up to n | Names, emails, titles |
| \`TEXT\` | Unlimited* | Long descriptions, content |

### Date/Time Types

| Type | Format | Example |
|------|--------|---------|
| \`DATE\` | YYYY-MM-DD | \`2025-01-15\` |
| \`TIME\` | HH:MI:SS | \`14:30:00\` |
| \`TIMESTAMP\` | YYYY-MM-DD HH:MI:SS | \`2025-01-15 14:30:00\` |
| \`INTERVAL\` | Duration | \`'2 hours'\`, \`'3 days'\` |

### Best Practices
> - Use \`DECIMAL\` for money, **never** \`FLOAT\` (precision loss)
> - Use \`VARCHAR\` over \`CHAR\` to save storage
> - Always use \`TIMESTAMP WITH TIME ZONE\` in production
> - Use \`BOOLEAN\` instead of \`INT\` 0/1 for clarity
      `,
      code: `-- Creating a table with proper data types
CREATE TABLE employees (
    id          SERIAL PRIMARY KEY,         -- Auto-incrementing integer
    first_name  VARCHAR(50) NOT NULL,       -- Variable-length string
    last_name   VARCHAR(50) NOT NULL,
    email       VARCHAR(100) UNIQUE,        -- Unique constraint
    salary      DECIMAL(10, 2),             -- e.g. 12345678.99
    hire_date   DATE DEFAULT CURRENT_DATE,  -- Defaults to today
    is_active   BOOLEAN DEFAULT TRUE,       -- Boolean flag
    department  VARCHAR(30),
    created_at  TIMESTAMP DEFAULT NOW()     -- Timestamp with default
);

-- ❌ BAD: Using FLOAT for money
-- salary FLOAT  →  Can lose precision: 0.1 + 0.2 = 0.30000000000000004

-- ✅ GOOD: Using DECIMAL for money
-- salary DECIMAL(10, 2)  →  Exact: 0.10 + 0.20 = 0.30

-- Example Inserts with different data types
INSERT INTO employees (first_name, last_name, email, salary, department)
VALUES 
    ('Alice', 'Johnson', 'alice@company.com', 85000.00, 'Engineering'),
    ('Bob', 'Smith', 'bob@company.com', 72000.50, 'Marketing'),
    ('Carol', 'Williams', 'carol@company.com', 95000.00, 'Engineering');
      `,
    },
    {
      id: "popular-databases",
      title: "Popular SQL Databases",
      content: `
## Popular SQL Databases Compared

### PostgreSQL (The Industry Standard)
- **Type**: Open-source, object-relational
- **Best For**: Production apps, complex queries, geospatial data
- **Used By**: Apple, Instagram, Spotify, Reddit
- **Strengths**: Full SQL compliance, JSONB support, extensions, reliability

### MySQL
- **Type**: Open-source (owned by Oracle)
- **Best For**: Web applications, CMS, blogs
- **Used By**: Facebook, Twitter, YouTube, WordPress
- **Strengths**: Fast reads, easy setup, huge community

### SQL Server (Microsoft)
- **Type**: Commercial (free Express edition)
- **Best For**: Enterprise, .NET ecosystem
- **Used By**: Enterprises, banks, government
- **Strengths**: Integration with Azure/.NET, SSMS tools

### SQLite
- **Type**: Embedded, serverless, zero-config
- **Best For**: Mobile apps, prototyping, local storage
- **Used By**: Android, iOS, browsers, embedded systems
- **Strengths**: No server needed, single file, incredibly lightweight

### Quick Comparison

| Feature | PostgreSQL | MySQL | SQL Server | SQLite |
|---------|-----------|-------|------------|--------|
| Open Source | ✅ | ✅ | ❌ (Express free) | ✅ |
| JSON Support | ✅ JSONB | ✅ JSON | ✅ | ✅ |
| Full-Text Search | ✅ | ✅ | ✅ | ✅ |
| Horizontal Scale | Via Citus | Via ProxySQL | AlwaysOn | N/A |
| Best Learning DB | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |

### Interview Tip
> **PostgreSQL** is the best database to learn first. It's the most standards-compliant, most feature-rich, and increasingly the industry default for new projects.
      `,
    },
    {
      id: "first-database-setup",
      title: "Your First Database",
      content: `
## Creating Your First Database — Hands-On

Let's create a complete **e-commerce database** from scratch. This is the database we'll use throughout this entire SQL guide.

### Step 1: Create the Database
\`\`\`sql
CREATE DATABASE ecommerce;
\\c ecommerce  -- Connect to it (PostgreSQL)
-- USE ecommerce;  -- (MySQL/SQL Server)
\`\`\`

### Step 2: Create Tables with Relationships
We'll build a real-world schema with proper relationships and constraints.

### Entity Relationship Diagram
\`\`\`
customers (1) ——→ (N) orders
orders    (1) ——→ (N) order_items
products  (1) ——→ (N) order_items
\`\`\`
      `,
      code: `-- ═══════════════════════════════════════
-- E-COMMERCE DATABASE SCHEMA
-- Complete production-ready schema
-- ═══════════════════════════════════════

-- Customers table
CREATE TABLE customers (
    customer_id   SERIAL PRIMARY KEY,
    first_name    VARCHAR(50) NOT NULL,
    last_name     VARCHAR(50) NOT NULL,
    email         VARCHAR(100) UNIQUE NOT NULL,
    phone         VARCHAR(20),
    city          VARCHAR(50),
    country       VARCHAR(50) DEFAULT 'USA',
    created_at    TIMESTAMP DEFAULT NOW()
);

-- Products table  
CREATE TABLE products (
    product_id    SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    category      VARCHAR(50),
    price         DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    stock         INT DEFAULT 0 CHECK (stock >= 0),
    created_at    TIMESTAMP DEFAULT NOW()
);

-- Orders table (FK to customers)
CREATE TABLE orders (
    order_id      SERIAL PRIMARY KEY,
    customer_id   INT NOT NULL REFERENCES customers(customer_id),
    order_date    TIMESTAMP DEFAULT NOW(),
    status        VARCHAR(20) DEFAULT 'pending' 
                  CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
    total_amount  DECIMAL(12, 2)
);

-- Order Items table (FK to orders AND products)
CREATE TABLE order_items (
    item_id       SERIAL PRIMARY KEY,
    order_id      INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id    INT NOT NULL REFERENCES products(product_id),
    quantity      INT NOT NULL CHECK (quantity > 0),
    unit_price    DECIMAL(10, 2) NOT NULL,
    UNIQUE(order_id, product_id) -- Prevent duplicate product in same order
);

-- ═══════════════════════════════════════
-- SEED DATA for practice
-- ═══════════════════════════════════════

INSERT INTO customers (first_name, last_name, email, phone, city, country) VALUES
('Alice',   'Johnson', 'alice@email.com',   '555-0101', 'New York',    'USA'),
('Bob',     'Smith',   'bob@email.com',     '555-0102', 'Los Angeles', 'USA'),
('Carol',   'Williams','carol@email.com',   '555-0103', 'Chicago',     'USA'),
('David',   'Brown',   'david@email.com',   '555-0104', 'Houston',     'USA'),
('Eve',     'Davis',   'eve@email.com',     '555-0105', 'London',      'UK'),
('Frank',   'Miller',  'frank@email.com',   '555-0106', 'Berlin',      'Germany'),
('Grace',   'Wilson',  'grace@email.com',   '555-0107', 'Toronto',     'Canada'),
('Henry',   'Moore',   'henry@email.com',   '555-0108', 'Sydney',      'Australia'),
('Ivy',     'Taylor',  'ivy@email.com',     '555-0109', 'New York',    'USA'),
('Jack',    'Anderson','jack@email.com',    '555-0110', 'Los Angeles', 'USA');

INSERT INTO products (name, category, price, stock) VALUES
('Laptop Pro',       'Electronics', 1299.99, 50),
('Wireless Mouse',   'Electronics',   29.99, 200),
('USB-C Hub',        'Electronics',   49.99, 150),
('Mechanical Keyboard','Electronics', 149.99, 75),
('Monitor 27"',      'Electronics',  399.99, 30),
('Standing Desk',    'Furniture',    599.99, 20),
('Office Chair',     'Furniture',    449.99, 25),
('Desk Lamp',        'Furniture',     39.99, 100),
('Python Book',      'Books',         45.99, 60),
('SQL Cookbook',      'Books',         39.99, 80);

INSERT INTO orders (customer_id, status, total_amount) VALUES
(1, 'delivered',  1329.98),
(1, 'shipped',     79.98),
(2, 'delivered',   699.98),
(3, 'processing', 1299.99),
(4, 'pending',     449.99),
(5, 'delivered',   149.99),
(6, 'shipped',     639.98),
(7, 'cancelled',   29.99),
(2, 'delivered',   449.99),
(1, 'pending',     399.99);

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 1299.99), (1, 2, 1, 29.99),
(2, 3, 1, 49.99),   (2, 2, 1, 29.99),
(3, 4, 2, 149.99),  (3, 5, 1, 399.99),
(4, 1, 1, 1299.99),
(5, 7, 1, 449.99),
(6, 4, 1, 149.99),
(7, 6, 1, 599.99),  (7, 8, 1, 39.99),
(8, 2, 1, 29.99),
(9, 7, 1, 449.99),
(10, 5, 1, 399.99);
      `,
      diagram: `
erDiagram
    customers ||--o{ orders : places
    orders ||--|{ order_items : contains
    products ||--o{ order_items : "included in"
    
    customers {
        int customer_id PK
        varchar first_name
        varchar last_name
        varchar email UK
        varchar city
        varchar country
    }
    orders {
        int order_id PK
        int customer_id FK
        timestamp order_date
        varchar status
        decimal total_amount
    }
    products {
        int product_id PK
        varchar name
        varchar category
        decimal price
        int stock
    }
    order_items {
        int item_id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal unit_price
    }
      `,
    },
  ],
};
