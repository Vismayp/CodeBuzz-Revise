
export const topics = [
  {
    id: "jwt-basics",
    title: "JWT Fundamentals",
    description: "Understanding JSON Web Tokens and Stateless Authentication.",
    icon: "Lock", 
    sections: [
      {
        id: "what-is-jwt",
        title: "What is JWT?",
        content: `
**JSON Web Token (JWT)** is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.

### Why JWTs are useful?
1. **Authorization**: The most common scenario. Once the user is logged in, each subsequent request will include the JWT, allowing the user to access routes, services, and resources that are permitted with that token.
2. **Stateless**: The server does not need to keep a session record in memory. The token *is* the session.

### Structure
A JWT consists of three parts separated by dots (\`.\`):
1. **Header**: Algorithm & Token Type.
2. **Payload**: Data (Claims).
3. **Signature**: Verification.

\`xxxxx.yyyyy.zzzzz\`
        `,
        diagram: `
graph LR
    subgraph JWT Structure
    H[Header] -- "Base64Url" --> EncH
    P[Payload] -- "Base64Url" --> EncP
    S[Signature]
    end
    
    EncH -- "." --> Token
    EncP -- "." --> Token
    S -- "." --> Token
    Token["eyJhbGciOiJIUzI1NiIsInR..."]
        `
      },
      {
        id: "anatomy",
        title: "Anatomy of a JWT",
        content: `
### 1. Header
Describes *how* the token is signed.
\`\`\`json
{
  "alg": "HS256",
  "typ": "JWT"
}
\`\`\`

### 2. Payload
Contains the **Claims** (statements about an entity/user).
- **Registered claims**: \`iss\` (issuer), \`exp\` (expiration), \`sub\` (subject).
- **Public claims**: Custom fields like \`email\`, \`role\`.
\`\`\`json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
\`\`\`

### 3. Signature
Used to verify the message wasn't changed along the way.
\`\`\`
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
\`\`\`
        `,
        code: `// Decoded JWT example
const header = {
  "alg": "HS256",
  "typ": "JWT"
};

const payload = {
  "id": "user_123",
  "role": "admin",
  "exp": 1690000000 // Expiration Timestamp
};

// The client treats this as an opaque string
// The server uses the SECRET to validate it`
      }
    ]
  },
  {
    id: "jwt-implementation",
    title: "Implementing JWT Auth",
    description: "Building a secure auth flow in Node.js.",
    icon: "Key",
    sections: [
      {
        id: "auth-flow",
        title: "Authentication Flow",
        content: `
1. **Client** sends credentials (username/password) to \`/login\`.
2. **Server** validates credentials against DB.
3. **Server** creates a JWT (signs it with a secret key) and sends it back.
4. **Client** stores the JWT (LocalStorage, Cookie, or Memory).
5. **Client** sends the JWT in the \`Authorization\` header for protected requests.
6. **Server** verifies the signature. If valid, grants access.
        `,
        diagram: `
sequenceDiagram
    participant C as Client
    participant S as Server
    participant DB as Database
    
    C->>S: POST /login {user, pass}
    S->>DB: Validate User
    DB-->>S: User Valid
    S->>S: Generate JWT (Sign with Secret)
    S-->>C: Return { accessToken }
    
    C->>S: GET /dashboard (Header: Bearer token)
    S->>S: Verify Token Signature
    S-->>C: Return Protected Data
        `
      },
      {
        id: "access-refresh",
        title: "Access & Refresh Tokens",
        content: `
For better security, use dual tokens.

### Access Token
- **Short-lived** (e.g., 15 mins).
- Used to access resources.
- If stolen, damage is limited by time.

### Refresh Token
- **Long-lived** (e.g., 7 days).
- Used ONLY to get a new Access Token.
- Stored securely (e.g., **HttpOnly Cookie** to prevent XSS).
- Can be revoked in the database (whitelist/blacklist).

**Flow**:
1. Access Token expires -> Client gets 401.
2. Client sends Refresh Token to \`/refresh\`.
3. Server verifies Refresh Token & issues new Access Token.
        `,
        code: `// 1. Generate Tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { id: user.id }, 
    process.env.REFRESH_SECRET, 
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

// 2. Refresh Logic
app.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
  
  // Verify & Check DB if allowed
  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    
    const tokens = generateTokens({ id: user.id });
    res.json(tokens);
  });
});`
      }
    ]
  },
  {
    id: "jwt-security",
    title: "Security Best Practices",
    description: "Where to store tokens and common attacks.",
    icon: "Shield",
    sections: [
      {
        id: "storage",
        title: "Token Storage: LocalStorage vs Cookies",
        content: `
Where should you store the JWT on the client side?

### LocalStorage
- **Pros**: Easy to implement. Works with APIs on different domains.
- **Cons**: Vulnerable to **XSS** (Cross-Site Scripting). If an attacker can inject JS, they can read \`localStorage\`.

### HttpOnly Cookies
- **Pros**: Immune to XSS (JS cannot read the cookie).
- **Cons**: Vulnerable to **CSRF** (Cross-Site Request Forgery). Need CSRF protection (like SameSite=Strict).

**Recommendation**: Store **Refresh Token in HttpOnly Cookie** and **Access Token in Memory** (or LocalStorage if non-critical).
        `,
        diagram: `
graph TD
    subgraph Browser
        XSS[Malicious Script]
        LS[LocalStorage]
        Cookie[HttpOnly Cookie]
    end
    
    XSS -- "Can Read" --> LS
    XSS -- "Cannot Read" --> Cookie
        `
      },
      {
        id: "jwt-pitfalls",
        title: "Common Pitfalls",
        content: `
1. **Don't store sensitive data**: The payload is just Base64 encoded, not encrypted. Anyone can decode it. Run \`atob(token.split('.')[1])\` in console to see.
2. **Use Strong Secrets**: The signature relies on the secret key. If weak, it can be brute-forced.
3. **Algorithm Confusion**: Ensure your verify function specifies the allowed algorithms (e.g., \`HS256\`). Some older libraries allowed attackers to switch alg to \`None\`.
        `
      }
    ]
  }
];
