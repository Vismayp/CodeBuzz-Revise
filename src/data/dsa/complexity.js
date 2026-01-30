export const complexityTopic = {
  id: "complexity-analysis",
  title: "Complexity Analysis",
  description:
    "Master Big O notation, time-space trade-offs, and complexity analysis for interviews.",
  icon: "Activity",
  sections: [
    // ============== BEGINNER INTRODUCTION ==============
    {
      id: "what-is-big-o",
      title: "What is Big O? (Start Here! 🚀)",
      type: "theory",
      content: `
## 🍪 Big O Explained: The Cookie Counting Story!

Imagine you have a box of cookies and need to count them. How you count determines your **algorithm's efficiency**!

<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 24px; margin: 20px 0;">
  <h3 style="color: #4ade80; margin: 0 0 20px 0; text-align: center;">🍪 Two Ways to Count Cookies</h3>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
    <div style="background: #0f3460; padding: 20px; border-radius: 12px; border-left: 4px solid #f87171;">
      <h4 style="color: #f87171; margin: 0 0 10px 0;">❌ Slow Way: Count One by One</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 14px;">3 cookies = 3 seconds</p>
      <p style="color: #94a3b8; margin: 5px 0; font-size: 14px;">100 cookies = 100 seconds</p>
      <p style="color: #94a3b8; margin: 5px 0; font-size: 14px;">n cookies = <strong style="color: #fbbf24;">n seconds</strong></p>
      <p style="color: #a78bfa; margin: 10px 0 0 0; font-weight: bold;">This is O(n) - Linear Time</p>
    </div>
    
    <div style="background: #0f3460; padding: 20px; border-radius: 12px; border-left: 4px solid #4ade80;">
      <h4 style="color: #4ade80; margin: 0 0 10px 0;">✅ Fast Way: Read the Label!</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 14px;">3 cookies = 1 second (just read)</p>
      <p style="color: #94a3b8; margin: 5px 0; font-size: 14px;">100 cookies = 1 second</p>
      <p style="color: #94a3b8; margin: 5px 0; font-size: 14px;">n cookies = <strong style="color: #fbbf24;">1 second</strong></p>
      <p style="color: #a78bfa; margin: 10px 0 0 0; font-weight: bold;">This is O(1) - Constant Time</p>
    </div>
  </div>
</div>

### 🎯 What is Big O Notation?

Big O answers: **"How does my code's speed change as input grows?"**

Think of it like asking:
- 🚗 If I drive **10 miles**, it takes 10 minutes
- 🚗 If I drive **100 miles**, does it take 100 minutes? Or still 10 minutes?

<div style="background: #1e293b; padding: 20px; border-radius: 12px; margin: 20px 0;">
  <h4 style="color: #60a5fa; margin: 0 0 15px 0;">📊 The Big O Speed Chart</h4>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="background: #22c55e; color: black; padding: 4px 12px; border-radius: 20px; font-weight: bold; min-width: 80px; text-align: center;">O(1)</span>
      <div style="flex: 1; height: 20px; background: linear-gradient(90deg, #22c55e 5%, #1e293b 5%); border-radius: 4px;"></div>
      <span style="color: #94a3b8; font-size: 12px;">Instant! 🚀</span>
    </div>
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="background: #84cc16; color: black; padding: 4px 12px; border-radius: 20px; font-weight: bold; min-width: 80px; text-align: center;">O(log n)</span>
      <div style="flex: 1; height: 20px; background: linear-gradient(90deg, #84cc16 15%, #1e293b 15%); border-radius: 4px;"></div>
      <span style="color: #94a3b8; font-size: 12px;">Very Fast</span>
    </div>
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="background: #facc15; color: black; padding: 4px 12px; border-radius: 20px; font-weight: bold; min-width: 80px; text-align: center;">O(n)</span>
      <div style="flex: 1; height: 20px; background: linear-gradient(90deg, #facc15 35%, #1e293b 35%); border-radius: 4px;"></div>
      <span style="color: #94a3b8; font-size: 12px;">Fair</span>
    </div>
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="background: #fb923c; color: black; padding: 4px 12px; border-radius: 20px; font-weight: bold; min-width: 80px; text-align: center;">O(n log n)</span>
      <div style="flex: 1; height: 20px; background: linear-gradient(90deg, #fb923c 50%, #1e293b 50%); border-radius: 4px;"></div>
      <span style="color: #94a3b8; font-size: 12px;">Okay</span>
    </div>
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="background: #f87171; color: black; padding: 4px 12px; border-radius: 20px; font-weight: bold; min-width: 80px; text-align: center;">O(n²)</span>
      <div style="flex: 1; height: 20px; background: linear-gradient(90deg, #f87171 75%, #1e293b 75%); border-radius: 4px;"></div>
      <span style="color: #94a3b8; font-size: 12px;">Slow 🐢</span>
    </div>
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="background: #ef4444; color: white; padding: 4px 12px; border-radius: 20px; font-weight: bold; min-width: 80px; text-align: center;">O(2ⁿ)</span>
      <div style="flex: 1; height: 20px; background: linear-gradient(90deg, #ef4444 100%, #1e293b 100%); border-radius: 4px;"></div>
      <span style="color: #94a3b8; font-size: 12px;">Terrible! 💀</span>
    </div>
  </div>
</div>

### 💡 Real-World Analogies for Each Complexity

| Big O | Real World Example | What It Means |
|-------|-------------------|---------------|
| **O(1)** | Looking up a word in a dictionary by page number | Same time regardless of dictionary size |
| **O(log n)** | Finding a name in a phone book (binary search) | Cut problem in half each step |
| **O(n)** | Reading every page of a book | Time grows with book size |
| **O(n²)** | Comparing every student with every other student | Double input = 4x time |
| **O(2ⁿ)** | Trying every combination of a password | Explodes exponentially! |

### ⚠️ The Golden Rule for Beginners

> **Drop the constants, keep the biggest term!**
> - O(2n) → O(n)
> - O(n² + n) → O(n²)
> - O(500) → O(1)
      `,
      code: `// 🍪 THE COOKIE COUNTING STORY IN CODE

// ═══════════════════════════════════════════════════════════
// O(1) - CONSTANT TIME: "Read the label!"
// ═══════════════════════════════════════════════════════════
function getCookieCount(box) {
    return box.label; // Just read it - instant!
    // Whether box has 5 or 5 million cookies, same speed!
}

// Real example: Array access by index
function getFirstCookie(cookies) {
    return cookies[0]; // Always 1 step, no matter array size
}


// ═══════════════════════════════════════════════════════════
// O(n) - LINEAR TIME: "Count one by one"
// ═══════════════════════════════════════════════════════════
function countCookiesOneByOne(cookies) {
    let count = 0;
    for (let i = 0; i < cookies.length; i++) {
        count++; // Visit each cookie once
    }
    return count;
    // 10 cookies = 10 steps, 1000 cookies = 1000 steps
}


// ═══════════════════════════════════════════════════════════
// O(n²) - QUADRATIC TIME: "Compare every cookie with every other"
// ═══════════════════════════════════════════════════════════
function findDuplicateFlavors(cookies) {
    for (let i = 0; i < cookies.length; i++) {
        for (let j = i + 1; j < cookies.length; j++) {
            if (cookies[i].flavor === cookies[j].flavor) {
                console.log("Duplicate found!");
            }
        }
    }
    // 10 cookies = ~50 comparisons
    // 100 cookies = ~5000 comparisons (100x more cookies = 100x more time)
}


// ═══════════════════════════════════════════════════════════
// O(log n) - LOGARITHMIC TIME: "Phone book search"
// ═══════════════════════════════════════════════════════════
function findCookieByName(sortedCookies, name) {
    let left = 0;
    let right = sortedCookies.length - 1;
    
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        
        if (sortedCookies[mid].name === name) {
            return mid; // Found it!
        } else if (sortedCookies[mid].name < name) {
            left = mid + 1;  // Search right half
        } else {
            right = mid - 1; // Search left half
        }
    }
    return -1;
    // 1000 cookies = ~10 steps (cuts in half each time!)
}`,
    },
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
    // ============== ADVANCED INTERVIEW SECTIONS ==============
    {
      id: "big-o-theta-omega",
      title: "Big-O vs Big-Θ vs Big-Ω (Interview Essential)",
      type: "theory",
      content: `
## The Complete Asymptotic Notation Family 🎯

Most developers only know Big-O, but interviewers love asking about all three notations!

<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 24px; margin: 20px 0;">
  <h3 style="color: #4ade80; margin: 0 0 20px 0; text-align: center;">📊 The Three Bounds</h3>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
    <div style="background: #0f3460; padding: 16px; border-radius: 12px; border-left: 4px solid #f87171;">
      <h4 style="color: #f87171; margin: 0 0 8px 0;">O (Big-O)</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;"><strong>Upper Bound</strong></p>
      <p style="color: #a78bfa; margin: 8px 0 0 0; font-size: 12px;">"At most this slow"</p>
      <p style="color: #60a5fa; margin: 4px 0 0 0; font-size: 11px;">Worst-case guarantee</p>
    </div>
    
    <div style="background: #0f3460; padding: 16px; border-radius: 12px; border-left: 4px solid #4ade80;">
      <h4 style="color: #4ade80; margin: 0 0 8px 0;">Ω (Big-Omega)</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;"><strong>Lower Bound</strong></p>
      <p style="color: #a78bfa; margin: 8px 0 0 0; font-size: 12px;">"At least this fast"</p>
      <p style="color: #60a5fa; margin: 4px 0 0 0; font-size: 11px;">Best-case baseline</p>
    </div>
    
    <div style="background: #0f3460; padding: 16px; border-radius: 12px; border-left: 4px solid #fbbf24;">
      <h4 style="color: #fbbf24; margin: 0 0 8px 0;">Θ (Big-Theta)</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;"><strong>Tight Bound</strong></p>
      <p style="color: #a78bfa; margin: 8px 0 0 0; font-size: 12px;">"Exactly this"</p>
      <p style="color: #60a5fa; margin: 4px 0 0 0; font-size: 11px;">Upper AND lower bound</p>
    </div>
  </div>
</div>

### Mathematical Definitions

| Notation | Meaning | Mathematical Definition |
|----------|---------|------------------------|
| $O(g(n))$ | Upper bound | $f(n) \\leq c \\cdot g(n)$ for some $c > 0$, $n > n_0$ |
| $\\Omega(g(n))$ | Lower bound | $f(n) \\geq c \\cdot g(n)$ for some $c > 0$, $n > n_0$ |
| $\\Theta(g(n))$ | Tight bound | $c_1 \\cdot g(n) \\leq f(n) \\leq c_2 \\cdot g(n)$ |

### 🧠 Real-World Analogy

Think of driving times:
- **O(2 hours)**: "I'll arrive in at most 2 hours" (traffic could help)
- **Ω(30 min)**: "It takes at least 30 minutes" (even with no traffic)
- **Θ(1 hour)**: "It takes about 1 hour" (consistent timing)

### Interview Example: QuickSort

| Case | Complexity | Notation Used |
|------|------------|---------------|
| Best | $O(n \\log n)$ | $\\Omega(n \\log n)$ |
| Average | $O(n \\log n)$ | $\\Theta(n \\log n)$ |
| Worst | $O(n^2)$ | $O(n^2)$ |

> ✅ **Interview Tip**: When asked "What's the complexity?", specify which case you're describing!

### 💡 One-Line Definitions
- **Big-O**: Maximum time your algorithm will ever take
- **Big-Omega**: Minimum time your algorithm needs  
- **Big-Theta**: Algorithm always takes approximately this time
      `,
      code: `// Understanding the three notations with examples

// ═══════════════════════════════════════════════════════════
// LINEAR SEARCH COMPLEXITY ANALYSIS
// ═══════════════════════════════════════════════════════════
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i;
    }
    return -1;
}

// Best Case: Target is first element → Ω(1)
// Worst Case: Target is last or not present → O(n)
// Average Case: Target is in middle → Θ(n/2) → Θ(n)

// We say: O(n), Ω(1) - NOT tight bound possible!


// ═══════════════════════════════════════════════════════════
// BINARY SEARCH - ALL CASES ARE LOGARITHMIC
// ═══════════════════════════════════════════════════════════
function binarySearchNotation(arr, target) {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

// Best Case: Middle element is target → Ω(1)
// Worst Case: Element not found → O(log n)
// We can't use Θ(log n) because best ≠ worst!


// ═══════════════════════════════════════════════════════════
// SUMMING ARRAY - ALWAYS LINEAR (TIGHT BOUND)
// ═══════════════════════════════════════════════════════════
function sumArray(arr) {
    let total = 0;
    for (const num of arr) {
        total += num;  // Must visit every element
    }
    return total;
}

// EVERY case is exactly n iterations!
// Best = Average = Worst = n
// So we CAN say: Θ(n) - tight bound!


// ═══════════════════════════════════════════════════════════
// INTERVIEW QUESTION: "What's the complexity of this?"
// ═══════════════════════════════════════════════════════════
// Correct answer format:
// "This algorithm is O(n) in the worst case, but Ω(1) 
//  in the best case when the element is found early.
//  If you need a tight bound, it's Θ(n) on average."`,
    },
    {
      id: "master-theorem-deep-dive",
      title: "Master Theorem (Divide & Conquer Analysis)",
      type: "theory",
      content: `
## Master Theorem: Solving Recurrence Relations 🧮

The Master Theorem is your secret weapon for analyzing **divide and conquer** algorithms!

### The Master Theorem Formula

For recurrence relations of the form:
$$T(n) = aT(n/b) + O(n^d)$$

Where:
- **a** = number of subproblems
- **b** = factor by which input is divided
- **d** = exponent in the cost of combining

### The Three Cases

<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 24px; margin: 20px 0;">
  <h4 style="color: #60a5fa; margin: 0 0 20px 0;">🎯 Compare d with log_b(a)</h4>
  
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <div style="background: #0f3460; padding: 16px; border-radius: 8px;">
      <span style="color: #4ade80; font-weight: bold;">Case 1:</span>
      <span style="color: #94a3b8;"> If d < log_b(a) → </span>
      <span style="color: #fbbf24; font-weight: bold;">T(n) = O(n^(log_b(a)))</span>
      <p style="color: #a78bfa; margin: 8px 0 0 0; font-size: 12px;">Leaves dominate - more work at bottom of tree</p>
    </div>
    
    <div style="background: #0f3460; padding: 16px; border-radius: 8px;">
      <span style="color: #4ade80; font-weight: bold;">Case 2:</span>
      <span style="color: #94a3b8;"> If d = log_b(a) → </span>
      <span style="color: #fbbf24; font-weight: bold;">T(n) = O(n^d × log n)</span>
      <p style="color: #a78bfa; margin: 8px 0 0 0; font-size: 12px;">Equal work at each level</p>
    </div>
    
    <div style="background: #0f3460; padding: 16px; border-radius: 8px;">
      <span style="color: #4ade80; font-weight: bold;">Case 3:</span>
      <span style="color: #94a3b8;"> If d > log_b(a) → </span>
      <span style="color: #fbbf24; font-weight: bold;">T(n) = O(n^d)</span>
      <p style="color: #a78bfa; margin: 8px 0 0 0; font-size: 12px;">Root dominates - most work at top</p>
    </div>
  </div>
</div>

### Common Algorithm Examples

| Algorithm | Recurrence | a | b | d | Case | Result |
|-----------|------------|---|---|---|------|--------|
| Binary Search | T(n) = T(n/2) + 1 | 1 | 2 | 0 | d = log_2(1) = 0 | O(log n) |
| Merge Sort | T(n) = 2T(n/2) + n | 2 | 2 | 1 | d = log_2(2) = 1 | O(n log n) |
| Karatsuba | T(n) = 3T(n/2) + n | 3 | 2 | 1 | d < log_2(3) ≈ 1.58 | O(n^1.58) |
| Strassen | T(n) = 7T(n/2) + n² | 7 | 2 | 2 | d < log_2(7) ≈ 2.81 | O(n^2.81) |

### 🧠 Visual Mental Model

\`\`\`
Recursion Tree Analysis:
                    Level 0: n^d work
                   /        \\
          Level 1: a × (n/b)^d work each
         /    \\       /    \\
Level k: a^k × (n/b^k)^d work each

Total levels: log_b(n)
Total leaves: a^(log_b(n)) = n^(log_b(a))
\`\`\`

> 💡 **Pro Tip**: The key insight is comparing the work done at leaves vs root!
      `,
      code: `// ═══════════════════════════════════════════════════════════
// MASTER THEOREM EXAMPLES IN CODE
// ═══════════════════════════════════════════════════════════

// Example 1: Binary Search
// T(n) = T(n/2) + O(1)
// a=1, b=2, d=0
// log_2(1) = 0 = d → Case 2
// Result: O(n^0 × log n) = O(log n)
function binarySearchMaster(arr, target, low = 0, high = arr.length - 1) {
    if (low > high) return -1;
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) {
        return binarySearchMaster(arr, target, mid + 1, high);
    }
    return binarySearchMaster(arr, target, low, mid - 1);
}


// Example 2: Merge Sort
// T(n) = 2T(n/2) + O(n)
// a=2, b=2, d=1
// log_2(2) = 1 = d → Case 2
// Result: O(n^1 × log n) = O(n log n)
function mergeSortMaster(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSortMaster(arr.slice(0, mid));
    const right = mergeSortMaster(arr.slice(mid));
    
    return mergeMaster(left, right);
}

function mergeMaster(left, right) {
    const result = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) result.push(left[i++]);
        else result.push(right[j++]);
    }
    return [...result, ...left.slice(i), ...right.slice(j)];
}


// Example 3: Finding max (divide and conquer)
// T(n) = 2T(n/2) + O(1)
// a=2, b=2, d=0
// log_2(2) = 1 > d=0 → Case 1
// Result: O(n^1) = O(n)
function findMaxRecursive(arr, start = 0, end = arr.length - 1) {
    if (start === end) return arr[start];
    
    const mid = Math.floor((start + end) / 2);
    const leftMax = findMaxRecursive(arr, start, mid);
    const rightMax = findMaxRecursive(arr, mid + 1, end);
    
    return Math.max(leftMax, rightMax);
}


// ═══════════════════════════════════════════════════════════
// INTERVIEW PRACTICE: Analyze this recurrence
// ═══════════════════════════════════════════════════════════
function mystery(n) {
    if (n <= 1) return 1;
    return mystery(n / 3) + mystery(n / 3) + mystery(n / 3) + n * n;
}
// Recurrence: T(n) = 3T(n/3) + O(n²)
// a=3, b=3, d=2
// log_3(3) = 1 < d=2 → Case 3
// Result: O(n²) - the combining work dominates!`,
    },
    {
      id: "common-interview-traps",
      title: "Common Interview Traps & Edge Cases",
      type: "theory",
      content: `
## 🚨 Complexity Analysis Traps Interviewers Love

### Trap 1: Hidden Loops in Built-in Methods

\`\`\`javascript
// This looks O(n), but it's O(n²)!
for (let i = 0; i < arr.length; i++) {
    arr.includes(target);  // includes() is O(n)!
}
\`\`\`

### Trap 2: String Concatenation

\`\`\`javascript
// This is O(n²), not O(n)!
let result = "";
for (let i = 0; i < n; i++) {
    result += char;  // Creates new string each time!
}
\`\`\`

### Trap 3: Array.slice() and Array.splice()

| Operation | Complexity | Why |
|-----------|------------|-----|
| \`slice()\` | O(k) | Copies k elements |
| \`splice()\` | O(n) | May shift remaining elements |
| \`shift()\` | O(n) | Shifts all elements left |
| \`unshift()\` | O(n) | Shifts all elements right |

### Trap 4: Multiple Variables

\`\`\`javascript
// This is O(n + m), NOT O(n)!
function processTwo(arr1, arr2) {
    for (const x of arr1) { /* n ops */ }
    for (const y of arr2) { /* m ops */ }
}
\`\`\`

### Trap 5: Logarithmic Base Confusion

All logarithmic bases are equivalent in Big-O!
$$O(\\log_2 n) = O(\\log_{10} n) = O(\\ln n) = O(\\log n)$$

Because: $\\log_a n = \\frac{\\log_b n}{\\log_b a}$ (constant factor!)

### 🎯 Interview Checklist

✅ Identify hidden loops in built-in methods
✅ Account for string immutability  
✅ Consider array shifting operations
✅ Keep different inputs as separate variables
✅ Don't forget recursive stack space
✅ Consider amortized vs worst-case
      `,
      code: `// ═══════════════════════════════════════════════════════════
// TRAP 1: HIDDEN LOOPS IN BUILT-IN METHODS
// ═══════════════════════════════════════════════════════════

// BAD: O(n²) - includes() is O(n)
function hasDuplicateBad(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr.slice(i + 1).includes(arr[i])) {
            return true;
        }
    }
    return false;
}

// GOOD: O(n) - Set lookup is O(1)
function hasDuplicateGood(arr) {
    const seen = new Set();
    for (const num of arr) {
        if (seen.has(num)) return true;
        seen.add(num);
    }
    return false;
}


// ═══════════════════════════════════════════════════════════
// TRAP 2: STRING CONCATENATION
// ═══════════════════════════════════════════════════════════

// BAD: O(n²) - string is immutable!
function repeatCharBad(char, n) {
    let result = "";
    for (let i = 0; i < n; i++) {
        result += char;
    }
    return result;
}

// GOOD: O(n) - array join
function repeatCharGood(char, n) {
    const chars = [];
    for (let i = 0; i < n; i++) {
        chars.push(char);
    }
    return chars.join("");
}


// ═══════════════════════════════════════════════════════════
// TRAP 3: SHIFT/UNSHIFT OPERATIONS
// ═══════════════════════════════════════════════════════════

// BAD: O(n²) - shift is O(n)
function processQueueBad(queue) {
    while (queue.length > 0) {
        const item = queue.shift();
        console.log(item);
    }
}

// GOOD: O(n) - use index pointer
function processQueueGood(queue) {
    for (let i = 0; i < queue.length; i++) {
        console.log(queue[i]);
    }
}


// ═══════════════════════════════════════════════════════════
// TRAP 4: FORGETTING RECURSION STACK SPACE
// ═══════════════════════════════════════════════════════════

// Uses O(n) SPACE even though no arrays created!
function sumRecursive(n) {
    if (n <= 0) return 0;
    return n + sumRecursive(n - 1);
}

// O(1) space - iterative
function sumIterative(n) {
    let total = 0;
    for (let i = 1; i <= n; i++) {
        total += i;
    }
    return total;
}`,
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
