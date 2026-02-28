export const efCoreTopic = {
  id: "ef-core",
  title: "Entity Framework Core",
  description: "DbContext, migrations, Fluent API, relationships, query loading, raw SQL, and performance optimization.",
  icon: "Database",
  sections: [
    { id: "ef-setup", title: "EF Core Setup & DbContext", content: `
## Entity Framework Core — .NET's ORM

EF Core maps C# objects to database tables. You write C#, it generates SQL.

### Key Concepts
| Concept | Description |
|---------|-------------|
| **DbContext** | Represents a session with the database |
| **DbSet<T>** | Represents a table |
| **Migrations** | Version control for your schema |
| **Fluent API** | Configure mappings via code |
| **Change Tracker** | Tracks entity modifications |
      `, code: `// ═══ ENTITY CLASSES ═══
public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties (relationships)
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public UserProfile? Profile { get; set; }
}

public class Order
{
    public int Id { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "pending";
    
    // Foreign key
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}

// ═══ DB CONTEXT ═══
public class AppDbContext : DbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Fluent API configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Name).HasMaxLength(100).IsRequired();
            entity.Property(u => u.Email).HasMaxLength(200).IsRequired();
            
            // One-to-Many: User → Orders
            entity.HasMany(u => u.Orders)
                  .WithOne(o => o.User)
                  .HasForeignKey(o => o.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
        
        modelBuilder.Entity<Order>(entity =>
        {
            entity.Property(o => o.TotalAmount).HasPrecision(12, 2);
            entity.Property(o => o.Status).HasMaxLength(20);
        });
    }
}

// Registration:
// builder.Services.AddDbContext<AppDbContext>(options =>
//     options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// ═══ MIGRATIONS ═══
// dotnet ef migrations add InitialCreate
// dotnet ef database update
// dotnet ef migrations add AddUserProfile
// dotnet ef database update
      ` },
    { id: "ef-querying", title: "Querying with EF Core", content: `
## Querying — LINQ to SQL

EF Core translates LINQ queries into SQL. Understanding loading strategies is crucial for performance.

### Loading Strategies
| Strategy | How | When |
|----------|-----|------|
| **Eager** | \`.Include()\` | Know you need related data |
| **Lazy** | Auto-load on access | Simple scenarios (watch N+1!) |
| **Explicit** | \`.Entry().Collection().Load()\` | Load later, selectively |
| **Split Query** | \`.AsSplitQuery()\` | Many includes (avoid Cartesian explosion) |
      `, code: `// ═══ BASIC QUERIES ═══
public class UserRepository
{
    private readonly AppDbContext _db;
    public UserRepository(AppDbContext db) => _db = db;
    
    // Get all users
    public async Task<List<User>> GetAllAsync(CancellationToken ct) =>
        await _db.Users.ToListAsync(ct);
    
    // Get by id
    public async Task<User?> GetByIdAsync(int id, CancellationToken ct) =>
        await _db.Users.FindAsync(new object[] { id }, ct);
    
    // Filter with Where
    public async Task<List<User>> SearchAsync(string query, CancellationToken ct) =>
        await _db.Users
            .Where(u => u.Name.Contains(query) || u.Email.Contains(query))
            .OrderBy(u => u.Name)
            .ToListAsync(ct);
    
    // ═══ EAGER LOADING ═══
    public async Task<User?> GetWithOrdersAsync(int id, CancellationToken ct) =>
        await _db.Users
            .Include(u => u.Orders)                    // Load orders
                .ThenInclude(o => o.Items)             // Also load order items
            .Include(u => u.Profile)                   // Also load profile
            .FirstOrDefaultAsync(u => u.Id == id, ct);
    
    // ═══ PROJECTION (Only select needed columns) ═══
    public async Task<List<UserSummary>> GetSummariesAsync(CancellationToken ct) =>
        await _db.Users
            .Select(u => new UserSummary(
                u.Id,
                u.Name,
                u.Orders.Count,
                u.Orders.Sum(o => o.TotalAmount)
            ))
            .ToListAsync(ct);
    
    // ═══ PAGINATION ═══
    public async Task<(List<User> Users, int Total)> GetPagedAsync(
        int page, int pageSize, CancellationToken ct)
    {
        var query = _db.Users.OrderBy(u => u.Id);
        var total = await query.CountAsync(ct);
        var users = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
        return (users, total);
    }
}

record UserSummary(int Id, string Name, int OrderCount, decimal TotalSpent);

// ═══ CRUD OPERATIONS ═══
// Create
// var user = new User { Name = "Alice", Email = "alice@email.com" };
// _db.Users.Add(user);
// await _db.SaveChangesAsync();

// Update
// var user = await _db.Users.FindAsync(1);
// user.Name = "Alice Updated";
// await _db.SaveChangesAsync();  // Change tracker detects modifications

// Delete
// var user = await _db.Users.FindAsync(1);
// _db.Users.Remove(user);
// await _db.SaveChangesAsync();

// ═══ RAW SQL (when LINQ isn't enough) ═══
// var users = await _db.Users
//     .FromSqlRaw("SELECT * FROM users WHERE name ILIKE {0}", "%alice%")
//     .ToListAsync();

// ═══ BULK OPERATIONS (.NET 7+) ═══
// await _db.Users.Where(u => u.IsDeleted).ExecuteDeleteAsync();
// await _db.Products.Where(p => p.Category == "Old")
//     .ExecuteUpdateAsync(s => s.SetProperty(p => p.IsActive, false));
      ` },
  ],
};
