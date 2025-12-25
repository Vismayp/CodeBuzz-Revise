
export const topics = [
  {
    id: "prisma-basics",
    title: "Prisma Fundamentals",
    description: "Introduction to Next-Gen ORM for Node.js and TypeScript.",
    icon: "Database", 
    sections: [
      {
        id: "intro",
        title: "What is Prisma?",
        content: `
Prisma is a **Next-generation ORM** (Object-Relational Mapper) that makes working with databases (PostgreSQL, MySQL, SQLite, MongoDB) easy and type-safe.

### Components
1. **Prisma Client**: Auto-generated, type-safe query builder.
2. **Prisma Migrate**: Declarative data modeling and migration system.
3. **Prisma Studio**: GUI to view and edit data in your database.

### Why Prisma?
- **Type Safety**: Access DB results with full TypeScript support.
- **Auto-completion**: IDE knows your database schema.
- **Productivity**: Minimal boilerplate compared to traditional ORMs or SQL drivers.
        `,
        diagram: `
graph LR
    App[Your App] <--> Client[Prisma Client]
    Client <--> Engine[Query Engine]
    Engine <--> DB[(Database)]
    Schema[prisma.schema] -.-> |Generates| Client
    Schema -.-> |Migrates| DB
        `
      },
      {
        id: "schema",
        title: "Prisma Schema",
        content: `
The \`schema.prisma\` file is the main configuration file. It contains:
- **Data Source**: Database connection info.
- **Generator**: Config for Prisma Client.
- **Data Models**: Definition of your tables/collections.
        `,
        code: `// schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  role      Role     @default(USER)
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

enum Role {
  USER
  ADMIN
}`
      }
    ]
  },
  {
    id: "prisma-operations",
    title: "CRUD with Prisma Client",
    description: "Reading, Writing, and Filtering data.",
    icon: "Code",
    sections: [
      {
        id: "crud-create",
        title: "Create Data",
        content: `
Prisma provides intuitive methods like \`create\`, \`createMany\`.
You can also perform **Nested Writes** (create related records in one go).
        `,
        code: `import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Create a single user
const user = await prisma.user.create({
  data: {
    email: 'elsa@prisma.io',
    name: 'Elsa Prisma',
  },
})

// Create user AND a post (Nested Write)
const userWithPost = await prisma.user.create({
  data: {
    email: 'bob@prisma.io',
    posts: {
      create: {
        title: 'Hello World',
        content: 'This is my first post'
      }
    }
  }
})`
      },
      {
        id: "crud-read",
        title: "Read Data (Queries)",
        content: `
Prisma's query API is powerful. You can \`select\` specific fields and \`include\` relations.

- **findUnique**: Get by unique field (ID, email).
- **findMany**: Get list with filtering/sorting/pagination.
- **findFirst**: Get first match.
        `,
        code: `// Find all users with their posts
const users = await prisma.user.findMany({
  where: {
    email: { contains: 'prisma.io' }
  },
  include: {
    posts: true // Join the posts table
  }
})

// Select specific fields
const userEmail = await prisma.user.findUnique({
  where: { id: 1 },
  select: { email: true } // Only return email
})`
      },
      {
        id: "crud-update-delete",
        title: "Update & Delete",
        content: `
Update existing records using \`update\`, \`updateMany\`, or \`upsert\`.
Delete using \`delete\` or \`deleteMany\`.
        `,
        code: `// Update
const updatedUser = await prisma.user.update({
  where: { id: 1 },
  data: {
    name: 'New Name'
  }
})

// Upsert: Update if exists, Create if not
const upsertUser = await prisma.user.upsert({
  where: { email: 'viola@prisma.io' },
  update: { name: 'Viola' },
  create: {
    email: 'viola@prisma.io',
    name: 'Viola'
  },
})

// Delete
const deletedUser = await prisma.user.delete({
  where: { id: 1 },
})`
      }
    ]
  },
  {
    id: "prisma-advanced",
    title: "Advanced Features",
    description: "Filtering, Pagination, and Transactions.",
    icon: "Zap",
    sections: [
      {
        id: "filtering-pagination",
        title: "Filtering & Pagination",
        content: `
### Filtering
Prisma supports complex filtering conditions: \`equals\`, \`not\`, \`in\`, \`lt\`, \`gt\`, \`contains\`, \`startsWith\`, etc.

### Pagination
Two types:
1. **Offset Pagination** (\`skip\`, \`take\`): Easy, but slower on large datasets.
2. **Cursor Pagination** (\`cursor\`, \`take\`): Highly scalable.
        `,
        code: `// Offset Pagination
const results = await prisma.post.findMany({
  skip: 20,
  take: 10,
  where: {
    published: true
  }
})

// Cursor Pagination
const firstQuery = await prisma.post.findMany({
  take: 4,
  orderBy: { id: 'asc' }
});
const lastPost = firstQuery[3];
const nextQuery = await prisma.post.findMany({
  take: 4,
  cursor: { id: lastPost.id }, // Start after this ID
  skip: 1 // Skip the cursor itself
});`
      },
      {
        id: "transactions",
        title: "Transactions",
        content: `
Ensure multiple operations succeed or fail together.

### Interactive Transactions
Allows executing arbitrary code within a transaction.
        `,
        code: `const result = await prisma.$transaction(async (tx) => {
  // 1. Decrement sender balance
  const sender = await tx.account.update({
    where: { id: from },
    data: { balance: { decrement: amount } }
  })

  // 2. Verify logic (e.g. check for overdraft)
  if (sender.balance < 0) {
    throw new Error('Insufficient funds')
  }

  // 3. Increment receiver balance
  const receiver = await tx.account.update({
    where: { id: to },
    data: { balance: { increment: amount } }
  })

  return receiver
})`
      }
    ]
  }
];
