export const dotnetInterviewTopic = {
  id: "dotnet-interview",
  title: "🎯 .NET Interview Questions",
  description: "Top interview topics: value vs reference types, async pitfalls, DI scopes, EF N+1, threading, and system design.",
  icon: "Target",
  sections: [
    { id: "fundamentals-interview", title: "C# Fundamentals — Interview Q&A", content: `
## Top C# & .NET Interview Questions

### Q1: What is the difference between value types and reference types?
**Answer**: Value types (int, bool, struct) are stored on the **stack** and copied by value. Reference types (string, class, array) are stored on the **heap** and copied by reference (only the pointer is copied).

### Q2: Explain the difference between \`const\` and \`readonly\`.
**Answer**: \`const\` is a **compile-time** constant — the value is baked into the assembly. \`readonly\` is set at **runtime** and can only be assigned in the constructor.

### Q3: What is the difference between \`String\` and \`StringBuilder\`?
**Answer**: \`String\` is **immutable** — every modification creates a new string object. \`StringBuilder\` is **mutable** — it modifies the same buffer without allocations. Use \`StringBuilder\` for loops or heavy string manipulation.

### Q4: What are nullable reference types?
**Answer**: C# 8+ added nullable reference types to reduce \`NullReferenceException\`. With \`#nullable enable\`, the compiler warns if you might access a null reference. \`string?\` means nullable, \`string\` means non-nullable.
      `, code: `// ═══ VALUE vs REFERENCE TYPES — Proof ═══
// Value type
int a = 5;
int b = a;     // b = 5 (copy)
b = 10;        // a is still 5

// Reference type
var list1 = new List<int> { 1, 2, 3 };
var list2 = list1;   // list2 points to SAME object
list2.Add(4);        // list1 also has 4 now!
// list1: [1, 2, 3, 4]  ← Modified!

// ═══ STRING vs STRINGBUILDER ═══
// ❌ BAD: Creates 10,000 string objects (slow)
string result = "";
for (int i = 0; i < 10000; i++)
    result += i.ToString();  // New string each time!

// ✅ GOOD: One mutable buffer (fast)
var sb = new System.Text.StringBuilder();
for (int i = 0; i < 10000; i++)
    sb.Append(i);
string fast = sb.ToString();

// ═══ BOXING / UNBOXING ═══
// Boxing: Value type → object (heap allocation)
int num = 42;
object boxed = num;     // Boxing: int copied to heap

// Unboxing: object → value type (type check + copy)
int unboxed = (int)boxed;  // Unboxing

// ❌ Performance trap:
// ArrayList uses object → Everything gets boxed
// ✅ Use generic List<int> instead — no boxing!

// ═══ STRUCT vs CLASS ═══
public struct Point    // Value type (stack)
{
    public int X, Y;
}

public class PointClass  // Reference type (heap)
{
    public int X, Y;
}

var p1 = new Point { X = 1, Y = 2 };
var p2 = p1;   // p2 is a COPY
p2.X = 99;     // p1.X is still 1 (value type!)

var pc1 = new PointClass { X = 1, Y = 2 };
var pc2 = pc1; // pc2 is a REFERENCE
pc2.X = 99;    // pc1.X is now 99! (reference type!)
      ` },
    { id: "async-interview", title: "Async/Await — Common Pitfalls", content: `
## Async Interview Questions

### Q: What's the difference between \`Task\` and \`ValueTask\`?
**Answer**: \`Task\` always allocates on the heap. \`ValueTask\` is a struct that avoids allocation when the result is available synchronously (e.g., cached data). Use \`ValueTask\` for hot paths.

### Q: What happens when you call \`.Result\` on a Task in ASP.NET?
**Answer**: **DEADLOCK!** The synchronization context waits for the result, but the continuation can't run because it's waiting for the same context. Always use \`await\`.

### Q: Explain the difference between \`Task.WhenAll\` and \`Task.WhenAny\`.
- **WhenAll**: Waits for ALL tasks to complete. Throws if ANY task throws.
- **WhenAny**: Returns when the FIRST task completes. Others continue running.
      `, code: `// ═══ ASYNC ANTI-PATTERNS ═══

// ❌ DEADLOCK: .Result blocks the thread
// var result = GetDataAsync().Result;  // DEADLOCK in ASP.NET!

// ✅ CORRECT: Always await
// var result = await GetDataAsync();

// ❌ FIRE AND FORGET (exceptions lost)
// SomeMethodAsync();  // No await — exception silently swallowed!

// ✅ CORRECT: If truly fire-and-forget, handle errors
// _ = Task.Run(async () =>
// {
//     try { await SomeMethodAsync(); }
//     catch (Exception ex) { logger.LogError(ex, "Background task failed"); }
// });

// ═══ TASK vs VALUETASK ═══
// Task: Always allocates
// ValueTask: May avoid allocation

// ❌ Using Task for cached results
public async Task<User> GetUserAsyncBad(int id)
{
    if (_cache.TryGetValue(id, out var cached))
        return cached;  // Task allocation wasted!
    
    return await _db.Users.FindAsync(id);
}

// ✅ Using ValueTask for cached results
public ValueTask<User> GetUserAsyncGood(int id)
{
    if (_cache.TryGetValue(id, out var cached))
        return new ValueTask<User>(cached);  // No allocation!
    
    return new ValueTask<User>(LoadFromDbAsync(id));
}

// ═══ CONCURRENT vs PARALLEL ═══
// Concurrent (async): Multiple I/O operations at once (no extra threads)
var tasks = userIds.Select(id => GetUserAsync(id));
var users = await Task.WhenAll(tasks);

// Parallel (threads): Multiple CPU operations at once (extra threads)
Parallel.ForEach(data, item => ProcessCpuIntensiveWork(item));

// Rule of thumb:
// I/O bound → async/await (database, HTTP, file)
// CPU bound → Parallel/Task.Run (calculations, image processing)
      ` },
    { id: "di-interview", title: "Dependency Injection — Gotchas", content: `
## DI Interview Questions

### Q: What's the danger of injecting a Scoped service into a Singleton?
**Answer**: **Captive Dependency!** The Scoped service will be "captured" by the Singleton and live forever — it becomes effectively a Singleton too. This breaks the per-request scope (e.g., DbContext sharing state across requests).

### Q: Explain the three DI lifetimes.
| Lifetime | New Instance | Disposed |
|----------|-------------|----------|
| Transient | Every injection | When scope ends |
| Scoped | Once per request | End of request |
| Singleton | Once per app | App shutdown |
      `, code: `// ═══ CAPTIVE DEPENDENCY BUG ═══

// ❌ DANGER: Scoped service inside Singleton
// public class PaymentProcessor  // Registered as SINGLETON
// {
//     private readonly AppDbContext _db;  // Registered as SCOPED
//     
//     public PaymentProcessor(AppDbContext db) => _db = db;
//     // _db lives as long as PaymentProcessor → FOREVER
//     // But DbContext tracks changes → memory leak + stale data!
// }

// ✅ FIX 1: Use IServiceScopeFactory
// public class PaymentProcessor
// {
//     private readonly IServiceScopeFactory _scopeFactory;
//     
//     public PaymentProcessor(IServiceScopeFactory scopeFactory)
//         => _scopeFactory = scopeFactory;
//     
//     public async Task ProcessAsync(Payment payment)
//     {
//         using var scope = _scopeFactory.CreateScope();
//         var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
//         // Fresh DbContext for this operation
//     }
// }

// ✅ FIX 2: Make both services the same lifetime
// builder.Services.AddScoped<IPaymentProcessor, PaymentProcessor>();

// ═══ VALIDATE DI (.NET 8+) ═══
// Enable scope validation in development to catch these bugs:
// builder.Host.UseDefaultServiceProvider(options =>
// {
//     options.ValidateScopes = true;       // Catches captive dependencies
//     options.ValidateOnBuild = true;      // Validates all registrations at startup
// });

// ═══ REGISTRATION ORDER MATTERS ═══
// Last registration wins for single interface → implementation
// builder.Services.AddScoped<ILogger, ConsoleLogger>();
// builder.Services.AddScoped<ILogger, FileLogger>();  // This one wins!

// Use GetServices to get ALL registrations
// var allLoggers = sp.GetServices<ILogger>();  // Returns both
      ` },
    { id: "system-design-interview", title: "System Design — .NET Edition", content: `
## .NET System Design Interview Questions

### Q: How would you design a high-traffic e-commerce order system?
Key points to discuss:
1. **Clean Architecture** with layers
2. **CQRS** — Separate read and write models
3. **Event-driven** — RabbitMQ/Kafka for order events
4. **Caching** — Redis for frequently accessed data
5. **Rate limiting** — Built-in .NET 7+ rate limiter
6. **Health checks** — /health endpoint for load balancers
      `, code: `// ═══ PRODUCTION-READY API TEMPLATE ═══
// var builder = WebApplication.CreateBuilder(args);
// 
// // ═══ SERVICES ═══
// // Database
// builder.Services.AddDbContext<AppDbContext>(options =>
//     options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
// 
// // Caching
// builder.Services.AddStackExchangeRedisCache(options =>
//     options.Configuration = builder.Configuration.GetConnectionString("Redis"));
// 
// // Health Checks
// builder.Services.AddHealthChecks()
//     .AddNpgSql(builder.Configuration.GetConnectionString("Default")!)
//     .AddRedis(builder.Configuration.GetConnectionString("Redis")!);
// 
// // Authentication
// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//     .AddJwtBearer(/* ... */);
// 
// // Rate Limiting
// builder.Services.AddRateLimiter(options =>
//     options.AddFixedWindowLimiter("api", opt =>
//     {
//         opt.PermitLimit = 100;
//         opt.Window = TimeSpan.FromMinutes(1);
//     }));
// 
// // CORS
// builder.Services.AddCors(options =>
//     options.AddDefaultPolicy(policy =>
//         policy.WithOrigins("https://myapp.com").AllowAnyMethod().AllowAnyHeader()));
// 
// // DI Registration
// builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
// builder.Services.AddScoped<IUserService, UserService>();
// builder.Services.AddScoped<IOrderService, OrderService>();
// builder.Services.AddSingleton<ICacheService, RedisCacheService>();
// 
// // Swagger
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();
// 
// var app = builder.Build();
// 
// // ═══ MIDDLEWARE PIPELINE ═══
// // Order matters!
// app.UseExceptionHandler();
// app.UseHsts();
// app.UseHttpsRedirection();
// app.UseCors();
// app.UseAuthentication();
// app.UseAuthorization();
// app.UseRateLimiter();
// app.MapHealthChecks("/health");
// app.MapControllers();
// 
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }
// 
// app.Run();

// ═══ CACHING PATTERN ═══
// public class CachedUserService : IUserService
// {
//     private readonly IUserService _inner;
//     private readonly IDistributedCache _cache;
//     
//     public async Task<User?> GetByIdAsync(int id, CancellationToken ct)
//     {
//         var key = $"user:{id}";
//         var cached = await _cache.GetStringAsync(key, ct);
//         if (cached is not null)
//             return JsonSerializer.Deserialize<User>(cached);
//         
//         var user = await _inner.GetByIdAsync(id, ct);
//         if (user is not null)
//         {
//             await _cache.SetStringAsync(key, 
//                 JsonSerializer.Serialize(user),
//                 new DistributedCacheEntryOptions
//                 {
//                     AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
//                 }, ct);
//         }
//         return user;
//     }
// }
      ` },
  ],
};
