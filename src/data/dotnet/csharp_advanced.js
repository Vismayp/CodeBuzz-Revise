export const csharpAdvancedTopic = {
  id: "csharp-advanced",
  title: "Advanced C# Features",
  description: "Delegates, events, lambdas, extension methods, pattern matching, Span<T>, ref/in/out, and attributes.",
  icon: "Cpu",
  sections: [
    { id: "delegates-events", title: "Delegates & Events", content: `
## Delegates — Type-Safe Function Pointers

A **delegate** is a type that represents a reference to a method. Think of it as a variable that holds a function.

### Built-in Delegates
| Delegate | Signature | Use Case |
|----------|-----------|----------|
| \`Action\` | \`void Method()\` | Side effects, no return |
| \`Action<T>\` | \`void Method(T arg)\` | Process input |
| \`Func<T, TResult>\` | \`TResult Method(T arg)\` | Transform data |
| \`Predicate<T>\` | \`bool Method(T arg)\` | Filter/test |

### Events
Events are a **publish-subscribe** pattern built on delegates. The publisher raises events, subscribers handle them.
      `, code: `// ═══ DELEGATES ═══
// Custom delegate type
public delegate int MathOperation(int a, int b);

// Using it
MathOperation add = (a, b) => a + b;
MathOperation multiply = (a, b) => a * b;
Console.WriteLine(add(5, 3));       // 8
Console.WriteLine(multiply(5, 3));  // 15

// Built-in delegates
Func<int, int, int> subtract = (a, b) => a - b;
Action<string> log = message => Console.WriteLine($"[LOG] {message}");
Predicate<int> isPositive = n => n > 0;

log("Hello!");                      // [LOG] Hello!
Console.WriteLine(isPositive(-5));  // false

// ═══ EVENTS ═══
public class OrderService
{
    // Declare event
    public event EventHandler<OrderEventArgs>? OrderPlaced;
    
    public void PlaceOrder(string productName, decimal amount)
    {
        Console.WriteLine($"Order placed: {productName} - {amount:C}");
        
        // Raise event
        OrderPlaced?.Invoke(this, new OrderEventArgs(productName, amount));
    }
}

public class OrderEventArgs : EventArgs
{
    public string ProductName { get; }
    public decimal Amount { get; }
    public OrderEventArgs(string product, decimal amount)
    {
        ProductName = product;
        Amount = amount;
    }
}

// Subscribe to event
// var service = new OrderService();
// service.OrderPlaced += (sender, args) => 
//     Console.WriteLine($"Email sent for {args.ProductName}");
// service.OrderPlaced += (sender, args) => 
//     Console.WriteLine($"Inventory updated for {args.ProductName}");
// service.PlaceOrder("Laptop", 999.99m);
      ` },
    { id: "extension-methods", title: "Extension Methods", content: `
## Extension Methods — Add Methods to Existing Types

Extension methods let you add new methods to existing types WITHOUT modifying their source code.
      `, code: `// ═══ EXTENSION METHODS ═══
public static class StringExtensions
{
    // "this" keyword on first parameter makes it an extension method
    public static bool IsNullOrEmpty(this string? str) => string.IsNullOrEmpty(str);
    
    public static string TruncateTo(this string str, int maxLength)
        => str.Length <= maxLength ? str : str[..maxLength] + "...";
    
    public static string ToTitleCase(this string str)
        => System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(str.ToLower());
    
    public static string Repeat(this string str, int count)
        => string.Concat(Enumerable.Repeat(str, count));
}

// Usage — looks like a regular method!
// string name = "hello world";
// Console.WriteLine(name.ToTitleCase());     // "Hello World"
// Console.WriteLine(name.TruncateTo(5));     // "hello..."
// Console.WriteLine("ha".Repeat(3));         // "hahaha"

public static class EnumerableExtensions
{
    // Check if collection is empty
    public static bool IsEmpty<T>(this IEnumerable<T> source) => !source.Any();
    
    // Get random element
    public static T Random<T>(this IList<T> list)
    {
        var rng = new System.Random();
        return list[rng.Next(list.Count)];
    }
    
    // ForEach on IEnumerable (like List.ForEach)
    public static void ForEach<T>(this IEnumerable<T> source, Action<T> action)
    {
        foreach (var item in source) action(item);
    }
}
      ` },
    { id: "pattern-matching", title: "Pattern Matching (C# 8-14)", content: `
## Pattern Matching — Powerful Type Checks

C# has progressively added powerful pattern matching. Here's the complete guide.

### Pattern Types
| Pattern | Example | Description |
|---------|---------|-------------|
| Type | \`obj is string s\` | Check and cast type |
| Constant | \`x is 42\` | Compare to constant |
| Relational | \`x is > 0 and < 100\` | Numeric comparison |
| Property | \`p is { Age: > 18 }\` | Check property values |
| Positional | \`p is (0, 0)\` | Deconstruct and check |
| List | \`arr is [1, .., 3]\` | Match array patterns |
| Discard | \`_\` | Match anything |
      `, code: `// ═══ TYPE PATTERNS ═══
object data = "Hello World";
if (data is string text)
    Console.WriteLine(text.ToUpper());  // HELLO WORLD

// ═══ RELATIONAL PATTERNS ═══
static string Classify(int value) => value switch
{
    < 0 => "Negative",
    0 => "Zero",
    > 0 and <= 10 => "Small positive",
    > 10 and <= 100 => "Medium",
    _ => "Large"
};

// ═══ PROPERTY PATTERNS ═══
record Order(string Status, decimal Amount, bool IsPriority);

static string ProcessOrder(Order order) => order switch
{
    { Status: "cancelled" } => "Order cancelled",
    { Amount: > 1000, IsPriority: true } => "VIP Priority Order",
    { Amount: > 500 } => "High value order",
    { Status: "pending", Amount: var a } when a < 10 => $"Small pending: {a:C}",
    _ => "Standard order"
};

// ═══ LIST PATTERNS (C# 11+) ═══
int[] numbers = { 1, 2, 3, 4, 5 };
string result = numbers switch
{
    [] => "Empty",
    [var single] => $"Single: {single}",
    [var first, .., var last] => $"First: {first}, Last: {last}",
};
// Result: "First: 1, Last: 5"

// ═══ COMBINING PATTERNS ═══
static decimal CalculateShipping(Order order) => order switch
{
    { Amount: >= 100 } or { IsPriority: true } => 0m,    // Free shipping
    { Amount: >= 50 } => 4.99m,
    { Amount: >= 25 } => 7.99m,
    _ => 12.99m
};
      ` },
    { id: "span-memory", title: "Span<T> & Memory Performance", content: `
## Span<T> — High-Performance Memory Access

\`Span<T>\` provides a type-safe, memory-safe view over contiguous memory — arrays, stack memory, or native buffers — without heap allocation.

### Why Span?
- **Zero allocation**: No garbage collection pressure
- **Slicing without copying**: Access sub-arrays without creating new arrays
- **Stack only**: Cannot be used in async methods or stored on heap
      `, code: `// ═══ BASIC SPAN ═══
int[] array = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// Create a Span (no copy!)
Span<int> span = array;

// Slice without allocating a new array
Span<int> firstThree = span[..3];     // { 1, 2, 3 }
Span<int> lastThree = span[^3..];     // { 8, 9, 10 }
Span<int> middle = span[3..7];        // { 4, 5, 6, 7 }

// Modify through span — modifies original array!
firstThree[0] = 100;
Console.WriteLine(array[0]); // 100 (original modified)

// ═══ SPAN FOR STRING PARSING (Zero Allocation) ═══
ReadOnlySpan<char> text = "2025-01-15".AsSpan();
ReadOnlySpan<char> year = text[..4];    // "2025"
ReadOnlySpan<char> month = text[5..7];  // "01"
ReadOnlySpan<char> day = text[8..];     // "15"
// No string allocations!

// ═══ STACKALLOC — Allocate on Stack ═══
Span<int> stackArray = stackalloc int[100];
for (int i = 0; i < stackArray.Length; i++)
    stackArray[i] = i * i;
// stackArray lives on stack — blazing fast, auto-cleaned

// ═══ PERFORMANCE COMPARISON ═══
// ❌ BAD: Creates new array (heap allocation)
// int[] copy = array[3..7];  // New allocation!

// ✅ GOOD: Span gives a view (zero allocation)
// Span<int> view = array.AsSpan(3, 4);  // No allocation!

// ═══ ReadOnlySpan for Safety ═══
static int Sum(ReadOnlySpan<int> values)
{
    int total = 0;
    foreach (var v in values) total += v;
    return total;
}
// Usage: Sum(new[] { 1, 2, 3, 4, 5 });
      ` },
  ],
};
