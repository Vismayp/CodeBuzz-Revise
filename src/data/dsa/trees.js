export const treesTopic = {
  id: "trees",
  title: "Trees",
  description:
    "Master tree traversals, BST operations, and advanced tree problems.",
  icon: "GitBranch",
  sections: [
    // ============== THEORY SECTIONS ==============
    {
      id: "tree-fundamentals",
      title: "Tree Fundamentals",
      type: "theory",
      content: `
## Trees: Hierarchical Data Structures

A tree is a non-linear data structure with nodes connected by edges, forming a hierarchy.

### Terminology
| Term | Definition |
|------|------------|
| **Root** | Topmost node (no parent) |
| **Node** | Element containing data and child references |
| **Edge** | Connection between nodes |
| **Leaf** | Node with no children |
| **Parent/Child** | Connected nodes (upper/lower) |
| **Sibling** | Nodes with same parent |
| **Depth** | Distance from root (root = 0) |
| **Height** | Max depth of any leaf |
| **Subtree** | Tree formed by a node and its descendants |

### Types of Trees
1. **Binary Tree**: Each node has at most 2 children
2. **Binary Search Tree (BST)**: Left < Root < Right
3. **Balanced Trees**: AVL, Red-Black (height ~ log n)
4. **Complete Binary Tree**: All levels filled except last (filled left to right)
5. **Full Binary Tree**: Every node has 0 or 2 children
6. **Perfect Binary Tree**: All internal nodes have 2 children, leaves at same level

### Properties
- **Nodes in perfect binary tree**: $2^{h+1} - 1$
- **Height of balanced tree with n nodes**: $\\lfloor \\log_2 n \\rfloor$
- **Max nodes at level k**: $2^k$
      `,
      diagram: `
graph TD
    A[Root: 10] --> B[5]
    A --> C[15]
    B --> D[3]
    B --> E[7]
    C --> F[12]
    C --> G[20]
    style A fill:#f9f
    style D fill:#bfb
    style E fill:#bfb
    style F fill:#bfb
    style G fill:#bfb
      `,
      code: `// Binary Tree Node Definition
class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

// Building a tree manually
const root = new TreeNode(10);
root.left = new TreeNode(5);
root.right = new TreeNode(15);
root.left.left = new TreeNode(3);
root.left.right = new TreeNode(7);
root.right.left = new TreeNode(12);
root.right.right = new TreeNode(20);

// Tree:
//        10
//       /  \\
//      5    15
//     / \\  /  \\
//    3   7 12  20

// Calculate tree height
function height(root) {
    if (root === null) return -1; // or 0 for node count
    return 1 + Math.max(height(root.left), height(root.right));
}

// Count nodes
function countNodes(root) {
    if (root === null) return 0;
    return 1 + countNodes(root.left) + countNodes(root.right);
}

// Check if balanced (height difference <= 1)
function isBalanced(root) {
    function checkHeight(node) {
        if (node === null) return 0;
        
        const leftHeight = checkHeight(node.left);
        if (leftHeight === -1) return -1;
        
        const rightHeight = checkHeight(node.right);
        if (rightHeight === -1) return -1;
        
        if (Math.abs(leftHeight - rightHeight) > 1) return -1;
        
        return 1 + Math.max(leftHeight, rightHeight);
    }
    
    return checkHeight(root) !== -1;
}`,
    },
    {
      id: "tree-traversals",
      title: "Tree Traversals",
      type: "theory",
      content: `
## Tree Traversal Algorithms

### Depth-First Search (DFS)
Explore as deep as possible before backtracking.

**Three Types:**
1. **Preorder**: Root → Left → Right (useful for copying tree)
2. **Inorder**: Left → Root → Right (BST gives sorted order)
3. **Postorder**: Left → Right → Root (useful for deletion)

### Breadth-First Search (BFS)
Visit all nodes at current level before moving to next level.
Uses a **queue** for level-order traversal.

### When to Use Each
| Traversal | Use Case |
|-----------|----------|
| Preorder | Serialize tree, copy tree |
| Inorder | BST operations (sorted output) |
| Postorder | Delete tree, calculate sizes |
| Level-order | Find min depth, print levels |
      `,
      diagram: `
graph TD
    subgraph "Traversal Order"
    A["Tree: 1"]
    A --> B[2]
    A --> C[3]
    B --> D[4]
    B --> E[5]
    end
    subgraph "Results"
    F["Preorder: 1,2,4,5,3"]
    G["Inorder: 4,2,5,1,3"]
    H["Postorder: 4,5,2,3,1"]
    I["Level: 1,2,3,4,5"]
    end
      `,
      code: `// ========== DFS Traversals ==========

// Preorder: Root → Left → Right (Recursive)
function preorderRecursive(root) {
    const result = [];
    
    function traverse(node) {
        if (node === null) return;
        result.push(node.val);       // Process root
        traverse(node.left);          // Traverse left
        traverse(node.right);         // Traverse right
    }
    
    traverse(root);
    return result;
}

// Preorder: Iterative with Stack
function preorderIterative(root) {
    if (!root) return [];
    
    const result = [];
    const stack = [root];
    
    while (stack.length > 0) {
        const node = stack.pop();
        result.push(node.val);
        
        // Push right first so left is processed first
        if (node.right) stack.push(node.right);
        if (node.left) stack.push(node.left);
    }
    
    return result;
}

// Inorder: Left → Root → Right
function inorderRecursive(root) {
    const result = [];
    
    function traverse(node) {
        if (node === null) return;
        traverse(node.left);
        result.push(node.val);
        traverse(node.right);
    }
    
    traverse(root);
    return result;
}

// Inorder: Iterative (tricky!)
function inorderIterative(root) {
    const result = [];
    const stack = [];
    let current = root;
    
    while (current !== null || stack.length > 0) {
        // Go to leftmost node
        while (current !== null) {
            stack.push(current);
            current = current.left;
        }
        
        // Process node
        current = stack.pop();
        result.push(current.val);
        
        // Move to right subtree
        current = current.right;
    }
    
    return result;
}

// Postorder: Left → Right → Root
function postorderRecursive(root) {
    const result = [];
    
    function traverse(node) {
        if (node === null) return;
        traverse(node.left);
        traverse(node.right);
        result.push(node.val);
    }
    
    traverse(root);
    return result;
}

// ========== BFS Level Order ==========
function levelOrder(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result;
}

// Example: levelOrder on tree [3,9,20,null,null,15,7]
// Result: [[3], [9, 20], [15, 7]]`,
    },
    {
      id: "bst-operations",
      title: "Binary Search Tree Operations",
      type: "theory",
      content: `
## Binary Search Tree (BST)

A BST maintains the property: **Left < Root < Right** for all nodes.

### Time Complexity
| Operation | Average | Worst (Skewed) |
|-----------|---------|----------------|
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |
| Min/Max | O(log n) | O(n) |

### BST Inorder = Sorted Array
Inorder traversal of BST gives elements in sorted order!

### Deletion Cases
1. **Leaf node**: Simply remove
2. **One child**: Replace with child
3. **Two children**: Replace with inorder successor (or predecessor)
      `,
      code: `// Search in BST - O(log n) average
function searchBST(root, val) {
    if (!root || root.val === val) return root;
    
    if (val < root.val) {
        return searchBST(root.left, val);
    }
    return searchBST(root.right, val);
}

// Insert in BST
function insertIntoBST(root, val) {
    if (!root) return new TreeNode(val);
    
    if (val < root.val) {
        root.left = insertIntoBST(root.left, val);
    } else {
        root.right = insertIntoBST(root.right, val);
    }
    
    return root;
}

// Delete from BST
function deleteNode(root, key) {
    if (!root) return null;
    
    if (key < root.val) {
        root.left = deleteNode(root.left, key);
    } else if (key > root.val) {
        root.right = deleteNode(root.right, key);
    } else {
        // Found node to delete
        
        // Case 1: Leaf node
        if (!root.left && !root.right) return null;
        
        // Case 2: One child
        if (!root.left) return root.right;
        if (!root.right) return root.left;
        
        // Case 3: Two children
        // Find inorder successor (smallest in right subtree)
        let successor = root.right;
        while (successor.left) {
            successor = successor.left;
        }
        
        // Copy successor value to current node
        root.val = successor.val;
        
        // Delete successor from right subtree
        root.right = deleteNode(root.right, successor.val);
    }
    
    return root;
}

// Find Min in BST (leftmost node)
function findMin(root) {
    while (root && root.left) {
        root = root.left;
    }
    return root;
}

// Find Max in BST (rightmost node)
function findMax(root) {
    while (root && root.right) {
        root = root.right;
    }
    return root;
}

// Validate BST
function isValidBST(root) {
    function validate(node, min, max) {
        if (!node) return true;
        
        if (node.val <= min || node.val >= max) return false;
        
        return validate(node.left, min, node.val) &&
               validate(node.right, node.val, max);
    }
    
    return validate(root, -Infinity, Infinity);
}

// Find Inorder Successor
function inorderSuccessor(root, p) {
    // If right subtree exists, successor is leftmost in right
    if (p.right) {
        let current = p.right;
        while (current.left) {
            current = current.left;
        }
        return current;
    }
    
    // Otherwise, find ancestor where node is in left subtree
    let successor = null;
    let current = root;
    
    while (current) {
        if (p.val < current.val) {
            successor = current;
            current = current.left;
        } else {
            current = current.right;
        }
    }
    
    return successor;
}`,
    },
    // ============== PROBLEM SECTIONS ==============
    {
      id: "bst-range-queries",
      title: "Range Sum / Range Count in BST",
      type: "problem",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/range-sum-of-bst/",
      content: `
## Range Sum / Range Count in BST

This is a classic **Binary Search Tree pruning problem** where understanding BST properties turns a brute-force traversal into an optimized solution.

### 📘 Problem Statement
Given the root of a **Binary Search Tree (BST)** and two integers **L** and **R**, return:
- **Range Sum**: Sum of all node values such that \`L ≤ node.val ≤ R\`
- **Range Count**: Number of nodes whose values lie in the same range

### 🌳 BST Visual (Example)
\`\`\`
              10
            /    \\
           5      15
          / \\       \\
         3   7       18
\`\`\`

Let **L = 7** and **R = 15**
- Valid nodes: 7, 10, 15
- Range Sum = **32**
- Range Count = **3**

### 🧠 Core Intuition: BST Pruning
> **BST Property:**
> - Left subtree → values < node.val
> - Right subtree → values > node.val

#### Pruning Rules:
1. If \`node.val < L\` → Skip **left subtree** (all values there are even smaller)
2. If \`node.val > R\` → Skip **right subtree** (all values there are even larger)
3. If \`L ≤ node.val ≤ R\` → Include node and search BOTH sides

This converts a naive **O(n)** traversal into **O(h + k)**, where **h** is height and **k** is number of nodes in range.

### 🐍 Python Solution – Range Sum
\`\`\`python
def rangeSumBST(root, L, R):
    if not root:
        return 0

    # Node value too small → skip left subtree
    if root.val < L:
        return rangeSumBST(root.right, L, R)

    # Node value too large → skip right subtree
    if root.val > R:
        return rangeSumBST(root.left, L, R)

    # Node in range → include and explore both sides
    return (
        root.val +
        rangeSumBST(root.left, L, R) +
        rangeSumBST(root.right, L, R)
    )
\`\`\`

### 🐍 Python Solution – Range Count
\`\`\`python
def rangeCountBST(root, L, R):
    if not root:
        return 0

    if root.val < L:
        return rangeCountBST(root.right, L, R)

    if root.val > R:
        return rangeCountBST(root.left, L, R)

    return (
        1 +
        rangeCountBST(root.left, L, R) +
        rangeCountBST(root.right, L, R)
    )
\`\`\`

### ⏱️ Time & Space Complexity
| Approach | Time | Space |
| --- | --- | --- |
| Naive DFS | O(n) | O(h) |
| BST Pruning | **O(h + k)** | O(h) |

### 🎯 Interview Takeaways
- Always ask: **Is this a BST?**
- BST → think **pruning, not traversal**
- Skip entire subtrees confidently
- This pattern appears in: **Range queries**, **Closest value in BST**, **Floor / Ceil problems**

**Interview One-Liner:** "Because it’s a BST, I prune subtrees that cannot possibly lie in the range."
      `,
      code: `// Range Sum in BST (JavaScript)
function rangeSumBST(root, L, R) {
    if (!root) return 0;

    // Node value too small → skip left subtree
    if (root.val < L) return rangeSumBST(root.right, L, R);

    // Node value too large → skip right subtree
    if (root.val > R) return rangeSumBST(root.left, L, R);

    // Node in range → include and explore both sides
    return root.val + rangeSumBST(root.left, L, R) + rangeSumBST(root.right, L, R);
}

// Range Count in BST (JavaScript)
function rangeCountBST(root, L, R) {
    if (!root) return 0;

    if (root.val < L) return rangeCountBST(root.right, L, R);
    if (root.val > R) return rangeCountBST(root.left, L, R);

    return 1 + rangeCountBST(root.left, L, R) + rangeCountBST(root.right, L, R);
}`,
    },
    {
      id: "problem-max-depth",
      title: "Maximum Depth of Binary Tree",
      type: "problem",
      difficulty: "Easy",
      companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
      leetcode: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
      content: `
## LeetCode #104: Maximum Depth of Binary Tree

Given the root of a binary tree, return its maximum depth.

### Example
\`\`\`
Input: root = [3,9,20,null,null,15,7]
Output: 3
\`\`\`

### Approaches
1. **DFS (Recursive)**: Return 1 + max(left depth, right depth)
2. **BFS**: Count number of levels
      `,
      code: `// DFS Recursive - O(n) time, O(h) space
function maxDepth(root) {
    if (!root) return 0;
    
    const leftDepth = maxDepth(root.left);
    const rightDepth = maxDepth(root.right);
    
    return 1 + Math.max(leftDepth, rightDepth);
}

// BFS Level Order - O(n) time, O(w) space (w = max width)
function maxDepthBFS(root) {
    if (!root) return 0;
    
    let depth = 0;
    const queue = [root];
    
    while (queue.length > 0) {
        depth++;
        const levelSize = queue.length;
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }
    
    return depth;
}

// Dry Run on [3,9,20,null,null,15,7]:
//       3          depth 1
//      / \\
//     9   20       depth 2
//        /  \\
//       15   7     depth 3
//
// DFS:
// maxDepth(3) = 1 + max(maxDepth(9), maxDepth(20))
// maxDepth(9) = 1 + max(0, 0) = 1
// maxDepth(20) = 1 + max(maxDepth(15), maxDepth(7))
// maxDepth(15) = 1, maxDepth(7) = 1
// maxDepth(20) = 1 + max(1, 1) = 2
// maxDepth(3) = 1 + max(1, 2) = 3`,
    },
    {
      id: "problem-invert-tree",
      title: "Invert Binary Tree",
      type: "problem",
      difficulty: "Easy",
      companies: ["Amazon", "Google", "Microsoft", "Apple", "Facebook"],
      leetcode: "https://leetcode.com/problems/invert-binary-tree/",
      content: `
## LeetCode #226: Invert Binary Tree

Given the root of a binary tree, invert the tree and return its root.

### Example
\`\`\`
Input:     4           Output:    4
         /   \\                  /   \\
        2     7       →       7     2
       / \\   / \\              / \\   / \\
      1   3 6   9            9   6 3   1
\`\`\`

### Key Insight
Swap left and right children recursively for each node.
      `,
      code: `// Recursive - O(n) time, O(h) space
function invertTree(root) {
    if (!root) return null;
    
    // Swap children
    [root.left, root.right] = [root.right, root.left];
    
    // Recursively invert subtrees
    invertTree(root.left);
    invertTree(root.right);
    
    return root;
}

// Alternative: Process children first, then swap
function invertTree2(root) {
    if (!root) return null;
    
    const left = invertTree2(root.left);
    const right = invertTree2(root.right);
    
    root.left = right;
    root.right = left;
    
    return root;
}

// Iterative BFS
function invertTreeBFS(root) {
    if (!root) return null;
    
    const queue = [root];
    
    while (queue.length > 0) {
        const node = queue.shift();
        
        // Swap children
        [node.left, node.right] = [node.right, node.left];
        
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
    }
    
    return root;
}

// Iterative DFS with Stack
function invertTreeDFS(root) {
    if (!root) return null;
    
    const stack = [root];
    
    while (stack.length > 0) {
        const node = stack.pop();
        
        [node.left, node.right] = [node.right, node.left];
        
        if (node.left) stack.push(node.left);
        if (node.right) stack.push(node.right);
    }
    
    return root;
}`,
    },
    {
      id: "problem-same-tree",
      title: "Same Tree",
      type: "problem",
      difficulty: "Easy",
      companies: ["Amazon", "Microsoft", "Bloomberg", "Facebook", "Google"],
      leetcode: "https://leetcode.com/problems/same-tree/",
      content: `
## LeetCode #100: Same Tree

Given the roots of two binary trees p and q, check if they are the same.

### Key Insight
Two trees are the same if:
1. Both roots are null, OR
2. Values are equal AND left subtrees are same AND right subtrees are same
      `,
      code: `// Recursive - O(n) time, O(h) space
function isSameTree(p, q) {
    // Both null - same
    if (!p && !q) return true;
    
    // One null, one not - different
    if (!p || !q) return false;
    
    // Values different - different
    if (p.val !== q.val) return false;
    
    // Recursively check subtrees
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}

// Iterative BFS
function isSameTreeBFS(p, q) {
    const queue = [[p, q]];
    
    while (queue.length > 0) {
        const [node1, node2] = queue.shift();
        
        if (!node1 && !node2) continue;
        if (!node1 || !node2) return false;
        if (node1.val !== node2.val) return false;
        
        queue.push([node1.left, node2.left]);
        queue.push([node1.right, node2.right]);
    }
    
    return true;
}`,
    },
    {
      id: "problem-lca",
      title: "Lowest Common Ancestor of BST",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Microsoft", "Facebook", "LinkedIn", "Apple"],
      leetcode:
        "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
      content: `
## LeetCode #235: Lowest Common Ancestor of a BST

Given a BST and two nodes p and q, find their lowest common ancestor (LCA).

### Key Insight for BST
Use BST property:
- If both p and q are smaller than root → LCA is in left subtree
- If both are larger → LCA is in right subtree
- Otherwise → current node is LCA (split point)
      `,
      code: `// BST approach - O(h) time
function lowestCommonAncestor(root, p, q) {
    while (root) {
        if (p.val < root.val && q.val < root.val) {
            // Both in left subtree
            root = root.left;
        } else if (p.val > root.val && q.val > root.val) {
            // Both in right subtree
            root = root.right;
        } else {
            // Split point - this is the LCA
            return root;
        }
    }
    
    return null;
}

// Recursive version
function lowestCommonAncestorRecursive(root, p, q) {
    if (p.val < root.val && q.val < root.val) {
        return lowestCommonAncestorRecursive(root.left, p, q);
    }
    if (p.val > root.val && q.val > root.val) {
        return lowestCommonAncestorRecursive(root.right, p, q);
    }
    return root;
}

// LCA for general Binary Tree (not BST) - LeetCode #236
function lowestCommonAncestorBT(root, p, q) {
    if (!root || root === p || root === q) return root;
    
    const left = lowestCommonAncestorBT(root.left, p, q);
    const right = lowestCommonAncestorBT(root.right, p, q);
    
    // If both sides return non-null, current node is LCA
    if (left && right) return root;
    
    // Otherwise, return the non-null side
    return left || right;
}

// Dry Run for BST [6,2,8,0,4,7,9], p=2, q=8:
//        6
//       / \\
//      2   8
//     / \\ / \\
//    0  4 7  9
//
// root=6: p=2<6, but q=8>6 → split point, return 6
// LCA(2, 8) = 6

// Dry Run for p=2, q=4:
// root=6: both < 6, go left
// root=2: p=2=2, q=4>2 → split point, return 2
// LCA(2, 4) = 2`,
    },
    {
      id: "problem-level-order",
      title: "Binary Tree Level Order Traversal",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
      leetcode:
        "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      content: `
## LeetCode #102: Binary Tree Level Order Traversal

Given the root of a binary tree, return the level order traversal (i.e., from left to right, level by level).

### Example
\`\`\`
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]
\`\`\`

### Key Insight: BFS with Level Tracking
Use queue and process nodes level by level by tracking level size.
      `,
      code: `// BFS with Queue - O(n) time, O(n) space
function levelOrder(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result;
}

// DFS with depth tracking
function levelOrderDFS(root) {
    const result = [];
    
    function dfs(node, depth) {
        if (!node) return;
        
        // Create new level array if needed
        if (result.length === depth) {
            result.push([]);
        }
        
        result[depth].push(node.val);
        dfs(node.left, depth + 1);
        dfs(node.right, depth + 1);
    }
    
    dfs(root, 0);
    return result;
}

// Related: Zigzag Level Order (LeetCode #103)
function zigzagLevelOrder(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    let leftToRight = true;
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            
            if (leftToRight) {
                currentLevel.push(node.val);
            } else {
                currentLevel.unshift(node.val);
            }
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
        leftToRight = !leftToRight;
    }
    
    return result;
}`,
    },
    {
      id: "problem-serialize-deserialize",
      title: "Serialize and Deserialize Binary Tree",
      type: "problem",
      difficulty: "Hard",
      companies: ["Amazon", "Microsoft", "Facebook", "Google", "LinkedIn"],
      leetcode:
        "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
      content: `
## LeetCode #297: Serialize and Deserialize Binary Tree

Design an algorithm to serialize and deserialize a binary tree.

### Key Insight
Use preorder traversal for serialization. Mark null nodes with a special character.
For deserialization, rebuild tree using the same traversal order.
      `,
      code: `// Preorder DFS approach
function serialize(root) {
    const result = [];
    
    function dfs(node) {
        if (!node) {
            result.push('null');
            return;
        }
        result.push(node.val.toString());
        dfs(node.left);
        dfs(node.right);
    }
    
    dfs(root);
    return result.join(',');
}

function deserialize(data) {
    const values = data.split(',');
    let index = 0;
    
    function dfs() {
        if (values[index] === 'null') {
            index++;
            return null;
        }
        
        const node = new TreeNode(parseInt(values[index]));
        index++;
        node.left = dfs();
        node.right = dfs();
        
        return node;
    }
    
    return dfs();
}

// Example:
//       1
//      / \\
//     2   3
//        / \\
//       4   5
//
// Serialize: "1,2,null,null,3,4,null,null,5,null,null"
// Preorder: Visit 1 → Visit 2 → null → null → Visit 3 → Visit 4 → null → null → Visit 5 → null → null

// BFS approach (Level Order)
function serializeBFS(root) {
    if (!root) return '';
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const node = queue.shift();
        
        if (node) {
            result.push(node.val);
            queue.push(node.left);
            queue.push(node.right);
        } else {
            result.push('null');
        }
    }
    
    // Remove trailing nulls
    while (result[result.length - 1] === 'null') {
        result.pop();
    }
    
    return result.join(',');
}

function deserializeBFS(data) {
    if (!data) return null;
    
    const values = data.split(',');
    const root = new TreeNode(parseInt(values[0]));
    const queue = [root];
    let i = 1;
    
    while (queue.length > 0 && i < values.length) {
        const node = queue.shift();
        
        // Left child
        if (i < values.length && values[i] !== 'null') {
            node.left = new TreeNode(parseInt(values[i]));
            queue.push(node.left);
        }
        i++;
        
        // Right child
        if (i < values.length && values[i] !== 'null') {
            node.right = new TreeNode(parseInt(values[i]));
            queue.push(node.right);
        }
        i++;
    }
    
    return root;
}`,
    },
    {
      id: "problem-binary-tree-paths",
      title: "Binary Tree Maximum Path Sum",
      type: "problem",
      difficulty: "Hard",
      companies: ["Amazon", "Facebook", "Google", "Microsoft", "DoorDash"],
      leetcode: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
      content: `
## LeetCode #124: Binary Tree Maximum Path Sum

A path in a binary tree is a sequence of nodes where each pair is connected by an edge. Find the maximum path sum.

### Key Insight
For each node, calculate:
1. Max path sum passing through this node (can include both children)
2. Max sum we can contribute to parent (can only include one child)

Use global variable to track overall maximum.
      `,
      code: `function maxPathSum(root) {
    let maxSum = -Infinity;
    
    function dfs(node) {
        if (!node) return 0;
        
        // Get max sum from left and right subtrees
        // Use 0 if negative (don't include that path)
        const leftMax = Math.max(0, dfs(node.left));
        const rightMax = Math.max(0, dfs(node.right));
        
        // Path through this node (could be maximum)
        const pathThroughNode = node.val + leftMax + rightMax;
        maxSum = Math.max(maxSum, pathThroughNode);
        
        // Return max path that can be extended to parent
        // Can only go through one child
        return node.val + Math.max(leftMax, rightMax);
    }
    
    dfs(root);
    return maxSum;
}

// Dry Run on [-10, 9, 20, null, null, 15, 7]:
//       -10
//       /  \\
//      9    20
//          /  \\
//         15   7
//
// dfs(15): leftMax=0, rightMax=0
//   pathThrough = 15, maxSum = 15
//   return 15
// dfs(7): return 7, maxSum = 15
// dfs(20): leftMax=15, rightMax=7
//   pathThrough = 20+15+7 = 42, maxSum = 42
//   return 20+15 = 35
// dfs(9): leftMax=0, rightMax=0
//   pathThrough = 9, maxSum = 42
//   return 9
// dfs(-10): leftMax=9, rightMax=35
//   pathThrough = -10+9+35 = 34, maxSum = 42
//   return -10+35 = 25
//
// Answer: 42 (path 15 → 20 → 7)

// Related: Path Sum II (LeetCode #113) - Find all root-to-leaf paths with target sum
function pathSum(root, targetSum) {
    const result = [];
    
    function dfs(node, remaining, path) {
        if (!node) return;
        
        path.push(node.val);
        
        if (!node.left && !node.right && remaining === node.val) {
            result.push([...path]);
        }
        
        dfs(node.left, remaining - node.val, path);
        dfs(node.right, remaining - node.val, path);
        
        path.pop(); // Backtrack
    }
    
    dfs(root, targetSum, []);
    return result;
}`,
    },
    {
      id: "guide-path-sums",
      title: "Binary Tree Path Sums (Complete Guide)",
      type: "guide",
      content: `
# Binary Tree Path Sum – Complete Interview Guide

This document covers **Path Sum I, II, III, and Maximum Path Sum** with intuition-first explanations, dry runs, and Python solutions.

---

## 🌳 Common Binary Tree Used

\`\`\`
        10
       /  \\
      5   -3
     / \\    \\
    3   2    11
   / \\   \\
  3  -2   1
\`\`\`

---

## 1️⃣ Path Sum I

### 📘 Problem
Given the root of a binary tree and a target sum, return **true** if the tree has a **root-to-leaf** path such that adding up all the values along the path equals the target sum.

### 🧠 Intuition
- Start ONLY from root
- End ONLY at leaf
- Subtract node value from target while going down
- At leaf → remaining sum must be zero

### 🧪 Dry Run (Target = 18)
\`\`\`
10 → remaining = 8
5  → remaining = 3
2  → remaining = 1
1  → remaining = 0 ✔ (leaf)
\`\`\`

### 🐍 Python Solution
\`\`\`python
def hasPathSum(root, target):
    if not root:
        return False

    if not root.left and not root.right:
        return target == root.val

    return (
        hasPathSum(root.left, target - root.val) or
        hasPathSum(root.right, target - root.val)
    )
\`\`\`

---

## 2️⃣ Path Sum II

### 📘 Problem
Return **all root-to-leaf paths** where the sum of node values equals target.

### 🧠 Intuition
- Same as Path Sum I
- Maintain a path list
- Save path when valid leaf is reached
- Backtrack after recursion

### 🧪 Dry Run
\`\`\`
Path = [10]
Path = [10, 5]
Path = [10, 5, 2]
Path = [10, 5, 2, 1] ✔ save
Backtrack
\`\`\`

### 🐍 Python Solution
\`\`\`python
def pathSum(root, target):
    res = []

    def dfs(node, remaining, path):
        if not node:
            return

        path.append(node.val)

        if not node.left and not node.right and remaining == node.val:
            res.append(path[:])

        dfs(node.left, remaining - node.val, path)
        dfs(node.right, remaining - node.val, path)

        path.pop()

    dfs(root, target, [])
    return res
\`\`\`

---

## 3️⃣ Path Sum III

### 📘 Problem
Count the number of paths where the sum equals target.
Paths can start and end anywhere but must go downward.

### 🧠 Intuition
- Each node can be a starting point
- Count downward paths from each node
- No need to end at leaf

### 🧪 Dry Run (Target = 8)
\`\`\`
5 → 3 ✔
5 → 2 → 1 ✔
-3 → 11 ✔
Total = 3
\`\`\`

### 🐍 Python Solution
\`\`\`python
def pathSum(root, target):
    def countFrom(node, remaining):
        if not node:
            return 0

        count = 1 if node.val == remaining else 0
        count += countFrom(node.left, remaining - node.val)
        count += countFrom(node.right, remaining - node.val)
        return count

    if not root:
        return 0

    return (
        countFrom(root, target) +
        pathSum(root.left, target) +
        pathSum(root.right, target)
    )
\`\`\`

---

## 4️⃣ Maximum Path Sum

### 📘 Problem
Find the maximum sum of any path in the tree.
Path can start and end at any node and may turn.

### 🧠 Intuition
- At each node compute max path THROUGH it
- Return only one side upward
- Ignore negative contributions

### 🧪 Dry Run
\`\`\`
At node 5:
Left = 3
Right = 3
Through = 11
Return = 8

At node 10:
Left = 18
Right = 8
Through = 36 ✔
\`\`\`

### 🐍 Python Solution
\`\`\`python
def maxPathSum(root):
    max_sum = float('-inf')

    def dfs(node):
        nonlocal max_sum
        if not node:
            return 0

        left = max(dfs(node.left), 0)
        right = max(dfs(node.right), 0)

        max_sum = max(max_sum, node.val + left + right)
        return node.val + max(left, right)

    dfs(root)
    return max_sum
\`\`\`

---

## 🎯 Final Comparison

| Problem | Start | End | Can Turn? | Return |
|---------|-------|-----|-----------|--------|
| Path Sum I | Root | Leaf | No | Boolean |
| Path Sum II | Root | Leaf | No | Paths |
| Path Sum III | Any | Any | No | Count |
| Max Path Sum | Any | Any | Yes | Maximum |

---

**Interview Rule:**
Before coding any tree problem, first fix:
*where paths start, where they end, and what is allowed.*
      `,
      code: `# 1. Path Sum I
def hasPathSum(root, target):
    if not root:
        return False
    if not root.left and not root.right:
        return target == root.val
    return (
        hasPathSum(root.left, target - root.val) or
        hasPathSum(root.right, target - root.val)
    )

# 2. Path Sum II
def pathSum(root, target):
    res = []
    def dfs(node, remaining, path):
        if not node:
            return
        path.append(node.val)
        if not node.left and not node.right and remaining == node.val:
            res.append(path[:])
        dfs(node.left, remaining - node.val, path)
        dfs(node.right, remaining - node.val, path)
        path.pop()
    dfs(root, target, [])
    return res

# 3. Path Sum III
def pathSumIII(root, target):
    def countFrom(node, remaining):
        if not node:
            return 0
        count = 1 if node.val == remaining else 0
        count += countFrom(node.left, remaining - node.val)
        count += countFrom(node.right, remaining - node.val)
        return count
    if not root:
        return 0
    return (
        countFrom(root, target) +
        pathSumIII(root.left, target) +
        pathSumIII(root.right, target)
    )

# 4. Maximum Path Sum
def maxPathSum(root):
    max_sum = float('-inf')
    def dfs(node):
        nonlocal max_sum
        if not node:
            return 0
        left = max(dfs(node.left), 0)
        right = max(dfs(node.right), 0)
        max_sum = max(max_sum, node.val + left + right)
        return node.val + max(left, right)
    dfs(root)
    return max_sum`,
    },
    // ============== ADVANCED TREE ALGORITHMS ==============
    {
      id: "morris-traversal",
      title: "Morris Traversal: O(1) Space Tree Traversal",
      type: "theory",
      content: `
## Morris Traversal: The Space-Optimal Solution 🚀

Traverse a binary tree **without stack or recursion** using threaded binary tree concept.

<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 24px; margin: 20px 0;">
  <h3 style="color: #4ade80; margin: 0 0 20px 0; text-align: center;">🎯 Why Morris Traversal?</h3>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
    <div style="background: #0f3460; padding: 16px; border-radius: 12px; text-align: center;">
      <div style="font-size: 28px; margin-bottom: 8px;">📚</div>
      <div style="color: #f87171; font-weight: bold;">Recursive</div>
      <div style="color: #94a3b8; font-size: 12px;">O(h) stack space</div>
    </div>
    
    <div style="background: #0f3460; padding: 16px; border-radius: 12px; text-align: center;">
      <div style="font-size: 28px; margin-bottom: 8px;">📋</div>
      <div style="color: #fbbf24; font-weight: bold;">Iterative</div>
      <div style="color: #94a3b8; font-size: 12px;">O(h) explicit stack</div>
    </div>
    
    <div style="background: #0f3460; padding: 16px; border-radius: 12px; text-align: center; border: 2px solid #4ade80;">
      <div style="font-size: 28px; margin-bottom: 8px;">🧵</div>
      <div style="color: #4ade80; font-weight: bold;">Morris</div>
      <div style="color: #94a3b8; font-size: 12px;">O(1) space!</div>
    </div>
  </div>
</div>

### The Key Idea: Threaded Binary Tree

1. Find inorder predecessor of current node
2. Make current node the right child of predecessor (create thread)
3. Follow thread back after processing left subtree
4. Remove thread to restore tree structure

### When to Use
- Memory-critical environments
- Very deep trees where O(h) stack is too much
- Interview optimization question
      `,
      code: `// ═══════════════════════════════════════════════════════════
// MORRIS INORDER TRAVERSAL - O(1) SPACE
// ═══════════════════════════════════════════════════════════

function morrisInorder(root) {
    const result = [];
    let current = root;
    
    while (current) {
        if (!current.left) {
            // No left subtree: visit and go right
            result.push(current.val);
            current = current.right;
        } else {
            // Find inorder predecessor
            let predecessor = current.left;
            while (predecessor.right && predecessor.right !== current) {
                predecessor = predecessor.right;
            }
            
            if (!predecessor.right) {
                // Create thread: predecessor → current
                predecessor.right = current;
                current = current.left;
            } else {
                // Thread exists: remove it and visit
                predecessor.right = null;
                result.push(current.val);
                current = current.right;
            }
        }
    }
    
    return result;
}

// Dry Run:
//        4
//       / \\
//      2   6
//     / \\
//    1   3
//
// Step 1: current=4, has left
//   predecessor=2→3 (rightmost in left subtree)
//   3.right = 4 (create thread)
//   current = 2
//
// Step 2: current=2, has left
//   predecessor=1 (no right)
//   1.right = 2 (create thread)
//   current = 1
//
// Step 3: current=1, no left
//   Visit 1, current = 1.right = 2 (via thread)
//
// Step 4: current=2, has left, but 1.right = 2 (thread exists!)
//   Remove thread: 1.right = null
//   Visit 2, current = 3
//
// Step 5: current=3, no left
//   Visit 3, current = 4 (via thread)
//
// Step 6: current=4, has left, but 3.right = 4 (thread exists!)
//   Remove thread
//   Visit 4, current = 6
//
// Step 7: current=6, no left
//   Visit 6, current = null
//
// Result: [1, 2, 3, 4, 6]


// ═══════════════════════════════════════════════════════════
// MORRIS PREORDER TRAVERSAL
// ═══════════════════════════════════════════════════════════

function morrisPreorder(root) {
    const result = [];
    let current = root;
    
    while (current) {
        if (!current.left) {
            result.push(current.val);
            current = current.right;
        } else {
            let predecessor = current.left;
            while (predecessor.right && predecessor.right !== current) {
                predecessor = predecessor.right;
            }
            
            if (!predecessor.right) {
                result.push(current.val);  // Visit BEFORE going left
                predecessor.right = current;
                current = current.left;
            } else {
                predecessor.right = null;
                current = current.right;
            }
        }
    }
    
    return result;
}


// ═══════════════════════════════════════════════════════════
// APPLICATION: RECOVER BST (LeetCode #99)
// ═══════════════════════════════════════════════════════════

// Two elements of BST are swapped by mistake. Recover it.
function recoverTree(root) {
    let first = null, second = null, prev = null;
    let current = root;
    
    while (current) {
        if (!current.left) {
            // Check for violation
            if (prev && prev.val > current.val) {
                if (!first) first = prev;
                second = current;
            }
            prev = current;
            current = current.right;
        } else {
            let predecessor = current.left;
            while (predecessor.right && predecessor.right !== current) {
                predecessor = predecessor.right;
            }
            
            if (!predecessor.right) {
                predecessor.right = current;
                current = current.left;
            } else {
                predecessor.right = null;
                // Check for violation
                if (prev && prev.val > current.val) {
                    if (!first) first = prev;
                    second = current;
                }
                prev = current;
                current = current.right;
            }
        }
    }
    
    // Swap the values
    [first.val, second.val] = [second.val, first.val];
}`,
    },
    {
      id: "lca-algorithms",
      title: "Lowest Common Ancestor: All Variants",
      type: "theory",
      content: `
## LCA: The Complete Guide 🌳

The **Lowest Common Ancestor** of two nodes p and q is the deepest node that has both p and q as descendants.

### LCA Variants

<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 24px; margin: 20px 0;">
  <table style="width: 100%; border-collapse: collapse; color: #e2e8f0;">
    <thead>
      <tr style="border-bottom: 2px solid #4ade80;">
        <th style="text-align: left; padding: 12px; color: #4ade80;">Tree Type</th>
        <th style="text-align: left; padding: 12px; color: #4ade80;">Approach</th>
        <th style="text-align: left; padding: 12px; color: #4ade80;">Time</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 12px;">Binary Tree</td>
        <td style="padding: 12px;">Recursive DFS</td>
        <td style="padding: 12px; color: #60a5fa;">O(n)</td>
      </tr>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 12px;">BST</td>
        <td style="padding: 12px;">Use BST property</td>
        <td style="padding: 12px; color: #60a5fa;">O(h)</td>
      </tr>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 12px;">With Parent Pointers</td>
        <td style="padding: 12px;">Like linked list intersection</td>
        <td style="padding: 12px; color: #60a5fa;">O(h)</td>
      </tr>
      <tr>
        <td style="padding: 12px;">Multiple Queries</td>
        <td style="padding: 12px;">Binary Lifting</td>
        <td style="padding: 12px; color: #60a5fa;">O(log n) per query</td>
      </tr>
    </tbody>
  </table>
</div>

### Key Insight for Binary Tree LCA

At each node, ask:
- Is p in left subtree? Is q in left subtree?
- Is p in right subtree? Is q in right subtree?
- Is current node p or q?

If we find answers in both subtrees → current is LCA!
      `,
      code: `// ═══════════════════════════════════════════════════════════
// LCA IN BINARY TREE (LeetCode #236)
// ═══════════════════════════════════════════════════════════

function lowestCommonAncestor(root, p, q) {
    // Base cases
    if (!root || root === p || root === q) {
        return root;
    }
    
    // Search in left and right subtrees
    const left = lowestCommonAncestor(root.left, p, q);
    const right = lowestCommonAncestor(root.right, p, q);
    
    // If both sides found something, current is LCA
    if (left && right) return root;
    
    // Otherwise, return the non-null side
    return left || right;
}

// Why this works:
// Case 1: p and q in different subtrees → both return non-null → current is LCA
// Case 2: p is ancestor of q (or vice versa) → first found returns up
// Case 3: Both in same subtree → that subtree returns the LCA


// ═══════════════════════════════════════════════════════════
// LCA IN BST (LeetCode #235)
// ═══════════════════════════════════════════════════════════

function lowestCommonAncestorBST(root, p, q) {
    let current = root;
    
    while (current) {
        if (p.val < current.val && q.val < current.val) {
            // Both in left subtree
            current = current.left;
        } else if (p.val > current.val && q.val > current.val) {
            // Both in right subtree
            current = current.right;
        } else {
            // Split point found - this is LCA
            return current;
        }
    }
    
    return null;
}


// ═══════════════════════════════════════════════════════════
// LCA WITH PARENT POINTERS (LeetCode #1650)
// ═══════════════════════════════════════════════════════════

function lowestCommonAncestorIII(p, q) {
    // Like finding intersection of two linked lists
    let a = p, b = q;
    
    while (a !== b) {
        a = a.parent ? a.parent : q;
        b = b.parent ? b.parent : p;
    }
    
    return a;
}

// Alternative: Using heights
function lowestCommonAncestorIIIv2(p, q) {
    // Get depths
    function getDepth(node) {
        let depth = 0;
        while (node.parent) {
            depth++;
            node = node.parent;
        }
        return depth;
    }
    
    let depthP = getDepth(p);
    let depthQ = getDepth(q);
    
    // Bring to same level
    while (depthP > depthQ) {
        p = p.parent;
        depthP--;
    }
    while (depthQ > depthP) {
        q = q.parent;
        depthQ--;
    }
    
    // Move up together
    while (p !== q) {
        p = p.parent;
        q = q.parent;
    }
    
    return p;
}


// ═══════════════════════════════════════════════════════════
// BINARY LIFTING FOR MULTIPLE LCA QUERIES
// ═══════════════════════════════════════════════════════════

class BinaryLifting {
    constructor(n, parent) {
        this.LOG = Math.ceil(Math.log2(n)) + 1;
        this.depth = new Array(n).fill(0);
        
        // up[node][j] = 2^j-th ancestor of node
        this.up = Array.from({ length: n }, () => new Array(this.LOG).fill(-1));
        
        // Build using parent array
        for (let i = 0; i < n; i++) {
            this.up[i][0] = parent[i];
        }
        
        for (let j = 1; j < this.LOG; j++) {
            for (let i = 0; i < n; i++) {
                if (this.up[i][j-1] !== -1) {
                    this.up[i][j] = this.up[this.up[i][j-1]][j-1];
                }
            }
        }
    }
    
    // Get k-th ancestor in O(log n)
    getKthAncestor(node, k) {
        for (let j = 0; j < this.LOG && node !== -1; j++) {
            if ((k >> j) & 1) {
                node = this.up[node][j];
            }
        }
        return node;
    }
    
    // LCA in O(log n) after O(n log n) preprocessing
    lca(u, v) {
        // Bring to same depth
        if (this.depth[u] < this.depth[v]) [u, v] = [v, u];
        
        const diff = this.depth[u] - this.depth[v];
        u = this.getKthAncestor(u, diff);
        
        if (u === v) return u;
        
        // Binary search for LCA
        for (let j = this.LOG - 1; j >= 0; j--) {
            if (this.up[u][j] !== this.up[v][j]) {
                u = this.up[u][j];
                v = this.up[v][j];
            }
        }
        
        return this.up[u][0];
    }
}`,
    },
    {
      id: "tree-dp-patterns",
      title: "Tree DP: Dynamic Programming on Trees",
      type: "theory",
      content: `
## Tree DP: When Recursion Meets Optimization 🌲

Tree DP combines tree traversal with dynamic programming to solve optimization problems on trees.

### Common Tree DP Patterns

<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 24px; margin: 20px 0;">
  <div style="display: grid; gap: 12px;">
    <div style="background: #0f3460; padding: 16px; border-radius: 12px;">
      <h4 style="color: #4ade80; margin: 0 0 8px 0;">Pattern 1: Subtree DP</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">dp[node] depends on dp of all children. Bottom-up computation.</p>
    </div>
    
    <div style="background: #0f3460; padding: 16px; border-radius: 12px;">
      <h4 style="color: #60a5fa; margin: 0 0 8px 0;">Pattern 2: Path DP</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">Track best path through each node. Return single chain upward.</p>
    </div>
    
    <div style="background: #0f3460; padding: 16px; border-radius: 12px;">
      <h4 style="color: #f472b6; margin: 0 0 8px 0;">Pattern 3: Rerooting</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">Compute answer for all nodes as root efficiently.</p>
    </div>
  </div>
</div>

### When to Use Tree DP

- Counting paths/subtrees with properties
- Finding maximum/minimum in subtrees
- Problems where state depends on children's states
      `,
      code: `// ═══════════════════════════════════════════════════════════
// TREE DP: HOUSE ROBBER III (LeetCode #337)
// ═══════════════════════════════════════════════════════════

// Can't rob two directly connected houses
function rob(root) {
    function dfs(node) {
        if (!node) return [0, 0];  // [rob, notRob]
        
        const left = dfs(node.left);
        const right = dfs(node.right);
        
        // Rob this node: can't rob children
        const robThis = node.val + left[1] + right[1];
        
        // Don't rob this: take max of each child
        const notRobThis = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
        
        return [robThis, notRobThis];
    }
    
    const result = dfs(root);
    return Math.max(result[0], result[1]);
}


// ═══════════════════════════════════════════════════════════
// TREE DP: DIAMETER OF BINARY TREE (LeetCode #543)
// ═══════════════════════════════════════════════════════════

function diameterOfBinaryTree(root) {
    let maxDiameter = 0;
    
    function depth(node) {
        if (!node) return 0;
        
        const left = depth(node.left);
        const right = depth(node.right);
        
        // Update diameter (path through current node)
        maxDiameter = Math.max(maxDiameter, left + right);
        
        // Return height for parent's calculation
        return 1 + Math.max(left, right);
    }
    
    depth(root);
    return maxDiameter;
}


// ═══════════════════════════════════════════════════════════
// TREE DP: BINARY TREE CAMERAS (LeetCode #968 - Hard)
// ═══════════════════════════════════════════════════════════

function minCameraCover(root) {
    let cameras = 0;
    
    // States: 0 = needs camera, 1 = has camera, 2 = covered
    function dfs(node) {
        if (!node) return 2;  // Null nodes are "covered"
        
        const left = dfs(node.left);
        const right = dfs(node.right);
        
        // If any child needs camera, put camera here
        if (left === 0 || right === 0) {
            cameras++;
            return 1;
        }
        
        // If any child has camera, we're covered
        if (left === 1 || right === 1) {
            return 2;
        }
        
        // Both children covered but no camera pointing at us
        return 0;
    }
    
    // If root needs camera, add one
    if (dfs(root) === 0) cameras++;
    
    return cameras;
}


// ═══════════════════════════════════════════════════════════
// INTERVIEW CHEAT SHEET: TREE PROBLEMS
// ═══════════════════════════════════════════════════════════

/*
TREE PROBLEM PATTERNS:

1. Height/Depth problems → Return height, track max
2. Path problems → Return chain, update through-path
3. Subtree problems → Aggregate from children
4. Level problems → BFS with queue
5. Validation → Track min/max bounds

COMMON TREE DP STATES:
- Include/exclude current node
- Take left path / right path / both
- State at node based on children's states

TRAVERSAL SELECTION:
- Preorder: Process before children (serialize, copy)
- Inorder: BST sorted order
- Postorder: Process after children (delete, aggregate)
- Level: Distance from root matters
- Morris: O(1) space required

TIME COMPLEXITY:
- Most tree traversals: O(n)
- BST operations: O(h) = O(log n) balanced, O(n) worst
- Binary Lifting LCA: O(log n) per query after O(n log n) prep
*/`,
    },
  ],
};
