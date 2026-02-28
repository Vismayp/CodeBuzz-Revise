export const aspnetApiTopic = {
  id: "aspnet-api",
  title: "Building REST APIs",
  description: "RESTful design, versioning, pagination, CORS, JWT authentication, authorization, and rate limiting.",
  icon: "Network",
  sections: [
    { id: "rest-design", title: "RESTful API Design", content: `
## REST API Design Best Practices

### HTTP Methods & Status Codes

| Method | Action | Success Code | Body |
|--------|--------|-------------|------|
| GET | Read | 200 OK | Resource(s) |
| POST | Create | 201 Created | Created resource |
| PUT | Full update | 200/204 | Updated resource |
| PATCH | Partial update | 200/204 | Updated fields |
| DELETE | Remove | 204 No Content | None |

### URL Design
\`\`\`
✅ GET    /api/users          — List users
✅ GET    /api/users/5        — Get user 5
✅ POST   /api/users          — Create user
✅ PUT    /api/users/5        — Update user 5
✅ DELETE /api/users/5        — Delete user 5
✅ GET    /api/users/5/orders — User 5's orders
❌ GET    /api/getUsers       — Don't use verbs!
❌ POST   /api/createUser     — Don't use verbs!
\`\`\`
      `, code: `// ═══ PAGINATION ═══
public class PagedResponse<T>
{
    public IEnumerable<T> Data { get; set; } = [];
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPrevious => Page > 1;
    public bool HasNext => Page < TotalPages;
}

// Usage in controller:
// [HttpGet]
// public async Task<IActionResult> GetUsers(
//     [FromQuery] int page = 1, 
//     [FromQuery] int pageSize = 10,
//     [FromQuery] string? search = null,
//     [FromQuery] string sortBy = "name",
//     CancellationToken ct = default)
// {
//     var query = _db.Users.AsQueryable();
//     
//     if (!string.IsNullOrEmpty(search))
//         query = query.Where(u => u.Name.Contains(search));
//     
//     var total = await query.CountAsync(ct);
//     var users = await query
//         .OrderBy(u => u.Name)
//         .Skip((page - 1) * pageSize)
//         .Take(pageSize)
//         .ToListAsync(ct);
//     
//     return Ok(new PagedResponse<UserDto>
//     {
//         Data = users.Select(u => u.ToDto()),
//         Page = page,
//         PageSize = pageSize,
//         TotalCount = total
//     });
// }
      ` },
    { id: "jwt-auth", title: "JWT Authentication", content: `
## JWT Authentication in ASP.NET Core

JSON Web Tokens (JWT) are the standard for stateless API authentication.
      `, code: `// ═══ JWT CONFIGURATION ═══
// Program.cs
// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//     .AddJwtBearer(options =>
//     {
//         options.TokenValidationParameters = new TokenValidationParameters
//         {
//             ValidateIssuer = true,
//             ValidateAudience = true,
//             ValidateLifetime = true,
//             ValidateIssuerSigningKey = true,
//             ValidIssuer = builder.Configuration["Jwt:Issuer"],
//             ValidAudience = builder.Configuration["Jwt:Audience"],
//             IssuerSigningKey = new SymmetricSecurityKey(
//                 Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!))
//         };
//     });
// builder.Services.AddAuthorization();

// ═══ TOKEN GENERATION ═══
public class TokenService
{
    private readonly JwtSettings _settings;
    
    public TokenService(IOptions<JwtSettings> settings) => _settings = settings.Value;
    
    public string GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("department", user.Department ?? "")
        };
        
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var token = new JwtSecurityToken(
            issuer: _settings.Issuer,
            audience: _settings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_settings.ExpirationMinutes),
            signingCredentials: creds
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

// ═══ AUTH CONTROLLER ═══
// [HttpPost("login")]
// public async Task<IActionResult> Login(LoginRequest request)
// {
//     var user = await _userService.ValidateCredentials(request.Email, request.Password);
//     if (user is null) return Unauthorized(new { message = "Invalid credentials" });
//     
//     var token = _tokenService.GenerateToken(user);
//     return Ok(new { token, expiresIn = 3600 });
// }

// ═══ PROTECTING ENDPOINTS ═══
// [Authorize]  // Requires any authenticated user
// [HttpGet("profile")]
// public IActionResult GetProfile() => Ok(User.Claims.Select(c => new { c.Type, c.Value }));

// [Authorize(Roles = "Admin")]  // Requires Admin role
// [HttpDelete("{id}")]
// public IActionResult DeleteUser(int id) { /* ... */ }

// [Authorize(Policy = "SeniorEmployee")]  // Custom policy
// [HttpGet("salary")]
// public IActionResult ViewSalary() { /* ... */ }
      ` },
    { id: "rate-limiting", title: "Rate Limiting & CORS", content: `
## Rate Limiting — Protect Your API

.NET 7+ has built-in rate limiting middleware.
      `, code: `// ═══ RATE LIMITING (.NET 7+) ═══
// builder.Services.AddRateLimiter(options =>
// {
//     // Fixed window: 100 requests per minute
//     options.AddFixedWindowLimiter("fixed", opt =>
//     {
//         opt.PermitLimit = 100;
//         opt.Window = TimeSpan.FromMinutes(1);
//         opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
//         opt.QueueLimit = 10;
//     });
//     
//     // Sliding window: smoother distribution
//     options.AddSlidingWindowLimiter("sliding", opt =>
//     {
//         opt.PermitLimit = 100;
//         opt.Window = TimeSpan.FromMinutes(1);
//         opt.SegmentsPerWindow = 6;  // 10-second segments
//     });
//     
//     // Per-user rate limiting
//     options.AddPolicy("per-user", context =>
//     {
//         var userId = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "anonymous";
//         return RateLimitPartition.GetFixedWindowLimiter(userId, _ =>
//             new FixedWindowRateLimiterOptions
//             {
//                 PermitLimit = 50,
//                 Window = TimeSpan.FromMinutes(1)
//             });
//     });
//     
//     options.RejectionStatusCode = 429;
// });
// 
// app.UseRateLimiter();

// Apply to specific endpoints:
// app.MapGet("/api/data", () => "OK").RequireRateLimiting("fixed");

// ═══ CORS ═══
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowFrontend", policy =>
//     {
//         policy.WithOrigins("http://localhost:3000", "https://myapp.com")
//               .AllowAnyMethod()
//               .AllowAnyHeader()
//               .AllowCredentials();
//     });
// });
// app.UseCors("AllowFrontend");

// ═══ API VERSIONING ═══
// builder.Services.AddApiVersioning(options =>
// {
//     options.DefaultApiVersion = new ApiVersion(1, 0);
//     options.AssumeDefaultVersionWhenUnspecified = true;
//     options.ReportApiVersions = true;
//     // URL segment, query string, or header versioning
//     options.ApiVersionReader = ApiVersionReader.Combine(
//         new UrlSegmentApiVersionReader(),
//         new HeaderApiVersionReader("X-Api-Version")
//     );
// });
// 
// [ApiVersion("1.0")]
// [Route("api/v{version:apiVersion}/[controller]")]
// public class UsersV1Controller : ControllerBase { }
// 
// [ApiVersion("2.0")]
// [Route("api/v{version:apiVersion}/[controller]")]
// public class UsersV2Controller : ControllerBase { }
      ` },
  ],
};
