export const topics = [
  {
    id: "basics",
    title: "LangChain Basics",
    description: "Core components: Models, Prompts, and Output Parsers.",
    icon: "BookOpen",
    sections: [
      {
        id: "llms-chat-models",
        title: "LLMs vs Chat Models",
        content: `
LangChain interacts with two main types of models:
1.  **LLMs**: Take a string as input and return a string.
2.  **Chat Models**: Take a list of messages as input and return a message.

While they both use LLMs under the hood, the interface is different.
        `,
        code: `from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage

model = ChatOpenAI(model="gpt-4")

messages = [
    SystemMessage(content="You are a helpful assistant."),
    HumanMessage(content="What is LangChain?"),
]

response = model.invoke(messages)
print(response.content)`,
      },
      {
        id: "prompt-templates",
        title: "Prompt Templates",
        content: `
Prompt Templates help to create dynamic prompts. They take a template string and a set of input variables.
        `,
        code: `from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a technical writer."),
    ("user", "Write a brief intro about {topic}.")
])

chain = prompt | model
response = chain.invoke({"topic": "LangGraph"})
print(response.content)`,
      },
      {
        id: "output-parsers",
        title: "Output Parsers",
        content: `
Output Parsers transform the raw output of an LLM (text) into a more structured format (like JSON, List, or specific objects).
        `,
        code: `from langchain_core.output_parsers import StrOutputParser

parser = StrOutputParser()

# Combining Prompt, Model, and Parser
chain = prompt | model | parser

# The result is now a string, not a Message object
result = chain.invoke({"topic": "LCEL"})
print(result)`,
      },
    ],
  },
  {
    id: "chains-lcel",
    title: "Chains & LCEL",
    description: "LangChain Expression Language (LCEL) and composing chains.",
    icon: "Link",
    sections: [
      {
        id: "what-is-lcel",
        title: "LangChain Expression Language (LCEL)",
        content: `
LCEL is a declarative way to compose chains. It uses the pipe \`|\` operator to chain components together.

The standard pattern is:
\`Prompt | Model | Output Parser\`

Every LCEL object implements the \`Runnable\` interface, which exposes methods like \`invoke\`, \`batch\`, and \`stream\`.
        `,
        code: `chain = prompt | model | parser

# Streaming output
for chunk in chain.stream({"topic": "Streaming"}):
    print(chunk, end="", flush=True)`,
      },
      {
        id: "runnables",
        title: "RunnablePassthrough & RunnableLambda",
        content: `
- **RunnablePassthrough**: Passes the input unchanged or adds extra keys.
- **RunnableLambda**: Turns a custom function into a Runnable.
        `,
        code: `from langchain_core.runnables import RunnablePassthrough, RunnableLambda

def length_function(text):
    return len(text)

chain = (
    {"context": RunnablePassthrough(), "length": RunnableLambda(length_function)}
    | prompt
    | model
    | parser
)`,
      },
    ],
  },
  {
    id: "memory",
    title: "Memory",
    description: "Adding state to chains and agents.",
    icon: "Brain",
    sections: [
      {
        id: "buffer-memory",
        title: "ConversationBufferMemory",
        content: `
Stores the entire conversation history. Useful for short conversations but can hit token limits.
        `,
        code: `from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory()
memory.save_context({"input": "Hi"}, {"output": "Hello!"})

print(memory.load_memory_variables({}))
# Output: {'history': 'Human: Hi\nAI: Hello!'}`,
      },
      {
        id: "window-memory",
        title: "ConversationBufferWindowMemory",
        content: `
Keeps a list of the interactions of the conversation over time. It only uses the last K interactions.
        `,
        code: `from langchain.memory import ConversationBufferWindowMemory

memory = ConversationBufferWindowMemory(k=1)
memory.save_context({"input": "Hi"}, {"output": "Hello!"})
memory.save_context({"input": "How are you?"}, {"output": "I'm good."})

print(memory.load_memory_variables({}))
# Output will only contain the last interaction`,
      },
    ],
  },
  {
    id: "rag",
    title: "RAG (Retrieval Augmented Generation)",
    description: "Connecting LLMs to private data.",
    icon: "Database",
    sections: [
      {
        id: "rag-architecture",
        title: "RAG Architecture",
        content: `
RAG involves retrieving relevant documents and passing them to the LLM as context.

1.  **Load**: Load data from source.
2.  **Split**: Split text into chunks.
3.  **Embed**: Create vector embeddings.
4.  **Store**: Store in Vector Database.
5.  **Retrieve**: Find relevant chunks.
6.  **Generate**: LLM answers using context.
        `,
        mermaid: `graph LR
    A[Documents] --> B[Splitter]
    B --> C[Embeddings]
    C --> D[(Vector Store)]
    E[User Query] --> F[Retriever]
    D --> F
    F --> G[Context]
    G --> H[LLM]
    E --> H
    H --> I[Answer]`,
      },
      {
        id: "rag-code",
        title: "RAG Implementation",
        content: `
A simple RAG pipeline using LCEL.
        `,
        code: `from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

# 1. Setup Vector Store (Example)
vectorstore = FAISS.from_texts(
    ["LangGraph is a library for building stateful, multi-actor applications with LLMs."],
    embedding=OpenAIEmbeddings()
)
retriever = vectorstore.as_retriever()

# 2. Prompt
template = """Answer based on context:
{context}

Question: {question}
"""
prompt = ChatPromptTemplate.from_template(template)

# 3. Chain
chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)

chain.invoke("What is LangGraph?")`,
      },
    ],
  },
  {
    id: "agents",
    title: "Agents",
    description: "Using LLMs to decide what actions to take.",
    icon: "Bot",
    sections: [
      {
        id: "agent-concepts",
        title: "Agent Concepts",
        content: `
An agent uses an LLM to reason about which actions to take and in what order. An action can be using a tool and observing its output.

**ReAct (Reason + Act)** is a popular prompting technique for agents.
        `,
        mermaid: `sequenceDiagram
    participant User
    participant Agent
    participant Tool
    User->>Agent: Task
    loop Reasoning Loop
        Agent->>Agent: Thought
        Agent->>Tool: Action (Input)
        Tool-->>Agent: Observation (Output)
    end
    Agent-->>User: Final Answer`,
      },
      {
        id: "tools",
        title: "Defining Tools",
        content: `
Tools are functions that agents can call.
        `,
        code: `from langchain_core.tools import tool

@tool
def multiply(a: int, b: int) -> int:
    """Multiply two numbers."""
    return a * b

tools = [multiply]
llm_with_tools = model.bind_tools(tools)`,
      },
    ],
  },
  {
    id: "langgraph",
    title: "LangGraph",
    description: "Building stateful, multi-actor applications with LLMs.",
    icon: "GitGraph",
    sections: [
      {
        id: "stategraph",
        title: "StateGraph & Nodes",
        content: `
LangGraph models agent workflows as a graph.

-   **State**: A shared data structure representing the current snapshot of the application.
-   **Nodes**: Functions that modify the state.
-   **Edges**: Control flow between nodes.
        `,
        code: `from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
import operator

class State(TypedDict):
    messages: Annotated[list, operator.add]

def chatbot(state: State):
    return {"messages": [model.invoke(state["messages"])]}

graph_builder = StateGraph(State)
graph_builder.add_node("chatbot", chatbot)
graph_builder.set_entry_point("chatbot")
graph_builder.add_edge("chatbot", END)

graph = graph_builder.compile()`,
      },
      {
        id: "conditional-edges",
        title: "Conditional Edges",
        content: `
Conditional edges allow dynamic routing based on the state.
        `,
        mermaid: `graph TD
    Start --> Agent
    Agent --> Check{Should Continue?}
    Check -- Yes --> Tools
    Check -- No --> End
    Tools --> Agent`,
        code: `def should_continue(state: State):
    last_message = state["messages"][-1]
    if "tool_calls" in last_message.additional_kwargs:
        return "tools"
    return "end"

graph_builder.add_conditional_edges(
    "chatbot",
    should_continue,
    {
        "tools": "tool_node",
        "end": END
    }
)`,
      },
      {
        id: "checkpointing",
        title: "Checkpointing (Persistence)",
        content: `
Checkpointing allows you to save and resume the state of the graph. This is crucial for "human-in-the-loop" workflows or long-running sessions.
        `,
        code: `from langgraph.checkpoint.memory import MemorySaver

memory = MemorySaver()
graph = graph_builder.compile(checkpointer=memory)

config = {"configurable": {"thread_id": "1"}}
graph.invoke(inputs, config=config)`,
      },
    ],
  },
];
