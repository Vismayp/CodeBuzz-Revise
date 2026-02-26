// ═══════════════════════════════════════════════════════════════
// GOLANG PART 6: MICROSERVICE PROJECTS (HARD)
// ═══════════════════════════════════════════════════════════════

export const topicsPart6 = [
  {
    id: "microservice-intro",
    title: "Microservice Architecture Fundamentals",
    description: "Understanding microservices, communication patterns, and when to use them.",
    icon: "Share2",
    sections: [
      {
        id: "what-are-microservices",
        title: "What Are Microservices?",
        content: `
## Monolith vs Microservices

### Monolith
\`\`\`
┌─────────────────────────────────┐
│          MONOLITH APP           │
│  ┌─────┐ ┌─────┐ ┌───────────┐ │
│  │Users│ │Posts│ │Payments   │ │
│  │     │ │     │ │           │ │
│  └─────┘ └─────┘ └───────────┘ │
│         One Database            │
│         One Codebase            │
│         One Deployment          │
└─────────────────────────────────┘
\`\`\`

### Microservices
\`\`\`
┌──────────┐  ┌──────────┐  ┌──────────┐
│  User    │  │  Post    │  │ Payment  │
│ Service  │  │ Service  │  │ Service  │
│          │  │          │  │          │
│ Own DB   │  │ Own DB   │  │ Own DB   │
└──────────┘  └──────────┘  └──────────┘
     ↕              ↕              ↕
  ┌─────────── API Gateway ───────────┐
  └───────────────────────────────────┘
\`\`\`

## When to Use Microservices

| Use Microservices When... | Stick With Monolith When... |
|---------------------------|----------------------------|
| Team is large (10+) | Team is small (1-5) |
| Services need independent scaling | Uniform load across features |
| Different tech stacks needed | Consistent tech stack |
| Fault isolation is critical | Simplicity is priority |
| Frequent, independent deployments | Occasional deployments |

## Communication Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| **REST (HTTP)** | Synchronous request-response | User → Order Service |
| **gRPC** | High-performance inter-service | Service-to-service calls |
| **Message Queue** | Async, event-driven | Kafka, RabbitMQ |
| **Event Sourcing** | Audit trail, rebuild state | Financial transactions |

## Key Microservice Components

1. **API Gateway** — Single entry point for clients
2. **Service Discovery** — Services find each other (Consul, etcd)
3. **Load Balancer** — Distribute traffic
4. **Circuit Breaker** — Prevent cascade failures
5. **Message Broker** — Async communication (Kafka)
6. **Centralized Logging** — Aggregate logs (ELK stack)
7. **Distributed Tracing** — Track requests across services (Jaeger)
        `,
      },
    ],
  },

  {
    id: "project-ecommerce",
    title: "Project 4: E-Commerce Platform",
    description: "Multi-service e-commerce with User, Product, Order, and Payment services.",
    icon: "Share2",
    sections: [
      {
        id: "ecommerce-architecture",
        title: "E-Commerce — Architecture",
        content: `
## 🎯 System Overview

A microservices e-commerce platform with **4 services**:

\`\`\`
                    ┌─────────────────┐
                    │   API Gateway   │
                    │  (GIN + Proxy)  │
                    └───────┬─────────┘
             ┌──────────────┼──────────────┐
             ↓              ↓              ↓
      ┌────────────┐ ┌────────────┐ ┌────────────┐
      │   User     │ │  Product   │ │   Order    │
      │  Service   │ │  Service   │ │  Service   │
      │ :8081      │ │ :8082      │ │ :8083      │
      │ PostgreSQL │ │ PostgreSQL │ │ PostgreSQL │
      └────────────┘ └────────────┘ └────────────┘
                                          │
                                    ┌─────┴──────┐
                                    │  Payment   │
                                    │  Service   │
                                    │  :8084     │
                                    └────────────┘
\`\`\`

## Service Responsibilities

| Service | Responsibilities | Database Tables |
|---------|-----------------|-----------------|
| **User Service** | Registration, login, JWT, profiles | users, profiles |
| **Product Service** | Product CRUD, categories, inventory | products, categories |
| **Order Service** | Cart, checkout, order history | orders, order_items |
| **Payment Service** | Process payments, refunds | payments, transactions |

## Docker Compose Setup

\`\`\`yaml
version: '3.8'
services:
  gateway:
    build: ./gateway
    ports: ["8080:8080"]
    depends_on: [user-service, product-service, order-service]

  user-service:
    build: ./user-service
    ports: ["8081:8081"]
    environment:
      DB_HOST: user-db
    depends_on: [user-db]

  user-db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: users_db
      POSTGRES_PASSWORD: secret
    volumes: [user-data:/var/lib/postgresql/data]

  product-service:
    build: ./product-service
    ports: ["8082:8082"]
    depends_on: [product-db]

  product-db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: products_db
      POSTGRES_PASSWORD: secret

  order-service:
    build: ./order-service
    ports: ["8083:8083"]
    depends_on: [order-db]

  order-db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: orders_db
      POSTGRES_PASSWORD: secret

  payment-service:
    build: ./payment-service
    ports: ["8084:8084"]

volumes:
  user-data:
\`\`\`

## API Gateway (Central Router)

\`\`\`go
// gateway/main.go
package main

import (
    "net/http/httputil"
    "net/url"
    "github.com/gin-gonic/gin"
)

func proxyTo(target string) gin.HandlerFunc {
    return func(c *gin.Context) {
        remote, _ := url.Parse(target)
        proxy := httputil.NewSingleHostReverseProxy(remote)
        proxy.ServeHTTP(c.Writer, c.Request)
    }
}

func main() {
    r := gin.Default()

    // Route to appropriate services
    r.Any("/api/users/*path", proxyTo("http://user-service:8081"))
    r.Any("/api/auth/*path", proxyTo("http://user-service:8081"))
    r.Any("/api/products/*path", proxyTo("http://product-service:8082"))
    r.Any("/api/orders/*path", proxyTo("http://order-service:8083"))
    r.Any("/api/payments/*path", proxyTo("http://payment-service:8084"))

    r.Run(":8080")
}
\`\`\`

## Inter-Service Communication

\`\`\`go
// Order service calls User service to validate user
func validateUser(userID uint, token string) (*UserResponse, error) {
    client := &http.Client{Timeout: 5 * time.Second}
    req, _ := http.NewRequest("GET",
        fmt.Sprintf("http://user-service:8081/api/users/%d", userID), nil)
    req.Header.Set("Authorization", "Bearer "+token)

    resp, err := client.Do(req)
    if err != nil {
        return nil, fmt.Errorf("user service unavailable: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != 200 {
        return nil, fmt.Errorf("user not found")
    }

    var user UserResponse
    json.NewDecoder(resp.Body).Decode(&user)
    return &user, nil
}
\`\`\`

## Key Learning Points

1. **Service decomposition** — splitting by business domain
2. **Database per service** — each service owns its data
3. **API Gateway** pattern — single entry point
4. **Inter-service HTTP calls** with error handling
5. **Docker Compose** multi-service orchestration
6. **Environment-based** service discovery
        `,
      },
    ],
  },

  {
    id: "project-chat-system",
    title: "Project 5: Real-Time Chat System",
    description: "WebSocket-based chat with Auth Service, Chat Service, and Message Store.",
    icon: "MessageSquare",
    sections: [
      {
        id: "chat-architecture",
        title: "Chat System — Architecture",
        content: `
## 🎯 System Overview

A real-time chat system with **3 services**:

\`\`\`
Client (WebSocket)
    ↓
┌──────────────────────────────────────┐
│            API Gateway               │
└──────────┬──────────┬───────────────┘
           ↓          ↓
    ┌────────────┐  ┌──────────────┐
    │   Auth     │  │    Chat      │
    │  Service   │  │   Service    │
    │  :8081     │  │  :8082       │
    │ PostgreSQL │  │  WebSocket   │
    └────────────┘  │  + Redis     │
                    │  Pub/Sub     │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │   Message    │
                    │   Store      │
                    │  :8083       │
                    │  PostgreSQL  │
                    └──────────────┘
\`\`\`

## Chat Service — WebSocket Handler

\`\`\`go
// chat-service/handlers/websocket.go
package handlers

import (
    "sync"
    "github.com/gin-gonic/gin"
    "github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool { return true },
}

type Hub struct {
    clients    map[string]*Client
    rooms      map[string]map[string]*Client
    broadcast  chan Message
    register   chan *Client
    unregister chan *Client
    mu         sync.RWMutex
}

type Client struct {
    ID     string
    UserID string
    RoomID string
    Conn   *websocket.Conn
    Send   chan []byte
}

type Message struct {
    Type    string \`json:"type"\`
    RoomID  string \`json:"room_id"\`
    UserID  string \`json:"user_id"\`
    Content string \`json:"content"\`
    Time    string \`json:"time"\`
}

func NewHub() *Hub {
    return &Hub{
        clients:    make(map[string]*Client),
        rooms:      make(map[string]map[string]*Client),
        broadcast:  make(chan Message),
        register:   make(chan *Client),
        unregister: make(chan *Client),
    }
}

func (h *Hub) Run() {
    for {
        select {
        case client := <-h.register:
            h.mu.Lock()
            h.clients[client.ID] = client
            if h.rooms[client.RoomID] == nil {
                h.rooms[client.RoomID] = make(map[string]*Client)
            }
            h.rooms[client.RoomID][client.ID] = client
            h.mu.Unlock()

        case client := <-h.unregister:
            h.mu.Lock()
            delete(h.clients, client.ID)
            delete(h.rooms[client.RoomID], client.ID)
            close(client.Send)
            h.mu.Unlock()

        case msg := <-h.broadcast:
            h.mu.RLock()
            for _, client := range h.rooms[msg.RoomID] {
                select {
                case client.Send <- msgBytes:
                default:
                    close(client.Send)
                    delete(h.rooms[msg.RoomID], client.ID)
                }
            }
            h.mu.RUnlock()
        }
    }
}
\`\`\`

## Key Learning Points

1. **WebSocket** real-time communication in Go
2. **Hub pattern** — managing connected clients
3. **Redis Pub/Sub** — scaling WebSocket across multiple instances
4. **Message persistence** — storing chat history in PostgreSQL
5. **Room-based** broadcasting
6. **Concurrent access** with sync.RWMutex
        `,
      },
    ],
  },

  {
    id: "project-job-board",
    title: "Project 6: Job Board Platform",
    description: "Job Board with Job, Application, Notification services and API Gateway.",
    icon: "Target",
    sections: [
      {
        id: "job-board-architecture",
        title: "Job Board — Architecture",
        content: `
## 🎯 System Overview

A job board platform with **4 services** + API Gateway:

\`\`\`
                    ┌─────────────────┐
                    │   API Gateway   │
                    │  GIN + Auth     │
                    └───────┬─────────┘
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
 ┌────────────┐    ┌──────────────┐    ┌──────────────┐
 │   Job      │    │ Application  │    │ Notification │
 │  Service   │    │   Service    │    │   Service    │
 │  :8081     │    │   :8082      │    │   :8083      │
 │ PostgreSQL │    │  PostgreSQL  │    │   Email/SMS  │
 └────────────┘    └──────────────┘    └──────────────┘
\`\`\`

## Service Details

### Job Service
\`\`\`go
// Models
type Job struct {
    gorm.Model
    Title        string   \`json:"title" gorm:"not null"\`
    Company      string   \`json:"company" gorm:"not null"\`
    Description  string   \`json:"description" gorm:"type:text"\`
    Location     string   \`json:"location"\`
    Type         string   \`json:"type"\`         // full-time, part-time, contract
    Salary       string   \`json:"salary"\`
    Requirements []string \`json:"requirements" gorm:"type:text[]"\`
    PostedByID   uint     \`json:"posted_by_id"\`
    Status       string   \`json:"status" gorm:"default:active"\`
}

// Endpoints
// POST   /api/jobs         — Create job posting
// GET    /api/jobs         — List jobs (search, filter, paginate)
// GET    /api/jobs/:id     — Get job details
// PUT    /api/jobs/:id     — Update job
// DELETE /api/jobs/:id     — Close/delete job
\`\`\`

### Application Service
\`\`\`go
type Application struct {
    gorm.Model
    JobID       uint   \`json:"job_id" gorm:"not null"\`
    ApplicantID uint   \`json:"applicant_id" gorm:"not null"\`
    ResumeURL   string \`json:"resume_url"\`
    CoverLetter string \`json:"cover_letter" gorm:"type:text"\`
    Status      string \`json:"status" gorm:"default:pending"\`
    // pending → reviewed → shortlisted → accepted → rejected
}

// Endpoints
// POST /api/applications          — Apply to a job
// GET  /api/applications/my       — My applications
// GET  /api/jobs/:id/applications — Applications for a job (employer)
// PUT  /api/applications/:id      — Update status
\`\`\`

### Notification Service
\`\`\`go
type Notification struct {
    gorm.Model
    UserID  uint   \`json:"user_id"\`
    Type    string \`json:"type"\`    // application_received, status_update
    Title   string \`json:"title"\`
    Message string \`json:"message"\`
    Read    bool   \`json:"read" gorm:"default:false"\`
}

// Triggered by events from other services
// When application submitted → notify employer
// When status updated → notify applicant
\`\`\`

## Search & Filtering

\`\`\`go
func SearchJobs(c *gin.Context) {
    var jobs []models.Job
    query := database.DB

    // Search by keyword
    if keyword := c.Query("q"); keyword != "" {
        query = query.Where(
            "title ILIKE ? OR description ILIKE ? OR company ILIKE ?",
            "%"+keyword+"%", "%"+keyword+"%", "%"+keyword+"%",
        )
    }

    // Filter by location
    if location := c.Query("location"); location != "" {
        query = query.Where("location ILIKE ?", "%"+location+"%")
    }

    // Filter by type
    if jobType := c.Query("type"); jobType != "" {
        query = query.Where("type = ?", jobType)
    }

    // Pagination
    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
    limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
    offset := (page - 1) * limit

    var total int64
    query.Model(&models.Job{}).Count(&total)

    query.Order("created_at DESC").
        Offset(offset).Limit(limit).
        Find(&jobs)

    c.JSON(200, gin.H{
        "data":       jobs,
        "total":      total,
        "page":       page,
        "limit":      limit,
        "total_pages": (total + int64(limit) - 1) / int64(limit),
    })
}
\`\`\`

## Key Learning Points

1. **Full-text search** with PostgreSQL ILIKE
2. **Pagination** with offset/limit + total count
3. **Event-driven notifications** between services
4. **Status state machines** (application workflow)
5. **Multi-service** Docker orchestration
6. **API Gateway** with authentication pass-through
        `,
      },
    ],
  },
];
