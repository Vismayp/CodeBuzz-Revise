export const recursionTopic = {
  id: "recursion-backtracking",
  title: "Recursion & Backtracking",
  description:
    "Master recursive thinking, backtracking patterns, and classic combinatorial problems.",
  icon: "RefreshCw",
  sections: [
    // ============== THEORY SECTIONS ==============
    {
      id: "recursion-fundamentals",
      title: "Recursion Fundamentals",
      type: "theory",
      content: `
## Recursion: A Function That Calls Itself

Recursion is a technique where a function solves a problem by calling itself with a smaller input.

### Two Essential Components
1. **Base Case**: Condition to stop recursion (prevents infinite loop)
2. **Recursive Case**: Break problem into smaller subproblems

### How Recursion Works
Each recursive call:
1. Creates a new stack frame (memory)
2. Solves a smaller version of the problem
3. Returns result back up the call stack

### Types of Recursion
| Type | Description | Example |
|------|-------------|---------|
| **Linear** | One recursive call | Factorial |
| **Binary/Tree** | Two calls | Fibonacci |
| **Tail** | Recursive call is last | Can be optimized |
| **Mutual** | Two functions call each other | isEven/isOdd |

### Common Mistakes
1. Missing base case → Stack overflow
2. Not progressing toward base case
3. Not returning recursive call result
4. Modifying shared state incorrectly
      `,
      diagram: `
graph TD
    A["factorial(4)"] --> B["4 * factorial(3)"]
    B --> C["3 * factorial(2)"]
    C --> D["2 * factorial(1)"]
    D --> E["1 - Base Case"]
    E --> F["Return 1"]
    F --> G["Return 2*1=2"]
    G --> H["Return 3*2=6"]
    H --> I["Return 4*6=24"]
      `,
      code: `// Linear Recursion: Factorial
function factorial(n) {
    // Base case
    if (n <= 1) return 1;
    
    // Recursive case
    return n * factorial(n - 1);
}
// factorial(4) = 4 * 3 * 2 * 1 = 24

// Binary/Tree Recursion: Fibonacci
function fibonacci(n) {
    // Base cases
    if (n <= 1) return n;
    
    // Two recursive calls
    return fibonacci(n - 1) + fibonacci(n - 2);
}
// Warning: O(2^n) - very slow! Use memoization.

// Tail Recursion: Sum
function sumTail(n, accumulator = 0) {
    if (n <= 0) return accumulator;
    return sumTail(n - 1, accumulator + n);
}
// Can be optimized by compiler (not in JS though)

// Converting Recursion to Iteration
// Recursive version
function sumRecursive(arr) {
    if (arr.length === 0) return 0;
    return arr[0] + sumRecursive(arr.slice(1));
}

// Iterative version (more efficient)
function sumIterative(arr) {
    let total = 0;
    for (const num of arr) {
        total += num;
    }
    return total;
}

// Power function: x^n
function power(x, n) {
    if (n === 0) return 1;
    if (n < 0) return 1 / power(x, -n);
    
    // Optimize: x^n = (x^(n/2))^2
    if (n % 2 === 0) {
        const half = power(x, n / 2);
        return half * half;
    }
    return x * power(x, n - 1);
}
// O(log n) instead of O(n)`,
    },
    {
      id: "backtracking-pattern",
      title: "Backtracking Pattern",
      type: "theory",
      content: `
## Backtracking: Controlled Recursion

Backtracking is recursion with **exploration and undoing**. It systematically explores all possibilities by building solutions incrementally and abandoning paths that fail.

### The Backtracking Template
\`\`\`
function backtrack(current_state, choices):
    if is_solution(current_state):
        add to results
        return
    
    for choice in choices:
        if is_valid(choice):
            make_choice(current_state, choice)
            backtrack(current_state, remaining_choices)
            undo_choice(current_state, choice)  // BACKTRACK
\`\`\`

### Key Insight: State Tree
Backtracking explores a decision tree:
- Each node = partial solution
- Each edge = a choice
- Leaves = complete solutions or dead ends

### When to Use Backtracking
1. **Combinatorial problems**: Subsets, permutations, combinations
2. **Constraint satisfaction**: Sudoku, N-Queens
3. **Path finding**: Maze solving, word search
4. **Optimization with constraints**: When greedy doesn't work

### Pruning
Early termination of branches that can't lead to valid solutions - crucial for efficiency!
      `,
      diagram: `
graph TD
    A["Start: []"] --> B["Add 1: [1]"]
    A --> C["Skip 1: []"]
    B --> D["Add 2: [1,2]"]
    B --> E["Skip 2: [1]"]
    C --> F["Add 2: [2]"]
    C --> G["Skip 2: []"]
    style D fill:#90EE90
    style E fill:#90EE90
    style F fill:#90EE90
    style G fill:#90EE90
      `,
      code: `// Generic Backtracking Template
function backtrack(result, current, choices, start = 0) {
    // Base case: found a solution
    if (isSolution(current)) {
        result.push([...current]); // Make a copy!
        return;
    }
    
    // Try each choice
    for (let i = start; i < choices.length; i++) {
        // Skip invalid choices (pruning)
        if (!isValid(choices[i])) continue;
        
        // Make choice
        current.push(choices[i]);
        
        // Recurse
        backtrack(result, current, choices, i + 1);
        
        // Undo choice (backtrack)
        current.pop();
    }
}

// Example: Generate all subsets
function subsets(nums) {
    const result = [];
    
    function backtrack(start, current) {
        // Every state is a valid solution for subsets
        result.push([...current]);
        
        for (let i = start; i < nums.length; i++) {
            current.push(nums[i]);
            backtrack(i + 1, current);
            current.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}

// subsets([1,2,3]) → [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]

// Example: Generate all permutations
function permutations(nums) {
    const result = [];
    const used = new Array(nums.length).fill(false);
    
    function backtrack(current) {
        if (current.length === nums.length) {
            result.push([...current]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue; // Skip used elements
            
            used[i] = true;
            current.push(nums[i]);
            
            backtrack(current);
            
            current.pop();
            used[i] = false;
        }
    }
    
    backtrack([]);
    return result;
}

// permutations([1,2,3]) → [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]`,
    },
    {
      id: "subsets-combinations",
      title: "Subsets & Combinations",
      type: "theory",
      content: `
## Subsets and Combinations

### Subsets (Power Set)
All possible subsets including empty set.
For n elements: $2^n$ subsets

### Combinations
Choose k elements from n elements.
Count: $C(n,k) = \\frac{n!}{k!(n-k)!}$

### Key Differences
| Subsets | Combinations |
|---------|--------------|
| All sizes | Fixed size k |
| $2^n$ results | $C(n,k)$ results |
| No stopping condition | Stop at size k |

### Pattern: Include/Exclude
At each element, we decide:
- Include it in current subset
- OR exclude it

This naturally creates the branching structure.
      `,
      code: `// Subsets (LeetCode #78)
function subsets(nums) {
    const result = [];
    
    function backtrack(start, current) {
        result.push([...current]);
        
        for (let i = start; i < nums.length; i++) {
            current.push(nums[i]);
            backtrack(i + 1, current);
            current.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}

// Alternative: Iterative approach
function subsetsIterative(nums) {
    const result = [[]];
    
    for (const num of nums) {
        const size = result.length;
        for (let i = 0; i < size; i++) {
            result.push([...result[i], num]);
        }
    }
    
    return result;
}

// Subsets II - with duplicates (LeetCode #90)
function subsetsWithDup(nums) {
    const result = [];
    nums.sort((a, b) => a - b); // Sort to handle duplicates!
    
    function backtrack(start, current) {
        result.push([...current]);
        
        for (let i = start; i < nums.length; i++) {
            // Skip duplicates at same level
            if (i > start && nums[i] === nums[i - 1]) continue;
            
            current.push(nums[i]);
            backtrack(i + 1, current);
            current.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}

// Combinations (LeetCode #77)
function combine(n, k) {
    const result = [];
    
    function backtrack(start, current) {
        if (current.length === k) {
            result.push([...current]);
            return;
        }
        
        // Optimization: don't start if not enough elements left
        // Need: k - current.length more elements
        // Have: n - i + 1 elements left
        for (let i = start; i <= n - (k - current.length) + 1; i++) {
            current.push(i);
            backtrack(i + 1, current);
            current.pop();
        }
    }
    
    backtrack(1, []);
    return result;
}

// Combination Sum (LeetCode #39) - can reuse elements
function combinationSum(candidates, target) {
    const result = [];
    
    function backtrack(start, current, remaining) {
        if (remaining === 0) {
            result.push([...current]);
            return;
        }
        if (remaining < 0) return;
        
        for (let i = start; i < candidates.length; i++) {
            current.push(candidates[i]);
            // Pass i (not i+1) to allow reuse
            backtrack(i, current, remaining - candidates[i]);
            current.pop();
        }
    }
    
    backtrack(0, [], target);
    return result;
}`,
    },
    // ============== PROBLEM SECTIONS ==============
    {
      id: "problem-permutations",
      title: "Permutations",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
      leetcode: "https://leetcode.com/problems/permutations/",
      content: `
## LeetCode #46: Permutations

Given an array nums of distinct integers, return all possible permutations.

### Example
\`\`\`
Input: nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
\`\`\`

### Key Insight
Unlike subsets, permutations use ALL elements but in different orders.
Track which elements are already used with a boolean array or set.

### Complexity
- Time: O(n! × n) - n! permutations, each takes O(n) to copy
- Space: O(n) - recursion depth and used array
      `,
      code: `function permute(nums) {
    const result = [];
    const used = new Array(nums.length).fill(false);
    
    function backtrack(current) {
        // Base case: permutation is complete
        if (current.length === nums.length) {
            result.push([...current]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue; // Skip used elements
            
            // Choose
            used[i] = true;
            current.push(nums[i]);
            
            // Explore
            backtrack(current);
            
            // Unchoose (backtrack)
            current.pop();
            used[i] = false;
        }
    }
    
    backtrack([]);
    return result;
}

// Decision Tree for [1,2,3]:
//                    []
//          /         |          \\
//       [1]         [2]         [3]
//      /   \\       /   \\       /   \\
//   [1,2] [1,3]  [2,1] [2,3]  [3,1] [3,2]
//     |     |      |     |      |     |
// [1,2,3][1,3,2][2,1,3][2,3,1][3,1,2][3,2,1]

// Alternative: Swap approach (in-place, slightly faster)
function permuteSwap(nums) {
    const result = [];
    
    function backtrack(start) {
        if (start === nums.length) {
            result.push([...nums]);
            return;
        }
        
        for (let i = start; i < nums.length; i++) {
            // Swap
            [nums[start], nums[i]] = [nums[i], nums[start]];
            
            backtrack(start + 1);
            
            // Swap back
            [nums[start], nums[i]] = [nums[i], nums[start]];
        }
    }
    
    backtrack(0);
    return result;
}`,
    },
    {
      id: "problem-n-queens",
      title: "N-Queens",
      type: "problem",
      difficulty: "Hard",
      companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
      leetcode: "https://leetcode.com/problems/n-queens/",
      content: `
## LeetCode #51: N-Queens

Place n queens on an n×n chessboard such that no two queens attack each other.

### Constraints
- No two queens in same row
- No two queens in same column  
- No two queens on same diagonal

### Key Insight: Row by Row
Since each row must have exactly one queen, we place queens row by row.
For each row, try each column and check if placement is valid.

### Diagonal Trick
- Main diagonal (↘): row - col is constant
- Anti-diagonal (↙): row + col is constant

Use sets to track occupied columns and diagonals.
      `,
      diagram: `
graph TB
    A["N-Queens Board N=4"] --> B["Q . . .\n. . Q .\n. . . Q (Invalid)\n. Q . ."]
    A --> C["Q . . .\n. . . Q\n. Q . .\n. . Q . (Invalid)"]
    A --> D[". Q . .\n. . . Q\nQ . . .\n. . Q . (Valid!)"]
      `,
      code: `function solveNQueens(n) {
    const result = [];
    const board = Array(n).fill(null).map(() => Array(n).fill('.'));
    
    // Track occupied columns and diagonals
    const cols = new Set();
    const diag1 = new Set(); // row - col
    const diag2 = new Set(); // row + col
    
    function backtrack(row) {
        // Base case: all queens placed
        if (row === n) {
            result.push(board.map(row => row.join('')));
            return;
        }
        
        for (let col = 0; col < n; col++) {
            // Check if position is valid
            if (cols.has(col) || 
                diag1.has(row - col) || 
                diag2.has(row + col)) {
                continue;
            }
            
            // Place queen
            board[row][col] = 'Q';
            cols.add(col);
            diag1.add(row - col);
            diag2.add(row + col);
            
            // Recurse to next row
            backtrack(row + 1);
            
            // Remove queen (backtrack)
            board[row][col] = '.';
            cols.delete(col);
            diag1.delete(row - col);
            diag2.delete(row + col);
        }
    }
    
    backtrack(0);
    return result;
}

// Dry Run for n=4:
// Row 0: Try col 0
//   Q . . .
//   . . . .
//   . . . .
//   . . . .
// 
// Row 1: col 0 (blocked), col 1 (diagonal), try col 2
//   Q . . .
//   . . Q .
//   . . . .
//   . . . .
//
// Row 2: col 0 (diagonal), col 1 (blocked), col 2 (blocked), col 3 (diagonal)
//   → Backtrack! Remove queen from row 1, col 2
//
// Row 1: Try col 3
//   Q . . .
//   . . . Q
//   . . . .
//   . . . .
//
// Row 2: Try col 1
//   Q . . .
//   . . . Q
//   . Q . .
//   . . . .
//
// Row 3: col 0 (diagonal), col 1 (blocked), try col 2
//   This doesn't work either... Eventually finds:
//
// Valid solution:
//   . Q . .
//   . . . Q
//   Q . . .
//   . . Q .

// N-Queens II: Just count solutions
function totalNQueens(n) {
    let count = 0;
    const cols = new Set();
    const diag1 = new Set();
    const diag2 = new Set();
    
    function backtrack(row) {
        if (row === n) {
            count++;
            return;
        }
        
        for (let col = 0; col < n; col++) {
            if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
                continue;
            }
            
            cols.add(col);
            diag1.add(row - col);
            diag2.add(row + col);
            
            backtrack(row + 1);
            
            cols.delete(col);
            diag1.delete(row - col);
            diag2.delete(row + col);
        }
    }
    
    backtrack(0);
    return count;
}`,
    },
    {
      id: "problem-word-search",
      title: "Word Search",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Microsoft", "Facebook", "Bloomberg", "Snapchat"],
      leetcode: "https://leetcode.com/problems/word-search/",
      content: `
## LeetCode #79: Word Search

Given an m x n grid of characters board and a string word, return true if word exists in the grid.

### Example
\`\`\`
board = [["A","B","C","E"],
         ["S","F","C","S"],
         ["A","D","E","E"]]
word = "ABCCED"
Output: true
\`\`\`

### Key Insight
Use DFS with backtracking:
1. Try each cell as starting point
2. Explore 4 directions (up, down, left, right)
3. Mark cells as visited during exploration
4. Unmark cells when backtracking
      `,
      code: `function exist(board, word) {
    const rows = board.length;
    const cols = board[0].length;
    
    function backtrack(row, col, index) {
        // Base case: all characters matched
        if (index === word.length) return true;
        
        // Boundary and character check
        if (row < 0 || row >= rows || 
            col < 0 || col >= cols || 
            board[row][col] !== word[index]) {
            return false;
        }
        
        // Mark as visited (temporarily modify board)
        const temp = board[row][col];
        board[row][col] = '#';
        
        // Explore 4 directions
        const found = backtrack(row + 1, col, index + 1) ||
                      backtrack(row - 1, col, index + 1) ||
                      backtrack(row, col + 1, index + 1) ||
                      backtrack(row, col - 1, index + 1);
        
        // Restore cell (backtrack)
        board[row][col] = temp;
        
        return found;
    }
    
    // Try each cell as starting point
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (backtrack(i, j, 0)) return true;
        }
    }
    
    return false;
}

// Dry Run: Find "ABCCED" in:
// A B C E
// S F C S
// A D E E
//
// Start at (0,0) = 'A', matches word[0]
// Mark visited: # B C E
//
// Try (1,0) = 'S', doesn't match 'B'
// Try (0,1) = 'B', matches word[1]
// Mark: # # C E
//
// Try (1,1) = 'F', doesn't match 'C'
// Try (0,2) = 'C', matches word[2]
// Mark: # # # E
//
// Try (1,2) = 'C', matches word[3]
// Mark: # # # E
//       S F # S
//
// Try (2,2) = 'E', matches word[4]
// Mark: # # # E
//       S F # S
//       A D # E
//
// Try (2,1) = 'D', matches word[5]
// All characters found! Return true

// Optimized with early termination
function existOptimized(board, word) {
    const rows = board.length;
    const cols = board[0].length;
    
    // Count characters - early termination if impossible
    const charCount = {};
    for (const row of board) {
        for (const c of row) {
            charCount[c] = (charCount[c] || 0) + 1;
        }
    }
    
    for (const c of word) {
        if (!charCount[c] || charCount[c] === 0) return false;
        charCount[c]--;
    }
    
    // If word ends with rarer char, search reversed
    const wordCount = {};
    for (const c of word) wordCount[c] = (wordCount[c] || 0) + 1;
    
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    
    function dfs(r, c, i) {
        if (i === word.length) return true;
        if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
        if (board[r][c] !== word[i]) return false;
        
        const temp = board[r][c];
        board[r][c] = '#';
        
        for (const [dr, dc] of dirs) {
            if (dfs(r + dr, c + dc, i + 1)) {
                board[r][c] = temp;
                return true;
            }
        }
        
        board[r][c] = temp;
        return false;
    }
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (dfs(i, j, 0)) return true;
        }
    }
    
    return false;
}`,
    },
    {
      id: "problem-sudoku-solver",
      title: "Sudoku Solver",
      type: "problem",
      difficulty: "Hard",
      companies: ["Amazon", "Microsoft", "Google", "Apple", "DoorDash"],
      leetcode: "https://leetcode.com/problems/sudoku-solver/",
      content: `
## LeetCode #37: Sudoku Solver

Write a program to solve a Sudoku puzzle by filling the empty cells.

### Constraints
- 9×9 grid
- Digits 1-9
- Each row, column, and 3×3 box must contain all digits

### Key Insight
Use backtracking:
1. Find empty cell
2. Try digits 1-9
3. Check if valid
4. Recurse to solve rest
5. Backtrack if stuck
      `,
      code: `function solveSudoku(board) {
    solve(board);
}

function solve(board) {
    // Find empty cell
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === '.') {
                // Try digits 1-9
                for (let num = 1; num <= 9; num++) {
                    const char = num.toString();
                    if (isValid(board, row, col, char)) {
                        board[row][col] = char;
                        
                        if (solve(board)) {
                            return true; // Solution found
                        }
                        
                        board[row][col] = '.'; // Backtrack
                    }
                }
                return false; // No valid number, backtrack
            }
        }
    }
    return true; // All cells filled
}

function isValid(board, row, col, char) {
    // Check row
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === char) return false;
    }
    
    // Check column
    for (let i = 0; i < 9; i++) {
        if (board[i][col] === char) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[boxRow + i][boxCol + j] === char) return false;
        }
    }
    
    return true;
}

// Optimized version with sets for O(1) validation
function solveSudokuOptimized(board) {
    // Initialize tracking sets
    const rows = Array(9).fill(null).map(() => new Set());
    const cols = Array(9).fill(null).map(() => new Set());
    const boxes = Array(9).fill(null).map(() => new Set());
    
    const getBoxIndex = (r, c) => Math.floor(r / 3) * 3 + Math.floor(c / 3);
    
    // Populate sets with existing numbers
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] !== '.') {
                const num = board[r][c];
                rows[r].add(num);
                cols[c].add(num);
                boxes[getBoxIndex(r, c)].add(num);
            }
        }
    }
    
    function backtrack(r, c) {
        // Move to next row
        if (c === 9) {
            r++;
            c = 0;
        }
        // All cells filled
        if (r === 9) return true;
        
        // Skip filled cells
        if (board[r][c] !== '.') {
            return backtrack(r, c + 1);
        }
        
        const boxIdx = getBoxIndex(r, c);
        
        for (let num = 1; num <= 9; num++) {
            const char = num.toString();
            
            if (rows[r].has(char) || cols[c].has(char) || boxes[boxIdx].has(char)) {
                continue;
            }
            
            // Place number
            board[r][c] = char;
            rows[r].add(char);
            cols[c].add(char);
            boxes[boxIdx].add(char);
            
            if (backtrack(r, c + 1)) return true;
            
            // Backtrack
            board[r][c] = '.';
            rows[r].delete(char);
            cols[c].delete(char);
            boxes[boxIdx].delete(char);
        }
        
        return false;
    }
    
    backtrack(0, 0);
}`,
    },
    {
      id: "problem-generate-parentheses",
      title: "Generate Parentheses",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Google", "Microsoft", "Facebook", "Adobe"],
      leetcode: "https://leetcode.com/problems/generate-parentheses/",
      content: `
## LeetCode #22: Generate Parentheses

Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.

### Example
\`\`\`
Input: n = 3
Output: ["((()))","(()())","(())()","()(())","()()()"]
\`\`\`

### Key Insight
At each position, we can add:
- '(' if we haven't used all open parentheses (open < n)
- ')' if there are open parentheses to close (close < open)

### Constraints
- Can only add ')' if there's a matching '('
- Total: n opening and n closing parentheses
      `,
      code: `function generateParenthesis(n) {
    const result = [];
    
    function backtrack(current, open, close) {
        // Base case: used all parentheses
        if (current.length === 2 * n) {
            result.push(current);
            return;
        }
        
        // Add '(' if we haven't used all
        if (open < n) {
            backtrack(current + '(', open + 1, close);
        }
        
        // Add ')' if there's an unmatched '('
        if (close < open) {
            backtrack(current + ')', open, close + 1);
        }
    }
    
    backtrack('', 0, 0);
    return result;
}

// Decision Tree for n=2:
//                    ""
//                    |
//                   "("
//                 /     \\
//              "(("      "()"
//              /           \\
//           "(()"         "()()"
//            /
//         "(())"
//
// Results: ["(())", "()()"]

// Decision Tree for n=3:
//                         ""
//                         |
//                        "("
//                    /        \\
//                 "(("         "()"
//               /     \\          \\
//            "((("    "(()"      "()("
//              |      /   \\       /  \\
//          "((()" "(()(""(())"  "()((""()()"
//            |     |    \\         |     |
//        "((())""(()()""(())()" "()(()""()()()"
//                           ↓
//                       "(())()"
//
// Final results: ["((()))", "(()())", "(())()", "()(())", "()()()"]

// Alternative: Build with array (slightly more memory efficient)
function generateParenthesisArray(n) {
    const result = [];
    
    function backtrack(current, open, close) {
        if (current.length === 2 * n) {
            result.push(current.join(''));
            return;
        }
        
        if (open < n) {
            current.push('(');
            backtrack(current, open + 1, close);
            current.pop();
        }
        
        if (close < open) {
            current.push(')');
            backtrack(current, open, close + 1);
            current.pop();
        }
    }
    
    backtrack([], 0, 0);
    return result;
}

// Catalan number: C_n = (2n)! / ((n+1)! * n!)
// For n=3: C_3 = 6! / (4! * 3!) = 5 combinations`,
    },
    {
      id: "problem-letter-combinations",
      title: "Letter Combinations of Phone Number",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Facebook", "Microsoft", "Google", "Uber"],
      leetcode:
        "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
      content: `
## LeetCode #17: Letter Combinations of a Phone Number

Given a string containing digits from 2-9, return all possible letter combinations.

### Example
\`\`\`
Input: digits = "23"
Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
\`\`\`

### Key Insight
Each digit maps to 3-4 letters. Generate all combinations by:
1. Process digits one by one
2. For each digit, try all possible letters
3. Recurse to next digit
      `,
      code: `function letterCombinations(digits) {
    if (!digits || digits.length === 0) return [];
    
    const phone = {
        '2': 'abc', '3': 'def', '4': 'ghi',
        '5': 'jkl', '6': 'mno', '7': 'pqrs',
        '8': 'tuv', '9': 'wxyz'
    };
    
    const result = [];
    
    function backtrack(index, current) {
        // Base case: processed all digits
        if (index === digits.length) {
            result.push(current);
            return;
        }
        
        const letters = phone[digits[index]];
        for (const letter of letters) {
            backtrack(index + 1, current + letter);
        }
    }
    
    backtrack(0, '');
    return result;
}

// Decision Tree for "23":
//                    ""
//           /        |        \\
//         "a"       "b"       "c"
//       / | \\     / | \\     / | \\
//     ad ae af   bd be bf   cd ce cf
//
// Each digit multiplies combinations by 3-4

// Iterative approach (BFS-style)
function letterCombinationsIterative(digits) {
    if (!digits || digits.length === 0) return [];
    
    const phone = {
        '2': 'abc', '3': 'def', '4': 'ghi',
        '5': 'jkl', '6': 'mno', '7': 'pqrs',
        '8': 'tuv', '9': 'wxyz'
    };
    
    let combinations = [''];
    
    for (const digit of digits) {
        const letters = phone[digit];
        const newCombinations = [];
        
        for (const combo of combinations) {
            for (const letter of letters) {
                newCombinations.push(combo + letter);
            }
        }
        
        combinations = newCombinations;
    }
    
    return combinations;
}

// Dry Run for "23":
// Start: ['']
// Process '2' (abc):
//   '' + 'a' = 'a'
//   '' + 'b' = 'b'
//   '' + 'c' = 'c'
//   combinations = ['a', 'b', 'c']
// Process '3' (def):
//   'a' + 'd/e/f' = 'ad', 'ae', 'af'
//   'b' + 'd/e/f' = 'bd', 'be', 'bf'
//   'c' + 'd/e/f' = 'cd', 'ce', 'cf'
// Result: ['ad','ae','af','bd','be','bf','cd','ce','cf']`,
    },
  ],
};
