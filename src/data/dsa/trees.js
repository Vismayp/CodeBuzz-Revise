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
  ],
};
