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
  ],
};
