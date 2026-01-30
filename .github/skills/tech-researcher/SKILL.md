---
name: tech-researcher
description: Autonomous web data gathering and technical topic research. Use this when asked to research tech topics, create beginner-friendly to interview-ready content, or generate interactive HTML/CSS diagrams for learning.
---

# 🤖 AI Agent Skills & Instructions for Tech Topic Research

> **Purpose**: This document serves as a comprehensive guide for AI Agents (GitHub Copilot, Claude, etc.) to research, create, and present technical topics in an engaging, beginner-friendly to interview-ready format.

---

## 📋 Table of Contents

1. [Agent Mission Statement](#-agent-mission-statement)
2. [Content Creation Philosophy](#-content-creation-philosophy)
3. [Topic Structure Template](#-topic-structure-template)
4. [Visual Diagram Guidelines](#-visual-diagram-guidelines)
5. [Example Patterns](#-example-patterns)
6. [MCP Tool Usage](#-mcp-tool-usage)
7. [Interview Preparation Focus](#-interview-preparation-focus)
8. [Advanced Content Guidelines](#-advanced-content-guidelines)

---

## 🎯 Agent Mission Statement

```
As an AI Agent, your mission is to:
1. Research technical topics thoroughly using available MCP tools
2. Present information in a progressive difficulty curve (Beginner → Intermediate → Advanced → Interview)
3. Create visual diagrams using HTML/CSS/JS for complex concepts
4. Provide real-world examples at every level
5. Ensure content is memorable, practical, and interview-ready
```

---

## 📚 Content Creation Philosophy

### The 4-Layer Learning Pyramid

```
┌─────────────────────────────────────────┐
│           🏆 INTERVIEW READY            │
│    Complex scenarios, edge cases,       │
│    system design, optimization          │
├─────────────────────────────────────────┤
│           🔥 ADVANCED                   │
│    Deep internals, performance,         │
│    architecture patterns                │
├─────────────────────────────────────────┤
│           📈 INTERMEDIATE               │
│    Practical usage, common patterns,    │
│    real-world applications              │
├─────────────────────────────────────────┤
│           🌱 BEGINNER                   │
│    Core concepts, simple analogies,     │
│    basic examples                       │
└─────────────────────────────────────────┘
```

---

## 🎨 Visual Diagram Guidelines

### Use HTML/CSS/JS for Interactive Diagrams

AI Agents should create visual diagrams using this pattern:

```javascript
const createDiagram = (config) => `
<div class="diagram-container" style="
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  padding: 24px;
  margin: 20px 0;
">
  <!-- Content -->
</div>
`;
```

_(Refer to full implementation in original skills.md if needed)_

---

## 🔧 MCP Tool Usage

Use `firecrawl_search` and `firecrawl_agent` to research the latest documentation and interview questions.

---

> **Note to Copilot**: When this skill is active, always follow the learning pyramid structure and prioritize visual diagrams.
