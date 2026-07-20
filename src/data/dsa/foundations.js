export const foundationsTopic = {
  id: "dsa-foundations",
  title: "Foundations & Problem Solving",
  description: "The mental models, Python tools, proofs, testing habits, and constraints that make every later algorithm easier",
  icon: "BookOpen",
  sections: [
    {
      id: "what-dsa-solves",
      title: "What DSA Actually Solves",
      type: "theory",
      content: `
## Data structures and algorithms are two halves of one decision

A **data structure** decides how information is represented. An **algorithm** decides how that representation changes or answers a question. The same task can become easy or hard depending on the representation.

### A concrete example

Suppose you must answer: “Have I seen this username before?”

| Representation | Operation | Cost |
|---|---|---|
| Unsorted list | Scan every name | O(n) |
| Sorted list | Binary search | O(log n) |
| Hash set | Membership lookup | O(1) average |

The hash set wins for lookup, but a sorted list also supports ordered iteration and range queries. There is no universally best structure—only a structure that matches the required operations.

### The four questions behind every problem

1. What are the inputs and outputs?
2. Which operations happen most often?
3. What constraints limit time and memory?
4. What property can remain true after every step?

That last property is the **invariant**. It is the bridge between intuition, code, and proof.
      `,
      diagram: `flowchart LR
        A["Problem and constraints"] --> B["Required operations"]
        B --> C["Choose representation"]
        C --> D["Choose algorithm"]
        D --> E["Prove invariant"]
        E --> F["Test edge cases"]`,
      code: `def contains_duplicate_slow(values):
    for i in range(len(values)):
        for j in range(i + 1, len(values)):
            if values[i] == values[j]:
                return True
    return False


def contains_duplicate(values):
    seen = set()
    for value in values:
        if value in seen:
            return True
        seen.add(value)
    return False`,
    },
    {
      id: "python-dsa-toolkit",
      title: "Python Toolkit for DSA",
      type: "theory",
      content: `
## Know the cost of the tools you reach for

Python makes solutions concise, but concise syntax can hide expensive work.

| Tool | Typical use | Important cost |
|---|---|---|
| list | Dynamic array, stack | append/pop end O(1) amortized; insert/pop front O(n) |
| deque | Queue or double-ended queue | append/popleft O(1) |
| dict | Key to value mapping | lookup/update O(1) average |
| set | Membership and uniqueness | lookup/add/remove O(1) average |
| heapq | Min-priority queue | push/pop O(log n), peek O(1) |
| bisect | Search insertion point in sorted list | search O(log n), insertion O(n) |
| Counter | Frequencies | build O(n) |

### Essential habits

- Use tuples for fixed records and hashable keys.
- Use **enumerate** when you need index and value.
- Use **zip** to walk aligned sequences.
- Prefer a queue head index or **deque**; repeated **list.pop(0)** is quadratic.
- Remember that slicing copies: **a[l:r]** costs O(r-l) space and time.
- Sorting with a key is stable and costs O(n log n).

### Mutability matters

Lists, dictionaries, and sets are mutable. Passing them into recursion shares the same object unless you copy or deliberately undo changes. Backtracking usually chooses, explores, then unchooses.
      `,
      diagram: `flowchart TD
        A["Need ordered sequence?"] -->|yes| B["list / tuple"]
        A -->|no| C{"Need key lookup?"}
        C -->|yes| D["dict"]
        C -->|membership only| E["set"]
        A -->|queue ends| F["deque"]
        A -->|repeated minimum| G["heapq"]`,
      code: `from collections import Counter, defaultdict, deque
from heapq import heappop, heappush

values = [4, 1, 4, 2]
frequency = Counter(values)             # {4: 2, 1: 1, 2: 1}
positions = defaultdict(list)
for index, value in enumerate(values):
    positions[value].append(index)

queue = deque(["start"])
queue.append("next")
first = queue.popleft()

heap = []
for value in values:
    heappush(heap, value)
smallest = heappop(heap)`,
    },
    {
      id: "constraints-to-complexity",
      title: "Turn Constraints Into an Algorithm Budget",
      type: "theory",
      content: `
## Constraints are design clues

Before coding, estimate the largest amount of work the input permits. The table is a rule of thumb—not a machine guarantee—but it quickly rejects impossible approaches.

| Maximum n | Often feasible |
|---:|---|
| 10–20 | factorial search with pruning, O(2^n), bitmask DP |
| 100 | O(n^3) may pass |
| 1,000 | O(n^2) may pass |
| 100,000 | O(n log n) or O(n) |
| 1,000,000 | near O(n) |

### Read all dimensions

For a grid with r rows and c columns, the real input size is r·c. For a graph, traversal is O(V+E), not simply O(V). For q repeated queries, multiply the per-query cost by q and add preprocessing.

### Space is part of the budget

- A recursion depth near 100,000 is unsafe in Python.
- A dense n by n matrix uses O(n²) memory.
- Memoization can turn exponential time into polynomial time by storing states, but those states consume memory.

### Work backward from the target

If n=100,000 and the brute force is O(n²), ask what repeated work can be removed. Common answers are hashing, sorting, prefix sums, a monotonic structure, or an ordered search space.
      `,
      diagram: `flowchart LR
        A["Read n, q, V, E"] --> B["Estimate total operations"]
        B --> C{"Fits budget?"}
        C -->|yes| D["Implement and verify"]
        C -->|no| E["Remove repeated work"]
        E --> F["Hash / sort / preprocess / search"]
        F --> B`,
      code: `def range_sums(values, queries):
    # O(n) preprocessing, then O(1) per query.
    prefix = [0]
    for value in values:
        prefix.append(prefix[-1] + value)

    answers = []
    for left, right in queries:
        answers.append(prefix[right + 1] - prefix[left])
    return answers`,
    },
    {
      id: "invariants-and-correctness",
      title: "Invariants and Correctness Proofs",
      type: "theory",
      content: `
## An invariant is a promise preserved by the loop

A good explanation does more than narrate code. It states why every discarded possibility is safe to discard.

### Three-part loop proof

1. **Initialization:** the invariant is true before the first iteration.
2. **Maintenance:** one iteration preserves it.
3. **Termination:** when the loop stops, the invariant implies the answer.

### Example: binary search

Invariant: if the target exists, it is inside the inclusive interval **[left, right]**.

- Initially the interval is the whole array.
- If **values[mid] < target**, sorted order proves every index through **mid** is too small.
- The interval strictly shrinks, so the loop terminates.
- If the interval becomes empty, no candidate remains.

### Other useful proof ideas

| Pattern | Typical invariant or proof |
|---|---|
| Sliding window | Window satisfies a stated condition |
| Greedy | Exchange choice with one in an optimal solution |
| DP | State definition plus induction over computation order |
| Graph traversal | Every queued node has a known path from the source |
| Divide and conquer | Recursive calls solve smaller instances; combine is correct |
      `,
      diagram: `flowchart TD
        A["Initialization"] --> B["Invariant is true"]
        B --> C["Perform one step"]
        C --> D["Maintenance: still true"]
        D --> E{"Finished?"}
        E -->|no| C
        E -->|yes| F["Invariant implies result"]`,
      code: `def binary_search(values, target):
    left, right = 0, len(values) - 1

    # Invariant: target, if present, is within [left, right].
    while left <= right:
        mid = left + (right - left) // 2
        if values[mid] == target:
            return mid
        if values[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1`,
    },
    {
      id: "edge-cases-and-testing",
      title: "Edge Cases, Testing, and Debugging",
      type: "theory",
      content: `
## Test the boundaries where assumptions break

Do not begin with a large random example. Use tiny inputs whose correct answer you can calculate by hand.

### A practical edge-case checklist

- Empty input and one element.
- Two elements: equal, increasing, and decreasing.
- Duplicates and all-equal values.
- Negative values, zero, and large magnitudes.
- Answer at the first or last position.
- No valid answer and multiple valid answers.
- Already sorted and reverse sorted.
- Disconnected graph, cycle, self-loop, and isolated node.

### Debug state, not guesses

For pointer algorithms, print pointer positions and the invariant. For BFS, print the queue by level. For DP, print the state meaning and table after each row. When a test fails, shrink it until removing any element makes the bug disappear; that minimal counterexample usually exposes the mistaken assumption.

### Property-based thinking

Even without a special library, compare an optimized solution with a simple brute-force oracle on hundreds of small random inputs. This is one of the fastest ways to validate complex optimizations.
      `,
      diagram: `flowchart LR
        A["Write brute-force oracle"] --> B["Generate tiny cases"]
        B --> C["Compare outputs"]
        C --> D{"Mismatch?"}
        D -->|yes| E["Shrink counterexample"]
        E --> F["Fix assumption"]
        F --> B
        D -->|no| G["Add boundary tests"]`,
      code: `from random import randint

def two_sum_brute(values, target):
    return any(values[i] + values[j] == target
               for i in range(len(values))
               for j in range(i + 1, len(values)))

def two_sum_fast(values, target):
    seen = set()
    for value in values:
        if target - value in seen:
            return True
        seen.add(value)
    return False

for _ in range(500):
    sample = [randint(-5, 5) for _ in range(randint(0, 8))]
    target = randint(-10, 10)
    assert two_sum_fast(sample, target) == two_sum_brute(sample, target)`,
    },
    {
      id: "problem-solving-workflow",
      title: "A Repeatable Interview Workflow",
      type: "theory",
      content: `
## Solve in layers instead of jumping to code

### 1. Clarify

Restate the task. Ask about input size, duplicates, mutation, ordering, invalid input, and expected output when no answer exists.

### 2. Build a tiny example

Trace an example that includes the hard case. Name the changing state.

### 3. State the brute force

Brute force proves understanding and gives a correctness oracle. Identify exactly what work it repeats.

### 4. Match the bottleneck to a pattern

| Repeated work | Candidate improvement |
|---|---|
| Repeated lookup | Hash map/set |
| Repeated subarray sum | Prefix sum |
| Repeated sorted decision | Binary search |
| Repeated overlapping recursion | Memoization/DP |
| Need next greater/smaller | Monotonic stack |
| Need smallest/largest repeatedly | Heap |

### 5. Explain the invariant, then code

Use meaningful names, handle boundaries deliberately, and avoid premature cleverness.

### 6. Verify

Dry-run the code, state time and auxiliary space, then test the edge-case checklist.
      `,
      diagram: `flowchart LR
        A["Clarify"] --> B["Example"]
        B --> C["Brute force"]
        C --> D["Find bottleneck"]
        D --> E["Choose pattern"]
        E --> F["State invariant"]
        F --> G["Code"]
        G --> H["Test and analyze"]`,
      code: `def solve(values, target):
    """Return indices of two values whose sum is target, or None."""
    index_by_value = {}

    for index, value in enumerate(values):
        complement = target - value
        if complement in index_by_value:
            return [index_by_value[complement], index]
        index_by_value[value] = index

    return None`,
    },
  ],
};
