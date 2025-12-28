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
import {
  Code,
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
} from "lucide-react";

export const subjects = [
  {
    id: "javascript",
    title: "JavaScript & Node.js",
    description:
      "Master the language of the web, from V8 internals to advanced patterns.",
    icon: Code,
    color: "from-yellow-400 to-orange-500",
    topics: jsTopics,
  },
  {
    id: "typescript",
    title: "TypeScript",
    description:
      "Supercharge your JavaScript with static types, interfaces, and advanced tooling.",
    icon: FileCode,
    color: "from-blue-500 to-blue-700",
    topics: tsTopics,
  },
  {
    id: "react",
    title: "React.js",
    description:
      "Build modern, interactive user interfaces with the most popular JS library.",
    icon: Atom,
    color: "from-cyan-400 to-blue-500",
    topics: reactTopics,
  },
  {
    id: "redis",
    title: "Redis",
    description:
      "In-memory data structure store, used as a database, cache, and message broker.",
    icon: Database,
    color: "from-red-500 to-red-700",
    topics: redisTopics,
  },
  {
    id: "python",
    title: "Python Masterclass",
    description:
      "From basics to metaclasses, concurrency, and CPython internals.",
    icon: FileJson,
    color: "from-blue-400 to-yellow-300",
    topics: pythonTopics,
  },
  {
    id: "graphql",
    title: "GraphQL Mastery",
    description: "Build efficient APIs with schemas, resolvers, and Apollo.",
    icon: Globe,
    color: "from-pink-500 to-rose-600",
    topics: graphqlTopics,
  },
  {
    id: "prisma",
    title: "Prisma ORM",
    description: "Next-gen Node.js and TypeScript ORM for modern apps.",
    icon: Database,
    color: "from-teal-400 to-blue-500",
    topics: prismaTopics,
  },
  {
    id: "jwt",
    title: "Authentication (JWT)",
    description: "Secure your apps with JSON Web Tokens and best practices.",
    icon: Lock,
    color: "from-indigo-500 to-purple-600",
    topics: jwtTopics,
  },
  {
    id: "cors",
    title: "Web Security (CORS & WAF)",
    description:
      "Master Cross-Origin Resource Sharing, Web Application Firewalls, and web security fundamentals.",
    icon: ShieldCheck,
    color: "from-cyan-500 to-blue-600",
    topics: corsTopics,
  },
  {
    id: "oop",
    title: "Object-Oriented Programming",
    description: "Master OOP concepts, Design Patterns, and SOLID principles.",
    icon: Box,
    color: "from-red-400 to-rose-600",
    topics: oopTopics,
  },
  {
    id: "langchain",
    title: "LangChain & LangGraph",
    description: "Build LLM applications, agents, and stateful workflows.",
    icon: Network,
    color: "from-green-400 to-emerald-600",
    topics: langchainTopics,
  },
  {
    id: "ai",
    title: "Artificial Intelligence",
    description: "Deep Learning, Neural Networks, Transformers, and LLMs.",
    icon: Brain,
    color: "from-purple-400 to-pink-600",
    topics: aiTopics,
  },
];
