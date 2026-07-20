export const langgraphTopics = [
  {
    id: "lg-foundations",
    title: "8. LangGraph Foundations",
    description: "State, nodes, edges, reducers, and the Pregel-style execution model.",
    icon: "GitBranch",
    sections: [
      {
        id: "why-langgraph",
        title: "Why and When to Use LangGraph",
        content: `
LangGraph is a low-level orchestration runtime for long-running, stateful workflows and agents. It provides explicit control over branches, cycles, persistence, streaming, and human-in-the-loop execution.

Use it when the workflow itself is part of your product logic: a support case can be classified, routed, researched, paused for approval, resumed tomorrow, and audited step by step. You do **not** need LangGraph for a single model call or a simple fixed pipeline.

Core vocabulary:

- **State:** the shared typed data snapshot.
- **Node:** a function that reads state and returns an update.
- **Edge:** what may run next.
- **Reducer:** how concurrent/iterative updates merge.
- **Superstep:** a set of ready nodes executed in parallel, then synchronized.
- **Checkpoint:** a persisted state snapshot associated with a thread.
        `,
        diagram: `flowchart LR
  S((START)) --> N1[Classify]
  N1 --> R{Route}
  R -->|simple| N2[Answer]
  R -->|research| N3[Retrieve]
  N3 --> N2
  N2 --> E((END))`,
      },
      {
        id: "first-stategraph",
        title: "Your First StateGraph",
        content: `
Define a state schema, create nodes that return **partial updates**, connect them, then compile. Compilation validates topology and produces the Runnable used by \`invoke\`, \`stream\`, and their async variants.

Prefer nodes that are small, deterministic around I/O, and independently testable. Returning updates instead of mutating input makes execution and replay easier to reason about.
        `,
        code: `from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    text: str
    word_count: int

def count_words(state: State):
    return {"word_count": len(state["text"].split())}

builder = StateGraph(State)
builder.add_node("count_words", count_words)
builder.add_edge(START, "count_words")
builder.add_edge("count_words", END)
graph = builder.compile()

print(graph.invoke({"text": "LangGraph makes control flow explicit"}))`,
        language: "python",
      },
      {
        id: "reducers-state",
        title: "State Schemas and Reducers",
        content: `
Without a reducer, a returned value overwrites that state key. An annotated reducer defines how old and new values combine. This is essential when multiple nodes update the same channel in one superstep.

\`MessagesState\` provides a prebuilt \`messages\` channel using \`add_messages\`, which appends new messages and correctly replaces messages that share an ID. For custom state, use \`TypedDict\`, dataclasses, or Pydantic according to your validation and ergonomics needs.

Reducers must be associative and predictable. A careless append reducer can duplicate data when execution is replayed.
        `,
        code: `import operator
from typing import Annotated
from typing_extensions import TypedDict

class ResearchState(TypedDict):
    question: str
    notes: Annotated[list[str], operator.add]

def source_a(state):
    return {"notes": ["Fact from source A"]}

def source_b(state):
    return {"notes": ["Fact from source B"]}

# If source_a and source_b run in parallel, operator.add merges both lists.`,
        language: "python",
        diagram: `flowchart LR
  I["State: notes is empty"] --> A[Source A update]
  I --> B[Source B update]
  A --> R[Reducer: list addition]
  B --> R
  R --> O[notes: A fact, B fact]`,
      },
    ],
  },
  {
    id: "lg-control-flow",
    title: "9. Routing, Loops & Commands",
    description: "Conditional execution, fan-out, cycles, and dynamic routing.",
    icon: "Route",
    sections: [
      {
        id: "conditional-edges",
        title: "Conditional Edges",
        content: `
A routing function inspects state and returns a destination label. Keep routing outputs constrained and deterministic when possible. A small classifier with structured output is safer than parsing free text.

Every cycle needs a termination condition and a hard maximum. Without them, a model-tool loop can run until budget or rate limits are exhausted.
        `,
        code: `from typing import Literal
from langgraph.graph import StateGraph, START, END

def route(state) -> Literal["retrieve", "answer"]:
    return "retrieve" if state.get("needs_context") else "answer"

builder.add_edge(START, "classify")
builder.add_conditional_edges(
    "classify",
    route,
    {"retrieve": "retrieve", "answer": "answer"},
)
builder.add_edge("retrieve", "answer")
builder.add_edge("answer", END)`,
        language: "python",
        diagram: `stateDiagram-v2
  [*] --> Classify
  Classify --> Retrieve: needs context
  Classify --> Answer: context sufficient
  Retrieve --> Answer
  Answer --> [*]`,
      },
      {
        id: "command-send",
        title: "Command and Send",
        content: `
\`Command\` lets a node update state and select the next node in one return value. It is useful when the routing decision belongs with the node's result. \`Send\` supports dynamic fan-out: create one task per item at runtime, then merge results through reducers.

Use static edges for topology that is known in advance and dynamic routing only where the data demands it. Excessive dynamic control makes graphs harder to visualize and test.
        `,
        code: `from typing import Literal
from langgraph.types import Command

def triage(state) -> Command[Literal["human", "auto_reply"]]:
    risky = state["amount"] > 1000
    return Command(
        update={"risk": "high" if risky else "low"},
        goto="human" if risky else "auto_reply",
    )`,
        language: "python",
      },
      {
        id: "loops-toolnode",
        title: "The Tool-Calling Loop",
        content: `
The canonical agent graph alternates between a model node and a tool node. The model's latest message determines whether to execute tools or end. LangGraph's prebuilt \`ToolNode\` handles tool invocation and \`tools_condition\` provides common routing.

Use the higher-level LangChain \`create_agent\` unless you need to alter this topology. Build it manually to insert validation, approval, specialized model nodes, or custom recovery.
        `,
        code: `from langgraph.graph import MessagesState, StateGraph, START
from langgraph.prebuilt import ToolNode, tools_condition

model_with_tools = model.bind_tools([search_catalog])

def call_model(state: MessagesState):
    return {"messages": [model_with_tools.invoke(state["messages"])]}

builder = StateGraph(MessagesState)
builder.add_node("model", call_model)
builder.add_node("tools", ToolNode([search_catalog]))
builder.add_edge(START, "model")
builder.add_conditional_edges("model", tools_condition)
builder.add_edge("tools", "model")
agent_graph = builder.compile()`,
        language: "python",
        diagram: `flowchart TD
  S((START)) --> M[Model]
  M --> C{Has tool calls?}
  C -- yes --> T[ToolNode]
  T --> M
  C -- no --> E((END))`,
      },
      {
        id: "parallel-map-reduce",
        title: "Parallel and Map-Reduce Workflows",
        content: `
Independent nodes ready in the same superstep may execute concurrently. This is ideal for multi-source research. Dynamic map-reduce uses \`Send\` to fan out over an unknown number of items and a reducer to collect results.

Concurrency introduces nondeterministic completion order, rate pressure, and merge conflicts. Never assume list order unless you explicitly sort using stable identifiers.
        `,
        diagram: `flowchart LR
  Q[Research question] --> P[Planner]
  P --> A[Source task A]
  P --> B[Source task B]
  P --> C[Source task C]
  A --> RED[Reducer]
  B --> RED
  C --> RED
  RED --> SYN[Synthesize with citations]`,
      },
    ],
  },
  {
    id: "lg-persistence",
    title: "10. Persistence & Memory",
    description: "Threads, checkpoints, stores, replay, and fault tolerance.",
    icon: "Save",
    sections: [
      {
        id: "checkpoints-threads",
        title: "Checkpoints, Threads and Savers",
        content: `
When compiled with a checkpointer, LangGraph saves state snapshots at execution boundaries. A \`thread_id\` identifies the checkpoint sequence. Reusing it continues the same conversation/workflow; a new ID starts fresh.

In-memory savers are for local development. Production checkpointers use durable databases and require lifecycle, encryption, retention, cleanup, and tenant-isolation planning.

Checkpoints enable short-term memory, human approval, fault recovery, state inspection, and time travel. They are not your system of record for business transactions.
        `,
        code: `from langgraph.checkpoint.memory import InMemorySaver

checkpointer = InMemorySaver()
graph = builder.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "ticket-42"}}
graph.invoke(
    {"messages": [{"role": "user", "content": "My name is Mira"}]},
    config,
)
graph.invoke(
    {"messages": [{"role": "user", "content": "What is my name?"}]},
    config,
)`,
        language: "python",
        diagram: `flowchart LR
  T[thread_id] --> C1[Checkpoint 1]
  C1 --> C2[Checkpoint 2]
  C2 --> C3[Checkpoint 3]
  C2 -. replay/fork .-> F[Alternative future]`,
      },
      {
        id: "inspect-update-replay",
        title: "Inspect, Update and Replay State",
        content: `
Use \`get_state\` for the latest snapshot and \`get_state_history\` for prior checkpoints. \`update_state\` creates a new checkpoint with corrected values; it does not rewrite history. Invoking from an earlier checkpoint can replay or fork execution.

Replay is powerful for debugging and experimentation, but side effects demand care. Nodes may execute again. Put external writes behind idempotency keys and record completion in an authoritative store.
        `,
        code: `snapshot = graph.get_state(config)
print(snapshot.values)
print(snapshot.next)

history = list(graph.get_state_history(config))
older = history[-1]

graph.update_state(
    older.config,
    {"review_status": "corrected"},
    as_node="review",
)
# Resume using the returned/new configuration in a real application.`,
        language: "python",
      },
      {
        id: "store-longterm",
        title: "Long-Term Memory with Stores",
        content: `
Checkpointers retain state inside one thread. A LangGraph store holds memories across threads, commonly namespaced by tenant and user. Store durable, useful facts—not raw unlimited transcripts—and retrieve only relevant memories for the current request.

Design memory writing as its own policy: which facts qualify, who confirmed them, expiration, provenance, and how users correct or delete them.
        `,
        diagram: `flowchart TB
  U1[Thread A] --> CP1[(Checkpoints A)]
  U2[Thread B] --> CP2[(Checkpoints B)]
  U1 --> ST[(Store: tenant/user namespace)]
  U2 --> ST
  ST --> U1
  ST --> U2`,
      },
    ],
  },
  {
    id: "lg-human-loop",
    title: "11. Human-in-the-Loop",
    description: "Pause, approve, edit, and safely resume workflows.",
    icon: "UserCheck",
    sections: [
      {
        id: "interrupt-resume",
        title: "Dynamic Interrupts and Resume",
        content: `
\`interrupt(payload)\` pauses execution, persists state, and returns the payload to the caller. Resume the same thread with \`Command(resume=value)\`; that value becomes the return value of \`interrupt\` inside the node.

The payload must be JSON-serializable. Do not wrap \`interrupt\` in a broad try/except, reorder multiple interrupts between executions, or perform a non-idempotent side effect immediately before it—the node restarts from its beginning on resume.
        `,
        code: `from langgraph.types import interrupt, Command

def approve_refund(state):
    decision = interrupt({
        "question": "Approve refund?",
        "amount": state["amount"],
        "case_id": state["case_id"],
    })
    return {"approved": bool(decision["approved"])}

config = {"configurable": {"thread_id": "case-901"}}
paused = graph.invoke(initial_state, config)

# Later, after an authenticated human decision:
result = graph.invoke(Command(resume={"approved": True}), config)`,
        language: "python",
        diagram: `sequenceDiagram
  participant App
  participant Graph
  participant Checkpoint
  participant Human
  App->>Graph: invoke(thread_id)
  Graph->>Checkpoint: save state
  Graph-->>App: interrupt payload
  App->>Human: request decision
  Human-->>App: approve/edit/reject
  App->>Graph: Command(resume=value)
  Graph->>Checkpoint: load state
  Graph-->>App: continued result`,
      },
      {
        id: "approval-patterns",
        title: "Approval, Edit and Escalation Patterns",
        content: `
Use human review for irreversible or high-impact actions: sending messages, spending money, changing records, publishing, or accessing sensitive data.

Common responses are **approve**, **reject with reason**, **edit proposed arguments**, or **escalate**. Revalidate edited arguments and authorization on resume; approval is context-specific and should expire. Record reviewer identity, timestamp, original proposal, modification, and final action in an audit log.
        `,
        diagram: `flowchart TD
  P[Proposed sensitive action] --> I[Interrupt]
  I --> D{Human decision}
  D -- approve --> V[Revalidate + authorize]
  D -- edit --> V
  D -- reject --> R[Safe response]
  D -- escalate --> H[Specialist queue]
  V --> X[Idempotent execution]`,
      },
    ],
  },
  {
    id: "lg-streaming",
    title: "12. Streaming & Async Execution",
    description: "Tokens, state updates, custom progress, and responsive applications.",
    icon: "Radio",
    sections: [
      {
        id: "stream-modes",
        title: "Streaming Modes",
        content: `
Streaming improves perceived latency and exposes progress. LangGraph can stream:

| Mode | Emits | Useful for |
|---|---|---|
| \`messages\` | LLM message/token events | chat text |
| \`updates\` | node name and state delta | progress timelines |
| \`values\` | full state after steps | debugging/stateful UIs |
| \`custom\` | application-defined events | percent/progress messages |
| \`debug\` | detailed execution information | local diagnosis |

Do not render raw chain-of-thought. Stream user-facing content, tool status, citations, and concise progress events. Clients must handle disconnects, duplicated events, and resume.
        `,
        code: `for chunk in graph.stream(
    {"messages": [{"role": "user", "content": "Research LangGraph"}]},
    config=config,
    stream_mode=["updates", "messages"],
):
    mode, data = chunk
    if mode == "updates":
        print("STEP", data)
    else:
        message, metadata = data
        if getattr(message, "content", None):
            print(message.content, end="")`,
        language: "python",
      },
      {
        id: "async-backpressure",
        title: "Async, Cancellation and Backpressure",
        content: `
Use \`ainvoke\`/\`astream\` when nodes perform asynchronous model, database, or HTTP I/O. Async does not make CPU-bound work faster. Limit concurrency with semaphores or runnable configuration to respect provider and database capacity.

Propagate cancellation and timeouts, close streams cleanly, and decide whether the underlying durable job should continue if the browser disconnects. Backpressure matters: a slow client must not cause unbounded event buffering.
        `,
        diagram: `flowchart LR
  G[Graph event producer] --> B[Bounded buffer]
  B --> C[Client consumer]
  C -. cancel/disconnect .-> API[API policy]
  API -->|cancel| G
  API -->|detach| Q[Durable background job]`,
      },
    ],
  },
  {
    id: "lg-subgraphs-multiagent",
    title: "13. Subgraphs & Multi-Agent Systems",
    description: "Composition, supervisors, handoffs, and when not to use multiple agents.",
    icon: "Network",
    sections: [
      {
        id: "subgraph-composition",
        title: "Subgraphs and State Boundaries",
        content: `
A compiled graph can be a node in another graph. Use shared state keys for direct composition or wrap a subgraph in an adapter node when schemas differ. Subgraphs create reusable modules and clearer ownership boundaries.

Choose subgraph persistence deliberately: per-invocation for independent delegated work, per-thread when the specialist must remember across calls, or stateless when pause/resume is unnecessary. The parent needs a checkpointer for durable nested execution.
        `,
        diagram: `flowchart TB
  P[Parent graph state] --> A[Adapter]
  A --> SG
  subgraph SG[Research subgraph]
    R1[Plan] --> R2[Search] --> R3[Synthesize]
  end
  SG --> B[Map result to parent state]`,
      },
      {
        id: "multiagent-patterns",
        title: "Multi-Agent Patterns",
        content: `
| Pattern | Best for | Main risk |
|---|---|---|
| Supervisor | centralized delegation and synthesis | bottleneck and context growth |
| Handoffs | conversational specialist transfer | unclear ownership/loops |
| Agents-as-tools | bounded specialist capability | hidden nested cost |
| Network | peer collaboration | unpredictable routing |
| Parallel specialists | independent perspectives | merge conflicts and high cost |

Multiple agents are an organizational technique, not an automatic quality upgrade. Start with one agent plus well-designed tools. Split only when prompts, tool permissions, context, models, or teams have genuinely different responsibilities.
        `,
        diagram: `flowchart TD
  U[User] --> S[Supervisor]
  S --> R[Research specialist]
  S --> D[Data specialist]
  S --> W[Writing specialist]
  R --> S
  D --> S
  W --> S
  S --> U`,
      },
      {
        id: "multiagent-example",
        title: "A Bounded Supervisor Example",
        content: `
Give the supervisor a finite worker list, explicit routing schema, shared completion criteria, and a maximum number of delegations. Workers should return evidence and structured results rather than conversational filler.

For many systems, workers as tools are simpler than unconstrained agent-to-agent messaging because the supervisor retains control and each call has a typed contract.
        `,
        code: `from langchain.agents import create_agent
from langchain.tools import tool

researcher = create_agent(
    model="openai:gpt-4.1-mini",
    tools=[search_catalog],
    system_prompt="Return evidence with source IDs; do not make purchases.",
)

@tool
def research_products(question: str) -> str:
    """Research products and return source-grounded notes."""
    result = researcher.invoke({
        "messages": [{"role": "user", "content": question}]
    })
    return result["messages"][-1].content

supervisor = create_agent(
    model="openai:gpt-4.1-mini",
    tools=[research_products],
    system_prompt="Delegate research only when needed, then answer concisely.",
)`,
        language: "python",
      },
    ],
  },
  {
    id: "lg-production",
    title: "14. Durable Production Workflows",
    description: "Idempotency, errors, deployment, testing, and operational design.",
    icon: "Server",
    sections: [
      {
        id: "durable-execution",
        title: "Durability and Side-Effect Discipline",
        content: `
Durable execution may replay nodes after failure, resume, or time travel. Therefore, distinguish pure computation from side effects. Wrap external writes in small tasks/nodes with idempotency keys, record results, and make repeated execution safe.

Do not generate an idempotency key inside a replayable write node. Derive it from stable workflow identity and action identity. For multi-system changes, use sagas/compensating actions rather than pretending a distributed transaction exists.
        `,
        code: `def charge_customer(state):
    key = f"{state['order_id']}:charge:v1"
    existing = payments.find_by_idempotency_key(key)
    if existing:
        return {"payment_id": existing.id}

    payment = payments.charge(
        customer_id=state["customer_id"],
        amount=state["amount"],
        idempotency_key=key,
    )
    return {"payment_id": payment.id}`, 
        language: "python",
        diagram: `flowchart LR
  N[Replayable node] --> K[Stable idempotency key]
  K --> Q{Already completed?}
  Q -- yes --> R[Return recorded result]
  Q -- no --> W[Perform write]
  W --> S[Record result]`,
      },
      {
        id: "error-recovery",
        title: "Error Taxonomy and Recovery",
        content: `
Classify errors before choosing recovery:

- **Transient:** timeouts, rate limits → bounded retry/backoff.
- **Model output/validation:** malformed result → targeted repair or safe failure.
- **User-correctable:** missing/ambiguous input → interrupt and ask.
- **Business-rule:** forbidden operation → deterministic rejection.
- **Permanent infrastructure/config:** missing credential/schema → fail fast and alert.

Persist enough structured error context to resume safely, but redact secrets and sensitive payloads from logs and traces.
        `,
        diagram: `flowchart TD
  E[Error] --> C{Classify}
  C -->|transient| R[Retry with backoff]
  C -->|user correctable| I[Interrupt]
  C -->|business rule| D[Deny]
  C -->|permanent| A[Fail + alert]
  R --> X{Attempts left?}
  X -- no --> A`,
      },
      {
        id: "graph-testing",
        title: "Testing and Visualizing Graphs",
        content: `
Test nodes as ordinary functions, routers against boundary cases, reducers for merge laws, and the compiled graph with fake models/tools. Add tests for loops terminating, interruptions resuming, checkpoints isolating threads, duplicate delivery, tool failures, and replay-safe writes.

Graph diagrams document possible topology; traces document actual paths. Use both. Inspect the compiled graph in development and snapshot only stable structural properties—not layout pixels.
        `,
        code: `# Visualize topology in a notebook or save the rendered bytes.
png_bytes = graph.get_graph().draw_mermaid_png()
with open("graph.png", "wb") as file:
    file.write(png_bytes)

# Mermaid source is convenient for docs and code review.
print(graph.get_graph().draw_mermaid())`,
        language: "python",
      },
      {
        id: "langgraph-checklist",
        title: "LangGraph Production Checklist",
        content: `
- State is minimal, typed, serializable, and excludes secrets.
- Every loop has semantic and hard termination limits.
- Reducers are deterministic under parallel updates.
- Production uses a durable checkpointer with tenant isolation and cleanup.
- Side effects are idempotent and permission checked.
- Interrupts carry serializable payloads and authenticated resume actions.
- Streaming handles disconnect, cancellation, and duplicate events.
- Traces correlate thread, user, prompt, model, tool, and release versions.
- Evaluation datasets cover success paths, edge cases, attacks, and prior incidents.
- Operators can inspect, replay, cancel, and recover workflows safely.
        `,
        diagram: `flowchart LR
  D[Design] --> T[Test]
  T --> O[Observe]
  O --> E[Evaluate]
  E --> R[Release]
  R --> M[Monitor]
  M --> D`,
      },
    ],
  },
];

