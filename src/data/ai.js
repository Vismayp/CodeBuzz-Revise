export const topics = [
  {
    id: "ai-fundamentals",
    title: "AI Fundamentals",
    description: "Core concepts: AI vs ML vs DL, and types of learning.",
    icon: "Cpu",
    sections: [
      {
        id: "ai-ml-dl",
        title: "AI vs ML vs DL",
        content: `
**Artificial Intelligence (AI)** is the broad field of creating smart machines.
**Machine Learning (ML)** is a subset of AI where machines learn from data without explicit programming.
**Deep Learning (DL)** is a subset of ML based on artificial neural networks.
        `,
        diagram: `graph TD
    A[Artificial Intelligence] --> B[Machine Learning]
    B --> C[Deep Learning]
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px`,
      },
      {
        id: "learning-types",
        title: "Types of Learning",
        content: `
1.  **Supervised Learning**: Learning with labeled data (e.g., Classification, Regression).
2.  **Unsupervised Learning**: Learning with unlabeled data (e.g., Clustering, Dimensionality Reduction).
3.  **Reinforcement Learning**: Learning through trial and error with rewards/punishments.
        `,
      },
    ],
  },
  {
    id: "neural-networks",
    title: "Neural Networks",
    description: "Perceptrons, Activation Functions, and Backpropagation.",
    icon: "Network",
    sections: [
      {
        id: "perceptron",
        title: "The Perceptron",
        content: `
A perceptron is the fundamental building block of neural networks. It takes inputs, applies weights and a bias, and passes the result through an activation function.
        `,
        diagram: `graph LR
    x1((x1)) --> w1
    x2((x2)) --> w2
    x3((x3)) --> w3
    subgraph Neuron
    w1[w1] --> Sum((Σ))
    w2[w2] --> Sum
    w3[w3] --> Sum
    Sum --> Act[Activation]
    end
    Act --> Output((y))`,
      },
      {
        id: "activation-functions",
        title: "Activation Functions",
        content: `
Activation functions introduce non-linearity.
*   **Sigmoid**: Maps input to (0, 1). Used in binary classification.
*   **ReLU (Rectified Linear Unit)**: $f(x) = max(0, x)$. Most common in hidden layers.
*   **Softmax**: Converts logits to probabilities.
        `,
        code: `import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def relu(x):
    return np.maximum(0, x)`,
      },
      {
        id: "backpropagation",
        title: "Backpropagation",
        content: `
The algorithm used to train neural networks. It calculates the gradient of the loss function with respect to each weight by the chain rule, allowing weights to be updated to minimize error.
        `,
      },
    ],
  },
  {
    id: "dl-architectures",
    title: "Deep Learning Architectures",
    description: "CNNs, RNNs, and Transformers.",
    icon: "Layers",
    sections: [
      {
        id: "cnn",
        title: "CNN (Convolutional Neural Networks)",
        content: `
Specialized for processing grid-like data such as images. Key layers:
*   **Convolutional Layer**: Detects features (edges, textures).
*   **Pooling Layer**: Reduces spatial dimensions.
*   **Fully Connected Layer**: Classification.
        `,
      },
      {
        id: "rnn-lstm",
        title: "RNNs & LSTMs",
        content: `
**RNNs (Recurrent Neural Networks)** process sequential data but suffer from vanishing gradients.
**LSTMs (Long Short-Term Memory)** solve this with gates (input, output, forget) to retain long-term dependencies.
        `,
      },
      {
        id: "transformers",
        title: "Transformers",
        content: `
The foundation of modern LLMs. Relies on the **Self-Attention Mechanism** to weigh the importance of different words in a sequence regardless of distance.
        `,
        diagram: `graph TD
    Input --> Embedding
    Embedding --> PosEnc[Positional Encoding]
    PosEnc --> Enc[Encoder Block]
    Enc --> Attn[Self-Attention]
    Attn --> FF[Feed Forward]
    FF --> Norm[Add & Norm]
    Norm --> Output`,
      },
    ],
  },
  {
    id: "nlp-llms",
    title: "NLP & LLMs",
    description: "Tokenization, Embeddings, BERT, and GPT.",
    icon: "MessageSquare",
    sections: [
      {
        id: "tokenization-embeddings",
        title: "Tokenization & Embeddings",
        content: `
*   **Tokenization**: Breaking text into smaller units (tokens).
*   **Embeddings**: Representing tokens as dense vectors where similar meanings are close in space (e.g., Word2Vec).
        `,
      },
      {
        id: "bert-vs-gpt",
        title: "BERT vs GPT",
        content: `
*   **BERT (Bidirectional Encoder Representations from Transformers)**: Encoder-only. Good for understanding/classification.
*   **GPT (Generative Pre-trained Transformer)**: Decoder-only. Good for generation.
        `,
      },
    ],
  },
  {
    id: "generative-ai",
    title: "Generative AI",
    description: "Creating new content with Diffusion, GANs, and VAEs.",
    icon: "Image",
    sections: [
      {
        id: "diffusion-models",
        title: "Diffusion Models",
        content: `
State-of-the-art for image generation (e.g., Stable Diffusion). Works by gradually adding noise to an image until it's random, then learning to reverse the process to generate images from noise.
        `,
      },
      {
        id: "gans",
        title: "GANs (Generative Adversarial Networks)",
        content: `
Consists of two networks competing:
1.  **Generator**: Creates fake data.
2.  **Discriminator**: Tries to distinguish real from fake.
        `,
      },
    ],
  },
  {
    id: "ethics-safety",
    title: "Ethics & Safety",
    description: "Bias, Hallucinations, and Alignment.",
    icon: "ShieldAlert",
    sections: [
      {
        id: "challenges",
        title: "Key Challenges",
        content: `
*   **Bias**: Models inherit biases from training data.
*   **Hallucinations**: Confidently generating false information.
*   **Alignment**: Ensuring AI goals match human values.
        `,
      },
    ],
  },
];
