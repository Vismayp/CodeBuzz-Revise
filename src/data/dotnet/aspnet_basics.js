export const aspnetBasicsTopic = {
  id: "aspnet-basics",
  title: "ASP.NET Core Fundamentals",
  description: "Minimal APIs, controllers, routing, model binding, validation, filters, error handling, and Swagger.",
  icon: "Globe",
  sections: [
    { id: "minimal-apis", title: "Minimal APIs", content: `
## Minimal APIs — The Simplest Way to Build APIs

Introduced in .NET 6, Minimal APIs remove the ceremony of controllers for simple endpoints.
      `, code: `// ═══ MINIMAL API — Complete Example ═══
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ═══ CRUD Endpoints ═══
var products = new List<Product>
{
    new(1, "Laptop", 999.99m, "Electronics"),
    new(2, "Mouse", 29.99m, "Electronics"),
};

// GET all
app.MapGet("/api/products", () => Results.Ok(products))
   .WithName("GetProducts")
   .WithOpenApi();

// GET by id
app.MapGet("/api/products/{id}", (int id) =>
{
    var product = products.FirstOrDefault(p => p.Id == id);
    return product is null ? Results.NotFound() : Results.Ok(product);
});

// POST create
app.MapPost("/api/products", (Product product) =>
{
    products.Add(product);
    return Results.Created($"/api/products/{product.Id}", product);
});

// PUT update
app.MapPut("/api/products/{id}", (int id, Product updated) =>
{
    var index = products.FindIndex(p => p.Id == id);
    if (index == -1) return Results.NotFound();
    products[index] = updated;
    return Results.NoContent();
});

// DELETE
app.MapDelete("/api/products/{id}", (int id) =>
{
    var removed = products.RemoveAll(p => p.Id == id);
    return removed > 0 ? Results.NoContent() : Results.NotFound();
});

app.Run();

record Product(int Id, string Name, decimal Price, string Category);
      ` },
    { id: "controllers", title: "Controllers & Routing", content: `
## Controllers — Structured API Organization

Controllers group related endpoints into classes. Use them for larger applications.
      `, code: `// ═══ CONTROLLER ═══
[ApiController]
[Route("api/[controller]")]  // api/users
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;
    
    public UsersController(IUserService userService, ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }
    
    // GET api/users
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<UserDto>), 200)]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var users = await _userService.GetAllAsync(ct);
        return Ok(users);
    }
    
    // GET api/users/5
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(UserDto), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var user = await _userService.GetByIdAsync(id, ct);
        if (user is null) return NotFound(new { message = $"User {id} not found" });
        return Ok(user);
    }
    
    // POST api/users
    [HttpPost]
    [ProducesResponseType(typeof(UserDto), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Create([FromBody] CreateUserRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        var user = await _userService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }
    
    // PUT api/users/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserRequest request, CancellationToken ct)
    {
        var success = await _userService.UpdateAsync(id, request, ct);
        return success ? NoContent() : NotFound();
    }
    
    // DELETE api/users/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var success = await _userService.DeleteAsync(id, ct);
        return success ? NoContent() : NotFound();
    }
}

// ═══ DTOs & Validation ═══
public class CreateUserRequest
{
    [Required]
    [StringLength(50, MinimumLength = 2)]
    public string Name { get; set; } = "";
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";
    
    [Range(18, 120)]
    public int Age { get; set; }
}

public record UserDto(int Id, string Name, string Email, DateTime CreatedAt);
      ` },
    { id: "error-handling", title: "Global Error Handling", content: `
## Global Error Handling — Production Pattern

Never expose stack traces or internal details to users. Use a global exception handler.
      `, code: `// ═══ GLOBAL EXCEPTION HANDLER (.NET 8+) ═══
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;
    
    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        => _logger = logger;
    
    public async ValueTask<bool> TryHandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken ct)
    {
        _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);
        
        var (statusCode, message) = exception switch
        {
            NotFoundException => (404, exception.Message),
            ValidationException ve => (400, ve.Message),
            UnauthorizedAccessException => (401, "Unauthorized"),
            _ => (500, "An internal error occurred")
        };
        
        context.Response.StatusCode = statusCode;
        await context.Response.WriteAsJsonAsync(new
        {
            status = statusCode,
            error = message,
            traceId = context.TraceIdentifier
        }, ct);
        
        return true;  // Exception was handled
    }
}

// Custom exceptions
public class NotFoundException : Exception
{
    public NotFoundException(string entity, object id) 
        : base($"{entity} with id '{id}' was not found.") { }
}

public class ValidationException : Exception
{
    public IDictionary<string, string[]> Errors { get; }
    public ValidationException(IDictionary<string, string[]> errors) 
        : base("Validation failed") => Errors = errors;
}

// Registration:
// builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
// builder.Services.AddProblemDetails();
// app.UseExceptionHandler();
      ` },
  ],
};
