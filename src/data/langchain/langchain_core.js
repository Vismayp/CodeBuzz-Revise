export const langchainTopics = [
  {
    id: "lc-orientation",
    title: "1. Ecosystem & Setup",
    description: "What LangChain is, when to use it, and a modern Python setup.",
    icon: "Compass",
    sections: [
      {
        id: "ecosystem-map",
        title: "The LangChain Ecosystem",
        content: `
## The one-sentence mental model

**LangChain** supplies model, message, tool, retrieval, and agent abstractions. **LangGraph** is the lower-level stateful orchestration runtime beneath LangChain agents. **Langfuse** is an independent, open-source observability and evaluation platform that can instrument both.

| Layer | Main question | Reach for it when |
|---|---|---|
| Model SDK | How do I call one provider? | You need a small, direct API call |
| LangChain | How do I compose models, tools, retrieval, and agents? | You want provider-neutral application components |
| LangGraph | How does execution branch, loop, pause, persist, and resume? | The workflow needs explicit state and control |
| Langfuse | What happened, what did it cost, and did quality improve? | You need traces, prompts, scores, datasets, and experiments |

LangChain v1 agents are compiled LangGraph graphs. Start with a LangChain agent for the common model-tool loop; drop to raw LangGraph when topology, persistence, or human control must be explicit.

> These tools solve engineering problems around an LLM. They do not make a weak model knowledgeable, eliminate prompt injection, or guarantee factual answers.
        `,
        diagram: `flowchart LR
  U[User / App] --> LC[LangChain components]
  LC --> LG[LangGraph runtime]
  LC --> M[Model providers]
  LG --> T[Tools and data]
  LC -. traces .-> LF[Langfuse]
  LG -. traces .-> LF
  LF --> E[Evaluation and improvement]`,
      },
      {
        id: "installation-config",
        title: "Installation, Keys & First Call",
        content: `
Install only the provider integrations you use. The packages evolve independently, so pin compatible versions in real projects and consult each integration's release notes during upgrades.

~~~bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -U langchain langchain-openai langgraph pydantic python-dotenv
~~~

Keep secrets in environment variables, never source control. A model identifier is intentionally configurable because available models change over time.

Every modern LangChain component follows the **Runnable** contract: synchronous/async invocation, batching, streaming, configuration, and composition.
        `,
        code: `import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model

load_dotenv()
assert os.environ.get("OPENAI_API_KEY"), "Set OPENAI_API_KEY"

model = init_chat_model(
    os.getenv("CHAT_MODEL", "openai:gpt-4.1-mini"),
    temperature=0,
)

reply = model.invoke("Explain a vector embedding in one analogy.")
print(reply.content)`,
        language: "python",
      },
      {
        id: "architecture-decision",
        title: "Choose the Smallest Useful Abstraction",
        content: `
Use this decision rule:

1. **One model call?** Use the provider SDK or a LangChain chat model.
2. **Fixed sequence of transformations?** Use LCEL runnables.
3. **Model chooses among tools in a standard loop?** Use \`create_agent\`.
4. **Custom branches, cycles, approvals, durable jobs, or multiple agents?** Use LangGraph.
5. **Any production path?** Instrument it and build evals from day one.

The most reliable systems are usually **hybrid**: deterministic code owns validation, permissions, money, and irreversible side effects; the model handles interpretation, generation, and fuzzy ranking.
        `,
        diagram: `flowchart TD
  A[New LLM feature] --> B{Fixed flow?}
  B -- yes --> C[LCEL chain]
  B -- no --> D{Standard tool loop?}
  D -- yes --> E[LangChain agent]
  D -- no --> F[LangGraph]
  C --> O[Trace and evaluate]
  E --> O
  F --> O`,
      },
    ],
  },
  {
    id: "lc-model-io",
    title: "2. Models, Messages & Prompts",
    description: "The data flowing into and out of chat models.",
    icon: "MessageSquare",
    sections: [
      {
        id: "messages-models",
        title: "Chat Models and Message Semantics",
        content: `
A chat model consumes an ordered message history. Roles are part of the protocol:

- **system**: durable behavior and boundaries;
- **human/user**: the user's request;
- **ai/assistant**: model responses, including tool calls;
- **tool**: a tool result tied to a particular call ID.

Responses are message objects, not merely strings. Besides \`content\`, inspect tool calls, response metadata, token usage, finish reason, and provider-specific fields. Do not concatenate roles into an untrusted text blob; preserve message boundaries.
        `,
        code: `from langchain_core.messages import SystemMessage, HumanMessage
from langchain.chat_models import init_chat_model

model = init_chat_model("openai:gpt-4.1-mini", temperature=0)
messages = [
    SystemMessage("You teach using short, precise examples."),
    HumanMessage("What is semantic search?"),
]
response = model.invoke(messages)
print(response.content)
print(response.usage_metadata)`,
        language: "python",
        diagram: `sequenceDiagram
  participant App
  participant Model
  App->>Model: system + prior messages + user
  Model-->>App: AIMessage(content/tool_calls/metadata)`,
      },
      {
        id: "prompt-templates",
        title: "Prompt Templates and Context Boundaries",
        content: `
Templates separate stable instructions from runtime variables. Prefer message templates over building a single long string. Treat retrieved documents and tool output as **untrusted data**, label them clearly, and tell the model never to follow instructions found inside them.

Good prompts specify the task, available evidence, constraints, output contract, and what to do when evidence is missing. Few-shot examples are useful when the desired mapping is easier to demonstrate than describe.
        `,
        code: `from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "You answer only from CONTEXT. If absent, say 'I don't know'."),
    ("human", "CONTEXT (untrusted data):\n{context}\n\nQUESTION: {question}"),
])

rendered = prompt.invoke({
    "context": "Refunds are available for 30 days.",
    "question": "Can I return an item after 20 days?",
})
print(rendered.to_messages())`,
        language: "python",
      },
      {
        id: "structured-output",
        title: "Structured Output with Pydantic",
        content: `
Parsing prose with regular expressions is brittle. Ask the model for a typed schema instead. A schema provides field names, descriptions, validation, and a predictable application boundary.

Provider-native structured output is usually strongest when supported; tool-based structured output is the portable fallback. Validation proves the **shape**, not the truth, of the answer—validate business rules separately.
        `,
        code: `from typing import Literal
from pydantic import BaseModel, Field
from langchain.chat_models import init_chat_model

class Ticket(BaseModel):
    category: Literal["billing", "technical", "account"]
    urgency: int = Field(ge=1, le=5)
    summary: str

model = init_chat_model("openai:gpt-4.1-mini", temperature=0)
classifier = model.with_structured_output(Ticket)
ticket = classifier.invoke("I was charged twice and need help today")
print(ticket.model_dump())`,
        language: "python",
        diagram: `flowchart LR
  P[Prompt] --> M[Model]
  M --> S[Schema decoding]
  S --> V{Validation}
  V -- valid --> O[Typed object]
  V -- invalid --> R[Retry or fail safely]`,
      },
    ],
  },
  {
    id: "lc-runnables",
    title: "3. LCEL & Runnables",
    description: "Composable, streamable, testable pipelines.",
    icon: "Workflow",
    sections: [
      {
        id: "runnable-contract",
        title: "The Runnable Contract",
        content: `
LangChain Expression Language (LCEL) composes Runnables with \`|\`. The usual chain is \`prompt | model | parser\`, but the key idea is a uniform contract:

| Method | Purpose |
|---|---|
| \`invoke / ainvoke\` | one input |
| \`batch / abatch\` | many independent inputs |
| \`stream / astream\` | incremental output |
| \`with_config\` | tags, metadata, runtime configuration |
| \`with_retry\` | retry transient failures |

The pipe operator passes the left output to the right input. Make every boundary's input/output shape explicit; most LCEL bugs are shape mismatches.
        `,
        code: `from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template("Explain {topic} in 3 bullets.")
chain = prompt | model | StrOutputParser()

print(chain.invoke({"topic": "LCEL"}))
print(chain.batch([{"topic": "RAG"}, {"topic": "agents"}]))
for token in chain.stream({"topic": "streaming"}):
    print(token, end="", flush=True)`,
        language: "python",
      },
      {
        id: "parallel-branch-lambda",
        title: "Parallel, Branch and Lambda",
        content: `
- \`RunnableParallel\` fans one input into independent branches.
- \`RunnablePassthrough.assign\` enriches a dictionary without discarding it.
- \`RunnableBranch\` selects a path deterministically.
- \`RunnableLambda\` adapts ordinary functions, but keep side effects explicit and testable.

Parallelism reduces latency only for independent work; it can increase rate-limit pressure and cost.
        `,
        code: `from langchain_core.runnables import RunnableLambda, RunnableParallel

normalize = RunnableLambda(lambda x: x.strip().lower())
features = RunnableParallel({
    "normalized": normalize,
    "length": RunnableLambda(len),
    "has_question": RunnableLambda(lambda x: "?" in x),
})

print(features.invoke("  What is LCEL?  "))`,
        language: "python",
        diagram: `flowchart LR
  I[Input] --> A[Normalize]
  I --> B[Length]
  I --> C[Question check]
  A --> J[Combined dictionary]
  B --> J
  C --> J`,
      },
      {
        id: "resilience-config",
        title: "Runtime Configuration, Retry & Fallback",
        content: `
Retries are appropriate for transient network failures and rate limits—not deterministic validation failures. Use exponential backoff, cap attempts, and ensure side-effecting operations are idempotent. Fallbacks may switch providers or models, but test whether their output contracts truly match.

Pass trace metadata such as user, feature, environment, and experiment version through configuration rather than baking it into prompts.
        `,
        code: `primary = model.with_retry(stop_after_attempt=3)
fallback = init_chat_model("anthropic:claude-sonnet-4-5")
resilient = primary.with_fallbacks([fallback])

answer = resilient.invoke(
    "Summarize the incident.",
    config={
        "tags": ["support", "production"],
        "metadata": {"prompt_version": "support-v3"},
    },
)
print(answer.content)`,
        language: "python",
      },
    ],
  },
  {
    id: "lc-tools-agents",
    title: "4. Tools & Agents",
    description: "Safe tool contracts and the model-tool execution loop.",
    icon: "Bot",
    sections: [
      {
        id: "tool-design",
        title: "Designing Reliable Tools",
        content: `
A tool is a typed capability exposed to the model. Its name, docstring, argument schema, output, errors, latency, and permissions are part of the product.

Good tools are narrow, deterministic where possible, explicit about units and formats, and return compact machine-readable results. Validate all arguments in code. Separate read tools from write tools, require approval for consequential actions, and never rely on the model as an authorization layer.
        `,
        code: `from pydantic import BaseModel, Field
from langchain.tools import tool

class SearchInput(BaseModel):
    query: str = Field(min_length=3, max_length=200)
    limit: int = Field(default=5, ge=1, le=10)

@tool(args_schema=SearchInput)
def search_catalog(query: str, limit: int = 5) -> list[dict]:
    """Search product names and descriptions; does not place orders."""
    # Replace with a parameterized database/search call.
    return [{"id": "p-17", "name": "Travel mug", "score": 0.92}][:limit]`,
        language: "python",
        diagram: `flowchart LR
  M[Model proposes call] --> V[Schema validation]
  V --> A{Authorized?}
  A -- no --> D[Deny safely]
  A -- yes --> T[Execute tool]
  T --> R[Compact result]
  R --> M`,
      },
      {
        id: "create-agent",
        title: "A Modern LangChain Agent",
        content: `
An agent repeatedly asks a model what to do, executes requested tools, appends results to state, and stops when the model returns a final answer. In LangChain v1, \`create_agent\` creates this loop on LangGraph.

Use a low step limit, timeouts, restricted tool sets, and clear termination criteria. Agentic flexibility is useful when the path cannot be known in advance; a fixed chain is cheaper and more predictable when it can.
        `,
        code: `from langchain.agents import create_agent

agent = create_agent(
    model="openai:gpt-4.1-mini",
    tools=[search_catalog],
    system_prompt=(
        "You help users find products. Never claim an order was placed; "
        "you only have a read-only search tool."
    ),
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "Find a travel mug"}]
})
print(result["messages"][-1].content)`,
        language: "python",
        diagram: `flowchart TD
  U[User message] --> M[Model]
  M --> Q{Tool call?}
  Q -- yes --> T[Tool execution]
  T --> M
  Q -- no --> F[Final answer]`,
      },
      {
        id: "agent-middleware",
        title: "Middleware, Guardrails & Structured Results",
        content: `
Middleware hooks can transform model requests, wrap tool calls, summarize long histories, redact PII, add retries, select models dynamically, and pause sensitive tools for human approval.

Guardrails belong at several layers: input screening, tool argument validation, permission checks, output validation, and monitoring. Prompt instructions are helpful but are not a security boundary.

For typed agent results, pass a Pydantic schema through \`response_format\`. LangChain can select provider-native or tool-based structured output based on model support.
        `,
        code: `from pydantic import BaseModel
from langchain.agents import create_agent

class Recommendation(BaseModel):
    product_ids: list[str]
    rationale: str
    needs_human_help: bool

typed_agent = create_agent(
    model="openai:gpt-4.1-mini",
    tools=[search_catalog],
    response_format=Recommendation,
)
result = typed_agent.invoke({
    "messages": [{"role": "user", "content": "Recommend a leak-proof mug"}]
})
print(result["structured_response"])
`,
        language: "python",
      },
    ],
  },
  {
    id: "lc-retrieval",
    title: "5. Retrieval & RAG",
    description: "From documents to grounded answers and measurable retrieval.",
    icon: "Database",
    sections: [
      {
        id: "rag-pipeline",
        title: "RAG Mental Model",
        content: `
Retrieval-Augmented Generation supplies external evidence at inference time.

**Offline/indexing path:** load → clean → split → embed → store.  
**Online/query path:** transform query → retrieve → rerank/filter → construct context → generate → cite.

RAG helps with private, recent, or source-grounded knowledge. It does not automatically fix poor documents, missing coverage, ambiguous questions, bad chunking, or a model that ignores evidence.
        `,
        diagram: `flowchart TB
  subgraph Offline[Indexing]
    D[Documents] --> L[Load and clean] --> C[Chunk] --> E[Embed] --> V[(Vector store)]
  end
  subgraph Online[Answering]
    Q[Question] --> QE[Query embedding] --> V
    V --> RR[Filter / rerank] --> CT[Context builder] --> M[Model] --> A[Answer + citations]
  end`,
      },
      {
        id: "documents-splitting",
        title: "Documents, Loaders and Chunking",
        content: `
A LangChain \`Document\` contains \`page_content\` plus metadata. Preserve source, title, section, timestamps, access-control labels, and stable IDs; citations and filtered retrieval depend on them.

Chunk on semantic boundaries before falling back to character windows. Chunk size trades precision against context. Overlap can preserve cross-boundary meaning but duplicates evidence and cost. Parent-child retrieval, headings, code-aware splitters, and table-specific parsing often outperform one universal splitter.
        `,
        code: `from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

docs = [Document(
    page_content="Refund policy\nItems may be returned within 30 days...",
    metadata={"source": "policy.md", "section": "refunds", "acl": "public"},
)]
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=75,
    add_start_index=True,
)
chunks = splitter.split_documents(docs)
print(chunks[0].metadata)`,
        language: "python",
      },
      {
        id: "embeddings-vectorstores",
        title: "Embeddings, Similarity and Vector Stores",
        content: `
An embedding maps meaning to a numeric vector. Similar items should be close under a similarity function such as cosine similarity. The vector store indexes vectors and metadata; it is not the embedding model itself.

Use the same compatible embedding model for documents and queries. Re-embed when the model or preprocessing changes, version indexes, filter by authorization **before** exposing results, and combine semantic search with keyword search when exact identifiers matter.

Distance scores are model/store specific—not calibrated truth probabilities.
        `,
        diagram: `flowchart LR
  T[Text] --> EM[Embedding model] --> X[Vector: 0.12, -0.44, ...]
  X --> VS[(Index + metadata)]
  Q[Query vector] --> NN[Nearest-neighbor search]
  VS --> NN --> K[Top-k candidates]`,
      },
      {
        id: "retriever-chain",
        title: "Build a Minimal RAG Chain",
        content: `
Keep retrieval and generation separately testable. Format documents with stable source labels, cap context size, and require citations. If retrieval returns weak or conflicting evidence, abstain or ask a clarifying question.
        `,
        code: `from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda, RunnablePassthrough

def format_docs(docs):
    return "\n\n".join(
        f"SOURCE={d.metadata['source']}\n{d.page_content}" for d in docs
    )

# retriever is created by your chosen vector store: store.as_retriever(...)
rag = (
    {
        "context": retriever | RunnableLambda(format_docs),
        "question": RunnablePassthrough(),
    }
    | prompt
    | model
    | StrOutputParser()
)
print(rag.invoke("What is the refund window?"))`,
        language: "python",
      },
      {
        id: "advanced-rag",
        title: "Advanced Retrieval Patterns",
        content: `
| Problem | Technique |
|---|---|
| User language differs from documents | query rewriting or multi-query retrieval |
| Exact codes/names matter | hybrid BM25 + vector retrieval |
| Top results are semantically close but not useful | cross-encoder/LLM reranking |
| Long documents lose local context | parent-document or hierarchical retrieval |
| Questions require connected facts | iterative/agentic retrieval or graph retrieval |
| Filterable tenant/date/product data | metadata filtering |

Evaluate retrieval first with **Recall@k, MRR, nDCG, context precision**, then evaluate generation for faithfulness, answer relevance, correctness, and citation quality. Otherwise a polished answer can hide a broken retriever.
        `,
        diagram: `flowchart LR
  Q[Question] --> RW[Rewrite / decompose]
  RW --> S1[Semantic search]
  RW --> S2[Keyword search]
  S1 --> M[Merge + deduplicate]
  S2 --> M
  M --> R[Rerank]
  R --> G[Grounded generation]`,
      },
    ],
  },
  {
    id: "lc-memory-context",
    title: "6. Memory & Context Engineering",
    description: "Short-term state, long-term stores, and token-budget discipline.",
    icon: "Brain",
    sections: [
      {
        id: "memory-types",
        title: "Memory Is Not One Thing",
        content: `
Separate these concepts:

- **Conversation state:** messages and working data for one thread; usually checkpointed.
- **Long-term semantic memory:** facts/preferences retrieved across threads; usually stored by user or namespace.
- **Episodic memory:** past events or successful trajectories.
- **Procedural memory:** instructions, policies, and learned routines.
- **Application database:** authoritative records such as orders and balances—never replace these with fuzzy model memory.

Legacy \`ConversationBufferMemory\` tutorials describe older APIs. In current agent applications, message state plus LangGraph checkpointing is the primary short-term memory pattern.
        `,
        diagram: `flowchart TD
  C[Current request] --> ST[Thread state / checkpoint]
  C --> LT[Long-term memory store]
  C --> DB[Authoritative database]
  ST --> P[Context assembly]
  LT --> P
  DB --> P
  P --> M[Model]`,
      },
      {
        id: "context-window",
        title: "Context Windows, Trimming and Summarization",
        content: `
More context is not always better. Long histories increase cost and latency, dilute important instructions, and may exceed model limits. Build a context budget that reserves space for system instructions, user input, tool schemas, retrieved evidence, and output.

Common strategies are last-N messages, token-aware trimming, rolling summaries, selective fact extraction, and retrieval over prior conversations. Summaries are lossy: retain links to raw history for audit and refresh summaries when important state changes.
        `,
        code: `from langchain_core.messages import trim_messages

trimmed = trim_messages(
    messages,
    strategy="last",
    token_counter=model,
    max_tokens=3000,
    start_on="human",
    include_system=True,
    allow_partial=False,
)
reply = model.invoke(trimmed)`,
        language: "python",
      },
      {
        id: "memory-safety",
        title: "Memory Safety & Privacy",
        content: `
Memory creates security and privacy obligations. Define retention, deletion, consent, tenant isolation, encryption, audit access, and the fields that must never be remembered. Avoid storing secrets or unverified model inferences as facts.

Use provenance and confidence with extracted memories, allow corrections, and protect retrieval with the same authorization rules as the source system. A user ID in metadata is not sufficient unless every read path enforces it.
        `,
        diagram: `flowchart LR
  E[Candidate memory] --> V{Allowed and verified?}
  V -- no --> X[Discard]
  V -- yes --> N[Namespace by tenant/user]
  N --> R[Retention + deletion policy]
  R --> S[(Encrypted store)]`,
      },
    ],
  },
  {
    id: "lc-production",
    title: "7. Production Engineering",
    description: "Testing, security, performance, and architecture patterns.",
    icon: "ShieldCheck",
    sections: [
      {
        id: "testing-stack",
        title: "Testing an LLM Application",
        content: `
Use a pyramid rather than relying on subjective demos:

1. Unit-test deterministic functions, schemas, routers, and tool authorization.
2. Contract-test model/tool adapters with recorded or fake responses.
3. Evaluate retrieval on labeled queries.
4. Evaluate end-to-end answers on representative datasets.
5. Run a small live smoke suite before deployment.
6. Monitor production traces and convert failures into regression examples.

LLM outputs are variable, so assert semantic properties and structured fields rather than exact prose. Track quality alongside latency, tokens, and cost.
        `,
        diagram: `flowchart TB
  U[Many fast unit tests] --> C[Contract tests]
  C --> R[Retrieval evals]
  R --> E[End-to-end evals]
  E --> S[Few live smoke tests]
  S --> P[Production monitoring]
  P --> U`,
      },
      {
        id: "security-threats",
        title: "Threat Model and Guardrails",
        content: `
Key threats include prompt injection, indirect injection in retrieved content, excessive agency, data exfiltration through tools, insecure output handling, denial-of-wallet, and cross-tenant leakage.

Defenses: least-privilege credentials; allowlisted tools and destinations; input/output validation; sandboxing; approval for writes; quotas and timeouts; context separation; content sanitization before rendering; secret redaction; immutable audit logs; and adversarial evals.

Assume the model can be persuaded. Put irreversible decisions in deterministic policy code.
        `,
        diagram: `flowchart LR
  U[Untrusted input/data] --> M[Model]
  M --> P[Policy gate]
  P -->|read-only| T1[Safe tools]
  P -->|sensitive| H[Human approval]
  P -->|forbidden| X[Deny]
  T1 --> O[Validated output]
  H --> O`,
      },
      {
        id: "performance-cost",
        title: "Latency, Cost and Reliability",
        content: `
Measure before optimizing. Break total latency into queueing, retrieval, model time-to-first-token, generation, tool calls, and post-processing.

Useful levers include smaller routing models, prompt/context compression, caching safe deterministic results, parallel independent calls, streaming, batching offline jobs, timeouts, circuit breakers, and model fallbacks. Track p50/p95/p99—not only averages.

Cache keys must include every behavior-changing input: model, prompt version, tools, temperature, schema, tenant-safe context, and relevant configuration.
        `,
        diagram: `gantt
  title Typical request latency
  dateFormat X
  axisFormat %L ms
  section Request
  Retrieve :0, 120
  Model first token :120, 650
  Stream output :650, 1300
  Validate :1300, 1360`,
      },
      {
        id: "reference-architecture",
        title: "Production Reference Architecture",
        content: `
A production service usually separates the API boundary, orchestration, model gateway, tools, retrieval, persistence, and telemetry. This enables independent testing and least-privilege access.

Store authoritative business state outside graph checkpoints. Use request IDs and idempotency keys across boundaries. Queue long-running work, stream user-visible progress, and make retries safe.
        `,
        diagram: `flowchart TB
  UI[Web / mobile client] --> API[Authenticated API]
  API --> ORCH[LangChain / LangGraph orchestration]
  ORCH --> GW[Model gateway]
  ORCH --> RET[Retrieval service]
  ORCH --> TOOLS[Permissioned tools]
  ORCH --> CP[(Checkpoints)]
  RET --> V[(Vector + document stores)]
  TOOLS --> DB[(Systems of record)]
  ORCH -. OTEL traces .-> LF[Langfuse]
  LF --> EVA[Evals / dashboards / alerts]`,
      },
    ],
  },
];

