export const topics = [
  {
    id: "ml-introduction",
    title: "PHASE 1: Core Machine Learning",
    description: "Machine Learning Fundamentals and Projects.",
    icon: "Target",
    sections: [
      {
        id: "what-is-ml",
        title: "What is ML?",
        content: `
Machine Learning (ML) is a subset of Artificial Intelligence that allows software applications to become more accurate at predicting outcomes without being explicitly programmed to do so.

**A Brief History:**
*   **1959**: Arthur Samuel coined the term at IBM.
*   **1990s**: Shift from knowledge-driven to data-driven approaches.
*   **Modern Era**: Powered by Big Data and high-performance computing (GPUs).
        `,
        diagram: `graph TD
    A[Artificial Intelligence] --> B[Machine Learning]
    B --> C[Deep Learning]
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px`,
      },
    ],
  },
  {
    id: "learning-types",
    title: "3. Machine Learning Fundamentals",
    description: "Supervised, Unsupervised, and Reinforcement Learning.",
    icon: "Cpu",
    sections: [
      {
        id: "supervised-learning",
        title: "Supervised Learning",
        content: `
The model is trained on **labeled data**. It learns a mapping function from input ($x$) to output ($y$).

**Core Examples:**
*   **Classification (Discrete)**: 
    *   *Email Filtering*: Classifying emails as 'Spam' or 'Inbox'.
    *   *Medical Diagnosis*: Predicting if a tumor is 'Malignant' or 'Benign'.
    *   *Digit Recognition*: Identifying numbers (0-9) from handwritten images.
*   **Regression (Continuous)**: 
    *   *House Prices*: Predicting price based on square footage and location.
    *   *Stock Market*: Predicting the future price of a stock.
    *   *Weather Forecasting*: Predicting the exact temperature for tomorrow.
        `,
        diagram: `graph LR
    A[Input Data] --> B[Training]
    C[Labels] --> B
    B --> D[Model]
    E[New Data] --> D
    D --> F[Prediction]`,
      },
      {
        id: "unsupervised-learning",
        title: "Unsupervised Learning",
        content: `
The model is trained on **unlabeled data**. It identifies hidden patterns or structures in the input data.

**Key Examples:**
*   **Clustering**: 
    *   *Customer Segmentation*: Grouping shoppers by their purchasing habits for targeted marketing.
    *   *Document Topic Modeling*: Automatically grouping news articles by topic (Sports, Politics, Tech).
*   **Dimensionality Reduction**: 
    *   *Image Compression*: Reducing file size while keeping essential visual features.
    *   *Visualization*: Flattening 100-dimensional data into a 2D plot using PCA or t-SNE.
*   **Association**:
    *   *Market Basket Analysis*: Finding that people who buy beer also likely buy diapers.
        `,
        diagram: `graph TD
    A[Mixed Data] --> B[ML Algorithm]
    B --> C[Cluster 1]
    B --> D[Cluster 2]
    B --> E[Cluster 3]`,
      },
      {
        id: "reinforcement-learning",
        title: "Reinforcement Learning",
        content: `
Learning through trial and error to maximize a cumulative reward.

**Core Components:**
*   **Agent**: The learner/decision maker.
*   **Environment**: The world the agent interacts with.
*   **State**: The current situation.
*   **Action**: What the agent does.
*   **Reward**: Feedback from the environment (+1 or -1).
        `,
        diagram: `graph LR
    Agent --Action--> Environment
    Environment --Reward/State--> Agent`,
      },
    ],
  },
  {
    id: "common-algorithms",
    title: "Common Algorithms",
    description: "The workhorses of Machine Learning.",
    icon: "Variable",
    sections: [
      {
        id: "linear-regression",
        title: "Linear Regression",
        content: `
Predicts a continuous target variable based on one or more independent variables.

**Formula**: $y = \\beta_0 + \\beta_1x + \\epsilon$
**Cost Function**: **Mean Squared Error (MSE)**, which measures the average squared difference between actual and predicted values. It aims to minimize this error.

**Examples:**
*   **Real Estate**: Predicting a home's value based on its age ($x$).
*   **Business**: Estimating sales growth based on marketing spend.
*   **Health**: Correlation between BMI and blood pressure.
        `,
      },
      {
        id: "logistic-regression",
        title: "Logistic Regression",
        content: `
Contrary to its name, it's used for **classification**. It calculates the probability that a given input belongs to a certain class (usually binary).

**Sigmoid Function**: $\\sigma(z) = \\frac{1}{1 + e^{-z}}$. This squashes any value into a range between 0 and 1.
**Threshold**: Usually, if probability $> 0.5$, it's Class A; otherwise, Class B.

**Examples:**
*   **Finance**: Is a credit card transaction fraudulent (True/False)?
*   **Marketing**: Will a customer click this ad (Yes/No)?
*   **Biology**: Determining if a cell is healthy or cancerous.
        `,
      },
      {
        id: "knn",
        title: "KNN (K-Nearest Neighbors)",
        content: `
A simple, instance-based learning algorithm that classifies a data point by looking at the 'K' most similar points (neighbors).

*   **Distance Metrics**: Usually **Euclidean distance** ($\\sqrt{\\sum (x_i - y_i)^2}$).
*   **Choosing K**: 
    *   *Small K*: High sensitivity to noise (overfitting).
    *   *Large K*: Smoother boundaries but might miss local patterns.
*   **Example**: Recommender systems (if you like movie A, you might like movie B because users who liked A also liked B).
        `,
      },
      {
        id: "decision-trees-rf",
        title: "Decision Trees & Random Forest",
        content: `
**Decision Trees**: Logic-based models that split data into branches based on feature values.
*   **Information Gain**: How much a feature helps us "unmix" the data.
*   **Gini Impurity**: The likelihood of a random sample being misclassified if labeled according to the distribution in the node.

**Random Forest**: An **Ensemble method**. Instead of one tree, it trains hundreds of trees on different subsets of the data (**Bagging**) and takes the "majority vote".
*   *Advantage*: Much more robust and less likely to overfit than a single decision tree.
        `,
      },
      {
        id: "k-means",
        title: "K-Means Clustering",
        content: `
Partitioning data into $K$ distinct clusters based on feature similarity.

**Centroids**: The center points of clusters.
**Elbow Method**: Plotting inertia vs $K$ to find the "bend" where adding clusters adds little value.
        `,
      },
    ],
  },
  {
    id: "ml-libraries",
    title: "Essential Libraries",
    description: "The Python ecosystem for ML.",
    icon: "Library",
    sections: [
      {
        id: "numpy-pandas",
        title: "NumPy & Pandas",
        content: `
*   **NumPy**: The foundation for numerical computing. Provides powerful N-dimensional arrays.
*   **Pandas**: The primary tool for data manipulation. Offers DataFrames, which are like programmable spreadsheets.
        `,
        code: `import numpy as np
import pandas as pd

# Creating an array
arr = np.array([1, 2, 3])

# Creating a DataFrame
df = pd.DataFrame({'price': [100, 200], 'rooms': [2, 3]})`,
      },
      {
        id: "matplotlib-sklearn",
        title: "Matplotlib & Scikit-learn",
        content: `
*   **Matplotlib**: Creating static, animated, and interactive visualizations in Python.
*   **Scikit-learn**: The most popular library for traditional ML. Provides simple and efficient tools for predictive data analysis.
        `,
        code: `from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)`,
      },
    ],
  },
  {
    id: "project-house-prices",
    title: "Project: House Price Prediction",
    description: "A step-by-step guide to your first regression project.",
    icon: "Home",
    sections: [
      {
        id: "project-steps",
        title: "Workflow Steps",
        content: `
1.  **Data Preprocessing**: Handle missing values and convert categorical text (like 'neighborhood') into numbers.
2.  **Feature Scaling**: Scale features (e.g., using StandardScaler) so that variables with large ranges don't dominate.
3.  **Training**: Split data into training/testing sets. Fit a Linear Regression model.
4.  **Evaluation**: Use metrics like Mean Absolute Error (MAE) and $R^2$ Score to see how well the model performs.
        `,
      },
    ],
  },
  {
    id: "data-handling-eda",
    title: "PHASE 2: Data & Model Evaluation",
    description: "4. Data Handling & EDA: Cleaning and preparing data.",
    icon: "Database",
    sections: [
      {
        id: "missing-values",
        title: "Missing Values & Imputation",
        content: `
Real-world datasets rarely arrive clean. Handling missing values is critical to avoid biased models.

**Imputation Techniques:**
*   **Mean/Median/Mode**: Replacing missing values with the average or most frequent value.
*   **KNN Imputation**: Using similarities between data points to predict missing values.
*   **Predictive Modeling**: Treating the missing column as a target for a separate ML model.

**Example:**
If 'Age' is missing for 5% of users, we might fill them with the median age of 28 to maintain the distribution without being skewed by outliers.
        `,
        diagram: `graph TD
    A[Missing Data] --> B{Handle?}
    B --> C[Ignore/Drop]
    B --> D[Impute]
    D --> E[Mean/Median/Mode]
    D --> F[Algorithms like KNN]`,
      },
      {
        id: "outliers",
        title: "Outliers Detection",
        content: `
Outliers are data points that lie far away from the rest of the observations.

**Common Methods:**
1.  **Z-score**: Measures how many standard deviations a point is from the mean. Typically, $|Z| > 3$ is an outlier.
2.  **IQR (Interquartile Range)**: $IQR = Q3 - Q1$. Outliers are values outside $[Q1 - 1.5 \times IQR, Q3 + 1.5 \times IQR]$.

**Example:**
An annual income of $5,000,000 in a dataset where the average is $60,000 is likely an outlier that should be investigated.
        `,
      },
      {
        id: "feature-engineering",
        title: "Feature Engineering",
        content: `
Turning raw data into meaningful features that better represent the underlying problem.

*   **Normalization**: Scaling features to a range of [0, 1].
*   **Standardization**: Centering features around 0 with a standard deviation of 1.
*   **Encoding**: Converting categorical labels into numbers (One-Hot Encoding, Label Encoding).
*   **Creation**: Combining features (e.g., 'Total SqFt' = 'Basement' + 'Main Floor').
        `,
      },
    ],
  },
  {
    id: "model-evaluation",
    title: "5. Model Evaluation",
    description: "Measuring how well your model actually performs.",
    icon: "TrendingUp",
    sections: [
      {
        id: "holdout-vs-cv",
        title: "Train/Test Split vs CV",
        content: `
*   **Train/Test Split**: Fast and simple. Data is split once (e.g., 80/20).
*   **Cross-Validation (K-Fold)**: The dataset is split into $K$ parts. The model is trained $K$ times, each time using a different fold as the test set.

**Pro-Tip**: Use Cross-Validation when your dataset is small to ensure the model's performance isn't just due to a "lucky" split.
        `,
        diagram: `graph LR
    A[Whole Set] --> B[Fold 1]
    A --> C[Fold 2]
    A --> D[Fold 3]
    A --> E[Fold 4]
    A --> F[Fold 5]
    B -.-> G[Testing]
    C & D & E & F --> H[Training]`,
      },
      {
        id: "metrics-formulas",
        title: "Success Metrics",
        content: `
Different problems require different success metrics.

**For Classification:**
*   **Accuracy**: $\\frac{TP + TN}{Total}$. Best for balanced classes.
*   **Precision**: $\\frac{TP}{TP + FP}$. "How many predicted positive were actually positive?" (Avoids False Positives).
*   **Recall**: $\\frac{TP}{TP + FN}$. "How many actual positives did we find?" (Avoids False Negatives).
*   **F1 Score**: Harmonic mean of Precision and Recall.

**For Regression:**
*   **RMSE**: Square root of the average squared errors. Penalizes large mistakes heavily.
        `,
      },
    ],
  },
  {
    id: "project-credit-risk",
    title: "Project: Credit Risk",
    description: "Predicting loan defaults using classification.",
    icon: "Shield",
    sections: [
      {
        id: "classification-workflow",
        title: "Workflow & ROC-AUC",
        content: `
**Why Classification?**
We are predicting a discrete label: "Will Default" (1) or "Won't Default" (0).

**Confusion Matrix**: 
A table used to describe the performance of a classification model.

**ROC-AUC**:
*   **ROC Curve**: Plots True Positive Rate vs False Positive Rate at various thresholds.
*   **AUC (Area Under Curve)**: A single number summarizing the ROC curve. 1.0 is perfect; 0.5 is no better than random guessing.
        `,
      },
    ],
  },
  {
    id: "deep-learning-basics",
    title: "Deep Learning Basics",
    description: "The foundations of Artificial Neural Networks.",
    icon: "Brain",
    sections: [
      {
        id: "neurons-weights",
        title: "Neurons, Weights & Bias",
        content: `
An artificial neuron (perceptron) is the fundamental building block. It takes inputs, applies weights, adds a bias, and produces an output.

**The Equation:** $y = f(\\sum w_i x_i + b)$
*   **Weights ($w$)**: The "knobs" the model turns during training. They represent how much influence an input has on the result.
*   **Bias ($b$)**: An extra parameter that allows the output to shift, helping the model fit the data better.
*   **Analogy**: Think of it like a decision-maker. Inputs are "factors" (Is it raining? Is it cold?), and weights are "how much I care about those factors".
        `,
        diagram: `graph LR
    X1[Input 1] --W1--> N((Neuron))
    X2[Input 2] --W2--> N
    B[Bias] --> N
    N --Activation--> O[Output]`,
      },
      {
        id: "activation-functions",
        title: "Activation Functions",
        content: `
They introduce **non-linearity**. Without them, a neural network is just a giant linear regression model, no matter how many layers it has.

**Common Types:**
*   **ReLU (Rectified Linear Unit)**: $\max(0, x)$. Pass through positive values, block negative ones. Very fast and efficient.
*   **Sigmoid**: $\\sigma(x) = \\frac{1}{1+e^{-x}}$. Output is [0, 1]. Great for binary probability.
*   **Softmax**: Turns a vector of scores into a probability distribution where all values sum to 1. Used at the **final layer** for multi-class classification (e.g., Cat vs Dog vs Bird).
        `,
      },
      {
        id: "backpropagation",
        title: "Backpropagation & Loss",
        content: `
How do we teach the network?

1.  **Forward Pass**: Input goes through the network to generate a prediction.
2.  **Loss Calculation**: We compare the prediction to the real answer using a **Loss Function** (like MSE or Cross-Entropy).
3.  **Backward Pass (Backprop)**: We calculate the "error gradient" and go backward through the layers using the **Chain Rule**.
4.  **Weight Update**: We nudge the weights slightly in the direction that reduces the loss using an **Optimizer** (like SGD or Adam).
        `,
      },
    ],
  },
  {
    id: "dl-frameworks",
    title: "PyTorch vs TensorFlow",
    description: "Choosing your weapon for Deep Learning.",
    icon: "Codepen",
    sections: [
      {
        id: "framework-comparison",
        title: "Key Differences",
        content: `
| Feature | PyTorch | TensorFlow/Keras |
| :--- | :--- | :--- |
| **Graph** | Dynamic (runs like Python) | Static/Dynamic (more structured) |
| **Eco-system** | Research & Academia favorite | Industry & Production favorite |
| **Debugging** | Easy (standard Python debuggers) | Can be complex (graph-based) |
| **Learning Curve** | Gentle for Python developers | Gentle for Keras, steeper for Core TF |
        `,
      },
    ],
  },
  {
    id: "dl-architectures",
    title: "7. Deep Learning Architectures",
    description: "CNN (Computer Vision) and RNN/LSTM (Sequential datasets).",
    icon: "Layers",
    sections: [
      {
        id: "cnn-vision",
        title: "CNN (Vision)",
        content: `
**Convolutional Neural Networks** are designed for spatial data like images.

*   **Convolution Layers**: Use filters (kernels) to detect features like edges or textures.
*   **Pooling**: Reduces the spatial dimensions (e.g., Max Pooling) to reduce parameters and computation.
*   **Padding**: Adding zeros around the border to keep dimensions consistent after convolution.
        `,
        diagram: `graph TD
    A[Image] --> B[Conv + ReLU]
    B --> C[Max Pooling]
    C --> D[Conv + ReLU]
    D --> E[Max Pooling]
    E --> F[Fully Connected]
    F --> G[Output]`,
      },
      {
        id: "rnn-lstm-sequences",
        title: "RNN & LSTM (Sequences)",
        content: `
**Recurrent Neural Networks** handle sequential data (Time series, Text).

*   **Vanishing Gradient**: Simple RNNs forget early information in long sequences because gradients shrink during backprop.
*   **LSTM (Long Short-Term Memory)**: Includes "Gates" (Forget, Input, Output) to selectively remember or forget information over long periods.
        `,
      },
    ],
  },
  {
    id: "projects-dl-vision",
    title: "Vision Projects",
    description: "MNIST and Image Classification lessons.",
    icon: "Camera",
    sections: [
      {
        id: "dl-project-lessons",
        title: "Key Lessons",
        content: `
**Project 3: MNIST Digits**
The "Hello World" of DL. Teaches basic MLP and CNN construction.

**Project 4: Cats vs Dogs**
A real-world binary classification task.
*   **Overfitting**: When a model learns the training data *too* well, including noise.
*   **Data Augmentation**: Solving overfitting by artificially increasing the dataset size (flipping, rotating, zooming images).
        `,
      },
    ],
  },
  {
    id: "nlp-fundamentals",
    title: "PHASE 4: Natural Language Processing (NLP)",
    description: "8. NLP Fundamentals and text processing basics.",
    icon: "MessageSquare",
    sections: [
      {
        id: "text-preprocessing",
        title: "Text Preprocessing",
        content: `
Computers don't read words; they process numbers.

1.  **Tokenization**: Splitting a sentence into individual words (tokens).
2.  **Stop Words**: Removing common words like "the", "is", "in" which don't carry much meaning.
3.  **Stemming vs Lemmatization**:
    *   **Stemming**: Chopping off the ends of words (e.g., "running" -> "run", "studies" -> "studi").
    *   **Lemmatization**: Using a dictionary to find the root word (e.g., "better" -> "good", "studies" -> "study").
        `,
        diagram: `graph LR
    A["I am learning ML."] --> B[Tokenize]
    B --> C["[I, am, learning, ML]"]
    C --> D[Stopwords]
    D --> E["[learning, ML]"]
    E --> F[Lemmatize]
    F --> G["[learn, ML]"]`,
      },
    ],
  },
  {
    id: "word-embeddings",
    title: "9. Embeddings",
    description: "Representing words as dense numerical vectors.",
    icon: "Maximize",
    sections: [
      {
        id: "embeddings-types",
        title: "Vector Representations",
        content: `
**Word2Vec**:
*   **Skip-gram**: Predicts context words from a target word.
*   **CBOW (Continuous Bag of Words)**: Predicts a target word from context.

**GloVe**: Global Vectors for Word Representation. Focuses on word co-occurrence statistics across a whole corpus.

**Sentence Embeddings**: Capturing the meaning of an entire sentence or paragraph as a single vector (e.g., using BERT).
        `,
      },
    ],
  },
  {
    id: "project-sentiment",
    title: "Project: Sentiment Analysis",
    description: "Determining the emotional tone of text.",
    icon: "Smile",
    sections: [
      {
        id: "sentiment-workflow",
        title: "Workflow",
        content: `
1.  **Gather Data**: Scrape reviews or use datasets like IMDB.
2.  **Clean & Tokenize**: Apply the fundamentals (lowercase, remove punctuation, lemmatize).
3.  **Vectorization**: Convert text to numbers using **TF-IDF** or **Word Embeddings**.
4.  **Model Training**: Use a classifier like Naive Bayes, SVM, or an LSTM.
5.  **Inference**: Input a new review and output "Positive" or "Negative".
        `,
      },
    ],
  },
];
