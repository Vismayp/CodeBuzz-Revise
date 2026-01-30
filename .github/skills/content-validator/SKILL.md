---
name: content-validator
description: Verifies that technical revision content adheres to project standards, is beginner-to-interview ready, and contains no linting/formatting issues. Use this to review and validate any .js files in src/data/.
---

# 🕵️ Content Validation & Quality Assurance Skill

> **Purpose**: To ensure every piece of content created for the Revision project is high-quality, structurally sound, and provides value at all levels (Beginner to Interview).

---

## 📋 Validation Checklist

When reviewing a data file (e.g., `src/data/*.js`), verify the following:

### 1. File Structure & Syntax

- [ ] **Export Format**: The file must export a `topics` array: `export const topics = [...];`.
- [ ] **Object Schema**: Each topic must follow this schema:
  - `id`: Unique kebab-case string.
  - `title`: Title Case string.
  - `description`: A helpful one-sentence summary.
  - `icon`: A valid [Lucide-React](https://lucide.dev/icons) icon name (e.g., "Zap", "Cpu").
  - `sections`: An array of section objects.

### 2. Section Requirements

Each section object must include:

- [ ] `id`: Unique kebab-case string.
- [ ] `title`: Clear and descriptive.
- [ ] `content`: A Markdown-formatted string with:
  - Bolded key terms.
  - Headings (`###`) for sub-concepts.
  - Lists for characteristics/rules.
  - At least one **Analogy** for complex topics.
- [ ] `code`: Either a string or an object with `js` and `ts` keys.
  - Comments must be used to explain the code.
  - Code must be idiomatic and follow modern standards (ES6+).
- [ ] `diagram` (Optional but highly recommended):
  - Use Mermaid syntax (e.g., `graph TD`, `graph LR`).
  - Must be visually helpful and not redundant.

### 3. Progressive Learning Check

Does the content cover all levels of the **Learning Pyramid**?

- [ ] **Beginner**: Simple definitions and high-level analogies.
- [ ] **Intermediate**: Practical usage, common patterns, and best practices.
- [ ] **Advanced**: Internals, performance, and deep-dive technical details.
- [ ] **Interview**: Common questions, "Why this?", trade-offs, and "Pro Tips".

### 4. Code Quality & Linting

- [ ] No syntax errors in JavaScript/TypeScript examples.
- [ ] Proper indentation (2 spaces) in code blocks.
- [ ] Consistent variable naming (camelCase).
- [ ] No `var` unless demonstrating hoisting or legacy code.

### 5. Content Style & "Gold Standards"

Inspired by `javascript.js`:

- [ ] **Callouts**: Use callouts for summaries: `> ✅ In short: [Summary]`.
- [ ] **Visual Models**: Use `### 🧠 Visual Mental Model` for non-code logic.
- [ ] **Cross-Language**: Include examples in other languages (e.g., Python) if helpful: `### 🧪 Example in Python`.
- [ ] **Code Headers**: Use descriptive headers inside code blocks: `// --- CATEGORY ---`.
- [ ] **Phase Breakdown**: When explaining execution, use a multi-step phase breakdown (Memory Phase vs Code Phase).
- [ ] **One-Liners**: Provide a "💡 One-Line Definition" at the end of major sections.
- [ ] **Tone**: Educational, engaging, and uses "Wait, if..." or "Wait, why..." to anticipate student questions.

---

## 🛠️ Verification Workflow

1.  **Analyze Structure**: Read the file and check the `topics` array structure.
2.  **Lint Code**: Extract all `code` blocks and perform a syntax check.
3.  **Check Diagrams**: Validate Mermaid syntax and relevance.
4.  **Review Pedagogy**: Ensure the "Analogy → Code → Internal → Interview" flow is followed.
5.  **Identify Gaps**: Flag any topics that skip levels or lack examples.

---

## 🚩 Common Red Flags to Catch

- ❌ Missing icons or using invalid icon names.
- ❌ Code blocks without comments.
- ❌ Markdown headings that skip levels (e.g., `#` then `###`).
- ❌ Generic definitions without an ivory-tower analogy.
- ❌ Missing TypeScript examples for React/TypeScript topics.

---

> **Note to Copilot**: When asked to "Validate" or "Review" content, use this checklist and provide a detailed report of passes/fails and improvement suggestions.
