export const dotnetCoreTopic = {
  id: "dotnet-core",
  title: ".NET Platform & Architecture",
  description: "CLR, JIT, Garbage Collection, dependency injection, configuration, logging, and middleware pipeline.",
  icon: "Server",
  sections: [
    { id: "dotnet-architecture", title: ".NET Architecture & CLR", content: `
## .NET Architecture — How It Works Under the Hood

### The Compilation Pipeline
\`\`\`
C# Source Code → C# Compiler → IL (Intermediate Language) → JIT Compiler → Native Code
\`\`\`

### Key Components

| Component | Purpose |
|-----------|---------|
| **CLR** (Common Language Runtime) | Manages execution, memory, security |
| **JIT** (Just-In-Time Compiler) | Converts IL to native code at runtime |
| **GC** (Garbage Collector) | Automatic memory management |
| **BCL** (Base Class Library) | Built-in types, collections, I/O |
| **Kestrel** | Cross-platform web server |

### Value Types vs Reference Types (Interview Gold)

| Feature | Value Type | Reference Type |
|---------|-----------|----------------|
| Storage | Stack | Heap |
| Copy behavior | Copies the value | Copies the reference |
| Default value | Zero/false | null |
| Examples | int, bool, struct, enum | string, class, array, interface |
| GC collected | ❌ No | ✅ Yes |
      `, code: `// ═══ VALUE vs REFERENCE TYPES ═══
// Value type: copied by value
int a = 5;
int b = a;      // b gets a COPY of 5
b = 10;
Console.WriteLine(a); // 5 (unchanged)

// Reference type: copied by reference
var list1 = new List<int> { 1, 2, 3 };
var list2 = list1;    // list2 points to SAME list
list2.Add(4);
Console.WriteLine(list1.Count); // 4 (modified through list2!)

// ═══ GARBAGE COLLECTION ═══
// GC has 3 generations:
// Gen 0: Short-lived objects (most objects) — collected frequently
// Gen 1: Medium-lived objects — buffer between Gen 0 and Gen 2
// Gen 2: Long-lived objects (static, singletons) — collected rarely

// Force GC (DON'T do this in production)
// GC.Collect();

// ═══ IDisposable & using ═══
// For unmanaged resources (files, connections, streams)
public class DatabaseConnection : IDisposable
{
    private bool _disposed = false;
    
    public void Query(string sql) { /* ... */ }
    
    public void Dispose()
    {
        if (!_disposed)
        {
            // Release unmanaged resources
            _disposed = true;
        }
    }
}

// Usage with 'using' — auto-calls Dispose()
// using var db = new DatabaseConnection();
// db.Query("SELECT * FROM users");
// Dispose() is called automatically when 'db' goes out of scope
      ` },
    { id: "dependency-injection", title: "Dependency Injection", content: `
## Dependency Injection — The Core of .NET

DI is a first-class citizen in .NET. The built-in DI container manages object lifetimes.

### Service Lifetimes

| Lifetime | Scope | Use Case |
|----------|-------|----------|
| \`Transient\` | New instance every time | Lightweight, stateless services |
| \`Scoped\` | One per HTTP request | DbContext, per-request state |
| \`Singleton\` | One for entire app | Caches, configuration, HttpClient |

### Registration Pattern
\`\`\`csharp
builder.Services.AddTransient<IEmailService, SmtpEmailService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddSingleton<ICacheService, RedisCacheService>();
\`\`\`
      `, code: `// ═══ DEFINING SERVICES ═══
public interface IUserService
{
    Task<User?> GetByIdAsync(int id);
    Task<IEnumerable<User>> GetAllAsync();
    Task CreateAsync(User user);
}

public class UserService : IUserService
{
    private readonly IUserRepository _repo;
    private readonly ILogger<UserService> _logger;
    
    // Dependencies injected via constructor
    public UserService(IUserRepository repo, ILogger<UserService> logger)
    {
        _repo = repo;
        _logger = logger;
    }
    
    public async Task<User?> GetByIdAsync(int id)
    {
        _logger.LogInformation("Getting user {UserId}", id);
        return await _repo.GetByIdAsync(id);
    }
    
    public async Task<IEnumerable<User>> GetAllAsync() => 
        await _repo.GetAllAsync();
    
    public async Task CreateAsync(User user) =>
        await _repo.CreateAsync(user);
}

// ═══ REGISTRATION IN Program.cs ═══
// var builder = WebApplication.CreateBuilder(args);
// 
// // Register services
// builder.Services.AddScoped<IUserRepository, UserRepository>();
// builder.Services.AddScoped<IUserService, UserService>();
// builder.Services.AddSingleton<ICacheService, MemoryCacheService>();
// 
// // Add framework services
// builder.Services.AddControllers();
// builder.Services.AddDbContext<AppDbContext>(options =>
//     options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
// 
// var app = builder.Build();

// ═══ KEYED SERVICES (.NET 8+) ═══
// Register multiple implementations of same interface
// builder.Services.AddKeyedScoped<INotificationService, EmailNotifier>("email");
// builder.Services.AddKeyedScoped<INotificationService, SmsNotifier>("sms");
//
// // Inject specific one:
// public class OrderService([FromKeyedServices("email")] INotificationService notifier) { }
      ` },
    { id: "configuration-logging", title: "Configuration & Logging", content: `
## Configuration & Logging — Production Essentials

### Configuration Sources (Priority Order)
1. Command-line arguments
2. Environment variables
3. User secrets (development)
4. appsettings.{Environment}.json
5. appsettings.json

### Structured Logging
Use structured logging with templates, not string interpolation!
      `, code: `// ═══ CONFIGURATION ═══
// appsettings.json
// {
//   "ConnectionStrings": {
//     "Default": "Host=localhost;Database=mydb;Username=admin;Password=secret"
//   },
//   "Jwt": {
//     "Secret": "my-secret-key",
//     "Issuer": "MyApp",
//     "ExpirationMinutes": 60
//   },
//   "Features": {
//     "EnableNewUI": true,
//     "MaxRetries": 3
//   }
// }

// Options pattern (recommended)
public class JwtSettings
{
    public string Secret { get; set; } = "";
    public string Issuer { get; set; } = "";
    public int ExpirationMinutes { get; set; } = 60;
}

// Registration:
// builder.Services.Configure<JwtSettings>(
//     builder.Configuration.GetSection("Jwt")
// );

// Usage via DI:
// public class AuthService
// {
//     private readonly JwtSettings _jwt;
//     public AuthService(IOptions<JwtSettings> options)
//     {
//         _jwt = options.Value;
//     }
// }

// ═══ LOGGING ═══
public class ProductController
{
    private readonly ILogger<ProductController> _logger;
    
    public ProductController(ILogger<ProductController> logger) => _logger = logger;
    
    public void ProcessOrder(int orderId)
    {
        // ✅ GOOD: Structured logging with templates
        _logger.LogInformation("Processing order {OrderId}", orderId);
        
        // ❌ BAD: String interpolation (can't search by OrderId)
        // _logger.LogInformation($"Processing order {orderId}");
        
        try
        {
            // ... business logic
            _logger.LogInformation("Order {OrderId} processed successfully", orderId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to process order {OrderId}", orderId);
            throw;
        }
    }
}

// Log Levels: Trace < Debug < Information < Warning < Error < Critical
      ` },
    { id: "middleware-pipeline", title: "Middleware Pipeline", content: `
## Middleware — The Request Pipeline

Every HTTP request flows through a pipeline of **middleware**. Each middleware can:
1. Process the request
2. Call the next middleware
3. Process the response

### Pipeline Order Matters!
\`\`\`
Request → Logging → Auth → CORS → Routing → Controller → Response
\`\`\`
      `, code: `// ═══ MIDDLEWARE PIPELINE (Program.cs) ═══
// var app = builder.Build();
// 
// // Order matters! Each runs in sequence
// app.UseExceptionHandler("/error");  // 1. Catch exceptions
// app.UseHsts();                       // 2. HTTPS strict
// app.UseHttpsRedirection();           // 3. Redirect HTTP → HTTPS
// app.UseCors("AllowAll");             // 4. CORS headers
// app.UseAuthentication();             // 5. Who are you?
// app.UseAuthorization();              // 6. Are you allowed?
// app.UseRateLimiter();                // 7. Rate limiting
// app.MapControllers();                // 8. Route to controllers

// ═══ CUSTOM MIDDLEWARE ═══
public class RequestTimingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestTimingMiddleware> _logger;
    
    public RequestTimingMiddleware(RequestDelegate next, ILogger<RequestTimingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        var sw = System.Diagnostics.Stopwatch.StartNew();
        
        // Add custom header
        context.Response.OnStarting(() =>
        {
            context.Response.Headers["X-Response-Time"] = $"{sw.ElapsedMilliseconds}ms";
            return Task.CompletedTask;
        });
        
        await _next(context);  // Call next middleware
        
        sw.Stop();
        _logger.LogInformation(
            "{Method} {Path} responded {StatusCode} in {Elapsed}ms",
            context.Request.Method,
            context.Request.Path,
            context.Response.StatusCode,
            sw.ElapsedMilliseconds
        );
    }
}

// Register: app.UseMiddleware<RequestTimingMiddleware>();
// Or shorthand:
// app.Use(async (context, next) =>
// {
//     Console.WriteLine($"Request: {context.Request.Path}");
//     await next();
//     Console.WriteLine($"Response: {context.Response.StatusCode}");
// });
      ` },
  ],
};
