import { topics as jsTopics } from "./javascript";
import { topics as tsTopics } from "./typescript";
import { topics as reactTopics } from "./react";
import { topics as redisTopics } from "./redis";
import { topics as pythonTopics } from "./python";
import { topics as langchainTopics } from "./langchain";
import { topics as litellmTopics } from "./litellm";
import { topics as aiTopics } from "./ai";
import { topics as oopTopics } from "./oop";
import { topics as graphqlTopics } from "./graphql";
import { topics as prismaTopics } from "./prisma";
import { topics as jwtTopics } from "./jwt";
import { topics as corsTopics } from "./cors";
import { topics as kafkaTopics } from "./kafka";
import { topics as mlTopics } from "./ml";
import { topics as llmTopics } from "./llm_engineering";
import { topics as selfAttentionTransformerTopics } from "./self_attention_transformers";
import { topics as multiHeadAttentionTopics } from "./multi_head_attention";
import { topics as ragTopics } from "./rag_system";
import { topics as designTopics } from "./ai_system_design";
import { topics as advancedAiTopics } from "./advanced_ai";
import { dsaTopics } from "./dsa/index.js";
import { topics as n8nTopics } from "./n8n";
import { golangTopics } from "./golang_index.js";
import { topics as k8sTopics } from "./kubernetes";
import { topics as okdTopics } from "./okd";
import { topics as podmanTopics } from "./podman";
import { systemDesignTopics } from "./system_design_index.js";
import { sqlTopics } from "./sql/index.js";
import { dotnetTopics } from "./dotnet/index.js";
import { topics as cueTopics } from "./cue";
import { topics as gitGithubTopics } from "./git_github";
import { sshTopics } from "./ssh";

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
  Hexagon,
  Container,
  Cloud,
  Layers,
  LayoutDashboard,
  TableProperties,
  Monitor,
  GitBranch,
  Key,
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
    id: "self-attention-transformers",
    category: "Generative AI & LLMs",
    title: "Self-Attention Transformers",
    description:
      "From tokens and QKV intuition to full Transformer blocks, generation, visuals, and worked examples.",
    icon: Network,
    color: "from-cyan-500 to-blue-700",
    topics: selfAttentionTransformerTopics,
  },
  {
    id: "multi-head-attention",
    category: "Generative AI & LLMs",
    title: "Multi-Head Attention",
    description:
      "Complete guide to attention heads, QKV splitting, tensor shapes, masks, variants, examples, and PyTorch implementation.",
    icon: Layers,
    color: "from-indigo-500 to-cyan-600",
    topics: multiHeadAttentionTopics,
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
    title: "LangChain, LangGraph & Langfuse",
    description:
      "A complete beginner-to-advanced path for LLM apps, durable agents, observability, prompts, and evaluation.",
    icon: Network,
    color: "from-green-500 to-lime-600",
    topics: langchainTopics,
  },
  {
    id: "litellm",
    category: "Generative AI & LLMs",
    title: "LiteLLM",
    description:
      "Unified Python SDK and AI Gateway to call 100+ LLM APIs with one interface.",
    icon: Cpu,
    color: "from-sky-400 to-indigo-600",
    topics: litellmTopics,
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
    id: "golang",
    category: "Backend & Architecture",
    title: "Go Backend Engineering",
    description:
      "Complete Go & GIN framework guide. From basics to microservices with PostgreSQL.",
    icon: Hexagon,
    color: "from-cyan-400 to-blue-600",
    topics: golangTopics,
  },
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
    id: "n8n",
    category: "Backend & Architecture",
    title: "n8n Automation",
    description:
      "Workflow automation tool. Visual node-based integrations and self-hosting.",
    icon: Zap,
    color: "from-pink-500 to-orange-500",
    topics: n8nTopics,
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

  // --- DevOps & Containers ---
  {
    id: "kubernetes",
    category: "DevOps & Containers",
    title: "Kubernetes",
    description:
      "Complete K8s guide. Pods, Services, Deployments, Networking, Storage & Security.",
    icon: Cloud,
    color: "from-blue-500 to-indigo-600",
    topics: k8sTopics,
  },
  {
    id: "okd",
    category: "DevOps & Containers",
    title: "OKD (OpenShift Community)",
    description:
      "Routes, S2I builds, SCCs, OperatorHub — the open-source Kubernetes distribution.",
    icon: Layers,
    color: "from-red-500 to-red-700",
    topics: okdTopics,
  },
  {
    id: "podman",
    category: "DevOps & Containers",
    title: "Podman",
    description:
      "Daemonless, rootless container engine. Docker alternative with pod support.",
    icon: Container,
    color: "from-purple-600 to-violet-700",
    topics: podmanTopics,
  },

  {
    id: "cue-language",
    category: "DevOps & Containers",
    title: "CUE Language",
    description:
      "Configure, Unify, Execute — the language for validating, generating, and managing YAML configs at scale.",
    icon: FileCode,
    color: "from-amber-400 to-orange-600",
    topics: cueTopics,
  },
  {
    id: "git-github",
    category: "DevOps & Containers",
    title: "Git & GitHub Mastery",
    description:
      "Complete interactive guide to Git, GitHub, workflows, CI, security, and recovery.",
    icon: GitBranch,
    color: "from-orange-500 to-rose-600",
    topics: gitGithubTopics,
  },
  {
    id: "ssh",
    category: "DevOps & Containers",
    title: "SSH Mastery",
    description:
      "Secure Shell from first login to production hardening, tunnels, bastions, and automation.",
    icon: Key,
    color: "from-cyan-500 to-emerald-600",
    topics: sshTopics,
  },

  // --- System Design ---
  {
    id: "system-design",
    category: "System Design",
    title: "System Design",
    description:
      "Scalability, databases, caching, load balancing & real-world design examples.",
    icon: LayoutDashboard,
    color: "from-emerald-500 to-teal-700",
    topics: systemDesignTopics,
  },

  // --- Databases ---
  {
    id: "sql",
    category: "Databases",
    title: "SQL Mastery",
    description:
      "Complete SQL guide — from basics to advanced queries, optimization, transactions & interview problems.",
    icon: TableProperties,
    color: "from-blue-500 to-cyan-600",
    topics: sqlTopics,
  },

  // --- .NET & C# ---
  {
    id: "dotnet",
    category: ".NET & C#",
    title: ".NET 10 & C# Mastery",
    description:
      "From C# fundamentals to ASP.NET Core, EF Core, design patterns, and production-ready APIs.",
    icon: Monitor,
    color: "from-violet-500 to-purple-700",
    topics: dotnetTopics,
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
