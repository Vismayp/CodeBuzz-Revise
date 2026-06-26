// ═══════════════════════════════════════════════════════════════
// KUBERNETES — COMPLETE GUIDE (Beginner → Interview Ready)
// ═══════════════════════════════════════════════════════════════

const baseTopics = [
  {
    id: "k8s-introduction",
    title: "Introduction to Kubernetes",
    description:
      "What is Kubernetes, why we need it, and how container orchestration works.",
    icon: "BookOpen",
    sections: [
      {
        id: "what-is-kubernetes",
        title: "What is Kubernetes?",
        content: `
**Kubernetes** (K8s) is an open-source **container orchestration platform** originally designed by Google and now maintained by the Cloud Native Computing Foundation (CNCF).

### 🤔 The Problem It Solves
Imagine you have 100 containers running your application. Without Kubernetes, you'd need to manually:
- Start/stop containers across multiple servers
- Handle crashes (restart containers)
- Scale up when traffic spikes
- Load balance between containers
- Roll out new versions without downtime

**Kubernetes automates all of this.**

### 🏗️ Real-World Analogy
Think of Kubernetes as an **airport control tower**:
- Your containers are **airplanes**
- Your servers (nodes) are **runways**
- K8s decides which plane lands on which runway
- If a runway has an issue, planes are rerouted
- During busy hours, more runways open automatically

### Key Features:
1. **Self-Healing** — Restarts crashed containers automatically
2. **Auto-Scaling** — Adds/removes containers based on traffic
3. **Service Discovery** — Containers find each other without hardcoded IPs
4. **Rolling Updates** — Zero-downtime deployments
5. **Secret Management** — Secure handling of passwords, API keys
        `,
        diagram: `
graph LR
    Dev["Developer"] -->|"kubectl apply"| API["K8s API Server"]
    API --> Scheduler["Scheduler"]
    Scheduler --> N1["Node 1"]
    Scheduler --> N2["Node 2"]
    Scheduler --> N3["Node 3"]
    N1 --> P1["Pod A"]
    N1 --> P2["Pod B"]
    N2 --> P3["Pod C"]
    N3 --> P4["Pod D"]
    style API fill:#326ce5,stroke:#fff,stroke-width:2px,color:#fff
        `,
      },
      {
        id: "containers-vs-vms",
        title: "Containers vs Virtual Machines",
        content: `
Before understanding K8s, let's clarify what containers are and why they replaced VMs for many workloads.

### Virtual Machines (VMs)
- Each VM runs a **full Operating System** (Guest OS)
- Heavy: GBs of size, minutes to boot
- Strong isolation via hypervisor (VMware, Hyper-V, KVM)

### Containers
- Share the **host OS kernel** — no Guest OS needed
- Lightweight: MBs of size, seconds to start
- Packaged with all dependencies (app + libraries + config)
- Isolated via **Linux namespaces** and **cgroups**

### When to use what?
| Feature | VMs | Containers |
|---------|-----|------------|
| Boot Time | Minutes | Seconds |
| Size | GBs | MBs |
| Isolation | Full OS | Process-level |
| Use Case | Legacy apps, different OS | Microservices, CI/CD |
| Density | ~10 VMs per server | ~100+ containers per server |

### 🎯 Interview Tip
> "Containers share the host kernel for efficiency, while VMs provide stronger isolation through full OS virtualization. Kubernetes orchestrates containers, not VMs."
        `,
        diagram: `
graph TD
    subgraph VM_Stack["Virtual Machine"]
        HW1["Hardware"]
        HV["Hypervisor"]
        GOS1["Guest OS 1"]
        GOS2["Guest OS 2"]
        APP1["App A"]
        APP2["App B"]
        HW1 --> HV
        HV --> GOS1
        HV --> GOS2
        GOS1 --> APP1
        GOS2 --> APP2
    end
    subgraph Container_Stack["Containers"]
        HW2["Hardware"]
        HOS["Host OS"]
        CR["Container Runtime"]
        C1["Container A"]
        C2["Container B"]
        C3["Container C"]
        HW2 --> HOS
        HOS --> CR
        CR --> C1
        CR --> C2
        CR --> C3
    end
        `,
      },
      {
        id: "k8s-architecture-overview",
        title: "Kubernetes Architecture Overview",
        content: `
A Kubernetes cluster has two main types of machines:

## 1. Control Plane (Master)
The "brain" of the cluster. It makes all scheduling decisions.

| Component | Role |
|-----------|------|
| **API Server** | Front door — all communication goes through it |
| **etcd** | Key-value store — the cluster's database |
| **Scheduler** | Decides which Node runs which Pod |
| **Controller Manager** | Runs controllers (ReplicaSet, Node, etc.) |
| **Cloud Controller** | (Optional) Integrates with cloud providers |

## 2. Worker Nodes
The "muscle" — where your applications actually run.

| Component | Role |
|-----------|------|
| **kubelet** | Agent on each Node — manages Pods |
| **kube-proxy** | Handles networking rules & load balancing |
| **Container Runtime** | Runs containers (containerd, CRI-O) |

### How a Deployment Works (Step by Step):
1. You run \`kubectl apply -f deployment.yaml\`
2. **API Server** validates and stores the desired state in **etcd**
3. **Scheduler** finds the best Node for the Pod
4. **kubelet** on that Node pulls the image and starts the container
5. **kube-proxy** sets up networking rules
6. **Controller Manager** continuously ensures desired state = actual state
        `,
        diagram: `
graph TD
    subgraph Control_Plane["Control Plane (Master)"]
        API["API Server"]
        ETCD["etcd"]
        SCHED["Scheduler"]
        CM["Controller Manager"]
        API --- ETCD
        API --- SCHED
        API --- CM
    end

    subgraph Worker_1["Worker Node 1"]
        KL1["kubelet"]
        KP1["kube-proxy"]
        POD1["Pod A"]
        POD2["Pod B"]
    end

    subgraph Worker_2["Worker Node 2"]
        KL2["kubelet"]
        KP2["kube-proxy"]
        POD3["Pod C"]
    end

    API --> KL1
    API --> KL2
    style Control_Plane fill:#326ce5,color:#fff
        `,
      },
    ],
  },
  {
    id: "k8s-core-concepts",
    title: "Core Concepts",
    description: "Pods, Nodes, Namespaces, Labels, and Selectors — the building blocks.",
    icon: "Box",
    sections: [
      {
        id: "pods",
        title: "Pods — The Smallest Deployable Unit",
        content: `
A **Pod** is the smallest unit in Kubernetes. It wraps one or more containers that share:
- The same **network namespace** (same IP address)
- The same **storage volumes**
- The same **lifecycle** (created and destroyed together)

### 🏗️ Analogy
A Pod is like a **shared apartment**:
- Containers in a Pod are **roommates** — they share the same address (IP) and can talk to each other via \`localhost\`
- They share the same storage (like a shared fridge)
- If the apartment is destroyed, all roommates leave

### Single vs Multi-Container Pods
- **Single-container Pod** (most common): One app per Pod
- **Multi-container Pod**: Used for sidecar patterns (logging agent, proxy, init containers)

### Pod Lifecycle States:
| State | Description |
|-------|-------------|
| **Pending** | Accepted but not yet running |
| **Running** | At least one container is running |
| **Succeeded** | All containers finished successfully |
| **Failed** | At least one container exited with error |
| **Unknown** | Node communication lost |

### 🎯 Interview Tip
> "Pods are ephemeral — they can be killed and recreated at any time. Never store state in a Pod. Use StatefulSets or external storage instead."
        `,
        code: `# Simple Pod YAML
apiVersion: v1
kind: Pod
metadata:
  name: my-nginx
  labels:
    app: nginx
    tier: frontend
spec:
  containers:
    - name: nginx
      image: nginx:1.25
      ports:
        - containerPort: 80
      resources:
        requests:
          memory: "64Mi"
          cpu: "250m"
        limits:
          memory: "128Mi"
          cpu: "500m"`,
        diagram: `
graph TD
    subgraph Pod["Pod (10.244.1.5)"]
        C1["Container: nginx"]
        C2["Container: log-agent"]
        V["Shared Volume"]
        C1 --- V
        C2 --- V
    end
    style Pod fill:#326ce5,color:#fff
        `,
      },
      {
        id: "nodes",
        title: "Nodes — The Machines",
        content: `
A **Node** is a physical or virtual machine that runs your Pods.

### Types of Nodes:
1. **Master/Control Plane Node** — Runs control plane components
2. **Worker Node** — Runs your application Pods

### Node Components:
- **kubelet** — Ensures containers described in Pod specs are running
- **kube-proxy** — Maintains network rules for Pod communication
- **Container Runtime** — Actually runs containers (containerd, CRI-O)

### Useful Commands:
\`\`\`bash
kubectl get nodes                  # List all nodes
kubectl describe node <name>      # Detailed node info
kubectl cordon <name>             # Mark node as unschedulable
kubectl drain <name>              # Evict pods and cordon
kubectl uncordon <name>           # Mark node as schedulable
\`\`\`

### Node Conditions:
| Condition | Meaning |
|-----------|---------|
| **Ready** | Node is healthy and can accept Pods |
| **MemoryPressure** | Node is running low on memory |
| **DiskPressure** | Node is running low on disk space |
| **PIDPressure** | Too many processes running |
        `,
      },
      {
        id: "namespaces",
        title: "Namespaces — Virtual Clusters",
        content: `
**Namespaces** provide isolation within a cluster. Think of them as **folders** that organize resources.

### Default Namespaces:
| Namespace | Purpose |
|-----------|---------|
| \`default\` | Where resources go if no namespace is specified |
| \`kube-system\` | System components (DNS, proxy, etc.) |
| \`kube-public\` | Publicly accessible data |
| \`kube-node-lease\` | Node heartbeat data |

### Why Use Namespaces?
1. **Team Isolation** — Team A can't accidentally delete Team B's resources
2. **Resource Quotas** — Limit CPU/memory per namespace
3. **Environment Separation** — dev, staging, production in one cluster
4. **RBAC** — Different permissions per namespace

### Key Points:
- Not all resources are namespaced (Nodes, PersistentVolumes are cluster-wide)
- DNS format: \`<service-name>.<namespace>.svc.cluster.local\`
        `,
        code: `# Creating a namespace
apiVersion: v1
kind: Namespace
metadata:
  name: production

---
# Resource Quota for a namespace
apiVersion: v1
kind: ResourceQuota
metadata:
  name: prod-quota
  namespace: production
spec:
  hard:
    pods: "50"
    requests.cpu: "10"
    requests.memory: "20Gi"
    limits.cpu: "20"
    limits.memory: "40Gi"`,
      },
      {
        id: "labels-selectors",
        title: "Labels & Selectors",
        content: `
**Labels** are key-value pairs attached to resources. **Selectors** filter resources by labels.

### 🏗️ Analogy
Labels are like **hashtags on social media** — you tag your posts (#frontend, #production), and then you can search/filter by those tags.

### Why Labels Matter:
- Services use labels to find Pods to route traffic to
- Deployments use labels to manage Pod replicas
- You can organize resources by environment, version, team, etc.

### Two Types of Selectors:
1. **Equality-based**: \`app=nginx\`, \`tier!=backend\`
2. **Set-based**: \`app in (nginx, apache)\`, \`tier notin (test)\`

### Common Label Conventions:
\`\`\`yaml
labels:
  app.kubernetes.io/name: myapp
  app.kubernetes.io/version: "1.2.3"
  app.kubernetes.io/component: frontend
  app.kubernetes.io/part-of: ecommerce
  app.kubernetes.io/managed-by: helm
\`\`\`

### 🎯 Interview Tip
> "Labels are the glue that connects Kubernetes resources. A Service sends traffic to Pods by matching labels, not by name."
        `,
        code: `# Using labels and selectors
apiVersion: v1
kind: Pod
metadata:
  name: web-pod
  labels:
    app: web
    env: production
    version: v2
spec:
  containers:
    - name: web
      image: myapp:v2

---
# Service selecting pods by label
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  selector:
    app: web       # Only routes to pods with app=web
    env: production
  ports:
    - port: 80
      targetPort: 8080`,
      },
    ],
  },
  {
    id: "k8s-workloads",
    title: "Workloads & Controllers",
    description:
      "Deployments, ReplicaSets, StatefulSets, DaemonSets, Jobs, and CronJobs.",
    icon: "Layers",
    sections: [
      {
        id: "deployments",
        title: "Deployments — The Most Common Workload",
        content: `
A **Deployment** manages a set of identical Pods. It's the recommended way to run stateless applications.

### What Deployments Do:
1. **Create ReplicaSets** — Which in turn create Pods
2. **Rolling Updates** — Gradually replace old Pods with new ones
3. **Rollback** — Revert to a previous version if something breaks
4. **Scaling** — Increase/decrease replicas

### Deployment → ReplicaSet → Pod Hierarchy:
\`\`\`
Deployment (manages versions)
  └── ReplicaSet v2 (current, 3 replicas)
       ├── Pod 1
       ├── Pod 2
       └── Pod 3
  └── ReplicaSet v1 (previous, 0 replicas — kept for rollback)
\`\`\`

### Update Strategies:
| Strategy | Description |
|----------|-------------|
| **RollingUpdate** (default) | Gradually replaces Pods, zero downtime |
| **Recreate** | Kills all old Pods first, then creates new — brief downtime |

### Key Commands:
\`\`\`bash
kubectl create deployment nginx --image=nginx:1.25 --replicas=3
kubectl rollout status deployment/nginx
kubectl rollout history deployment/nginx
kubectl rollout undo deployment/nginx              # Rollback
kubectl scale deployment/nginx --replicas=5
kubectl set image deployment/nginx nginx=nginx:1.26  # Update image
\`\`\`
        `,
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Max pods above desired during update
      maxUnavailable: 0   # Zero downtime
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: myapp:v2
          ports:
            - containerPort: 8080
          readinessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 10`,
      },
      {
        id: "statefulsets",
        title: "StatefulSets — For Stateful Applications",
        content: `
**StatefulSets** manage stateful applications that need:
- **Stable network identity** (predictable Pod names: \`mysql-0\`, \`mysql-1\`)
- **Stable persistent storage** (each Pod gets its own volume)
- **Ordered deployment** (Pods are created in order: 0, 1, 2...)

### When to Use StatefulSets:
- **Databases** (MySQL, PostgreSQL, MongoDB)
- **Message Queues** (Kafka, RabbitMQ)
- **Distributed Systems** (Elasticsearch, ZooKeeper)

### StatefulSet vs Deployment:
| Feature | Deployment | StatefulSet |
|---------|------------|-------------|
| Pod Names | Random (web-abc123) | Ordered (web-0, web-1) |
| Storage | Shared or none | Each Pod gets its own PVC |
| Scaling | Any order | Ordered (scale up: 0→1→2) |
| DNS | Via Service only | Individual DNS per Pod |
| Use Case | Stateless apps | Databases, queues |

### 🎯 Interview Tip
> "Use Deployments for stateless workloads and StatefulSets when you need stable identities and persistent storage — like databases."
        `,
        code: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: "mysql"     # Headless service name
  replicas: 3
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
        - name: mysql
          image: mysql:8.0
          ports:
            - containerPort: 3306
          volumeMounts:
            - name: data
              mountPath: /var/lib/mysql
  volumeClaimTemplates:      # Each pod gets its own PVC
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 10Gi`,
      },
      {
        id: "daemonsets-jobs",
        title: "DaemonSets, Jobs & CronJobs",
        content: `
## DaemonSet
Ensures a copy of a Pod runs on **every Node** (or selected nodes).

**Use Cases:**
- Log collectors (Fluentd, Filebeat)
- Monitoring agents (Prometheus Node Exporter)
- Network plugins (Calico, Cilium)

## Job
Runs a Pod to **completion** (not continuously). The Pod exits after the task is done.

**Use Cases:**
- Database migrations
- Batch processing
- One-time setup scripts

## CronJob
A Job that runs on a **schedule** (like Linux cron).

**Use Cases:**
- Nightly backups
- Report generation
- Cache cleanup

### Cron Schedule Format:
\`\`\`
┌───────── minute (0 - 59)
│ ┌─────── hour (0 - 23)
│ │ ┌───── day of month (1 - 31)
│ │ │ ┌─── month (1 - 12)
│ │ │ │ ┌─ day of week (0 - 6, Sun=0)
│ │ │ │ │
* * * * *
\`\`\`
        `,
        code: `# DaemonSet example — log collector on every node
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
spec:
  selector:
    matchLabels:
      app: fluentd
  template:
    metadata:
      labels:
        app: fluentd
    spec:
      containers:
        - name: fluentd
          image: fluentd:v1.16

---
# Job — run database migration
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migrate
spec:
  backoffLimit: 3    # Retry 3 times on failure
  template:
    spec:
      containers:
        - name: migrate
          image: myapp:latest
          command: ["node", "migrate.js"]
      restartPolicy: Never

---
# CronJob — nightly backup at 2 AM
apiVersion: batch/v1
kind: CronJob
metadata:
  name: nightly-backup
spec:
  schedule: "0 2 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: backup
              image: backup-tool:latest
              command: ["./backup.sh"]
          restartPolicy: OnFailure`,
      },
    ],
  },
  {
    id: "k8s-networking",
    title: "Networking",
    description: "Services, Ingress, DNS, and Network Policies in Kubernetes.",
    icon: "Globe",
    sections: [
      {
        id: "services",
        title: "Services — Exposing Your Applications",
        content: `
A **Service** provides a stable endpoint (IP + DNS name) to access a group of Pods. Since Pod IPs change when Pods restart, Services provide a **constant address**.

### Service Types:

| Type | Scope | Use Case |
|------|-------|----------|
| **ClusterIP** (default) | Internal only | Microservice-to-microservice |
| **NodePort** | External via Node IP:Port | Development/testing |
| **LoadBalancer** | External via cloud LB | Production (AWS ALB, GCP LB) |
| **ExternalName** | DNS alias | Mapping to external services |

### How Services Find Pods:
Services use **label selectors** to discover Pods. When a Pod matches the selector and is Ready, it's added to the Service's endpoint list.

### 🏗️ Analogy:
A Service is like a **restaurant phone number**:
- Customers (other apps) call the restaurant (Service)
- The host (kube-proxy) routes the call to an available waiter (Pod)
- If a waiter goes on break (Pod dies), the host routes to another

### 🎯 Interview Tip
> "ClusterIP is for internal communication, NodePort exposes on every node's IP, and LoadBalancer provisions a cloud load balancer. In production, use LoadBalancer or Ingress."
        `,
        code: `# ClusterIP Service (internal only)
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: ClusterIP       # Default
  selector:
    app: backend
  ports:
    - port: 80           # Service port (what other pods use)
      targetPort: 3000   # Container port (where app listens)

---
# NodePort Service (accessible externally on any Node IP)
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
    - port: 80
      targetPort: 3000
      nodePort: 30080   # Accessible at <NodeIP>:30080

---
# LoadBalancer Service (cloud provider provisions LB)
apiVersion: v1
kind: Service
metadata:
  name: api-gateway
spec:
  type: LoadBalancer
  selector:
    app: api
  ports:
    - port: 443
      targetPort: 8080`,
        diagram: `
graph TD
    Internet["Internet"] --> LB["Load Balancer<br/>(cloud-provided)"]
    LB --> S["Service<br/>(api-gateway)"]
    S --> P1["Pod 1"]
    S --> P2["Pod 2"]
    S --> P3["Pod 3"]
    style S fill:#326ce5,color:#fff
        `,
      },
      {
        id: "ingress",
        title: "Ingress — HTTP(S) Routing",
        content: `
**Ingress** provides HTTP/HTTPS routing to Services based on URL paths or hostnames. It's like a **smart reverse proxy** built into Kubernetes.

### Why Ingress?
Without Ingress, you'd need a separate LoadBalancer Service for every app (expensive!). Ingress consolidates routing rules into a single entry point.

### Ingress = Rules + Ingress Controller
- **Ingress Resource** — YAML defining routing rules
- **Ingress Controller** — The actual proxy (NGINX, Traefik, HAProxy)

### Routing Examples:
\`\`\`
https://myapp.com/api    → api-service:80
https://myapp.com/app    → frontend-service:80
https://admin.myapp.com  → admin-service:80
\`\`\`

### Features:
- Path-based routing (\`/api\`, \`/app\`)
- Host-based routing (\`api.example.com\`, \`admin.example.com\`)
- TLS termination (HTTPS)
- Rate limiting, authentication (via annotations)
        `,
        code: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
    - hosts:
        - myapp.com
      secretName: tls-secret
  rules:
    - host: myapp.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80
    - host: admin.myapp.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: admin-service
                port:
                  number: 80`,
        diagram: `
graph LR
    Client["Client"] --> Ingress["Ingress Controller<br/>(NGINX)"]
    Ingress -->|"/api"| API["api-service"]
    Ingress -->|"/"| FE["frontend-service"]
    Ingress -->|"admin.myapp.com"| Admin["admin-service"]
    style Ingress fill:#326ce5,color:#fff
        `,
      },
      {
        id: "network-policies",
        title: "Network Policies — Firewalls for Pods",
        content: `
By default, all Pods in a cluster can talk to each other. **Network Policies** restrict this, acting as firewalls.

### 🏗️ Analogy:
Network Policies are like **security badges in an office building**:
- Without policies: Anyone can enter any room
- With policies: Only specific teams can access specific floors

### Policy Types:
- **Ingress** — Controls incoming traffic TO selected Pods
- **Egress** — Controls outgoing traffic FROM selected Pods

### Common Patterns:
1. **Deny all traffic** — Default deny, then whitelist
2. **Allow same namespace** — Pods in same namespace can communicate
3. **Allow specific Pods** — Only frontend can talk to backend

### ⚠️ Important:
Network Policies require a **CNI plugin** that supports them (Calico, Cilium, Weave). The default kubenet does NOT enforce policies.
        `,
        code: `# Deny all ingress traffic to backend pods
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-backend
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Ingress
  ingress: []        # Empty = deny all

---
# Only allow frontend to talk to backend
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - port: 3000
          protocol: TCP`,
      },
    ],
  },
  {
    id: "k8s-storage",
    title: "Storage & Configuration",
    description:
      "Volumes, PersistentVolumes, PVCs, ConfigMaps, and Secrets.",
    icon: "Database",
    sections: [
      {
        id: "volumes-pv-pvc",
        title: "Persistent Storage (PV & PVC)",
        content: `
Containers are **ephemeral** — when a Pod dies, its filesystem is lost. **Volumes** solve this.

### Storage Hierarchy:
\`\`\`
StorageClass (defines HOW storage is provisioned)
  └── PersistentVolume (PV) — A piece of storage in the cluster
       └── PersistentVolumeClaim (PVC) — A request for storage by a Pod
            └── Pod mounts the PVC as a volume
\`\`\`

### 🏗️ Analogy:
- **StorageClass** = A type of apartment (luxury, standard, economy)
- **PersistentVolume (PV)** = An available apartment
- **PersistentVolumeClaim (PVC)** = A rental application
- **Pod** = The tenant living in the apartment

### Access Modes:
| Mode | Short | Description |
|------|-------|-------------|
| ReadWriteOnce | RWO | Mounted read-write by a single Node |
| ReadOnlyMany | ROX | Mounted read-only by many Nodes |
| ReadWriteMany | RWX | Mounted read-write by many Nodes |

### Reclaim Policies:
- **Retain** — PV is kept after PVC is deleted (manual cleanup)
- **Delete** — PV is deleted when PVC is deleted
- **Recycle** — (Deprecated) PV contents are wiped
        `,
        code: `# PersistentVolume — admin creates this
apiVersion: v1
kind: PersistentVolume
metadata:
  name: my-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: standard
  hostPath:
    path: /mnt/data

---
# PersistentVolumeClaim — developer requests storage
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: standard

---
# Pod using the PVC
apiVersion: v1
kind: Pod
metadata:
  name: app-with-storage
spec:
  containers:
    - name: app
      image: myapp:latest
      volumeMounts:
        - name: data
          mountPath: /app/data
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: my-pvc`,
      },
      {
        id: "configmaps-secrets",
        title: "ConfigMaps & Secrets",
        content: `
### ConfigMaps
Store **non-sensitive** configuration data as key-value pairs. Injected into Pods as environment variables or mounted as files.

### Secrets
Store **sensitive** data (passwords, tokens, keys). Base64 encoded (NOT encrypted by default!).

### ⚠️ Security Warning:
Kubernetes Secrets are only base64 encoded, not encrypted. For production:
- Enable **encryption at rest** in etcd
- Use **external secret managers** (Vault, AWS Secrets Manager)
- Use **Sealed Secrets** or **External Secrets Operator**

### Best Practices:
1. Never hardcode config in container images
2. Use ConfigMaps for environment-specific settings
3. Use Secrets for passwords, API keys, TLS certs
4. Rotate Secrets regularly
        `,
        code: `# ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DATABASE_HOST: "postgres.production.svc.cluster.local"
  DATABASE_PORT: "5432"
  LOG_LEVEL: "info"
  config.json: |
    {
      "feature_flags": {
        "dark_mode": true,
        "beta_features": false
      }
    }

---
# Secret
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
stringData:                  # Use stringData for plain text input
  DB_PASSWORD: "s3cur3Pa$$"
  DB_USERNAME: "admin"

---
# Pod using ConfigMap and Secret
apiVersion: v1
kind: Pod
metadata:
  name: app
spec:
  containers:
    - name: app
      image: myapp:latest
      envFrom:
        - configMapRef:
            name: app-config      # All keys become env vars
      env:
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: DB_PASSWORD
      volumeMounts:
        - name: config-vol
          mountPath: /etc/config
  volumes:
    - name: config-vol
      configMap:
        name: app-config`,
      },
    ],
  },
  {
    id: "k8s-scaling",
    title: "Scaling & Self-Healing",
    description:
      "HPA, VPA, probes, rolling updates, and health checks.",
    icon: "Activity",
    sections: [
      {
        id: "hpa-vpa",
        title: "Horizontal & Vertical Pod Autoscaling",
        content: `
### HPA (Horizontal Pod Autoscaler)
Automatically adds or removes Pod **replicas** based on metrics (CPU, memory, custom metrics).

**How it works:**
1. HPA checks metrics every 15 seconds (default)
2. If CPU > target → scale up (add more Pods)
3. If CPU < target → scale down (remove Pods)

### VPA (Vertical Pod Autoscaler)
Automatically adjusts Pod **resource requests/limits** (CPU and memory). Only changes if Pod is restarted.

### HPA vs VPA:
| Feature | HPA | VPA |
|---------|-----|-----|
| Scales | Number of Pods | Pod resource requests |
| Trigger | CPU/memory usage | Resource utilization |
| Disruption | None (adds new Pods) | Restarts Pod |
| Best For | Stateless apps | DB, single-instance apps |

### 🎯 Interview Tip
> "HPA scales horizontally by adding more Pods. VPA scales vertically by giving existing Pods more resources. Don't use both on the same metric."
        `,
        code: `# HPA — scale based on CPU usage
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70    # Scale up if CPU > 70%
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80`,
      },
      {
        id: "probes",
        title: "Health Checks — Liveness, Readiness & Startup Probes",
        content: `
Kubernetes uses probes to check if your containers are healthy.

### Three Types of Probes:

| Probe | What it does | If it fails |
|-------|-------------|-------------|
| **Liveness** | "Is the app alive?" | Container is **restarted** |
| **Readiness** | "Can the app serve traffic?" | Pod is removed from Service endpoints |
| **Startup** | "Has the app finished starting?" | Other probes are disabled until pass |

### Probe Methods:
1. **HTTP GET** — Returns 200-399 = healthy
2. **TCP Socket** — Port is open = healthy
3. **exec Command** — Exit code 0 = healthy

### 🏗️ Analogy:
- **Liveness** = "Is the restaurant open?" (If no, knock it down and rebuild)
- **Readiness** = "Are tables available?" (If no, stop sending customers)
- **Startup** = "Is the restaurant finished construction?" (Don't check anything else until done)

### Common Mistake:
> Setting liveness probe too aggressively can cause **restart loops**. Start with generous timeouts and tighten later.
        `,
        code: `apiVersion: v1
kind: Pod
metadata:
  name: app-with-probes
spec:
  containers:
    - name: app
      image: myapp:latest
      ports:
        - containerPort: 8080

      # Startup Probe — App has 60s to start
      startupProbe:
        httpGet:
          path: /health
          port: 8080
        failureThreshold: 30
        periodSeconds: 2

      # Liveness Probe — Restart if stuck
      livenessProbe:
        httpGet:
          path: /health
          port: 8080
        initialDelaySeconds: 0
        periodSeconds: 10
        failureThreshold: 3

      # Readiness Probe — Remove from service if not ready
      readinessProbe:
        httpGet:
          path: /ready
          port: 8080
        initialDelaySeconds: 0
        periodSeconds: 5
        failureThreshold: 2`,
      },
    ],
  },
  {
    id: "k8s-security",
    title: "Security",
    description:
      "RBAC, ServiceAccounts, Pod Security, and security best practices.",
    icon: "ShieldCheck",
    sections: [
      {
        id: "rbac",
        title: "RBAC — Role-Based Access Control",
        content: `
**RBAC** controls who can do what in your cluster.

### Four RBAC Resources:
| Resource | Scope | Description |
|----------|-------|-------------|
| **Role** | Namespace | Permissions within a namespace |
| **ClusterRole** | Cluster | Permissions across all namespaces |
| **RoleBinding** | Namespace | Assigns a Role to a user/group |
| **ClusterRoleBinding** | Cluster | Assigns a ClusterRole cluster-wide |

### Key Verbs:
\`get\`, \`list\`, \`watch\`, \`create\`, \`update\`, \`patch\`, \`delete\`

### 🏗️ Analogy:
- **Role** = A job description (e.g., "Can read and write reports")
- **RoleBinding** = A contract assigning that job to a person

### Principle of Least Privilege:
> Only grant the minimum permissions needed. Never give \`cluster-admin\` to applications.
        `,
        code: `# Role — allow reading pods in "default" namespace
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "watch", "list"]

---
# RoleBinding — assign role to a user
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods-binding
  namespace: default
subjects:
  - kind: User
    name: jane
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io

---
# ServiceAccount for applications
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-service-account
  namespace: production`,
      },
      {
        id: "pod-security",
        title: "Pod Security Best Practices",
        content: `
Running containers securely is critical in production.

### Security Checklist:
1. ✅ **Run as non-root** — \`runAsNonRoot: true\`
2. ✅ **Read-only filesystem** — \`readOnlyRootFilesystem: true\`
3. ✅ **Drop capabilities** — Remove all Linux capabilities, add only what's needed
4. ✅ **Resource limits** — Prevent noisy neighbors from consuming all resources
5. ✅ **No privileged containers** — Never use \`privileged: true\` unless absolutely necessary
6. ✅ **Network Policies** — Restrict Pod-to-Pod communication
7. ✅ **Image scanning** — Use Trivy, Snyk, or Grype to scan images for CVEs
8. ✅ **Use distroless images** — Minimal images without shell or package manager

### Pod Security Standards (PSS):
| Level | Description |
|-------|-------------|
| **Privileged** | No restrictions (unrestricted) |
| **Baseline** | Minimally restrictive (prevents known privilege escalations) |
| **Restricted** | Heavily restricted (best practices enforced) |
        `,
        code: `apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 2000
  containers:
    - name: app
      image: gcr.io/distroless/nodejs:18
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop: ["ALL"]
      resources:
        requests:
          cpu: "100m"
          memory: "128Mi"
        limits:
          cpu: "500m"
          memory: "256Mi"
      volumeMounts:
        - name: tmp
          mountPath: /tmp
  volumes:
    - name: tmp
      emptyDir: {}   # Writable /tmp even with readOnly rootFS`,
      },
    ],
  },
  {
    id: "k8s-ecosystem",
    title: "Production & Ecosystem",
    description:
      "Helm, Operators, monitoring, logging, and production best practices.",
    icon: "Cpu",
    sections: [
      {
        id: "helm",
        title: "Helm — Kubernetes Package Manager",
        content: `
**Helm** is the package manager for Kubernetes, like \`npm\` for Node.js or \`pip\` for Python.

### Key Concepts:
- **Chart** — A package of pre-configured K8s resources
- **Release** — An installed instance of a chart
- **Repository** — Where charts are stored
- **Values** — Configuration parameters to customize a chart

### Why Helm?
1. **Reusability** — One chart, many deployments (dev, staging, prod)
2. **Versioning** — Track chart versions, rollback if needed
3. **Ecosystem** — Thousands of community charts (PostgreSQL, Redis, NGINX, etc.)

### Common Commands:
\`\`\`bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm search repo postgresql
helm install my-db bitnami/postgresql --set auth.postgresPassword=secret
helm list
helm upgrade my-db bitnami/postgresql --set auth.postgresPassword=newsecret
helm rollback my-db 1
helm uninstall my-db
\`\`\`
        `,
        code: `# Example: values.yaml for a Helm chart
replicaCount: 3

image:
  repository: myapp
  tag: "v2.1.0"
  pullPolicy: IfNotPresent

service:
  type: LoadBalancer
  port: 80

ingress:
  enabled: true
  host: myapp.example.com

resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilization: 70`,
      },
      {
        id: "monitoring",
        title: "Monitoring & Observability",
        content: `
### The Three Pillars of Observability:
1. **Metrics** — Numerical data over time (CPU, memory, request rate)
2. **Logs** — Event records from applications and system components
3. **Traces** — Request path through microservices (distributed tracing)

### Common Stack:
| Tool | Purpose |
|------|---------|
| **Prometheus** | Metrics collection & alerting |
| **Grafana** | Visualization dashboards |
| **Loki** | Log aggregation (like Prometheus for logs) |
| **Jaeger / Tempo** | Distributed tracing |
| **AlertManager** | Sends alerts (Slack, PagerDuty) |
| **Kube State Metrics** | Exposes K8s object metrics |

### Key Metrics to Monitor:
- **Cluster**: Node CPU/memory, Pod count, failed Pods
- **Application**: Request rate, error rate, latency (RED method)
- **Infrastructure**: Disk usage, network I/O, etcd health

### 🎯 Interview Tip
> "The RED method tracks Rate, Errors, and Duration for every service. The USE method tracks Utilization, Saturation, and Errors for every resource."
        `,
        diagram: `
graph LR
    App["Application Pods"] -->|"metrics"| Prom["Prometheus"]
    App -->|"logs"| Loki["Loki"]
    App -->|"traces"| Jaeger["Jaeger"]
    Prom --> Grafana["Grafana Dashboard"]
    Loki --> Grafana
    Jaeger --> Grafana
    Prom --> AM["AlertManager"]
    AM --> Slack["Slack / PagerDuty"]
    style Grafana fill:#F46800,color:#fff
        `,
      },
      {
        id: "k8s-interview-questions",
        title: "Top Kubernetes Interview Questions",
        content: `
### 1. What is the difference between a Pod and a Container?
> A Container runs a single process. A Pod is one or more containers sharing network/storage. Pod is the smallest deployable unit in K8s.

### 2. How does a Deployment do a rolling update?
> It creates a new ReplicaSet, gradually scales it up while scaling down the old one. \`maxSurge\` and \`maxUnavailable\` control the pace.

### 3. What happens when a Node fails?
> The Controller Manager detects the node is NotReady (after ~40s). Pods are rescheduled to other healthy nodes (after ~5min default).

### 4. How do you debug a Pod stuck in CrashLoopBackOff?
> \`kubectl logs <pod>\`, \`kubectl describe pod <pod>\`, check readiness/liveness probes, check resource limits, check image/command.

### 5. Explain the difference between ClusterIP, NodePort, and LoadBalancer.
> ClusterIP = internal only. NodePort = external via any node IP:30000-32767. LoadBalancer = external via cloud provider LB (provisions real LB).

### 6. What is a Headless Service?
> A Service with \`clusterIP: None\`. Instead of load balancing, it returns the IP of each individual Pod. Used with StatefulSets for direct Pod addressing.

### 7. How do ConfigMaps and Secrets differ?
> ConfigMaps store plain text config. Secrets store sensitive data (base64 encoded). Both can be injected as env vars or mounted as files.

### 8. What is an Operator in Kubernetes?
> An Operator extends K8s to manage complex stateful applications (databases, message queues) using Custom Resource Definitions (CRDs) and custom controllers.

### 9. What are the resource requests and limits?
> Requests = minimum guaranteed resources. Limits = maximum allowed. Exceeding memory limits → OOMKilled. Exceeding CPU limits → throttled.

### 10. What is the difference between a Deployment and a StatefulSet?
> Deployments are for stateless apps (random Pod names, shared storage). StatefulSets are for stateful apps (ordered names, individual storage, stable DNS).
        `,
      },
    ],
  },
];

const visualStyle = `
<style>
  .k8s-visual {
    margin: 1.25rem 0;
    padding: 1rem;
    border: 1px solid var(--border-bright);
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, rgba(0,212,255,0.08), rgba(57,255,20,0.04));
    overflow-x: auto;
  }
  .k8s-visual svg {
    width: 100%;
    min-width: 620px;
    height: auto;
    display: block;
  }
  .k8s-lane { fill: #101923; stroke: #334155; stroke-width: 1.5; }
  .k8s-box { fill: #172232; stroke: #00d4ff; stroke-width: 2; rx: 8; }
  .k8s-box-green { fill: #13251a; stroke: #39ff14; stroke-width: 2; rx: 8; }
  .k8s-box-warm { fill: #2a2111; stroke: #ffb300; stroke-width: 2; rx: 8; }
  .k8s-box-pink { fill: #261427; stroke: #ff6ec7; stroke-width: 2; rx: 8; }
  .k8s-text { fill: #e6edf3; font: 600 13px DM Sans, sans-serif; }
  .k8s-small { fill: #8b949e; font: 11px Space Mono, monospace; }
  .k8s-arrow { stroke: #8b949e; stroke-width: 2; marker-end: url(#arrow); fill: none; }
  .k8s-dash { stroke: #ffb300; stroke-width: 2; stroke-dasharray: 5 5; fill: none; marker-end: url(#arrow); }
  .k8s-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 0.75rem;
  }
  .k8s-mini-card {
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.75rem;
    background: rgba(13,17,23,0.72);
  }
  .k8s-mini-card strong {
    color: var(--accent);
    display: block;
    margin-bottom: 0.25rem;
  }
</style>`;

const svgDefs = `
<defs>
  <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b949e"></path>
  </marker>
</defs>`;

const visualSnippets = {
  "what-is-kubernetes": `
${visualStyle}
<div class="k8s-visual" aria-label="Kubernetes desired-state control loop">
  <svg viewBox="0 0 880 280" role="img">
    ${svgDefs}
    <rect class="k8s-lane" x="20" y="30" width="840" height="220" rx="12"></rect>
    <rect class="k8s-box" x="55" y="90" width="145" height="80"></rect>
    <text class="k8s-text" x="80" y="123">Desired State</text>
    <text class="k8s-small" x="82" y="148">YAML + kubectl</text>
    <path class="k8s-arrow" d="M205 130 H315"></path>
    <rect class="k8s-box-green" x="320" y="80" width="170" height="100"></rect>
    <text class="k8s-text" x="363" y="118">Control Plane</text>
    <text class="k8s-small" x="355" y="145">API, scheduler, controllers</text>
    <path class="k8s-arrow" d="M495 130 H605"></path>
    <rect class="k8s-box-warm" x="610" y="70" width="205" height="120"></rect>
    <text class="k8s-text" x="674" y="108">Actual State</text>
    <text class="k8s-small" x="655" y="135">Pods running on nodes</text>
    <text class="k8s-small" x="653" y="158">Self-healing keeps reconciling</text>
    <path class="k8s-dash" d="M708 205 C520 265, 305 260, 135 182"></path>
    <text class="k8s-small" x="333" y="235">observe -> compare -> repair</text>
  </svg>
</div>`,
  "containers-vs-vms": `
<div class="k8s-visual" aria-label="Container and VM layer comparison">
  <svg viewBox="0 0 880 320" role="img">
    <rect class="k8s-lane" x="35" y="30" width="370" height="250" rx="12"></rect>
    <rect class="k8s-lane" x="475" y="30" width="370" height="250" rx="12"></rect>
    <text class="k8s-text" x="165" y="62">Virtual Machines</text>
    <text class="k8s-text" x="610" y="62">Containers</text>
    <rect class="k8s-box-warm" x="70" y="215" width="300" height="35"></rect><text class="k8s-small" x="185" y="238">Hardware</text>
    <rect class="k8s-box" x="70" y="175" width="300" height="35"></rect><text class="k8s-small" x="178" y="198">Hypervisor</text>
    <rect class="k8s-box-pink" x="80" y="120" width="130" height="45"></rect><text class="k8s-small" x="116" y="147">Guest OS</text>
    <rect class="k8s-box-pink" x="230" y="120" width="130" height="45"></rect><text class="k8s-small" x="266" y="147">Guest OS</text>
    <rect class="k8s-box-green" x="80" y="80" width="130" height="34"></rect><text class="k8s-small" x="122" y="101">App</text>
    <rect class="k8s-box-green" x="230" y="80" width="130" height="34"></rect><text class="k8s-small" x="272" y="101">App</text>
    <rect class="k8s-box-warm" x="510" y="215" width="300" height="35"></rect><text class="k8s-small" x="625" y="238">Hardware</text>
    <rect class="k8s-box" x="510" y="175" width="300" height="35"></rect><text class="k8s-small" x="623" y="198">Host OS</text>
    <rect class="k8s-box" x="510" y="135" width="300" height="35"></rect><text class="k8s-small" x="606" y="158">Container Runtime</text>
    <rect class="k8s-box-green" x="520" y="85" width="85" height="40"></rect><text class="k8s-small" x="549" y="109">App</text>
    <rect class="k8s-box-green" x="635" y="85" width="85" height="40"></rect><text class="k8s-small" x="664" y="109">App</text>
    <rect class="k8s-box-green" x="750" y="85" width="50" height="40"></rect><text class="k8s-small" x="766" y="109">App</text>
  </svg>
</div>`,
  "k8s-architecture-overview": `
<div class="k8s-visual" aria-label="Kubernetes request lifecycle">
  <svg viewBox="0 0 920 300" role="img">
    ${svgDefs}
    <rect class="k8s-box" x="35" y="105" width="130" height="70"></rect><text class="k8s-text" x="70" y="135">kubectl</text><text class="k8s-small" x="60" y="158">apply YAML</text>
    <path class="k8s-arrow" d="M170 140 H255"></path>
    <rect class="k8s-box-green" x="260" y="55" width="180" height="170"></rect><text class="k8s-text" x="310" y="88">API Server</text><text class="k8s-small" x="295" y="115">validates + stores</text><text class="k8s-small" x="315" y="142">etcd state</text><text class="k8s-small" x="287" y="172">controllers watch</text><text class="k8s-small" x="306" y="198">scheduler binds</text>
    <path class="k8s-arrow" d="M445 140 H535"></path>
    <rect class="k8s-box-warm" x="540" y="60" width="335" height="165"></rect><text class="k8s-text" x="650" y="92">Worker Node</text>
    <rect class="k8s-box" x="575" y="120" width="90" height="50"></rect><text class="k8s-small" x="600" y="150">kubelet</text>
    <rect class="k8s-box-pink" x="695" y="120" width="95" height="50"></rect><text class="k8s-small" x="718" y="150">runtime</text>
    <rect class="k8s-box-green" x="625" y="185" width="120" height="35"></rect><text class="k8s-small" x="655" y="208">Pod starts</text>
  </svg>
</div>`,
  pods: `
<div class="k8s-visual" aria-label="Pod internals">
  <svg viewBox="0 0 850 300" role="img">
    ${svgDefs}
    <rect class="k8s-lane" x="70" y="45" width="700" height="210" rx="14"></rect>
    <text class="k8s-text" x="365" y="78">Pod: one IP, one lifecycle</text>
    <rect class="k8s-box-green" x="135" y="110" width="175" height="70"></rect><text class="k8s-text" x="175" y="140">App Container</text><text class="k8s-small" x="162" y="162">localhost:8080</text>
    <rect class="k8s-box" x="535" y="110" width="175" height="70"></rect><text class="k8s-text" x="570" y="140">Sidecar</text><text class="k8s-small" x="560" y="162">logs / proxy / sync</text>
    <path class="k8s-arrow" d="M315 145 H530"></path>
    <rect class="k8s-box-warm" x="295" y="205" width="250" height="35"></rect><text class="k8s-small" x="355" y="228">Shared volume + network namespace</text>
  </svg>
</div>`,
  nodes: `
<div class="k8s-visual"><div class="k8s-grid">
  <div class="k8s-mini-card"><strong>kubelet</strong>Turns PodSpecs into running containers and reports status.</div>
  <div class="k8s-mini-card"><strong>container runtime</strong>Pulls images, creates containers, attaches logs.</div>
  <div class="k8s-mini-card"><strong>kube-proxy/CNI</strong>Programs service routing and Pod networking rules.</div>
  <div class="k8s-mini-card"><strong>node conditions</strong>Ready, pressure, taints, allocatable resources.</div>
</div></div>`,
  namespaces: `
<div class="k8s-visual" aria-label="Namespace isolation">
  <svg viewBox="0 0 860 260" role="img">
    <rect class="k8s-lane" x="45" y="50" width="230" height="150" rx="12"></rect><text class="k8s-text" x="115" y="82">dev</text><text class="k8s-small" x="85" y="122">pods, services, RBAC</text><text class="k8s-small" x="103" y="150">quota: small</text>
    <rect class="k8s-lane" x="315" y="50" width="230" height="150" rx="12"></rect><text class="k8s-text" x="380" y="82">staging</text><text class="k8s-small" x="355" y="122">same names allowed</text><text class="k8s-small" x="373" y="150">quota: medium</text>
    <rect class="k8s-lane" x="585" y="50" width="230" height="150" rx="12"></rect><text class="k8s-text" x="653" y="82">prod</text><text class="k8s-small" x="625" y="122">tighter RBAC</text><text class="k8s-small" x="642" y="150">quota: large</text>
  </svg>
</div>`,
  "labels-selectors": `
<div class="k8s-visual" aria-label="Service label selector">
  <svg viewBox="0 0 870 280" role="img">
    ${svgDefs}
    <rect class="k8s-box" x="50" y="95" width="180" height="80"></rect><text class="k8s-text" x="105" y="128">Service</text><text class="k8s-small" x="77" y="153">selector: app=web</text>
    <path class="k8s-arrow" d="M235 135 H350"></path>
    <rect class="k8s-box-green" x="365" y="55" width="140" height="60"></rect><text class="k8s-small" x="395" y="82">Pod A</text><text class="k8s-small" x="385" y="100">app=web</text>
    <rect class="k8s-box-green" x="365" y="145" width="140" height="60"></rect><text class="k8s-small" x="395" y="172">Pod B</text><text class="k8s-small" x="385" y="190">app=web</text>
    <rect class="k8s-box-pink" x="585" y="100" width="140" height="60"></rect><text class="k8s-small" x="615" y="127">Pod C</text><text class="k8s-small" x="603" y="145">app=worker</text>
    <text class="k8s-small" x="555" y="200">not selected</text>
  </svg>
</div>`,
  deployments: `
<div class="k8s-visual" aria-label="Rolling update timeline">
  <svg viewBox="0 0 900 260" role="img">
    ${svgDefs}
    <text class="k8s-text" x="55" y="45">Rolling update: keep serving while replacing pods</text>
    <rect class="k8s-box-pink" x="70" y="85" width="95" height="45"></rect><text class="k8s-small" x="100" y="113">v1</text>
    <rect class="k8s-box-pink" x="190" y="85" width="95" height="45"></rect><text class="k8s-small" x="220" y="113">v1</text>
    <rect class="k8s-box-pink" x="310" y="85" width="95" height="45"></rect><text class="k8s-small" x="340" y="113">v1</text>
    <path class="k8s-arrow" d="M425 108 H505"></path>
    <rect class="k8s-box-green" x="530" y="70" width="95" height="45"></rect><text class="k8s-small" x="560" y="98">v2</text>
    <rect class="k8s-box-pink" x="650" y="105" width="95" height="45"></rect><text class="k8s-small" x="680" y="133">v1</text>
    <rect class="k8s-box-green" x="530" y="155" width="95" height="45"></rect><text class="k8s-small" x="560" y="183">v2</text>
    <rect class="k8s-box-green" x="650" y="155" width="95" height="45"></rect><text class="k8s-small" x="680" y="183">v2</text>
    <text class="k8s-small" x="82" y="172">old ReplicaSet</text><text class="k8s-small" x="548" y="225">new ReplicaSet scales up, old scales down</text>
  </svg>
</div>`,
  statefulsets: `
<div class="k8s-visual" aria-label="StatefulSet identity and storage">
  <svg viewBox="0 0 880 300" role="img">
    ${svgDefs}
    <rect class="k8s-box-green" x="80" y="65" width="140" height="65"></rect><text class="k8s-text" x="115" y="95">mysql-0</text><text class="k8s-small" x="91" y="116">mysql-0.mysql</text>
    <rect class="k8s-box-green" x="365" y="65" width="140" height="65"></rect><text class="k8s-text" x="400" y="95">mysql-1</text><text class="k8s-small" x="376" y="116">mysql-1.mysql</text>
    <rect class="k8s-box-green" x="650" y="65" width="140" height="65"></rect><text class="k8s-text" x="685" y="95">mysql-2</text><text class="k8s-small" x="661" y="116">mysql-2.mysql</text>
    <path class="k8s-arrow" d="M222 98 H360"></path><path class="k8s-arrow" d="M507 98 H645"></path>
    <rect class="k8s-box-warm" x="95" y="175" width="110" height="55"></rect><text class="k8s-small" x="122" y="207">PVC 0</text>
    <rect class="k8s-box-warm" x="380" y="175" width="110" height="55"></rect><text class="k8s-small" x="407" y="207">PVC 1</text>
    <rect class="k8s-box-warm" x="665" y="175" width="110" height="55"></rect><text class="k8s-small" x="692" y="207">PVC 2</text>
    <text class="k8s-small" x="320" y="265">identity and storage stick to the ordinal</text>
  </svg>
</div>`,
  "daemonsets-jobs": `
<div class="k8s-visual"><div class="k8s-grid">
  <div class="k8s-mini-card"><strong>DaemonSet</strong>One agent per node: logs, metrics, CNI, node exporter.</div>
  <div class="k8s-mini-card"><strong>Job</strong>Runs until successful completion; ideal for migrations and batch work.</div>
  <div class="k8s-mini-card"><strong>CronJob</strong>Creates Jobs on a schedule; protect with concurrencyPolicy and history limits.</div>
</div></div>`,
  services: `
<div class="k8s-visual" aria-label="Service traffic flow">
  <svg viewBox="0 0 880 270" role="img">
    ${svgDefs}
    <rect class="k8s-box" x="55" y="95" width="130" height="65"></rect><text class="k8s-text" x="92" y="125">Client</text>
    <path class="k8s-arrow" d="M190 128 H300"></path>
    <rect class="k8s-box-warm" x="305" y="75" width="165" height="105"></rect><text class="k8s-text" x="360" y="110">Service</text><text class="k8s-small" x="337" y="135">stable virtual IP</text><text class="k8s-small" x="333" y="156">endpoints from labels</text>
    <path class="k8s-arrow" d="M475 128 H575"></path>
    <rect class="k8s-box-green" x="600" y="45" width="110" height="45"></rect><text class="k8s-small" x="632" y="73">Pod 1</text>
    <rect class="k8s-box-green" x="600" y="115" width="110" height="45"></rect><text class="k8s-small" x="632" y="143">Pod 2</text>
    <rect class="k8s-box-green" x="600" y="185" width="110" height="45"></rect><text class="k8s-small" x="632" y="213">Pod 3</text>
  </svg>
</div>`,
  ingress: `
<div class="k8s-visual" aria-label="Ingress route table">
  <div class="k8s-grid">
    <div class="k8s-mini-card"><strong>Host rule</strong>api.example.com -> api-service</div>
    <div class="k8s-mini-card"><strong>Path rule</strong>/admin -> admin-service</div>
    <div class="k8s-mini-card"><strong>TLS</strong>Certificate terminates at the controller.</div>
    <div class="k8s-mini-card"><strong>Controller</strong>NGINX, Traefik, HAProxy, cloud ALB.</div>
  </div>
</div>`,
  "network-policies": `
<div class="k8s-visual" aria-label="Network policy allowlist">
  <svg viewBox="0 0 850 260" role="img">
    ${svgDefs}
    <rect class="k8s-box-green" x="80" y="70" width="150" height="60"></rect><text class="k8s-text" x="112" y="105">frontend</text>
    <rect class="k8s-box-warm" x="360" y="70" width="150" height="60"></rect><text class="k8s-text" x="398" y="105">backend</text>
    <rect class="k8s-box-pink" x="80" y="165" width="150" height="60"></rect><text class="k8s-text" x="115" y="200">random pod</text>
    <path class="k8s-arrow" d="M235 100 H355"></path>
    <path class="k8s-dash" d="M235 195 C295 195, 295 100, 355 100"></path>
    <text class="k8s-small" x="262" y="88">allowed by podSelector</text>
    <text class="k8s-small" x="260" y="215">blocked by default deny</text>
  </svg>
</div>`,
  "volumes-pv-pvc": `
<div class="k8s-visual" aria-label="PVC binding flow">
  <svg viewBox="0 0 880 250" role="img">
    ${svgDefs}
    <rect class="k8s-box" x="45" y="85" width="150" height="65"></rect><text class="k8s-text" x="92" y="115">Pod</text><text class="k8s-small" x="76" y="137">mounts claim</text>
    <path class="k8s-arrow" d="M200 118 H300"></path>
    <rect class="k8s-box-green" x="305" y="85" width="150" height="65"></rect><text class="k8s-text" x="355" y="115">PVC</text><text class="k8s-small" x="330" y="137">requests 5Gi RWO</text>
    <path class="k8s-arrow" d="M460 118 H560"></path>
    <rect class="k8s-box-warm" x="565" y="85" width="150" height="65"></rect><text class="k8s-text" x="615" y="115">PV</text><text class="k8s-small" x="593" y="137">actual disk</text>
    <text class="k8s-small" x="280" y="200">StorageClass can dynamically create the PV</text>
  </svg>
</div>`,
  "configmaps-secrets": `
<div class="k8s-visual"><div class="k8s-grid">
  <div class="k8s-mini-card"><strong>ConfigMap</strong>Feature flags, URLs, log levels; safe to inspect.</div>
  <div class="k8s-mini-card"><strong>Secret</strong>Passwords, tokens, TLS keys; encrypt at rest and rotate.</div>
  <div class="k8s-mini-card"><strong>Env vars</strong>Simple injection; requires restart to update process env.</div>
  <div class="k8s-mini-card"><strong>Mounted files</strong>Great for config files; kubelet refreshes projected content.</div>
</div></div>`,
  "hpa-vpa": `
<div class="k8s-visual" aria-label="Autoscaling feedback loop">
  <svg viewBox="0 0 900 260" role="img">
    ${svgDefs}
    <rect class="k8s-box-green" x="55" y="90" width="145" height="70"></rect><text class="k8s-text" x="91" y="122">Metrics</text><text class="k8s-small" x="83" y="145">CPU / custom</text>
    <path class="k8s-arrow" d="M205 125 H305"></path>
    <rect class="k8s-box" x="310" y="75" width="165" height="100"></rect><text class="k8s-text" x="374" y="110">HPA</text><text class="k8s-small" x="345" y="135">desired replicas</text>
    <path class="k8s-arrow" d="M480 125 H590"></path>
    <rect class="k8s-box-warm" x="595" y="65" width="220" height="120"></rect><text class="k8s-text" x="650" y="105">Deployment</text><text class="k8s-small" x="636" y="132">2 pods -> 8 pods</text><text class="k8s-small" x="630" y="154">within min/max bounds</text>
  </svg>
</div>`,
  probes: `
<div class="k8s-visual"><div class="k8s-grid">
  <div class="k8s-mini-card"><strong>Startup</strong>Waits for slow apps before liveness/readiness begin.</div>
  <div class="k8s-mini-card"><strong>Readiness</strong>Controls whether Service sends traffic to this Pod.</div>
  <div class="k8s-mini-card"><strong>Liveness</strong>Restarts stuck containers; keep it conservative.</div>
</div></div>`,
  rbac: `
<div class="k8s-visual" aria-label="RBAC binding model">
  <svg viewBox="0 0 860 250" role="img">
    ${svgDefs}
    <rect class="k8s-box-green" x="60" y="80" width="150" height="65"></rect><text class="k8s-text" x="100" y="112">Subject</text><text class="k8s-small" x="85" y="135">user / group / SA</text>
    <path class="k8s-arrow" d="M215 113 H315"></path>
    <rect class="k8s-box" x="320" y="80" width="150" height="65"></rect><text class="k8s-text" x="350" y="112">Binding</text><text class="k8s-small" x="345" y="135">connects subject</text>
    <path class="k8s-arrow" d="M475 113 H575"></path>
    <rect class="k8s-box-warm" x="580" y="80" width="185" height="65"></rect><text class="k8s-text" x="632" y="112">Role</text><text class="k8s-small" x="612" y="135">verbs on resources</text>
  </svg>
</div>`,
  "pod-security": `
<div class="k8s-visual"><div class="k8s-grid">
  <div class="k8s-mini-card"><strong>Identity</strong>Run as non-root and disable privilege escalation.</div>
  <div class="k8s-mini-card"><strong>Filesystem</strong>Read-only root filesystem plus explicit writable volumes.</div>
  <div class="k8s-mini-card"><strong>Kernel surface</strong>Drop Linux capabilities and avoid host namespaces.</div>
  <div class="k8s-mini-card"><strong>Supply chain</strong>Pin images, scan CVEs, sign artifacts where possible.</div>
</div></div>`,
  helm: `
<div class="k8s-visual" aria-label="Helm render flow">
  <svg viewBox="0 0 880 245" role="img">
    ${svgDefs}
    <rect class="k8s-box" x="60" y="75" width="150" height="70"></rect><text class="k8s-text" x="107" y="107">Chart</text><text class="k8s-small" x="88" y="130">templates</text>
    <rect class="k8s-box-green" x="60" y="160" width="150" height="45"></rect><text class="k8s-small" x="95" y="187">values.yaml</text>
    <path class="k8s-arrow" d="M215 120 H330"></path>
    <rect class="k8s-box-warm" x="335" y="85" width="165" height="75"></rect><text class="k8s-text" x="390" y="118">Helm</text><text class="k8s-small" x="372" y="142">renders manifests</text>
    <path class="k8s-arrow" d="M505 122 H615"></path>
    <rect class="k8s-box-green" x="620" y="75" width="180" height="90"></rect><text class="k8s-text" x="672" y="110">Release</text><text class="k8s-small" x="652" y="135">versioned install</text>
  </svg>
</div>`,
  monitoring: `
<div class="k8s-visual"><div class="k8s-grid">
  <div class="k8s-mini-card"><strong>RED</strong>Rate, errors, duration for services.</div>
  <div class="k8s-mini-card"><strong>USE</strong>Utilization, saturation, errors for resources.</div>
  <div class="k8s-mini-card"><strong>Golden signals</strong>Latency, traffic, errors, saturation.</div>
  <div class="k8s-mini-card"><strong>First alerts</strong>Pod crash loops, node pressure, API errors, disk full.</div>
</div></div>`,
};

const additionalTopics = [
  {
    id: "k8s-scheduling-resources",
    title: "Scheduling & Resource Management",
    description:
      "Requests, limits, QoS classes, taints, tolerations, affinity, and disruption control.",
    icon: "Target",
    sections: [
      {
        id: "requests-limits-qos",
        title: "Requests, Limits & QoS",
        content: `
Kubernetes scheduling is capacity math. **Requests** reserve CPU/memory on a node. **Limits** cap what a container can use at runtime.

${visualStyle}
<div class="k8s-visual" aria-label="Node allocatable capacity">
  <svg viewBox="0 0 900 280" role="img">
    ${svgDefs}
    <rect class="k8s-lane" x="55" y="50" width="790" height="170" rx="14"></rect>
    <text class="k8s-text" x="390" y="82">Node allocatable: 4 CPU / 8Gi</text>
    <rect class="k8s-box-green" x="95" y="115" width="155" height="65"></rect><text class="k8s-small" x="120" y="143">Pod A request</text><text class="k8s-small" x="132" y="163">1 CPU / 1Gi</text>
    <rect class="k8s-box-green" x="280" y="115" width="155" height="65"></rect><text class="k8s-small" x="305" y="143">Pod B request</text><text class="k8s-small" x="317" y="163">2 CPU / 3Gi</text>
    <rect class="k8s-box-warm" x="465" y="115" width="155" height="65"></rect><text class="k8s-small" x="493" y="143">free capacity</text><text class="k8s-small" x="505" y="163">1 CPU / 4Gi</text>
    <rect class="k8s-box-pink" x="650" y="115" width="155" height="65"></rect><text class="k8s-small" x="680" y="143">Pod C rejected</text><text class="k8s-small" x="680" y="163">needs 2 CPU</text>
  </svg>
</div>

### QoS Classes
| QoS | When it happens | Eviction priority |
|-----|-----------------|------------------|
| **Guaranteed** | Every container has equal request and limit for CPU/memory | Last |
| **Burstable** | At least one request/limit is set, but not all equal | Middle |
| **BestEffort** | No requests or limits | First |

### CLI
\`\`\`bash
kubectl top nodes
kubectl top pods -A
kubectl describe node <node-name> | less
kubectl get pod <pod> -o jsonpath='{.status.qosClass}'
kubectl describe pod <pod> | Select-String -Pattern "Requests|Limits|QoS"
\`\`\`
        `,
        code: `apiVersion: v1
kind: Pod
metadata:
  name: api
spec:
  containers:
    - name: api
      image: myorg/api:1.0.0
      resources:
        requests:
          cpu: "250m"
          memory: "256Mi"
        limits:
          cpu: "1"
          memory: "512Mi"`,
        language: "yaml",
      },
      {
        id: "taints-affinity-priority",
        title: "Taints, Tolerations, Affinity & Priority",
        content: `
Use scheduling controls when "any healthy node" is not specific enough.

<div class="k8s-visual">
  <div class="k8s-grid">
    <div class="k8s-mini-card"><strong>nodeSelector</strong>Simple exact-match placement.</div>
    <div class="k8s-mini-card"><strong>Affinity</strong>Expressive preferences and hard requirements.</div>
    <div class="k8s-mini-card"><strong>Taint</strong>Node repels Pods unless they tolerate it.</div>
    <div class="k8s-mini-card"><strong>PriorityClass</strong>Higher-priority Pods can preempt lower-priority Pods.</div>
  </div>
</div>

### Common Patterns
- Put GPU workloads on GPU nodes.
- Keep replicas apart with pod anti-affinity.
- Reserve system or database nodes using taints.
- Use topology spread constraints to avoid one-zone concentration.

### CLI
\`\`\`bash
kubectl label node node-a workload=gpu
kubectl taint nodes node-a dedicated=gpu:NoSchedule
kubectl describe pod <pod> | Select-String -Pattern "Events|FailedScheduling"
kubectl get events --sort-by=.lastTimestamp -A
\`\`\`
        `,
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: gpu-worker
spec:
  replicas: 2
  selector:
    matchLabels:
      app: gpu-worker
  template:
    metadata:
      labels:
        app: gpu-worker
    spec:
      tolerations:
        - key: dedicated
          operator: Equal
          value: gpu
          effect: NoSchedule
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: workload
                    operator: In
                    values: ["gpu"]
      containers:
        - name: worker
          image: myorg/gpu-worker:1.0.0`,
        language: "yaml",
      },
      {
        id: "pdb-disruptions",
        title: "PodDisruptionBudgets & Safe Maintenance",
        content: `
A **PodDisruptionBudget** protects availability during voluntary disruptions such as node drains, upgrades, and cluster maintenance.

<div class="k8s-visual" aria-label="PDB protects minimum available pods">
  <svg viewBox="0 0 860 250" role="img">
    ${svgDefs}
    <rect class="k8s-box-green" x="100" y="75" width="120" height="60"></rect><text class="k8s-small" x="137" y="110">api-1</text>
    <rect class="k8s-box-green" x="260" y="75" width="120" height="60"></rect><text class="k8s-small" x="297" y="110">api-2</text>
    <rect class="k8s-box-green" x="420" y="75" width="120" height="60"></rect><text class="k8s-small" x="457" y="110">api-3</text>
    <rect class="k8s-box-warm" x="600" y="75" width="150" height="60"></rect><text class="k8s-small" x="630" y="103">PDB minAvailable</text><text class="k8s-small" x="660" y="122">2 pods</text>
    <path class="k8s-arrow" d="M545 105 H595"></path>
    <text class="k8s-small" x="230" y="185">Only one voluntary eviction can proceed at a time.</text>
  </svg>
</div>

### CLI
\`\`\`bash
kubectl get pdb -A
kubectl drain <node> --ignore-daemonsets --delete-emptydir-data
kubectl uncordon <node>
\`\`\`
        `,
        code: `apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: api`,
        language: "yaml",
      },
    ],
  },
  {
    id: "k8s-api-extensions",
    title: "API Extensions, CRDs & Operators",
    description:
      "How Kubernetes becomes a platform through custom resources and controllers.",
    icon: "Hexagon",
    sections: [
      {
        id: "crds-custom-resources",
        title: "CRDs & Custom Resources",
        content: `
A **CustomResourceDefinition (CRD)** adds a new resource type to the Kubernetes API. A **Custom Resource (CR)** is an instance of that type.

<div class="k8s-visual" aria-label="CRD extends the Kubernetes API">
  <svg viewBox="0 0 900 260" role="img">
    ${svgDefs}
    <rect class="k8s-box" x="60" y="80" width="180" height="75"></rect><text class="k8s-text" x="108" y="112">CRD</text><text class="k8s-small" x="82" y="135">defines Database kind</text>
    <path class="k8s-arrow" d="M245 118 H350"></path>
    <rect class="k8s-box-green" x="355" y="80" width="180" height="75"></rect><text class="k8s-text" x="410" y="112">API Server</text><text class="k8s-small" x="385" y="135">accepts new object</text>
    <path class="k8s-arrow" d="M540 118 H645"></path>
    <rect class="k8s-box-warm" x="650" y="80" width="180" height="75"></rect><text class="k8s-text" x="702" y="112">Database CR</text><text class="k8s-small" x="692" y="135">spec.replicas: 3</text>
  </svg>
</div>

### Use CRDs For
- Platform abstractions such as \`Database\`, \`KafkaTopic\`, \`Certificate\`, or \`BackupPolicy\`.
- Declarative APIs where users set desired state and controllers reconcile actual state.
- Extending Kubernetes without modifying Kubernetes itself.

### CLI
\`\`\`bash
kubectl get crd
kubectl explain <kind>.spec
kubectl get <custom-resource-kind> -A
kubectl describe <custom-resource-kind> <name>
\`\`\`
        `,
        code: `apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: databases.platform.example.com
spec:
  group: platform.example.com
  scope: Namespaced
  names:
    plural: databases
    singular: database
    kind: Database
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                engine:
                  type: string
                replicas:
                  type: integer`,
        language: "yaml",
      },
      {
        id: "operators-controllers",
        title: "Operators & Controllers",
        content: `
A **controller** watches resources and reconciles reality toward the requested spec. An **Operator** is a controller that encodes operational knowledge for an application.

<div class="k8s-visual" aria-label="Operator reconciliation loop">
  <svg viewBox="0 0 900 300" role="img">
    ${svgDefs}
    <rect class="k8s-box-green" x="70" y="95" width="160" height="70"></rect><text class="k8s-text" x="106" y="126">Custom Resource</text><text class="k8s-small" x="105" y="148">Database desired</text>
    <path class="k8s-arrow" d="M235 130 H340"></path>
    <rect class="k8s-box" x="345" y="80" width="170" height="100"></rect><text class="k8s-text" x="386" y="118">Operator</text><text class="k8s-small" x="374" y="143">watches + reconciles</text>
    <path class="k8s-arrow" d="M520 130 H625"></path>
    <rect class="k8s-box-warm" x="630" y="65" width="190" height="130"></rect><text class="k8s-text" x="682" y="102">Managed App</text><text class="k8s-small" x="665" y="128">StatefulSet, Service</text><text class="k8s-small" x="685" y="150">PVC, backups</text>
    <path class="k8s-dash" d="M720 210 C560 270, 330 260, 150 178"></path>
    <text class="k8s-small" x="360" y="255">status updates show current reality</text>
  </svg>
</div>

### Good Operators Handle
- Install and upgrade workflows.
- Backups and restores.
- Failover and leader election.
- Status conditions and useful events.
- Safe cleanup through finalizers.
        `,
      },
      {
        id: "admission-webhooks",
        title: "Admission Controllers & Webhooks",
        content: `
Admission happens after authentication/authorization and before an object is persisted. It is where clusters enforce policy and mutate defaults.

<div class="k8s-visual"><div class="k8s-grid">
  <div class="k8s-mini-card"><strong>Mutating admission</strong>Adds defaults such as sidecars, labels, or resource requests.</div>
  <div class="k8s-mini-card"><strong>Validating admission</strong>Rejects unsafe or non-compliant objects.</div>
  <div class="k8s-mini-card"><strong>Policy engines</strong>Kyverno, OPA Gatekeeper, ValidatingAdmissionPolicy.</div>
  <div class="k8s-mini-card"><strong>Failure policy</strong>Decide fail-open or fail-closed when webhook is unavailable.</div>
</div></div>

### CLI
\`\`\`bash
kubectl get validatingwebhookconfigurations
kubectl get mutatingwebhookconfigurations
kubectl auth can-i create pods --as system:serviceaccount:dev:builder
kubectl apply --dry-run=server -f manifest.yaml
\`\`\`
        `,
      },
    ],
  },
  {
    id: "k8s-operations-troubleshooting",
    title: "Operations & Troubleshooting",
    description:
      "Debugging Pods, Services, rollouts, events, logs, exec, ephemeral containers, and common failure modes.",
    icon: "Activity",
    sections: [
      {
        id: "kubectl-debugging-flow",
        title: "Kubectl Debugging Flow",
        content: `
Most Kubernetes debugging is a loop: **see symptoms -> inspect object -> read events -> check logs -> test network -> change one thing**.

${visualStyle}
<div class="k8s-visual" aria-label="Debugging decision flow">
  <svg viewBox="0 0 930 310" role="img">
    ${svgDefs}
    <rect class="k8s-box" x="45" y="110" width="140" height="65"></rect><text class="k8s-text" x="83" y="140">Symptom</text><text class="k8s-small" x="72" y="160">not ready / 5xx</text>
    <path class="k8s-arrow" d="M190 143 H270"></path>
    <rect class="k8s-box-green" x="275" y="70" width="150" height="55"></rect><text class="k8s-small" x="305" y="103">kubectl get</text>
    <rect class="k8s-box-green" x="275" y="155" width="150" height="55"></rect><text class="k8s-small" x="297" y="188">kubectl describe</text>
    <path class="k8s-arrow" d="M430 143 H510"></path>
    <rect class="k8s-box-warm" x="515" y="70" width="150" height="55"></rect><text class="k8s-small" x="545" y="103">events</text>
    <rect class="k8s-box-warm" x="515" y="155" width="150" height="55"></rect><text class="k8s-small" x="550" y="188">logs</text>
    <path class="k8s-arrow" d="M670 143 H750"></path>
    <rect class="k8s-box-pink" x="755" y="110" width="140" height="65"></rect><text class="k8s-small" x="783" y="138">fix manifest</text><text class="k8s-small" x="794" y="158">or app</text>
  </svg>
</div>

### High-Value Commands
\`\`\`bash
kubectl get pods -A -o wide
kubectl describe pod <pod> -n <ns>
kubectl logs <pod> -n <ns> --previous
kubectl logs deploy/<deployment> -n <ns> --all-containers=true --tail=100
kubectl exec -it <pod> -n <ns> -- /bin/sh
kubectl debug -it <pod> -n <ns> --image=busybox --target=<container>
kubectl get events -n <ns> --sort-by=.lastTimestamp
kubectl wait --for=condition=ready pod -l app=api -n <ns> --timeout=90s
\`\`\`
        `,
      },
      {
        id: "common-failure-modes",
        title: "Common Failure Modes",
        content: `
| Symptom | Likely cause | First checks |
|---------|--------------|--------------|
| \`ImagePullBackOff\` | Bad image name, tag, registry auth | \`describe pod\`, imagePullSecrets |
| \`CrashLoopBackOff\` | App exits repeatedly, bad command, missing config | \`logs --previous\`, env, probes |
| \`Pending\` | No node capacity, PVC unbound, taints | \`describe pod\`, scheduler events |
| \`OOMKilled\` | Memory limit too low or leak | \`describe pod\`, metrics, app heap |
| Service no traffic | Selector mismatch or readiness failing | \`get endpointslice\`, labels |
| Ingress 404/502 | Rule mismatch or backend service issue | controller logs, service endpoints |

<div class="k8s-visual"><div class="k8s-grid">
  <div class="k8s-mini-card"><strong>Start with events</strong>They often explain scheduling, image, probe, and volume failures.</div>
  <div class="k8s-mini-card"><strong>Compare selectors</strong>Deployment labels, Service selectors, and Pod labels must line up.</div>
  <div class="k8s-mini-card"><strong>Use --previous</strong>Crash loops erase the current container context quickly.</div>
  <div class="k8s-mini-card"><strong>Check readiness</strong>A running Pod may still be removed from Service endpoints.</div>
</div></div>
        `,
      },
      {
        id: "rollouts-and-releases",
        title: "Rollouts, Rollbacks & Release Safety",
        content: `
Deployments keep revision history so you can inspect rollout state and roll back quickly.

### CLI
\`\`\`bash
kubectl rollout status deploy/api -n prod
kubectl rollout history deploy/api -n prod
kubectl rollout history deploy/api -n prod --revision=3
kubectl set image deploy/api api=myorg/api:2.0.0 -n prod
kubectl rollout undo deploy/api -n prod
kubectl rollout restart deploy/api -n prod
\`\`\`

### Release Safety Checklist
- Use readiness probes so traffic waits for healthy Pods.
- Set \`maxUnavailable: 0\` for zero-downtime updates where capacity allows.
- Keep \`revisionHistoryLimit\` for rollback.
- Use canary or blue/green patterns when risk is high.
        `,
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  revisionHistoryLimit: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 0`,
        language: "yaml",
      },
    ],
  },
  {
    id: "k8s-delivery-cluster-lifecycle",
    title: "Delivery & Cluster Lifecycle",
    description:
      "GitOps, Kustomize, environments, upgrades, backup, disaster recovery, and multi-cluster operations.",
    icon: "GitBranch",
    sections: [
      {
        id: "kustomize-gitops",
        title: "Kustomize & GitOps",
        content: `
**Kustomize** overlays environment-specific changes without templating. **GitOps** makes Git the desired-state source and uses a controller such as Argo CD or Flux to reconcile clusters.

${visualStyle}
<div class="k8s-visual" aria-label="GitOps reconciliation">
  <svg viewBox="0 0 920 280" role="img">
    ${svgDefs}
    <rect class="k8s-box" x="55" y="90" width="150" height="70"></rect><text class="k8s-text" x="105" y="122">Git</text><text class="k8s-small" x="83" y="145">manifests/overlays</text>
    <path class="k8s-arrow" d="M210 125 H320"></path>
    <rect class="k8s-box-green" x="325" y="75" width="190" height="100"></rect><text class="k8s-text" x="382" y="112">GitOps Controller</text><text class="k8s-small" x="373" y="138">detects drift</text><text class="k8s-small" x="360" y="158">applies desired state</text>
    <path class="k8s-arrow" d="M520 125 H630"></path>
    <rect class="k8s-box-warm" x="635" y="90" width="180" height="70"></rect><text class="k8s-text" x="675" y="122">Cluster</text><text class="k8s-small" x="670" y="145">actual resources</text>
  </svg>
</div>

### CLI
\`\`\`bash
kubectl kustomize overlays/prod
kubectl apply -k overlays/prod
kubectl diff -k overlays/prod
argocd app sync payments
flux reconcile kustomization apps
\`\`\`
        `,
        code: `# overlays/prod/kustomization.yaml
resources:
  - ../../base
patches:
  - path: deployment-patch.yaml
images:
  - name: myorg/api
    newTag: "2.3.1"`,
        language: "yaml",
      },
      {
        id: "cluster-upgrades-backup-dr",
        title: "Upgrades, Backup & Disaster Recovery",
        content: `
Production Kubernetes is not only deploying apps; it is protecting cluster state and planning safe upgrades.

<div class="k8s-visual"><div class="k8s-grid">
  <div class="k8s-mini-card"><strong>etcd backup</strong>The source of cluster state for self-managed clusters.</div>
  <div class="k8s-mini-card"><strong>Velero</strong>Backs up cluster resources and persistent volumes.</div>
  <div class="k8s-mini-card"><strong>Upgrade order</strong>Control plane, nodes, add-ons, then workloads.</div>
  <div class="k8s-mini-card"><strong>Version skew</strong>Respect supported kubelet/API server skew.</div>
</div></div>

### CLI
\`\`\`bash
kubectl version --short
kubectl get componentstatuses
kubectl get nodes
kubectl drain <node> --ignore-daemonsets --delete-emptydir-data
kubectl uncordon <node>
velero backup create prod-$(Get-Date -Format yyyyMMdd)
velero restore get
\`\`\`

### DR Questions To Answer
- What is the recovery time objective (RTO)?
- What is the recovery point objective (RPO)?
- Are persistent volumes included in backups?
- Can you rebuild the cluster from Git plus secrets backup?
        `,
      },
      {
        id: "multi-cluster-service-mesh",
        title: "Multi-Cluster & Service Mesh",
        content: `
Use multi-cluster when you need regional isolation, compliance boundaries, disaster recovery, or organizational separation. Use a service mesh when traffic policy, mTLS, retries, telemetry, and identity need to be consistent across services.

<div class="k8s-visual"><div class="k8s-grid">
  <div class="k8s-mini-card"><strong>Multi-cluster</strong>More isolation and resilience, more operational complexity.</div>
  <div class="k8s-mini-card"><strong>Service mesh</strong>Sidecars or ambient data plane manage service-to-service traffic.</div>
  <div class="k8s-mini-card"><strong>mTLS</strong>Encrypts and authenticates east-west traffic.</div>
  <div class="k8s-mini-card"><strong>Traffic policy</strong>Retries, timeouts, circuit breaking, canary splits.</div>
</div></div>

### Common Tools
| Need | Tools |
|------|-------|
| GitOps across clusters | Argo CD, Flux |
| Mesh | Istio, Linkerd, Consul |
| Multi-cluster networking | Cilium Cluster Mesh, Submariner |
| Fleet policy | Kyverno, Gatekeeper, Rancher, ACM |
        `,
      },
    ],
  },
  {
    id: "k8s-cli-cheatsheet",
    title: "Kubectl & YAML Cheat Sheet",
    description:
      "Everyday Kubernetes commands, YAML patterns, jsonpath, dry runs, and explain.",
    icon: "Code",
    sections: [
      {
        id: "kubectl-everyday",
        title: "Everyday Kubectl Commands",
        content: `
The fastest way to get good at Kubernetes is to become fluent with \`kubectl get\`, \`describe\`, \`logs\`, \`exec\`, \`apply\`, \`diff\`, and \`explain\`.

${visualStyle}
<div class="k8s-visual"><div class="k8s-grid">
  <div class="k8s-mini-card"><strong>Read</strong>get, describe, logs, top, events</div>
  <div class="k8s-mini-card"><strong>Change</strong>apply, edit, patch, scale, rollout</div>
  <div class="k8s-mini-card"><strong>Verify</strong>wait, diff, auth can-i, explain</div>
  <div class="k8s-mini-card"><strong>Debug</strong>exec, port-forward, debug, cp</div>
</div></div>
        `,
        code: `# Contexts and namespaces
kubectl config get-contexts
kubectl config use-context <context>
kubectl config set-context --current --namespace=prod

# Read cluster state
kubectl get all -n prod
kubectl get pods -n prod -o wide
kubectl describe deploy api -n prod
kubectl get events -n prod --sort-by=.lastTimestamp

# Apply safely
kubectl diff -f app.yaml
kubectl apply --dry-run=server -f app.yaml
kubectl apply -f app.yaml

# Debug traffic
kubectl port-forward svc/api 8080:80 -n prod
kubectl exec -it deploy/api -n prod -- /bin/sh
kubectl logs deploy/api -n prod --tail=100 -f`,
        language: "bash",
      },
      {
        id: "jsonpath-explain-patch",
        title: "JsonPath, Explain, Patch & Server-Side Apply",
        content: `
\`kubectl explain\` teaches the API shape. JsonPath extracts exact fields. Patch is useful for tiny targeted changes, while server-side apply helps multiple tools own different fields.

### Practical Examples
\`\`\`bash
kubectl explain deployment.spec.strategy
kubectl get pods -A -o jsonpath='{range .items[*]}{.metadata.namespace}{"\\t"}{.metadata.name}{"\\t"}{.status.phase}{"\\n"}{end}'
kubectl patch deploy api -p '{"spec":{"replicas":5}}'
kubectl apply --server-side -f app.yaml --field-manager=platform-team
\`\`\`

### When To Use What
| Command | Use it for |
|---------|------------|
| \`apply\` | Declarative desired state |
| \`create\` | Quick imperative creation or generated YAML |
| \`patch\` | Small targeted edits |
| \`replace\` | Full object replacement |
| \`edit\` | Emergency manual edits, not long-term workflow |
        `,
      },
      {
        id: "minimal-manifest-patterns",
        title: "Minimal Manifest Patterns",
        content: `
Good manifests are boring, explicit, and operationally friendly. Include labels, resource requests, health checks, and security context early.
        `,
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  labels:
    app.kubernetes.io/name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app.kubernetes.io/name: api
  template:
    metadata:
      labels:
        app.kubernetes.io/name: api
    spec:
      securityContext:
        runAsNonRoot: true
      containers:
        - name: api
          image: myorg/api:1.0.0
          ports:
            - containerPort: 8080
          readinessProbe:
            httpGet:
              path: /ready
              port: 8080
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi`,
        language: "yaml",
      },
    ],
  },
];

const appendVisuals = (section) => {
  const visual = visualSnippets[section.id];
  if (!visual) return section;
  return {
    ...section,
    content: `${section.content}

### Visual Mental Model
${visual}
`,
  };
};

const enhanceKubernetesTopics = (topics) =>
  topics.map((topic) => ({
    ...topic,
    sections: topic.sections.map(appendVisuals),
  }));

export const topics = [...enhanceKubernetesTopics(baseTopics), ...additionalTopics];
