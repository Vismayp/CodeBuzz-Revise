export const expandedHeapSections = [
  {
    id: "heap-partial-order",
    title: "Heap Mental Model: Partial Order",
    type: "theory",
    content: `
## A heap keeps only the next answer easy to reach

A min-heap guarantees that every parent is no greater than its children. Therefore the root is globally minimum, but siblings and separate subtrees are not sorted relative to one another. This **partial order** is cheaper to maintain than a fully sorted array.

Use a heap when work arrives over time and you repeatedly need the best current item. Peek is O(1); insertion and removal are O(log n). Searching for an arbitrary value is O(n), and printing the heap array does not produce sorted order.

### Selection guide

| Need | Prefer |
|---|---|
| Repeated best-item removal | Heap |
| One final sorted order | Sorting |
| One kth item in an array | Quickselect |
| Membership lookup | Hash set/map |
| FIFO processing | Queue |

Python heapq is a min-heap. Represent a max-heap by negating numeric priorities or by wrapping comparable records. For records, push tuples such as (priority, tie_breaker, item) so equal priorities never force incomparable items to be compared.
    `,
    diagram: `flowchart TD
      A["1: global minimum"] --> B["4"]
      A --> C["3"]
      B --> D["9"]
      B --> E["7"]
      C --> F["8"]
      C --> G["5"]`,
    code: `import heapq
from itertools import count

tasks: list[tuple[int, int, str]] = []
sequence = count()

def schedule(priority: int, name: str) -> None:
    heapq.heappush(tasks, (priority, next(sequence), name))

schedule(2, "compile")
schedule(1, "lint")
schedule(1, "test")
assert heapq.heappop(tasks)[2] == "lint"`,
  },
  {
    id: "heap-array-sifting",
    title: "Array Representation, Sift Up, and Sift Down",
    type: "theory",
    content: `
## Complete shape removes the need for pointers

A binary heap is a complete binary tree: every level is full except possibly the last, filled left to right. In a zero-indexed array, parent(i) = (i-1)//2, left(i) = 2i+1, and right(i) = 2i+2.

Insertion appends at the only position that preserves completeness, then **sifts up** while the new value violates the parent relation. Removing the root swaps in the last value, shrinks the array, then **sifts down** toward the smaller child. Height is floor(log₂ n), so both repairs take O(log n).

The representation maintains two invariants:

1. **Shape invariant:** array positions encode a complete tree.
2. **Order invariant:** every parent has priority no worse than each child.

Only nodes along one root-to-leaf path can be broken after a local update. That is why repair is logarithmic rather than rebuilding the entire structure.
    `,
    diagram: `flowchart TD
      A["array index 0"] --> B["index 1 = 2(0)+1"]
      A --> C["index 2 = 2(0)+2"]
      B --> D["index 3"]
      B --> E["index 4"]
      C --> F["index 5"]`,
    code: `class MinHeap:
    def __init__(self):
        self.data: list[int] = []

    def push(self, value: int) -> None:
        self.data.append(value)
        child = len(self.data) - 1
        while child > 0:
            parent = (child - 1) // 2
            if self.data[parent] <= self.data[child]:
                break
            self.data[parent], self.data[child] = self.data[child], self.data[parent]
            child = parent

    def pop(self) -> int:
        if not self.data:
            raise IndexError("empty heap")
        root = self.data[0]
        last = self.data.pop()
        if self.data:
            self.data[0] = last
            self._sift_down(0)
        return root

    def _sift_down(self, parent: int) -> None:
        n = len(self.data)
        while 2 * parent + 1 < n:
            child = 2 * parent + 1
            right = child + 1
            if right < n and self.data[right] < self.data[child]:
                child = right
            if self.data[parent] <= self.data[child]:
                break
            self.data[parent], self.data[child] = self.data[child], self.data[parent]
            parent = child`,
  },
  {
    id: "linear-time-heapify",
    title: "Why Bottom-Up Heapify Is O(n)",
    type: "theory",
    content: `
## Build from the last internal node

Calling push n times costs O(n log n). Bottom-up heap construction instead treats all leaves as one-node heaps and sifts down internal nodes from index n//2 - 1 to 0.

At first glance, n nodes times O(log n) suggests O(n log n), but most nodes are close to the leaves and move only a short distance. Roughly n/2 nodes move zero levels, n/4 can move one, n/8 can move two, and so on. The weighted sum n/4 + 2n/8 + 3n/16 + ... is O(n).

This is a useful complexity lesson: multiply each operation's cost by how many elements actually pay that cost. A loose worst-case bound for every element can hide a tighter aggregate bound.

Bottom-up heapify is appropriate when all input is available at once. Repeated push is still necessary for an online stream. Python's heapq.heapify performs the linear-time bottom-up operation in place.
    `,
    diagram: `flowchart BT
      L["about n/2 leaves: cost 0"] --> P["about n/4 parents: cost at most 1"]
      P --> G["about n/8 grandparents: cost at most 2"]
      G --> R["one root: cost at most log n"]`,
    code: `def heapify(values: list[int]) -> None:
    n = len(values)
    for root in range(n // 2 - 1, -1, -1):
        parent = root
        while 2 * parent + 1 < n:
            child = 2 * parent + 1
            right = child + 1
            if right < n and values[right] < values[child]:
                child = right
            if values[parent] <= values[child]:
                break
            values[parent], values[child] = values[child], values[parent]
            parent = child

data = [9, 4, 7, 1, 3, 6]
heapify(data)
assert all(data[(i - 1) // 2] <= data[i] for i in range(1, len(data)))`,
  },
  {
    id: "bounded-top-k-heaps",
    title: "Top K with a Bounded Heap",
    type: "theory",
    content: `
## Keep the best k seen so far—and the weakest of them exposed

To find the k largest stream elements, maintain a **min-heap of size k**. The root is the smallest retained value, so it is exactly the candidate easiest to replace. Insert while the heap has fewer than k items. Later, replace the root only when a new value is larger.

Invariant: after processing any prefix, the heap contains that prefix's k largest values (or the whole prefix if shorter). If a new value is no larger than the root, at least k retained values are as large, so discarding it is safe. Otherwise, it belongs in the top k and the old root is the only retained value that must leave.

Time is O(n log k), space O(k). This is especially valuable for streams or when k is much smaller than n. Reverse the roles for k smallest: use a max-heap of size k. In Python, negate values to simulate that max-heap.
    `,
    diagram: `flowchart LR
      X["stream value x"] --> C{"heap has k values?"}
      C -->|no| P["push x"]
      C -->|yes| R{"x > root?"}
      R -->|yes| RP["replace smallest retained"]
      R -->|no| D["discard x"]`,
    code: `import heapq

def k_largest(stream, k: int) -> list[int]:
    if k < 0:
        raise ValueError("k must be nonnegative")
    best: list[int] = []
    for value in stream:
        if len(best) < k:
            heapq.heappush(best, value)
        elif k and value > best[0]:
            heapq.heapreplace(best, value)
    return sorted(best, reverse=True)

assert k_largest([7, 2, 9, 4, 8, 1], 3) == [9, 8, 7]`,
  },
  {
    id: "heap-frontier-kway",
    title: "K-Way Merge as a Frontier",
    type: "theory",
    content: `
## Expose one candidate from each sorted source

In k sorted sequences, the global next value must be among their current heads. Put only those heads in a min-heap. Pop the smallest, emit it, then advance only the source it came from and push that source's new head.

The heap is a **frontier** separating emitted values from unseen values. Its invariant is: it contains the smallest not-yet-emitted value from every nonexhausted source. Sortedness proves that no hidden value can beat its source's head.

For N total items and k sources, time is O(N log k) and heap space O(k). The same pattern powers merge-k-linked-lists, external sorting, smallest range covering k lists, and best-first enumeration of combinations.

Include source identity and position in each heap entry. Besides identifying which source to advance, these integers provide deterministic tuple tie-breakers when values are equal.
    `,
    diagram: `flowchart LR
      A["list A head"] --> H["min-heap frontier"]
      B["list B head"] --> H
      C["list C head"] --> H
      H --> O["emit smallest"]
      O --> N["advance only its source"]
      N --> H`,
    code: `import heapq

def merge_sorted(sequences: list[list[int]]) -> list[int]:
    frontier: list[tuple[int, int, int]] = []
    for source, sequence in enumerate(sequences):
        if sequence:
            heapq.heappush(frontier, (sequence[0], source, 0))

    merged: list[int] = []
    while frontier:
        value, source, index = heapq.heappop(frontier)
        merged.append(value)
        next_index = index + 1
        if next_index < len(sequences[source]):
            heapq.heappush(frontier, (sequences[source][next_index], source, next_index))
    return merged

assert merge_sorted([[1,4,9], [2,6], [3,5,8]]) == [1,2,3,4,5,6,8,9]`,
  },
  {
    id: "two-heaps-median",
    title: "Two Heaps for a Running Median",
    type: "theory",
    content: `
## Partition the stream around its middle

Maintain a max-heap **lower** for the smaller half and a min-heap **upper** for the larger half. Preserve two invariants: every lower value is no greater than every upper value, and their sizes differ by at most one (commonly lower holds the extra item).

Insert according to the boundary, then rebalance by moving a root between heaps. If the count is odd, the median is lower's root. If even, it is the average of both roots.

Each insertion costs O(log n); median lookup is O(1); storage is O(n). The heaps need not internally sort their halves—only the maximum of the lower half and minimum of the upper half matter.

For sliding-window medians, deletion is harder because heapq cannot remove arbitrary entries efficiently. Use **lazy deletion**: record values or unique indices scheduled for removal, discard stale roots whenever they reach the top, and maintain logical sizes separately from physical heap lengths.
    `,
    diagram: `flowchart LR
      L["lower max-heap: values <= median"] --> M["boundary roots determine median"]
      U["upper min-heap: values >= median"] --> M
      M --> B["rebalance until size difference <= 1"]`,
    code: `import heapq

class RunningMedian:
    def __init__(self):
        self.lower: list[int] = []
        self.upper: list[int] = []

    def add(self, value: int) -> None:
        if not self.lower or value <= -self.lower[0]:
            heapq.heappush(self.lower, -value)
        else:
            heapq.heappush(self.upper, value)
        if len(self.lower) > len(self.upper) + 1:
            heapq.heappush(self.upper, -heapq.heappop(self.lower))
        elif len(self.upper) > len(self.lower):
            heapq.heappush(self.lower, -heapq.heappop(self.upper))

    def median(self) -> float:
        if not self.lower:
            raise IndexError("no values")
        if len(self.lower) > len(self.upper):
            return float(-self.lower[0])
        return (-self.lower[0] + self.upper[0]) / 2

tracker = RunningMedian()
for number in [5, 2, 10, 4]:
    tracker.add(number)
assert tracker.median() == 4.5`,
  },
  {
    id: "heap-lazy-deletion-scheduling",
    title: "Lazy Deletion, Scheduling, and Stale Entries",
    type: "theory",
    content: `
## Priority queues often contain historical records

Many standard heaps support push and pop but not efficient update or arbitrary deletion. Instead of searching the heap, push a new record and mark the old one stale. When a stale record reaches the root, discard it and continue. Dijkstra commonly uses this technique: a node may receive several tentative distances, but only the entry equal to the current best distance is processed.

Schedulers use the same priority-queue model. An event tuple can contain (time, sequence, type, payload). The sequence number makes equal-time ordering deterministic. Simulations repeatedly pop the earliest event, advance time, mutate state, and schedule future events.

### Practical rules

- Store immutable heap entries and authoritative current state in a map.
- Validate a popped entry before using it.
- Add a unique tie-breaker when payloads are not comparable.
- Remember that lazy deletion can grow physical storage; rebuild periodically if stale entries dominate.

Use an indexed heap only when true decrease-key or deletion is essential and implementation complexity is justified.
    `,
    diagram: `flowchart LR
      P["push improved priority"] --> H["heap contains old and new records"]
      H --> X["pop root"]
      X --> V{"matches authoritative state?"}
      V -->|yes| U["process"]
      V -->|no| X`,
    code: `import heapq

def shortest_paths(graph: list[list[tuple[int, int]]], source: int) -> list[float]:
    distance = [float("inf")] * len(graph)
    distance[source] = 0
    frontier = [(0, source)]

    while frontier:
        current, node = heapq.heappop(frontier)
        if current != distance[node]:
            continue  # stale historical entry
        for neighbor, weight in graph[node]:
            candidate = current + weight
            if candidate < distance[neighbor]:
                distance[neighbor] = candidate
                heapq.heappush(frontier, (candidate, neighbor))
    return distance`,
  },
  {
    id: "heap-correctness-testing",
    title: "Heap Correctness, Variants, and Testing",
    type: "theory",
    content: `
## Prove both shape and order after every mutation

For push, appending preserves complete shape; sifting up repairs the only possibly invalid ancestor chain. For pop, moving the last item to the root preserves shape; sifting down repairs the only possibly invalid descendant chain. When repair stops, the local parent-child relation holds everywhere again.

### Useful variants

- **d-ary heap:** more children per node, smaller height but more comparisons per sift-down; often cache-friendly.
- **Indexed heap:** map keys to positions for decrease-key and deletion.
- **Pairing/Fibonacci heaps:** better theoretical update bounds in some models, but binary/d-ary heaps are usually simpler and faster in practice.
- **Heapsort:** heapify then repeatedly extract; O(n log n), in-place, not stable.

### Test properties

After every random operation, check parent <= child. Pop all values and verify nondecreasing order. Test empty and singleton heaps, duplicates, already sorted/reverse-sorted input, equal priorities, and alternating push/pop. Compare behavior against heapq or a sorted reference list. Property tests catch index and boundary errors far better than one happy-path example.
    `,
    diagram: `flowchart TD
      M["mutation"] --> S["shape remains complete"]
      M --> O["repair one ancestor or descendant path"]
      S --> I["global heap invariant restored"]
      O --> I
      I --> T["pop sequence must be sorted"]`,
    code: `import heapq
import random

def assert_min_heap(values: list[int]) -> None:
    for child in range(1, len(values)):
        parent = (child - 1) // 2
        assert values[parent] <= values[child]

rng = random.Random(7)
heap: list[int] = []
source = [rng.randrange(-20, 21) for _ in range(100)]
for value in source:
    heapq.heappush(heap, value)
    assert_min_heap(heap)

popped = [heapq.heappop(heap) for _ in range(len(heap))]
assert popped == sorted(source)`,
  },
];
