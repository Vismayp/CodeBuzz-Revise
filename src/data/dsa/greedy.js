export const greedyTopic = {
  id: "greedy",
  title: "Greedy Algorithms",
  description:
    "Master greedy strategies for optimization, intervals, and scheduling problems.",
  icon: "Zap",
  sections: [
    // ============== THEORY SECTIONS ==============
    {
      id: "greedy-fundamentals",
      title: "Greedy Algorithm Fundamentals",
      type: "theory",
      content: `
## Greedy Algorithms: Making Locally Optimal Choices

A greedy algorithm makes the best choice at each step, hoping to find the global optimum.

### When Greedy Works
1. **Greedy Choice Property**: A locally optimal choice leads to globally optimal solution
2. **Optimal Substructure**: Optimal solution contains optimal solutions to subproblems

### Greedy vs DP
| Greedy | Dynamic Programming |
|--------|---------------------|
| Make one choice per step | Consider all choices |
| No backtracking | May revisit decisions |
| Faster (usually O(n) or O(n log n)) | Slower (often O(n²) or O(n³)) |
| Doesn't always work | Always finds optimal |

### Common Greedy Problems
1. Activity Selection / Interval Scheduling
2. Huffman Coding
3. Minimum Spanning Tree (Prim's, Kruskal's)
4. Dijkstra's Shortest Path
5. Fractional Knapsack
6. Jump Game problems
      `,
      code: `// Proving Greedy Works: Exchange Argument
// 
// General Strategy:
// 1. Assume optimal solution OPT that differs from greedy solution GR
// 2. Find first place they differ
// 3. Show we can modify OPT to match GR without making it worse
// 4. Repeat until OPT = GR

// Example: Activity Selection
// Greedy: Always pick activity with earliest end time
// 
// Proof sketch:
// - Let A = {a1, a2, ...} be greedy solution
// - Let O = {o1, o2, ...} be optimal solution
// - If a1 ≠ o1, we can replace o1 with a1 (a1 ends earlier)
//   This is still valid and same size
// - Repeat for remaining activities

// When Greedy Fails
// Example: Coin Change with coins [1, 3, 4], amount = 6
// Greedy: 4 + 1 + 1 = 3 coins
// Optimal: 3 + 3 = 2 coins
// 
// Greedy fails because there's no greedy choice property`,
    },
    {
      id: "interval-problems",
      title: "Interval Problems",
      type: "theory",
      content: `
## Interval Problems Pattern

### Problem Types
1. **Activity Selection**: Max non-overlapping intervals
2. **Meeting Rooms**: Min rooms needed
3. **Merge Intervals**: Combine overlapping intervals
4. **Insert Interval**: Insert and merge

### Key Strategies
1. **Sort by end time**: For maximizing activities
2. **Sort by start time**: For merging, checking overlaps
3. **Two pointers**: For comparing intervals
4. **Min Heap**: For meeting rooms (track end times)
      `,
      code: `// Activity Selection - Max non-overlapping intervals
// Sort by end time, greedily pick non-overlapping
function maxActivities(intervals) {
    if (intervals.length === 0) return 0;
    
    // Sort by end time
    intervals.sort((a, b) => a[1] - b[1]);
    
    let count = 1;
    let lastEnd = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] >= lastEnd) {
            count++;
            lastEnd = intervals[i][1];
        }
    }
    
    return count;
}

// Meeting Rooms II - Min rooms needed (LeetCode #253)
function minMeetingRooms(intervals) {
    const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
    const ends = intervals.map(i => i[1]).sort((a, b) => a - b);
    
    let rooms = 0;
    let endPtr = 0;
    
    for (const start of starts) {
        if (start < ends[endPtr]) {
            rooms++;
        } else {
            endPtr++;
        }
    }
    
    return rooms;
}

// Alternative: Using Min Heap
function minMeetingRoomsHeap(intervals) {
    if (intervals.length === 0) return 0;
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    const endTimes = [intervals[0][1]]; // Min heap of end times
    
    for (let i = 1; i < intervals.length; i++) {
        // If current meeting starts after earliest ending meeting
        if (intervals[i][0] >= Math.min(...endTimes)) {
            // Reuse that room (remove its end time)
            endTimes.splice(endTimes.indexOf(Math.min(...endTimes)), 1);
        }
        // Add current meeting's end time
        endTimes.push(intervals[i][1]);
    }
    
    return endTimes.length;
}

// Merge Intervals (LeetCode #56)
function merge(intervals) {
    if (intervals.length <= 1) return intervals;
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    const result = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const last = result[result.length - 1];
        const curr = intervals[i];
        
        if (curr[0] <= last[1]) {
            // Overlap - merge
            last[1] = Math.max(last[1], curr[1]);
        } else {
            // No overlap - add new interval
            result.push(curr);
        }
    }
    
    return result;
}

// Insert Interval (LeetCode #57)
function insert(intervals, newInterval) {
    const result = [];
    let i = 0;
    
    // Add all intervals before newInterval
    while (i < intervals.length && intervals[i][1] < newInterval[0]) {
        result.push(intervals[i]);
        i++;
    }
    
    // Merge overlapping intervals
    while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    result.push(newInterval);
    
    // Add remaining intervals
    while (i < intervals.length) {
        result.push(intervals[i]);
        i++;
    }
    
    return result;
}`,
    },
    // ============== PROBLEM SECTIONS ==============
    {
      id: "problem-jump-game",
      title: "Jump Game",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
      leetcode: "https://leetcode.com/problems/jump-game/",
      content: `
## LeetCode #55: Jump Game

Given array nums, each element is max jump length. Determine if you can reach the last index.

### Example
\`\`\`
Input: nums = [2,3,1,1,4]
Output: true (Jump 1→2→4)

Input: nums = [3,2,1,0,4]
Output: false (Stuck at index 3)
\`\`\`

### Key Insight
Track the farthest reachable index. If current index is beyond reachable, return false.
      `,
      code: `// Greedy Solution - O(n)
function canJump(nums) {
    let maxReach = 0;
    
    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
    }
    
    return true;
}

// Dry Run: [2, 3, 1, 1, 4]
// i=0: maxReach = max(0, 0+2) = 2
// i=1: maxReach = max(2, 1+3) = 4
// i=2: maxReach = max(4, 2+1) = 4
// i=3: maxReach = max(4, 3+1) = 4
// i=4: i <= maxReach, done → true

// Dry Run: [3, 2, 1, 0, 4]
// i=0: maxReach = 3
// i=1: maxReach = 3
// i=2: maxReach = 3
// i=3: maxReach = 3
// i=4: i=4 > maxReach=3 → false

// Jump Game II (LeetCode #45) - Min jumps to reach end
function jump(nums) {
    let jumps = 0;
    let currentEnd = 0;
    let farthest = 0;
    
    // Don't need to check last element
    for (let i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        
        if (i === currentEnd) {
            jumps++;
            currentEnd = farthest;
            
            if (currentEnd >= nums.length - 1) break;
        }
    }
    
    return jumps;
}

// Dry Run: [2, 3, 1, 1, 4]
// i=0: farthest=2, i===currentEnd(0) → jumps=1, currentEnd=2
// i=1: farthest=4, i!==currentEnd
// i=2: farthest=4, i===currentEnd(2) → jumps=2, currentEnd=4
// currentEnd >= 4, break
// Return 2`,
    },
    {
      id: "problem-gas-station",
      title: "Gas Station",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Google", "Microsoft", "Facebook", "Bloomberg"],
      leetcode: "https://leetcode.com/problems/gas-station/",
      content: `
## LeetCode #134: Gas Station

There are n gas stations. gas[i] = gas at station i, cost[i] = cost to travel to next station.
Find starting station to complete circuit, or -1 if impossible.

### Key Insight
1. If total gas >= total cost, solution exists
2. If we can't reach station j from station i, start from j+1
      `,
      code: `function canCompleteCircuit(gas, cost) {
    let totalTank = 0;
    let currentTank = 0;
    let startStation = 0;
    
    for (let i = 0; i < gas.length; i++) {
        const net = gas[i] - cost[i];
        totalTank += net;
        currentTank += net;
        
        // Can't reach next station
        if (currentTank < 0) {
            startStation = i + 1;
            currentTank = 0;
        }
    }
    
    return totalTank >= 0 ? startStation : -1;
}

// Dry Run: gas = [1,2,3,4,5], cost = [3,4,5,1,2]
// 
// i=0: net=1-3=-2, total=-2, current=-2 < 0 → start=1, current=0
// i=1: net=2-4=-2, total=-4, current=-2 < 0 → start=2, current=0
// i=2: net=3-5=-2, total=-6, current=-2 < 0 → start=3, current=0
// i=3: net=4-1=3, total=-3, current=3
// i=4: net=5-2=3, total=0, current=6
// 
// totalTank=0 >= 0 → return start=3

// Why this works:
// If totalTank >= 0, there's enough gas overall.
// If we can't reach j from i, we also can't reach j from any station between i and j.
// So we try starting from j+1.`,
    },
    {
      id: "problem-task-scheduler-greedy",
      title: "Task Scheduler",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Facebook", "Microsoft", "Google", "Bloomberg"],
      leetcode: "https://leetcode.com/problems/task-scheduler/",
      content: `
## LeetCode #621: Task Scheduler (Greedy Approach)

Given tasks and cooldown n, find minimum intervals to complete all tasks.

### Math Approach
Focus on most frequent task - it determines minimum time.
(maxFreq - 1) × (n + 1) + countOfMaxFreqTasks

### Example
\`\`\`
tasks = [A,A,A,B,B,B], n = 2
Max freq = 3 (both A and B)
Time = (3-1) × (2+1) + 2 = 8
A _ _ A _ _ A B
A B _ A B _ A B
\`\`\`
      `,
      code: `function leastInterval(tasks, n) {
    // Count frequencies
    const freq = new Array(26).fill(0);
    let maxFreq = 0;
    
    for (const task of tasks) {
        const idx = task.charCodeAt(0) - 65;
        freq[idx]++;
        maxFreq = Math.max(maxFreq, freq[idx]);
    }
    
    // Count tasks with max frequency
    let maxCount = 0;
    for (const f of freq) {
        if (f === maxFreq) maxCount++;
    }
    
    // Calculate minimum time
    // (maxFreq - 1) chunks of (n + 1) slots each
    // Plus final chunk with maxCount tasks
    const minTime = (maxFreq - 1) * (n + 1) + maxCount;
    
    // Result can't be less than total number of tasks
    return Math.max(minTime, tasks.length);
}

// Visualization for tasks = [A,A,A,B,B,B], n = 2:
// 
// Without considering n:
// A A A B B B → 6 intervals
// 
// With n = 2 (cooldown between same tasks):
// A B idle A B idle A B
// 1 2  3   4 5  6   7 8
// 
// Formula breakdown:
// maxFreq = 3 (A appears 3 times)
// We need (3-1) = 2 gaps between A's
// Each gap has (n+1) = 3 slots: A _ _ 
// After gaps: A _ _ A _ _ A (7 slots so far)
// Add remaining tasks with maxFreq: A B _ A B _ A B (8 slots)

// Edge case: many different tasks
// tasks = [A,A,A,B,B,B,C,C,C,D,D,E], n = 2
// minTime = (3-1) * 3 + 3 = 9
// But tasks.length = 12
// Return max(9, 12) = 12 (no idle time needed!)

// Why the formula works:
// The most frequent task creates "frames" of size (n+1)
// Other tasks fill in the gaps
// If we have enough tasks, no idle time needed`,
    },
    {
      id: "problem-non-overlapping-intervals",
      title: "Non-overlapping Intervals",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Facebook", "Microsoft", "Google", "Bloomberg"],
      leetcode: "https://leetcode.com/problems/non-overlapping-intervals/",
      content: `
## LeetCode #435: Non-overlapping Intervals

Given an array of intervals, return minimum number of intervals to remove to make the rest non-overlapping.

### Key Insight
This is equivalent to: Find maximum non-overlapping intervals, then subtract from total.
Sort by end time, greedily keep intervals that don't overlap.
      `,
      code: `function eraseOverlapIntervals(intervals) {
    if (intervals.length <= 1) return 0;
    
    // Sort by end time
    intervals.sort((a, b) => a[1] - b[1]);
    
    let kept = 1;
    let prevEnd = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        // No overlap - keep this interval
        if (intervals[i][0] >= prevEnd) {
            kept++;
            prevEnd = intervals[i][1];
        }
        // Overlap - skip (already sorted by end, so keeping prev is better)
    }
    
    return intervals.length - kept;
}

// Dry Run: [[1,2],[2,3],[3,4],[1,3]]
// Sorted by end: [[1,2],[2,3],[1,3],[3,4]]
// 
// i=0: kept=1, prevEnd=2
// i=1: [2,3], start=2 >= prevEnd=2 → kept=2, prevEnd=3
// i=2: [1,3], start=1 < prevEnd=3 → skip (overlap)
// i=3: [3,4], start=3 >= prevEnd=3 → kept=3, prevEnd=4
// 
// Return 4 - 3 = 1

// Why sort by end time?
// When intervals overlap, we want to keep the one that ends earliest
// This leaves more room for future intervals
// 
// Example: [1,5] vs [2,3] both overlap with [1,2]
// Keep [1,2] and [2,3] (both end early) 
// Discard [1,5] (ends late, blocks more)

// Alternative: Sort by start time
function eraseOverlapIntervalsAlt(intervals) {
    if (intervals.length <= 1) return 0;
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    let removed = 0;
    let prevEnd = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < prevEnd) {
            // Overlap - remove the one ending later
            removed++;
            prevEnd = Math.min(prevEnd, intervals[i][1]);
        } else {
            prevEnd = intervals[i][1];
        }
    }
    
    return removed;
}`,
    },
    {
      id: "problem-partition-labels",
      title: "Partition Labels",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Facebook", "Google", "Microsoft", "Adobe"],
      leetcode: "https://leetcode.com/problems/partition-labels/",
      content: `
## LeetCode #763: Partition Labels

Partition string s so each letter appears in at most one part. Return a list of integers representing the size of these parts.

### Example
\`\`\`
Input: s = "ababcbacadefegdehijhklij"
Output: [9,7,8]
Explanation: "ababcbaca", "defegde", "hijhklij"
\`\`\`

### Key Insight
For each character, find its last occurrence. Extend partition until we've included all last occurrences.
      `,
      code: `function partitionLabels(s) {
    // Find last occurrence of each character
    const lastIndex = {};
    for (let i = 0; i < s.length; i++) {
        lastIndex[s[i]] = i;
    }
    
    const result = [];
    let partitionEnd = 0;
    let partitionStart = 0;
    
    for (let i = 0; i < s.length; i++) {
        // Extend partition to include all occurrences of current char
        partitionEnd = Math.max(partitionEnd, lastIndex[s[i]]);
        
        // If we've reached the end of current partition
        if (i === partitionEnd) {
            result.push(partitionEnd - partitionStart + 1);
            partitionStart = i + 1;
        }
    }
    
    return result;
}

// Dry Run: "ababcbacadefegdehijhklij"
// Last indices: a=8, b=5, c=7, d=14, e=15, f=11, g=13, h=19, i=22, j=23, k=20, l=21
//
// i=0 'a': end = max(0, 8) = 8
// i=1 'b': end = max(8, 5) = 8
// i=2 'a': end = 8
// i=3 'b': end = 8
// i=4 'c': end = max(8, 7) = 8
// i=5 'b': end = 8
// i=6 'a': end = 8
// i=7 'c': end = 8
// i=8 'a': end = 8, i === end → result = [9], start = 9
//
// i=9 'd': end = max(0, 14) = 14
// i=10 'e': end = max(14, 15) = 15
// i=11 'f': end = 15
// i=12 'e': end = 15
// i=13 'g': end = 15
// i=14 'd': end = 15
// i=15 'e': end = 15, i === end → result = [9, 7], start = 16
//
// Continue... final result = [9, 7, 8]`,
    },
    {
      id: "problem-boats-to-save",
      title: "Boats to Save People",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Google", "Microsoft", "Facebook", "Airbnb"],
      leetcode: "https://leetcode.com/problems/boats-to-save-people/",
      content: `
## LeetCode #881: Boats to Save People

Each boat carries at most 2 people with total weight <= limit.
Return minimum number of boats to carry everyone.

### Key Insight
Two pointers: Try to pair heaviest with lightest. If they don't fit together, heaviest goes alone.
      `,
      code: `function numRescueBoats(people, limit) {
    people.sort((a, b) => a - b);
    
    let boats = 0;
    let light = 0;
    let heavy = people.length - 1;
    
    while (light <= heavy) {
        // Can we fit lightest with heaviest?
        if (people[light] + people[heavy] <= limit) {
            light++;
        }
        // Heaviest always gets on a boat
        heavy--;
        boats++;
    }
    
    return boats;
}

// Dry Run: people = [3, 2, 2, 1], limit = 3
// Sorted: [1, 2, 2, 3]
// 
// light=0, heavy=3: 1+3=4 > 3, heavy goes alone → boats=1, heavy=2
// light=0, heavy=2: 1+2=3 <= 3, both go → boats=2, light=1, heavy=1
// light=1, heavy=1: 2+2=4 > 3, heavy goes alone → boats=3, heavy=0
// light > heavy, done
// Return 3

// Why greedy works:
// We want to maximize pairings to minimize boats
// Pairing heaviest with lightest gives best chance to pair
// If heaviest can't pair with lightest, heaviest can't pair with anyone

// Alternative: If each boat could carry more than 2 people,
// this becomes bin packing (NP-hard) - greedy won't work optimally`,
    },
    // ============== ADVANCED GREEDY TECHNIQUES ==============
    {
      id: "greedy-proof-techniques",
      title: "Proving Greedy Algorithms Correct",
      type: "theory",
      content: `
## Greedy Proof Techniques: Interview Mastery 🎓

<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 24px; margin: 20px 0;">
  <h3 style="color: #4ade80; margin: 0 0 20px 0; text-align: center;">🎯 Three Ways to Prove Greedy Works</h3>
  
  <div style="display: grid; gap: 12px;">
    <div style="background: #0f3460; padding: 16px; border-radius: 12px;">
      <h4 style="color: #4ade80; margin: 0 0 8px 0;">1. Exchange Argument</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">
        Show that swapping any non-greedy choice with greedy choice doesn't make solution worse.
      </p>
    </div>
    
    <div style="background: #0f3460; padding: 16px; border-radius: 12px;">
      <h4 style="color: #60a5fa; margin: 0 0 8px 0;">2. Greedy Stays Ahead</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">
        Show that at every step, greedy is at least as good as any other solution.
      </p>
    </div>
    
    <div style="background: #0f3460; padding: 16px; border-radius: 12px;">
      <h4 style="color: #f472b6; margin: 0 0 8px 0;">3. Contradiction</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">
        Assume greedy isn't optimal, show this leads to contradiction.
      </p>
    </div>
  </div>
</div>

### Exchange Argument Template

For any optimal solution OPT that differs from greedy GREEDY:
1. Find first difference between OPT and GREEDY
2. Show we can swap to match GREEDY without making solution worse
3. Repeat until OPT = GREEDY
4. Therefore, GREEDY is optimal

### When Greedy Works

| ✓ Works | ✗ Doesn't Work |
|---------|----------------|
| Activity selection | 0/1 Knapsack |
| Huffman coding | Traveling salesman |
| Fractional knapsack | Subset sum |
| Dijkstra (non-neg) | Longest path (general) |
      `,
      code: `// ═══════════════════════════════════════════════════════════
// EXCHANGE ARGUMENT EXAMPLE: ACTIVITY SELECTION
// ═══════════════════════════════════════════════════════════

/*
CLAIM: Selecting activity with earliest end time is optimal.

PROOF (Exchange Argument):
1. Let OPT be any optimal solution
2. Let greedy pick activity A (earliest end time)
3. Let OPT pick activity B first (where B ≠ A)

Since A ends earliest: end(A) ≤ end(B)

If we replace B with A in OPT:
- A ends earlier, so it doesn't conflict with more activities
- We can still pick at least as many activities after A
- Therefore, OPT with A is at least as good as OPT with B

By induction, greedy solution is optimal. □
*/

function activitySelection(activities) {
    // Sort by end time
    activities.sort((a, b) => a[1] - b[1]);
    
    const selected = [activities[0]];
    let lastEnd = activities[0][1];
    
    for (let i = 1; i < activities.length; i++) {
        if (activities[i][0] >= lastEnd) {
            selected.push(activities[i]);
            lastEnd = activities[i][1];
        }
    }
    
    return selected;
}


// ═══════════════════════════════════════════════════════════
// GREEDY STAYS AHEAD EXAMPLE: TASK SCHEDULING
// ═══════════════════════════════════════════════════════════

/*
PROBLEM: Minimize total lateness (deadline - finish time)
GREEDY: Process in deadline order (Earliest Deadline First)

PROOF (Greedy Stays Ahead):
Let d₁ ≤ d₂ ≤ ... ≤ dₙ be deadlines in order.

For any schedule S, define:
- fᵢ = finish time of job i in S
- Lᵢ = max(0, fᵢ - dᵢ) = lateness of job i

In EDF, job i finishes at f*ᵢ = sum of first i processing times.

KEY INSIGHT: Any inversion (i before j where dᵢ > dⱼ) can be 
fixed without increasing max lateness.

By removing all inversions, we get EDF schedule. □
*/

function minimizeLateness(jobs) {
    // jobs = [[processingTime, deadline], ...]
    // Sort by deadline
    jobs.sort((a, b) => a[1] - b[1]);
    
    let currentTime = 0;
    let maxLateness = 0;
    
    for (const [processTime, deadline] of jobs) {
        currentTime += processTime;
        const lateness = Math.max(0, currentTime - deadline);
        maxLateness = Math.max(maxLateness, lateness);
    }
    
    return maxLateness;
}


// ═══════════════════════════════════════════════════════════
// WHEN GREEDY FAILS: COUNTEREXAMPLE
// ═══════════════════════════════════════════════════════════

/*
PROBLEM: 0/1 Knapsack
GREEDY: Take items with best value/weight ratio

COUNTEREXAMPLE:
Items: [(value=60, weight=10), (value=100, weight=20), (value=120, weight=30)]
Capacity: 50

Greedy by ratio:
- Item 0: ratio = 6.0 ✓ (total weight=10, value=60)
- Item 1: ratio = 5.0 ✓ (total weight=30, value=160)
- Item 2: ratio = 4.0 ✗ (would exceed capacity)
Greedy answer: 160

Optimal:
- Take items 1 and 2: weight=50, value=220

Greedy fails because we can't take fractions!
*/`,
    },
    {
      id: "greedy-scheduling-patterns",
      title: "Scheduling Problems: Greedy Patterns",
      type: "theory",
      content: `
## Scheduling Problems: Interview Essential 📅

<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 24px; margin: 20px 0;">
  <h3 style="color: #4ade80; margin: 0 0 20px 0; text-align: center;">🎯 Scheduling Problem Types</h3>
  
  <table style="width: 100%; border-collapse: collapse; color: #e2e8f0; font-size: 12px;">
    <thead>
      <tr style="border-bottom: 2px solid #4ade80;">
        <th style="text-align: left; padding: 10px; color: #4ade80;">Problem</th>
        <th style="text-align: left; padding: 10px; color: #4ade80;">Goal</th>
        <th style="text-align: left; padding: 10px; color: #4ade80;">Sort By</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 10px;">Max activities</td>
        <td style="padding: 10px; color: #60a5fa;">Most non-overlapping</td>
        <td style="padding: 10px;">End time ↑</td>
      </tr>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 10px;">Min rooms</td>
        <td style="padding: 10px; color: #60a5fa;">Fewest parallel resources</td>
        <td style="padding: 10px;">Start time ↑</td>
      </tr>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 10px;">Min lateness</td>
        <td style="padding: 10px; color: #60a5fa;">Meet deadlines</td>
        <td style="padding: 10px;">Deadline ↑</td>
      </tr>
      <tr>
        <td style="padding: 10px;">Max profit</td>
        <td style="padding: 10px; color: #60a5fa;">Best weighted selection</td>
        <td style="padding: 10px;">Deadline + heap</td>
      </tr>
    </tbody>
  </table>
</div>
      `,
      code: `// ═══════════════════════════════════════════════════════════
// MEETING ROOMS II - MINIMUM ROOMS NEEDED
// ═══════════════════════════════════════════════════════════

function minMeetingRooms(intervals) {
    const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
    const ends = intervals.map(i => i[1]).sort((a, b) => a - b);
    
    let rooms = 0, maxRooms = 0;
    let s = 0, e = 0;
    
    while (s < intervals.length) {
        if (starts[s] < ends[e]) {
            rooms++;  // New meeting starts before current ends
            s++;
        } else {
            rooms--;  // Meeting ends, free up room
            e++;
        }
        maxRooms = Math.max(maxRooms, rooms);
    }
    
    return maxRooms;
}

// Alternative: Heap approach
function minMeetingRoomsHeap(intervals) {
    if (!intervals.length) return 0;
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    const endTimes = [intervals[0][1]];  // Min-heap of end times
    
    for (let i = 1; i < intervals.length; i++) {
        // If earliest ending room is free, reuse it
        if (intervals[i][0] >= Math.min(...endTimes)) {
            endTimes.splice(endTimes.indexOf(Math.min(...endTimes)), 1);
        }
        endTimes.push(intervals[i][1]);
    }
    
    return endTimes.length;
}


// ═══════════════════════════════════════════════════════════
// JOB SCHEDULING WITH DEADLINES AND PROFITS
// ═══════════════════════════════════════════════════════════

function jobScheduling(jobs) {
    // jobs = [[profit, deadline], ...]
    // Each job takes 1 unit of time
    
    // Sort by profit descending
    jobs.sort((a, b) => b[0] - a[0]);
    
    const n = jobs.length;
    const maxDeadline = Math.max(...jobs.map(j => j[1]));
    const slots = new Array(maxDeadline + 1).fill(false);
    
    let totalProfit = 0;
    let jobsDone = 0;
    
    for (const [profit, deadline] of jobs) {
        // Find latest available slot <= deadline
        for (let slot = deadline; slot > 0; slot--) {
            if (!slots[slot]) {
                slots[slot] = true;
                totalProfit += profit;
                jobsDone++;
                break;
            }
        }
    }
    
    return { jobs: jobsDone, profit: totalProfit };
}


// ═══════════════════════════════════════════════════════════
// NON-OVERLAPPING INTERVALS (LeetCode #435)
// ═══════════════════════════════════════════════════════════

function eraseOverlapIntervals(intervals) {
    if (intervals.length === 0) return 0;
    
    // Sort by end time
    intervals.sort((a, b) => a[1] - b[1]);
    
    let nonOverlapping = 1;
    let lastEnd = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] >= lastEnd) {
            nonOverlapping++;
            lastEnd = intervals[i][1];
        }
    }
    
    // Remove = total - max non-overlapping
    return intervals.length - nonOverlapping;
}


// ═══════════════════════════════════════════════════════════
// INTERVIEW CHEAT SHEET
// ═══════════════════════════════════════════════════════════

/*
GREEDY PATTERN RECOGNITION:

1. "Maximum number of..." + non-overlapping → Sort by end time
2. "Minimum resources for..." + overlapping → Sweep line or heap
3. "Meet all deadlines" → Sort by deadline (EDF)
4. "Maximum profit with constraints" → Sort by profit + feasibility check

SORTING KEY SELECTION:
- End time: Maximize count of selections
- Start time: Process in order / sweep line
- Deadline: Minimize lateness
- Profit/Value: Maximize gain (with feasibility)

PROOF TECHNIQUES:
1. Exchange argument: Swap non-greedy → greedy, show not worse
2. Stays ahead: Greedy ≥ OPT at every step
3. Contradiction: Assume greedy fails → find contradiction

COMMON MISTAKES:
- Assuming greedy works without proof
- Wrong sorting key
- Not handling ties correctly
*/`,
    },
  ],
};
