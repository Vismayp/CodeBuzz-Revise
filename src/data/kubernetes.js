// ═══════════════════════════════════════════════════════════════
// KUBERNETES — COMPLETE GUIDE (Beginner → Interview Ready)
// ═══════════════════════════════════════════════════════════════

export const topics = [
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
