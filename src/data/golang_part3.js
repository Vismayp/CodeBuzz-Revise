// ═══════════════════════════════════════════════════════════════
// GOLANG PART 3: GIN FRAMEWORK — END TO END
// ═══════════════════════════════════════════════════════════════

export const topicsPart3 = [
  {
    id: "gin-framework",
    title: "GIN Framework — Complete Guide",
    description: "Build production REST APIs with GIN: routing, middleware, validation, and more.",
    icon: "Server",
    sections: [
      {
        id: "gin-intro",
        title: "What is GIN & Setup",
        content: `
## What is GIN?

**GIN** is a high-performance HTTP web framework for Go. It's the **most popular** Go web framework with 70k+ GitHub stars.

### Why GIN?

| Feature | Benefit |
|---------|---------|
| **Speed** | ~40x faster than Martini, uses httprouter |
| **Middleware** | Built-in Logger, Recovery, CORS, etc. |
| **JSON Validation** | Automatic request binding & validation |
| **Route Grouping** | Organize APIs cleanly |
| **Error Management** | Built-in error handling |
| **Rendering** | JSON, XML, HTML, YAML support |

## Setup

\`\`\`bash
# Initialize project
mkdir go-api && cd go-api
go mod init github.com/yourname/go-api

# Install GIN
go get -u github.com/gin-gonic/gin
\`\`\`

## Hello World with GIN

\`\`\`go
package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

func main() {
    // Create router with default middleware (Logger + Recovery)
    r := gin.Default()

    // Define a GET route
    r.GET("/", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "message": "Hello, World!",
        })
    })

    // Run server on port 8080
    r.Run(":8080")
}
\`\`\`

\`\`\`bash
# Run it
go run main.go

# Test it
curl http://localhost:8080/
# {"message":"Hello, World!"}
\`\`\`

### gin.H vs Structs

\`gin.H\` is a shortcut for \`map[string]interface{}\`. For APIs, prefer **structs**:

\`\`\`go
// Using gin.H (quick & dirty)
c.JSON(200, gin.H{"name": "Alice", "age": 30})

// Using structs (recommended for production)
type UserResponse struct {
    Name string \`json:"name"\`
    Age  int    \`json:"age"\`
}
c.JSON(200, UserResponse{Name: "Alice", Age: 30})
\`\`\`
        `,
      },
      {
        id: "gin-routing",
        title: "Routing & Parameters",
        content: `
## Route Methods

\`\`\`go
r := gin.Default()

r.GET("/users", getUsers)        // List
r.GET("/users/:id", getUser)     // Get by ID
r.POST("/users", createUser)     // Create
r.PUT("/users/:id", updateUser)  // Update
r.PATCH("/users/:id", patchUser) // Partial update
r.DELETE("/users/:id", deleteUser) // Delete
\`\`\`

## Path Parameters

\`\`\`go
// /users/42
r.GET("/users/:id", func(c *gin.Context) {
    id := c.Param("id")
    c.JSON(200, gin.H{"user_id": id})
})

// /files/path/to/file.txt (wildcard)
r.GET("/files/*filepath", func(c *gin.Context) {
    filepath := c.Param("filepath")
    c.JSON(200, gin.H{"path": filepath})
})
\`\`\`

## Query Parameters

\`\`\`go
// /search?q=golang&page=2&limit=10
r.GET("/search", func(c *gin.Context) {
    query := c.Query("q")              // "golang"
    page := c.DefaultQuery("page", "1") // "2" (or "1" if missing)
    limit := c.DefaultQuery("limit", "10")

    c.JSON(200, gin.H{
        "query": query,
        "page":  page,
        "limit": limit,
    })
})
\`\`\`

## Route Groups (API Versioning)

\`\`\`go
r := gin.Default()

// v1 API
v1 := r.Group("/api/v1")
{
    v1.GET("/users", v1GetUsers)
    v1.GET("/users/:id", v1GetUser)
    v1.POST("/users", v1CreateUser)
}

// v2 API
v2 := r.Group("/api/v2")
{
    v2.GET("/users", v2GetUsers)
}

// With middleware on a group
admin := r.Group("/admin")
admin.Use(AuthMiddleware())
{
    admin.GET("/dashboard", adminDashboard)
    admin.DELETE("/users/:id", deleteUser)
}
\`\`\`
        `,
      },
      {
        id: "gin-request-binding",
        title: "Request Binding & Validation",
        content: `
## Binding JSON Request Body

GIN can automatically parse and validate request bodies:

\`\`\`go
type CreateUserInput struct {
    Name     string \`json:"name" binding:"required,min=2,max=50"\`
    Email    string \`json:"email" binding:"required,email"\`
    Age      int    \`json:"age" binding:"required,gte=1,lte=150"\`
    Password string \`json:"password" binding:"required,min=8"\`
    Role     string \`json:"role" binding:"oneof=admin user moderator"\`
}

r.POST("/users", func(c *gin.Context) {
    var input CreateUserInput

    // ShouldBindJSON — returns error if invalid
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error":   "Validation failed",
            "details": err.Error(),
        })
        return
    }

    // Input is valid, proceed
    c.JSON(http.StatusCreated, gin.H{
        "message": "User created",
        "user":    input,
    })
})
\`\`\`

### Common Validation Tags

| Tag | Meaning | Example |
|-----|---------|---------|
| \`required\` | Field must be present | \`binding:"required"\` |
| \`email\` | Must be valid email | \`binding:"email"\` |
| \`min=N\` | Minimum length/value | \`binding:"min=2"\` |
| \`max=N\` | Maximum length/value | \`binding:"max=100"\` |
| \`gte=N\` | Greater than or equal | \`binding:"gte=0"\` |
| \`lte=N\` | Less than or equal | \`binding:"lte=150"\` |
| \`oneof=a b c\` | Must be one of values | \`binding:"oneof=admin user"\` |
| \`url\` | Must be valid URL | \`binding:"url"\` |
| \`uuid\` | Must be valid UUID | \`binding:"uuid"\` |

## Binding Query Parameters

\`\`\`go
type PaginationQuery struct {
    Page  int    \`form:"page" binding:"gte=1"\`
    Limit int    \`form:"limit" binding:"gte=1,lte=100"\`
    Sort  string \`form:"sort" binding:"oneof=asc desc"\`
}

r.GET("/products", func(c *gin.Context) {
    var query PaginationQuery
    query.Page = 1   // defaults
    query.Limit = 10

    if err := c.ShouldBindQuery(&query); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    c.JSON(200, gin.H{"page": query.Page, "limit": query.Limit})
})
\`\`\`
        `,
      },
      {
        id: "gin-middleware",
        title: "Middleware Deep Dive",
        content: `
## What is Middleware?

Middleware are functions that run **before** or **after** your handler. They form a chain:

\`\`\`
Request → Logger → Auth → CORS → Handler → Response
\`\`\`

## Built-in Middleware

\`\`\`go
// gin.Default() includes:
r := gin.Default()
// → gin.Logger()   — logs every request
// → gin.Recovery() — recovers from panics

// gin.New() has NO middleware
r := gin.New()
r.Use(gin.Logger())
r.Use(gin.Recovery())
\`\`\`

## Custom Middleware

\`\`\`go
// Logger middleware
func RequestLogger() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        path := c.Request.URL.Path

        // Before handler
        c.Next()  // Process request

        // After handler
        duration := time.Since(start)
        status := c.Writer.Status()
        fmt.Printf("[%s] %s %d %v\\n",
            c.Request.Method, path, status, duration)
    }
}

// Auth middleware
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token == "" {
            c.JSON(401, gin.H{"error": "No token provided"})
            c.Abort()  // Stop the chain!
            return
        }

        // Validate token...
        claims, err := validateJWT(token)
        if err != nil {
            c.JSON(401, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        // Set user info for handlers to use
        c.Set("userID", claims.UserID)
        c.Set("role", claims.Role)

        c.Next()  // Continue to handler
    }
}

// CORS middleware
func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, OPTIONS")
        c.Writer.Header().Set("Access-Control-Allow-Headers",
            "Content-Type, Authorization")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}

// Rate limiter middleware
func RateLimiter(maxRequests int, window time.Duration) gin.HandlerFunc {
    limiter := make(map[string][]time.Time)
    var mu sync.Mutex

    return func(c *gin.Context) {
        mu.Lock()
        ip := c.ClientIP()
        now := time.Now()

        // Clean old entries
        var valid []time.Time
        for _, t := range limiter[ip] {
            if now.Sub(t) < window {
                valid = append(valid, t)
            }
        }
        limiter[ip] = valid

        if len(limiter[ip]) >= maxRequests {
            mu.Unlock()
            c.JSON(429, gin.H{"error": "Too many requests"})
            c.Abort()
            return
        }

        limiter[ip] = append(limiter[ip], now)
        mu.Unlock()
        c.Next()
    }
}

// Apply middleware
func main() {
    r := gin.New()
    r.Use(gin.Recovery())
    r.Use(CORSMiddleware())
    r.Use(RequestLogger())
    r.Use(RateLimiter(100, time.Minute))

    // Protected routes
    auth := r.Group("/api")
    auth.Use(AuthMiddleware())
    {
        auth.GET("/profile", getProfile)
        auth.PUT("/profile", updateProfile)
    }
}
\`\`\`

### Middleware Execution Flow

\`\`\`
Request comes in
    ↓
[CORS Middleware] — Before
    ↓
[Logger Middleware] — Before (start timer)
    ↓
[Auth Middleware] — Before (check token)
    ↓
[HANDLER] — Your business logic
    ↑
[Auth Middleware] — After
    ↑
[Logger Middleware] — After (log duration)
    ↑
[CORS Middleware] — After
    ↓
Response sent
\`\`\`
        `,
      },
      {
        id: "gin-error-handling",
        title: "Error Handling & Responses",
        content: `
## Standardized Error Response

\`\`\`go
// Define standard response structures
type APIResponse struct {
    Success bool        \`json:"success"\`
    Data    interface{} \`json:"data,omitempty"\`
    Error   *APIError   \`json:"error,omitempty"\`
}

type APIError struct {
    Code    int    \`json:"code"\`
    Message string \`json:"message"\`
}

// Helper functions
func SuccessResponse(c *gin.Context, status int, data interface{}) {
    c.JSON(status, APIResponse{Success: true, Data: data})
}

func ErrorResponse(c *gin.Context, status int, message string) {
    c.JSON(status, APIResponse{
        Success: false,
        Error:   &APIError{Code: status, Message: message},
    })
}

// Usage in handlers
r.GET("/users/:id", func(c *gin.Context) {
    id := c.Param("id")

    user, err := getUserByID(id)
    if err != nil {
        ErrorResponse(c, 404, "User not found")
        return
    }

    SuccessResponse(c, 200, user)
})
\`\`\`

## Graceful Shutdown

\`\`\`go
func main() {
    r := gin.Default()
    r.GET("/", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "ok"})
    })

    srv := &http.Server{
        Addr:    ":8080",
        Handler: r,
    }

    // Run server in goroutine
    go func() {
        if err := srv.ListenAndServe(); err != nil &&
            err != http.ErrServerClosed {
            log.Fatalf("listen: %s\\n", err)
        }
    }()

    // Wait for interrupt signal
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit
    log.Println("Shutting down server...")

    // 5 second timeout for graceful shutdown
    ctx, cancel := context.WithTimeout(
        context.Background(), 5*time.Second)
    defer cancel()

    if err := srv.Shutdown(ctx); err != nil {
        log.Fatal("Server forced to shutdown:", err)
    }
    log.Println("Server exited cleanly")
}
\`\`\`
        `,
      },
    ],
  },
];
