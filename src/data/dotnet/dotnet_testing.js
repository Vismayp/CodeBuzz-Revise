export const dotnetTestingTopic = {
  id: "dotnet-testing",
  title: "Testing & CI/CD",
  description: "xUnit, Moq, integration testing, Test Containers, code coverage, and CI/CD with GitHub Actions.",
  icon: "CheckCircle",
  sections: [
    { id: "unit-testing", title: "Unit Testing with xUnit", content: `
## Unit Testing — Verify Code Correctness

### xUnit — The Standard .NET Test Framework

| Attribute | Purpose |
|-----------|---------|
| \`[Fact]\` | Simple test (no parameters) |
| \`[Theory]\` | Parameterized test |
| \`[InlineData]\` | Provide test data inline |
| \`[ClassData]\` | Test data from a class |
      `, code: `// ═══ BASIC UNIT TESTS ═══
public class CalculatorTests
{
    [Fact]
    public void Add_TwoPositiveNumbers_ReturnsSum()
    {
        // Arrange
        var calculator = new Calculator();
        
        // Act
        var result = calculator.Add(2, 3);
        
        // Assert
        Assert.Equal(5, result);
    }
    
    [Theory]
    [InlineData(1, 1, 2)]
    [InlineData(-1, 1, 0)]
    [InlineData(0, 0, 0)]
    [InlineData(100, -50, 50)]
    public void Add_MultipleInputs_ReturnsExpectedSum(int a, int b, int expected)
    {
        var calculator = new Calculator();
        Assert.Equal(expected, calculator.Add(a, b));
    }
    
    [Fact]
    public void Divide_ByZero_ThrowsDivideByZeroException()
    {
        var calculator = new Calculator();
        Assert.Throws<DivideByZeroException>(() => calculator.Divide(10, 0));
    }
}

// ═══ TESTING WITH MOQS ═══
public class UserServiceTests
{
    private readonly Mock<IUserRepository> _mockRepo;
    private readonly Mock<ILogger<UserService>> _mockLogger;
    private readonly UserService _service;
    
    public UserServiceTests()
    {
        _mockRepo = new Mock<IUserRepository>();
        _mockLogger = new Mock<ILogger<UserService>>();
        _service = new UserService(_mockRepo.Object, _mockLogger.Object);
    }
    
    [Fact]
    public async Task GetById_ExistingUser_ReturnsUser()
    {
        // Arrange
        var expectedUser = new User { Id = 1, Name = "Alice", Email = "alice@email.com" };
        _mockRepo.Setup(r => r.GetByIdAsync(1, default))
                 .ReturnsAsync(expectedUser);
        
        // Act
        var result = await _service.GetByIdAsync(1);
        
        // Assert
        Assert.NotNull(result);
        Assert.Equal("Alice", result.Value?.Name);
        Assert.True(result.IsSuccess);
    }
    
    [Fact]
    public async Task GetById_NonExistingUser_ReturnsNotFound()
    {
        // Arrange
        _mockRepo.Setup(r => r.GetByIdAsync(999, default))
                 .ReturnsAsync((User?)null);
        
        // Act
        var result = await _service.GetByIdAsync(999);
        
        // Assert
        Assert.False(result.IsSuccess);
        Assert.Contains("not found", result.Error!);
    }
    
    [Fact]
    public async Task Create_DuplicateEmail_ReturnsFailure()
    {
        // Arrange
        _mockRepo.Setup(r => r.EmailExistsAsync("alice@email.com", default))
                 .ReturnsAsync(true);
        
        // Act
        var result = await _service.CreateAsync(
            new CreateUserRequest { Name = "Alice", Email = "alice@email.com" });
        
        // Assert
        Assert.False(result.IsSuccess);
        Assert.Contains("already exists", result.Error!);
    }
}

// ═══ RUN TESTS ═══
// dotnet test
// dotnet test --collect:"XPlat Code Coverage"
// dotnet test --filter "FullyQualifiedName~UserServiceTests"
      ` },
    { id: "integration-testing", title: "Integration & API Testing", content: `
## Integration Testing — Test the Full Stack

Integration tests verify that multiple components work together. In ASP.NET Core, use \`WebApplicationFactory\`.
      `, code: `// ═══ API INTEGRATION TESTS ═══
public class UsersApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    
    public UsersApiTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Replace real DB with in-memory
                services.RemoveAll<DbContextOptions<AppDbContext>>();
                services.AddDbContext<AppDbContext>(options =>
                    options.UseInMemoryDatabase("TestDb"));
            });
        }).CreateClient();
    }
    
    [Fact]
    public async Task GetUsers_ReturnsSuccessAndList()
    {
        // Act
        var response = await _client.GetAsync("/api/users");
        
        // Assert
        response.EnsureSuccessStatusCode();
        var users = await response.Content.ReadFromJsonAsync<List<UserDto>>();
        Assert.NotNull(users);
    }
    
    [Fact]
    public async Task CreateUser_ValidData_Returns201()
    {
        // Arrange
        var newUser = new { Name = "Test User", Email = "test@email.com", Age = 25 };
        
        // Act
        var response = await _client.PostAsJsonAsync("/api/users", newUser);
        
        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var created = await response.Content.ReadFromJsonAsync<UserDto>();
        Assert.NotNull(created);
        Assert.Equal("Test User", created.Name);
    }
    
    [Fact]
    public async Task CreateUser_InvalidData_Returns400()
    {
        // Arrange — missing required fields
        var invalid = new { Name = "", Email = "not-an-email" };
        
        // Act
        var response = await _client.PostAsJsonAsync("/api/users", invalid);
        
        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
    
    [Fact]
    public async Task GetUser_NotFound_Returns404()
    {
        var response = await _client.GetAsync("/api/users/99999");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}

// ═══ CI/CD WITH GITHUB ACTIONS ═══
// .github/workflows/dotnet.yml
// name: .NET CI
// on: [push, pull_request]
// jobs:
//   build:
//     runs-on: ubuntu-latest
//     steps:
//       - uses: actions/checkout@v4
//       - uses: actions/setup-dotnet@v4
//         with:
//           dotnet-version: '10.0.x'
//       - run: dotnet restore
//       - run: dotnet build --no-restore
//       - run: dotnet test --no-build --verbosity normal
      ` },
  ],
};
