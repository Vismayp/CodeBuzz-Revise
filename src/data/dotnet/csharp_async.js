export const csharpAsyncTopic = {
  id: "csharp-async",
  title: "Async/Await & Multithreading",
  description: "async/await, Task, ValueTask, Parallel.ForEach, Channels, Semaphore, CancellationToken, and thread safety.",
  icon: "Zap",
  sections: [
    { id: "async-await-basics", title: "async/await Fundamentals", content: `
## Async/Await — Non-Blocking I/O

\`async/await\` lets you write asynchronous code that looks synchronous. It's essential for scalable web APIs.

### Why Async?
- **Web APIs**: Handle thousands of concurrent requests
- **I/O Bound**: Database queries, HTTP calls, file operations
- **UI**: Keep UI responsive during long operations

### Key Rules
1. \`async\` methods should return \`Task\` or \`Task<T>\`
2. \`await\` yields control back to the caller
3. \`async void\` is ONLY for event handlers (never for normal methods)
4. Don't mix sync and async (.Result deadlocks!)
      `, code: `// ═══ BASIC ASYNC/AWAIT ═══
public class UserService
{
    private readonly HttpClient _http = new();
    
    // Async method — returns Task<T>
    public async Task<string> GetUserDataAsync(int userId)
    {
        // await yields control — thread is freed to handle other work
        var response = await _http.GetAsync($"https://api.example.com/users/{userId}");
        response.EnsureSuccessStatusCode();
        
        string content = await response.Content.ReadAsStringAsync();
        return content;
    }
    
    // Multiple awaits in sequence
    public async Task<UserProfile> GetFullProfileAsync(int userId)
    {
        var userData = await GetUserDataAsync(userId);
        var orders = await GetOrdersAsync(userId);  // Waits for userData first
        var reviews = await GetReviewsAsync(userId); // Waits for orders first
        
        return new UserProfile(userData, orders, reviews);
    }
    
    // ═══ PARALLEL ASYNC — Run tasks simultaneously ═══
    public async Task<UserProfile> GetFullProfileFastAsync(int userId)
    {
        // Start all tasks at once (don't await yet!)
        var userTask = GetUserDataAsync(userId);
        var ordersTask = GetOrdersAsync(userId);
        var reviewsTask = GetReviewsAsync(userId);
        
        // Wait for ALL to complete
        await Task.WhenAll(userTask, ordersTask, reviewsTask);
        
        return new UserProfile(
            userTask.Result, 
            ordersTask.Result, 
            reviewsTask.Result
        );
    }
    
    private Task<string> GetOrdersAsync(int userId) => 
        Task.FromResult("orders");
    private Task<string> GetReviewsAsync(int userId) => 
        Task.FromResult("reviews");
}

record UserProfile(string UserData, string Orders, string Reviews);

// ═══ ANTI-PATTERNS ═══
// ❌ BAD: Blocking on async (DEADLOCK in ASP.NET!)
// var result = GetUserDataAsync(1).Result;

// ❌ BAD: async void (exceptions are silently swallowed)
// async void DoSomething() { ... }

// ✅ GOOD: Always return Task
// async Task DoSomethingAsync() { ... }

// ❌ BAD: Unnecessary async (just wrapping)
// async Task<int> GetValue() { return await Task.FromResult(42); }

// ✅ GOOD: Return the task directly
// Task<int> GetValue() => Task.FromResult(42);
      ` },
    { id: "cancellation-tokens", title: "CancellationTokens", content: `
## CancellationToken — Graceful Cancellation

\`CancellationToken\` allows cooperative cancellation of long-running operations.

### Why?
- User cancels a request
- Request timeout
- Application shutdown
- Another task completed first
      `, code: `// ═══ USING CANCELLATION TOKENS ═══
public class DataProcessor
{
    public async Task ProcessLargeDataAsync(CancellationToken ct = default)
    {
        var items = Enumerable.Range(1, 1000);
        
        foreach (var item in items)
        {
            // Check cancellation before each expensive operation
            ct.ThrowIfCancellationRequested();
            
            await ProcessItemAsync(item, ct);
        }
    }
    
    private async Task ProcessItemAsync(int item, CancellationToken ct)
    {
        // Pass token to child operations
        await Task.Delay(100, ct);  // Throws OperationCanceledException
        Console.WriteLine($"Processed item {item}");
    }
}

// ═══ USAGE ═══
// var cts = new CancellationTokenSource();
// cts.CancelAfter(TimeSpan.FromSeconds(5));  // Auto-cancel after 5s
//
// try
// {
//     await processor.ProcessLargeDataAsync(cts.Token);
// }
// catch (OperationCanceledException)
// {
//     Console.WriteLine("Operation was cancelled!");
// }

// ═══ ASP.NET Core — Built-in cancellation ═══
// [HttpGet("{id}")]
// public async Task<IActionResult> GetUser(int id, CancellationToken ct)
// {
//     var user = await _db.Users.FindAsync(id, ct);
//     return user is null ? NotFound() : Ok(user);
// }
// Token is automatically cancelled if client disconnects!

// ═══ LINKED CANCELLATION ═══
// Combine multiple cancellation sources
// var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(30));
// var userCancel = new CancellationTokenSource();
// var linked = CancellationTokenSource.CreateLinkedTokenSource(
//     timeout.Token, userCancel.Token
// );
// Cancel if EITHER timeout or user cancels
      ` },
    { id: "parallel-concurrency", title: "Parallel & Concurrent Patterns", content: `
## Parallel Processing & Thread Safety

### When to use what?
| Pattern | Use Case | Thread Count |
|---------|----------|-------------|
| \`async/await\` | I/O bound (HTTP, DB, files) | 0 extra threads |
| \`Task.Run\` | CPU bound (calculations) | 1 thread pool thread |
| \`Parallel.ForEach\` | Process collection in parallel | Multiple threads |
| \`Channel<T>\` | Producer-Consumer pipeline | Configurable |
| \`SemaphoreSlim\` | Limit concurrent access | N concurrent |
      `, code: `// ═══ PARALLEL PROCESSING ═══
// Parallel.ForEach — Process items on multiple threads
var urls = new[] { "url1", "url2", "url3", "url4" };

await Parallel.ForEachAsync(urls, 
    new ParallelOptions { MaxDegreeOfParallelism = 4 },
    async (url, ct) =>
    {
        // Each URL processed concurrently
        Console.WriteLine($"Processing {url} on thread {Thread.CurrentThread.ManagedThreadId}");
        await Task.Delay(100, ct);
    });

// ═══ SEMAPHORE — Rate Limiting ═══
public class ApiClient
{
    private readonly SemaphoreSlim _semaphore = new(maxCount: 5); // Max 5 concurrent
    private readonly HttpClient _http = new();
    
    public async Task<string> FetchWithLimitAsync(string url)
    {
        await _semaphore.WaitAsync(); // Wait for a slot
        try
        {
            return await _http.GetStringAsync(url);
        }
        finally
        {
            _semaphore.Release(); // Free the slot
        }
    }
}

// ═══ CHANNEL — Producer/Consumer ═══
// var channel = Channel.CreateBounded<int>(capacity: 100);
// 
// // Producer
// _ = Task.Run(async () =>
// {
//     for (int i = 0; i < 1000; i++)
//     {
//         await channel.Writer.WriteAsync(i);
//     }
//     channel.Writer.Complete();
// });
// 
// // Consumer
// await foreach (var item in channel.Reader.ReadAllAsync())
// {
//     Console.WriteLine($"Consumed: {item}");
// }

// ═══ THREAD SAFETY ═══
// Use ConcurrentDictionary instead of Dictionary
// var cache = new ConcurrentDictionary<string, object>();
// cache.TryAdd("key", "value");
// cache.AddOrUpdate("key", "new", (k, old) => "updated");

// Use lock for critical sections
private readonly object _lock = new();
private int _counter = 0;

void SafeIncrement()
{
    lock (_lock)
    {
        _counter++;  // Thread-safe
    }
}

// Interlocked for atomic operations (fastest)
// Interlocked.Increment(ref _counter);
      ` },
  ],
};
