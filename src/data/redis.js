export const topics = [
  {
    id: "redis-intro",
    title: "Introduction to Redis",
    description:
      "Understanding Redis as an in-memory data structure store, its use cases, and basic setup.",
    icon: "Database",
    sections: [
      {
        id: "what-is-redis",
        title: "What is Redis?",
        content: `
**Redis** (Remote Dictionary Server) is an open-source, in-memory data structure store. It is often used as a database, cache, and message broker.

**Key Characteristics:**
*   **In-Memory**: Data is stored in RAM, offering sub-millisecond response times.
*   **Key-Value Store**: Data is stored as key-value pairs, but values can be complex data structures.
*   **Single-Threaded**: Redis uses a single thread for command execution (mostly), ensuring atomicity without complex locking, though I/O can be threaded.
*   **Persistence**: While in-memory, it can persist data to disk for durability.
        `,
        diagram: `
graph TD
    subgraph Traditional_DB [Traditional Database]
    Disk[(Disk Storage)]
    end
    subgraph Redis_In_Memory [Redis]
    RAM[(System RAM)]
    end
    
    App[Application] -->|"Read/Write (ms)"| Disk
    App -->|"Read/Write (micro-sec)"| RAM
    
    style RAM fill:#f96,stroke:#333,stroke-width:2px
    style Disk fill:#9cf,stroke:#333,stroke-width:2px
        `,
      },
      {
        id: "redis-use-cases",
        title: "Common Use Cases",
        content: `
Redis is versatile and fits many architectural patterns:

1.  **Caching**: Reducing load on primary databases by storing frequently accessed data (e.g., user sessions, API responses).
2.  **Pub/Sub**: Real-time messaging systems (chat rooms, notifications).
3.  **Queues**: Job management using Lists (e.g., background tasks like email sending).
4.  **Leaderboards**: Real-time ranking using Sorted Sets (gaming, social media).
5.  **Session Store**: Storing user authentication tokens with TTL (Time To Live).
        `,
      },
    ],
  },
  {
    id: "redis-data-types",
    title: "Core Data Types",
    description:
      "The heart of Redis: Strings, Lists, Sets, Hashes, and Sorted Sets.",
    icon: "Layers",
    sections: [
      {
        id: "strings",
        title: "Strings",
        content: `
**Strings** are the most basic Redis value. They are binary safe (can store text, images, serialized objects). Max size: 512MB.

**Common Commands:**
*   \`SET key value\`: Set a key.
*   \`GET key\`: Get a value.
*   \`INCR key\`: Atomic increment (great for counters).
*   \`EXPIRE key seconds\`: Set a time-to-live (TTL).
        `,
        code: `
SET user:100 "Alice"
GET user:100
// Output: "Alice"

SET visits 10
INCR visits
// Output: 11

SET session:xyz "data"
EXPIRE session:xyz 60
// Key vanishes after 60 seconds
        `,
      },
      {
        id: "lists",
        title: "Lists",
        content: `
**Lists** are linked lists of strings. Insertion and deletion at the head/tail are O(1), making them perfect for queues. Accessing elements by index is O(N).

**Use Case:** Message Queues, Recent Activity Feeds.
        `,
        code: `
LPUSH tasks "email_1"
LPUSH tasks "email_2"
// List: ["email_2", "email_1"]

RPUSH tasks "email_3"
// List: ["email_2", "email_1", "email_3"]

LPOP tasks
// Returns: "email_2"

LRANGE tasks 0 -1
// Returns all items
        `,
        diagram: `
graph LR
    subgraph List_Structure [List Structure]
    Head((Head)) --> Node1[Item A]
    Node1 --> Node2[Item B]
    Node2 --> Node3[Item C]
    Node3 --> Tail((Tail))
    end
    
    Action1[LPUSH] --> Head
    Action2[RPUSH] --> Tail
    Head --> Action3[LPOP]
    Tail --> Action4[RPOP]
        `,
      },
      {
        id: "hashes",
        title: "Hashes",
        content: `
**Hashes** are maps between string fields and string values. They are perfect for representing objects (e.g., a User).

**Use Case:** Storing user profiles, configuration settings.
        `,
        code: `
HSET user:100 name "Alice" age "30" role "admin"

HGET user:100 name
// Output: "Alice"

HGETALL user:100
// Output:
// 1) "name"
// 2) "Alice"
// 3) "age"
// 4) "30"
// ...
        `,
      },
      {
        id: "sets",
        title: "Sets",
        content: `
**Sets** are unordered collections of unique strings. You can perform set operations like union, intersection, and difference.

**Use Case:** Unique IP tracking, Tags, Social Graph (friends).
        `,
        code: `
SADD tags:news "politics" "economy"
SADD tags:tech "ai" "economy"

SMEMBERS tags:news
// Output: "politics", "economy"

SINTER tags:news tags:tech
// Output: "economy" (Intersection)
        `,
      },
      {
        id: "sorted-sets",
        title: "Sorted Sets (ZSets)",
        content: `
**Sorted Sets** are like Sets but every member is associated with a **score** (floating point number). Elements are sorted by score.

**Use Case:** Leaderboards, Priority Queues.
        `,
        code: `
ZADD leaderboard 100 "PlayerA"
ZADD leaderboard 200 "PlayerB"
ZADD leaderboard 150 "PlayerC"

ZRANGE leaderboard 0 -1
// Output: "PlayerA", "PlayerC", "PlayerB" (Ascending)

ZREVRANK leaderboard "PlayerB"
// Output: 0 (Rank 1, highest score)
        `,
      },
    ],
  },
  {
    id: "redis-advanced",
    title: "Advanced Concepts",
    description: "Pub/Sub messaging, Transactions, and Pipelining.",
    icon: "Activity",
    sections: [
      {
        id: "pub-sub",
        title: "Pub/Sub (Publish/Subscribe)",
        content: `
Redis implements the Publish/Subscribe messaging paradigm. Senders (publishers) send messages to channels, without knowing who (subscribers) will receive them.

**Note:** Messages are "fire and forget". If a subscriber is down, the message is lost (unlike a durable queue).
        `,
        code: `
// Terminal 1 (Subscriber)
SUBSCRIBE news_channel

// Terminal 2 (Publisher)
PUBLISH news_channel "Breaking News: Redis is fast!"

// Terminal 1 receives the message instantly
        `,
        diagram: `
sequenceDiagram
    participant Pub as Publisher
    participant Redis as Redis Server
    participant Sub1 as Subscriber A
    participant Sub2 as Subscriber B

    Sub1->>Redis: SUBSCRIBE channel_x
    Sub2->>Redis: SUBSCRIBE channel_x
    Pub->>Redis: PUBLISH channel_x "Hello"
    Redis->>Sub1: Message "Hello"
    Redis->>Sub2: Message "Hello"
        `,
      },
      {
        id: "transactions",
        title: "Transactions",
        content: `
Redis transactions allow the execution of a group of commands in a single step.
*   **MULTI**: Start transaction.
*   **EXEC**: Execute all queued commands.
*   **DISCARD**: Abort.
*   **WATCH**: Optimistic locking. Fails transaction if watched key changes before EXEC.

**Note:** Redis transactions are not fully ACID in the traditional SQL sense (no rollback on error inside the batch).
        `,
        code: `
WATCH balance
val = GET balance
val = val + 10
MULTI
SET balance $val
EXEC
        `,
      },
    ],
  },
  {
    id: "redis-persistence",
    title: "Persistence & Durability",
    description: "How Redis saves data to disk: RDB vs AOF.",
    icon: "Save",
    sections: [
      {
        id: "rdb-vs-aof",
        title: "RDB vs AOF",
        content: `
Redis provides two persistence options:

1.  **RDB (Redis Database)**:
    *   **Mechanism**: Point-in-time snapshots of your dataset at specified intervals (e.g., every 5 mins).
    *   **Pros**: Compact files, faster startup, good for backups.
    *   **Cons**: Data loss if crash happens between snapshots.

2.  **AOF (Append Only File)**:
    *   **Mechanism**: Logs every write operation received by the server.
    *   **Pros**: Higher durability (can sync every second or every query).
    *   **Cons**: Larger file size, slower restart than RDB.

**Best Practice**: Use both. RDB for backups, AOF for durability.
        `,
      },
    ],
  },
  {
    id: "redis-architecture",
    title: "Architecture & Scaling",
    description: "Replication, Sentinel, and Clustering for high availability.",
    icon: "Server",
    sections: [
      {
        id: "replication",
        title: "Replication (Master-Replica)",
        content: `
*   **Master**: Handles Writes (and Reads).
*   **Replica (Slave)**: Copies data from Master. Handles Reads (Read Scaling).
*   **Async**: Replication is asynchronous by default.
        `,
      },
      {
        id: "sentinel",
        title: "Redis Sentinel",
        content: `
Sentinel provides **High Availability (HA)**.
*   Monitors Master and Replicas.
*   **Automatic Failover**: If Master goes down, Sentinel promotes a Replica to be the new Master.
*   Acts as a configuration provider for clients.
        `,
        diagram: `
graph TD
    Client[Client App]
    
    subgraph Sentinel_Cluster
    S1[Sentinel 1]
    S2[Sentinel 2]
    S3[Sentinel 3]
    end
    
    subgraph Redis_Nodes
    M[Master]
    R1[Replica 1]
    R2[Replica 2]
    end
    
    Client -.->|"Ask for Master"| S1
    S1 -.->|"Monitor"| M
    S2 -.->|"Monitor"| M
    S3 -.->|"Monitor"| M
    
    M -->|"Replicate"| R1
    M -->|"Replicate"| R2
    
    style M fill:#f96
    style S1 fill:#9cf
        `,
      },
      {
        id: "cluster",
        title: "Redis Cluster",
        content: `
Redis Cluster provides **Sharding** (Horizontal Scaling).
*   Data is automatically split across multiple nodes using **Hash Slots** (16384 slots).
*   Allows you to store more data than can fit in a single server's RAM.
*   Has built-in replication and failover.
        `,
      },
    ],
  },
  {
    id: "redis-caching",
    title: "Caching Strategies",
    description: "Managing memory with eviction policies.",
    icon: "Cpu",
    sections: [
      {
        id: "eviction",
        title: "Eviction Policies",
        content: `
When Redis reaches its \`maxmemory\` limit, it must remove keys to accept new writes.

**Common Policies:**
*   **noeviction**: Returns error when memory is full (default).
*   **allkeys-lru**: Evicts **Least Recently Used** keys (most common for caching).
*   **volatile-lru**: Evicts LRU keys but only those with an \`expire\` set.
*   **allkeys-lfu**: Evicts **Least Frequently Used** keys.
*   **volatile-ttl**: Evicts keys with the shortest Time To Live remaining.
        `,
      },
    ],
  },
];
