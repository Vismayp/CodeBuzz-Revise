export const topics = [
  {
    id: "core-concepts",
    title: "5.1 Core Concepts (Must Master)",
    description:
      "Deep dive into Attention mechamisms and Transformers architecture.",
    icon: "Brain",
    sections: [
      {
        id: "attention-mechanism",
        title: "Attention Mechanism & The Need for Transformers",
        content: `
### Why RNNs Fail for Long Context
Recurrent Neural Networks (RNNs) and LSTMs process data sequentially (token by token). This creates a "bottleneck" where the hidden state must compress all previous history.
*   **The Vanishing Gradient Problem:** Gradients disappear over long sequences, making it hard to learn long-range dependencies.
*   **Sequential Processing:** Impossible to parallelize (Slow training).
*   **Forgetting:** Information from the start of a sentence is often lost by the end.

### Self-Attention Intuition
Instead of processing sequentially, **Self-Attention** looks at all tokens in the sequence *at once* and calculates how relevant every token is to every other token.
"The animal didn't cross the street because **it** was too tired."
Self-attention helps the model understand that "**it**" refers to "**animal**", not "street".

### The QKV (Query, Key, Value) Metaphor
Imagine searching for a book in a library:
1.  **Query (Q):** What you are looking for (e.g., "Space exploration").
2.  **Key (K):** The label on the book spine (e.g., "Astronomy").
3.  **Value (V):** The actual content of the book.

The mechanism computes a match score (dot product) between your **Query** and all **Keys**, determining how much **Value** to retrieve from each.

### Scaled Dot-Product Attention
The mathematical core:
$$ Attention(Q, K, V) = softmax(\\frac{QK^T}{\\sqrt{d_k}})V $$
*   **$QK^T$:** Similarity scores between queries and keys.
*   **$\\sqrt{d_k}$:** Scaling factor to prevent vanishing gradients in softmax.
*   **Softmax:** Normalizes scores to probabilities (sum to 1).
*   **V:** Weighted sum of values based on attention scores.

### Multi-Head Attention
Why one head isn't enough?
Different heads learn, different relationships:
*   Head 1: Focuses on Subject-Verb relationship ("Animal... cross").
*   Head 2: Focuses on Adjective-Noun relationship ("tired... animal").
*   Head 3: Focuses on Punctuation.
These are concatenated and projected linearly.
        `,
        diagram: `graph TD
    subgraph Attention_Head
    Q[Query] --> MatMul1["MatMul Q x K^T"]
    K[Key] --> MatMul1
    MatMul1 --> ScaleNode["Scale (1/sqrt dk)"]
    ScaleNode --> Softmax
    Softmax --> MatMul2["MatMul x V"]
    V[Value] --> MatMul2
    MatMul2 --> Output
    end`,
      },
      {
        id: "transformers-arch",
        title: "Transformers Architecture",
        content: `
### The Encoder-Decoder Block
The original Transformer (2017) had both:
1.  **Encoder:** Processes input & understands context (e.g., used in BERT).
2.  **Decoder:** Generates output token-by-token (e.g., used in GPT).

### Key Components
1.  **Token Embeddings:** Converts words (indices) into dense vectors (e.g., size 512).
2.  **Positional Encoding:** Since Transformers process everything in parallel, they have no concept of "order". We literally *add* sine/cosine waves to embeddings to give them position information.
3.  **Feed-Forward Networks (FFN):** A simple MLP applied to each position independently.
4.  **Residual Connections (Skip connections):** $x + Layer(x)$. Allows gradients to flow through deep networks easily.
5.  **Layer Normalization:** Stabilizes training by normalizing inputs across feature dimensions.

### Why Transformers Scale?
*   **Parallelism:** Unlike RNNs, the entire sequence is fed at once. TPUs/GPUs love this.
*   **Direct Long-Range Dep:** Distance between any two words is always 1 step (Attention), vs $N$ steps in RNNs.

### Context Length
The context window (e.g., 128k tokens) is limited by the $O(N^2)$ complexity of attention. Doubling context length quadruples compute/memory.
        `,
        diagram: `graph TD
    subgraph Transformer_Encoder
    Input --> EmbedNode["Embedding + Positional Encoding"]
    EmbedNode --> MHAtt["Multi-Head Attention"]
    MHAtt --> AddNorm1["Add and Norm"]
    AddNorm1 --> FFNNode[Feed Forward]
    FFNNode --> AddNorm2["Add and Norm"]
    end
    AddNorm2 --> Output`,
      },
      {
        id: "prompt-engineering",
        title: "Production-Level Prompt Engineering",
        content: `
### Types of Prompts
1.  **Zero-Shot:** Asking without examples.
    *   "Translate 'Hello' to French."
2.  **Few-Shot:** Providing examples (demonstrations).
    *   "English: Hello -> French: Bonjour\\nEnglish: Dog -> French: Chien\\nEnglish: Cat -> French:"
3.  **Chain-of-Thought (CoT):** Asking the model to "think step-by-step".
    *   Drastically improves reasoning in Math/Logic/Coding.
4.  **ReAct (Reasoning + Acting):** Model generates a thought, takes an action (tool call), observes output, and continues.

### Prompt Control
*   **System Prompt:** The "instructions" or persona (e.g., "You are a senior code reviewer...").
*   **Temperature (0.0 - 2.0):**
    *   Low (0.1): Deterministic, factual.
    *   High (0.8+): Creative, diverse.
*   **Top-P (Nucleus Sampling):** "Change the pool of words to choose from". Restricts next-token choice to the top P% mass.
*   **Guardrails:** Using regex or frameworks (like NeMo Guardrails) to force output formats (JSON/XML).
        `,
      },
    ],
  },
  {
    id: "llm-models",
    title: "5.2 LLM Models (Hands-On)",
    description: "Choosing the right model: Closed vs Open Source.",
    icon: "Cpu",
    sections: [
      {
        id: "closed-models",
        title: "Closed-Source Models",
        content: `
### The Big Players
*   **GPT-4 / GPT-4o (OpenAI):** The current SOTA. Best for reasoning, coding, and instruction following. Expensive.
*   **Claude 3 (Anthropic):** Huge context window (200k+), very "human-like" writing, excellent reasoning (Opus > Sonnet > Haiku).
*   **Gemini Pro 1.5 (Google):** Massive context (1M+ tokens), multimodal native.

### Pros/Cons
*   ✅ Highest quality, no infra management.
*   ❌ Data privacy concerns, vendor lock-in, cost at scale.
        `,
      },
      {
        id: "open-models",
        title: "Open-Source Models",
        content: `
### The Contenders
*   **LLaMA 3 (Meta):** The standard for open weights. 8B (runs on laptop) and 70B (server).
*   **Mistral / Mixtral:** "Mixture of Experts" (MoE) architecture. High performance-to-cost ratio.
*   **Phi-3 (Microsoft):** Small Language Models (SLMs). Phi-3-mini (3.8B) rivals GPT-3.5 quality but runs on a phone.

### Compare
| Feature | Closed (GPT-4) | Open (Llama 3 70B) |
| :--- | :--- | :--- |
| **Cost** | High ($10-30 / 1M tokens) | Low (Self-hosted or cheap APIs) |
| **Privacy** | Data leaves VPC | Data stays in VPC |
| **Latency** | Network dependent | Ultra-low (if local) |
| **Control** | "Black box" | Full fine-tuning control |
        `,
      },
    ],
  },
  {
    id: "libraries",
    title: "5.3 Libraries (Mandatory)",
    description: "HuggingFace, LangChain, and LangGraph.",
    icon: "Library",
    sections: [
      {
        id: "huggingface",
        title: "HuggingFace Transformers",
        content: `
The de-facto standard for using open-source models (PyTorch/TensorFlow).

### Key Components
1.  **Tokenizer:** Converts text -> numbers (Input IDs).
    \`\`\`python
    tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3-8b")
    ids = tokenizer.encode("Hello world")
    \`\`\`
2.  **Model:** The neural network weights.
    \`\`\`python
    model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3-8b")
    \`\`\`
3.  **Pipeline:** High-level wrapper for tasks.
    \`\`\`python
    pipe = pipeline("text-generation", model="gpt2")
    pipe("Once upon a time")
    \`\`\`
        `,
      },
      {
        id: "langchain",
        title: "LangChain",
        content: `
A framework to gluing LLMs to other logic.

### Core Primitives
*   **PromptTemplate:** Dynamic string injection.
*   **Chains:** Sequence of calls (LLM -> OutputParser -> LLM).
*   **Memory:** Storing conversation history (e.g., \`ConversationBufferMemory\`).
*   **Tools:** Functions an agent can call (Calculator, Search).

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate
prompt = ChatPromptTemplate.from_template("Tell me a joke about {topic}")
chain = prompt | model | output_parser
\`\`\`
        `,
        diagram: `graph LR
    User --> PromptTemplate
    PromptTemplate --> LLM
    LLM --> OutputParser
    OutputParser --> FinalAnswer`,
      },
      {
        id: "langgraph",
        title: "LangGraph",
        content: `
### Why LangGraph?
LangChain chains are DAGs (Directed Acyclic Graphs). They flow one way.
**Agents need loops.**
LangGraph creates stateful, cyclic graphs for multi-step reasoning.

### Concepts
*   **State:** A shared dictionary updated by nodes.
*   **Nodes:** Functions that do work (call LLM, run tool).
*   **Edges:** Determine control flow (Conditional edges: "If tool needed -> go to ToolNode, else -> End").
        `,
      },
    ],
  },
  {
    id: "project-6",
    title: "Project 6: LLM-Powered Chatbot",
    description: "Architecture for a production-grade AI chatbot.",
    icon: "Bot",
    sections: [
      {
        id: "chatbot-arch",
        title: "Chatbot Architecture",
        content: `
**Tech Stack:** React (Frontend) + FastAPI (Backend) + LangChain
**Flow:**
1.  User sends message.
2.  Backend fetches session history (Redis/Memory).
3.  Constructs prompt with: System + History + New User Msg.
4.  LLM generates tokens (Streamed via Server-Sent Events - SSE).
5.  If LLM requests tool use, execution loop handles it.
        `,
        diagram: `graph LR
    User --HTTP Post--> API[FastAPI]
    API --Get History--> DB[(Redis)]
    API --Prompt--> LLM
    LLM --Stream--> API
    API --SSE--> User
    LLM -. Tool Call .-> Tools[Search/Calc]
    Tools --Result--> LLM`,
      },
    ],
  },
];
