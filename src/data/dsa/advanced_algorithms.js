export const advancedAlgorithmsTopic = {
  id: "advanced-algorithms",
  title: "Advanced Algorithms & Competitive Toolkit",
  description: "Graph decomposition, network flow, advanced strings, number theory, geometry, offline queries, and randomized techniques",
  icon: "Network",
  sections: [
    {
      id: "strongly-connected-components",
      title: "Strongly Connected Components",
      type: "theory",
      content: `
## Compress cycles into a directed acyclic graph

In a directed graph, a **strongly connected component (SCC)** is a maximal group in which every vertex can reach every other vertex. If each SCC is contracted into one super-node, the resulting **condensation graph** is always a DAG.

### Two linear-time algorithms

| Algorithm | Core idea | Time |
|---|---|---:|
| Kosaraju | DFS finish order, reverse edges, DFS again | O(V+E) |
| Tarjan | One DFS with discovery and low-link values | O(V+E) |

For Tarjan, **low[u]** is the earliest discovery index reachable from u through DFS-tree edges plus at most one edge to a node still on the active stack. When **low[u] == index[u]**, u is the root of an SCC.

### Uses

- Detect mutually dependent modules.
- Reduce 2-SAT to SCCs.
- Find cycles and reason about reachability between cyclic regions.
- Convert a general directed graph into a DAG for later DP.
      `,
      diagram: `flowchart LR
        A["Cycle A-B-C"] --> X["SCC 1"]
        D["Cycle D-E"] --> Y["SCC 2"]
        X --> Y
        Y --> Z["SCC 3: F"]`,
      code: `def strongly_connected_components(graph):
    n = len(graph)
    index = 0
    indices = [-1] * n
    low = [0] * n
    stack, on_stack, components = [], [False] * n, []

    def dfs(node):
        nonlocal index
        indices[node] = low[node] = index
        index += 1
        stack.append(node)
        on_stack[node] = True

        for neighbor in graph[node]:
            if indices[neighbor] == -1:
                dfs(neighbor)
                low[node] = min(low[node], low[neighbor])
            elif on_stack[neighbor]:
                low[node] = min(low[node], indices[neighbor])

        if low[node] == indices[node]:
            component = []
            while True:
                member = stack.pop()
                on_stack[member] = False
                component.append(member)
                if member == node:
                    break
            components.append(component)

    for node in range(n):
        if indices[node] == -1:
            dfs(node)
    return components`,
    },
    {
      id: "bridges-articulation-euler",
      title: "Bridges, Articulation Points, and Euler Paths",
      type: "theory",
      content: `
## Critical connectivity in undirected graphs

A **bridge** is an edge whose removal increases the number of connected components. An **articulation point** is a vertex with the same property. DFS discovery times and low-link values find both in O(V+E).

For DFS edge u→v, if **low[v] > discovery[u]**, the subtree at v has no back edge escaping above u, so (u,v) is a bridge.

### Euler paths use every edge once

Do not confuse Euler paths with Hamiltonian paths, which visit every vertex once.

| Undirected graph | Condition, ignoring isolated vertices |
|---|---|
| Euler circuit | Connected and every degree is even |
| Euler path | Connected and exactly 0 or 2 vertices have odd degree |

Hierholzer's algorithm repeatedly follows unused edges and splices cycles, taking O(E). Use an edge ID so parallel edges are handled correctly.
      `,
      diagram: `flowchart TD
        A["DFS edge u→v"] --> B{"Can v-subtree reach an ancestor of u?"}
        B -->|yes: low[v] ≤ disc[u]| C["Not a bridge"]
        B -->|no: low[v] > disc[u]| D["Bridge"]`,
      code: `def find_bridges(graph):
    n = len(graph)
    timer = 0
    discovered = [-1] * n
    low = [0] * n
    bridges = []

    def dfs(node, parent):
        nonlocal timer
        discovered[node] = low[node] = timer
        timer += 1
        for neighbor in graph[node]:
            if neighbor == parent:
                continue
            if discovered[neighbor] == -1:
                dfs(neighbor, node)
                low[node] = min(low[node], low[neighbor])
                if low[neighbor] > discovered[node]:
                    bridges.append((node, neighbor))
            else:
                low[node] = min(low[node], discovered[neighbor])

    for node in range(n):
        if discovered[node] == -1:
            dfs(node, -1)
    return bridges`,
    },
    {
      id: "network-flow-and-matching",
      title: "Network Flow and Bipartite Matching",
      type: "theory",
      content: `
## Move as much as possible through a capacitated network

A flow network has a source, sink, directed capacities, flow conservation at internal vertices, and **0 ≤ flow ≤ capacity** on every edge. The **max-flow min-cut theorem** says maximum flow value equals the capacity of the minimum source–sink cut.

### Residual graph

Every sent unit reduces forward residual capacity and increases reverse residual capacity. Reverse edges let later augmenting paths undo earlier choices—this is essential for correctness.

| Algorithm | Main rule | Typical bound |
|---|---|---:|
| Ford–Fulkerson | Any augmenting path | Depends on capacities/path choice |
| Edmonds–Karp | BFS shortest augmenting path | O(VE²) |
| Dinic | BFS levels + blocking flows | O(V²E), often much faster |

### Bipartite matching reduction

Connect source→left side, allowed left→right pairs, and right side→sink, all with capacity 1. Maximum flow equals maximum matching. This models assignments, jobs, pairings, and schedules.
      `,
      diagram: `flowchart LR
        S["source"] -->|"capacity 1"| L1["worker A"]
        S -->|"capacity 1"| L2["worker B"]
        L1 --> R1["job X"]
        L1 --> R2["job Y"]
        L2 --> R2
        R1 -->|"capacity 1"| T["sink"]
        R2 -->|"capacity 1"| T`,
      code: `from collections import deque

def edmonds_karp(capacity, source, sink):
    n = len(capacity)
    residual = [row[:] for row in capacity]
    total = 0

    while True:
        parent = [-1] * n
        parent[source] = source
        queue = deque([source])
        while queue and parent[sink] == -1:
            node = queue.popleft()
            for neighbor, available in enumerate(residual[node]):
                if available > 0 and parent[neighbor] == -1:
                    parent[neighbor] = node
                    queue.append(neighbor)

        if parent[sink] == -1:
            return total

        amount = float("inf")
        node = sink
        while node != source:
            amount = min(amount, residual[parent[node]][node])
            node = parent[node]

        node = sink
        while node != source:
            previous = parent[node]
            residual[previous][node] -= amount
            residual[node][previous] += amount
            node = previous
        total += amount`,
    },
    {
      id: "advanced-string-indexes",
      title: "Aho–Corasick, Suffix Arrays, and Suffix Automata",
      type: "theory",
      content: `
## Index repeated text questions

| Structure | Best question | Typical construction |
|---|---|---:|
| Trie | Does a word/prefix exist? | O(total pattern length) |
| Aho–Corasick | Find many patterns in one text | O(patterns + text + matches) |
| Suffix array | Sorted suffix queries | O(n log n) common |
| Suffix automaton | All substrings and occurrence structure | O(n) |
| Suffix tree | Rich suffix queries | O(n), complex implementation |

### Aho–Corasick

Build a trie of patterns, then failure links that point to the longest suffix also present in the trie. While scanning text, a mismatch follows failure links instead of restarting.

### Suffix array

Store starting indices of suffixes in lexicographic order. Binary search finds a pattern range. An LCP array stores longest common prefixes of adjacent suffixes and supports repeated-substring problems.

### Suffix automaton

Each state represents an equivalence class of substrings with the same set of ending positions. It compactly recognizes every substring and can count distinct substrings.
      `,
      diagram: `flowchart TD
        A["Pattern trie"] --> B["Add failure links by BFS"]
        B --> C["Scan text once"]
        C --> D{"Transition exists?"}
        D -->|yes| E["Advance and report outputs"]
        D -->|no| F["Follow failure link"]
        F --> D`,
      code: `def build_suffix_array(text):
    n = len(text)
    order = list(range(n))
    rank = [ord(char) for char in text]
    width = 1

    while width < n:
        order.sort(key=lambda i: (rank[i], rank[i + width] if i + width < n else -1))
        next_rank = [0] * n
        for position in range(1, n):
            previous, current = order[position - 1], order[position]
            previous_key = (rank[previous], rank[previous + width] if previous + width < n else -1)
            current_key = (rank[current], rank[current + width] if current + width < n else -1)
            next_rank[current] = next_rank[previous] + (current_key != previous_key)
        rank = next_rank
        width *= 2
    return order`,
    },
    {
      id: "number-theory",
      title: "Number Theory: GCD, Primes, and Modular Arithmetic",
      type: "theory",
      content: `
## Arithmetic algorithms are data structures for integers

### Core tools

- Euclid: **gcd(a,b)=gcd(b,a mod b)**, O(log min(a,b)).
- Extended Euclid: finds x,y with ax+by=gcd(a,b).
- Sieve of Eratosthenes: all primes through n in O(n log log n).
- Fast exponentiation: a^b in O(log b).
- Modular inverse: a⁻¹ mod m exists exactly when gcd(a,m)=1.

### Modular rules

Addition, subtraction, and multiplication can be reduced modulo m at each step. Division cannot: divide by a only by multiplying by its modular inverse when that inverse exists.

For prime p, Fermat gives **a^(p-1) ≡ 1 (mod p)** when p does not divide a, so the inverse is **a^(p-2) mod p**.

### Prime factorization

Trial division through √n is enough for one moderate integer. For many queries, precompute a smallest-prime-factor array. Advanced large-integer factorization may use Miller–Rabin primality testing and Pollard's rho.
      `,
      diagram: `flowchart LR
        A["gcd(a,b)"] --> B["gcd(b, a mod b)"]
        B --> C{"remainder = 0?"}
        C -->|no| B
        C -->|yes| D["current divisor is gcd"]`,
      code: `def gcd(a, b):
    while b:
        a, b = b, a % b
    return abs(a)


def sieve(limit):
    is_prime = [True] * (limit + 1)
    if limit >= 0:
        is_prime[0] = False
    if limit >= 1:
        is_prime[1] = False
    candidate = 2
    while candidate * candidate <= limit:
        if is_prime[candidate]:
            for multiple in range(candidate * candidate, limit + 1, candidate):
                is_prime[multiple] = False
        candidate += 1
    return [value for value, prime in enumerate(is_prime) if prime]


def modular_power(base, exponent, modulus):
    result = 1
    while exponent:
        if exponent & 1:
            result = result * base % modulus
        base = base * base % modulus
        exponent >>= 1
    return result`,
    },
    {
      id: "combinatorics-modulo",
      title: "Combinatorics and Probability for Algorithms",
      type: "theory",
      content: `
## Count without enumerating

### Fundamental principles

- Product rule: independent stages with a and b choices give a·b outcomes.
- Sum rule: mutually exclusive families add.
- Permutations: order matters.
- Combinations: choose k from n without order.
- Inclusion–exclusion: add individual counts, subtract overlaps, continue alternating.
- Pigeonhole principle: more objects than boxes forces a collision.

### Binomial coefficients

Pascal's recurrence is **C(n,k)=C(n-1,k-1)+C(n-1,k)**. A DP row computes all values in O(nk). Under a prime modulus, precompute factorials and inverse factorials to answer each nCk query in O(1).

### Expected value

Linearity of expectation works even when events are dependent: define indicator variables and add their probabilities. This often simplifies randomized-algorithm and hashing analysis.

Be explicit about whether selections are ordered, repeated, distinguishable, or constrained; most counting mistakes begin there.
      `,
      diagram: `flowchart TD
        A["Counting problem"] --> B{"Order matters?"}
        B -->|yes| C["Permutations"]
        B -->|no| D["Combinations"]
        A --> E{"Overlapping cases?"}
        E -->|yes| F["Inclusion-exclusion"]
        A --> G{"Random outcome?"}
        G -->|yes| H["Indicators + expectation"]`,
      code: `def combinations_mod(maximum, modulus):
    factorial = [1] * (maximum + 1)
    for value in range(1, maximum + 1):
        factorial[value] = factorial[value - 1] * value % modulus

    inverse_factorial = [1] * (maximum + 1)
    inverse_factorial[maximum] = pow(factorial[maximum], modulus - 2, modulus)
    for value in range(maximum, 0, -1):
        inverse_factorial[value - 1] = inverse_factorial[value] * value % modulus

    def choose(n, k):
        if k < 0 or k > n:
            return 0
        return factorial[n] * inverse_factorial[k] % modulus * inverse_factorial[n - k] % modulus

    return choose`,
    },
    {
      id: "computational-geometry",
      title: "Computational Geometry Foundations",
      type: "theory",
      content: `
## Reduce geometry to robust predicates

For points O, A, B, the 2D cross product **(A-O)×(B-O)** tells orientation:

- Positive: counterclockwise turn.
- Negative: clockwise turn.
- Zero: collinear.

This one predicate powers segment intersection, convex hulls, polygon area, and point location.

### Convex hull

Andrew's monotonic chain sorts points, builds lower and upper hulls, and removes the last point while the turn violates the chosen orientation. Time is O(n log n), dominated by sorting.

### Numeric discipline

- Prefer integer cross products when coordinates are integers.
- Avoid comparing floating values for exact equality; use a scale-aware tolerance.
- State whether collinear boundary points belong on the hull.
- Squared distance avoids unnecessary square roots when only comparing distances.

The shoelace formula computes twice a polygon's signed area by summing cross products of consecutive vertices.
      `,
      diagram: `flowchart LR
        O["O"] --> A["A"]
        A --> B["B"]
        B --> C{"cross(OA, OB)"}
        C -->|positive| D["counterclockwise"]
        C -->|zero| E["collinear"]
        C -->|negative| F["clockwise"]`,
      code: `def cross(origin, a, b):
    return ((a[0] - origin[0]) * (b[1] - origin[1])
            - (a[1] - origin[1]) * (b[0] - origin[0]))


def convex_hull(points):
    points = sorted(set(points))
    if len(points) <= 1:
        return points

    lower = []
    for point in points:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], point) <= 0:
            lower.pop()
        lower.append(point)

    upper = []
    for point in reversed(points):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], point) <= 0:
            upper.pop()
        upper.append(point)

    return lower[:-1] + upper[:-1]`,
    },
    {
      id: "offline-range-queries",
      title: "Offline Queries, Sparse Tables, and Mo's Algorithm",
      type: "theory",
      content: `
## Reorder questions when answers need not be produced immediately

An **online** algorithm must answer each query before seeing the next. An **offline** algorithm receives all queries and may reorder them to reduce total work.

### Static range tools

| Tool | Preprocess | Query | Updates | Operation |
|---|---:|---:|---|---|
| Prefix sum | O(n) | O(1) | No | Invertible sums/counts |
| Sparse table | O(n log n) | O(1) | No | Idempotent min/max/gcd |
| Segment tree | O(n) | O(log n) | Yes | Associative operations |
| Mo's algorithm | About O((n+q)√n) | Offline total | Variants | Add/remove-friendly window |

Mo's algorithm sorts queries by blocks of the left endpoint, then by right endpoint. The current range moves gradually; maintain the answer by adding or removing one endpoint at a time.

Other offline patterns include sorting events with queries, parallel binary search, DSU rollback, and divide-and-conquer over time.
      `,
      diagram: `flowchart LR
        A["All range queries"] --> B["Sort by left block, then right"]
        B --> C["Move current L/R"]
        C --> D["Add or remove one value"]
        D --> E["Record answer"]
        E --> C`,
      code: `from math import isqrt

def distinct_in_ranges(values, queries):
    block = max(1, isqrt(len(values)))
    ordered = sorted(enumerate(queries), key=lambda item: (item[1][0] // block, item[1][1]))
    counts, answers = {}, [0] * len(queries)
    left, right, distinct = 0, -1, 0

    def add(value):
        nonlocal distinct
        if counts.get(value, 0) == 0:
            distinct += 1
        counts[value] = counts.get(value, 0) + 1

    def remove(value):
        nonlocal distinct
        counts[value] -= 1
        if counts[value] == 0:
            distinct -= 1

    for query_index, (query_left, query_right) in ordered:
        while left > query_left:
            left -= 1; add(values[left])
        while right < query_right:
            right += 1; add(values[right])
        while left < query_left:
            remove(values[left]); left += 1
        while right > query_right:
            remove(values[right]); right -= 1
        answers[query_index] = distinct
    return answers`,
    },
    {
      id: "randomized-amortized-lower-bounds",
      title: "Randomization, Amortized Analysis, and Lower Bounds",
      type: "theory",
      content: `
## Advanced analysis asks what guarantee is actually being made

### Randomized algorithms

- **Las Vegas:** always correct; runtime is random, such as randomized quickselect.
- **Monte Carlo:** bounded runtime; may have small error probability, such as probabilistic primality or hashing.

Randomization can prevent adversarial inputs from consistently triggering a deterministic worst case. Always state the source of randomness and what probability guarantee remains.

### Amortized analysis

An individual dynamic-array append may cost O(n) during resize, yet a sequence of n appends costs O(n), so each append is O(1) amortized. Aggregate, accounting, and potential methods are three ways to prove sequence costs.

### Lower bounds and reductions

- Comparison sorting needs Ω(n log n) comparisons in the worst case.
- Reading all n input items already costs Ω(n).
- A reduction transforms problem A into B. If A is known hard, an efficient B would imply an efficient A.

Distinguish worst-case, expected, amortized, and high-probability bounds; they answer different questions.
      `,
      diagram: `flowchart TD
        A["Performance claim"] --> B{"Across what?"}
        B --> C["One worst input: worst-case"]
        B --> D["Random choices: expected"]
        B --> E["Operation sequence: amortized"]
        B --> F["All algorithms in model: lower bound"]`,
      code: `class DynamicArray:
    def __init__(self):
        self.capacity = 1
        self.length = 0
        self.data = [None]

    def append(self, value):
        if self.length == self.capacity:
            old = self.data
            self.capacity *= 2
            self.data = [None] * self.capacity
            for index in range(self.length):
                self.data[index] = old[index]
        self.data[self.length] = value
        self.length += 1

# Although a resize copies many values, every value is copied only
# when capacity doubles, so n appends perform O(n) total copying.`,
    },
  ],
};
