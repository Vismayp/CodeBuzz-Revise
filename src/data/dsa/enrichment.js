const roadmapEnhancements = [
  {
    id: "roadmap-visual-practice-system",
    title: "Visual Practice System: From Notes to Mastery",
    type: "theory",
    content: `
## How to Use This DSA Course Like a Complete System

The best way to learn DSA is to turn every topic into a repeatable loop: learn the idea, trace the state, code the template, solve variations, then review mistakes.

### The Daily Loop

| Step | Time | What to do | Output |
|------|------|------------|--------|
| Concept | 10 min | Read one section slowly | One-sentence summary |
| Visual trace | 10 min | Draw pointers, stack, queue, tree, or table | A dry-run table |
| Template | 15 min | Code the core pattern from memory | Working snippet |
| Practice | 30-45 min | Solve 1-2 problems | Accepted solution |
| Review | 10 min | Record bug, insight, edge case | Mistake log |

### Beginner to Advanced Milestones

| Milestone | You can do this when... |
|-----------|--------------------------|
| Beginner | You can explain arrays, maps, stacks, queues, recursion, and Big O |
| Early intermediate | You recognize two pointers, sliding window, prefix sum, and BFS/DFS |
| Interview ready | You can solve medium problems with clean edge-case handling |
| Advanced | You can combine patterns and justify correctness |
| Expert | You can derive DP states, graph reductions, and range data structures |

### What to Write After Every Problem

1. Brute force idea.
2. Bottleneck.
3. Optimized pattern.
4. Invariant.
5. Complexity.
6. Edge cases.
7. One similar problem.
    `,
    diagram: `
flowchart LR
    A["Read concept"] --> B["Draw state"]
    B --> C["Code template"]
    C --> D["Solve examples"]
    D --> E["Write mistake log"]
    E --> F["Recode later"]
    F --> C
    `,
    code: `const mistakeLogEntry = {
  topic: "sliding window",
  problem: "Longest Substring Without Repeating Characters",
  bug: "Moved right pointer before removing old character",
  invariant: "window contains no duplicate characters",
  edgeCase: "empty string",
  reviewAgainInDays: [1, 7, 30],
};`,
  },
];

const complexityEnhancements = [
  {
    id: "complexity-visual-lab",
    title: "Complexity Visual Lab: Count Work, Not Lines",
    type: "theory",
    content: `
## Complexity Visual Lab

When analyzing complexity, count how many times the expensive operation runs. Ignore syntax noise.

### Common Loop Shapes

| Code shape | Total work | Complexity |
|------------|------------|------------|
| for i from 0 to n | n | O(n) |
| nested n by n loops | n * n | O(n^2) |
| j doubles each time | log2(n) | O(log n) |
| sort + one scan | n log n + n | O(n log n) |
| DFS over graph | vertices + edges | O(V + E) |

### Recursive Shape Recognition

| Recurrence | Meaning | Complexity |
|------------|---------|------------|
| T(n) = T(n - 1) + O(1) | one smaller call | O(n) |
| T(n) = T(n / 2) + O(1) | halve input | O(log n) |
| T(n) = 2T(n / 2) + O(n) | split and merge | O(n log n) |
| T(n) = 2T(n - 1) + O(1) | binary choice tree | O(2^n) |

### Interview Shortcut

If the input is up to:

| n | Usually acceptable |
|---|--------------------|
| 20 | O(2^n), bitmask/backtracking |
| 100 | O(n^3) sometimes |
| 1,000 | O(n^2) |
| 100,000 | O(n log n) or O(n) |
| 1,000,000+ | O(n) or O(log n) |
    `,
    diagram: `
flowchart TD
    A["Algorithm"] --> B["Find repeated operation"]
    B --> C{"Loop, recursion, or data structure?"}
    C --> D["Loop count"]
    C --> E["Recursion tree"]
    C --> F["Operation cost"]
    D --> G["Drop constants"]
    E --> G
    F --> G
    G --> H["Big O"]
    `,
    code: `// Count the inner operation, not the number of lines.
function countPairs(nums) {
  let operations = 0;

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      operations++; // This runs n * (n - 1) / 2 times.
    }
  }

  return operations; // O(n^2)
}`,
  },
];

const arraysEnhancements = [
  {
    id: "arrays-visual-pattern-lab",
    title: "Arrays Visual Lab: More Examples and Pattern Switching",
    type: "theory",
    content: `
## Arrays Visual Lab

Array problems usually become easy when you choose what to remember while scanning.

### Pattern Switching Examples

| Problem | Brute force | Better state |
|---------|-------------|--------------|
| Two Sum | Try all pairs | Map value -> index |
| Max sum size k | Re-sum every window | Running window sum |
| Range sum queries | Sum each range | Prefix sums |
| Move zeros | Build new array | Slow pointer for write position |
| Sort colors | Sort | Three-region partition |
| Longest consecutive | Sort then scan | Hash set starts only |

### Visual Invariant: Move Zeros

For nums = [0, 1, 0, 3, 12], keep write at the next place where a non-zero belongs.

| read | value | write before | action | array idea |
|------|-------|--------------|--------|------------|
| 0 | 0 | 0 | skip | no non-zero found |
| 1 | 1 | 0 | swap/write | [1, ...] |
| 2 | 0 | 1 | skip | [1, ...] |
| 3 | 3 | 1 | swap/write | [1, 3, ...] |
| 4 | 12 | 2 | swap/write | [1, 3, 12, 0, 0] |

### Advanced Array Moves

1. Use prefix/suffix when each answer depends on left side and right side.
2. Use monotonic stack when each item waits for a future greater/smaller item.
3. Use binary search when the answer itself is ordered, not just the array.
    `,
    diagram: `
flowchart LR
    A["Array problem"] --> B{"Contiguous?"}
    B -- "yes" --> C["Sliding window or prefix sum"]
    B -- "no" --> D{"Need quick lookup?"}
    D -- "yes" --> E["Hash map or set"]
    D -- "no" --> F{"In-place rewrite?"}
    F -- "yes" --> G["Two pointers"]
    F -- "no" --> H["Sort, stack, heap, or binary search"]
    `,
    code: `function moveZeroes(nums) {
  let write = 0;

  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      [nums[write], nums[read]] = [nums[read], nums[write]];
      write++;
    }
  }

  return nums;
}

function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;

  for (const num of set) {
    if (set.has(num - 1)) continue; // not the start

    let length = 1;
    while (set.has(num + length)) length++;
    best = Math.max(best, length);
  }

  return best;
}`,
  },
];

const stringsEnhancements = [
  {
    id: "strings-visual-pattern-lab",
    title: "Strings Visual Lab: Windows, Counts, and Matching",
    type: "theory",
    content: `
## Strings Visual Lab

String problems are array problems with character rules. The main extra difficulty is deciding whether order, frequency, or prefix structure matters.

### Choose the String Technique

| Need | Technique |
|------|-----------|
| Same characters, any order | Frequency map |
| Contiguous substring with constraint | Sliding window |
| Palindrome | Two pointers or expand around center |
| Repeated prefix lookup | Trie |
| Find pattern in text | KMP, Z-algorithm, or rolling hash |
| Edit/transform | DP |

### Example: Valid Anagram

For s = "listen", t = "silent":

1. Count every character in s.
2. Subtract every character in t.
3. All counts must return to zero.

### Advanced Example: Minimum Window

The window is useful only when it covers all required counts. Expand until valid, then shrink until just before invalid.

| State | Meaning |
|-------|---------|
| need | required counts from target |
| window | current counts in substring |
| have | how many required characters are satisfied |
| required | how many unique required characters exist |
    `,
    diagram: `
flowchart TD
    A["String problem"] --> B{"Need exact counts?"}
    B -- "yes" --> C["Frequency map"]
    B -- "no" --> D{"Substring?"}
    D -- "yes" --> E["Sliding window"]
    D -- "no" --> F{"Palindrome?"}
    F -- "yes" --> G["Two pointers / center expansion"]
    F -- "no" --> H{"Pattern search?"}
    H -- "yes" --> I["KMP / Z / rolling hash"]
    H -- "no" --> J["Trie or DP"]
    `,
    code: `function characterReplacement(s, k) {
  const count = new Map();
  let left = 0;
  let maxFreq = 0;
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    count.set(s[right], (count.get(s[right]) || 0) + 1);
    maxFreq = Math.max(maxFreq, count.get(s[right]));

    while (right - left + 1 - maxFreq > k) {
      count.set(s[left], count.get(s[left]) - 1);
      left++;
    }

    best = Math.max(best, right - left + 1);
  }

  return best;
}`,
  },
];

const linkedListEnhancements = [
  {
    id: "linked-list-pointer-lab",
    title: "Linked List Pointer Lab: Draw Before You Code",
    type: "theory",
    content: `
## Linked List Pointer Lab

Linked list bugs happen when you lose the rest of the list. Always name the temporary pointer before changing links.

### Pointer Rules

| Operation | Pointers to track |
|-----------|-------------------|
| Reverse list | prev, curr, next |
| Remove nth from end | dummy, fast, slow |
| Detect cycle | slow, fast |
| Merge lists | dummy, tail |
| Reorder list | mid, secondHalf, firstHalf |

### Reverse Visual Trace

List: 1 -> 2 -> 3 -> null

| Step | prev | curr | next | action |
|------|------|------|------|--------|
| start | null | 1 | 2 | save 2 |
| 1 | null <- 1 | 2 | 3 | curr.next = prev |
| 2 | 1 <- 2 | 3 | null | advance |
| 3 | 2 <- 3 | null | null | done |

### Advanced Pointer Insight

A dummy node reduces special cases because deleting the head becomes the same as deleting any other node.
    `,
    diagram: `
flowchart LR
    A["Before: 1 -> 2 -> 3 -> null"] --> B["Save next"]
    B --> C["Reverse curr.next"]
    C --> D["Move prev"]
    D --> E["Move curr"]
    E --> F["After: null <- 1 <- 2 <- 3"]
    `,
    code: `function removeNthFromEnd(head, n) {
  const dummy = { val: 0, next: head };
  let fast = dummy;
  let slow = dummy;

  for (let i = 0; i <= n; i++) {
    fast = fast.next;
  }

  while (fast) {
    fast = fast.next;
    slow = slow.next;
  }

  slow.next = slow.next.next;
  return dummy.next;
}`,
  },
];

const stacksEnhancements = [
  {
    id: "stack-queue-visual-lab",
    title: "Stack and Queue Visual Lab: Waiting Items",
    type: "theory",
    content: `
## Stack and Queue Visual Lab

Stacks and queues are about waiting order.

| Structure | Waiting rule | Best examples |
|-----------|--------------|---------------|
| Stack | newest item resolves first | parentheses, DFS, undo, monotonic stack |
| Queue | oldest item resolves first | BFS, task scheduling |
| Deque | both ends matter | sliding window maximum |
| Priority queue | highest priority resolves first | top K, shortest path |

### Monotonic Stack Intuition

For Daily Temperatures, each index waits for a warmer future day. When a warmer day appears, it resolves colder days on top of the stack.

| Day | Temp | Stack before | Action |
|-----|------|--------------|--------|
| 0 | 73 | [] | push 0 |
| 1 | 74 | [0] | resolve 0, push 1 |
| 2 | 75 | [1] | resolve 1, push 2 |
| 3 | 71 | [2] | push 3 |

### Queue Tip in JavaScript

Avoid repeated array.shift() on large queues. Use a head index.
    `,
    diagram: `
flowchart LR
    A["New item"] --> B{"Resolves top/back?"}
    B -- "yes" --> C["Pop waiting items"]
    C --> B
    B -- "no" --> D["Push current item"]
    D --> E["Stack remains monotonic"]
    `,
    code: `function dailyTemperatures(temperatures) {
  const answer = new Array(temperatures.length).fill(0);
  const stack = []; // indices waiting for warmer temperature

  for (let i = 0; i < temperatures.length; i++) {
    while (
      stack.length &&
      temperatures[i] > temperatures[stack[stack.length - 1]]
    ) {
      const prev = stack.pop();
      answer[prev] = i - prev;
    }
    stack.push(i);
  }

  return answer;
}`,
  },
];

const recursionEnhancements = [
  {
    id: "recursion-tree-visual-lab",
    title: "Recursion Visual Lab: Call Trees and Choice Trees",
    type: "theory",
    content: `
## Recursion Visual Lab

Recursive solutions need two maps:

1. The call tree: what function calls happen?
2. The state tree: what choices have been made so far?

### Recursion Checklist

| Question | Example |
|----------|---------|
| What is the smallest solved input? | n === 0 |
| How does input shrink? | index + 1, node.left, amount - coin |
| What state is carried? | path, current sum, used set |
| What must be undone? | pop from path, unmark visited |

### Backtracking Template

The shape is always choose, explore, unchoose.

### Advanced Pruning

Pruning means proving a branch cannot improve the answer before exploring it.

| Problem | Prune when |
|---------|------------|
| Combination Sum | current sum > target |
| N-Queens | same column or diagonal occupied |
| Word Search | board char not in trie branch |
| Sudoku | number violates row, column, or box |
    `,
    diagram: `
flowchart TD
    A["State"] --> B["Choose option"]
    B --> C["Explore smaller problem"]
    C --> D{"Base case?"}
    D -- "yes" --> E["Record answer"]
    D -- "no" --> B
    E --> F["Undo choice"]
    F --> G["Try next option"]
    `,
    code: `function combinationSum(candidates, target) {
  const result = [];

  function backtrack(start, remain, path) {
    if (remain === 0) {
      result.push([...path]);
      return;
    }
    if (remain < 0) return;

    for (let i = start; i < candidates.length; i++) {
      path.push(candidates[i]);
      backtrack(i, remain - candidates[i], path);
      path.pop();
    }
  }

  backtrack(0, target, []);
  return result;
}`,
  },
];

const treesEnhancements = [
  {
    id: "trees-recursion-visual-lab",
    title: "Trees Visual Lab: Local Return vs Global Answer",
    type: "theory",
    content: `
## Trees Visual Lab

Most tree problems ask every node the same question. The power is deciding what each node returns to its parent.

### Common Return Meanings

| Problem | Return from node |
|---------|------------------|
| Max depth | height of subtree |
| Balanced tree | height, or -1 if invalid |
| Diameter | longest downward path |
| Max path sum | best path starting at this node |
| Validate BST | min/max allowed range or subtree bounds |
| LCA | found target node or ancestor |

### Local vs Global

Some answers cannot be returned directly because the best answer may pass through the node and stop there. Keep a global answer for these:

1. Diameter of binary tree.
2. Binary tree maximum path sum.
3. Largest BST subtree.

### Traversal Decision

| Need | Traversal |
|------|-----------|
| Parent before children | Preorder |
| Sorted BST values | Inorder |
| Children before parent | Postorder |
| Level by level | BFS |
    `,
    diagram: `
flowchart TD
    A["Node"] --> B["Ask left child"]
    A --> C["Ask right child"]
    B --> D["Combine answers"]
    C --> D
    D --> E["Update global if needed"]
    D --> F["Return local value to parent"]
    `,
    code: `function diameterOfBinaryTree(root) {
  let best = 0;

  function height(node) {
    if (!node) return 0;

    const left = height(node.left);
    const right = height(node.right);

    best = Math.max(best, left + right);
    return 1 + Math.max(left, right);
  }

  height(root);
  return best;
}`,
  },
];

const heapsEnhancements = [
  {
    id: "heap-visual-priority-lab",
    title: "Heap Visual Lab: Keep Only What Matters",
    type: "theory",
    content: `
## Heap Visual Lab

A heap is useful when you do not need a fully sorted list. You only need repeated access to the best item.

### Heap Decision Guide

| Problem | Heap strategy |
|---------|---------------|
| Kth largest | Min heap of size k |
| Top K frequent | Min heap by frequency |
| Merge K sorted lists | Min heap of current list heads |
| Median stream | Max heap left side + min heap right side |
| Dijkstra | Min heap by distance |
| Task scheduler | Max heap by remaining frequency |

### Why Size K Works

For Kth largest, keep the best k candidates seen so far. If the heap grows beyond k, remove the smallest candidate. The smallest remaining item is the kth largest.

### Heap vs Sort

| Need | Use |
|------|-----|
| Entire ordered result | Sort |
| Only top K | Heap |
| Frequent repeated min/max with updates | Heap |
| Need delete arbitrary item | Balanced tree or indexed heap |
    `,
    diagram: `
flowchart LR
    A["New candidate"] --> B["Push into heap"]
    B --> C{"Heap too large?"}
    C -- "yes" --> D["Pop least useful"]
    C -- "no" --> E["Continue"]
    D --> E
    E --> F["Heap stores only useful candidates"]
    `,
    code: `// Simple min heap for numeric values.
class MinHeap {
  constructor() {
    this.data = [];
  }

  peek() {
    return this.data[0];
  }

  push(value) {
    this.data.push(value);
    this.bubbleUp(this.data.length - 1);
  }

  pop() {
    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length) {
      this.data[0] = last;
      this.bubbleDown(0);
    }
    return top;
  }

  bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.data[parent] <= this.data[i]) break;
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }

  bubbleDown(i) {
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < this.data.length && this.data[left] < this.data[smallest]) {
        smallest = left;
      }
      if (right < this.data.length && this.data[right] < this.data[smallest]) {
        smallest = right;
      }
      if (smallest === i) break;

      [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
      i = smallest;
    }
  }
}`,
  },
];

const graphsEnhancements = [
  {
    id: "graphs-visual-algorithm-lab",
    title: "Graphs Visual Lab: Pick the Traversal by Edge Meaning",
    type: "theory",
    content: `
## Graphs Visual Lab

Graph problems are about relationships. The first question is what an edge means.

### Algorithm Selection

| Edge meaning | Algorithm |
|--------------|-----------|
| Can move from A to B with same cost | BFS for shortest path |
| Need to explore all reachable nodes | DFS or BFS |
| Has positive weights | Dijkstra |
| Has negative weights | Bellman-Ford |
| Must finish prerequisites first | Topological sort |
| Need groups as edges are added | Union-find |
| Need cheapest connection network | MST |

### Visited State Matters

| Problem type | Visited representation |
|--------------|------------------------|
| Node graph | Set of nodes |
| Grid graph | Mutate grid or boolean matrix |
| Weighted shortest path | distance map |
| Topological sort DFS | unvisited, visiting, visited |

### Advanced Interview Tip

If a problem says "minimum steps" and every move costs one, BFS is usually the first serious candidate.
    `,
    diagram: `
flowchart TD
    A["Graph problem"] --> B{"Unweighted shortest path?"}
    B -- "yes" --> C["BFS"]
    B -- "no" --> D{"Weighted positive edges?"}
    D -- "yes" --> E["Dijkstra"]
    D -- "no" --> F{"Prerequisites / ordering?"}
    F -- "yes" --> G["Topological sort"]
    F -- "no" --> H{"Connected components?"}
    H -- "yes" --> I["DFS/BFS or union-find"]
    H -- "no" --> J["DFS, MST, Bellman-Ford, or Floyd-Warshall"]
    `,
    code: `function shortestPathUnweighted(adj, start, target) {
  const queue = [start];
  const distance = new Map([[start, 0]]);
  let head = 0;

  while (head < queue.length) {
    const node = queue[head++];
    if (node === target) return distance.get(node);

    for (const next of adj[node] || []) {
      if (distance.has(next)) continue;
      distance.set(next, distance.get(node) + 1);
      queue.push(next);
    }
  }

  return -1;
}`,
  },
];

const dpEnhancements = [
  {
    id: "dp-state-design-lab",
    title: "DP State Design Lab: From Recursion to Table",
    type: "theory",
    content: `
## DP State Design Lab

Dynamic programming is not a code trick. It is naming a reusable question.

### The DP Design Formula

| Step | Question |
|------|----------|
| State | What does dp[i] or dp[i][j] mean? |
| Transition | How do smaller states build this state? |
| Base case | What answer is known without work? |
| Order | Which states must be computed first? |
| Answer | Which state stores the final result? |

### State Examples

| Problem | State |
|---------|-------|
| Climbing Stairs | dp[i] = ways to reach step i |
| Coin Change | dp[a] = min coins for amount a |
| LCS | dp[i][j] = LCS length of first i and first j chars |
| House Robber | dp[i] = max money through house i |
| Word Break | dp[i] = whether prefix length i can be segmented |

### Beginner to Advanced Upgrade

1. Start with recursive choices.
2. Add memoization.
3. Convert to bottom-up.
4. Compress space if only previous rows/states are needed.
    `,
    diagram: `
flowchart LR
    A["Recursive brute force"] --> B["Find repeated calls"]
    B --> C["Name state"]
    C --> D["Memoize"]
    D --> E["Tabulate"]
    E --> F["Optimize space"]
    `,
    code: `function longestCommonSubsequence(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[a.length][b.length];
}`,
  },
];

const greedyEnhancements = [
  {
    id: "greedy-proof-visual-lab",
    title: "Greedy Visual Lab: Choice, Proof, Counterexample",
    type: "theory",
    content: `
## Greedy Visual Lab

Greedy is not "take what looks best" unless you can prove that local choice does not block the global optimum.

### Greedy Proof Toolkit

| Proof style | Meaning |
|-------------|---------|
| Exchange argument | Swap an optimal solution to include your greedy choice |
| Stays ahead | Greedy is always at least as good after each step |
| Cut property | The cheapest safe edge across a cut belongs in an MST |
| Counterexample search | Try to break the rule with a small input |

### Sorting Keys That Often Work

| Problem family | Sort by |
|----------------|---------|
| Activity selection | Earliest end time |
| Minimum arrows | Balloon end coordinate |
| Meeting rooms | Start time, then min heap of end times |
| Fractional knapsack | Value per weight |
| Largest number | Custom concatenation order |

### When Greedy Fails

If a choice affects many future choices and there is no safe exchange argument, try DP.

Example: 0/1 knapsack cannot be solved by value/weight ratio. Fractional knapsack can.
    `,
    diagram: `
flowchart TD
    A["Greedy idea"] --> B["Find local choice"]
    B --> C{"Can prove safe?"}
    C -- "yes" --> D["Implement sorted/heap strategy"]
    C -- "no" --> E["Look for counterexample"]
    E --> F{"Counterexample exists?"}
    F -- "yes" --> G["Use DP/search"]
    F -- "no" --> H["Build proof"]
    H --> D
    `,
    code: `function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);

  let removed = 0;
  let lastEnd = -Infinity;

  for (const [start, end] of intervals) {
    if (start >= lastEnd) {
      lastEnd = end; // keep interval with earliest possible ending
    } else {
      removed++;
    }
  }

  return removed;
}`,
  },
];

const advancedEnhancements = [
  {
    id: "advanced-structures-selection-lab",
    title: "Advanced Structures Selection Lab",
    type: "theory",
    content: `
## Advanced Structures Selection Lab

Advanced data structures are usually chosen because the simple version is too slow after updates or repeated queries.

### Selection Table

| Need | Use |
|------|-----|
| Static range sums | Prefix sum |
| Dynamic prefix/range sums | Fenwick tree |
| Range min/max/sum with point updates | Segment tree |
| Range updates plus range queries | Lazy segment tree |
| Prefix word lookup | Trie |
| Connectivity under edge additions | Union-find |
| Subset states up to about 20 items | Bitmask DP |
| Fast bit-level counting | Bit manipulation |

### Constraint Triggers

| Constraint phrase | Think |
|-------------------|-------|
| "many queries" | preprocessing or tree structure |
| "updates and queries" | Fenwick/segment tree |
| "connected after operations" | union-find |
| "starts with prefix" | trie |
| "subset of items" | bitmask |

### Expert Tip

Always compare the advanced structure to the simpler baseline. Interviewers want to hear why prefix sums are not enough when updates are present.
    `,
    diagram: `
flowchart TD
    A["Advanced query problem"] --> B{"Array changes?"}
    B -- "no" --> C["Prefix sum / sparse table"]
    B -- "yes" --> D{"Range update?"}
    D -- "yes" --> E["Lazy segment tree"]
    D -- "no" --> F{"Prefix sums enough?"}
    F -- "yes" --> G["Fenwick tree"]
    F -- "no" --> H["Segment tree"]
    A --> I{"Connectivity?"}
    I -- "yes" --> J["Union-find"]
    A --> K{"Prefix strings?"}
    K -- "yes" --> L["Trie"]
    `,
    code: `// Fenwick tree: compact structure for prefix sums with updates.
class FenwickTree {
  constructor(n) {
    this.tree = new Array(n + 1).fill(0);
  }

  add(index, delta) {
    for (let i = index + 1; i < this.tree.length; i += i & -i) {
      this.tree[i] += delta;
    }
  }

  prefixSum(index) {
    let sum = 0;
    for (let i = index + 1; i > 0; i -= i & -i) {
      sum += this.tree[i];
    }
    return sum;
  }

  rangeSum(left, right) {
    return this.prefixSum(right) - (left > 0 ? this.prefixSum(left - 1) : 0);
  }
}`,
  },
];

export const dsaTopicEnhancements = {
  "dsa-roadmap": roadmapEnhancements,
  "complexity-analysis": complexityEnhancements,
  "arrays-hashing": arraysEnhancements,
  strings: stringsEnhancements,
  "linked-lists": linkedListEnhancements,
  "stacks-queues": stacksEnhancements,
  "recursion-backtracking": recursionEnhancements,
  trees: treesEnhancements,
  heaps: heapsEnhancements,
  graphs: graphsEnhancements,
  "dynamic-programming": dpEnhancements,
  greedy: greedyEnhancements,
  advanced: advancedEnhancements,
};

export function enrichDsaTopic(topic) {
  const sections = dsaTopicEnhancements[topic.id];
  if (!sections) return topic;

  return {
    ...topic,
    sections: [...topic.sections, ...sections],
  };
}
