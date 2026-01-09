export const complexityTopic = {
  id: "complexity-analysis",
  title: "Complexity Analysis",
  description:
    "Master Big O notation, time-space trade-offs, and complexity analysis for interviews.",
  icon: "Activity",
  sections: [
    // ============== THEORY SECTIONS ==============
    {
      id: "big-o-introduction",
      title: "Introduction to Big O",
      type: "theory",
      content: `
Big O notation describes the **upper bound** of an algorithm's growth rate as input size $n$ increases.

### Why Complexity Analysis Matters
- **Compare algorithms objectively** without running them
- **Predict performance** at scale (what happens when $n = 10^6$?)
- **Identify bottlenecks** in your code
- **Interview essential**: Every coding interview asks about time/space complexity

### The Big O Family
| Notation | Name | Example |
|----------|------|---------|
| $O(1)$ | Constant | Array access by index |
| $O(\\log n)$ | Logarithmic | Binary Search |
| $O(n)$ | Linear | Single loop through array |
| $O(n \\log n)$ | Linearithmic | Merge Sort, Quick Sort (avg) |
| $O(n^2)$ | Quadratic | Nested loops |
| $O(2^n)$ | Exponential | Recursive Fibonacci |
| $O(n!)$ | Factorial | Permutations |

### Key Rules for Calculating Big O
1. **Drop constants**: $O(2n) = O(n)$
2. **Drop lower-order terms**: $O(n^2 + n) = O(n^2)$
3. **Different inputs = different variables**: Two arrays → $O(n + m)$
4. **Nested operations multiply**: Loop inside loop → $O(n \\times m)$
      `,
      code: `// O(1) - Constant Time
function getFirst(arr) {
    return arr[0]; // Always 1 operation, regardless of array size
}

// O(n) - Linear Time  
function findMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) { // Visits each element once
        if (arr[i] > max) max = arr[i];
    }
    return max;
}

// O(n²) - Quadratic Time
function printAllPairs(arr) {
    for (let i = 0; i < arr.length; i++) {       // n iterations
        for (let j = 0; j < arr.length; j++) {   // n iterations each
            console.log(arr[i], arr[j]);         // n × n = n² total
        }
    }
}

// O(log n) - Logarithmic Time
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
    {
      id: "logarithmic-complexity",
      title: "Understanding O(log n)",
      type: "theory",
      content: `
## Why Binary Search is O(log n)

The **logarithm** appears whenever we **halve** the problem size at each step.

### The Mathematical Intuition
- Start with $n$ elements
- After 1 step: $n/2$ elements remain
- After 2 steps: $n/4$ elements remain
- After $k$ steps: $n/2^k$ elements remain

We stop when $n/2^k = 1$, which means:
$$n = 2^k \\implies k = \\log_2(n)$$

### Interview Pattern: When to Expect O(log n)
1. **Halving**: Problem size reduces by half each iteration
2. **Doubling**: Variable doubles each iteration (opposite direction)
3. **Tree height**: Balanced tree operations
4. **Divide and conquer**: Each step splits problem in half

### Dry Run: Binary Search
\`\`\`
Array: [1, 3, 5, 7, 9, 11, 13, 15]  (n = 8)
Target: 11

Step 1: Check middle (index 3, value 7)
        11 > 7 → Search right half [9, 11, 13, 15]
        
Step 2: Check middle (index 5, value 11)
        11 == 11 → Found!

Total steps: 2 (and log₂(8) = 3, so within bound ✓)
\`\`\`
      `,
      code: `// Pattern 1: Halving (Binary Search style)
function halvingExample(n) {
    let count = 0;
    while (n > 1) {
        n = Math.floor(n / 2);
        count++;
    }
    return count; // Returns approximately log₂(n)
}

// Pattern 2: Doubling
function doublingExample(n) {
    let i = 1;
    let count = 0;
    while (i < n) {
        i = i * 2;  // Doubles each iteration
        count++;
    }
    return count; // Also O(log n)
}

// Pattern 3: Dividing by any constant
function divideByThree(n) {
    let count = 0;
    while (n > 1) {
        n = Math.floor(n / 3);  // Still O(log n), just log₃(n)
        count++;
    }
    return count;
}

console.log(halvingExample(16));   // 4 (log₂(16) = 4)
console.log(doublingExample(16));  // 4
console.log(divideByThree(27));    // 3 (log₃(27) = 3)`,
    },
    {
      id: "space-complexity",
      title: "Space Complexity",
      type: "theory",
      content: `
## Space Complexity Fundamentals

Space complexity measures the **total memory** your algorithm uses relative to input size.

### Components of Space
1. **Input space**: Memory for the input (usually not counted)
2. **Auxiliary space**: Extra memory your algorithm needs
3. **Stack space**: Memory for recursive calls

### Common Space Complexities

| Space | Example |
|-------|---------|
| $O(1)$ | In-place swap, constant variables |
| $O(n)$ | Creating a copy of array, hash map |
| $O(n^2)$ | 2D matrix |
| $O(\\log n)$ | Recursive binary search (call stack) |

### Interview Trap: Recursive Space
Every recursive call adds a frame to the call stack!

\`\`\`
factorial(5)
  → factorial(4)
    → factorial(3)
      → factorial(2)
        → factorial(1)
\`\`\`
This uses O(n) space even though we don't create arrays!

### Time-Space Trade-off
Often you can trade space for time:
- **Memoization**: Use O(n) space to reduce O(2^n) time to O(n)
- **Hash maps**: Use O(n) space to reduce O(n²) time to O(n)
      `,
      code: `// O(1) Space - In-place operations
function reverseInPlace(arr) {
    let left = 0, right = arr.length - 1;
    while (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
    }
    return arr;
}

// O(n) Space - Creating new data structure
function createFrequencyMap(arr) {
    const map = {}; // This grows with unique elements
    for (const num of arr) {
        map[num] = (map[num] || 0) + 1;
    }
    return map;
}

// O(log n) Space - Recursive call stack
function binarySearchRecursive(arr, target, low = 0, high = arr.length - 1) {
    if (low > high) return -1;
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) {
        return binarySearchRecursive(arr, target, mid + 1, high);
    }
    return binarySearchRecursive(arr, target, low, mid - 1);
}

// O(n) Space - Recursive call stack (linear recursion)
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1); // n stack frames!
}`,
    },
    {
      id: "amortized-analysis",
      title: "Amortized Analysis",
      type: "theory",
      content: `
## Amortized Complexity

**Amortized analysis** considers the average time per operation over a sequence of operations.

### Classic Example: Dynamic Array (ArrayList/Vector)

When you push to a dynamic array:
- **Most pushes**: O(1) - just add to end
- **Occasional push**: O(n) - need to resize and copy

But **amortized** cost is still **O(1)** per push!

### Why?
If we double the array size when full:
- Push 1: 1 copy
- Push 2: 1 copy + 1 resize (copy 1)
- Push 3: 1 copy
- Push 4: 1 copy + 1 resize (copy 3)
- Push 5-8: 4 copies + 1 resize (copy 4)

Total copies for n pushes ≈ n + n/2 + n/4 + ... ≈ 2n

So **amortized cost = 2n/n = O(1)** per operation!

### Interview Tip
When asked about ArrayList/vector push complexity:
> "O(1) amortized. Individual operations may be O(n) during resizing, but averaged over many operations, each push is O(1)."
      `,
      code: `// Simulating dynamic array behavior
class DynamicArray {
    constructor() {
        this.data = new Array(1);
        this.capacity = 1;
        this.size = 0;
    }
    
    push(element) {
        // Check if resize needed
        if (this.size === this.capacity) {
            this._resize(); // O(n) operation, but rare
        }
        this.data[this.size] = element;
        this.size++;
    }
    
    _resize() {
        // Double the capacity
        const newCapacity = this.capacity * 2;
        const newData = new Array(newCapacity);
        
        // Copy all elements - O(n)
        for (let i = 0; i < this.size; i++) {
            newData[i] = this.data[i];
        }
        
        this.data = newData;
        this.capacity = newCapacity;
        console.log(\`Resized to \${newCapacity}\`);
    }
}

// Test it
const arr = new DynamicArray();
for (let i = 1; i <= 10; i++) {
    arr.push(i);
}
// Output shows resizing happens at push 2, 3, 5, 9
// But average cost per push is still O(1)`,
    },
    // ============== PROBLEM SECTIONS ==============
    {
      id: "problem-analyze-complexity",
      title: "Problem: Analyze Loop Complexity",
      type: "problem",
      difficulty: "Easy",
      companies: ["Google", "Amazon", "Microsoft"],
      content: `
## Problem: What is the time complexity?

Analyze each code snippet and determine its time complexity.

### Snippet 1
\`\`\`javascript
for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
        console.log(i, j);
    }
}
\`\`\`

### Snippet 2
\`\`\`javascript
for (let i = 1; i < n; i = i * 2) {
    for (let j = 0; j < n; j++) {
        console.log(i, j);
    }
}
\`\`\`

### Snippet 3
\`\`\`javascript
for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
        console.log(i, j);
    }
}
\`\`\`
      `,
      code: `// Solution Analysis

// Snippet 1: O(n²)
// Dry run: i=0 → j runs n times
//          i=1 → j runs n-1 times
//          ...
//          i=n-1 → j runs 1 time
// Total = n + (n-1) + ... + 1 = n(n+1)/2 = O(n²)

// Snippet 2: O(n log n)
// Outer loop: i doubles each time → O(log n) iterations
// Inner loop: runs n times for each outer iteration
// Total = O(log n) × O(n) = O(n log n)

// Snippet 3: O(n × m)
// Two DIFFERENT inputs means two different variables!
// Don't simplify to O(n²) unless n === m

// Common Interview Mistake:
// Q: "What if m is always n²?"
// A: "Then complexity becomes O(n × n²) = O(n³)"

// Key Patterns to Remember:
// 1. Nested loops where inner depends on outer → usually still O(n²)
// 2. Variable multiplying → log n iterations
// 3. Different inputs → keep as separate variables`,
    },
    {
      id: "problem-find-time-complexity",
      title: "Problem: Recursive Complexity",
      type: "problem",
      difficulty: "Medium",
      companies: ["Facebook", "Apple", "Bloomberg"],
      content: `
## Problem: Analyze Recursive Time Complexity

### Function 1: Fibonacci
\`\`\`javascript
function fib(n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);
}
\`\`\`

### Function 2: Binary Search (Recursive)
\`\`\`javascript
function search(arr, target, low, high) {
    if (low > high) return -1;
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) return search(arr, target, mid+1, high);
    return search(arr, target, low, mid-1);
}
\`\`\`

### Function 3: Merge Sort
\`\`\`javascript
function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right); // merge is O(n)
}
\`\`\`
      `,
      code: `// Analysis Solutions

// Function 1: Fibonacci
// Time: O(2^n) - Each call makes 2 more calls
// Space: O(n) - Maximum depth of recursion tree
// 
// Recursion tree:
//                 fib(5)
//              /         \\
//          fib(4)        fib(3)
//         /    \\        /    \\
//      fib(3) fib(2)  fib(2) fib(1)
//      ...    ...     ...
// 
// At each level, calls roughly double → 2^n nodes

// Function 2: Binary Search
// Time: O(log n) - Problem halves each time
// Space: O(log n) - Recursive stack depth
// 
// Recurrence: T(n) = T(n/2) + O(1)
// Each call does O(1) work, makes 1 recursive call with n/2

// Function 3: Merge Sort
// Time: O(n log n)
// Space: O(n) for the merged arrays + O(log n) for stack
// 
// Recurrence: T(n) = 2T(n/2) + O(n)
// - Split into 2 halves: 2T(n/2)
// - Merge takes O(n)
// 
// Recursion tree has log n levels
// Each level does O(n) work total
// Total: O(n log n)

// Master Theorem Quick Reference:
// T(n) = aT(n/b) + O(n^d)
// - If d < log_b(a): O(n^(log_b(a)))
// - If d = log_b(a): O(n^d × log n)
// - If d > log_b(a): O(n^d)`,
    },
    {
      id: "problem-optimize-complexity",
      title: "Problem: Optimize to Better Complexity",
      type: "problem",
      difficulty: "Medium",
      companies: ["Google", "Amazon", "Uber"],
      leetcode: "https://leetcode.com/problems/two-sum/",
      content: `
## Problem: Two Sum (LeetCode #1)

Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to target.

### Example
\`\`\`
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9
\`\`\`

### Challenge
1. First write the **brute force** O(n²) solution
2. Then optimize to **O(n)** using a hash map

### Key Insight
> Time-space trade-off: Use O(n) extra space to achieve O(n) time
      `,
      code: `// Brute Force: O(n²) Time, O(1) Space
function twoSumBrute(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}

// Optimized: O(n) Time, O(n) Space
function twoSum(nums, target) {
    const map = new Map(); // Store {value: index}
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        // Check if complement exists in map
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        // Store current number and its index
        map.set(nums[i], i);
    }
    
    return [];
}

// Dry Run with [2, 7, 11, 15], target = 9
// i=0: complement=7, map={}, map.set(2,0) → map={2:0}
// i=1: complement=2, map={2:0}, map.has(2)=true! → return [0,1]

// Why this works:
// - Instead of looking forward (O(n) per element)
// - We look backward in O(1) using hash map
// - Trade O(n) space for O(n²) → O(n) time improvement`,
    },
    {
      id: "problem-complexity-comparison",
      title: "Problem: Compare Algorithms",
      type: "problem",
      difficulty: "Hard",
      companies: ["Google", "Microsoft", "Apple"],
      content: `
## Problem: When to Use Which Algorithm?

Given these scenarios, choose the optimal approach and justify with complexity analysis.

### Scenario 1: Finding an element
- **Unsorted array** of 1 million elements
- **Sorted array** of 1 million elements

### Scenario 2: Finding duplicates
- Array of 10,000 elements
- Memory is extremely limited

### Scenario 3: Sorting
- Array of 50 elements
- Array of 10 million elements

### Scenario 4: Frequent lookups
- Need to check if elements exist
- 100,000 lookups on 10,000 element collection
      `,
      code: `// Scenario 1: Finding an element

// Unsorted: Must use Linear Search O(n)
// 1 million elements → ~1 million comparisons worst case
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i;
    }
    return -1;
}

// Sorted: Use Binary Search O(log n)  
// 1 million elements → ~20 comparisons (log₂(10⁶) ≈ 20)
// That's 50,000x faster!

// Scenario 2: Finding duplicates

// With memory: Hash Set O(n) time, O(n) space
function findDuplicateHash(arr) {
    const seen = new Set();
    for (const num of arr) {
        if (seen.has(num)) return num;
        seen.add(num);
    }
}

// Without memory: Sort first O(n log n) time, O(1) space
function findDuplicateSort(arr) {
    arr.sort((a, b) => a - b);
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] === arr[i-1]) return arr[i];
    }
}

// Scenario 3: Sorting

// 50 elements: Even O(n²) is fine
// 50² = 2,500 operations - instant

// 10 million elements: MUST use O(n log n)
// n² = 10¹⁴ operations - would take hours
// n log n = ~2.3 × 10⁸ operations - seconds

// Scenario 4: Frequent lookups

// Array: 100,000 lookups × O(n) search = O(100,000 × 10,000) = 10⁹ ops
// HashSet: 100,000 lookups × O(1) search = O(100,000) = 10⁵ ops

// Converting to HashSet first:
// Build: O(n) = 10,000
// Lookups: O(1) × 100,000 = 100,000
// Total: ~110,000 operations

// Verdict: Use HashSet - 10,000x faster!`,
    },
  ],
};
