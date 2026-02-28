export const dotnet10FeaturesTopic = {
  id: "dotnet10-features",
  title: ".NET 10 & C# 14 Features",
  description: "Extension members, field keyword, null-conditional assignment, .NET 10 AI framework, NativeAOT, and performance.",
  icon: "Sparkles",
  sections: [
    { id: "csharp14-features", title: "C# 14 — New Language Features", content: `
## C# 14 — Released with .NET 10 (November 2025)

C# 14 focuses on developer productivity and expressiveness. Here are the headline features.

### Feature Overview

| Feature | Description |
|---------|-------------|
| **Extension Members** | Extension properties, static methods, operators |
| **\`field\` Keyword** | Access backing field in auto-properties |
| **Null-Conditional Assignment** | \`obj?.Prop = value\` |
| **\`nameof\` with Unbound Generics** | \`nameof(List<>)\` works |
| **Partial Events & Constructors** | Extend partial keyword |
| **User-Defined Compound Assignment** | Custom \`+=\`, \`-=\` operators |
| **Lambda Modifiers** | \`ref\`, \`out\` in simple lambdas |
| **File-Based Apps** | \`dotnet run file.cs\` |
      `, code: `// ═══ 1. EXTENSION MEMBERS (The Big One!) ═══
// Before C# 14: Only extension methods were possible
// C# 14: Extension properties, static methods, indexers, operators!

// Extension property
public static class StringExtensions
{
    // extension property (C# 14)
    // In C# 14, you can write:
    // implicit extension StringExt for string
    // {
    //     public bool IsCapitalized => this.Length > 0 && char.IsUpper(this[0]);
    //     public string Reversed => new string(this.Reverse().ToArray());
    // }
    
    // Until adoption, use extension methods:
    public static bool IsCapitalized(this string s) => 
        s.Length > 0 && char.IsUpper(s[0]);
}

// ═══ 2. FIELD KEYWORD ═══
// Access the compiler-generated backing field directly
public class Temperature
{
    // Before: Manual backing field
    // private double _celsius;
    // public double Celsius
    // {
    //     get => _celsius;
    //     set => _celsius = value < -273.15 ? throw new ArgumentException() : value;
    // }
    
    // C# 14: 'field' keyword auto-references backing field
    public double Celsius
    {
        get => field;
        set => field = value < -273.15 
            ? throw new ArgumentException("Below absolute zero!") 
            : value;
    }
    
    // Useful for lazy initialization
    public string DisplayName
    {
        get => field ??= $"{Celsius}°C";
    }
}

// ═══ 3. NULL-CONDITIONAL ASSIGNMENT ═══
// Before C# 14:
// if (user != null) user.Name = "Alice";

// C# 14:
// user?.Name = "Alice";  // Only assigns if user is not null
// user?.Profile?.DisplayName = "Hello";  // Chain null-conditional

// ═══ 4. nameof WITH UNBOUND GENERICS ═══
// Before: nameof(List<object>)  // Had to provide a type argument
// C# 14:  nameof(List<>)        // Works without type argument!
// var typeName = nameof(Dictionary<,>);  // "Dictionary"

// ═══ 5. LAMBDA MODIFIERS ═══
// Before: (int x, ref int y) => { y = x * 2; }  // Explicit types required
// C# 14:  (x, ref y) => { y = x * 2; }          // Type inferred with modifiers!

// ═══ 6. FILE-BASED APPS ═══
// Just create a .cs file and run it!
// $ dotnet run hello.cs
// No project file needed — great for scripting and quick prototyping

// Content of hello.cs:
// using System.Net.Http;
// var client = new HttpClient();
// var response = await client.GetStringAsync("https://api.github.com/zen");
// Console.WriteLine(response);

// ═══ 7. USER-DEFINED COMPOUND ASSIGNMENT ═══
public struct Vector2
{
    public double X { get; set; }
    public double Y { get; set; }
    
    // C# 14: Custom += operator
    // public static Vector2 operator +=(Vector2 a, Vector2 b) 
    //     => new(a.X + b.X, a.Y + b.Y);
    
    public static Vector2 operator +(Vector2 a, Vector2 b) 
        => new() { X = a.X + b.X, Y = a.Y + b.Y };
}
      ` },
    { id: "dotnet10-runtime", title: ".NET 10 — Platform Enhancements", content: `
## .NET 10 — Runtime & Framework Updates

.NET 10 is an **LTS release** (Long-Term Support until November 2028).

### Key Improvements

| Area | Enhancement |
|------|------------|
| **Runtime** | Improved JIT inlining, better devirtualization |
| **NativeAOT** | Smaller binaries, faster startup |
| **AI Integration** | Microsoft Agent Framework, MCP support |
| **ASP.NET Core** | Blazor WebAssembly preloading, passkey auth |
| **EF Core 10** | LINQ LeftJoin/RightJoin, named query filters |
| **Performance** | AVX10.2 support, stack allocation improvements |
| **Security** | Post-quantum cryptography APIs |
| **JSON** | Disallow duplicate properties, PipeReader support |
      `, code: `// ═══ .NET 10 PERFORMANCE IMPROVEMENTS ═══

// NativeAOT — Ahead of Time Compilation
// Publish as a self-contained native binary
// dotnet publish -c Release -r linux-x64 --self-contained /p:PublishAot=true
// Benefits: 
//   • No JIT warmup (instant start)
//   • Smaller memory footprint
//   • No .NET runtime required on target machine

// ═══ EF CORE 10 IMPROVEMENTS ═══

// LEFT JOIN operator (finally!)
// var results = from u in db.Users
//               join o in db.Orders on u.Id equals o.UserId into userOrders
//               from o in userOrders.DefaultIfEmpty()  // LEFT JOIN behavior
//               select new { u.Name, OrderId = (int?)o.Id };

// .NET 10 introduces LeftJoin method:
// var results = db.Users
//     .LeftJoin(db.Orders, u => u.Id, o => o.UserId, (u, o) => new { u.Name, o.Id });

// Named Query Filters
// modelBuilder.Entity<Post>()
//     .HasQueryFilter("ActiveOnly", p => p.IsPublished && !p.IsDeleted)
//     .HasQueryFilter("IncludeDeleted", p => p.IsPublished);
// 
// var posts = await db.Posts.WithFilter("ActiveOnly").ToListAsync();

// ═══ MICROSOFT AGENT FRAMEWORK ═══
// Build AI agents with .NET 10
// var agent = new AgentBuilder()
//     .WithModel("gpt-4")
//     .WithTool(new WebSearchTool())
//     .WithTool(new DatabaseQueryTool())
//     .WithMemory(new ConversationMemory())
//     .Build();
// 
// var response = await agent.InvokeAsync("Find the latest sales data");

// ═══ ASP.NET CORE 10 — Minimal API Validation ═══
// Built-in validation for minimal APIs (no more manual checks!)
// app.MapPost("/api/users", ([AsParameters] CreateUserRequest request) =>
// {
//     return Results.Created($"/api/users/{request.Id}", request);
// }).WithValidation();  // Auto-validates based on data annotations

// ═══ BLAZOR IMPROVEMENTS ═══
// WebAssembly preloading via <link rel="modulepreload">
// Memory pool eviction for better memory management
// Passkey authentication support (WebAuthn)

// ═══ JSON SERIALIZATION ═══
// Disallow duplicate properties (prevent DoS attacks)
// var options = new JsonSerializerOptions
// {
//     AllowDuplicateProperties = false  // .NET 10 default
// };

// PipeReader support for streaming JSON
// await foreach (var item in JsonSerializer.DeserializeAsyncEnumerable<Product>(stream))
// {
//     Console.WriteLine(item);
// }
      ` },
  ],
};
