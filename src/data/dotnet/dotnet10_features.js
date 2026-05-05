export const dotnet10FeaturesTopic = {
  id: "dotnet10-features",
  title: ".NET 10 & C# 14 Mastery",
  description:
    "Beginner-to-production guide for .NET 10, C# 14, ASP.NET Core, EF Core 10, NativeAOT, diagnostics, and Windows Services.",
  icon: "Sparkles",
  sections: [
    {
      id: "dotnet10-big-picture",
      title: ".NET 10 Big Picture",
      content: `
## .NET 10 - What You Are Really Learning

.NET 10 is an LTS release. LTS means Long-Term Support: it is the version teams prefer for production systems because Microsoft supports it for three years. Think of .NET 10 as four layers working together:

| Layer | Beginner Meaning | Production Meaning |
|------|------------------|--------------------|
| C# 14 | The language you write | Safer, shorter, clearer business code |
| .NET Runtime | Runs your compiled app | JIT, GC, threading, NativeAOT, performance |
| Base Libraries | Built-in APIs | JSON, HTTP, cryptography, diagnostics, collections |
| App Frameworks | Web, worker, desktop, data | ASP.NET Core, Worker Services, EF Core, Windows Services |

### The Beginner Mental Model

When you write a C# file, the compiler does not directly produce the final CPU instructions in the usual path. It produces IL, which means Intermediate Language. At runtime, the CLR loads that IL and the JIT compiler turns hot code into native machine code.

The normal flow is:

1. You write C#.
2. The C# compiler creates IL.
3. The CLR loads the app.
4. The JIT compiles methods when needed.
5. The garbage collector cleans unused managed objects.
6. The host coordinates configuration, logging, DI, and lifetime.

### Why .NET 10 Matters

.NET 10 improves the parts you usually do not write yourself but depend on every day:

| Area | Why It Matters |
|------|----------------|
| Runtime performance | Better JIT decisions, devirtualization, inlining, stack allocation, and NativeAOT improvements |
| SDK | Better CLI behavior, Microsoft.Testing.Platform support in <code>dotnet test</code>, improved tool execution |
| Libraries | More JSON safety, diagnostics, networking, cryptography, numerics, collections, and process APIs |
| ASP.NET Core | Better Minimal API validation, Blazor improvements, OpenAPI improvements, auth behavior changes |
| EF Core 10 | Cleaner joins, named query filters, better query translation, performance improvements |
| Worker Services | Production-ready background processes using the Generic Host |

### What To Master First

Do not start by memorizing every new API. Master these ideas in order:

1. C# syntax and type system: values, references, nullability, records, interfaces, generics.
2. Async: <code>Task</code>, <code>async</code>, <code>await</code>, cancellation, timeouts.
3. Dependency Injection: lifetimes, constructor injection, options pattern.
4. Logging and configuration: structured logs, environment overrides, secrets.
5. Data access: EF Core tracking, migrations, transactions, indexes, query shape.
6. Hosting: web apps, workers, Windows Services, graceful shutdown.
7. Production operations: health checks, retries, idempotency, observability, deployment.

### Common Beginner Confusion

| Confusion | Correct Understanding |
|----------|-----------------------|
| .NET and C# are the same | C# is the language. .NET is the runtime, libraries, SDK, and app platform. |
| Async means faster CPU code | Async improves waiting efficiency, especially I/O. It does not make CPU work magically faster. |
| Singleton means always good for performance | Singleton is only safe for stateless or thread-safe shared services. |
| BackgroundService is a thread | It is a hosted lifetime abstraction. Your code still uses tasks, timers, queues, and cancellation. |
| Windows Service is a special C# project | In modern .NET, it is usually a Worker Service configured to run under Windows Service Control Manager. |

### Mastery Goal

By the end of this topic, you should be able to answer:

1. What changed in C# 14 and when to use each feature.
2. What changed in .NET 10 runtime, SDK, libraries, ASP.NET Core, and EF Core.
3. How to build a production Worker Service.
4. How to deploy that worker as a Windows Service.
5. How to design the service so it survives restarts, failures, duplicate work, slow dependencies, and shutdowns.
      `,
      code: `// Install and inspect .NET 10
// dotnet --list-sdks
// dotnet --version
// dotnet --info

// Create the main project types you will see in production:
// dotnet new webapi  -n Orders.Api      // HTTP API
// dotnet new worker  -n Orders.Worker   // Background process
// dotnet new console -n Orders.Tools    // CLI/admin tool
// dotnet new classlib -n Orders.Core    // Business/domain library

// Typical production solution shape:
// Orders.sln
//   src/Orders.Api        -> controllers/minimal APIs
//   src/Orders.Worker     -> queues, scheduled jobs, Windows Service
//   src/Orders.Core       -> domain logic, interfaces, DTOs
//   src/Orders.Data       -> EF Core DbContext, repositories
//   test/Orders.Tests     -> unit/integration tests

// A modern .NET app starts with the Generic Host.
// The host wires up configuration, logging, dependency injection,
// lifetime events, and graceful shutdown.
HostApplicationBuilder builder = Host.CreateApplicationBuilder(args);

builder.Services.AddOptions<AppSettings>()
    .Bind(builder.Configuration.GetSection("App"))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddHostedService<Worker>();

IHost host = builder.Build();
await host.RunAsync();

public sealed class AppSettings
{
    public string ServiceName { get; set; } = "Orders.Worker";
    public int PollSeconds { get; set; } = 10;
}
      `,
    },
    {
      id: "csharp14-features",
      title: "C# 14 From Beginner To Practical",
      content: `
## C# 14 - The New Language Features

C# 14 ships with .NET 10. Most features are not about changing architecture; they remove small pieces of noise from code you already write.

| Feature | Beginner Explanation | Best Use |
|---------|----------------------|----------|
| Extension members | Add methods/properties to existing types without editing those types | Clean helper APIs for domain types and library types |
| <code>field</code> backed properties | Use the hidden backing field of an auto-property | Validate or normalize property values with less boilerplate |
| Null-conditional assignment | Assign only if the receiver is not null | Optional object graphs and event-like updates |
| <code>nameof</code> with unbound generics | Use <code>nameof(List&lt;&gt;)</code> without a fake type argument | Diagnostics, logs, validation messages |
| Span conversions | Easier safe high-performance memory code | Parsing, buffers, serializers |
| Lambda modifiers | Use <code>out</code>, <code>ref</code>, <code>in</code> with inferred lambda types | Delegate-heavy code and parsing helpers |
| Partial constructors/events | Split generated declarations and handwritten implementation | Source generators and framework code |
| User-defined compound assignment | Custom <code>+=</code> and similar operators | Numeric, vector, money, units, and domain value types |
| File-based apps | Run a single C# file directly | Scripts, demos, diagnostics, learning |

### Extension Members

Before C# 14, extension methods could make <code>customer.IsVip()</code> look like an instance method even though the method lived elsewhere. C# 14 expands the idea so you can add extension properties and static-style extension members.

Use this when:

1. You do not own the original type.
2. The helper is natural for that type.
3. The helper is reusable across the codebase.

Avoid this when:

1. The method hides important dependencies.
2. The method performs database or network calls unexpectedly.
3. The method makes business behavior hard to discover.

### The field Keyword

Properties often start simple:

<code>public string Name { get; set; } = "";</code>

Then you need validation, so older C# required a manual private field. With C# 14, <code>field</code> lets you keep the property shape but customize accessors.

Use it for simple validation, normalization, and lazy defaults. If the logic becomes large, move it into a method so the property stays readable.

### Null-Conditional Assignment

This lets you write:

<code>customer?.Profile = profile;</code>

The assignment only happens if <code>customer</code> is not null. The right side is not evaluated when the left side is null. This is useful, but do not use it to hide required data. If a customer must exist, throw or return a validation error instead.

### File-Based Apps

File-based apps help you run one C# file without creating a full project. They are excellent for learning, quick scripts, and small diagnostics. Production services should still use normal project files because you need configuration, packages, tests, publish profiles, and deployment metadata.
      `,
      code: `// =========================
// 1. EXTENSION MEMBERS
// =========================
public static class OrderExtensions
{
    // Classic extension method. Still useful and widely used.
    public static bool IsLargeOrder(this Order order) => order.Total >= 10_000m;

    // C# 14 extension blocks can add extension properties and static members.
    // Example shape:
    //
    // extension(Order order)
    // {
    //     public bool RequiresApproval => order.Total >= 10_000m;
    // }
}

public sealed record Order(int Id, decimal Total);

// =========================
// 2. FIELD-BACKED PROPERTY
// =========================
public sealed class Customer
{
    public string Name
    {
        get;
        set => field = string.IsNullOrWhiteSpace(value)
            ? throw new ArgumentException("Name is required.", nameof(value))
            : value.Trim();
    } = "Unknown";

    public string Email
    {
        get => field;
        set => field = value.Trim().ToLowerInvariant();
    } = "";
}

// =========================
// 3. NULL-CONDITIONAL ASSIGNMENT
// =========================
public sealed class CustomerProfile
{
    public string? DisplayName { get; set; }
}

CustomerProfile? profile = GetOptionalProfile();
profile?.DisplayName = "Vismay"; // Assigns only when profile is not null.

static CustomerProfile? GetOptionalProfile() => new();

// =========================
// 4. NAMEOF UNBOUND GENERICS
// =========================
string listName = nameof(List<>);          // "List"
string dictionaryName = nameof(Dictionary<,>); // "Dictionary"

// Useful for generic diagnostics:
throw new InvalidOperationException($"Unsupported collection type: {nameof(List<>)}");

// =========================
// 5. SIMPLE LAMBDA PARAMETER MODIFIERS
// =========================
delegate bool TryParse<T>(string text, out T result);

TryParse<int> parseInt = (text, out result) => int.TryParse(text, out result);

// =========================
// 6. FILE-BASED APP
// =========================
// hello.cs
// Console.WriteLine("Hello from a single C# file.");
//
// Run:
// dotnet run hello.cs
      `,
    },
    {
      id: "dotnet10-platform",
      title: ".NET 10 Runtime, SDK, Libraries",
      content: `
## .NET 10 Platform Enhancements

The platform changes are mostly invisible until you care about startup time, memory, throughput, tooling, serialization safety, or deployment shape.

### Runtime Concepts

| Concept | Beginner Explanation | Production Impact |
|---------|----------------------|-------------------|
| JIT inlining | Replaces a small method call with the method body | Less call overhead, better optimization |
| Devirtualization | Turns some interface/virtual calls into direct calls | Faster dispatch and more JIT optimization |
| Stack allocation | Stores short-lived data on the stack | Less GC pressure |
| NativeAOT | Compiles ahead of time into a native executable | Fast startup, lower memory, fewer runtime dependencies |
| GC | Cleans managed heap objects | Throughput, latency, memory stability |

### NativeAOT Decision Guide

NativeAOT is excellent for:

1. Small CLI tools.
2. Serverless functions where cold start matters.
3. Workers that need fast startup and lower memory.
4. Self-contained deployment with fewer moving parts.

Be careful with NativeAOT when:

1. Your app uses heavy reflection.
2. Your app loads plugins dynamically.
3. Your serializers depend on runtime type discovery.
4. A library is not trimming/AOT friendly.

### SDK And CLI Improvements

.NET 10 improves command consistency, testing platform support, tool execution, CLI introspection, tab completion, and file-based app workflows. The practical mastery point is: learn the CLI, because production debugging often happens where Visual Studio is not available.

### Library Improvements

Important library areas in .NET 10 include:

| Library Area | Why You Care |
|--------------|--------------|
| JSON | Safer handling of duplicate properties, stricter settings, streaming efficiency |
| Cryptography | Expanded post-quantum crypto support and related APIs |
| Networking | Improvements such as easier WebSocket usage |
| Diagnostics | Better visibility into runtime behavior |
| Process APIs | Better control for process groups, especially on Windows |

### Performance Thinking For Beginners

Do not optimize blindly. Production performance work follows a loop:

1. Measure with logs, metrics, traces, counters, or profilers.
2. Find the expensive path.
3. Change one thing.
4. Measure again.
5. Keep the change only if it improves the real workload.

The usual bottleneck in business apps is not C# syntax. It is database round trips, missing indexes, chatty HTTP calls, blocking async code, unbounded queues, or bad object lifetimes.
      `,
      code: `// =========================
// PUBLISH OPTIONS
// =========================

// Framework-dependent publish:
// Requires .NET runtime installed on the server.
// Smaller output, easier patching through runtime updates.
// dotnet publish -c Release -o ./publish

// Self-contained publish:
// Includes the runtime with your app.
// Good when you control less of the server environment.
// dotnet publish -c Release -r win-x64 --self-contained true -o ./publish

// Single-file publish:
// Easier deployment for Windows Services and CLI tools.
// dotnet publish -c Release -r win-x64 --self-contained true /p:PublishSingleFile=true

// NativeAOT publish:
// Fast startup and lower memory, but requires AOT-friendly code.
// dotnet publish -c Release -r win-x64 /p:PublishAot=true

// ReadyToRun:
// Middle ground. Improves startup without the full constraints of NativeAOT.
// dotnet publish -c Release -r win-x64 /p:PublishReadyToRun=true

// =========================
// JSON SAFETY EXAMPLE
// =========================
using System.Text.Json;

var options = new JsonSerializerOptions
{
    PropertyNameCaseInsensitive = true,

    // In .NET 10, JSON options include stricter duplicate-property handling.
    // Use strict input rules for security-sensitive APIs.
};

public sealed record PaymentRequest(string PaymentId, decimal Amount);

// =========================
// BASIC MEASUREMENT
// =========================
using System.Diagnostics;

var sw = Stopwatch.StartNew();
await ProcessBatchAsync();
sw.Stop();

logger.LogInformation(
    "Processed batch in {ElapsedMilliseconds} ms",
    sw.ElapsedMilliseconds);

static Task ProcessBatchAsync() => Task.Delay(100);
      `,
    },
    {
      id: "aspnet-efcore10",
      title: "ASP.NET Core 10 & EF Core 10",
      content: `
## ASP.NET Core 10 And EF Core 10

Most production .NET systems are either HTTP services, background workers, or both. ASP.NET Core handles the HTTP side. EF Core handles the database side.

### ASP.NET Core 10 Concepts

| Concept | Beginner Meaning | Production Pattern |
|---------|------------------|--------------------|
| Minimal API | Map routes directly in <code>Program.cs</code> | Small APIs, internal services, fast endpoints |
| Controller API | Class-based HTTP endpoints | Larger APIs with filters, conventions, versioning |
| Middleware | Code that runs before/after endpoints | Auth, CORS, exception handling, rate limiting |
| Validation | Reject bad input early | DataAnnotations, custom validators, consistent ProblemDetails |
| Authentication | Who are you? | JWT, cookies, Entra ID, Identity |
| Authorization | What can you do? | Policies, roles, claims |

### Minimal API Validation

In .NET 10, validation is more reusable because validation APIs are available through <code>Microsoft.Extensions.Validation</code>. For Minimal APIs, registering validation lets endpoints automatically validate request models and return 400 responses when invalid.

Beginner rule: validate at the boundary. Do not let invalid input travel deep into your domain code.

### EF Core 10 Concepts

| Feature | Why It Matters |
|---------|----------------|
| <code>LeftJoin</code> and <code>RightJoin</code> | Cleaner query syntax for optional relationships |
| Named query filters | Separate soft-delete, tenant, and active-record filters |
| Better parameterized collection translation | Helps query plan reuse and database performance |
| JSON update improvements | More efficient updates for JSON-mapped complex types |

### EF Core Production Rules

1. Use migrations deliberately. Review generated SQL before production.
2. Add indexes for frequent filters, joins, and sort columns.
3. Avoid lazy loading in APIs unless you fully understand query count.
4. Use <code>AsNoTracking</code> for read-only queries.
5. Keep <code>DbContext</code> scoped, not singleton.
6. Use transactions for multi-step writes that must succeed together.
7. Make background jobs idempotent because retries can happen.
8. Log slow queries and inspect generated SQL when performance matters.

### Soft Delete And Multi-Tenancy

Named query filters are a major production improvement because real apps often need more than one global rule. Example: normal users should not see deleted rows, and tenants should only see their own rows. Admin screens may need to disable only the soft-delete filter while keeping the tenant filter.
      `,
      code: `// =========================
// ASP.NET CORE 10 MINIMAL API VALIDATION
// =========================
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http.HttpResults;

var builder = WebApplication.CreateBuilder(args);

// .NET 10 validation APIs are registered explicitly.
builder.Services.AddValidation();
builder.Services.AddProblemDetails();

var app = builder.Build();

app.UseExceptionHandler();

app.MapPost("/products", (CreateProductRequest request) =>
{
    // If validation fails, ASP.NET Core can return 400 before this runs.
    return TypedResults.Created($"/products/{Guid.NewGuid()}", request);
});

app.Run();

public sealed record CreateProductRequest(
    [Required, StringLength(100)] string Name,
    [Range(1, 1_000_000)] decimal Price);

// =========================
// EF CORE 10 NAMED QUERY FILTERS
// =========================
using Microsoft.EntityFrameworkCore;

public sealed class AppDbContext(string tenantId, DbContextOptions<AppDbContext> options)
    : DbContext(options)
{
    public DbSet<Blog> Blogs => Set<Blog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Blog>()
            .HasQueryFilter("SoftDeleteFilter", b => !b.IsDeleted)
            .HasQueryFilter("TenantFilter", b => b.TenantId == tenantId);
    }
}

public sealed class Blog
{
    public int Id { get; set; }
    public string TenantId { get; set; } = "";
    public string Name { get; set; } = "";
    public bool IsDeleted { get; set; }
}

// Normal query: applies both filters.
// var blogs = await db.Blogs.ToListAsync();

// Admin recycle-bin query: ignore soft delete, keep tenant isolation.
// var deleted = await db.Blogs
//     .IgnoreQueryFilters(["SoftDeleteFilter"])
//     .Where(b => b.IsDeleted)
//     .ToListAsync();

// =========================
// EF CORE 10 LEFT JOIN
// =========================
// var query = db.Students.LeftJoin(
//     db.Departments,
//     student => student.DepartmentId,
//     department => department.Id,
//     (student, department) => new
//     {
//         student.Name,
//         DepartmentName = department == null ? "[NONE]" : department.Name
//     });
      `,
    },
    {
      id: "windows-services-production",
      title: "Windows Services Production Mastery",
      content: `
## Windows Services With .NET 10

A Windows Service is a long-running process managed by Windows Service Control Manager. In modern .NET, you usually build it as a Worker Service and add Windows Service integration.

### When To Use A Windows Service

Use a Windows Service when:

1. The app must run continuously on a Windows server.
2. There is no user interface.
3. The process should start after boot.
4. You need Service Control Manager start, stop, restart, and recovery behavior.
5. The workload is internal: polling, queue processing, file watching, scheduled sync, hardware integration, or Windows-only dependencies.

Do not use a Windows Service just because code runs in the background. For cloud-native systems, a container, scheduled job, queue consumer, or platform worker may be better.

### Worker Service Vocabulary

| Term | Meaning |
|------|---------|
| Worker Service | Project template for background processing |
| Generic Host | Provides DI, logging, configuration, lifetime |
| IHostedService | Interface with start and stop lifecycle methods |
| BackgroundService | Base class that implements IHostedService and gives you <code>ExecuteAsync</code> |
| Windows Service | Operating-system service managed by Service Control Manager |
| AddWindowsService | Configures the .NET host for Windows Service behavior |

### Production Service Architecture

A good Windows Service separates responsibilities:

| Layer | Responsibility |
|-------|----------------|
| Worker | Lifetime loop, cancellation, orchestration |
| Job/service class | Business operation for one unit of work |
| Repository/client | Database, HTTP, file system, queue access |
| Options | Strongly typed configuration |
| Logging/metrics | Operational visibility |

The worker should not contain all business logic. It should coordinate. This makes testing easier and keeps shutdown behavior clean.

### The Golden Rules

1. Always honor <code>CancellationToken</code>.
2. Use <code>PeriodicTimer</code> instead of raw <code>while</code> plus fixed delays for repeated work.
3. Create a DI scope inside each loop when using scoped services like <code>DbContext</code>.
4. Catch expected per-item failures so one bad item does not kill the entire batch.
5. Let truly fatal startup/configuration problems fail fast.
6. Use structured logs with useful IDs: job id, tenant id, file path, correlation id.
7. Make work idempotent: retrying the same job should not corrupt data.
8. Add timeouts around external dependencies.
9. Configure Windows recovery actions to restart on failure.
10. Exit with a non-zero code for fatal crashes when you want SCM recovery to run.

### Scoped Services Inside BackgroundService

Hosted services are registered like singletons. That means injecting a scoped <code>DbContext</code> directly into a <code>BackgroundService</code> is wrong. Instead, inject <code>IServiceScopeFactory</code>, create a scope per iteration or per batch, then resolve scoped services from that scope.

### Failure Strategy

Separate failures into categories:

| Failure | Example | Handling |
|---------|---------|----------|
| Expected item failure | One bad message | Log, mark failed, continue |
| Transient dependency failure | SQL timeout, HTTP 503 | Retry with backoff, then continue or pause |
| Configuration failure | Missing connection string | Fail fast at startup |
| Fatal unknown failure | Corrupted state | Log critical, exit non-zero |

### Deployment Pattern

The usual deployment flow:

1. Publish as <code>win-x64</code>, often self-contained and single-file.
2. Copy output to a stable folder like <code>C:\\Services\\OrdersWorker</code>.
3. Create the service using <code>sc.exe create</code>.
4. Configure recovery using <code>sc.exe failure</code>.
5. Start with <code>sc.exe start</code>.
6. Check Windows Event Viewer and application logs.
7. Stop with <code>sc.exe stop</code> before replacing files.

### Service Account Pattern

Do not run everything as LocalSystem by habit. Use the least-privileged account that can do the job. Give it only the permissions it needs: folder read/write, network share access, certificate access, database login, or queue permissions.

### Production Checklist

Before calling a Windows Service production-ready, verify:

1. It starts after reboot.
2. It stops within the configured shutdown timeout.
3. It logs startup, shutdown, each batch summary, and failures.
4. It handles cancellation during delay, database calls, HTTP calls, and file processing.
5. It does not process the same job twice in a dangerous way.
6. It can resume after a crash.
7. It has recovery actions configured.
8. Its configuration is environment-specific and secrets are not committed.
9. It has tests for the job logic outside the worker loop.
10. Operators know where logs, config, binaries, and service commands live.
      `,
      code: `// =========================
// Orders.Worker.csproj
// =========================
// <Project Sdk="Microsoft.NET.Sdk.Worker">
//   <PropertyGroup>
//     <TargetFramework>net10.0-windows</TargetFramework>
//     <Nullable>enable</Nullable>
//     <ImplicitUsings>enable</ImplicitUsings>
//     <OutputType>exe</OutputType>
//     <RuntimeIdentifier>win-x64</RuntimeIdentifier>
//     <PlatformTarget>x64</PlatformTarget>
//     <PublishSingleFile Condition="'$(Configuration)' == 'Release'">true</PublishSingleFile>
//   </PropertyGroup>
//   <ItemGroup>
//     <PackageReference Include="Microsoft.Extensions.Hosting.WindowsServices" Version="10.0.0" />
//   </ItemGroup>
// </Project>

// =========================
// Program.cs
// =========================
using Microsoft.Extensions.Logging.Configuration;
using Microsoft.Extensions.Logging.EventLog;
using Microsoft.Extensions.Options;

HostApplicationBuilder builder = Host.CreateApplicationBuilder(args);

builder.Services.AddWindowsService(options =>
{
    options.ServiceName = "Orders Import Worker";
});

LoggerProviderOptions.RegisterProviderOptions<EventLogSettings, EventLogLoggerProvider>(
    builder.Services);

builder.Services.AddOptions<WorkerOptions>()
    .Bind(builder.Configuration.GetSection("Worker"))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddScoped<IOrderImportJob, OrderImportJob>();
builder.Services.AddHostedService<OrdersWorker>();

await builder.Build().RunAsync();

public sealed class WorkerOptions
{
    public int PollSeconds { get; set; } = 30;
    public int BatchSize { get; set; } = 100;
}

public interface IOrderImportJob
{
    Task<int> ProcessBatchAsync(int batchSize, CancellationToken cancellationToken);
}

public sealed class OrderImportJob(ILogger<OrderImportJob> logger) : IOrderImportJob
{
    public async Task<int> ProcessBatchAsync(int batchSize, CancellationToken cancellationToken)
    {
        // Real code would read pending work from a DB, queue, folder, or API.
        await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);

        logger.LogInformation("Processed {BatchSize} order import records", batchSize);
        return batchSize;
    }
}

public sealed class OrdersWorker(
    IServiceScopeFactory scopeFactory,
    IOptions<WorkerOptions> options,
    ILogger<OrdersWorker> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("Orders worker starting");

        try
        {
            using var timer = new PeriodicTimer(
                TimeSpan.FromSeconds(options.Value.PollSeconds));

            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                await RunOneBatchAsync(stoppingToken);
            }
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
        {
            logger.LogInformation("Orders worker stopping because cancellation was requested");
        }
        catch (Exception ex)
        {
            logger.LogCritical(ex, "Orders worker crashed");

            // For Windows Service recovery actions to restart the process,
            // terminate with a non-zero exit code for truly fatal errors.
            Environment.Exit(1);
        }
    }

    private async Task RunOneBatchAsync(CancellationToken cancellationToken)
    {
        using IServiceScope scope = scopeFactory.CreateScope();
        IOrderImportJob job = scope.ServiceProvider.GetRequiredService<IOrderImportJob>();

        int processed = await job.ProcessBatchAsync(
            options.Value.BatchSize,
            cancellationToken);

        logger.LogInformation("Orders worker batch completed. Processed={Processed}", processed);
    }
}

// =========================
// appsettings.Production.json
// =========================
// {
//   "Worker": {
//     "PollSeconds": 30,
//     "BatchSize": 100
//   },
//   "Logging": {
//     "LogLevel": {
//       "Default": "Information",
//       "Microsoft.Hosting.Lifetime": "Information"
//     },
//     "EventLog": {
//       "SourceName": "Orders Import Worker",
//       "LogName": "Application",
//       "LogLevel": {
//         "Default": "Warning",
//         "Microsoft.Hosting.Lifetime": "Information"
//       }
//     }
//   }
// }

// =========================
// POWERSHELL DEPLOYMENT COMMANDS
// =========================
// dotnet publish -c Release -r win-x64 --self-contained true -o C:\\Services\\OrdersWorker
//
// sc.exe create "Orders Import Worker" binpath= "C:\\Services\\OrdersWorker\\Orders.Worker.exe"
// sc.exe failure "Orders Import Worker" reset= 86400 actions= restart/60000/restart/60000/restart/300000
// sc.exe start "Orders Import Worker"
// sc.exe query "Orders Import Worker"
// sc.exe stop "Orders Import Worker"
// sc.exe delete "Orders Import Worker"
      `,
    },
    {
      id: "dotnet10-mastery-patterns",
      title: "Production Patterns For Mastery",
      content: `
## Production Patterns For .NET 10 Mastery

Knowing features is not mastery. Mastery is knowing which pattern to use when the system is slow, unreliable, duplicated, hard to deploy, or hard to debug.

### Pattern 1: Options Pattern

Use strongly typed settings instead of reading raw configuration everywhere. This gives validation, testability, and clean dependencies.

Good:

1. <code>IOptions&lt;T&gt;</code> for stable configuration.
2. <code>IOptionsMonitor&lt;T&gt;</code> for reloadable configuration.
3. <code>ValidateOnStart</code> for fail-fast services.

### Pattern 2: Idempotent Processing

Background services must assume retries, restarts, and duplicate messages. Idempotency means processing the same unit twice does not produce a bad result.

Examples:

1. Use a unique external ID.
2. Store processed message IDs.
3. Use database constraints.
4. Use status transitions like Pending -> Processing -> Completed.
5. Make writes conditional.

### Pattern 3: Outbox Pattern

When a service writes to a database and publishes a message, do not publish directly in the middle of the transaction. Write the business change and an outbox row in the same database transaction. A worker later publishes outbox rows and marks them sent.

This prevents the classic bug: database saved, process crashed before message publish.

### Pattern 4: Retry With Backoff

Retries are useful for transient failures, but dangerous when the dependency is already overloaded. Use increasing delays and a maximum retry count. For non-transient validation failures, do not retry forever.

### Pattern 5: Health And Observability

For APIs, expose health endpoints. For Windows Services, at minimum log heartbeat summaries and batch outcomes. In mature systems, emit metrics:

1. Jobs processed.
2. Jobs failed.
3. Queue depth.
4. Batch duration.
5. Dependency latency.
6. Last successful run time.

### Pattern 6: Graceful Shutdown

When Windows stops your service, your worker receives cancellation. Correct behavior:

1. Stop accepting new work.
2. Finish the current small unit if safe.
3. Persist progress.
4. Release resources.
5. Exit before the service timeout.

### Pattern 7: Layered Testing

| Test Type | What It Proves |
|-----------|----------------|
| Unit test | Business rules work without infrastructure |
| Integration test | EF Core, database, HTTP clients, serialization work |
| Worker loop test | The worker creates scopes, handles cancellation, and logs failures |
| Deployment test | Published service starts, stops, and writes logs |

### Beginner-To-Mastery Roadmap

1. Build a console app to learn syntax.
2. Build a Minimal API with validation.
3. Add EF Core and migrations.
4. Add a Worker Service that processes database rows.
5. Deploy that worker as a Windows Service.
6. Add structured logs, options validation, retries, and graceful shutdown.
7. Add idempotency and an outbox.
8. Add tests around business logic and worker behavior.
9. Profile one slow query and fix it with indexes/query shape.
10. Publish self-contained and document operational commands.

### Interview-Ready Explanations

| Question | Strong Answer |
|----------|---------------|
| Why not inject DbContext directly into BackgroundService? | BackgroundService is effectively singleton lifetime, while DbContext is scoped. Create a scope per batch and resolve DbContext inside it. |
| Why use CancellationToken? | It lets shutdown, timeouts, and cancelled operations stop cooperatively instead of killing the process in the middle of work. |
| Why structured logging? | Logs become queryable by properties like OrderId, TenantId, JobId, and DurationMs. |
| Why idempotency? | Production workers restart and retry. Duplicate processing must be safe. |
| Why self-contained publish for Windows Services? | The app carries its runtime, reducing dependency on the server's installed .NET version. |
| Why non-zero exit on fatal service crash? | Windows Service recovery actions rely on process failure to trigger restart behavior. |
      `,
      code: `// =========================
// IDEMPOTENT DATABASE PROCESSING SHAPE
// =========================
public sealed class ImportRecord
{
    public long Id { get; set; }
    public string ExternalId { get; set; } = "";
    public string Status { get; set; } = "Pending";
    public DateTimeOffset? ProcessedAt { get; set; }
}

public sealed class ImportProcessor(AppDbContext db, ILogger<ImportProcessor> logger)
{
    public async Task ProcessAsync(long id, CancellationToken cancellationToken)
    {
        ImportRecord? record = await db.Set<ImportRecord>()
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (record is null)
        {
            logger.LogWarning("Import record {ImportRecordId} was not found", id);
            return;
        }

        if (record.Status == "Completed")
        {
            logger.LogInformation("Import record {ImportRecordId} already completed", id);
            return;
        }

        record.Status = "Processing";
        await db.SaveChangesAsync(cancellationToken);

        // Do the smallest safe unit of work here.
        // Use unique keys or external IDs so duplicate attempts are safe.

        record.Status = "Completed";
        record.ProcessedAt = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync(cancellationToken);
    }
}

// =========================
// SIMPLE OUTBOX SHAPE
// =========================
public sealed class OutboxMessage
{
    public long Id { get; set; }
    public string Type { get; set; } = "";
    public string PayloadJson { get; set; } = "";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? SentAt { get; set; }
}

// In the same transaction:
// 1. Save business data.
// 2. Save OutboxMessage.
// 3. Commit.
//
// Later, a worker:
// 1. Reads unsent outbox messages.
// 2. Publishes each message.
// 3. Marks SentAt.

// =========================
// GRACEFUL SHUTDOWN PATTERN
// =========================
public sealed class GracefulWorker(ILogger<GracefulWorker> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await DoSmallUnitOfWorkAsync(stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                logger.LogInformation("Shutdown requested during work");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unit of work failed");
            }
        }
    }

    private static Task DoSmallUnitOfWorkAsync(CancellationToken cancellationToken)
    {
        // Keep units small so shutdown does not wait for a giant batch.
        return Task.Delay(TimeSpan.FromSeconds(2), cancellationToken);
    }
}
      `,
    },
  ],
};
