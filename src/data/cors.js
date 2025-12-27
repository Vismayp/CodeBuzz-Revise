export const topics = [
  {
    id: "cors-fundamentals",
    title: "CORS Fundamentals",
    description:
      "Understanding Cross-Origin Resource Sharing and Browser Security.",
    icon: "ShieldCheck",
    sections: [
      {
        id: "what-is-cors",
        title: "What is CORS?",
        content: `
**Cross-Origin Resource Sharing (CORS)** is a browser security feature that restricts web pages from making requests to a different domain than the one that served the web page.

### The Problem
By default, browsers enforce the **Same-Origin Policy (SOP)**. This means a script running on \`https://domain-a.com\` cannot fetch data from \`https://domain-b.com/api\` unless the server at \`domain-b.com\` explicitly allows it.

### Why do we need it?
Without SOP/CORS, a malicious site could:
1. Load in your browser.
2. Make a request to \`https://your-bank.com/api/transfer\`.
3. Since you are logged into your bank, the browser would send your session cookies automatically.
4. The malicious site could steal your data or perform actions on your behalf.
        `,
        diagram: `
graph LR
    A[Browser: domain-a.com] -- "Fetch API" --> B[Server: domain-b.com]
    B -- "CORS Headers" --> A
    style B fill:#f96,stroke:#333,stroke-width:4px
        `,
      },
      {
        id: "same-origin-policy",
        title: "Same-Origin Policy (SOP)",
        content: `
Two URLs have the **same origin** if they share the exact same:
1. **Protocol** (http vs https)
2. **Host** (domain.com)
3. **Port** (80, 443, 3000, etc.)

### Examples (Origin: http://example.com:80)
| URL | Outcome | Reason |
|-----|---------|--------|
| \`http://example.com/page.html\` | Success | Same protocol, host, port |
| \`https://example.com/page.html\` | Failure | Different protocol |
| \`http://api.example.com/data\` | Failure | Different host (subdomain) |
| \`http://example.com:8080/data\` | Failure | Different port |
        `,
        code: `// Checking origin in JS
console.log(window.location.origin); 
// Output: "https://my-app.com"`,
      },
    ],
  },
  {
    id: "cors-mechanism",
    title: "How CORS Works",
    description: "Simple requests vs Preflight requests.",
    icon: "Zap",
    sections: [
      {
        id: "simple-requests",
        title: "Simple Requests",
        content: `
A request is "simple" if it meets these criteria:
- Method: \`GET\`, \`POST\`, or \`HEAD\`.
- Headers: Only standard headers like \`Accept\`, \`Content-Type\` (limited to \`application/x-www-form-urlencoded\`, \`multipart/form-data\`, or \`text/plain\`).

For simple requests, the browser sends the request directly and checks the response headers.
        `,
        diagram: `
sequenceDiagram
    participant B as Browser
    participant S as Server
    B->>S: GET /api/data (Origin: a.com)
    S->>B: 200 OK (Access-Control-Allow-Origin: a.com)
        `,
      },
      {
        id: "preflight-requests",
        title: "Preflight Requests (OPTIONS)",
        content: `
If a request is NOT simple (e.g., uses \`PUT\`, \`DELETE\`, or \`application/json\`), the browser sends a **Preflight** request first.

1. **OPTIONS Request**: The browser asks the server if the actual request is safe to send.
2. **Server Response**: If the server allows it, the browser sends the actual request.

### Preflight Headers
- \`Access-Control-Request-Method\`: The method of the actual request.
- \`Access-Control-Request-Headers\`: Custom headers in the actual request.
        `,
        diagram: `
sequenceDiagram
    participant B as Browser
    participant S as Server
    Note over B: Non-simple request (e.g. PUT)
    B->>S: OPTIONS /api/resource
    S->>B: 204 No Content (Allow: PUT, Origin: a.com)
    B->>S: PUT /api/resource
    S->>B: 200 OK
        `,
      },
    ],
  },
  {
    id: "cors-headers",
    title: "CORS Headers Reference",
    description: "Key headers used by servers to control access.",
    icon: "List",
    sections: [
      {
        id: "response-headers",
        title: "Server Response Headers",
        content: `
| Header | Description |
|--------|-------------|
| \`Access-Control-Allow-Origin\` | Specifies which origins are allowed. Can be \`*\` or a specific domain. |
| \`Access-Control-Allow-Methods\` | Allowed HTTP methods (GET, POST, etc.). |
| \`Access-Control-Allow-Headers\` | Allowed custom headers. |
| \`Access-Control-Allow-Credentials\` | Whether to allow cookies/auth headers. |
| \`Access-Control-Max-Age\` | How long (seconds) the preflight result can be cached. |
        `,
        code: `// Example Express.js CORS configuration
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'https://my-trusted-app.com',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));`,
      },
    ],
  },
];
