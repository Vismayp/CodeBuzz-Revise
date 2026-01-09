export const linkedListsTopic = {
  id: "linked-lists",
  title: "Linked Lists",
  description:
    "Master pointer manipulation, cycle detection, and classic list problems.",
  icon: "Link",
  sections: [
    // ============== THEORY SECTIONS ==============
    {
      id: "linkedlist-fundamentals",
      title: "Linked List Fundamentals",
      type: "theory",
      content: `
## Linked Lists: Dynamic Data Structures

A linked list is a linear data structure where elements are stored in **nodes**, each pointing to the next.

### Types of Linked Lists
1. **Singly Linked**: Each node points to next only
2. **Doubly Linked**: Each node points to next AND previous
3. **Circular**: Last node points back to first

### Comparison with Arrays

| Operation | Array | Linked List |
|-----------|-------|-------------|
| Access by index | O(1) | O(n) |
| Insert at beginning | O(n) | O(1) |
| Insert at end | O(1)* | O(n) or O(1)** |
| Insert at middle | O(n) | O(n) search + O(1) insert |
| Delete | O(n) | O(n) search + O(1) delete |
| Memory | Contiguous | Non-contiguous |

*Amortized for dynamic arrays
**O(1) if we maintain tail pointer

### When to Use Linked Lists
- Frequent insertions/deletions at beginning
- Unknown or variable size
- Implementing stacks, queues
- When contiguous memory not available

### Key Patterns
1. **Two Pointers (Fast/Slow)** - Cycle detection, find middle
2. **Reversal** - In-place or recursive
3. **Merge** - Merge sorted lists
4. **Dummy Node** - Simplify edge cases
      `,
      code: `// Node Definition
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

// Creating a linked list: 1 -> 2 -> 3 -> null
const head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);

// Traversal - O(n)
function traverse(head) {
    let current = head;
    while (current !== null) {
        console.log(current.val);
        current = current.next;
    }
}

// Find length - O(n)
function getLength(head) {
    let count = 0;
    let current = head;
    while (current !== null) {
        count++;
        current = current.next;
    }
    return count;
}

// Insert at beginning - O(1)
function insertAtHead(head, val) {
    const newNode = new ListNode(val);
    newNode.next = head;
    return newNode; // New head
}

// Insert at end - O(n)
function insertAtTail(head, val) {
    const newNode = new ListNode(val);
    if (!head) return newNode;
    
    let current = head;
    while (current.next !== null) {
        current = current.next;
    }
    current.next = newNode;
    return head;
}

// Delete node with value - O(n)
function deleteNode(head, val) {
    // Use dummy node to handle edge cases
    const dummy = new ListNode(0);
    dummy.next = head;
    
    let current = dummy;
    while (current.next !== null) {
        if (current.next.val === val) {
            current.next = current.next.next;
            break;
        }
        current = current.next;
    }
    
    return dummy.next;
}`,
    },
    {
      id: "fast-slow-pointers",
      title: "Fast & Slow Pointers",
      type: "theory",
      content: `
## Floyd's Tortoise and Hare Algorithm

The fast/slow pointer technique uses two pointers moving at different speeds.

### Applications
1. **Detect cycle** - If they meet, cycle exists
2. **Find cycle start** - Mathematical approach
3. **Find middle** - When fast reaches end, slow is at middle
4. **Find nth from end** - Move fast n steps first

### Why It Works for Cycle Detection
- If no cycle: Fast reaches null
- If cycle exists: Fast eventually "laps" slow
- They MUST meet inside the cycle

### Finding Cycle Start (Mathematical)
After detecting cycle:
1. Move one pointer to head
2. Move both at same speed
3. They meet at cycle start!

**Proof**: If cycle starts at position $\\mu$ and cycle length is $\\lambda$:
- Slow travels $\\mu + k$ steps (k = steps inside cycle)
- Fast travels $2(\\mu + k)$ steps
- Fast is ahead by exactly cycle length: $2(\\mu + k) - (\\mu + k) = n\\lambda$
- So $\\mu + k = n\\lambda$, meaning meeting point is $k$ steps from cycle start
      `,
      diagram: `
graph LR
    A[1] --> B[2] --> C[3] --> D[4] --> E[5]
    E --> C
    style C fill:#f9f,stroke:#333
      `,
      code: `// Detect Cycle
function hasCycle(head) {
    if (!head || !head.next) return false;
    
    let slow = head;
    let fast = head;
    
    while (fast !== null && fast.next !== null) {
        slow = slow.next;        // Move 1 step
        fast = fast.next.next;   // Move 2 steps
        
        if (slow === fast) return true;
    }
    
    return false; // Fast reached end, no cycle
}

// Find Cycle Start
function detectCycle(head) {
    if (!head || !head.next) return null;
    
    let slow = head;
    let fast = head;
    
    // Phase 1: Detect cycle
    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            // Phase 2: Find cycle start
            let pointer = head;
            while (pointer !== slow) {
                pointer = pointer.next;
                slow = slow.next;
            }
            return pointer; // Cycle start
        }
    }
    
    return null; // No cycle
}

// Find Middle Node
function findMiddle(head) {
    let slow = head;
    let fast = head;
    
    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow; // Middle node
}

// Find Nth Node from End
function findNthFromEnd(head, n) {
    let fast = head;
    let slow = head;
    
    // Move fast n steps ahead
    for (let i = 0; i < n; i++) {
        if (fast === null) return null; // List too short
        fast = fast.next;
    }
    
    // Move both until fast reaches end
    while (fast !== null) {
        slow = slow.next;
        fast = fast.next;
    }
    
    return slow; // Nth from end
}`,
    },
    {
      id: "list-reversal",
      title: "List Reversal Techniques",
      type: "theory",
      content: `
## Reversing Linked Lists

Reversal is the most fundamental linked list operation. Master both iterative and recursive approaches.

### Iterative Approach (Most Common)
Use three pointers: prev, current, next
At each step:
1. Save next node
2. Reverse current's pointer
3. Move prev and current forward

### Recursive Approach
Base case: Empty or single node
Recursive: Reverse rest, then fix pointers

### Variants
1. **Reverse entire list**
2. **Reverse between positions** (LeetCode #92)
3. **Reverse in k-groups** (LeetCode #25)
4. **Reverse alternating k nodes**
      `,
      code: `// Iterative Reversal - O(n) time, O(1) space
function reverseList(head) {
    let prev = null;
    let current = head;
    
    while (current !== null) {
        const next = current.next;  // Save next
        current.next = prev;        // Reverse pointer
        prev = current;             // Move prev forward
        current = next;             // Move current forward
    }
    
    return prev; // New head
}

// Dry Run: 1 -> 2 -> 3 -> null
// Initial: prev=null, curr=1
// Step 1: next=2, 1.next=null, prev=1, curr=2
//         null <- 1    2 -> 3 -> null
// Step 2: next=3, 2.next=1, prev=2, curr=3
//         null <- 1 <- 2    3 -> null
// Step 3: next=null, 3.next=2, prev=3, curr=null
//         null <- 1 <- 2 <- 3
// Return prev=3 (new head)

// Recursive Reversal - O(n) time, O(n) space (call stack)
function reverseListRecursive(head) {
    // Base case
    if (head === null || head.next === null) {
        return head;
    }
    
    // Reverse the rest of the list
    const newHead = reverseListRecursive(head.next);
    
    // Fix pointers
    head.next.next = head;  // Next node points back to current
    head.next = null;       // Current no longer points to next
    
    return newHead;
}

// Reverse Between Positions (LeetCode #92)
function reverseBetween(head, left, right) {
    if (!head || left === right) return head;
    
    const dummy = new ListNode(0);
    dummy.next = head;
    
    // Find node before reversal starts
    let prev = dummy;
    for (let i = 1; i < left; i++) {
        prev = prev.next;
    }
    
    // Reverse from left to right
    let current = prev.next;
    for (let i = 0; i < right - left; i++) {
        const next = current.next;
        current.next = next.next;
        next.next = prev.next;
        prev.next = next;
    }
    
    return dummy.next;
}

// Reverse in K-Groups (LeetCode #25 - Hard)
function reverseKGroup(head, k) {
    // Count nodes
    let count = 0;
    let current = head;
    while (current) {
        count++;
        current = current.next;
    }
    
    const dummy = new ListNode(0);
    dummy.next = head;
    let prev = dummy;
    
    while (count >= k) {
        current = prev.next;
        let next = current.next;
        
        // Reverse k nodes
        for (let i = 1; i < k; i++) {
            current.next = next.next;
            next.next = prev.next;
            prev.next = next;
            next = current.next;
        }
        
        prev = current;
        count -= k;
    }
    
    return dummy.next;
}`,
    },
    // ============== PROBLEM SECTIONS ==============
    {
      id: "problem-reverse-linked-list",
      title: "Reverse Linked List",
      type: "problem",
      difficulty: "Easy",
      companies: ["Amazon", "Microsoft", "Apple", "Facebook", "Google"],
      leetcode: "https://leetcode.com/problems/reverse-linked-list/",
      content: `
## LeetCode #206: Reverse Linked List

Given the head of a singly linked list, reverse the list, and return the reversed list.

### Example
\`\`\`
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]
\`\`\`

### Key Insight
Track three pointers: previous, current, and next.
At each step, reverse one link.

### Two Approaches
1. **Iterative**: O(n) time, O(1) space - Preferred
2. **Recursive**: O(n) time, O(n) space - Elegant but uses call stack
      `,
      code: `// Iterative Solution (Preferred)
function reverseList(head) {
    let prev = null;
    let curr = head;
    
    while (curr !== null) {
        const nextTemp = curr.next;  // Store next
        curr.next = prev;            // Reverse link
        prev = curr;                 // Move prev forward
        curr = nextTemp;             // Move curr forward
    }
    
    return prev;
}

// Recursive Solution
function reverseListRecursive(head) {
    if (head === null || head.next === null) {
        return head;
    }
    
    const newHead = reverseListRecursive(head.next);
    head.next.next = head;
    head.next = null;
    
    return newHead;
}

// Visual Dry Run for [1, 2, 3]:
// 
// Initial:     1 -> 2 -> 3 -> null
//              ^
//            curr   prev=null
//
// After i=1:  null <- 1    2 -> 3 -> null
//                     ^    ^
//                   prev  curr
//
// After i=2:  null <- 1 <- 2    3 -> null
//                          ^    ^
//                        prev  curr
//
// After i=3:  null <- 1 <- 2 <- 3    null
//                               ^    ^
//                             prev  curr
//
// Return prev (3) as new head`,
    },
    {
      id: "problem-merge-two-sorted-lists",
      title: "Merge Two Sorted Lists",
      type: "problem",
      difficulty: "Easy",
      companies: ["Amazon", "Microsoft", "Apple", "Facebook", "Adobe"],
      leetcode: "https://leetcode.com/problems/merge-two-sorted-lists/",
      content: `
## LeetCode #21: Merge Two Sorted Lists

Merge two sorted linked lists and return it as a sorted list.

### Example
\`\`\`
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
\`\`\`

### Key Technique: Dummy Node
Use a dummy node to simplify edge cases (empty lists, first node selection).

### Approaches
1. **Iterative with Dummy Node**: Simple comparison loop
2. **Recursive**: Elegant but uses O(n+m) stack space
      `,
      code: `// Iterative Solution with Dummy Node
function mergeTwoLists(list1, list2) {
    const dummy = new ListNode(-1);
    let current = dummy;
    
    while (list1 !== null && list2 !== null) {
        if (list1.val <= list2.val) {
            current.next = list1;
            list1 = list1.next;
        } else {
            current.next = list2;
            list2 = list2.next;
        }
        current = current.next;
    }
    
    // Attach remaining nodes
    current.next = list1 !== null ? list1 : list2;
    
    return dummy.next;
}

// Recursive Solution
function mergeTwoListsRecursive(list1, list2) {
    if (list1 === null) return list2;
    if (list2 === null) return list1;
    
    if (list1.val <= list2.val) {
        list1.next = mergeTwoListsRecursive(list1.next, list2);
        return list1;
    } else {
        list2.next = mergeTwoListsRecursive(list1, list2.next);
        return list2;
    }
}

// Dry Run: list1 = [1,2,4], list2 = [1,3,4]
// dummy -> ?
// 
// Compare 1 vs 1: Take list1's 1
// dummy -> 1, list1 = [2,4]
// 
// Compare 2 vs 1: Take list2's 1
// dummy -> 1 -> 1, list2 = [3,4]
// 
// Compare 2 vs 3: Take list1's 2
// dummy -> 1 -> 1 -> 2, list1 = [4]
// 
// Compare 4 vs 3: Take list2's 3
// dummy -> 1 -> 1 -> 2 -> 3, list2 = [4]
// 
// Compare 4 vs 4: Take list1's 4
// dummy -> 1 -> 1 -> 2 -> 3 -> 4, list1 = null
// 
// Attach remaining: list2 = [4]
// dummy -> 1 -> 1 -> 2 -> 3 -> 4 -> 4
// 
// Return dummy.next`,
    },
    {
      id: "problem-linked-list-cycle-ii",
      title: "Linked List Cycle II",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Microsoft", "Apple", "Bloomberg", "Uber"],
      leetcode: "https://leetcode.com/problems/linked-list-cycle-ii/",
      content: `
## LeetCode #142: Linked List Cycle II

Given a linked list, return the node where the cycle begins. If there is no cycle, return null.

### Example
\`\`\`
Input: head = [3,2,0,-4], pos = 1 (cycle at node with value 2)
Output: Node with value 2
\`\`\`

### Floyd's Algorithm (Two Phases)
**Phase 1**: Detect if cycle exists (fast/slow pointers meet)
**Phase 2**: Find cycle start (move one pointer to head, both move at same speed)

### Mathematical Proof
- Let distance from head to cycle start = $a$
- Distance from cycle start to meeting point = $b$
- Distance from meeting point back to cycle start = $c$
- When they meet: slow = $a + b$, fast = $a + b + (b + c) \\cdot k$
- Since fast = 2 \\cdot slow: $a + b = (b + c)$ (simplified)
- Therefore $a = c$, so both pointers meet at cycle start!
      `,
      code: `function detectCycle(head) {
    if (!head || !head.next) return null;
    
    let slow = head;
    let fast = head;
    
    // Phase 1: Detect cycle
    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            // Phase 2: Find cycle start
            let pointer = head;
            while (pointer !== slow) {
                pointer = pointer.next;
                slow = slow.next;
            }
            return pointer;
        }
    }
    
    return null; // No cycle
}

// Visual explanation:
//
// head -> [3] -> [2] -> [0] -> [-4]
//                  ^            |
//                  |____________|
//
// Phase 1: Find meeting point
// slow: 3 -> 2 -> 0 -> -4 -> 2 -> 0
// fast: 3 -> 0 -> 2 -> -4 -> 0 -> 2
// They meet at node with value 0 (or 2, depending on cycle length)
//
// Phase 2: Find cycle start
// Move one pointer to head, both move at speed 1
// pointer: 3 -> 2
// slow:    0 -> -4 -> 2
// They meet at cycle start (node with value 2)

// Alternative: Hash Set approach - O(n) space
function detectCycleHashSet(head) {
    const visited = new Set();
    let current = head;
    
    while (current !== null) {
        if (visited.has(current)) {
            return current; // Cycle start found
        }
        visited.add(current);
        current = current.next;
    }
    
    return null;
}`,
    },
    {
      id: "problem-remove-nth-from-end",
      title: "Remove Nth Node From End",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Microsoft", "Facebook", "Apple", "Google"],
      leetcode:
        "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
      content: `
## LeetCode #19: Remove Nth Node From End of List

Given the head of a linked list, remove the nth node from the end of the list and return its head.

### Example
\`\`\`
Input: head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]
\`\`\`

### Key Insight: Two Pointers
1. Move fast pointer n steps ahead
2. Move both pointers until fast reaches end
3. Slow pointer is now at (n+1)th from end
4. Remove the next node

### Edge Case
When n equals list length, we're removing the head. Use dummy node!
      `,
      code: `function removeNthFromEnd(head, n) {
    // Dummy node handles edge case of removing head
    const dummy = new ListNode(0);
    dummy.next = head;
    
    let fast = dummy;
    let slow = dummy;
    
    // Move fast n+1 steps ahead
    for (let i = 0; i <= n; i++) {
        fast = fast.next;
    }
    
    // Move both until fast reaches end
    while (fast !== null) {
        fast = fast.next;
        slow = slow.next;
    }
    
    // Remove the nth node from end
    slow.next = slow.next.next;
    
    return dummy.next;
}

// Dry Run: [1,2,3,4,5], n = 2
// dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> null
//
// After moving fast n+1 (3) steps:
// dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> null
//   ^                 ^
//  slow             fast
//
// Move both until fast is null:
// dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> null
//                    ^              ^
//                  slow           fast
//
// slow.next (node 4) is the one to remove
// slow.next = slow.next.next (5)
// Result: 1 -> 2 -> 3 -> 5

// Why dummy node?
// If n = 5 (remove head), after moving fast:
// dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> null
//   ^                              ^
//  slow                          fast (null)
// slow.next = slow.next.next removes node 1 correctly

// One-pass solution - O(n) time, O(1) space`,
    },
    {
      id: "problem-reorder-list",
      title: "Reorder List",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Microsoft", "Facebook", "Adobe", "Uber"],
      leetcode: "https://leetcode.com/problems/reorder-list/",
      content: `
## LeetCode #143: Reorder List

Reorder list from L0 → L1 → ... → Ln-1 → Ln to L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → ...

### Example
\`\`\`
Input: 1 -> 2 -> 3 -> 4 -> 5
Output: 1 -> 5 -> 2 -> 4 -> 3
\`\`\`

### Three-Step Approach
1. **Find middle** using fast/slow pointers
2. **Reverse second half**
3. **Merge** the two halves alternately

### Why This Works
We're essentially interleaving:
- First half: L0 → L1 → L2 → ...
- Reversed second half: Ln → Ln-1 → Ln-2 → ...
      `,
      code: `function reorderList(head) {
    if (!head || !head.next) return;
    
    // Step 1: Find middle
    let slow = head;
    let fast = head;
    while (fast.next && fast.next.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // Step 2: Reverse second half
    let second = slow.next;
    slow.next = null; // Cut the list
    let prev = null;
    
    while (second) {
        const next = second.next;
        second.next = prev;
        prev = second;
        second = next;
    }
    second = prev; // New head of reversed second half
    
    // Step 3: Merge two halves
    let first = head;
    while (second) {
        const temp1 = first.next;
        const temp2 = second.next;
        
        first.next = second;
        second.next = temp1;
        
        first = temp1;
        second = temp2;
    }
}

// Dry Run: 1 -> 2 -> 3 -> 4 -> 5
//
// Step 1: Find middle (slow at 3)
// First half: 1 -> 2 -> 3
// Second half: 4 -> 5
//
// Step 2: Reverse second half
// Second half becomes: 5 -> 4
//
// Step 3: Merge alternately
// first=1, second=5
//   1.next = 5, 5.next = 2
//   Result so far: 1 -> 5 -> 2 -> 3
//
// first=2, second=4
//   2.next = 4, 4.next = 3
//   Result: 1 -> 5 -> 2 -> 4 -> 3
//
// first=3, second=null -> done!

// Time: O(n), Space: O(1)`,
    },
    {
      id: "problem-lru-cache",
      title: "LRU Cache",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Facebook", "Microsoft", "Google", "Apple"],
      leetcode: "https://leetcode.com/problems/lru-cache/",
      content: `
## LeetCode #146: LRU Cache

Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

### Operations
- \`get(key)\`: Return value if key exists, else return -1
- \`put(key, value)\`: Update or insert. If capacity exceeded, evict LRU item.

### Key Insight: Hash Map + Doubly Linked List
- **Hash Map**: O(1) key lookup → node pointer
- **Doubly Linked List**: O(1) add/remove for maintaining order
- Most recent at head, least recent at tail

### Why Doubly Linked List?
- Need O(1) removal from middle (when accessing existing key)
- Need O(1) add to head (most recently used)
- Need O(1) remove from tail (eviction)
      `,
      code: `class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map(); // key -> node
        
        // Dummy head and tail for easier operations
        this.head = { key: 0, val: 0, prev: null, next: null };
        this.tail = { key: 0, val: 0, prev: null, next: null };
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
    
    // Remove node from current position
    _remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
    
    // Add node right after head (most recently used)
    _addToFront(node) {
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }
    
    get(key) {
        if (!this.cache.has(key)) return -1;
        
        const node = this.cache.get(key);
        // Move to front (most recently used)
        this._remove(node);
        this._addToFront(node);
        
        return node.val;
    }
    
    put(key, value) {
        if (this.cache.has(key)) {
            // Update existing
            const node = this.cache.get(key);
            node.val = value;
            this._remove(node);
            this._addToFront(node);
        } else {
            // Add new
            const newNode = { key, val: value, prev: null, next: null };
            this.cache.set(key, newNode);
            this._addToFront(newNode);
            
            // Check capacity
            if (this.cache.size > this.capacity) {
                // Remove LRU (node before tail)
                const lru = this.tail.prev;
                this._remove(lru);
                this.cache.delete(lru.key);
            }
        }
    }
}

// Usage Example:
// const cache = new LRUCache(2);
// cache.put(1, 1);  // cache: {1=1}
// cache.put(2, 2);  // cache: {1=1, 2=2}
// cache.get(1);     // returns 1, cache: {2=2, 1=1}
// cache.put(3, 3);  // evicts 2, cache: {1=1, 3=3}
// cache.get(2);     // returns -1 (not found)
// cache.put(4, 4);  // evicts 1, cache: {3=3, 4=4}

// Time: O(1) for both get and put
// Space: O(capacity)`,
    },
  ],
};
