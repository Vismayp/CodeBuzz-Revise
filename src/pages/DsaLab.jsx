import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const labs = {
  pointers: {
    label: "Two pointers",
    title: "Two Sum in a sorted array",
    meta: "target = 15",
    takeaway: "Sorted order makes each pointer move safe: it removes a whole group of impossible pairs.",
    invariant: "If a solution remains, it lies between left and right.",
    steps: [
      { values: [1, 2, 4, 7, 11, 15], left: 0, right: 5, note: "1 + 15 = 16 is too large. Any pair using 15 with a later left value is also too large, so move right." },
      { values: [1, 2, 4, 7, 11, 15], left: 0, right: 4, note: "1 + 11 = 12 is too small. Pairing 1 with any smaller right value cannot reach 15, so move left." },
      { values: [1, 2, 4, 7, 11, 15], left: 1, right: 4, note: "2 + 11 = 13 is still too small. Move left again." },
      { values: [1, 2, 4, 7, 11, 15], left: 2, right: 4, found: true, note: "4 + 11 = 15. The target pair is found." },
    ],
  },
  binary: {
    label: "Binary search",
    title: "Find 23 by halving the interval",
    meta: "target = 23",
    takeaway: "Binary search is justified by a monotonic order, not by memorizing midpoint code.",
    invariant: "If 23 exists, its index is inside the highlighted interval.",
    steps: [
      { values: [3, 7, 11, 15, 19, 23, 27, 31], left: 0, right: 7, mid: 3, note: "Middle value 15 is smaller than 23. Sorted order eliminates indices 0 through 3." },
      { values: [3, 7, 11, 15, 19, 23, 27, 31], left: 4, right: 7, mid: 5, found: true, note: "Middle value 23 matches the target. Return index 5." },
    ],
  },
  sorting: {
    label: "Insertion sort",
    title: "Grow a sorted prefix",
    meta: "insert key = 3",
    takeaway: "Insertion sort is O(n²) in general but nearly linear when only a few values are out of place.",
    invariant: "Everything left of the key position is already sorted.",
    steps: [
      { values: [2, 5, 7, 3, 9], sortedEnd: 2, active: 3, note: "The prefix [2, 5, 7] is sorted. Save key 3 before shifting values." },
      { values: [2, 5, 7, 7, 9], sortedEnd: 2, active: 2, moving: [2, 3], note: "7 is larger than 3, so shift 7 one place right." },
      { values: [2, 5, 5, 7, 9], sortedEnd: 1, active: 1, moving: [1, 2], note: "5 is also larger than 3, so shift 5 right." },
      { values: [2, 3, 5, 7, 9], sortedEnd: 3, active: 1, found: true, note: "Insert 3 after 2. The sorted prefix has grown by one item." },
    ],
  },
  bfs: {
    label: "BFS",
    title: "Explore a graph level by level",
    meta: "unweighted shortest paths",
    takeaway: "Because a queue is first-in, first-out, BFS discovers every node at its minimum number of edges from the source.",
    invariant: "Queued nodes have known shortest distances, in nondecreasing order.",
    steps: [
      { nodes: ["A", "B", "C", "D", "E"], queue: ["A"], visited: ["A"], active: "A", levels: { A: 0 }, note: "Start at A: mark it visited with distance 0 and place it in the queue." },
      { nodes: ["A", "B", "C", "D", "E"], queue: ["B", "C"], visited: ["A", "B", "C"], active: "A", levels: { A: 0, B: 1, C: 1 }, note: "Remove A and discover B and C. Both are one edge from the start." },
      { nodes: ["A", "B", "C", "D", "E"], queue: ["C", "D"], visited: ["A", "B", "C", "D"], active: "B", levels: { A: 0, B: 1, C: 1, D: 2 }, note: "Remove B. D is new, so record distance 2 and enqueue it." },
      { nodes: ["A", "B", "C", "D", "E"], queue: ["D", "E"], visited: ["A", "B", "C", "D", "E"], active: "C", levels: { A: 0, B: 1, C: 1, D: 2, E: 2 }, found: true, note: "Remove C and discover E at distance 2. Every node now has its shortest level." },
    ],
  },
  dp: {
    label: "DP · 1D",
    title: "Build climbing-stairs states",
    meta: "ways(n) = ways(n-1) + ways(n-2)",
    takeaway: "DP becomes concrete when every table cell has a complete sentence definition.",
    invariant: "Before computing state i, the two smaller states it depends on are correct.",
    steps: [
      { values: [1, 1, null, null, null, null], active: 1, note: "Base states: there is one way to stand before the stairs and one way to reach step 1." },
      { values: [1, 1, 2, null, null, null], active: 2, parents: [0, 1], note: "Step 2 can be reached from step 1 or step 0: 1 + 1 = 2 ways." },
      { values: [1, 1, 2, 3, null, null], active: 3, parents: [1, 2], note: "Step 3 uses the two previous solved states: 1 + 2 = 3 ways." },
      { values: [1, 1, 2, 3, 5, null], active: 4, parents: [2, 3], note: "Step 4 has 2 + 3 = 5 ways." },
      { values: [1, 1, 2, 3, 5, 8], active: 5, parents: [3, 4], found: true, note: "Step 5 has 3 + 5 = 8 ways. Only the previous two values are needed, so space can be O(1)." },
    ],
  },
  dp_grid: {
    label: "DP · Grid",
    title: "Count paths around an obstacle",
    meta: "cell = top + left",
    takeaway: "A right-and-down grid is a DAG. Row-major order works because top and left dependencies are already solved.",
    invariant: "Every completed cell equals the number of valid paths from the start to that cell.",
    steps: [
      { matrix: [[1, null, null, null], [null, "×", null, null], [null, null, null, null]], active: [0, 0], dependencies: [], note: "The start has one empty path. The × cell is blocked and will always contribute zero." },
      { matrix: [[1, 1, 1, 1], [1, "×", null, null], [1, null, null, null]], active: [1, 0], dependencies: [[0, 0]], note: "Along an open boundary there is only one direction of arrival, so every reachable boundary cell has one path." },
      { matrix: [[1, 1, 1, 1], [1, "×", 1, 2], [1, 1, null, null]], active: [1, 3], dependencies: [[0, 3], [1, 2]], note: "At row 1, column 3: top contributes 1 and left contributes 1, giving 2 paths." },
      { matrix: [[1, 1, 1, 1], [1, "×", 1, 2], [1, 1, 2, 4]], active: [2, 3], dependencies: [[1, 3], [2, 2]], found: true, note: "The destination receives 2 paths from above and 2 from the left: 4 valid paths in total." },
    ],
  },
  dp_lcs: {
    label: "DP · LCS",
    title: "Align two sequence prefixes",
    meta: "A = ABC · B = AC",
    takeaway: "A two-sequence DP cell summarizes complete prefixes, so a mismatch can safely discard one final character.",
    invariant: "dp[i][j] is the LCS length of A[:i] and B[:j].",
    rowLabels: ["∅", "A", "B", "C"],
    colLabels: ["∅", "A", "C"],
    steps: [
      { matrix: [[0, 0, 0], [0, null, null], [0, null, null], [0, null, null]], active: [0, 0], dependencies: [], note: "Any sequence paired with an empty prefix has common-subsequence length 0." },
      { matrix: [[0, 0, 0], [0, 1, null], [0, null, null], [0, null, null]], active: [1, 1], dependencies: [[0, 0]], note: "A matches A, so take 1 plus the diagonal empty-prefix answer." },
      { matrix: [[0, 0, 0], [0, 1, 1], [0, 1, 1], [0, null, null]], active: [2, 2], dependencies: [[1, 2], [2, 1]], note: "B does not match C. Keep the better of excluding B or excluding C: max(1, 1)." },
      { matrix: [[0, 0, 0], [0, 1, 1], [0, 1, 1], [0, 1, 2]], active: [3, 2], dependencies: [[2, 1]], found: true, note: "C matches C, so add one to the diagonal answer. The LCS is AC with length 2." },
    ],
  },
  dp_knapsack: {
    label: "DP · Knapsack",
    title: "Update 0/1 capacity backward",
    meta: "item weight 3 · value 4",
    takeaway: "Backward capacity order preserves the previous item layer, preventing one 0/1 item from being reused in the same iteration.",
    invariant: "Before capacity c is updated, dp[c-3] still excludes the current item.",
    steps: [
      { values: [0, 0, 3, 3, 3, 3, 3], active: 6, parents: [3], note: "Existing states came from earlier items. Start at capacity 6 and compare skip=3 with take=dp[3]+4=7." },
      { values: [0, 0, 3, 3, 3, 3, 7], active: 5, parents: [2], note: "Move backward to capacity 5. Read dp[2]=3 from the previous layer, producing value 7." },
      { values: [0, 0, 3, 3, 3, 7, 7], active: 4, parents: [1], note: "At capacity 4, take gives dp[1]+4=4, which beats the old value 3." },
      { values: [0, 0, 3, 4, 4, 7, 7], active: 3, parents: [0], found: true, note: "Capacity 3 becomes 4. Stop at the item weight. Forward order would incorrectly reuse this item." },
    ],
  },
  greedy_interval: {
    label: "Greedy · Intervals",
    title: "Keep the earliest finishing activity",
    meta: "maximize non-overlapping count",
    takeaway: "Earliest finish is safe because it leaves at least as much room for every possible future activity.",
    invariant: "The selected prefix can be extended to an optimal schedule, and lastEnd is as early as possible.",
    steps: [
      { intervals: [[1, 3], [2, 5], [4, 6], [6, 8], [5, 9]], active: 0, chosen: [], rejected: [], note: "Sort by end time. Activity [1,3] finishes first, so inspect it before every later-finishing candidate." },
      { intervals: [[1, 3], [2, 5], [4, 6], [6, 8], [5, 9]], active: 1, chosen: [0], rejected: [], note: "Choose [1,3]. The next activity [2,5] overlaps because 2 < lastEnd 3, so it cannot follow the chosen prefix." },
      { intervals: [[1, 3], [2, 5], [4, 6], [6, 8], [5, 9]], active: 2, chosen: [0], rejected: [1], note: "Activity [4,6] starts after lastEnd 3. Choose it and move the frontier to 6." },
      { intervals: [[1, 3], [2, 5], [4, 6], [6, 8], [5, 9]], active: 4, chosen: [0, 2, 3], rejected: [1, 4], found: true, note: "The final schedule is [1,3], [4,6], [6,8]. Three activities is optimal; rejected [5,9] overlaps the last choice." },
    ],
  },
  greedy_jump: {
    label: "Greedy · Reach",
    title: "Jump Game: maintain the farthest frontier",
    meta: "values = maximum jump lengths",
    takeaway: "The exact path is unnecessary. Every index up to farthest is reachable, so only the best frontier must be retained.",
    invariant: "Every index through farthest can be reached from the processed prefix.",
    steps: [
      { values: [2, 3, 1, 1, 4], active: 0, reach: 2, note: "From index 0, jump length 2 makes every index through 2 reachable." },
      { values: [2, 3, 1, 1, 4], active: 1, reach: 4, note: "Index 1 is reachable. Its frontier is 1 + 3 = 4, so update farthest from 2 to 4." },
      { values: [2, 3, 1, 1, 4], active: 2, reach: 4, note: "Index 2 adds no farther reach: 2 + 1 = 3. Keep the existing frontier 4." },
      { values: [2, 3, 1, 1, 4], active: 4, reach: 4, found: true, note: "The last index lies inside the reachable frontier. Return true without constructing a particular jump path." },
    ],
  },
  greedy_huffman: {
    label: "Greedy · Huffman",
    title: "Merge the two smallest frequencies",
    meta: "optimal prefix-code merge cost",
    takeaway: "Low-frequency symbols can safely be deepest siblings; merging the two smallest reduces the problem to a smaller instance.",
    invariant: "The heap represents roots of optimal partial prefix-code trees.",
    steps: [
      { values: [5, 9, 12, 13], active: 0, parents: [1], note: "The two smallest frequencies are 5 and 9. Any optimal tree can place them as deepest siblings." },
      { values: [12, 13, 14], active: 2, parents: [0, 1], note: "Merge 5 + 9 into a subtree of weight 14, then return it to the min-heap." },
      { values: [14, 25], active: 1, parents: [0], note: "Merge 12 + 13 = 25. The remaining roots have weights 14 and 25." },
      { values: [39], active: 0, parents: [], found: true, note: "Merge 14 + 25 = 39. One root remains, completing the optimal prefix tree." },
    ],
  },
  tree_traversal: {
    label: "Tree · Postorder",
    title: "Compute subtree heights bottom-up",
    meta: "left → right → node",
    takeaway: "Postorder is the natural order whenever a parent must wait for summaries from both children.",
    invariant: "Every completed node has a correct height computed from already completed children.",
    steps: [
      { network: "tree", nodes: [{id:"A",x:300,y:40},{id:"B",x:170,y:120},{id:"C",x:430,y:120},{id:"D",x:100,y:210},{id:"E",x:240,y:210},{id:"F",x:430,y:210}], edges: [["A","B"],["A","C"],["B","D"],["B","E"],["C","F"]], active:"D", visited:[], values:{}, note:"Descend left until leaf D. A leaf's children are empty, so its height is 1." },
      { network: "tree", nodes: [{id:"A",x:300,y:40},{id:"B",x:170,y:120},{id:"C",x:430,y:120},{id:"D",x:100,y:210},{id:"E",x:240,y:210},{id:"F",x:430,y:210}], edges: [["A","B"],["A","C"],["B","D"],["B","E"],["C","F"]], active:"B", visited:["D","E"], values:{D:1,E:1}, note:"After D and E return height 1, node B combines them: 1 + max(1,1) = 2." },
      { network: "tree", nodes: [{id:"A",x:300,y:40},{id:"B",x:170,y:120},{id:"C",x:430,y:120},{id:"D",x:100,y:210},{id:"E",x:240,y:210},{id:"F",x:430,y:210}], edges: [["A","B"],["A","C"],["B","D"],["B","E"],["C","F"]], active:"C", visited:["D","E","B","F"], values:{D:1,E:1,B:2,F:1}, note:"The right subtree completes next. F returns 1, so C returns height 2." },
      { network: "tree", nodes: [{id:"A",x:300,y:40},{id:"B",x:170,y:120},{id:"C",x:430,y:120},{id:"D",x:100,y:210},{id:"E",x:240,y:210},{id:"F",x:430,y:210}], edges: [["A","B"],["A","C"],["B","D"],["B","E"],["C","F"]], active:"A", visited:["D","E","B","F","C","A"], values:{D:1,E:1,B:2,F:1,C:2,A:3}, found:true, note:"Both child heights are ready. Root A returns 1 + max(2,2) = 3." },
    ],
  },
  tree_diameter: {
    label: "Tree · Diameter",
    title: "Separate the upward return from the global path",
    meta: "global uses two branches · parent gets one",
    takeaway: "A completed path may join both children, but the value returned upward must remain a single non-forking branch.",
    invariant: "Each visited node has returned its longest downward branch; best stores the longest complete path seen.",
    steps: [
      { network:"tree",nodes:[{id:"A",x:300,y:40},{id:"B",x:170,y:120},{id:"C",x:430,y:120},{id:"D",x:80,y:210},{id:"E",x:240,y:210},{id:"F",x:500,y:210}],edges:[["A","B"],["A","C"],["B","D"],["B","E"],["C","F"]],active:"B",visited:["D","E"],values:{D:1,E:1},highlightEdges:[["B","D"],["B","E"]],note:"At B, the complete candidate joins D-B-E with 2 edges. B can return only one branch of length 1 upward." },
      { network:"tree",nodes:[{id:"A",x:300,y:40},{id:"B",x:170,y:120},{id:"C",x:430,y:120},{id:"D",x:80,y:210},{id:"E",x:240,y:210},{id:"F",x:500,y:210}],edges:[["A","B"],["A","C"],["B","D"],["B","E"],["C","F"]],active:"C",visited:["D","E","B","F"],values:{B:2,F:1},highlightEdges:[["C","F"]],note:"At C, the best downward branch contains C-F. The global diameter remains 2 edges so far." },
      { network:"tree",nodes:[{id:"A",x:300,y:40},{id:"B",x:170,y:120},{id:"C",x:430,y:120},{id:"D",x:80,y:210},{id:"E",x:240,y:210},{id:"F",x:500,y:210}],edges:[["A","B"],["A","C"],["B","D"],["B","E"],["C","F"]],active:"A",visited:["D","E","B","F","C"],values:{B:2,C:2},highlightEdges:[["A","B"],["A","C"],["B","D"],["C","F"]],note:"At A, one downward branch from each side joins into D-B-A-C-F, a 4-edge candidate." },
      { network:"tree",nodes:[{id:"A",x:300,y:40},{id:"B",x:170,y:120},{id:"C",x:430,y:120},{id:"D",x:80,y:210},{id:"E",x:240,y:210},{id:"F",x:500,y:210}],edges:[["A","B"],["A","C"],["B","D"],["B","E"],["C","F"]],active:"A",visited:["A","B","C","D","E","F"],values:{A:3},highlightEdges:[["A","B"],["A","C"],["B","D"],["C","F"]],found:true,note:"The global diameter is 4 edges. A returns only a 3-node downward height to any imaginary parent." },
    ],
  },
  graph_topo: {
    label: "Graph · Topological",
    title: "Remove zero-indegree dependencies",
    meta: "Kahn's algorithm",
    takeaway: "A topological order exists only when every dependency can eventually be removed; leftover indegrees expose a cycle.",
    invariant: "Every queued node has no remaining prerequisite, and every output edge points forward in the order.",
    steps: [
      { network:"graph",nodes:[{id:"A",x:80,y:130},{id:"B",x:240,y:60},{id:"C",x:240,y:200},{id:"D",x:420,y:130},{id:"E",x:550,y:130}],edges:[["A","B"],["A","C"],["B","D"],["C","D"],["D","E"]],directed:true,active:"A",visited:[],values:{A:0,B:1,C:1,D:2,E:1},queue:["A"],note:"Only A has indegree 0, so it is the first safe task." },
      { network:"graph",nodes:[{id:"A",x:80,y:130},{id:"B",x:240,y:60},{id:"C",x:240,y:200},{id:"D",x:420,y:130},{id:"E",x:550,y:130}],edges:[["A","B"],["A","C"],["B","D"],["C","D"],["D","E"]],directed:true,active:"B",visited:["A"],values:{B:0,C:0,D:2,E:1},queue:["B","C"],note:"Removing A drops B and C to indegree 0. Either may appear next, so topological orders need not be unique." },
      { network:"graph",nodes:[{id:"A",x:80,y:130},{id:"B",x:240,y:60},{id:"C",x:240,y:200},{id:"D",x:420,y:130},{id:"E",x:550,y:130}],edges:[["A","B"],["A","C"],["B","D"],["C","D"],["D","E"]],directed:true,active:"D",visited:["A","B","C"],values:{D:0,E:1},queue:["D"],note:"D reaches indegree 0 only after both B and C are removed, preserving both prerequisites." },
      { network:"graph",nodes:[{id:"A",x:80,y:130},{id:"B",x:240,y:60},{id:"C",x:240,y:200},{id:"D",x:420,y:130},{id:"E",x:550,y:130}],edges:[["A","B"],["A","C"],["B","D"],["C","D"],["D","E"]],directed:true,active:"E",visited:["A","B","C","D","E"],values:{E:0},queue:[],found:true,note:"All five nodes were processed. One valid order is A, B, C, D, E." },
    ],
  },
  graph_dijkstra: {
    label: "Graph · Dijkstra",
    title: "Finalize the nearest unsettled node",
    meta: "nonnegative weighted edges",
    takeaway: "With nonnegative weights, no path through a farther unsettled node can improve the nearest tentative distance.",
    invariant: "Every settled node has its final shortest distance; tentative values are best discovered paths so far.",
    steps: [
      { network:"graph",nodes:[{id:"A",x:80,y:130},{id:"B",x:240,y:60},{id:"C",x:240,y:200},{id:"D",x:430,y:80},{id:"E",x:540,y:180}],edges:[["A","B",4],["A","C",1],["C","B",2],["B","D",1],["C","E",5],["D","E",3]],directed:true,active:"A",visited:[],values:{A:0,B:"∞",C:"∞",D:"∞",E:"∞"},note:"Start at A with distance 0. All other nodes are tentatively unreachable." },
      { network:"graph",nodes:[{id:"A",x:80,y:130},{id:"B",x:240,y:60},{id:"C",x:240,y:200},{id:"D",x:430,y:80},{id:"E",x:540,y:180}],edges:[["A","B",4],["A","C",1],["C","B",2],["B","D",1],["C","E",5],["D","E",3]],directed:true,active:"C",visited:["A"],values:{A:0,B:4,C:1,D:"∞",E:"∞"},highlightEdges:[["A","C"]],note:"Relax A's edges, then finalize C at distance 1 because it is the smallest unsettled value." },
      { network:"graph",nodes:[{id:"A",x:80,y:130},{id:"B",x:240,y:60},{id:"C",x:240,y:200},{id:"D",x:430,y:80},{id:"E",x:540,y:180}],edges:[["A","B",4],["A","C",1],["C","B",2],["B","D",1],["C","E",5],["D","E",3]],directed:true,active:"B",visited:["A","C"],values:{A:0,B:3,C:1,D:"∞",E:6},highlightEdges:[["A","C"],["C","B"]],note:"C improves B to 1+2=3 and E to 6. Finalize B next at distance 3." },
      { network:"graph",nodes:[{id:"A",x:80,y:130},{id:"B",x:240,y:60},{id:"C",x:240,y:200},{id:"D",x:430,y:80},{id:"E",x:540,y:180}],edges:[["A","B",4],["A","C",1],["C","B",2],["B","D",1],["C","E",5],["D","E",3]],directed:true,active:"E",visited:["A","C","B","D","E"],values:{A:0,B:3,C:1,D:4,E:6},highlightEdges:[["A","C"],["C","E"]],found:true,note:"D finalizes at 4. Its route to E costs 7, so E keeps distance 6 through C. All shortest distances are final." },
    ],
  },
  stack_brackets: {
    label: "Stack · Brackets",
    title: "Match nested obligations with a stack",
    meta: "input = ([{}])",
    takeaway: "A stack fits nested obligations because the most recently opened scope must close first.",
    invariant: "The stack contains exactly the closing brackets still expected after the processed prefix.",
    steps: [
      { structure:"stack", input:["(","[","{","}","]",")"], cursor:0, items:[")"], action:"push expected )", note:"Read (. It creates an obligation to see ) later, so push the expected closer." },
      { structure:"stack", input:["(","[","{","}","]",")"], cursor:2, items:[")","]","}"], action:"push expected }", note:"After ([{, the newest obligation is }. It must be satisfied before ] or )." },
      { structure:"stack", input:["(","[","{","}","]",")"], cursor:3, items:[")","]"], removed:"}", action:"match and pop }", note:"The current } equals the stack top, so the newest obligation is complete." },
      { structure:"stack", input:["(","[","{","}","]",")"], cursor:5, items:[], removed:")", action:"match and pop )", found:true, note:"The final ) matches and empties the stack. Every opening was closed in the required order." },
    ],
  },
  monotonic_stack: {
    label: "Stack · Monotonic",
    title: "Resolve warmer days when a larger value arrives",
    meta: "temperatures = 73, 74, 75, 71, 72",
    takeaway: "A monotonic stack keeps only unresolved candidates; every index is pushed and popped at most once.",
    invariant: "Stored indices increase while their temperatures are nonincreasing, and none has found a warmer day.",
    steps: [
      { structure:"stack", input:[73,74,75,71,72], cursor:0, items:["0:73"], answers:[0,0,0,0,0], action:"push day 0", note:"Day 0 has no warmer day yet, so store its index." },
      { structure:"stack", input:[73,74,75,71,72], cursor:1, items:["1:74"], answers:[1,0,0,0,0], removed:"0:73", action:"resolve day 0", note:"74 is warmer than 73. Pop day 0 and record distance 1, then push day 1." },
      { structure:"stack", input:[73,74,75,71,72], cursor:3, items:["2:75","3:71"], answers:[1,1,0,0,0], action:"71 waits below 75", note:"75 already resolved day 1. Day 3 is cooler, so it remains unresolved above day 2." },
      { structure:"stack", input:[73,74,75,71,72], cursor:4, items:["2:75","4:72"], answers:[1,1,0,1,0], removed:"3:71", action:"resolve day 3", found:true, note:"72 resolves day 3 after one day, but cannot resolve 75. The stack remains nonincreasing." },
    ],
  },
  monotonic_deque: {
    label: "Queue · Deque",
    title: "Maintain a sliding-window maximum",
    meta: "window size = 3",
    takeaway: "The deque removes expired candidates at the front and permanently dominated candidates at the back.",
    invariant: "Deque indices are live and increasing; their values strictly decrease from front to back.",
    steps: [
      { structure:"deque", input:[1,3,-1,-3,5], cursor:0, items:["0:1"], window:[0,0], action:"append index 0", note:"The first value is the only candidate and therefore the current maximum." },
      { structure:"deque", input:[1,3,-1,-3,5], cursor:1, items:["1:3"], window:[0,1], removed:"0:1", action:"remove dominated back", note:"Value 3 is newer and larger than 1. The older 1 can never be a future window maximum." },
      { structure:"deque", input:[1,3,-1,-3,5], cursor:3, items:["1:3","2:-1","3:-3"], window:[1,3], outputs:[3,3], action:"front remains maximum", note:"Window [3,-1,-3] is full. The front index 1 supplies maximum 3." },
      { structure:"deque", input:[1,3,-1,-3,5], cursor:4, items:["4:5"], window:[2,4], removed:"1:3, 3:-3, 2:-1", outputs:[3,3,5], action:"expire front, dominate backs", found:true, note:"Index 1 expires. New value 5 dominates every remaining candidate, so it becomes the sole maximum." },
    ],
  },
  heap_sift: {
    label: "Heap · Sift",
    title: "Repair a min-heap after removing its root",
    meta: "pop minimum from [1, 4, 3, 9, 7, 8, 5]",
    takeaway: "Root removal can break order only down one path, so repeated swaps with the smaller child restore the heap in O(log n).",
    invariant: "Every edge outside the highlighted repair path already satisfies parent ≤ child.",
    steps: [
      { structure:"heap", items:[1,4,3,9,7,8,5], active:0, action:"minimum is root", note:"The complete-tree shape maps directly to the array. Root 1 is globally minimum." },
      { structure:"heap", items:[5,4,3,9,7,8], active:0, removed:"1", comparisons:[1,2], action:"move last value to root", note:"Remove 1 and move last value 5 to index 0. Shape is valid, but 5 violates order with child 3." },
      { structure:"heap", items:[3,4,5,9,7,8], active:2, moving:[0,2], action:"swap with smaller child 3", note:"Choose the smaller child, not merely the left child. Swap 5 with 3 and continue from index 2." },
      { structure:"heap", items:[3,4,5,9,7,8], active:2, found:true, action:"repair stops", note:"At index 2, child 8 is not smaller than 5. The order invariant is restored everywhere." },
    ],
  },
  heap_median: {
    label: "Heap · Median",
    title: "Balance two heaps around the running median",
    meta: "stream = 5, 2, 10, 4",
    takeaway: "Two heaps avoid sorting the stream: only the maximum lower value and minimum upper value determine the median.",
    invariant: "All lower values are ≤ all upper values, and lower has either equal size or one extra item.",
    steps: [
      { structure:"two-heaps", lower:[5], upper:[], input:[5,2,10,4], cursor:0, median:5, action:"5 enters lower", note:"With one value, the max-heap lower owns the extra item and its root is the median." },
      { structure:"two-heaps", lower:[2], upper:[5], input:[5,2,10,4], cursor:1, median:3.5, action:"rebalance 5 to upper", note:"2 enters lower, making it too large. Move its maximum 5 to upper; average both roots." },
      { structure:"two-heaps", lower:[5,2], upper:[10], input:[5,2,10,4], cursor:2, median:5, action:"rebalance upper root", note:"10 enters upper. Move upper's minimum 5 back so lower has the permitted extra item." },
      { structure:"two-heaps", lower:[4,2], upper:[5,10], input:[5,2,10,4], cursor:3, median:4.5, action:"balanced halves", found:true, note:"4 enters lower, then 5 moves to upper. Equal sizes make the median (4 + 5) / 2 = 4.5." },
    ],
  },
  union: {
    label: "Union-find",
    title: "Merge connected components",
    meta: "union by size + path compression",
    takeaway: "Union-find answers dynamic connectivity almost constantly on average; it does not recover the actual path between nodes.",
    invariant: "Every member reaches one representative root for its component.",
    steps: [
      { groups: [[0], [1], [2], [3], [4], [5]], edge: null, note: "Initially every node is the representative of its own component." },
      { groups: [[0, 1], [2], [3], [4], [5]], edge: [0, 1], note: "Union(0, 1): attach one root to the other. There are now five components." },
      { groups: [[0, 1], [2, 3], [4], [5]], edge: [2, 3], note: "Union(2, 3): create a second two-node component." },
      { groups: [[0, 1, 2, 3], [4], [5]], edge: [1, 3], note: "Union(1, 3): find both representatives, then merge the two components." },
      { groups: [[0, 1, 2, 3], [4, 5]], edge: [4, 5], found: true, note: "Union(4, 5): two components remain. find(0) equals find(3), but differs from find(5)." },
    ],
  },
};

function ArrayVisual({ mode, current }) {
  const max = Math.max(...current.values.filter((value) => value !== null));
  const isBar = mode === "sorting";

  return (
    <div className={`array-track ${isBar ? "bar-track" : ""}`} aria-label={`${labs[mode].title}, current values ${current.values.join(", ")}`}>
      {current.values.map((value, index) => {
        const outside = mode === "binary" && (index < current.left || index > current.right);
        const classNames = [
          "array-cell",
          index === current.left ? "left" : "",
          index === current.right ? "right" : "",
          index === current.mid || index === current.active ? "active-cell" : "",
          current.parents?.includes(index) ? "dependency" : "",
          current.moving?.includes(index) ? "moving" : "",
          current.reach !== undefined && index <= current.reach ? "reachable" : "",
          outside ? "eliminated" : "",
          isBar && index <= current.sortedEnd ? "sorted" : "",
        ].filter(Boolean).join(" ");

        return (
          <div className={classNames} key={index} style={isBar ? { minHeight: `${54 + ((value || 0) / max) * 110}px` } : undefined}>
            <small>{mode === "dp" ? `dp[${index}]` : index === current.left ? "left" : index === current.right ? "right" : index === current.mid ? "mid" : index}</small>
            <b>{value ?? "?"}</b>
          </div>
        );
      })}
    </div>
  );
}

function IntervalVisual({ current }) {
  return (
    <div className="interval-track" role="img" aria-label="Greedy interval scheduling timeline from time 1 to 9">
      {current.intervals.map(([start, end], index) => {
        const state = current.chosen.includes(index) ? "chosen" : current.rejected.includes(index) ? "rejected" : index === current.active ? "active" : "pending";
        return <div className="interval-row" key={`${start}-${end}-${index}`}><small>{state}</small><div className="interval-axis"><span className={`interval-mark ${state}`} style={{ left: `${((start - 1) / 8) * 100}%`, width: `${((end - start) / 8) * 100}%` }}>[{start},{end}]</span></div></div>;
      })}
      <div className="interval-ticks">{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => <span key={value}>{value}</span>)}</div>
    </div>
  );
}

function NetworkStateVisual({ current }) {
  const byId = Object.fromEntries(current.nodes.map((node) => [node.id, node]));
  const highlighted = new Set((current.highlightEdges || []).map(([from, to]) => `${from}-${to}`));
  return <>
    <svg className="network-state" viewBox="0 0 620 270" role="img" aria-label="Current tree or graph algorithm state">
      <defs><marker id="network-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>
      {current.edges.map(([from, to, weight = null], index) => {
        const source = byId[from], target = byId[to];
        const active = highlighted.has(`${from}-${to}`) || highlighted.has(`${to}-${from}`);
        return <g key={`${from}-${to}-${index}`} className={`network-edge ${active ? "highlight" : ""}`}><line x1={source.x} y1={source.y} x2={target.x} y2={target.y} markerEnd={current.directed ? "url(#network-arrow)" : undefined} />{weight !== null && <text x={(source.x + target.x) / 2} y={(source.y + target.y) / 2 - 7}>{weight}</text>}</g>;
      })}
      {current.nodes.map((node) => <g key={node.id} className={`network-node ${current.visited.includes(node.id) ? "visited" : ""} ${current.active === node.id ? "active" : ""}`}><circle cx={node.x} cy={node.y} r="25" /><text className="network-label" x={node.x} y={node.y + 4}>{node.id}</text>{current.values?.[node.id] !== undefined && <text className="network-value" x={node.x} y={node.y + 41}>{current.values[node.id]}</text>}</g>)}
    </svg>
    {current.queue && <div className="queue-track"><span>ready queue</span>{current.queue.map((node) => <b key={node}>{node}</b>)}{!current.queue.length && <em>empty</em>}</div>}
  </>;
}

function GraphVisual({ current }) {
  return <>
    <div className="graph-track" aria-label="Graph traversal state">
      {current.nodes.map((node) => (
        <div key={node} className={`graph-node ${current.visited.includes(node) ? "visited" : ""} ${current.active === node ? "active" : ""}`}>
          <b>{node}</b><small>{current.levels[node] === undefined ? "∞" : `d=${current.levels[node]}`}</small>
        </div>
      ))}
    </div>
    <div className="queue-track"><span>queue · front first</span>{current.queue.map((item) => <b key={item}>{item}</b>)}</div>
  </>;
}

function MatrixVisual({ lab, current }) {
  const columns = current.matrix[0].length;
  const dependencyKeys = new Set(current.dependencies.map(([row, col]) => `${row}-${col}`));
  return (
    <div className="matrix-wrap">
      {lab.colLabels && <div className="matrix-column-labels" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>{lab.colLabels.map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}</div>}
      <div className="matrix-with-rows">
        {lab.rowLabels && <div className="matrix-row-labels">{lab.rowLabels.map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}</div>}
        <div className="matrix-track" style={{ gridTemplateColumns: `repeat(${columns}, minmax(42px, 1fr))` }} role="img" aria-label={`${lab.title}; current dynamic programming table`}>
          {current.matrix.flatMap((row, rowIndex) => row.map((value, colIndex) => {
            const active = current.active[0] === rowIndex && current.active[1] === colIndex;
            const dependency = dependencyKeys.has(`${rowIndex}-${colIndex}`);
            return <div key={`${rowIndex}-${colIndex}`} className={`matrix-cell ${active ? "active" : ""} ${dependency ? "dependency" : ""} ${value === "×" ? "blocked" : ""}`}><small>{rowIndex},{colIndex}</small><b>{value ?? "?"}</b></div>;
          }))}
        </div>
      </div>
    </div>
  );
}

function UnionVisual({ current }) {
  return (
    <div className="union-track" aria-label={`${current.groups.length} connected components`}>
      {current.groups.map((group) => (
        <div className="union-group" key={group.join("-")}>
          <small>root {group[0]}</small>
          <div>{group.map((node) => <b key={node}>{node}</b>)}</div>
          {current.edge && group.includes(current.edge[0]) && group.includes(current.edge[1]) && <span>merged {current.edge.join(" ↔ ")}</span>}
        </div>
      ))}
    </div>
  );
}

function LinearStructureVisual({ current }) {
  if (current.structure === "heap") {
    const positions = [[300,35],[170,115],[430,115],[105,205],[235,205],[365,205],[495,205]];
    const nodes = current.items.map((value, index) => ({ id:String(index), label:String(value), x:positions[index][0], y:positions[index][1] }));
    const edges = nodes.slice(1).map((node, index) => [String(Math.floor((index + 1 - 1) / 2)), node.id]);
    return <div className="structure-visual"><NetworkStateVisual current={{ network:"tree", nodes, edges, active:String(current.active), visited:[], values:Object.fromEntries(nodes.map(node => [node.id, node.label])), highlightEdges:(current.moving || []).length === 2 ? [[String(current.moving[0]), String(current.moving[1])]] : [] }} /><div className="heap-array-row"><span>array</span>{current.items.map((value,index)=><b className={index===current.active ? "active" : ""} key={index}>{value}</b>)}</div></div>;
  }

  if (current.structure === "two-heaps") {
    return <div className="two-heaps-visual" role="img" aria-label={`Lower heap ${current.lower.join(", ")}; upper heap ${current.upper.join(", ")}; median ${current.median}`}><div><span>lower · max-heap</span><div>{current.lower.map((item,index)=><b key={`${item}-${index}`}>{item}</b>)}</div></div><strong>median<br />{current.median}</strong><div><span>upper · min-heap</span><div>{current.upper.map((item,index)=><b key={`${item}-${index}`}>{item}</b>)}</div></div></div>;
  }

  const isStack = current.structure === "stack";
  return <div className="linear-structure-wrap">
    {current.input && <div className="input-sequence" aria-label={`Input sequence ${current.input.join(", ")}`}>{current.input.map((item,index)=><b className={index===current.cursor ? "active" : current.window && index>=current.window[0] && index<=current.window[1] ? "window" : ""} key={`${item}-${index}`}>{item}</b>)}</div>}
    <div className={`linear-structure ${isStack ? "stack" : "deque"}`} role="img" aria-label={`${isStack ? "Stack bottom to top" : "Deque front to back"}: ${current.items.join(", ") || "empty"}`}><span>{isStack ? "bottom" : "front"}</span>{current.items.map((item,index)=><b key={`${item}-${index}`}>{item}</b>)}{!current.items.length && <em>empty</em>}<span>{isStack ? "top" : "back"}</span></div>
    <div className="structure-action"><strong>{current.action}</strong>{current.removed && <span>removed: {current.removed}</span>}{current.answers && <span>answers: [{current.answers.join(", ")}]</span>}{current.outputs && <span>outputs: [{current.outputs.join(", ")}]</span>}</div>
  </div>;
}

const DsaLab = () => {
  const [mode, setMode] = useState("pointers");
  const [step, setStep] = useState(0);
  const lab = labs[mode];
  const current = lab.steps[step];
  const complete = step === lab.steps.length - 1;
  const progress = ((step + 1) / lab.steps.length) * 100;
  const equation = useMemo(() => {
    if (mode !== "pointers") return null;
    return `${current.values[current.left]} + ${current.values[current.right]} = ${current.values[current.left] + current.values[current.right]}`;
  }, [current, mode]);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setStep(0);
  };

  return (
    <div className="dsa-lab">
      <Link className="lab-back" to="/dsa"><ArrowLeft size={16} /> Back to DSA guide</Link>
      <div className="lab-heading">
        <div><span className="eyebrow">Interactive algorithm lab</span><h1>See the state change.</h1><p>Move one step at a time. Predict the next state, then check the reasoning and invariant.</p></div>
        <Sparkles aria-hidden="true" size={34} />
      </div>

      <div className="lab-tabs" role="tablist" aria-label="Choose an algorithm visual">
        {Object.entries(labs).map(([id, item]) => (
          <button type="button" role="tab" aria-selected={mode === id} key={id} onClick={() => switchMode(id)}>{item.label}</button>
        ))}
      </div>

      <section className="lab-surface" aria-live="polite">
        <div className="lab-meta"><span>{lab.title}</span><strong>{lab.meta}</strong></div>
        <div className="lab-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>

        {current.matrix ? <MatrixVisual lab={lab} current={current} /> : current.intervals ? <IntervalVisual current={current} /> : current.network ? <NetworkStateVisual current={current} /> : current.structure ? <LinearStructureVisual current={current} /> : mode === "bfs" ? <GraphVisual current={current} /> : mode === "union" ? <UnionVisual current={current} /> : <ArrayVisual mode={mode} current={current} />}
        {equation && <div className="equation">{equation} {current.found && <CheckCircle2 size={18} />}</div>}

        <div className="invariant-line"><span>Invariant</span><p>{lab.invariant}</p></div>
        <div className="step-note"><span>Step {step + 1} of {lab.steps.length}</span><p>{current.note}</p></div>
        <div className="lab-actions">
          <button type="button" className="lab-secondary" onClick={() => setStep(0)}><RotateCcw size={15} /> Reset</button>
          <div className="lab-step-buttons">
            <button type="button" className="lab-secondary" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}><ArrowLeft size={15} /> Previous</button>
            <button type="button" className="btn" disabled={complete} onClick={() => setStep((value) => Math.min(value + 1, lab.steps.length - 1))}>{complete ? "Trace complete" : "Next step"} <ArrowRight size={16} /></button>
          </div>
        </div>
      </section>

      <section className="lab-takeaway"><h2>What to remember</h2><p>{lab.takeaway}</p><ol><li>Describe what every visual element represents.</li><li>State why the next move cannot lose a valid answer.</li><li>Recreate the trace on paper before coding.</li></ol></section>
    </div>
  );
};

export default DsaLab;
