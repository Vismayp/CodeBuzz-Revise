// ═══════════════════════════════════════════════════════════════
// GOLANG BACKEND ENGINEERING — COMPLETE BEGINNER TO INTERVIEW READY
// ═══════════════════════════════════════════════════════════════

export const topics = [
  // ══════════════════════════════════════════
  // MODULE 1: GO FUNDAMENTALS
  // ══════════════════════════════════════════
  {
    id: "go-intro",
    title: "Introduction to Go",
    description: "Why Go exists, its philosophy, installation, and your first program.",
    icon: "Code",
    sections: [
      {
        id: "what-is-go",
        title: "What is Go (Golang)?",
        content: `
**Go** (often called **Golang**) is an open-source, statically typed, compiled programming language designed at **Google** by **Robert Griesemer**, **Rob Pike**, and **Ken Thompson**. It was first released in **2009**.

## Why Was Go Created?

Google engineers were frustrated with existing languages:
- **C++** was powerful but slow to compile and complex
- **Java** had too much boilerplate
- **Python** was slow at runtime
- **None** handled modern concurrency well

Go was designed to solve these problems:

| Feature | Go's Approach |
|---------|--------------|
| **Compilation** | Compiles to machine code in seconds |
| **Concurrency** | Built-in goroutines & channels |
| **Simplicity** | Only 25 keywords |
| **Garbage Collection** | Automatic memory management |
| **Static Typing** | Catches errors at compile time |
| **Standard Library** | Rich, batteries-included |

## Who Uses Go?

- **Google** — Kubernetes, Docker
- **Uber** — Microservices
- **Netflix** — Server infrastructure
- **Twitch** — High-traffic APIs
- **Dropbox** — Performance-critical backend

## Go vs Other Languages

| Aspect | Go | Python | Java | Node.js |
|--------|-----|--------|------|---------|
| Typing | Static | Dynamic | Static | Dynamic |
| Compiled | Yes | No (interpreted) | JIT | JIT (V8) |
| Concurrency | Goroutines | Threads/asyncio | Threads | Event loop |
| Performance | Very Fast | Slow | Fast | Medium |
| Learning Curve | Low | Very Low | High | Low |
| Memory | Low footprint | High | Medium | Medium |
        `,
      },
      {
        id: "why-go-vs-python",
        title: "Why Go? Why Not Python or FastAPI?",
        content: `
## The Python / FastAPI Problem

Python (and frameworks like FastAPI) is fantastic for fast prototyping and AI, but it struggles at massive scale for a few core reasons:

1. **The GIL (Global Interpreter Lock):** Python can generally only execute one thread of Python code at a time per process. It cannot utilize true multi-core concurrency easily without spinning up heavy, completely separate OS processes.
2. **Speed & Memory Overhead:** Python is an interpreted language. While FastAPI is fast *for Python*, it is still fundamentally bound by Python's runtime execution speed and high memory footprint. 
3. **Deployment Constraints:** Python projects require managing virtual environments, \`requirements.txt\`, Poetry, etc. Deploying to a server often causes "it works on my machine" dependency conflicts.

## The Go Solution

Go was built specifically for modern, distributed cloud systems:

1. **True Concurrency (Goroutines):** Goroutines are incredibly lightweight (starting at ~2KB). You can spin up **hundreds of thousands** of them simultaneously. Go automatically multiplexes them across all your CPU cores.
2. **Blistering Performance:** Go compiles directly to raw machine code. It regularly benchmarks 10x to 40x faster than Python for network and compute tasks.
3. **Single Static Binary:** Go compiles your entire application (and all its dependencies) into a single executable file. You don't even need to install Go on your production server. Just copy the binary and run it. Docker images are often single-digit megabytes.
4. **Static Typing & Predictability:** Python's dynamic typing allows bugs to sneak into production. Go's strict static typing and explicit error handling ensures the majority of issues are caught at compile time.

> 💡 **TL;DR:** Use Python for Data Science, AI, and quick scripting. Use Go for network services, cloud microservices, and high-performance backend APIs.
        `,
      },
      {
        id: "go-installation",
        title: "Installation & Setup",
        content: `
## Step 1: Download Go

Go to [https://go.dev/dl/](https://go.dev/dl/) and download the installer for your OS.

### Windows
1. Download the \`.msi\` installer
2. Run it → Accept defaults
3. Verify: Open **Command Prompt** and run:

\`\`\`bash
go version
# Output: go version go1.22.x windows/amd64
\`\`\`

### macOS
\`\`\`bash
# Using Homebrew (recommended)
brew install go

# Verify
go version
\`\`\`

### Linux (Ubuntu/Debian)
\`\`\`bash
# Download
wget https://go.dev/dl/go1.22.4.linux-amd64.tar.gz

# Extract to /usr/local
sudo tar -C /usr/local -xzf go1.22.4.linux-amd64.tar.gz

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH=$PATH:/usr/local/go/bin

# Verify
go version
\`\`\`

## Step 2: Set Up Your Workspace

Go uses **modules** for dependency management (since Go 1.11+).

\`\`\`bash
# Create a project directory
mkdir my-first-go-app
cd my-first-go-app

# Initialize a Go module
go mod init github.com/yourusername/my-first-go-app
\`\`\`

This creates a \`go.mod\` file — Go's equivalent of \`package.json\` (Node.js) or \`requirements.txt\` (Python).

## Step 3: Choose an Editor

- **VS Code** + Go extension (recommended for beginners)
- **GoLand** by JetBrains (paid, powerful)
- **Vim/Neovim** + gopls

> **Tip:** The VS Code Go extension provides auto-completion, formatting, linting, and debugging out of the box.

## Important Go Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| \`GOPATH\` | Workspace directory | \`~/go\` |
| \`GOROOT\` | Go installation directory | \`/usr/local/go\` |
| \`GOBIN\` | Where binaries are installed | \`$GOPATH/bin\` |
| \`GOPROXY\` | Module proxy URL | \`https://proxy.golang.org\` |

\`\`\`bash
# See all Go environment variables
go env

# Check specific ones
go env GOPATH
go env GOROOT
\`\`\`
        `,
      },
      {
        id: "hello-world-go",
        title: "Hello World & Go Toolchain",
        content: `
## Your First Go Program

Create a file \`main.go\`:

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World! 🚀")
}
\`\`\`

### Breaking It Down

| Part | Meaning |
|------|---------|
| \`package main\` | Every Go file belongs to a package. \`main\` = executable program |
| \`import "fmt"\` | Import the "fmt" package (formatting, printing) |
| \`func main()\` | Entry point — Go starts execution here |
| \`fmt.Println()\` | Print with newline |

## Go Toolchain Commands

\`\`\`bash
# Run directly (compile + execute)
go run main.go

# Build a binary
go build -o myapp main.go
./myapp    # Execute it

# Format your code (Go has ONE official style)
go fmt ./...

# Vet: find suspicious code
go vet ./...

# Run tests
go test ./...

# Download dependencies
go mod tidy

# Install a package
go get github.com/gin-gonic/gin

# List all dependencies
go list -m all
\`\`\`

## Key Go Principles (The Go Way)

1. **Simplicity over cleverness** — Go code should be obvious
2. **One way to do things** — \`gofmt\` formats ALL Go code the same way
3. **Explicit over implicit** — No magic; you see what happens
4. **Composition over inheritance** — No classes; use structs + interfaces
5. **Errors are values** — No try/catch; handle errors explicitly

> 💡 **Mantra:** "Clear is better than clever."
        `,
      },
    ],
  },

  // ══════════════════════════════════════════
  // VARIABLES, TYPES & CONTROL FLOW
  // ══════════════════════════════════════════
  {
    id: "go-basics",
    title: "Variables, Types & Control Flow",
    description: "Data types, variable declarations, constants, and control structures.",
    icon: "Variable",
    sections: [
      {
        id: "variables-and-types",
        title: "Variables & Data Types",
        content: `
## Variable Declaration in Go

Go has **multiple ways** to declare variables:

\`\`\`go
package main

import "fmt"

func main() {
    // 1. Full declaration
    var name string = "Alice"

    // 2. Type inference (Go figures out the type)
    var age = 25

    // 3. Short declaration (most common, ONLY inside functions)
    city := "Mumbai"

    // 4. Multiple variables
    var x, y int = 10, 20

    // 5. Block declaration
    var (
        isActive bool   = true
        score    int    = 100
        grade    string = "A"
    )

    fmt.Println(name, age, city, x, y, isActive, score, grade)
}
\`\`\`

> ⚠️ **Important:** The \`:=\` short syntax **only works inside functions**, not at package level.

## Go's Basic Data Types

| Type | Examples | Zero Value | Size |
|------|----------|------------|------|
| \`bool\` | \`true\`, \`false\` | \`false\` | 1 byte |
| \`string\` | \`"hello"\` | \`""\` (empty) | varies |
| \`int\` | \`42\`, \`-7\` | \`0\` | platform-dependent (32/64 bit) |
| \`int8\` | \`-128\` to \`127\` | \`0\` | 1 byte |
| \`int16\` | \`-32768\` to \`32767\` | \`0\` | 2 bytes |
| \`int32\` | alias: \`rune\` | \`0\` | 4 bytes |
| \`int64\` | large integers | \`0\` | 8 bytes |
| \`uint\` | unsigned (0+) | \`0\` | platform-dependent |
| \`float32\` | \`3.14\` | \`0.0\` | 4 bytes |
| \`float64\` | \`3.14159265\` | \`0.0\` | 8 bytes |
| \`byte\` | alias for \`uint8\` | \`0\` | 1 byte |
| \`rune\` | alias for \`int32\` (Unicode) | \`0\` | 4 bytes |

## Zero Values (Go's Defaults)

Go automatically initializes variables to their **zero value**:

\`\`\`go
var i int      // 0
var f float64  // 0.0
var b bool     // false
var s string   // "" (empty string)
var p *int     // nil (pointer)
\`\`\`

> 💡 No \`undefined\` or \`null\` in Go — every variable always has a value.

## Type Conversion (Casting)

Go does **NOT** do implicit type conversion. You must be explicit:

\`\`\`go
var i int = 42
var f float64 = float64(i)    // int → float64
var u uint = uint(f)           // float64 → uint

// String conversion
import "strconv"
s := strconv.Itoa(42)         // int → string: "42"
n, err := strconv.Atoi("42")  // string → int: 42
\`\`\`

## Constants

\`\`\`go
const Pi = 3.14159
const (
    StatusOK    = 200
    StatusError = 500
)

// iota: auto-incrementing constant
const (
    Sunday    = iota  // 0
    Monday           // 1
    Tuesday          // 2
    Wednesday        // 3
)

// iota with expressions
const (
    KB = 1 << (10 * (iota + 1))  // 1024
    MB                            // 1048576
    GB                            // 1073741824
)
\`\`\`
        `,
      },
      {
        id: "control-flow",
        title: "Control Flow",
        content: `
## If/Else

\`\`\`go
age := 20

if age >= 18 {
    fmt.Println("Adult")
} else if age >= 13 {
    fmt.Println("Teenager")
} else {
    fmt.Println("Child")
}

// Unique Go feature: if with initialization statement
if score := calculateScore(); score > 90 {
    fmt.Println("Excellent!", score)
}
// 'score' is NOT accessible here (scoped to the if block)
\`\`\`

## Switch

Go's switch is more powerful than most languages:

\`\`\`go
day := "Monday"

switch day {
case "Monday":
    fmt.Println("Start of work week")
    // No "break" needed — Go doesn't fall through by default
case "Friday":
    fmt.Println("TGIF!")
case "Saturday", "Sunday":
    fmt.Println("Weekend!")
default:
    fmt.Println("Midweek")
}

// Switch without a condition (clean if/else chain)
score := 85
switch {
case score >= 90:
    fmt.Println("A")
case score >= 80:
    fmt.Println("B")
case score >= 70:
    fmt.Println("C")
default:
    fmt.Println("F")
}

// Type switch (used with interfaces)
var val interface{} = "hello"
switch v := val.(type) {
case string:
    fmt.Println("String:", v)
case int:
    fmt.Println("Integer:", v)
}
\`\`\`

## For Loop (The ONLY loop in Go)

Go has **no while or do-while**. \`for\` does it all:

\`\`\`go
// Traditional for
for i := 0; i < 5; i++ {
    fmt.Println(i)
}

// While-style
count := 0
for count < 10 {
    count++
}

// Infinite loop
for {
    fmt.Println("forever")
    break  // exit
}

// Range-based (iterate over collections)
fruits := []string{"apple", "banana", "cherry"}
for index, fruit := range fruits {
    fmt.Println(index, fruit)
}

// Ignore index with _
for _, fruit := range fruits {
    fmt.Println(fruit)
}

// Range over a map
scores := map[string]int{"Alice": 95, "Bob": 87}
for name, score := range scores {
    fmt.Printf("%s scored %d\\n", name, score)
}

// Range over a string (gives runes, not bytes!)
for i, ch := range "Hello 🌍" {
    fmt.Printf("index=%d char=%c\\n", i, ch)
}
\`\`\`

## Break, Continue & Labels

\`\`\`go
// break — exit the loop
for i := 0; i < 10; i++ {
    if i == 5 {
        break
    }
}

// continue — skip to next iteration
for i := 0; i < 10; i++ {
    if i%2 == 0 {
        continue  // skip even numbers
    }
    fmt.Println(i)
}

// Labels — break out of nested loops
outer:
for i := 0; i < 3; i++ {
    for j := 0; j < 3; j++ {
        if i == 1 && j == 1 {
            break outer
        }
        fmt.Println(i, j)
    }
}
\`\`\`
        `,
      },
    ],
  },

  // ══════════════════════════════════════════
  // FUNCTIONS
  // ══════════════════════════════════════════
  {
    id: "go-functions",
    title: "Functions in Go",
    description: "Functions, multiple returns, variadic params, closures, and defer.",
    icon: "Terminal",
    sections: [
      {
        id: "function-basics",
        title: "Function Basics",
        content: `
## Defining Functions

\`\`\`go
// Basic function
func greet(name string) string {
    return "Hello, " + name + "!"
}

// Multiple parameters with same type
func add(a, b int) int {
    return a + b
}

// Multiple return values (UNIQUE to Go)
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("division by zero")
    }
    return a / b, nil
}

// Usage
result, err := divide(10, 3)
if err != nil {
    log.Fatal(err)
}
fmt.Println(result)  // 3.333...
\`\`\`

## Named Return Values

\`\`\`go
func rectangleProps(length, width float64) (area, perimeter float64) {
    area = length * width
    perimeter = 2 * (length + width)
    return  // "naked return" — returns named values
}

area, perimeter := rectangleProps(5, 3)
fmt.Println(area, perimeter)  // 15, 16
\`\`\`

## Variadic Functions (variable number of arguments)

\`\`\`go
func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

fmt.Println(sum(1, 2, 3))       // 6
fmt.Println(sum(10, 20, 30, 40)) // 100

// Spread a slice
numbers := []int{1, 2, 3, 4, 5}
fmt.Println(sum(numbers...))  // 15
\`\`\`

## First-Class Functions & Closures

Functions in Go are **first-class citizens** — they can be assigned to variables, passed as arguments, and returned:

\`\`\`go
// Function as a variable
multiply := func(a, b int) int {
    return a * b
}
fmt.Println(multiply(3, 4))  // 12

// Higher-order function (takes a function as argument)
func apply(a, b int, op func(int, int) int) int {
    return op(a, b)
}
result := apply(5, 3, func(a, b int) int { return a + b })
fmt.Println(result)  // 8

// Closure (function that "remembers" its environment)
func counter() func() int {
    count := 0
    return func() int {
        count++
        return count
    }
}

next := counter()
fmt.Println(next())  // 1
fmt.Println(next())  // 2
fmt.Println(next())  // 3
\`\`\`

## Defer, Panic & Recover

\`\`\`go
// defer — executes AFTER the surrounding function returns
func readFile() {
    file, err := os.Open("data.txt")
    if err != nil {
        log.Fatal(err)
    }
    defer file.Close()  // Guaranteed to run!

    // Read file...
    // Even if we return early, file.Close() will execute
}

// Multiple defers execute in LIFO (Last In, First Out) order
func example() {
    defer fmt.Println("1st")
    defer fmt.Println("2nd")
    defer fmt.Println("3rd")
    // Output: 3rd, 2nd, 1st
}

// panic — stop normal execution (like throw in JS)
func mustPositive(n int) {
    if n < 0 {
        panic("negative number not allowed")
    }
}

// recover — catch a panic (like catch in JS)
func safeExecute() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered from panic:", r)
        }
    }()
    panic("something went wrong!")
}
\`\`\`

> ⚠️ **Best Practice:** Use \`panic\` only for truly unrecoverable errors. Use \`error\` returns for everything else.
        `,
      },
    ],
  },

  // ══════════════════════════════════════════
  // COLLECTIONS
  // ══════════════════════════════════════════
  {
    id: "go-collections",
    title: "Arrays, Slices & Maps",
    description: "Go's data collections — fixed arrays, dynamic slices, and hash maps.",
    icon: "Layers",
    sections: [
      {
        id: "arrays-and-slices",
        title: "Arrays & Slices",
        content: `
## Arrays (Fixed Size)

Arrays in Go have a **fixed size** determined at compile time:

\`\`\`go
// Declare an array
var numbers [5]int  // [0, 0, 0, 0, 0]
numbers[0] = 10
numbers[1] = 20

// Initialize with values
fruits := [3]string{"apple", "banana", "cherry"}

// Let Go count the elements
colors := [...]string{"red", "green", "blue"}

fmt.Println(len(colors))  // 3
\`\`\`

> ⚠️ Arrays are rarely used directly in Go. **Slices** are preferred.

## Slices (Dynamic Arrays) ⭐

Slices are Go's answer to dynamic arrays. They are backed by an array but can grow:

\`\`\`go
// Create a slice
names := []string{"Alice", "Bob", "Charlie"}

// Make a slice with initial length and capacity
scores := make([]int, 5)      // len=5, cap=5, [0,0,0,0,0]
buffer := make([]int, 0, 10)  // len=0, cap=10, []

// Append (most common operation)
names = append(names, "Diana")
names = append(names, "Eve", "Frank")

// Slicing (like Python)
sub := names[1:3]   // ["Bob", "Charlie"]
first3 := names[:3] // ["Alice", "Bob", "Charlie"]
last2 := names[3:]  // from index 3 to end

// Length vs Capacity
fmt.Println(len(names))  // Current number of elements
fmt.Println(cap(names))  // Underlying array capacity
\`\`\`

### How Slices Work Internally

\`\`\`
Slice Header:
┌──────────┬─────┬──────────┐
│ Pointer  │ Len │ Capacity │
│ (to arr) │  3  │    5     │
└──────────┴─────┴──────────┘
      │
      ▼
┌─────┬─────┬─────┬─────┬─────┐
│  10 │  20 │  30 │  __ │  __ │  ← Underlying Array
└─────┴─────┴─────┴─────┴─────┘
\`\`\`

### Common Slice Operations

\`\`\`go
// Copy a slice (avoid shared underlying array)
src := []int{1, 2, 3}
dst := make([]int, len(src))
copy(dst, src)

// Delete element at index i
i := 1
s := []int{10, 20, 30, 40, 50}
s = append(s[:i], s[i+1:]...)
// Result: [10, 30, 40, 50]

// Filter a slice
nums := []int{1, 2, 3, 4, 5, 6}
var evens []int
for _, n := range nums {
    if n%2 == 0 {
        evens = append(evens, n)
    }
}
// evens = [2, 4, 6]

// Sort a slice
import "sort"
sort.Ints(nums)
sort.Strings(names)
\`\`\`
        `,
      },
      {
        id: "maps",
        title: "Maps (Hash Maps)",
        content: `
## Maps

Maps are Go's built-in hash tables (key-value pairs):

\`\`\`go
// Create a map
ages := map[string]int{
    "Alice": 30,
    "Bob":   25,
}

// Or using make
scores := make(map[string]int)

// Set a value
scores["Alice"] = 95

// Get a value
age := ages["Alice"]  // 30

// Check if key exists (comma-ok idiom)
value, exists := ages["Charlie"]
if !exists {
    fmt.Println("Charlie not found")
}

// Delete a key
delete(ages, "Bob")

// Iterate
for key, value := range ages {
    fmt.Printf("%s is %d years old\\n", key, value)
}

// Length
fmt.Println(len(ages))
\`\`\`

### Map Gotchas

\`\`\`go
// ❌ Maps are NOT safe for concurrent use
// Use sync.Map or sync.Mutex for goroutine safety

// ❌ Map iteration order is NOT guaranteed
// Go randomizes map iteration order intentionally

// ❌ You cannot take the address of a map element
m := map[string]int{"a": 1}
// ptr := &m["a"]  // COMPILE ERROR

// ✅ Maps are reference types (passed by reference)
func modifyMap(m map[string]int) {
    m["new"] = 999  // Modifies original
}
\`\`\`
        `,
      },
    ],
  },

  // ══════════════════════════════════════════
  // STRUCTS, METHODS & INTERFACES
  // ══════════════════════════════════════════
  {
    id: "go-structs-interfaces",
    title: "Structs, Methods & Interfaces",
    description: "Go's approach to object-oriented programming without classes.",
    icon: "Box",
    sections: [
      {
        id: "structs",
        title: "Structs & Methods",
        content: `
## Structs (Go's "Objects")

Go doesn't have classes. Instead, it uses **structs** — custom data types that group fields:

\`\`\`go
// Define a struct
type User struct {
    ID        int
    FirstName string
    LastName  string
    Email     string
    Age       int
    IsActive  bool
}

// Create instances
u1 := User{
    ID:        1,
    FirstName: "Alice",
    LastName:  "Smith",
    Email:     "alice@example.com",
    Age:       30,
    IsActive:  true,
}

// Shorthand (positional — NOT recommended for large structs)
u2 := User{2, "Bob", "Jones", "bob@example.com", 25, true}

// Access fields
fmt.Println(u1.FirstName)  // "Alice"
u1.Age = 31                // Modify field

// Pointer to struct
u3 := &User{ID: 3, FirstName: "Charlie"}
fmt.Println(u3.FirstName)  // Go auto-dereferences pointers!
\`\`\`

## Methods (Functions on Structs)

Methods are functions with a **receiver** argument:

\`\`\`go
// Value receiver (works on a COPY)
func (u User) FullName() string {
    return u.FirstName + " " + u.LastName
}

// Pointer receiver (modifies the ORIGINAL)
func (u *User) Deactivate() {
    u.IsActive = false
}

// Usage
user := User{FirstName: "Alice", LastName: "Smith", IsActive: true}
fmt.Println(user.FullName())  // "Alice Smith"
user.Deactivate()
fmt.Println(user.IsActive)    // false
\`\`\`

### When to Use Pointer vs Value Receiver

| Use Pointer Receiver When... | Use Value Receiver When... |
|------------------------------|---------------------------|
| You need to modify the struct | The struct is small and read-only |
| The struct is large (avoid copying) | You want immutability |
| Consistency (if any method uses pointer, use pointer for all) | |

## Struct Embedding (Composition)

Go uses **composition** instead of inheritance:

\`\`\`go
type Address struct {
    Street string
    City   string
    State  string
}

type Employee struct {
    User     // Embedded struct (no field name = promoted fields)
    Address  // Embedded
    Role     string
    Salary   float64
}

emp := Employee{
    User:    User{ID: 1, FirstName: "Alice", LastName: "Smith"},
    Address: Address{Street: "123 Main St", City: "Mumbai"},
    Role:    "Engineer",
    Salary:  100000,
}

// Access promoted fields directly
fmt.Println(emp.FirstName)  // "Alice" (from User)
fmt.Println(emp.City)       // "Mumbai" (from Address)
fmt.Println(emp.FullName()) // "Alice Smith" (method from User)
\`\`\`
        `,
      },
      {
        id: "interfaces",
        title: "Interfaces & Polymorphism",
        content: `
## Interfaces

An interface defines a **set of method signatures**. Any type that implements those methods **automatically** satisfies the interface (no \`implements\` keyword needed — this is called **implicit implementation**):

\`\`\`go
// Define an interface
type Shape interface {
    Area() float64
    Perimeter() float64
}

// Circle implements Shape
type Circle struct {
    Radius float64
}

func (c Circle) Area() float64 {
    return math.Pi * c.Radius * c.Radius
}

func (c Circle) Perimeter() float64 {
    return 2 * math.Pi * c.Radius
}

// Rectangle implements Shape
type Rectangle struct {
    Width, Height float64
}

func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

func (r Rectangle) Perimeter() float64 {
    return 2 * (r.Width + r.Height)
}

// Polymorphic function
func printShapeInfo(s Shape) {
    fmt.Printf("Area: %.2f, Perimeter: %.2f\\n", s.Area(), s.Perimeter())
}

// Usage
printShapeInfo(Circle{Radius: 5})
printShapeInfo(Rectangle{Width: 4, Height: 6})
\`\`\`

## The Empty Interface \`interface{}\` / \`any\`

The empty interface can hold **any value** (like \`Object\` in Java or \`any\` in TypeScript):

\`\`\`go
func printAnything(val interface{}) {
    fmt.Println(val)
}

// Go 1.18+ alias
func printAnything2(val any) {
    fmt.Println(val)
}

printAnything(42)
printAnything("hello")
printAnything([]int{1, 2, 3})
\`\`\`

## Type Assertions & Type Switches

\`\`\`go
var val interface{} = "hello"

// Type assertion
str, ok := val.(string)
if ok {
    fmt.Println("It's a string:", str)
}

// Type switch
switch v := val.(type) {
case string:
    fmt.Println("String:", v)
case int:
    fmt.Println("Int:", v)
default:
    fmt.Println("Unknown type")
}
\`\`\`

## Common Standard Library Interfaces

| Interface | Method | Used For |
|-----------|--------|----------|
| \`fmt.Stringer\` | \`String() string\` | Custom string representation |
| \`error\` | \`Error() string\` | Error handling |
| \`io.Reader\` | \`Read(p []byte) (n int, err error)\` | Reading data |
| \`io.Writer\` | \`Write(p []byte) (n int, err error)\` | Writing data |
| \`sort.Interface\` | \`Len()\`, \`Less()\`, \`Swap()\` | Custom sorting |

\`\`\`go
// Implement Stringer
func (u User) String() string {
    return fmt.Sprintf("User{%s %s, age %d}", u.FirstName, u.LastName, u.Age)
}

fmt.Println(user)  // Uses String() automatically
\`\`\`
        `,
      },
      {
        id: "pointers",
        title: "Pointers Simplified",
        content: `
## What Are Pointers?

A pointer holds the **memory address** of a value. Go's pointers are simpler than C — no pointer arithmetic!

\`\`\`go
x := 42
p := &x      // & = "address of" → p is a pointer to x
fmt.Println(*p)  // * = "value at" → 42 (dereferencing)

*p = 100     // Change the value at that address
fmt.Println(x)   // 100 (x is changed!)
\`\`\`

### Visual Diagram

\`\`\`
Variable x:          Pointer p:
┌─────┐             ┌──────────┐
│  42 │  ←────────  │ 0xc00012 │  (address of x)
└─────┘             └──────────┘
addr: 0xc00012
\`\`\`

## Why Use Pointers?

\`\`\`go
// WITHOUT pointer — function gets a COPY (original unchanged)
func doubleVal(n int) {
    n = n * 2  // Only modifies the copy!
}

// WITH pointer — function modifies the ORIGINAL
func doublePtr(n *int) {
    *n = *n * 2
}

x := 10
doubleVal(x)
fmt.Println(x)  // Still 10!

doublePtr(&x)
fmt.Println(x)  // 20 ✅
\`\`\`

## Pointers With Structs (\`new\` keyword)

\`\`\`go
// Using new (returns a pointer)
p := new(User)        // *User (all fields zero-valued)
p.FirstName = "Alice" // Go auto-dereferences!

// Using & (more common)
u := &User{FirstName: "Bob", Age: 25}
\`\`\`

## When To Use Pointers

| Use Pointers | Use Values |
|-------------|------------|
| Modifying the original value | Small, immutable data |
| Large structs (avoid copying) | Primitive types (int, bool) |
| Optional/nullable values (\`nil\`) | When you want safety from mutation |

> 💡 **Go Rule of Thumb:** If a function needs to modify its argument, or the argument is large, use a pointer.
        `,
      },
    ],
  },

  // ══════════════════════════════════════════
  // ERROR HANDLING
  // ══════════════════════════════════════════
  {
    id: "go-error-handling",
    title: "Error Handling (The Go Way)",
    description: "Go's explicit error handling pattern — no try/catch, errors are values.",
    icon: "Shield",
    sections: [
      {
        id: "error-basics",
        title: "Error Handling Patterns",
        content: `
## Errors Are Values

Go doesn't have try/catch. Functions return errors as the last value:

\`\`\`go
import (
    "errors"
    "fmt"
    "os"
)

// Function that can fail
func readConfig(path string) (string, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return "", fmt.Errorf("failed to read config: %w", err)
    }
    return string(data), nil
}

// Usage — ALWAYS check errors
config, err := readConfig("config.json")
if err != nil {
    log.Fatal(err)  // or handle gracefully
}
fmt.Println(config)
\`\`\`

## Creating Custom Errors

\`\`\`go
// Simple error
err := errors.New("something went wrong")

// Formatted error
err := fmt.Errorf("user %d not found", userID)

// Custom error type
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation error: %s - %s", e.Field, e.Message)
}

// Usage
func validateAge(age int) error {
    if age < 0 || age > 150 {
        return &ValidationError{
            Field:   "age",
            Message: "must be between 0 and 150",
        }
    }
    return nil
}
\`\`\`

## Error Wrapping (Go 1.13+)

\`\`\`go
// Wrap errors to add context
func getUser(id int) (*User, error) {
    user, err := db.FindByID(id)
    if err != nil {
        return nil, fmt.Errorf("getUser(%d): %w", id, err)
        // %w wraps the original error
    }
    return user, nil
}

// Unwrap and check errors
if errors.Is(err, sql.ErrNoRows) {
    fmt.Println("User not found")
}

// Check if error is a specific type
var validErr *ValidationError
if errors.As(err, &validErr) {
    fmt.Println("Validation failed:", validErr.Field)
}
\`\`\`

## Best Practices

1. **Always handle errors** — never use \`_\` to ignore them (unless you truly don't care)
2. **Add context when wrapping** — \`fmt.Errorf("operation: %w", err)\`
3. **Return early** on errors (guard clauses)
4. **Use sentinel errors** for expected cases: \`var ErrNotFound = errors.New("not found")\`
5. **Don't panic** — use \`panic\` only for programming errors, not runtime errors

\`\`\`go
// ✅ Good: Early return pattern
func processOrder(orderID int) error {
    order, err := getOrder(orderID)
    if err != nil {
        return fmt.Errorf("processOrder: %w", err)
    }

    if err := validateOrder(order); err != nil {
        return fmt.Errorf("processOrder validation: %w", err)
    }

    if err := chargePayment(order); err != nil {
        return fmt.Errorf("processOrder payment: %w", err)
    }

    return nil
}
\`\`\`
        `,
      },
    ],
  },
];
