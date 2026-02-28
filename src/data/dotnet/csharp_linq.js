export const csharpLinqTopic = {
  id: "csharp-linq",
  title: "LINQ Deep Dive",
  description: "Query syntax, method syntax, deferred execution, Select, Where, GroupBy, Join, Aggregate, and LINQ to Entities.",
  icon: "Filter",
  sections: [
    { id: "linq-basics", title: "LINQ — Language Integrated Query", content: `
## LINQ — Query Any Data Source with C#

**LINQ** (Language Integrated Query) lets you query collections, databases, XML, and more using a unified C# syntax.

### Two Syntaxes
1. **Query Syntax**: SQL-like (\`from x in collection ...\`)
2. **Method Syntax**: Chained methods (\`.Where().Select()\`)

Both compile to the same code. Method syntax is more common in production.

### Deferred Execution
> LINQ queries are **lazy** — they don't execute until you iterate (foreach, ToList, Count, etc.)
      `, code: `// ═══ SAMPLE DATA ═══
var products = new List<Product>
{
    new("Laptop", 1299.99m, "Electronics", 50),
    new("Mouse", 29.99m, "Electronics", 200),
    new("Keyboard", 149.99m, "Electronics", 75),
    new("Desk", 599.99m, "Furniture", 20),
    new("Chair", 449.99m, "Furniture", 25),
    new("Lamp", 39.99m, "Furniture", 100),
    new("C# Book", 45.99m, "Books", 60),
    new("SQL Book", 39.99m, "Books", 80),
};

record Product(string Name, decimal Price, string Category, int Stock);

// ═══ METHOD SYNTAX (Preferred) ═══
var expensive = products
    .Where(p => p.Price > 100)
    .OrderByDescending(p => p.Price)
    .Select(p => new { p.Name, p.Price });

// ═══ QUERY SYNTAX ═══
var expensiveQuery = from p in products
                     where p.Price > 100
                     orderby p.Price descending
                     select new { p.Name, p.Price };

// Both produce the same result!
foreach (var item in expensive)
    Console.WriteLine($"{item.Name}: {item.Price:C}");

// ═══ COMMON OPERATIONS ═══
// Filter
var electronics = products.Where(p => p.Category == "Electronics");

// Transform
var names = products.Select(p => p.Name);
var summaries = products.Select(p => $"{p.Name} ({p.Price:C})");

// First / Single / Last
var first = products.First();                         // First item (throws if empty)
var firstOrNull = products.FirstOrDefault();          // First item or null
var cheapest = products.MinBy(p => p.Price);          // Item with lowest price
var mostExpensive = products.MaxBy(p => p.Price);

// Aggregates
var totalValue = products.Sum(p => p.Price * p.Stock);
var avgPrice = products.Average(p => p.Price);
var count = products.Count(p => p.Category == "Electronics");
var any = products.Any(p => p.Price > 1000);          // true
var all = products.All(p => p.Stock > 0);

// Sorting
var sorted = products
    .OrderBy(p => p.Category)
    .ThenByDescending(p => p.Price);

// Distinct
var categories = products.Select(p => p.Category).Distinct();
      ` },
    { id: "linq-grouping-joining", title: "GroupBy, Join & Advanced LINQ", content: `
## GroupBy, Join, SelectMany & More

### GroupBy — SQL-like GROUP BY in C#
Groups elements by a key and lets you aggregate each group.

### Join — Combine Two Collections
Works like SQL INNER JOIN.

### SelectMany — Flatten Nested Collections
Flattens a "list of lists" into a single flat list.
      `, code: `// ═══ GROUP BY ═══
var byCategory = products
    .GroupBy(p => p.Category)
    .Select(g => new
    {
        Category = g.Key,
        Count = g.Count(),
        AvgPrice = g.Average(p => p.Price),
        TotalStock = g.Sum(p => p.Stock)
    })
    .OrderByDescending(g => g.AvgPrice);

foreach (var group in byCategory)
    Console.WriteLine($"{group.Category}: {group.Count} products, avg {group.AvgPrice:C}");

// ═══ JOIN ═══
var orders = new[]
{
    new { OrderId = 1, ProductName = "Laptop", Qty = 2 },
    new { OrderId = 2, ProductName = "Mouse", Qty = 5 },
    new { OrderId = 3, ProductName = "Desk", Qty = 1 },
};

var orderDetails = orders
    .Join(products,
        o => o.ProductName,    // outer key
        p => p.Name,           // inner key
        (o, p) => new          // result selector
        {
            o.OrderId,
            p.Name,
            o.Qty,
            Total = o.Qty * p.Price
        });

// ═══ LEFT JOIN (GroupJoin) ═══
var leftJoin = products
    .GroupJoin(orders,
        p => p.Name,
        o => o.ProductName,
        (p, matchingOrders) => new
        {
            p.Name,
            p.Price,
            OrderCount = matchingOrders.Count(),
            TotalQty = matchingOrders.Sum(o => o.Qty)
        });

// ═══ SELECTMANY — Flatten ═══
var departments = new[]
{
    new { Dept = "Engineering", Members = new[] { "Alice", "Bob", "Carol" } },
    new { Dept = "Sales", Members = new[] { "David", "Eve" } },
};

var allMembers = departments.SelectMany(d => d.Members);
// ["Alice", "Bob", "Carol", "David", "Eve"]

var withDept = departments.SelectMany(
    d => d.Members,
    (dept, member) => $"{member} ({dept.Dept})"
);
// ["Alice (Engineering)", "Bob (Engineering)", ...]

// ═══ ZIP — Pair Elements ═══
var names2 = new[] { "Alice", "Bob" };
var scores = new[] { 95, 87 };
var paired = names2.Zip(scores, (n, s) => $"{n}: {s}");
// ["Alice: 95", "Bob: 87"]

// ═══ CHUNK (C# 13+) ═══
var chunks = Enumerable.Range(1, 10).Chunk(3);
// [[1,2,3], [4,5,6], [7,8,9], [10]]

// ═══ DEFERRED vs IMMEDIATE EXECUTION ═══
// Deferred: query is not executed until iterated
var query = products.Where(p => p.Price > 100); // NOT executed yet!
var list = query.ToList();                        // NOW it executes

// Be careful: if products changes, query reflects the change
// Use .ToList() or .ToArray() to "snapshot" the results
      ` },
  ],
};
