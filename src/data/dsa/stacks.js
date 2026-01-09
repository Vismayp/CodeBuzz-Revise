export const stacksTopic = {
  id: "stacks-queues",
  title: "Stacks & Queues",
  description:
    "Master LIFO/FIFO structures, monotonic stacks, and expression evaluation.",
  icon: "Layers",
  sections: [
    // ============== THEORY SECTIONS ==============
    {
      id: "stack-fundamentals",
      title: "Stack Fundamentals",
      type: "theory",
      content: `
## Stack: Last In, First Out (LIFO)

A stack is a linear data structure following the LIFO principle. Think of a stack of plates - you can only add/remove from the top.

### Core Operations
| Operation | Description | Time Complexity |
|-----------|-------------|-----------------|
| push(x) | Add element to top | O(1) |
| pop() | Remove & return top | O(1) |
| peek()/top() | Return top without removing | O(1) |
| isEmpty() | Check if stack is empty | O(1) |
| size() | Return number of elements | O(1) |

### Common Applications
1. **Function call stack** - Tracking function calls in recursion
2. **Undo operations** - Text editors, browsers
3. **Expression evaluation** - Calculators, compilers
4. **Parentheses matching** - Code validators
5. **DFS traversal** - Graph/tree exploration
6. **Monotonic stack** - Next greater/smaller element

### Implementation Options
1. **Array-based**: Dynamic array with top pointer
2. **Linked List-based**: Push/pop at head
      `,
      code: `// Array-based Stack Implementation
class Stack {
    constructor() {
        this.items = [];
    }
    
    push(element) {
        this.items.push(element);
    }
    
    pop() {
        if (this.isEmpty()) return undefined;
        return this.items.pop();
    }
    
    peek() {
        if (this.isEmpty()) return undefined;
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
    
    clear() {
        this.items = [];
    }
}

// Linked List-based Stack
class ListNode {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

class LinkedStack {
    constructor() {
        this.head = null;
        this._size = 0;
    }
    
    push(val) {
        const newNode = new ListNode(val);
        newNode.next = this.head;
        this.head = newNode;
        this._size++;
    }
    
    pop() {
        if (!this.head) return undefined;
        const val = this.head.val;
        this.head = this.head.next;
        this._size--;
        return val;
    }
    
    peek() {
        return this.head ? this.head.val : undefined;
    }
    
    isEmpty() {
        return this.head === null;
    }
    
    size() {
        return this._size;
    }
}`,
    },
    {
      id: "queue-fundamentals",
      title: "Queue Fundamentals",
      type: "theory",
      content: `
## Queue: First In, First Out (FIFO)

A queue follows the FIFO principle. Like a line at a store - first person in line is served first.

### Core Operations
| Operation | Description | Time Complexity |
|-----------|-------------|-----------------|
| enqueue(x) | Add element to back | O(1) |
| dequeue() | Remove & return front | O(1) |
| front()/peek() | Return front without removing | O(1) |
| isEmpty() | Check if queue is empty | O(1) |
| size() | Return number of elements | O(1) |

### Variants
1. **Simple Queue**: Basic FIFO
2. **Circular Queue**: Fixed-size with wrap-around
3. **Deque**: Double-ended queue (add/remove from both ends)
4. **Priority Queue**: Based on priority (usually heap-based)

### Common Applications
1. **BFS traversal** - Level-order tree/graph traversal
2. **Task scheduling** - OS process scheduling
3. **Message queues** - Async communication
4. **Buffering** - Print spoolers, keyboards
      `,
      code: `// Array-based Queue (Simple)
class Queue {
    constructor() {
        this.items = [];
    }
    
    enqueue(element) {
        this.items.push(element);
    }
    
    dequeue() {
        // O(n) due to shift - use circular queue for O(1)
        return this.items.shift();
    }
    
    front() {
        return this.items[0];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
}

// Circular Queue - O(1) all operations
class CircularQueue {
    constructor(capacity) {
        this.capacity = capacity;
        this.items = new Array(capacity);
        this.front = -1;
        this.rear = -1;
        this._size = 0;
    }
    
    enqueue(element) {
        if (this.isFull()) return false;
        
        if (this.isEmpty()) {
            this.front = 0;
        }
        this.rear = (this.rear + 1) % this.capacity;
        this.items[this.rear] = element;
        this._size++;
        return true;
    }
    
    dequeue() {
        if (this.isEmpty()) return undefined;
        
        const element = this.items[this.front];
        if (this.front === this.rear) {
            // Queue becomes empty
            this.front = -1;
            this.rear = -1;
        } else {
            this.front = (this.front + 1) % this.capacity;
        }
        this._size--;
        return element;
    }
    
    peek() {
        if (this.isEmpty()) return undefined;
        return this.items[this.front];
    }
    
    isEmpty() {
        return this.front === -1;
    }
    
    isFull() {
        return this._size === this.capacity;
    }
    
    size() {
        return this._size;
    }
}

// Deque (Double-ended Queue)
class Deque {
    constructor() {
        this.items = [];
    }
    
    addFront(element) {
        this.items.unshift(element);
    }
    
    addRear(element) {
        this.items.push(element);
    }
    
    removeFront() {
        return this.items.shift();
    }
    
    removeRear() {
        return this.items.pop();
    }
    
    peekFront() {
        return this.items[0];
    }
    
    peekRear() {
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
}`,
    },
    {
      id: "monotonic-stack",
      title: "Monotonic Stack Pattern",
      type: "theory",
      content: `
## Monotonic Stack: Finding Next Greater/Smaller Elements

A monotonic stack maintains elements in sorted order (increasing or decreasing).

### Two Types
1. **Monotonic Increasing**: Elements increase from bottom to top
   - Use for: Next Greater Element
2. **Monotonic Decreasing**: Elements decrease from bottom to top
   - Use for: Next Smaller Element

### Pattern Recognition
Ask yourself:
- Need to find **next greater/smaller** element? → Monotonic Stack
- Need to find **previous greater/smaller** element? → Monotonic Stack
- Problem involves **histogram areas**? → Monotonic Stack

### Key Insight
When we push an element and pop smaller/larger elements, we're essentially finding the relationship between current element and all elements it "dominates".

### Template
\`\`\`
For Next Greater Element (Decreasing Stack):
- Traverse from right to left
- While stack not empty AND stack.top <= current: pop
- Answer = stack.top (or -1 if empty)
- Push current to stack

For Next Smaller Element (Increasing Stack):
- Traverse from right to left
- While stack not empty AND stack.top >= current: pop
- Answer = stack.top (or -1 if empty)
- Push current to stack
\`\`\`
      `,
      diagram: `
graph LR
    subgraph "Array: [2, 1, 2, 4, 3]"
    A[2] --> B[1] --> C[2] --> D[4] --> E[3]
    end
    subgraph "Next Greater"
    A2["4"] --> B2["2"] --> C2["4"] --> D2["-1"] --> E2["-1"]
    end
      `,
      code: `// Next Greater Element - O(n) time, O(n) space
function nextGreaterElement(nums) {
    const n = nums.length;
    const result = new Array(n).fill(-1);
    const stack = []; // Stores indices
    
    // Traverse from right to left
    for (let i = n - 1; i >= 0; i--) {
        // Pop elements smaller than or equal to current
        while (stack.length > 0 && nums[stack[stack.length - 1]] <= nums[i]) {
            stack.pop();
        }
        
        // Stack top is next greater, or -1 if empty
        if (stack.length > 0) {
            result[i] = nums[stack[stack.length - 1]];
        }
        
        // Push current index
        stack.push(i);
    }
    
    return result;
}

// Dry Run: [2, 1, 2, 4, 3]
// i=4: stack=[], result[4]=-1, push 4 → stack=[4]
// i=3: 3<=4? pop, stack=[], result[3]=-1, push 3 → stack=[3]
// i=2: 4<=2? no, result[2]=4, push 2 → stack=[3,2]
// i=1: 2<=1? no, result[1]=2, push 1 → stack=[3,2,1]
// i=0: 1<=2? pop, 2<=2? pop, result[0]=4, push 0 → stack=[3,0]
// Result: [4, 2, 4, -1, -1]

// Next Smaller Element
function nextSmallerElement(nums) {
    const n = nums.length;
    const result = new Array(n).fill(-1);
    const stack = [];
    
    for (let i = n - 1; i >= 0; i--) {
        // Pop elements greater than or equal to current
        while (stack.length > 0 && nums[stack[stack.length - 1]] >= nums[i]) {
            stack.pop();
        }
        
        if (stack.length > 0) {
            result[i] = nums[stack[stack.length - 1]];
        }
        
        stack.push(i);
    }
    
    return result;
}

// Previous Greater Element
function previousGreaterElement(nums) {
    const n = nums.length;
    const result = new Array(n).fill(-1);
    const stack = [];
    
    // Traverse from left to right
    for (let i = 0; i < n; i++) {
        while (stack.length > 0 && nums[stack[stack.length - 1]] <= nums[i]) {
            stack.pop();
        }
        
        if (stack.length > 0) {
            result[i] = nums[stack[stack.length - 1]];
        }
        
        stack.push(i);
    }
    
    return result;
}`,
    },
    // ============== PROBLEM SECTIONS ==============
    {
      id: "problem-valid-parentheses",
      title: "Valid Parentheses",
      type: "problem",
      difficulty: "Easy",
      companies: ["Amazon", "Facebook", "Google", "Microsoft", "Bloomberg"],
      leetcode: "https://leetcode.com/problems/valid-parentheses/",
      content: `
## LeetCode #20: Valid Parentheses

Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

### Example
\`\`\`
Input: s = "()[]{}"
Output: true

Input: s = "([)]"
Output: false
\`\`\`

### Key Insight
Use a stack to match opening brackets with closing brackets:
1. Push opening brackets onto stack
2. For closing brackets, check if top of stack matches
3. At end, stack should be empty
      `,
      code: `function isValid(s) {
    const stack = [];
    const map = {
        ')': '(',
        '}': '{',
        ']': '['
    };
    
    for (const char of s) {
        if (char in map) {
            // Closing bracket - check for match
            const top = stack.length > 0 ? stack.pop() : '#';
            if (top !== map[char]) {
                return false;
            }
        } else {
            // Opening bracket - push to stack
            stack.push(char);
        }
    }
    
    return stack.length === 0;
}

// Dry Run: "([{}])"
// char='(': push → stack=['(']
// char='[': push → stack=['(', '[']
// char='{': push → stack=['(', '[', '{']
// char='}': pop '{' matches '}' → stack=['(', '[']
// char=']': pop '[' matches ']' → stack=['(']
// char=')': pop '(' matches ')' → stack=[]
// Return: stack.length === 0 → true

// Dry Run: "([)]"
// char='(': push → stack=['(']
// char='[': push → stack=['(', '[']
// char=')': pop '[' doesn't match ')' → return false

// Alternative: Without hash map
function isValidAlt(s) {
    const stack = [];
    
    for (const char of s) {
        if (char === '(') stack.push(')');
        else if (char === '[') stack.push(']');
        else if (char === '{') stack.push('}');
        else if (stack.length === 0 || stack.pop() !== char) {
            return false;
        }
    }
    
    return stack.length === 0;
}`,
    },
    {
      id: "problem-min-stack",
      title: "Min Stack",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Microsoft", "Bloomberg", "Apple", "Goldman Sachs"],
      leetcode: "https://leetcode.com/problems/min-stack/",
      content: `
## LeetCode #155: Min Stack

Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

### Operations
- \`push(val)\` - Push element onto stack
- \`pop()\` - Remove top element
- \`top()\` - Get top element
- \`getMin()\` - Retrieve minimum element

### Key Insight
Store pairs of (value, currentMin) so each element knows what the minimum was when it was pushed.

### Alternative Approach
Use two stacks - one for values, one for minimums.
      `,
      code: `// Approach 1: Store pairs (value, currentMin)
class MinStack {
    constructor() {
        this.stack = [];
    }
    
    push(val) {
        const currentMin = this.stack.length === 0 
            ? val 
            : Math.min(val, this.getMin());
        this.stack.push([val, currentMin]);
    }
    
    pop() {
        this.stack.pop();
    }
    
    top() {
        return this.stack[this.stack.length - 1][0];
    }
    
    getMin() {
        return this.stack[this.stack.length - 1][1];
    }
}

// Dry Run:
// push(-2): stack=[[-2, -2]]
// push(0):  stack=[[-2, -2], [0, -2]]
// push(-3): stack=[[-2, -2], [0, -2], [-3, -3]]
// getMin(): return -3
// pop():    stack=[[-2, -2], [0, -2]]
// top():    return 0
// getMin(): return -2

// Approach 2: Two separate stacks
class MinStack2 {
    constructor() {
        this.stack = [];
        this.minStack = [];
    }
    
    push(val) {
        this.stack.push(val);
        
        // Only push to minStack if val is <= current min
        if (this.minStack.length === 0 || val <= this.minStack[this.minStack.length - 1]) {
            this.minStack.push(val);
        }
    }
    
    pop() {
        const val = this.stack.pop();
        
        // Pop from minStack if it's the minimum
        if (val === this.minStack[this.minStack.length - 1]) {
            this.minStack.pop();
        }
    }
    
    top() {
        return this.stack[this.stack.length - 1];
    }
    
    getMin() {
        return this.minStack[this.minStack.length - 1];
    }
}

// Approach 3: Single stack with encoding (O(1) space for minStack)
class MinStackOptimized {
    constructor() {
        this.stack = [];
        this.min = Infinity;
    }
    
    push(val) {
        if (val <= this.min) {
            // Push current min first, then update min
            this.stack.push(this.min);
            this.min = val;
        }
        this.stack.push(val);
    }
    
    pop() {
        const val = this.stack.pop();
        if (val === this.min) {
            // Restore previous min
            this.min = this.stack.pop();
        }
    }
    
    top() {
        return this.stack[this.stack.length - 1];
    }
    
    getMin() {
        return this.min;
    }
}`,
    },
    {
      id: "problem-daily-temperatures",
      title: "Daily Temperatures",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Facebook", "Apple", "Microsoft", "Google"],
      leetcode: "https://leetcode.com/problems/daily-temperatures/",
      content: `
## LeetCode #739: Daily Temperatures

Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.

### Example
\`\`\`
Input: temperatures = [73,74,75,71,69,72,76,73]
Output: [1,1,4,2,1,1,0,0]
\`\`\`

### Key Insight: Monotonic Decreasing Stack
- We need "next greater element" but want the distance, not the value
- Use monotonic decreasing stack storing indices
- When we find a greater temperature, calculate distance
      `,
      code: `function dailyTemperatures(temperatures) {
    const n = temperatures.length;
    const result = new Array(n).fill(0);
    const stack = []; // Stores indices
    
    for (let i = 0; i < n; i++) {
        // While current temp is greater than temp at stack top
        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
            const prevIndex = stack.pop();
            result[prevIndex] = i - prevIndex;
        }
        stack.push(i);
    }
    
    return result;
}

// Dry Run: [73, 74, 75, 71, 69, 72, 76, 73]
//           0   1   2   3   4   5   6   7
//
// i=0: stack=[0]
// i=1: 74>73, pop 0, result[0]=1-0=1, stack=[1]
// i=2: 75>74, pop 1, result[1]=2-1=1, stack=[2]
// i=3: 71<75, stack=[2,3]
// i=4: 69<71, stack=[2,3,4]
// i=5: 72>69, pop 4, result[4]=5-4=1
//      72>71, pop 3, result[3]=5-3=2
//      72<75, stack=[2,5]
// i=6: 76>72, pop 5, result[5]=6-5=1
//      76>75, pop 2, result[2]=6-2=4
//      stack=[6]
// i=7: 73<76, stack=[6,7]
//
// Result: [1,1,4,2,1,1,0,0]

// Alternative: Backwards traversal
function dailyTemperaturesBackward(temperatures) {
    const n = temperatures.length;
    const result = new Array(n).fill(0);
    const stack = [];
    
    for (let i = n - 1; i >= 0; i--) {
        while (stack.length > 0 && temperatures[stack[stack.length - 1]] <= temperatures[i]) {
            stack.pop();
        }
        
        if (stack.length > 0) {
            result[i] = stack[stack.length - 1] - i;
        }
        
        stack.push(i);
    }
    
    return result;
}

// Time: O(n) - each element pushed/popped once
// Space: O(n) - for stack`,
    },
    {
      id: "problem-largest-rectangle-histogram",
      title: "Largest Rectangle in Histogram",
      type: "problem",
      difficulty: "Hard",
      companies: ["Amazon", "Microsoft", "Google", "Facebook", "Adobe"],
      leetcode: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
      content: `
## LeetCode #84: Largest Rectangle in Histogram

Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.

### Example
\`\`\`
Input: heights = [2,1,5,6,2,3]
Output: 10 (rectangle of height 5 and width 2)
\`\`\`

### Key Insight: Monotonic Increasing Stack
For each bar, find how far left and right it can extend:
- Left boundary: First bar shorter than current (on left)
- Right boundary: First bar shorter than current (on right)
- Area = height × (right - left - 1)

### Why Monotonic Increasing Stack?
When we pop a bar, current bar is its right boundary, and the new stack top is its left boundary.
      `,
      code: `function largestRectangleArea(heights) {
    const stack = []; // Stores indices
    let maxArea = 0;
    const n = heights.length;
    
    for (let i = 0; i <= n; i++) {
        // Use 0 as sentinel for last iteration
        const currentHeight = i === n ? 0 : heights[i];
        
        while (stack.length > 0 && currentHeight < heights[stack[stack.length - 1]]) {
            const height = heights[stack.pop()];
            
            // Width: from stack top (or -1 if empty) to current index i
            const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
            
            maxArea = Math.max(maxArea, height * width);
        }
        
        stack.push(i);
    }
    
    return maxArea;
}

// Dry Run: [2, 1, 5, 6, 2, 3]
//           0  1  2  3  4  5
//
// i=0: stack=[0]
// i=1: 1<2, pop 0, height=2, width=1, area=2, stack=[1]
// i=2: 5>1, stack=[1,2]
// i=3: 6>5, stack=[1,2,3]
// i=4: 2<6, pop 3, height=6, width=4-2-1=1, area=6
//      2<5, pop 2, height=5, width=4-1-1=2, area=10 ← max!
//      2>1, stack=[1,4]
// i=5: 3>2, stack=[1,4,5]
// i=6 (sentinel 0):
//      0<3, pop 5, height=3, width=6-4-1=1, area=3
//      0<2, pop 4, height=2, width=6-1-1=4, area=8
//      0<1, pop 1, height=1, width=6, area=6
// Return: 10

// Alternative: Compute left/right boundaries separately
function largestRectangleAreaAlt(heights) {
    const n = heights.length;
    const leftBound = new Array(n);
    const rightBound = new Array(n);
    const stack = [];
    
    // Find left boundary (next smaller on left)
    for (let i = 0; i < n; i++) {
        while (stack.length > 0 && heights[stack[stack.length - 1]] >= heights[i]) {
            stack.pop();
        }
        leftBound[i] = stack.length === 0 ? -1 : stack[stack.length - 1];
        stack.push(i);
    }
    
    stack.length = 0;
    
    // Find right boundary (next smaller on right)
    for (let i = n - 1; i >= 0; i--) {
        while (stack.length > 0 && heights[stack[stack.length - 1]] >= heights[i]) {
            stack.pop();
        }
        rightBound[i] = stack.length === 0 ? n : stack[stack.length - 1];
        stack.push(i);
    }
    
    // Calculate max area
    let maxArea = 0;
    for (let i = 0; i < n; i++) {
        const area = heights[i] * (rightBound[i] - leftBound[i] - 1);
        maxArea = Math.max(maxArea, area);
    }
    
    return maxArea;
}`,
    },
    {
      id: "problem-sliding-window-maximum",
      title: "Sliding Window Maximum",
      type: "problem",
      difficulty: "Hard",
      companies: ["Amazon", "Google", "Microsoft", "Facebook", "Citadel"],
      leetcode: "https://leetcode.com/problems/sliding-window-maximum/",
      content: `
## LeetCode #239: Sliding Window Maximum

Given an array nums and sliding window size k, return the max for each window position.

### Example
\`\`\`
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]

Window positions:        Max:
[1  3  -1] -3  5  3  6  7  → 3
 1 [3  -1  -3] 5  3  6  7  → 3
 1  3 [-1  -3  5] 3  6  7  → 5
 1  3  -1 [-3  5  3] 6  7  → 5
 1  3  -1  -3 [5  3  6] 7  → 6
 1  3  -1  -3  5 [3  6  7] → 7
\`\`\`

### Key Insight: Monotonic Decreasing Deque
Maintain a deque where elements are in decreasing order:
- Front always has the maximum for current window
- Remove elements outside window from front
- Remove smaller elements from back before adding new element
      `,
      code: `function maxSlidingWindow(nums, k) {
    const result = [];
    const deque = []; // Stores indices, front has max
    
    for (let i = 0; i < nums.length; i++) {
        // Remove indices outside current window
        while (deque.length > 0 && deque[0] < i - k + 1) {
            deque.shift();
        }
        
        // Remove smaller elements from back
        // (they'll never be the max while current element exists)
        while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
            deque.pop();
        }
        
        deque.push(i);
        
        // Add to result once we have full window
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }
    
    return result;
}

// Dry Run: nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3
//
// i=0: Remove back if < 1? No. deque=[0]
// i=1: Remove back if < 3? Yes(1), deque=[], push 1, deque=[1]
// i=2: i >= k-1, result.push(nums[1])=3
//      Remove back if < -1? No. deque=[1,2]
//      Result: [3]
// i=3: deque[0]=1 >= 3-3+1=1? Yes, keep
//      Remove back if < -3? No. deque=[1,2,3]
//      Result: [3, 3]
// i=4: deque[0]=1 < 4-3+1=2? Yes, shift. deque=[2,3]
//      Remove back if < 5? Yes(-3), Yes(-1). deque=[], push 4
//      deque=[4]
//      Result: [3, 3, 5]
// i=5: Remove back if < 3? No. deque=[4,5]
//      Result: [3, 3, 5, 5]
// i=6: deque[0]=4 < 6-3+1=4? No, keep
//      Remove back if < 6? Yes(3), Yes(5). deque=[], push 6
//      deque=[6]
//      Result: [3, 3, 5, 5, 6]
// i=7: Remove back if < 7? Yes(6). deque=[], push 7
//      deque=[7]
//      Result: [3, 3, 5, 5, 6, 7]

// Time: O(n) - each element added/removed from deque once
// Space: O(k) - deque stores at most k elements

// Alternative using MaxHeap - O(n log n)
// Not as efficient but conceptually simpler`,
    },
    {
      id: "problem-evaluate-rpn",
      title: "Evaluate Reverse Polish Notation",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Microsoft", "LinkedIn", "Google", "Facebook"],
      leetcode:
        "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
      content: `
## LeetCode #150: Evaluate Reverse Polish Notation

Evaluate the value of an arithmetic expression in Reverse Polish Notation (RPN).

### Example
\`\`\`
Input: tokens = ["2","1","+","3","*"]
Output: 9
Explanation: ((2 + 1) * 3) = 9

Input: tokens = ["4","13","5","/","+"]
Output: 6
Explanation: (4 + (13 / 5)) = 6
\`\`\`

### Key Insight
- Numbers: Push to stack
- Operators: Pop two operands, apply operator, push result
- Order matters for - and /: second popped is left operand
      `,
      code: `function evalRPN(tokens) {
    const stack = [];
    const operators = new Set(['+', '-', '*', '/']);
    
    for (const token of tokens) {
        if (operators.has(token)) {
            const b = stack.pop(); // Right operand
            const a = stack.pop(); // Left operand
            
            let result;
            switch (token) {
                case '+': result = a + b; break;
                case '-': result = a - b; break;
                case '*': result = a * b; break;
                case '/': result = Math.trunc(a / b); break; // Truncate toward zero
            }
            
            stack.push(result);
        } else {
            stack.push(parseInt(token));
        }
    }
    
    return stack[0];
}

// Dry Run: ["2", "1", "+", "3", "*"]
// "2": stack=[2]
// "1": stack=[2, 1]
// "+": pop 1, 2, push 2+1=3, stack=[3]
// "3": stack=[3, 3]
// "*": pop 3, 3, push 3*3=9, stack=[9]
// Return: 9

// Dry Run: ["4", "13", "5", "/", "+"]
// "4":  stack=[4]
// "13": stack=[4, 13]
// "5":  stack=[4, 13, 5]
// "/":  pop 5, 13, push 13/5=2, stack=[4, 2]
// "+":  pop 2, 4, push 4+2=6, stack=[6]
// Return: 6

// Note on division: Math.trunc truncates toward zero
// -7 / 2 = -3.5 → -3 (not -4 which is floor)

// Alternative: Using object for operations
function evalRPNAlt(tokens) {
    const stack = [];
    const operations = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => Math.trunc(a / b)
    };
    
    for (const token of tokens) {
        if (token in operations) {
            const b = stack.pop();
            const a = stack.pop();
            stack.push(operations[token](a, b));
        } else {
            stack.push(parseInt(token));
        }
    }
    
    return stack[0];
}`,
    },
  ],
};
