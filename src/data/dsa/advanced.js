export const advancedTopic = {
  id: "advanced",
  title: "Advanced Data Structures",
  description:
    "Trie, Segment Tree, Binary Indexed Tree, Bit Manipulation, and Union-Find",
  icon: "Cpu",
  sections: [
    // ============== TRIE ==============
    {
      id: "trie-fundamentals",
      title: "Trie (Prefix Tree) Fundamentals",
      type: "theory",
      content: `
## Trie: Prefix Tree

A Trie is a tree-like data structure for storing strings where each node represents a character.

### Key Properties
- Root is empty
- Each path from root to a marked node represents a word
- Words with common prefixes share the same path

### Time Complexity
| Operation | Time |
|-----------|------|
| Insert | O(m) where m = word length |
| Search | O(m) |
| StartsWith | O(m) |
| Delete | O(m) |

### Space: O(ALPHABET_SIZE × m × n) where n = number of words

### Use Cases
1. Autocomplete / Search suggestions
2. Spell checkers
3. IP routing (longest prefix match)
4. Word games (Boggle, Scrabble)
      `,
      code: `class TrieNode {
    constructor() {
        this.children = {}; // or new Array(26).fill(null)
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    
    insert(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }
    
    search(word) {
        const node = this.traverse(word);
        return node !== null && node.isEndOfWord;
    }
    
    startsWith(prefix) {
        return this.traverse(prefix) !== null;
    }
    
    traverse(str) {
        let node = this.root;
        for (const char of str) {
            if (!node.children[char]) {
                return null;
            }
            node = node.children[char];
        }
        return node;
    }
    
    // Get all words with given prefix
    getWordsWithPrefix(prefix) {
        const results = [];
        const node = this.traverse(prefix);
        if (node) {
            this.collectWords(node, prefix, results);
        }
        return results;
    }
    
    collectWords(node, prefix, results) {
        if (node.isEndOfWord) {
            results.push(prefix);
        }
        for (const char in node.children) {
            this.collectWords(node.children[char], prefix + char, results);
        }
    }
}

// Trie Visualization for words: ["app", "apple", "api", "bee"]
//
//        root
//       /    \\
//      a      b
//      |      |
//      p      e
//     / \\     |
//    p*  i*   e*
//    |
//    l
//    |
//    e*
//
// * marks end of word`,
    },
    {
      id: "segment-tree",
      title: "Segment Tree",
      type: "theory",
      content: `
## Segment Tree

A Segment Tree is a binary tree for answering range queries efficiently.

### Use Cases
1. **Range Sum Query** - Sum of elements in [l, r]
2. **Range Min/Max Query** - Min/Max in [l, r]
3. **Range Update** - Update all elements in [l, r]

### Complexity
| Operation | Time |
|-----------|------|
| Build | O(n) |
| Query | O(log n) |
| Update | O(log n) |
| Space | O(n) |

### Tree Structure
- Node i stores result for a range
- Left child: 2*i + 1
- Right child: 2*i + 2
- Parent: (i-1) / 2
      `,
      code: `// Segment Tree for Range Sum Query with Point Updates
class SegmentTree {
    constructor(arr) {
        this.n = arr.length;
        // Tree size is 4*n to be safe
        this.tree = new Array(4 * this.n).fill(0);
        this.build(arr, 0, 0, this.n - 1);
    }
    
    build(arr, node, start, end) {
        if (start === end) {
            this.tree[node] = arr[start];
            return;
        }
        
        const mid = Math.floor((start + end) / 2);
        const leftChild = 2 * node + 1;
        const rightChild = 2 * node + 2;
        
        this.build(arr, leftChild, start, mid);
        this.build(arr, rightChild, mid + 1, end);
        
        this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
    }
    
    // Point update: arr[idx] = val
    update(idx, val, node = 0, start = 0, end = this.n - 1) {
        if (start === end) {
            this.tree[node] = val;
            return;
        }
        
        const mid = Math.floor((start + end) / 2);
        const leftChild = 2 * node + 1;
        const rightChild = 2 * node + 2;
        
        if (idx <= mid) {
            this.update(idx, val, leftChild, start, mid);
        } else {
            this.update(idx, val, rightChild, mid + 1, end);
        }
        
        this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
    }
    
    // Range query: sum of arr[l...r]
    query(l, r, node = 0, start = 0, end = this.n - 1) {
        // No overlap
        if (r < start || end < l) {
            return 0;
        }
        
        // Complete overlap
        if (l <= start && end <= r) {
            return this.tree[node];
        }
        
        // Partial overlap
        const mid = Math.floor((start + end) / 2);
        const leftChild = 2 * node + 1;
        const rightChild = 2 * node + 2;
        
        const leftSum = this.query(l, r, leftChild, start, mid);
        const rightSum = this.query(l, r, rightChild, mid + 1, end);
        
        return leftSum + rightSum;
    }
}

// Visualization for arr = [1, 3, 5, 7, 9, 11]
//
//                    [36] (0-5)
//                   /         \\
//            [9] (0-2)       [27] (3-5)
//            /     \\         /       \\
//       [4] (0-1) [5](2)  [16](3-4)  [11](5)
//        /   \\              /    \\
//     [1](0) [3](1)     [7](3) [9](4)

// Usage:
// const st = new SegmentTree([1, 3, 5, 7, 9, 11]);
// st.query(1, 3);  // 3 + 5 + 7 = 15
// st.update(2, 6); // arr[2] = 6
// st.query(1, 3);  // 3 + 6 + 7 = 16`,
    },
    {
      id: "bit-manipulation",
      title: "Bit Manipulation",
      type: "theory",
      content: `
## Bit Manipulation Essentials

### Basic Operations
| Operation | Syntax | Example |
|-----------|--------|---------|
| AND | a & b | 5 & 3 = 1 |
| OR | a \\| b | 5 \\| 3 = 7 |
| XOR | a ^ b | 5 ^ 3 = 6 |
| NOT | ~a | ~5 = -6 |
| Left Shift | a << n | 5 << 1 = 10 |
| Right Shift | a >> n | 5 >> 1 = 2 |

### Common Bit Tricks
\`\`\`
Check if even:      (n & 1) === 0
Check if power of 2: n > 0 && (n & (n-1)) === 0
Get i-th bit:       (n >> i) & 1
Set i-th bit:       n | (1 << i)
Clear i-th bit:     n & ~(1 << i)
Toggle i-th bit:    n ^ (1 << i)
Count set bits:     popcount (Brian Kernighan)
Lowest set bit:     n & (-n) or n & ~(n-1)
Clear lowest set:   n & (n-1)
\`\`\`

### XOR Properties
- a ^ a = 0
- a ^ 0 = a
- a ^ b ^ a = b (commutative & associative)
      `,
      code: `// Count Set Bits (Brian Kernighan's Algorithm)
function countSetBits(n) {
    let count = 0;
    while (n > 0) {
        n = n & (n - 1); // Clear lowest set bit
        count++;
    }
    return count;
}
// Example: n = 13 (1101)
// 13 & 12 = 1101 & 1100 = 1100 = 12, count = 1
// 12 & 11 = 1100 & 1011 = 1000 = 8,  count = 2
// 8 & 7   = 1000 & 0111 = 0000 = 0,  count = 3

// Check Power of Two
function isPowerOfTwo(n) {
    return n > 0 && (n & (n - 1)) === 0;
}
// Powers of 2 have exactly one bit set
// 8 = 1000, 8-1 = 0111, 1000 & 0111 = 0

// Single Number (find element appearing once)
function singleNumber(nums) {
    return nums.reduce((a, b) => a ^ b, 0);
}
// XOR all elements - pairs cancel out

// Get All Subsets using bits
function subsets(nums) {
    const n = nums.length;
    const result = [];
    
    // Each number from 0 to 2^n - 1 represents a subset
    for (let mask = 0; mask < (1 << n); mask++) {
        const subset = [];
        for (let i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                subset.push(nums[i]);
            }
        }
        result.push(subset);
    }
    
    return result;
}

// Example: nums = [1, 2, 3]
// mask = 0 (000): []
// mask = 1 (001): [1]
// mask = 2 (010): [2]
// mask = 3 (011): [1, 2]
// mask = 4 (100): [3]
// mask = 5 (101): [1, 3]
// mask = 6 (110): [2, 3]
// mask = 7 (111): [1, 2, 3]

// Reverse Bits
function reverseBits(n) {
    let result = 0;
    for (let i = 0; i < 32; i++) {
        result = (result << 1) | (n & 1);
        n >>>= 1;
    }
    return result >>> 0; // Convert to unsigned
}`,
    },
    {
      id: "union-find",
      title: "Union-Find (Disjoint Set Union)",
      type: "theory",
      content: `
## Union-Find / Disjoint Set Union (DSU)

Efficiently tracks elements partitioned into disjoint sets.

### Operations
- **Find(x)**: Find the representative/root of x's set
- **Union(x, y)**: Merge sets containing x and y

### Optimizations
1. **Path Compression**: Make each node point directly to root during Find
2. **Union by Rank/Size**: Attach smaller tree under larger tree

### Complexity (with both optimizations)
- Find: O(α(n)) ≈ O(1) amortized
- Union: O(α(n)) ≈ O(1) amortized
- α(n) is inverse Ackermann function, practically constant

### Use Cases
1. Connected components
2. Kruskal's MST
3. Cycle detection
4. Network connectivity
      `,
      code: `class UnionFind {
    constructor(n) {
        // parent[i] = parent of i, initially self
        this.parent = Array.from({ length: n }, (_, i) => i);
        // rank[i] = approximate depth of tree rooted at i
        this.rank = new Array(n).fill(0);
        this.count = n; // Number of components
    }
    
    // Find with path compression
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
    
    // Union by rank
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX === rootY) return false; // Already connected
        
        // Attach smaller tree under larger tree
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
        
        this.count--;
        return true;
    }
    
    connected(x, y) {
        return this.find(x) === this.find(y);
    }
    
    getCount() {
        return this.count;
    }
}

// Visualization of Path Compression
// Before find(4):
//     0
//     |
//     1
//     |
//     2
//     |
//     3
//     |
//     4
//
// After find(4) with path compression:
//        0
//    / | | \\ \\
//   1  2 3  4
//
// All nodes now point directly to root!

// Example: Finding number of connected components
function countComponents(n, edges) {
    const uf = new UnionFind(n);
    for (const [u, v] of edges) {
        uf.union(u, v);
    }
    return uf.getCount();
}

// Usage:
// const uf = new UnionFind(5);
// uf.union(0, 1);
// uf.union(2, 3);
// uf.connected(0, 1);  // true
// uf.connected(0, 2);  // false
// uf.getCount();       // 3 (sets: {0,1}, {2,3}, {4})`,
    },
    // ============== PROBLEMS ==============
    {
      id: "problem-implement-trie",
      title: "Implement Trie",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Google", "Microsoft", "Facebook", "Apple"],
      leetcode: "https://leetcode.com/problems/implement-trie-prefix-tree/",
      content: `
## LeetCode #208: Implement Trie (Prefix Tree)

Implement a trie with insert, search, and startsWith methods.

### Example
\`\`\`
Trie trie = new Trie();
trie.insert("apple");
trie.search("apple");   // true
trie.search("app");     // false
trie.startsWith("app"); // true
\`\`\`
      `,
      code: `class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    
    insert(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }
    
    search(word) {
        const node = this.searchPrefix(word);
        return node !== null && node.isEndOfWord;
    }
    
    startsWith(prefix) {
        return this.searchPrefix(prefix) !== null;
    }
    
    searchPrefix(prefix) {
        let node = this.root;
        for (const char of prefix) {
            if (!node.children[char]) {
                return null;
            }
            node = node.children[char];
        }
        return node;
    }
}

// Dry Run: insert("apple"), search("app"), startsWith("app")
//
// insert("apple"):
// root -> a -> p -> p -> l -> e*
//
// search("app"):
// root -> a (found) -> p (found) -> p (found)
// node.isEndOfWord = false → return false
//
// startsWith("app"):
// root -> a (found) -> p (found) -> p (found)
// node !== null → return true`,
    },
    {
      id: "problem-word-search-ii",
      title: "Word Search II",
      type: "problem",
      difficulty: "Hard",
      companies: ["Amazon", "Google", "Microsoft", "Facebook", "Airbnb"],
      leetcode: "https://leetcode.com/problems/word-search-ii/",
      content: `
## LeetCode #212: Word Search II

Given a board of characters and a list of words, find all words that exist in the board.

### Key Insight
Build a Trie from words, then DFS from each cell checking against Trie.
Much faster than doing DFS for each word separately.
      `,
      code: `function findWords(board, words) {
    // Build Trie
    const root = {};
    for (const word of words) {
        let node = root;
        for (const char of word) {
            if (!node[char]) node[char] = {};
            node = node[char];
        }
        node.word = word; // Store word at end node
    }
    
    const result = [];
    const rows = board.length;
    const cols = board[0].length;
    
    function dfs(r, c, node) {
        const char = board[r][c];
        if (!node[char]) return;
        
        const nextNode = node[char];
        
        // Found a word
        if (nextNode.word) {
            result.push(nextNode.word);
            delete nextNode.word; // Avoid duplicates
        }
        
        // Mark visited
        board[r][c] = '#';
        
        // Explore neighbors
        const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        for (const [dr, dc] of dirs) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] !== '#') {
                dfs(nr, nc, nextNode);
            }
        }
        
        // Restore
        board[r][c] = char;
        
        // Optimization: prune empty branches
        if (Object.keys(nextNode).length === 0) {
            delete node[char];
        }
    }
    
    // Start DFS from each cell
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            dfs(r, c, root);
        }
    }
    
    return result;
}

// Complexity:
// Time: O(m * n * 4^L) where L = max word length
// Space: O(W * L) for Trie where W = number of words

// Example:
// board = [["o","a","a","n"],
//          ["e","t","a","e"],
//          ["i","h","k","r"],
//          ["i","f","l","v"]]
// words = ["oath","pea","eat","rain"]
// Output: ["eat","oath"]`,
    },
    {
      id: "problem-range-sum-query",
      title: "Range Sum Query - Mutable",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Google", "Facebook", "Microsoft"],
      leetcode: "https://leetcode.com/problems/range-sum-query-mutable/",
      content: `
## LeetCode #307: Range Sum Query - Mutable

Given an array nums, implement:
- update(i, val): Update nums[i] to val
- sumRange(i, j): Return sum of nums[i..j]

### Approaches
1. Array: O(1) update, O(n) query
2. Prefix Sum: O(n) update, O(1) query
3. Segment Tree: O(log n) both
4. Binary Indexed Tree: O(log n) both
      `,
      code: `// Segment Tree Solution
class NumArray {
    constructor(nums) {
        this.n = nums.length;
        this.tree = new Array(4 * this.n).fill(0);
        if (this.n > 0) {
            this.buildTree(nums, 0, 0, this.n - 1);
        }
    }
    
    buildTree(nums, node, start, end) {
        if (start === end) {
            this.tree[node] = nums[start];
            return;
        }
        const mid = Math.floor((start + end) / 2);
        this.buildTree(nums, 2 * node + 1, start, mid);
        this.buildTree(nums, 2 * node + 2, mid + 1, end);
        this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
    }
    
    update(index, val, node = 0, start = 0, end = this.n - 1) {
        if (start === end) {
            this.tree[node] = val;
            return;
        }
        const mid = Math.floor((start + end) / 2);
        if (index <= mid) {
            this.update(index, val, 2 * node + 1, start, mid);
        } else {
            this.update(index, val, 2 * node + 2, mid + 1, end);
        }
        this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
    }
    
    sumRange(left, right, node = 0, start = 0, end = this.n - 1) {
        if (right < start || end < left) return 0;
        if (left <= start && end <= right) return this.tree[node];
        
        const mid = Math.floor((start + end) / 2);
        return this.sumRange(left, right, 2 * node + 1, start, mid) +
               this.sumRange(left, right, 2 * node + 2, mid + 1, end);
    }
}

// Binary Indexed Tree (Fenwick Tree) Solution
class NumArrayBIT {
    constructor(nums) {
        this.n = nums.length;
        this.nums = new Array(this.n).fill(0);
        this.bit = new Array(this.n + 1).fill(0);
        
        for (let i = 0; i < this.n; i++) {
            this.update(i, nums[i]);
        }
    }
    
    update(index, val) {
        const diff = val - this.nums[index];
        this.nums[index] = val;
        
        for (let i = index + 1; i <= this.n; i += i & (-i)) {
            this.bit[i] += diff;
        }
    }
    
    prefixSum(index) {
        let sum = 0;
        for (let i = index + 1; i > 0; i -= i & (-i)) {
            sum += this.bit[i];
        }
        return sum;
    }
    
    sumRange(left, right) {
        return this.prefixSum(right) - (left > 0 ? this.prefixSum(left - 1) : 0);
    }
}`,
    },
    {
      id: "problem-single-number",
      title: "Single Number II",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Google", "Apple", "Microsoft"],
      leetcode: "https://leetcode.com/problems/single-number-ii/",
      content: `
## LeetCode #137: Single Number II

Every element appears three times except one. Find that single one.

### Key Insight
Count bits at each position. If count % 3 != 0, that bit is set in the single number.
      `,
      code: `// Bit Counting Solution
function singleNumber(nums) {
    let result = 0;
    
    for (let bit = 0; bit < 32; bit++) {
        let count = 0;
        for (const num of nums) {
            if ((num >> bit) & 1) {
                count++;
            }
        }
        // If count not divisible by 3, this bit is set in result
        if (count % 3 !== 0) {
            result |= (1 << bit);
        }
    }
    
    // Handle negative numbers
    return result | 0;
}

// Dry Run: [2, 2, 3, 2]
// Binary: 2 = 10, 3 = 11
// 
// Bit 0: 2(0) + 2(0) + 3(1) + 2(0) = 1, 1%3 = 1 → set bit 0
// Bit 1: 2(1) + 2(1) + 3(1) + 2(1) = 4, 4%3 = 1 → set bit 1
// Result: 11 = 3 ✓

// O(1) Space State Machine Solution
function singleNumberOptimal(nums) {
    let ones = 0, twos = 0;
    
    for (const num of nums) {
        // ones holds bits that appeared exactly once
        // twos holds bits that appeared exactly twice
        ones = (ones ^ num) & ~twos;
        twos = (twos ^ num) & ~ones;
    }
    
    return ones;
}

// State transitions:
// (ones, twos)
// Start: (0, 0)
// After 1st occurrence: (x, 0)
// After 2nd occurrence: (0, x)
// After 3rd occurrence: (0, 0) -- reset!
//
// So ones contains bits that appeared 1 or 4 or 7... times
// Since all appear 3 times except one, ones has the answer`,
    },
    {
      id: "problem-number-of-islands-uf",
      title: "Number of Islands (Union-Find)",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Google", "Facebook", "Microsoft", "Bloomberg"],
      leetcode: "https://leetcode.com/problems/number-of-islands/",
      content: `
## LeetCode #200: Number of Islands (Union-Find Approach)

Count the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.

### Union-Find Approach
1. Create UnionFind for all land cells
2. Union adjacent land cells
3. Count connected components
      `,
      code: `function numIslands(grid) {
    if (!grid.length) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    
    class UnionFind {
        constructor() {
            this.parent = new Map();
            this.count = 0;
        }
        
        add(key) {
            if (!this.parent.has(key)) {
                this.parent.set(key, key);
                this.count++;
            }
        }
        
        find(x) {
            if (this.parent.get(x) !== x) {
                this.parent.set(x, this.find(this.parent.get(x)));
            }
            return this.parent.get(x);
        }
        
        union(x, y) {
            const rootX = this.find(x);
            const rootY = this.find(y);
            if (rootX !== rootY) {
                this.parent.set(rootX, rootY);
                this.count--;
            }
        }
    }
    
    const uf = new UnionFind();
    const toKey = (r, c) => r * cols + c;
    
    // Add all land cells
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '1') {
                uf.add(toKey(r, c));
            }
        }
    }
    
    // Union adjacent land cells
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '1') {
                const key = toKey(r, c);
                // Right neighbor
                if (c + 1 < cols && grid[r][c + 1] === '1') {
                    uf.union(key, toKey(r, c + 1));
                }
                // Down neighbor
                if (r + 1 < rows && grid[r + 1][c] === '1') {
                    uf.union(key, toKey(r + 1, c));
                }
            }
        }
    }
    
    return uf.count;
}

// When to use Union-Find vs DFS/BFS?
// 
// Union-Find better when:
// - Online queries (adding edges dynamically)
// - Need to check connectivity frequently
// - Graph operations like Kruskal's MST
//
// DFS/BFS better when:
// - Static graph
// - Need path information
// - Simpler implementation for basic problems

// Number of Islands II (LeetCode #305) - Union Find is better
// Add land positions one by one, return count after each
function numIslands2(m, n, positions) {
    const uf = new UnionFind();
    const toKey = (r, c) => r * n + c;
    const result = [];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    const land = new Set();
    
    for (const [r, c] of positions) {
        const key = toKey(r, c);
        
        if (!land.has(key)) {
            land.add(key);
            uf.add(key);
            
            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;
                const nkey = toKey(nr, nc);
                
                if (nr >= 0 && nr < m && nc >= 0 && nc < n && land.has(nkey)) {
                    uf.union(key, nkey);
                }
            }
        }
        
        result.push(uf.count);
    }
    
    return result;
}`,
    },
    {
      id: "problem-accounts-merge",
      title: "Accounts Merge",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Facebook", "Google", "Microsoft", "Apple"],
      leetcode: "https://leetcode.com/problems/accounts-merge/",
      content: `
## LeetCode #721: Accounts Merge

Given a list of accounts where each element accounts[i] is [name, email1, email2, ...].
Merge accounts belonging to the same person. Two accounts belong to same person if they have a common email.

### Key Insight
This is a graph connectivity problem - union emails that belong to same account.
      `,
      code: `function accountsMerge(accounts) {
    const emailToName = new Map();
    const parent = new Map();
    
    // Find with path compression
    function find(x) {
        if (parent.get(x) !== x) {
            parent.set(x, find(parent.get(x)));
        }
        return parent.get(x);
    }
    
    // Union
    function union(x, y) {
        const rootX = find(x);
        const rootY = find(y);
        if (rootX !== rootY) {
            parent.set(rootX, rootY);
        }
    }
    
    // Initialize
    for (const account of accounts) {
        const name = account[0];
        for (let i = 1; i < account.length; i++) {
            const email = account[i];
            emailToName.set(email, name);
            if (!parent.has(email)) {
                parent.set(email, email);
            }
        }
    }
    
    // Union emails in same account
    for (const account of accounts) {
        const firstEmail = account[1];
        for (let i = 2; i < account.length; i++) {
            union(firstEmail, account[i]);
        }
    }
    
    // Group emails by root
    const groups = new Map();
    for (const email of parent.keys()) {
        const root = find(email);
        if (!groups.has(root)) {
            groups.set(root, []);
        }
        groups.get(root).push(email);
    }
    
    // Build result
    const result = [];
    for (const [root, emails] of groups) {
        const name = emailToName.get(root);
        result.push([name, ...emails.sort()]);
    }
    
    return result;
}

// Dry Run:
// accounts = [
//   ["John", "johnsmith@mail.com", "john_newyork@mail.com"],
//   ["John", "johnsmith@mail.com", "john00@mail.com"],
//   ["Mary", "mary@mail.com"],
//   ["John", "johnnybravo@mail.com"]
// ]
//
// After union:
// johnsmith@mail.com → john_newyork@mail.com → john00@mail.com (same root)
// mary@mail.com (separate)
// johnnybravo@mail.com (separate)
//
// Output: [
//   ["John","john00@mail.com","john_newyork@mail.com","johnsmith@mail.com"],
//   ["Mary","mary@mail.com"],
//   ["John","johnnybravo@mail.com"]
// ]`,
    },
    // ============== ADVANCED FENWICK TREE TECHNIQUES ==============
    {
      id: "fenwick-tree-advanced",
      title: "Fenwick Tree: Advanced Techniques",
      type: "theory",
      content: `
## Fenwick Tree: Beyond Basic Range Sums 🌲

<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 24px; margin: 20px 0;">
  <h3 style="color: #4ade80; margin: 0 0 20px 0; text-align: center;">🎯 Fenwick Tree Capabilities</h3>
  
  <table style="width: 100%; border-collapse: collapse; color: #e2e8f0; font-size: 12px;">
    <thead>
      <tr style="border-bottom: 2px solid #4ade80;">
        <th style="text-align: left; padding: 10px; color: #4ade80;">Operation</th>
        <th style="text-align: center; padding: 10px; color: #4ade80;">Time</th>
        <th style="text-align: left; padding: 10px; color: #4ade80;">Use Case</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 10px;">Point Update</td>
        <td style="padding: 10px; color: #60a5fa; text-align: center;">O(log n)</td>
        <td style="padding: 10px;">Add delta to position</td>
      </tr>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 10px;">Prefix Sum</td>
        <td style="padding: 10px; color: #60a5fa; text-align: center;">O(log n)</td>
        <td style="padding: 10px;">Sum from 0 to i</td>
      </tr>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 10px;">Range Update</td>
        <td style="padding: 10px; color: #fbbf24; text-align: center;">O(log n)</td>
        <td style="padding: 10px;">Add to range [l, r]</td>
      </tr>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 10px;">Find kth</td>
        <td style="padding: 10px; color: #f472b6; text-align: center;">O(log n)</td>
        <td style="padding: 10px;">kth smallest element</td>
      </tr>
      <tr>
        <td style="padding: 10px;">2D Queries</td>
        <td style="padding: 10px; color: #f87171; text-align: center;">O(log² n)</td>
        <td style="padding: 10px;">Rectangle sums/updates</td>
      </tr>
    </tbody>
  </table>
</div>

### Why Fenwick > Segment Tree Sometimes

| Fenwick Tree | Segment Tree |
|-------------|--------------|
| 2x less memory | Supports any associative op |
| Simpler code | Range updates easier |
| Slightly faster | More versatile |
      `,
      code: `// ═══════════════════════════════════════════════════════════
// RANGE UPDATE + POINT QUERY FENWICK TREE
// ═══════════════════════════════════════════════════════════

class FenwickRangeUpdate {
    constructor(n) {
        this.n = n;
        this.tree = new Array(n + 1).fill(0);
    }
    
    // Add delta to all elements from index i to n
    update(i, delta) {
        while (i <= this.n) {
            this.tree[i] += delta;
            i += i & (-i);
        }
    }
    
    // Add delta to range [l, r]
    rangeUpdate(l, r, delta) {
        this.update(l, delta);
        this.update(r + 1, -delta);
    }
    
    // Query value at point i
    pointQuery(i) {
        let sum = 0;
        while (i > 0) {
            sum += this.tree[i];
            i -= i & (-i);
        }
        return sum;
    }
}


// ═══════════════════════════════════════════════════════════
// RANGE UPDATE + RANGE QUERY (Two Fenwick Trees)
// ═══════════════════════════════════════════════════════════

class FenwickRangeUpdateRangeQuery {
    constructor(n) {
        this.n = n;
        this.B1 = new Array(n + 1).fill(0);  // Stores delta
        this.B2 = new Array(n + 1).fill(0);  // Stores delta * (i-1)
    }
    
    update(tree, i, delta) {
        while (i <= this.n) {
            tree[i] += delta;
            i += i & (-i);
        }
    }
    
    query(tree, i) {
        let sum = 0;
        while (i > 0) {
            sum += tree[i];
            i -= i & (-i);
        }
        return sum;
    }
    
    // Add delta to range [l, r]
    rangeUpdate(l, r, delta) {
        this.update(this.B1, l, delta);
        this.update(this.B1, r + 1, -delta);
        this.update(this.B2, l, delta * (l - 1));
        this.update(this.B2, r + 1, -delta * r);
    }
    
    // Prefix sum [1, i]
    prefixSum(i) {
        return this.query(this.B1, i) * i - this.query(this.B2, i);
    }
    
    // Range sum [l, r]
    rangeSum(l, r) {
        return this.prefixSum(r) - this.prefixSum(l - 1);
    }
}


// ═══════════════════════════════════════════════════════════
// FINDING K-TH SMALLEST ELEMENT
// ═══════════════════════════════════════════════════════════

class FenwickOrderStatistic {
    constructor(maxVal) {
        this.n = maxVal;
        this.tree = new Array(maxVal + 1).fill(0);
    }
    
    update(i, delta) {
        while (i <= this.n) {
            this.tree[i] += delta;
            i += i & (-i);
        }
    }
    
    insert(val) { this.update(val, 1); }
    remove(val) { this.update(val, -1); }
    
    // Find k-th smallest (1-indexed)
    findKth(k) {
        let pos = 0;
        let sum = 0;
        
        // Binary lifting: start from highest bit
        for (let i = Math.floor(Math.log2(this.n)); i >= 0; i--) {
            const newPos = pos + (1 << i);
            if (newPos <= this.n && sum + this.tree[newPos] < k) {
                pos = newPos;
                sum += this.tree[newPos];
            }
        }
        
        return pos + 1;  // 1-indexed answer
    }
}


// ═══════════════════════════════════════════════════════════
// 2D FENWICK TREE
// ═══════════════════════════════════════════════════════════

class Fenwick2D {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.tree = Array.from(
            { length: rows + 1 },
            () => new Array(cols + 1).fill(0)
        );
    }
    
    // Add delta at (row, col)
    update(row, col, delta) {
        for (let i = row; i <= this.rows; i += i & (-i)) {
            for (let j = col; j <= this.cols; j += j & (-j)) {
                this.tree[i][j] += delta;
            }
        }
    }
    
    // Sum from (1,1) to (row, col)
    query(row, col) {
        let sum = 0;
        for (let i = row; i > 0; i -= i & (-i)) {
            for (let j = col; j > 0; j -= j & (-j)) {
                sum += this.tree[i][j];
            }
        }
        return sum;
    }
    
    // Sum in rectangle (r1,c1) to (r2,c2)
    rangeQuery(r1, c1, r2, c2) {
        return this.query(r2, c2) 
             - this.query(r1 - 1, c2) 
             - this.query(r2, c1 - 1) 
             + this.query(r1 - 1, c1 - 1);
    }
}

// Example: Count inversions using Fenwick Tree
function countInversions(arr) {
    const sorted = [...new Set(arr)].sort((a, b) => a - b);
    const rank = new Map();
    sorted.forEach((v, i) => rank.set(v, i + 1));
    
    const n = sorted.length;
    const bit = new Array(n + 1).fill(0);
    
    const update = (i) => {
        while (i <= n) {
            bit[i]++;
            i += i & (-i);
        }
    };
    
    const query = (i) => {
        let sum = 0;
        while (i > 0) {
            sum += bit[i];
            i -= i & (-i);
        }
        return sum;
    };
    
    let inversions = 0;
    for (let i = arr.length - 1; i >= 0; i--) {
        const r = rank.get(arr[i]);
        inversions += query(r - 1);  // Count smaller elements seen
        update(r);
    }
    
    return inversions;
}`,
    },
    {
      id: "union-find-optimization",
      title: "Union-Find: Path Compression & Rank",
      type: "theory",
      content: `
## Union-Find: Maximum Optimization 🔗

<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 24px; margin: 20px 0;">
  <h3 style="color: #4ade80; margin: 0 0 20px 0; text-align: center;">⚡ Amortized Complexity Analysis</h3>
  
  <table style="width: 100%; border-collapse: collapse; color: #e2e8f0; font-size: 12px;">
    <thead>
      <tr style="border-bottom: 2px solid #4ade80;">
        <th style="text-align: left; padding: 10px; color: #4ade80;">Optimization</th>
        <th style="text-align: center; padding: 10px; color: #4ade80;">Find</th>
        <th style="text-align: center; padding: 10px; color: #4ade80;">Union</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 10px;">None (naive)</td>
        <td style="padding: 10px; color: #f87171; text-align: center;">O(n)</td>
        <td style="padding: 10px; color: #f87171; text-align: center;">O(n)</td>
      </tr>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 10px;">Path Compression only</td>
        <td style="padding: 10px; color: #fbbf24; text-align: center;">O(log n)*</td>
        <td style="padding: 10px; color: #fbbf24; text-align: center;">O(log n)*</td>
      </tr>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 10px;">Rank only</td>
        <td style="padding: 10px; color: #fbbf24; text-align: center;">O(log n)</td>
        <td style="padding: 10px; color: #fbbf24; text-align: center;">O(log n)</td>
      </tr>
      <tr>
        <td style="padding: 10px;">Both (optimal)</td>
        <td style="padding: 10px; color: #4ade80; text-align: center;">O(α(n))</td>
        <td style="padding: 10px; color: #4ade80; text-align: center;">O(α(n))</td>
      </tr>
    </tbody>
  </table>
  <p style="color: #94a3b8; font-size: 11px; margin-top: 12px; text-align: center;">
    α(n) = inverse Ackermann function ≈ constant for all practical inputs
  </p>
</div>

### Path Compression Variants

| Technique | Description | Complexity |
|-----------|-------------|-----------|
| Full compression | Point all to root | O(α(n)) |
| Path splitting | Point each to grandparent | O(α(n)) |
| Path halving | Every other to grandparent | O(α(n)) |
      `,
      code: `// ═══════════════════════════════════════════════════════════
// OPTIMIZED UNION-FIND WITH ALL TECHNIQUES
// ═══════════════════════════════════════════════════════════

class UnionFind {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
        this.size = new Array(n).fill(1);
        this.components = n;
    }
    
    // Path compression: make all nodes point to root
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
    
    // Union by rank
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX === rootY) return false;
        
        // Attach smaller tree under larger tree
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
            this.size[rootY] += this.size[rootX];
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
            this.size[rootX] += this.size[rootY];
        } else {
            this.parent[rootY] = rootX;
            this.size[rootX] += this.size[rootY];
            this.rank[rootX]++;
        }
        
        this.components--;
        return true;
    }
    
    connected(x, y) {
        return this.find(x) === this.find(y);
    }
    
    getSize(x) {
        return this.size[this.find(x)];
    }
}


// ═══════════════════════════════════════════════════════════
// PATH COMPRESSION VARIANTS
// ═══════════════════════════════════════════════════════════

// Path Splitting: each node points to its grandparent
function findPathSplitting(parent, x) {
    while (parent[x] !== x) {
        const next = parent[x];
        parent[x] = parent[parent[x]];
        x = next;
    }
    return x;
}

// Path Halving: every other node points to grandparent
function findPathHalving(parent, x) {
    while (parent[x] !== x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    return x;
}


// ═══════════════════════════════════════════════════════════
// WEIGHTED UNION-FIND (for maintaining relative values)
// ═══════════════════════════════════════════════════════════

class WeightedUnionFind {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
        this.diff = new Array(n).fill(0);  // diff[x] = weight to parent
    }
    
    find(x) {
        if (this.parent[x] === x) {
            return { root: x, weight: 0 };
        }
        
        const result = this.find(this.parent[x]);
        this.parent[x] = result.root;
        this.diff[x] += result.weight;
        
        return { root: result.root, weight: this.diff[x] };
    }
    
    // Union x and y with known weight difference
    // x / y = weight means x = y * weight
    union(x, y, weight) {
        const { root: rootX, weight: weightX } = this.find(x);
        const { root: rootY, weight: weightY } = this.find(y);
        
        if (rootX === rootY) {
            // Check consistency
            return Math.abs(weightX - weightY - Math.log2(weight)) < 1e-9;
        }
        
        // Connect rootX to rootY
        // x = rootX * 2^weightX, y = rootY * 2^weightY
        // x / y = weight
        // rootX * 2^weightX / (rootY * 2^weightY) = weight
        // diff[rootX] = log2(weight) + weightY - weightX
        
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
            this.diff[rootX] = Math.log2(weight) + weightY - weightX;
        } else {
            this.parent[rootY] = rootX;
            this.diff[rootY] = Math.log2(1/weight) + weightX - weightY;
            if (this.rank[rootX] === this.rank[rootY]) {
                this.rank[rootX]++;
            }
        }
        
        return true;
    }
}


// ═══════════════════════════════════════════════════════════
// PERSISTENT UNION-FIND (for queries on historical state)
// ═══════════════════════════════════════════════════════════

// Uses array copying for simple persistence
class PersistentUnionFind {
    constructor(n) {
        this.versions = [{
            parent: Array.from({ length: n }, (_, i) => i),
            rank: new Array(n).fill(0)
        }];
    }
    
    find(version, x) {
        const parent = this.versions[version].parent;
        while (parent[x] !== x) {
            x = parent[x];
        }
        return x;
    }
    
    union(version, x, y) {
        const prev = this.versions[version];
        const newParent = [...prev.parent];
        const newRank = [...prev.rank];
        
        const rootX = this.find(version, x);
        const rootY = this.find(version, y);
        
        if (rootX !== rootY) {
            if (newRank[rootX] < newRank[rootY]) {
                newParent[rootX] = rootY;
            } else if (newRank[rootX] > newRank[rootY]) {
                newParent[rootY] = rootX;
            } else {
                newParent[rootY] = rootX;
                newRank[rootX]++;
            }
        }
        
        this.versions.push({ parent: newParent, rank: newRank });
        return this.versions.length - 1;  // Return new version
    }
    
    connected(version, x, y) {
        return this.find(version, x) === this.find(version, y);
    }
}`,
    },
    {
      id: "segment-tree-lazy",
      title: "Segment Tree: Lazy Propagation",
      type: "theory",
      content: `
## Segment Tree with Lazy Propagation 🦥

<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 24px; margin: 20px 0;">
  <h3 style="color: #4ade80; margin: 0 0 20px 0; text-align: center;">🎯 Lazy Propagation: The Key Insight</h3>
  
  <div style="display: grid; gap: 16px;">
    <div style="background: #0f3460; padding: 16px; border-radius: 12px;">
      <h4 style="color: #f472b6; margin: 0 0 8px 0;">❌ Without Lazy (Range Update)</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">
        Update every node in range → O(n) per update
      </p>
    </div>
    
    <div style="background: #0f3460; padding: 16px; border-radius: 12px;">
      <h4 style="color: #4ade80; margin: 0 0 8px 0;">✓ With Lazy</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">
        Store pending updates, propagate only when needed → O(log n)
      </p>
    </div>
  </div>
</div>

### When to Use Lazy Propagation

| Use Case | Lazy Needed? |
|----------|-------------|
| Point updates | ❌ No |
| Range sum with range updates | ✅ Yes |
| Range min/max with range set | ✅ Yes |
| Range XOR | ✅ Yes |
| Multiple pending operations | ✅ Yes |
      `,
      code: `// ═══════════════════════════════════════════════════════════
// SEGMENT TREE WITH LAZY PROPAGATION (RANGE ADD)
// ═══════════════════════════════════════════════════════════

class LazySegmentTree {
    constructor(arr) {
        this.n = arr.length;
        this.tree = new Array(4 * this.n).fill(0);
        this.lazy = new Array(4 * this.n).fill(0);
        this.build(arr, 1, 0, this.n - 1);
    }
    
    build(arr, node, start, end) {
        if (start === end) {
            this.tree[node] = arr[start];
        } else {
            const mid = Math.floor((start + end) / 2);
            this.build(arr, 2 * node, start, mid);
            this.build(arr, 2 * node + 1, mid + 1, end);
            this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
        }
    }
    
    // Push lazy value down to children
    pushDown(node, start, end) {
        if (this.lazy[node] !== 0) {
            const mid = Math.floor((start + end) / 2);
            
            // Update children's trees
            this.tree[2 * node] += this.lazy[node] * (mid - start + 1);
            this.tree[2 * node + 1] += this.lazy[node] * (end - mid);
            
            // Pass lazy value to children
            this.lazy[2 * node] += this.lazy[node];
            this.lazy[2 * node + 1] += this.lazy[node];
            
            // Clear current lazy
            this.lazy[node] = 0;
        }
    }
    
    // Range update: add val to all elements in [l, r]
    updateRange(l, r, val, node = 1, start = 0, end = this.n - 1) {
        if (r < start || end < l) {
            return;  // Out of range
        }
        
        if (l <= start && end <= r) {
            // Complete overlap
            this.tree[node] += val * (end - start + 1);
            this.lazy[node] += val;
            return;
        }
        
        // Partial overlap
        this.pushDown(node, start, end);
        
        const mid = Math.floor((start + end) / 2);
        this.updateRange(l, r, val, 2 * node, start, mid);
        this.updateRange(l, r, val, 2 * node + 1, mid + 1, end);
        this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
    }
    
    // Range query: sum of elements in [l, r]
    queryRange(l, r, node = 1, start = 0, end = this.n - 1) {
        if (r < start || end < l) {
            return 0;  // Out of range
        }
        
        if (l <= start && end <= r) {
            return this.tree[node];  // Complete overlap
        }
        
        // Partial overlap
        this.pushDown(node, start, end);
        
        const mid = Math.floor((start + end) / 2);
        const leftSum = this.queryRange(l, r, 2 * node, start, mid);
        const rightSum = this.queryRange(l, r, 2 * node + 1, mid + 1, end);
        return leftSum + rightSum;
    }
}


// ═══════════════════════════════════════════════════════════
// RANGE SET + RANGE QUERY (Assign value to range)
// ═══════════════════════════════════════════════════════════

class LazySegmentTreeRangeSet {
    constructor(arr) {
        this.n = arr.length;
        this.tree = new Array(4 * this.n).fill(0);
        this.lazy = new Array(4 * this.n).fill(null);
        this.build(arr, 1, 0, this.n - 1);
    }
    
    build(arr, node, start, end) {
        if (start === end) {
            this.tree[node] = arr[start];
        } else {
            const mid = (start + end) >> 1;
            this.build(arr, 2 * node, start, mid);
            this.build(arr, 2 * node + 1, mid + 1, end);
            this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
        }
    }
    
    pushDown(node, start, end) {
        if (this.lazy[node] !== null) {
            const mid = (start + end) >> 1;
            const val = this.lazy[node];
            
            this.tree[2 * node] = val * (mid - start + 1);
            this.tree[2 * node + 1] = val * (end - mid);
            
            this.lazy[2 * node] = val;
            this.lazy[2 * node + 1] = val;
            
            this.lazy[node] = null;
        }
    }
    
    // Set all elements in [l, r] to val
    setRange(l, r, val, node = 1, start = 0, end = this.n - 1) {
        if (r < start || end < l) return;
        
        if (l <= start && end <= r) {
            this.tree[node] = val * (end - start + 1);
            this.lazy[node] = val;
            return;
        }
        
        this.pushDown(node, start, end);
        const mid = (start + end) >> 1;
        this.setRange(l, r, val, 2 * node, start, mid);
        this.setRange(l, r, val, 2 * node + 1, mid + 1, end);
        this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
    }
    
    queryRange(l, r, node = 1, start = 0, end = this.n - 1) {
        if (r < start || end < l) return 0;
        if (l <= start && end <= r) return this.tree[node];
        
        this.pushDown(node, start, end);
        const mid = (start + end) >> 1;
        return this.queryRange(l, r, 2 * node, start, mid) +
               this.queryRange(l, r, 2 * node + 1, mid + 1, end);
    }
}


// ═══════════════════════════════════════════════════════════
// INTERVIEW PATTERN: RANGE ADD + RANGE MAX
// ═══════════════════════════════════════════════════════════

class LazySegmentTreeMax {
    constructor(arr) {
        this.n = arr.length;
        this.tree = new Array(4 * this.n).fill(-Infinity);
        this.lazy = new Array(4 * this.n).fill(0);
        this.build(arr, 1, 0, this.n - 1);
    }
    
    build(arr, node, start, end) {
        if (start === end) {
            this.tree[node] = arr[start];
        } else {
            const mid = (start + end) >> 1;
            this.build(arr, 2 * node, start, mid);
            this.build(arr, 2 * node + 1, mid + 1, end);
            this.tree[node] = Math.max(this.tree[2 * node], this.tree[2 * node + 1]);
        }
    }
    
    pushDown(node) {
        if (this.lazy[node] !== 0) {
            this.tree[2 * node] += this.lazy[node];
            this.tree[2 * node + 1] += this.lazy[node];
            this.lazy[2 * node] += this.lazy[node];
            this.lazy[2 * node + 1] += this.lazy[node];
            this.lazy[node] = 0;
        }
    }
    
    // Add val to all elements in [l, r]
    addRange(l, r, val, node = 1, start = 0, end = this.n - 1) {
        if (r < start || end < l) return;
        
        if (l <= start && end <= r) {
            this.tree[node] += val;
            this.lazy[node] += val;
            return;
        }
        
        this.pushDown(node);
        const mid = (start + end) >> 1;
        this.addRange(l, r, val, 2 * node, start, mid);
        this.addRange(l, r, val, 2 * node + 1, mid + 1, end);
        this.tree[node] = Math.max(this.tree[2 * node], this.tree[2 * node + 1]);
    }
    
    // Query max in [l, r]
    queryMax(l, r, node = 1, start = 0, end = this.n - 1) {
        if (r < start || end < l) return -Infinity;
        if (l <= start && end <= r) return this.tree[node];
        
        this.pushDown(node);
        const mid = (start + end) >> 1;
        return Math.max(
            this.queryMax(l, r, 2 * node, start, mid),
            this.queryMax(l, r, 2 * node + 1, mid + 1, end)
        );
    }
}


// ═══════════════════════════════════════════════════════════
// INTERVIEW CHEAT SHEET
// ═══════════════════════════════════════════════════════════

/*
ADVANCED DSA INTERVIEW GUIDE:

FENWICK TREE:
- Use for: counting inversions, range sums, 2D sums
- Advantages: simpler code, less memory than segment tree
- Limitation: mainly for prefix-based operations

UNION-FIND:
- Always use path compression + union by rank
- Time: O(α(n)) ≈ O(1) amortized
- Weighted UF for relative value tracking
- Use when: connected components, cycle detection, MST

SEGMENT TREE + LAZY:
- Use lazy when: range updates needed
- Push down before accessing children
- Common patterns: range add, range set, range max/min
- Clear lazy after propagating

COMPLEXITY COMPARISON:
| Operation | Fenwick | Segment | Lazy Segment |
|-----------|---------|---------|--------------|
| Point Update | O(log n) | O(log n) | O(log n) |
| Point Query | O(log n) | O(log n) | O(log n) |
| Range Update | O(n)* | O(n)* | O(log n) |
| Range Query | O(log n) | O(log n) | O(log n) |
| Memory | O(n) | O(4n) | O(4n) |

* Without modifications; Fenwick can do range update with 2 trees
*/`,
    },
  ],
};
