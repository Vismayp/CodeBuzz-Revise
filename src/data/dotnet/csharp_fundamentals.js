export const csharpFundamentalsTopic = {
  id: "csharp-fundamentals",
  title: "C# Fundamentals",
  description:
    "Variables, data types, operators, control flow, methods, strings, arrays, nullable types, and type casting.",
  icon: "Code",
  sections: [
    {
      id: "csharp-overview",
      title: "C# & .NET Overview",
      content: `
## C# — A Modern, Type-Safe Language

**C#** (C-Sharp) is a modern, object-oriented, type-safe programming language developed by Microsoft. It runs on the **.NET** platform.

### Why C#?
- **Type-safe**: Catch errors at compile time, not runtime
- **Modern**: Pattern matching, LINQ, async/await, records
- **Cross-platform**: .NET runs on Windows, macOS, Linux
- **Versatile**: Web (ASP.NET), Mobile (MAUI), Desktop (WPF), Games (Unity), Cloud (Azure)
- **Performance**: Near C++ performance with managed memory

### .NET Ecosystem

| Component | Purpose |
|-----------|---------|
| **.NET Runtime (CLR)** | Executes C# code, manages memory |
| **BCL** | Base Class Library (collections, I/O, etc.) |
| **ASP.NET Core** | Web apps & APIs |
| **Entity Framework** | Database ORM |
| **MAUI** | Cross-platform mobile/desktop |
| **Blazor** | Web UI with C# (instead of JavaScript) |

### .NET 10 (LTS — November 2025)
.NET 10 is the latest Long-Term Support release with C# 14, delivering 3 years of updates.
      `,
      code: `// ═══ YOUR FIRST C# PROGRAM ═══
// .NET 10 uses top-level statements (no Main method needed!)

Console.WriteLine("Hello, C# World!");

// With traditional structure:
namespace MyApp;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello from Main!");
        Console.WriteLine($"Running on .NET {Environment.Version}");
    }
}

// ═══ Creating a new project ═══
// dotnet new console -n MyApp        // Create new console app
// dotnet run                         // Run the app
// dotnet build                       // Build without running
// dotnet new webapi -n MyApi         // Create new Web API
// dotnet new list                    // List all templates
      `,
    },
    {
      id: "variables-types",
      title: "Variables & Data Types",
      content: `
## C# Data Types

### Value Types (stored on stack)

| Type | Size | Range | Example |
|------|------|-------|---------|
| \`bool\` | 1 byte | true/false | \`bool isActive = true;\` |
| \`byte\` | 1 byte | 0 to 255 | \`byte age = 25;\` |
| \`int\` | 4 bytes | ±2.1 billion | \`int count = 42;\` |
| \`long\` | 8 bytes | ±9.2 quintillion | \`long bigNum = 123456789L;\` |
| \`float\` | 4 bytes | ~7 digits precision | \`float pi = 3.14f;\` |
| \`double\` | 8 bytes | ~15 digits precision | \`double precise = 3.14159;\` |
| \`decimal\` | 16 bytes | 28-29 digits | \`decimal money = 99.99m;\` |
| \`char\` | 2 bytes | Unicode character | \`char grade = 'A';\` |

### Reference Types (stored on heap)

| Type | Description | Example |
|------|-------------|---------|
| \`string\` | Immutable text | \`string name = "Alice";\` |
| \`object\` | Base type of all types | \`object anything = 42;\` |
| \`dynamic\` | Runtime type resolution | \`dynamic val = "hello";\` |
| Arrays | Fixed-size collections | \`int[] nums = {1, 2, 3};\` |
| Classes | Custom reference types | \`var user = new User();\` |

### var, const, readonly
- \`var\`: Compiler infers the type (still strongly typed!)
- \`const\`: Compile-time constant, must be assigned
- \`readonly\`: Can be set only in constructor
      `,
      code: `// ═══ VARIABLE DECLARATIONS ═══
int age = 30;
double salary = 85000.50;
decimal price = 29.99m;       // 'm' suffix for decimal
bool isActive = true;
char initial = 'V';
string name = "Vismay";

// var — Type inference (compiler figures out the type)
var message = "Hello";        // string inferred
var count = 42;               // int inferred
var items = new List<string>(); // List<string> inferred

// ═══ CONSTANTS ═══
const double PI = 3.14159265;
const string APP_NAME = "RevisionHub";
// const values MUST be known at compile time

// ═══ TYPE CONVERSION ═══
// Implicit (safe, no data loss)
int num = 42;
long bigNum = num;            // int → long (safe)
double dbl = num;             // int → double (safe)

// Explicit casting (possible data loss)
double d = 3.99;
int i = (int)d;               // 3 (truncated, not rounded!)
int rounded = (int)Math.Round(d); // 4

// Parse strings
int parsed = int.Parse("42");
bool success = int.TryParse("abc", out int result); // false, result = 0

// Convert class
string numStr = Convert.ToString(42);
int fromStr = Convert.ToInt32("42");

// ═══ STRING INTERPOLATION ═══
string firstName = "Alice";
int userAge = 25;
string greeting = $"Hello, {firstName}! You are {userAge} years old.";
string multi = $"Total: {price * 3:C2}";  // Currency format: $89.97

// Verbatim strings (for paths, regex)
string path = @"C:\\Users\\Documents\\file.txt";
string json = @"{""name"": ""Alice"", ""age"": 25}";

// Raw string literals (C# 11+)
string raw = \\\"""
    {
        "name": "Alice",
        "age": 25
    }
    \\\""";

// ═══ NULLABLE TYPES ═══
int? nullableInt = null;       // Nullable value type
int? hasValue = 42;

if (nullableInt.HasValue)
    Console.WriteLine(nullableInt.Value);

// Null coalescing operator
int safeValue = nullableInt ?? 0;  // Use 0 if null

// Null conditional operator
string? userName = null;
int? length = userName?.Length;    // null (doesn't throw)
      `,
    },
    {
      id: "control-flow",
      title: "Control Flow",
      content: `
## if/else, switch, Loops

C# provides all standard control flow constructs plus modern pattern matching in switch expressions.
      `,
      code: `// ═══ IF / ELSE ═══
int score = 85;

if (score >= 90)
    Console.WriteLine("A");
else if (score >= 80)
    Console.WriteLine("B");
else if (score >= 70)
    Console.WriteLine("C");
else
    Console.WriteLine("F");

// Ternary operator
string result = score >= 60 ? "Pass" : "Fail";

// ═══ SWITCH STATEMENT ═══
string day = "Monday";
switch (day)
{
    case "Monday":
    case "Tuesday":
    case "Wednesday":
    case "Thursday":
    case "Friday":
        Console.WriteLine("Weekday");
        break;
    case "Saturday":
    case "Sunday":
        Console.WriteLine("Weekend");
        break;
    default:
        Console.WriteLine("Invalid");
        break;
}

// ═══ SWITCH EXPRESSION (C# 8+) — Much cleaner! ═══
string dayType = day switch
{
    "Monday" or "Tuesday" or "Wednesday" or "Thursday" or "Friday" => "Weekday",
    "Saturday" or "Sunday" => "Weekend",
    _ => "Invalid"  // _ is the discard/default pattern
};

// Pattern matching in switch
object value = 42;
string description = value switch
{
    int n when n > 100 => "Large number",
    int n when n > 0 => $"Positive: {n}",
    int n when n < 0 => "Negative",
    string s => $"String: {s}",
    null => "Null value",
    _ => "Unknown type"
};

// ═══ LOOPS ═══
// For loop
for (int i = 0; i < 5; i++)
    Console.Write($"{i} ");  // 0 1 2 3 4

// While loop
int counter = 10;
while (counter > 0)
{
    counter--;
}

// Do-while (runs at least once)
do
{
    Console.WriteLine("This runs at least once");
} while (false);

// Foreach (most common in C#)
var names = new[] { "Alice", "Bob", "Carol" };
foreach (var n in names)
    Console.WriteLine(n);

// ═══ RANGE PATTERNS (C# 11+) ═══
int temperature = 22;
string weather = temperature switch
{
    < 0 => "Freezing",
    >= 0 and < 10 => "Cold",
    >= 10 and < 20 => "Cool",
    >= 20 and < 30 => "Warm",
    >= 30 => "Hot"
};
      `,
    },
    {
      id: "methods",
      title: "Methods & Parameters",
      content: `
## Methods — Reusable Code Blocks

### Parameter Types
- \`ref\`: Pass by reference (must be initialized)
- \`out\`: Pass by reference (doesn't need initialization)
- \`in\`: Read-only reference (performance optimization)
- \`params\`: Variable number of arguments
- Optional parameters with defaults
      `,
      code: `// ═══ BASIC METHOD ═══
static int Add(int a, int b)
{
    return a + b;
}

// Expression-bodied method (one-liner)
static int Multiply(int a, int b) => a * b;

// Void method
static void Greet(string name) => Console.WriteLine($"Hello, {name}!");

// ═══ PARAMETER TYPES ═══

// ref: Caller's variable is modified
static void DoubleIt(ref int x) => x *= 2;
// Usage:
// int val = 5;
// DoubleIt(ref val);  // val is now 10

// out: Method must assign a value
static bool TryDivide(int a, int b, out double result)
{
    if (b == 0) { result = 0; return false; }
    result = (double)a / b;
    return true;
}
// Usage:
// if (TryDivide(10, 3, out double res))
//     Console.WriteLine(res);  // 3.333...

// in: Read-only reference (no copying, no modification)
static double CalculateArea(in double radius) => Math.PI * radius * radius;

// params: Variable number of arguments
static int Sum(params int[] numbers)
{
    int total = 0;
    foreach (var n in numbers) total += n;
    return total;
}
// Usage: Sum(1, 2, 3, 4, 5);  // 15

// ═══ OPTIONAL & NAMED PARAMETERS ═══
static string CreateUser(
    string firstName,
    string lastName,
    string email = "N/A",    // Optional with default
    int age = 0,
    bool isActive = true)
{
    return $"{firstName} {lastName} ({email}) Age:{age} Active:{isActive}";
}
// Usage:
// CreateUser("Alice", "Smith");
// CreateUser("Bob", "Jones", age: 30);  // Named parameter
// CreateUser("Carol", "Wilson", isActive: false, email: "c@email.com");

// ═══ TUPLES (Return multiple values) ═══
static (string Name, int Age) GetUser()
{
    return ("Alice", 30);
}
// Usage:
// var (name, age) = GetUser();
// Console.WriteLine($"{name} is {age}");

// ═══ LOCAL FUNCTIONS (C# 7+) ═══
static int Fibonacci(int n)
{
    if (n <= 1) return n;
    
    // Local function — only visible inside Fibonacci
    int Fib(int x) => x <= 1 ? x : Fib(x - 1) + Fib(x - 2);
    
    return Fib(n);
}
      `,
    },
    {
      id: "arrays-collections-intro",
      title: "Arrays & Basic Collections",
      content: `
## Arrays & Collections

### Arrays
Fixed-size, type-safe collections of elements.

### Common Collection Types
- \`List<T>\` — Dynamic-size array (most common)
- \`Dictionary<TKey, TValue>\` — Key-value pairs
- \`HashSet<T>\` — Unique values, O(1) lookup
      `,
      code: `// ═══ ARRAYS ═══
// Declaration
int[] numbers = { 1, 2, 3, 4, 5 };
string[] names = new string[3];   // Empty array of size 3
var doubles = new double[] { 1.1, 2.2, 3.3 };

// Access and modify
Console.WriteLine(numbers[0]);    // 1 (zero-indexed)
numbers[4] = 50;                  // Modify element

// Array methods
Array.Sort(numbers);
Array.Reverse(numbers);
int index = Array.IndexOf(numbers, 3);
bool contains = numbers.Contains(3);

// Multi-dimensional arrays
int[,] matrix = { { 1, 2, 3 }, { 4, 5, 6 } };
Console.WriteLine(matrix[1, 2]);  // 6

// Jagged array (array of arrays — different sizes)
int[][] jagged = new int[3][];
jagged[0] = new int[] { 1, 2 };
jagged[1] = new int[] { 3, 4, 5 };
jagged[2] = new int[] { 6 };

// ═══ LIST<T> ═══
var fruits = new List<string> { "Apple", "Banana", "Cherry" };
fruits.Add("Date");               // Add to end
fruits.Insert(1, "Avocado");      // Insert at index
fruits.Remove("Banana");          // Remove by value
fruits.RemoveAt(0);               // Remove by index
bool has = fruits.Contains("Cherry"); // true
int idx = fruits.IndexOf("Cherry");
fruits.Sort();

// ═══ DICTIONARY<K, V> ═══
var ages = new Dictionary<string, int>
{
    ["Alice"] = 30,
    ["Bob"] = 25,
    ["Carol"] = 35
};
ages["David"] = 28;               // Add new entry
ages["Alice"] = 31;               // Update existing

if (ages.TryGetValue("Eve", out int eveAge))
    Console.WriteLine(eveAge);
else
    Console.WriteLine("Eve not found");

foreach (var (name, age) in ages)
    Console.WriteLine($"{name}: {age}");

// ═══ HASHSET<T> ═══
var uniqueNums = new HashSet<int> { 1, 2, 3, 3, 3 };
// uniqueNums contains: { 1, 2, 3 }

uniqueNums.Add(4);                // true (added)
uniqueNums.Add(3);                // false (already exists)
bool exists = uniqueNums.Contains(2); // O(1) lookup!

// Set operations
var setA = new HashSet<int> { 1, 2, 3, 4 };
var setB = new HashSet<int> { 3, 4, 5, 6 };
setA.IntersectWith(setB);  // { 3, 4 }
// setA.UnionWith(setB);    // { 1, 2, 3, 4, 5, 6 }
// setA.ExceptWith(setB);   // { 1, 2 }
      `,
    },
  ],
};
