export const topics = [
  {
    id: "system-design",
    title: "7.1 Model Serving & Latency",
    description: "Designing scalable AI backends.",
    icon: "Server",
    sections: [
      {
        id: "serving-strategies",
        title: "Serving Strategies",
        content: `
### API-Based vs Self-Hosted
*   **API Wrapper:** (e.g., wrapper around OpenAI).
    *   *Bottleneck:* External API latency & Rate Limits.
    *   *Scale:* Easy (stateless).
*   **Self-Hosted:** (e.g., vLLM serving Llama 3).
    *   *Bottleneck:* GPU VRAM & Compute.
    *   *Scale:* Hard (Auto-scaling GPU groups).

### Optimization Techniques
1.  **Streaming (TTFT - Time To First Token):**
    *   Don't wait for the full response. Send tokens as generated.
    *   Crucial for UX (User feels system is fast).
2.  **Continuous Batching:**
    *   Batching requests dynamically to saturate GPU.
    *   Frameworks: **vLLM**, **TGI (Text Generation Inference)**.
3.  **Quantization:**
    *   Running models in 4-bit (INT4) instead of 16-bit.
    *   Reduces VRAM usage by 3-4x with minimal accuracy loss.
        `,
      },
      {
        id: "caching",
        title: "7.3 Caching",
        content: `
LLM calls are expensive and slow. Cache aggressively.

### Levels of Caching
1.  **Prompt Cache (Exact Match):**
    *   If user asks "What is the capital of France?" -> Return stored answer.
    *   *Tool:* Redis.
2.  **Semantic Cache (Similarity Match):**
    *   If user asks "Capital of France?" vs "France capital city" -> They mean the same.
    *   *Mechanism:* Embed query -> Check vector DB for close existing queries -> Return cached answer.
    *   *Lib:* GPTCache.
        `,
        code: `import redis

r = redis.Redis(host='localhost', port=6379, db=0)

def get_response(prompt):
    # Check Cache
    cached = r.get(prompt)
    if cached:
        return cached.decode('utf-8')
    
    # Call LLM
    response = llm.invoke(prompt)
    
    # Store Cache (TTL 1 hour)
    r.setex(prompt, 3600, response)
    return response`,
      },
    ],
  },
  {
    id: "async-processing",
    title: "7.4 Async & Architecture",
    description: "Handling long-running jobs.",
    icon: "Activity",
    sections: [
      {
        id: "async-jobs",
        title: "Async Processing",
        content: `
Document ingestion (PDF parsing, Embedding) takes time. Don't block the HTTP request.

**Architecture:**
1.  **Client** uploads PDF.
2.  **API** saves file, pushes "Job ID" to Queue (Redis/RabbitMQ), returns "202 Accepted".
3.  **Worker** picks up job, processes PDF, updates DB.
4.  **Client** polls status or receives Webhook.

**Tools:** Celery (Python), BullMQ (Node), ARQ.
        `,
        diagram: `graph LR
    Client --Upload--> API
    API --Push Job--> Queue[(Redis)]
    API --202 ID--> Client
    Worker --Pop Job--> Queue
    Worker --Process--> DB[(Vector DB)]
    Client --Poll Status--> API
    API --Check--> DB`,
      },
    ],
  },
  {
    id: "mlops",
    title: "13. MLOps & Deployment",
    description: "Bringing models to production reliably.",
    icon: "Rocket",
    sections: [
      {
        id: "mlops-basics",
        title: "MLOps Basics",
        content: `
### The Versioning Trinity
In software, we version Code (Git). In AI, we must version:
1.  **Code:** The model architecture / inference logic.
2.  **Data:** The training dataset (DVC, LakeFS).
3.  **Model:** The weights (MLflow, HuggingFace Hub).
4.  **Prompts:** Prompts are code. Use Prompt Registries.

### CI/CD for AI
*   **Gate 1:** Linting & Unit Tests.
*   **Gate 2:** Evaluation (Eval) Set.
    *   Before deploying, run the model on 100 "Golden Questions".
    *   If accuracy drops < 95%, fail the build.
    *   *Tools:* Ragas, DeepEval.
        `,
      },
      {
        id: "monitoring",
        title: "Monitoring",
        content: `
It's not enough if the API is up (200 OK). Is the model smart?

### Metrics
1.  **Latency & Throughput:** Standard API metrics.
2.  **Token Usage:** Cost tracking.
3.  **Prompt Drift:** Are users asking things we didn't expect?
4.  **Hallucination Rate:** Measuring response quality (often using another LLM as a judge).
        `,
      },
    ],
  },
];
