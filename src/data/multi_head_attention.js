export const topics = [
  {
    id: "foundation",
    title: "1. Foundation",
    description: "Understand why single attention is limited and why many heads help.",
    icon: "Brain",
    sections: [
      {
        id: "what-is-mha",
        title: "What Is Multi-Head Attention?",
        content: `
### Simple Definition
**Multi-Head Attention (MHA)** runs several self-attention operations in parallel, lets each one learn a different relationship pattern, then combines their outputs.

Single-head attention asks:

> For each token, which other tokens should I look at?

Multi-head attention asks:

> Can several attention specialists look at the same tokens from different angles?

### Why It Exists
Language has many relationships happening at the same time:

| Relationship | Example |
| :--- | :--- |
| Subject-verb | "The dog runs" |
| Pronoun reference | "Maya said she was ready" |
| Modifier-noun | "red car" |
| Verb-object | "eat pizza" |
| Long-distance dependency | "The book that I bought yesterday is excellent" |

One attention head can learn one blended pattern. Multiple heads can divide the work.

### Core Idea
Instead of using one big attention calculation, the model splits attention into many smaller heads:

1. Head 1 may learn local word relationships.
2. Head 2 may learn pronoun references.
3. Head 3 may learn syntax.
4. Head 4 may learn semantic similarity.

The model decides these roles during training. We do not manually assign them.
        `,
        diagram: `graph TD
    X["Input token vectors"] --> H1["Head 1: local context"]
    X --> H2["Head 2: pronouns"]
    X --> H3["Head 3: syntax"]
    X --> H4["Head 4: meaning"]
    H1 --> Merge["Concatenate heads"]
    H2 --> Merge
    H3 --> Merge
    H4 --> Merge
    Merge --> Out["Final multi-head output"]`,
      },
      {
        id: "single-vs-multi",
        title: "Single-Head vs Multi-Head Attention",
        content: `
### Single-Head Attention
Single-head attention computes one attention matrix.

For 5 tokens, it creates a 5 x 5 matrix where each row says how one token attends to all tokens.

### Multi-Head Attention
Multi-head attention creates multiple attention matrices.

If there are 8 heads and 5 tokens, the model has 8 different 5 x 5 attention matrices.

Each head can produce a different pattern.

| Feature | Single-head | Multi-head |
| :--- | :--- | :--- |
| Attention patterns | One | Many |
| Relationship types | Limited | Richer |
| Parallel views | No | Yes |
| Common in Transformers | Rare alone | Standard |

### Intuition
Imagine reading a sentence with several highlighters:

1. Blue highlighter marks grammar.
2. Green marks entities.
3. Yellow marks important context.
4. Pink marks references.

Multi-head attention gives the model many highlighters at once.
        `,
      },
      {
        id: "where-used",
        title: "Where Multi-Head Attention Is Used",
        content: `
Multi-head attention appears inside Transformer blocks.

### Encoder Models
Encoder-only models use bidirectional multi-head self-attention.

Example tasks:

1. Classification.
2. Embeddings.
3. Named entity recognition.

### Decoder Models
Decoder-only models use causal multi-head self-attention.

Example tasks:

1. Chat generation.
2. Code completion.
3. Next-token prediction.

### Encoder-Decoder Models
Encoder-decoder models use:

1. Encoder self-attention.
2. Decoder causal self-attention.
3. Decoder cross-attention over encoder outputs.

Cross-attention can also be multi-head.
        `,
        diagram: `graph TD
    Block["Transformer Block"] --> MHA["Multi-Head Attention"]
    Block --> FFN["Feed-Forward Network"]
    Block --> Norm["Residual + LayerNorm"]
    MHA --> Self["Self-attention"]
    MHA --> Cross["Cross-attention in encoder-decoder models"]`,
      },
    ],
  },
  {
    id: "qkv-and-heads",
    title: "2. QKV and Head Splitting",
    description: "How queries, keys, and values are projected and split into heads.",
    icon: "Search",
    sections: [
      {
        id: "qkv-recap",
        title: "Quick QKV Recap",
        content: `
### Query, Key, Value
Every token vector is projected into three vectors:

| Vector | Meaning |
| :--- | :--- |
| Query (Q) | What this token is looking for |
| Key (K) | What this token can be matched by |
| Value (V) | What information this token contributes |

For token vector $x$:

$$
Q = xW_Q, \\quad K = xW_K, \\quad V = xW_V
$$

### Single Attention Formula

$$
Attention(Q, K, V) = softmax\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V
$$

### Multi-Head Version
Multi-head attention performs this formula several times in parallel with separate learned projections.

Each head has its own:

1. Query projection.
2. Key projection.
3. Value projection.

So each head can learn a different matching space.
        `,
        diagram: `graph LR
    X["Input x"] --> Q["Q projection"]
    X --> K["K projection"]
    X --> V["V projection"]
    Q --> Attn["Attention"]
    K --> Attn
    V --> Attn
    Attn --> Context["Context vector"]`,
      },
      {
        id: "head-splitting",
        title: "What Does Splitting Into Heads Mean?",
        content: `
### The Shape Idea
Suppose:

| Symbol | Meaning | Example |
| :--- | :--- | ---: |
| $B$ | Batch size | 2 |
| $T$ | Number of tokens | 5 |
| $C$ | Model width | 512 |
| $H$ | Number of heads | 8 |
| $D$ | Head dimension | 64 |

Since:

$$
C = H \\times D
$$

Then:

$$
512 = 8 \\times 64
$$

### Before Splitting
Input shape:

\`(B, T, C)\`

Example:

\`(2, 5, 512)\`

### After Splitting
Multi-head shape:

\`(B, H, T, D)\`

Example:

\`(2, 8, 5, 64)\`

The same token sequence is now viewed through 8 separate heads.

### Important
The model is not making 8 copies of the original text. It is projecting the same token vectors into 8 learned subspaces.
        `,
        diagram: `graph LR
    A["Input: B x T x C"] --> B["Linear QKV projection"]
    B --> C["Reshape: B x T x H x D"]
    C --> D["Transpose: B x H x T x D"]
    D --> E["Attention per head"]`,
      },
      {
        id: "why-smaller-heads",
        title: "Why Use Smaller Heads Instead of One Huge Head?",
        content: `
### Same Total Width, More Views
If $C = 512$ and $H = 8$, each head usually has dimension $D = 64$.

The total representation width stays around 512, but it is organized into separate attention spaces.

### Benefit
Each head can specialize.

Example sentence:

> The programmer fixed the bug because it broke the login flow.

Possible head behavior:

| Head | Possible learned pattern |
| :--- | :--- |
| Head 1 | "it" attends to "bug" |
| Head 2 | "fixed" attends to "programmer" |
| Head 3 | "broke" attends to "login flow" |
| Head 4 | Nearby phrase boundaries |

### Tradeoff
More heads does not automatically mean better. If each head becomes too small, each head may have too little capacity.

Modern architectures choose the number of heads carefully based on model width, speed, memory, and quality.
        `,
      },
    ],
  },
  {
    id: "complete-process",
    title: "3. Complete MHA Process",
    description: "Follow every step from input vectors to final projected output.",
    icon: "Layers",
    sections: [
      {
        id: "step-by-step",
        title: "Multi-Head Attention Step by Step",
        content: `
### Full Process
Given input tensor:

\`x: (B, T, C)\`

Multi-head attention does this:

1. Project $x$ into Q, K, and V.
2. Reshape Q, K, V into heads.
3. Compute attention scores per head.
4. Scale scores by $\\sqrt{D}$.
5. Apply mask if needed.
6. Apply softmax.
7. Multiply attention weights by V.
8. Concatenate head outputs.
9. Apply final output projection.

### Shape Walkthrough
Assume:

\`B = 2, T = 5, C = 512, H = 8, D = 64\`

| Step | Tensor | Shape |
| :--- | :--- | :--- |
| Input | x | (2, 5, 512) |
| Project | q, k, v | (2, 5, 512) each |
| Split heads | q, k, v | (2, 8, 5, 64) each |
| Scores | q @ k.T | (2, 8, 5, 5) |
| Weights | softmax(scores) | (2, 8, 5, 5) |
| Head output | weights @ v | (2, 8, 5, 64) |
| Merge heads | context | (2, 5, 512) |
| Output projection | out | (2, 5, 512) |
        `,
        diagram: `graph TD
    X["x: B x T x C"] --> QKV["Linear projection to Q, K, V"]
    QKV --> Split["Split into H heads"]
    Split --> Scores["Scores: Q x K^T"]
    Scores --> Scale["Scale by sqrt D"]
    Scale --> Mask["Optional mask"]
    Mask --> Softmax["Softmax"]
    Softmax --> Values["Weighted sum with V"]
    Values --> Concat["Concatenate heads"]
    Concat --> Proj["Output projection"]
    Proj --> Out["out: B x T x C"]`,
      },
      {
        id: "attention-per-head",
        title: "Attention Happens Independently Per Head",
        content: `
### Head Independence
Each head computes its own attention matrix.

If we have:

\`B = 1, H = 4, T = 3\`

Then scores have shape:

\`(1, 4, 3, 3)\`

This means:

1. Batch item 1.
2. Four separate heads.
3. Each head has a 3 x 3 token-to-token attention matrix.

### Example Tokens
Sentence:

> Dogs chase balls

Head 1 might focus on grammar:

| Query | Dogs | chase | balls |
| :--- | ---: | ---: | ---: |
| Dogs | 0.60 | 0.35 | 0.05 |
| chase | 0.45 | 0.20 | 0.35 |
| balls | 0.10 | 0.50 | 0.40 |

Head 2 might focus on object relationships:

| Query | Dogs | chase | balls |
| :--- | ---: | ---: | ---: |
| Dogs | 0.40 | 0.50 | 0.10 |
| chase | 0.20 | 0.20 | 0.60 |
| balls | 0.05 | 0.45 | 0.50 |

Same tokens. Different learned views.
        `,
      },
      {
        id: "output-projection",
        title: "Why Concatenate and Project?",
        content: `
### Concatenation
After each head produces output, the heads are concatenated.

If:

| Heads | Head dimension |
| ---: | ---: |
| 8 | 64 |

Then concatenated width is:

$$
8 \\times 64 = 512
$$

### Output Projection
The final linear layer mixes information across heads.

Without this projection, the heads would sit side by side. The output projection lets the model combine their findings into one unified representation.

### Mental Model
Each head writes notes in its own section. The output projection edits those notes into one clean paragraph for the next Transformer layer.
        `,
        diagram: `graph LR
    H1["Head 1 output"] --> Cat["Concatenate"]
    H2["Head 2 output"] --> Cat
    H3["Head 3 output"] --> Cat
    H4["Head 4 output"] --> Cat
    Cat --> W["Output projection W_O"]
    W --> Y["Mixed representation"]`,
      },
    ],
  },
  {
    id: "numeric-example",
    title: "4. Tiny Numeric Example",
    description: "A small two-head example that shows how heads can differ.",
    icon: "Hash",
    sections: [
      {
        id: "example-setup",
        title: "Two-Head Example Setup",
        content: `
We will use a very small sentence:

> I love AI

Assume two heads:

| Head | Focus idea |
| :--- | :--- |
| Head 1 | Identity and subject |
| Head 2 | Action and object |

To keep this readable, imagine each head has already produced attention weights.

### Head 1 Attention for "AI"
Head 1 attends like this:

| Token | Weight |
| :--- | ---: |
| I | 0.20 |
| love | 0.20 |
| AI | 0.60 |

### Head 2 Attention for "AI"
Head 2 attends like this:

| Token | Weight |
| :--- | ---: |
| I | 0.10 |
| love | 0.70 |
| AI | 0.20 |

Same query token. Different heads. Different focus.
        `,
      },
      {
        id: "example-compute",
        title: "Compute Two Head Outputs",
        content: `
Assume each head has 2D value vectors.

### Head 1 Values
| Token | Value |
| :--- | :--- |
| I | [1, 0] |
| love | [0, 1] |
| AI | [1, 1] |

Head 1 output for **AI**:

$$
0.20[1,0] + 0.20[0,1] + 0.60[1,1] = [0.80, 0.80]
$$

### Head 2 Values
| Token | Value |
| :--- | :--- |
| I | [2, 0] |
| love | [3, 1] |
| AI | [0, 2] |

Head 2 output for **AI**:

$$
0.10[2,0] + 0.70[3,1] + 0.20[0,2] = [2.30, 1.10]
$$

### Concatenate
The two head outputs are joined:

$$
[0.80, 0.80] \\; concat \\; [2.30, 1.10] = [0.80, 0.80, 2.30, 1.10]
$$

Then a learned output projection mixes these four numbers into the final vector.
        `,
        diagram: `graph LR
    H1["Head 1 output [0.80,0.80]"] --> Cat["Concatenate"]
    H2["Head 2 output [2.30,1.10]"] --> Cat
    Cat --> Vec["[0.80,0.80,2.30,1.10]"]
    Vec --> Proj["Output projection"]
    Proj --> Final["Final MHA vector"]`,
      },
      {
        id: "what-example-teaches",
        title: "What This Example Teaches",
        content: `
### Important Lessons
This tiny example shows four important points:

1. Heads can use different attention weights.
2. Heads can use different value projections.
3. Concatenation preserves multiple views.
4. Output projection mixes those views for the next layer.

### Real Model Difference
In a real model:

1. Q, K, V are learned from data.
2. Attention weights are computed using scaled dot products.
3. There may be 8, 16, 32, 64, or more heads.
4. Head dimensions are much larger.
5. This runs for every token, every layer.

The tiny example is small, but the mechanism is the same.
        `,
      },
    ],
  },
  {
    id: "masks-and-variants",
    title: "5. Masks and Variants",
    description: "Padding masks, causal masks, cross-attention, MQA, and GQA.",
    icon: "Shield",
    sections: [
      {
        id: "padding-mask",
        title: "Padding Mask",
        content: `
### Why Padding Exists
Training batches often contain sequences of different lengths.

Example:

| Sentence | Tokens |
| :--- | :--- |
| "I love AI" | 3 tokens |
| "Transformers are very powerful" | 4 tokens |

To batch them together, the shorter one may be padded:

\`I love AI <PAD>\`

### Problem
The model should not attend to \`<PAD>\` because it is fake content.

### Solution
Before softmax, padding positions receive a very negative score:

$$
-\\infty
$$

After softmax, they become attention weight 0.

### Shape Note
Padding masks must broadcast correctly to:

\`(B, H, T, T)\`
        `,
      },
      {
        id: "causal-mask",
        title: "Causal Mask",
        content: `
### Why Causal Masking Exists
Decoder models predict the next token.

When training on:

> The cat sleeps

The model should not use **sleeps** when predicting **cat**.

### Causal Rule
Token position $i$ can attend only to positions:

$$
0, 1, 2, ..., i
$$

It cannot attend to future positions.

### Attention Matrix Pattern
Allowed positions form a lower triangle:

| Query | token 1 | token 2 | token 3 | token 4 |
| :--- | :---: | :---: | :---: | :---: |
| token 1 | yes | no | no | no |
| token 2 | yes | yes | no | no |
| token 3 | yes | yes | yes | no |
| token 4 | yes | yes | yes | yes |

This is the mask used in GPT-style multi-head self-attention.
        `,
        diagram: `graph LR
    T1["Token 1"] --> T2["Token 2"]
    T2 --> T3["Token 3"]
    T3 --> T4["Token 4"]
    T4 -. "future blocked by causal mask" .-> F["Future tokens"]`,
      },
      {
        id: "mha-variants",
        title: "MHA, MQA, and GQA",
        content: `
Modern LLMs often use variants of standard multi-head attention to reduce memory and improve serving speed.

### Standard Multi-Head Attention
Each query head has its own key and value head.

| Component | Count |
| :--- | ---: |
| Query heads | H |
| Key heads | H |
| Value heads | H |

### Multi-Query Attention (MQA)
Many query heads share one key head and one value head.

| Benefit | Cost |
| :--- | :--- |
| Smaller KV cache, faster decoding | Can reduce quality if too compressed |

### Grouped-Query Attention (GQA)
Query heads are divided into groups. Each group shares key/value heads.

GQA is a middle ground between MHA and MQA.

| Type | KV sharing | Common goal |
| :--- | :--- | :--- |
| MHA | No sharing | Maximum expressiveness |
| MQA | All query heads share one KV set | Fast decoding |
| GQA | Groups share KV sets | Balance quality and speed |
        `,
        diagram: `graph TD
    MHA["MHA: many Q, many K, many V"] --> Rich["More expressive"]
    MQA["MQA: many Q, one shared K/V"] --> Fast["Smaller KV cache"]
    GQA["GQA: many Q, grouped K/V"] --> Balance["Balanced tradeoff"]`,
      },
    ],
  },
  {
    id: "worked-examples",
    title: "6. Worked Examples",
    description: "See how different heads can help with language, code, and reasoning.",
    icon: "BookOpen",
    sections: [
      {
        id: "pronoun-example",
        title: "Example 1: Pronoun Reference",
        content: `
Sentence:

> Sara gave Nina her laptop because she trusted her.

This sentence has multiple pronouns:

| Pronoun | Possible referents |
| :--- | :--- |
| her | Sara or Nina |
| she | Sara or Nina |
| her | Sara or Nina |

Different heads may focus on:

1. Entity tracking: Sara, Nina.
2. Verb roles: gave, trusted.
3. Object ownership: laptop.
4. Local grammar around each pronoun.

Multi-head attention gives the model several ways to represent the ambiguity before later layers refine it.
        `,
      },
      {
        id: "syntax-example",
        title: "Example 2: Syntax",
        content: `
Sentence:

> The keys to the cabinet are missing.

The correct verb is **are**, because the subject is **keys**, not **cabinet**.

Possible heads:

| Head | Focus |
| :--- | :--- |
| Head 1 | "keys" attends to "are" |
| Head 2 | "cabinet" is inside a prepositional phrase |
| Head 3 | "missing" connects to the main subject |

Without strong attention patterns, the model may over-focus on the nearby word **cabinet** and make agreement mistakes.
        `,
        diagram: `graph LR
    Keys[keys] -->|subject-verb head| Are[are]
    Cabinet[cabinet] -->|phrase boundary head| To[to]
    Missing[missing] -->|predicate head| Keys`,
      },
      {
        id: "code-example",
        title: "Example 3: Code Completion",
        content: `
Prompt:

\`\`\`python
def calculate_discount(price, percentage):
    discount = price * percentage / 100
    return
\`\`\`

Possible next expression:

\`\`\`python
price - discount
\`\`\`

Different heads can focus on:

| Head | Useful signal |
| :--- | :--- |
| Head 1 | Function name: calculate_discount |
| Head 2 | Variable definitions: price, percentage |
| Head 3 | Recently assigned variable: discount |
| Head 4 | Syntax after return |

This is why attention is powerful for code: relevant variables may be several lines away.
        `,
      },
      {
        id: "translation-example",
        title: "Example 4: Translation",
        content: `
English:

> The red book is on the table.

French:

> Le livre rouge est sur la table.

Multiple heads can help align:

| English signal | French generation need |
| :--- | :--- |
| The book | Le livre |
| red | rouge, after noun in this phrase |
| is on | est sur |
| table | table |

In encoder-decoder models, cross-attention heads can learn different alignment patterns between source and target tokens.
        `,
      },
    ],
  },
  {
    id: "implementation",
    title: "7. Implementation",
    description: "Build multi-head attention in PyTorch and understand every tensor.",
    icon: "Code",
    sections: [
      {
        id: "pytorch-mha",
        title: "Minimal PyTorch Multi-Head Attention",
        content: `
This implementation shows the core logic without hiding the shape changes.

### Input and Output
Input:

\`x: (B, T, C)\`

Output:

\`out: (B, T, C)\`

### Key Steps in Code
1. One linear layer creates Q, K, V together.
2. Q, K, V are reshaped into heads.
3. Attention is computed per head.
4. Heads are merged.
5. Final projection mixes the heads.
        `,
        code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class MultiHeadAttention(nn.Module):
    def __init__(self, embed_dim, num_heads, causal=False):
        super().__init__()
        if embed_dim % num_heads != 0:
            raise ValueError("embed_dim must be divisible by num_heads")

        self.embed_dim = embed_dim
        self.num_heads = num_heads
        self.head_dim = embed_dim // num_heads
        self.causal = causal

        self.qkv = nn.Linear(embed_dim, 3 * embed_dim)
        self.out = nn.Linear(embed_dim, embed_dim)

    def forward(self, x, padding_mask=None):
        # x: (B, T, C)
        B, T, C = x.shape

        qkv = self.qkv(x)  # (B, T, 3C)
        q, k, v = qkv.chunk(3, dim=-1)

        # (B, T, C) -> (B, H, T, D)
        q = q.view(B, T, self.num_heads, self.head_dim).transpose(1, 2)
        k = k.view(B, T, self.num_heads, self.head_dim).transpose(1, 2)
        v = v.view(B, T, self.num_heads, self.head_dim).transpose(1, 2)

        scores = q @ k.transpose(-2, -1)  # (B, H, T, T)
        scores = scores / (self.head_dim ** 0.5)

        if self.causal:
            causal_mask = torch.triu(
                torch.ones(T, T, device=x.device, dtype=torch.bool),
                diagonal=1,
            )
            scores = scores.masked_fill(causal_mask, float("-inf"))

        if padding_mask is not None:
            # padding_mask: (B, T), True means "ignore this key position"
            scores = scores.masked_fill(
                padding_mask[:, None, None, :],
                float("-inf"),
            )

        weights = F.softmax(scores, dim=-1)
        context = weights @ v  # (B, H, T, D)

        # (B, H, T, D) -> (B, T, C)
        context = context.transpose(1, 2).contiguous().view(B, T, C)
        return self.out(context)`,
        language: "python",
      },
      {
        id: "using-pytorch-built-in",
        title: "Using PyTorch Built-In MultiheadAttention",
        content: `
PyTorch also provides \`nn.MultiheadAttention\`.

### Why Learn the Manual Version?
The built-in layer is useful, but the manual version helps you debug:

1. Shape errors.
2. Mask broadcasting.
3. Causal attention.
4. Head splitting and merging.

### Built-In Example
        `,
        code: `import torch
import torch.nn as nn

embed_dim = 512
num_heads = 8

mha = nn.MultiheadAttention(
    embed_dim=embed_dim,
    num_heads=num_heads,
    batch_first=True,
)

x = torch.randn(2, 5, 512)  # (batch, tokens, embed_dim)

output, attn_weights = mha(
    query=x,
    key=x,
    value=x,
    need_weights=True,
)

print(output.shape)       # torch.Size([2, 5, 512])
print(attn_weights.shape) # often torch.Size([2, 5, 5]) when averaged over heads`,
        language: "python",
      },
      {
        id: "shape-debugging",
        title: "Shape Debugging Checklist",
        content: `
### Common Shape Expectations
| Tensor | Shape |
| :--- | :--- |
| x | (B, T, C) |
| q, k, v before split | (B, T, C) |
| q, k, v after split | (B, H, T, D) |
| scores | (B, H, T, T) |
| weights | (B, H, T, T) |
| context per head | (B, H, T, D) |
| merged context | (B, T, C) |
| final output | (B, T, C) |

### Checklist
1. Confirm $C$ is divisible by $H$.
2. Confirm softmax is applied on the last dimension.
3. Confirm mask shape broadcasts to \`(B, H, T, T)\`.
4. Use \`.contiguous()\` before \`.view(...)\` after transpose.
5. Confirm causal mask blocks only future tokens.
6. Confirm output shape matches input shape.

### Quick Test
Attention weights should sum to 1 across the key dimension:

$$
weights.sum(dim=-1) \\approx 1
$$
        `,
      },
    ],
  },
  {
    id: "performance-and-practice",
    title: "8. Performance and Practice",
    description: "Complexity, memory, KV cache, and practical interview-level understanding.",
    icon: "Activity",
    sections: [
      {
        id: "complexity",
        title: "Time and Memory Complexity",
        content: `
### Attention Matrix Cost
For each head, attention creates a token-to-token matrix:

$$
T \\times T
$$

With $H$ heads:

$$
H \\times T \\times T
$$

### Complexity
Attention cost is commonly described as:

$$
O(T^2 \\times C)
$$

The quadratic part comes from every token comparing with every other token.

### Example Attention Cells
| Tokens | Heads | Score cells |
| ---: | ---: | ---: |
| 1,000 | 8 | 8,000,000 |
| 2,000 | 8 | 32,000,000 |
| 4,000 | 8 | 128,000,000 |
| 8,000 | 8 | 512,000,000 |

This is why long context is expensive.
        `,
      },
      {
        id: "kv-cache",
        title: "Multi-Head Attention and KV Cache",
        content: `
### Why KV Cache Matters
During generation, previous tokens do not change.

So the model stores their key and value tensors.

For standard MHA, KV cache shape is often like:

\`(B, H, T, D)\`

for keys and the same for values.

### Memory Cost
KV cache grows with:

1. Batch size.
2. Number of layers.
3. Number of KV heads.
4. Sequence length.
5. Head dimension.

This is one reason MQA and GQA are popular: they reduce the number of key/value heads.
        `,
        diagram: `graph LR
    Past["Past tokens"] --> Cache["Cached K and V per layer"]
    New["New token"] --> Q["New query"]
    Cache --> Attn["Attention"]
    Q --> Attn
    Attn --> Next["Next token logits"]`,
      },
      {
        id: "interview-summary",
        title: "Interview-Ready Summary",
        content: `
### Short Definition
Multi-head attention is a Transformer mechanism that runs several attention heads in parallel. Each head projects inputs into its own query, key, and value spaces, computes scaled dot-product attention, and produces a context vector. The head outputs are concatenated and passed through a final linear projection.

### Why It Helps
It lets the model attend to different relationship types at the same time.

### Complete Flow
1. Input vectors enter the MHA layer.
2. Linear projection creates Q, K, and V.
3. Q, K, and V are split into heads.
4. Each head computes scaled dot-product attention.
5. Masks are applied if needed.
6. Softmax creates attention weights.
7. Attention weights mix value vectors.
8. Head outputs are concatenated.
9. Output projection mixes head information.
10. Result goes to residual connection and the rest of the Transformer block.

### Most Common Mistakes
| Mistake | Fix |
| :--- | :--- |
| Softmax over wrong dimension | Softmax over key positions, usually last dim |
| Wrong mask shape | Broadcast to score shape |
| Forgetting scale | Divide by $\\sqrt{head\\_dim}$ |
| Bad reshape after transpose | Use contiguous before view |
| embed_dim not divisible by heads | Choose valid dimensions |
        `,
        diagram: `graph TD
    X["Input"] --> QKV["Q,K,V projections"]
    QKV --> Heads["Split into heads"]
    Heads --> Attn["Attention per head"]
    Attn --> Cat["Concatenate"]
    Cat --> Proj["Output projection"]
    Proj --> Block["Rest of Transformer block"]`,
      },
    ],
  },
];
