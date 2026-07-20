export const expandedTreeSections = [
  {
    id: "tree-recursive-mental-model",
    title: "The Recursive Mental Model for Trees",
    type: "theory",
    content: `
## Every node is the root of a smaller tree

A binary-tree algorithm becomes manageable when the function contract is stated from one node's perspective. The function does not need to know where the node sits in the original tree; it only needs to solve the subtree rooted there.

### The three questions

1. What should the function return for an empty subtree?
2. What information should each child return?
3. How does the parent combine the child answers with its own value?

For height measured in nodes, an empty subtree returns 0 and a node returns **1 + max(left height, right height)**.

### Structural induction

Tree recursion proofs mirror the code:

- Base: the algorithm is correct for an empty node or leaf.
- Hypothesis: recursive calls correctly solve both child subtrees.
- Step: the combine rule produces the correct answer for the current subtree.

### Local return versus global answer

Some problems return exactly what the parent needs, such as subtree height. Others also update a global result using both children, such as diameter. A path returned upward may use only one child, while a path considered as a complete answer may connect both children through the node.

### Complexity

If every node is visited once and combine work is O(1), time is O(n). Recursive stack space is O(h): O(log n) for a balanced tree and O(n) for a chain.
    `,
    diagram: `flowchart TD
      A["solve(node)"] --> B["solve(left)"]
      A --> C["solve(right)"]
      B --> D["left summary"]
      C --> E["right summary"]
      D --> F["combine with node"]
      E --> F
      F --> G["return subtree summary"]`,
    code: `def analyze_tree(root):
    def solve(node):
        if node is None:
            return 0, 0

        left_height, left_size = solve(node.left)
        right_height, right_size = solve(node.right)
        height = 1 + max(left_height, right_height)
        size = 1 + left_size + right_size
        return height, size

    return solve(root)`,
  },
  {
    id: "tree-traversal-stack-frames",
    title: "Tree Traversals as Stack-Frame Events",
    type: "theory",
    content: `
## Preorder, inorder, and postorder differ only in when the node is processed

Imagine each recursive frame has three events:

1. Enter node.
2. Return from left child.
3. Return from right child.

| Traversal | Processing event | Typical use |
|---|---|---|
| Preorder | On entry | Copying, serialization, root-to-leaf state |
| Inorder | Between children | Sorted BST order, ordered queries |
| Postorder | After both children | Heights, deletion, subtree DP |
| Level order | By queue depth | Nearest level, width, minimum depth |

### Iterative traversal

Recursion stores the current node and next event in the call stack. An iterative algorithm must store equivalent information explicitly. Inorder keeps pushing left children, then processes a popped node and moves right. General postorder can store a visited flag or track the previous node.

### Morris traversal

Morris inorder temporarily threads each node's inorder predecessor back to the node. It achieves O(1) auxiliary space but modifies pointers during traversal and is harder to reason about. Restore every temporary edge.

### Traversal is not the solution by itself

Choose traversal from dependencies: if a parent needs child answers, use postorder. If children need an accumulated parent state, use preorder. Some problems need both passes.
    `,
    diagram: `flowchart LR
      A["Enter node: preorder event"] --> B["Traverse left"]
      B --> C["Between children: inorder event"]
      C --> D["Traverse right"]
      D --> E["Exit node: postorder event"]`,
    code: `def iterative_traversals(root):
    if root is None:
        return [], [], []

    preorder, inorder, postorder = [], [], []
    stack = [(root, 0)]
    while stack:
        node, event = stack.pop()
        if event == 0:
            preorder.append(node.val)
            stack.append((node, 1))
            if node.left:
                stack.append((node.left, 0))
        elif event == 1:
            inorder.append(node.val)
            stack.append((node, 2))
            if node.right:
                stack.append((node.right, 0))
        else:
            postorder.append(node.val)
    return preorder, inorder, postorder`,
  },
  {
    id: "bst-invariant-deep-dive",
    title: "BST Invariants, Search, and Balanced Variants",
    type: "theory",
    content: `
## A BST stores an ordering invariant over whole subtrees

For every node, all keys in the left subtree are smaller and all keys in the right subtree are larger, subject to a documented duplicate policy. Comparing only a node with its immediate children is insufficient.

### Range validation

Pass an allowed interval downward. A left child inherits the parent's upper bound; a right child inherits the lower bound. This validates the global property in O(n).

### Operation cost follows height

Search, insertion, deletion, predecessor, and successor take O(h). A balanced BST keeps h=O(log n); an ordinary BST can degrade into a chain with h=O(n).

| Balanced structure | Guarantee or idea |
|---|---|
| AVL | Strict height balance, rotations after updates |
| Red-black | Color invariants imply logarithmic height |
| Treap | BST by key, heap by randomized priority |
| B-tree / B+ tree | Many children per node for storage systems |

### Deletion cases

- Leaf: remove directly.
- One child: splice the child upward.
- Two children: replace with inorder successor or predecessor, then delete that replacement from its original location.

If only static ordered lookup is needed, a sorted array may be simpler and more cache-friendly. BSTs matter when ordered updates and queries must coexist.
    `,
    diagram: `flowchart TD
      A["node with range (low, high)"] --> B["left range (low, node)"]
      A --> C["right range (node, high)"]
      B --> D{"all values valid?"}
      C --> D
      D --> E["global BST invariant"]`,
    code: `def is_valid_bst(root):
    def valid(node, lower, upper):
        if node is None:
            return True
        if not lower < node.val < upper:
            return False
        return (valid(node.left, lower, node.val)
                and valid(node.right, node.val, upper))

    return valid(root, float("-inf"), float("inf"))`,
  },
  {
    id: "tree-path-patterns-expanded",
    title: "Tree Path Patterns: Downward, Rooted, and Any-to-Any",
    type: "theory",
    content: `
## Define what a path may do before choosing state

| Path type | Typical state |
|---|---|
| Root to leaf | Accumulated value passed downward |
| Node to descendant | Prefix state or returned downward summary |
| Any node to any node | One-branch return plus two-branch global candidate |
| Count paths with target sum | Prefix-sum frequencies along current root path |

### Maximum path sum

The value returned to a parent must be a single downward branch because a path cannot fork and then continue upward. At the current node, however, a complete candidate may join the best nonnegative left branch and right branch.

### Prefix sums on trees

For target-sum paths, maintain counts of prefix sums only on the current recursion path. A path ending at the current node sums to target when an earlier prefix equals currentSum-target. Decrement the count while backtracking so sibling branches do not contaminate each other.

### Edge cases

- All-negative values mean an empty path may not be allowed.
- “Leaf” means both children are absent, not merely one.
- Clarify whether path length counts nodes or edges.
    `,
    diagram: `flowchart TD
      L["best left branch"] --> N["node"]
      R["best right branch"] --> N
      N --> G["global candidate: left + node + right"]
      N --> P["return to parent: node + max(one branch)"]`,
    code: `def maximum_path_sum(root):
    best = float("-inf")

    def downward(node):
        nonlocal best
        if node is None:
            return 0
        left = max(0, downward(node.left))
        right = max(0, downward(node.right))
        best = max(best, left + node.val + right)
        return node.val + max(left, right)

    downward(root)
    return best`,
  },
  {
    id: "lca-unified-framework",
    title: "Lowest Common Ancestor: A Unified Framework",
    type: "theory",
    content: `
## LCA is the deepest node whose subtree contains both targets

### General binary tree

Postorder returns a target if found. If left and right both return non-null, the current node is their split point and therefore the LCA. If only one side returns a result, propagate it.

### Binary search tree

Ordering removes recursion: if both targets are smaller, go left; if both larger, go right; otherwise the current node is the split.

### Many queries on a static tree

Preprocess ancestors using binary lifting. Store up[node][k], the 2^k-th ancestor. Equalize depths, then lift both nodes from the largest power downward until their parents match. Preprocessing is O(n log n), each query O(log n).

### Euler tour plus RMQ

Record nodes during a DFS Euler tour with their depths. LCA becomes the minimum-depth node between first occurrences, answered by a range-minimum structure.

### Presence contract

The simple binary-tree algorithm assumes both targets exist. If not guaranteed, return both the candidate and how many targets were found.
    `,
    diagram: `flowchart TD
      A["current node"] --> B["search left"]
      A --> C["search right"]
      B --> D{"targets split across sides?"}
      C --> D
      D -->|yes| E["current is LCA"]
      D -->|no| F["propagate non-null side"]`,
    code: `def lowest_common_ancestor(root, first, second):
    def search(node):
        if node is None:
            return None, 0

        left_lca, left_found = search(node.left)
        if left_found == 2:
            return left_lca, 2
        right_lca, right_found = search(node.right)
        if right_found == 2:
            return right_lca, 2

        found = left_found + right_found + int(node is first or node is second)
        candidate = node if found == 2 else left_lca or right_lca or (node if node is first or node is second else None)
        return candidate, found

    candidate, found = search(root)
    return candidate if found == 2 else None`,
  },
  {
    id: "tree-construction-serialization",
    title: "Tree Construction and Serialization",
    type: "theory",
    content: `
## Traversal order plus null structure determines a tree

### Rebuild from preorder and inorder

Preorder's first value is the root. Its position in inorder separates left and right subtrees. A value-to-index map avoids repeated scans, giving O(n) time for distinct values.

Inorder plus postorder works similarly using postorder's last value. Preorder plus postorder alone does not uniquely determine a general binary tree.

### Serialization

Preorder with explicit null markers is self-delimiting: each non-null token consumes two child encodings, while a null marker consumes none. Level-order serialization also works but may include trailing nulls.

### Contracts that matter

- Are values unique?
- Can values contain the delimiter?
- Must the format be compact, human-readable, or streaming?
- Is malformed input rejected?

### Iterators

A BST iterator can expose sorted values lazily with a stack of the current left spine. Each node is pushed and popped once, so next is O(1) amortized and memory O(h).
    `,
    diagram: `flowchart TD
      A["preorder root"] --> B["find root in inorder"]
      B --> C["inorder left segment"]
      B --> D["inorder right segment"]
      C --> E["build left recursively"]
      D --> F["build right recursively"]`,
    code: `def build_tree(preorder, inorder):
    position = {value: index for index, value in enumerate(inorder)}
    preorder_index = 0

    def build(left, right):
        nonlocal preorder_index
        if left > right:
            return None

        value = preorder[preorder_index]
        preorder_index += 1
        root = TreeNode(value)
        middle = position[value]
        root.left = build(left, middle - 1)
        root.right = build(middle + 1, right)
        return root

    return build(0, len(inorder) - 1)`,
  },
  {
    id: "tree-dp-state-design-expanded",
    title: "Tree DP State Design",
    type: "theory",
    content: `
## Add exactly the parent context that changes a subtree's choices

Tree DP works when child subtrees become independent after the current node's state is fixed.

### House Robber III

Each node returns two values:

- take: best total when this node is selected, forcing children to be skipped.
- skip: best total when this node is not selected, allowing each child to choose its better state.

### Common state shapes

| Problem | Returned state |
|---|---|
| Tree diameter | Longest downward branch |
| Cameras | Node covered / has camera / needs camera |
| Maximum independent set | Take and skip values |
| Tree matching | Whether parent edge is used |
| Subtree sizes | Count of nodes in subtree |

### Rerooting

One postorder pass computes child-to-parent contributions. A preorder pass sends parent-side information into each child, producing an answer for every possible root in O(n).

### Avoid double work

Do not separately compute height at every node for a balance check; that can become O(n²). Return height and validity together in one postorder pass.
    `,
    diagram: `flowchart TD
      A["node state"] --> B["take node"]
      A --> C["skip node"]
      B --> D["must skip children"]
      C --> E["each child chooses max(take, skip)"]
      D --> F["return (take, skip)"]
      E --> F`,
    code: `def rob_tree(root):
    def solve(node):
        if node is None:
            return 0, 0

        left_take, left_skip = solve(node.left)
        right_take, right_skip = solve(node.right)

        take = node.val + left_skip + right_skip
        skip = max(left_take, left_skip) + max(right_take, right_skip)
        return take, skip

    return max(solve(root))`,
  },
  {
    id: "tree-indexing-euler-binary-lifting",
    title: "Euler Tours, Subtree Ranges, and Binary Lifting",
    type: "theory",
    content: `
## Flatten hierarchy without losing ancestry

During DFS, record entry time tin[node] and exit time tout[node]. All nodes in a subtree occupy one contiguous interval in entry order.

This converts subtree operations into array range operations:

- Subtree sum query → range sum on [tin, tout].
- Subtree update → range update.
- Ancestor check → tin[a] ≤ tin[b] and tout[b] ≤ tout[a].

### Binary lifting

Precompute up[node][k], the ancestor 2^k edges above node. The recurrence is:

**up[node][k] = up[ up[node][k-1] ][k-1]**

Any distance can be decomposed into powers of two, so kth-ancestor and LCA queries take O(log n).

### Heavy-light decomposition

Choose each node's child with largest subtree as heavy. Any root-to-node path crosses only O(log n) light edges, splitting an arbitrary tree path into O(log n) contiguous array ranges. A segment tree over the flattened order then answers path queries in roughly O(log² n).

These techniques separate the tree's topology from the data structure used for aggregation.
    `,
    diagram: `flowchart LR
      A["Tree DFS"] --> B["entry order array"]
      B --> C["subtree = contiguous interval"]
      C --> D["prefix / Fenwick / segment tree"]
      A --> E["ancestor jump table"]
      E --> F["LCA and kth ancestor"]`,
    code: `def euler_subtree_ranges(tree, root=0):
    entry = [0] * len(tree)
    exit_time = [0] * len(tree)
    order = []

    def dfs(node, parent):
        entry[node] = len(order)
        order.append(node)
        for child in tree[node]:
            if child != parent:
                dfs(child, node)
        exit_time[node] = len(order) - 1

    dfs(root, -1)
    return order, entry, exit_time`,
  },
  {
    id: "tree-correctness-testing",
    title: "Tree Correctness, Edge Cases, and Testing",
    type: "theory",
    content: `
## Tiny asymmetric trees expose most mistakes

Test shapes, not only values:

- Empty tree and one node.
- Only-left and only-right chains.
- Perfect, complete, and unbalanced trees.
- Duplicate values when node identity matters.
- Negative values for maximum problems.
- Target is root, leaf, ancestor, absent, or the same node twice.

### Common bugs

| Bug | Cause |
|---|---|
| Height off by one | Mixing edge height and node height |
| Infinite traversal | Input is a graph or has an accidental cycle |
| Incorrect global result | Returning a two-branch path to parent |
| Lost duplicate node | Comparing values instead of node identity |
| O(n²) recursion | Recomputing subtree summaries repeatedly |
| Stack overflow | Degenerate chain with deep recursion |

### Property checks

- Traversals visit exactly n nodes.
- Inorder of a valid strict BST is strictly increasing.
- Serialize then deserialize preserves structure and values.
- Number of edges in a nonempty tree is n-1.
- Every node except root has exactly one parent.

Generate small random trees and compare optimized algorithms with simple reference implementations. A tree printer that includes null children is often more useful than a value list.
    `,
    diagram: `flowchart LR
      A["Generate tree shape"] --> B["Run optimized algorithm"]
      A --> C["Run reference algorithm"]
      B --> D{"Results and invariants agree?"}
      C --> D
      D -->|no| E["Shrink failing subtree"]
      D -->|yes| F["Test another shape"]`,
    code: `def assert_tree_invariants(root):
    seen = set()

    def visit(node):
        if node is None:
            return 0, 0
        identity = id(node)
        assert identity not in seen, "cycle or shared child detected"
        seen.add(identity)
        left_nodes, left_edges = visit(node.left)
        right_nodes, right_edges = visit(node.right)
        child_edges = int(node.left is not None) + int(node.right is not None)
        return 1 + left_nodes + right_nodes, child_edges + left_edges + right_edges

    nodes, edges = visit(root)
    assert edges == max(0, nodes - 1)
    return nodes`,
  },
];
