export const stringsTopic = {
  id: "strings",
  title: "Strings",
  description:
    "Master string manipulation, pattern matching, and classic interview problems.",
  icon: "Type",
  sections: [
    // ============== THEORY SECTIONS ==============
    {
      id: "string-fundamentals",
      title: "String Fundamentals",
      type: "theory",
      content: `
## Strings: More Than Just Characters

Strings are sequences of characters with special properties that make them unique in DSA.

### Key Properties
- **Immutable** in most languages (Java, Python, JavaScript)
- **Modification creates new string** → O(n) for each change
- **Comparison** is O(min(len1, len2))

### String vs Character Array

| Operation | Immutable String | Char Array |
|-----------|-----------------|------------|
| Modify char | O(n) - new string | O(1) |
| Concatenation | O(n) per concat | O(1) amortized |
| Comparison | O(n) | O(n) |

### Interview Tip: StringBuilder
When building strings character by character, use **StringBuilder** (Java) or **array.join()** (JS) to avoid O(n²) concatenation.

### Common String Patterns
1. **Two Pointers** - Palindromes, reversal
2. **Sliding Window** - Substrings with constraints
3. **Hash Map** - Anagrams, frequency counting
4. **Dynamic Programming** - Edit distance, LCS
5. **Trie** - Prefix matching, autocomplete
      `,
      code: `// String Immutability Demonstration
let s = "hello";
// s[0] = 'H'; // This doesn't work in most languages!

// Correct way: create new string
s = 'H' + s.slice(1); // O(n) operation

// Building strings efficiently
// BAD: O(n²) due to repeated concatenation
function buildStringBad(n) {
    let result = "";
    for (let i = 0; i < n; i++) {
        result += i; // Creates new string each time!
    }
    return result;
}

// GOOD: O(n) using array
function buildStringGood(n) {
    const parts = [];
    for (let i = 0; i < n; i++) {
        parts.push(i);
    }
    return parts.join(""); // Single string creation
}

// String comparison
function compareStrings(s1, s2) {
    // Lexicographic comparison
    if (s1 < s2) return -1;
    if (s1 > s2) return 1;
    return 0;
}

// Common string methods (JavaScript)
const str = "Hello World";
str.length;            // 11
str.charAt(0);         // 'H'
str.indexOf('o');      // 4
str.lastIndexOf('o');  // 7
str.substring(0, 5);   // 'Hello'
str.split(' ');        // ['Hello', 'World']
str.toLowerCase();     // 'hello world'
str.trim();            // Removes whitespace`,
    },
    {
      id: "anagram-pattern",
      title: "Anagram Pattern",
      type: "theory",
      content: `
## Anagrams: Same Characters, Different Order

Two strings are **anagrams** if they contain the same characters with the same frequencies.

### Examples
- "listen" ↔ "silent" ✓
- "hello" ↔ "world" ✗

### Three Approaches

#### 1. Sorting - O(n log n)
Sort both strings, compare if equal.
Simple but not optimal.

#### 2. Hash Map Counting - O(n)
Count frequency of each character in both strings.
Compare the frequency maps.

#### 3. Single Pass with Array - O(n)
Use fixed-size array (26 for lowercase English).
Increment for string1, decrement for string2.
All zeros = anagram.

### Interview Extension: Find All Anagrams
Given a string and a pattern, find all starting indices of pattern's anagrams in the string.
→ Use **Sliding Window + Frequency Map**
      `,
      code: `// Approach 1: Sorting - O(n log n)
function isAnagramSort(s, t) {
    if (s.length !== t.length) return false;
    return s.split('').sort().join('') === t.split('').sort().join('');
}

// Approach 2: Hash Map - O(n)
function isAnagramMap(s, t) {
    if (s.length !== t.length) return false;
    
    const count = {};
    for (const char of s) {
        count[char] = (count[char] || 0) + 1;
    }
    
    for (const char of t) {
        if (!count[char]) return false;
        count[char]--;
    }
    
    return true;
}

// Approach 3: Array (Optimal for lowercase) - O(n)
function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    
    const count = new Array(26).fill(0);
    const aCode = 'a'.charCodeAt(0);
    
    for (let i = 0; i < s.length; i++) {
        count[s.charCodeAt(i) - aCode]++;
        count[t.charCodeAt(i) - aCode]--;
    }
    
    return count.every(c => c === 0);
}

// Find All Anagrams (LeetCode #438)
function findAnagrams(s, p) {
    const result = [];
    const pCount = new Array(26).fill(0);
    const sCount = new Array(26).fill(0);
    const aCode = 'a'.charCodeAt(0);
    
    // Count pattern characters
    for (const char of p) {
        pCount[char.charCodeAt(0) - aCode]++;
    }
    
    for (let i = 0; i < s.length; i++) {
        // Add current char to window
        sCount[s.charCodeAt(i) - aCode]++;
        
        // Remove char outside window
        if (i >= p.length) {
            sCount[s.charCodeAt(i - p.length) - aCode]--;
        }
        
        // Check if anagram
        if (i >= p.length - 1 && arraysEqual(sCount, pCount)) {
            result.push(i - p.length + 1);
        }
    }
    
    return result;
}

function arraysEqual(a, b) {
    for (let i = 0; i < 26; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}`,
    },
    {
      id: "palindrome-pattern",
      title: "Palindrome Pattern",
      type: "theory",
      content: `
## Palindromes: The Mirror Problem

A **palindrome** reads the same forwards and backwards.

### Key Technique: Two Pointers
Compare characters from both ends, moving inward.

### Palindrome Variants
1. **Valid Palindrome** - Simple check
2. **Valid Palindrome II** - Can remove at most 1 char
3. **Longest Palindromic Substring** - DP or Expand from center
4. **Palindrome Partitioning** - Backtracking + DP

### Expand from Center Technique
For **Longest Palindromic Substring**:
- Every palindrome has a center
- Center can be single char (odd length) or between two chars (even length)
- Expand outward while chars match

\`\`\`
"babad"
Centers: b, a, b, a, d (single) + positions between chars (double)
Expand from 'a' at index 1: a -> bab (palindrome!)
Expand from 'a' at index 3: a -> aba (palindrome!)
\`\`\`
      `,
      code: `// Basic Palindrome Check
function isPalindrome(s) {
    let left = 0, right = s.length - 1;
    
    while (left < right) {
        if (s[left] !== s[right]) return false;
        left++;
        right--;
    }
    return true;
}

// Valid Palindrome (ignore non-alphanumeric, case insensitive)
function isPalindromeValid(s) {
    s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return isPalindrome(s);
}

// Valid Palindrome II - Remove at most 1 character
function validPalindrome(s) {
    function isPalindromeRange(left, right) {
        while (left < right) {
            if (s[left] !== s[right]) return false;
            left++;
            right--;
        }
        return true;
    }
    
    let left = 0, right = s.length - 1;
    while (left < right) {
        if (s[left] !== s[right]) {
            // Try removing either left or right character
            return isPalindromeRange(left + 1, right) || 
                   isPalindromeRange(left, right - 1);
        }
        left++;
        right--;
    }
    return true;
}

// Longest Palindromic Substring - Expand from Center
function longestPalindrome(s) {
    if (s.length < 2) return s;
    
    let start = 0, maxLen = 1;
    
    function expandFromCenter(left, right) {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            const len = right - left + 1;
            if (len > maxLen) {
                maxLen = len;
                start = left;
            }
            left--;
            right++;
        }
    }
    
    for (let i = 0; i < s.length; i++) {
        expandFromCenter(i, i);     // Odd length palindromes
        expandFromCenter(i, i + 1); // Even length palindromes
    }
    
    return s.substring(start, start + maxLen);
}

// Dry Run: longestPalindrome("babad")
// i=0: expand(0,0) -> "b", expand(0,1) -> "ba" fails
// i=1: expand(1,1) -> "a" -> "bab" (len=3), expand(1,2) fails
// i=2: expand(2,2) -> "b" -> "aba" (len=3), expand(2,3) fails
// i=3: expand(3,3) -> "a", expand(3,4) fails
// i=4: expand(4,4) -> "d"
// Result: "bab" or "aba" (both valid)`,
    },
    // ============== PROBLEM SECTIONS ==============
    {
      id: "problem-group-anagrams",
      title: "Group Anagrams",
      type: "problem",
      difficulty: "Medium",
      companies: ["Facebook", "Amazon", "Microsoft", "Google", "Apple"],
      leetcode: "https://leetcode.com/problems/group-anagrams/",
      content: `
## LeetCode #49: Group Anagrams

Given an array of strings \`strs\`, group the anagrams together. You can return the answer in any order.

### Example
\`\`\`
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
\`\`\`

### Key Insight
Anagrams produce the **same sorted string** or the **same character frequency signature**.

### Two Approaches
1. **Sort as Key**: O(n × k log k) where k is max string length
2. **Count as Key**: O(n × k) - Use frequency count as hash key
      `,
      code: `// Approach 1: Sorted String as Key
function groupAnagramsSort(strs) {
    const map = new Map();
    
    for (const str of strs) {
        // Sort the string to create a key
        const key = str.split('').sort().join('');
        
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key).push(str);
    }
    
    return Array.from(map.values());
}

// Approach 2: Character Count as Key (Optimal)
function groupAnagrams(strs) {
    const map = new Map();
    
    for (const str of strs) {
        // Create frequency count signature
        const count = new Array(26).fill(0);
        for (const char of str) {
            count[char.charCodeAt(0) - 'a'.charCodeAt(0)]++;
        }
        
        // Use count as key (convert to string for Map)
        const key = count.join('#');
        
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key).push(str);
    }
    
    return Array.from(map.values());
}

// Dry Run: ["eat","tea","tan","ate","nat","bat"]
// "eat" -> count[0,0,0,0,1,0,...1,...1] -> key="0#0#0#0#1#...#1#...#1"
// "tea" -> same count -> same key -> groups together
// "tan" -> count[1,0,0,0,0,...1,...1] -> different key
// 
// Result groups:
// Key1: ["eat", "tea", "ate"]
// Key2: ["tan", "nat"]
// Key3: ["bat"]

// Time Complexity:
// Approach 1: O(n × k log k) - sorting each string
// Approach 2: O(n × k) - counting characters
// 
// Space: O(n × k) for storing all strings in map`,
    },
    {
      id: "problem-longest-palindrome-substring",
      title: "Longest Palindromic Substring",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Microsoft", "Adobe", "Apple", "Facebook"],
      leetcode: "https://leetcode.com/problems/longest-palindromic-substring/",
      content: `
## LeetCode #5: Longest Palindromic Substring

Given a string \`s\`, return the longest palindromic substring in \`s\`.

### Example
\`\`\`
Input: s = "babad"
Output: "bab" (or "aba")
\`\`\`

### Three Approaches

1. **Brute Force**: O(n³) - Check all substrings
2. **Expand from Center**: O(n²) time, O(1) space
3. **Manacher's Algorithm**: O(n) - Advanced technique

### Why Expand from Center Works
- Every palindrome has a center
- Odd-length: center is a character
- Even-length: center is between two characters
- Total centers: 2n - 1
- Expanding each center is O(n) worst case
- Total: O(n²)
      `,
      code: `// Expand from Center - Optimal for interviews
function longestPalindrome(s) {
    if (s.length < 2) return s;
    
    let start = 0, maxLen = 1;
    
    function expand(left, right) {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            if (right - left + 1 > maxLen) {
                start = left;
                maxLen = right - left + 1;
            }
            left--;
            right++;
        }
    }
    
    for (let i = 0; i < s.length; i++) {
        expand(i, i);     // Odd-length palindromes
        expand(i, i + 1); // Even-length palindromes
    }
    
    return s.substring(start, start + maxLen);
}

// Dynamic Programming Approach - O(n²) time, O(n²) space
function longestPalindromeDP(s) {
    const n = s.length;
    const dp = Array.from({ length: n }, () => Array(n).fill(false));
    let start = 0, maxLen = 1;
    
    // All single characters are palindromes
    for (let i = 0; i < n; i++) {
        dp[i][i] = true;
    }
    
    // Check for length 2
    for (let i = 0; i < n - 1; i++) {
        if (s[i] === s[i + 1]) {
            dp[i][i + 1] = true;
            start = i;
            maxLen = 2;
        }
    }
    
    // Check for length 3 and above
    for (let len = 3; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            if (s[i] === s[j] && dp[i + 1][j - 1]) {
                dp[i][j] = true;
                if (len > maxLen) {
                    start = i;
                    maxLen = len;
                }
            }
        }
    }
    
    return s.substring(start, start + maxLen);
}

// Detailed Dry Run for "cbbd":
// Expand from center approach:
// i=0: expand(0,0)="c", expand(0,1)="cb"✗
// i=1: expand(1,1)="b", expand(1,2)="bb"✓ (len=2, max!)
// i=2: expand(2,2)="b", expand(2,3)="bd"✗
// i=3: expand(3,3)="d"
// Result: "bb"`,
    },
    {
      id: "problem-minimum-window-substring",
      title: "Minimum Window Substring",
      type: "problem",
      difficulty: "Hard",
      companies: ["Facebook", "Amazon", "LinkedIn", "Uber", "Google"],
      leetcode: "https://leetcode.com/problems/minimum-window-substring/",
      content: `
## LeetCode #76: Minimum Window Substring

Given two strings \`s\` and \`t\`, return the minimum window substring of \`s\` such that every character in \`t\` (including duplicates) is included in the window.

### Example
\`\`\`
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
\`\`\`

### Pattern: Sliding Window + Hash Map

Key variables:
- **need**: Map of characters we need
- **have**: Count of characters we have that match requirements
- **required**: Number of unique characters we need

### Algorithm
1. Expand window by moving right pointer
2. When all characters satisfied, try to shrink from left
3. Track minimum window during shrinking
      `,
      code: `function minWindow(s, t) {
    if (t.length > s.length) return "";
    
    // Count characters needed from t
    const need = new Map();
    for (const char of t) {
        need.set(char, (need.get(char) || 0) + 1);
    }
    
    const required = need.size; // Unique chars in t
    let have = 0; // Unique chars with correct count
    
    const window = new Map();
    let left = 0;
    let minLen = Infinity;
    let result = [0, 0];
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        window.set(char, (window.get(char) || 0) + 1);
        
        // Check if current char satisfies requirement
        if (need.has(char) && window.get(char) === need.get(char)) {
            have++;
        }
        
        // Try to shrink window while all requirements met
        while (have === required) {
            // Update result if current window is smaller
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                result = [left, right + 1];
            }
            
            // Remove leftmost character
            const leftChar = s[left];
            window.set(leftChar, window.get(leftChar) - 1);
            
            if (need.has(leftChar) && window.get(leftChar) < need.get(leftChar)) {
                have--;
            }
            
            left++;
        }
    }
    
    return minLen === Infinity ? "" : s.substring(result[0], result[1]);
}

// Dry Run: s = "ADOBECODEBANC", t = "ABC"
// need = {A:1, B:1, C:1}, required = 3
// 
// Expand until have=3:
// right=0: 'A', window={A:1}, have=1
// right=1: 'D', window={A:1,D:1}, have=1
// right=2: 'O', have=1
// right=3: 'B', window={...,B:1}, have=2
// right=4: 'E', have=2
// right=5: 'C', window={...,C:1}, have=3 ✓
// 
// Shrink: window="ADOBEC" (len=6)
// left=0: remove 'A', have=2, stop shrinking
// 
// Continue expanding...
// right=10: 'A', have=3 again
// Shrink: window="CODEBA" then "ODEBA" then "DEBA" then "EBA" then "BA"
// ...eventually find "BANC" (len=4)
// 
// Result: "BANC"

// Time: O(s + t) - each char visited at most twice
// Space: O(s + t) - for hash maps`,
    },
    {
      id: "problem-string-to-integer",
      title: "String to Integer (atoi)",
      type: "problem",
      difficulty: "Medium",
      companies: ["Microsoft", "Amazon", "Facebook", "Apple", "Bloomberg"],
      leetcode: "https://leetcode.com/problems/string-to-integer-atoi/",
      content: `
## LeetCode #8: String to Integer (atoi)

Implement the \`myAtoi(string s)\` function, which converts a string to a 32-bit signed integer.

### Rules
1. Ignore leading whitespace
2. Check for '+' or '-' sign
3. Read digits until non-digit
4. Clamp to 32-bit integer range: $[-2^{31}, 2^{31}-1]$

### Example
\`\`\`
Input: s = "   -42"
Output: -42

Input: s = "4193 with words"
Output: 4193

Input: s = "words and 987"
Output: 0 (no valid conversion)
\`\`\`

### Interview Focus
- **Edge cases**: Empty string, only whitespace, overflow
- **Clean code**: Handle each step clearly
      `,
      code: `function myAtoi(s) {
    const INT_MAX = 2147483647;  // 2^31 - 1
    const INT_MIN = -2147483648; // -2^31
    
    let i = 0;
    const n = s.length;
    
    // 1. Skip leading whitespace
    while (i < n && s[i] === ' ') {
        i++;
    }
    
    // 2. Check for sign
    let sign = 1;
    if (i < n && (s[i] === '+' || s[i] === '-')) {
        sign = s[i] === '-' ? -1 : 1;
        i++;
    }
    
    // 3. Convert digits
    let result = 0;
    while (i < n && s[i] >= '0' && s[i] <= '9') {
        const digit = s.charCodeAt(i) - '0'.charCodeAt(0);
        
        // 4. Check for overflow BEFORE adding
        // result * 10 + digit > INT_MAX
        // result > (INT_MAX - digit) / 10
        if (result > Math.floor((INT_MAX - digit) / 10)) {
            return sign === 1 ? INT_MAX : INT_MIN;
        }
        
        result = result * 10 + digit;
        i++;
    }
    
    return sign * result;
}

// Test cases
console.log(myAtoi("42"));          // 42
console.log(myAtoi("   -42"));      // -42
console.log(myAtoi("4193 with words")); // 4193
console.log(myAtoi("words and 987")); // 0
console.log(myAtoi("-91283472332")); // -2147483648 (clamped)
console.log(myAtoi(""));            // 0
console.log(myAtoi("   "));         // 0
console.log(myAtoi("+-12"));        // 0 (invalid)

// Why check overflow before multiplying?
// If result = 2147483647 / 10 = 214748364
// result * 10 = 2147483640
// Adding digit 8 would overflow to 2147483648 > INT_MAX
// So we check: result > (INT_MAX - digit) / 10
// 214748364 > (2147483647 - 8) / 10 = 214748363.9 → overflow!`,
    },
    {
      id: "problem-longest-common-prefix",
      title: "Longest Common Prefix",
      type: "problem",
      difficulty: "Easy",
      companies: ["Amazon", "Google", "Adobe", "Apple", "Microsoft"],
      leetcode: "https://leetcode.com/problems/longest-common-prefix/",
      content: `
## LeetCode #14: Longest Common Prefix

Write a function to find the longest common prefix string amongst an array of strings.

### Example
\`\`\`
Input: strs = ["flower","flow","flight"]
Output: "fl"

Input: strs = ["dog","racecar","car"]
Output: "" (no common prefix)
\`\`\`

### Multiple Approaches
1. **Horizontal Scanning**: Compare strings pairwise
2. **Vertical Scanning**: Compare characters column by column
3. **Divide and Conquer**: Split array, find prefix of each half
4. **Binary Search**: Binary search on prefix length
5. **Trie**: Build trie, find deepest common path

### Best for Interviews
Vertical scanning is most intuitive and efficient: O(S) where S is sum of all characters.
      `,
      code: `// Approach 1: Vertical Scanning (Recommended)
function longestCommonPrefix(strs) {
    if (strs.length === 0) return "";
    
    for (let i = 0; i < strs[0].length; i++) {
        const char = strs[0][i];
        
        for (let j = 1; j < strs.length; j++) {
            // If we've exceeded this string's length or chars don't match
            if (i >= strs[j].length || strs[j][i] !== char) {
                return strs[0].substring(0, i);
            }
        }
    }
    
    return strs[0]; // First string is the prefix
}

// Approach 2: Horizontal Scanning
function longestCommonPrefixHorizontal(strs) {
    if (strs.length === 0) return "";
    
    let prefix = strs[0];
    
    for (let i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.length - 1);
            if (prefix === "") return "";
        }
    }
    
    return prefix;
}

// Approach 3: Using reduce
function longestCommonPrefixReduce(strs) {
    if (strs.length === 0) return "";
    
    return strs.reduce((prefix, str) => {
        while (str.indexOf(prefix) !== 0) {
            prefix = prefix.slice(0, -1);
        }
        return prefix;
    });
}

// Approach 4: Sort and Compare First/Last (clever trick!)
function longestCommonPrefixSort(strs) {
    if (strs.length === 0) return "";
    
    // After sorting, first and last strings are most different
    strs.sort();
    const first = strs[0];
    const last = strs[strs.length - 1];
    
    let i = 0;
    while (i < first.length && first[i] === last[i]) {
        i++;
    }
    
    return first.substring(0, i);
}

// Dry Run: ["flower", "flow", "flight"]
// Vertical Scanning:
// i=0: char='f' - all strings have 'f' at index 0 ✓
// i=1: char='l' - all strings have 'l' at index 1 ✓
// i=2: char='o' - "flower"='o', "flow"='o', "flight"='i' ✗
// Return "fl"

// Time: O(S) where S = sum of all characters
// Space: O(1) for vertical scanning`,
    },
  ],
};
