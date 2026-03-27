export const topics = [
  {
    id: "cue-fundamentals",
    title: "CUE Fundamentals",
    description:
      "What CUE is, why it exists, core syntax, and the value lattice type system.",
    icon: "BookOpen",
    sections: [
      {
        id: "what-is-cue",
        title: "What is CUE?",
        content: `
**CUE** stands for **Configure, Unify, Execute**. It is an open-source, purpose-built language for **defining, generating, and validating** all kinds of data — most importantly configuration files like YAML, JSON, and TOML.

### The Problem CUE Solves
In modern production systems (Kubernetes, CI/CD, cloud infra), configuration is everywhere. Teams manage hundreds of YAML files that are:
1. **Verbose & Repetitive**: Kubernetes Deployments for 10 microservices share 80% of the same boilerplate.
2. **Error-Prone**: A single typo (\`replicas: "3"\` instead of \`replicas: 3\`) can break a deployment.
3. **Unvalidated**: Plain YAML has **no type system**. There's no built-in way to say "this field must be a positive integer".
4. **Hard to Maintain**: Changes across 50 YAML files are a nightmare for consistency.

### How CUE Fixes This
CUE merges the concepts of **types**, **values**, and **constraints** into a single unified system. You write schemas and data together, and CUE validates everything automatically.

| Feature | YAML | CUE |
|---------|------|-----|
| Type Safety | None | Built-in |
| Validation | External tools | Native constraints |
| Boilerplate | Manual copy/paste | Templates & defaults |
| Composability | Limited | First-class \`&\` unification |
| Output Formats | YAML only | YAML, JSON, TOML, etc. |

### Installation
\`\`\`bash
# macOS
brew install cue-lang/tap/cue

# Go install
go install cuelang.org/go/cmd/cue@latest

# Verify
cue version
\`\`\`
        `,
        diagram: `
graph LR
    subgraph "The CUE Workflow"
    A["CUE Schema<br/>#35;Deployment"] --> U["Unification &"]
    B["CUE Values<br/>my-app config"] --> U
    U --> V{"cue vet<br/>Validate"}
    V -->|Pass| E["cue export<br/>YAML / JSON"]
    V -->|Fail| ERR["Error Report"]
    end
        `,
      },
      {
        id: "basic-syntax",
        title: "Basic Syntax",
        content: `
CUE syntax looks like JSON but is far more powerful. Here are the key differences:

### JSON vs CUE
\`\`\`json
// JSON: Verbose, no comments, no types
{
  "name": "my-app",
  "replicas": 3,
  "env": "production"
}
\`\`\`

\`\`\`cue
// CUE: Clean, typed, commented
name:     "my-app"
replicas: 3
env:      "production"
\`\`\`

### Key Syntax Rules
1. **No quotes on field names** (unless they contain special characters).
2. **Comments** are allowed with \`//\`.
3. **Trailing commas** are optional.
4. **Curly braces** are optional at the top level.
5. **Types and values live together** — \`string\` is a type, \`"hello"\` is a value that satisfies it.

### Structs (Objects)
\`\`\`cue
server: {
  host: "localhost"
  port: 8080
  tls:  true
}
\`\`\`

### Lists (Arrays)
\`\`\`cue
ports: [80, 443, 8080]
tags:  ["web", "api", "v2"]
\`\`\`

### Nested Shorthand
CUE allows collapsing nested structs into a single line:
\`\`\`cue
// These two are identical:
metadata: labels: app: "nginx"

metadata: {
  labels: {
    app: "nginx"
  }
}
\`\`\`
        `,
        code: `// Complete CUE config example
// File: config.cue

package myapp

// Application metadata
app: {
  name:        "order-service"
  version:     "2.1.0"
  environment: "production"
}

// Server configuration
server: {
  host: "0.0.0.0"
  port: 8080
  tls: {
    enabled: true
    certFile: "/etc/ssl/cert.pem"
    keyFile:  "/etc/ssl/key.pem"
  }
}

// Database
database: {
  host:     "db.internal.svc"
  port:     5432
  name:     "orders"
  maxConns: 25
}

// Feature flags
features: {
  caching:    true
  rateLimit:  true
  darkLaunch: false
}`,
      },
      {
        id: "types-and-values",
        title: "Types, Values & the Value Lattice",
        content: `
CUE's most unique concept is that **types and values are the same thing**, arranged in a **value lattice**.

### Primitive Types
| Type | Description | Example |
|------|-------------|---------|
| \`string\` | Any string | \`"hello"\` |
| \`int\` | Integer | \`42\` |
| \`float\` | Floating point | \`3.14\` |
| \`number\` | int or float | \`42\` or \`3.14\` |
| \`bool\` | Boolean | \`true\` / \`false\` |
| \`null\` | Null value | \`null\` |
| \`bytes\` | Byte sequence | \`'\\x00\\xff'\` |

### The Value Lattice
Think of CUE values as a hierarchy from most general (top) to most specific (bottom):

\`\`\`
        _ (top = anything)
       / | \\
   string int  bool
    |      |     |
  "hello"  42  true   ← concrete values
    \\      |     /
     _|_ (bottom = conflict/error)
\`\`\`

- **Top (\`_\`)**: Matches any value. Used as a wildcard.
- **Types**: \`string\`, \`int\`, etc. — constrain the set of allowed values.
- **Concrete values**: \`"hello"\`, \`42\` — the most specific.
- **Bottom (\`_|_\`)**: A conflict. Two incompatible constraints produce an error.

### Unification (\`&\`)
The **\`&\`** operator combines two values by finding their **greatest lower bound** (most specific common value):
\`\`\`cue
// Type meets value → valid
x: string & "hello"  // Result: "hello"

// Type meets type → narrower type
y: number & int       // Result: int

// Value meets value → conflict!
z: "hello" & "world"  // Result: _|_ (error)
\`\`\`

This is the foundation of CUE's validation: schemas and data are unified, and conflicts are caught automatically.
        `,
        diagram: `
graph TD
    TOP["_ (Top)<br/>Any value allowed"] --> STR["string"]
    TOP --> INT["int"]
    TOP --> BOOL["bool"]
    STR --> HELLO["&quot;hello&quot;"]
    STR --> WORLD["&quot;world&quot;"]
    INT --> FOURTWO["42"]
    INT --> SEVEN["7"]
    BOOL --> TRUE["true"]
    BOOL --> FALSE["false"]
    HELLO --> BOT["_|_ (Bottom)<br/>Conflict / Error"]
    WORLD --> BOT
    FOURTWO --> BOT
    SEVEN --> BOT
    TRUE --> BOT
    FALSE --> BOT
    style TOP fill:#4ade80,stroke:#333
    style BOT fill:#f87171,stroke:#333
        `,
      },
    ],
  },
  {
    id: "cue-schema-validation",
    title: "Schema & Validation",
    description:
      "Definitions, constraints, defaults, optional fields, and disjunctions for bulletproof configs.",
    icon: "ShieldCheck",
    sections: [
      {
        id: "definitions",
        title: "Definitions (#)",
        content: `
In CUE, a **Definition** (prefixed with \`#\`) is a reusable schema. Definitions are **not** emitted in the output — they exist only for validation.

### Why Definitions?
- They act as **types/schemas** for your data.
- They are **closed** by default: no extra fields are allowed unless you explicitly open them.
- They can be **composed** with \`&\` to build complex validations.

\`\`\`cue
// Define a schema
#Server: {
  host: string
  port: int & >0 & <=65535
  tls:  bool | *false  // default: false
}

// Use it — CUE validates automatically
prod: #Server & {
  host: "api.example.com"
  port: 443
  tls:  true
}

// This would FAIL: port is out of range
// bad: #Server & { host: "x", port: -1 }

// This would FAIL: extra field not in schema
// bad: #Server & { host: "x", port: 80, color: "red" }
\`\`\`

### Open Definitions
If you want to allow extra fields, use \`...\`:
\`\`\`cue
#FlexibleServer: {
  host: string
  port: int
  ...  // allow any additional fields
}
\`\`\`
        `,
        code: `// Production schema: Microservice config
#ServiceConfig: {
  name:    string & =~"^[a-z][a-z0-9-]*$"
  version: string & =~"^\\d+\\.\\d+\\.\\d+$"
  
  replicas: int & >=1 & <=100
  
  resources: {
    cpu:    string  // e.g., "500m", "2"
    memory: string  // e.g., "256Mi", "2Gi"
  }
  
  env: "development" | "staging" | "production"
  
  ports: [...{
    name:     string
    port:     int & >0 & <=65535
    protocol: *"TCP" | "UDP"
  }]
  
  healthCheck?: {
    path:     string | *"/health"
    interval: string | *"30s"
  }
}

// Instantiate: CUE validates every field
orderService: #ServiceConfig & {
  name:     "order-service"
  version:  "1.5.2"
  replicas: 3
  resources: {
    cpu:    "500m"
    memory: "512Mi"
  }
  env: "production"
  ports: [{
    name: "http"
    port: 8080
  }]
  healthCheck: path: "/api/health"
}`,
      },
      {
        id: "constraints",
        title: "Constraints & Expressions",
        content: `
CUE constraints are the killer feature. They let you express **rules** directly in your config schema.

### Numeric Constraints
\`\`\`cue
port:     int & >0 & <=65535
replicas: int & >=1 & <=100
timeout:  number & >0
\`\`\`

### String Constraints (Regex)
\`\`\`cue
// Must match a pattern
name:    string & =~"^[a-z][a-z0-9-]*$"
version: string & =~"^v?\\d+\\.\\d+\\.\\d+$"
email:   string & =~"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"

// Must NOT match a pattern
password: string & !~"^(password|123456|admin)$"
\`\`\`

### List Constraints
\`\`\`cue
// Fixed-length list
rgb: [int, int, int]

// Variable-length list of strings
tags: [...string]

// At least 1 element, all integers > 0
ports: [int & >0, ...(int & >0)]

// Exact length with constraints
coordinates: [float, float] & list.MinItems(2)
\`\`\`

### Struct Constraints
\`\`\`cue
// All values in this struct must be strings
labels: [string]: string

// All values must be ints between 1-100
scores: [string]: int & >=1 & <=100
\`\`\`

### Cross-Field Validation
\`\`\`cue
#Config: {
  minReplicas: int
  maxReplicas: int & >= minReplicas  // must be >= minReplicas
}
\`\`\`
        `,
        diagram: `
graph TD
    subgraph "Constraint Resolution"
    A["port: int"] --> U["Unify &"]
    B["> 0"] --> U
    C["<= 65535"] --> U
    D["8080"] --> U
    U --> R["Result: 8080 ✓"]
    end
    
    subgraph "Constraint Conflict"
    E["replicas: int"] --> U2["Unify &"]
    F[">= 1"] --> U2
    G["-5"] --> U2
    U2 --> ERR["_|_ Error: -5 < 1"]
    end
    
    style R fill:#4ade80,stroke:#333
    style ERR fill:#f87171,stroke:#333
        `,
      },
      {
        id: "defaults-optionals",
        title: "Defaults & Optional Fields",
        content: `
### Default Values (\`*\`)
Use the \`*\` prefix inside a disjunction to mark a default:
\`\`\`cue
// If not specified, defaults to "info"
logLevel: *"info" | "debug" | "warn" | "error"

// Default port is 8080
port: int | *8080

// Default boolean
tls: bool | *false
\`\`\`

Defaults are applied when a field is left unspecified. If a value is provided, it must still satisfy the constraints.

### Optional Fields (\`?\`)
An optional field may be omitted entirely:
\`\`\`cue
#Database: {
  host:     string
  port:     int | *5432
  name:     string
  password: string
  
  // Optional fields
  ssl?:      bool
  poolSize?: int & >=1
  timeout?:  string
}

// Valid: optional fields omitted
myDB: #Database & {
  host:     "db.prod.internal"
  name:     "orders"
  password: "s3cret"
  // port defaults to 5432
  // ssl, poolSize, timeout are all omitted — OK
}
\`\`\`

### Required vs Optional vs Default
| Pattern | Meaning | Omissible? |
|---------|---------|------------|
| \`field: string\` | Required, must be a string | No |
| \`field?: string\` | Optional, string if present | Yes |
| \`field: string \\| *"default"\` | Has a default, always present | Yes (uses default) |
        `,
        code: `// Real-world: Production deployment schema with defaults
#Deployment: {
  name:     string
  image:    string
  replicas: int | *1

  // Resource defaults for cost control
  resources: {
    requests: {
      cpu:    string | *"100m"
      memory: string | *"128Mi"
    }
    limits: {
      cpu:    string | *"500m"
      memory: string | *"512Mi"
    }
  }

  // Optional overrides
  env?:         [...#EnvVar]
  nodeSelector?: [string]: string
  tolerations?:  [...#Toleration]
}

#EnvVar: {
  name:  string
  value: string
}

#Toleration: {
  key:      string
  operator: string | *"Equal"
  value?:   string
  effect:   string
}

// Minimal deploy — defaults fill in the gaps
api: #Deployment & {
  name:  "api-server"
  image: "myrepo/api:v2.0.0"
  // replicas defaults to 1
  // resources defaults to 100m/128Mi requests
}`,
      },
      {
        id: "disjunctions-enums",
        title: "Disjunctions (Enums & Unions)",
        content: `
Disjunctions (\`|\`) in CUE let you define **allowed sets of values** — essentially enums or union types.

### Simple Enums
\`\`\`cue
// Only these 3 values are allowed
env:      "dev" | "staging" | "prod"
protocol: "TCP" | "UDP" | "SCTP"
logLevel: "debug" | "info" | "warn" | "error" | "fatal"
\`\`\`

### Enums with Default
\`\`\`cue
// "info" is the default; other values still allowed
logLevel: *"info" | "debug" | "warn" | "error"
\`\`\`

### Union Types
\`\`\`cue
// Can be a string OR an integer
port: string | int

// Can be null OR a string
name: null | string
\`\`\`

### Disjunctions in Schemas
\`\`\`cue
#Container: {
  image: string
  
  // Restart policy must be one of these
  restartPolicy: "Always" | "OnFailure" | "Never"
  
  // Pull policy with a sensible default
  imagePullPolicy: *"IfNotPresent" | "Always" | "Never"
}
\`\`\`

### Production Example: Multi-Environment Config
\`\`\`cue
#Environment: "development" | "staging" | "production"

#AppConfig: {
  env: #Environment
  
  // Conditional: production must have >= 3 replicas
  if env == "production" {
    replicas: int & >=3
  }
  if env != "production" {
    replicas: int & >=1
  }
  
  debug: bool
}

prod: #AppConfig & {
  env:      "production"
  replicas: 5
  debug:    false
}
\`\`\`
        `,
      },
    ],
  },
  {
    id: "cue-cli-toolchain",
    title: "CUE CLI Toolchain",
    description:
      "Master the cue vet, export, eval, fmt, and import commands for production workflows.",
    icon: "Terminal",
    sections: [
      {
        id: "cue-vet",
        title: "cue vet — Validate Configs",
        content: `
\`cue vet\` is the **most important command** for production use. It validates data files against CUE schemas.

### Basic Usage
\`\`\`bash
# Validate a YAML file against a CUE schema
cue vet schema.cue config.yaml

# Validate multiple YAML files at once
cue vet schema.cue dev.yaml staging.yaml prod.yaml

# Validate against a specific definition
cue vet -d '#Deployment' schema.cue deployment.yaml
\`\`\`

### How It Works
1. CUE reads the schema (\`.cue\`) and the data (\`.yaml\`).
2. It **unifies** them — merging constraints with values.
3. If every constraint is satisfied → **silent success** (exit code 0).
4. If any constraint fails → **error with exact location and reason**.

### Example: Catching Config Errors
**schema.cue:**
\`\`\`cue
#Config: {
  name:     string
  replicas: int & >=1 & <=50
  env:      "dev" | "staging" | "prod"
}
\`\`\`

**bad-config.yaml:**
\`\`\`yaml
name: my-app
replicas: -1
env: "testing"
\`\`\`

\`\`\`bash
$ cue vet -d '#Config' schema.cue bad-config.yaml
# replicas: invalid value -1 (out of bound >=1)
# env: 3 errors in empty disjunction:
#   "testing" not in ["dev","staging","prod"]
\`\`\`

### Concrete Validation (\`-c\`)
By default, \`cue vet\` allows incomplete values. Use \`-c\` to require all values to be concrete:
\`\`\`bash
# Strict mode: every field must have a concrete value
cue vet -c schema.cue config.yaml
\`\`\`
        `,
        diagram: `
sequenceDiagram
    participant Dev as Developer
    participant CUE as cue vet
    participant Schema as schema.cue
    participant Data as config.yaml

    Dev->>CUE: cue vet schema.cue config.yaml
    CUE->>Schema: Load constraints
    CUE->>Data: Load values
    CUE->>CUE: Unify (schema & data)
    alt All constraints pass
        CUE-->>Dev: ✅ Silent success (exit 0)
    else Constraint violation
        CUE-->>Dev: ❌ Error with line & reason
    end
        `,
      },
      {
        id: "cue-export",
        title: "cue export — Generate YAML/JSON",
        content: `
\`cue export\` evaluates CUE files and outputs **concrete data** in YAML, JSON, or other formats. This is how you generate production configs from CUE.

### Basic Export
\`\`\`bash
# Export as YAML (most common for K8s)
cue export config.cue --out yaml

# Export as JSON
cue export config.cue --out json

# Export to a file
cue export config.cue --out yaml --outfile output.yaml
\`\`\`

### Export Specific Expressions
\`\`\`bash
# Only export the "deployment" field
cue export config.cue --out yaml -e deployment

# Export a nested field
cue export config.cue --out yaml -e config.server
\`\`\`

### Merge CUE + YAML and Export
\`\`\`bash
# Combine a schema with data and export validated output
cue export schema.cue data.yaml --out yaml
\`\`\`

### Production Workflow
\`\`\`bash
# 1. Validate first
cue vet -c schema.cue config.cue

# 2. Export only if valid
cue export config.cue --out yaml --outfile k8s-manifests.yaml

# 3. Apply to Kubernetes
kubectl apply -f k8s-manifests.yaml
\`\`\`
        `,
        code: `// config.cue — Source of truth
package infra

deployment: {
  apiVersion: "apps/v1"
  kind:       "Deployment"
  metadata: {
    name: "web-frontend"
    labels: {
      app:     "frontend"
      version: "v3.2.1"
    }
  }
  spec: {
    replicas: 3
    selector: matchLabels: app: "frontend"
    template: {
      metadata: labels: app: "frontend"
      spec: containers: [{
        name:  "frontend"
        image: "myrepo/frontend:v3.2.1"
        ports: [{containerPort: 3000}]
        resources: {
          requests: {cpu: "200m", memory: "256Mi"}
          limits:   {cpu: "500m", memory: "512Mi"}
        }
      }]
    }
  }
}

// Run: cue export config.cue -e deployment --out yaml
// Output: a valid Kubernetes Deployment YAML`,
      },
      {
        id: "cue-import",
        title: "cue import — Convert YAML to CUE",
        content: `
\`cue import\` converts existing YAML (or JSON) files into CUE. This is the **first step** when migrating a project to CUE.

### Basic Import
\`\`\`bash
# Convert a single YAML file to CUE
cue import deployment.yaml
# Creates deployment.cue

# Force overwrite existing file
cue import -f deployment.yaml
\`\`\`

### Smart Import with Labels
For Kubernetes manifests, use labels to organize imported resources:
\`\`\`bash
# Import and organize by kind + name
cue import deployment.yaml \\
  -l 'strings.ToLower(kind)' \\
  -l 'metadata.name' \\
  -o k8s.cue
\`\`\`

This produces structured CUE like:
\`\`\`cue
deployment: "my-app": {
  apiVersion: "apps/v1"
  kind:       "Deployment"
  // ... rest of manifest
}
\`\`\`

### Batch Import
\`\`\`bash
# Import all YAML files in a directory
cue import ./manifests/*.yaml -f -o all.cue \\
  -l 'strings.ToLower(kind)' \\
  -l 'metadata.name'
\`\`\`

### Migration Workflow
\`\`\`bash
# Step 1: Import existing YAML
cue import -f deployment.yaml -o k8s.cue

# Step 2: Add a schema definition to k8s.cue
#   (edit file: add constraints, types, defaults)

# Step 3: Validate the imported data against your schema
cue vet -c k8s.cue

# Step 4: Export back to YAML (now validated!)
cue export k8s.cue --out yaml > deployment-validated.yaml
\`\`\`
        `,
        diagram: `
graph LR
    subgraph "Migration to CUE"
    YAML["Existing YAML<br/>deployment.yaml"] -->|"cue import"| CUE["CUE Data<br/>deployment.cue"]
    CUE -->|"Add schemas"| SCHEMA["CUE + Schema<br/>+ #Deployment"]
    SCHEMA -->|"cue vet -c"| VALID{"Validated ✓"}
    VALID -->|"cue export --out yaml"| NEWYAML["Clean YAML<br/>validated output"]
    end
        `,
      },
      {
        id: "cue-eval-fmt",
        title: "cue eval & cue fmt",
        content: `
### cue eval — Inspect & Debug
\`cue eval\` shows the **evaluated result** of CUE expressions without requiring all values to be concrete. Great for debugging.

\`\`\`bash
# See what a CUE file evaluates to
cue eval config.cue

# Evaluate a specific expression
cue eval -e server config.cue

# Output as YAML for readability
cue eval -e server --out yaml config.cue
\`\`\`

### Difference: eval vs export
| Command | Allows incomplete? | Use case |
|---------|--------------------|----------|
| \`cue eval\` | Yes — shows types + values | Debugging, inspection |
| \`cue export\` | No — all values must be concrete | Generating output files |

**Example:**
\`\`\`cue
// config.cue
server: {
  host: string   // not yet concrete
  port: 8080
}
\`\`\`

\`\`\`bash
$ cue eval config.cue
# server: {
#   host: string
#   port: 8080
# }

$ cue export config.cue
# server.host: incomplete value string
\`\`\`

### cue fmt — Format CUE Files
Ensures consistent formatting across your team:
\`\`\`bash
# Format all CUE files in the current directory
cue fmt

# Format a specific file
cue fmt myconfig.cue

# Check formatting in CI (non-zero exit if unformatted)
cue fmt --check .
\`\`\`

### Production CI Script
\`\`\`bash
#!/bin/bash
# ci-validate.sh — Run in CI pipeline

set -e

echo "🔍 Checking CUE formatting..."
cue fmt --check .

echo "✅ Validating all configs..."
cue vet -c ./schema.cue ./configs/*.yaml

echo "📦 Generating output..."
cue export ./configs/ --out yaml --outfile output/manifests.yaml

echo "🎉 All configs valid and generated!"
\`\`\`
        `,
      },
    ],
  },
  {
    id: "cue-yaml-config",
    title: "CUE for YAML Config Management",
    description:
      "Real production patterns: validating, transforming, and generating YAML configs with CUE.",
    icon: "FileJson",
    sections: [
      {
        id: "validate-yaml",
        title: "Validating YAML with CUE Schemas",
        content: `
The most common production use of CUE is **validating existing YAML files** against a schema — catching errors before they reach production.

### Step-by-Step Example

**1. Create a schema (\`schema.cue\`):**
\`\`\`cue
#AppConfig: {
  app: {
    name:    string & =~"^[a-z][a-z0-9-]+$"
    version: string
    env:     "dev" | "staging" | "prod"
  }
  server: {
    host: string
    port: int & >0 & <=65535
  }
  database: {
    host:     string
    port:     int | *5432
    name:     string
    maxConns: int & >=1 & <=200
  }
  logging: {
    level:  *"info" | "debug" | "warn" | "error"
    format: *"json" | "text"
  }
}
\`\`\`

**2. Your existing YAML (\`prod.yaml\`):**
\`\`\`yaml
app:
  name: order-service
  version: "2.1.0"
  env: prod
server:
  host: 0.0.0.0
  port: 8080
database:
  host: db.prod.internal
  name: orders
  maxConns: 50
logging:
  level: warn
\`\`\`

**3. Validate:**
\`\`\`bash
$ cue vet -d '#AppConfig' schema.cue prod.yaml
# No output = success! Config is valid.
\`\`\`

**4. Catch errors in a bad config (\`bad.yaml\`):**
\`\`\`yaml
app:
  name: Order_Service   # ← uppercase + underscore
  version: "2.1.0"
  env: testing           # ← not in allowed list
server:
  host: 0.0.0.0
  port: 99999            # ← out of range
\`\`\`

\`\`\`bash
$ cue vet -d '#AppConfig' schema.cue bad.yaml
# app.name: invalid value "Order_Service" (does not match =~"^[a-z][a-z0-9-]+$")
# app.env: 3 errors in empty disjunction
# server.port: invalid value 99999 (out of bound <=65535)
\`\`\`
        `,
        diagram: `
graph TD
    subgraph "YAML Validation Pipeline"
    S["schema.cue<br/>#35;AppConfig"] --> VET["cue vet"]
    Y1["dev.yaml"] --> VET
    Y2["staging.yaml"] --> VET
    Y3["prod.yaml"] --> VET
    VET -->|"All pass ✓"| DEPLOY["Deploy"]
    VET -->|"Any fail ✗"| BLOCK["Block & Report"]
    end
    
    style DEPLOY fill:#4ade80,stroke:#333
    style BLOCK fill:#f87171,stroke:#333
        `,
      },
      {
        id: "generate-yaml",
        title: "Generating YAML from CUE Templates",
        content: `
Instead of maintaining raw YAML, write your config in CUE and **generate** the YAML output. This gives you types, defaults, and validation for free.

### Multi-Environment Config Generation

\`\`\`cue
// base.cue — Shared template
#Config: {
  app: {
    name:    string
    version: string
    env:     "dev" | "staging" | "prod"
  }
  server: {
    host: string | *"0.0.0.0"
    port: int | *8080
  }
  database: {
    host:     string
    port:     int | *5432
    name:     string
    maxConns: int & >=1
  }
  logging: {
    level:  *"info" | "debug" | "warn" | "error"
    format: *"json" | "text"
  }
}
\`\`\`

\`\`\`cue
// dev.cue
package config

dev: #Config & {
  app: {
    name:    "order-service"
    version: "2.1.0-dev"
    env:     "dev"
  }
  server: port: 3000
  database: {
    host:     "localhost"
    name:     "orders_dev"
    maxConns: 5
  }
  logging: level: "debug"
}
\`\`\`

\`\`\`cue
// prod.cue
package config

prod: #Config & {
  app: {
    name:    "order-service"
    version: "2.1.0"
    env:     "prod"
  }
  server: port: 8080
  database: {
    host:     "db.prod.internal"
    name:     "orders"
    maxConns: 100
  }
  logging: level: "warn"
}
\`\`\`

### Generate Environment-Specific YAML
\`\`\`bash
# Generate dev config
cue export -e dev --out yaml > config-dev.yaml

# Generate prod config
cue export -e prod --out yaml > config-prod.yaml
\`\`\`

This eliminates copy-paste across environments and guarantees every config passes the same schema.
        `,
        code: `// advanced_templates.cue — DRY config with comprehensions

// Base service template
#Service: {
  name:    string
  image:   string
  port:    int | *8080
  replicas: int | *1
  env:     "dev" | "staging" | "prod"
  
  // Computed field: full image tag
  _tag: "\\(image):\\(env)-latest"
}

// Define all services from a list
_serviceNames: ["api", "worker", "scheduler"]

services: {
  for svc in _serviceNames {
    (svc): #Service & {
      name:  svc
      image: "myrepo/\\(svc)"
    }
  }
}

// Override specific services
services: api: {
  port:     3000
  replicas: 3
  env:      "prod"
}

services: worker: {
  replicas: 5
  env:      "prod"
}

services: scheduler: {
  env: "prod"
}

// Run: cue export --out yaml
// All services get defaults + overrides`,
      },
      {
        id: "transform-yaml",
        title: "Transforming & Patching YAML",
        content: `
CUE's unification makes it perfect for **patching** or **overlaying** changes onto existing YAML configs without editing them directly.

### Overlay Pattern
\`\`\`bash
# original.yaml stays untouched
# patch.cue adds/overrides fields
cue export original.yaml patch.cue --out yaml
\`\`\`

### Example: Patching a Docker Compose File

**docker-compose.yaml:**
\`\`\`yaml
version: "3.8"
services:
  web:
    image: nginx:1.25
    ports:
      - "80:80"
  api:
    image: myapp/api:latest
    ports:
      - "3000:3000"
\`\`\`

**prod-overlay.cue — Add production settings:**
\`\`\`cue
// Add resource limits and restart policy
services: [Name=_]: {
  restart: "always"
  deploy: resources: limits: {
    cpus:   "0.5"
    memory: "512M"
  }
}

// Override specific service
services: api: {
  image: "myapp/api:v2.1.0"  // Pin version
  environment: [
    "NODE_ENV=production",
    "LOG_LEVEL=warn",
  ]
}
\`\`\`

\`\`\`bash
# Merge and generate production compose file
cue export docker-compose.yaml prod-overlay.cue --out yaml \\
  > docker-compose.prod.yaml
\`\`\`

### Key Insight
The original YAML is **never modified**. CUE unifies it with your overlay and produces a new, merged output. This is safer and more auditable than editing YAML files in place.

### Common Transform Patterns
| Pattern | Description |
|---------|-------------|
| **Overlay** | Merge base + env-specific patches |
| **Defaults** | Add missing fields to existing configs |
| **Enforcement** | Ensure all services have resource limits |
| **Pinning** | Replace \`:latest\` tags with specific versions |
| **Injection** | Add labels, annotations, env vars across all resources |
        `,
      },
    ],
  },
  {
    id: "cue-kubernetes",
    title: "CUE for Kubernetes",
    description:
      "Production-grade K8s manifest management: import, validate, generate, and enforce policies.",
    icon: "Cloud",
    sections: [
      {
        id: "k8s-getting-started",
        title: "Kubernetes + CUE: Getting Started",
        content: `
CUE is one of the best tools for managing Kubernetes manifests at scale. Companies like **Mercari** have used CUE to reduce their K8s config lines by **up to 90%**.

### Why CUE for Kubernetes?
1. **Type-safe manifests**: Catch typos like \`replics: 3\` before \`kubectl apply\`.
2. **Reusable templates**: Define a base Deployment once, instantiate for every service.
3. **Policy enforcement**: Ensure every Pod has resource limits, every Deployment has labels.
4. **Multi-environment**: Generate dev/staging/prod manifests from one source.

### Initial Setup
\`\`\`bash
# Initialize a CUE module for your K8s configs
mkdir k8s-configs && cd k8s-configs
cue mod init myorg.com/k8s

# Import K8s schemas from CUE Central Registry
# (provides #Deployment, #Service, etc.)
\`\`\`

### Project Structure
\`\`\`
k8s-configs/
├── cue.mod/
│   └── module.cue
├── schema.cue          # Org-wide constraints
├── templates.cue       # Reusable templates
├── services/
│   ├── api.cue
│   ├── worker.cue
│   └── frontend.cue
└── envs/
    ├── dev.cue
    ├── staging.cue
    └── prod.cue
\`\`\`
        `,
        diagram: `
graph TD
    subgraph "CUE K8s Workflow"
    T["templates.cue<br/>#35;AppDeployment"] --> SVC1["api.cue"]
    T --> SVC2["worker.cue"]
    T --> SVC3["frontend.cue"]
    S["schema.cue<br/>Org Policies"] --> VAL["cue vet -c"]
    SVC1 --> VAL
    SVC2 --> VAL
    SVC3 --> VAL
    VAL -->|"Valid"| EXP["cue export --out yaml"]
    EXP --> DEV["dev manifests"]
    EXP --> STG["staging manifests"]
    EXP --> PROD["prod manifests"]
    end
        `,
      },
      {
        id: "k8s-import-existing",
        title: "Importing Existing K8s YAML",
        content: `
The first step in adopting CUE is importing your existing Kubernetes manifests.

### Import a Single Manifest
\`\`\`bash
# Import a Deployment YAML
cue import deployment.yaml -f -o k8s.cue \\
  -l 'strings.ToLower(kind)' \\
  -l 'metadata.name'
\`\`\`

**Before (deployment.yaml):**
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
  labels:
    app: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: myrepo/api:v1.2.0
          ports:
            - containerPort: 8080
\`\`\`

**After (k8s.cue):**
\`\`\`cue
deployment: "api-server": {
  apiVersion: "apps/v1"
  kind:       "Deployment"
  metadata: {
    name: "api-server"
    labels: app: "api"
  }
  spec: {
    replicas: 3
    selector: matchLabels: app: "api"
    template: {
      metadata: labels: app: "api"
      spec: containers: [{
        name:  "api"
        image: "myrepo/api:v1.2.0"
        ports: [{containerPort: 8080}]
      }]
    }
  }
}
\`\`\`

### Batch Import All Manifests
\`\`\`bash
# Import everything in the manifests directory
cue import ./manifests/*.yaml -f \\
  -l 'strings.ToLower(kind)' \\
  -l 'metadata.name' \\
  -p kube
\`\`\`

The \`-p kube\` flag assigns all imports to the \`kube\` package, so they can share definitions and schemas.
        `,
      },
      {
        id: "k8s-templates",
        title: "Reusable K8s Templates",
        content: `
The real power of CUE for Kubernetes is building **reusable, validated templates** that eliminate boilerplate.

### Base Deployment Template
\`\`\`cue
package kube

// Organization-wide Deployment template
#AppDeployment: {
  _name:  string   // hidden parameter
  _image: string
  _port:  int | *8080
  
  apiVersion: "apps/v1"
  kind:       "Deployment"
  metadata: {
    name: _name
    labels: {
      app:                          _name
      "app.kubernetes.io/name":     _name
      "app.kubernetes.io/managed-by": "cue"
    }
  }
  spec: {
    replicas: int | *1
    selector: matchLabels: app: _name
    template: {
      metadata: labels: app: _name
      spec: {
        containers: [{
          name:  _name
          image: _image
          ports: [{containerPort: _port}]
          resources: {
            requests: {
              cpu:    string | *"100m"
              memory: string | *"128Mi"
            }
            limits: {
              cpu:    string | *"500m"
              memory: string | *"512Mi"
            }
          }
        }]
      }
    }
  }
}

// Matching Service template
#AppService: {
  _name: string
  _port: int | *8080
  
  apiVersion: "v1"
  kind:       "Service"
  metadata: name: _name
  spec: {
    selector: app: _name
    ports: [{
      port:       _port
      targetPort: _port
      protocol:   "TCP"
    }]
  }
}
\`\`\`

### Instantiate for Each Service
\`\`\`cue
// api.cue
package kube

deployment: api: #AppDeployment & {
  _name:  "api-server"
  _image: "myrepo/api:v2.0.0"
  _port:  3000
  spec: replicas: 3
  spec: template: spec: containers: [{
    resources: limits: {
      cpu:    "1"
      memory: "1Gi"
    }
  }]
}

service: api: #AppService & {
  _name: "api-server"
  _port: 3000
}
\`\`\`

\`\`\`cue
// worker.cue
package kube

deployment: worker: #AppDeployment & {
  _name:  "background-worker"
  _image: "myrepo/worker:v2.0.0"
  _port:  9090
  spec: replicas: 5
}
\`\`\`
        `,
        code: `// Generate all manifests:
// cue export ./... --out yaml > all-manifests.yaml

// Or generate per-service:
// cue export -e deployment.api --out yaml > api-deployment.yaml
// cue export -e service.api --out yaml > api-service.yaml

// The exported YAML for api-deployment.yaml:
// apiVersion: apps/v1
// kind: Deployment
// metadata:
//   name: api-server
//   labels:
//     app: api-server
//     app.kubernetes.io/name: api-server
//     app.kubernetes.io/managed-by: cue
// spec:
//   replicas: 3
//   selector:
//     matchLabels:
//       app: api-server
//   template:
//     metadata:
//       labels:
//         app: api-server
//     spec:
//       containers:
//         - name: api-server
//           image: myrepo/api:v2.0.0
//           ports:
//             - containerPort: 3000
//           resources:
//             requests:
//               cpu: 100m
//               memory: 128Mi
//             limits:
//               cpu: "1"
//               memory: 1Gi`,
      },
      {
        id: "k8s-policy",
        title: "Policy Enforcement",
        content: `
CUE can enforce **organization-wide policies** on all Kubernetes resources. This is like a lightweight Open Policy Agent (OPA) built into your config workflow.

### Example Policies
\`\`\`cue
package kube

// POLICY 1: Every Deployment must have resource limits
deployment: [Name=_]: spec: template: spec: containers: [...{
  resources: limits: {
    cpu:    string
    memory: string
  }
}]

// POLICY 2: No "latest" image tags allowed
deployment: [Name=_]: spec: template: spec: containers: [...{
  image: string & !~":latest$" & !~":[^:]*latest"
}]

// POLICY 3: Every resource must have standard labels
deployment: [Name=_]: metadata: labels: {
  "app.kubernetes.io/name":       string
  "app.kubernetes.io/managed-by": string
}

// POLICY 4: Production must have >= 2 replicas
deployment: [Name=_]: spec: replicas: int & >=2

// POLICY 5: All containers must have health probes
deployment: [Name=_]: spec: template: spec: containers: [...{
  livenessProbe: {...}
  readinessProbe: {...}
}]
\`\`\`

### Validate Against Policies
\`\`\`bash
# Check all manifests against org policies
cue vet -c ./policies/ ./manifests/

# This catches:
# ✗ Missing resource limits
# ✗ Using :latest image tags
# ✗ Missing required labels
# ✗ Too few replicas for prod
# ✗ Missing health probes
\`\`\`

### Why This Matters
| Approach | When Errors Caught | Feedback Speed |
|----------|-------------------|----------------|
| No validation | Runtime (Pod crash) | Minutes to hours |
| CI YAML lint | Merge time | Minutes |
| **CUE vet** | **Before commit** | **Seconds** |
| OPA/Gatekeeper | Admission time | Seconds (but late) |

CUE catches errors at the **earliest possible stage** — before code even leaves the developer's machine.
        `,
        diagram: `
graph LR
    subgraph "Policy Enforcement Flow"
    DEV["Developer writes CUE"] --> LOCAL["cue vet -c<br/>(local check)"]
    LOCAL -->|Pass| PUSH["git push"]
    LOCAL -->|Fail| FIX["Fix violations"]
    FIX --> LOCAL
    PUSH --> CI["CI Pipeline<br/>cue vet -c"]
    CI -->|Pass| BUILD["Build & Deploy"]
    CI -->|Fail| NOTIFY["Notify developer"]
    end
    
    style FIX fill:#fbbf24,stroke:#333
    style BUILD fill:#4ade80,stroke:#333
    style NOTIFY fill:#f87171,stroke:#333
        `,
      },
    ],
  },
  {
    id: "cue-cicd-advanced",
    title: "CI/CD & Advanced Patterns",
    description:
      "CUE in CI/CD pipelines, packages, modules, comprehensions, and real-world production workflows.",
    icon: "Zap",
    sections: [
      {
        id: "cicd-integration",
        title: "CUE in CI/CD Pipelines",
        content: `
CUE integrates seamlessly into CI/CD pipelines to **validate configs before deployment** and **generate environment-specific outputs**.

### GitHub Actions Example
\`\`\`yaml
# .github/workflows/validate-configs.yaml
name: Validate Configs
on:
  pull_request:
    paths:
      - 'configs/**'
      - '*.cue'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install CUE
        uses: cue-lang/setup-cue@v1
        with:
          version: 'latest'
      
      - name: Check formatting
        run: cue fmt --check .
      
      - name: Validate all configs
        run: cue vet -c ./...
      
      - name: Generate manifests
        run: |
          cue export ./k8s/ --out yaml > manifests.yaml
          echo "Generated manifests:"
          cat manifests.yaml
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: k8s-manifests
          path: manifests.yaml
\`\`\`

### GitLab CI Example
\`\`\`yaml
# .gitlab-ci.yml
stages:
  - validate
  - generate
  - deploy

validate-configs:
  stage: validate
  image: cuelang/cue:latest
  script:
    - cue fmt --check .
    - cue vet -c ./...
  rules:
    - changes:
        - "configs/**/*"
        - "*.cue"

generate-manifests:
  stage: generate
  image: cuelang/cue:latest
  script:
    - cue export ./k8s/ --out yaml > manifests.yaml
  artifacts:
    paths:
      - manifests.yaml

deploy:
  stage: deploy
  script:
    - kubectl apply -f manifests.yaml
  only:
    - main
\`\`\`
        `,
        diagram: `
sequenceDiagram
    participant Dev as Developer
    participant PR as Pull Request
    participant CI as CI Pipeline
    participant CUE as CUE Validator
    participant K8s as Kubernetes

    Dev->>PR: Push config changes
    PR->>CI: Trigger workflow
    CI->>CUE: cue fmt --check .
    CUE-->>CI: Formatting OK
    CI->>CUE: cue vet -c ./...
    CUE-->>CI: Validation passed
    CI->>CUE: cue export --out yaml
    CUE-->>CI: manifests.yaml generated
    CI->>K8s: kubectl apply -f manifests.yaml
    K8s-->>CI: Deployed ✓
        `,
      },
      {
        id: "packages-modules",
        title: "Packages & Modules",
        content: `
CUE's module system (inspired by Go) lets you organize large config projects and **share schemas across teams**.

### Module Initialization
\`\`\`bash
# Create a new CUE module
cue mod init github.com/myorg/platform-config

# This creates:
# cue.mod/
#   module.cue    ← module declaration
#   pkg/          ← external dependencies
\`\`\`

### Package Declaration
Every CUE file belongs to a package (declared at the top):
\`\`\`cue
package kube

// All files with "package kube" in the same directory
// are unified into a single package
\`\`\`

### Importing Packages
\`\`\`cue
package main

import (
  "github.com/myorg/platform-config/schemas"
  "github.com/myorg/platform-config/templates"
)

myDeploy: templates.#AppDeployment & {
  _name:  "my-service"
  _image: "myrepo/service:v1.0"
}
\`\`\`

### Project Layout for a Platform Team
\`\`\`
platform-config/
├── cue.mod/
│   └── module.cue
├── schemas/           ← Shared by all teams
│   ├── deployment.cue
│   ├── service.cue
│   └── ingress.cue
├── policies/          ← Org-wide policies
│   ├── security.cue
│   └── resources.cue
├── templates/         ← Reusable templates
│   ├── microservice.cue
│   └── cronjob.cue
└── teams/             ← Per-team configs
    ├── payments/
    │   ├── api.cue
    │   └── worker.cue
    └── search/
        ├── indexer.cue
        └── query.cue
\`\`\`

### Dependency Management
\`\`\`bash
# Add an external dependency
cue mod tidy

# Dependencies are stored in cue.mod/pkg/
# and can be versioned like Go modules
\`\`\`
        `,
      },
      {
        id: "comprehensions",
        title: "Comprehensions & Loops",
        content: `
CUE comprehensions let you **generate repetitive structures** programmatically — eliminating copy-paste across configs.

### List Comprehensions
\`\`\`cue
// Generate a list from another list
_names: ["api", "worker", "scheduler"]

containers: [ for name in _names {
  name:  name
  image: "myrepo/\\(name):latest"
  ports: [{containerPort: 8080}]
}]
\`\`\`

### Struct Comprehensions (Field Generation)
\`\`\`cue
// Generate struct fields from a list
_services: ["auth", "orders", "payments", "search"]

deployments: {
  for svc in _services {
    (svc): {
      apiVersion: "apps/v1"
      kind:       "Deployment"
      metadata: name: svc
      spec: {
        replicas: 2
        selector: matchLabels: app: svc
        template: {
          metadata: labels: app: svc
          spec: containers: [{
            name:  svc
            image: "myrepo/\\(svc):v1.0"
          }]
        }
      }
    }
  }
}
\`\`\`

### Conditional Comprehensions
\`\`\`cue
_envs: {
  dev:     {replicas: 1, debug: true}
  staging: {replicas: 2, debug: true}
  prod:    {replicas: 5, debug: false}
}

configs: {
  for envName, envConfig in _envs {
    (envName): {
      app: "my-service"
      replicas: envConfig.replicas
      
      // Conditionally add debug sidecar
      if envConfig.debug {
        containers: [{name: "debug-sidecar", image: "busybox"}]
      }
    }
  }
}
\`\`\`

### String Interpolation
CUE uses \`\\(expr)\` for string interpolation (not \`\\\${}\`):
\`\`\`cue
_version: "2.1.0"
_registry: "gcr.io/myproject"

image: "\\(_registry)/api:\\(_version)"
// Result: "gcr.io/myproject/api:2.1.0"
\`\`\`
        `,
        code: `// Real production example: Generate ConfigMaps for all environments
_environments: ["dev", "staging", "prod"]

_dbHosts: {
  dev:     "localhost:5432"
  staging: "db.staging.internal:5432"
  prod:    "db.prod.internal:5432"
}

_logLevels: {
  dev:     "debug"
  staging: "info"
  prod:    "warn"
}

configMaps: {
  for env in _environments {
    "app-config-\\(env)": {
      apiVersion: "v1"
      kind:       "ConfigMap"
      metadata: {
        name:      "app-config"
        namespace: env
        labels: {
          app:         "my-service"
          environment: env
        }
      }
      data: {
        DATABASE_URL: _dbHosts[env]
        LOG_LEVEL:    _logLevels[env]
        APP_ENV:      env
      }
    }
  }
}

// cue export -e configMaps --out yaml
// → Generates 3 ConfigMaps, one per environment`,
      },
      {
        id: "production-workflow",
        title: "Complete Production Workflow",
        content: `
Here is a **complete, real-world workflow** for managing production Kubernetes configs with CUE.

### The Workflow

**Step 1: Import existing YAML manifests**
\`\`\`bash
# One-time migration: import all existing K8s YAML
cue import ./legacy-manifests/*.yaml -f \\
  -l 'strings.ToLower(kind)' \\
  -l 'metadata.name' \\
  -p kube
\`\`\`

**Step 2: Define org-wide schemas and policies**
\`\`\`cue
// schemas/deployment.cue
package schemas

#Deployment: {
  apiVersion: "apps/v1"
  kind:       "Deployment"
  metadata: {
    name: string & =~"^[a-z][a-z0-9-]+$"
    labels: {
      "app.kubernetes.io/name":       string
      "app.kubernetes.io/managed-by": "cue"
    }
  }
  spec: {
    replicas: int & >=1 & <=100
    template: spec: containers: [...{
      image:     string & !~":latest$"
      resources: limits: {cpu: string, memory: string}
    }]
  }
}
\`\`\`

**Step 3: Create reusable templates**
\`\`\`cue
// templates/microservice.cue
package templates

import "github.com/myorg/platform/schemas"

#Microservice: {
  _name:     string
  _image:    string
  _port:     int | *8080
  _replicas: int | *2

  deployment: schemas.#Deployment & {
    metadata: name: _name
    metadata: labels: "app.kubernetes.io/name": _name
    spec: {
      replicas: _replicas
      selector: matchLabels: app: _name
      template: {
        metadata: labels: app: _name
        spec: containers: [{
          name:  _name
          image: _image
          ports: [{containerPort: _port}]
          resources: {
            requests: {cpu: "100m", memory: "128Mi"}
            limits:   {cpu: "500m", memory: "512Mi"}
          }
        }]
      }
    }
  }
}
\`\`\`

**Step 4: Service teams define their configs**
\`\`\`cue
// teams/payments/api.cue
package payments

import "github.com/myorg/platform/templates"

api: templates.#Microservice & {
  _name:     "payments-api"
  _image:    "myrepo/payments-api:v3.1.0"
  _port:     3000
  _replicas: 4
}
\`\`\`

**Step 5: Validate and deploy**
\`\`\`bash
# Local validation
cue vet -c ./...

# Generate YAML
cue export ./teams/payments/ -e api.deployment --out yaml \\
  > manifests/payments-api.yaml

# Deploy
kubectl apply -f manifests/payments-api.yaml
\`\`\`

### Summary: CUE vs Alternatives
| Tool | Type Safety | Validation | Templating | Learning Curve |
|------|------------|------------|------------|----------------|
| Raw YAML | None | None | None | Low |
| Helm | None | Lint only | Go templates | Medium |
| Kustomize | None | Limited | Overlays only | Medium |
| **CUE** | **Full** | **Built-in** | **First-class** | **Medium** |
| Jsonnet | Partial | External | Functions | High |
        `,
        diagram: `
graph TD
    subgraph "Production CUE Workflow"
    IMP["1. cue import<br/>Import existing YAML"] --> SCHEMA["2. Define schemas<br/>#35;Deployment, #35;Service"]
    SCHEMA --> TMPL["3. Build templates<br/>#35;Microservice"]
    TMPL --> SVC["4. Team configs<br/>api.cue, worker.cue"]
    SVC --> VET["5. cue vet -c<br/>Validate locally"]
    VET --> CI["6. CI validates<br/>on PR"]
    CI --> EXP["7. cue export<br/>Generate YAML"]
    EXP --> DEPLOY["8. kubectl apply<br/>Deploy to K8s"]
    end
    
    style IMP fill:#60a5fa,stroke:#333
    style DEPLOY fill:#4ade80,stroke:#333
        `,
      },
    ],
  },
];
