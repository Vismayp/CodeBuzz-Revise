export const topics = [
  {
    id: "n8n-intro",
    title: "Introduction to n8n",
    description:
      "The extendable workflow automation tool. Connect anything to everything.",
    icon: "Zap",
    sections: [
      {
        id: "what-is-n8n",
        title: "What is n8n?",
        content: `
**n8n** (nodemation) is a robust, extensible, and open-source workflow automation tool. Unlike others, n8n uses potential **fair-code** licensing, allowing you to self-host and customize it.

**Key Features:**
*   **Visual Workflow Editor**: Drag and drop nodes to build complex automations.
*   **Self-Hostable**: Keep your data secure on your own servers.
*   **Node-Based**: 200+ native integrations (nodes) for popular services (Google Sheets, Slack, Github, standard HTTP, etc.).
*   **Developer Friendly**: Use JavaScript/TypeScript for complex logic and data manipulation.
        `,
        image: "/images/n8n_workflow.png",
      },
      {
        id: "core-concepts",
        title: "Core Concepts",
        content: `
An n8n workflow consists of:
1.  **Nodes**: The building blocks.
    *   **Trigger Nodes**: Start the workflow (e.g., "On Webhook", "On Schedule", "On New Email").
    *   **Regular Nodes**: Perform an action (e.g., "Send Slack Message", "Write to Database") or transform data.
2.  **Connections**: The lines connecting nodes, representing the flow of execution and data.
3.  **Data (JSON)**: Data flows between nodes as JSON objects.
        `,
        diagram: `
graph LR
    Trigger((Trigger)) -->|JSON Data| Node1[Action Node]
    Node1 -->|JSON Data| Logic{If Logic}
    Logic -->|True| Node2[Success Action]
    Logic -->|False| Node3[Error Handler]
    
    style Trigger fill:#ff6d5a,stroke:#333,stroke-width:2px
    style Node1 fill:#4d82c2,stroke:#333,stroke-width:2px
    style Logic fill:#f0c674,stroke:#333,stroke-width:2px
        `,
      },
    ],
  },
  {
    id: "n8n-installation",
    title: "Self-Hosting with Docker",
    description:
      "Step-by-step guide to hosting n8n on your own server using Docker.",
    icon: "Server",
    sections: [
      {
        id: "prerequisites",
        title: "Prerequisites",
        content: `
Before you begin, ensure you have:
*   A server (VPS) with **Docker** and **Docker Compose** installed.
*   A domain name pointing to your server IP (e.g., \`n8n.yourdomain.com\`).
*   Basic knowledge of terminal commands.
        `,
      },
      {
        id: "docker-compose-setup",
        title: "Docker Compose Setup",
        content: `
We will use \`docker-compose\` to set up n8n interactively with Traefik (as a reverse proxy for SSL) or just a simple Nginx setup. Below is a standard standalone setup.

**Directory Structure:**
\`\`\`bash
/n8n
├── docker-compose.yml
├── .env
\`\`\`
        `,
        image: "/images/n8n_docker.png",
      },
      {
        id: "docker-compose-file",
        title: "docker-compose.yml",
        content: `
Create a \`docker-compose.yml\` file:

\`\`\`yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=\${DOMAIN_NAME}
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=https://\${DOMAIN_NAME}/
      - GENERIC_TIMEZONE=\${TIMEZONE}
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
\`\`\`

**Note**: For persistent data, we map a volume \`n8n_data\`. In production, you might want to use a **PostgreSQL** database for better performance than the default SQLite.
        `,
      },
      {
        id: "running-n8n",
        title: "Running the Container",
        content: `
1.  Create an \`.env\` file with your configuration:
    \`\`\`bash
    DOMAIN_NAME=n8n.example.com
    TIMEZONE=Asia/Kolkata
    \`\`\`

2.  Start the service:
    \`\`\`bash
    docker-compose up -d
    \`\`\`

3.  Access your instance at \`http://localhost:5678\` (or your domain if configured with a proxy).
        `,
      },
    ],
  },
  {
    id: "n8n-nodes",
    title: "Nodes & Workflow Building",
    description: "Deep dive into Triggers, Actions, and Logic nodes.",
    icon: "Network",
    sections: [
      {
        id: "trigger-nodes",
        title: "Trigger Nodes",
        content: `
Every workflow starts here.
*   **Webhook**: Listens for HTTP requests (GET, POST). Great for connecting to custom apps or webhooks.
*   **Schedule (Cron)**: Runs at specific times (e.g., "Every Monday at 9am").
*   **Poll**: Checks an external service for changes periodically.
        `,
        diagram: `
sequenceDiagram
    participant Ext as External App
    participant WH as Webhook Node
    participant WF as Workflow
    
    Ext->>WH: POST /webhook/path
    WH->>WF: Trigger Execution
    WF->>WF: Process Data
        `,
      },
      {
        id: "logic-functions",
        title: "Logic & Flow Control",
        content: `
Control how data moves.
*   **IF Node**: Splits traffic based on conditions (e.g., \`price > 100\`).
*   **Switch Node**: Multiple routings based on value.
*   **Merge Node**: Combines data from multiple branches.
*   **Loop Only**: (Previously SplitInBatches) Iterates over items.
        `,
      },
      {
        id: "code-node",
        title: "The Code Node",
        content: `
The **Code Node** is n8n's superpower. It allows you to write JavaScript to transform data arbitrarily.

n8n passes data as an array of objects.
\`\`\`javascript
// Example: Add a 'timestamp' field to every item
for (const item of items) {
  item.json.timestamp = new Date().toISOString();
}
return items;
\`\`\`
        `,
        image: "/images/n8n_data_flow.png",
      },
    ],
  },
  {
    id: "n8n-advanced",
    title: "Advanced Scenarios",
    description: "Error handling, expressions, and tips.",
    icon: "Cpu",
    sections: [
      {
        id: "expressions",
        title: "Expressions",
        content: `
Almost every field in n8n can be dynamic using **Expressions**.
*   Syntax: \`{{ $node["Node Name"].json["fieldName"] }}\`
*   Use it to map output from Node A to input of Node B.
        `,
      },
      {
        id: "error-handling",
        title: "Error Handling",
        content: `
Production workflows need robust error handling.
1.  **Error Trigger**: A special trigger node that runs when a workflow crashes.
2.  **Continue On Fail**: Toggle this setting on a node to prevent the workflow from stopping if that single node fails.
        `,
      },
    ],
  },
];
