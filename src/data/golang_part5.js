// ═══════════════════════════════════════════════════════════════
// GOLANG PART 5: GUIDED PROJECTS (SIMPLE)
// ═══════════════════════════════════════════════════════════════

export const topicsPart5 = [
  {
    id: "project-todo-api",
    title: "Project 1: Todo API",
    description: "Build a full CRUD REST API with GIN and PostgreSQL from scratch.",
    icon: "Code",
    sections: [
      {
        id: "todo-overview",
        title: "Todo API — Architecture",
        content: `
## 🎯 What You'll Build

A complete **Todo REST API** with:
- CRUD operations (Create, Read, Update, Delete)
- PostgreSQL database with GORM
- Input validation
- Error handling
- Proper project structure

## Architecture

\`\`\`
Client (Postman/curl)
    ↓ HTTP
[GIN Router] → [Handler] → [Service] → [Repository] → [PostgreSQL]
\`\`\`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/todos | List all todos |
| GET | /api/todos/:id | Get single todo |
| POST | /api/todos | Create a todo |
| PUT | /api/todos/:id | Update a todo |
| DELETE | /api/todos/:id | Delete a todo |

## Setup

\`\`\`bash
mkdir todo-api && cd todo-api
go mod init github.com/yourname/todo-api
go get -u github.com/gin-gonic/gin
go get -u gorm.io/gorm
go get -u gorm.io/driver/postgres
\`\`\`

## Project Structure

\`\`\`
todo-api/
├── main.go
├── models/
│   └── todo.go
├── handlers/
│   └── todo_handler.go
├── database/
│   └── database.go
├── .env
├── go.mod
└── go.sum
\`\`\`
        `,
      },
      {
        id: "todo-implementation",
        title: "Todo API — Full Implementation",
        content: `
## Step 1: Database Connection

\`\`\`go
// database/database.go
package database

import (
    "fmt"
    "log"
    "gorm.io/gorm"
    "gorm.io/driver/postgres"
)

var DB *gorm.DB

func Connect() {
    dsn := "host=localhost user=postgres password=secret " +
        "dbname=todo_db port=5432 sslmode=disable"

    var err error
    DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
    fmt.Println("✅ Database connected")
}
\`\`\`

## Step 2: Model

\`\`\`go
// models/todo.go
package models

import "gorm.io/gorm"

type Todo struct {
    gorm.Model
    Title       string \`json:"title" gorm:"not null" binding:"required,min=1"\`
    Description string \`json:"description"\`
    Completed   bool   \`json:"completed" gorm:"default:false"\`
    Priority    string \`json:"priority" gorm:"default:medium" binding:"oneof=low medium high"\`
}

type UpdateTodoInput struct {
    Title       *string \`json:"title" binding:"omitempty,min=1"\`
    Description *string \`json:"description"\`
    Completed   *bool   \`json:"completed"\`
    Priority    *string \`json:"priority" binding:"omitempty,oneof=low medium high"\`
}
\`\`\`

## Step 3: Handlers

\`\`\`go
// handlers/todo_handler.go
package handlers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/yourname/todo-api/database"
    "github.com/yourname/todo-api/models"
)

// GET /api/todos
func GetTodos(c *gin.Context) {
    var todos []models.Todo
    result := database.DB.Order("created_at desc").Find(&todos)
    if result.Error != nil {
        c.JSON(500, gin.H{"error": "Failed to fetch todos"})
        return
    }
    c.JSON(200, gin.H{
        "count": len(todos),
        "data":  todos,
    })
}

// GET /api/todos/:id
func GetTodo(c *gin.Context) {
    var todo models.Todo
    if err := database.DB.First(&todo, c.Param("id")).Error; err != nil {
        c.JSON(404, gin.H{"error": "Todo not found"})
        return
    }
    c.JSON(200, todo)
}

// POST /api/todos
func CreateTodo(c *gin.Context) {
    var input models.Todo
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    if err := database.DB.Create(&input).Error; err != nil {
        c.JSON(500, gin.H{"error": "Failed to create todo"})
        return
    }
    c.JSON(201, input)
}

// PUT /api/todos/:id
func UpdateTodo(c *gin.Context) {
    var todo models.Todo
    if err := database.DB.First(&todo, c.Param("id")).Error; err != nil {
        c.JSON(404, gin.H{"error": "Todo not found"})
        return
    }

    var input models.UpdateTodoInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    database.DB.Model(&todo).Updates(input)
    c.JSON(200, todo)
}

// DELETE /api/todos/:id
func DeleteTodo(c *gin.Context) {
    if err := database.DB.Delete(&models.Todo{}, c.Param("id")).Error; err != nil {
        c.JSON(500, gin.H{"error": "Failed to delete"})
        return
    }
    c.JSON(200, gin.H{"message": "Todo deleted"})
}
\`\`\`

## Step 4: Main Entry Point

\`\`\`go
// main.go
package main

import (
    "github.com/gin-gonic/gin"
    "github.com/yourname/todo-api/database"
    "github.com/yourname/todo-api/handlers"
    "github.com/yourname/todo-api/models"
)

func main() {
    // Connect to DB
    database.Connect()
    database.DB.AutoMigrate(&models.Todo{})

    r := gin.Default()

    api := r.Group("/api")
    {
        api.GET("/todos", handlers.GetTodos)
        api.GET("/todos/:id", handlers.GetTodo)
        api.POST("/todos", handlers.CreateTodo)
        api.PUT("/todos/:id", handlers.UpdateTodo)
        api.DELETE("/todos/:id", handlers.DeleteTodo)
    }

    r.Run(":8080")
}
\`\`\`

## Testing with curl

\`\`\`bash
# Create
curl -X POST http://localhost:8080/api/todos \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Learn Go","description":"Complete the tutorial","priority":"high"}'

# List all
curl http://localhost:8080/api/todos

# Get one
curl http://localhost:8080/api/todos/1

# Update
curl -X PUT http://localhost:8080/api/todos/1 \\
  -H "Content-Type: application/json" \\
  -d '{"completed": true}'

# Delete
curl -X DELETE http://localhost:8080/api/todos/1
\`\`\`
        `,
      },
    ],
  },

  {
    id: "project-url-shortener",
    title: "Project 2: URL Shortener",
    description: "Build a URL shortener with GIN, PostgreSQL, and short code generation.",
    icon: "Link",
    sections: [
      {
        id: "url-shortener-design",
        title: "URL Shortener — Design & Implementation",
        content: `
## 🎯 What You'll Build

A **URL Shortening Service** (like bit.ly) with:
- Generate short codes for long URLs
- Redirect short URLs to original URLs
- Track click counts
- PostgreSQL storage

## API Design

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/shorten | Create short URL |
| GET | /:code | Redirect to original URL |
| GET | /api/stats/:code | Get URL statistics |

## Complete Implementation

\`\`\`go
// models/url.go
package models

import "gorm.io/gorm"

type URL struct {
    gorm.Model
    OriginalURL string \`json:"original_url" gorm:"not null" binding:"required,url"\`
    ShortCode   string \`json:"short_code" gorm:"uniqueIndex;not null"\`
    Clicks      int64  \`json:"clicks" gorm:"default:0"\`
    ExpiresAt   *time.Time \`json:"expires_at,omitempty"\`
}
\`\`\`

\`\`\`go
// utils/shortcode.go
package utils

import (
    "crypto/rand"
    "encoding/base64"
    "strings"
)

func GenerateShortCode(length int) string {
    bytes := make([]byte, length)
    rand.Read(bytes)
    code := base64.URLEncoding.EncodeToString(bytes)
    code = strings.ReplaceAll(code, "=", "")
    code = strings.ReplaceAll(code, "-", "")
    code = strings.ReplaceAll(code, "_", "")
    if len(code) > length {
        code = code[:length]
    }
    return code
}
\`\`\`

\`\`\`go
// handlers/url_handler.go
package handlers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/yourname/url-shortener/database"
    "github.com/yourname/url-shortener/models"
    "github.com/yourname/url-shortener/utils"
)

func ShortenURL(c *gin.Context) {
    var input struct {
        URL string \`json:"url" binding:"required,url"\`
    }
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    // Check if URL already exists
    var existing models.URL
    if err := database.DB.Where("original_url = ?", input.URL).First(&existing).Error; err == nil {
        c.JSON(200, gin.H{
            "short_url": "http://localhost:8080/" + existing.ShortCode,
            "code":      existing.ShortCode,
        })
        return
    }

    // Generate unique short code
    code := utils.GenerateShortCode(6)
    url := models.URL{OriginalURL: input.URL, ShortCode: code}
    database.DB.Create(&url)

    c.JSON(201, gin.H{
        "short_url": "http://localhost:8080/" + code,
        "code":      code,
    })
}

func RedirectURL(c *gin.Context) {
    code := c.Param("code")
    var url models.URL
    if err := database.DB.Where("short_code = ?", code).First(&url).Error; err != nil {
        c.JSON(404, gin.H{"error": "URL not found"})
        return
    }

    // Increment click count
    database.DB.Model(&url).Update("clicks", gorm.Expr("clicks + 1"))
    c.Redirect(http.StatusMovedPermanently, url.OriginalURL)
}

func GetStats(c *gin.Context) {
    code := c.Param("code")
    var url models.URL
    if err := database.DB.Where("short_code = ?", code).First(&url).Error; err != nil {
        c.JSON(404, gin.H{"error": "URL not found"})
        return
    }
    c.JSON(200, url)
}
\`\`\`

## Key Learning Points

1. **Random code generation** using crypto/rand
2. **Database uniqueness** constraints
3. **HTTP redirects** (301 vs 302)
4. **Atomic counter updates** with \`gorm.Expr\`
5. **URL validation** with binding tags
        `,
      },
    ],
  },

  {
    id: "project-blog-api",
    title: "Project 3: Blog API with Auth",
    description: "Full blog API with JWT authentication, CRUD, pagination, and relationships.",
    icon: "BookOpen",
    sections: [
      {
        id: "blog-api-design",
        title: "Blog API — Auth & Design",
        content: `
## 🎯 What You'll Build

A **Blog REST API** with:
- User registration & login (JWT)
- CRUD for blog posts
- Pagination & filtering
- User-Post relationships

## API Design

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Register |
| POST | /api/auth/login | ❌ | Login (get JWT) |
| GET | /api/posts | ❌ | List posts (paginated) |
| GET | /api/posts/:id | ❌ | Get single post |
| POST | /api/posts | ✅ | Create post |
| PUT | /api/posts/:id | ✅ | Update own post |
| DELETE | /api/posts/:id | ✅ | Delete own post |

## JWT Authentication Flow

\`\`\`
1. User registers → password hashed with bcrypt → stored in DB
2. User logs in → credentials verified → JWT token returned
3. User sends JWT in Authorization header → middleware validates
4. Protected handler reads user ID from context
\`\`\`

## Key Code: JWT Middleware

\`\`\`go
// middleware/auth.go
package middleware

import (
    "fmt"
    "strings"
    "time"
    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("your-secret-key")

type Claims struct {
    UserID uint   \`json:"user_id"\`
    Email  string \`json:"email"\`
    jwt.RegisteredClaims
}

func GenerateToken(userID uint, email string) (string, error) {
    claims := Claims{
        UserID: userID,
        Email:  email,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
        },
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtSecret)
}

func AuthRequired() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(401, gin.H{"error": "Authorization header required"})
            c.Abort()
            return
        }

        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        claims := &Claims{}
        token, err := jwt.ParseWithClaims(tokenString, claims,
            func(token *jwt.Token) (interface{}, error) {
                return jwtSecret, nil
            })

        if err != nil || !token.Valid {
            c.JSON(401, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        c.Set("userID", claims.UserID)
        c.Set("email", claims.Email)
        c.Next()
    }
}
\`\`\`

## Key Code: Auth Handlers

\`\`\`go
// handlers/auth_handler.go
func Register(c *gin.Context) {
    var input struct {
        Name     string \`json:"name" binding:"required"\`
        Email    string \`json:"email" binding:"required,email"\`
        Password string \`json:"password" binding:"required,min=8"\`
    }
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    // Hash password
    hashedPassword, _ := bcrypt.GenerateFromPassword(
        []byte(input.Password), bcrypt.DefaultCost)

    user := models.User{
        Name:     input.Name,
        Email:    input.Email,
        Password: string(hashedPassword),
    }

    if err := database.DB.Create(&user).Error; err != nil {
        c.JSON(409, gin.H{"error": "Email already exists"})
        return
    }

    token, _ := middleware.GenerateToken(user.ID, user.Email)
    c.JSON(201, gin.H{"token": token, "user": user})
}

func Login(c *gin.Context) {
    var input struct {
        Email    string \`json:"email" binding:"required"\`
        Password string \`json:"password" binding:"required"\`
    }
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    var user models.User
    if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
        c.JSON(401, gin.H{"error": "Invalid credentials"})
        return
    }

    if err := bcrypt.CompareHashAndPassword(
        []byte(user.Password), []byte(input.Password)); err != nil {
        c.JSON(401, gin.H{"error": "Invalid credentials"})
        return
    }

    token, _ := middleware.GenerateToken(user.ID, user.Email)
    c.JSON(200, gin.H{"token": token})
}
\`\`\`

## Key Learning Points

1. **JWT** token generation and validation
2. **Password hashing** with bcrypt
3. **Middleware** for route protection
4. **Pagination** patterns
5. **Database relationships** (User has many Posts)
6. **Authorization** — users can only modify their own posts
        `,
      },
    ],
  },
];
