export const arraysTopic = {
  id: "arrays-hashing",
  title: "Arrays & Hashing",
  description:
    "Master array patterns: Two Pointers, Sliding Window, Prefix Sum, and Hash Maps.",
  icon: "Layers",
  sections: [
    // ============== THEORY SECTIONS ==============
    {
      id: "array-fundamentals",
      title: "Array Fundamentals",
      type: "theory",
      content: `
## Arrays: The Foundation of DSA

An array stores elements in **contiguous memory**, enabling O(1) random access.

### Core Operations & Complexity

| Operation | Time | Space | Notes |
|-----------|------|-------|-------|
| Access by index | O(1) | O(1) | Direct memory calculation |
| Search (unsorted) | O(n) | O(1) | Linear scan required |
| Search (sorted) | O(log n) | O(1) | Binary search |
| Insert at end | O(1)* | O(1) | *Amortized for dynamic arrays |
| Insert at beginning | O(n) | O(1) | All elements shift right |
| Delete at end | O(1) | O(1) | Just decrement size |
| Delete at beginning | O(n) | O(1) | All elements shift left |

### Interview Insight
> **Any operation requiring element shifting is O(n)**

### The 5 Essential Array Patterns
1. **Two Pointers** - Converging or parallel pointers
2. **Sliding Window** - Fixed or variable window over array
3. **Prefix Sum** - Precomputed cumulative sums
4. **Hash Map** - Trade space for O(1) lookups
5. **Kadane's Algorithm** - Maximum subarray problems
      `,
      code: `// Array declaration and basic operations
const arr = [1, 2, 3, 4, 5];

// O(1) Access
console.log(arr[2]); // 3

// O(n) Linear Search
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i;
    }
    return -1;
}

// O(n) Insert at index (shifting)
function insertAt(arr, index, value) {
    // Shift all elements from index to right
    for (let i = arr.length; i > index; i--) {
        arr[i] = arr[i - 1];
    }
    arr[index] = value;
    return arr;
}

// O(n) Delete at index (shifting)
function deleteAt(arr, index) {
    // Shift all elements from index+1 to left
    for (let i = index; i < arr.length - 1; i++) {
        arr[i] = arr[i + 1];
    }
    arr.length--;
    return arr;
}`,
    },
    {
      id: "two-pointers-pattern",
      title: "Two Pointers Pattern",
      type: "theory",
      content: `
## Two Pointers: The Swiss Army Knife

Two pointers technique uses two indices to traverse the array in a coordinated way, often converting O(n²) to O(n).

### When to Use Two Pointers
1. **Sorted array** problems
2. **Pair/triplet** sum problems
3. **Palindrome** checks
4. **Removing duplicates** in-place
5. **Partitioning** arrays

### Two Main Variants

#### 1. Opposite Direction (Converging)
- Start from both ends, move toward middle
- Used for: Pair sum, palindrome, container with water

\`\`\`
[1, 2, 3, 4, 5, 6, 7]
 ↑                 ↑
left             right
\`\`\`

#### 2. Same Direction (Fast & Slow)
- Both start from beginning
- Used for: Remove duplicates, cycle detection, partition

\`\`\`
[1, 1, 2, 2, 3, 4, 4]
 ↑  ↑
slow fast
\`\`\`

### Key Insight for Moving Pointers
> Move the pointer that gives you a chance to improve the result
      `,
      diagram: `
graph LR
    subgraph Converging["Converging Pointers"]
        A1["L"] --> A2["..."] --> A3["R"]
    end
    subgraph FastSlow["Fast & Slow"]
        B1["S,F"] --> B2["S"] --> B3["F"]
    end
      `,
      code: `// Pattern 1: Converging Pointers - Pair Sum
function twoSumSorted(arr, target) {
    let left = 0, right = arr.length - 1;
    
    while (left < right) {
        const sum = arr[left] + arr[right];
        
        if (sum === target) {
            return [left, right];
        } else if (sum < target) {
            left++;  // Need larger sum, move left pointer right
        } else {
            right--; // Need smaller sum, move right pointer left
        }
    }
    return [-1, -1];
}

// Pattern 2: Fast & Slow - Remove Duplicates
function removeDuplicates(arr) {
    if (arr.length === 0) return 0;
    
    let slow = 0; // Points to last unique element
    
    for (let fast = 1; fast < arr.length; fast++) {
        if (arr[fast] !== arr[slow]) {
            slow++;
            arr[slow] = arr[fast];
        }
    }
    
    return slow + 1; // Length of unique portion
}

// Dry Run: removeDuplicates([1, 1, 2, 2, 3])
// Initial: slow=0, fast=1
// fast=1: arr[1]=1 === arr[0]=1, skip
// fast=2: arr[2]=2 !== arr[0]=1, slow=1, arr[1]=2
// fast=3: arr[3]=2 === arr[1]=2, skip
// fast=4: arr[4]=3 !== arr[1]=2, slow=2, arr[2]=3
// Result: [1, 2, 3, _, _], return 3`,
    },
    {
      id: "sliding-window-pattern",
      title: "Sliding Window Pattern",
      type: "theory",
      content: `
## Sliding Window: Subarray Problems Made Easy

The sliding window pattern maintains a **subset of elements** as you traverse, avoiding redundant calculations.

### When to Use Sliding Window
- Problems with **contiguous subarrays**
- Finding **max/min/sum** over windows
- Substring problems with constraints

### Two Types

#### 1. Fixed Size Window
Window size is given (e.g., "subarray of size k")

\`\`\`
[1, 3, 2, 6, -1, 4, 1, 8, 2], k=5
 [----window----]
    [----window----]
       [----window----]
\`\`\`

#### 2. Variable Size Window
Window expands/contracts based on condition

\`\`\`
[2, 1, 5, 1, 3, 2], target sum = 8
Window grows: [2], [2,1], [2,1,5]
Window shrinks when sum > 8
\`\`\`

### The Sliding Window Template
\`\`\`javascript
let windowStart = 0;
for (let windowEnd = 0; windowEnd < arr.length; windowEnd++) {
    // Add arr[windowEnd] to window
    
    // Shrink window if needed (for variable window)
    while (/* condition to shrink */) {
        // Remove arr[windowStart] from window
        windowStart++;
    }
    
    // Update result
}
\`\`\`
      `,
      code: `// Fixed Window: Maximum Sum Subarray of Size K
function maxSumSubarray(arr, k) {
    let windowSum = 0;
    let maxSum = -Infinity;
    
    for (let i = 0; i < arr.length; i++) {
        windowSum += arr[i]; // Add element to window
        
        if (i >= k - 1) {
            maxSum = Math.max(maxSum, windowSum);
            windowSum -= arr[i - k + 1]; // Remove leftmost element
        }
    }
    return maxSum;
}

// Variable Window: Smallest Subarray with Sum >= Target
function minSubArrayLen(target, nums) {
    let windowSum = 0;
    let minLength = Infinity;
    let windowStart = 0;
    
    for (let windowEnd = 0; windowEnd < nums.length; windowEnd++) {
        windowSum += nums[windowEnd]; // Expand window
        
        // Shrink window while sum >= target
        while (windowSum >= target) {
            minLength = Math.min(minLength, windowEnd - windowStart + 1);
            windowSum -= nums[windowStart]; // Contract window
            windowStart++;
        }
    }
    
    return minLength === Infinity ? 0 : minLength;
}

// Dry Run: minSubArrayLen(7, [2,3,1,2,4,3])
// windowEnd=0: sum=2, < 7
// windowEnd=1: sum=5, < 7
// windowEnd=2: sum=6, < 7
// windowEnd=3: sum=8, >= 7! minLen=4, shrink: sum=6
// windowEnd=4: sum=10, >= 7! minLen=3, shrink: sum=7, minLen=2, shrink: sum=4
// windowEnd=5: sum=7, >= 7! minLen=2
// Result: 2 (subarray [4,3])`,
    },
    {
      id: "prefix-sum-pattern",
      title: "Prefix Sum Pattern",
      type: "theory",
      content: `
## Prefix Sum: Range Queries in O(1)

Prefix sum precomputes cumulative sums, enabling **O(1) range sum queries** after O(n) preprocessing.

### The Core Idea
\`\`\`
Original: [1, 2, 3, 4, 5]
Prefix:   [1, 3, 6, 10, 15]
           ↑  ↑  ↑   ↑   ↑
           1  1+2 ...    1+2+3+4+5
\`\`\`

### Range Sum Formula
Sum from index i to j = prefix[j] - prefix[i-1]

**Example**: Sum from index 2 to 4
- prefix[4] = 15 (sum of indices 0-4)
- prefix[1] = 3 (sum of indices 0-1)
- Answer = 15 - 3 = 12 ✓ (3 + 4 + 5 = 12)

### When to Use Prefix Sum
1. Multiple range sum queries
2. Subarray sum equals target
3. Finding equilibrium index
4. 2D matrix sum queries (2D prefix sum)

### Time Complexity
| Operation | Brute Force | With Prefix Sum |
|-----------|-------------|-----------------|
| Build | - | O(n) |
| Single Range Query | O(n) | O(1) |
| k Range Queries | O(k × n) | O(n + k) |
      `,
      code: `// Building Prefix Sum Array
function buildPrefixSum(arr) {
    const prefix = new Array(arr.length);
    prefix[0] = arr[0];
    
    for (let i = 1; i < arr.length; i++) {
        prefix[i] = prefix[i - 1] + arr[i];
    }
    return prefix;
}

// Range Sum Query
function rangeSum(prefix, left, right) {
    if (left === 0) return prefix[right];
    return prefix[right] - prefix[left - 1];
}

// Subarray Sum Equals K (LeetCode #560)
function subarraySum(nums, k) {
    const prefixCount = new Map();
    prefixCount.set(0, 1); // Empty prefix has sum 0
    
    let count = 0;
    let currentSum = 0;
    
    for (const num of nums) {
        currentSum += num;
        
        // If (currentSum - k) exists, we found a subarray
        if (prefixCount.has(currentSum - k)) {
            count += prefixCount.get(currentSum - k);
        }
        
        prefixCount.set(currentSum, (prefixCount.get(currentSum) || 0) + 1);
    }
    
    return count;
}

// Dry Run: subarraySum([1, 2, 3], k=3)
// prefix sum: [1, 3, 6]
// Need: prefix[j] - prefix[i] = 3
// i=0: sum=1, need 1-3=-2 in map? No. map={0:1, 1:1}
// i=1: sum=3, need 3-3=0 in map? Yes! count=1. map={0:1, 1:1, 3:1}
// i=2: sum=6, need 6-3=3 in map? Yes! count=2. 
// Result: 2 (subarrays [1,2] and [3])`,
    },
    {
      id: "kadanes-algorithm",
      title: "Kadane's Algorithm",
      type: "theory",
      content: `
## Kadane's Algorithm: Maximum Subarray

Kadane's algorithm finds the **maximum sum contiguous subarray** in O(n) time.

### The Intuition
At each position, decide:
1. **Extend** the previous subarray (add current element)
2. **Start fresh** from current element

Choose whichever gives a larger sum!

### The Formula
\`\`\`
currentMax = max(arr[i], currentMax + arr[i])
globalMax = max(globalMax, currentMax)
\`\`\`

### Why It Works
- If previous sum is negative, starting fresh is better
- If previous sum is positive, extending is better
- Track the global maximum along the way

### Dry Run Example
\`\`\`
Array: [-2, 1, -3, 4, -1, 2, 1, -5, 4]

Index  Element  CurrentMax  GlobalMax
  0      -2        -2          -2
  1       1         1           1    (start fresh)
  2      -3        -2           1    (extend: 1 + -3 = -2)
  3       4         4           4    (start fresh)
  4      -1         3           4    (extend: 4 + -1 = 3)
  5       2         5           5    (extend: 3 + 2 = 5)
  6       1         6           6    (extend: 5 + 1 = 6)
  7      -5         1           6    (extend: 6 + -5 = 1)
  8       4         5           6    (extend: 1 + 4 = 5)

Result: 6 (subarray: [4, -1, 2, 1])
\`\`\`
      `,
      code: `// Basic Kadane's Algorithm
function maxSubArray(nums) {
    let currentMax = nums[0];
    let globalMax = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        // Key decision: extend or start fresh?
        currentMax = Math.max(nums[i], currentMax + nums[i]);
        globalMax = Math.max(globalMax, currentMax);
    }
    
    return globalMax;
}

// Kadane's with Subarray Indices
function maxSubArrayWithIndices(nums) {
    let currentMax = nums[0];
    let globalMax = nums[0];
    let start = 0, end = 0, tempStart = 0;
    
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] > currentMax + nums[i]) {
            currentMax = nums[i];
            tempStart = i; // New potential start
        } else {
            currentMax = currentMax + nums[i];
        }
        
        if (currentMax > globalMax) {
            globalMax = currentMax;
            start = tempStart;
            end = i;
        }
    }
    
    return { sum: globalMax, subarray: nums.slice(start, end + 1) };
}

// Variant: Maximum Product Subarray
function maxProduct(nums) {
    let maxProd = nums[0];
    let minProd = nums[0]; // Track min for negative numbers
    let result = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        const temp = maxProd;
        maxProd = Math.max(nums[i], maxProd * nums[i], minProd * nums[i]);
        minProd = Math.min(nums[i], temp * nums[i], minProd * nums[i]);
        result = Math.max(result, maxProd);
    }
    
    return result;
}`,
    },
    // ============== PROBLEM SECTIONS ==============
    {
      id: "problem-container-water",
      title: "Container With Most Water",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Google", "Facebook", "Apple", "Microsoft"],
      leetcode: "https://leetcode.com/problems/container-with-most-water/",
      content: `
## LeetCode #11: Container With Most Water

Given \`n\` non-negative integers where each represents a point at coordinate \`(i, height[i])\`, find two lines that together with the x-axis form a container that holds the most water.

### Example
\`\`\`
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: Lines at index 1 (height 8) and index 8 (height 7)
Width = 8 - 1 = 7
Height = min(8, 7) = 7
Area = 7 × 7 = 49
\`\`\`

### Key Insight
> Water is limited by the **shorter** line. Moving the taller line cannot improve the result, so always move the shorter one.

### Approach
1. Start with widest container (left=0, right=n-1)
2. Calculate area
3. Move the pointer with **smaller height**
4. Track maximum area
      `,
      code: `// Solution: O(n) Time, O(1) Space
function maxArea(height) {
    let left = 0;
    let right = height.length - 1;
    let maxWater = 0;
    
    while (left < right) {
        // Calculate area
        const width = right - left;
        const h = Math.min(height[left], height[right]);
        const area = width * h;
        
        maxWater = Math.max(maxWater, area);
        
        // Move pointer with smaller height
        // (moving taller one can't help since height is limited by shorter)
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
}

// Dry Run: [1,8,6,2,5,4,8,3,7]
// L=0, R=8: area = 8 * min(1,7) = 8,  move L (1 < 7)
// L=1, R=8: area = 7 * min(8,7) = 49, move R (8 > 7)
// L=1, R=7: area = 6 * min(8,3) = 18, move R (8 > 3)
// L=1, R=6: area = 5 * min(8,8) = 40, move either
// L=2, R=6: area = 4 * min(6,8) = 24, move L
// ...continue until L >= R
// Result: 49

// Why does this work?
// We start with maximum width and systematically explore
// smaller widths, always moving the limiting factor (shorter height)
// to potentially find a better height combination.`,
    },
    {
      id: "problem-trapping-rain-water",
      title: "Trapping Rain Water",
      type: "problem",
      difficulty: "Hard",
      companies: ["Amazon", "Google", "Facebook", "Goldman Sachs", "Bloomberg"],
      leetcode: "https://leetcode.com/problems/trapping-rain-water/",
      content: `
## LeetCode #42: Trapping Rain Water

Given \`n\` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

### Example
\`\`\`
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6

Visual:
       |
   |   ||_|
_|_||_|||||||
0 1 0 2 1 0 1 3 2 1 2 1
\`\`\`

### Key Insight
Water at position i = min(maxLeft, maxRight) - height[i]

### Three Approaches
1. **Brute Force**: O(n²) - For each position, scan left and right for max
2. **DP/Precompute**: O(n) time, O(n) space - Precompute maxLeft[] and maxRight[]
3. **Two Pointers**: O(n) time, O(1) space - Track maxLeft and maxRight while moving pointers
      `,
      code: `// Approach 1: DP with Precomputation - O(n) time, O(n) space
function trapDP(height) {
    const n = height.length;
    if (n === 0) return 0;
    
    // Precompute maximum heights
    const maxLeft = new Array(n);
    const maxRight = new Array(n);
    
    maxLeft[0] = height[0];
    for (let i = 1; i < n; i++) {
        maxLeft[i] = Math.max(maxLeft[i-1], height[i]);
    }
    
    maxRight[n-1] = height[n-1];
    for (let i = n - 2; i >= 0; i--) {
        maxRight[i] = Math.max(maxRight[i+1], height[i]);
    }
    
    // Calculate water
    let water = 0;
    for (let i = 0; i < n; i++) {
        water += Math.min(maxLeft[i], maxRight[i]) - height[i];
    }
    
    return water;
}

// Approach 2: Two Pointers - O(n) time, O(1) space
function trap(height) {
    let left = 0, right = height.length - 1;
    let maxLeft = 0, maxRight = 0;
    let water = 0;
    
    while (left < right) {
        if (height[left] < height[right]) {
            // Water at left depends only on maxLeft
            if (height[left] >= maxLeft) {
                maxLeft = height[left];
            } else {
                water += maxLeft - height[left];
            }
            left++;
        } else {
            // Water at right depends only on maxRight
            if (height[right] >= maxRight) {
                maxRight = height[right];
            } else {
                water += maxRight - height[right];
            }
            right--;
        }
    }
    
    return water;
}

// Why Two Pointers works:
// At any time, if height[left] < height[right]:
//   - We know maxRight >= height[right] > height[left]
//   - So water at left is determined by maxLeft only
//   - We can safely calculate water at left and move left pointer
// Same logic applies when height[right] <= height[left]`,
    },
    {
      id: "problem-3sum",
      title: "3Sum",
      type: "problem",
      difficulty: "Medium",
      companies: ["Facebook", "Amazon", "Microsoft", "Apple", "Google"],
      leetcode: "https://leetcode.com/problems/3sum/",
      content: `
## LeetCode #15: 3Sum

Given an integer array, return all triplets \`[nums[i], nums[j], nums[k]]\` such that \`i ≠ j ≠ k\` and \`nums[i] + nums[j] + nums[k] == 0\`.

The solution set must not contain duplicate triplets.

### Example
\`\`\`
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
\`\`\`

### Key Insight
1. **Sort** the array first
2. Fix one element, use **two pointers** for the other two
3. **Skip duplicates** carefully to avoid duplicate triplets

### Complexity
- Time: O(n²) - One loop + two pointers
- Space: O(1) or O(n) depending on sorting implementation
      `,
      code: `function threeSum(nums) {
    const result = [];
    nums.sort((a, b) => a - b); // Sort first!
    
    for (let i = 0; i < nums.length - 2; i++) {
        // Skip duplicates for first element
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        // Early termination: if smallest > 0, no solution possible
        if (nums[i] > 0) break;
        
        let left = i + 1;
        let right = nums.length - 1;
        
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            
            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                
                // Skip duplicates for second element
                while (left < right && nums[left] === nums[left + 1]) left++;
                // Skip duplicates for third element
                while (left < right && nums[right] === nums[right - 1]) right--;
                
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}

// Dry Run: [-1, 0, 1, 2, -1, -4]
// After sort: [-4, -1, -1, 0, 1, 2]
// 
// i=0 (nums[i]=-4): need sum=4, two pointers find nothing
// i=1 (nums[i]=-1): 
//   L=2, R=5: -1+(-1)+2=0 ✓ Found [-1,-1,2]
//   L=3, R=4: -1+0+1=0 ✓ Found [-1,0,1]
// i=2: skip (duplicate of i=1)
// i=3: nums[i]=0 > needed, remaining would be positive

// Common Mistakes:
// 1. Forgetting to sort first
// 2. Not handling duplicates → duplicate triplets
// 3. Wrong duplicate skip logic (skip after finding, not before)`,
    },
    {
      id: "problem-longest-substring",
      title: "Longest Substring Without Repeating",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Facebook", "Bloomberg", "Microsoft", "Apple"],
      leetcode:
        "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      content: `
## LeetCode #3: Longest Substring Without Repeating Characters

Given a string \`s\`, find the length of the **longest substring** without repeating characters.

### Example
\`\`\`
Input: s = "abcabcbb"
Output: 3
Explanation: "abc" is the longest substring without repeating characters.
\`\`\`

### Pattern: Variable Sliding Window + Hash Map

Use a **hash map** to track character positions, and a **sliding window** that shrinks when we find duplicates.

### Key Insight
When we find a duplicate at position \`j\`:
- Don't slide one by one
- Jump \`windowStart\` directly to after the previous occurrence
      `,
      code: `function lengthOfLongestSubstring(s) {
    const charIndex = new Map(); // char -> last seen index
    let maxLength = 0;
    let windowStart = 0;
    
    for (let windowEnd = 0; windowEnd < s.length; windowEnd++) {
        const char = s[windowEnd];
        
        // If char seen and is within current window
        if (charIndex.has(char) && charIndex.get(char) >= windowStart) {
            // Move window start to after the duplicate
            windowStart = charIndex.get(char) + 1;
        }
        
        // Update char's position
        charIndex.set(char, windowEnd);
        
        // Update max length
        maxLength = Math.max(maxLength, windowEnd - windowStart + 1);
    }
    
    return maxLength;
}

// Dry Run: "abcabcbb"
// end=0, char='a': map={a:0}, window=[0,0], len=1, max=1
// end=1, char='b': map={a:0,b:1}, window=[0,1], len=2, max=2
// end=2, char='c': map={a:0,b:1,c:2}, window=[0,2], len=3, max=3
// end=3, char='a': 'a' at 0 in window! start=1, map={a:3,b:1,c:2}, len=3, max=3
// end=4, char='b': 'b' at 1 in window! start=2, map={a:3,b:4,c:2}, len=3, max=3
// end=5, char='c': 'c' at 2 in window! start=3, map={a:3,b:4,c:5}, len=3, max=3
// end=6, char='b': 'b' at 4 in window! start=5, map={a:3,b:6,c:5}, len=2, max=3
// end=7, char='b': 'b' at 6 in window! start=7, map={a:3,b:7,c:5}, len=1, max=3
// Result: 3

// Alternative with Set (simpler but less efficient)
function lengthOfLongestSubstringSet(s) {
    const seen = new Set();
    let maxLength = 0;
    let left = 0;
    
    for (let right = 0; right < s.length; right++) {
        while (seen.has(s[right])) {
            seen.delete(s[left]);
            left++;
        }
        seen.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`,
    },
    {
      id: "problem-product-except-self",
      title: "Product of Array Except Self",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Facebook", "Apple", "Microsoft", "Asana"],
      leetcode: "https://leetcode.com/problems/product-of-array-except-self/",
      content: `
## LeetCode #238: Product of Array Except Self

Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` equals the product of all elements except \`nums[i]\`.

**Constraint**: Solve it in O(n) without using division.

### Example
\`\`\`
Input: nums = [1,2,3,4]
Output: [24,12,8,6]
Explanation: 
- answer[0] = 2*3*4 = 24
- answer[1] = 1*3*4 = 12
- answer[2] = 1*2*4 = 8
- answer[3] = 1*2*3 = 6
\`\`\`

### Key Insight: Prefix & Suffix Products
For each position i:
\`\`\`
answer[i] = (product of all elements to left) × (product of all elements to right)
answer[i] = prefixProduct[i-1] × suffixProduct[i+1]
\`\`\`
      `,
      code: `// Approach 1: Two Arrays - O(n) time, O(n) space
function productExceptSelfTwoArrays(nums) {
    const n = nums.length;
    const prefix = new Array(n).fill(1);
    const suffix = new Array(n).fill(1);
    const result = new Array(n);
    
    // Build prefix products
    for (let i = 1; i < n; i++) {
        prefix[i] = prefix[i-1] * nums[i-1];
    }
    // prefix = [1, 1, 2, 6] for nums = [1,2,3,4]
    
    // Build suffix products
    for (let i = n - 2; i >= 0; i--) {
        suffix[i] = suffix[i+1] * nums[i+1];
    }
    // suffix = [24, 12, 4, 1] for nums = [1,2,3,4]
    
    // Multiply prefix and suffix
    for (let i = 0; i < n; i++) {
        result[i] = prefix[i] * suffix[i];
    }
    
    return result;
}

// Approach 2: Optimized - O(n) time, O(1) space (excluding output)
function productExceptSelf(nums) {
    const n = nums.length;
    const result = new Array(n).fill(1);
    
    // First pass: store prefix products in result
    let prefix = 1;
    for (let i = 0; i < n; i++) {
        result[i] = prefix;
        prefix *= nums[i];
    }
    // result = [1, 1, 2, 6]
    
    // Second pass: multiply by suffix products
    let suffix = 1;
    for (let i = n - 1; i >= 0; i--) {
        result[i] *= suffix;
        suffix *= nums[i];
    }
    // result = [24, 12, 8, 6]
    
    return result;
}

// Dry Run: nums = [1, 2, 3, 4]
// First pass (prefix):
//   i=0: result[0]=1, prefix=1*1=1
//   i=1: result[1]=1, prefix=1*2=2
//   i=2: result[2]=2, prefix=2*3=6
//   i=3: result[3]=6, prefix=6*4=24
//   result = [1, 1, 2, 6]
// 
// Second pass (suffix):
//   i=3: result[3]=6*1=6, suffix=1*4=4
//   i=2: result[2]=2*4=8, suffix=4*3=12
//   i=1: result[1]=1*12=12, suffix=12*2=24
//   i=0: result[0]=1*24=24, suffix=24*1=24
//   result = [24, 12, 8, 6] ✓`,
    },
    {
      id: "problem-subarray-sum-k",
      title: "Subarray Sum Equals K",
      type: "problem",
      difficulty: "Medium",
      companies: ["Facebook", "Amazon", "Google", "Microsoft", "Oracle"],
      leetcode: "https://leetcode.com/problems/subarray-sum-equals-k/",
      content: `
## LeetCode #560: Subarray Sum Equals K

Given an array of integers and an integer \`k\`, return the total number of subarrays whose sum equals \`k\`.

### Example
\`\`\`
Input: nums = [1,1,1], k = 2
Output: 2
Explanation: [1,1] at index 0-1 and [1,1] at index 1-2
\`\`\`

### Key Insight: Prefix Sum + Hash Map
If \`prefixSum[j] - prefixSum[i] = k\`, then subarray from i+1 to j has sum k.

Rearranging: \`prefixSum[i] = prefixSum[j] - k\`

So at each position j, we check if \`(currentSum - k)\` exists in our prefix sum counts!

### Why Sliding Window Doesn't Work
- Array can have **negative numbers**
- Window can't know when to shrink
      `,
      code: `function subarraySum(nums, k) {
    // Map: prefix_sum -> count of times we've seen it
    const prefixCount = new Map();
    prefixCount.set(0, 1); // Empty prefix (for subarrays starting at index 0)
    
    let count = 0;
    let currentSum = 0;
    
    for (const num of nums) {
        currentSum += num;
        
        // Check if we've seen (currentSum - k) before
        // If yes, those positions + current position form subarrays with sum k
        if (prefixCount.has(currentSum - k)) {
            count += prefixCount.get(currentSum - k);
        }
        
        // Record current prefix sum
        prefixCount.set(currentSum, (prefixCount.get(currentSum) || 0) + 1);
    }
    
    return count;
}

// Dry Run: nums = [1, 2, 3, -3, 1, 1], k = 3
// prefixCount starts with {0: 1}
// 
// i=0: sum=1, need 1-3=-2? No. prefixCount={0:1, 1:1}
// i=1: sum=3, need 3-3=0? Yes! count=1. prefixCount={0:1, 1:1, 3:1}
//      (subarray [1,2] or [0,1])
// i=2: sum=6, need 6-3=3? Yes! count=2. prefixCount={0:1, 1:1, 3:1, 6:1}
//      (subarray [3] alone, indices [2,2])
// i=3: sum=3, need 3-3=0? Yes! count=3. prefixCount={0:1, 1:1, 3:2, 6:1}
//      (subarray [1,2,3,-3] indices [0,3])
// i=4: sum=4, need 4-3=1? Yes! count=4. prefixCount={0:1, 1:1, 3:2, 6:1, 4:1}
// i=5: sum=5, need 5-3=2? No. prefixCount={0:1, 1:1, 3:2, 6:1, 4:1, 5:1}
// 
// Final count = 4

// Why we initialize prefixCount with {0: 1}:
// This handles subarrays that start from index 0
// If currentSum itself equals k, then currentSum - k = 0
// We need to count this case!`,
    },
    // ============== ADVANCED INTERVIEW SECTIONS ==============
    {
      id: "advanced-array-techniques",
      title: "Advanced Array Techniques (Interview Mastery)",
      type: "theory",
      content: `
## 🏆 Advanced Array Patterns for FAANG Interviews

<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 24px; margin: 20px 0;">
  <h3 style="color: #4ade80; margin: 0 0 20px 0; text-align: center;">🎯 The 5 Essential Array Patterns</h3>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
    <div style="background: #0f3460; padding: 16px; border-radius: 12px; text-align: center;">
      <span style="font-size: 24px;">👆👆</span>
      <h4 style="color: #f87171; margin: 8px 0;">Two Pointers</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 11px;">Sorted arrays, pairs, partitioning</p>
    </div>
    
    <div style="background: #0f3460; padding: 16px; border-radius: 12px; text-align: center;">
      <span style="font-size: 24px;">📦</span>
      <h4 style="color: #4ade80; margin: 8px 0;">Sliding Window</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 11px;">Subarrays, substrings</p>
    </div>
    
    <div style="background: #0f3460; padding: 16px; border-radius: 12px; text-align: center;">
      <span style="font-size: 24px;">➕</span>
      <h4 style="color: #fbbf24; margin: 8px 0;">Prefix Sum</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 11px;">Range queries, cumulative</p>
    </div>
    
    <div style="background: #0f3460; padding: 16px; border-radius: 12px; text-align: center;">
      <span style="font-size: 24px;">#️⃣</span>
      <h4 style="color: #a78bfa; margin: 8px 0;">Hash Map</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 11px;">O(1) lookups, counting</p>
    </div>
    
    <div style="background: #0f3460; padding: 16px; border-radius: 12px; text-align: center;">
      <span style="font-size: 24px;">📈</span>
      <h4 style="color: #60a5fa; margin: 8px 0;">Kadane's</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 11px;">Max subarray variants</p>
    </div>
  </div>
</div>

### Pattern Recognition Cheat Sheet

| Problem Type | Pattern | Example Problem |
|-------------|---------|-----------------|
| Pair sum in sorted array | Two Pointers (converging) | Two Sum II |
| Remove duplicates in-place | Two Pointers (fast/slow) | Remove Duplicates |
| Max/min in fixed window | Sliding Window (fixed) | Max Sum of Size K |
| Subarray with condition | Sliding Window (variable) | Minimum Window Substring |
| Range sum queries | Prefix Sum | Range Sum Query |
| Subarray sum equals K | Prefix Sum + Hash Map | Subarray Sum Equals K |
| Find duplicates | Hash Set | Contains Duplicate |
| Two sum unsorted | Hash Map | Two Sum |
| Max contiguous sum | Kadane's Algorithm | Maximum Subarray |

### 🧠 Decision Tree: Which Pattern to Use?

\`\`\`
Is the array sorted?
├── YES: Try Two Pointers first
│   └── Looking for pairs/triplets? → Converging pointers
│   └── Binary search possible? → Binary search
├── NO: 
│   ├── Subarray/substring problem?
│   │   ├── Fixed size window? → Fixed Sliding Window
│   │   ├── Variable size with condition? → Variable Sliding Window
│   │   └── Sum equals K? → Prefix Sum + HashMap
│   ├── Finding pairs/duplicates?
│   │   └── Use Hash Map/Set
│   └── Max contiguous subarray?
│       └── Kadane's Algorithm
\`\`\`

### 💡 Interview Pro Tips

> **Tip 1**: When you see "contiguous subarray", think Sliding Window or Prefix Sum

> **Tip 2**: When you see "pairs that sum to X", think Two Pointers (sorted) or Hash Map (unsorted)

> **Tip 3**: When you see "in-place" modification, think Two Pointers

> **Tip 4**: When you see "maximum sum", think Kadane's Algorithm
      `,
      code: `// ═══════════════════════════════════════════════════════════
// PATTERN COMPARISON: Same Problem, Different Approaches
// ═══════════════════════════════════════════════════════════

// Problem: Find pair with sum = target

// Approach 1: Brute Force - O(n²)
function twoSumBrute(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) return [i, j];
        }
    }
    return [];
}

// Approach 2: Hash Map - O(n) time, O(n) space (UNSORTED)
function twoSumHashMap(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}

// Approach 3: Two Pointers - O(n log n) or O(n) if sorted (SORTED)
function twoSumTwoPointers(nums, target) {
    // Assumes nums is sorted!
    let left = 0, right = nums.length - 1;
    while (left < right) {
        const sum = nums[left] + nums[right];
        if (sum === target) return [left, right];
        if (sum < target) left++;
        else right--;
    }
    return [];
}


// ═══════════════════════════════════════════════════════════
// THREE SUM - Classic Two Pointers Problem
// ═══════════════════════════════════════════════════════════

// LeetCode #15: Three Sum
// Find all unique triplets that sum to zero
function threeSum(nums) {
    const result = [];
    nums.sort((a, b) => a - b);  // Sort first!
    
    for (let i = 0; i < nums.length - 2; i++) {
        // Skip duplicates for i
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        // Two pointers for remaining pair
        let left = i + 1;
        let right = nums.length - 1;
        const target = -nums[i];
        
        while (left < right) {
            const sum = nums[left] + nums[right];
            
            if (sum === target) {
                result.push([nums[i], nums[left], nums[right]]);
                
                // Skip duplicates
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                
                left++;
                right--;
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}


// ═══════════════════════════════════════════════════════════
// SLIDING WINDOW MAXIMUM - Advanced Deque Pattern
// ═══════════════════════════════════════════════════════════

// LeetCode #239: Sliding Window Maximum
function maxSlidingWindow(nums, k) {
    const result = [];
    const deque = [];  // Store indices, not values!
    
    for (let i = 0; i < nums.length; i++) {
        // Remove indices outside the window
        while (deque.length && deque[0] <= i - k) {
            deque.shift();
        }
        
        // Remove smaller elements (they can never be max)
        while (deque.length && nums[deque[deque.length - 1]] < nums[i]) {
            deque.pop();
        }
        
        deque.push(i);
        
        // Add to result when window is complete
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }
    
    return result;
}
// Time: O(n), Space: O(k)`,
    },
    {
      id: "dutch-national-flag",
      title: "Dutch National Flag Algorithm",
      type: "theory",
      content: `
## Dutch National Flag: Three-Way Partitioning 🇳🇱

This algorithm sorts an array with only 3 distinct values in a single pass!

### The Problem
Sort an array containing only 0s, 1s, and 2s in-place.

### The Approach
Use three pointers:
- **low**: boundary for 0s (everything before is 0)
- **mid**: current element being examined
- **high**: boundary for 2s (everything after is 2)

### Visual Walkthrough

\`\`\`
Initial: [2, 0, 2, 1, 1, 0]
         L/M            H

Step 1: arr[mid]=2 → swap with high, high--
        [0, 0, 2, 1, 1, 2]
         L/M         H

Step 2: arr[mid]=0 → swap with low, low++, mid++
        [0, 0, 2, 1, 1, 2]
            L/M      H

Step 3: arr[mid]=0 → swap with low, low++, mid++
        [0, 0, 2, 1, 1, 2]
               L/M   H

... continue until mid > high
\`\`\`

### Why It's Important
- **One-pass solution**: O(n) time, O(1) space
- **Used in**: Sort Colors (LeetCode #75), Quick Sort partition
- **Interview favorite**: Tests in-place manipulation skills
      `,
      code: `// Sort Colors (LeetCode #75)
function sortColors(nums) {
    let low = 0;      // Boundary: all elements before are 0
    let mid = 0;      // Current element
    let high = nums.length - 1;  // Boundary: all elements after are 2
    
    while (mid <= high) {
        if (nums[mid] === 0) {
            // Swap with low boundary, expand 0-region
            [nums[low], nums[mid]] = [nums[mid], nums[low]];
            low++;
            mid++;
        } else if (nums[mid] === 1) {
            // 1 is in correct position, just move forward
            mid++;
        } else {
            // nums[mid] === 2
            // Swap with high boundary, shrink 2-region
            [nums[mid], nums[high]] = [nums[high], nums[mid]];
            high--;
            // Don't increment mid! Need to check swapped element
        }
    }
    
    return nums;
}

// Dry Run: [2, 0, 2, 1, 1, 0]
// low=0, mid=0, high=5
// 
// mid=0: arr[0]=2, swap with arr[5]=0 → [0, 0, 2, 1, 1, 2], high=4
// mid=0: arr[0]=0, swap with arr[0]=0 → same, low=1, mid=1
// mid=1: arr[1]=0, swap with arr[1]=0 → same, low=2, mid=2
// mid=2: arr[2]=2, swap with arr[4]=1 → [0, 0, 1, 1, 2, 2], high=3
// mid=2: arr[2]=1, mid=3
// mid=3: arr[3]=1, mid=4
// mid=4 > high=3, STOP!
// Result: [0, 0, 1, 1, 2, 2] ✓


// Generalized: Three-way partition for QuickSort
function threeWayPartition(arr, pivot) {
    let low = 0, mid = 0, high = arr.length - 1;
    
    while (mid <= high) {
        if (arr[mid] < pivot) {
            [arr[low], arr[mid]] = [arr[mid], arr[low]];
            low++;
            mid++;
        } else if (arr[mid] === pivot) {
            mid++;
        } else {
            [arr[mid], arr[high]] = [arr[high], arr[mid]];
            high--;
        }
    }
    
    return arr;
}`,
    },
    {
      id: "boyer-moore-voting",
      title: "Boyer-Moore Voting Algorithm",
      type: "theory",
      content: `
## Boyer-Moore Voting: Find Majority Element 🗳️

Find the element that appears more than n/2 times in O(n) time and O(1) space!

### The Intuition
Think of it as a **battle** between elements:
- Each majority element "votes" for itself (+1)
- Each different element "votes against" (-1)
- If count reaches 0, start fresh with new candidate
- Majority element always survives!

### Why It Works
If an element appears > n/2 times, it will always have more "votes" than all other elements combined.

### Visual Example

\`\`\`
Array: [2, 2, 1, 1, 1, 2, 2]

Step  Element  Candidate  Count
 1       2        2         1
 2       2        2         2
 3       1        2         1 (different, -1)
 4       1        2         0 (reset!)
 5       1        1         1 (new candidate)
 6       2        1         0 (reset!)
 7       2        2         1

Candidate: 2 ✓ (verify: appears 4/7 times > 50%)
\`\`\`

### ⚠️ Important Note
This only finds a **candidate**. You must verify it appears > n/2 times!
      `,
      code: `// Majority Element (LeetCode #169)
function majorityElement(nums) {
    let candidate = null;
    let count = 0;
    
    // Phase 1: Find candidate
    for (const num of nums) {
        if (count === 0) {
            candidate = num;  // New candidate
        }
        count += (num === candidate) ? 1 : -1;
    }
    
    // Phase 2: Verify (if not guaranteed to exist)
    // let verifyCount = nums.filter(n => n === candidate).length;
    // if (verifyCount > nums.length / 2) return candidate;
    // return -1;
    
    return candidate;  // Problem guarantees majority exists
}


// Extended: Majority Element II (LeetCode #229)
// Find all elements appearing more than n/3 times
// At most 2 such elements can exist!
function majorityElementII(nums) {
    let candidate1 = null, count1 = 0;
    let candidate2 = null, count2 = 0;
    
    // Phase 1: Find candidates
    for (const num of nums) {
        if (candidate1 !== null && num === candidate1) {
            count1++;
        } else if (candidate2 !== null && num === candidate2) {
            count2++;
        } else if (count1 === 0) {
            candidate1 = num;
            count1 = 1;
        } else if (count2 === 0) {
            candidate2 = num;
            count2 = 1;
        } else {
            count1--;
            count2--;
        }
    }
    
    // Phase 2: Verify candidates
    const result = [];
    const threshold = Math.floor(nums.length / 3);
    
    count1 = nums.filter(n => n === candidate1).length;
    count2 = nums.filter(n => n === candidate2).length;
    
    if (count1 > threshold) result.push(candidate1);
    if (candidate2 !== candidate1 && count2 > threshold) {
        result.push(candidate2);
    }
    
    return result;
}`,
    },
  ],
};
