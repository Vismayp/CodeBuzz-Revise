export const expandedGreedySections = [
  {
    id: "greedy-mental-model",
    title: "The Greedy Mental Model: Commit Without Reconsidering",
    type: "theory",
    content: `
## A greedy algorithm makes an irreversible locally best choice

At every step, a greedy algorithm selects the choice that looks best under a precise rule, commits to it, and reduces the remaining problem. It does not explore every choice and it does not keep a table of alternative histories.

That speed creates a proof obligation: **why can this local commitment never destroy all globally optimal solutions?**

### Four ingredients

1. **Candidate set:** choices still available.
2. **Selection rule:** which candidate is locally preferred.
3. **Feasibility rule:** whether adding it preserves constraints.
4. **Objective:** what the finished solution minimizes or maximizes.

### Example: maximum non-overlapping intervals

Choose the compatible interval that finishes earliest. It leaves at least as much time for every future interval as any other first choice.

| Step | Greedy question |
|---|---|
| Order | Which key exposes the safe choice? |
| Select | Which feasible candidate is best now? |
| Commit | What information can be discarded forever? |
| Prove | Why does an optimal solution exist containing this choice? |

Greedy is a strategy, not a synonym for sorting. Sorting often reveals choices, but heaps, graph cuts, and local scans can also implement a greedy rule.
    `,
    diagram: `flowchart LR
      A["Candidates"] --> B["Choose locally best"]
      B --> C{"Feasible?"}
      C -->|yes| D["Commit permanently"]
      C -->|no| E["Discard candidate"]
      D --> F["Smaller problem"]
      E --> F
      F --> B`,
    code: `def select_maximum_activities(intervals):
    intervals = sorted(intervals, key=lambda interval: interval[1])
    selected = []
    last_end = float("-inf")

    for start, end in intervals:
        if start >= last_end:
            selected.append((start, end))
            last_end = end
    return selected`,
  },
  {
    id: "greedy-choice-optimal-substructure",
    title: "Greedy-Choice Property and Optimal Substructure",
    type: "theory",
    content: `
## Two properties are needed

### Greedy-choice property

There is at least one optimal solution that begins with the greedy choice. This does not mean every optimal solution makes that choice; it means an optimal solution can be transformed to include it without becoming worse.

### Optimal substructure

After the first choice is fixed, the remaining decisions form a smaller instance whose optimal solution completes the original optimum.

DP also relies on optimal substructure. The difference is uncertainty:

| Technique | Treatment of the next choice |
|---|---|
| Greedy | Proves one choice is safe and discards alternatives |
| Dynamic programming | Evaluates competing choices and stores the best state |
| Backtracking | Explores choices, undoing them when needed |

### A diagnostic test

Suppose the proposed first choice is replaced by another candidate from an optimal solution. Can the rest of the solution remain feasible without reducing quality? If yes, an exchange proof may exist. If not, look for a counterexample or a richer state.

### Prefix invariant

Many greedy algorithms maintain: **after k commitments, the partial solution can still be extended to some global optimum.** Initialization is trivial. The exchange argument proves maintenance. At termination, the partial solution is complete and optimal.
    `,
    diagram: `flowchart TD
      A["Optimal solution OPT"] --> B{"Contains greedy choice?"}
      B -->|yes| C["Reduce to remaining subproblem"]
      B -->|no| D["Exchange OPT's first choice"]
      D --> E["No worse and still feasible"]
      E --> C`,
    code: `def erase_overlap_intervals(intervals):
    if not intervals:
        return 0

    intervals = sorted(intervals, key=lambda interval: interval[1])
    kept = 0
    last_end = float("-inf")
    for start, end in intervals:
        if start >= last_end:
            kept += 1
            last_end = end
    return len(intervals) - kept`,
  },
  {
    id: "greedy-proof-toolkit-expanded",
    title: "A Complete Greedy Proof Toolkit",
    type: "theory",
    content: `
## Never stop at “this seems optimal”

### 1. Exchange argument

Take an arbitrary optimal solution that differs from greedy at the first decision. Replace its decision with the greedy one and prove feasibility and objective value do not worsen. Repeat or apply induction.

### 2. Greedy stays ahead

Compare the greedy partial solution with any competitor after the same number of choices. Prove a measurable frontier—finish time, covered distance, remaining capacity, or cost—is always at least as favorable.

### 3. Cut property

Partition objects into processed and unprocessed sides. Prove the lightest safe item crossing the cut belongs to some optimum. Prim and Kruskal use this for minimum spanning trees.

### 4. Structural induction

Prove the greedy choice reduces the instance while preserving its form. Assume greedy solves the smaller instance and combine.

### 5. Charging argument

Charge the cost of an optimal action to nearby greedy actions and bound how many times any greedy action is charged. This often proves approximation ratios when greedy is not exactly optimal.

### Proof checklist

- Define the exact greedy rule and tie handling.
- Define feasibility after each commitment.
- State the invariant or transformation.
- Prove the transformed solution remains feasible.
- Prove the objective is unchanged or improved.
- Explain termination and complexity.
    `,
    diagram: `flowchart TD
      A["Greedy claim"] --> B{"Transformation available?"}
      B -->|yes| C["Exchange argument"]
      B -->|no| D{"Comparable frontier?"}
      D -->|yes| E["Stays ahead"]
      D -->|no| F{"Graph cut?"}
      F -->|yes| G["Cut property"]
      F -->|no| H["Induction / charging / counterexample"]`,
    code: `def minimum_arrows(balloon_intervals):
    if not balloon_intervals:
        return 0

    balloon_intervals = sorted(balloon_intervals, key=lambda interval: interval[1])
    arrows = 1
    arrow_position = balloon_intervals[0][1]

    for start, end in balloon_intervals[1:]:
        if start > arrow_position:
            arrows += 1
            arrow_position = end
    return arrows`,
  },
  {
    id: "greedy-counterexamples",
    title: "How to Break a Wrong Greedy Rule",
    type: "theory",
    content: `
## Counterexamples are part of algorithm design

Before proving a greedy rule, actively try to break it with the smallest possible input.

### Counterexample recipe

1. Identify what the rule prefers.
2. Make that locally attractive choice consume a scarce resource.
3. Add two or more slightly less attractive choices that together are better.
4. Keep the instance tiny enough to calculate every alternative.

### Classic failures

| Proposed rule | Counterexample |
|---|---|
| Coin change: always largest coin | Coins [1,3,4], amount 6: greedy 4+1+1, optimum 3+3 |
| 0/1 knapsack: best value/weight | Capacity 50; (60,10), (100,20), (120,30): greedy 160, optimum 220 |
| Interval scheduling: earliest start | One long early interval blocks many short ones |
| Shortest weighted path: fewest edges | One direct expensive edge loses to multiple cheap edges |

### Greedy may still approximate

Failure to be exact does not make a rule useless. For NP-hard problems such as set cover, greedy can have a provable approximation guarantee. The claim must change from “optimal” to a precise bound.

### Differential testing

For small inputs, enumerate all feasible solutions and compare the greedy output. Random search often finds a counterexample before a flawed proof is written.
    `,
    diagram: `flowchart LR
      A["Candidate greedy rule"] --> B["Build tiny adversarial input"]
      B --> C["Compute greedy result"]
      B --> D["Enumerate optimum"]
      C --> E{"Equal?"}
      D --> E
      E -->|no| F["Counterexample: reject rule"]
      E -->|yes| G["Search more, then prove"]`,
    code: `from functools import cache

def greedy_coin_count(coins, amount):
    count = 0
    for coin in sorted(coins, reverse=True):
        used, amount = divmod(amount, coin)
        count += used
    return count if amount == 0 else float("inf")


def optimal_coin_count(coins, amount):
    @cache
    def solve(remaining):
        if remaining == 0:
            return 0
        if remaining < 0:
            return float("inf")
        return 1 + min(solve(remaining - coin) for coin in coins)
    return solve(amount)


assert greedy_coin_count([1, 3, 4], 6) == 3
assert optimal_coin_count([1, 3, 4], 6) == 2`,
  },
  {
    id: "interval-greedy-masterclass",
    title: "Interval Greedy Masterclass",
    type: "theory",
    content: `
## The objective determines the sorting key

Intervals look similar, but different questions require different invariants.

| Goal | Strategy |
|---|---|
| Maximum number of non-overlapping intervals | Sort by end; keep earliest compatible end |
| Minimum removals for no overlap | Total minus maximum compatible set |
| Minimum arrows covering intervals | Sort by end; shoot at current end |
| Merge all overlaps | Sort by start; extend current merged end |
| Minimum meeting rooms | Sort events or use a min-heap of end times |
| Weighted non-overlapping profit | DP with binary search, not plain greedy |

### Why earliest finish works

Let G be the earliest-finishing available interval. If an optimal schedule starts with O, then end(G) ≤ end(O). Replacing O with G keeps every later interval feasible, so an optimal schedule containing G exists.

### Open versus closed boundaries

Decide whether [1,2] and [2,3] overlap. Meeting scheduling commonly allows the next meeting when start ≥ previous end. Closed geometric intervals may require start > previous end. Encode this once in the feasibility condition.

### Weighted intervals break the rule

An early-finishing interval with low profit can block a later high-profit interval. The state must compare skip versus take plus the best compatible prefix—weighted interval scheduling DP.
    `,
    diagram: `flowchart LR
      A["Sort by finish"] --> B["Pick earliest finish"]
      B --> C["Discard overlapping intervals"]
      C --> D{"Candidates remain?"}
      D -->|yes| B
      D -->|no| E["Maximum compatible set"]`,
    code: `from heapq import heappop, heappush

def minimum_meeting_rooms(intervals):
    if not intervals:
        return 0

    intervals = sorted(intervals)
    ending_times = []
    maximum_rooms = 0

    for start, end in intervals:
        while ending_times and ending_times[0] <= start:
            heappop(ending_times)
        heappush(ending_times, end)
        maximum_rooms = max(maximum_rooms, len(ending_times))
    return maximum_rooms`,
  },
  {
    id: "fractional-knapsack-huffman",
    title: "Fractional Knapsack and Huffman Coding",
    type: "theory",
    content: `
## Greedy becomes safe when choices are divisible or mergeable

### Fractional knapsack

When fractions of items are allowed, take remaining capacity from the highest value-per-weight ratio first. Any lower-ratio weight can be exchanged for higher-ratio weight to improve value, proving optimality.

This proof fails for 0/1 knapsack because an indivisible item cannot be exchanged one unit at a time.

### Huffman coding

To build an optimal prefix-free binary code, repeatedly merge the two least-frequent symbols or subtrees. Low-frequency symbols should be deepest. An exchange argument shows the two least frequent symbols can be siblings at maximum depth in some optimal tree.

| Algorithm | Greedy choice | Data structure |
|---|---|---|
| Fractional knapsack | Highest density remaining | Sort by ratio |
| Huffman coding | Two smallest frequencies | Min-heap |

Huffman creates an optimal prefix code for known symbol frequencies, but does not exploit correlations between symbols. Modern compressors may combine transformations and entropy coders for better practical compression.
    `,
    diagram: `flowchart TD
      A["frequencies: 5, 9, 12, 13"] --> B["merge 5 + 9 = 14"]
      B --> C["heap: 12, 13, 14"]
      C --> D["merge 12 + 13 = 25"]
      D --> E["heap: 14, 25"]
      E --> F["root weight 39"]`,
    code: `from heapq import heapify, heappop, heappush

def huffman_merge_cost(frequencies):
    heap = list(frequencies)
    heapify(heap)
    total_cost = 0

    while len(heap) > 1:
        first = heappop(heap)
        second = heappop(heap)
        merged = first + second
        total_cost += merged
        heappush(heap, merged)
    return total_cost`,
  },
  {
    id: "mst-greedy-cut-property",
    title: "Minimum Spanning Trees and the Cut Property",
    type: "theory",
    content: `
## Connect every vertex with minimum total edge weight

A spanning tree of a connected undirected graph has V-1 edges and no cycles. The **cut property** drives both major greedy algorithms:

> For any cut that respects the chosen edges, a lightest edge crossing that cut is safe—it belongs to some minimum spanning tree.

### Kruskal

Sort all edges by weight. Add an edge if it connects two currently separate components. Union-find checks this efficiently. The evolving components define the cut.

### Prim

Grow one connected tree. Repeatedly add the lightest edge leaving the current tree, maintained with a min-heap.

| Algorithm | Best fit | Complexity |
|---|---|---|
| Kruskal | Sparse graph or edge list | O(E log E) |
| Prim with heap | Adjacency list | O(E log V) |
| Prim with matrix | Dense graph | O(V²) |

Negative weights are fine. Disconnected input produces a minimum spanning forest unless connectivity is required and checked. An MST minimizes total connection cost, not shortest path from a source.
    `,
    diagram: `flowchart LR
      A["Component A"] -->|"lightest crossing edge"| B["Component B"]
      A -->|"heavier edge"| C["Component C"]
      B --> C
      D["Cut separates chosen component"] --> A`,
    code: `def kruskal(vertex_count, edges):
    parent = list(range(vertex_count))
    size = [1] * vertex_count

    def find(node):
        while node != parent[node]:
            parent[node] = parent[parent[node]]
            node = parent[node]
        return node

    total = 0
    selected = []
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

    return total, selected`,
  },
  {
    id: "dijkstra-greedy-finalization",
    title: "Dijkstra: Greedy Finalization of Shortest Paths",
    type: "theory",
    content: `
## Finalize the closest unsettled vertex

Dijkstra maintains tentative distances from the source. It repeatedly extracts the unsettled vertex with smallest distance and permanently finalizes it.

### Why nonnegative edges matter

Suppose u has the smallest tentative distance. Any undiscovered alternative path to u must first reach another unsettled vertex v whose tentative distance is at least distance[u]. Adding a nonnegative edge cannot make the path smaller, so u is safe to finalize.

A negative edge breaks that reasoning: a later vertex could lead backward to a cheaper path. Use Bellman–Ford or another appropriate algorithm when negative weights exist.

### Lazy heap implementation

Python's heap does not decrease keys directly. Push a new pair whenever a distance improves. When popping, ignore an entry if its distance no longer equals the current best value.

### Complexity

With adjacency lists and a binary heap: O((V+E) log V), commonly written O(E log V) for connected graphs.

Dijkstra is greedy plus relaxation. The relaxation proposes better tentative paths; the greedy extraction decides which result is now final.
    `,
    diagram: `flowchart LR
      A["Tentative distances"] --> B["Extract smallest unsettled"]
      B --> C["Finalize vertex"]
      C --> D["Relax outgoing edges"]
      D --> E["Push improvements"]
      E --> B`,
    code: `from heapq import heappop, heappush

def dijkstra(graph, source):
    distance = [float("inf")] * len(graph)
    distance[source] = 0
    heap = [(0, source)]

    while heap:
        current_distance, node = heappop(heap)
        if current_distance != distance[node]:
            continue

        for neighbor, weight in graph[node]:
            candidate = current_distance + weight
            if candidate < distance[neighbor]:
                distance[neighbor] = candidate
                heappush(heap, (candidate, neighbor))
    return distance`,
  },
  {
    id: "scheduling-sweep-heaps",
    title: "Scheduling with Sweep Lines and Heaps",
    type: "theory",
    content: `
## Process decisions in time order

Many scheduling algorithms sort by one coordinate and maintain the currently relevant candidates with a heap.

### Common patterns

| Problem | Ordered by | Heap stores |
|---|---|---|
| Meeting rooms | Start time | Active end times |
| Course schedule III | Deadline | Durations selected so far, max-heap |
| Single-threaded CPU | Enqueue time | Available tasks by processing time |
| IPO projects | Required capital | Affordable profits, max-heap |
| Reorganize string | Current step | Remaining character frequencies |

### Course Schedule III exchange idea

Sort courses by deadline. Tentatively take every course. If total duration exceeds the current deadline, remove the longest selected course. Replacing a longer chosen duration with a shorter one preserves the number of courses while leaving no less time for every future deadline.

### Event ordering and ties

When one event ends exactly when another begins, the order of equal-time events determines whether resources can be reused. Decide the interval convention first, then encode the tie key.

Sweep line is not automatically greedy, but it often provides the chronological framework in which a safe heap choice becomes visible.
    `,
    diagram: `flowchart LR
      A["Sort by deadline"] --> B["Tentatively accept course"]
      B --> C{"Total time > deadline?"}
      C -->|yes| D["Remove longest selected duration"]
      C -->|no| E["Continue"]
      D --> E
      E --> B`,
    code: `from heapq import heappop, heappush

def maximum_courses(courses):
    total_time = 0
    selected_durations = []

    for duration, deadline in sorted(courses, key=lambda course: course[1]):
        total_time += duration
        heappush(selected_durations, -duration)

        if total_time > deadline:
            longest = -heappop(selected_durations)
            total_time -= longest

    return len(selected_durations)`,
  },
  {
    id: "two-pointer-greedy",
    title: "Greedy with Sorting and Two Pointers",
    type: "theory",
    content: `
## Extremes often expose a forced decision

After sorting, two pointers can represent the smallest and largest remaining candidates.

### Boats to save people

The heaviest person must use a boat now. If they can pair with the lightest, do so: pairing them with anyone heavier would not preserve a better opportunity. If they cannot pair with the lightest, they cannot pair with anyone and must go alone.

### Assign cookies

Sort child requirements and cookie sizes. Give the smallest adequate cookie to the least-demanding unsatisfied child. Using a larger cookie cannot satisfy more children now and may waste a resource needed later.

### Minimum absolute pairing differences

When two sorted lists must be paired, crossing pairs can often be uncrossed without increasing total cost. This exchange structure justifies matching in sorted order for certain objectives.

### Forced-choice checklist

1. Which extreme item must be handled in every feasible solution?
2. Is there a best possible partner for it?
3. If the pair is impossible, can any other partner work?
4. Does removing the handled item leave the same problem shape?

Do not assume every sorted two-pointer algorithm is greedy; two pointers also implement exhaustive elimination and sliding windows.
    `,
    diagram: `flowchart LR
      A["lightest"] --> B["remaining sorted people"] --> C["heaviest"]
      C --> D{"lightest + heaviest ≤ limit?"}
      D -->|yes| E["pair both"]
      D -->|no| F["heaviest alone"]`,
    code: `def rescue_boats(weights, limit):
    weights = sorted(weights)
    light, heavy = 0, len(weights) - 1
    boats = 0

    while light <= heavy:
        if weights[light] + weights[heavy] <= limit:
            light += 1
        heavy -= 1
        boats += 1
    return boats`,
  },
  {
    id: "matroids-and-greedy-limits",
    title: "Matroids, Approximation, and the Limits of Greedy",
    type: "theory",
    content: `
## The abstract structure behind many correct greedy algorithms

A **matroid** consists of a ground set and a family of independent subsets satisfying:

1. The empty set is independent.
2. Every subset of an independent set is independent.
3. If independent A is smaller than independent B, some element of B can be added to A while preserving independence.

The exchange property guarantees that sorting elements by weight and repeatedly adding a feasible element finds a maximum-weight independent set.

### Examples

- Forests of a graph form a graphic matroid; Kruskal adds cheapest edges without cycles.
- Linearly independent vectors form a linear matroid.
- Choosing at most k elements forms a uniform matroid.

Not every constraint system is a matroid. 0/1 knapsack fails the exchange property, explaining why sorting by density is not exact.

### Approximation algorithms

For set cover, repeatedly choosing the set covering the most new elements per unit cost gives a logarithmic approximation, not always an optimum. For metric traveling salesperson, MST-based methods provide bounded approximations.

### Practical lesson

When exact greedy proof fails, ask whether:

- A DP state can preserve the missing future information.
- The problem is NP-hard and an approximation guarantee is appropriate.
- Additional input restrictions restore a greedy-choice property.
    `,
    diagram: `flowchart TD
      A["Feasible subsets"] --> B{"Exchange property holds?"}
      B -->|yes| C["Weight-ordered greedy may be exact"]
      B -->|no| D{"Compact state exists?"}
      D -->|yes| E["Dynamic programming"]
      D -->|no| F["Approximation / search / problem-specific method"]`,
    code: `def maximum_weight_uniform_matroid(items, limit):
    # Any subset of at most limit items is independent.
    return sorted(items, key=lambda item: item[1], reverse=True)[:limit]


def greedy_set_cover(universe, weighted_sets):
    uncovered = set(universe)
    chosen = []
    while uncovered:
        best_set, best_cost = min(
            weighted_sets,
            key=lambda item: item[1] / max(1, len(item[0] & uncovered)),
        )
        newly_covered = best_set & uncovered
        if not newly_covered:
            raise ValueError("universe cannot be covered")
        chosen.append((best_set, best_cost))
        uncovered -= newly_covered
    return chosen`,
  },
  {
    id: "greedy-design-debugging",
    title: "Designing, Testing, and Debugging Greedy Algorithms",
    type: "theory",
    content: `
## A repeatable workflow

### 1. State the objective and feasibility precisely

“Best” is meaningless until the objective is defined: maximum count, minimum total cost, earliest completion, minimum maximum lateness, or something else.

### 2. Find a forced or exchangeable choice

Look at extremes, bottlenecks, earliest boundaries, cheapest cut edges, or the most constrained item.

### 3. Write the invariant before code

Examples:

- The selected intervals can be extended to an optimal schedule.
- Every finalized Dijkstra distance is globally shortest.
- Kruskal's chosen forest is contained in some MST.

### 4. Attack the rule

Test empty and singleton cases, ties, duplicates, negative values where allowed, nested intervals, disconnected graphs, and adversarial arrangements.

### 5. Compare with brute force

Enumerate all subsets, permutations, or decisions for tiny random inputs. If greedy differs, shrink the case and inspect the first unsafe commitment.

### 6. Analyze the complete cost

Greedy scans are often O(n), but sorting makes the full algorithm O(n log n). Heap operations add logarithmic factors. State auxiliary space separately.

### Interview explanation template

“I choose X because property Y makes it safe. By exchanging X with the first differing choice in any optimum, feasibility and objective do not worsen. The remainder has the same form, so induction completes the proof.”
    `,
    diagram: `flowchart LR
      A["Define objective"] --> B["Propose local rule"]
      B --> C["State invariant"]
      C --> D["Search for counterexample"]
      D --> E{"Rule survives?"}
      E -->|no| F["Change rule or technique"]
      E -->|yes| G["Write proof"]
      G --> H["Implement and differential-test"]`,
    code: `from itertools import combinations
from random import randint

def activity_count_brute(intervals):
    best = 0
    for size in range(len(intervals) + 1):
        for subset in combinations(intervals, size):
            ordered = sorted(subset)
            if all(ordered[i][1] <= ordered[i + 1][0] for i in range(len(ordered) - 1)):
                best = max(best, size)
    return best


def activity_count_greedy(intervals):
    last_end = float("-inf")
    count = 0
    for start, end in sorted(intervals, key=lambda interval: interval[1]):
        if start >= last_end:
            count += 1
            last_end = end
    return count


for _ in range(200):
    sample = []
    for _ in range(randint(0, 8)):
        start = randint(0, 8)
        sample.append((start, randint(start + 1, 10)))
    assert activity_count_greedy(sample) == activity_count_brute(sample)`,
  },
];
