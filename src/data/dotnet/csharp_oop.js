export const csharpOopTopic = {
  id: "csharp-oop",
  title: "OOP in C#",
  description:
    "Classes, objects, inheritance, polymorphism, interfaces, abstract classes, records, structs, and encapsulation.",
  icon: "Box",
  sections: [
    {
      id: "classes-objects",
      title: "Classes & Objects",
      content: `
## Classes — Blueprints for Objects

A class defines the structure and behavior of objects. C# is a fully object-oriented language.

### Access Modifiers
| Modifier | Scope |
|----------|-------|
| \`public\` | Accessible from anywhere |
| \`private\` | Only within the class (default for members) |
| \`protected\` | Within class and derived classes |
| \`internal\` | Within the same assembly |
| \`protected internal\` | Same assembly OR derived classes |
| \`private protected\` | Same assembly AND derived classes |
      `,
      code: `// ═══ CLASS DEFINITION ═══
public class User
{
    // Properties (auto-implemented)
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public DateTime CreatedAt { get; init; }  // init-only (set once)
    
    // Private backing field
    private decimal _balance;
    
    // Property with custom logic
    public decimal Balance
    {
        get => _balance;
        set => _balance = value >= 0 ? value : throw new ArgumentException("Balance cannot be negative");
    }
    
    // Constructor
    public User(string name, string email)
    {
        Name = name;
        Email = email;
        CreatedAt = DateTime.UtcNow;
    }
    
    // Parameterless constructor
    public User() { }
    
    // Method
    public string GetDisplayName() => $"{Name} ({Email})";
    
    // Override ToString
    public override string ToString() => $"User[{Id}]: {Name}";
}

// ═══ USAGE ═══
var user = new User("Alice", "alice@email.com") { Id = 1 };
Console.WriteLine(user.GetDisplayName());  // Alice (alice@email.com)

// Object initializer syntax
var user2 = new User
{
    Id = 2,
    Name = "Bob",
    Email = "bob@email.com"
};

// ═══ STATIC MEMBERS ═══
public class MathHelper
{
    public static double PI => 3.14159265;
    public static int Max(int a, int b) => a > b ? a : b;
    
    // Static constructor (runs once, before first use)
    static MathHelper()
    {
        Console.WriteLine("MathHelper initialized");
    }
}
// Usage: MathHelper.Max(5, 10);

// ═══ RECORDS (C# 9+) — Immutable data objects ═══
public record Product(string Name, decimal Price, string Category);

// Records provide: Equals, GetHashCode, ToString, Deconstruction for FREE
var p1 = new Product("Laptop", 999.99m, "Electronics");
var p2 = new Product("Laptop", 999.99m, "Electronics");
Console.WriteLine(p1 == p2);  // true! (value equality, not reference)

// Non-destructive mutation (with expression)
var p3 = p1 with { Price = 899.99m };
Console.WriteLine(p3);  // Product { Name = Laptop, Price = 899.99, Category = Electronics }
      `,
    },
    {
      id: "inheritance-polymorphism",
      title: "Inheritance & Polymorphism",
      content: `
## Inheritance — Building Type Hierarchies

C# supports single inheritance (one base class) but multiple interface implementation.

### Key Keywords
- \`virtual\` — Base method can be overridden
- \`override\` — Derived class replaces the base method
- \`sealed\` — Prevent further overriding
- \`abstract\` — Must be overridden (no implementation)
- \`base\` — Call base class constructor/method
      `,
      code: `// ═══ INHERITANCE ═══
public abstract class Shape
{
    public string Color { get; set; }
    
    // Abstract method — MUST be implemented by derived classes
    public abstract double Area();
    
    // Virtual method — CAN be overridden
    public virtual string Describe() => $"A {Color} shape with area {Area():F2}";
}

public class Circle : Shape
{
    public double Radius { get; set; }
    
    public Circle(double radius, string color = "Red")
    {
        Radius = radius;
        Color = color;
    }
    
    public override double Area() => Math.PI * Radius * Radius;
    
    public override string Describe() => $"Circle: radius={Radius}, area={Area():F2}";
}

public class Rectangle : Shape
{
    public double Width { get; set; }
    public double Height { get; set; }
    
    public Rectangle(double width, double height)
    {
        Width = width;
        Height = height;
    }
    
    public override double Area() => Width * Height;
}

// ═══ POLYMORPHISM IN ACTION ═══
Shape[] shapes = { new Circle(5), new Rectangle(4, 6), new Circle(3) };

foreach (var shape in shapes)
{
    // Polymorphism: correct Area() called based on actual type
    Console.WriteLine($"{shape.GetType().Name}: Area = {shape.Area():F2}");
}
// Circle: Area = 78.54
// Rectangle: Area = 24.00
// Circle: Area = 28.27

// ═══ SEALED CLASS ═══
public sealed class Singleton
{
    private static readonly Singleton _instance = new();
    public static Singleton Instance => _instance;
    private Singleton() { }
}
// Cannot inherit from Singleton

// ═══ IS / AS / PATTERN MATCHING ═══
object obj = new Circle(5);

// Type checking
if (obj is Circle c)
{
    Console.WriteLine($"Radius: {c.Radius}");
}

// Switch on type
string info = obj switch
{
    Circle circle => $"Circle with radius {circle.Radius}",
    Rectangle rect => $"Rectangle {rect.Width}x{rect.Height}",
    _ => "Unknown shape"
};
      `,
    },
    {
      id: "interfaces",
      title: "Interfaces & Abstract Classes",
      content: `
## Interfaces vs Abstract Classes

| Feature | Interface | Abstract Class |
|---------|-----------|----------------|
| Multiple inheritance | ✅ Yes | ❌ No (single) |
| Fields | ❌ No | ✅ Yes |
| Constructor | ❌ No | ✅ Yes |
| Default methods | ✅ (C# 8+) | ✅ Yes |
| When to use | Define a contract | Share common code |

### Design Principle
> "Program to an interface, not an implementation."
      `,
      code: `// ═══ INTERFACE DEFINITION ═══
public interface IRepository<T>
{
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> CreateAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(int id);
}

public interface INotifiable
{
    void SendNotification(string message);
}

// ═══ IMPLEMENTING MULTIPLE INTERFACES ═══
public class UserRepository : IRepository<User>, INotifiable
{
    private readonly List<User> _users = new();
    
    public Task<User?> GetByIdAsync(int id) => 
        Task.FromResult(_users.FirstOrDefault(u => u.Id == id));
    
    public Task<IEnumerable<User>> GetAllAsync() => 
        Task.FromResult<IEnumerable<User>>(_users);
    
    public Task<User> CreateAsync(User user)
    {
        _users.Add(user);
        return Task.FromResult(user);
    }
    
    public Task UpdateAsync(User user) { /* ... */ return Task.CompletedTask; }
    public Task DeleteAsync(int id) { /* ... */ return Task.CompletedTask; }
    
    public void SendNotification(string message) => 
        Console.WriteLine($"Notification: {message}");
}

// ═══ INTERFACE DEFAULT METHODS (C# 8+) ═══
public interface ILogger
{
    void Log(string message);
    
    // Default implementation — classes don't need to implement this
    void LogError(string message) => Log($"[ERROR] {message}");
    void LogWarning(string message) => Log($"[WARN] {message}");
    void LogInfo(string message) => Log($"[INFO] {message}");
}

public class ConsoleLogger : ILogger
{
    public void Log(string message) => Console.WriteLine(message);
    // LogError, LogWarning, LogInfo are inherited from interface!
}

// ═══ STRUCT vs CLASS ═══
// Struct: Value type, stack allocated, no inheritance
public struct Point
{
    public double X { get; }
    public double Y { get; }
    
    public Point(double x, double y) => (X, Y) = (x, y);
    
    public double DistanceTo(Point other) =>
        Math.Sqrt(Math.Pow(X - other.X, 2) + Math.Pow(Y - other.Y, 2));
}

// Record struct (C# 10+) — value type record
public record struct Money(decimal Amount, string Currency);
      `,
    },
  ],
};
