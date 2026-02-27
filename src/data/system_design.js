// ═══════════════════════════════════════════════════════════════
// SYSTEM DESIGN — PART 1: Fundamentals & Building Blocks
// (Beginner → Interview Ready)
// ═══════════════════════════════════════════════════════════════

export const topicsPart1 = [
  {
    id: "sd-fundamentals",
    title: "System Design Fundamentals",
    description:
      "What is system design, thinking frameworks, and core principles.",
    icon: "BookOpen",
    sections: [
      {
        id: "what-is-system-design",
        title: "What is System Design?",
        content: `
**System Design** is the process of defining the architecture, components, modules, interfaces, and data flow of a system to meet specified requirements.

### 🤔 Why Learn System Design?
1. **Interviews** — Senior engineering roles heavily test system design
2. **Real-world Skills** — Build scalable, reliable systems
3. **Career Growth** — Architects and tech leads need this skill

### The Two Types of System Design:
| Type | Focus | Example Question |
|------|-------|-----------------|
| **High-Level Design (HLD)** | Architecture, components, data flow | "Design Twitter" |
| **Low-Level Design (LLD)** | Classes, interfaces, database schema | "Design a Parking Lot" |

### The System Design Interview Framework:
1. **Clarify Requirements** (3-5 min) — Ask questions, define scope
2. **Estimate Scale** (2-3 min) — Users, requests/sec, data size
3. **Define API** (3-5 min) — Key endpoints and data contracts
4. **High-Level Design** (10-15 min) — Draw the architecture
5. **Deep Dive** (10-15 min) — Tackle specific challenges
6. **Wrap Up** (3-5 min) — Discuss trade-offs, bottlenecks

### 🏗️ Analogy
System design is like **city planning**:
- You need roads (networking), buildings (servers), water supply (databases), traffic lights (load balancers), and backup generators (fault tolerance)
- You must plan for growth (scalability), emergencies (disaster recovery), and rush hour (peak traffic)
        `,
        diagram: `
graph LR
    R["Requirements"] --> E["Estimation"]
    E --> API["API Design"]
    API --> HLD["High-Level Design"]
    HLD --> DD["Deep Dive"]
    DD --> WU["Wrap Up"]
    style HLD fill:#8b5cf6,stroke:#fff,color:#fff
        `,
      },
      {
        id: "scaling-basics",
        title: "Scaling: Horizontal vs Vertical",
        content: `
### Vertical Scaling (Scale Up) ⬆️
Add more **power** to an existing machine (more CPU, RAM, disk).

**Pros:** Simple, no code changes
**Cons:** There's a hardware limit, single point of failure

### Horizontal Scaling (Scale Out) ➡️
Add more **machines** to distribute the load.

**Pros:** Virtually unlimited, fault-tolerant
**Cons:** Complex (need load balancing, data consistency)

### Real-World Example:
| Scenario | Vertical | Horizontal |
|----------|----------|------------|
| Database reads | Bigger server | Read replicas |
| Web traffic | Upgrade server | Add more servers + load balancer |
| Storage | Bigger disk | Distributed storage (S3, HDFS) |

### When to Scale What:
- **Start vertically** — Simpler until you hit limits
- **Scale horizontally** — When vertical limits are reached or you need fault tolerance
- **Cache** — Before scaling, check if caching can reduce load

### 🎯 Interview Tip
> "I'd first optimize the existing system (caching, query optimization), then scale vertically for simplicity, and finally scale horizontally when we need fault tolerance and capacity beyond a single machine."
        `,
        diagram: `
graph TD
    subgraph Vertical["Vertical Scaling"]
        S1["Small Server<br/>2 CPU, 4GB"] --> S2["Big Server<br/>32 CPU, 128GB"]
    end
    subgraph Horizontal["Horizontal Scaling"]
        LB["Load Balancer"]
        LB --> H1["Server 1"]
        LB --> H2["Server 2"]
        LB --> H3["Server 3"]
        LB --> H4["Server 4"]
    end
        `,
      },
      {
        id: "cap-theorem",
        title: "CAP Theorem & PACELC",
        content: `
### CAP Theorem
In a distributed system, you can only guarantee **2 out of 3**:

| Property | Meaning |
|----------|---------|
| **Consistency (C)** | All nodes see the same data at the same time |
| **Availability (A)** | Every request gets a response (even if stale) |
| **Partition Tolerance (P)** | System works even if network between nodes fails |

### The Reality:
Network partitions WILL happen in any distributed system. So you really choose between:
- **CP** (Consistency + Partition Tolerance) — System rejects requests during partitions (Bank systems)
- **AP** (Availability + Partition Tolerance) — System serves stale data during partitions (Social media feeds)

### Real-World Examples:
| System | Choice | Why |
|--------|--------|-----|
| **PostgreSQL** | CP | Financial data must be consistent |
| **Cassandra** | AP | Social feeds can be eventually consistent |
| **MongoDB** | CP (default) | Configurable consistency |
| **DynamoDB** | AP | High availability for e-commerce |

### PACELC Theorem (Extension):
If there's a **Partition (P)**: choose Availability (A) or Consistency (C)
**Else (E)**: choose Latency (L) or Consistency (C)

This captures the trade-off even when the network is healthy. Example:
- **DynamoDB**: PA/EL (Partition: Available, Else: Low Latency)
- **PostgreSQL**: PC/EC (Partition: Consistent, Else: Consistent)

### 🎯 Interview Tip
> "I'd choose based on business requirements. For a banking app, consistency is critical (CP). For a social media feed, availability matters more (AP) because showing slightly stale data is acceptable."
        `,
        diagram: `
graph TD
    CAP["CAP Theorem"]
    CAP --> C["Consistency<br/>All nodes same data"]
    CAP --> A["Availability<br/>Every request gets response"]
    CAP --> P["Partition Tolerance<br/>Works despite network failures"]
    C --- CP["CP Systems<br/>PostgreSQL, MongoDB"]
    A --- AP["AP Systems<br/>Cassandra, DynamoDB"]
    style CAP fill:#8b5cf6,color:#fff
        `,
      },
    ],
  },
  {
    id: "sd-building-blocks",
    title: "Building Blocks",
    description:
      "Load Balancers, CDNs, Caching, Databases, and Message Queues.",
    icon: "Server",
    sections: [
      {
        id: "load-balancers",
        title: "Load Balancers",
        content: `
A **Load Balancer** distributes incoming traffic across multiple servers.

### 🏗️ Analogy:
A load balancer is like a **restaurant host** who seats customers at different tables (servers) so no single table gets overwhelmed.

### Types:
| Type | Layer | Routes By | Example |
|------|-------|-----------|---------|
| **L4 (Transport)** | TCP/UDP | IP, Port | AWS NLB, HAProxy |
| **L7 (Application)** | HTTP | URL, Headers, Cookies | AWS ALB, NGINX |

### Load Balancing Algorithms:
| Algorithm | How It Works | Best For |
|-----------|-------------|----------|
| **Round Robin** | Cycles through servers 1, 2, 3, 1, 2, 3... | Equal-capacity servers |
| **Weighted Round Robin** | More traffic to powerful servers | Mixed-capacity servers |
| **Least Connections** | Sends to server with fewest active connections | Long-lived connections |
| **IP Hash** | Same client IP always goes to same server | Session stickiness |
| **Random** | Picks a random server | Simple, distributed |

### Health Checks:
Load balancers periodically check if servers are healthy:
- **Active**: LB pings each server (\`/health\` endpoint)
- **Passive**: LB monitors response errors

### Where to Place Load Balancers:
1. Between **clients** and **web servers**
2. Between **web servers** and **application servers**
3. Between **application servers** and **databases**
        `,
        diagram: `
graph TD
    Client["Clients"] --> LB1["L7 Load Balancer<br/>(NGINX / ALB)"]
    LB1 --> WS1["Web Server 1"]
    LB1 --> WS2["Web Server 2"]
    LB1 --> WS3["Web Server 3"]
    WS1 --> LB2["L4 Load Balancer"]
    WS2 --> LB2
    WS3 --> LB2
    LB2 --> DB1["DB Primary"]
    LB2 --> DB2["DB Replica"]
    style LB1 fill:#8b5cf6,color:#fff
        `,
      },
      {
        id: "caching",
        title: "Caching — The #1 Performance Optimization",
        content: `
**Caching** stores frequently accessed data in fast storage (RAM) to reduce latency and load on the primary data store.

### Cache Hit vs Cache Miss:
- **Cache Hit** — Data found in cache (fast! ~1ms)
- **Cache Miss** — Data NOT in cache → fetch from DB (~50-100ms)

### Caching Strategies:
| Strategy | How It Works | Use Case |
|----------|-------------|----------|
| **Cache-Aside (Lazy)** | App checks cache first, loads from DB on miss | Most common, general purpose |
| **Read-Through** | Cache itself loads from DB on miss | ORM-level caching |
| **Write-Through** | Write to cache AND DB simultaneously | Strong consistency needed |
| **Write-Behind (Write-Back)** | Write to cache, async flush to DB | High write throughput |
| **Write-Around** | Write to DB only, cache on read | Infrequently read data |

### Cache Eviction Policies:
| Policy | How It Works |
|--------|-------------|
| **LRU (Least Recently Used)** | Evict least recently accessed item |
| **LFU (Least Frequently Used)** | Evict least frequently accessed item |
| **TTL (Time-To-Live)** | Expire after X seconds |
| **FIFO** | Evict oldest item first |

### Where to Cache:
1. **Client-Side** — Browser cache, local storage
2. **CDN** — Static assets at edge locations
3. **Application** — In-memory (Redis, Memcached)
4. **Database** — Query cache, materialized views

### Common Pitfalls:
- **Cache Stampede** — Many requests hit DB when cache expires → solution: lock or pre-warming
- **Stale Data** — Cache not updated when DB changes → solution: TTL + event-driven invalidation
- **Cold Start** — Empty cache after restart → solution: cache pre-warming

### 🎯 Interview Tip
> "I'd use a cache-aside strategy with Redis. Set TTL based on how stale data can be. For hot data like user sessions, TTL of 30 minutes. For product catalogs, 5 minutes. Always plan for cache failures — the system should work (slower) without cache."
        `,
        diagram: `
graph LR
    App["Application"] -->|"1. Check Cache"| Cache["Redis Cache"]
    Cache -->|"HIT: Return data"| App
    Cache -->|"MISS"| DB["Database"]
    DB -->|"2. Return data"| App
    App -->|"3. Store in cache"| Cache
    style Cache fill:#f96,color:#fff
        `,
      },
      {
        id: "cdn",
        title: "CDN (Content Delivery Network)",
        content: `
A **CDN** is a globally distributed network of servers that cache content close to end users.

### 🏗️ Analogy:
Without CDN: A user in India requests an image from a server in the US → 200ms latency
With CDN: The image is cached at a CDN edge in Mumbai → 20ms latency

### How CDN Works:
1. User requests \`image.jpg\`
2. DNS resolves to **nearest CDN edge** (based on geography)
3. **Cache Hit** → Serve from edge (fast!)
4. **Cache Miss** → Fetch from origin server, cache at edge, then serve

### Types of CDN Content:
| Type | Examples | CDN Strategy |
|------|----------|-------------|
| **Static** | Images, CSS, JS, fonts | Always cache |
| **Dynamic** | API responses, personalized content | Cache with short TTL or don't cache |
| **Streaming** | Video, live streams | Edge streaming (HLS/DASH) |

### Popular CDNs:
- **Cloudflare** — Free tier, DDoS protection, Workers
- **AWS CloudFront** — Integrates with S3, Lambda@Edge
- **Vercel/Netlify Edge** — For frontend deployments
- **Akamai** — Enterprise-grade, largest network

### CDN Invalidation:
When you update content, you need to invalidate the cache:
\`\`\`bash
# Versioned URLs (recommended)
/assets/style.v2.css
/assets/bundle.abc123.js

# Purge (forced invalidation)
curl -X PURGE https://cdn.example.com/image.jpg
\`\`\`

### 🎯 Interview Tip
> "For static assets, I'd use a CDN with long TTLs and versioned filenames. For dynamic content, I'd either skip the CDN or use very short TTLs (30s). CDNs also provide DDoS protection as a bonus."
        `,
        diagram: `
graph TD
    User1["User (India)"] --> Edge1["CDN Edge<br/>Mumbai"]
    User2["User (US)"] --> Edge2["CDN Edge<br/>Virginia"]
    User3["User (Europe)"] --> Edge3["CDN Edge<br/>Frankfurt"]
    Edge1 -->|"Cache Miss"| Origin["Origin Server<br/>(us-east-1)"]
    Edge2 -->|"Cache Miss"| Origin
    Edge3 -->|"Cache Miss"| Origin
    style Origin fill:#8b5cf6,color:#fff
        `,
      },
      {
        id: "databases-overview",
        title: "Databases — SQL vs NoSQL",
        content: `
### SQL (Relational) Databases:
Structured data with relationships. Uses tables, rows, and SQL queries.

**Examples:** PostgreSQL, MySQL, Oracle, SQL Server
**Use When:**
- Data has clear relationships (users → orders → products)
- ACID transactions are required
- Complex queries (JOINs, aggregations)
- Schema is well-defined

### NoSQL Databases:
Flexible schema for unstructured/semi-structured data.

| Type | Examples | Use Case |
|------|----------|----------|
| **Document** | MongoDB, CouchDB | Content management, user profiles |
| **Key-Value** | Redis, DynamoDB | Sessions, caching, rate limiting |
| **Column-Family** | Cassandra, HBase | Time series, analytics, logs |
| **Graph** | Neo4j, Neptune | Social networks, recommendations |

### Decision Flowchart:
\`\`\`
Do you need ACID transactions? → SQL
Do you have unstructured data? → Document DB
Do you need ultra-fast key lookups? → Key-Value
Do you need to model relationships? → Graph DB
Do you need massive write throughput? → Column-Family
\`\`\`

### SQL vs NoSQL Comparison:
| Feature | SQL | NoSQL |
|---------|-----|-------|
| Schema | Fixed (migrations) | Flexible |
| Scaling | Vertical (mostly) | Horizontal (built-in) |
| Transactions | ACID | BASE (eventual consistency) |
| Joins | Native | Manual (denormalization) |
| Best For | Complex queries | High throughput, flexibility |

### 🎯 Interview Tip
> "I'd start with PostgreSQL for most systems — it handles 90% of use cases. If specific needs arise (high write throughput, flexible schema, graph queries), I'd introduce a specialized NoSQL database alongside it."
        `,
        diagram: `
graph TD
    Data["Data Needs"] --> Q1{"Structured<br/>with relationships?"}
    Q1 -->|"Yes"| SQL["SQL<br/>(PostgreSQL)"]
    Q1 -->|"No"| Q2{"Need fast<br/>key lookups?"}
    Q2 -->|"Yes"| KV["Key-Value<br/>(Redis)"]
    Q2 -->|"No"| Q3{"Flexible<br/>schema?"}
    Q3 -->|"Yes"| Doc["Document<br/>(MongoDB)"]
    Q3 -->|"No"| Q4{"Time series<br/>or analytics?"}
    Q4 -->|"Yes"| Col["Column<br/>(Cassandra)"]
    Q4 -->|"No"| Graph["Graph<br/>(Neo4j)"]
        `,
      },
      {
        id: "message-queues",
        title: "Message Queues & Event Streaming",
        content: `
**Message Queues** decouple producers (senders) from consumers (receivers), enabling asynchronous processing.

### 🏗️ Analogy:
A message queue is like a **post office**:
- Sender drops off a letter (message)
- Post office (queue) holds it
- Recipient picks it up when ready
- Sender doesn't wait for recipient to read it

### Types:
| Type | Examples | Key Feature |
|------|----------|-------------|
| **Message Queue** | RabbitMQ, SQS | Point-to-point, message consumed once |
| **Event Stream** | Kafka, Pulsar | Pub/Sub, messages retained, replay |

### When to Use Message Queues:
1. **Async Processing** — Email sending, image processing
2. **Decoupling Services** — Order service → Payment service
3. **Rate Limiting** — Absorb traffic spikes
4. **Event-Driven Architecture** — React to events (user signup → send welcome email)

### Key Terms:
- **Producer** — Sends messages
- **Consumer** — Receives messages
- **Queue/Topic** — Where messages are stored
- **Dead Letter Queue** — Failed messages go here for debugging
- **Backpressure** — Mechanism to slow down producers when consumers are overwhelmed

### Queue vs Stream:
| Feature | Queue (RabbitMQ) | Stream (Kafka) |
|---------|-----------------|----------------|
| Message consumed | Once (deleted) | Many times (retained) |
| Ordering | Per queue | Per partition |
| Replay | No | Yes |
| Throughput | Moderate | Very high |
| Use Case | Task distribution | Event sourcing, analytics |

### 🎯 Interview Tip
> "I'd use a message queue (RabbitMQ/SQS) for task-based work like sending emails. For event streaming where multiple consumers need to process the same events, I'd use Kafka."
        `,
        diagram: `
graph LR
    P1["Order Service"] -->|"order.created"| Q["Message Queue<br/>(RabbitMQ / Kafka)"]
    Q --> C1["Email Service<br/>(Send confirmation)"]
    Q --> C2["Inventory Service<br/>(Update stock)"]
    Q --> C3["Analytics Service<br/>(Track metrics)"]
    style Q fill:#8b5cf6,color:#fff
        `,
      },
    ],
  },
  {
    id: "sd-database-design",
    title: "Database Design & Scaling",
    description:
      "Sharding, Replication, Indexing, Partitioning, and Consistent Hashing.",
    icon: "Database",
    sections: [
      {
        id: "db-replication",
        title: "Database Replication",
        content: `
**Replication** copies data across multiple database servers.

### Types:
| Type | Description | Use Case |
|------|-------------|----------|
| **Master-Slave** | One writer (master), many readers (replicas) | Read-heavy workloads |
| **Master-Master** | Multiple writers | High availability, geo-distribution |
| **Sync Replication** | Writer waits for replica confirmation | Strong consistency |
| **Async Replication** | Writer doesn't wait | Better performance, eventual consistency |

### Master-Slave Architecture:
\`\`\`
Writes → Master → Replicates to → Replica 1
                                → Replica 2
                                → Replica 3
Reads  → Any Replica (load balanced)
\`\`\`

### What Happens When Master Fails?
1. **Automatic Failover** — A replica is promoted to master
2. **Data Loss Risk** — Async replicated data may be lost
3. **Split Brain** — Multiple nodes think they're master (solution: consensus protocols)

### 🎯 Interview Tip
> "For read-heavy systems, I'd use master-slave replication with async replication for performance. For write-heavy or globally distributed systems, I'd consider multi-master with conflict resolution."
        `,
        diagram: `
graph TD
    App["Application"]
    App -->|"Writes"| Master["Master DB"]
    App -->|"Reads"| LB["Read Load Balancer"]
    LB --> R1["Replica 1"]
    LB --> R2["Replica 2"]
    LB --> R3["Replica 3"]
    Master -->|"Replication"| R1
    Master -->|"Replication"| R2
    Master -->|"Replication"| R3
    style Master fill:#f96,color:#fff
        `,
      },
      {
        id: "db-sharding",
        title: "Database Sharding",
        content: `
**Sharding** splits a database into smaller pieces (**shards**) across multiple servers. Each shard holds a subset of the data.

### 🏗️ Analogy:
Sharding is like splitting a **phone book** into volumes:
- Volume A-F on Server 1
- Volume G-M on Server 2
- Volume N-S on Server 3
- Volume T-Z on Server 4

### Sharding Strategies:
| Strategy | How | Pros | Cons |
|----------|-----|------|------|
| **Hash-Based** | hash(user_id) % N | Even distribution | Hard to add shards |
| **Range-Based** | A-F, G-M, N-Z | Simple, range queries | Uneven distribution (hot spots) |
| **Geographic** | US → Shard 1, EU → Shard 2 | Low latency per region | Cross-region queries slow |
| **Directory-Based** | Lookup table maps key → shard | Flexible | Lookup table = single point of failure |

### Challenges:
1. **Joins Across Shards** — Very expensive, avoid if possible
2. **Resharding** — Adding/removing shards requires data migration
3. **Hot Spots** — Celebrity user data concentrated on one shard
4. **Transactions** — Cross-shard transactions are complex (2PC)

### Consistent Hashing (Solving the Resharding Problem):
Traditional hashing: \`hash(key) % N\` — changing N redistributes ALL data.
Consistent hashing: Uses a hash ring. Adding/removing a node only affects its neighbors.

| Operation | Traditional Hash | Consistent Hash |
|-----------|-----------------|-----------------|
| Add a node | ~100% data moves | ~1/N data moves |
| Remove a node | ~100% data moves | ~1/N data moves |

### 🎯 Interview Tip
> "I'd use consistent hashing with virtual nodes for even distribution. For the sharding key, I'd choose user_id since most queries are user-scoped. This ensures related data stays on the same shard."
        `,
        diagram: `
graph LR
    subgraph Hash_Ring["Consistent Hashing Ring"]
        direction TB
        N1["Node A<br/>(0-90°)"]
        N2["Node B<br/>(90-180°)"]
        N3["Node C<br/>(180-270°)"]
        N4["Node D<br/>(270-360°)"]
    end
    K1["Key 1"] --> N1
    K2["Key 2"] --> N2
    K3["Key 3"] --> N3
        `,
      },
      {
        id: "db-indexing",
        title: "Database Indexing",
        content: `
**Indexes** speed up read queries by creating a sorted lookup structure (like the index in a textbook).

### Without Index:
\`SELECT * FROM users WHERE email = 'x@y.com'\`
→ Full table scan: checks every row (O(n)) 🐌

### With Index on email:
→ B-Tree lookup: jumps directly to the row (O(log n)) 🚀

### Types of Indexes:
| Type | Structure | Use Case |
|------|-----------|----------|
| **B-Tree** (default) | Balanced tree | General purpose, range queries |
| **Hash** | Hash table | Exact match only (=), very fast |
| **GIN** | Inverted index | Full-text search, JSONB, arrays |
| **GiST** | R-Tree variant | Geospatial, text similarity |
| **BRIN** | Block range | Very large tables with natural order (timestamps) |

### Index Trade-offs:
| Benefit | Cost |
|---------|------|
| ✅ Faster reads (SELECT) | ❌ Slower writes (INSERT/UPDATE/DELETE) |
| ✅ Efficient sorting | ❌ Extra disk space |
| ✅ Enforce uniqueness | ❌ Index maintenance overhead |

### Common Indexing Mistakes:
1. **Over-indexing** — Too many indexes slow down writes
2. **Missing composite indexes** — \`WHERE a=1 AND b=2\` needs index on \`(a, b)\`
3. **Wrong column order** — In composite index \`(a, b)\`, queries on just \`b\` won't use the index
4. **Indexing low-cardinality columns** — Boolean or status columns with few distinct values

### 🎯 Interview Tip
> "I'd add indexes on columns used in WHERE, JOIN, and ORDER BY clauses. For write-heavy tables, I'd be selective to avoid slowing down inserts. I'd use composite indexes for multi-column queries, following the leftmost prefix rule."
        `,
        code: `-- Creating indexes
CREATE INDEX idx_users_email ON users(email);

-- Composite index (order matters!)
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);

-- Partial index (only index active users)
CREATE INDEX idx_active_users ON users(email) WHERE active = true;

-- Unique index
CREATE UNIQUE INDEX idx_users_unique_email ON users(email);

-- Check if query uses index
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'x@y.com';
-- Look for "Index Scan" vs "Seq Scan"`,
      },
    ],
  },
  {
    id: "sd-api-design",
    title: "API Design",
    description:
      "REST, GraphQL, gRPC, Rate Limiting, and API Gateway patterns.",
    icon: "Globe",
    sections: [
      {
        id: "rest-api",
        title: "REST API Design Best Practices",
        content: `
**REST** (Representational State Transfer) is the most common API architecture style.

### Core Principles:
1. **Stateless** — Each request contains all needed info
2. **Resource-Based** — URLs represent resources (nouns, not verbs)
3. **HTTP Methods** — CRUD mapped to HTTP verbs
4. **Consistent** — Predictable URL patterns

### HTTP Methods:
| Method | Action | Example |
|--------|--------|---------|
| GET | Read | \`GET /users/123\` |
| POST | Create | \`POST /users\` |
| PUT | Full Update | \`PUT /users/123\` |
| PATCH | Partial Update | \`PATCH /users/123\` |
| DELETE | Delete | \`DELETE /users/123\` |

### URL Design:
\`\`\`
✅ Good:
GET  /users                    # List users
GET  /users/123                # Get user 123
POST /users                    # Create user
GET  /users/123/orders         # User's orders
GET  /users/123/orders?status=active  # Filtered

❌ Bad:
GET  /getUser                  # Verb in URL
POST /createUser               # Verb in URL
GET  /users/123/getOrders      # Verb in URL
\`\`\`

### Pagination:
\`\`\`
# Offset-based (simple but slow for large datasets)
GET /users?page=2&limit=20

# Cursor-based (fast, recommended for large datasets)
GET /users?cursor=abc123&limit=20
\`\`\`

### Status Codes:
| Code | Meaning |
|------|---------|
| 200 | OK (success) |
| 201 | Created |
| 204 | No Content (deleted) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |
        `,
        code: `// REST API Response Best Practices
// Consistent response envelope:
{
  "success": true,
  "data": {
    "id": 123,
    "name": "Alice",
    "email": "alice@example.com"
  },
  "meta": {
    "total": 1000,
    "page": 2,
    "limit": 20,
    "nextCursor": "abc123"
  }
}

// Error response:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [
      { "field": "email", "message": "Must be a valid email" }
    ]
  }
}`,
      },
      {
        id: "rate-limiting",
        title: "Rate Limiting",
        content: `
**Rate Limiting** controls how many requests a client can make in a given time period.

### Why Rate Limit?
1. **Prevent Abuse** — Stop DDoS attacks, brute force
2. **Fair Usage** — Ensure one client doesn't monopolize resources
3. **Cost Control** — Limit expensive API calls
4. **Compliance** — Meet SLA requirements

### Common Algorithms:
| Algorithm | How It Works | Pros | Cons |
|-----------|-------------|------|------|
| **Fixed Window** | Count requests in fixed time windows (e.g., 100/minute) | Simple | Burst at window edges |
| **Sliding Window** | Weighted count across windows | Smooth | More memory |
| **Token Bucket** | Tokens added at fixed rate, request consumes a token | Allows bursts | Slightly complex |
| **Leaky Bucket** | Fixed output rate, excess queued | Smooth output | No bursts allowed |

### Token Bucket Example:
\`\`\`
Bucket size: 10 tokens
Refill rate: 1 token/second
- Burst of 10 requests → All succeed (bucket empties)
- Wait 5 seconds → 5 tokens available
- 7 requests → 5 succeed, 2 rejected (429)
\`\`\`

### Implementation:
\`\`\`
Client → API Gateway → Rate Limiter (Redis) → Backend
                              ↓
                        429 Too Many Requests
\`\`\`

### 🎯 Interview Tip
> "I'd implement rate limiting at the API Gateway level using Redis for distributed counting. Token bucket algorithm allows brief bursts while maintaining an average rate. Different tiers (free, premium) get different limits."
        `,
        diagram: `
graph LR
    Client["Client"] --> GW["API Gateway"]
    GW --> RL["Rate Limiter<br/>(Redis)"]
    RL -->|"Under limit"| Backend["Backend Service"]
    RL -->|"Over limit"| Reject["429 Too Many<br/>Requests"]
    style RL fill:#f96,color:#fff
        `,
      },
      {
        id: "api-comparison",
        title: "REST vs GraphQL vs gRPC",
        content: `
### Quick Comparison:
| Feature | REST | GraphQL | gRPC |
|---------|------|---------|------|
| **Protocol** | HTTP/1.1 | HTTP/1.1 | HTTP/2 |
| **Data Format** | JSON | JSON | Protobuf (binary) |
| **Schema** | OpenAPI (optional) | Required (SDL) | Required (.proto) |
| **Overfetching** | Common | No (client specifies) | No |
| **Underfetching** | Common (multiple calls) | No (one query) | No |
| **Real-time** | WebSockets/SSE | Subscriptions | Streaming |
| **Performance** | Good | Good | Excellent |
| **Use Case** | Public APIs | Mobile/frontend | Microservices |

### When to Use What:
- **REST** — Public APIs, simple CRUD, broad compatibility
- **GraphQL** — Complex UIs needing flexible data (mobile apps, dashboards)
- **gRPC** — Internal microservice communication, high-performance needs

### 🎯 Interview Tip
> "For client-facing APIs, I'd use REST for simplicity or GraphQL for flexibility. For internal service-to-service communication, gRPC is ideal because of HTTP/2 streaming and Protobuf's efficiency."
        `,
      },
    ],
  },
  {
    id: "sd-reliability",
    title: "Reliability & Fault Tolerance",
    description:
      "Redundancy, Circuit Breakers, Backpressure, and failure handling.",
    icon: "ShieldCheck",
    sections: [
      {
        id: "fault-tolerance-patterns",
        title: "Fault Tolerance Patterns",
        content: `
### The Goal: Design for Failure
In distributed systems, failures are not exceptional — they're **expected**. Design your system to handle them gracefully.

### Key Patterns:

#### 1. Redundancy
Have multiple instances of every critical component.
- **Active-Active** — All instances handle traffic
- **Active-Passive** — Standby takes over on failure

#### 2. Circuit Breaker
Prevents cascade failures by "breaking" the circuit when a service is down.
\`\`\`
States:
CLOSED (normal) → Service failing → OPEN (reject all calls)
                                          ↓ (after timeout)
                                    HALF-OPEN (try a few calls)
                                          ↓ (success)
                                    CLOSED (normal again)
\`\`\`

#### 3. Retry with Exponential Backoff
\`\`\`
Attempt 1: Wait 1s
Attempt 2: Wait 2s
Attempt 3: Wait 4s
Attempt 4: Wait 8s (+ random jitter)
\`\`\`
Add **jitter** (random delay) to prevent thundering herd.

#### 4. Timeouts
Always set timeouts! Without them, a slow dependency can block your entire system.

#### 5. Bulkhead Pattern
Isolate failures by partitioning resources (like watertight compartments in a ship).

#### 6. Graceful Degradation
If a non-critical service fails, return a fallback:
- Recommendation service down? Show popular items instead
- Avatar service down? Show default avatar
        `,
        diagram: `
graph LR
    subgraph Circuit_Breaker["Circuit Breaker"]
        Closed["CLOSED<br/>(Normal)"] -->|"Failures exceed threshold"| Open["OPEN<br/>(Reject all)"]
        Open -->|"Timeout expires"| HalfOpen["HALF-OPEN<br/>(Test requests)"]
        HalfOpen -->|"Success"| Closed
        HalfOpen -->|"Failure"| Open
    end
    style Closed fill:#4caf50,color:#fff
    style Open fill:#f44336,color:#fff
    style HalfOpen fill:#ff9800,color:#fff
        `,
      },
      {
        id: "availability-sla",
        title: "Availability & SLAs",
        content: `
### The Nines of Availability:
| Nines | Uptime | Downtime/Year | Downtime/Month |
|-------|--------|---------------|----------------|
| 99% (Two 9s) | 99.0% | 3.65 days | 7.3 hours |
| 99.9% (Three 9s) | 99.9% | 8.76 hours | 43.8 min |
| 99.99% (Four 9s) | 99.99% | 52.6 min | 4.38 min |
| 99.999% (Five 9s) | 99.999% | 5.26 min | 26.3 sec |

### SLA vs SLO vs SLI:
| Term | Meaning | Example |
|------|---------|---------|
| **SLI** (Indicator) | Metric measuring service health | 99.95% of requests < 200ms |
| **SLO** (Objective) | Target for an SLI | 99.9% availability |
| **SLA** (Agreement) | Contract with consequences | 99.9% uptime or credits issued |

### How to Calculate System Availability:
- **Series (all must work)**: A × B × C = 0.999 × 0.999 × 0.999 = 99.7%
- **Parallel (any can work)**: 1 - (1-A) × (1-B) = 1 - 0.001 × 0.001 = 99.9999%

### 🎯 Interview Tip
> "To achieve 99.99% availability, every component needs redundancy. I'd use active-active load balancers, database replicas with automatic failover, multi-AZ deployment, and health checks. The weakest link determines system availability."
        `,
      },
    ],
  },
];
