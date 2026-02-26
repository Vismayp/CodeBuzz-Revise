// ═══════════════════════════════════════════════════════════════
// GOLANG PART 4: POSTGRESQL, BEST PRACTICES, PROJECT STRUCTURE
// ═══════════════════════════════════════════════════════════════

export const topicsPart4 = [
  {
    id: "go-postgresql",
    title: "PostgreSQL with Go",
    description: "Connect Go to PostgreSQL: raw SQL, GORM ORM, migrations, and connection pooling.",
    icon: "Database",
    sections: [
      {
        id: "pg-setup-raw",
        title: "Raw SQL with database/sql",
        content: `
## Setting Up PostgreSQL

\`\`\`bash
# Install PostgreSQL
# Windows: Download from postgresql.org
# Mac: brew install postgresql
# Linux: sudo apt install postgresql

# Create a database
createdb myapp_db

# Or via psql
psql -U postgres
CREATE DATABASE myapp_db;
\`\`\`

## Connecting with database/sql

\`\`\`bash
# Install the PostgreSQL driver
go get github.com/lib/pq
\`\`\`

\`\`\`go
package main

import (
    "database/sql"
    "fmt"
    "log"
    _ "github.com/lib/pq"  // PostgreSQL driver
)

func main() {
    connStr := "host=localhost port=5432 user=postgres " +
        "password=secret dbname=myapp_db sslmode=disable"

    db, err := sql.Open("postgres", connStr)
    if err != nil {
        log.Fatal("Failed to connect:", err)
    }
    defer db.Close()

    // Verify connection
    if err := db.Ping(); err != nil {
        log.Fatal("Cannot reach DB:", err)
    }
    fmt.Println("Connected to PostgreSQL!")

    // Configure connection pool
    db.SetMaxOpenConns(25)
    db.SetMaxIdleConns(5)
    db.SetConnMaxLifetime(5 * time.Minute)
}
\`\`\`

## CRUD Operations (Raw SQL)

\`\`\`go
// CREATE TABLE
_, err = db.Exec(\`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        age INT,
        created_at TIMESTAMP DEFAULT NOW()
    )
\`)

// INSERT (with parameterized query — prevents SQL injection!)
result, err := db.Exec(
    "INSERT INTO users (name, email, age) VALUES ($1, $2, $3)",
    "Alice", "alice@example.com", 30,
)
id, _ := result.LastInsertId()

// SELECT single row
var user struct{ ID int; Name, Email string; Age int }
err = db.QueryRow(
    "SELECT id, name, email, age FROM users WHERE id = $1", 1,
).Scan(&user.ID, &user.Name, &user.Email, &user.Age)

// SELECT multiple rows
rows, err := db.Query("SELECT id, name, email FROM users")
defer rows.Close()

var users []User
for rows.Next() {
    var u User
    rows.Scan(&u.ID, &u.Name, &u.Email)
    users = append(users, u)
}

// UPDATE
_, err = db.Exec(
    "UPDATE users SET name = $1 WHERE id = $2",
    "Alice Smith", 1,
)

// DELETE
_, err = db.Exec("DELETE FROM users WHERE id = $1", 1)

// TRANSACTIONS
tx, err := db.Begin()
_, err = tx.Exec("UPDATE accounts SET balance = balance - 100 WHERE id = $1", 1)
_, err = tx.Exec("UPDATE accounts SET balance = balance + 100 WHERE id = $1", 2)
if err != nil {
    tx.Rollback()
} else {
    tx.Commit()
}
\`\`\`
        `,
      },
      {
        id: "gorm-orm",
        title: "GORM ORM",
        content: `
## GORM — Go's Most Popular ORM

\`\`\`bash
go get -u gorm.io/gorm
go get -u gorm.io/driver/postgres
\`\`\`

\`\`\`go
package main

import (
    "gorm.io/gorm"
    "gorm.io/driver/postgres"
)

// Define models
type User struct {
    gorm.Model           // Adds ID, CreatedAt, UpdatedAt, DeletedAt
    Name     string      \`gorm:"not null;size:100"\`
    Email    string      \`gorm:"uniqueIndex;not null"\`
    Age      int
    Posts    []Post      // Has Many relationship
    Profile  Profile     // Has One
}

type Profile struct {
    gorm.Model
    UserID  uint
    Bio     string
    Avatar  string
}

type Post struct {
    gorm.Model
    Title   string \`gorm:"not null"\`
    Content string \`gorm:"type:text"\`
    UserID  uint
    Tags    []Tag  \`gorm:"many2many:post_tags;"\`
}

type Tag struct {
    gorm.Model
    Name  string \`gorm:"uniqueIndex"\`
    Posts []Post \`gorm:"many2many:post_tags;"\`
}

func main() {
    dsn := "host=localhost user=postgres password=secret " +
        "dbname=myapp_db port=5432 sslmode=disable"
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect:", err)
    }

    // Auto-migrate (creates/updates tables)
    db.AutoMigrate(&User{}, &Profile{}, &Post{}, &Tag{})
}
\`\`\`

## GORM CRUD Operations

\`\`\`go
// CREATE
user := User{Name: "Alice", Email: "alice@example.com", Age: 30}
result := db.Create(&user)
fmt.Println(user.ID)           // Auto-generated ID
fmt.Println(result.RowsAffected)

// READ
var user User
db.First(&user, 1)                     // By primary key
db.First(&user, "email = ?", "alice@example.com")

// Find all
var users []User
db.Find(&users)

// With conditions
db.Where("age > ?", 25).Find(&users)
db.Where("name LIKE ?", "%Ali%").Find(&users)

// Pagination
db.Offset(0).Limit(10).Find(&users)

// Order
db.Order("created_at desc").Find(&users)

// Select specific columns
db.Select("name", "email").Find(&users)

// UPDATE
db.Model(&user).Update("name", "Alice Smith")
db.Model(&user).Updates(User{Name: "Bob", Age: 28})
db.Model(&user).Updates(map[string]interface{}{"name": "Charlie"})

// DELETE (soft delete with gorm.Model)
db.Delete(&user, 1)

// Permanent delete
db.Unscoped().Delete(&user, 1)

// ASSOCIATIONS
// Eager loading (preload related data)
db.Preload("Posts").Preload("Profile").Find(&user)

// Create with association
db.Create(&User{
    Name: "Alice",
    Email: "alice@example.com",
    Profile: Profile{Bio: "Developer"},
    Posts: []Post{
        {Title: "First Post", Content: "Hello"},
    },
})
\`\`\`
        `,
      },
    ],
  },

  {
    id: "go-best-practices",
    title: "Best Practices & Production",
    description: "Project structure, config, logging, Docker, and production readiness.",
    icon: "Target",
    sections: [
      {
        id: "project-structure",
        title: "Clean Project Structure",
        content: `
## Recommended Go Project Layout

\`\`\`
my-api/
├── cmd/
│   └── server/
│       └── main.go          # Entry point
├── internal/
│   ├── config/
│   │   └── config.go        # App configuration
│   ├── handler/
│   │   ├── user_handler.go  # HTTP handlers
│   │   └── health.go
│   ├── middleware/
│   │   ├── auth.go
│   │   ├── cors.go
│   │   └── logger.go
│   ├── model/
│   │   ├── user.go          # Database models
│   │   └── post.go
│   ├── repository/
│   │   ├── user_repo.go     # Database operations
│   │   └── post_repo.go
│   ├── service/
│   │   ├── user_service.go  # Business logic
│   │   └── auth_service.go
│   └── router/
│       └── router.go        # Route definitions
├── pkg/
│   ├── utils/
│   │   └── hash.go          # Shared utilities
│   └── validator/
│       └── validator.go
├── migrations/
│   ├── 001_create_users.up.sql
│   └── 001_create_users.down.sql
├── .env
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── Makefile
├── go.mod
└── go.sum
\`\`\`

### Key Principles

| Directory | Purpose |
|-----------|---------|
| \`cmd/\` | Application entry points |
| \`internal/\` | Private code (can't be imported by other modules) |
| \`pkg/\` | Public, reusable packages |
| \`handler/\` | HTTP request handlers (Controllers) |
| \`service/\` | Business logic layer |
| \`repository/\` | Database access layer |
| \`model/\` | Data structures / DB models |
| \`middleware/\` | HTTP middleware |

This follows the **Clean Architecture** / **Layered Architecture** pattern:

\`\`\`
HTTP Request
    ↓
[Handler Layer]     — Parse request, validate, call service
    ↓
[Service Layer]     — Business logic, orchestration
    ↓
[Repository Layer]  — Database operations
    ↓
[Database]
\`\`\`
        `,
      },
      {
        id: "config-env",
        title: "Configuration & Environment",
        content: `
## Environment Variables with Viper

\`\`\`bash
go get github.com/spf13/viper
\`\`\`

\`\`\`go
// internal/config/config.go
package config

import (
    "github.com/spf13/viper"
    "log"
)

type Config struct {
    Server   ServerConfig
    Database DatabaseConfig
    JWT      JWTConfig
}

type ServerConfig struct {
    Port string \`mapstructure:"PORT"\`
    Mode string \`mapstructure:"GIN_MODE"\`
}

type DatabaseConfig struct {
    Host     string \`mapstructure:"DB_HOST"\`
    Port     string \`mapstructure:"DB_PORT"\`
    User     string \`mapstructure:"DB_USER"\`
    Password string \`mapstructure:"DB_PASSWORD"\`
    Name     string \`mapstructure:"DB_NAME"\`
    SSLMode  string \`mapstructure:"DB_SSLMODE"\`
}

type JWTConfig struct {
    Secret     string \`mapstructure:"JWT_SECRET"\`
    Expiration int    \`mapstructure:"JWT_EXPIRATION_HOURS"\`
}

func LoadConfig() (*Config, error) {
    viper.SetConfigFile(".env")
    viper.AutomaticEnv()

    if err := viper.ReadInConfig(); err != nil {
        log.Println("No .env file found, using env vars")
    }

    config := &Config{}
    config.Server.Port = viper.GetString("PORT")
    config.Database.Host = viper.GetString("DB_HOST")
    // ... etc
    return config, nil
}
\`\`\`

## .env File

\`\`\`env
PORT=8080
GIN_MODE=release

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=secret
DB_NAME=myapp_db
DB_SSLMODE=disable

JWT_SECRET=your-super-secret-key
JWT_EXPIRATION_HOURS=24
\`\`\`

## Docker Setup

\`\`\`dockerfile
# Dockerfile
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/server

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/.env .
EXPOSE 8080
CMD ["./main"]
\`\`\`

\`\`\`yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - db
    environment:
      - DB_HOST=db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
\`\`\`

\`\`\`makefile
# Makefile
.PHONY: run build test docker-up docker-down

run:
\tgo run cmd/server/main.go

build:
\tgo build -o bin/server cmd/server/main.go

test:
\tgo test -v ./...

docker-up:
\tdocker-compose up -d --build

docker-down:
\tdocker-compose down
\`\`\`
        `,
      },
    ],
  },
];
