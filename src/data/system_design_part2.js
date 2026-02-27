// ═══════════════════════════════════════════════════════════════
// SYSTEM DESIGN — PART 2: Real-World System Designs
// (Interview-Ready Examples with Step-by-Step Breakdowns)
// ═══════════════════════════════════════════════════════════════

export const topicsPart2 = [
  {
    id: "sd-url-shortener",
    title: "Design: URL Shortener",
    description:
      "Design a system like Bitly — a classic entry-level system design question.",
    icon: "Link",
    sections: [
      {
        id: "url-shortener-requirements",
        title: "Requirements & Estimation",
        content: `
### Functional Requirements:
1. Given a long URL, generate a short unique URL
2. Redirect short URL to the original URL
3. Optional: Custom short URLs, analytics, expiration

### Non-Functional Requirements:
- **High Availability** — Redirects should always work
- **Low Latency** — Redirect in <100ms
- **Short URLs should be short** — 7 characters max

### Back-of-Envelope Estimation:
\`\`\`
Write (new URLs): 100M/month ≈ 40 URLs/sec
Read (redirects): 10:1 read:write ratio ≈ 400 redirects/sec

Storage: 100M URLs × 500 bytes = 50GB/month
         For 5 years: 50GB × 60 = 3TB

Short URL space: 7 characters using [a-zA-Z0-9] = 62^7 ≈ 3.5 trillion
                 More than enough for 100M/month × 60 months = 6 billion URLs
\`\`\`
        `,
      },
      {
        id: "url-shortener-design",
        title: "High-Level Design",
        content: `
### API Design:
\`\`\`
POST /api/shorten
  Body: { "longUrl": "https://example.com/very/long/path" }
  Response: { "shortUrl": "https://short.ly/abc1234" }

GET /:shortCode
  Response: 301 Redirect to original URL
\`\`\`

### Key Decision: How to Generate Short Codes?

#### Option 1: Hash + Truncate
\`MD5(longUrl)\` → take first 7 characters
- **Pro:** Same URL always gives same code (dedup)
- **Con:** Collisions! Need to check DB and retry

#### Option 2: Counter-Based (Recommended)
Auto-increment ID → Base62 encode
- ID 12345 → Base62 → "dnh"
- **Pro:** No collisions, predictable
- **Con:** Sequential (guessable), need distributed counter

#### Option 3: Pre-generated Keys
Generate random keys in advance, store in a key DB
- Worker generates keys: "abc1234", "xyz5678", ...
- When request comes, pop a key from the pool
- **Pro:** Fast, no collision, no computation at request time
- **Con:** Key management complexity

### Architecture:
\`\`\`
Client → Load Balancer → API Server → Cache (Redis)
                                     → Database (PostgreSQL)
                                     → Key Generation Service
\`\`\`

### Database Schema:
\`\`\`sql
CREATE TABLE urls (
  id BIGSERIAL PRIMARY KEY,
  short_code VARCHAR(7) UNIQUE NOT NULL,
  long_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  click_count BIGINT DEFAULT 0
);
CREATE INDEX idx_short_code ON urls(short_code);
\`\`\`

### Redirect Flow:
1. User visits \`short.ly/abc1234\`
2. Check **Redis cache** for \`abc1234\` → Cache HIT? Return long URL
3. Cache MISS → Query **PostgreSQL** → Store in Redis → Return long URL
4. Return **301 (Permanent)** or **302 (Temporary)** redirect

### 🎯 Interview Tip
> "I'd use 301 redirects for permanent URLs (browser caches it) and 302 for temporary or analytics-tracked URLs (each click hits our server)."
        `,
        diagram: `
graph LR
    User["User"] -->|"GET /abc1234"| LB["Load Balancer"]
    LB --> API["API Server"]
    API -->|"1. Check cache"| Redis["Redis Cache"]
    Redis -->|"HIT"| API
    API -->|"2. Cache MISS"| DB["PostgreSQL"]
    DB --> API
    API -->|"3. Store in cache"| Redis
    API -->|"301 Redirect"| User
    style Redis fill:#f96,color:#fff
        `,
      },
    ],
  },
  {
    id: "sd-twitter-feed",
    title: "Design: Twitter/X Feed",
    description:
      "Design the home timeline — fan-out, caching, and feed generation.",
    icon: "Share2",
    sections: [
      {
        id: "twitter-requirements",
        title: "Requirements & Scale",
        content: `
### Functional Requirements:
1. Users can post tweets (280 chars + media)
2. Users follow other users
3. Home timeline shows tweets from followed users
4. Tweets are ordered by time (newest first)

### Non-Functional:
- Low latency feed loading (<200ms)
- High availability
- Eventually consistent is OK

### Scale Estimation:
\`\`\`
DAU: 200M users
Tweets: 500M/day ≈ 6000 tweets/sec
Reads: 200M users × 10 feed views/day = 2 billion reads/day ≈ 23,000 reads/sec
Average followers: 200
Celebrity followers: 10M+
\`\`\`
        `,
      },
      {
        id: "twitter-design",
        title: "Feed Generation: Fan-Out Strategy",
        content: `
### The Core Problem:
When User A opens their feed, how do we quickly show tweets from all 500 people they follow?

### Approach 1: Fan-Out on Read (Pull Model)
When user opens feed:
\`\`\`
1. Get list of people user follows (500 users)
2. For each followed user, get their recent tweets
3. Merge and sort by timestamp
4. Return top 50
\`\`\`
- **Pro:** Simple, no pre-computation
- **Con:** SLOW! 500 DB queries per feed load at read time

### Approach 2: Fan-Out on Write (Push Model)
When a tweet is posted:
\`\`\`
1. User posts a tweet
2. Get all followers (200 users)
3. Push the tweet to each follower's pre-computed feed (Redis list)
4. When follower opens app, just read their pre-computed feed
\`\`\`
- **Pro:** Feed reads are INSTANT (just read from Redis)
- **Con:** Celebrity problem! Posting 1 tweet → push to 10M feeds (slow)

### Approach 3: Hybrid (What Twitter Actually Does) ✅
\`\`\`
Regular users (< 10K followers) → Fan-out on WRITE
Celebrities (> 10K followers) → Fan-out on READ

When user opens feed:
1. Read pre-computed feed from Redis (fan-out on write results)
2. Fetch latest tweets from followed celebrities (fan-out on read)
3. Merge both, sort by time, return top 50
\`\`\`

### Architecture:
\`\`\`
Post Tweet → Tweet Service → Fan-out Service → Redis (per-user feed)
                           → Tweet Storage (PostgreSQL)

Read Feed → Feed Service → Redis (pre-computed) + Celebrity tweets → Merge → Response
\`\`\`

### 🎯 Interview Tip
> "The hybrid approach solves the celebrity problem. Regular users' tweets are pre-computed into followers' feeds. Celebrity tweets are fetched at read time and merged. This balances write amplification with read performance."
        `,
        diagram: `
graph TD
    subgraph Write_Path["Write Path"]
        Post["User Posts Tweet"]
        Post --> TS["Tweet Service"]
        TS --> DB["Tweet DB"]
        TS --> FO["Fan-out Service"]
        FO -->|"For regular users"| R1["Follower 1 Feed (Redis)"]
        FO --> R2["Follower 2 Feed (Redis)"]
        FO --> R3["Follower N Feed (Redis)"]
    end
    subgraph Read_Path["Read Path"]
        Open["User Opens Feed"]
        Open --> FS["Feed Service"]
        FS --> Redis["Pre-computed Feed (Redis)"]
        FS -->|"Fetch celebrity tweets"| CDB["Celebrity Tweets DB"]
        Redis --> Merge["Merge & Sort"]
        CDB --> Merge
        Merge --> Feed["Final Feed"]
    end
    style FO fill:#8b5cf6,color:#fff
    style Merge fill:#8b5cf6,color:#fff
        `,
      },
    ],
  },
  {
    id: "sd-chat-system",
    title: "Design: Chat System",
    description:
      "Design WhatsApp/Slack — real-time messaging, presence, and delivery.",
    icon: "MessageSquare",
    sections: [
      {
        id: "chat-requirements",
        title: "Requirements & Challenges",
        content: `
### Functional Requirements:
1. One-to-one messaging
2. Group messaging (up to 200 members)
3. Online/offline status (presence)
4. Message delivery receipts (sent, delivered, read)
5. Push notifications for offline users
6. Message history and search

### Non-Functional:
- **Real-time** — Sub-second message delivery
- **Reliability** — No message loss (at-least-once delivery)
- **Ordering** — Messages appear in correct order
- **Encryption** — End-to-end encryption for privacy

### Scale:
\`\`\`
DAU: 50M users
Messages: 500M/day
Concurrent connections: 10M WebSocket connections
Message size: ~1KB average
Storage: 500M × 1KB = 500GB/day ≈ 180TB/year
\`\`\`
        `,
      },
      {
        id: "chat-design",
        title: "Architecture & Message Flow",
        content: `
### Communication Protocol: WebSocket
HTTP is request-response (client initiates). Chat needs **server-push**.

| Protocol | Use Case |
|----------|----------|
| **WebSocket** | Persistent bidirectional connection (primary) |
| **HTTP** | Login, profile, history (fallback) |
| **SSE** | Server-sent events (one-way push) |

### Message Flow (1-to-1):
\`\`\`
1. User A sends message via WebSocket
2. Chat Server receives message
3. Store message in DB (Cassandra)
4. Check if User B is online:
   a. ONLINE → Push via WebSocket to User B's Chat Server
   b. OFFLINE → Send push notification + store for later delivery
5. User B connects → Fetch undelivered messages
\`\`\`

### Key Components:
| Component | Technology | Purpose |
|-----------|-----------|---------|
| Chat Servers | Node.js/Go + WebSocket | Real-time connection handling |
| Message Store | Cassandra / HBase | Write-heavy, time-series data |
| Message Queue | Kafka | Decouple chat servers, ensure delivery |
| Presence Service | Redis | Track online/offline status |
| Push Notification | FCM / APNs | Offline message alerts |
| API Servers | REST | User profiles, friend list, history |

### Group Messaging:
\`\`\`
User sends to Group (200 members):
1. Message → Chat Server → Kafka topic for group
2. Group Service fans out to 200 members
3. For each member:
   - Online? → Push via WebSocket
   - Offline? → Store + push notification
\`\`\`

### Message Ordering:
Use **message sequence IDs** (per conversation):
\`\`\`
Conversation: Alice ↔ Bob
msg_id: 1, 2, 3, 4, 5 (monotonically increasing)
\`\`\`
Client sorts by sequence ID, not timestamp (clocks can be out of sync).

### 🎯 Interview Tip
> "I'd use WebSockets for real-time push, Kafka for reliable message delivery, Cassandra for write-heavy message storage, and Redis for presence tracking. The key insight is separating the real-time path (WebSocket) from the persistence path (Kafka → DB)."
        `,
        diagram: `
graph LR
    A["User A<br/>(WebSocket)"] --> CS1["Chat Server 1"]
    CS1 --> Kafka["Kafka"]
    Kafka --> CS2["Chat Server 2"]
    Kafka --> DB["Cassandra<br/>(Message Store)"]
    CS2 --> B["User B<br/>(WebSocket)"]
    CS1 --> Presence["Redis<br/>(Presence)"]
    Kafka -->|"Offline"| Push["Push Notification<br/>Service"]
    style Kafka fill:#8b5cf6,color:#fff
        `,
      },
    ],
  },
  {
    id: "sd-youtube",
    title: "Design: Video Streaming (YouTube)",
    description:
      "Design a video upload, processing, and streaming platform.",
    icon: "Play",
    sections: [
      {
        id: "youtube-requirements",
        title: "Requirements & Scale",
        content: `
### Functional Requirements:
1. Upload videos
2. Stream/watch videos (adaptive bitrate)
3. Search videos
4. Video recommendations
5. Comments, likes, subscriptions

### Scale:
\`\`\`
DAU: 800M users
Video uploads: 500 hours of video/minute
Videos watched: 1 billion hours/day
Storage per video: ~1GB (original) → ~5GB (all formats)
CDN bandwidth: Massive (petabytes/day)
\`\`\`
        `,
      },
      {
        id: "youtube-design",
        title: "Video Upload & Processing Pipeline",
        content: `
### Upload Flow:
\`\`\`
1. Client uploads video to Upload Service
2. Upload Service stores original in blob storage (S3)
3. Message sent to Processing Queue (Kafka/SQS)
4. Video Processing Workers:
   a. Transcode to multiple resolutions (240p, 480p, 720p, 1080p, 4K)
   b. Generate thumbnails
   c. Extract metadata (duration, codec, resolution)
   d. Run content moderation (ML models)
5. Processed videos stored in CDN-origin storage
6. Database updated with video metadata
7. User notified: "Video is ready!"
\`\`\`

### Streaming: Adaptive Bitrate (ABR):
The video player automatically adjusts quality based on network speed.

| Protocol | Description |
|----------|-------------|
| **HLS** (HTTP Live Streaming) | Apple's protocol, most popular |
| **DASH** | Open standard, similar to HLS |

How ABR works:
\`\`\`
Video is split into segments (5-10 seconds each)
Each segment available in multiple qualities:
  segment_001_240p.ts  (200 Kbps)
  segment_001_480p.ts  (500 Kbps)
  segment_001_720p.ts  (1.5 Mbps)
  segment_001_1080p.ts (4 Mbps)

Player starts at low quality, monitors bandwidth, and switches up/down.
\`\`\`

### Architecture:

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Upload Service | API + S3 | Accept and store raw videos |
| Processing Pipeline | FFmpeg + Workers | Transcode, thumbnail, moderation |
| CDN | CloudFront / Akamai | Serve videos globally |
| Metadata DB | PostgreSQL | Video info, user data |
| Search | Elasticsearch | Full-text video search |
| Recommendations | ML Service | Personalized video suggestions |
| Analytics | Kafka + Flink | View counts, watch time |

### 🎯 Interview Tip
> "The key insight is separating upload (write-heavy, async) from streaming (read-heavy, CDN-served). Video processing is async via a queue — the user doesn't wait for transcoding. CDN placement near users ensures low-latency streaming."
        `,
        diagram: `
graph TD
    Upload["Video Upload"] --> US["Upload Service"]
    US --> S3["Blob Storage (S3)"]
    US --> Queue["Processing Queue"]
    Queue --> W1["Worker 1<br/>(Transcode)"]
    Queue --> W2["Worker 2<br/>(Thumbnail)"]
    Queue --> W3["Worker 3<br/>(Moderation)"]
    W1 --> CDN_Origin["CDN Origin Storage"]
    CDN_Origin --> CDN["CDN Edge Servers"]
    CDN --> Viewer["Viewers Worldwide"]
    style Queue fill:#8b5cf6,color:#fff
    style CDN fill:#f96,color:#fff
        `,
      },
    ],
  },
  {
    id: "sd-ride-sharing",
    title: "Design: Ride Sharing (Uber)",
    description:
      "Design a ride-sharing platform with real-time matching and tracking.",
    icon: "Map",
    sections: [
      {
        id: "uber-requirements",
        title: "Requirements & Challenges",
        content: `
### Functional Requirements:
1. Rider requests a ride (pickup → destination)
2. System matches rider with nearest available driver
3. Real-time location tracking for both parties
4. Fare estimation and payment
5. Rating system

### Key Challenges:
- **Real-time location updates** — Millions of drivers sending location every 3-5 seconds
- **Efficient proximity search** — Find nearest drivers among millions
- **Low latency matching** — Match rider to driver in <10 seconds
- **Surge pricing** — Adjust prices based on demand/supply

### Scale:
\`\`\`
Active drivers: 5M globally
Active riders: 20M/day
Rides: 15M/day
Location updates: 5M drivers × 1 update/4sec = 1.25M updates/sec
\`\`\`
        `,
      },
      {
        id: "uber-design",
        title: "Architecture & Location Matching",
        content: `
### Location Storage: GeoHash / QuadTree

**GeoHash** divides the world into a grid. Each cell has a code:
\`\`\`
"9q8yyk" → San Francisco
"9q8yym" → Adjacent cell
\`\`\`
Nearby drivers share the same GeoHash prefix.

**QuadTree** recursively divides space into 4 quadrants:
- Split cells that have too many drivers
- Don't split empty cells
- Efficiently find k-nearest neighbors

### Matching Flow:
\`\`\`
1. Rider requests ride at location (37.7749, -122.4194)
2. Compute GeoHash: "9q8yyk"
3. Search Redis for drivers in "9q8yyk" and adjacent cells
4. Rank by: distance, rating, ETA
5. Send ride request to top driver
6. Driver has 15 seconds to accept/reject
7. If rejected → try next driver
8. If accepted → start ride
\`\`\`

### Key Components:
| Service | Purpose |
|---------|---------|
| **Location Service** | Ingest driver GPS (1.25M/sec), store in Redis/QuadTree |
| **Matching Service** | Find nearest driver, run matching algorithm |
| **Trip Service** | Manage trip lifecycle (request → pickup → dropoff) |
| **Pricing Service** | Calculate fare, surge pricing |
| **ETA Service** | Estimate time of arrival using road network + ML |
| **Payment Service** | Process payments, driver payouts |
| **Notification Service** | Push ride updates to rider/driver |

### Real-Time Tracking:
\`\`\`
During ride:
- Driver app sends GPS every 3 seconds via WebSocket
- Location Service updates Redis
- Rider app receives driver location via WebSocket
- ETA recalculated periodically
\`\`\`

### Surge Pricing:
\`\`\`
Supply (available drivers in area): 10
Demand (ride requests in area): 50
Surge multiplier: Demand/Supply = 5x

Price = Base fare × Surge multiplier
\`\`\`

### 🎯 Interview Tip
> "The key challenge is efficient geospatial search at scale. I'd use GeoHash in Redis for O(1) lookups and QuadTree for k-nearest-neighbor queries. Driver locations are updated in-memory (Redis) every few seconds, not in a disk-based DB."
        `,
        diagram: `
graph TD
    Rider["Rider App"] -->|"Request Ride"| API["API Gateway"]
    Driver["Driver App"] -->|"Location (3s)"| LS["Location Service"]
    LS --> Redis["Redis<br/>(GeoHash Index)"]
    API --> MS["Matching Service"]
    MS --> Redis
    MS -->|"Best Match"| NS["Notification<br/>Service"]
    NS --> Driver
    NS --> Rider
    API --> Trip["Trip Service"]
    Trip --> Pricing["Pricing Service"]
    Trip --> Payment["Payment Service"]
    style MS fill:#8b5cf6,color:#fff
    style Redis fill:#f96,color:#fff
        `,
      },
    ],
  },
  {
    id: "sd-interview-cheatsheet",
    title: "System Design Cheat Sheet",
    description:
      "Quick reference for interviews — patterns, numbers, and decision frameworks.",
    icon: "Zap",
    sections: [
      {
        id: "numbers-everyone-should-know",
        title: "Latency Numbers Every Dev Should Know",
        content: `
### Key Latencies (Approximate):
| Operation | Time |
|-----------|------|
| L1 cache reference | 0.5 ns |
| L2 cache reference | 7 ns |
| RAM reference | 100 ns |
| SSD random read | 150 µs |
| HDD random read | 10 ms |
| Network round trip (same datacenter) | 0.5 ms |
| Network round trip (cross-continent) | 150 ms |
| Read 1 MB from RAM | 250 µs |
| Read 1 MB from SSD | 1 ms |
| Read 1 MB from network | 10 ms |
| Read 1 MB from HDD | 20 ms |

### Quick Estimation Powers of 2:
| Power | Value | Approx |
|-------|-------|--------|
| 2^10 | 1,024 | ~1 thousand (KB) |
| 2^20 | 1,048,576 | ~1 million (MB) |
| 2^30 | 1,073,741,824 | ~1 billion (GB) |
| 2^40 | ~1 trillion | (TB) |

### Time Conversions:
\`\`\`
1 day = 86,400 seconds ≈ 100K seconds
1 month ≈ 2.5M seconds
1 year ≈ 30M seconds
\`\`\`

### QPS (Queries Per Second) Quick Math:
\`\`\`
100M DAU × 10 requests/day = 1 billion requests/day
1 billion / 100K seconds = 10,000 QPS
Peak (2-3x average): 20,000-30,000 QPS
\`\`\`
        `,
      },
      {
        id: "common-patterns",
        title: "Common Design Patterns Reference",
        content: `
### Pattern Quick Reference:

| Pattern | When to Use | Example |
|---------|-------------|---------|
| **Load Balancer** | Distribute traffic | NGINX, AWS ALB |
| **CDN** | Serve static content globally | CloudFront, Cloudflare |
| **Cache** | Reduce DB load, speed up reads | Redis, Memcached |
| **Message Queue** | Async processing, decoupling | Kafka, RabbitMQ, SQS |
| **Database Sharding** | Scale writes beyond single DB | Hash-based, Range-based |
| **Read Replicas** | Scale reads | PostgreSQL replicas |
| **Consistent Hashing** | Distribute data evenly | Cassandra, DynamoDB |
| **Rate Limiter** | Prevent abuse | Token bucket in Redis |
| **Circuit Breaker** | Prevent cascade failures | Hystrix pattern |
| **API Gateway** | Single entry point, auth, routing | Kong, AWS API Gateway |
| **Service Mesh** | Microservice communication | Istio, Linkerd |
| **Event Sourcing** | Audit trail, temporal queries | Kafka + Event Store |
| **CQRS** | Separate read/write models | Different DBs for read/write |
| **Saga Pattern** | Distributed transactions | Choreography or Orchestration |
| **Bloom Filter** | Probabilistic membership test | Spam detection, cache prefetch |

### Database Selection Guide:
| Need | Choose | Example |
|------|--------|---------|
| ACID transactions | PostgreSQL / MySQL | Banking, orders |
| Flexible schema | MongoDB | Content management |
| High write throughput | Cassandra | IoT, time-series |
| Key-value lookups | Redis / DynamoDB | Sessions, cache |
| Full-text search | Elasticsearch | Product search |
| Graph relationships | Neo4j | Social networks |
| Wide-column analytics | ClickHouse / BigQuery | Analytics, reporting |

### Communication Patterns:
| Pattern | Protocol | Use Case |
|---------|----------|----------|
| Request-Response | REST / gRPC | Standard API calls |
| Pub/Sub | Kafka / Redis | Event-driven systems |
| WebSocket | WS | Real-time (chat, gaming) |
| SSE | HTTP | Server push (notifications) |
| Long Polling | HTTP | Fallback for real-time |
        `,
      },
      {
        id: "interview-framework-template",
        title: "Interview Answer Template",
        content: `
### Step-by-Step Template:

#### 1. Clarify (3 min)
\`\`\`
"Before I design, let me clarify the requirements..."
- What are the core features? (MVP scope)
- Who are the users? (B2C, B2B, internal)
- What's the scale? (users, requests, data size)
- What are the constraints? (latency, consistency, budget)
- Are there any existing systems to integrate with?
\`\`\`

#### 2. Estimate (2 min)
\`\`\`
"Let me do some quick back-of-envelope math..."
- DAU → QPS (requests/sec)
- Storage requirements (per record × growth)
- Bandwidth (data transfer/sec)
- Cache size (hot data %)
\`\`\`

#### 3. API Design (3 min)
\`\`\`
"Here are the key API endpoints..."
- Define 3-5 core endpoints
- Request/response schemas
- Authentication approach
\`\`\`

#### 4. High-Level Design (10 min)
\`\`\`
"Let me draw the architecture..."
- Start with client → load balancer → service → DB
- Add components as needed (cache, queue, CDN)
- Show data flow arrows
- Label technologies
\`\`\`

#### 5. Deep Dive (10 min)
\`\`\`
"Let me dive deeper into..."
- The most interesting/challenging component
- Data model / schema design
- How specific scenarios work (step-by-step)
- Scaling challenges and solutions
\`\`\`

#### 6. Wrap Up (2 min)
\`\`\`
"To summarize the trade-offs..."
- What trade-offs did I make?
- What would I do with more time?
- How would I monitor this system?
- What are potential failure points?
\`\`\`

### Pro Tips:
- **Drive the conversation** — Don't wait for hints
- **Think out loud** — The interviewer should follow your reasoning
- **Acknowledge trade-offs** — "I chose X over Y because..."
- **Start simple, then optimize** — Don't jump to micro-optimization
- **Draw on the board** — Visual communication is powerful
        `,
      },
    ],
  },
];
