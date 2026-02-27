// ═══════════════════════════════════════════════════════════════
// OKD (OpenShift Community) — COMPLETE GUIDE (Beginner → Interview Ready)
// ═══════════════════════════════════════════════════════════════

export const topics = [
  {
    id: "okd-introduction",
    title: "Introduction to OKD",
    description:
      "What is OKD, how it relates to OpenShift, and why it matters.",
    icon: "BookOpen",
    sections: [
      {
        id: "what-is-okd",
        title: "What is OKD?",
        content: `
**OKD** is the **community distribution of Kubernetes** that powers Red Hat OpenShift. It's essentially the open-source upstream project of OpenShift Container Platform.

### 🤔 OKD vs OpenShift vs Kubernetes

| Feature | Kubernetes | OKD | OpenShift |
|---------|-----------|-----|-----------|
| **License** | Open Source | Open Source | Commercial |
| **Maintained By** | CNCF | Community | Red Hat |
| **Base Platform** | — | Kubernetes | OKD |
| **Web Console** | Dashboard (basic) | Full Console | Full Console + Support |
| **S2I (Source-to-Image)** | ❌ | ✅ | ✅ |
| **Built-in CI/CD** | ❌ | ✅ (Tekton) | ✅ (Tekton + Pipelines) |
| **OperatorHub** | ❌ | ✅ | ✅ |
| **Security** | Manual setup | SCCs built-in | SCCs + Compliance |

### 🏗️ Analogy
- **Kubernetes** = Linux kernel (the engine)
- **OKD** = Fedora (community distribution with extras)
- **OpenShift** = Red Hat Enterprise Linux (commercial, supported)

### Why Choose OKD?
1. **Developer Experience** — Built-in CI/CD, web console, S2I
2. **Security by Default** — Pods run as non-root, SCCs enforced
3. **Batteries Included** — Monitoring, logging, registry all built-in
4. **Free** — All the power of OpenShift without the price tag
5. **Learning OpenShift** — Skills transfer directly to enterprise OpenShift
        `,
        diagram: `
graph TD
    K8s["Kubernetes<br/>(Foundation)"] --> OKD["OKD<br/>(Community Edition)"]
    OKD --> OpenShift["OpenShift<br/>(Enterprise Edition)"]
    K8s --> Features["Core Orchestration"]
    OKD --> OKDFeatures["+ Web Console<br/>+ S2I<br/>+ Routes<br/>+ Built-in Registry"]
    OpenShift --> OSFeatures["+ Support<br/>+ Compliance<br/>+ Certified Operators"]
    style OKD fill:#e00,color:#fff
    style OpenShift fill:#c00,color:#fff
        `,
      },
      {
        id: "okd-architecture",
        title: "OKD Architecture",
        content: `
OKD extends Kubernetes with additional components:

### Control Plane (same as K8s, plus):
| Component | Description |
|-----------|-------------|
| **API Server** | Extended with OKD APIs (Routes, BuildConfigs) |
| **OAuth Server** | Built-in authentication (LDAP, GitHub, Google) |
| **Web Console** | Rich developer and admin UI |
| **Image Registry** | Built-in container image registry |

### Worker Nodes (same as K8s, plus):
| Component | Description |
|-----------|-------------|
| **CRI-O** | Default container runtime (not Docker) |
| **Machine Config Operator** | Manages node OS configuration |
| **OVN-Kubernetes** | Default networking (replaces kube-proxy) |

### OKD-Specific Concepts:
1. **Projects** = Namespaces with extra features (quotas, roles auto-created)
2. **Routes** = Like Ingress but with built-in TLS, A/B testing, canary
3. **BuildConfigs** = Build container images directly in the cluster
4. **ImageStreams** = Track and manage container images across environments
5. **Templates** = Pre-defined app deployments (click-to-deploy)

### 🎯 Interview Tip
> "OKD is to OpenShift what Fedora is to RHEL — the free, community-driven upstream project with the same core technology."
        `,
        diagram: `
graph TD
    subgraph OKD_Cluster["OKD Cluster"]
        subgraph Control["Control Plane"]
            API["API Server"]
            OAuth["OAuth Server"]
            Console["Web Console"]
            Registry["Image Registry"]
            ETCD["etcd"]
        end
        subgraph Workers["Worker Nodes"]
            N1["Node 1<br/>(CRI-O)"]
            N2["Node 2<br/>(CRI-O)"]
        end
        API --> N1
        API --> N2
    end
    Dev["Developer"] --> Console
    Dev --> API
    style Control fill:#c00,color:#fff
        `,
      },
    ],
  },
  {
    id: "okd-developer",
    title: "Developer Experience",
    description:
      "Routes, BuildConfigs, S2I, ImageStreams, and Templates.",
    icon: "Code",
    sections: [
      {
        id: "routes",
        title: "Routes — The OKD Way to Expose Apps",
        content: `
**Routes** are OKD's alternative to Kubernetes Ingress. They're more powerful and easier to use.

### Routes vs Ingress:
| Feature | K8s Ingress | OKD Route |
|---------|-------------|-----------|
| TLS Termination | Needs cert-manager | Built-in |
| A/B Testing | Manual | Built-in weight splitting |
| Canary Deployments | Complex | Native support |
| Wildcard Domains | Varies by controller | Built-in |
| Web Console UI | No | Yes |

### Route Types:
1. **Edge** — TLS terminated at the router (most common)
2. **Passthrough** — TLS passed directly to the Pod
3. **Re-encrypt** — TLS terminated at router, re-encrypted to Pod

### Traffic Splitting (Blue/Green & Canary):
You can split traffic between multiple services with weighted routing:
- 90% traffic → \`v1\` (stable)
- 10% traffic → \`v2\` (canary)
        `,
        code: `# Basic Route — expose a service externally
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: my-app
spec:
  host: myapp.apps.okd.example.com
  to:
    kind: Service
    name: my-app-service
    weight: 100
  port:
    targetPort: 8080
  tls:
    termination: edge
    insecureEdgeTerminationPolicy: Redirect

---
# Canary Route — split traffic 90/10
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: my-app-canary
spec:
  host: myapp.apps.okd.example.com
  to:
    kind: Service
    name: my-app-v1
    weight: 90
  alternateBackends:
    - kind: Service
      name: my-app-v2
      weight: 10
  tls:
    termination: edge`,
      },
      {
        id: "s2i-builds",
        title: "Source-to-Image (S2I)",
        content: `
**S2I** lets you build container images directly from source code — no Dockerfile needed!

### How S2I Works:
1. You push code to a Git repo
2. OKD pulls the code
3. S2I combines your code with a **builder image** (e.g., Node.js, Python, Go)
4. The result is a runnable container image
5. The image is pushed to the internal registry
6. A new Deployment is triggered

### 🏗️ Analogy:
S2I is like ordering a custom pizza:
- You provide the **toppings** (your source code)
- The shop provides the **dough and oven** (builder image)
- You get a **ready-to-eat pizza** (container image)

### Build Strategies in OKD:
| Strategy | Description |
|----------|-------------|
| **S2I** | Code + Builder Image → App Image |
| **Docker** | Uses a Dockerfile |
| **Pipeline** | Uses Tekton/Jenkins for CI/CD |
| **Custom** | Your own build logic |

### Supported Languages (Builder Images):
Node.js, Python, Ruby, Java, Go, .NET, PHP, Perl
        `,
        code: `# BuildConfig — Build from GitHub repo using S2I
apiVersion: build.openshift.io/v1
kind: BuildConfig
metadata:
  name: my-node-app
spec:
  source:
    type: Git
    git:
      uri: "https://github.com/user/my-node-app.git"
      ref: "main"
  strategy:
    type: Source
    sourceStrategy:
      from:
        kind: ImageStreamTag
        name: "nodejs:18-ubi8"
        namespace: openshift
  output:
    to:
      kind: ImageStreamTag
      name: "my-node-app:latest"
  triggers:
    - type: GitHub
      github:
        secret: "my-webhook-secret"
    - type: ConfigChange    # Rebuild on config change
    - type: ImageChange     # Rebuild when base image updates`,
        diagram: `
graph LR
    Git["Git Repo<br/>(Source Code)"] --> S2I["S2I Builder"]
    Builder["Builder Image<br/>(Node.js 18)"] --> S2I
    S2I --> Image["App Image<br/>(my-node-app:latest)"]
    Image --> Registry["Internal Registry"]
    Registry --> Deploy["Deployment"]
    style S2I fill:#e00,color:#fff
        `,
      },
      {
        id: "imagestreams",
        title: "ImageStreams — Smart Image Management",
        content: `
**ImageStreams** abstract container image references. Instead of hardcoding \`docker.io/nginx:1.25\`, you reference an ImageStream tag.

### Why ImageStreams?
1. **Automatic Updates** — When the base image changes, all dependent builds/deployments are automatically triggered
2. **Environment Promotion** — Move images from dev → staging → prod via tagging
3. **Image Policies** — Restrict which images can be used
4. **History** — Track all versions of an image

### 🏗️ Analogy:
An ImageStream is like a **playlist** in Spotify:
- The playlist name stays the same (\`my-app:latest\`)
- You can add new songs (image versions) to it
- All listeners (deployments) automatically get the update

### Common Operations:
\`\`\`bash
oc get imagestreams           # List all ImageStreams
oc tag myapp:v1 myapp:prod    # Promote v1 to production
oc import-image nginx --from=docker.io/nginx --confirm
\`\`\`
        `,
        code: `# ImageStream definition
apiVersion: image.openshift.io/v1
kind: ImageStream
metadata:
  name: my-app
spec:
  lookupPolicy:
    local: true       # Allow local lookups by short name
  tags:
    - name: latest
      from:
        kind: DockerImage
        name: docker.io/myuser/myapp:latest
      importPolicy:
        scheduled: true   # Check for updates every 15 min`,
      },
    ],
  },
  {
    id: "okd-operations",
    title: "Operations & Administration",
    description:
      "OperatorHub, monitoring, CLI tools, and cluster management.",
    icon: "Server",
    sections: [
      {
        id: "operators",
        title: "Operators & OperatorHub",
        content: `
**Operators** are the Kubernetes-native way to manage complex applications. OKD includes **OperatorHub** — a marketplace of pre-built Operators.

### What Operators Do:
- Install and configure complex apps (databases, message queues)
- Handle day-2 operations (backups, upgrades, scaling)
- Automate operational knowledge into code

### Built-in Operators in OKD:
| Operator | Manages |
|----------|---------|
| **Cluster Version** | OKD upgrades |
| **Machine Config** | Node OS configuration |
| **Monitoring** | Prometheus + Grafana |
| **Logging** | EFK (Elasticsearch, Fluentd, Kibana) |
| **DNS** | CoreDNS |
| **Ingress** | HAProxy Router |

### OperatorHub Categories:
1. **Red Hat Operators** — Certified by Red Hat
2. **Certified Operators** — ISV certified
3. **Community Operators** — Community maintained
4. **Custom Operators** — Your own operators

### Operator Maturity Levels:
\`\`\`
Level 1: Basic Install
Level 2: Seamless Upgrades
Level 3: Full Lifecycle (Backup/Restore)
Level 4: Deep Insights (Metrics/Alerts)
Level 5: Auto Pilot (Auto-scaling, Auto-tuning)
\`\`\`
        `,
      },
      {
        id: "oc-cli",
        title: "The oc CLI — Your Swiss Army Knife",
        content: `
**\`oc\`** is the OKD command-line tool. It extends \`kubectl\` with OKD-specific features.

### Key Differences from kubectl:
\`\`\`bash
# Login (OKD has built-in auth)
oc login https://api.okd.example.com
oc login -u admin -p password

# Projects (enhanced namespaces)
oc new-project my-app
oc project my-app
oc projects       # List all projects

# Build & Deploy from source
oc new-app https://github.com/user/repo.git
oc new-app nodejs~https://github.com/user/node-app.git
oc new-app mysql MYSQL_ROOT_PASSWORD=secret

# Builds
oc start-build my-app
oc logs build/my-app-1
oc cancel-build my-app-1

# Routes
oc expose service my-app    # Auto-create a Route
oc get routes

# Debugging
oc debug deployment/my-app   # Start debug shell
oc rsh pod/my-app-abc123     # Remote shell into pod
oc port-forward pod/my-app-abc123 8080:8080
\`\`\`

### Pro Tips:
- \`oc new-app\` is incredibly powerful — it auto-detects language, creates BuildConfig, Deployment, Service
- \`oc debug\` creates a debugging copy of a Pod with a shell
- All \`kubectl\` commands work with \`oc\` too
        `,
      },
      {
        id: "okd-monitoring",
        title: "Built-in Monitoring & Logging",
        content: `
OKD comes with a **full monitoring stack** pre-installed — no setup required.

### Monitoring Stack:
| Component | Role |
|-----------|------|
| **Prometheus** | Metrics collection |
| **Alertmanager** | Alert routing (Slack, PagerDuty) |
| **Grafana** | Dashboards (read-only in OKD 4.x) |
| **Thanos** | Long-term metrics storage |

### Logging Stack (EFK):
| Component | Role |
|-----------|------|
| **Elasticsearch** | Log storage and indexing |
| **Fluentd** | Log collection from all nodes |
| **Kibana** | Log visualization and search |

### Accessing Monitoring:
1. Open the OKD Web Console
2. Navigate to **Observe** → **Metrics** (PromQL queries)
3. Navigate to **Observe** → **Dashboards** (Grafana)
4. Navigate to **Observe** → **Alerting** (AlertManager)

### Custom Metrics:
You can expose custom Prometheus metrics from your app:
\`\`\`bash
# ServiceMonitor tells Prometheus to scrape your app
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: my-app-metrics
spec:
  selector:
    matchLabels:
      app: my-app
  endpoints:
    - port: metrics
      interval: 30s
\`\`\`
        `,
      },
    ],
  },
  {
    id: "okd-security",
    title: "Security in OKD",
    description:
      "SCCs, OAuth, RBAC, and security differences from vanilla Kubernetes.",
    icon: "Lock",
    sections: [
      {
        id: "sccs",
        title: "Security Context Constraints (SCCs)",
        content: `
**SCCs** are OKD's enhanced version of Kubernetes Pod Security Policies. They control what a Pod can and cannot do.

### Default SCCs:
| SCC | Description |
|-----|-------------|
| **restricted** | Default for all Pods. No root, no host access |
| **anyuid** | Allows running as any user (including root) |
| **privileged** | Full access — only for trusted workloads |
| **hostnetwork** | Access to host network namespace |
| **hostaccess** | Access to host filesystem and network |

### Key Restrictions in \`restricted\` SCC:
- ❌ Cannot run as root
- ❌ Cannot use host network/ports/PID
- ❌ Cannot mount host directories
- ❌ Cannot use privilege escalation
- ✅ Must use a random UID (from a range assigned to the project)

### OKD's "Security by Default" Philosophy:
> In vanilla Kubernetes, pods run as root by default. In OKD, they're restricted by default. This is a KEY difference.

### Common Issue for Beginners:
Many Docker images (nginx, mysql) expect to run as root. OKD blocks this! Solutions:
1. Use OKD-compatible images (ubi-based)
2. Grant \`anyuid\` SCC (not recommended for production)
3. Modify the image to work with random UIDs

\`\`\`bash
# Check which SCC a pod is using
oc get pod my-pod -o yaml | grep scc

# Grant anyuid to a service account (use sparingly!)
oc adm policy add-scc-to-user anyuid -z my-service-account
\`\`\`
        `,
      },
      {
        id: "okd-oauth",
        title: "OAuth & Authentication",
        content: `
OKD has a **built-in OAuth server** — no need to set up external authentication.

### Supported Identity Providers:
| Provider | Use Case |
|----------|----------|
| **HTPasswd** | Simple file-based (development) |
| **LDAP** | Enterprise directory (Active Directory) |
| **GitHub/GitLab** | Developer teams |
| **Google** | GSuite organizations |
| **OpenID Connect** | Any OIDC provider (Keycloak, Auth0) |
| **Keystone** | OpenStack environments |

### How Auth Works in OKD:
1. User runs \`oc login\`
2. OKD redirects to OAuth server
3. OAuth validates against identity provider (LDAP, GitHub, etc.)
4. OAuth returns a token
5. Token is used for all subsequent API calls
6. RBAC determines what the user can do

### 🎯 Interview Tip
> "OKD provides authentication (who are you) via OAuth and authorization (what can you do) via RBAC. Vanilla K8s has RBAC but no built-in authentication — you need to set up your own identity provider."
        `,
        code: `# HTPasswd Identity Provider (for development)
apiVersion: config.openshift.io/v1
kind: OAuth
metadata:
  name: cluster
spec:
  identityProviders:
    - name: htpasswd_provider
      mappingMethod: claim
      type: HTPasswd
      htpasswd:
        fileData:
          name: htpass-secret

---
# Create htpasswd secret
# First: htpasswd -c -B -b users.htpasswd admin password123
# Then:
apiVersion: v1
kind: Secret
metadata:
  name: htpass-secret
  namespace: openshift-config
type: Opaque
data:
  htpasswd: <base64-encoded-htpasswd-file>`,
      },
      {
        id: "okd-interview",
        title: "OKD Interview Questions",
        content: `
### 1. What is OKD and how does it differ from vanilla Kubernetes?
> OKD is the community distribution of Kubernetes that powers OpenShift. It adds developer experience features (S2I, Routes, Web Console), enhanced security (SCCs), built-in monitoring, and an integrated image registry.

### 2. What are SCCs and why are they important?
> Security Context Constraints control Pod privileges. Unlike K8s where pods run as root by default, OKD enforces the \`restricted\` SCC — preventing root access, host mounts, and privilege escalation.

### 3. How is a Route different from an Ingress?
> Routes are OKD-native and offer built-in TLS, traffic splitting for canary/blue-green deployments, and web console management. Ingress requires an external controller and manual cert management.

### 4. What is Source-to-Image (S2I)?
> S2I builds container images directly from source code without a Dockerfile. It combines user code with a builder image to produce a runnable container image.

### 5. What's the difference between a Project and a Namespace?
> A Project IS a namespace with additional features: default RBAC roles, resource quotas, and limit ranges are auto-created. Every namespace in OKD is a project.

### 6. How does OKD handle authentication?
> OKD has a built-in OAuth server that supports multiple identity providers (LDAP, GitHub, OIDC, HTPasswd). Vanilla K8s has no built-in authentication mechanism.

### 7. What is an ImageStream?
> An ImageStream is an abstraction over container images that enables automatic deployment triggers when images change, environment promotion via tagging, and image policy enforcement.
        `,
      },
    ],
  },
];
