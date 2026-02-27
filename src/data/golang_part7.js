// ═══════════════════════════════════════════════════════════════
// GOLANG PART 7: ADVANCED NET/HTTP, CLEAN ARCHITECTURE & DBs
// ═══════════════════════════════════════════════════════════════

export const topicsPart7 = [
  {
    id: "advanced-net-http",
    title: "Deep Dive: net/http & Standard Library",
    description: "Understanding the inner workings of net/http, multiplexers, and request lifecycles.",
    icon: "Globe",
    sections: [
      {
        id: "net-http-implementation",
        title: "net/http Implementation Details",
        content: `
## The Core Interface: http.Handler

Everything in Go's HTTP world revolves around a single interface. If an object implements this, it can serve web requests:

\`\`\`go
type Handler interface {
    ServeHTTP(ResponseWriter, *Request)
}
\`\`\`

- **ResponseWriter**: An interface used to construct the HTTP response (status codes, headers, body).
- ***Request**: A struct containing everything the client sent (URL, Method, Headers, Form data, Body).

## Anatomy of a Go HTTP Server

When you run a server, Go starts a "Listen and Serve" loop.

### The Multiplexer (Mux)
A "Mux" is just a router. It matches the incoming URL to a specific function.
- \`http.ServeMux\`: The default router. It uses "most specific wins" matching.
- \`http.HandleFunc\`: A helper that converts a standard function into a Handler.

### The Request / Response Lifecycle (Under the Hood)
1. **TCP Listener**: Go binds a socket on the port by calling the underlying os's \`socket()\` and \`listen()\` syscalls.
2. **The \`Accept()\` Loop**: An infinite loop runs on the main thread, waiting for new connections.
3. **Goroutine Hand-off (The Magic)**: For every single incoming connection, Go spawns a new extremely lightweight Goroutine. This allows Go to handle thousands of concurrent users seamlessly.
4. **Parsing**: It reads raw bytes from the TCP connection and parses them into an \`http.Request\` object.

### Routing in Go 1.22+
Modern Go standard library supports HTTP methods and wildcards out of the box!

\`\`\`go
mux := http.NewServeMux()

// Method specific routing
mux.HandleFunc("GET /users", handleGetUsers)
mux.HandleFunc("POST /users", handleCreateUser)

// Wildcards!
mux.HandleFunc("GET /users/{id}", func(w http.ResponseWriter, r *http.Request) {
    userID := r.PathValue("id")
    w.Write([]byte("User ID: " + userID))
})
\`\`\`

## The Danger of Default Server

Never use \`http.ListenAndServe()\` directly in production because it has NO timeouts by default. A slow client could hang your server indefinitely (Slowloris attack).

**The Pro Approach (Custom Timeouts):**
\`\`\`go
func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("GET /health", healthCheckHandler)

    srv := &http.Server{
        Addr:         ":8080",
        Handler:      mux,
        ReadTimeout:  5 * time.Second,  // max time to read request
        WriteTimeout: 10 * time.Second, // max time to write response
        IdleTimeout:  120 * time.Second, // Keep-Alive timeout
    }

    if err := srv.ListenAndServe(); err != nil {
        log.Fatal(err)
    }
}
\`\`\`
        `,
      },
      {
        id: "thread-safety-mutex",
        title: "Thread-Safe Memory & Mutexes",
        content: `
## Concurrency vs Race Conditions

Because every HTTP request runs in its own Goroutine, modifying shared variables (like a slice or map) at the same time will cause a **Race Condition** leading to data corruption or crashes.

To fix this, we use \`sync.RWMutex\`.

\`\`\`go
import (
    "sync"
    "net/http"
    "encoding/json"
)

type TaskStore struct {
    sync.RWMutex
    tasks []Task
}

var store = TaskStore{
    tasks: []Task{{ID: 1, Title: "Learn Mutexes", Done: false}},
}
\`\`\`

### Using the Mutex

We use \`RLock\` (Read Lock) when we just need to read data (allows multiple readers at once). We use \`Lock\` when we need to write (blocks everyone else).

\`\`\`go
func tasksHandler(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case http.MethodGet:
        store.RLock()         // Allow other readers, block writers
        defer store.RUnlock()
        
        json.NewEncoder(w).Encode(store.tasks)

    case http.MethodPost:
        var t Task
        json.NewDecoder(r.Body).Decode(&t)

        store.Lock()          // Block EVERYONE (readers and writers)
        t.ID = len(store.tasks) + 1
        store.tasks = append(store.tasks, t)
        store.Unlock()        // Release immediately after writing

        w.WriteHeader(http.StatusCreated)
        json.NewEncoder(w).Encode(t)
    }
}
\`\`\`
        `
      }
    ],
  },
  {
    id: "clean-architecture-db",
    title: "Clean Architecture & PostgreSQL",
    description: "Structuring applications with the Repository Pattern, Context Cancellation, and Dependency Injection.",
    icon: "Database",
    sections: [
      {
        id: "context-cancellation",
        title: "Context & DB Cancellation",
        content: `
## Why Context Matters
In Go, Context is the "stop signal". If a user makes a request but closes their browser midway, context tells your database to stop processing the expensive query, saving CPU and memory.

\`\`\`go
func getTasksWithContext(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // 1. Get the context from the request
        ctx := r.Context()

        // 2. Pass context to the database (QueryContext instead of Query)
        rows, err := db.QueryContext(ctx, "SELECT id, title, done FROM tasks")
        
        if err != nil {
            if err == ctx.Err() {
                log.Println("Request cancelled by user")
                return 
            }
            http.Error(w, "Database error", 500)
            return
        }
        defer rows.Close()
        // ...
    }
}
\`\`\`
        `,
      },
      {
        id: "clean-arch-flow",
        title: "The Clean Architecture Flow",
        content: `
As your app grows, putting SQL queries inside handlers creates Spaghetti Code. We divide the code into layers.

1. **Model (What is it?)**: Data structure (Structs).
2. **Repository (The Hands)**: How do we save/get that data? (SQL Interfaces).
3. **Service (The Brain)**: Business Rules (e.g. "Email must be unique").
4. **Handler (The Face)**: HTTP transport, JSON to Go translation (Gin).

### 1. The Interface (Repository)
\`\`\`go
type UserRepository interface {
    GetByEmail(ctx context.Context, email string) (*User, error)
    Save(ctx context.Context, user *User) error
}
\`\`\`

### 2. The Implementation (Postgres)
\`\`\`go
type postgresUserRepository struct {
    db *sql.DB
}

func (r *postgresUserRepository) GetByEmail(ctx context.Context, email string) (*User, error) {
    var u User
    err := r.db.QueryRowContext(ctx, "SELECT id, email, name FROM users WHERE email = $1", email).
        Scan(&u.ID, &u.Email, &u.Name)

    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return nil, nil // Not found
        }
        return nil, err
    }
    return &u, nil
}

func (r *postgresUserRepository) Save(ctx context.Context, u *User) error {
    query := \`INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id\`
    // pointer to u.ID allows struct to update in-place
    return r.db.QueryRowContext(ctx, query, u.Email, u.Name).Scan(&u.ID)
}
\`\`\`

### 3. The Service
\`\`\`go
type UserService struct {
    repo UserRepository
}

func (s *UserService) RegisterUser(ctx context.Context, u *User) error {
    exists, _ := s.repo.GetByEmail(ctx, u.Email)
    if exists != nil {
        return errors.New("user already exists")
    }
    return s.repo.Save(ctx, u)
}
\`\`\`

### 4. Dependency Injection (Wiring it together)

**Understanding Struct Literals (\`&Type{...}\`)**
- \`Type{}\`: Create a new instance.
- \`field: value\`: Set specific field.
- \`&\`: Give me a pointer so I can share it efficiently across the app without copying memory.

\`\`\`go
func main() {
    db := connectDB()

    // Inject DB into Repo
    userRepo := &postgresUserRepository{db: db}

    // Inject Repo into Service
    userService := &UserService{repo: userRepo}

    // Inject Service into Handler
    userHandler := &UserHandler{svc: userService}

    r := gin.Default()
    r.POST("/register", userHandler.SignUp)
    r.Run()
}
\`\`\`
        `,
      },
    ],
  },
  {
    id: "jwt-auth-docker",
    title: "Security & Deployment",
    description: "Implementing JWT Authentication and Dockerizing Go Applications for production.",
    icon: "Lock",
    sections: [
      {
        id: "jwt-authentication",
        title: "JWT Authentication Implementation",
        content: `
## What is JWT?
JSON Web Tokens (JWT) are an open standard for securely transmitting information between parties as a JSON object. In Go, we use the \`github.com/golang-jwt/jwt/v5\` package.

### 1. Generating a Token
\`\`\`go
import (
    "time"
    "github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("super_secret_key_change_in_production")

// Custom Claims
type CustomClaims struct {
    UserID uint \`json:"user_id"\`
    jwt.RegisteredClaims
}

func GenerateToken(userID uint) (string, error) {
    claims := CustomClaims{
        UserID: userID,
        RegisteredClaims: jwt.RegisteredClaims{
            // Token expires in 24 hours
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
            Issuer:    "my-go-app",
        },
    }

    // Create the token with HS256 algorithm
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

    // Sign it securely
    return token.SignedString(jwtSecret)
}
\`\`\`

### 2. Validating a Token (Middleware)
Here is how to build a Gin middleware that extracts the token from the \`Authorization: Bearer <TOKEN>\` header.

\`\`\`go
import (
    "net/http"
    "strings"
    "fmt"
    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
            c.Abort()
            return
        }

        // Expected format: "Bearer <token>"
        parts := strings.Split(authHeader, " ")
        if len(parts) != 2 || parts[0] != "Bearer" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid auth header format"})
            c.Abort()
            return
        }

        tokenString := parts[1]

        // Parse and validate
        token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
            // Ensure the signing method is what we expect
            if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, fmt.Errorf("unexpected signing method")
            }
            return jwtSecret, nil
        })

        if err != nil || !token.Valid {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
            c.Abort()
            return
        }

        // Extract claims and pass to handler
        if claims, ok := token.Claims.(*CustomClaims); ok {
            c.Set("userID", claims.UserID) // Set variable in request context
            c.Next() // Move to the actual route handler!
        } else {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
        }
    }
}
\`\`\`

### 3. Using the Middleware
\`\`\`go
func main() {
    r := gin.Default()

    // Public routes
    r.POST("/login", loginHandler)
    r.POST("/register", registerHandler)

    // Private routes (wrapped in AuthMiddleware)
    protected := r.Group("/api")
    protected.Use(AuthMiddleware())
    {
        protected.GET("/profile", func(c *gin.Context) {
            // Retrieve the userID we set in the middleware!
            userID, _ := c.Get("userID")
            c.JSON(200, gin.H{"message": "Welcome!", "user_id": userID})
        })
    }

    r.Run(":8080")
}
\`\`\`
        `,
      },
      {
        id: "dockerizing-go",
        title: "Dockerizing Go Apps (Multi-Stage Builds)",
        content: `
## Why Multi-Stage Builds?
Go produces **static binaries**, meaning the final compiled program contains everything it needs to run. It doesn't need Go, Python, or Node.js installed on the server. 

By using Multi-Stage builds, we can use a large image to *build* the code, and a tiny, empty image to *run* it. This shrinks your Docker image from **~1GB down to ~15MB**!

### The Perfect Go Dockerfile
\`\`\`dockerfile
# ==========================================
# STAGE 1: Build the binary (The "Builder")
# ==========================================
# Use the official Go image. Alpine is lightweight.
FROM golang:1.24-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files first (for Docker layer caching)
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build the binary! 
# CGO_ENABLED=0 ensures a fully static binary with no C-library dependencies
# GOOS=linux GOARCH=amd64 targets linux servers
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main ./main.go

# ==========================================
# STAGE 2: Run the binary (The "Runner")
# ==========================================
# Use "scratch" (an empty image, 0 bytes!) or alpine if you need shell access
FROM alpine:latest

# Security best practice: add certificates for making HTTPS calls
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy ONLY the compiled binary from the builder stage
COPY --from=builder /app/main .

# Expose the API port
EXPOSE 8080

# Command to run when the container starts
CMD ["./main"]
\`\`\`

### Docker Compose for Go + Postgres
If your Go app needs a database to run locally:

\`\`\`yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USER=myuser
      - DB_PASSWORD=secret
      - DB_NAME=mydb
    depends_on:
      postgres:
        condition: service_healthy # Wait for DB to be genuinely ready

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U myuser -d mydb"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
\`\`\`
        `,
      }
    ],
  }
];
