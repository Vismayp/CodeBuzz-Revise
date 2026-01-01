export const topics = [
  {
    id: "introduction",
    title: "Introduction",
    description: "Foundational concepts of Apache Kafka and Event Streaming.",
    icon: "BookOpen",
    sections: [
      {
        id: "what-is-kafka",
        title: "What is Apache Kafka?",
        content: `
Apache Kafka is an **open-source distributed event streaming platform** used by thousands of companies for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications.

Initially developed at **LinkedIn** and later open-sourced through the Apache Software Foundation, Kafka is designed to handle trillions of events a day.

### Core Capabilities:
1. **Publish & Subscribe**: Real-time event streaming.
2. **Store**: Durable and fault-tolerant storage of event streams.
3. **Process**: Real-time processing of events (Kafka Streams).

### Why do we need Kafka?
Traditional messaging systems (like RabbitMQ) often struggle with mass scale and persistence. Kafka treats data as a **continuous stream of events** rather than isolated messages.
        `,
        diagram: `
graph LR
    P1["Producer A"] --> K["Kafka Cluster"]
    P2["Producer B"] --> K
    K --> C1["Consumer X"]
    K --> C2["Consumer Y"]
    K --> C3["Consumer Z"]
    style K fill:#8b5cf6,stroke:#fff,stroke-width:2px
        `,
      },
      {
        id: "event-streaming",
        title: "The Concept of Event Streaming",
        content: `
Event streaming is the practice of capturing data in real-time from event sources like databases, sensors, mobile devices, cloud services, and software applications in the form of **streams of events**.

An **Event** records the fact that "something happened" in the world or in your business. It is also called a record or message.

### Anatomy of an Event:
- **Key**: (Optional) Used for partitioning.
- **Value**: The data payload (e.g., Order details).
- **Timestamp**: When the event occurred.
- **Headers**: (Optional) Key-value pairs for metadata.
        `,
        code: `// Conceptual example of an Event
{
  "key": "user_123",
  "value": {
    "action": "purchase",
    "item": "laptop",
    "amount": 1200
  },
  "timestamp": 1672531200000,
  "headers": {
    "version": "1.0",
    "source": "mobile-app"
  }
}`,
      },
    ],
  },
  {
    id: "architecture",
    title: "Cluster Architecture",
    description: "Deep dive into Brokers, Controllers, and Zookeeper/KRaft.",
    icon: "Server",
    sections: [
      {
        id: "brokers-and-clusters",
        title: "Brokers and Clusters",
        content: `
A Kafka cluster is composed of multiple servers called **Brokers**. Each broker is a stateless server that stores a portion of the total data.

- **Distributed**: Kafka is designed to run across multiple servers for horizontal scaling.
- **Fault-Tolerant**: Data is replicated across multiple brokers. If one fails, another takes over.
- **High Throughput**: Capable of handling millions of messages per second.

### The Controller
In every cluster, one broker acts as the **Controller**. It is responsible for managing the states of partitions and replicas and performing administrative tasks like re-assigning partitions.
        `,
        image: "/kafka_cluster_architecture_1767288124659.png", // Using the generated image
        diagram: `
graph TD
    subgraph Cluster [Kafka Cluster]
        B1["Broker 1"]
        B2["Broker 2 (Controller)"]
        B3["Broker 3"]
    end
    ZK["Zookeeper / KRaft"] --- Cluster
    P["Producers"] --> Cluster
    C["Consumers"] --> Cluster
        `,
      },
      {
        id: "zookeeper-vs-kraft",
        title: "Zookeeper vs KRaft",
        content: `
### Zookeeper (Legacy)
Kafka historically used Zookeeper to store metadata (broker list, topic configs, partition locations). This created a "split-brain" potential and scaling bottlenecks.

### KRaft (Modern Kafka)
Introduced in KIP-500, **KRaft** (Kafka Raft) allows Kafka to manage its own metadata without Zookeeper.
- **Simplified Operations**: One less system to manage.
- **Faster Recovery**: Controller failover happens in milliseconds.
- **Scalability**: Can handle millions of partitions easily.
        `,
      },
    ],
  },
  {
    id: "topics-partitions",
    title: "Topics & Partitions",
    description: "How data is organized and distributed in Kafka.",
    icon: "Database",
    sections: [
      {
        id: "topics",
        title: "Topics & Offsets",
        content: `
A **Topic** is a particular stream of data (similar to a table in a database). 
- You can have as many topics as you want.
- Topics are identified by their name.
- Topics are split into **Partitions**.

### Offsets
Each message within a partition is assigned an incremental id, called an **Offset**.
- Offsets only have meaning within a specific partition.
- Order is guaranteed **only within a partition**, not across the whole topic.
- Data is **immutable**: once written, it cannot be changed.
        `,
        diagram: `
graph LR
    subgraph Topic ["Topic: Orders"]
        direction TB
        subgraph P0 ["Partition 0"]
            m0["0"] --- m1["1"] --- m2["2"] --- m3["3"]
        end
        subgraph P1 ["Partition 1"]
            n0["0"] --- n1["1"] --- n2["2"]
        end
    end
        `,
      },
      {
        id: "replication",
        title: "Topic Replication",
        content: `
To ensure high availability, Kafka replicates partitions across multiple brokers.

- **Replication Factor**: Usually set to 3.
- **Leader**: At any time, only one broker is the leader for a partition. All reads/writes go through the leader.
- **Followers**: Other brokers replicate the data from the leader.
- **ISR (In-Sync Replicas)**: Followers that are caught up with the leader.

If a leader fails, one of the ISRs is elected as the new leader.
        `,
      },
    ],
  },
  {
    id: "producers",
    title: "Producers Deep Dive",
    description: "How data is sent to Kafka effectively.",
    icon: "Zap",
    sections: [
      {
        id: "producer-logic",
        title: "Producer Knowledge",
        content: `
Producers write data to topics. They automatically know which broker is the leader for a partition and send data there.

### Load Balancing (Partitioning Strategy)
- **No Key**: Data is sent round-robin to partitions.
- **With Key**: Data with the same key always goes to the same partition (Hash-based). Perfect for stateful processing.

### Producer Acknowledgements (acks)
- **acks=0**: Producer doesn't wait for ack (highest speed, potential data loss).
- **acks=1**: Producer waits for leader ack (limited data loss if leader fails before replication).
- **acks=all**: Producer waits for leader + all ISR acks (no data loss, slowest).
        `,
        code: `// Kafka Producer Config
const producer = kafka.producer({
  allowAutoTopicCreation: false,
  transactionTimeout: 30000,
  idempotent: true // Guaranteed exactly-once delivery
})`,
      },
      {
        id: "idempotent-producers",
        title: "Idempotent Producers",
        content: `
An **Idempotent Producer** ensures that even if a producer sends the same message twice (due to network retries), Kafka will only commit it once.

It prevents duplicate data in the log.
- Enabled by setting \`enable.idempotence=true\`.
- Requirement: \`acks=all\`, \`max.in.flight.requests.per.connection <= 5\`, and \`retries > 0\`.
        `,
      },
    ],
  },
  {
    id: "consumers",
    title: "Consumers & Groups",
    description: "Reading data and scaling with Consumer Groups.",
    icon: "Users",
    sections: [
      {
        id: "consumer-groups",
        title: "Consumer Groups",
        content: `
Consumers read data from Kafka. To scale reading, we use **Consumer Groups**.

- Each consumer in a group reads from a set of exclusive partitions.
- If you have more consumers than partitions, some consumers will be idle.
- If a consumer fails, partitions are re-assigned to healthy consumers (**Rebalancing**).

### Offset Management
Kafka stores the current offset of a consumer group in a special internal topic called \`__consumer_offsets\`.
        `,
        diagram: `
graph TD
    subgraph Group ["Consumer Group: App_Service"]
        C1["Consumer 1"]
        C2["Consumer 2"]
    end
    subgraph Topic ["Topic: Orders"]
        P0["Partition 0"]
        P1["Partition 1"]
        P2["Partition 2"]
    end
    P0 --> C1
    P1 --> C1
    P2 --> C2
        `,
      },
    ],
  },
  {
    id: "advanced-concepts",
    title: "Advanced Kafka",
    description: "Log Compaction, Retention policies, and the Kafka Ecosystem.",
    icon: "Layers",
    sections: [
      {
        id: "log-compaction",
        title: "Log Compaction",
        content: `
**Log Compaction** is a mechanism where Kafka ensures that it always retains at least the last known value for each message key within the log of data for a single topic partition.

- Useful for restoring state after a crash.
- Tail of the log is a standard Kafka log.
- Head of the log is compacted (old values for keys are removed).
        `,
        diagram: `
graph LR
    subgraph Original ["Original Log"]
        K1_V1["K1:V1"] --- K2_V1["K2:V1"] --- K1_V2["K1:V2"] --- K3_V1["K3:V1"]
    end
    subgraph Compacted ["Compacted Log"]
        K2_V1_C["K2:V1"] --- K1_V2_C["K1:V2"] --- K3_V1_C["K3:V1"]
    end
    Original -->|Compact| Compacted
        `,
      },
      {
        id: "retention-policies",
        title: "Retention Policies",
        content: `
Kafka allows you to configure how long it should keep data.

1. **Time-based**: \`log.retention.hours\` (Default: 168 hours / 7 days).
2. **Size-based**: \`log.retention.bytes\` (Retain data until the partition reaches a certain size).
3. **Compaction**: Retain latest values for keys.
        `,
      },
      {
        id: "ecosystem",
        title: "Kafka Ecosystem",
        content: `
Kafka is more than just a broker.
- **Kafka Connect**: A tool for scalably and reliably streaming data between Kafka and other data systems (S3, ElasticSearch, Postgres).
- **Kafka Streams**: A client library for building applications and microservices, where the input and output data are stored in Kafka clusters.
- **ksqlDB**: The streaming SQL engine for Apache Kafka.
        `,
      },
    ],
  },
  {
    id: "node-implementation",
    title: "Node.js Implementation",
    description: "Practical examples using KafkaJS.",
    icon: "Code",
    sections: [
      {
        id: "setup-kafkajs",
        title: "Setting up KafkaJS",
        content: `
**KafkaJS** is the most popular, modern Kafka client for Node.js. It's written in TypeScript and has no native dependencies.

### Installation
\`\`\`bash
npm install kafkajs
\`\`\`
        `,
        code: `const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})`,
      },
      {
        id: "producer-example",
        title: "Kafka Producer in Node.js",
        content: `
Sending messages to a Kafka topic.
        `,
        code: `const runProducer = async () => {
  const producer = kafka.producer()
  await producer.connect()
  
  await producer.send({
    topic: 'test-topic',
    messages: [
      { key: 'user1', value: 'Hello Kafka!' },
      { key: 'user2', value: 'Streaming data...' }
    ],
  })

  await producer.disconnect()
}

runProducer().catch(console.error)`,
      },
      {
        id: "consumer-example",
        title: "Kafka Consumer in Node.js",
        content: `
Subscribing and receiving messages.
        `,
        code: `const runConsumer = async () => {
  const consumer = kafka.consumer({ groupId: 'test-group' })
  await consumer.connect()
  
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
        key: message.key.toString(),
        offset: message.offset,
      })
    },
  })
}

runConsumer().catch(console.error)`,
      },
      {
        id: "admin-api",
        title: "Kafka Admin API",
        content: `
The **Admin API** allows you to programmatically manage your Kafka cluster, such as creating topics, modifying configs, and checking offsets.
        `,
        code: `const runAdmin = async () => {
  const admin = kafka.admin()
  await admin.connect()
  
  console.log('Creating topics...')
  await admin.createTopics({
    topics: [{
      topic: 'orders-topic',
      numPartitions: 3,
      replicationFactor: 1 // For local development
    }]
  })
  
  const topics = await admin.listTopics()
  console.log('Available topics:', topics)

  await admin.disconnect()
}

runAdmin().catch(console.error)`,
      },
      {
        id: "error-handling",
        title: "Error Handling & Retries",
        content: `
Kafkajs handles retries automatically for many errors, but you should still implement your own logic for business-critical operations.

### Producer Retries
You can configure the number of retries and the backoff period.

### Consumer Heartbeats
If a consumer takes too long to process a message (\`eachMessage\`), Kafka might think it's dead and trigger a rebalance. Use \`heartbeat()\` to signal that the consumer is still alive.
        `,
        code: `// Advanced Consumer with Heartbeat
await consumer.run({
  eachMessage: async ({ topic, partition, message, heartbeat }) => {
    // Perform heavy task
    await longRunningTask(message)
    
    // Tell Kafka we are still alive
    await heartbeat()
    
    console.log('Processed message')
  },
})`,
      },
    ],
  },
];
