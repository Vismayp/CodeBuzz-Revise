export const topics = [
  {
    id: "complexity-analysis",
    title: "Complexity Analysis",
    description: "Understanding Big O, Big Omega, and Big Theta notations.",
    icon: "Activity",
    sections: [
      {
        id: "big-o-notation",
        title: "Introduction to Big O",
        content: `
Big O notation is used to describe the efficiency of an algorithm in terms of time and space complexity as the input size $n$ grows.

### Why do we need it?
- To compare algorithms objectively.
- To predict performance at scale.
- To identify bottlenecks.

### Common Complexities:
1. **$O(1)$**: Constant Time (Accessing array by index)
2. **$O(\log n)$**: Logarithmic Time (Binary Search)
3. **$O(n)$**: Linear Time (Linear Search)
4. **$O(n \log n)$**: Linearithmic Time (Merge Sort, Quick Sort)
5. **$O(n^2)$**: Quadratic Time (Nested loops)
6. **$O(2^n)$**: Exponential Time (Recursive Fibonacci)
        `,
        diagram: `
graph LR
    A[Input Size n] --> B{Complexity}
    B --> C["O(1) - Fast"]
    B --> D["O(n) - Linear"]
    B --> E["O(n^2) - Slow"]
        `,
        code: `// O(1) Example
function getFirstElement(arr) {
    return arr[0];
}

// O(n) Example
function findMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}

// O(n^2) Example
function printPairs(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            console.log(arr[i], arr[j]);
        }
    }
}`,
      },
      {
        id: "dry-run-complexity",
        title: "Dry Run: Binary Search Complexity",
        content: `
Let's see why Binary Search is $O(\log n)$.

**Example**: Find target 7 in sorted array [1, 3, 5, 7, 9, 11, 13]

1. Initial range: [0, 6], Mid: 3, arr[3] = 7. Found! (1 step)
2. If we searched for 13:
   - Mid: 3 (arr[3]=7), 13 > 7, search right [4, 6]
   - Mid: 5 (arr[5]=11), 13 > 11, search right [6, 6]
   - Mid: 6 (arr[6]=13). Found! (3 steps)

For $n=7$, max steps $\approx 3$. $\log_2(8) = 3$.
Each step reduces the problem size by half: $n \to n/2 \to n/4 \dots \to 1$.
The number of steps $k$ is $n/2^k = 1 \implies n = 2^k \implies k = \log_2 n$.
        `,
      },
    ],
  },
  {
    id: "arrays",
    title: "Arrays",
    description: "Fundamental linear data structure and common patterns.",
    icon: "Layers",
    sections: [
      {
        id: "array-basics",
        title: "Array Fundamentals",
        content: `
Arrays store elements in contiguous memory locations.

### Operations:
- **Access**: $O(1)$
- **Search**: $O(n)$ (Linear), $O(\log n)$ (Binary - if sorted)
- **Insertion/Deletion**: $O(n)$ (shifting required)

### 5 Common Patterns:
1. **Two Pointers**: Used in sorted arrays (e.g., Pair Sum).
2. **Sliding Window**: Used for subarrays (e.g., Max Sum Subarray).
3. **Prefix Sum**: Used for range queries.
4. **Fast & Slow Pointers**: Usually for cycles (used in Linked Lists but applicable).
5. **Kadane's Algorithm**: For maximum subarray sum.
        `,
        code: `// 1. Two Pointers (Checking for sum)
function hasPairWithSum(arr, target) {
    let left = 0, right = arr.length - 1;
    while (left < right) {
        let sum = arr[left] + arr[right];
        if (sum === target) return true;
        if (sum < target) left++;
        else right--;
    }
    return false;
}

// 2. Sliding Window (Fixed size k)
function maxWindowSum(arr, k) {
    let maxSum = 0, windowSum = 0;
    for (let i = 0; i < k; i++) windowSum += arr[i];
    maxSum = windowSum;
    for (let i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i-k];
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}`,
      },
      {
        id: "kadanes-algorithm",
        title: "Problem: Maximum Subarray Sum (Kadane's)",
        content: `
Find the contiguous subarray with the largest sum.

**Dry Run**: [ -2, 1, -3, 4, -1, 2, 1, -5, 4 ]
- Curr: -2, Max: -2
- Curr: 1 (max of 1, -2+1), Max: 1
- Curr: -2 (max of -2, 1-2), Max: 1
- Curr: 4, Max: 4
- Curr: 3, Max: 4
- Curr: 5, Max: 5
- Curr: 6, Max: 6
- Result: 6 (Subarray: [4, -1, 2, 1])
        `,
        code: `function kadanes(arr) {
    let maxSum = -Infinity;
    let currSum = 0;
    for (let x of arr) {
        currSum = Math.max(x, currSum + x);
        maxSum = Math.max(maxSum, currSum);
    }
    return maxSum;
}`,
      },
    ],
  },
  {
    id: "strings",
    title: "Strings",
    description: "String manipulation, matching, and common problems.",
    icon: "Type",
    sections: [
      {
        id: "string-basics",
        title: "String Fundamentals",
        content: `
Strings are sequences of characters. In many languages (like Java/Python), strings are **immutable**.

### Key Concepts:
- **ASCII vs Unicode**: Standard encoding.
- **Substring vs Subsequence**: Substring is contiguous; subsequence is not necessarily.
- **Palindrome**: Reads the same forward and backward.
- **Anagram**: Same characters, different order.
        `,
        code: `// Reverse a string
function reverseString(s) {
    return s.split("").reverse().join("");
}

// Check Anagram
function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    let count = {};
    for (let char of s) count[char] = (count[char] || 0) + 1;
    for (let char of t) {
        if (!count[char]) return false;
        count[char]--;
    }
    return true;
}`,
      },
      {
        id: "palindrome-dry-run",
        title: "Dry Run: Valid Palindrome (Two Pointers)",
        content: `
**Problem**: Check if "racecar" is a palindrome.

1. L: 0 ('r'), R: 6 ('r') -> Match, L: 1, R: 5
2. L: 1 ('a'), R: 5 ('a') -> Match, L: 2, R: 4
3. L: 2 ('c'), R: 4 ('c') -> Match, L: 3, R: 3
4. L=R, Loop Ends. Return true.

**Complexity**: $O(n)$ time, $O(1)$ space.
        `,
      },
    ],
  },
  {
    id: "linked-lists",
    title: "Linked Lists",
    description: "Dynamic data structures with nodes and pointers.",
    icon: "Link",
    sections: [
      {
        id: "ll-implementation",
        title: "Singly Linked List",
        content: `
A linked list consists of nodes where each node contains data and a pointer to the next node.

### Pros/Cons:
- **Pros**: Dynamic size, fast insertion/deletion at head ($O(1)$).
- **Cons**: No random access ($O(n)$ search), extra memory for pointers.
        `,
        diagram: `
graph LR
    A["Data | Next"] --> B["Data | Next"] --> C["Data | Next"] --> D[NULL]
        `,
        code: `class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

function reverseLinkedList(head) {
    let prev = null, curr = head;
    while (curr) {
        let next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
      },
      {
        id: "floyds-cycle",
        title: "Fast & Slow Pointers (Floyd's Cycle)",
        content: `
Detect if a linked list has a cycle.

**Dry Run**: 1 -> 2 -> 3 -> 4 -> 2 (Cycle back to 2)
1. Slow: 1, Fast: 1
2. Slow: 2, Fast: 3
3. Slow: 3, Fast: 2 (loops back)
4. Slow: 4, Fast: 4 -> Slow == Fast! Cycle detected.
        `,
        code: `function hasCycle(head) {
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) return true;
    }
    return false;
}`,
      },
    ],
  },
  {
    id: "stacks-queues",
    title: "Stacks & Queues",
    description: "LIFO and FIFO data structures.",
    icon: "MousePointer2",
    sections: [
      {
        id: "stack-section",
        title: "Stacks (LIFO)",
        content: `
Last-In-First-Out. Imagine a stack of plates.

### Key Operations:
- **Push**: Add to top ($O(1)$).
- **Pop**: Remove from top ($O(1)$).
- **Peek**: See top element ($O(1)$).

### Use Cases:
- Undo/Redo operations.
- Expression parsing (Balancing parentheses).
- Depth First Search (DFS).
        `,
        code: `// Valid Parentheses Problem
function isValid(s) {
    let stack = [];
    let map = { ')': '(', '}': '{', ']': '[' };
    for (let char of s) {
        if (char in map) {
            if (stack.pop() !== map[char]) return false;
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0;
}`,
      },
      {
        id: "queue-section",
        title: "Queues (FIFO)",
        content: `
First-In-First-Out. Imagine a line at a ticket counter.

### Key Operations:
- **Enqueue**: Add to rear ($O(1)$).
- **Dequeue**: Remove from front ($O(1)$).

### Variations:
- **Deque**: Double-ended queue.
- **Priority Queue**: Elements have priorities.
        `,
        code: `// Queue using two stacks
class Queue {
    constructor() {
        this.stack1 = [];
        this.stack2 = [];
    }
    enqueue(val) {
        this.stack1.push(val);
    }
    dequeue() {
        if (this.stack2.length === 0) {
            while (this.stack1.length > 0) {
                this.stack2.push(this.stack1.pop());
            }
        }
        return this.stack2.pop();
    }
}`,
      },
    ],
  },
  {
    id: "hashing",
    title: "Hashing",
    description: "Hash tables, collision handling, and frequency maps.",
    icon: "Hash",
    sections: [
      {
        id: "hash-table-basics",
        title: "Hash Table Fundamentals",
        content: `
A hash table maps keys to values using a hash function.

### Key Concepts:
- **Hash Function**: Computes an index from a key.
- **Collision**: When two keys hash to the same index.
- **Load Factor**: Ratio of stored elements to table size.

### Collision Handling:
1. **Chaining**: Each bucket contains a linked list.
2. **Open Addressing**: Find another slot (Linear Probing, Quadratic Probing).
        `,
        code: `// Frequency count using Hash Map (Object/Map in JS)
function countFrequency(arr) {
    let map = new Map();
    for (let x of arr) {
        map.set(x, (map.get(x) || 0) + 1);
    }
    return map;
}

// Two Sum problem using Hashing
function twoSum(nums, target) {
    let map = new Map();
    for (let i = 0; i < nums.length; i++) {
        let diff = target - nums[i];
        if (map.has(diff)) return [map.get(diff), i];
        map.set(nums[i], i);
    }
    return [];
}`,
      },
    ],
  },
  {
    id: "recursion-backtracking",
    title: "Recursion & Backtracking",
    description: "Solving problems by breaking them into smaller sub-problems.",
    icon: "RotateCw",
    sections: [
      {
        id: "recursion-basics",
        title: "Recursion Primer",
        content: `
Recursion is when a function calls itself.

### Two essential parts:
1. **Base Case**: The condition to stop recursion.
2. **Recursive Step**: The call to itself with a reduced problem.

**Stack Overflow**: Occurs when recursion goes too deep without hitting a base case.
        `,
        code: `function factorial(n) {
    if (n <= 1) return 1; // Base case
    return n * factorial(n - 1); // Recursive step
}

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
      },
      {
        id: "backtracking-intro",
        title: "Backtracking",
        content: `
Backtracking is exploring all possible paths and 'backtracking' (going back) when a path doesn't lead to a solution.

**Dry Run**: N-Queens (4x4)
1. Place Q at (0,0).
2. Place next Q at (1,2) - safe.
3. Place next Q at (2,?) - no safe spot!
4. BACKTRACK: Move Q at (1,2) to (1,3).
5. Repeat...
        `,
        code: `// Simple Backtracking: Generating all subsets
function subsets(nums) {
    let res = [];
    function backtrack(start, curr) {
        res.push([...curr]);
        for (let i = start; i < nums.length; i++) {
            curr.push(nums[i]);
            backtrack(i + 1, curr);
            curr.pop(); // The 'backtrack' step
        }
    }
    backtrack(0, []);
    return res;
}`,
      },
    ],
  },
  {
    id: "sorting-searching",
    title: "Sorting & Searching",
    description: "Classic algorithms for organizing and finding data.",
    icon: "Search",
    sections: [
      {
        id: "sorting-algos",
        title: "Comparison Sorting",
        content: `
| Algorithm | Best | Average | Worst | Space |
|-----------|------|---------|-------|-------|
| Bubble    | O(n) | O(n^2)  | O(n^2)| O(1)  |
| Merge     | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick     | O(n log n) | O(n log n) | O(n^2) | O(log n) |
| Heap      | O(n log n) | O(n log n) | O(n log n) | O(1) |
        `,
        code: `// Quick Sort Implementation
function quickSort(arr) {
    if (arr.length <= 1) return arr;
    let pivot = arr[Math.floor(arr.length / 2)];
    let left = arr.filter(x => x < pivot);
    let right = arr.filter(x => x > pivot);
    let middle = arr.filter(x => x === pivot);
    return [...quickSort(left), ...middle, ...quickSort(right)];
}`,
      },
      {
        id: "binary-search-variants",
        title: "Binary Search Variants",
        content: `
Binary search isn't just for finding an element. It's for searching in a **sorted range** where a monotonic property exists.

### Variants:
1. Finding First/Last occurrence.
2. Finding Upper/Lower bound.
3. Binary search on Answer (e.g., Aggressive Cows, Book Allocation).
        `,
        code: `// Binary Search (Standard)
function binarySearch(arr, target) {
    let low = 0, high = arr.length - 1;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      },
    ],
  },
  {
    id: "trees",
    title: "Trees",
    description: "Hierarchical data structures with nodes and edges.",
    icon: "GitBranch",
    sections: [
      {
        id: "binary-tree-basics",
        title: "Binary Tree Fundamentals",
        content: `
A tree where each node has at most two children.

### Traversal Methods:
1. **DFS (In-order)**: Left -> Root -> Right (Sorted for BST).
2. **DFS (Pre-order)**: Root -> Left -> Right (Copying tree).
3. **DFS (Post-order)**: Left -> Right -> Root (Deleting tree).
4. **BFS (Level-order)**: Level by level using a Queue.
        `,
        diagram: `
graph TD
    A((1)) --> B((2))
    A --> C((3))
    B --> D((4))
    B --> E((5))
        `,
        code: `class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = this.right = null;
    }
}

// In-order Traversal
function inorder(root) {
    if (!root) return;
    inorder(root.left);
    console.log(root.val);
    inorder(root.right);
}

// Level-order Traversal (BFS)
function levelOrder(root) {
    if (!root) return [];
    let queue = [root], res = [];
    while (queue.length) {
        let node = queue.shift();
        res.push(node.val);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
    }
    return res;
}`,
      },
      {
        id: "bst-ops",
        title: "Binary Search Tree (BST)",
        content: `
A Binary Tree where:
- Left child < Parent
- Right child > Parent

**Operations**:
- **Search**: $O(h)$ where $h$ is height.
- **Insert**: $O(h)$.
- **Delete**: $O(h)$.

In a balanced BST, $h = \log n$. In skewed, $h = n$.
        `,
      },
    ],
  },
  {
    id: "heaps",
    title: "Heaps",
    description:
      "Specialized tree-based data structure for priority management.",
    icon: "Box",
    sections: [
      {
        id: "heap-basics",
        title: "Heap Fundamentals",
        content: `
A Heap is a complete binary tree.
- **Max-Heap**: Parent $\ge$ Children.
- **Min-Heap**: Parent $\le$ Children.

Usually implemented using an **Array**:
- Left child: $2i + 1$
- Right child: $2i + 2$
- Parent: $\lfloor (i-1)/2 \rfloor$
        `,
        code: `// Max Heap simple structure
class MaxHeap {
    constructor() {
        this.heap = [];
    }
    insert(val) {
        this.heap.push(val);
        this.bubbleUp();
    }
    bubbleUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex] >= this.heap[index]) break;
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }
}`,
      },
    ],
  },
  {
    id: "graphs",
    title: "Graphs",
    description:
      "Nodes connected by edges, representing complex relationships.",
    icon: "Share2",
    sections: [
      {
        id: "graph-representation",
        title: "Graph Representation",
        content: `
1. **Adjacency Matrix**: $O(V^2)$ space. Good for dense graphs.
2. **Adjacency List**: $O(V+E)$ space. Good for sparse graphs.

### Core Algorithms:
- **BFS**: Shortest path in unweighted graph.
- **DFS**: Path finding, topological sort.
- **Dijkstra**: Shortest path in weighted graph (no negative edges).
- **Bellman-Ford**: Handles negative weights.
        `,
        code: `// BFS implementation
function bfs(startNode, adjList) {
    let queue = [startNode];
    let visited = new Set([startNode]);
    while (queue.length) {
        let node = queue.shift();
        console.log(node);
        for (let neighbor of adjList[node]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
}`,
      },
      {
        id: "dijkstra-dry-run",
        title: "Dry Run: Dijkstra's Algorithm",
        content: `
**Graph**: A --1--> B, A --4--> C, B --2--> C
1. Start at A: Dist[A]=0, others=$\infty$. PriorityQueue = {(0, A)}
2. Pop A: Neighbors B(0+1=1), C(0+4=4). Dist[B]=1, Dist[C]=4. PQ = {(1, B), (4, C)}
3. Pop B: Neighbor C(1+2=3). Dist[C] becomes 3 (since 3 < 4). PQ = {(3, C)}
4. Pop C: Done.
Result: A->B: 1, A->C: 3.
        `,
      },
    ],
  },
  {
    id: "dynamic-programming",
    title: "Dynamic Programming",
    description: "Optimization through subproblems and memoization.",
    icon: "Zap",
    sections: [
      {
        id: "dp-intro",
        title: "Introduction to DP",
        content: `
DP = Recursion + Memoization (Top-Down) OR Tabulation (Bottom-Up).

### When to use?
1. **Overlapping Subproblems**: Same subproblems solved again and again.
2. **Optimal Substructure**: Optimal solution of the problem can be obtained by using optimal solutions of its subproblems.

### 5 Classical DP Types:
1. **0/1 Knapsack**: Pick or don't pick.
2. **LCS (Longest Common Subsequence)**: Comparing strings.
3. **LIS (Longest Increasing Subsequence)**: Sequence patterns.
4. **MCM (Matrix Chain Multiplication)**: Partition DP.
5. **DP on Trees/Graphs**: Advanced patterns.
        `,
        code: `// Fibonacci: Tabulation (O(n) time, O(1) space)
function fib(n) {
    if (n <= 1) return n;
    let prev2 = 0, prev = 1;
    for (let i = 2; i <= n; i++) {
        let curr = prev + prev2;
        prev2 = prev;
        prev = curr;
    }
    return prev;
}

// 0/1 Knapsack (Simplified)
function knapsack(wt, val, W, n) {
    let dp = Array(W + 1).fill(0);
    for (let i = 0; i < n; i++) {
        for (let j = W; j >= wt[i]; j--) {
            dp[j] = Math.max(dp[j], val[i] + dp[j - wt[i]]);
        }
    }
    return dp[W];
}`,
      },
    ],
  },
  {
    id: "greedy-algorithms",
    title: "Greedy Algorithms",
    description: "Making the locally optimal choice at each step.",
    icon: "Target",
    sections: [
      {
        id: "greedy-basics",
        title: "Greedy Strategy",
        content: `
A greedy algorithm builds up a solution piece by piece, always choosing the next piece that offers the most obvious and immediate benefit.

### Applications:
- Fractional Knapsack
- Huffman Coding
- Prim's & Kruskal's for MST
- Interval Scheduling
        `,
        code: `// Interval Scheduling (Meeting Rooms I)
function maxMeetings(start, end) {
    let meetings = start.map((s, i) => ({ s, e: end[i] }));
    meetings.sort((a, b) => a.e - b.e); // Sort by finish time
    
    let count = 1;
    let lastEnd = meetings[0].e;
    for (let i = 1; i < meetings.length; i++) {
        if (meetings[i].s > lastEnd) {
            count++;
            lastEnd = meetings[i].e;
        }
    }
    return count;
}`,
      },
    ],
  },
  {
    id: "tries-dsu",
    title: "Advanced: Trie & DSU",
    description: "Specialized structures for strings and disjoint sets.",
    icon: "Network",
    sections: [
      {
        id: "trie-section",
        title: "Trie (Prefix Tree)",
        content: `
Efficient for word retrieval, auto-complete, and spell check.
Each node contains a map of characters to children nodes.
        `,
        code: `class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() { this.root = new TrieNode(); }
    insert(word) {
        let curr = this.root;
        for (let char of word) {
            if (!curr.children[char]) curr.children[char] = new TrieNode();
            curr = curr.children[char];
        }
        curr.isEndOfWord = true;
    }
}`,
      },
      {
        id: "dsu-section",
        title: "Disjoint Set Union (DSU)",
        content: `
Used for finding connected components and cycle detection in undirected graphs.
Optimizations: **Path Compression** and **Union by Rank**.
        `,
        code: `class DSU {
    constructor(n) {
        this.parent = Array.from({length: n}, (_, i) => i);
    }
    find(i) {
        if (this.parent[i] === i) return i;
        return this.parent[i] = this.find(this.parent[i]); // Path compression
    }
    union(i, j) {
        let rootI = this.find(i);
        let rootJ = this.find(j);
        if (rootI !== rootJ) this.parent[rootI] = rootJ;
    }
}`,
      },
    ],
  },
  {
    id: "bit-manipulation",
    title: "Bit Manipulation",
    description: "Direct manipulation of bits for performance and logic.",
    icon: "Terminal",
    sections: [
      {
        id: "bit-tricks",
        title: "Essential Bit Tricks",
        content: `
1. **Check if power of 2**: \`n & (n - 1) == 0\`
2. **Count set bits**: Brian Kernighan's Algorithm.
3. **Find unique number** (where others appear twice): XOR all elements (\`a ^ a = 0\`).
4. **Get i-th bit**: \`(n >> i) & 1\`
5. **Set i-th bit**: \`n | (1 << i)\`
        `,
        code: `function countSetBits(n) {
    let count = 0;
    while (n > 0) {
        n = n & (n - 1);
        count++;
    }
    return count;
}

// Find one non-repeating element
function findSingle(arr) {
    let res = 0;
    for (let x of arr) res ^= x;
    return res;
}`,
      },
    ],
  },
];
