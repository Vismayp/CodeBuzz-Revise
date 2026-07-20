export const expandedDpSections = [
  {
    id: "dp-as-state-graph",
    title: "The DP Mental Model: A Graph of States",
    type: "theory",
    content: `
## Dynamic programming is organized exhaustive search

DP is often introduced as “recursion plus caching,” but the deeper model is a **directed acyclic graph of states**:

- A **state** is a complete description of a reusable subproblem.
- A **transition** is a directed edge from one state to a smaller or earlier state.
- A **base case** is a state whose answer is already known.
- The **answer state** is the state requested by the original problem.

Naive recursion walks the same state graph many times. Memoization evaluates each reachable state once. Tabulation chooses an order in which every dependency is ready before its consumer.

### Example: climbing stairs

Let **ways(i)** mean “the number of different step sequences that reach stair i.” The final move came from i-1 with a one-step jump or i-2 with a two-step jump:

**ways(i) = ways(i-1) + ways(i-2)**

The addition is not magic—it combines two disjoint sets of solutions classified by their last move.

### When DP is appropriate

| Signal | What it suggests |
|---|---|
| Same state reached by many choice sequences | Overlapping subproblems |
| Best full solution contains best subproblem solutions | Optimal substructure |
| Count, minimum, maximum, feasibility, or longest | A useful aggregation operator |
| Small set of variables fully describes the future | Compact state space |

DP is not appropriate merely because recursion exists. If subproblems do not overlap, memoization adds memory without saving work.
    `,
    diagram: `flowchart LR
      A["ways(5)"] --> B["ways(4)"]
      A --> C["ways(3)"]
      B --> C
      B --> D["ways(2)"]
      C --> D
      C --> E["ways(1)"]
      D --> E
      D --> F["ways(0)"]`,
    code: `from functools import cache

@cache
def ways(stair):
    if stair == 0:
        return 1
    if stair < 0:
        return 0
    return ways(stair - 1) + ways(stair - 2)


def ways_bottom_up(total_stairs):
    dp = [0] * (total_stairs + 1)
    dp[0] = 1
    for stair in range(1, total_stairs + 1):
        dp[stair] = dp[stair - 1]
        if stair >= 2:
            dp[stair] += dp[stair - 2]
    return dp[total_stairs]`,
  },
  {
    id: "dp-five-part-design",
    title: "The Five-Part DP Design Framework",
    type: "theory",
    content: `
## Write the English definition before the recurrence

Every reliable DP solution answers five questions.

### 1. State

Write one complete sentence. Example: **dp[i] is the maximum money obtainable from houses 0 through i without robbing adjacent houses.** If the sentence is ambiguous about whether i is included or merely available, the transition will be ambiguous too.

### 2. Transition

Classify every valid solution by its final decision. At house i:

- Skip it: value is dp[i-1].
- Rob it: value is houses[i] + dp[i-2].

Take the maximum because these cases cover every valid solution.

### 3. Base cases

Solve the smallest valid states directly. Sentinel states can simplify boundaries: define dp[-1]=0 conceptually so the first house follows the same rule.

### 4. Evaluation order

Draw dependency arrows. If dp[i] reads smaller indices, iterate left to right. Interval DP reads shorter intervals, so iterate by increasing interval length.

### 5. Answer and reconstruction

The answer may be dp[n], dp[n-1], a maximum over all dp[i], or a state with a particular flag. If actual choices are required, store or re-derive the decision that produced each state.

### State minimality test

Two partial histories may share a state only if every possible future continuation gives them the same future options. If the future depends on a forgotten fact, add it to the state.
    `,
    diagram: `flowchart LR
      A["State sentence"] --> B["Final choices"]
      B --> C["Transition"]
      C --> D["Base cases"]
      D --> E["Dependency order"]
      E --> F["Answer + choices"]`,
    code: `def house_robber(houses):
    if not houses:
        return 0, []

    dp = [0] * (len(houses) + 1)
    take = [False] * (len(houses) + 1)
    dp[1] = houses[0]
    take[1] = True

    for count in range(2, len(houses) + 1):
        skip_value = dp[count - 1]
        take_value = dp[count - 2] + houses[count - 1]
        if take_value > skip_value:
            dp[count] = take_value
            take[count] = True
        else:
            dp[count] = skip_value

    chosen = []
    count = len(houses)
    while count > 0:
        if take[count]:
            chosen.append(count - 1)
            count -= 2
        else:
            count -= 1
    return dp[-1], chosen[::-1]`,
  },
  {
    id: "memoization-to-tabulation",
    title: "From Brute Force to Memoization to Tabulation",
    type: "theory",
    content: `
## Derive the solution in stages

### Stage 1: recursive search

Write the choices and base cases without optimization. This exposes the recurrence and proves that all possibilities are considered.

### Stage 2: identify the state

List the arguments that change between calls. If two calls with the same arguments always have the same answer, those arguments form a memoization key.

### Stage 3: memoize

Cache before returning. Complexity becomes roughly:

**number of reachable states × work per state**

For coin change with amount A and c coin types, state may be just remaining amount, yielding O(A·c) time and O(A) cached states.

### Stage 4: tabulate

Reverse the dependency direction. Initialize base states, determine a topological order, and push or pull answers through the table.

| Approach | Strength | Risk |
|---|---|---|
| Brute recursion | Clearest choices | Exponential repeated work |
| Memoization | Computes only reachable states | Recursion depth and cache overhead |
| Tabulation | Predictable order and no call stack | May compute unreachable states |
| Space optimized | Less memory | Harder reconstruction and overwrite bugs |

Memoization complexity must include every state dimension. A function with arguments (index, remaining, previous) can have far more than n states.
    `,
    diagram: `flowchart LR
      A["Choice recursion"] --> B["Repeated calls visible"]
      B --> C["Cache by state"]
      C --> D["Draw dependencies"]
      D --> E["Reverse into table order"]
      E --> F["Compress safe dimensions"]`,
    code: `from functools import cache

def minimum_coins(coins, amount):
    @cache
    def solve(remaining):
        if remaining == 0:
            return 0
        if remaining < 0:
            return float("inf")
        return min(1 + solve(remaining - coin) for coin in coins)

    answer = solve(amount)
    return -1 if answer == float("inf") else answer


def minimum_coins_table(coins, amount):
    dp = [float("inf")] * (amount + 1)
    dp[0] = 0
    for current in range(1, amount + 1):
        for coin in coins:
            if coin <= current:
                dp[current] = min(dp[current], 1 + dp[current - coin])
    return -1 if dp[amount] == float("inf") else dp[amount]`,
  },
  {
    id: "grid-dp-deep-dive",
    title: "Grid DP: Coordinates, Obstacles, and Boundaries",
    type: "theory",
    content: `
## A grid is a DAG when movement never goes backward

If movement is only right and down, every cell depends on its top and left neighbors. Row-major order is therefore a valid topological order.

For path counting, define **dp[r][c] as the number of valid paths from the start to cell (r,c)**.

- Obstacle cell: dp[r][c]=0.
- Start cell: dp[0][0]=1 if open.
- Other open cell: dp[r][c]=top+left.

### Boundary strategies

1. Check whether top and left exist at every cell.
2. Allocate a padded table with one extra row and column.
3. Initialize the first row and column separately.

Padding often produces the cleanest recurrence. Put one virtual path immediately left of the start so the same transition creates dp[1][1]=1.

### Beyond counting

| Goal | Aggregation | Unreachable value |
|---|---|---|
| Count paths | Addition | 0 |
| Minimum cost | Minimum + cell cost | Infinity |
| Maximum reward | Maximum + reward | Negative infinity |
| Reachability | Boolean OR | False |

If movement includes arbitrary cycles, simple grid DP is invalid. The state graph is no longer acyclic; use graph algorithms or add a dimension that restores progress.
    `,
    diagram: `flowchart TD
      A["top: dp[r-1][c]"] --> C["current: dp[r][c]"]
      B["left: dp[r][c-1]"] --> C
      C --> D["right neighbor"]
      C --> E["down neighbor"]`,
    code: `def unique_paths_with_obstacles(blocked):
    rows, cols = len(blocked), len(blocked[0])
    dp = [[0] * (cols + 1) for _ in range(rows + 1)]
    dp[1][0] = 1

    for row in range(1, rows + 1):
        for col in range(1, cols + 1):
            if blocked[row - 1][col - 1]:
                dp[row][col] = 0
            else:
                dp[row][col] = dp[row - 1][col] + dp[row][col - 1]
    return dp[rows][cols]`,
  },
  {
    id: "sequence-dp-deep-dive",
    title: "Sequence DP: LCS, Edit Distance, and Alignment",
    type: "theory",
    content: `
## Prefix states turn two sequences into a table

Define **dp[i][j]** using the first i items of sequence A and first j items of sequence B. The extra zero row and column represent empty prefixes.

### Longest common subsequence

- If final characters match, use them: 1 + dp[i-1][j-1].
- Otherwise at least one final character is excluded: max(dp[i-1][j], dp[i][j-1]).

This is a subsequence, so characters may be skipped. A substring requires contiguity and uses a different state.

### Edit distance

When final characters differ, the last operation is exactly one of:

- Delete A[i-1]: 1 + dp[i-1][j].
- Insert B[j-1]: 1 + dp[i][j-1].
- Replace: 1 + dp[i-1][j-1].

Taking the minimum covers every possible final edit.

### Reconstructing an LCS

Walk backward from dp[m][n]. A matching pair moves diagonally and records the character. Otherwise move toward a neighbor with the same optimal value. Reverse the recorded characters.

Time and space are O(mn). If only the length is needed, keep two rows. Hirschberg's algorithm reconstructs an LCS in linear space using divide and conquer.
    `,
    diagram: `flowchart TD
      A["dp[i][j]"] --> B{"A[i-1] = B[j-1]?"}
      B -->|yes| C["1 + diagonal"]
      B -->|no| D["max(top, left) for LCS"]
      B -->|no| E["1 + min(top, left, diagonal) for edit distance"]`,
    code: `def longest_common_subsequence(a, b):
    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    sequence = []
    i, j = len(a), len(b)
    while i and j:
        if a[i - 1] == b[j - 1]:
            sequence.append(a[i - 1])
            i -= 1; j -= 1
        elif dp[i - 1][j] >= dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    return "".join(reversed(sequence))`,
  },
  {
    id: "knapsack-iteration-direction",
    title: "Knapsack: Why Iteration Direction Changes the Problem",
    type: "theory",
    content: `
## One array can represent different item-reuse rules

Let **dp[c]** be the best value using capacity at most c.

### 0/1 knapsack: iterate capacity backward

Each item may be used once. When processing an item of weight w, dp[c-w] must still refer to the previous item layer. Going right-to-left prevents the current item from feeding its own later update.

### Unbounded knapsack: iterate capacity forward

Each item may be reused. Going left-to-right deliberately lets the updated dp[c-w] include the current item again.

### Coin change loop order changes what is counted

For coins [1,2] and amount 3:

- Coins outer, amounts inner counts combinations: {1+1+1, 1+2}.
- Amounts outer, coins inner counts ordered sequences: {1+1+1, 1+2, 2+1}.

### Exact versus at-most capacity

Initializing every dp[c] to 0 means unused capacity is allowed. For an exact fill, initialize dp[0]=0 and all other capacities to impossible, usually negative infinity for maximization or infinity for minimization.

Iteration direction is part of the proof, not a memorized implementation detail.
    `,
    diagram: `flowchart TD
      A["Process one item"] --> B{"May reuse it?"}
      B -->|no: 0/1| C["capacity high → low"]
      B -->|yes: unbounded| D["capacity low → high"]
      C --> E["reads previous item layer"]
      D --> F["may read current item update"]`,
    code: `def zero_one_knapsack(weights, values, capacity):
    dp = [0] * (capacity + 1)
    for weight, value in zip(weights, values):
        for current in range(capacity, weight - 1, -1):
            dp[current] = max(dp[current], dp[current - weight] + value)
    return dp[capacity]


def unbounded_knapsack(weights, values, capacity):
    dp = [0] * (capacity + 1)
    for weight, value in zip(weights, values):
        for current in range(weight, capacity + 1):
            dp[current] = max(dp[current], dp[current - weight] + value)
    return dp[capacity]`,
  },
  {
    id: "interval-dp-deep-dive",
    title: "Interval DP: Solve by Increasing Length",
    type: "theory",
    content: `
## The state is a contiguous interval

Interval DP is useful when a final decision splits a range into independent smaller ranges.

Define **dp[left][right]** as the optimum for the interval. The transition usually tries a split point k or a final action inside the interval.

### Correct evaluation order

A length-L interval reads intervals shorter than L, so fill by increasing length—not ordinary row order.

### Matrix-chain multiplication

For matrices left through right, try the final multiplication split k:

**dp[left][right] = min(dp[left][k] + dp[k+1][right] + multiplication cost)**

### Burst balloons insight

Choosing the first balloon is hard because its neighbors depend on future choices. Choose the **last** balloon k in an interval instead. At that moment its surviving neighbors are exactly the interval boundaries, making left and right subintervals independent.

### Recognition clues

- Remove, merge, or burst elements within a range.
- Parenthesize an expression optimally.
- Decide whether an interval is valid from smaller inner intervals.
- Combine answers across every split point.

Typical complexity is O(n³): O(n²) intervals times O(n) split points. Some recurrences admit Knuth or divide-and-conquer optimization, but only after their mathematical conditions are proven.
    `,
    diagram: `flowchart TD
      A["interval [L,R]"] --> B["choose split k"]
      B --> C["left [L,k]"]
      B --> D["right [k+1,R]"]
      C --> E["combine + split cost"]
      D --> E`,
    code: `def matrix_chain_cost(dimensions):
    matrices = len(dimensions) - 1
    dp = [[0] * matrices for _ in range(matrices)]

    for length in range(2, matrices + 1):
        for left in range(matrices - length + 1):
            right = left + length - 1
            dp[left][right] = float("inf")
            for split in range(left, right):
                cost = (dp[left][split] + dp[split + 1][right]
                        + dimensions[left] * dimensions[split + 1] * dimensions[right + 1])
                dp[left][right] = min(dp[left][right], cost)
    return dp[0][matrices - 1]`,
  },
  {
    id: "tree-and-dag-dp",
    title: "Tree DP and DAG DP",
    type: "theory",
    content: `
## DP works whenever dependencies are acyclic

Arrays and grids merely provide obvious orders. Trees and DAGs also have acyclic dependency structures.

### Tree DP

Root the tree. A postorder traversal computes child states before the parent. States often describe whether the parent edge or current node is selected.

Example: maximum-weight independent set on a tree:

- take[node] = node weight + sum(skip[child]).
- skip[node] = sum(max(take[child], skip[child])).

The parent state makes subtrees independent.

### Rerooting DP

A first DFS computes answers from children. A second DFS passes information from the parent side, producing an answer for every possible root in O(n) rather than running O(n) work from each root.

### DAG DP

Topologically sort vertices, then relax outgoing edges. Longest paths are tractable in DAGs even though longest simple path is hard in general graphs, because the topological order prevents cycles.

Always state what direction an edge represents and whether dp[node] describes paths ending at or starting from the node.
    `,
    diagram: `flowchart TD
      A["parent state"] --> B["child 1 state"]
      A --> C["child 2 state"]
      B --> D["grandchildren solved first"]
      C --> E["grandchildren solved first"]
      D --> F["postorder combines upward"]
      E --> F`,
    code: `def maximum_independent_set(tree, weights, root=0):
    def dfs(node, parent):
        take = weights[node]
        skip = 0
        for child in tree[node]:
            if child == parent:
                continue
            child_take, child_skip = dfs(child, node)
            take += child_skip
            skip += max(child_take, child_skip)
        return take, skip

    return max(dfs(root, -1))`,
  },
  {
    id: "digit-dp",
    title: "Digit DP: Count Numbers Under a Bound",
    type: "theory",
    content: `
## Count valid integers without enumerating them

Digit DP processes a bound one digit at a time. It is useful for questions such as “How many integers from 0 to N have no repeated digit?” or “How many have digit sum S?”

### Standard state dimensions

| State | Meaning |
|---|---|
| position | Which digit is being chosen |
| tight | Whether the chosen prefix still equals the bound's prefix |
| started | Whether a non-leading-zero digit has appeared |
| mask / sum / remainder | Property accumulated so far |

If tight is true, the current digit cannot exceed the corresponding bound digit. Choosing a smaller digit makes later positions unrestricted.

Leading zeros require care. The number 7 represented as 0007 should not treat the first three zeros as real repeated digits. A started flag separates padding from the number itself.

The complexity is the product of state dimensions times at most 10 transitions. A 19-digit 64-bit bound with a 1024-bitmask state is manageable.

To count in an inclusive range [L,R], compute count(R)-count(L-1).
    `,
    diagram: `flowchart TD
      A["state(pos, tight, started, mask)"] --> B["choose digit 0..limit"]
      B --> C{"equals bound digit?"}
      C -->|yes| D["tight remains true"]
      C -->|no| E["tight becomes false"]
      D --> F["next position"]
      E --> F`,
    code: `from functools import cache

def count_unique_digits_at_most(bound):
    digits = str(bound)

    @cache
    def solve(position, tight, started, used_mask):
        if position == len(digits):
            return 1

        limit = int(digits[position]) if tight else 9
        total = 0
        for digit in range(limit + 1):
            next_tight = tight and digit == limit
            if not started and digit == 0:
                total += solve(position + 1, next_tight, False, used_mask)
            elif used_mask & (1 << digit) == 0:
                total += solve(position + 1, next_tight, True, used_mask | (1 << digit))
        return total

    return solve(0, True, False, 0)`,
  },
  {
    id: "dp-optimization-toolkit",
    title: "Advanced DP Optimization Toolkit",
    type: "theory",
    content: `
## Optimize the transition after the state is correct

Do not begin with an optimization technique. First derive a correct recurrence and identify which repeated transition work dominates.

| Bottleneck shape | Possible optimization |
|---|---|
| Only previous row needed | Rolling array |
| Best over a sliding range | Monotonic deque |
| Best over all earlier prefix values | Prefix min/max |
| Transition has ordered slopes/queries | Convex hull trick or Li Chao tree |
| Partition DP with monotone optimal split | Divide-and-conquer optimization |
| Interval cost satisfies quadrangle properties | Knuth optimization |
| Subset transitions over all submasks | Sum-over-subsets DP / transforms |

### Monotonic deque example

If dp[i] needs the maximum dp[j] over j in [i-k, i-1], scanning the range costs O(k) per state. A deque maintains candidate indices in decreasing dp value and removes expired indices, reducing total work to O(n).

### Correctness obligations

Every advanced optimization has preconditions. Convex hull trick needs compatible line/query ordering or a dynamic structure. Divide-and-conquer optimization needs monotonicity of optimal split indices. Knuth optimization needs stronger interval-cost inequalities.

Space compression also has a precondition: overwritten values must never be needed again. Draw arrows before changing loop direction or collapsing a dimension.
    `,
    diagram: `flowchart TD
      A["Correct recurrence"] --> B["Measure transition bottleneck"]
      B --> C{"Sliding best?"}
      C -->|yes| D["Monotonic deque"]
      B --> E{"Linear functions?"}
      E -->|yes| F["Convex hull trick"]
      B --> G{"Monotone split?"}
      G -->|yes| H["Divide-and-conquer / Knuth"]`,
    code: `from collections import deque

def constrained_subsequence_sum(values, window):
    dp = [0] * len(values)
    candidates = deque()
    answer = float("-inf")

    for index, value in enumerate(values):
        while candidates and candidates[0] < index - window:
            candidates.popleft()

        best_previous = max(0, dp[candidates[0]]) if candidates else 0
        dp[index] = value + best_previous
        answer = max(answer, dp[index])

        while candidates and dp[candidates[-1]] <= dp[index]:
            candidates.pop()
        candidates.append(index)

    return answer`,
  },
  {
    id: "dp-correctness-debugging",
    title: "Proving and Debugging DP Solutions",
    type: "theory",
    content: `
## A DP proof follows the table order

Use induction over the evaluation order.

1. **State meaning:** state exactly what dp[state] represents.
2. **Base cases:** prove the definition for the smallest states.
3. **Exhaustiveness:** show the transition covers every valid final choice.
4. **Disjointness or optimization:** explain why adding does not double-count, or why min/max selects the optimum.
5. **Dependency:** every referenced state is smaller or earlier and therefore already correct.
6. **Answer:** show why the returned state matches the full problem.

### Common failure modes

| Symptom | Likely cause |
|---|---|
| Off by one row or column | State uses items vs indices inconsistently |
| Values change after 1D compression | Wrong iteration direction |
| Count too large | Cases overlap or permutations counted as combinations |
| Infinity leaks into arithmetic | Unreachable states not guarded |
| Memoization still exponential | Cache key omits a state variable or contains too much history |
| Correct value, wrong chosen path | Reconstruction tie rule is inconsistent |

### Verification strategy

Build a brute-force oracle for inputs small enough to enumerate. Generate random tiny cases and compare every result. Print the table with row/column meanings, not just numbers. For space optimization, compare the full-table and compressed versions on the same cases.

The strongest debugging question is: **Which English state definition does this cell violate?**
    `,
    diagram: `flowchart LR
      A["State definition"] --> B["Base cases"]
      B --> C["All final choices"]
      C --> D["Earlier states correct"]
      D --> E["Transition correct"]
      E --> F["Answer state correct"]`,
    code: `from itertools import product
from random import randint

def robber_brute(houses):
    best = 0
    for choices in product([False, True], repeat=len(houses)):
        if any(choices[i] and choices[i + 1] for i in range(len(houses) - 1)):
            continue
        best = max(best, sum(value for value, chosen in zip(houses, choices) if chosen))
    return best


def robber_dp(houses):
    previous_two = previous_one = 0
    for value in houses:
        previous_two, previous_one = previous_one, max(previous_one, previous_two + value)
    return previous_one


for _ in range(300):
    sample = [randint(0, 12) for _ in range(randint(0, 10))]
    assert robber_dp(sample) == robber_brute(sample)`,
  },
];
