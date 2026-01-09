export const dpTopic = {
  id: "dynamic-programming",
  title: "Dynamic Programming",
  description:
    "Master DP patterns: 1D/2D DP, knapsack, LCS, and classic optimization problems.",
  icon: "Grid",
  sections: [
    // ============== THEORY SECTIONS ==============
    {
      id: "dp-fundamentals",
      title: "DP Fundamentals",
      type: "theory",
      content: `
## Dynamic Programming: Optimal Substructure + Overlapping Subproblems

DP is an optimization technique that solves complex problems by breaking them into smaller subproblems.

### When to Use DP
1. **Optimal Substructure**: Optimal solution contains optimal solutions to subproblems
2. **Overlapping Subproblems**: Same subproblems are solved multiple times

### DP vs Other Techniques
| Technique | When to Use |
|-----------|-------------|
| **Greedy** | Local optimal = Global optimal |
| **Divide & Conquer** | Subproblems don't overlap |
| **DP** | Subproblems overlap + need optimization |

### Two Approaches
1. **Top-Down (Memoization)**: Start with main problem, cache results
2. **Bottom-Up (Tabulation)**: Build solution from smallest subproblems

### DP Problem Recognition
- "Count ways to..."
- "Find minimum/maximum..."
- "Is it possible to..."
- "Find longest/shortest..."
- Often involves arrays, strings, or sequences
      `,
      code: `// Example: Fibonacci - Classic DP Problem

// Naive Recursion - O(2^n) - SLOW!
function fibNaive(n) {
    if (n <= 1) return n;
    return fibNaive(n - 1) + fibNaive(n - 2);
}

// Top-Down with Memoization - O(n)
function fibMemo(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n <= 1) return n;
    
    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    return memo[n];
}

// Bottom-Up Tabulation - O(n)
function fibTab(n) {
    if (n <= 1) return n;
    
    const dp = new Array(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// Space Optimized - O(1)
function fibOptimized(n) {
    if (n <= 1) return n;
    
    let prev2 = 0, prev1 = 1;
    
    for (let i = 2; i <= n; i++) {
        const curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}

// The DP Framework:
// 1. Define state: What information do we need?
// 2. Define recurrence: How does current state relate to previous?
// 3. Define base case: What are the simplest cases?
// 4. Define answer: Which state gives us the final answer?`,
    },
    {
      id: "dp-1d-patterns",
      title: "1D DP Patterns",
      type: "theory",
      content: `
## Common 1D DP Patterns

### Pattern 1: Linear DP
\`dp[i]\` depends on previous states.
Examples: Climbing Stairs, House Robber, Decode Ways

### Pattern 2: Prefix/Suffix DP
Process array from left or right, accumulating results.
Examples: Maximum Subarray, Best Time to Buy/Sell Stock

### Pattern 3: State Machine DP
Multiple states at each position.
Examples: Stock problems with cooldown, transaction limits

### Framework
\`\`\`
1. Define dp[i] = answer for first i elements
2. Find recurrence: dp[i] = f(dp[i-1], dp[i-2], ...)
3. Handle base cases: dp[0], dp[1], etc.
4. Return dp[n]
\`\`\`
      `,
      code: `// Pattern 1: Climbing Stairs (LeetCode #70)
// dp[i] = ways to reach step i
function climbStairs(n) {
    if (n <= 2) return n;
    
    let prev2 = 1, prev1 = 2;
    
    for (let i = 3; i <= n; i++) {
        const curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}

// Pattern 2: House Robber (LeetCode #198)
// dp[i] = max money robbing first i houses
function rob(nums) {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    
    let prev2 = nums[0];
    let prev1 = Math.max(nums[0], nums[1]);
    
    for (let i = 2; i < nums.length; i++) {
        const curr = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}

// Pattern 3: Maximum Subarray (LeetCode #53) - Kadane's
// dp[i] = max subarray ending at i
function maxSubArray(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}

// Pattern 4: Decode Ways (LeetCode #91)
// dp[i] = ways to decode first i characters
function numDecodings(s) {
    if (s[0] === '0') return 0;
    
    const n = s.length;
    let prev2 = 1; // dp[i-2]
    let prev1 = 1; // dp[i-1]
    
    for (let i = 1; i < n; i++) {
        let curr = 0;
        
        // Single digit decode
        if (s[i] !== '0') {
            curr += prev1;
        }
        
        // Two digit decode (10-26)
        const twoDigit = parseInt(s.slice(i - 1, i + 1));
        if (twoDigit >= 10 && twoDigit <= 26) {
            curr += prev2;
        }
        
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}`,
    },
    {
      id: "dp-2d-patterns",
      title: "2D DP Patterns",
      type: "theory",
      content: `
## Common 2D DP Patterns

### Pattern 1: Grid DP
\`dp[i][j]\` = answer for cell (i, j)
Examples: Unique Paths, Minimum Path Sum

### Pattern 2: Two Sequences
\`dp[i][j]\` = answer for first i of seq1 and first j of seq2
Examples: LCS, Edit Distance

### Pattern 3: Interval DP
\`dp[i][j]\` = answer for interval [i, j]
Examples: Palindrome problems, Matrix Chain Multiplication

### Framework
\`\`\`
1. Define dp[i][j] meaning
2. Find recurrence from smaller i, j
3. Initialize first row/column
4. Fill table row by row (or diagonally for intervals)
\`\`\`
      `,
      code: `// Pattern 1: Unique Paths (LeetCode #62)
// dp[i][j] = ways to reach cell (i, j)
function uniquePaths(m, n) {
    const dp = Array(m).fill(null).map(() => Array(n).fill(1));
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    
    return dp[m-1][n-1];
}

// Pattern 2: Minimum Path Sum (LeetCode #64)
// dp[i][j] = min sum to reach (i, j)
function minPathSum(grid) {
    const m = grid.length, n = grid[0].length;
    
    // Initialize first row and column
    for (let i = 1; i < m; i++) grid[i][0] += grid[i-1][0];
    for (let j = 1; j < n; j++) grid[0][j] += grid[0][j-1];
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            grid[i][j] += Math.min(grid[i-1][j], grid[i][j-1]);
        }
    }
    
    return grid[m-1][n-1];
}

// Pattern 3: Longest Common Subsequence (LeetCode #1143)
// dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]
function longestCommonSubsequence(text1, text2) {
    const m = text1.length, n = text2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i-1] === text2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    
    return dp[m][n];
}

// Pattern 4: Edit Distance (LeetCode #72)
// dp[i][j] = min operations to convert word1[0..i-1] to word2[0..j-1]
function minDistance(word1, word2) {
    const m = word1.length, n = word2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    // Base cases
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i-1] === word2[j-1]) {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i-1][j],     // Delete
                    dp[i][j-1],     // Insert
                    dp[i-1][j-1]    // Replace
                );
            }
        }
    }
    
    return dp[m][n];
}`,
    },
    {
      id: "knapsack-pattern",
      title: "Knapsack Pattern",
      type: "theory",
      content: `
## Knapsack Problems

### Types of Knapsack
1. **0/1 Knapsack**: Each item can be used once
2. **Unbounded Knapsack**: Each item can be used unlimited times
3. **Bounded Knapsack**: Each item can be used limited times

### 0/1 Knapsack Template
\`\`\`
dp[i][w] = max value using first i items with capacity w
dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt[i]] + val[i])
\`\`\`

### Related Problems
- Subset Sum
- Partition Equal Subset Sum
- Target Sum
- Coin Change (unbounded)
      `,
      code: `// 0/1 Knapsack
function knapsack(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
            // Don't take item i
            dp[i][w] = dp[i-1][w];
            
            // Take item i (if possible)
            if (weights[i-1] <= w) {
                dp[i][w] = Math.max(
                    dp[i][w],
                    dp[i-1][w - weights[i-1]] + values[i-1]
                );
            }
        }
    }
    
    return dp[n][capacity];
}

// Space optimized 0/1 Knapsack - O(capacity)
function knapsackOptimized(weights, values, capacity) {
    const dp = new Array(capacity + 1).fill(0);
    
    for (let i = 0; i < weights.length; i++) {
        // Traverse backwards to avoid using same item twice
        for (let w = capacity; w >= weights[i]; w--) {
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    
    return dp[capacity];
}

// Partition Equal Subset Sum (LeetCode #416)
// Can we partition array into two subsets with equal sum?
function canPartition(nums) {
    const total = nums.reduce((a, b) => a + b, 0);
    if (total % 2 !== 0) return false;
    
    const target = total / 2;
    const dp = new Array(target + 1).fill(false);
    dp[0] = true;
    
    for (const num of nums) {
        for (let j = target; j >= num; j--) {
            dp[j] = dp[j] || dp[j - num];
        }
    }
    
    return dp[target];
}

// Coin Change (LeetCode #322) - Unbounded Knapsack
function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (coin <= i && dp[i - coin] !== Infinity) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}

// Coin Change 2 (LeetCode #518) - Count combinations
function change(amount, coins) {
    const dp = new Array(amount + 1).fill(0);
    dp[0] = 1;
    
    // Process coin by coin to avoid counting permutations
    for (const coin of coins) {
        for (let i = coin; i <= amount; i++) {
            dp[i] += dp[i - coin];
        }
    }
    
    return dp[amount];
}`,
    },
    // ============== PROBLEM SECTIONS ==============
    {
      id: "problem-coin-change",
      title: "Coin Change",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Microsoft", "Google", "Apple", "Goldman Sachs"],
      leetcode: "https://leetcode.com/problems/coin-change/",
      content: `
## LeetCode #322: Coin Change

Given coins array and amount, return fewest coins needed. Return -1 if impossible.

### Example
\`\`\`
Input: coins = [1,2,5], amount = 11
Output: 3 (5 + 5 + 1)
\`\`\`

### Key Insight
Unbounded knapsack variant. dp[i] = minimum coins for amount i.
      `,
      code: `function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}

// Dry Run: coins = [1, 2, 5], amount = 11
// dp[0] = 0
// dp[1] = min(dp[1-1]+1) = 1
// dp[2] = min(dp[2-1]+1, dp[2-2]+1) = min(2, 1) = 1
// dp[3] = min(dp[2]+1, dp[1]+1) = 2
// dp[4] = min(dp[3]+1, dp[2]+1) = 2
// dp[5] = min(dp[4]+1, dp[3]+1, dp[0]+1) = 1
// dp[6] = min(dp[5]+1, dp[4]+1, dp[1]+1) = 2
// dp[7] = min(dp[6]+1, dp[5]+1, dp[2]+1) = 2
// ...
// dp[10] = 2 (5+5)
// dp[11] = min(dp[10]+1, dp[9]+1, dp[6]+1) = 3

// BFS approach (alternative)
function coinChangeBFS(coins, amount) {
    if (amount === 0) return 0;
    
    const visited = new Set([0]);
    const queue = [0];
    let level = 0;
    
    while (queue.length > 0) {
        level++;
        const size = queue.length;
        
        for (let i = 0; i < size; i++) {
            const curr = queue.shift();
            
            for (const coin of coins) {
                const next = curr + coin;
                
                if (next === amount) return level;
                
                if (next < amount && !visited.has(next)) {
                    visited.add(next);
                    queue.push(next);
                }
            }
        }
    }
    
    return -1;
}`,
    },
    {
      id: "problem-longest-increasing-subsequence",
      title: "Longest Increasing Subsequence",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Microsoft", "Google", "Facebook", "Apple"],
      leetcode: "https://leetcode.com/problems/longest-increasing-subsequence/",
      content: `
## LeetCode #300: Longest Increasing Subsequence

Given an integer array nums, return the length of the longest strictly increasing subsequence.

### Example
\`\`\`
Input: nums = [10,9,2,5,3,7,101,18]
Output: 4 ([2,3,7,101])
\`\`\`

### Approaches
1. **DP**: O(n²) - dp[i] = LIS ending at i
2. **Binary Search**: O(n log n) - maintain sorted subsequence
      `,
      code: `// DP Solution - O(n²)
function lengthOfLIS(nums) {
    const n = nums.length;
    const dp = new Array(n).fill(1);
    
    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    
    return Math.max(...dp);
}

// Binary Search Solution - O(n log n)
function lengthOfLISOptimized(nums) {
    const tails = []; // tails[i] = smallest ending element for LIS of length i+1
    
    for (const num of nums) {
        let left = 0, right = tails.length;
        
        // Binary search for position to insert/replace
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (tails[mid] < num) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        if (left === tails.length) {
            tails.push(num); // Extend LIS
        } else {
            tails[left] = num; // Replace with smaller value
        }
    }
    
    return tails.length;
}

// Dry Run: [10, 9, 2, 5, 3, 7, 101, 18]
// num=10: tails=[] → [10]
// num=9:  9<10, replace → [9]
// num=2:  2<9, replace → [2]
// num=5:  5>2, extend → [2, 5]
// num=3:  3<5, replace → [2, 3]
// num=7:  7>3, extend → [2, 3, 7]
// num=101: extend → [2, 3, 7, 101]
// num=18: 18<101, replace → [2, 3, 7, 18]
// Return length = 4

// Note: tails doesn't represent actual LIS, just helps track length`,
    },
    {
      id: "problem-word-break",
      title: "Word Break",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Facebook", "Microsoft", "Google", "Apple"],
      leetcode: "https://leetcode.com/problems/word-break/",
      content: `
## LeetCode #139: Word Break

Given a string s and dictionary wordDict, return true if s can be segmented into dictionary words.

### Example
\`\`\`
Input: s = "leetcode", wordDict = ["leet","code"]
Output: true
\`\`\`

### Key Insight
dp[i] = true if s[0..i-1] can be segmented
For each position, check all possible words ending there.
      `,
      code: `function wordBreak(s, wordDict) {
    const wordSet = new Set(wordDict);
    const n = s.length;
    const dp = new Array(n + 1).fill(false);
    dp[0] = true; // Empty string is valid
    
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            // Check if s[0..j-1] is valid AND s[j..i-1] is a word
            if (dp[j] && wordSet.has(s.slice(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    
    return dp[n];
}

// Dry Run: s = "leetcode", wordDict = ["leet", "code"]
// dp[0] = true (empty string)
// dp[1]: "l" not in dict → false
// dp[2]: "le" not in dict → false
// dp[3]: "lee" not in dict → false
// dp[4]: dp[0]=true, "leet" in dict → true
// dp[5]: no valid split → false
// dp[6]: no valid split → false
// dp[7]: no valid split → false
// dp[8]: dp[4]=true, "code" in dict → true
// Return true

// BFS approach
function wordBreakBFS(s, wordDict) {
    const wordSet = new Set(wordDict);
    const visited = new Set();
    const queue = [0];
    
    while (queue.length > 0) {
        const start = queue.shift();
        
        if (visited.has(start)) continue;
        visited.add(start);
        
        for (let end = start + 1; end <= s.length; end++) {
            if (wordSet.has(s.slice(start, end))) {
                if (end === s.length) return true;
                queue.push(end);
            }
        }
    }
    
    return false;
}

// Word Break II (LeetCode #140) - Return all valid segmentations
function wordBreakII(s, wordDict) {
    const wordSet = new Set(wordDict);
    const memo = new Map();
    
    function backtrack(start) {
        if (memo.has(start)) return memo.get(start);
        
        if (start === s.length) return [''];
        
        const result = [];
        
        for (let end = start + 1; end <= s.length; end++) {
            const word = s.slice(start, end);
            
            if (wordSet.has(word)) {
                const subResults = backtrack(end);
                
                for (const sub of subResults) {
                    result.push(sub === '' ? word : word + ' ' + sub);
                }
            }
        }
        
        memo.set(start, result);
        return result;
    }
    
    return backtrack(0);
}`,
    },
    {
      id: "problem-unique-paths",
      title: "Unique Paths",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Microsoft", "Google", "Facebook", "Goldman Sachs"],
      leetcode: "https://leetcode.com/problems/unique-paths/",
      content: `
## LeetCode #62: Unique Paths

A robot starts at top-left of m x n grid and can only move right or down. Find unique paths to bottom-right.

### Example
\`\`\`
Input: m = 3, n = 7
Output: 28
\`\`\`

### Key Insight
dp[i][j] = dp[i-1][j] + dp[i][j-1]
(Ways to reach = ways from above + ways from left)
      `,
      code: `// 2D DP - O(m*n)
function uniquePaths(m, n) {
    const dp = Array(m).fill(null).map(() => Array(n).fill(1));
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    
    return dp[m-1][n-1];
}

// Space Optimized - O(n)
function uniquePathsOptimized(m, n) {
    const dp = new Array(n).fill(1);
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[j] += dp[j-1];
        }
    }
    
    return dp[n-1];
}

// Math Solution - Combinations
// Total moves = (m-1) + (n-1) = m+n-2
// Choose (m-1) down moves from total = C(m+n-2, m-1)
function uniquePathsMath(m, n) {
    let result = 1;
    
    for (let i = 1; i < m; i++) {
        result = result * (n - 1 + i) / i;
    }
    
    return Math.round(result);
}

// Unique Paths II (with obstacles)
function uniquePathsWithObstacles(obstacleGrid) {
    const m = obstacleGrid.length;
    const n = obstacleGrid[0].length;
    
    if (obstacleGrid[0][0] === 1) return 0;
    
    const dp = new Array(n).fill(0);
    dp[0] = 1;
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (obstacleGrid[i][j] === 1) {
                dp[j] = 0;
            } else if (j > 0) {
                dp[j] += dp[j-1];
            }
        }
    }
    
    return dp[n-1];
}`,
    },
    {
      id: "problem-longest-palindromic-substring",
      title: "Longest Palindromic Substring",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
      leetcode: "https://leetcode.com/problems/longest-palindromic-substring/",
      content: `
## LeetCode #5: Longest Palindromic Substring

Given a string s, return the longest palindromic substring.

### Example
\`\`\`
Input: s = "babad"
Output: "bab" (or "aba")
\`\`\`

### Approaches
1. **Expand Around Center**: O(n²) time, O(1) space
2. **2D DP**: O(n²) time and space
3. **Manacher's Algorithm**: O(n) - Advanced
      `,
      code: `// Expand Around Center - O(n²) time, O(1) space
function longestPalindrome(s) {
    let start = 0, maxLen = 1;
    
    function expandAroundCenter(left, right) {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            const len = right - left + 1;
            if (len > maxLen) {
                start = left;
                maxLen = len;
            }
            left--;
            right++;
        }
    }
    
    for (let i = 0; i < s.length; i++) {
        expandAroundCenter(i, i);     // Odd length
        expandAroundCenter(i, i + 1); // Even length
    }
    
    return s.substring(start, start + maxLen);
}

// 2D DP Solution - O(n²)
function longestPalindromeDP(s) {
    const n = s.length;
    if (n < 2) return s;
    
    const dp = Array(n).fill(null).map(() => Array(n).fill(false));
    
    let start = 0, maxLen = 1;
    
    // All single chars are palindromes
    for (let i = 0; i < n; i++) {
        dp[i][i] = true;
    }
    
    // Check substrings of length 2 to n
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            
            if (s[i] === s[j]) {
                // For length 2 or inner substring is palindrome
                if (len === 2 || dp[i+1][j-1]) {
                    dp[i][j] = true;
                    if (len > maxLen) {
                        start = i;
                        maxLen = len;
                    }
                }
            }
        }
    }
    
    return s.substring(start, start + maxLen);
}

// Dry Run: "babad"
// Expand from 'b' (i=0): "b" ✓
// Expand from 'a' (i=1): "a" → "bab" ✓ (maxLen=3)
// Expand from 'b' (i=2): "b" → "aba" ✓ (same length)
// Expand from 'a' (i=3): "a" ✓
// Expand from 'd' (i=4): "d" ✓
// Return "bab" (or "aba" depending on which we find first)`,
    },
    {
      id: "problem-best-time-stock",
      title: "Best Time to Buy and Sell Stock",
      type: "problem",
      difficulty: "Easy to Hard",
      companies: ["Amazon", "Facebook", "Microsoft", "Google", "Goldman Sachs"],
      leetcode:
        "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
      content: `
## Stock Problems Series

Multiple variants with increasing complexity:
- **I**: One transaction
- **II**: Unlimited transactions
- **III**: At most 2 transactions
- **IV**: At most k transactions
- **With Cooldown**: Rest day after selling
- **With Fee**: Transaction fee
      `,
      code: `// Stock I: One transaction - O(n)
function maxProfit1(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    
    for (const price of prices) {
        minPrice = Math.min(minPrice, price);
        maxProfit = Math.max(maxProfit, price - minPrice);
    }
    
    return maxProfit;
}

// Stock II: Unlimited transactions - O(n)
function maxProfit2(prices) {
    let profit = 0;
    
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i-1]) {
            profit += prices[i] - prices[i-1];
        }
    }
    
    return profit;
}

// Stock III: At most 2 transactions - O(n)
function maxProfit3(prices) {
    let buy1 = Infinity, buy2 = Infinity;
    let sell1 = 0, sell2 = 0;
    
    for (const price of prices) {
        buy1 = Math.min(buy1, price);
        sell1 = Math.max(sell1, price - buy1);
        buy2 = Math.min(buy2, price - sell1);
        sell2 = Math.max(sell2, price - buy2);
    }
    
    return sell2;
}

// Stock with Cooldown - O(n)
function maxProfitCooldown(prices) {
    if (prices.length < 2) return 0;
    
    let hold = -prices[0];     // Holding stock
    let sold = 0;              // Just sold
    let rest = 0;              // Cooling down
    
    for (let i = 1; i < prices.length; i++) {
        const prevHold = hold;
        const prevSold = sold;
        const prevRest = rest;
        
        hold = Math.max(prevHold, prevRest - prices[i]);
        sold = prevHold + prices[i];
        rest = Math.max(prevRest, prevSold);
    }
    
    return Math.max(sold, rest);
}

// Stock with Transaction Fee - O(n)
function maxProfitFee(prices, fee) {
    let hold = -prices[0];
    let cash = 0;
    
    for (let i = 1; i < prices.length; i++) {
        hold = Math.max(hold, cash - prices[i]);
        cash = Math.max(cash, hold + prices[i] - fee);
    }
    
    return cash;
}

// Stock IV: At most k transactions - O(n*k)
function maxProfit4(k, prices) {
    const n = prices.length;
    if (n < 2) return 0;
    
    // If k >= n/2, unlimited transactions
    if (k >= n / 2) {
        let profit = 0;
        for (let i = 1; i < n; i++) {
            if (prices[i] > prices[i-1]) {
                profit += prices[i] - prices[i-1];
            }
        }
        return profit;
    }
    
    const dp = Array(k + 1).fill(null).map(() => Array(n).fill(0));
    
    for (let t = 1; t <= k; t++) {
        let maxDiff = -prices[0];
        for (let d = 1; d < n; d++) {
            dp[t][d] = Math.max(dp[t][d-1], prices[d] + maxDiff);
            maxDiff = Math.max(maxDiff, dp[t-1][d] - prices[d]);
        }
    }
    
    return dp[k][n-1];
}`,
    },
  ],
};
