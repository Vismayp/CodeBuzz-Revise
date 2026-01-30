export const graphsTopic = {
  id: "graphs",
  title: "Graphs",
  description:
    "Master BFS, DFS, shortest paths, topological sort, and graph algorithms.",
  icon: "Network",
  sections: [
    // ============== THEORY SECTIONS ==============
    {
      id: "graph-fundamentals",
      title: "Graph Fundamentals",
      type: "theory",
      content: `
## Graphs: Networks of Connections

A graph G = (V, E) consists of vertices (nodes) and edges (connections).

### Types of Graphs
| Type | Description |
|------|-------------|
| **Directed** | Edges have direction (A → B) |
| **Undirected** | Edges are bidirectional |
| **Weighted** | Edges have associated costs |
| **Cyclic** | Contains cycles |
| **Acyclic** | No cycles (DAG) |
| **Connected** | Path exists between all pairs |

### Graph Representations
1. **Adjacency Matrix**: O(V²) space, O(1) edge lookup
2. **Adjacency List**: O(V + E) space, O(degree) edge lookup

### When to Use Each
- **Matrix**: Dense graphs, need fast edge queries
- **List**: Sparse graphs, most algorithms

### Important Metrics
- **Degree**: Number of edges connected to a vertex
- **In-degree/Out-degree**: For directed graphs
- **Path**: Sequence of vertices connected by edges
- **Cycle**: Path that starts and ends at same vertex
      `,
      code: `// Adjacency List Representation
class Graph {
    constructor(isDirected = false) {
        this.adjacencyList = new Map();
        this.isDirected = isDirected;
    }
    
    addVertex(vertex) {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }
    
    addEdge(v1, v2, weight = 1) {
        this.addVertex(v1);
        this.addVertex(v2);
        
        this.adjacencyList.get(v1).push({ node: v2, weight });
        
        if (!this.isDirected) {
            this.adjacencyList.get(v2).push({ node: v1, weight });
        }
    }
    
    getNeighbors(vertex) {
        return this.adjacencyList.get(vertex) || [];
    }
}

// Building graph from edge list
function buildGraph(edges, directed = false) {
    const graph = {};
    
    for (const [u, v] of edges) {
        if (!graph[u]) graph[u] = [];
        if (!graph[v]) graph[v] = [];
        
        graph[u].push(v);
        if (!directed) graph[v].push(u);
    }
    
    return graph;
}

// Adjacency Matrix
function buildMatrix(n, edges) {
    const matrix = Array(n).fill(null).map(() => Array(n).fill(0));
    
    for (const [u, v, weight = 1] of edges) {
        matrix[u][v] = weight;
        matrix[v][u] = weight; // For undirected
    }
    
    return matrix;
}

// Example: Build graph for edges [[0,1], [0,2], [1,2], [2,3]]
// Adjacency List:
// 0 → [1, 2]
// 1 → [0, 2]
// 2 → [0, 1, 3]
// 3 → [2]`,
    },
    {
      id: "bfs-dfs",
      title: "BFS and DFS Traversals",
      type: "theory",
      content: `
## Graph Traversal Algorithms

### BFS (Breadth-First Search)
- Explores neighbors first, then their neighbors
- Uses **Queue** (FIFO)
- Finds **shortest path** in unweighted graphs
- Time: O(V + E), Space: O(V)

### DFS (Depth-First Search)
- Explores as deep as possible, then backtracks
- Uses **Stack** (or recursion)
- Good for **cycle detection**, **topological sort**
- Time: O(V + E), Space: O(V)

### When to Use Which?
| Use BFS | Use DFS |
|---------|---------|
| Shortest path (unweighted) | Cycle detection |
| Level-order traversal | Path finding |
| Minimum steps problems | Connected components |
| Closest node | Topological sort |
      `,
      diagram: `
graph LR
    subgraph "BFS Order from A"
    A((A)) --> B((B)) --> C((C))
    A --> D((D))
    B --> E((E))
    end
    subgraph "Order: A,B,D,C,E"
    end
      `,
      code: `// BFS - Uses Queue
function bfs(graph, start) {
    const visited = new Set([start]);
    const queue = [start];
    const result = [];
    
    while (queue.length > 0) {
        const node = queue.shift();
        result.push(node);
        
        for (const neighbor of graph[node] || []) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
    
    return result;
}

// DFS - Recursive
function dfsRecursive(graph, start, visited = new Set()) {
    visited.add(start);
    console.log(start); // Process node
    
    for (const neighbor of graph[start] || []) {
        if (!visited.has(neighbor)) {
            dfsRecursive(graph, neighbor, visited);
        }
    }
}

// DFS - Iterative with Stack
function dfsIterative(graph, start) {
    const visited = new Set();
    const stack = [start];
    const result = [];
    
    while (stack.length > 0) {
        const node = stack.pop();
        
        if (visited.has(node)) continue;
        visited.add(node);
        result.push(node);
        
        // Add neighbors in reverse order for same order as recursive
        for (const neighbor of (graph[node] || []).reverse()) {
            if (!visited.has(neighbor)) {
                stack.push(neighbor);
            }
        }
    }
    
    return result;
}

// BFS Shortest Path (unweighted)
function bfsShortestPath(graph, start, end) {
    const visited = new Set([start]);
    const queue = [[start, [start]]]; // [node, path]
    
    while (queue.length > 0) {
        const [node, path] = queue.shift();
        
        if (node === end) return path;
        
        for (const neighbor of graph[node] || []) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push([neighbor, [...path, neighbor]]);
            }
        }
    }
    
    return null; // No path found
}

// Check if path exists
function hasPath(graph, start, end) {
    const visited = new Set();
    const stack = [start];
    
    while (stack.length > 0) {
        const node = stack.pop();
        if (node === end) return true;
        
        if (visited.has(node)) continue;
        visited.add(node);
        
        for (const neighbor of graph[node] || []) {
            stack.push(neighbor);
        }
    }
    
    return false;
}`,
    },
    {
      id: "topological-sort",
      title: "Topological Sort",
      type: "theory",
      content: `
## Topological Sort: Ordering Dependencies

Linear ordering of vertices where for every edge (u, v), u comes before v.
Only works on **Directed Acyclic Graphs (DAGs)**.

### Applications
- Build systems (compile order)
- Task scheduling
- Course prerequisites
- Package dependencies

### Two Approaches
1. **Kahn's Algorithm (BFS)**: Process nodes with in-degree 0
2. **DFS-based**: Post-order reversal

### Detecting Cycles
If topological sort fails (can't process all nodes), graph has a cycle.
      `,
      diagram: `
graph LR
    A[Course A] --> B[Course B]
    A --> C[Course C]
    B --> D[Course D]
    C --> D
    subgraph "Valid Orders"
    E["A → B → C → D"]
    F["A → C → B → D"]
    end
      `,
      code: `// Kahn's Algorithm (BFS) - O(V + E)
function topologicalSortKahn(numCourses, prerequisites) {
    const inDegree = new Array(numCourses).fill(0);
    const graph = new Array(numCourses).fill(null).map(() => []);
    
    // Build graph and calculate in-degrees
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
        inDegree[course]++;
    }
    
    // Start with nodes having in-degree 0
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) queue.push(i);
    }
    
    const result = [];
    
    while (queue.length > 0) {
        const node = queue.shift();
        result.push(node);
        
        for (const neighbor of graph[node]) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    // If not all nodes processed, there's a cycle
    return result.length === numCourses ? result : [];
}

// DFS-based Topological Sort
function topologicalSortDFS(numCourses, prerequisites) {
    const graph = new Array(numCourses).fill(null).map(() => []);
    
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
    }
    
    const visited = new Array(numCourses).fill(0); // 0: unvisited, 1: visiting, 2: visited
    const result = [];
    
    function dfs(node) {
        if (visited[node] === 1) return false; // Cycle detected
        if (visited[node] === 2) return true;  // Already processed
        
        visited[node] = 1; // Mark as visiting
        
        for (const neighbor of graph[node]) {
            if (!dfs(neighbor)) return false;
        }
        
        visited[node] = 2; // Mark as visited
        result.push(node); // Add to result (post-order)
        return true;
    }
    
    for (let i = 0; i < numCourses; i++) {
        if (!dfs(i)) return []; // Cycle exists
    }
    
    return result.reverse(); // Reverse post-order
}

// Example: prerequisites = [[1,0], [2,0], [3,1], [3,2]]
// 0 → 1 → 3
// 0 → 2 → 3
// Valid order: [0, 1, 2, 3] or [0, 2, 1, 3]`,
    },
    {
      id: "shortest-path",
      title: "Shortest Path Algorithms",
      type: "theory",
      content: `
## Shortest Path Algorithms

### Algorithm Selection
| Algorithm | Graph Type | Time | Use Case |
|-----------|------------|------|----------|
| **BFS** | Unweighted | O(V+E) | Simple shortest path |
| **Dijkstra** | Non-negative weights | O((V+E)logV) | GPS navigation |
| **Bellman-Ford** | Any weights | O(VE) | Negative weights |
| **Floyd-Warshall** | All pairs | O(V³) | Small dense graphs |

### Dijkstra's Algorithm
1. Start with distance[source] = 0, others = ∞
2. Use min-heap to always process closest unvisited node
3. Relax edges: if distance[u] + weight < distance[v], update
      `,
      code: `// Dijkstra's Algorithm - O((V + E) log V)
function dijkstra(graph, start, n) {
    const dist = new Array(n).fill(Infinity);
    dist[start] = 0;
    
    // Min heap: [distance, node]
    const pq = [[0, start]];
    const visited = new Set();
    
    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]); // Simple priority queue
        const [d, u] = pq.shift();
        
        if (visited.has(u)) continue;
        visited.add(u);
        
        for (const [v, weight] of graph[u] || []) {
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push([dist[v], v]);
            }
        }
    }
    
    return dist;
}

// Bellman-Ford Algorithm - O(VE)
// Can handle negative weights, detects negative cycles
function bellmanFord(edges, n, start) {
    const dist = new Array(n).fill(Infinity);
    dist[start] = 0;
    
    // Relax all edges V-1 times
    for (let i = 0; i < n - 1; i++) {
        for (const [u, v, weight] of edges) {
            if (dist[u] !== Infinity && dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
            }
        }
    }
    
    // Check for negative cycle
    for (const [u, v, weight] of edges) {
        if (dist[u] !== Infinity && dist[u] + weight < dist[v]) {
            return null; // Negative cycle exists
        }
    }
    
    return dist;
}

// Floyd-Warshall - O(V³)
// All pairs shortest path
function floydWarshall(graph, n) {
    // Initialize distance matrix
    const dist = Array(n).fill(null).map(() => Array(n).fill(Infinity));
    
    for (let i = 0; i < n; i++) {
        dist[i][i] = 0;
    }
    
    for (const [u, v, weight] of graph) {
        dist[u][v] = weight;
    }
    
    // Try each vertex as intermediate
    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
    
    return dist;
}`,
    },
    // ============== PROBLEM SECTIONS ==============
    {
      id: "problem-num-islands",
      title: "Number of Islands",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Microsoft", "Facebook", "Google", "Bloomberg"],
      leetcode: "https://leetcode.com/problems/number-of-islands/",
      content: `
## LeetCode #200: Number of Islands

Given a 2D grid of '1's (land) and '0's (water), count the number of islands.

### Example
\`\`\`
Input: grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3
\`\`\`

### Key Insight
Use DFS/BFS to explore connected land cells. Each new exploration starting point = new island.
      `,
      code: `// DFS Solution - O(m*n)
function numIslands(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    let islands = 0;
    
    function dfs(r, c) {
        // Boundary check
        if (r < 0 || r >= rows || c < 0 || c >= cols) return;
        // Water or visited
        if (grid[r][c] !== '1') return;
        
        // Mark as visited
        grid[r][c] = '0';
        
        // Explore all 4 directions
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    }
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '1') {
                islands++;
                dfs(r, c); // Mark entire island as visited
            }
        }
    }
    
    return islands;
}

// BFS Solution
function numIslandsBFS(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    let islands = 0;
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    
    function bfs(r, c) {
        const queue = [[r, c]];
        grid[r][c] = '0';
        
        while (queue.length > 0) {
            const [row, col] = queue.shift();
            
            for (const [dr, dc] of directions) {
                const nr = row + dr;
                const nc = col + dc;
                
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === '1') {
                    grid[nr][nc] = '0';
                    queue.push([nr, nc]);
                }
            }
        }
    }
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '1') {
                islands++;
                bfs(r, c);
            }
        }
    }
    
    return islands;
}`,
    },
    {
      id: "problem-clone-graph",
      title: "Clone Graph",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Facebook", "Microsoft", "Google", "Bloomberg"],
      leetcode: "https://leetcode.com/problems/clone-graph/",
      content: `
## LeetCode #133: Clone Graph

Given a reference of a node in a connected undirected graph, return a deep copy.

### Key Insight
Use DFS/BFS with a hash map to track already cloned nodes (prevent infinite loops).
      `,
      code: `// DFS with Hash Map - O(V + E)
function cloneGraph(node) {
    if (!node) return null;
    
    const visited = new Map();
    
    function dfs(node) {
        if (visited.has(node)) {
            return visited.get(node);
        }
        
        // Create clone
        const clone = new Node(node.val);
        visited.set(node, clone);
        
        // Clone neighbors
        for (const neighbor of node.neighbors) {
            clone.neighbors.push(dfs(neighbor));
        }
        
        return clone;
    }
    
    return dfs(node);
}

// BFS Solution
function cloneGraphBFS(node) {
    if (!node) return null;
    
    const visited = new Map();
    const queue = [node];
    
    // Create clone for starting node
    visited.set(node, new Node(node.val));
    
    while (queue.length > 0) {
        const curr = queue.shift();
        
        for (const neighbor of curr.neighbors) {
            if (!visited.has(neighbor)) {
                // Create clone for neighbor
                visited.set(neighbor, new Node(neighbor.val));
                queue.push(neighbor);
            }
            // Connect clone to cloned neighbor
            visited.get(curr).neighbors.push(visited.get(neighbor));
        }
    }
    
    return visited.get(node);
}`,
    },
    {
      id: "problem-course-schedule",
      title: "Course Schedule",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Microsoft", "Facebook", "Google", "Uber"],
      leetcode: "https://leetcode.com/problems/course-schedule/",
      content: `
## LeetCode #207: Course Schedule

Given numCourses and prerequisites array, determine if you can finish all courses.

### Example
\`\`\`
Input: numCourses = 2, prerequisites = [[1,0]]
Output: true (Take course 0 first, then course 1)

Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false (Circular dependency)
\`\`\`

### Key Insight
This is **cycle detection** in a directed graph. Use topological sort or DFS with coloring.
      `,
      code: `// Solution 1: Kahn's Algorithm (BFS Topological Sort)
function canFinish(numCourses, prerequisites) {
    const inDegree = new Array(numCourses).fill(0);
    const graph = new Array(numCourses).fill(null).map(() => []);
    
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
        inDegree[course]++;
    }
    
    // Start with courses having no prerequisites
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) queue.push(i);
    }
    
    let coursesCompleted = 0;
    
    while (queue.length > 0) {
        const course = queue.shift();
        coursesCompleted++;
        
        for (const nextCourse of graph[course]) {
            inDegree[nextCourse]--;
            if (inDegree[nextCourse] === 0) {
                queue.push(nextCourse);
            }
        }
    }
    
    return coursesCompleted === numCourses;
}

// Solution 2: DFS with Coloring (Cycle Detection)
function canFinishDFS(numCourses, prerequisites) {
    const graph = new Array(numCourses).fill(null).map(() => []);
    
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
    }
    
    // 0: unvisited, 1: visiting (in current path), 2: visited
    const state = new Array(numCourses).fill(0);
    
    function hasCycle(course) {
        if (state[course] === 1) return true;  // Back edge = cycle
        if (state[course] === 2) return false; // Already processed
        
        state[course] = 1; // Mark as visiting
        
        for (const next of graph[course]) {
            if (hasCycle(next)) return true;
        }
        
        state[course] = 2; // Mark as visited
        return false;
    }
    
    for (let i = 0; i < numCourses; i++) {
        if (hasCycle(i)) return false;
    }
    
    return true;
}

// Course Schedule II - Return the order
function findOrder(numCourses, prerequisites) {
    const inDegree = new Array(numCourses).fill(0);
    const graph = new Array(numCourses).fill(null).map(() => []);
    
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
        inDegree[course]++;
    }
    
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) queue.push(i);
    }
    
    const order = [];
    
    while (queue.length > 0) {
        const course = queue.shift();
        order.push(course);
        
        for (const next of graph[course]) {
            inDegree[next]--;
            if (inDegree[next] === 0) queue.push(next);
        }
    }
    
    return order.length === numCourses ? order : [];
}`,
    },
    {
      id: "problem-word-ladder",
      title: "Word Ladder",
      type: "problem",
      difficulty: "Hard",
      companies: ["Amazon", "Facebook", "Microsoft", "Google", "Lyft"],
      leetcode: "https://leetcode.com/problems/word-ladder/",
      content: `
## LeetCode #127: Word Ladder

Given beginWord, endWord, and wordList, find the length of shortest transformation sequence.

### Example
\`\`\`
beginWord = "hit", endWord = "cog"
wordList = ["hot","dot","dog","lot","log","cog"]
Output: 5 ("hit" → "hot" → "dot" → "dog" → "cog")
\`\`\`

### Key Insight
This is **BFS shortest path** where each word is a node, and edges connect words differing by one letter.
      `,
      code: `// BFS Solution - O(M² × N) where M = word length, N = wordList size
function ladderLength(beginWord, endWord, wordList) {
    const wordSet = new Set(wordList);
    
    if (!wordSet.has(endWord)) return 0;
    
    const queue = [[beginWord, 1]];
    const visited = new Set([beginWord]);
    
    while (queue.length > 0) {
        const [word, level] = queue.shift();
        
        if (word === endWord) return level;
        
        // Try changing each character
        for (let i = 0; i < word.length; i++) {
            for (let c = 97; c <= 122; c++) { // 'a' to 'z'
                const newWord = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
                
                if (wordSet.has(newWord) && !visited.has(newWord)) {
                    visited.add(newWord);
                    queue.push([newWord, level + 1]);
                }
            }
        }
    }
    
    return 0;
}

// Optimized: Bidirectional BFS
function ladderLengthBidirectional(beginWord, endWord, wordList) {
    const wordSet = new Set(wordList);
    
    if (!wordSet.has(endWord)) return 0;
    
    let beginSet = new Set([beginWord]);
    let endSet = new Set([endWord]);
    let visited = new Set([beginWord, endWord]);
    let level = 1;
    
    while (beginSet.size > 0 && endSet.size > 0) {
        level++;
        
        // Always expand smaller set
        if (beginSet.size > endSet.size) {
            [beginSet, endSet] = [endSet, beginSet];
        }
        
        const nextSet = new Set();
        
        for (const word of beginSet) {
            for (let i = 0; i < word.length; i++) {
                for (let c = 97; c <= 122; c++) {
                    const newWord = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
                    
                    if (endSet.has(newWord)) {
                        return level;
                    }
                    
                    if (wordSet.has(newWord) && !visited.has(newWord)) {
                        visited.add(newWord);
                        nextSet.add(newWord);
                    }
                }
            }
        }
        
        beginSet = nextSet;
    }
    
    return 0;
}

// Dry Run: "hit" → "cog"
// Level 1: queue = ["hit"]
// Level 2: hit → hot (h→o), queue = ["hot"]
// Level 3: hot → dot, lot, queue = ["dot", "lot"]
// Level 4: dot → dog, lot → log, queue = ["dog", "log"]
// Level 5: dog → cog ✓
// Return 5`,
    },
    {
      id: "problem-network-delay",
      title: "Network Delay Time",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Google", "Microsoft", "Facebook", "Bloomberg"],
      leetcode: "https://leetcode.com/problems/network-delay-time/",
      content: `
## LeetCode #743: Network Delay Time

Given a network of n nodes and times array [u, v, w], find time for signal from node k to reach all nodes.

### Key Insight
Classic **Dijkstra's shortest path** problem. Find shortest path to all nodes, return maximum.
      `,
      code: `// Dijkstra's Algorithm - O((V + E) log V)
function networkDelayTime(times, n, k) {
    // Build adjacency list
    const graph = new Array(n + 1).fill(null).map(() => []);
    for (const [u, v, w] of times) {
        graph[u].push([v, w]);
    }
    
    // Min heap: [time, node]
    const pq = [[0, k]];
    const dist = new Array(n + 1).fill(Infinity);
    dist[k] = 0;
    
    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [time, node] = pq.shift();
        
        if (time > dist[node]) continue;
        
        for (const [neighbor, weight] of graph[node]) {
            const newTime = time + weight;
            if (newTime < dist[neighbor]) {
                dist[neighbor] = newTime;
                pq.push([newTime, neighbor]);
            }
        }
    }
    
    // Find maximum distance (time to reach all nodes)
    let maxTime = 0;
    for (let i = 1; i <= n; i++) {
        if (dist[i] === Infinity) return -1;
        maxTime = Math.max(maxTime, dist[i]);
    }
    
    return maxTime;
}

// Using proper MinHeap for better performance
class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    push(val) {
        this.heap.push(val);
        this._bubbleUp(this.heap.length - 1);
    }
    
    pop() {
        if (this.heap.length === 0) return null;
        const min = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this._bubbleDown(0);
        }
        return min;
    }
    
    isEmpty() {
        return this.heap.length === 0;
    }
    
    _bubbleUp(i) {
        while (i > 0) {
            const parent = Math.floor((i - 1) / 2);
            if (this.heap[parent][0] <= this.heap[i][0]) break;
            [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
            i = parent;
        }
    }
    
    _bubbleDown(i) {
        while (true) {
            let smallest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;
            
            if (left < this.heap.length && this.heap[left][0] < this.heap[smallest][0]) {
                smallest = left;
            }
            if (right < this.heap.length && this.heap[right][0] < this.heap[smallest][0]) {
                smallest = right;
            }
            
            if (smallest === i) break;
            [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
            i = smallest;
        }
    }
}`,
    },
    // ============== ADVANCED GRAPH ALGORITHMS ==============
    {
      id: "shortest-path-algorithms",
      title: "All Shortest Path Algorithms Compared",
      type: "theory",
      content: `
## Shortest Path Algorithms: Complete Guide 🛤️

<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 24px; margin: 20px 0;">
  <h3 style="color: #4ade80; margin: 0 0 20px 0; text-align: center;">🎯 Algorithm Selection Guide</h3>
  
  <table style="width: 100%; border-collapse: collapse; color: #e2e8f0; font-size: 12px;">
    <thead>
      <tr style="border-bottom: 2px solid #4ade80;">
        <th style="text-align: left; padding: 10px; color: #4ade80;">Algorithm</th>
        <th style="text-align: left; padding: 10px; color: #4ade80;">Time</th>
        <th style="text-align: left; padding: 10px; color: #4ade80;">Neg Weights</th>
        <th style="text-align: left; padding: 10px; color: #4ade80;">Use Case</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 10px;">BFS</td>
        <td style="padding: 10px; color: #60a5fa;">O(V+E)</td>
        <td style="padding: 10px; color: #f87171;">No</td>
        <td style="padding: 10px;">Unweighted graphs</td>
      </tr>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 10px;">Dijkstra</td>
        <td style="padding: 10px; color: #60a5fa;">O((V+E)logV)</td>
        <td style="padding: 10px; color: #f87171;">No</td>
        <td style="padding: 10px;">Single source, non-neg</td>
      </tr>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 10px;">Bellman-Ford</td>
        <td style="padding: 10px; color: #60a5fa;">O(VE)</td>
        <td style="padding: 10px; color: #4ade80;">Yes</td>
        <td style="padding: 10px;">Neg edges, detect cycles</td>
      </tr>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 10px;">Floyd-Warshall</td>
        <td style="padding: 10px; color: #60a5fa;">O(V³)</td>
        <td style="padding: 10px; color: #4ade80;">Yes</td>
        <td style="padding: 10px;">All pairs shortest</td>
      </tr>
      <tr>
        <td style="padding: 10px;">Topological + DP</td>
        <td style="padding: 10px; color: #60a5fa;">O(V+E)</td>
        <td style="padding: 10px; color: #4ade80;">Yes</td>
        <td style="padding: 10px;">DAGs only</td>
      </tr>
    </tbody>
  </table>
</div>

### Decision Tree

\`\`\`
Unweighted graph?
├── Yes → BFS
└── No → Negative weights?
          ├── No → Dijkstra
          └── Yes → DAG?
                    ├── Yes → Topological Sort + DP
                    └── No → Need all pairs?
                              ├── Yes → Floyd-Warshall
                              └── No → Bellman-Ford
\`\`\`
      `,
      code: `// ═══════════════════════════════════════════════════════════
// BELLMAN-FORD ALGORITHM
// Handles negative weights, detects negative cycles
// ═══════════════════════════════════════════════════════════

function bellmanFord(n, edges, source) {
    const dist = new Array(n).fill(Infinity);
    dist[source] = 0;
    
    // Relax all edges V-1 times
    for (let i = 0; i < n - 1; i++) {
        let updated = false;
        
        for (const [u, v, w] of edges) {
            if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                updated = true;
            }
        }
        
        // Early termination if no update
        if (!updated) break;
    }
    
    // Check for negative cycle (V-th iteration)
    for (const [u, v, w] of edges) {
        if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
            return null;  // Negative cycle exists
        }
    }
    
    return dist;
}

// Why V-1 iterations?
// Shortest path has at most V-1 edges
// Each iteration, at least one vertex gets its final distance


// ═══════════════════════════════════════════════════════════
// FLOYD-WARSHALL ALGORITHM
// All pairs shortest path
// ═══════════════════════════════════════════════════════════

function floydWarshall(n, edges) {
    // Initialize distance matrix
    const dist = Array.from({ length: n }, () => 
        new Array(n).fill(Infinity)
    );
    
    // Self distance is 0
    for (let i = 0; i < n; i++) {
        dist[i][i] = 0;
    }
    
    // Add edges
    for (const [u, v, w] of edges) {
        dist[u][v] = w;
        // For undirected: dist[v][u] = w;
    }
    
    // DP: Consider each vertex as intermediate
    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
                    dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
    }
    
    // Check for negative cycle (diagonal < 0)
    for (let i = 0; i < n; i++) {
        if (dist[i][i] < 0) return null;
    }
    
    return dist;
}

// Key insight: dist[i][j] through vertices {0..k}
// = min(dist[i][j] through {0..k-1}, dist[i][k] + dist[k][j])


// ═══════════════════════════════════════════════════════════
// CHEAPEST FLIGHTS WITH K STOPS (LeetCode #787)
// Modified Bellman-Ford with limited iterations
// ═══════════════════════════════════════════════════════════

function findCheapestPrice(n, flights, src, dst, k) {
    let prices = new Array(n).fill(Infinity);
    prices[src] = 0;
    
    // k+1 iterations (k stops = k+1 edges)
    for (let i = 0; i <= k; i++) {
        const temp = [...prices];
        
        for (const [u, v, w] of flights) {
            if (prices[u] !== Infinity && prices[u] + w < temp[v]) {
                temp[v] = prices[u] + w;
            }
        }
        
        prices = temp;
    }
    
    return prices[dst] === Infinity ? -1 : prices[dst];
}

// Why copy array?
// Prevents using updates from same iteration
// Each iteration = one more edge used`,
    },
    {
      id: "mst-algorithms",
      title: "Minimum Spanning Tree Algorithms",
      type: "theory",
      content: `
## MST: Connecting All Nodes Minimally 🌐

A **Minimum Spanning Tree** connects all vertices with minimum total edge weight using exactly V-1 edges.

<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 24px; margin: 20px 0;">
  <h3 style="color: #4ade80; margin: 0 0 20px 0; text-align: center;">🔥 MST Algorithm Comparison</h3>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
    <div style="background: #0f3460; padding: 16px; border-radius: 12px; border-left: 4px solid #4ade80;">
      <h4 style="color: #4ade80; margin: 0 0 8px 0;">Kruskal's</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">O(E log E)</p>
      <p style="color: #60a5fa; margin: 8px 0 0 0; font-size: 12px;">Edge-based, Union-Find</p>
    </div>
    
    <div style="background: #0f3460; padding: 16px; border-radius: 12px; border-left: 4px solid #60a5fa;">
      <h4 style="color: #60a5fa; margin: 0 0 8px 0;">Prim's</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">O(E log V)</p>
      <p style="color: #60a5fa; margin: 8px 0 0 0; font-size: 12px;">Vertex-based, Heap</p>
    </div>
  </div>
</div>

### When to Use Which

| Criteria | Kruskal | Prim |
|----------|---------|------|
| Sparse graph | ✓ Better | Good |
| Dense graph | Good | ✓ Better |
| Already sorted edges | ✓ Best | — |
| Need specific starting point | — | ✓ |

### Applications
- Network design (cables, pipes)
- Cluster analysis
- Approximation for traveling salesman
      `,
      code: `// ═══════════════════════════════════════════════════════════
// KRUSKAL'S ALGORITHM WITH UNION-FIND
// ═══════════════════════════════════════════════════════════

function kruskalMST(n, edges) {
    // Sort edges by weight
    edges.sort((a, b) => a[2] - b[2]);
    
    // Union-Find setup
    const parent = Array.from({ length: n }, (_, i) => i);
    const rank = new Array(n).fill(0);
    
    function find(x) {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]);  // Path compression
        }
        return parent[x];
    }
    
    function union(x, y) {
        const px = find(x), py = find(y);
        if (px === py) return false;
        
        // Union by rank
        if (rank[px] < rank[py]) {
            parent[px] = py;
        } else if (rank[px] > rank[py]) {
            parent[py] = px;
        } else {
            parent[py] = px;
            rank[px]++;
        }
        return true;
    }
    
    let mstWeight = 0;
    const mstEdges = [];
    
    for (const [u, v, w] of edges) {
        if (union(u, v)) {
            mstWeight += w;
            mstEdges.push([u, v, w]);
            if (mstEdges.length === n - 1) break;
        }
    }
    
    return { weight: mstWeight, edges: mstEdges };
}


// ═══════════════════════════════════════════════════════════
// PRIM'S ALGORITHM WITH HEAP
// ═══════════════════════════════════════════════════════════

function primMST(n, edges) {
    // Build adjacency list
    const graph = Array.from({ length: n }, () => []);
    for (const [u, v, w] of edges) {
        graph[u].push([v, w]);
        graph[v].push([u, w]);  // Undirected
    }
    
    const visited = new Set();
    const minHeap = [[0, 0]];  // [weight, node]
    let mstWeight = 0;
    
    while (visited.size < n && minHeap.length > 0) {
        // Sort to simulate min-heap (use proper heap in production)
        minHeap.sort((a, b) => a[0] - b[0]);
        const [weight, node] = minHeap.shift();
        
        if (visited.has(node)) continue;
        
        visited.add(node);
        mstWeight += weight;
        
        for (const [neighbor, w] of graph[node]) {
            if (!visited.has(neighbor)) {
                minHeap.push([w, neighbor]);
            }
        }
    }
    
    return visited.size === n ? mstWeight : -1;  // -1 if not connected
}


// ═══════════════════════════════════════════════════════════
// MIN COST TO CONNECT ALL POINTS (LeetCode #1584)
// ═══════════════════════════════════════════════════════════

function minCostConnectPoints(points) {
    const n = points.length;
    
    // Calculate all edge weights (complete graph)
    const edges = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const dist = Math.abs(points[i][0] - points[j][0]) + 
                        Math.abs(points[i][1] - points[j][1]);
            edges.push([i, j, dist]);
        }
    }
    
    // Apply Kruskal's
    edges.sort((a, b) => a[2] - b[2]);
    
    const parent = Array.from({ length: n }, (_, i) => i);
    
    function find(x) {
        if (parent[x] !== x) parent[x] = find(parent[x]);
        return parent[x];
    }
    
    let cost = 0;
    let edgesUsed = 0;
    
    for (const [u, v, w] of edges) {
        const pu = find(u), pv = find(v);
        if (pu !== pv) {
            parent[pu] = pv;
            cost += w;
            edgesUsed++;
            if (edgesUsed === n - 1) break;
        }
    }
    
    return cost;
}`,
    },
    {
      id: "graph-interview-patterns",
      title: "Graph Interview Patterns: Complete Reference",
      type: "theory",
      content: `
## 🎯 Graph Problem Pattern Recognition

<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 24px; margin: 20px 0;">
  <div style="display: grid; gap: 12px;">
    <div style="background: #0f3460; padding: 16px; border-radius: 12px;">
      <h4 style="color: #4ade80; margin: 0 0 8px 0;">🔍 "Find if path exists"</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">BFS/DFS or Union-Find</p>
    </div>
    
    <div style="background: #0f3460; padding: 16px; border-radius: 12px;">
      <h4 style="color: #60a5fa; margin: 0 0 8px 0;">📏 "Shortest path"</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">Unweighted: BFS | Weighted: Dijkstra | Neg weights: Bellman-Ford</p>
    </div>
    
    <div style="background: #0f3460; padding: 16px; border-radius: 12px;">
      <h4 style="color: #f472b6; margin: 0 0 8px 0;">🔄 "Detect cycle"</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">Undirected: Union-Find | Directed: DFS with colors</p>
    </div>
    
    <div style="background: #0f3460; padding: 16px; border-radius: 12px;">
      <h4 style="color: #fbbf24; margin: 0 0 8px 0;">📋 "Order of tasks"</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">Topological Sort (Kahn's BFS or DFS)</p>
    </div>
    
    <div style="background: #0f3460; padding: 16px; border-radius: 12px;">
      <h4 style="color: #a78bfa; margin: 0 0 8px 0;">🎨 "Bipartite / 2-coloring"</h4>
      <p style="color: #94a3b8; margin: 0; font-size: 13px;">BFS/DFS with alternating colors</p>
    </div>
  </div>
</div>

### Master Checklist

Before solving any graph problem:
1. **Directed or Undirected?**
2. **Weighted or Unweighted?**
3. **Cyclic or Acyclic (DAG)?**
4. **Single source or All pairs?**
5. **Connected or Multiple components?**
      `,
      code: `// ═══════════════════════════════════════════════════════════
// TOPOLOGICAL SORT (Kahn's Algorithm - BFS)
// ═══════════════════════════════════════════════════════════

function topologicalSort(n, prerequisites) {
    const graph = Array.from({ length: n }, () => []);
    const inDegree = new Array(n).fill(0);
    
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
        inDegree[course]++;
    }
    
    // Start with nodes having no prerequisites
    const queue = [];
    for (let i = 0; i < n; i++) {
        if (inDegree[i] === 0) queue.push(i);
    }
    
    const order = [];
    
    while (queue.length > 0) {
        const node = queue.shift();
        order.push(node);
        
        for (const neighbor of graph[node]) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    // If we processed all nodes, no cycle
    return order.length === n ? order : [];
}


// ═══════════════════════════════════════════════════════════
// BIPARTITE CHECK (LeetCode #785)
// ═══════════════════════════════════════════════════════════

function isBipartite(graph) {
    const n = graph.length;
    const color = new Array(n).fill(-1);
    
    for (let i = 0; i < n; i++) {
        if (color[i] !== -1) continue;
        
        // BFS from unvisited node
        const queue = [i];
        color[i] = 0;
        
        while (queue.length > 0) {
            const node = queue.shift();
            
            for (const neighbor of graph[node]) {
                if (color[neighbor] === -1) {
                    color[neighbor] = 1 - color[node];
                    queue.push(neighbor);
                } else if (color[neighbor] === color[node]) {
                    return false;  // Same color = not bipartite
                }
            }
        }
    }
    
    return true;
}


// ═══════════════════════════════════════════════════════════
// DETECT CYCLE IN DIRECTED GRAPH (3-Color DFS)
// ═══════════════════════════════════════════════════════════

function hasCycle(n, edges) {
    const graph = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
        graph[u].push(v);
    }
    
    // 0: white (unvisited), 1: gray (in stack), 2: black (done)
    const color = new Array(n).fill(0);
    
    function dfs(node) {
        color[node] = 1;  // Mark as in progress
        
        for (const neighbor of graph[node]) {
            if (color[neighbor] === 1) return true;   // Back edge = cycle
            if (color[neighbor] === 0 && dfs(neighbor)) return true;
        }
        
        color[node] = 2;  // Mark as complete
        return false;
    }
    
    for (let i = 0; i < n; i++) {
        if (color[i] === 0 && dfs(i)) return true;
    }
    
    return false;
}


// ═══════════════════════════════════════════════════════════
// INTERVIEW CHEAT SHEET
// ═══════════════════════════════════════════════════════════

/*
GRAPH ALGORITHM SELECTION:

Connectivity:
- Components count → DFS/BFS or Union-Find
- Path exists → BFS/DFS or Union-Find

Shortest Path:
- Unweighted → BFS
- Non-negative weights → Dijkstra
- Negative weights (no neg cycle) → Bellman-Ford
- All pairs → Floyd-Warshall
- DAG → Topological + relaxation

Cycle Detection:
- Undirected → Union-Find or DFS with parent
- Directed → DFS with 3 colors

Spanning Tree:
- Dense graph → Prim's
- Sparse graph → Kruskal's

Ordering:
- Task dependencies → Topological Sort

Coloring:
- 2-colorable? → Bipartite check

COMPLEXITY REFERENCE:
- BFS/DFS: O(V + E)
- Dijkstra: O((V + E) log V) with heap
- Bellman-Ford: O(VE)
- Floyd-Warshall: O(V³)
- Kruskal: O(E log E)
- Prim: O(E log V)
- Topological: O(V + E)
*/`,
    },
  ],
};
