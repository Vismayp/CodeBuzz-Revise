export const langfuseTopics = [
  {
    id: "lf-foundations",
    title: "15. Langfuse Foundations",
    description: "Open-source LLM observability and its trace data model.",
    icon: "Activity",
    sections: [
      {
        id: "what-is-langfuse",
        title: "What Langfuse Does",
        content: `
Langfuse is an open-source LLM engineering platform. Its core loop connects **observability**, **prompt management**, **evaluation**, **datasets**, and **experiments**.

Use it to answer: Which prompt/model/tool path produced this answer? Where did latency occur? What did it cost? Which users or releases are affected? Did the new version improve quality? Which production failures should become regression tests?

Langfuse complements application and infrastructure monitoring. It focuses on the semantic structure of LLM work; metrics/log platforms still monitor hosts, queues, databases, and general service health.
        `,
        diagram: `flowchart LR
  B[Build] --> T[Trace]
  T --> A[Analyze failures]
  A --> D[Dataset]
  D --> X[Experiment]
  X --> E[Evaluate]
  E --> P[Promote prompt/model]
  P --> T`,
      },
      {
        id: "data-model",
        title: "Traces, Observations and Sessions",
        content: `
The data model has three useful levels:

- A **trace** is one request or operation, such as one user turn.
- An **observation** is a nested step: span, generation, embedding, tool, retriever, agent, chain, guardrail, or event.
- A **session** groups related traces, such as all turns in one chat or workflow.

Stable observation names are important because dashboards, evaluators, and saved views target them. Add user ID, session ID, release, environment, tags, and prompt/model versions as attributes—but avoid high-cardinality noise and sensitive raw data.
        `,
        diagram: `flowchart TB
  S[Session: chat-42] --> T1[Trace: turn 1]
  S --> T2[Trace: turn 2]
  T1 --> O1[Agent span]
  O1 --> R[Retriever observation]
  O1 --> G[Generation observation]
  O1 --> TL[Tool observation]
  T2 --> O2[Agent span]`,
      },
      {
        id: "setup-client",
        title: "Cloud or Self-Hosted Setup",
        content: `
Create a project and API credentials, or deploy the self-hosted edition. Configure the region-specific/base URL for your instance.

~~~bash
pip install -U langfuse
~~~

~~~text
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_BASE_URL=https://cloud.langfuse.com
~~~

SDK export is buffered. Long-running services flush automatically, but short scripts and serverless tasks should explicitly flush before exit. A failed telemetry export should normally not fail the user's request; monitor exporter health separately.
        `,
        code: `from langfuse import get_client

langfuse = get_client()
if not langfuse.auth_check():
    raise RuntimeError("Langfuse credentials or endpoint are invalid")

# At process shutdown or the end of a short-lived job:
langfuse.flush()`,
        language: "python",
      },
    ],
  },
  {
    id: "lf-instrumentation",
    title: "16. Tracing LangChain & LangGraph",
    description: "Automatic callbacks, manual spans, attributes, and trace design.",
    icon: "ScanSearch",
    sections: [
      {
        id: "langchain-callback",
        title: "LangChain Callback Integration",
        content: `
The Langfuse callback handler turns LangChain and LangGraph runnable events into nested observations. Pass it through \`config\` at the top-level invocation so child calls inherit it.

Use Langfuse's current v3 import path. Older examples may use \`langfuse.callback\`; those target the older SDK. Add semantic metadata at the invocation boundary so the entire trace can be filtered and grouped.
        `,
        code: `from langfuse.langchain import CallbackHandler

handler = CallbackHandler()
result = agent.invoke(
    {"messages": [{"role": "user", "content": "Find a travel mug"}]},
    config={
        "callbacks": [handler],
        "metadata": {
            "langfuse_user_id": "user-123",      # pseudonymous ID
            "langfuse_session_id": "chat-456",
            "langfuse_tags": ["production", "catalog-agent"],
            "release": "2026-07-20.1",
        },
    },
)`,
        language: "python",
        diagram: `sequenceDiagram
  participant App
  participant LangGraph
  participant Model
  participant Tool
  participant Langfuse
  App->>LangGraph: invoke(callback)
  LangGraph->>Model: generation
  Model-->>LangGraph: tool call
  LangGraph->>Tool: execute
  Tool-->>LangGraph: result
  LangGraph-->>App: answer
  LangGraph-->>Langfuse: nested observations`,
      },
      {
        id: "manual-observe",
        title: "Manual Instrumentation with OpenTelemetry Context",
        content: `
Use \`@observe\` for application functions and context managers when span lifetime or attributes need explicit control. The modern Python SDK is based on OpenTelemetry, so current context propagates through compatible integrations.

Choose observation types that reflect semantics. Record useful input/output at the narrowest safe level, and update generations with model and usage information when an integration cannot infer them.
        `,
        code: `from langfuse import observe, get_client

langfuse = get_client()

@observe(name="answer-question", as_type="chain")
def answer_question(question: str) -> str:
    langfuse.update_current_trace(
        user_id="user-123",
        session_id="chat-456",
        tags=["support"],
    )
    with langfuse.start_as_current_observation(
        name="policy-retrieval",
        as_type="retriever",
        input={"query": question},
    ) as retrieval:
        docs = retrieve(question)
        retrieval.update(output={"document_ids": [d.id for d in docs]})
    return generate_answer(question, docs)`,
        language: "python",
      },
      {
        id: "good-trace-design",
        title: "Designing Useful Traces",
        content: `
A trace should reconstruct a decision without becoming a raw data dump. Use stable low-cardinality names such as \`support-agent\`, \`retrieve-policy\`, and \`draft-refund\`. Capture the trace input/output, meaningful nested steps, model and prompt version, tool arguments/results, token usage, latency, errors, and release.

Redact secrets and personal data before export. Prefer IDs, counts, hashes, and document references when full content is unnecessary. Sampling should retain all errors and important score failures while reducing repetitive successful traffic.
        `,
        diagram: `flowchart TD
  TR[Trace: support-turn] --> A[Agent]
  A --> CL[Classify intent]
  A --> RE[Retrieve policy]
  A --> GE[Generate answer]
  GE --> META[model + prompt version + usage]
  TR --> ATTR[user/session/release/tags]
  TR --> SCORE[quality scores]`,
      },
      {
        id: "trace-correlation",
        title: "Correlation Across the Stack",
        content: `
Correlate Langfuse traces with application logs using a shared request or trace ID. Align LangGraph \`thread_id\` with the workflow/session concept but do not assume they are identical: a session can contain many request traces, and a workflow thread may live for days.

For asynchronous work, propagate context explicitly through queue messages. Record parent workflow ID, job ID, tenant, and release. This turns an isolated model trace into an end-to-end operational story.
        `,
        diagram: `flowchart LR
  HTTP[HTTP request_id] --> Q[Queue job_id]
  Q --> LG[LangGraph thread_id]
  LG --> LF[Langfuse trace/session]
  HTTP -. correlate .-> LOG[Application logs]
  Q -. correlate .-> LOG
  LF -. trace ID .-> LOG`,
      },
    ],
  },
  {
    id: "lf-prompts",
    title: "17. Prompt Management",
    description: "Versioned prompts, variables, labels, caching, and release discipline.",
    icon: "FileText",
    sections: [
      {
        id: "prompt-lifecycle",
        title: "Prompt Lifecycle and Labels",
        content: `
Prompt management decouples prompt iteration from application deployment. Each update creates an immutable version. Labels such as \`production\`, \`staging\`, or a custom channel point to a selected version.

Treat a prompt like code: owner, review, test dataset, changelog, staged rollout, rollback, and links to the traces it generated. Pin an exact version for reproducible experiments; fetch a label for controlled runtime promotion.
        `,
        diagram: `flowchart LR
  D[Draft v7] --> R[Review + eval]
  R --> S[staging label]
  S --> C{Quality gate}
  C -- pass --> P[production label -> v7]
  C -- fail --> F[production remains v6]
  P --> T[Linked production traces]`,
      },
      {
        id: "create-fetch-compile",
        title: "Create, Fetch and Compile Prompts",
        content: `
Langfuse supports text and chat prompts. Variables use double braces in stored prompts and are compiled at runtime. Prompt objects are cached by the SDK, reducing latency and providing resilience; define an intentional fallback for cold-start/control-plane failure.

Link the Langfuse prompt object to the generation/trace when supported. That association enables metrics and scores by prompt version.
        `,
        code: `from langfuse import get_client

langfuse = get_client()

# Usually done in UI or a controlled migration, not every app startup.
langfuse.create_prompt(
    name="support-answer",
    type="chat",
    prompt=[
        {"role": "system", "content": "Answer only from policy context."},
        {"role": "user", "content": "Context: {{context}}\nQuestion: {{question}}"},
    ],
    labels=["staging"],
    config={"temperature": 0, "max_tokens": 500},
)

prompt = langfuse.get_prompt("support-answer", type="chat", label="production")
messages = prompt.compile(context="Returns: 30 days", question="Can I return it?")
print(messages, prompt.version, prompt.config)`,
        language: "python",
      },
      {
        id: "langchain-prompt-link",
        title: "Use a Langfuse Prompt in LangChain",
        content: `
Convert the fetched prompt into a LangChain template, invoke it with the Langfuse callback, and preserve the prompt association. Keep prompt config (model parameters, tool definitions, feature flags) typed and validated before using it.

Never allow a prompt configuration edit to grant new permissions. Tool availability and authorization remain application policy even if tool schemas are versioned alongside prompts.
        `,
        code: `from langchain_core.prompts import ChatPromptTemplate
from langfuse.langchain import CallbackHandler

lf_prompt = langfuse.get_prompt("support-answer", type="chat")
lc_prompt = ChatPromptTemplate.from_messages(
    lf_prompt.get_langchain_prompt()
)

chain = lc_prompt | model
answer = chain.invoke(
    {"context": "Returns: 30 days", "question": "Can I return it?"},
    config={
        "callbacks": [CallbackHandler()],
        "metadata": {"langfuse_prompt": lf_prompt},
    },
)
print(answer.content)`,
        language: "python",
      },
    ],
  },
  {
    id: "lf-evaluation",
    title: "18. Evaluation & Scores",
    description: "Offline and online evals, human feedback, judges, and metrics.",
    icon: "Gauge",
    sections: [
      {
        id: "eval-strategy",
        title: "Build an Evaluation Strategy",
        content: `
Evaluation answers whether the system satisfies product requirements—not whether output merely sounds good. Define a scorecard before choosing evaluators.

| Layer | Example measures |
|---|---|
| Retrieval | Recall@k, MRR, context precision |
| Generation | correctness, groundedness, citation accuracy |
| Agent | task success, tool choice, loop count, policy compliance |
| Experience | user rating, resolution, latency |
| Operations | error rate, tokens, cost per successful task |

Use both **offline** evaluation before release and **online** evaluation on sampled production traffic. Slice results by intent, language, tenant, model, prompt version, and release; averages hide failures.
        `,
        diagram: `flowchart TB
  REQ[Product requirements] --> RUB[Score rubric]
  RUB --> DET[Deterministic checks]
  RUB --> J[LLM judge]
  RUB --> H[Human review]
  DET --> AGG[Segmented metrics]
  J --> AGG
  H --> AGG
  AGG --> GATE[Release gate / monitoring]`,
      },
      {
        id: "score-types",
        title: "Score Types and Feedback",
        content: `
Scores can be numeric, categorical, boolean, or text and can attach to a trace, observation, session, or dataset run. Examples: \`correctness=0.9\`, \`policy_safe=true\`, \`failure_type=missing_context\`.

User thumbs-up/down is useful but biased and sparse. Pair it with reason categories and behavioral outcomes. Human annotation queues help experts review targeted samples. Deterministic evaluators are best for format, citations, forbidden content, and exact rules; use LLM judges for nuanced rubrics, calibrated against humans.
        `,
        code: `from langfuse import get_client

langfuse = get_client()
langfuse.create_score(
    trace_id=trace_id,
    name="user_feedback",
    value=1,
    data_type="BOOLEAN",
    comment="Solved my issue",
)

langfuse.create_score(
    observation_id=generation_id,
    name="citation_valid",
    value=0.0,
    data_type="NUMERIC",
    comment="Source ID was not present in retrieved context",
)`,
        language: "python",
      },
      {
        id: "llm-judge",
        title: "LLM-as-a-Judge Done Carefully",
        content: `
Give a judge the input, output, reference/evidence, and an explicit rubric with anchored score definitions. Request structured results and reasons. Blind the judge to treatment names and randomize ordering for pairwise comparisons.

Judges have biases: verbosity, position, self-preference, style, and domain gaps. Validate on human-labeled examples, measure agreement, use a capable independent model, and periodically recalibrate. Never use a judge alone for safety-critical acceptance.
        `,
        diagram: `flowchart LR
  C[Candidate output] --> J[Judge + rubric]
  E[Evidence/reference] --> J
  J --> S[Structured score + reason]
  H[Human calibration set] --> V[Agreement analysis]
  S --> V
  V --> M[Monitor drift]`,
      },
      {
        id: "online-evals",
        title: "Online Evaluation and Monitoring",
        content: `
Target evaluators to stable observation names and sample strategically. Run cheap deterministic checks broadly; run expensive judges on errors, new releases, risky intents, low-confidence retrieval, and a random baseline sample.

Alert on sustained regressions with adequate volume, not isolated noisy scores. Monitor distributions and segments alongside cost and latency. Route serious failures to review and add representative examples to regression datasets.
        `,
        diagram: `flowchart LR
  P[Production traces] --> F{Filter/sample}
  F --> C[Code evaluators]
  F --> J[LLM judges]
  F --> H[Annotation queue]
  C --> D[Dashboards + alerts]
  J --> D
  H --> D
  D --> DS[Regression dataset]`,
      },
    ],
  },
  {
    id: "lf-datasets-experiments",
    title: "19. Datasets & Experiments",
    description: "Regression corpora, reproducible comparisons, and CI quality gates.",
    icon: "FlaskConical",
    sections: [
      {
        id: "dataset-design",
        title: "Designing High-Value Datasets",
        content: `
Each dataset item can hold input, expected output, metadata, and source links. Build coverage across common intents, boundary cases, multilingual inputs, long context, empty retrieval, conflicting evidence, tool errors, prompt injection, and previously observed incidents.

Avoid benchmark leakage and duplicates across train/tune/test sets. Version the dataset, document labeling rules, and keep a protected holdout. Production examples need consent, redaction, and access controls.
        `,
        diagram: `flowchart TB
  PROD[Production failures] --> DS[(Dataset)]
  EXP[Expert-authored cases] --> DS
  ADV[Adversarial cases] --> DS
  DS --> DEV[Development set]
  DS --> REG[Regression set]
  DS --> HOLD[Protected holdout]`,
      },
      {
        id: "run-experiment",
        title: "Run a Reproducible Experiment",
        content: `
An experiment runs a task over a local or hosted dataset, traces each item, applies evaluators, and aggregates results. Record model, exact prompt version, code/release SHA, retrieval index version, parameters, evaluator version, and dataset version.

Set bounded concurrency to respect provider limits and compare candidates on the same examples. Inspect failures, not only the aggregate score.
        `,
        code: `from langfuse import Evaluation, get_client

langfuse = get_client()
data = [
    {"input": "Return window?", "expected_output": "30 days"},
    {"input": "Can I return after 45 days?", "expected_output": "No"},
]

def task(*, item, **kwargs):
    return answer_chain.invoke({"question": item["input"]})

def contains_expected(*, output, expected_output, **kwargs):
    passed = expected_output.lower() in output.lower()
    return Evaluation(name="contains_expected", value=float(passed))

result = langfuse.run_experiment(
    name="support-rag-v7",
    data=data,
    task=task,
    evaluators=[contains_expected],
    max_concurrency=5,
    metadata={"prompt_version": "7", "index_version": "2026-07-18"},
)
print(result.format())`,
        language: "python",
      },
      {
        id: "compare-gate",
        title: "Compare Candidates and Gate Releases",
        content: `
Compare the candidate to a frozen baseline on item-level paired results. Averages can improve while a critical slice regresses, so require thresholds for safety, correctness, latency, and cost, plus slice-specific gates.

Account for stochasticity: fix temperature where appropriate, repeat noisy cases, report confidence intervals, and manually review disagreements. Store experiment links with deployment records. Promote prompts/models through labels only after gates pass; rollback should be one controlled change.
        `,
        diagram: `flowchart LR
  DS[Versioned dataset] --> B[Baseline run]
  DS --> C[Candidate run]
  B --> CMP[Paired comparison]
  C --> CMP
  CMP --> G{Quality + safety + cost gates}
  G -- pass --> P[Promote]
  G -- fail --> I[Inspect failures and iterate]`,
      },
    ],
  },
  {
    id: "lf-analytics-ops",
    title: "20. Cost, Analytics & Operations",
    description: "Usage, latency, dashboards, privacy, sampling, and self-hosting.",
    icon: "BarChart3",
    sections: [
      {
        id: "usage-cost",
        title: "Token, Cost and Latency Analysis",
        content: `
Generation and embedding observations can track usage and cost. Ensure model names and token categories are correct; custom/unknown models may require explicit pricing or cost details.

Analyze cost per **successful task**, not cost per call. A cheaper model that causes retries or human escalation may cost more overall. Watch input, output, cached, image, audio, and reasoning-related token categories where providers expose them. Track time to first token separately from total duration.
        `,
        diagram: `flowchart LR
  G[Generation] --> U[Usage by token type]
  U --> C[Model pricing]
  C --> COST[Cost]
  G --> L[TTFT + total latency]
  COST --> KPI[Cost per successful task]
  L --> KPI
  S[Task success score] --> KPI`,
      },
      {
        id: "dashboards-alerts",
        title: "Dashboards, Metrics and Alerts",
        content: `
Useful dashboards combine volume, error rate, p95 latency, token/cost, quality scores, tool failure rate, retrieval empty rate, agent step count, and user feedback. Segment by release, prompt, model, feature, customer tier, language, and intent.

Use the Metrics API for aggregated analytics rather than downloading every observation. Define service-level objectives such as “95% of support questions receive a grounded answer under 4 seconds” and alert on sustained breaches with minimum sample sizes.
        `,
        diagram: `quadrantChart
  title Operational prioritization
  x-axis Low user impact --> High user impact
  y-axis Low frequency --> High frequency
  quadrant-1 Fix immediately
  quadrant-2 Systemic but lower impact
  quadrant-3 Monitor
  quadrant-4 Severe edge cases
  Slow answers: [0.65, 0.8]
  Wrong refunds: [0.95, 0.35]
  Extra tokens: [0.3, 0.7]`,
      },
      {
        id: "privacy-security",
        title: "Privacy, Security and Governance",
        content: `
Tracing can duplicate sensitive prompts, documents, and tool results into an analytics system. Classify data before capture. Redact or hash identifiers, disable input/output capture for sensitive operations, enforce role-based access, define retention and deletion, encrypt transport/storage, audit access, and isolate projects/environments.

Never send API keys, passwords, raw authentication tokens, payment data, or unnecessary personal records. Verify legal and residency requirements for the selected cloud region or self-hosting design. Test redaction with adversarial nested payloads.
        `,
        diagram: `flowchart LR
  RAW[Raw event] --> CL{Data classification}
  CL -->|secret| DROP[Drop]
  CL -->|sensitive needed| RED[Redact/tokenize]
  CL -->|safe| KEEP[Keep]
  RED --> LF[(Langfuse project)]
  KEEP --> LF
  LF --> GOV[RBAC + retention + audit]`,
      },
      {
        id: "sampling-retention",
        title: "Sampling and Retention Strategy",
        content: `
Capture 100% during development and for rare high-risk workflows when policy allows. At scale, preserve all errors, safety events, new-release traffic, and low-score traces; sample a representative share of routine success.

Sampling must happen consistently at trace level so children are not orphaned. Keep aggregate metrics longer than raw content, and define separate retention for traces, datasets, prompts, and audit records. Observability is valuable only if ingestion cost and privacy risk remain controlled.
        `,
        diagram: `flowchart TD
  T[Incoming trace] --> X{Important?}
  X -- error/safety/new release --> ALL[Keep 100%]
  X -- routine success --> S[Probabilistic sample]
  ALL --> HOT[Short raw retention]
  S --> HOT
  HOT --> AGG[Longer aggregate metrics]
  HOT --> DEL[Scheduled deletion]`,
      },
      {
        id: "self-hosting-operations",
        title: "Cloud vs Self-Hosting",
        content: `
Cloud minimizes operational work; self-hosting can satisfy network, residency, or control requirements but makes upgrades, backups, scaling, object storage, database health, access control, and security your responsibility.

For either option, separate development/staging/production projects, monitor ingestion lag and dropped spans, test SDK failure behavior, use infrastructure as code, rotate credentials, back up prompt/dataset metadata, and rehearse restore. Pin supported versions and review migrations before upgrading.
        `,
        diagram: `flowchart TB
  APP[Applications] --> SDK[Buffered SDK / OTEL]
  SDK --> ING[Ingestion]
  ING --> Q[Processing queue]
  Q --> DB[(Metadata database)]
  Q --> OBJ[(Object/blob storage)]
  DB --> UI[Langfuse UI/API]
  OBJ --> UI
  OPS[Backups, scaling, upgrades, RBAC] -. self-host responsibility .-> ING`,
      },
    ],
  },
  {
    id: "integrated-capstone",
    title: "21. End-to-End Capstone",
    description: "A production-minded support agent combining all three platforms.",
    icon: "Rocket",
    sections: [
      {
        id: "capstone-architecture",
        title: "Capstone: Grounded Support Agent",
        content: `
Build a support agent that classifies intent, retrieves tenant-authorized policy, drafts a cited response, and pauses before a high-value refund. LangChain provides models, schemas, prompts, tools, and retrieval; LangGraph owns state, routing, checkpointing, and approval; Langfuse captures traces, prompt versions, scores, cost, and experiments.

Success criteria:

- answers cite only retrieved sources or abstain;
- tenant filters are enforced before retrieval results reach the model;
- refunds above the threshold require authenticated approval;
- every external write is idempotent;
- the UI streams safe progress and can reconnect;
- regression gates cover correctness, groundedness, security, latency, and cost.
        `,
        diagram: `flowchart TB
  U[User] --> API[Authenticated API]
  API --> G[LangGraph support workflow]
  G --> CL[Typed intent classifier]
  CL --> R[ACL-filtered retriever]
  R --> D[Draft with citations]
  D --> V{Refund / sensitive action?}
  V -- no --> A[Answer]
  V -- yes --> H[Interrupt for approval]
  H --> W[Idempotent write tool]
  W --> A
  G --> CP[(Durable checkpoints)]
  G -. callbacks / OTEL .-> LF[Langfuse]
  LF --> EV[Datasets + evals + alerts]`,
      },
      {
        id: "capstone-state-code",
        title: "Capstone State and Routing Skeleton",
        content: `
The state carries IDs and compact facts, not entire databases. Nodes validate their outputs. The conditional edge is deterministic. Production implementations replace the in-memory checkpointer and stub functions with durable, permissioned services.
        `,
        code: `from typing import Literal
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver

class SupportState(TypedDict, total=False):
    tenant_id: str
    case_id: str
    question: str
    intent: Literal["question", "refund"]
    source_ids: list[str]
    draft: str
    refund_amount: float
    approved: bool
    final: str

def route_after_draft(state: SupportState) -> Literal["approval", "finish"]:
    needs_approval = (
        state.get("intent") == "refund"
        and state.get("refund_amount", 0) > 100
    )
    return "approval" if needs_approval else "finish"

builder = StateGraph(SupportState)
builder.add_node("classify", classify)
builder.add_node("retrieve", retrieve_authorized_policy)
builder.add_node("draft", draft_with_citations)
builder.add_node("approval", approval_interrupt)
builder.add_node("finish", finalize)
builder.add_edge(START, "classify")
builder.add_edge("classify", "retrieve")
builder.add_edge("retrieve", "draft")
builder.add_conditional_edges("draft", route_after_draft)
builder.add_edge("approval", "finish")
builder.add_edge("finish", END)
graph = builder.compile(checkpointer=InMemorySaver())`,
        language: "python",
      },
      {
        id: "capstone-observe-evaluate",
        title: "Instrument, Evaluate and Release",
        content: `
Instrument the top-level graph with the Langfuse callback and attach pseudonymous user/session IDs, release, tenant-safe metadata, and exact prompt/index versions. Score citation validity deterministically, groundedness with a calibrated judge, and task resolution from user/business outcomes.

Release loop:

1. Add observed failures and adversarial cases to a versioned dataset.
2. Run baseline and candidate experiments with pinned versions.
3. Gate critical slices plus overall quality, p95 latency, and cost.
4. Promote the prompt label and deploy code with a release identifier.
5. Sample online traces, alert on regression, and roll back independently.
        `,
        code: `from langfuse.langchain import CallbackHandler

config = {
    "configurable": {"thread_id": "case-901"},
    "callbacks": [CallbackHandler()],
    "metadata": {
        "langfuse_user_id": "usr_7f3a",  # pseudonymous
        "langfuse_session_id": "case-901",
        "langfuse_tags": ["production", "support-capstone"],
        "release": "2026-07-20.1",
        "prompt_version": "support-answer:7",
        "index_version": "policy:2026-07-18",
    },
}

for event in graph.stream(initial_state, config=config, stream_mode="updates"):
    publish_safe_progress(event)
`,
        language: "python",
        diagram: `flowchart LR
  F[Production failure] --> D[Dataset item]
  D --> X[Baseline vs candidate experiment]
  X --> G{Release gates}
  G -- pass --> P[Promote + deploy]
  G -- fail --> I[Iterate]
  P --> M[Online monitoring]
  M --> F`,
      },
      {
        id: "learning-roadmap",
        title: "Beginner-to-Advanced Practice Roadmap",
        content: `
### Beginner

1. Call a chat model and inspect message metadata.
2. Build a typed extraction chain and stream its answer.
3. Create a two-node StateGraph and draw it.
4. Trace both with Langfuse.

### Intermediate

5. Build RAG with source metadata and retrieval evaluation.
6. Create a tool agent with schema validation and a step cap.
7. Add checkpointed conversation state and an approval interrupt.
8. Manage the prompt in Langfuse and compare two versions on a dataset.

### Advanced

9. Add hybrid retrieval, reranking, and tenant authorization.
10. Build replay-safe side effects and reconnectable streaming.
11. Compose a specialist subgraph only where permissions/context differ.
12. Run calibrated online/offline evals with segmented release gates.
13. Threat-model, load-test, cost-model, and rehearse rollback/recovery.

You are production-ready when you can explain not only the happy path, but how the system fails, how it resumes, how quality is measured, and who is allowed to make each consequential decision.
        `,
        diagram: `flowchart LR
  B[Model I/O] --> C[Chains + schemas]
  C --> R[RAG]
  R --> A[Tools + agents]
  A --> G[Stateful LangGraph]
  G --> O[Langfuse observability]
  O --> E[Datasets + evaluation]
  E --> P[Secure durable production]`,
      },
    ],
  },
];

