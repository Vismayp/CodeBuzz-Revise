export const masterclassTopic = {
  id: "dsa-masterclass",
  title: "DSA Masterclass",
  description:
    "A guided beginner-to-advanced path with visual dry runs, pattern maps, examples, and practice labs.",
  icon: "BookOpen",
  sections: [
    {
      id: "beginner-to-advanced-map",
      title: "Beginner to Advanced Learning Map",
      type: "theory",
      content: `
## The DSA Journey, Step by Step

DSA becomes easier when you stop treating every problem as new. Most interview problems are combinations of a few ideas: state, movement, search space, and optimization.

### Level 0: Programming Comfort

Before patterns, make sure you can:

| Skill | What it means | Example |
|------|---------------|---------|
| Loops | Walk through input safely | Find max element |
| Conditions | Split behavior by cases | If current sum is negative, reset |
| Functions | Isolate logic | isValidMove(row, col) |
| Arrays/Objects | Store temporary state | Frequency map |
| Debug traces | Track variables by hand | left, right, sum |

### Level 1: Foundations

Start with arrays, strings, hashing, recursion, sorting, and complexity. These topics teach how data is stored, how loops behave, and why one solution is faster than another.

### Level 2: Core Interview Patterns

Learn two pointers, sliding window, prefix sums, stack, queue, linked list pointer manipulation, binary search, and BFS/DFS.

### Level 3: Intermediate Problem Solving

Combine patterns. Examples:

| Problem shape | Likely combination |
|--------------|--------------------|
| Sorted pair/triplet | Sort + two pointers |
| Longest substring | Hash map + sliding window |
| Tree levels | Queue + BFS |
| Matrix islands | DFS/BFS + visited marking |
| Top K elements | Hash map + heap |

### Level 4: Advanced

Move into dynamic programming, graph algorithms, tries, union-find, Fenwick trees, segment trees, bitmasking, monotonic stacks/queues, and advanced binary search.

### Level 5: Mastery

At mastery level you can:

1. Explain brute force clearly.
2. Identify wasted repeated work.
3. Choose the right data structure.
4. Prove why the optimized solution is correct.
5. Dry run edge cases without guessing.
6. Convert a pattern to clean code quickly.

### The Rule That Changes Everything

Do not memorize solutions. Memorize decisions.

Ask: What information do I need quickly? What changes as I scan? What can be discarded? What repeats? What is the smallest state that represents the answer?
      `,
      diagram: `
flowchart LR
    A["Programming basics"] --> B["Arrays, strings, hashing"]
    B --> C["Core patterns"]
    C --> D["Trees, heaps, graphs"]
    D --> E["DP and advanced structures"]
    E --> F["Mixed interview problems"]
    F --> G["Mock interviews and mastery"]
      `,
      code: `// A simple learning loop for every DSA topic
function studyTopic(topic) {
  readConcept(topic);
  traceOneExampleByHand(topic);
  implementTemplateFromMemory(topic);
  solveEasyProblem(topic);
  solveMediumProblem(topic);
  writeMistakesInNotebook(topic);
  reviewAfterDays(topic, [1, 7, 30]);
}`,
    },
    {
      id: "visual-dry-run-method",
      title: "How to Visualize and Dry Run Any Algorithm",
      type: "theory",
      content: `
## Dry Runs Turn Confusion Into State

A dry run is not just checking output. It is watching the algorithm's memory change over time.

### The 5 Columns of a Good Dry Run

| Column | Meaning |
|--------|---------|
| Step | Which iteration or recursive call you are in |
| Input focus | Current index, node, cell, or decision |
| State | Variables, stack, queue, map, or DP table |
| Action | What the algorithm does next |
| Reason | Why that action is valid |

### Example: Two Sum With Hash Map

Problem: nums = [2, 7, 11, 15], target = 9

| i | nums[i] | need | seen before? | action |
|---|---------|------|--------------|--------|
| 0 | 2 | 7 | no | store 2 -> 0 |
| 1 | 7 | 2 | yes | return [0, 1] |

### What to Visualize by Pattern

| Pattern | Visualize |
|---------|-----------|
| Two pointers | left/right movement and why one pointer moves |
| Sliding window | window start, window end, and current constraint |
| Stack | top of stack and what each item is waiting for |
| BFS | queue contents by level |
| DFS | recursion call stack and visited set |
| DP | meaning of each cell before filling the table |
| Heap | what must be kept at the top |
| Union-Find | parent array before and after compression |

### Debugging Checklist

1. Did the loop start at the right index?
2. Does the loop stop too early or too late?
3. Are you updating the answer before or after changing state?
4. Are duplicates handled intentionally?
5. Are empty and one-element inputs handled?
      `,
      diagram: `
flowchart TD
    A["Read example"] --> B["List changing variables"]
    B --> C["Create trace table"]
    C --> D["Run one step at a time"]
    D --> E{"State still matches invariant?"}
    E -- "yes" --> F["Continue"]
    E -- "no" --> G["Fix invariant or order of updates"]
    F --> H["Test edge cases"]
    G --> D
      `,
      code: `// A reusable trace helper while practicing in JavaScript
function trace(label, state) {
  console.table([{ step: label, ...state }]);
}

function twoSum(nums, target) {
  const seen = new Map();

  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    trace("before decision", {
      i,
      value: nums[i],
      need,
      seen: JSON.stringify(Object.fromEntries(seen)),
    });

    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }

  return [];
}`,
    },
    {
      id: "pattern-atlas",
      title: "Pattern Atlas and Decision Tree",
      type: "theory",
      content: `
## The Pattern Atlas

The fastest way to improve is to learn the trigger words that point toward a pattern.

### Pattern Decision Table

| If the problem asks for... | First pattern to try | Why |
|----------------------------|----------------------|-----|
| Pair in sorted array | Two pointers | Sorted order tells which pointer to move |
| Contiguous subarray | Sliding window or prefix sum | Subarray has a left and right boundary |
| Exact subarray sum with negatives | Prefix sum + hash map | Sliding window breaks with negatives |
| Longest substring with condition | Sliding window + frequency map | Expand until invalid, shrink until valid |
| Next greater/smaller | Monotonic stack | Stack keeps unresolved candidates |
| K largest/smallest | Heap | Keep only K useful items |
| Shortest path without weights | BFS | Each edge has equal cost |
| Shortest path with positive weights | Dijkstra | Greedily finalizes nearest node |
| Connected components | DFS/BFS or union-find | Group nodes by reachability |
| All combinations | Backtracking | Explore choices, undo choice |
| Count/min/max ways | Dynamic programming | Repeated subproblems |
| Search minimum valid answer | Binary search on answer | Validity is monotonic |

### The Three Big Questions

1. Is the data ordered?
2. Is the answer built from a contiguous region, a path, a subset, or a state transition?
3. Can I throw away old information safely?

### Common Pattern Upgrades

| Brute force | Upgrade |
|-------------|---------|
| Nested loops for pairs | Hash map or two pointers |
| Recomputing range sums | Prefix sum |
| Rechecking window contents | Sliding window state |
| Sorting every time | Heap |
| Recursion repeating states | Memoization |
| DFS for many connectivity queries | Union-find |
      `,
      diagram: `
flowchart TD
    A["Read problem"] --> B{"Sorted or monotonic?"}
    B -- "yes" --> C["Binary search or two pointers"]
    B -- "no" --> D{"Contiguous range?"}
    D -- "yes" --> E["Sliding window or prefix sum"]
    D -- "no" --> F{"Graph/tree/path?"}
    F -- "yes" --> G["BFS, DFS, Dijkstra, topological sort"]
    F -- "no" --> H{"Repeated choices/states?"}
    H -- "yes" --> I["Backtracking or DP"]
    H -- "no" --> J["Hash map, heap, stack, or sorting"]
      `,
      code: `function choosePattern(problem) {
  if (problem.sorted || problem.monotonic) {
    return "binary search / two pointers";
  }
  if (problem.contiguous && problem.hasNegativeNumbers) {
    return "prefix sum + hash map";
  }
  if (problem.contiguous) {
    return "sliding window";
  }
  if (problem.needsTopK) {
    return "heap";
  }
  if (problem.graphLike) {
    return problem.weighted ? "Dijkstra or Bellman-Ford" : "BFS or DFS";
  }
  if (problem.repeatedSubproblems) {
    return "dynamic programming";
  }
  return "hashing / sorting / stack";
}`,
    },
    {
      id: "complexity-from-first-principles",
      title: "Complexity From First Principles",
      type: "theory",
      content: `
## Big O Without Fear

Big O describes how work grows when input grows. It does not measure seconds. It measures shape.

### Growth Shapes

| Complexity | Mental picture | Common source |
|------------|----------------|---------------|
| O(1) | Same work always | Array access, stack push |
| O(log n) | Halve the search space | Binary search, heap height |
| O(n) | Visit every item once | Linear scan |
| O(n log n) | Split and process levels | Merge sort, many sort-based solutions |
| O(n^2) | Compare every pair | Nested loops |
| O(2^n) | Include/exclude choices | Subsets |
| O(n!) | Arrange all orders | Permutations |

### How to Derive Complexity

1. Count loops.
2. Count how much input each loop touches.
3. For recursion, count branches and depth.
4. For data structures, include operation cost.
5. Drop constants and smaller terms.

### Examples

| Code shape | Complexity | Why |
|------------|------------|-----|
| One loop over n | O(n) | Each element once |
| Two independent loops | O(n + m) | Different inputs |
| Nested n by n loops | O(n^2) | Every pair |
| while n halves | O(log n) | n -> n/2 -> n/4 |
| DFS graph | O(V + E) | Visit nodes and edges |

### Space Complexity

Do not forget memory:

| Extra storage | Space |
|---------------|-------|
| A few variables | O(1) |
| Hash map of counts | O(n) |
| Recursion depth h | O(h) |
| DP table n by m | O(nm) |
      `,
      diagram: `
flowchart LR
    A["O(1)"] --> B["O(log n)"]
    B --> C["O(n)"]
    C --> D["O(n log n)"]
    D --> E["O(n^2)"]
    E --> F["O(2^n)"]
    F --> G["O(n!)"]
      `,
      code: `// Complexity examples
function linear(nums) {
  // O(n)
  let total = 0;
  for (const num of nums) total += num;
  return total;
}

function quadratic(nums) {
  // O(n^2)
  let pairs = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      pairs++;
    }
  }
  return pairs;
}

function logarithmic(nums, target) {
  // O(log n)
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    },
    {
      id: "data-structures-visualized",
      title: "Core Data Structures Visualized",
      type: "theory",
      content: `
## Choose Data Structures by the Question They Answer

Every data structure is a tradeoff. It makes some operations easy and others expensive.

### Data Structure Mental Models

| Structure | Mental model | Best at | Watch out for |
|-----------|--------------|---------|---------------|
| Array | Numbered boxes | Random access | Middle insert/delete shifts |
| Hash map | Labeled drawers | Fast lookup by key | Extra memory, collisions |
| Stack | Last item on top | Undo, matching, DFS | Only top is accessible |
| Queue | First item leaves first | BFS, scheduling | Array shift can be slow in JS |
| Linked list | Chain of nodes | O(1) insert if node known | No random access |
| Heap | Best item at top | Priority access | Not fully sorted |
| Tree | Hierarchy | Recursive structure | Height controls speed |
| Graph | Relationships | Networks and paths | Need visited tracking |

### Invariants

An invariant is a rule that stays true during the algorithm.

| Structure | Common invariant |
|-----------|------------------|
| Min heap | parent <= children |
| BST | left < node < right |
| Monotonic stack | values stay increasing or decreasing |
| Sliding window | current window satisfies or almost satisfies condition |
| Union-find | parent pointers eventually lead to a root |

### Beginner Example: Stack for Valid Parentheses

The stack holds opening brackets that are waiting for a matching closer.

### Advanced Example: Monotonic Stack

The stack holds candidates that have not yet found a next greater element.
      `,
      diagram: `
flowchart TD
    A["Need fast key lookup?"] --> B["Hash map"]
    C["Need last-in-first-out?"] --> D["Stack"]
    E["Need first-in-first-out?"] --> F["Queue"]
    G["Need repeated min/max?"] --> H["Heap"]
    I["Need hierarchy?"] --> J["Tree"]
    K["Need many connections?"] --> L["Graph"]
      `,
      code: `// Monotonic stack: next greater element
function nextGreater(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = []; // indices whose next greater value is unknown

  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      const index = stack.pop();
      result[index] = nums[i];
    }
    stack.push(i);
  }

  return result;
}

// nextGreater([2, 1, 2, 4, 3]) -> [4, 2, 4, -1, -1]`,
    },
    {
      id: "from-brute-force-to-optimal",
      title: "From Brute Force to Optimal",
      type: "theory",
      content: `
## Optimization Is Usually Removing Repeated Work

A strong solution often starts with brute force. The trick is to locate the repeated work and cache, avoid, or restructure it.

### Optimization Playbook

| Problem | Brute force | Waste | Better idea |
|---------|-------------|-------|-------------|
| Two Sum | Check every pair | Repeated complement search | Hash map |
| Range Sum Query | Sum range each time | Same prefixes recomputed | Prefix sum |
| Max window sum | Sum each window | Overlapping windows | Sliding window |
| Fibonacci | Recurse twice | Same subproblems | Memoization/DP |
| Top K frequent | Sort all items | Need only K | Heap or bucket sort |
| Word search list | DFS per word | Same prefixes explored | Trie + DFS |

### Example: Maximum Sum Subarray of Size K

Brute force sums each window from scratch.

For nums = [2, 1, 5, 1, 3, 2], k = 3:

| Window | Sum |
|--------|-----|
| [2, 1, 5] | 8 |
| [1, 5, 1] | 7 |
| [5, 1, 3] | 9 |
| [1, 3, 2] | 6 |

Sliding window notices that adjacent windows share k - 1 elements.

New sum = old sum - leaving value + entering value.

### Interview Explanation Template

1. Brute force tries all possibilities.
2. The repeated work is ...
3. I can maintain this state instead ...
4. Each element enters and leaves at most once.
5. Therefore time improves from ... to ...
      `,
      diagram: `
flowchart LR
    A["Brute force"] --> B["Find repeated work"]
    B --> C["Store useful state"]
    C --> D["Update state incrementally"]
    D --> E["Prove each item is processed limited times"]
    E --> F["Optimal solution"]
      `,
      code: `function maxSumSubarrayBrute(nums, k) {
  let best = -Infinity;

  for (let start = 0; start <= nums.length - k; start++) {
    let sum = 0;
    for (let i = start; i < start + k; i++) {
      sum += nums[i];
    }
    best = Math.max(best, sum);
  }

  return best;
}

function maxSumSubarrayOptimal(nums, k) {
  let best = -Infinity;
  let windowSum = 0;

  for (let end = 0; end < nums.length; end++) {
    windowSum += nums[end];

    if (end >= k - 1) {
      best = Math.max(best, windowSum);
      windowSum -= nums[end - k + 1];
    }
  }

  return best;
}`,
    },
    {
      id: "advanced-patterns-explained",
      title: "Advanced Patterns Explained Simply",
      type: "theory",
      content: `
## Advanced Does Not Mean Magical

Advanced DSA is usually the same idea with stricter constraints.

### Dynamic Programming

Use DP when:

1. The same subproblem appears again.
2. The answer can be built from smaller answers.

DP question: What does dp[i] mean?

Bad: dp is the answer.
Good: dp[i] is the minimum coins needed to make amount i.

### Graph Algorithms

| Need | Algorithm |
|------|-----------|
| Visit all reachable nodes | DFS/BFS |
| Shortest path, unweighted | BFS |
| Shortest path, positive weights | Dijkstra |
| Negative edges | Bellman-Ford |
| Task ordering | Topological sort |
| Minimum spanning tree | Kruskal or Prim |

### Tries

Use tries when many strings share prefixes. They turn repeated prefix checks into one shared tree.

### Union-Find

Use union-find when edges arrive and you need to know whether two things are already connected.

### Segment Tree and Fenwick Tree

Use these when an array changes and you still need fast range queries.

| Structure | Best for | Complexity |
|-----------|----------|------------|
| Prefix sum | Static range sums | Query O(1), update O(n) |
| Fenwick tree | Dynamic prefix sums | Query/update O(log n) |
| Segment tree | Flexible range queries | Query/update O(log n) |
| Lazy segment tree | Range updates + range queries | O(log n) |
      `,
      diagram: `
flowchart TD
    A["Advanced problem"] --> B{"Repeated states?"}
    B -- "yes" --> C["Dynamic programming"]
    B -- "no" --> D{"Many connections?"}
    D -- "yes" --> E["Graph or union-find"]
    D -- "no" --> F{"Many prefix strings?"}
    F -- "yes" --> G["Trie"]
    F -- "no" --> H{"Changing range queries?"}
    H -- "yes" --> I["Fenwick or segment tree"]
    H -- "no" --> J["Heap, stack, binary search, or sorting"]
      `,
      code: `// DP example: coin change
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let current = 1; current <= amount; current++) {
    for (const coin of coins) {
      if (current >= coin) {
        dp[current] = Math.min(dp[current], 1 + dp[current - coin]);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

// Meaning:
// dp[x] = minimum coins needed to make amount x`,
    },
    {
      id: "practice-labs",
      title: "Practice Labs, Examples, and Challenges",
      type: "theory",
      content: `
## Practice Like a Builder

Each lab below moves from beginner to advanced. Do not skip the explanation step. After solving, write why your approach works.

### Lab 1: Arrays and Hashing

| Level | Problem | Goal |
|-------|---------|------|
| Beginner | Contains Duplicate | Learn hash set lookup |
| Beginner | Two Sum | Learn complements |
| Intermediate | Product Except Self | Learn prefix/suffix products |
| Advanced | Longest Consecutive Sequence | Learn O(n) set expansion |

### Lab 2: Windows and Pointers

| Level | Problem | Goal |
|-------|---------|------|
| Beginner | Valid Palindrome | Move inward safely |
| Intermediate | 3Sum | Sort + skip duplicates |
| Intermediate | Longest Substring Without Repeating | Variable window |
| Advanced | Minimum Window Substring | Count requirements |

### Lab 3: Stacks, Queues, and Heaps

| Level | Problem | Goal |
|-------|---------|------|
| Beginner | Valid Parentheses | Stack matching |
| Intermediate | Daily Temperatures | Monotonic stack |
| Intermediate | Kth Largest Element | Heap thinking |
| Advanced | Sliding Window Maximum | Monotonic deque |

### Lab 4: Trees and Graphs

| Level | Problem | Goal |
|-------|---------|------|
| Beginner | Maximum Depth | Recursive DFS |
| Intermediate | Level Order Traversal | BFS levels |
| Intermediate | Number of Islands | Grid DFS/BFS |
| Advanced | Course Schedule | Topological sort |

### Lab 5: Dynamic Programming

| Level | Problem | Goal |
|-------|---------|------|
| Beginner | Climbing Stairs | One-dimensional DP |
| Intermediate | House Robber | Choose/skip transition |
| Intermediate | Coin Change | Unbounded choices |
| Advanced | Longest Common Subsequence | Two-dimensional DP |

### Reflection Questions After Every Problem

1. What was the brute force solution?
2. What repeated work did I remove?
3. What invariant did I maintain?
4. What edge case could break this?
5. Can I explain the solution in under one minute?
      `,
      diagram: `
flowchart LR
    A["Solve"] --> B["Dry run"]
    B --> C["Explain"]
    C --> D["Find edge cases"]
    D --> E["Recode from memory"]
    E --> F["Review later"]
      `,
      code: `const practiceSchedule = [
  { day: 1, topic: "arrays + hashing", problems: 4 },
  { day: 2, topic: "two pointers + sliding window", problems: 4 },
  { day: 3, topic: "stack + queue", problems: 4 },
  { day: 4, topic: "binary search + linked lists", problems: 4 },
  { day: 5, topic: "trees", problems: 4 },
  { day: 6, topic: "graphs", problems: 4 },
  { day: 7, topic: "review mistakes + recode", problems: 0 },
];

function review(problem) {
  return {
    bruteForce: problem.bruteForce,
    optimizedPattern: problem.pattern,
    invariant: problem.invariant,
    edgeCases: problem.edgeCases,
    complexity: problem.complexity,
  };
}`,
    },
  ],
};
