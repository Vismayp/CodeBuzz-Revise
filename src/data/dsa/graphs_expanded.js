export const expandedGraphSections = [
  {
    id: "graph-modeling-first",
    title: "Graph Modeling: Define Nodes and Edges First",
    type: "theory",
    content: `
## Most graph difficulty is hidden in the model

Before selecting an algorithm, state:

1. What does one vertex represent?
2. What does an edge represent?
3. Is the edge directed?
4. What does its weight mean?
5. Can the graph contain parallel edges, self-loops, or disconnected components?

A grid cell can be a vertex; a legal move is an edge. A word can be a vertex; changing one character is an edge. A state containing position, keys, and remaining resources can be a vertex even when no graph is explicitly given.

### Representation tradeoffs

| Representation | Space | Edge lookup | Iterate neighbors |
|---|---:|---:|---:|
| Adjacency list | O(V+E) | O(degree) | O(degree) |
| Adjacency matrix | O(V²) | O(1) | O(V) |
| Edge list | O(E) | O(E) | O(E) |
| Implicit neighbors | State only | Generated | Depends on moves |

For undirected adjacency lists, store each edge twice. Traversal remains O(V+E) because the factor of two is constant.

### Complexity uses the modeled graph

If each of r·c grid cells has at most four neighbors, V=rc and E=O(rc). If a state adds a bitmask of k keys, V may become rc·2^k.
    `,
    diagram: `flowchart LR
      A["Real problem"] --> B["Choose state as vertex"]
      B --> C["Choose legal transition as edge"]
      C --> D["Add direction and weight meaning"]
      D --> E["Count V and E"]
      E --> F["Select algorithm"]`,
    code: `def build_graph(vertex_count, edges, directed=False):
    graph = [[] for _ in range(vertex_count)]
    for source, target, weight in edges:
        graph[source].append((target, weight))
        if not directed:
            graph[target].append((source, weight))
    return graph`,
  },
  {
    id: "bfs-dfs-invariants-expanded",
    title: "BFS and DFS Invariants",
    type: "theory",
    content: `
## The data structure determines exploration order

### BFS invariant

Vertices leave the queue in nondecreasing shortest distance from the source when every edge has equal cost. Mark a vertex visited when it is enqueued, not when dequeued, to prevent duplicate queue entries.

### DFS invariant

The recursion stack is the current path. A vertex is fully processed only after all outgoing neighbors are explored. Entry and exit events enable cycle detection, topological sorting, low-link algorithms, and subtree-style summaries.

| Need | Choose |
|---|---|
| Fewest unweighted edges | BFS |
| Layer distances | BFS |
| Components or reachability | Either |
| Directed cycle / finishing order | DFS colors |
| Recursive structural exploration | DFS |

### Parent tracking

Store parent when a vertex is first discovered. Reconstruct a path by walking parents backward from the target. Storing a whole copied path in every queue entry can use quadratic memory.

### Disconnected graphs

One traversal covers only the start component. Loop over every vertex and launch traversal from each unvisited vertex to count or process all components.
    `,
    diagram: `flowchart LR
      A["Discover source at distance 0"] --> B["Queue layer 1"]
      B --> C["Queue layer 2"]
      C --> D["Queue layer 3"]
      E["DFS entry"] --> F["current recursion path"]
      F --> G["DFS exit after neighbors"]`,
    code: `from collections import deque

def bfs_shortest_path(graph, source, target):
    parent = {source: None}
    queue = deque([source])

    while queue:
        node = queue.popleft()
        if node == target:
            break
        for neighbor in graph[node]:
            if neighbor not in parent:
                parent[neighbor] = node
                queue.append(neighbor)

    if target not in parent:
        return None
    path = []
    node = target
    while node is not None:
        path.append(node)
        node = parent[node]
    return path[::-1]`,
  },
  {
    id: "graph-components-cycles-bipartite",
    title: "Components, Cycle Detection, and Bipartite Graphs",
    type: "theory",
    content: `
## Small changes in graph type change the invariant

### Undirected cycle

Seeing a visited neighbor is not enough because the edge back to the parent is expected. A cycle exists when an explored vertex sees a visited neighbor other than its parent. Parallel edges require edge IDs for complete correctness.

### Directed cycle

Use three colors: unvisited, visiting, finished. An edge to a visiting vertex is a back edge and proves a directed cycle. An edge to a finished vertex is safe.

### Bipartite graph

Try to color each endpoint of every edge with opposite colors. A conflict means an odd cycle exists. BFS or DFS colors one connected component at a time.

### Components

- Undirected connected components: BFS, DFS, or union-find.
- Directed reachability components are not SCCs.
- Strongly connected components require mutual reachability and specialized algorithms.

These distinctions should be stated before code; many graph bugs come from applying an undirected invariant to directed edges or vice versa.
    `,
    diagram: `flowchart TD
      A["Graph type"] --> B{"Directed?"}
      B -->|no| C["visited neighbor ≠ parent → cycle"]
      B -->|yes| D["edge to visiting color → cycle"]
      A --> E{"Need bipartite?"}
      E -->|yes| F["alternate two colors"]
      F --> G["same-color edge → odd cycle"]`,
    code: `from collections import deque

def is_bipartite(graph):
    color = {}
    for start in range(len(graph)):
        if start in color:
            continue
        color[start] = 0
        queue = deque([start])
        while queue:
            node = queue.popleft()
            for neighbor in graph[node]:
                if neighbor not in color:
                    color[neighbor] = 1 - color[node]
                    queue.append(neighbor)
                elif color[neighbor] == color[node]:
                    return False
    return True`,
  },
  {
    id: "topological-dag-dp-expanded",
    title: "Topological Order and Dynamic Programming on DAGs",
    type: "theory",
    content: `
## A topological order is a dependency schedule

For every directed edge u→v, u appears before v. Such an order exists exactly when the directed graph is acyclic.

### Kahn's algorithm

Track indegrees. Enqueue every zero-indegree vertex, remove one, and decrement outgoing neighbors. If fewer than V vertices are processed, a cycle prevents completion.

### DFS method

Append a vertex after exploring all outgoing neighbors, then reverse finishing order. A visiting-color edge detects a cycle.

### DAG shortest and longest paths

Once topologically ordered, relax edges once in order. Negative weights are allowed because there are no cycles. This solves longest paths too, which are hard in general cyclic graphs.

### Non-uniqueness

If Kahn's queue contains multiple vertices, multiple valid orders exist. A min-heap can produce the lexicographically smallest valid order.

Topological sort is not an ordering by numeric label or DFS discovery time; it is an ordering that respects every dependency edge.
    `,
    diagram: `flowchart LR
      A["indegree 0 nodes"] --> B["remove one"]
      B --> C["append to order"]
      C --> D["decrement outgoing indegrees"]
      D --> E["new indegree 0 nodes"]
      E --> B
      E --> F["processed < V means cycle"]`,
    code: `from collections import deque

def topological_sort(graph):
    indegree = [0] * len(graph)
    for node in range(len(graph)):
        for neighbor in graph[node]:
            indegree[neighbor] += 1

    queue = deque(node for node, degree in enumerate(indegree) if degree == 0)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    return order if len(order) == len(graph) else None`,
  },
  {
    id: "shortest-path-selection-expanded",
    title: "Shortest-Path Algorithm Selection",
    type: "theory",
    content: `
## Edge weights determine the correct algorithm

| Edge model | Algorithm | Typical complexity |
|---|---|---:|
| Every edge equal | BFS | O(V+E) |
| Weights only 0 or 1 | 0-1 BFS with deque | O(V+E) |
| Nonnegative weights | Dijkstra | O((V+E) log V) |
| Negative edges, no negative cycle reachable | Bellman–Ford | O(VE) |
| DAG, any weights | Topological relaxation | O(V+E) |
| All pairs, dense or small graph | Floyd–Warshall | O(V³) |

### Relaxation

For edge u→v with weight w, if distance[u]+w improves distance[v], update it and record u as parent. Every shortest-path algorithm differs mainly in the order and number of relaxations.

### Negative cycles

If a reachable negative cycle can reach the destination, no finite shortest path exists; cost can decrease without bound. One extra Bellman–Ford pass identifies vertices still improvable.

### State expansion

Constraints such as limited stops, coupons, keys, or direction can be added to the vertex state. Then run the appropriate shortest-path algorithm over (original node, extra state).
    `,
    diagram: `flowchart TD
      A["Shortest path problem"] --> B{"All weights equal?"}
      B -->|yes| C["BFS"]
      B -->|no| D{"Weights 0 or 1?"}
      D -->|yes| E["0-1 BFS"]
      D -->|no| F{"Any negative edge?"}
      F -->|no| G["Dijkstra"]
      F -->|yes| H{"DAG?"}
      H -->|yes| I["Topological relaxation"]
      H -->|no| J["Bellman-Ford"]`,
    code: `from collections import deque

def zero_one_bfs(graph, source):
    distance = [float("inf")] * len(graph)
    distance[source] = 0
    queue = deque([source])

    while queue:
        node = queue.popleft()
        for neighbor, weight in graph[node]:
            candidate = distance[node] + weight
            if candidate < distance[neighbor]:
                distance[neighbor] = candidate
                if weight == 0:
                    queue.appendleft(neighbor)
                else:
                    queue.append(neighbor)
    return distance`,
  },
  {
    id: "mst-connectivity-expanded",
    title: "Connectivity Structures and Minimum Spanning Trees",
    type: "theory",
    content: `
## Reachability, cheapest connection, and shortest path are different goals

A minimum spanning tree connects all vertices with minimum total edge weight. It does not minimize distance from a chosen source.

### Kruskal

Sort edges by weight and add an edge when its endpoints belong to different components. Union-find provides near-constant amortized connectivity checks. The selected edges remain a forest contained in some MST.

### Prim

Grow one tree from any start vertex. A heap stores boundary edges. Repeatedly take the lightest edge reaching an unvisited vertex.

### Union-find invariant

Each set has a representative root. Path compression shortens find paths; union by size or rank prevents tall trees. Together operations cost O(α(n)) amortized.

### Disconnected graphs

Kruskal naturally returns a minimum spanning forest. If a single MST is required, verify exactly V-1 edges were selected.

The cut property is the proof: the lightest edge crossing a cut that respects current selections is safe.
    `,
    diagram: `flowchart LR
      A["Sort edges"] --> B["lightest remaining edge"]
      B --> C{"endpoints already connected?"}
      C -->|yes| D["skip cycle edge"]
      C -->|no| E["union components and select"]
      D --> B
      E --> B`,
    code: `def minimum_spanning_tree(vertex_count, edges):
    parent = list(range(vertex_count))
    size = [1] * vertex_count

    def find(node):
        if parent[node] != node:
            parent[node] = find(parent[node])
        return parent[node]

    total, selected = 0, []
    for weight, first, second in sorted(edges):
        root_a, root_b = find(first), find(second)
        if root_a == root_b:
            continue
        if size[root_a] < size[root_b]:
            root_a, root_b = root_b, root_a
        parent[root_b] = root_a
        size[root_a] += size[root_b]
        total += weight
        selected.append((first, second, weight))

    return (total, selected) if len(selected) == vertex_count - 1 else None`,
  },
  {
    id: "graph-decomposition-expanded",
    title: "SCCs, Bridges, and Articulation Points",
    type: "theory",
    content: `
## Decompose a graph into meaningful structural pieces

### Strongly connected components

In a directed graph, every vertex in an SCC reaches every other. Contracting each SCC creates a DAG. Tarjan uses discovery indices, low-link values, and an active stack; Kosaraju uses finishing order plus the reversed graph.

### Bridges

An undirected DFS tree edge u→v is a bridge when low[v] > discovery[u]. The v subtree has no back edge reaching u or an ancestor, so removing the edge disconnects it.

### Articulation points

A non-root u is an articulation point if some child v has low[v] ≥ discovery[u]. A DFS root is an articulation point when it has at least two DFS children.

### Low-link interpretation

low[u] is the earliest discovery index reachable from u's DFS subtree using tree edges downward and at most one back edge upward.

Use edge IDs rather than only parent vertices when parallel undirected edges may exist; the second parallel edge is a valid back edge.
    `,
    diagram: `flowchart TD
      A["DFS subtree at v"] --> B{"back edge reaches above u?"}
      B -->|yes: low[v] ≤ disc[u]| C["tree edge u-v is not bridge"]
      B -->|no: low[v] > disc[u]| D["u-v is bridge"]
      E["Contract each directed SCC"] --> F["condensation DAG"]`,
    code: `def find_bridges(graph):
    discovery = [-1] * len(graph)
    low = [0] * len(graph)
    timer = 0
    bridges = []

    def dfs(node, parent_edge):
        nonlocal timer
        discovery[node] = low[node] = timer
        timer += 1
        for neighbor, edge_id in graph[node]:
            if edge_id == parent_edge:
                continue
            if discovery[neighbor] == -1:
                dfs(neighbor, edge_id)
                low[node] = min(low[node], low[neighbor])
                if low[neighbor] > discovery[node]:
                    bridges.append(edge_id)
            else:
                low[node] = min(low[node], discovery[neighbor])

    for node in range(len(graph)):
        if discovery[node] == -1:
            dfs(node, -1)
    return bridges`,
  },
  {
    id: "flow-matching-expanded",
    title: "Network Flow and Matching Mental Models",
    type: "theory",
    content: `
## Residual capacity makes choices reversible

A flow network has a source, sink, capacities, conservation at internal vertices, and flow no greater than capacity.

The residual graph contains:

- Forward residual capacity: how much more flow can be sent.
- Reverse residual capacity: how much existing flow can be undone.

An augmenting path sends its bottleneck residual capacity. Reverse edges are why an early path choice does not permanently trap the algorithm.

### Max-flow min-cut theorem

Maximum source-to-sink flow equals the minimum total capacity of edges crossing a source/sink cut. When no augmenting path remains, vertices reachable in the residual graph identify a minimum cut.

### Bipartite matching

Connect source to every left vertex, allowed pairs left-to-right, and right vertices to sink, all capacity 1. Integral max flow corresponds to a matching.

Applications include assignment, disjoint paths, image segmentation, project selection, and scheduling. Model vertex capacities by splitting a vertex into in and out nodes.
    `,
    diagram: `flowchart LR
      S["source"] --> L1["left A"]
      S --> L2["left B"]
      L1 --> R1["right X"]
      L1 --> R2["right Y"]
      L2 --> R2
      R1 --> T["sink"]
      R2 --> T
      T -. "reverse residual edges undo choices" .-> S`,
    code: `def bipartite_match(graph, right_size):
    matched_left = [-1] * right_size

    def augment(left, seen):
        for right in graph[left]:
            if seen[right]:
                continue
            seen[right] = True
            if matched_left[right] == -1 or augment(matched_left[right], seen):
                matched_left[right] = left
                return True
        return False

    matches = 0
    for left in range(len(graph)):
        if augment(left, [False] * right_size):
            matches += 1
    return matches, matched_left`,
  },
  {
    id: "implicit-state-graphs",
    title: "Implicit Graphs, Grids, and State Expansion",
    type: "theory",
    content: `
## Generate neighbors instead of storing every edge

Many problems define a graph through legal moves:

- Grid navigation.
- Word ladder transformations.
- Lock combinations.
- Board games.
- Strings plus cursor position.
- Position plus collected-key bitmask.

### State completeness

Two histories may share one visited state only if their future possibilities and future costs are identical. Reaching the same cell with different keys, remaining obstacle eliminations, or direction may require distinct states.

### Multi-source BFS

Enqueue every source at distance 0 before traversal. The first time a vertex is discovered gives its distance to the nearest source. Examples: rotting oranges, distance to nearest zero, and spreading processes.

### Bidirectional BFS

For unweighted single-source single-target search with reversible moves, expand from both ends and stop when frontiers meet. Each frontier explores roughly half the depth, often reducing exponential search dramatically.

### Coordinate safety

Validate bounds before indexing, define whether diagonal movement exists, and mark visited at enqueue time. Mutation can serve as visited storage if preserving the input is not required.
    `,
    diagram: `flowchart LR
      A["history"] --> B["minimal state tuple"]
      B --> C["generate legal neighbors"]
      C --> D["visited by complete state"]
      D --> E["BFS / Dijkstra / A*"]
      F["many sources"] --> G["enqueue all at distance 0"]
      G --> E`,
    code: `from collections import deque

def shortest_path_with_eliminations(grid, eliminations):
    rows, cols = len(grid), len(grid[0])
    queue = deque([(0, 0, eliminations, 0)])
    best_remaining = {(0, 0): eliminations}

    while queue:
        row, col, remaining, distance = queue.popleft()
        if (row, col) == (rows - 1, cols - 1):
            return distance

        for row_step, col_step in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            next_row, next_col = row + row_step, col + col_step
            if not (0 <= next_row < rows and 0 <= next_col < cols):
                continue
            next_remaining = remaining - grid[next_row][next_col]
            if next_remaining < 0:
                continue
            if next_remaining <= best_remaining.get((next_row, next_col), -1):
                continue
            best_remaining[(next_row, next_col)] = next_remaining
            queue.append((next_row, next_col, next_remaining, distance + 1))
    return -1`,
  },
  {
    id: "graph-correctness-testing",
    title: "Graph Correctness, Complexity, and Testing",
    type: "theory",
    content: `
## Test graph properties, not only example outputs

### Edge cases

- Zero or one vertex.
- Disconnected vertices and multiple components.
- Self-loops and parallel edges.
- Directed versus undirected interpretation.
- Zero, negative, and very large weights.
- Cycles, DAGs, and unreachable targets.
- Dense and chain-like graphs.

### Useful invariants

- BFS distances differ by at most one across an unweighted tree edge.
- A topological order places every edge source before its target.
- An MST on a connected graph has V-1 edges and no cycle.
- Dijkstra finalized distances never decrease with nonnegative edges.
- Every matched vertex participates in at most one matching edge.

### Complexity audit

State exactly how adjacency is represented. A matrix traversal may be O(V²); a list traversal is O(V+E). Clearing a visited array inside a loop or copying whole paths can silently add factors.

### Differential testing

Compare Dijkstra with Bellman–Ford on tiny nonnegative graphs, union-find connectivity with BFS, or optimized matching with exhaustive enumeration. Verify returned paths edge-by-edge and recompute their cost independently.
    `,
    diagram: `flowchart LR
      A["Generate tiny graph"] --> B["Run optimized algorithm"]
      A --> C["Run slow oracle"]
      B --> D{"answers + invariants match?"}
      C --> D
      D -->|no| E["shrink vertices and edges"]
      D -->|yes| F["vary direction, weight, connectivity"]`,
    code: `def validate_topological_order(graph, order):
    if order is None or len(order) != len(graph):
        return False
    position = {node: index for index, node in enumerate(order)}
    if len(position) != len(graph):
        return False
    return all(position[node] < position[neighbor]
               for node in range(len(graph))
               for neighbor in graph[node])`,
  },
];
