// ═══════════════════════════════════════════════════════════════
// GOLANG PART 2: CONCURRENCY, PACKAGES, JSON, TESTING
// ═══════════════════════════════════════════════════════════════

export const topicsPart2 = [
  {
    id: "go-concurrency",
    title: "Concurrency in Go",
    description: "Goroutines, channels, select, sync package — Go's killer feature.",
    icon: "Activity",
    sections: [
      {
        id: "goroutines",
        title: "Goroutines",
        content: `
## What Are Goroutines?

Goroutines are **lightweight threads** managed by the Go runtime. They cost ~2KB of stack (vs ~1MB for OS threads). You can run **millions** of goroutines.

\`\`\`go
package main

import (
    "fmt"
    "time"
)

func sayHello(name string) {
    for i := 0; i < 3; i++ {
        fmt.Printf("Hello from %s (iteration %d)\\n", name, i)
        time.Sleep(100 * time.Millisecond)
    }
}

func main() {
    // Launch goroutines with "go" keyword
    go sayHello("Goroutine 1")
    go sayHello("Goroutine 2")

    // Main function is also a goroutine
    sayHello("Main")

    // Wait a bit (we'll learn better ways soon)
    time.Sleep(time.Second)
}
\`\`\`

> ⚠️ If \`main()\` exits, ALL goroutines are killed — even if they're not done.

## WaitGroup (Proper Way to Wait)

\`\`\`go
import "sync"

func worker(id int, wg *sync.WaitGroup) {
    defer wg.Done()  // Signal completion
    fmt.Printf("Worker %d starting\\n", id)
    time.Sleep(time.Second)
    fmt.Printf("Worker %d done\\n", id)
}

func main() {
    var wg sync.WaitGroup

    for i := 1; i <= 5; i++ {
        wg.Add(1)        // Add to counter
        go worker(i, &wg)
    }

    wg.Wait()  // Block until counter reaches 0
    fmt.Println("All workers finished!")
}
\`\`\`
        `,
      },
      {
        id: "channels",
        title: "Channels",
        content: `
## What Are Channels?

Channels are Go's way for goroutines to **communicate safely**. Think of them as typed pipes:

\`\`\`go
// Create a channel
ch := make(chan string)

// Send to channel
go func() {
    ch <- "Hello from goroutine!"  // Send
}()

// Receive from channel
msg := <-ch  // Receive (blocks until data arrives)
fmt.Println(msg)
\`\`\`

## Buffered vs Unbuffered Channels

\`\`\`go
// Unbuffered (default) — send blocks until receiver is ready
ch := make(chan int)

// Buffered — send doesn't block until buffer is full
ch := make(chan int, 3)  // Can hold 3 values

ch <- 1  // No blocking
ch <- 2  // No blocking
ch <- 3  // No blocking
// ch <- 4  // Would block! Buffer full

fmt.Println(<-ch)  // 1
fmt.Println(<-ch)  // 2
\`\`\`

## Channel Directions

\`\`\`go
// Send-only channel
func producer(ch chan<- int) {
    for i := 0; i < 5; i++ {
        ch <- i
    }
    close(ch)
}

// Receive-only channel
func consumer(ch <-chan int) {
    for val := range ch {
        fmt.Println("Received:", val)
    }
}

func main() {
    ch := make(chan int, 5)
    go producer(ch)
    consumer(ch)
}
\`\`\`

## Worker Pool Pattern

\`\`\`go
func worker(id int, jobs <-chan int, results chan<- int) {
    for job := range jobs {
        fmt.Printf("Worker %d processing job %d\\n", id, job)
        time.Sleep(time.Second)
        results <- job * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)

    // Start 3 workers
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    // Send 9 jobs
    for j := 1; j <= 9; j++ {
        jobs <- j
    }
    close(jobs)

    // Collect results
    for r := 1; r <= 9; r++ {
        fmt.Println("Result:", <-results)
    }
}
\`\`\`
        `,
      },
      {
        id: "select-context",
        title: "Select & Context",
        content: `
## Select Statement

\`select\` lets you wait on multiple channels:

\`\`\`go
func main() {
    ch1 := make(chan string)
    ch2 := make(chan string)

    go func() {
        time.Sleep(1 * time.Second)
        ch1 <- "from channel 1"
    }()

    go func() {
        time.Sleep(2 * time.Second)
        ch2 <- "from channel 2"
    }()

    // Wait for whichever arrives first
    select {
    case msg1 := <-ch1:
        fmt.Println(msg1)
    case msg2 := <-ch2:
        fmt.Println(msg2)
    case <-time.After(3 * time.Second):
        fmt.Println("timeout!")
    }
}
\`\`\`

## Context Package

Context is used to manage **cancellation, deadlines, and request-scoped values**:

\`\`\`go
import "context"

func fetchData(ctx context.Context, url string) (string, error) {
    // Create HTTP request with context
    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return "", err
    }

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    body, err := io.ReadAll(resp.Body)
    return string(body), err
}

func main() {
    // Context with timeout
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    data, err := fetchData(ctx, "https://api.example.com/data")
    if err != nil {
        if ctx.Err() == context.DeadlineExceeded {
            fmt.Println("Request timed out!")
        }
        log.Fatal(err)
    }
    fmt.Println(data)
}
\`\`\`

### Context Types

| Function | Purpose |
|----------|---------|
| \`context.Background()\` | Root context (top-level) |
| \`context.TODO()\` | Placeholder when unsure |
| \`context.WithCancel(parent)\` | Manual cancellation |
| \`context.WithTimeout(parent, duration)\` | Auto-cancel after duration |
| \`context.WithDeadline(parent, time)\` | Auto-cancel at specific time |
| \`context.WithValue(parent, key, val)\` | Pass request-scoped data |

## Mutex (Mutual Exclusion)

\`\`\`go
import "sync"

type SafeCounter struct {
    mu    sync.Mutex
    count int
}

func (c *SafeCounter) Increment() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.count++
}

func (c *SafeCounter) Value() int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.count
}

func main() {
    counter := &SafeCounter{}
    var wg sync.WaitGroup

    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            counter.Increment()
        }()
    }

    wg.Wait()
    fmt.Println("Final count:", counter.Value())  // Always 1000
}
\`\`\`
        `,
      },
    ],
  },

  // ══════════════════════════════════════════
  // JSON, HTTP & TESTING
  // ══════════════════════════════════════════
  {
    id: "go-json-http-testing",
    title: "JSON, HTTP & Testing",
    description: "Working with JSON, building HTTP servers, and writing tests in Go.",
    icon: "Globe",
    sections: [
      {
        id: "json-handling",
        title: "JSON in Go",
        content: `
## JSON Encoding & Decoding

Go uses struct tags to map JSON fields:

\`\`\`go
import "encoding/json"

type Product struct {
    ID       int     \`json:"id"\`
    Name     string  \`json:"name"\`
    Price    float64 \`json:"price"\`
    InStock  bool    \`json:"in_stock"\`
    Category string  \`json:"category,omitempty"\`  // Omit if empty
    internal string  // Unexported (lowercase) = NOT included in JSON
}

// Struct → JSON (Marshal)
product := Product{ID: 1, Name: "Laptop", Price: 999.99, InStock: true}
jsonBytes, err := json.Marshal(product)
fmt.Println(string(jsonBytes))
// {"id":1,"name":"Laptop","price":999.99,"in_stock":true}

// Pretty print
jsonBytes, _ := json.MarshalIndent(product, "", "  ")

// JSON → Struct (Unmarshal)
jsonStr := \`{"id":2,"name":"Phone","price":599.99}\`
var p Product
err := json.Unmarshal([]byte(jsonStr), &p)
fmt.Println(p.Name)  // "Phone"

// JSON → map (when structure is unknown)
var data map[string]interface{}
json.Unmarshal([]byte(jsonStr), &data)
\`\`\`

### Struct Tags Cheat Sheet

| Tag | Effect |
|-----|--------|
| \`json:"fieldName"\` | Custom JSON key name |
| \`json:",omitempty"\` | Skip if zero value |
| \`json:"-"\` | Always skip this field |
| \`json:",string"\` | Encode number as string |
        `,
      },
      {
        id: "http-server",
        title: "HTTP Server (net/http)",
        content: `
## Building a Basic HTTP Server

\`\`\`go
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

type Response struct {
    Message string \`json:"message"\`
    Status  int    \`json:"status"\`
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Welcome to Go!")
}

func apiHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    resp := Response{Message: "Hello from Go API!", Status: 200}
    json.NewEncoder(w).Encode(resp)
}

func main() {
    http.HandleFunc("/", homeHandler)
    http.HandleFunc("/api", apiHandler)

    fmt.Println("Server running on :8080")
    http.ListenAndServe(":8080", nil)
}
\`\`\`

> 💡 This is Go's standard library HTTP server. For production APIs, we'll use the **GIN framework** (covered next).
        `,
      },
      {
        id: "testing",
        title: "Testing in Go",
        content: `
## Writing Tests

Go has a built-in testing framework:

\`\`\`go
// math.go
package math

func Add(a, b int) int {
    return a + b
}

func Multiply(a, b int) int {
    return a * b
}
\`\`\`

\`\`\`go
// math_test.go — MUST end in _test.go
package math

import "testing"

func TestAdd(t *testing.T) {
    result := Add(2, 3)
    expected := 5
    if result != expected {
        t.Errorf("Add(2, 3) = %d; want %d", result, expected)
    }
}

// Table-driven tests (Go best practice)
func TestMultiply(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive", 2, 3, 6},
        {"zero", 5, 0, 0},
        {"negative", -2, 3, -6},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := Multiply(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("Multiply(%d, %d) = %d; want %d",
                    tt.a, tt.b, result, tt.expected)
            }
        })
    }
}

// Benchmark
func BenchmarkAdd(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Add(10, 20)
    }
}
\`\`\`

\`\`\`bash
# Run all tests
go test ./...

# Run with verbose output
go test -v ./...

# Run specific test
go test -run TestAdd

# Run benchmarks
go test -bench=.

# Test coverage
go test -cover ./...
\`\`\`
        `,
      },
    ],
  },
];
