export const dotnetPatternsTopic = {
  id: "dotnet-patterns",
  title: "Design Patterns & Best Practices",
  description: "Repository, Unit of Work, CQRS, Mediator, Options, Result pattern, and Clean Architecture.",
  icon: "Layers",
  sections: [
    { id: "repository-pattern", title: "Repository & Unit of Work", content: `
## Repository Pattern — Abstract Data Access

The Repository pattern provides a clean separation between your business logic and data access code.

### Benefits
✅ Testable (mock the repository)
✅ Swappable (change DB without changing business logic)
✅ Consistent data access API
      `, code: `// ═══ GENERIC REPOSITORY ═══
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default);
    Task<T> AddAsync(T entity, CancellationToken ct = default);
    void Update(T entity);
    void Remove(T entity);
}

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;
    
    public Repository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }
    
    public async Task<T?> GetByIdAsync(int id, CancellationToken ct = default)
        => await _dbSet.FindAsync(new object[] { id }, ct);
    
    public async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default)
        => await _dbSet.ToListAsync(ct);
    
    public async Task<T> AddAsync(T entity, CancellationToken ct = default)
    {
        await _dbSet.AddAsync(entity, ct);
        return entity;
    }
    
    public void Update(T entity) => _dbSet.Update(entity);
    public void Remove(T entity) => _dbSet.Remove(entity);
}

// ═══ UNIT OF WORK ═══
public interface IUnitOfWork : IDisposable
{
    IRepository<User> Users { get; }
    IRepository<Order> Orders { get; }
    IRepository<Product> Products { get; }
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    
    public IRepository<User> Users { get; }
    public IRepository<Order> Orders { get; }
    public IRepository<Product> Products { get; }
    
    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        Users = new Repository<User>(context);
        Orders = new Repository<Order>(context);
        Products = new Repository<Product>(context);
    }
    
    public async Task<int> SaveChangesAsync(CancellationToken ct = default)
        => await _context.SaveChangesAsync(ct);
    
    public void Dispose() => _context.Dispose();
}

// Usage in service:
// public class OrderService
// {
//     private readonly IUnitOfWork _uow;
//     
//     public async Task PlaceOrderAsync(int userId, int productId, int qty)
//     {
//         var user = await _uow.Users.GetByIdAsync(userId);
//         var product = await _uow.Products.GetByIdAsync(productId);
//         
//         var order = new Order { UserId = userId, TotalAmount = product.Price * qty };
//         await _uow.Orders.AddAsync(order);
//         
//         await _uow.SaveChangesAsync();  // Single transaction!
//     }
// }
      ` },
    { id: "result-pattern", title: "Result Pattern & Error Handling", content: `
## Result Pattern — No More Exceptions for Flow Control

Instead of throwing exceptions for expected errors, return a Result object.

### Why?
- Exceptions are expensive (stack unwinding)
- Makes error handling explicit
- Better API design
      `, code: `// ═══ RESULT TYPE ═══
public class Result<T>
{
    public bool IsSuccess { get; }
    public T? Value { get; }
    public string? Error { get; }
    public int StatusCode { get; }
    
    private Result(T value) { IsSuccess = true; Value = value; StatusCode = 200; }
    private Result(string error, int statusCode) 
    { 
        IsSuccess = false; Error = error; StatusCode = statusCode; 
    }
    
    public static Result<T> Success(T value) => new(value);
    public static Result<T> Failure(string error, int statusCode = 400) => new(error, statusCode);
    public static Result<T> NotFound(string error) => new(error, 404);
    
    // Match pattern (functional style)
    public TResult Match<TResult>(
        Func<T, TResult> onSuccess,
        Func<string, TResult> onFailure)
        => IsSuccess ? onSuccess(Value!) : onFailure(Error!);
}

// ═══ USAGE IN SERVICE ═══
public class UserService
{
    public async Task<Result<UserDto>> GetByIdAsync(int id)
    {
        var user = await _repo.GetByIdAsync(id);
        if (user is null)
            return Result<UserDto>.NotFound($"User {id} not found");
        
        return Result<UserDto>.Success(user.ToDto());
    }
    
    public async Task<Result<UserDto>> CreateAsync(CreateUserRequest request)
    {
        if (await _repo.EmailExistsAsync(request.Email))
            return Result<UserDto>.Failure("Email already exists");
        
        var user = new User { Name = request.Name, Email = request.Email };
        await _repo.AddAsync(user);
        await _uow.SaveChangesAsync();
        
        return Result<UserDto>.Success(user.ToDto());
    }
}

// In controller:
// [HttpGet("{id}")]
// public async Task<IActionResult> GetUser(int id)
// {
//     var result = await _userService.GetByIdAsync(id);
//     return result.Match<IActionResult>(
//         user => Ok(user),
//         error => result.StatusCode == 404 ? NotFound(error) : BadRequest(error)
//     );
// }
      ` },
    { id: "clean-architecture", title: "Clean Architecture", content: `
## Clean Architecture — Production Project Structure

### Layer Structure
\`\`\`
MyApp/
├── MyApp.Domain/         ← Entities, Interfaces, Value Objects (no dependencies)
├── MyApp.Application/    ← Use cases, DTOs, Services (depends on Domain)
├── MyApp.Infrastructure/ ← EF Core, External APIs (depends on Application)
└── MyApp.API/            ← Controllers, Program.cs (depends on all)
\`\`\`

### Dependency Rule
> Inner layers NEVER depend on outer layers.
> Domain → Application → Infrastructure → API
      `, code: `// ═══ DOMAIN LAYER (MyApp.Domain) ═══
// Entities (pure C# — no framework dependencies)
namespace MyApp.Domain.Entities;

public class Product
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public decimal Price { get; private set; }
    
    // Domain logic lives here
    public void ApplyDiscount(decimal percentage)
    {
        if (percentage is < 0 or > 100)
            throw new DomainException("Invalid discount");
        Price -= Price * (percentage / 100);
    }
}

// Interfaces (defined in Domain, implemented in Infrastructure)
public interface IProductRepository
{
    Task<Product?> GetByIdAsync(int id, CancellationToken ct);
    Task<IReadOnlyList<Product>> GetByCategoryAsync(string category, CancellationToken ct);
    Task AddAsync(Product product, CancellationToken ct);
}

// ═══ APPLICATION LAYER (MyApp.Application) ═══
namespace MyApp.Application.Products;

// Command (CQRS pattern)
public record CreateProductCommand(string Name, decimal Price, string Category);

// Handler
public class CreateProductHandler
{
    private readonly IProductRepository _repo;
    private readonly IUnitOfWork _uow;
    
    public CreateProductHandler(IProductRepository repo, IUnitOfWork uow)
    {
        _repo = repo;
        _uow = uow;
    }
    
    public async Task<Result<ProductDto>> HandleAsync(CreateProductCommand cmd, CancellationToken ct)
    {
        var product = new Product { Name = cmd.Name, Price = cmd.Price };
        await _repo.AddAsync(product, ct);
        await _uow.SaveChangesAsync(ct);
        return Result<ProductDto>.Success(new ProductDto(product.Id, product.Name, product.Price));
    }
}

// ═══ INFRASTRUCTURE LAYER (MyApp.Infrastructure) ═══
// Implements repository interfaces using EF Core
// public class ProductRepository : IProductRepository
// {
//     private readonly AppDbContext _db;
//     public ProductRepository(AppDbContext db) => _db = db;
//     public async Task<Product?> GetByIdAsync(int id, CancellationToken ct)
//         => await _db.Products.FindAsync(new object[] { id }, ct);
// }
      ` },
  ],
};
