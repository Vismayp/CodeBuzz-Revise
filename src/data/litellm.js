export const topics = [
  {
    id: "litellm-introduction",
    title: "Introduction to LiteLLM",
    description:
      "What LiteLLM is, why it exists, core architecture, and the problem it solves.",
    icon: "BookOpen",
    sections: [
      {
        id: "what-is-litellm",
        title: "What is LiteLLM?",
        content: `
### The Problem
Every LLM provider (OpenAI, Anthropic, Google, AWS Bedrock, Azure, Cohere, etc.) has its **own SDK, request format, authentication method, and response schema**. Switching providers or using multiple models means rewriting integration code, handling different error formats, and managing separate billing dashboards.

### The Solution — LiteLLM
**LiteLLM** is an open-source Python SDK and AI Gateway (Proxy Server) that provides a **unified, OpenAI-compatible interface** to call **100+ LLM APIs** from dozens of providers — with a single line of code.

Think of it as an **adaptor layer** that translates your standardized request into whichever provider's native format is needed, and normalizes the response back.

### Two Main Components

| Component | What it does | Who it's for |
|-----------|-------------|-------------|
| **Python SDK** | Call any LLM with \`completion()\` using OpenAI format | Individual developers |
| **Proxy Server (AI Gateway)** | Centralized API gateway for teams with auth, budgets, load balancing | Teams & Enterprises |

### Key Benefits
- **Write once, run anywhere** — same code works with GPT-4, Claude, Gemini, Llama, Mistral, etc.
- **No vendor lock-in** — switch providers by changing a single string
- **Production-grade** — load balancing, failover, caching, cost tracking, guardrails
- **OpenAI-compatible** — any app that talks to OpenAI can talk to LiteLLM with zero code changes
        `,
        diagram: `graph TD
    subgraph Your_App [Your Application]
        App[App Code]
    end
    subgraph LiteLLM_Layer [LiteLLM - Unified Interface]
        SDK[Python SDK]
        Proxy[Proxy Server / AI Gateway]
    end
    subgraph Providers [LLM Providers]
        OpenAI[OpenAI - GPT-4o]
        Anthropic[Anthropic - Claude]
        Google[Google - Gemini]
        Azure[Azure OpenAI]
        Bedrock[AWS Bedrock]
        Ollama[Ollama - Local LLMs]
    end
    App --> SDK
    App --> Proxy
    SDK --> OpenAI
    SDK --> Anthropic
    SDK --> Google
    SDK --> Azure
    SDK --> Bedrock
    SDK --> Ollama
    Proxy --> OpenAI
    Proxy --> Anthropic
    Proxy --> Google
    Proxy --> Azure
    Proxy --> Bedrock
    Proxy --> Ollama`,
      },
      {
        id: "litellm-architecture",
        title: "Architecture Overview",
        content: `
### How LiteLLM Works Under the Hood

1. **You send a request** using the OpenAI-compatible format (\`messages\`, \`model\`, etc.)
2. **LiteLLM parses the model string** (e.g., \`"anthropic/claude-3-opus"\`) to identify the provider
3. **Input translation** — converts your request into the provider's native API format (headers, auth, schema)
4. **Forwards the request** to the actual LLM provider
5. **Response normalization** — converts the provider's response back into OpenAI-compatible format
6. **Post-processing** — applies logging, cost tracking, caching, guardrails, etc.

### The Model String Convention

LiteLLM uses a \`provider/model-name\` convention to route requests:

| Model String | Provider | Actual Model |
|-------------|----------|-------------|
| \`openai/gpt-4o\` | OpenAI | GPT-4o |
| \`anthropic/claude-3-5-sonnet-20241022\` | Anthropic | Claude 3.5 Sonnet |
| \`vertex_ai/gemini-1.5-pro\` | Google Vertex | Gemini 1.5 Pro |
| \`azure/my-gpt4-deployment\` | Azure OpenAI | Your Azure deployment |
| \`bedrock/anthropic.claude-3-sonnet\` | AWS Bedrock | Claude 3 on Bedrock |
| \`ollama/llama3\` | Ollama (local) | Llama 3 |

> **Key Insight:** You never need to learn each provider's SDK. Just change the model string and LiteLLM handles the rest.
        `,
        diagram: `sequenceDiagram
    participant App as Your App
    participant LiteLLM as LiteLLM SDK
    participant Provider as LLM Provider
    App->>LiteLLM: completion(model="anthropic/claude-3-opus", messages=[...])
    LiteLLM->>LiteLLM: Parse provider from model string
    LiteLLM->>LiteLLM: Translate to Anthropic API format
    LiteLLM->>Provider: POST /v1/messages (Anthropic native)
    Provider-->>LiteLLM: Anthropic response format
    LiteLLM->>LiteLLM: Normalize to OpenAI format
    LiteLLM-->>App: Standard OpenAI-style response`,
      },
      {
        id: "supported-providers",
        title: "Supported Providers",
        content: `
### Major Providers Supported (100+)

LiteLLM supports virtually every major LLM provider. Here are the most common ones:

| Provider | Models | Prefix |
|----------|--------|--------|
| **OpenAI** | GPT-4o, GPT-4 Turbo, GPT-3.5, o1, DALL-E, Whisper | \`openai/\` |
| **Anthropic** | Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku | \`anthropic/\` |
| **Google Vertex AI** | Gemini 1.5 Pro, Gemini 1.5 Flash, PaLM 2 | \`vertex_ai/\` |
| **Azure OpenAI** | All OpenAI models deployed on Azure | \`azure/\` |
| **AWS Bedrock** | Claude, Llama, Titan, Mistral, Command | \`bedrock/\` |
| **Cohere** | Command R+, Command R, Embed | \`cohere/\` |
| **Mistral AI** | Mistral Large, Mistral Medium, Mixtral | \`mistral/\` |
| **Groq** | Llama 3, Mixtral (ultra-fast inference) | \`groq/\` |
| **Together AI** | Open-source models (Llama, Mixtral, etc.) | \`together_ai/\` |
| **Hugging Face** | Thousands of open models | \`huggingface/\` |
| **Ollama** | Any local model (Llama 3, Phi-3, etc.) | \`ollama/\` |
| **vLLM** | Self-hosted models with fast inference | \`openai/\` (compatible) |

### Supported Operations
- **Chat Completions** — standard conversational LLM calls
- **Text Completions** — legacy completion format
- **Embeddings** — vector embeddings for RAG and search
- **Image Generation** — DALL-E and similar models
- **Audio Transcription** — Whisper and compatible models
- **Structured Outputs** — JSON mode and function calling
        `,
      },
    ],
  },
  {
    id: "litellm-setup",
    title: "Installation & Setup",
    description:
      "Install LiteLLM, configure API keys, and make your first call.",
    icon: "Download",
    sections: [
      {
        id: "installation",
        title: "Installation",
        content: `
### Install the Python SDK

LiteLLM requires **Python 3.7+**. Install it with pip:

\`\`\`bash
# Basic SDK installation
pip install litellm

# For Proxy Server / AI Gateway support
pip install "litellm[proxy]"

# Optional: for .env file support
pip install python-dotenv
\`\`\`

### Verify Installation

\`\`\`bash
python -c "import litellm; print(litellm.__version__)"
\`\`\`

### What Each Package Provides

| Package | What You Get |
|---------|-------------|
| \`litellm\` | Core SDK — \`completion()\`, \`embedding()\`, Router, etc. |
| \`litellm[proxy]\` | Proxy server, admin UI, database support, Docker configs |
| \`python-dotenv\` | Load API keys from \`.env\` files securely |
        `,
      },
      {
        id: "api-key-config",
        title: "Configuring API Keys",
        content: `
### Method 1: Environment Variables (Recommended)

Set your provider API keys as environment variables:

\`\`\`bash
# In your terminal or .env file
export OPENAI_API_KEY="sk-your-openai-key"
export ANTHROPIC_API_KEY="sk-ant-your-anthropic-key"
export AZURE_API_KEY="your-azure-key"
export AZURE_API_BASE="https://your-resource.openai.azure.com/"
export AZURE_API_VERSION="2024-02-01"
export VERTEXAI_PROJECT="your-gcp-project-id"
export VERTEXAI_LOCATION="us-central1"
\`\`\`

### Method 2: In Python Code

\`\`\`python
import os
os.environ["OPENAI_API_KEY"] = "sk-your-openai-key"
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-your-anthropic-key"
\`\`\`

### Method 3: Using a .env File

Create a \`.env\` file in your project root:
\`\`\`
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
\`\`\`

Then load it in your code:
\`\`\`python
from dotenv import load_dotenv
load_dotenv()  # Loads all variables from .env
\`\`\`

> **Security Tip:** Never commit API keys to version control. Add \`.env\` to your \`.gitignore\`.
        `,
        code: `import os
from dotenv import load_dotenv

# Load API keys from .env file
load_dotenv()

# Verify keys are loaded
print("OpenAI key loaded:", "OPENAI_API_KEY" in os.environ)
print("Anthropic key loaded:", "ANTHROPIC_API_KEY" in os.environ)`,
      },
      {
        id: "first-call",
        title: "Your First LiteLLM Call",
        content: `
### The \`completion()\` Function

The core of LiteLLM is the \`completion()\` function. It works exactly like OpenAI's API but routes to any provider.

### Making Your First Call

The example below shows how to call three different providers with the **exact same code pattern**. The only thing that changes is the \`model\` string.

> **Key takeaway:** One function, one interface, any LLM provider.
        `,
        code: `from litellm import completion
import os

os.environ["OPENAI_API_KEY"] = "your-openai-key"
os.environ["ANTHROPIC_API_KEY"] = "your-anthropic-key"

# --- Call OpenAI GPT-4o ---
response = completion(
    model="openai/gpt-4o",
    messages=[{"role": "user", "content": "What is LiteLLM in one sentence?"}]
)
print("GPT-4o:", response.choices[0].message.content)

# --- Call Anthropic Claude ---
response = completion(
    model="anthropic/claude-3-5-sonnet-20241022",
    messages=[{"role": "user", "content": "What is LiteLLM in one sentence?"}]
)
print("Claude:", response.choices[0].message.content)

# --- Call a local Ollama model ---
response = completion(
    model="ollama/llama3",
    messages=[{"role": "user", "content": "What is LiteLLM in one sentence?"}],
    api_base="http://localhost:11434"
)
print("Llama3:", response.choices[0].message.content)`,
      },
    ],
  },
  {
    id: "litellm-core-sdk",
    title: "Core SDK Usage",
    description:
      "Deep dive into completion(), embedding(), response format, and error handling.",
    icon: "Code",
    sections: [
      {
        id: "completion-api",
        title: "The completion() API",
        content: `
### Function Signature

\`\`\`python
litellm.completion(
    model: str,               # "provider/model-name"
    messages: List[dict],      # OpenAI-style messages
    temperature: float = 1.0,  # Creativity (0-2)
    max_tokens: int = None,    # Max response length
    top_p: float = 1.0,       # Nucleus sampling
    stream: bool = False,      # Enable streaming
    tools: List = None,        # Function/tool definitions
    response_format: dict = None, # JSON mode or structured output
    **kwargs                   # Provider-specific params
)
\`\`\`

### Response Object

LiteLLM always returns an **OpenAI-compatible** \`ModelResponse\` object, regardless of which provider you called:

| Field | Description |
|-------|------------|
| \`response.choices[0].message.content\` | The generated text |
| \`response.choices[0].message.role\` | Always \`"assistant"\` |
| \`response.usage.prompt_tokens\` | Input tokens used |
| \`response.usage.completion_tokens\` | Output tokens generated |
| \`response.usage.total_tokens\` | Total tokens |
| \`response.model\` | The model that was actually used |
| \`response.id\` | Unique response ID |
        `,
        code: `from litellm import completion

response = completion(
    model="openai/gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful coding assistant."},
        {"role": "user", "content": "Explain Python decorators in 3 sentences."}
    ],
    temperature=0.7,
    max_tokens=200
)

# Access the response (same format regardless of provider)
print("Content:", response.choices[0].message.content)
print("Tokens used:", response.usage.total_tokens)
print("Model:", response.model)`,
      },
      {
        id: "embeddings-api",
        title: "Embeddings API",
        content: `
### Creating Embeddings

Embeddings convert text into numerical vectors for semantic search, RAG, clustering, and similarity comparisons. LiteLLM unifies the embedding API across providers.

\`\`\`python
litellm.embedding(
    model: str,         # Embedding model name
    input: List[str],   # Texts to embed
    **kwargs
)
\`\`\`

### Supported Embedding Models

| Provider | Model | Dimensions |
|----------|-------|-----------|
| OpenAI | \`text-embedding-3-small\` | 1536 |
| OpenAI | \`text-embedding-3-large\` | 3072 |
| Cohere | \`embed-english-v3.0\` | 1024 |
| Bedrock | \`amazon.titan-embed-text-v1\` | 1536 |
| Vertex AI | \`textembedding-gecko\` | 768 |
        `,
        code: `from litellm import embedding

# Create embeddings with OpenAI
response = embedding(
    model="text-embedding-3-small",
    input=["LiteLLM is a unified LLM API", "It supports 100+ models"]
)

# Access the vectors
for i, item in enumerate(response.data):
    print(f"Text {i}: vector dimension = {len(item['embedding'])}")
    print(f"  First 5 values: {item['embedding'][:5]}")

# Embeddings work the same with any provider
bedrock_response = embedding(
    model="bedrock/amazon.titan-embed-text-v1",
    input=["Same code, different provider"]
)`,
      },
      {
        id: "error-handling",
        title: "Error Handling",
        content: `
### Unified Error Types

One of LiteLLM's biggest advantages is **standardized error handling**. Instead of learning each provider's error format, LiteLLM maps all errors to consistent exception types:

| LiteLLM Exception | HTTP Code | Meaning |
|-------------------|-----------|---------|
| \`AuthenticationError\` | 401 | Invalid API key |
| \`RateLimitError\` | 429 | Too many requests |
| \`BadRequestError\` | 400 | Malformed request |
| \`NotFoundError\` | 404 | Model not found |
| \`ContextWindowExceededError\` | 400 | Input too long |
| \`ContentPolicyViolationError\` | 400 | Content filtered |
| \`APIConnectionError\` | 500 | Provider unreachable |
| \`Timeout\` | 408 | Request timed out |

> **Why this matters:** Whether OpenAI returns a 429, Anthropic returns an overloaded error, or Bedrock throttles you — your error handling code stays the same.
        `,
        code: `from litellm import completion
import litellm

try:
    response = completion(
        model="openai/gpt-4o",
        messages=[{"role": "user", "content": "Hello!"}],
        timeout=30  # 30 second timeout
    )
    print(response.choices[0].message.content)

except litellm.AuthenticationError:
    print("Invalid API key. Check your credentials.")

except litellm.RateLimitError:
    print("Rate limited. Implement backoff or use Router for auto-retry.")

except litellm.ContextWindowExceededError:
    print("Input too long. Reduce your prompt or use a model with a larger context.")

except litellm.Timeout:
    print("Request timed out. Try again or increase timeout.")

except litellm.APIConnectionError:
    print("Cannot reach the provider. Check network or provider status.")

except Exception as e:
    print(f"Unexpected error: {e}")`,
      },
    ],
  },
  {
    id: "litellm-streaming-async",
    title: "Streaming & Async",
    description:
      "Real-time streaming responses, async/await patterns, and concurrent calls.",
    icon: "Zap",
    sections: [
      {
        id: "streaming-basics",
        title: "Streaming Responses",
        content: `
### Why Streaming?

By default, \`completion()\` waits for the entire response before returning. With **streaming**, you receive tokens as they are generated — providing a much better user experience for chat applications.

### How Streaming Works
1. Pass \`stream=True\` to \`completion()\`
2. The function returns a **generator** (iterator) of chunks
3. Each chunk contains a small piece of the response (delta)
4. You iterate and process each chunk as it arrives

### Chunk Format
Each chunk follows the OpenAI streaming format:
- \`chunk.choices[0].delta.content\` — the new text token
- \`chunk.choices[0].finish_reason\` — \`None\` while streaming, \`"stop"\` when done
        `,
        code: `from litellm import completion

# --- Synchronous Streaming ---
response = completion(
    model="openai/gpt-4o",
    messages=[{"role": "user", "content": "Write a haiku about Python programming"}],
    stream=True
)

# Process tokens as they arrive
for chunk in response:
    content = chunk.choices[0].delta.content
    if content:
        print(content, end="", flush=True)

print()  # Newline after streaming completes

# --- Streaming works with ANY provider ---
response = completion(
    model="anthropic/claude-3-5-sonnet-20241022",
    messages=[{"role": "user", "content": "Write a haiku about AI"}],
    stream=True
)

for chunk in response:
    content = chunk.choices[0].delta.content
    if content:
        print(content, end="", flush=True)`,
      },
      {
        id: "async-completion",
        title: "Async Completion",
        content: `
### Why Async?

In production apps (web servers, APIs, chatbots), you don't want to block the event loop while waiting for an LLM response. LiteLLM provides \`acompletion()\` for non-blocking async calls.

### Async Functions

| Sync | Async | Purpose |
|------|-------|---------|
| \`completion()\` | \`acompletion()\` | Chat/text completions |
| \`embedding()\` | \`aembedding()\` | Text embeddings |

### When to Use Async
- **Web servers** (FastAPI, Django, Flask async)
- **Chatbots** handling multiple users simultaneously
- **Batch processing** — call multiple models in parallel
- **Pipelines** that orchestrate several LLM calls
        `,
        code: `import asyncio
from litellm import acompletion, aembedding

async def main():
    # --- Async Completion ---
    response = await acompletion(
        model="openai/gpt-4o",
        messages=[{"role": "user", "content": "Explain async in Python"}]
    )
    print("Response:", response.choices[0].message.content[:100])

    # --- Async Streaming ---
    response = await acompletion(
        model="anthropic/claude-3-5-sonnet-20241022",
        messages=[{"role": "user", "content": "What is concurrency?"}],
        stream=True
    )
    async for chunk in response:
        content = chunk.choices[0].delta.content
        if content:
            print(content, end="", flush=True)
    print()

    # --- Async Embedding ---
    embed_response = await aembedding(
        model="text-embedding-3-small",
        input=["async embeddings work too"]
    )
    print(f"Embedding dimension: {len(embed_response.data[0]['embedding'])}")

asyncio.run(main())`,
      },
      {
        id: "parallel-calls",
        title: "Parallel & Concurrent Calls",
        content: `
### Running Multiple LLM Calls in Parallel

One of the biggest advantages of async is calling **multiple providers simultaneously** and comparing results or picking the fastest.

### Use Cases
- **Model comparison** — ask the same question to GPT-4, Claude, and Gemini
- **Ensemble responses** — combine multiple model outputs
- **Fastest-response wins** — use whichever model responds first
- **Batch processing** — process many inputs concurrently
        `,
        code: `import asyncio
from litellm import acompletion

async def ask_model(model, question):
    """Ask a question to a specific model."""
    response = await acompletion(
        model=model,
        messages=[{"role": "user", "content": question}],
        max_tokens=100
    )
    return {
        "model": model,
        "response": response.choices[0].message.content,
        "tokens": response.usage.total_tokens
    }

async def compare_models():
    question = "What is the most important concept in software engineering?"

    # Run all 3 calls in parallel
    results = await asyncio.gather(
        ask_model("openai/gpt-4o", question),
        ask_model("anthropic/claude-3-5-sonnet-20241022", question),
        ask_model("vertex_ai/gemini-1.5-pro", question),
    )

    for result in results:
        print(f"\\n--- {result['model']} ({result['tokens']} tokens) ---")
        print(result["response"][:200])

asyncio.run(compare_models())`,
      },
    ],
  },
  {
    id: "litellm-router",
    title: "Router & Load Balancing",
    description:
      "Multi-deployment routing, load balancing strategies, fallbacks, and retries.",
    icon: "GitBranch",
    sections: [
      {
        id: "router-basics",
        title: "The LiteLLM Router",
        content: `
### What is the Router?

The **Router** is LiteLLM's built-in load balancer. It distributes requests across multiple deployments of the same model (or different models) to maximize reliability, minimize latency, and control costs.

### When to Use a Router
- You have **multiple API keys** for the same provider (to avoid rate limits)
- You deploy the same model across **multiple regions or providers** (Azure East + Azure West)
- You want **automatic failover** — if one provider is down, switch to another
- You need **cost optimization** — route to cheaper models when possible

### Router vs Direct \`completion()\`

| Feature | \`completion()\` | \`Router\` |
|---------|----------------|----------|
| Single call | ✅ | ✅ |
| Load balancing | ❌ | ✅ |
| Auto-retry | ❌ | ✅ |
| Fallback to other models | ❌ | ✅ |
| Cooldown on failures | ❌ | ✅ |
| Routing strategies | ❌ | ✅ |
        `,
        code: `from litellm import Router

# Define multiple deployments for the same model
model_list = [
    {
        "model_name": "gpt-4",          # Logical name your app uses
        "litellm_params": {
            "model": "azure/gpt-4-east",  # Azure US East deployment
            "api_key": "your-azure-east-key",
            "api_base": "https://east.openai.azure.com/",
            "api_version": "2024-02-01"
        }
    },
    {
        "model_name": "gpt-4",          # Same logical name
        "litellm_params": {
            "model": "azure/gpt-4-west",  # Azure US West deployment
            "api_key": "your-azure-west-key",
            "api_base": "https://west.openai.azure.com/",
            "api_version": "2024-02-01"
        }
    },
    {
        "model_name": "gpt-4",
        "litellm_params": {
            "model": "openai/gpt-4",      # OpenAI direct as backup
            "api_key": "your-openai-key"
        }
    },
]

router = Router(model_list=model_list)

# Router automatically distributes across deployments
response = router.completion(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello from the router!"}]
)
print(response.choices[0].message.content)`,
      },
      {
        id: "routing-strategies",
        title: "Routing Strategies",
        content: `
### Available Strategies

LiteLLM supports several routing strategies to optimize for different goals:

| Strategy | How It Works | Best For |
|----------|-------------|----------|
| \`simple-shuffle\` | Random selection across deployments | Even distribution |
| \`least-busy\` | Routes to the deployment with fewest active requests | Low latency |
| \`usage-based-routing-v2\` | Distributes based on token/request usage quotas | Staying within rate limits |
| \`latency-based-routing\` | Routes to the fastest responding deployment | Minimizing response time |
| \`cost-based-routing\` | Routes to the cheapest available model | Minimizing costs |

### Configuration Parameters

| Parameter | Default | Description |
|-----------|---------|------------|
| \`num_retries\` | 0 | Number of retries on failure before fallback |
| \`allowed_fails\` | 0 | Failures before a deployment enters cooldown |
| \`cooldown_time\` | 1.0 | Seconds a failed deployment is excluded |
| \`timeout\` | None | Global timeout for all requests |
| \`retry_after\` | 0 | Seconds to wait between retries |
        `,
        code: `from litellm import Router

model_list = [
    {
        "model_name": "gpt-4",
        "litellm_params": {
            "model": "openai/gpt-4",
            "api_key": "key-1"
        }
    },
    {
        "model_name": "gpt-4",
        "litellm_params": {
            "model": "openai/gpt-4",
            "api_key": "key-2"
        }
    },
]

# --- Latency-Optimized Router ---
fast_router = Router(
    model_list=model_list,
    routing_strategy="latency-based-routing",
    num_retries=3,
    allowed_fails=2,
    cooldown_time=10.0,    # 10s cooldown on failed deployments
    timeout=30,            # 30s global timeout
)

# --- Cost-Optimized Router ---
cheap_router = Router(
    model_list=model_list,
    routing_strategy="cost-based-routing",
    num_retries=2,
)

response = fast_router.completion(
    model="gpt-4",
    messages=[{"role": "user", "content": "Pick the fastest route!"}]
)
print(response.choices[0].message.content)`,
      },
      {
        id: "fallback-config",
        title: "Fallbacks & Retries",
        content: `
### How Fallback Works

Fallbacks are your safety net. When a model completely fails (all deployments exhausted, all retries used), the Router switches to a **different model group** entirely.

### Retry & Fallback Flow
1. **Request** goes to primary model group (e.g., all \`gpt-4\` deployments)
2. If it **fails**, retry on another deployment within the same group (up to \`num_retries\`)
3. Each retry uses **exponential backoff** (wait longer between retries)
4. If **all retries** fail, the deployment enters **cooldown** (excluded temporarily)
5. If **all deployments** fail, trigger **fallback** to the next model group
6. If **all fallbacks** are exhausted, raise an exception

### Fallback Types
- **Model fallbacks** — switch to a different model (GPT-4 → Claude)
- **Content policy fallbacks** — triggered when content is filtered
- **Context window fallbacks** — triggered when input is too long
        `,
        code: `from litellm import Router

model_list = [
    {
        "model_name": "gpt-4",
        "litellm_params": {"model": "openai/gpt-4", "api_key": "key-1"}
    },
    {
        "model_name": "claude",
        "litellm_params": {"model": "anthropic/claude-3-5-sonnet-20241022", "api_key": "key-2"}
    },
    {
        "model_name": "gemini",
        "litellm_params": {"model": "vertex_ai/gemini-1.5-pro"}
    },
]

router = Router(
    model_list=model_list,
    num_retries=3,
    allowed_fails=2,
    cooldown_time=5.0,
    # If gpt-4 fails completely, try claude. If claude fails, try gemini.
    fallbacks=[
        {"gpt-4": ["claude"]},
        {"claude": ["gemini"]}
    ],
    # Special fallback for content policy violations
    content_policy_fallbacks=[
        {"gpt-4": ["claude"]}
    ],
    # Special fallback for context window exceeded
    context_window_fallbacks=[
        {"gpt-4": ["claude"]}  # Claude has a larger context window
    ],
)

# If gpt-4 fails after retries, automatically falls back to claude
response = router.completion(
    model="gpt-4",
    messages=[{"role": "user", "content": "Reliable request with fallbacks!"}]
)
print(response.choices[0].message.content)`,
        diagram: `graph TD
    A[Request: model=gpt-4] --> B{Try GPT-4 Deployment 1}
    B -->|Success| Z[Return Response]
    B -->|Fail| C{Retry GPT-4 Deployment 2}
    C -->|Success| Z
    C -->|Fail| D{Retry GPT-4 Deployment 3}
    D -->|Success| Z
    D -->|All Retries Failed| E[Cooldown GPT-4]
    E --> F{Fallback: Try Claude}
    F -->|Success| Z
    F -->|Fail| G{Fallback: Try Gemini}
    G -->|Success| Z
    G -->|Fail| H[Raise Exception]`,
      },
    ],
  },
  {
    id: "litellm-proxy-server",
    title: "Proxy Server (AI Gateway)",
    description:
      "Deploy LiteLLM as a centralized API gateway with config.yaml and Docker.",
    icon: "Server",
    sections: [
      {
        id: "proxy-overview",
        title: "What is the Proxy Server?",
        content: `
### SDK vs Proxy Server

| Aspect | Python SDK | Proxy Server |
|--------|-----------|-------------|
| **Usage** | Import in Python code | Run as a standalone server |
| **Interface** | Python function calls | HTTP REST API (OpenAI-compatible) |
| **Auth** | Each dev manages own keys | Centralized key management |
| **Language** | Python only | Any language (HTTP calls) |
| **Monitoring** | Per-app logging | Centralized dashboard |
| **Best for** | Individual devs | Teams & production |

### Why Use the Proxy?
- **Any language** can call it — JavaScript, Go, Rust, curl — not just Python
- **Centralized auth** — developers get virtual API keys, not raw provider keys
- **Cost control** — set budgets per team/user/project
- **Unified logging** — every request across all teams logged in one place
- **Load balancing** — built-in routing across providers
- **Drop-in replacement** — any OpenAI-compatible client works by just changing \`base_url\`
        `,
        diagram: `graph LR
    subgraph Clients
        Python[Python App]
        JS[JavaScript App]
        Curl[curl / HTTP]
        Go[Go Service]
    end
    subgraph LiteLLM_Proxy [LiteLLM Proxy Server :4000]
        Auth[Auth & Virtual Keys]
        Route[Router & Load Balancer]
        Log[Logging & Cost Tracking]
        Cache[Response Cache]
    end
    subgraph Providers
        OpenAI[OpenAI]
        Claude[Anthropic]
        Azure[Azure]
    end
    Python --> Auth
    JS --> Auth
    Curl --> Auth
    Go --> Auth
    Auth --> Route
    Route --> OpenAI
    Route --> Claude
    Route --> Azure
    Route --> Log
    Route --> Cache`,
      },
      {
        id: "proxy-config-yaml",
        title: "Configuration (config.yaml)",
        content: `
### The config.yaml File

The proxy server is configured through a YAML file that defines your models, settings, and security.

### Key Sections

| Section | Purpose |
|---------|---------|
| \`model_list\` | Define available models and their provider configs |
| \`litellm_settings\` | SDK-level settings (caching, verbosity, etc.) |
| \`general_settings\` | Proxy settings (master key, database, etc.) |
| \`router_settings\` | Load balancing strategy and retry config |

### Environment Variable References

Use \`os.environ/VARIABLE_NAME\` in YAML to reference secrets securely:
\`\`\`yaml
api_key: os.environ/OPENAI_API_KEY
\`\`\`
        `,
        code: `# config.yaml — Production-ready example

model_list:
  # OpenAI Models
  - model_name: gpt-4o
    litellm_params:
      model: openai/gpt-4o
      api_key: os.environ/OPENAI_API_KEY

  # Anthropic Claude
  - model_name: claude-sonnet
    litellm_params:
      model: anthropic/claude-3-5-sonnet-20241022
      api_key: os.environ/ANTHROPIC_API_KEY

  # Azure OpenAI (multiple deployments for load balancing)
  - model_name: azure-gpt4
    litellm_params:
      model: azure/gpt-4-deployment
      api_base: os.environ/AZURE_API_BASE
      api_key: os.environ/AZURE_API_KEY
      api_version: "2024-02-01"

  # Local Ollama
  - model_name: local-llama
    litellm_params:
      model: ollama/llama3
      api_base: http://localhost:11434

router_settings:
  routing_strategy: least-busy
  num_retries: 3

litellm_settings:
  drop_params: true       # Drop unsupported params instead of erroring
  set_verbose: false      # Disable verbose logging in production

general_settings:
  master_key: os.environ/LITELLM_MASTER_KEY
  database_url: os.environ/DATABASE_URL`,
      },
      {
        id: "proxy-docker-deploy",
        title: "Docker Deployment",
        content: `
### Quick Start (CLI)

\`\`\`bash
# Start the proxy with a single model
litellm --model openai/gpt-4o

# Start with a config file
litellm --config config.yaml --port 4000
\`\`\`

### Production Docker Compose

For production, use Docker Compose with PostgreSQL (for persistent logs/keys) and Redis (for caching/rate limiting):

### Testing Your Deployment

\`\`\`bash
# Health check
curl http://localhost:4000/health

# Make a chat completion request
curl http://localhost:4000/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-your-master-key" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
\`\`\`
        `,
        code: `# docker-compose.yml — Production LiteLLM Setup

version: '3.8'
services:
  litellm:
    image: ghcr.io/berriai/litellm:main-latest
    container_name: litellm-proxy
    ports:
      - "4000:4000"
    volumes:
      - ./config.yaml:/app/config.yaml
    env_file:
      - .env
    command:
      - "--config"
      - "/app/config.yaml"
      - "--port"
      - "4000"
      - "--num_workers"
      - "8"
    depends_on:
      - litellm-db
      - litellm-redis
    restart: unless-stopped

  litellm-db:
    image: postgres:16
    environment:
      POSTGRES_DB: litellm
      POSTGRES_USER: litellm
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  litellm-redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:`,
      },
      {
        id: "proxy-client-usage",
        title: "Calling the Proxy from Any Language",
        content: `
### The Power of OpenAI Compatibility

Since LiteLLM Proxy is fully OpenAI-compatible, **any** OpenAI SDK or HTTP client can connect to it. Just change the \`base_url\` and use your LiteLLM virtual key.

### Why This Matters
- Your **JavaScript frontend** can use the OpenAI JS SDK
- Your **Go microservice** can make HTTP calls
- Your **Python backend** can use the OpenAI Python SDK
- Even **curl** works perfectly

All of them point to your LiteLLM proxy, which routes to the right provider.
        `,
        code: `# --- Python (using OpenAI SDK) ---
import openai

client = openai.OpenAI(
    api_key="sk-your-litellm-virtual-key",
    base_url="http://localhost:4000"  # Point to LiteLLM proxy
)

response = client.chat.completions.create(
    model="gpt-4o",  # Routed through LiteLLM
    messages=[{"role": "user", "content": "Hello from OpenAI SDK!"}]
)
print(response.choices[0].message.content)

# --- JavaScript (using fetch) ---
# const response = await fetch("http://localhost:4000/chat/completions", {
#     method: "POST",
#     headers: {
#         "Content-Type": "application/json",
#         "Authorization": "Bearer sk-your-litellm-virtual-key"
#     },
#     body: JSON.stringify({
#         model: "claude-sonnet",
#         messages: [{ role: "user", content: "Hello from JS!" }]
#     })
# });
# const data = await response.json();

# --- curl ---
# curl http://localhost:4000/chat/completions \\
#   -H "Authorization: Bearer sk-your-litellm-virtual-key" \\
#   -H "Content-Type: application/json" \\
#   -d '{"model": "gpt-4o", "messages": [{"role": "user", "content": "Hi!"}]}'`,
      },
    ],
  },
  {
    id: "litellm-cost-tracking",
    title: "Cost Tracking & Budget Management",
    description:
      "Track spending across providers, set budgets, and use callbacks for logging.",
    icon: "DollarSign",
    sections: [
      {
        id: "cost-tracking-basics",
        title: "Automatic Cost Tracking",
        content: `
### The Cost Problem

Running LLMs in production across multiple providers makes cost tracking incredibly complex:
- Each provider has **different pricing** per model
- Prices vary by **input vs output tokens**
- **Azure** pricing differs from direct **OpenAI** pricing
- Teams need to **allocate costs** by project/user

### LiteLLM's Solution

LiteLLM automatically tracks cost for every request. It knows the pricing for all supported models and calculates the cost based on actual token usage.

### What Gets Tracked
- **Token usage** — prompt tokens, completion tokens, total
- **Cost per request** — calculated from the model's pricing
- **Cumulative spend** — per API key, per user, per team
- **Model breakdown** — cost by model across providers
        `,
        code: `from litellm import completion, completion_cost

# Make a call
response = completion(
    model="openai/gpt-4o",
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}]
)

# Get the cost of this specific call
cost = completion_cost(completion_response=response)
print(f"This call cost: \${cost:.6f}")
print(f"Tokens used: {response.usage.total_tokens}")
print(f"  Prompt: {response.usage.prompt_tokens}")
print(f"  Completion: {response.usage.completion_tokens}")`,
      },
      {
        id: "budget-management",
        title: "Budgets & Spend Limits",
        content: `
### Setting Budgets (Proxy Server)

When running the LiteLLM Proxy, you can set spending limits at multiple levels:

| Level | What it Controls | Example |
|-------|-----------------|---------|
| **Global** | Total spend for the entire proxy | Max $1000/month |
| **Per API Key** | Budget for each virtual key | Key X gets $50/month |
| **Per User** | Budget per user identity | User Alice gets $100 |
| **Per Team** | Budget per team/project | Frontend team gets $200 |

### How Budget Enforcement Works
1. Every request's cost is calculated and logged
2. Before processing, LiteLLM checks if the key/user/team has remaining budget
3. If the budget is exceeded, the request is **rejected** with a clear error
4. Admins can monitor spend via API or dashboard

### Budget Configuration (Proxy config.yaml)

\`\`\`yaml
general_settings:
  master_key: sk-admin-key
  database_url: postgresql://user:pass@db:5432/litellm
\`\`\`

Virtual keys with budgets are created through the Admin API:

\`\`\`bash
curl -X POST http://localhost:4000/key/generate \\
  -H "Authorization: Bearer sk-admin-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "max_budget": 50.0,
    "budget_duration": "monthly",
    "models": ["gpt-4o", "claude-sonnet"],
    "metadata": {"team": "backend", "user": "alice"}
  }'
\`\`\`
        `,
      },
      {
        id: "callbacks-logging",
        title: "Callbacks & Custom Logging",
        content: `
### The Callback System

LiteLLM has a powerful **callback architecture** that lets you hook into the request lifecycle:

| Callback | When it Fires | Use Case |
|----------|--------------|----------|
| \`success_callback\` | After a successful LLM call | Log responses, track costs |
| \`failure_callback\` | After a failed LLM call | Alert on errors, track failures |
| \`input_callback\` | Before the API call | Validate inputs, redact PII |

### Built-In Integrations
- **Langfuse** — prompt tracing and analytics
- **Datadog** — APM and monitoring
- **Prometheus** — metrics and alerting
- **OpenTelemetry** — distributed tracing
- **Custom functions** — write your own logic
        `,
        code: `import litellm
from litellm import completion

# --- Custom Success Callback ---
def my_logger(kwargs, response, start_time, end_time):
    """Custom callback that fires after every successful LLM call."""
    duration = (end_time - start_time).total_seconds()
    cost = litellm.completion_cost(completion_response=response)
    print(f"[LOG] Model: {kwargs['model']}")
    print(f"[LOG] Duration: {duration:.2f}s")
    print(f"[LOG] Tokens: {response.usage.total_tokens}")
    print(f"[LOG] Cost: \${cost:.6f}")
    print(f"[LOG] Response preview: {response.choices[0].message.content[:50]}...")

# --- Custom Failure Callback ---
def my_error_handler(kwargs, exception, traceback_str):
    """Custom callback that fires on every failed LLM call."""
    print(f"[ERROR] Model: {kwargs['model']}")
    print(f"[ERROR] Exception: {exception}")

# Register callbacks globally
litellm.success_callback = [my_logger]
litellm.failure_callback = [my_error_handler]

# Now every call will trigger the callbacks
response = completion(
    model="openai/gpt-4o",
    messages=[{"role": "user", "content": "Hello with logging!"}]
)`,
      },
    ],
  },
  {
    id: "litellm-caching",
    title: "Caching & Performance",
    description:
      "Redis caching, semantic cache, in-memory cache, and performance optimization.",
    icon: "Database",
    sections: [
      {
        id: "caching-overview",
        title: "Why Cache LLM Responses?",
        content: `
### The Cost of Repeated Calls

LLM calls are **expensive** and **slow** relative to traditional APIs. If users frequently ask similar questions, you're paying for the same computation repeatedly.

### Caching Benefits
- **Cost reduction** — avoid paying for identical/similar requests
- **Latency reduction** — cached responses return in milliseconds
- **Rate limit protection** — fewer calls to the provider
- **Consistency** — same input always produces same output

### Cache Types in LiteLLM

| Cache Type | How it Works | Speed | Best For |
|-----------|-------------|-------|---------|
| **In-Memory** | Local dictionary cache | ⚡ Fastest | Single-server apps |
| **Redis** | Distributed key-value cache | 🚀 Fast | Multi-server deployments |
| **Semantic** | Vector similarity matching | 🧠 Smart | Near-duplicate queries |
| **S3 / GCS** | Cloud object storage cache | 🐢 Slower | Long-term persistence |

### How Exact-Match Cache Works
1. LiteLLM hashes the request (model + messages + params)
2. Checks if this exact hash exists in cache
3. If **hit** → return cached response instantly
4. If **miss** → call the LLM, cache the response, then return it
        `,
        diagram: `graph TD
    A[Incoming Request] --> B{Cache Lookup}
    B -->|Cache HIT| C[Return Cached Response]
    B -->|Cache MISS| D[Call LLM Provider]
    D --> E[Get Response]
    E --> F[Store in Cache]
    F --> G[Return Response]
    C --> H[Response Time: ~5ms]
    G --> I[Response Time: ~500-3000ms]`,
      },
      {
        id: "redis-caching",
        title: "Redis Cache Setup",
        content: `
### Setting Up Redis Cache

Redis is the recommended cache backend for production because it supports distributed deployments and survives server restarts.

### SDK Configuration

You can enable caching in the Python SDK directly:

### Proxy Configuration (config.yaml)

\`\`\`yaml
litellm_settings:
  cache: true
  cache_params:
    type: redis
    host: localhost
    port: 6379
    password: your-redis-password  # Optional
    ttl: 600                       # Cache TTL: 10 minutes
    namespace: litellm_cache       # Key prefix
\`\`\`

### Cache Parameters

| Parameter | Default | Description |
|-----------|---------|------------|
| \`type\` | — | \`redis\`, \`local\`, \`s3\`, \`redis+semantic\` |
| \`host\` | \`localhost\` | Redis server host |
| \`port\` | \`6379\` | Redis server port |
| \`password\` | \`None\` | Redis auth password |
| \`ttl\` | \`3600\` | Time-to-live in seconds |
| \`namespace\` | \`litellm\` | Key prefix for isolation |
        `,
        code: `import litellm
from litellm import completion
from litellm.caching import Cache

# --- Enable Redis Caching ---
litellm.cache = Cache(
    type="redis",
    host="localhost",
    port=6379,
    ttl=600  # Cache for 10 minutes
)

# First call — cache MISS (calls the LLM)
import time
start = time.time()
response1 = completion(
    model="openai/gpt-4o",
    messages=[{"role": "user", "content": "What is caching?"}],
    caching=True
)
print(f"First call: {time.time() - start:.2f}s (cache MISS)")

# Second call with same input — cache HIT (instant!)
start = time.time()
response2 = completion(
    model="openai/gpt-4o",
    messages=[{"role": "user", "content": "What is caching?"}],
    caching=True
)
print(f"Second call: {time.time() - start:.4f}s (cache HIT)")

# Both responses are identical
print(response1.choices[0].message.content == response2.choices[0].message.content)`,
      },
      {
        id: "semantic-caching",
        title: "Semantic Cache",
        content: `
### Beyond Exact Matching

Regular caching only works for **identical** requests. But users often ask the same thing in different ways:
- "What is Python?" vs "Explain Python programming"
- "How does caching work?" vs "Explain the concept of caching"

### Semantic Cache
Semantic caching uses **embeddings** to find similar (not identical) queries:
1. Each request is converted to a vector embedding
2. New requests are compared to cached embeddings using **cosine similarity**
3. If similarity exceeds a threshold, the cached response is returned

### When to Use Semantic Cache
- **Chatbots** — users phrase the same question differently
- **FAQ systems** — common questions with slight variations
- **RAG pipelines** — similar retrieval queries

### Configuration (Proxy)

\`\`\`yaml
litellm_settings:
  cache: true
  cache_params:
    type: redis-semantic
    host: localhost
    port: 6379
    similarity_threshold: 0.8  # 80% similarity = cache hit
    redis_semantic_cache_embedding_model: text-embedding-3-small
\`\`\`

> **Trade-off:** Semantic cache is smarter but slower than exact match (requires embedding computation). Use it when user query variation is high.
        `,
      },
    ],
  },
  {
    id: "litellm-guardrails",
    title: "Guardrails & Security",
    description:
      "PII masking, content moderation, rate limiting, and prompt injection defense.",
    icon: "Shield",
    sections: [
      {
        id: "rate-limiting",
        title: "Rate Limiting",
        content: `
### Why Rate Limit?
- **Prevent abuse** — stop runaway scripts from burning through your budget
- **Fair usage** — ensure all teams/users get their share of capacity
- **Provider protection** — stay within provider rate limits proactively

### Rate Limit Granularity

| Level | What it Limits | Example |
|-------|---------------|---------|
| **Global** | All requests to the proxy | 1000 RPM total |
| **Per API Key** | Requests per virtual key | Key X: 100 RPM |
| **Per User** | Requests per user identity | User Alice: 50 RPM |
| **Per Model** | Requests per model | GPT-4: 200 RPM |

### Limit Types
- **RPM** — Requests Per Minute
- **TPM** — Tokens Per Minute

### Configuration (Proxy config.yaml)

\`\`\`yaml
general_settings:
  master_key: sk-admin-key
\`\`\`

Rate limits are set when generating API keys:

\`\`\`bash
curl -X POST http://localhost:4000/key/generate \\
  -H "Authorization: Bearer sk-admin-key" \\
  -d '{
    "max_parallel_requests": 10,
    "tpm_limit": 50000,
    "rpm_limit": 100,
    "models": ["gpt-4o"]
  }'
\`\`\`

When a limit is exceeded, LiteLLM returns HTTP **429 Too Many Requests** with a clear error message.
        `,
      },
      {
        id: "guardrails-content",
        title: "Content Guardrails",
        content: `
### What Are Guardrails?

Guardrails are safety mechanisms that inspect and filter both **user inputs** (prompts) and **model outputs** (responses) to enforce policies:

### Types of Guardrails

| Guardrail | What it Does | Applied To |
|-----------|-------------|-----------|
| **PII Masking** | Detects and redacts personal data (names, emails, SSNs) | Input & Output |
| **Prompt Injection Defense** | Blocks attempts to hijack the model's instructions | Input |
| **Content Moderation** | Filters toxic, harmful, or inappropriate content | Input & Output |
| **Topic Restriction** | Blocks queries about forbidden topics | Input |
| **Custom Rules** | Your own business logic and policies | Input & Output |

### How Guardrails Work
1. **Pre-call guardrails** inspect the user's prompt before it reaches the LLM
2. If a violation is detected, the request is **blocked** with an error (no LLM call = no cost)
3. **Post-call guardrails** inspect the LLM's response before it reaches the user
4. If the response violates policies, it is **redacted** or **replaced**

### Configuration Example (config.yaml)

\`\`\`yaml
guardrails:
  - guardrail_name: pii_masking
    litellm_params:
      guardrail: presidio
      mode: pre_call     # Before LLM call
      actions:
        - mask           # Replace PII with [REDACTED]

  - guardrail_name: content_filter
    litellm_params:
      guardrail: lakera
      mode: during_call  # During processing
      actions:
        - block          # Block policy-violating content
\`\`\`

> **Why Guardrails Matter:** In production, especially in regulated industries (healthcare, finance), guardrails are essential for compliance, safety, and trust.
        `,
        diagram: `graph LR
    User[User Prompt] --> PreGuard{Pre-Call Guardrails}
    PreGuard -->|PII Detected| Block1[Block / Redact]
    PreGuard -->|Injection Detected| Block2[Block Request]
    PreGuard -->|Clean| LLM[LLM Provider]
    LLM --> PostGuard{Post-Call Guardrails}
    PostGuard -->|Toxic Content| Redact[Redact / Replace]
    PostGuard -->|Clean| Response[Return to User]`,
      },
      {
        id: "virtual-keys",
        title: "Virtual API Keys & Access Control",
        content: `
### The Problem with Sharing Provider Keys
- If you share your OpenAI key with 10 developers, **any one** of them can blow your budget
- You have **no visibility** into who used what
- **Revoking access** means changing the key for everyone

### Virtual Keys
LiteLLM's proxy creates **virtual API keys** that map to your real provider keys:

| Feature | Raw Provider Key | LiteLLM Virtual Key |
|---------|-----------------|-------------------|
| Budget control | ❌ | ✅ Per-key budget |
| Usage tracking | ❌ | ✅ Per-key metrics |
| Model restriction | ❌ | ✅ Limit which models |
| Easy revocation | ❌ Affects everyone | ✅ Revoke one key |
| Rate limiting | ❌ | ✅ Per-key RPM/TPM |

### Creating & Managing Keys

\`\`\`bash
# Generate a virtual key with restrictions
curl -X POST http://localhost:4000/key/generate \\
  -H "Authorization: Bearer sk-admin-master-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "key_alias": "backend-team-key",
    "max_budget": 100.0,
    "budget_duration": "monthly",
    "models": ["gpt-4o", "claude-sonnet"],
    "rpm_limit": 100,
    "tpm_limit": 100000,
    "metadata": {"team": "backend", "project": "chatbot"}
  }'

# List all keys
curl http://localhost:4000/key/info \\
  -H "Authorization: Bearer sk-admin-master-key"

# Revoke a key
curl -X POST http://localhost:4000/key/delete \\
  -H "Authorization: Bearer sk-admin-master-key" \\
  -d '{"keys": ["sk-key-to-revoke"]}'
\`\`\`
        `,
      },
    ],
  },
  {
    id: "litellm-advanced",
    title: "Advanced Features",
    description:
      "Function calling, structured outputs, image models, and tool use.",
    icon: "Wrench",
    sections: [
      {
        id: "function-calling",
        title: "Function / Tool Calling",
        content: `
### What is Function Calling?

Function calling (also called tool use) lets the LLM **decide when to call external functions** and what arguments to pass. This is how you give LLMs the ability to:
- Search the web
- Query databases
- Call APIs
- Perform calculations

### How It Works with LiteLLM
1. You define **tools** (function schemas) in your request
2. The LLM decides if it needs to call a tool
3. LiteLLM returns the tool call (function name + arguments)
4. Your code executes the function and sends the result back
5. The LLM generates a final response using the function result

### Cross-Provider Compatibility
LiteLLM normalizes tool calling across providers — the same tool definition works with OpenAI, Anthropic, Gemini, and more.
        `,
        code: `from litellm import completion
import json

# Define tools (functions the LLM can call)
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the current weather for a city",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "The city name, e.g. San Francisco"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "Temperature unit"
                    }
                },
                "required": ["city"]
            }
        }
    }
]

# Step 1: Ask the LLM (it will decide to call get_weather)
response = completion(
    model="openai/gpt-4o",
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}],
    tools=tools,
    tool_choice="auto"
)

# Step 2: Check if the LLM wants to call a function
message = response.choices[0].message
if message.tool_calls:
    tool_call = message.tool_calls[0]
    args = json.loads(tool_call.function.arguments)
    print(f"LLM wants to call: {tool_call.function.name}({args})")

    # Step 3: Execute the function (your real implementation)
    weather_result = {"temp": 22, "condition": "Sunny", "city": args["city"]}

    # Step 4: Send the result back to the LLM
    final_response = completion(
        model="openai/gpt-4o",
        messages=[
            {"role": "user", "content": "What's the weather in Tokyo?"},
            message,  # The assistant's tool call message
            {
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(weather_result)
            }
        ]
    )
    print("Final:", final_response.choices[0].message.content)`,
      },
      {
        id: "structured-output",
        title: "Structured Output (JSON Mode)",
        content: `
### Getting Structured Data from LLMs

By default, LLMs return free-form text. But often you need **structured data** (JSON objects) for your application logic.

### Method 1: JSON Mode
Tell the LLM to respond in JSON format:

\`\`\`python
response = completion(
    model="openai/gpt-4o",
    messages=[{"role": "user", "content": "List 3 Python frameworks as JSON"}],
    response_format={"type": "json_object"}
)
\`\`\`

### Method 2: Pydantic Models with Instructor
For type-safe, validated structured outputs, use the **Instructor** library with LiteLLM:

This gives you **runtime validation** — if the LLM's output doesn't match your schema, Instructor automatically retries.
        `,
        code: `# --- Method 1: JSON Mode ---
from litellm import completion
import json

response = completion(
    model="openai/gpt-4o",
    messages=[
        {"role": "system", "content": "Respond only in valid JSON."},
        {"role": "user", "content": "List 3 programming languages with their year of creation."}
    ],
    response_format={"type": "json_object"}
)

data = json.loads(response.choices[0].message.content)
print(json.dumps(data, indent=2))

# --- Method 2: Pydantic + Instructor ---
# pip install instructor pydantic
import instructor
from pydantic import BaseModel
from typing import List

class Language(BaseModel):
    name: str
    year: int
    paradigm: str

class LanguageList(BaseModel):
    languages: List[Language]

# Create an instructor-patched client
client = instructor.from_provider("litellm/openai/gpt-4o")

result = client.create(
    messages=[{"role": "user", "content": "List 3 programming languages with their year and paradigm"}],
    response_model=LanguageList,
)

for lang in result.languages:
    print(f"{lang.name} ({lang.year}) - {lang.paradigm}")`,
      },
      {
        id: "image-generation",
        title: "Image Generation & Multimodal",
        content: `
### Image Generation

LiteLLM supports image generation through providers like OpenAI (DALL-E) using the same unified interface.

### Vision / Multimodal Models

You can also send **images as input** to vision-capable models (GPT-4o, Claude 3, Gemini):

\`\`\`python
response = completion(
    model="openai/gpt-4o",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "What's in this image?"},
            {"type": "image_url", "image_url": {"url": "https://example.com/photo.jpg"}}
        ]
    }]
)
print(response.choices[0].message.content)
\`\`\`

### Audio Transcription

Whisper models are also supported:

\`\`\`python
from litellm import transcription

response = transcription(
    model="whisper-1",
    file=open("audio.mp3", "rb")
)
print(response.text)
\`\`\`

### Summary of Multimodal Support

| Capability | Models | Example |
|-----------|--------|---------|
| Text → Text | All chat models | Standard completion |
| Text → Image | DALL-E 3 | Image generation |
| Image → Text | GPT-4o, Claude 3, Gemini | Vision / image analysis |
| Audio → Text | Whisper | Transcription |
| Text → Embedding | Ada, Gecko, Titan | Vector embeddings |
        `,
      },
    ],
  },
  {
    id: "litellm-production",
    title: "Production Best Practices",
    description:
      "Monitoring, observability, scaling, and interview preparation for LiteLLM.",
    icon: "Rocket",
    sections: [
      {
        id: "observability",
        title: "Monitoring & Observability",
        content: `
### Why Monitor LLM Traffic?

LLM calls are **expensive, non-deterministic, and latency-sensitive**. In production, you need visibility into:
- **Latency** — are responses taking too long?
- **Error rates** — are providers failing?
- **Cost** — how much is each team/model spending?
- **Quality** — are responses satisfactory?

### Observability Integrations

| Tool | What it Provides | Config |
|------|-----------------|--------|
| **Langfuse** | Prompt tracing, analytics, evaluation | \`success_callback: ["langfuse"]\` |
| **Datadog** | APM, dashboards, alerts | \`success_callback: ["datadog"]\` |
| **Prometheus** | Metrics scraping for Grafana | Built-in /metrics endpoint |
| **OpenTelemetry** | Distributed tracing | OTEL exporter integration |

### Key Metrics to Monitor

| Metric | Why It Matters |
|--------|---------------|
| \`litellm_request_duration_seconds\` | Track latency by model/provider |
| \`litellm_request_total\` | Request volume and error rates |
| \`litellm_tokens_total\` | Token usage for cost forecasting |
| \`litellm_cost_total\` | Real-time spend tracking |
| \`litellm_deployment_state\` | Which deployments are healthy/in cooldown |
        `,
        code: `import litellm
from litellm import completion

# --- Enable Langfuse Tracing ---
litellm.success_callback = ["langfuse"]
litellm.failure_callback = ["langfuse"]

# Set Langfuse credentials
import os
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-xxx"
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-xxx"
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com"

# Every call is now automatically traced in Langfuse
response = completion(
    model="openai/gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}],
    metadata={
        "trace_name": "my-chatbot",
        "trace_user_id": "user-123",
        "tags": ["production", "v2"]
    }
)

# --- Proxy: Enable Prometheus Metrics ---
# In config.yaml:
# litellm_settings:
#   success_callback: ["prometheus"]
#   failure_callback: ["prometheus"]
#
# Metrics available at: http://localhost:4000/metrics
# Connect to Grafana for dashboards`,
      },
      {
        id: "scaling-tips",
        title: "Scaling & Performance Tips",
        content: `
### Production Checklist

✅ **Use the Proxy Server** — centralize auth, routing, and logging
✅ **Enable Redis Caching** — reduce costs and latency for repeated queries
✅ **Set Up Fallbacks** — never let a single provider outage break your app
✅ **Configure Rate Limits** — protect against runaway costs and abuse
✅ **Monitor Everything** — Prometheus + Grafana or Datadog for dashboards
✅ **Use Async** — \`acompletion()\` for non-blocking calls in web servers
✅ **Set Budgets** — per-key and per-team spending limits
✅ **Enable Guardrails** — PII masking and content moderation for compliance

### Scaling Architecture

| Component | Scaling Strategy |
|-----------|-----------------|
| **Proxy Servers** | Horizontal scaling (multiple replicas behind a load balancer) |
| **Database (PostgreSQL)** | Primary + read replicas for logging/analytics |
| **Cache (Redis)** | Redis Cluster or Redis Sentinel for HA |
| **Workers** | Increase \`--num_workers\` per proxy instance |

### Hardware Recommendations (Proxy Server)

| Traffic Level | CPU | RAM | Workers |
|--------------|-----|-----|---------|
| Low (< 100 RPM) | 2 cores | 4 GB | 4 |
| Medium (100-1000 RPM) | 4 cores | 8 GB | 8 |
| High (1000+ RPM) | 8+ cores | 16+ GB | 16+ |

### Security Best Practices
- **Never expose raw provider keys** — use LiteLLM virtual keys
- **Use environment variables** for all secrets (never hardcode)
- **Run the proxy behind a reverse proxy** (Nginx, Traefik) with TLS
- **Enable audit logging** for compliance
- **Rotate API keys** regularly
        `,
        diagram: `graph TD
    subgraph Load_Balancer [Load Balancer - Nginx/Traefik]
        LB[TLS Termination]
    end
    subgraph LiteLLM_Cluster [LiteLLM Proxy Cluster]
        P1[Proxy Instance 1]
        P2[Proxy Instance 2]
        P3[Proxy Instance 3]
    end
    subgraph Storage [Shared Storage]
        PG[(PostgreSQL)]
        Redis[(Redis Cache)]
    end
    subgraph Monitoring [Observability]
        Prom[Prometheus]
        Graf[Grafana Dashboard]
    end
    LB --> P1
    LB --> P2
    LB --> P3
    P1 --> PG
    P2 --> PG
    P3 --> PG
    P1 --> Redis
    P2 --> Redis
    P3 --> Redis
    P1 --> Prom
    P2 --> Prom
    P3 --> Prom
    Prom --> Graf`,
      },
      {
        id: "interview-questions",
        title: "LiteLLM Interview Questions",
        content: `
### Common Interview Questions

**Q1: What problem does LiteLLM solve?**
> LiteLLM provides a unified, OpenAI-compatible interface to call 100+ LLM APIs from different providers. It solves the problem of vendor lock-in, inconsistent APIs, and fragmented cost/logging across providers.

**Q2: What is the difference between the SDK and the Proxy Server?**
> The SDK is a Python library you import and use in code. The Proxy Server is a standalone HTTP API gateway that any language can call, with centralized auth, budgets, and logging.

**Q3: How does LiteLLM handle failover?**
> Through the Router class with fallback chains. If a model deployment fails after N retries with exponential backoff, the Router falls back to alternative model groups. Deployments enter cooldown after repeated failures.

**Q4: How would you set up LiteLLM for a 50-person engineering team?**
> Deploy the Proxy Server via Docker with PostgreSQL and Redis. Create virtual API keys per team with budget limits. Enable rate limiting, caching, and monitoring (Prometheus + Grafana). Set up fallbacks across providers.

**Q5: What caching strategies does LiteLLM support?**
> Exact-match caching (in-memory, Redis, S3, GCS) and semantic caching (using embeddings to match similar but not identical queries). Semantic cache is useful for chatbots where users phrase questions differently.

**Q6: How does LiteLLM track costs?**
> It knows the pricing for all supported models and automatically calculates cost per request based on token usage. With the Proxy, costs are tracked per API key, user, and team with budget enforcement.

**Q7: What is the model string convention?**
> LiteLLM uses \`provider/model-name\` format (e.g., \`openai/gpt-4o\`, \`anthropic/claude-3-opus\`). This tells LiteLLM which provider's API to call and handles all translation automatically.

**Q8: How would you implement guardrails with LiteLLM?**
> Configure pre-call guardrails (PII masking, prompt injection defense) and post-call guardrails (content moderation) in the proxy config. Guardrails can block, redact, or alert on policy violations before/after LLM calls.
        `,
      },
    ],
  },
];
