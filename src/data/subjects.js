import { topics as jsTopics } from "./javascript";
import { topics as tsTopics } from "./typescript";
import { topics as reactTopics } from "./react";
import { topics as redisTopics } from "./redis";
import { topics as pythonTopics } from "./python";
import { topics as langchainTopics } from "./langchain";
import { topics as aiTopics } from "./ai";
import { topics as oopTopics } from "./oop";
import { topics as graphqlTopics } from "./graphql";
import { topics as prismaTopics } from "./prisma";
import { topics as jwtTopics } from "./jwt";
import { topics as corsTopics } from "./cors";
import { topics as kafkaTopics } from "./kafka";
import { topics as mlTopics } from "./ml";
import { topics as llmTopics } from "./llm_engineering";
import { topics as ragTopics } from "./rag_system";
import { topics as designTopics } from "./ai_system_design";
import { topics as advancedAiTopics } from "./advanced_ai";
import { dsaTopics } from "./dsa/index.js";

import {
  Code,
  Code2,
  FileJson,
  FileCode,
  Brain,
  Network,
  Box,
  Database,
  Server,
  Lock,
  Globe,
  ShieldCheck,
  Atom,
  Share2,
  Target,
  Activity,
  Cpu,
  Zap,
} from "lucide-react";

export const subjects = [
  // --- Generative AI & LLMs ---
  {
    id: "llm-engineering",
    category: "Generative AI & LLMs",
    title: "LLM Engineering",
    description: "Core Concepts, Attention Mechanisms, and Prompt Engineering.",
    icon: Brain,
    color: "from-purple-600 to-pink-500",
    topics: llmTopics,
  },
  {
    id: "rag-systems",
    category: "Generative AI & LLMs",
    title: "RAG Systems",
    description: "Retrieval-Augmented Generation, Vectors, and Embeddings.",
    icon: Database,
    color: "from-green-500 to-emerald-700",
    topics: ragTopics,
  },
  {
    id: "ai-system-design",
    category: "Generative AI & LLMs",
    title: "AI System Design",
    description: "Serving, Caching, Async Architectures, and MLOps.",
    icon: Server,
    color: "from-slate-600 to-slate-800",
    topics: designTopics,
  },
  {
    id: "advanced-ai",
    category: "Generative AI & LLMs",
    title: "Advanced AI",
    description: "Reinforcement Learning, Computer Vision, and Agents.",
    icon: Network,
    color: "from-red-600 to-orange-600",
    topics: advancedAiTopics,
  },
  {
    id: "langchain",
    category: "Generative AI & LLMs",
    title: "LangChain",
    description: "Building applications with LLMs through composability.",
    icon: Network,
    color: "from-green-500 to-lime-600",
    topics: langchainTopics,
  },

  // --- Python & Data Science ---
  {
    id: "python",
    category: "Python & Data Science",
    title: "Python Masterclass",
    description:
      "From basics to metaclasses, concurrency, and CPython internals.",
    icon: FileJson,
    color: "from-blue-400 to-yellow-300",
    topics: pythonTopics,
  },
  {
    id: "artificial-intelligence",
    category: "Python & Data Science",
    title: "Artificial Intelligence",
    description:
      "The broad field of creating smart machines, including ML and DL.",
    icon: Brain,
    color: "from-emerald-400 to-teal-500",
    topics: aiTopics,
  },
  {
    id: "machine-learning",
    category: "Python & Data Science",
    title: "Machine Learning",
    description:
      "Algorithms that allow computers to learn from data without explicit programming.",
    icon: Network,
    color: "from-orange-400 to-red-500",
    topics: mlTopics,
  },

  // --- Web Development ---
  {
    id: "javascript",
    category: "Web Development",
    title: "JavaScript & Node.js",
    description:
      "Master the language of the web, from V8 internals to advanced patterns.",
    icon: Code,
    color: "from-yellow-400 to-orange-500",
    topics: jsTopics,
  },
  {
    id: "typescript",
    category: "Web Development",
    title: "TypeScript",
    description:
      "Supercharge your JavaScript with static types, interfaces, and advanced tooling.",
    icon: FileCode,
    color: "from-blue-500 to-blue-700",
    topics: tsTopics,
  },
  {
    id: "react",
    category: "Web Development",
    title: "React.js",
    description:
      "Build modern, interactive user interfaces with the most popular JS library.",
    icon: Atom,
    color: "from-cyan-400 to-blue-500",
    topics: reactTopics,
  },
  {
    id: "graphql",
    category: "Web Development",
    title: "GraphQL Mastery",
    description: "Build efficient APIs with schemas, resolvers, and Apollo.",
    icon: Globe,
    color: "from-pink-500 to-rose-600",
    topics: graphqlTopics,
  },
  {
    id: "prisma",
    category: "Web Development",
    title: "Prisma ORM",
    description: "Next-gen Node.js and TypeScript ORM for modern apps.",
    icon: Database,
    color: "from-teal-400 to-blue-500",
    topics: prismaTopics,
  },
  {
    id: "jwt",
    category: "Web Development",
    title: "JWT Authentication",
    description:
      "Secure your apps with JSON Web Tokens, sessions, and security best practices.",
    icon: Lock,
    color: "from-gray-600 to-gray-800",
    topics: jwtTopics,
  },
  {
    id: "cors",
    category: "Web Development",
    title: "CORS",
    description:
      "Cross-Origin Resource Sharing. Browser security, headers, and preflight requests.",
    icon: ShieldCheck,
    color: "from-indigo-400 to-purple-500",
    topics: corsTopics,
  },

  // --- Backend & Architecture ---
  {
    id: "kafka",
    category: "Backend & Architecture",
    title: "Kafka Mastery",
    description:
      "Distributed event streaming, brokers, partitions and high scale architecture.",
    icon: Share2,
    color: "from-purple-500 to-indigo-600",
    topics: kafkaTopics,
  },
  {
    id: "redis",
    category: "Backend & Architecture",
    title: "Redis",
    description:
      "In-memory data structure store, used as a database, cache, and message broker.",
    icon: Database,
    color: "from-red-500 to-red-700",
    topics: redisTopics,
  },
  {
    id: "oop",
    category: "Backend & Architecture",
    title: "Object-Oriented Programming",
    description: "Design patterns, SOLID principles, and classes.",
    icon: Box,
    color: "from-amber-500 to-orange-600",
    topics: oopTopics,
  },

  // --- Algorithms & Core CS ---
  {
    id: "dsa",
    category: "Algorithms & Core CS",
    title: "Data Structures & Algorithms",
    description: "Master problem-solving from Big O to Dynamic Programming.",
    icon: Activity,
    color: "from-red-500 to-rose-700",
    topics: dsaTopics,
  },
];
