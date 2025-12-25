
export const topics = [
  {
    id: "graphql-basics",
    title: "GraphQL Fundamentals",
    description: "Understand the core concepts of GraphQL and how it differs from REST.",
    icon: "Globe", 
    sections: [
      {
        id: "intro",
        title: "What is GraphQL?",
        content: `
GraphQL is a **query language for APIs** and a runtime for fulfilling those queries with your existing data.
It was developed by Facebook in 2012 and released as open-source in 2015.

### REST vs GraphQL
| Feature | REST | GraphQL |
| :--- | :--- | :--- |
| **Data Fetching** | Over-fetching or Under-fetching is common. | Clients fetch **exactly** what they need. |
| **Endpoints** | Multiple endpoints (e.g., \`/users\`, \`/posts\`). | Single endpoint (usually \`/graphql\`). |
| **Versioning** | Versioned API (e.g., \`/v1/users\`). | No versioning; fields are deprecated instead. |
| **Structure** | Response structure controlled by server. | Response structure controlled by client. |

### Key Benefits
1. **Efficiency**: Minimizes data transfer over the network.
2. **Type Safety**: Strongly typed schema ensures data consistency.
3. **Developer Experience**: Introspection allows for powerful tools like GraphiQL.
        `,
        diagram: `
graph LR
    subgraph REST
    Client1[Client] -- "GET /users" --> S1[Server]
    S1 -- "Returns ID, Name, Age, Address..." --> Client1
    Client1 -- "GET /user/1/posts" --> S1
    end

    subgraph GraphQL
    Client2[Client] -- "Query { user { name } }" --> S2[Server]
    S2 -- "Returns { user: { name } }" --> Client2
    end
        `,
        code: `# REST Request (Conceptual)
GET /api/users/1

# GraphQL Query
query {
  user(id: "1") {
    name
    email
  }
}` 
      },
      {
        id: "schema-types",
        title: "Schema & Type System",
        content: `
The **Schema** is the contract between the client and the server. It defines the capabilities of the API.

### Basic Types (Scalars)
- \`String\`: UTF-8 character sequence.
- \`Int\`: Signed 32-bit integer.
- \`Float\`: Signed double-precision floating-point value.
- \`Boolean\`
- \`ID\`: Unique identifier (serialized as String).

### Object Types
Define the shape of your data resources.

### The ! (Non-Null)
By default, fields are nullable. Adding \`!\` makes them non-nullable.
        `,
        code: `type User {
  id: ID!
  name: String!
  age: Int
  posts: [Post!]! # Array cannot be null, and items cannot be null
}

type Post {
  id: ID!
  title: String!
  content: String
  author: User!
}`
      }
    ]
  },
  {
    id: "graphql-operations",
    title: "Operations: Queries & Mutations",
    description: "Reading and modifying data in GraphQL.",
    icon: "Server",
    sections: [
      {
        id: "queries",
        title: "Queries",
        content: `
**Queries** are used to fetch data (equivalent to GET in REST).

### Features:
- **Fields**: Selecting specific fields.
- **Arguments**: Passing arguments to fields.
- **Aliases**: Renaming result fields to avoid conflicts.
- **Fragments**: Reusable units of query logic.
        `,
        code: `# Basic Query
query GetUser {
  user(id: "123") {
    name
    email
  }
}

# Aliases
query GetTwoUsers {
  admin: user(id: "1") {
    name
  }
  guest: user(id: "2") {
    name
  }
}

# Fragments
fragment UserFields on User {
  name
  email
}

query {
  user(id: "1") {
    ...UserFields
  }
}`
      },
      {
        id: "mutations",
        title: "Mutations",
        content: `
**Mutations** are used to modify server-side data (Create, Update, Delete).

They work similarly to queries but are executed **serially** (one after another) to ensure data integrity, whereas queries can be executed in parallel.
        `,
        code: `mutation CreatePost {
  createPost(title: "GraphQL is Awesome", content: "...") {
    id
    title
    createdAt
  }
}

# With Variables
mutation CreateUser($name: String!, $email: String!) {
  createUser(name: $name, email: $email) {
    id
    name
  }
}`
      }
    ]
  },
  {
    id: "graphql-server",
    title: "Building the Server",
    description: "Resolvers, Context, and Apollo Server.",
    icon: "Database",
    sections: [
      {
        id: "resolvers",
        title: "Resolvers",
        content: `
**Resolvers** are functions that provide the logic for fetching the data defined in the schema.
Every field in the schema is backed by a resolver function.

### Arguments
\`resolver(parent, args, context, info)\`
1. **parent**: Result of the previous resolver calls (handling nested structures).
2. **args**: The arguments passed into the field in the query.
3. **context**: Object shared across all resolvers (e.g., auth headers, db connection).
4. **info**: Information about the execution state (rarely used).
        `,
        code: `const resolvers = {
  Query: {
    user: (parent, args, context) => {
      return db.users.find(u => u.id === args.id);
    },
    posts: () => db.posts.findAll()
  },
  User: {
    // Trivial resolver (default behavior)
    name: (parent) => parent.name,
    
    // Nested resolver
    posts: (parent) => {
      return db.posts.filter(p => p.authorId === parent.id);
    }
  }
};`
      },
      {
        id: "apollo-server",
        title: "Apollo Server Setup",
        content: `
**Apollo Server** is the most popular open-source GraphQL server connection.

It abstracts away the complexity of parsing and validating queries.
        `,
        code: `import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = \`#graphql
  type Book {
    title: String
    author: String
  }
  type Query {
    books: [Book]
  }
\`;

const resolvers = {
  Query: {
    books: () => books,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(\`🚀  Server ready at: \${url}\`);`
      }
    ]
  },
  {
    id: "graphql-advanced",
    title: "Advanced Patterns",
    description: "N+1 Problem, DataLoaders, and Subscriptions.",
    icon: "Zap",
    sections: [
      {
        id: "n-plus-one",
        title: "The N+1 Problem",
        content: `
The **N+1 Problem** is a common performance bottleneck in GraphQL.
It happens when fetching a list of items (1 query), and then for each item, executing another query to fetch a related field (N queries).

**Example**: Fetching 10 users, and for each user, fetching their specific address from the DB.
Result: 1 (users) + 10 (addresses) = 11 DB calls.
        `,
        diagram: `
graph TD
    Q[Query Users] --> U1[User 1]
    Q --> U2[User 2]
    Q --> U3[User 3]
    U1 -- "DB Call" --> A1[Address 1]
    U2 -- "DB Call" --> A2[Address 2]
    U3 -- "DB Call" --> A3[Address 3]
    style A1 fill:#f96,stroke:#333
    style A2 fill:#f96,stroke:#333
    style A3 fill:#f96,stroke:#333
        `
      },
      {
        id: "dataloader",
        title: "DataLoader Solution",
        content: `
**DataLoader** is a library that solves the N+1 problem using **Batching** and **Caching**.

- **Batching**: Collects all individual requests within a single tick of the event loop and sends them as one batch request to the DB.
- **Caching**: Memorizes the result of a request to avoid redundant loading.
        `,
        code: `const DataLoader = require('dataloader');

// Batch function: accepts Array of Keys, returns Array of Promises
const batchUsers = async (ids) => {
  const users = await db.users.find({ id: { $in: ids } });
  // Map back to original order of ids
  return ids.map(id => users.find(u => u.id === id));
};

const userLoader = new DataLoader(batchUsers);

// In Resolver
// This will happen 10 times, but DataLoader will coalesce it into 1 DB call
userLoader.load(1);
userLoader.load(2);`
      }
    ]
  }
];
