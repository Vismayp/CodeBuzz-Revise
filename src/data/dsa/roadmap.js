// ═══════════════════════════════════════════════════════════════
// DSA ROADMAP & PATTERN RECOGNITION
// The Bridge from Beginner → Interview Ready
// ═══════════════════════════════════════════════════════════════

export const roadmapTopic = {
  id: "dsa-roadmap",
  title: "DSA Roadmap & Patterns",
  description:
    "Where to start, how to identify patterns, and a complete study plan to crack coding interviews.",
  icon: "Map",
  sections: [
    {
      id: "getting-started",
      title: "Getting Started — Your DSA Journey 🚀",
      type: "theory",
      content: `
## 🗺️ The Complete DSA Study Plan

Starting DSA can feel overwhelming. This guide gives you a clear path from **zero to interview-ready**.

<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 24px; margin: 20px 0;">
  <h3 style="color: #4ade80; margin: 0 0 20px 0; text-align: center;">📊 The 4-Phase Study Plan</h3>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
    <div style="background: #0f3460; padding: 16px; border-radius: 12px; border-left: 4px solid #22c55e;">
      <h4 style="color: #22c55e; margin: 0 0 8px 0;">Phase 1: Foundations</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">Week 1-2</p>
      <ul style="color: #a78bfa; margin: 8px 0 0 0; font-size: 12px; padding-left: 16px;">
        <li>Big O Notation</li>
        <li>Arrays & Strings basics</li>
        <li>Hash Maps</li>
        <li>Basic Sorting</li>
      </ul>
    </div>

    <div style="background: #0f3460; padding: 16px; border-radius: 12px; border-left: 4px solid #60a5fa;">
      <h4 style="color: #60a5fa; margin: 0 0 8px 0;">Phase 2: Core Patterns</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">Week 3-5</p>
      <ul style="color: #a78bfa; margin: 8px 0 0 0; font-size: 12px; padding-left: 16px;">
        <li>Two Pointers</li>
        <li>Sliding Window</li>
        <li>Stack & Queue</li>
        <li>Linked Lists</li>
        <li>Recursion basics</li>
      </ul>
    </div>

    <div style="background: #0f3460; padding: 16px; border-radius: 12px; border-left: 4px solid #fbbf24;">
      <h4 style="color: #fbbf24; margin: 0 0 8px 0;">Phase 3: Advanced</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">Week 6-9</p>
      <ul style="color: #a78bfa; margin: 8px 0 0 0; font-size: 12px; padding-left: 16px;">
        <li>Trees & BST</li>
        <li>Heaps / Priority Queues</li>
        <li>Graphs (BFS/DFS)</li>
        <li>Backtracking</li>
        <li>Dynamic Programming</li>
      </ul>
    </div>

    <div style="background: #0f3460; padding: 16px; border-radius: 12px; border-left: 4px solid #f87171;">
      <h4 style="color: #f87171; margin: 0 0 8px 0;">Phase 4: Mastery</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">Week 10-12</p>
      <ul style="color: #a78bfa; margin: 8px 0 0 0; font-size: 12px; padding-left: 16px;">
        <li>Tries</li>
        <li>Union-Find</li>
        <li>Segment Trees</li>
        <li>Mock interviews</li>
        <li>Company-specific prep</li>
      </ul>
    </div>
  </div>
</div>

### 🎯 The Golden Rules

1. **Understand, don't memorize** — Know WHY a solution works
2. **Code it yourself** — Reading ≠ Understanding. Type it out.
3. **Dry run every solution** — Trace through examples by hand
4. **Time yourself** — Aim for 20 min (Easy), 30 min (Medium), 45 min (Hard)
5. **Review after 1 day, 1 week, 1 month** — Spaced repetition beats cramming

### 📈 How Many Problems to Solve?

| Level | Count | Focus |
|-------|-------|-------|
| **Minimum Viable** | 75-100 | Blind 75 list |
| **Comfortable** | 150-200 | NeetCode 150 |
| **Competitive** | 300+ | Company-tagged problems |

> ✅ **Quality over quantity.** Solving 100 problems deeply beats solving 300 on autopilot.
      `,
    },
    {
      id: "pattern-recognition",
      title: "Pattern Recognition — The Secret Weapon 🧠",
      type: "theory",
      content: `
## 🔍 How to Identify Which Pattern to Use

The #1 skill in interview DSA isn't coding — it's **pattern recognition**. Here's your cheat sheet.

### Pattern Decision Flowchart

<div style="background: #1e293b; padding: 20px; border-radius: 12px; margin: 20px 0;">
  <h4 style="color: #60a5fa; margin: 0 0 15px 0;">🧩 Read the Problem → Ask These Questions:</h4>
  <div style="display: flex; flex-direction: column; gap: 10px;">
    <div style="display: flex; align-items: start; gap: 10px;">
      <span style="background: #22c55e; color: black; padding: 4px 10px; border-radius: 8px; font-weight: bold; min-width: 180px; text-align: center; font-size: 12px;">Sorted array/list?</span>
      <span style="color: #94a3b8; font-size: 13px;">→ <strong style="color: #fbbf24;">Binary Search</strong> or <strong style="color: #fbbf24;">Two Pointers</strong></span>
    </div>
    <div style="display: flex; align-items: start; gap: 10px;">
      <span style="background: #60a5fa; color: black; padding: 4px 10px; border-radius: 8px; font-weight: bold; min-width: 180px; text-align: center; font-size: 12px;">Subarray/Substring?</span>
      <span style="color: #94a3b8; font-size: 13px;">→ <strong style="color: #fbbf24;">Sliding Window</strong> or <strong style="color: #fbbf24;">Prefix Sum</strong></span>
    </div>
    <div style="display: flex; align-items: start; gap: 10px;">
      <span style="background: #fbbf24; color: black; padding: 4px 10px; border-radius: 8px; font-weight: bold; min-width: 180px; text-align: center; font-size: 12px;">Finding pairs/triplets?</span>
      <span style="color: #94a3b8; font-size: 13px;">→ <strong style="color: #fbbf24;">Two Pointers</strong> or <strong style="color: #fbbf24;">Hash Map</strong></span>
    </div>
    <div style="display: flex; align-items: start; gap: 10px;">
      <span style="background: #f87171; color: black; padding: 4px 10px; border-radius: 8px; font-weight: bold; min-width: 180px; text-align: center; font-size: 12px;">Tree/Graph traversal?</span>
      <span style="color: #94a3b8; font-size: 13px;">→ <strong style="color: #fbbf24;">BFS</strong> (shortest path) or <strong style="color: #fbbf24;">DFS</strong> (explore all paths)</span>
    </div>
    <div style="display: flex; align-items: start; gap: 10px;">
      <span style="background: #a78bfa; color: black; padding: 4px 10px; border-radius: 8px; font-weight: bold; min-width: 180px; text-align: center; font-size: 12px;">All combinations?</span>
      <span style="color: #94a3b8; font-size: 13px;">→ <strong style="color: #fbbf24;">Backtracking</strong> (generate) or <strong style="color: #fbbf24;">DP</strong> (count/optimize)</span>
    </div>
    <div style="display: flex; align-items: start; gap: 10px;">
      <span style="background: #fb923c; color: black; padding: 4px 10px; border-radius: 8px; font-weight: bold; min-width: 180px; text-align: center; font-size: 12px;">Min/Max optimization?</span>
      <span style="color: #94a3b8; font-size: 13px;">→ <strong style="color: #fbbf24;">Dynamic Programming</strong> or <strong style="color: #fbbf24;">Greedy</strong></span>
    </div>
    <div style="display: flex; align-items: start; gap: 10px;">
      <span style="background: #22d3ee; color: black; padding: 4px 10px; border-radius: 8px; font-weight: bold; min-width: 180px; text-align: center; font-size: 12px;">Top K / Kth largest?</span>
      <span style="color: #94a3b8; font-size: 13px;">→ <strong style="color: #fbbf24;">Heap</strong> (Priority Queue)</span>
    </div>
    <div style="display: flex; align-items: start; gap: 10px;">
      <span style="background: #e879f9; color: black; padding: 4px 10px; border-radius: 8px; font-weight: bold; min-width: 180px; text-align: center; font-size: 12px;">Connected components?</span>
      <span style="color: #94a3b8; font-size: 13px;">→ <strong style="color: #fbbf24;">Union-Find</strong> or <strong style="color: #fbbf24;">DFS</strong></span>
    </div>
  </div>
</div>

### Keyword → Pattern Mapping

| If the problem says... | Think about... |
|------------------------|---------------|
| "Contiguous subarray" | Sliding Window / Prefix Sum |
| "Sorted array" | Binary Search / Two Pointers |
| "Pairs that sum to X" | Hash Map / Two Pointers |
| "Minimum/Maximum path" | DP / BFS |
| "Number of ways" | DP / Backtracking |
| "Shortest path" (unweighted) | BFS |
| "Shortest path" (weighted) | Dijkstra / Bellman-Ford |
| "All permutations/combinations" | Backtracking |
| "K closest / K largest" | Heap |
| "Detect cycle" | Fast/Slow Pointers |
| "Parentheses matching" | Stack |
| "Merge intervals" | Sort + Greedy |
| "Topological order" | Topological Sort (Kahn's/DFS) |
| "Common prefix" | Trie |
      `,
    },
    {
      id: "interview-problem-solving",
      title: "The 5-Step Problem Solving Framework",
      type: "theory",
      content: `
## 🏆 How to Solve ANY Coding Problem in an Interview

### Step 1: Understand (2-3 min)
\`\`\`
✅ Repeat the problem in your own words
✅ Clarify edge cases: empty input? negative numbers? duplicates?
✅ Ask about constraints: sorted? size limits?
✅ Walk through 1-2 examples

❌ Don't start coding immediately!
\`\`\`

### Step 2: Plan (3-5 min)
\`\`\`
✅ Identify the pattern (use the cheat sheet above!)
✅ Think of brute force first — then optimize
✅ State your approach out loud
✅ Discuss time/space complexity BEFORE coding

❌ Don't jump to the optimal solution
    (starting with brute force shows structured thinking)
\`\`\`

### Step 3: Code (10-15 min)
\`\`\`
✅ Write clean, readable code
✅ Use meaningful variable names (left/right, not i/j/k)
✅ Handle edge cases first (null, empty, single element)
✅ Comment key decisions

❌ Don't go silent! Talk through your code.
\`\`\`

### Step 4: Test (3-5 min)
\`\`\`
✅ Dry run with your original example
✅ Test edge cases: empty array, single element, all same
✅ Test boundary cases: very large, very small
✅ Fix bugs calmly (don't panic!)

❌ Don't just say "it works" — prove it with a trace
\`\`\`

### Step 5: Optimize (2-3 min)
\`\`\`
✅ Can you reduce time complexity?
✅ Can you reduce space usage?
✅ Mention possible improvements even if time is short

❌ Don't refactor working code unless asked
\`\`\`

### 🚨 Common Interview Mistakes to Avoid

<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 24px; margin: 20px 0;">
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
    <div style="background: #0f3460; padding: 16px; border-radius: 12px; border-left: 4px solid #f87171;">
      <h4 style="color: #f87171; margin: 0 0 8px 0;">❌ Mistake: Diving into code</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">Coding before understanding the problem.</p>
      <p style="color: #4ade80; margin: 8px 0 0 0; font-size: 12px;">✅ Fix: Spend 5 min clarifying and planning</p>
    </div>
    <div style="background: #0f3460; padding: 16px; border-radius: 12px; border-left: 4px solid #f87171;">
      <h4 style="color: #f87171; margin: 0 0 8px 0;">❌ Mistake: Going silent</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">Thinking quietly without communicating.</p>
      <p style="color: #4ade80; margin: 8px 0 0 0; font-size: 12px;">✅ Fix: Narrate your thought process out loud</p>
    </div>
    <div style="background: #0f3460; padding: 16px; border-radius: 12px; border-left: 4px solid #f87171;">
      <h4 style="color: #f87171; margin: 0 0 8px 0;">❌ Mistake: Off-by-one errors</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">Wrong loop bounds, missing edge cases.</p>
      <p style="color: #4ade80; margin: 8px 0 0 0; font-size: 12px;">✅ Fix: Dry run with small input (n=1, n=2)</p>
    </div>
    <div style="background: #0f3460; padding: 16px; border-radius: 12px; border-left: 4px solid #f87171;">
      <h4 style="color: #f87171; margin: 0 0 8px 0;">❌ Mistake: Ignoring edge cases</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">Not handling null, empty, or single-element inputs.</p>
      <p style="color: #4ade80; margin: 8px 0 0 0; font-size: 12px;">✅ Fix: Always check for empty/null first</p>
    </div>
  </div>
</div>
      `,
    },
    {
      id: "complexity-cheat-sheet",
      title: "Data Structure Operations Cheat Sheet",
      type: "theory",
      content: `
## ⚡ Time Complexity Cheat Sheet

### Data Structure Operations

| Data Structure | Access | Search | Insert | Delete | Space |
|----------------|--------|--------|--------|--------|-------|
| **Array** | O(1) | O(n) | O(n) | O(n) | O(n) |
| **Sorted Array** | O(1) | O(log n) | O(n) | O(n) | O(n) |
| **Linked List** | O(n) | O(n) | O(1)* | O(1)* | O(n) |
| **Stack** | O(n) | O(n) | O(1) | O(1) | O(n) |
| **Queue** | O(n) | O(n) | O(1) | O(1) | O(n) |
| **Hash Map** | — | O(1)† | O(1)† | O(1)† | O(n) |
| **BST (balanced)** | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| **BST (worst)** | O(n) | O(n) | O(n) | O(n) | O(n) |
| **Heap** | — | O(n) | O(log n) | O(log n) | O(n) |
| **Trie** | — | O(k)‡ | O(k)‡ | O(k)‡ | O(n×k) |

*If you have a pointer to the node. †Average case. ‡k = key length.

### Sorting Algorithms

| Algorithm | Best | Average | Worst | Space | Stable? |
|-----------|------|---------|-------|-------|---------|
| **Bubble Sort** | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| **Selection Sort** | O(n²) | O(n²) | O(n²) | O(1) | ❌ |
| **Insertion Sort** | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| **Merge Sort** | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ |
| **Quick Sort** | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ |
| **Heap Sort** | O(n log n) | O(n log n) | O(n log n) | O(1) | ❌ |
| **Counting Sort** | O(n+k) | O(n+k) | O(n+k) | O(k) | ✅ |
| **Radix Sort** | O(nk) | O(nk) | O(nk) | O(n+k) | ✅ |

### Graph Algorithm Complexities

| Algorithm | Time | Space | Use Case |
|-----------|------|-------|----------|
| **BFS** | O(V+E) | O(V) | Shortest path (unweighted) |
| **DFS** | O(V+E) | O(V) | Connectivity, cycle detection |
| **Dijkstra** | O((V+E)log V) | O(V) | Shortest path (weighted) |
| **Bellman-Ford** | O(VE) | O(V) | Negative weights |
| **Floyd-Warshall** | O(V³) | O(V²) | All pairs shortest path |
| **Topological Sort** | O(V+E) | O(V) | DAG ordering |
| **Kruskal's** | O(E log E) | O(V) | MST |
| **Prim's** | O((V+E)log V) | O(V) | MST (dense graphs) |

### 🎯 Quick Decision Guide

\`\`\`
Need O(1) lookup?         → Hash Map
Need sorted + fast search → BST or Binary Search on sorted array
Need min/max quickly?     → Heap
Need FIFO?                → Queue
Need LIFO?                → Stack
Need prefix matching?     → Trie
Need connected components → Union-Find
\`\`\`
      `,
    },
    {
      id: "blind-75-guide",
      title: "The Blind 75 — Curated Problem List",
      type: "theory",
      content: `
## 📋 The Blind 75 — Organized by Pattern

These 75 problems cover the most important patterns you'll see in interviews. Solve them in this order.

### 🔢 Arrays & Hashing (9 problems)
| # | Problem | Difficulty | Key Pattern |
|---|---------|-----------|-------------|
| 1 | Two Sum | Easy | Hash Map |
| 2 | Best Time to Buy and Sell Stock | Easy | Kadane's / Tracking Min |
| 3 | Contains Duplicate | Easy | Hash Set |
| 4 | Product of Array Except Self | Medium | Prefix/Suffix |
| 5 | Maximum Subarray | Medium | Kadane's Algorithm |
| 6 | Maximum Product Subarray | Medium | Track min & max |
| 7 | Find Minimum in Rotated Sorted Array | Medium | Binary Search |
| 8 | Search in Rotated Sorted Array | Medium | Modified Binary Search |
| 9 | 3Sum | Medium | Sort + Two Pointers |

### ✏️ Strings (4 problems)
| # | Problem | Difficulty | Key Pattern |
|---|---------|-----------|-------------|
| 10 | Valid Anagram | Easy | Hash Map Counting |
| 11 | Valid Parentheses | Easy | Stack |
| 12 | Longest Substring Without Repeating | Medium | Sliding Window |
| 13 | Longest Palindromic Substring | Medium | Expand from Center |

### 🔗 Linked Lists (6 problems)
| # | Problem | Difficulty | Key Pattern |
|---|---------|-----------|-------------|
| 14 | Reverse Linked List | Easy | Three Pointers |
| 15 | Merge Two Sorted Lists | Easy | Dummy Node |
| 16 | Linked List Cycle | Easy | Fast/Slow Pointers |
| 17 | Remove Nth Node From End | Medium | Two Pointers (gap) |
| 18 | Reorder List | Medium | Find Mid + Reverse + Merge |
| 19 | Merge K Sorted Lists | Hard | Heap / Divide & Conquer |

### 🌳 Trees (11 problems)
| # | Problem | Difficulty | Key Pattern |
|---|---------|-----------|-------------|
| 20 | Invert Binary Tree | Easy | DFS/BFS |
| 21 | Maximum Depth | Easy | DFS Recursion |
| 22 | Same Tree | Easy | DFS Comparison |
| 23 | Subtree of Another Tree | Easy | Recursive Match |
| 24 | BST Lowest Common Ancestor | Medium | BST Property |
| 25 | Level Order Traversal | Medium | BFS Queue |
| 26 | Validate BST | Medium | DFS + Range |
| 27 | Kth Smallest in BST | Medium | Inorder Traversal |
| 28 | Build Tree from Preorder + Inorder | Medium | Recursion |
| 29 | Binary Tree Maximum Path Sum | Hard | DFS + Global Max |
| 30 | Serialize and Deserialize Binary Tree | Hard | BFS/DFS |

### 📊 Dynamic Programming (11 problems)
| # | Problem | Difficulty | Key Pattern |
|---|---------|-----------|-------------|
| 31 | Climbing Stairs | Easy | 1D DP (Fibonacci) |
| 32 | House Robber | Medium | 1D DP |
| 33 | House Robber II | Medium | Circular 1D DP |
| 34 | Longest Increasing Subsequence | Medium | 1D DP / Binary Search |
| 35 | Coin Change | Medium | Unbounded Knapsack |
| 36 | Unique Paths | Medium | 2D DP Grid |
| 37 | Jump Game | Medium | Greedy / DP |
| 38 | Decode Ways | Medium | 1D DP |
| 39 | Word Break | Medium | 1D DP + Hash Set |
| 40 | Combination Sum IV | Medium | 1D DP |
| 41 | Longest Common Subsequence | Medium | 2D DP |

### 📈 Graphs (8 problems)
| # | Problem | Difficulty | Key Pattern |
|---|---------|-----------|-------------|
| 42 | Number of Islands | Medium | BFS/DFS Grid |
| 43 | Clone Graph | Medium | BFS/DFS + Hash Map |
| 44 | Course Schedule | Medium | Topological Sort |
| 45 | Pacific Atlantic Water Flow | Medium | Multi-source BFS/DFS |
| 46 | Graph Valid Tree | Medium | Union-Find / DFS |
| 47 | Number of Connected Components | Medium | Union-Find / DFS |
| 48 | Longest Consecutive Sequence | Medium | Hash Set |
| 49 | Alien Dictionary | Hard | Topological Sort |

### Good luck! 🍀 Remember: understand the pattern, not just the solution.
      `,
    },
  ],
};
