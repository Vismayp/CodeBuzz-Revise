export const topics = [
  {
    id: "rag-architecture",
    title: "6.1 RAG Architecture (Deep Dive)",
    description: "Connect LLMs to private data to prevent hallucinations.",
    icon: "Database",
    sections: [
      {
        id: "rag-flow",
        title: "The RAG Pipeline",
        content: `
### Why RAG?
LLMs are frozen in time (training cutoff) and don't know your private data.
**Fine-tuning** is expensive and hard to update.
**RAG (Retrieval-Augmented Generation)** retrieves relevant data *at query time* and feeds it to the LLM.

### Steps
1.  **Ingestion:** Documents -> Chunks -> Embeddings -> Vector DB.
2.  **Retrieval:** User Query -> Embedding -> Similarity Search -> Top-K Chunks.
3.  **Generation:** System Prompt + Retrieved Chunks + User Query -> LLM -> Answer.

**Benefits:**
*   Prevent Hallucinations (Grounding).
*   Access Private/Real-time Data.
*   Cost effective (Context window is cheaper than fine-tuning).
        `,
        diagram: `graph TD
    subgraph Ingestion
    Docs[Documents] --> Chunk[Chunking]
    Chunk --> Embed1[Embed Model]
    Embed1 --> VDB[(Vector DB)]
    end
    subgraph Inference
    User((User)) --> Query
    Query --> Embed2[Embed Model]
    Embed2 --> Search[Vector Search]
    VDB -.-> Search
    Search --> TopK[Top-K Docs]
    TopK --> Context
    Context --> LLM
    Query --> LLM
    LLM --> Answer
    end`,
      },
    ],
  },
  {
    id: "embeddings",
    title: "6.2 Embeddings",
    description: "Turning text into numbers semantic search understands.",
    icon: "Binary",
    sections: [
      {
        id: "embedding-concept",
        title: "What are Embeddings?",
        content: `
Embeddings are dense vector representations of text. Text with similar *meaning* will have vectors that are close together in high-dimensional space.
*   "King" - "Man" + "Woman" ≈ "Queen"
*   "Apple" (fruit) is far from "Apple" (company) if context differs.

### Models
*   **OpenAI (text-embedding-3-small):** High quality, paid API.
*   **Sentence Transformers (all-MiniLM-L6-v2):** Fast, runs locally, free.
*   **ColBERT:** Token-level late interaction (slower but more accurate).

### Cosmetic Distance & Similarity
How do we measure "closeness"?
*   **Cosine Similarity:** Measures the angle between two vectors. Focuses on orientation (meaning), ignores magnitude (length).
    $$ Cosine(A, B) = \\frac{A \\cdot B}{||A|| ||B||} $$
*   **Euclidean Distance:** Measures straight-line distance.
*   **Dot Product:** Unnormalized cosine.
        `,
      },
    ],
  },
  {
    id: "vector-dbs",
    title: "6.3 Vector Databases",
    description: "Where to store millions of vectors for fast retrieval.",
    icon: "HardDrive",
    sections: [
      {
        id: "db-options",
        title: "Database Options",
        content: `
Standard SQL databases (Postgres) *can* do vector search (pgvector), but specialized DBs scale better.

### Specialized Vector DBs
1.  **Pinecone:**
    *   **Type:** Managed (SaaS).
    *   **Pros:** Easy to use, highly scalable, metadata filtering.
    *   **Cons:** Expensive at scale.
2.  **Chroma:**
    *   **Type:** Open Source (Local/Server).
    *   **Pros:** Developer friendly, great for prototyping.
3.  **FAISS (Facebook AI Similarity Search):**
    *   **Type:** Library (not a full DB).
    *   **Pros:** Example of raw speed. The engine under many DBs.
4.  **Weaviate / Qdrant:**
    *   **Type:** Open Source / Managed.
    *   **Pros:** Hybrid search (Keyword + Vector).
        `,
      },
    ],
  },
  {
    id: "chunking",
    title: "6.4 Chunking Strategies",
    description: "The most critical step for RAG accuracy.",
    icon: "Scissors",
    sections: [
      {
        id: "chunking-strategies",
        title: "Types of Chunking",
        content: `
If chunks are too small, context is lost. If too large, retrieval is noisy ("Lost in the Middle" phenomenon).

1.  **Fixed-Size Chunking:**
    *   Simplest. "Every 500 characters".
    *   *Problem:* Cuts sentences/paragraphs in half.
2.  **Recursive Character Chunking:**
    *   Tries to split by paragraph (\\n\\n), then newline (\\n), then space.
    *   Standard for LangChain. Keeps semantic units together.
3.  **Semantic Chunking:**
    *   Uses detailed embeddings to find "breakpoints" where the topic changes.
4.  **Metadata-Aware Chunking:**
    *   Attaching "Parent Document Title", "Page Number" to every chunk.
        `,
        code: `from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200, # Critical: Keeps context across boundaries
    separators=["\\n\\n", "\\n", " ", ""]
)`,
      },
    ],
  },
  {
    id: "project-7",
    title: "Project 7: Research Paper Chatbot",
    description: "Building a PDF RAG pipeline.",
    icon: "FileText",
    sections: [
      {
        id: "research-bot",
        title: "Implementation Details",
        content: `
**Goal:** Upload a PDF and ask questions citing specific pages.

### Pipeline
1.  **Loader:** \`PyPDFLoader\` extracts text.
2.  **Splitter:** Recursive Splitter (Size 1000, Overlap 100).
3.  **Embed:** OpenAI Embeddings.
4.  **Store:** Pinecone Index.
5.  **Chain:** \`RetrievalQAChain\` with return_source_documents=True.

**Challenge:** Tables and Images in PDFs.
**Solution:** specialized parsers like \`UnstructuredIO\` or GPT-4o-vision for chart summarization.
        `,
      },
    ],
  },
];
