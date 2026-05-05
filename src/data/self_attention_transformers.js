export const topics = [
  {
    id: "beginner-map",
    title: "1. Beginner Map",
    description: "Start from tokens, vectors, context, and the reason attention exists.",
    icon: "Brain",
    sections: [
      {
        id: "what-problem",
        title: "What Problem Do Transformers Solve?",
        content: `
### The Core Problem
Language is ordered, contextual, and ambiguous.

The word **bank** can mean a river bank or a financial bank. The word **it** can refer to many possible earlier words. A model cannot understand text by reading each word in isolation.

Example:

> The animal did not cross the road because it was tired.

To understand **it**, the model should look back at **animal**, not **road**.

### Before Transformers
Older sequence models like RNNs and LSTMs read text one token at a time:

1. Read token 1.
2. Compress it into memory.
3. Read token 2.
4. Update memory.
5. Continue until the end.

This creates three big issues:

| Issue | Why it hurts |
| :--- | :--- |
| Long-distance memory | Early information can fade before later tokens need it. |
| Sequential training | Token 20 must wait for token 19, so training is slower. |
| Single memory bottleneck | One hidden state must carry too much information. |

### Transformer Idea
A Transformer lets every token directly inspect every other token using **self-attention**.

Instead of asking:

> What do I remember from the previous tokens?

It asks:

> For this token, which other tokens are most useful right now?

### One-Sentence Summary
Self-attention builds a new context-aware vector for each token by mixing information from the other tokens in the same sequence.
        `,
        diagram: `graph LR
    A[RNN or LSTM] --> B[Reads tokens one by one]
    B --> C[Compressed hidden state]
    C --> D[Harder long context]

    E[Transformer] --> F[All tokens visible together]
    F --> G[Self-attention scores]
    G --> H[Context-aware token vectors]`,
      },
      {
        id: "tokens-vectors-context",
        title: "Tokens, Vectors, and Context",
        content: `
### Step 1: Text Becomes Tokens
Models do not directly process words. Text is split into tokens.

Example:

| Text | Possible tokens |
| :--- | :--- |
| "I love pizza" | \`I\`, \`love\`, \`pizza\` |
| "unbelievable" | \`un\`, \`believ\`, \`able\` |
| "Transformers" | \`Transform\`, \`ers\` |

Tokenization depends on the tokenizer. A token may be a word, part of a word, punctuation, or whitespace pattern.

### Step 2: Tokens Become Embeddings
Each token id is converted into a vector called an **embedding**.

Example:

| Token | Tiny example embedding |
| :--- | :--- |
| I | [0.20, 0.10, 0.70] |
| love | [0.90, 0.40, 0.10] |
| pizza | [0.30, 0.80, 0.60] |

Real models use much larger vectors such as 768, 4096, or more dimensions.

### Step 3: Embeddings Need Context
The initial embedding for a token is mostly static at the beginning of the model. Self-attention updates it based on nearby and distant tokens.

Example:

| Sentence | Meaning of "bank" |
| :--- | :--- |
| I deposited money at the bank. | Financial institution |
| The boat stopped near the bank. | River edge |

The token starts with a general representation, then attention makes it context-specific.
        `,
      },
      {
        id: "visual-big-picture",
        title: "Big Picture Visualization",
        content: `
### Full Transformer Flow
At a high level, a Transformer does this:

1. Convert text to token ids.
2. Convert token ids to embeddings.
3. Add position information.
4. Pass vectors through many Transformer blocks.
5. Produce final vectors.
6. For generation, convert the final vector into next-token probabilities.

### What Changes Inside the Model?
The token count usually stays the same. The vector for each token changes at every layer.

If the input has 5 tokens, the model keeps 5 positions, but each position becomes more context-aware after every block.

| Stage | Token vector meaning |
| :--- | :--- |
| Embedding layer | Basic token meaning |
| Early layers | Local syntax and simple relationships |
| Middle layers | Phrases, references, entities |
| Later layers | Task-specific meaning and prediction-ready features |
        `,
        diagram: `graph TD
    Text["Text: The cat sat"] --> Tokens["Token IDs"]
    Tokens --> Embed["Token Embeddings"]
    Embed --> Pos["Add Position Information"]
    Pos --> Block1["Transformer Block 1"]
    Block1 --> Block2["Transformer Block 2"]
    Block2 --> BlockN["Transformer Block N"]
    BlockN --> Logits["Next-token Scores or Task Output"]

    subgraph One_Block["Inside each Transformer Block"]
    Attn["Self-Attention"]
    FFN["Feed-Forward Network"]
    Norm["Residual + LayerNorm"]
    end`,
      },
    ],
  },
  {
    id: "self-attention-core",
    title: "2. Self-Attention Core",
    description: "Queries, keys, values, attention scores, scaling, softmax, and weighted sums.",
    icon: "Search",
    sections: [
      {
        id: "qkv-intuition",
        title: "Queries, Keys, and Values",
        content: `
### The Library Analogy
Imagine you are searching in a library.

| Attention part | Analogy | Meaning in model |
| :--- | :--- | :--- |
| Query | What I am looking for | The current token's question |
| Key | Search label | What each token offers for matching |
| Value | Book content | The information to copy/mix if matched |

For every token, the model creates three vectors:

1. **Query (Q):** What this token wants to know.
2. **Key (K):** What this token can be matched by.
3. **Value (V):** What information this token contributes.

### Example
Sentence:

> The cat drank milk because it was thirsty.

When processing **it**:

| Candidate token | Why attention may care |
| :--- | :--- |
| The | Usually low value for reference |
| cat | Strong candidate: living thing that can be thirsty |
| milk | Possible but less likely |
| thirsty | Strong semantic clue |

The query for **it** compares against the keys of all tokens. High matches receive high attention weights.

### Important Detail
Q, K, and V are not manually written by humans. They are learned linear projections of the token embeddings.

If token embedding is $x$:

$$
Q = xW_Q, \\quad K = xW_K, \\quad V = xW_V
$$
        `,
        diagram: `graph LR
    X["Token embedding x"] --> WQ["Learned W_Q"]
    X --> WK["Learned W_K"]
    X --> WV["Learned W_V"]
    WQ --> Q["Query"]
    WK --> K["Key"]
    WV --> V["Value"]`,
      },
      {
        id: "attention-formula",
        title: "Scaled Dot-Product Attention Formula",
        content: `
### The Formula
The core attention operation is:

$$
Attention(Q, K, V) = softmax\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V
$$

Read it left to right:

| Part | What it does |
| :--- | :--- |
| $QK^T$ | Compare every query with every key. |
| $/\\sqrt{d_k}$ | Scale scores so softmax does not become too sharp. |
| $softmax(...)$ | Convert scores into probabilities. |
| $...V$ | Mix value vectors using those probabilities. |

### Why Dot Product?
A dot product is high when two vectors point in a similar direction.

If a query and key align, the token pair is relevant.

### Why Scale by $\\sqrt{d_k}$?
When vectors are large, raw dot products can become large. Softmax over large scores becomes extremely peaky, meaning one token gets almost all attention and gradients become less useful.

Scaling keeps training stable.

### Output Shape
If the input has:

| Symbol | Meaning |
| :--- | :--- |
| $n$ | Number of tokens |
| $d_model$ | Embedding width |
| $d_k$ | Query/key width |
| $d_v$ | Value width |

Then:

| Matrix | Shape |
| :--- | :--- |
| Q | $n \\times d_k$ |
| K | $n \\times d_k$ |
| V | $n \\times d_v$ |
| $QK^T$ | $n \\times n$ |
| Attention weights | $n \\times n$ |
| Output | $n \\times d_v$ |
        `,
        diagram: `graph TD
    Q[Q: queries] --> Scores["Q x K^T scores"]
    K[K: keys] --> Scores
    Scores --> Scale["Divide by sqrt d_k"]
    Scale --> Mask["Optional mask"]
    Mask --> Softmax["Softmax rows"]
    Softmax --> Mix["Weighted sum with V"]
    V[V: values] --> Mix
    Mix --> Output["Context vectors"]`,
      },
      {
        id: "row-by-row-meaning",
        title: "How to Read the Attention Matrix",
        content: `
### Attention Matrix
For a sentence with 4 tokens:

> The cat sleeps now

Self-attention builds a 4 x 4 matrix.

| Query token | attends to The | attends to cat | attends to sleeps | attends to now |
| :--- | ---: | ---: | ---: | ---: |
| The | 0.20 | 0.55 | 0.15 | 0.10 |
| cat | 0.05 | 0.30 | 0.55 | 0.10 |
| sleeps | 0.05 | 0.60 | 0.25 | 0.10 |
| now | 0.05 | 0.10 | 0.35 | 0.50 |

Each row sums to 1.

### Row Meaning
The row for **sleeps** says:

1. Take 5% of The's value vector.
2. Take 60% of cat's value vector.
3. Take 25% of sleeps' value vector.
4. Take 10% of now's value vector.
5. Add them to create the new vector for **sleeps**.

### Key Point
Attention does not replace tokens with words from other positions. It blends numeric value vectors.
        `,
        diagram: `graph LR
    T[The] -->|0.05| S2["new sleeps vector"]
    C[cat] -->|0.60| S2
    S[sleeps] -->|0.25| S2
    N[now] -->|0.10| S2`,
      },
    ],
  },
  {
    id: "numeric-walkthrough",
    title: "3. Numeric Walkthrough",
    description: "A tiny manual example that computes attention step by step.",
    icon: "Hash",
    sections: [
      {
        id: "tiny-example-setup",
        title: "Tiny Example Setup",
        content: `
We will use a tiny sentence:

> I love AI

To keep the math readable, assume Q, K, and V are already projected into 2D vectors.

| Token | Q | K | V |
| :--- | :--- | :--- | :--- |
| I | [1, 0] | [1, 0] | [1, 2] |
| love | [0, 1] | [0, 1] | [3, 1] |
| AI | [1, 1] | [1, 1] | [2, 3] |

We will compute the new context vector for the token **AI**.

### Step A: Pick Query for "AI"
The query for **AI** is:

$$
Q_{AI} = [1, 1]
$$

### Step B: Compare with Every Key
Use dot product:

| Key token | Key | Dot product with [1, 1] |
| :--- | :--- | ---: |
| I | [1, 0] | 1 |
| love | [0, 1] | 1 |
| AI | [1, 1] | 2 |

Raw scores:

$$
[1, 1, 2]
$$
        `,
      },
      {
        id: "tiny-example-softmax",
        title: "Scale, Softmax, and Weighted Sum",
        content: `
### Step C: Scale
The key dimension $d_k = 2$, so:

$$
\\sqrt{d_k} = \\sqrt{2} \\approx 1.414
$$

Scaled scores:

| Raw score | Scaled score |
| ---: | ---: |
| 1 | 0.707 |
| 1 | 0.707 |
| 2 | 1.414 |

### Step D: Softmax
Softmax converts the scaled scores into weights:

$$
softmax([0.707, 0.707, 1.414]) \\approx [0.248, 0.248, 0.503]
$$

Meaning:

| Token | Attention weight |
| :--- | ---: |
| I | 0.248 |
| love | 0.248 |
| AI | 0.503 |

### Step E: Weighted Sum of Values
Now combine V vectors:

$$
0.248[1,2] + 0.248[3,1] + 0.503[2,3]
$$

First dimension:

$$
0.248(1) + 0.248(3) + 0.503(2) = 1.998
$$

Second dimension:

$$
0.248(2) + 0.248(1) + 0.503(3) = 2.253
$$

New context vector for **AI**:

$$
[1.998, 2.253]
$$

### What Happened?
The original **AI** value was [2, 3]. After attention, it became a blend of:

1. Some information from **I**.
2. Some information from **love**.
3. More information from **AI** itself.
        `,
        diagram: `flowchart LR
    QAI["Query: AI [1,1]"] --> Scores["Scores [1,1,2]"]
    Scores --> Scale["Scale by sqrt 2"]
    Scale --> Weights["Weights [0.248,0.248,0.503]"]
    VI["V(I) [1,2]"] --> Sum["Weighted sum"]
    VL["V(love) [3,1]"] --> Sum
    VAI["V(AI) [2,3]"] --> Sum
    Weights --> Sum
    Sum --> Out["new AI vector [1.998,2.253]"]`,
      },
      {
        id: "matrix-version",
        title: "Same Example as Matrix Code",
        content: `
The manual calculation above is exactly what real implementations do, only with larger matrices and GPU acceleration.

### Python/Numpy Version
This code computes attention for all tokens at once.

### What to Notice
1. The output has the same number of rows as the input tokens.
2. Each row of \`weights\` sums to 1.
3. Every output row is a weighted sum of all value rows.
        `,
        code: `import numpy as np

Q = np.array([
    [1, 0],  # I
    [0, 1],  # love
    [1, 1],  # AI
], dtype=float)

K = np.array([
    [1, 0],
    [0, 1],
    [1, 1],
], dtype=float)

V = np.array([
    [1, 2],
    [3, 1],
    [2, 3],
], dtype=float)

def softmax(x):
    x = x - np.max(x, axis=-1, keepdims=True)
    exp = np.exp(x)
    return exp / np.sum(exp, axis=-1, keepdims=True)

d_k = Q.shape[-1]
scores = Q @ K.T
scaled_scores = scores / np.sqrt(d_k)
weights = softmax(scaled_scores)
output = weights @ V

print("scores:\\n", scores)
print("attention weights:\\n", weights.round(3))
print("output:\\n", output.round(3))`,
        language: "python",
      },
    ],
  },
  {
    id: "multi-head-and-positions",
    title: "4. Heads, Positions, and Masks",
    description: "Why attention uses many heads, how order is represented, and how masking works.",
    icon: "Layers",
    sections: [
      {
        id: "multi-head-attention",
        title: "Multi-Head Attention",
        content: `
### Why One Attention Head Is Not Enough
One attention head produces one attention pattern. But language has many relationship types.

In the sentence:

> The small dog chased the ball because it was excited.

Different heads may learn different patterns:

| Head | Possible focus |
| :--- | :--- |
| Head 1 | Pronoun reference: it -> dog |
| Head 2 | Adjective-noun: small -> dog |
| Head 3 | Verb-object: chased -> ball |
| Head 4 | Local neighboring words |

### How Multi-Head Attention Works
1. Create separate Q, K, and V projections for each head.
2. Run attention independently in each head.
3. Concatenate all head outputs.
4. Apply one final linear projection.

### Intuition
Multi-head attention is like asking several specialists to read the same sentence, each looking for a different kind of relationship. Their notes are merged afterward.
        `,
        diagram: `graph TD
    X["Input vectors"] --> H1["Head 1: syntax"]
    X --> H2["Head 2: references"]
    X --> H3["Head 3: local context"]
    X --> H4["Head 4: semantic links"]
    H1 --> C["Concatenate"]
    H2 --> C
    H3 --> C
    H4 --> C
    C --> P["Output projection"]
    P --> Y["Multi-head output"]`,
      },
      {
        id: "positional-encoding",
        title: "Position Information",
        content: `
### Why Position Is Needed
Self-attention sees all tokens together. Without position information, these two sentences could look too similar:

1. Dog bites man.
2. Man bites dog.

Same tokens, different order, completely different meaning.

### Common Ways to Add Position
| Method | Idea |
| :--- | :--- |
| Absolute positional encoding | Add a vector for position 0, 1, 2, etc. |
| Learned positional embeddings | Let training learn position vectors. |
| Sinusoidal encoding | Use sine/cosine waves of different frequencies. |
| Rotary position embedding (RoPE) | Rotate query/key vectors based on position. Common in modern LLMs. |
| ALiBi | Add distance-based bias to attention scores. |

### Simple Mental Model
The model receives:

$$
token\\_vector + position\\_vector
$$

So the model knows both:

1. What the token is.
2. Where the token is.
        `,
        diagram: `graph LR
    Token["Token embedding"] --> Add["Add"]
    Position["Position embedding"] --> Add
    Add --> Input["Position-aware input vector"]`,
      },
      {
        id: "masks",
        title: "Masks: Padding and Causal Attention",
        content: `
### What Is a Mask?
A mask prevents attention from looking at certain positions.

There are two common masks:

| Mask type | Used for | What it blocks |
| :--- | :--- | :--- |
| Padding mask | Batches with unequal lengths | Fake padding tokens |
| Causal mask | Decoder/generative models | Future tokens |

### Padding Mask
If one sentence is shorter, it may be padded:

\`I love AI <PAD> <PAD>\`

The model should not learn from \`<PAD>\`, so those positions are masked.

### Causal Mask
For next-token prediction, the model must not cheat by looking ahead.

When predicting token 3, it can only attend to tokens 1, 2, and 3.

| Query position | Can attend to |
| :--- | :--- |
| 1 | 1 |
| 2 | 1, 2 |
| 3 | 1, 2, 3 |
| 4 | 1, 2, 3, 4 |

This is why GPT-style models generate left to right.
        `,
        diagram: `graph TD
    T1["Token 1"] --> T2["Token 2"]
    T2 --> T3["Token 3"]
    T3 --> T4["Token 4"]
    T4 -. "cannot look ahead while training/generating" .-> Future["Future tokens masked"]`,
      },
    ],
  },
  {
    id: "transformer-block",
    title: "5. Transformer Block",
    description: "Attention, residual connections, layer normalization, and feed-forward networks.",
    icon: "Network",
    sections: [
      {
        id: "block-anatomy",
        title: "Anatomy of a Transformer Block",
        content: `
### The Block
A Transformer is built by stacking the same kind of block many times.

A common decoder block contains:

1. Self-attention.
2. Residual connection.
3. Layer normalization.
4. Feed-forward network.
5. Another residual connection.
6. Another layer normalization.

### Why Residual Connections?
Instead of forcing a layer to completely rewrite the representation, residual connections add the layer's update to the original input:

$$
output = x + layer(x)
$$

This helps gradients flow through deep networks.

### Why Layer Normalization?
LayerNorm stabilizes activations so training remains smoother and more predictable.

### Why Feed-Forward Network?
Attention mixes information across tokens. The feed-forward network transforms each token vector independently, adding nonlinear processing.

In short:

| Component | Job |
| :--- | :--- |
| Attention | Mix information between tokens |
| Feed-forward | Think harder per token |
| Residual | Preserve useful information |
| LayerNorm | Stabilize training |
        `,
        diagram: `graph TD
    X["Input vectors"] --> Attn["Self-Attention"]
    Attn --> Add1["Add residual"]
    X --> Add1
    Add1 --> Norm1["LayerNorm"]
    Norm1 --> FFN["Feed-Forward Network"]
    FFN --> Add2["Add residual"]
    Norm1 --> Add2
    Add2 --> Norm2["LayerNorm"]
    Norm2 --> Y["Block output"]`,
      },
      {
        id: "feed-forward-network",
        title: "Feed-Forward Network Inside the Block",
        content: `
### What the FFN Does
The FFN is usually a small MLP applied to each token position separately.

Typical structure:

$$
FFN(x) = W_2 \\; activation(W_1x + b_1) + b_2
$$

Common activations:

| Activation | Where seen |
| :--- | :--- |
| ReLU | Original Transformer |
| GELU | BERT, GPT-style models |
| SwiGLU | Many modern LLMs |

### Important Distinction
Self-attention communicates across positions.

FFN does not communicate across positions. It transforms each token's vector after attention has already mixed context into it.

### Example
For "The cat sleeps":

1. Attention lets **sleeps** pull information from **cat**.
2. FFN transforms the updated **sleeps** vector into a richer feature vector.
3. The next layer repeats the process.
        `,
      },
      {
        id: "layer-stacking",
        title: "Why Stack Many Layers?",
        content: `
### Layers Build Abstraction
One layer gives one round of communication. Many layers allow multi-step reasoning.

Example:

> Alice gave Bob her notebook because she trusted him.

A lower layer may learn:

1. **her** relates to Alice.
2. **him** relates to Bob.
3. **gave** connects Alice, Bob, and notebook.

A higher layer can combine those relationships into a deeper meaning:

> Alice is the giver, Bob is the receiver, notebook is the object, trust explains the action.

### Layer Progression
This is a simplified mental model:

| Layer range | Commonly learned signals |
| :--- | :--- |
| Early | Token identity, nearby words, punctuation |
| Middle | Syntax, entities, references |
| Late | Task behavior, prediction, instruction following |

Real models are messier than this, but the idea is useful.
        `,
        diagram: `graph TD
    E["Embeddings"] --> L1["Layer 1: local patterns"]
    L1 --> L2["Layer 2: syntax"]
    L2 --> L3["Layer 3: references"]
    L3 --> L4["Layer 4: task-ready features"]
    L4 --> O["Output"]`,
      },
    ],
  },
  {
    id: "architectures",
    title: "6. Transformer Architectures",
    description: "Encoder-only, decoder-only, and encoder-decoder Transformers.",
    icon: "Cpu",
    sections: [
      {
        id: "encoder-decoder-types",
        title: "Encoder, Decoder, and Encoder-Decoder",
        content: `
### Three Main Families
Transformers come in three major architecture styles.

| Type | Attention style | Best for | Examples |
| :--- | :--- | :--- | :--- |
| Encoder-only | Bidirectional self-attention | Understanding, classification, embeddings | BERT-style models |
| Decoder-only | Causal self-attention | Text generation, chat, code generation | GPT-style models |
| Encoder-decoder | Encoder reads input, decoder generates output | Translation, summarization | T5-style models |

### Encoder-Only
Encoder-only models can look both left and right. They are great when the whole input is available.

Example tasks:

1. Sentiment classification.
2. Named entity recognition.
3. Semantic embeddings.

### Decoder-Only
Decoder-only models use causal masking. They generate one token at a time.

Example tasks:

1. Chat response generation.
2. Code completion.
3. Story writing.

### Encoder-Decoder
The encoder reads the input. The decoder generates output while attending to encoder states.

Example:

Input: "Translate English to French: I love AI"

Output: "J'aime l'IA"
        `,
        diagram: `graph TD
    A["Encoder-only"] --> A1["Reads full input"]
    A1 --> A2["Classification or embeddings"]

    B["Decoder-only"] --> B1["Uses causal mask"]
    B1 --> B2["Generates next token"]

    C["Encoder-decoder"] --> C1["Encoder understands input"]
    C1 --> C2["Decoder generates output"]`,
      },
      {
        id: "cross-attention",
        title: "Cross-Attention in Encoder-Decoder Models",
        content: `
### Self-Attention vs Cross-Attention
Self-attention means Q, K, and V come from the same sequence.

Cross-attention means:

| Vector | Comes from |
| :--- | :--- |
| Query | Decoder |
| Key | Encoder |
| Value | Encoder |

### Translation Example
Input:

> The cat sleeps.

Output being generated:

> Le chat ...

When generating the next French token, the decoder query can attend to encoder keys/values from the English sentence.

This helps the decoder know which source words matter at each output step.
        `,
        diagram: `graph LR
    Source["Source sentence"] --> Encoder
    Encoder --> K["Keys"]
    Encoder --> V["Values"]
    Target["Partial target output"] --> Decoder
    Decoder --> Q["Queries"]
    Q --> Cross["Cross-attention"]
    K --> Cross
    V --> Cross
    Cross --> Next["Next target token"]`,
      },
    ],
  },
  {
    id: "generation-process",
    title: "7. Generation Process",
    description: "How a decoder Transformer predicts one token after another.",
    icon: "Zap",
    sections: [
      {
        id: "next-token-prediction",
        title: "Next-Token Prediction Step by Step",
        content: `
### Training Objective
Decoder-only language models are usually trained to predict the next token.

Given:

> The sky is

The model should assign high probability to likely next tokens:

| Candidate token | Possible probability |
| :--- | ---: |
| blue | 0.42 |
| clear | 0.16 |
| dark | 0.08 |
| falling | 0.01 |

### Inference Loop
During generation:

1. User prompt is tokenized.
2. Tokens pass through the Transformer.
3. The final position produces logits.
4. Logits become probabilities.
5. A token is selected.
6. The selected token is appended to the prompt.
7. Repeat until stop condition.

### Important
The model does not write a whole answer in one step. It repeatedly predicts the next token.
        `,
        diagram: `graph TD
    Prompt["Prompt tokens"] --> Model["Decoder Transformer"]
    Model --> Logits["Logits for next token"]
    Logits --> Probs["Softmax probabilities"]
    Probs --> Pick["Select token"]
    Pick --> Append["Append to context"]
    Append --> Model`,
      },
      {
        id: "sampling-methods",
        title: "Greedy, Temperature, Top-k, and Top-p",
        content: `
### Token Selection
After the model produces probabilities, decoding decides which token to pick.

| Method | Meaning |
| :--- | :--- |
| Greedy | Always pick highest probability token. |
| Temperature | Controls randomness by sharpening or flattening probabilities. |
| Top-k | Pick only from the top k tokens. |
| Top-p | Pick from the smallest token set whose cumulative probability reaches p. |

### Temperature
Low temperature:

1. More deterministic.
2. Good for factual or code-like answers.

High temperature:

1. More varied.
2. Useful for brainstorming or creative writing.

### Example
Prompt:

> The hero opened the door and saw

Greedy may pick:

> a room

Higher temperature may allow:

> a city of glass

The Transformer architecture produces probabilities. The sampling strategy chooses how adventurous generation should be.
        `,
      },
      {
        id: "kv-cache",
        title: "KV Cache: Why Generation Gets Faster",
        content: `
### The Inefficiency
When generating token 100, earlier tokens 1-99 have already been processed.

Without optimization, the model would recompute keys and values for all previous tokens every step.

### KV Cache
The model stores previous key and value vectors.

At the next generation step:

1. Compute Q, K, V for the new token.
2. Reuse cached K and V for old tokens.
3. Attend from the new token to cached history.

### Why It Matters
KV cache makes autoregressive generation much faster, especially for long prompts.

Tradeoff:

| Benefit | Cost |
| :--- | :--- |
| Faster generation | More memory usage |

This is one reason long-context serving requires careful GPU memory planning.
        `,
        diagram: `graph LR
    Old["Previous tokens"] --> Cache["Cached K and V"]
    New["New token"] --> QKV["Compute new Q,K,V"]
    Cache --> Attn["Attention for new token"]
    QKV --> Attn
    Attn --> Next["Next-token logits"]`,
      },
    ],
  },
  {
    id: "worked-examples",
    title: "8. Worked Examples",
    description: "Pronouns, translation, code completion, classification, and long context behavior.",
    icon: "BookOpen",
    sections: [
      {
        id: "pronoun-example",
        title: "Example 1: Pronoun Resolution",
        content: `
Sentence:

> Maya dropped the glass because she was nervous.

When processing **she**, attention may focus strongly on **Maya**.

| Token attended to | Reason |
| :--- | :--- |
| Maya | Person, likely referent |
| dropped | Action connected to person |
| glass | Object, less likely to be nervous |
| nervous | Describes emotional state |

### Step-by-Step
1. The query vector for **she** asks something like "who does this pronoun refer to?"
2. The key for **Maya** matches because Maya is a person/entity.
3. The value from **Maya** contributes strongly to the new **she** vector.
4. Later layers use this enriched vector to understand the sentence.

Attention is not a hard rule system, but this is the kind of pattern heads can learn.
        `,
        diagram: `graph LR
    Maya[Maya] -->|high attention| She[she]
    Dropped[dropped] -->|medium| She
    Glass[glass] -->|low| She
    Nervous[nervous] -->|high semantic clue| She`,
      },
      {
        id: "translation-example",
        title: "Example 2: Translation",
        content: `
Input:

> The black cat sleeps.

Output:

> Le chat noir dort.

### What Attention Helps With
English adjective order and French adjective order can differ.

The model needs to connect:

| English | French |
| :--- | :--- |
| The | Le |
| black | noir |
| cat | chat |
| sleeps | dort |

In encoder-decoder translation:

1. Encoder self-attention understands the English sentence.
2. Decoder self-attention tracks generated French tokens.
3. Cross-attention links each French generation step to the relevant English tokens.

When generating **noir**, cross-attention can look back to **black**.
        `,
      },
      {
        id: "code-example",
        title: "Example 3: Code Completion",
        content: `
Prompt:

\`\`\`python
def area_of_circle(radius):
    return
\`\`\`

The model may predict:

\`\`\`python
3.14159 * radius * radius
\`\`\`

### What Attention Uses
| Prompt token | Why it matters |
| :--- | :--- |
| def | Function definition context |
| area | Suggests geometry/math |
| circle | Suggests pi and radius |
| radius | Variable to reuse |
| return | Completion should be an expression |

Self-attention helps the final position connect **return** back to **area**, **circle**, and **radius**.

### Why Long-Range Attention Matters in Code
Variables may be declared many lines earlier. Function names, imports, comments, and types can all influence the next token.
        `,
      },
      {
        id: "classification-example",
        title: "Example 4: Sentiment Classification",
        content: `
Sentence:

> The movie was slow, but the ending was brilliant.

A classification model must combine conflicting signals:

| Phrase | Sentiment signal |
| :--- | :--- |
| slow | Negative |
| but | Contrast marker |
| ending was brilliant | Positive and often dominant |

### How a Transformer Helps
Self-attention lets the model notice that **but** changes how the sentence should be interpreted.

The final representation can learn:

1. There is a negative early phrase.
2. There is a contrast word.
3. The later positive phrase may dominate the overall sentiment.

This is why attention is useful beyond generation. It helps with understanding tasks too.
        `,
      },
    ],
  },
  {
    id: "practical-implementation",
    title: "9. Practical Implementation",
    description: "Minimal self-attention code, common shapes, debugging tips, and complexity.",
    icon: "Code",
    sections: [
      {
        id: "minimal-pytorch-attention",
        title: "Minimal PyTorch Self-Attention",
        content: `
This is a compact implementation of single-head self-attention.

### Input Shape
Assume:

| Symbol | Meaning |
| :--- | :--- |
| B | Batch size |
| T | Token count |
| C | Embedding width |

Input shape:

\`(B, T, C)\`

Output shape:

\`(B, T, C)\`

### What the Code Does
1. Projects input into Q, K, V.
2. Computes attention scores.
3. Applies optional causal mask.
4. Applies softmax.
5. Mixes values.
        `,
        code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class SelfAttention(nn.Module):
    def __init__(self, embed_dim, head_dim, causal=False):
        super().__init__()
        self.q = nn.Linear(embed_dim, head_dim)
        self.k = nn.Linear(embed_dim, head_dim)
        self.v = nn.Linear(embed_dim, head_dim)
        self.out = nn.Linear(head_dim, embed_dim)
        self.causal = causal

    def forward(self, x):
        # x: (batch, tokens, embed_dim)
        B, T, _ = x.shape

        q = self.q(x)  # (B, T, head_dim)
        k = self.k(x)  # (B, T, head_dim)
        v = self.v(x)  # (B, T, head_dim)

        scores = q @ k.transpose(-2, -1)  # (B, T, T)
        scores = scores / (k.shape[-1] ** 0.5)

        if self.causal:
            mask = torch.triu(torch.ones(T, T, device=x.device), diagonal=1)
            scores = scores.masked_fill(mask.bool(), float("-inf"))

        weights = F.softmax(scores, dim=-1)  # rows sum to 1
        context = weights @ v  # (B, T, head_dim)
        return self.out(context)`,
        language: "python",
      },
      {
        id: "complexity",
        title: "Attention Complexity",
        content: `
### Why Attention Can Be Expensive
The attention score matrix compares every token with every other token.

If sequence length is $n$, the attention matrix is:

$$
n \\times n
$$

So attention has roughly:

$$
O(n^2)
$$

memory and compute behavior for the attention matrix.

### Example
| Tokens | Attention score cells |
| ---: | ---: |
| 1,000 | 1,000,000 |
| 2,000 | 4,000,000 |
| 4,000 | 16,000,000 |
| 8,000 | 64,000,000 |

Doubling the context length roughly quadruples the attention matrix size.

### Modern Optimizations
| Technique | Goal |
| :--- | :--- |
| FlashAttention | Compute exact attention with less memory movement. |
| Sliding window attention | Attend mostly to nearby tokens. |
| Grouped-query attention | Reduce KV cache size. |
| Sparse attention | Avoid full all-pairs attention. |
| Quantization | Store weights/cache with fewer bits. |

The core idea remains the same: queries match keys, weights mix values.
        `,
      },
      {
        id: "debugging-shapes",
        title: "Shape Debugging Checklist",
        content: `
Many Transformer bugs are shape bugs. Use this checklist.

### Single-Head Attention
| Tensor | Expected shape |
| :--- | :--- |
| x | (B, T, C) |
| q | (B, T, D) |
| k | (B, T, D) |
| v | (B, T, D) |
| scores | (B, T, T) |
| weights | (B, T, T) |
| context | (B, T, D) |

### Multi-Head Attention
Common shape:

\`(B, heads, T, head_dim)\`

Checklist:

1. Query/key dimensions must match for dot product.
2. Softmax should be applied over the key/token dimension.
3. Mask must broadcast to attention score shape.
4. Heads must be concatenated before final projection.
5. Causal models must not attend to future positions.

### Quick Test
After softmax:

$$
weights.sum(axis=-1) \\approx 1
$$

If rows do not sum to 1, softmax is probably applied on the wrong dimension.
        `,
      },
    ],
  },
  {
    id: "master-summary",
    title: "10. Master Summary",
    description: "Mental models, common misconceptions, and interview-ready explanations.",
    icon: "Target",
    sections: [
      {
        id: "mental-models",
        title: "Mental Models to Remember",
        content: `
### Self-Attention
Self-attention is a learned information-routing mechanism.

For each token:

1. Ask a question with Q.
2. Compare it to all K vectors.
3. Convert matches into weights.
4. Use weights to blend V vectors.
5. Produce a context-aware vector.

### Transformer Block
A Transformer block alternates between:

| Step | Job |
| :--- | :--- |
| Attention | Let tokens communicate |
| FFN | Transform each token deeply |
| Residual + Norm | Keep training stable |

### Full Decoder LLM
A decoder-only LLM:

1. Reads previous tokens.
2. Uses causal self-attention.
3. Produces next-token probabilities.
4. Samples one token.
5. Repeats.

### The Most Important Sentence
A Transformer does not store grammar rules by hand; it learns vector transformations that make useful attention patterns emerge from data.
        `,
        diagram: `graph TD
    Token["Each token"] --> Q["asks with Q"]
    Token --> K["advertises with K"]
    Token --> V["contributes with V"]
    Q --> Match["match Q with all K"]
    K --> Match
    Match --> Weights["attention weights"]
    Weights --> Blend["blend V vectors"]
    V --> Blend
    Blend --> Context["context-aware token vector"]`,
      },
      {
        id: "misconceptions",
        title: "Common Misconceptions",
        content: `
| Misconception | Correct view |
| :--- | :--- |
| Attention is explanation. | Attention can be inspected, but it is not always a faithful human explanation. |
| Transformers understand words directly. | They process token ids and vectors. |
| One attention head finds all relationships. | Multiple heads learn different relationship patterns. |
| Position is automatic. | Position information must be added or encoded. |
| GPT sees future tokens while training. | Causal masks block future positions. |
| Bigger context is free. | Attention and KV cache memory make long context expensive. |

### Interview-Ready Definition
Self-attention is a mechanism where each token computes relevance scores against every token in the same sequence, normalizes those scores with softmax, and uses them to take a weighted sum of value vectors. This produces context-aware token representations and allows Transformers to model long-range dependencies in parallel.
        `,
      },
      {
        id: "step-by-step-recap",
        title: "Complete Process Recap",
        content: `
### From Text to Output
Here is the whole process end to end:

1. **Text input:** User provides text.
2. **Tokenization:** Text becomes token ids.
3. **Embedding lookup:** Token ids become vectors.
4. **Position added:** Model receives order information.
5. **QKV projection:** Each vector becomes query, key, and value vectors.
6. **Score calculation:** Queries compare with keys using dot products.
7. **Scaling:** Scores are divided by $\\sqrt{d_k}$.
8. **Masking:** Padding or future positions are blocked when needed.
9. **Softmax:** Scores become attention probabilities.
10. **Value mixing:** Probabilities blend value vectors.
11. **Multi-head merge:** Multiple attention heads are concatenated and projected.
12. **Residual + norm:** Output is stabilized and added back to original stream.
13. **FFN:** Each token vector is transformed by an MLP.
14. **Repeat layers:** The model stacks many blocks.
15. **Final output:** Classifier, embedding, or next-token logits are produced.
16. **Generation loop:** For LLMs, sample a token and repeat.

### Tiny Final Example
Prompt:

> I opened the umbrella because it started

The model predicts **raining** because attention can connect:

| Token | Useful signal |
| :--- | :--- |
| umbrella | rain-related object |
| because | causal relationship |
| it started | phrase expecting an event/weather continuation |

The prediction emerges from many layers of attention, FFNs, and learned weights.
        `,
      },
    ],
  },
];
