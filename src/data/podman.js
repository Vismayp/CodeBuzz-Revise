// ═══════════════════════════════════════════════════════════════
// PODMAN — COMPLETE GUIDE (Beginner → Interview Ready)
// ═══════════════════════════════════════════════════════════════

export const topics = [
  {
    id: "podman-introduction",
    title: "Introduction to Podman",
    description:
      "What is Podman, how it compares to Docker, and why it matters.",
    icon: "BookOpen",
    sections: [
      {
        id: "what-is-podman",
        title: "What is Podman?",
        content: `
**Podman** (Pod Manager) is a **daemonless, rootless container engine** developed by Red Hat. It's a drop-in replacement for Docker that doesn't require a background daemon.

### 🤔 The Docker Problem
Docker runs a **central daemon** (\`dockerd\`) as root:
- Single point of failure — daemon crashes = all containers die
- Root access — security vulnerability
- Requires a separate service running 24/7

### Podman's Solution:
- **No daemon** — Each container is a child process
- **Rootless by default** — Run containers without root privileges
- **Docker-compatible** — Same CLI commands (\`podman run\` = \`docker run\`)
- **Pod-native** — First-class support for Pods (like Kubernetes)
- **Systemd integration** — Manage containers like Linux services

### 🏗️ Analogy
- **Docker** = A taxi company with a central dispatcher (daemon). If the dispatcher goes down, no taxis run.
- **Podman** = Uber/ride-sharing. Each driver is independent. No central dispatcher needed.

### Key Benefits:
1. **Security** — No root daemon = smaller attack surface
2. **Reliability** — No single point of failure
3. **Kubernetes-ready** — Generates K8s YAML from pods
4. **OCI-compliant** — Uses standard container formats
5. **Backwards-compatible** — \`alias docker=podman\` works!
        `,
        diagram: `
graph TD
    subgraph Docker_Architecture["Docker Architecture"]
        DC["Docker Client"] --> DD["Docker Daemon<br/>(root process)"]
        DD --> C1["Container 1"]
        DD --> C2["Container 2"]
        DD --> C3["Container 3"]
    end

    subgraph Podman_Architecture["Podman Architecture"]
        PC["Podman CLI"] --> CP1["Container 1<br/>(child process)"]
        PC --> CP2["Container 2<br/>(child process)"]
        PC --> CP3["Container 3<br/>(child process)"]
    end

    style DD fill:#f96,stroke:#333,stroke-width:2px
    style PC fill:#892ca0,color:#fff
        `,
      },
      {
        id: "docker-vs-podman",
        title: "Docker vs Podman — Complete Comparison",
        content: `
### Side-by-Side Comparison:

| Feature | Docker | Podman |
|---------|--------|--------|
| **Daemon** | Requires \`dockerd\` | No daemon (fork/exec) |
| **Root Required** | Yes (by default) | No (rootless default) |
| **Pod Support** | ❌ | ✅ Native pods |
| **Systemd** | Limited | Full integration |
| **Docker Compose** | ✅ Native | ✅ via \`podman-compose\` |
| **Kubernetes YAML** | ❌ | ✅ \`podman generate kube\` |
| **Image Format** | OCI + Docker | OCI + Docker |
| **Swarm** | ✅ | ❌ (use K8s instead) |
| **Build** | \`docker build\` | \`podman build\` (uses Buildah) |
| **CLI** | \`docker\` | \`podman\` (identical syntax) |

### When to Use Docker:
- Docker Swarm orchestration
- Docker Desktop on Mac/Windows
- Legacy toolchains

### When to Use Podman:
- Security-sensitive environments
- Kubernetes-focused workflows
- RHEL/CentOS/Fedora systems
- CI/CD pipelines (no daemon needed)
- Running containers as systemd services

### 🎯 Interview Tip
> "The biggest difference is architecture: Docker uses a client-server model with a root daemon, while Podman uses a fork-exec model where each container is a direct child process. This makes Podman more secure and eliminates the single point of failure."
        `,
      },
      {
        id: "podman-installation",
        title: "Installation & Setup",
        content: `
### Installing Podman:

**Fedora/RHEL/CentOS:**
\`\`\`bash
sudo dnf install podman
\`\`\`

**Ubuntu/Debian:**
\`\`\`bash
sudo apt-get install podman
\`\`\`

**macOS (via Homebrew):**
\`\`\`bash
brew install podman
podman machine init    # Creates a Linux VM
podman machine start   # Starts the VM
\`\`\`

**Windows:**
\`\`\`bash
winget install RedHat.Podman
podman machine init
podman machine start
\`\`\`

### Verify Installation:
\`\`\`bash
podman --version
podman info
podman run hello-world   # Test with hello-world container
\`\`\`

### Docker Compatibility:
\`\`\`bash
# Make podman act as docker (optional)
alias docker=podman

# Or install podman-docker package
sudo dnf install podman-docker   # Fedora/RHEL
\`\`\`
        `,
      },
    ],
  },
  {
    id: "podman-core-commands",
    title: "Core Commands",
    description:
      "Building, running, and managing containers with Podman.",
    icon: "Terminal",
    sections: [
      {
        id: "container-lifecycle",
        title: "Container Lifecycle",
        content: `
### Creating and Running Containers:

\`\`\`bash
# Run a container (same as docker run)
podman run -d --name webserver -p 8080:80 nginx

# Run interactively
podman run -it --rm ubuntu bash

# Run with environment variables
podman run -d --name db \\
  -e POSTGRES_PASSWORD=secret \\
  -e POSTGRES_DB=myapp \\
  -v pgdata:/var/lib/postgresql/data \\
  postgres:16
\`\`\`

### Managing Containers:
\`\`\`bash
podman ps                    # List running containers
podman ps -a                 # List all containers (including stopped)
podman stop webserver        # Stop a container
podman start webserver       # Start a stopped container
podman restart webserver     # Restart
podman rm webserver          # Remove (must be stopped first)
podman rm -f webserver       # Force remove (even if running)
podman logs webserver        # View logs
podman logs -f webserver     # Follow logs (live)
podman exec -it webserver bash  # Execute command in running container
podman inspect webserver     # Detailed container info (JSON)
podman top webserver         # List processes in container
podman stats                 # Live resource usage
\`\`\`

### 🎯 Key Flags:
| Flag | Description |
|------|-------------|
| \`-d\` | Detached (background) |
| \`-it\` | Interactive + TTY (for shell access) |
| \`--rm\` | Auto-remove when container stops |
| \`-p 8080:80\` | Map host:container port |
| \`-v data:/app\` | Mount a volume |
| \`-e KEY=VAL\` | Environment variable |
| \`--name\` | Give container a name |
| \`--network\` | Connect to a network |
        `,
      },
      {
        id: "building-images",
        title: "Building Container Images",
        content: `
Podman uses **Buildah** under the hood for building images. The syntax is identical to \`docker build\`.

### Using a Containerfile (= Dockerfile):
\`\`\`bash
podman build -t myapp:v1 .
podman build -t myapp:v1 -f Containerfile.prod .
\`\`\`

### Multi-stage Build Example:
\`\`\`dockerfile
# Stage 1: Build
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
USER 1001          # Non-root!
CMD ["node", "dist/server.js"]
\`\`\`

### Image Management:
\`\`\`bash
podman images                 # List local images
podman pull nginx:latest      # Pull from registry
podman push myapp:v1 docker.io/user/myapp:v1
podman tag myapp:v1 myapp:latest
podman rmi myapp:v1           # Remove image
podman image prune            # Remove dangling images
podman image prune -a         # Remove all unused images
\`\`\`

### 🏗️ Best Practices for Containerfiles:
1. Use **multi-stage builds** to reduce image size
2. Run as **non-root user** (\`USER 1001\`)
3. Use **specific tags** (not \`:latest\`)
4. Order layers for **cache efficiency** (dependencies first, code last)
5. Use \`.containerignore\` / \`.dockerignore\` to exclude files
        `,
        code: `# Containerfile for a Go application
FROM golang:1.22 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o server .

FROM gcr.io/distroless/static-debian12
COPY --from=builder /app/server /server
USER nonroot:nonroot
EXPOSE 8080
ENTRYPOINT ["/server"]`,
      },
    ],
  },
  {
    id: "podman-rootless",
    title: "Rootless Containers",
    description:
      "Security model, user namespaces, and running without root.",
    icon: "ShieldCheck",
    sections: [
      {
        id: "rootless-explained",
        title: "Understanding Rootless Containers",
        content: `
**Rootless containers** run entirely in **user space** without any root privileges. This is Podman's killer feature.

### How It Works:
1. **User Namespaces** — The container thinks it's running as root (UID 0), but on the host it's mapped to your user (UID 1000)
2. **No Daemon** — No root process running in the background
3. **File Ownership** — Files created in the container are owned by your user on the host

### Security Benefits:
| Threat | Docker (root daemon) | Podman (rootless) |
|--------|---------------------|-------------------|
| Container escape | Root on host 💀 | Regular user only ✅ |
| Daemon compromise | All containers affected 💀 | No daemon to attack ✅ |
| Privilege escalation | Possible via daemon 💀 | Blocked by kernel ✅ |
| Resource theft | Daemon has full access 💀 | Limited to user quotas ✅ |

### Limitations of Rootless:
- Cannot bind to ports below 1024 (use port mapping: \`-p 8080:80\`)
- Limited network capabilities (no bridge networks by default, uses \`slirp4netns\` or \`pasta\`)
- Cannot access certain host devices
- Some images that require root won't work (e.g., default nginx)

### Making Images Rootless-Compatible:
\`\`\`dockerfile
# Bad: Expects root
FROM nginx
# Tries to bind port 80 and write to /var/cache/nginx as root

# Good: Works rootless
FROM nginx
RUN sed -i 's/listen 80;/listen 8080;/' /etc/nginx/conf.d/default.conf \\
    && chown -R 1001:0 /var/cache/nginx /var/log/nginx /etc/nginx/conf.d
USER 1001
EXPOSE 8080
\`\`\`
        `,
        diagram: `
graph TD
    subgraph Host_OS["Host OS"]
        subgraph UserSpace["User Space (UID 1000)"]
            Podman["Podman Process"]
            subgraph Container["Container (User Namespace)"]
                Root["Root (UID 0)<br/>→ mapped to UID 1000 on host"]
                App["Application"]
            end
            Podman --> Container
        end
        Kernel["Linux Kernel"]
        UserSpace --> Kernel
    end
    style Container fill:#892ca0,color:#fff
        `,
      },
      {
        id: "user-namespaces",
        title: "User Namespaces Deep Dive",
        content: `
### What are User Namespaces?
A Linux kernel feature that maps UIDs inside a container to different UIDs on the host.

### UID Mapping:
\`\`\`
Container UID 0 (root)  → Host UID 1000 (your user)
Container UID 1         → Host UID 100001
Container UID 2         → Host UID 100002
...
Container UID 65535     → Host UID 165535
\`\`\`

### Checking Your Mapping:
\`\`\`bash
# View your subordinate UID/GID ranges
cat /etc/subuid
# Output: vismay:100000:65536

cat /etc/subgid
# Output: vismay:100000:65536

# This means user "vismay" can use UIDs 100000-165535
# for rootless containers
\`\`\`

### Why This Matters:
Even if a container process "escapes", it's running as an unprivileged user on the host. Container root ≠ host root.

### 🎯 Interview Tip:
> "Rootless containers use Linux user namespaces to remap container UIDs. Root inside the container is actually a regular user on the host, providing an additional security layer that Docker's default root daemon doesn't offer."
        `,
      },
    ],
  },
  {
    id: "podman-pods",
    title: "Pods in Podman",
    description:
      "Multi-container pods, Kubernetes YAML generation, and pod management.",
    icon: "Box",
    sections: [
      {
        id: "podman-pods-intro",
        title: "Pods — Podman's Superpower",
        content: `
Unlike Docker, Podman has **native Pod support** — just like Kubernetes!

### What is a Podman Pod?
A group of containers that share:
- The same **network namespace** (same IP, communicating via localhost)
- The same **PID namespace** (optional)
- The same **lifecycle** (start/stop together)

### 🏗️ Analogy:
A Pod is like a **single apartment** (shared address):
- Container 1 = Living room (web server)
- Container 2 = Kitchen (database)
- They share the same address, same doorbell, same wifi

### Pod Lifecycle:
\`\`\`bash
# Create a pod
podman pod create --name my-pod -p 8080:80

# Add containers to the pod
podman run -d --pod my-pod --name web nginx
podman run -d --pod my-pod --name db redis

# Both containers share the same network!
# nginx can reach redis at localhost:6379

# Manage the pod
podman pod list
podman pod stop my-pod
podman pod start my-pod
podman pod rm my-pod
\`\`\`

### Why Use Pods?
1. **Local Kubernetes development** — Test multi-container setups locally
2. **Sidecar pattern** — Log collector alongside app
3. **Init containers** — Setup tasks before main app starts
4. **K8s YAML generation** — Export pods to Kubernetes YAML
        `,
        code: `# Create a complete pod with web + database
podman pod create --name webapp-pod -p 8080:3000 -p 5432:5432

# Add Node.js app
podman run -d --pod webapp-pod \\
  --name app \\
  -e DATABASE_URL=postgresql://admin:secret@localhost:5432/mydb \\
  myapp:latest

# Add PostgreSQL database
podman run -d --pod webapp-pod \\
  --name db \\
  -e POSTGRES_USER=admin \\
  -e POSTGRES_PASSWORD=secret \\
  -e POSTGRES_DB=mydb \\
  -v pgdata:/var/lib/postgresql/data \\
  postgres:16

# Both containers communicate via localhost!
# app reaches db at localhost:5432`,
        diagram: `
graph TD
    subgraph Pod["Podman Pod (shared network)"]
        Infra["Infra Container<br/>(network setup)"]
        App["App Container<br/>(Node.js :3000)"]
        DB["DB Container<br/>(Postgres :5432)"]
        App ---|"localhost:5432"| DB
    end
    Host["Host :8080"] --> Pod
    style Pod fill:#892ca0,color:#fff
        `,
      },
      {
        id: "generate-kube-yaml",
        title: "Generate Kubernetes YAML from Pods",
        content: `
One of Podman's most powerful features: **generate Kubernetes YAML** from running pods!

### Workflow: Local → Kubernetes
1. Develop and test with Podman pods locally
2. Generate K8s YAML when ready
3. Deploy to Kubernetes cluster

### Commands:
\`\`\`bash
# Generate Kubernetes YAML from a running pod
podman generate kube webapp-pod > k8s-deployment.yaml

# Play a Kubernetes YAML file locally (like kubectl apply)
podman play kube k8s-deployment.yaml

# Stop and clean up
podman play kube --down k8s-deployment.yaml
\`\`\`

### Generated YAML Example:
The generated YAML includes:
- Pod definition with all containers
- Volume definitions
- Port mappings
- Environment variables
- Resource limits (if set)

### 🎯 Interview Tip
> "Podman bridges local development and Kubernetes deployment. You can develop with Podman pods locally, generate K8s YAML with \`podman generate kube\`, and deploy directly to a cluster. Docker has no equivalent workflow."
        `,
        code: `# Generated YAML from: podman generate kube webapp-pod
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: webapp-pod
  name: webapp-pod
spec:
  containers:
    - name: app
      image: myapp:latest
      ports:
        - containerPort: 3000
          hostPort: 8080
      env:
        - name: DATABASE_URL
          value: "postgresql://admin:secret@localhost:5432/mydb"
    - name: db
      image: docker.io/library/postgres:16
      env:
        - name: POSTGRES_USER
          value: admin
        - name: POSTGRES_PASSWORD
          value: secret
        - name: POSTGRES_DB
          value: mydb
      volumeMounts:
        - mountPath: /var/lib/postgresql/data
          name: pgdata
  volumes:
    - name: pgdata
      persistentVolumeClaim:
        claimName: pgdata`,
      },
    ],
  },
  {
    id: "podman-networking",
    title: "Networking & Compose",
    description:
      "podman-compose, CNI/netavark, networks, and port mapping.",
    icon: "Network",
    sections: [
      {
        id: "networking",
        title: "Podman Networking",
        content: `
### Network Backends:
| Backend | Description |
|---------|-------------|
| **Netavark** (default, Podman 4+) | Rust-based, fast, modern |
| **CNI** (legacy) | Container Networking Interface plugins |
| **slirp4netns** | Rootless userspace networking |
| **pasta** | Improved rootless networking (Podman 5+) |

### Network Types:
\`\`\`bash
# Create a custom network
podman network create my-network

# Run containers on the network
podman run -d --name web --network my-network nginx
podman run -d --name api --network my-network myapi

# Containers can reach each other by NAME
# From api container: curl http://web:80

# List networks
podman network ls

# Inspect a network
podman network inspect my-network

# Remove a network
podman network rm my-network
\`\`\`

### DNS Resolution:
Containers on the same custom network can resolve each other by **container name** — just like Docker.

### Port Mapping:
\`\`\`bash
# Single port
podman run -p 8080:80 nginx

# Multiple ports
podman run -p 8080:80 -p 8443:443 nginx

# Random host port
podman run -p 80 nginx    # Assigns random host port

# Bind to specific IP
podman run -p 127.0.0.1:8080:80 nginx
\`\`\`
        `,
      },
      {
        id: "podman-compose",
        title: "Podman Compose",
        content: `
**podman-compose** is a Docker Compose-compatible tool for Podman. It reads standard \`docker-compose.yml\` files.

### Installation:
\`\`\`bash
pip install podman-compose
# OR
sudo dnf install podman-compose    # Fedora
\`\`\`

### Usage:
\`\`\`bash
podman-compose up -d
podman-compose down
podman-compose logs -f
podman-compose ps
podman-compose exec web bash
\`\`\`

### Alternative: Podman 5+ with \`podman compose\`:
Podman 5+ has a built-in \`compose\` subcommand that uses \`docker-compose\` syntax natively:
\`\`\`bash
podman compose up -d
podman compose down
\`\`\`
        `,
        code: `# docker-compose.yml (works with both docker and podman!)
version: "3.9"
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://admin:secret@db:5432/myapp
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache
    restart: unless-stopped

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:`,
      },
    ],
  },
  {
    id: "podman-production",
    title: "Production & Systemd",
    description:
      "Systemd integration, Quadlet, auto-updates, and production best practices.",
    icon: "Server",
    sections: [
      {
        id: "systemd-integration",
        title: "Systemd Integration — Containers as Services",
        content: `
Podman integrates with **systemd** to manage containers like any other Linux service.

### Why Systemd + Podman?
- **Auto-start on boot** — Containers start when the server boots
- **Auto-restart** — Containers restart if they crash
- **Standard management** — Use familiar \`systemctl\` commands
- **Logging** — Logs go to \`journalctl\`

### Generating Systemd Units:
\`\`\`bash
# Create a container first
podman create --name webserver -p 8080:80 nginx

# Generate a systemd unit file
podman generate systemd --new --name webserver > \\
  ~/.config/systemd/user/container-webserver.service

# Enable and start
systemctl --user daemon-reload
systemctl --user enable --now container-webserver.service

# Standard systemd management
systemctl --user status container-webserver
systemctl --user stop container-webserver
systemctl --user restart container-webserver
journalctl --user -u container-webserver    # View logs
\`\`\`

### Key Flags:
- \`--new\`: Creates a fresh container each time (recommended)
- \`--name\`: Uses the container name
- \`--restart-policy=always\`: Auto-restart on failure
        `,
      },
      {
        id: "quadlet",
        title: "Quadlet — The Modern Way (Podman 4.4+)",
        content: `
**Quadlet** is the recommended way to run containers as systemd services in modern Podman. Instead of generating unit files, you write simple \`.container\` files.

### How Quadlet Works:
1. Write a \`.container\` file in \`~/.config/containers/systemd/\`
2. Run \`systemctl --user daemon-reload\`
3. Systemd automatically generates and manages the service

### Quadlet File Types:
| Extension | Purpose |
|-----------|---------|
| \`.container\` | Define a container |
| \`.volume\` | Define a volume |
| \`.network\` | Define a network |
| \`.kube\` | Play a K8s YAML file |
| \`.pod\` | Define a pod |

### Why Quadlet over generate systemd?
- **Declarative** — Simple, readable config files
- **Managed** — Systemd handles everything
- **Integrated** — Volumes and networks auto-created
- **Future-proof** — Replaces deprecated \`podman generate systemd\`
        `,
        code: `# ~/.config/containers/systemd/webapp.container
[Unit]
Description=My Web Application
After=network-online.target

[Container]
Image=docker.io/library/nginx:latest
ContainerName=webapp
PublishPort=8080:80
Volume=webapp-data:/usr/share/nginx/html:ro
Environment=NGINX_HOST=example.com
AutoUpdate=registry

[Service]
Restart=always
TimeoutStartSec=60

[Install]
WantedBy=default.target

# Then:
# systemctl --user daemon-reload
# systemctl --user start webapp
# systemctl --user enable webapp

# ──────────────────────────────────
# Volume quadlet
# ~/.config/containers/systemd/webapp-data.volume
[Volume]
# Volume options here

# ──────────────────────────────────
# Network quadlet
# ~/.config/containers/systemd/app-network.network
[Network]
Subnet=10.89.1.0/24
Gateway=10.89.1.1`,
      },
      {
        id: "auto-updates",
        title: "Auto-Updates",
        content: `
Podman can **automatically update** container images and restart containers when new versions are available.

### How It Works:
1. Label your container with \`io.containers.autoupdate=registry\`
2. Podman periodically checks the registry for new image versions
3. If a newer image exists, it pulls it and restarts the container

### Setup:
\`\`\`bash
# Create container with auto-update label
podman create --name webapp \\
  --label io.containers.autoupdate=registry \\
  -p 8080:80 \\
  docker.io/library/nginx:latest

# Check for updates manually
podman auto-update --dry-run    # Preview what would update
podman auto-update              # Actually update

# Enable the systemd timer for automatic checks
systemctl --user enable --now podman-auto-update.timer

# Check timer status
systemctl --user list-timers
\`\`\`

### Auto-Update Policies:
| Policy | Description |
|--------|-------------|
| \`registry\` | Check registry for newer image |
| \`local\` | Use local image changes only |
| \`disabled\` | No auto-update |
        `,
      },
      {
        id: "podman-interview",
        title: "Podman Interview Questions",
        content: `
### 1. What is the main difference between Docker and Podman?
> Docker uses a client-server architecture with a root daemon. Podman is daemonless — each container is a direct child process of the Podman command. This makes Podman more secure and eliminates the single point of failure.

### 2. What are rootless containers and why do they matter?
> Rootless containers run entirely without root privileges using Linux user namespaces. Even if a container is compromised, the attacker only has regular user privileges on the host. Docker requires root by default (though rootless Docker exists, it's not the default).

### 3. How does Podman handle pods?
> Podman has native pod support (like Kubernetes). Containers in a pod share network and optionally PID namespaces. Docker has no native pod concept. Podman can also generate Kubernetes YAML from pods.

### 4. Explain \`podman generate kube\` and \`podman play kube\`.
> \`podman generate kube\` exports a running pod/container as Kubernetes YAML. \`podman play kube\` does the reverse — creates containers from a Kubernetes YAML file. This bridges local development and K8s deployment.

### 5. What is Quadlet?
> Quadlet is a systemd generator for Podman that converts simple \`.container\`, \`.volume\`, and \`.network\` files into systemd unit files. It's the modern, declarative way to run containers as systemd services.

### 6. Can I use Docker Compose files with Podman?
> Yes! \`podman-compose\` reads standard \`docker-compose.yml\` files. Podman 5+ also has a built-in \`podman compose\` subcommand.

### 7. What container runtime does Podman use?
> Podman uses **conmon** (container monitor) as the container runtime and **runc** or **crun** (faster, written in C) as the OCI runtime. For builds, it uses **Buildah**.

### 8. What networking does Podman use?
> Podman 4+ uses **Netavark** (Rust-based) for rootful networking and **slirp4netns** or **pasta** for rootless networking. Legacy versions used CNI plugins.
        `,
      },
    ],
  },
];
