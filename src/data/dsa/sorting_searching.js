export const sortingSearchingTopic = {
  id: "sorting-searching",
  title: "Searching, Sorting & Divide and Conquer",
  description: "Binary search, sorting families, quickselect, divide and conquer, and the reasoning behind their guarantees",
  icon: "Search",
  sections: [
    {
      id: "searching-fundamentals",
      title: "Linear Search vs Binary Search",
      type: "theory",
      content: `
## Search is about eliminating candidates

**Linear search** checks candidates one by one and works on any iterable. **Binary search** removes half the candidates at each step, but requires a monotonic search space—commonly a sorted array.

| Method | Requirement | Time | Good for |
|---|---|---:|---|
| Linear search | None | O(n) | Unsorted or one-time scan |
| Binary search | Monotonic order | O(log n) | Repeated lookup or ordered answer |
| Hash lookup | Hashable key | O(1) average | Exact membership, no order |

For n=1,000,000, binary search needs at most about 20 comparisons because 2²⁰ is just over one million.

### Safe midpoint

Use **mid = left + (right-left)//2**. Python integers do not overflow, but this form is portable and makes interval reasoning explicit.

### Duplicate values

A normal binary search may return any matching occurrence. Boundary search deliberately keeps going after finding a match to locate the first or last occurrence.
      `,
      diagram: `flowchart LR
        A["0..15"] --> B["8 candidates"]
        B --> C["4 candidates"]
        C --> D["2 candidates"]
        D --> E["1 candidate"]`,
      code: `def binary_search(values, target):
    left, right = 0, len(values) - 1
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
      id: "binary-search-boundaries",
      title: "Binary Search Boundaries and Templates",
      type: "theory",
      content: `
## Search for the first true position

Many boundary problems can be written as a monotonic predicate:

**False False False True True True**

The lower-bound template finds the first position where the predicate becomes true. This avoids memorizing separate code for first occurrence, insertion position, and lower bound.

### Interval conventions

Both **[left, right]** and **[left, right)** work. Bugs happen when initialization, loop condition, and updates mix conventions.

| Convention | Start | Loop | Remove mid on true |
|---|---|---|---|
| Closed | 0, n-1 | left <= right | right = mid-1 |
| Half-open | 0, n | left < right | right = mid |

### Lower and upper bound

- Lower bound: first index with value ≥ target.
- Upper bound: first index with value > target.
- Count of target: upper_bound - lower_bound.
      `,
      diagram: `flowchart LR
        A["F"] --> B["F"] --> C["F"] --> D["T: boundary"] --> E["T"] --> F["T"]`,
      code: `def lower_bound(values, target):
    left, right = 0, len(values)  # half-open [left, right)
    while left < right:
        mid = left + (right - left) // 2
        if values[mid] >= target:
            right = mid
        else:
            left = mid + 1
    return left


def upper_bound(values, target):
    left, right = 0, len(values)
    while left < right:
        mid = left + (right - left) // 2
        if values[mid] > target:
            right = mid
        else:
            left = mid + 1
    return left`,
    },
    {
      id: "binary-search-on-answer",
      title: "Binary Search on the Answer",
      type: "theory",
      content: `
## The input need not be sorted—the possible answers must be ordered

Suppose a question asks for the minimum capacity, maximum minimum distance, or smallest speed that satisfies a deadline. If feasibility changes only once as the candidate answer increases, binary-search that answer.

### Recipe

1. Define **feasible(x)** precisely.
2. Prove monotonicity: once true, it stays true (or the reverse).
3. Find guaranteed low and high bounds.
4. Search for the first true or last false candidate.

### Example: ship packages within D days

Capacity below the heaviest package is impossible. Capacity equal to total weight ships everything in one day. A larger capacity can never require more days, so feasibility is monotonic.

Time is O(n log S), where S is the numeric answer range—not O(n log n).
      `,
      diagram: `flowchart LR
        A["Too small"] --> B["Too small"] --> C["First feasible"] --> D["Feasible"] --> E["Feasible"]`,
      code: `def ship_within_days(weights, days):
    def feasible(capacity):
        used_days, load = 1, 0
        for weight in weights:
            if load + weight > capacity:
                used_days += 1
                load = 0
            load += weight
        return used_days <= days

    left, right = max(weights), sum(weights)
    while left < right:
        mid = left + (right - left) // 2
        if feasible(mid):
            right = mid
        else:
            left = mid + 1
    return left`,
    },
    {
      id: "sorting-model",
      title: "How to Compare Sorting Algorithms",
      type: "theory",
      content: `
## Sorting algorithms make different tradeoffs

| Algorithm | Best | Average | Worst | Extra space | Stable? |
|---|---:|---:|---:|---:|---|
| Insertion | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) stack average | Usually no |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| Counting | O(n+k) | O(n+k) | O(n+k) | O(k) | Can be |

**Stable** means equal keys retain their original relative order. **In-place** usually means O(1) auxiliary array space. **Adaptive** means the algorithm becomes faster on nearly sorted data.

Python uses Timsort, a stable adaptive hybrid with O(n log n) worst-case time. In production and interviews, use the built-in sort unless implementing a sort is the point of the exercise.

### Information lower bound

Any general comparison sort requires Ω(n log n) comparisons in the worst case. Linear-time sorts escape that bound by using assumptions about keys rather than only comparisons.
      `,
      diagram: `flowchart TD
        A["Need to sort"] --> B{"Small key range?"}
        B -->|yes| C["Counting / radix"]
        B -->|no| D{"Need stability?"}
        D -->|yes| E["Merge / Timsort"]
        D -->|no| F{"Memory tight?"}
        F -->|yes| G["Heap / in-place quicksort"]
        F -->|no| H["Built-in sort"]`,
      code: `records = [
    {"name": "A", "score": 80},
    {"name": "B", "score": 95},
    {"name": "C", "score": 80},
]

# Stable: A remains before C because both scores are 80.
ordered = sorted(records, key=lambda item: item["score"], reverse=True)`,
    },
    {
      id: "elementary-sorts",
      title: "Insertion, Selection, and Bubble Sort",
      type: "theory",
      content: `
## Elementary sorts teach invariants

They are rarely the best general-purpose choice, but each exposes an important idea.

### Insertion sort

Invariant: the prefix before index i is sorted. Remove the current key, shift larger values right, and insert the key into its position. It is excellent for small or nearly sorted inputs.

### Selection sort

Invariant: the prefix contains the smallest finalized values. Find the minimum of the remaining suffix and swap it into place. It performs only O(n) swaps but always O(n²) comparisons.

### Bubble sort

Adjacent inversions are swapped; after each pass the largest remaining value reaches the end. It is useful pedagogically but rarely practically.

The meaningful unit is not “passes.” Count comparisons, moves, and swaps, because different environments price them differently.
      `,
      diagram: `flowchart LR
        A["Sorted prefix"] --> B["key"] --> C["Unseen suffix"]
        B --> D["Shift larger prefix values"]
        D --> E["Insert key"]
        E --> F["Longer sorted prefix"]`,
      code: `def insertion_sort(values):
    for i in range(1, len(values)):
        key = values[i]
        j = i - 1
        while j >= 0 and values[j] > key:
            values[j + 1] = values[j]
            j -= 1
        values[j + 1] = key
    return values`,
    },
    {
      id: "merge-sort",
      title: "Merge Sort and Divide-and-Conquer Counting",
      type: "theory",
      content: `
## Split, solve, combine

Merge sort splits the array until each piece has one item, recursively sorts both halves, then merges two sorted sequences in linear time.

The recurrence is **T(n)=2T(n/2)+O(n)**, so total time is O(n log n). The merge buffer uses O(n) extra space. A careful merge that takes from the left on ties is stable.

### Why merge sort is more than sorting

During merge, if a right value is chosen before the remaining left values, it forms an inversion with all of them. This counts inversions in O(n log n) instead of O(n²).

Merge-based methods are natural for linked lists and external sorting because they access data sequentially rather than requiring random access.
      `,
      diagram: `flowchart TD
        A["[7,2,5,1]"] --> B["[7,2]"]
        A --> C["[5,1]"]
        B --> D["[7]"]
        B --> E["[2]"]
        C --> F["[5]"]
        C --> G["[1]"]
        D --> H["[2,7]"]
        E --> H
        F --> I["[1,5]"]
        G --> I
        H --> J["[1,2,5,7]"]
        I --> J`,
      code: `def merge_sort(values):
    if len(values) <= 1:
        return values

    mid = len(values) // 2
    left = merge_sort(values[:mid])
    right = merge_sort(values[mid:])
    merged = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1

    return merged + left[i:] + right[j:]`,
    },
    {
      id: "quicksort-partition",
      title: "Quicksort and Partitioning",
      type: "theory",
      content: `
## Partition around a pivot

Quicksort rearranges values into regions relative to a pivot, then recursively sorts the outer regions. Balanced partitions give O(n log n); repeatedly choosing an extreme pivot gives O(n²).

### Lomuto partition invariant

- **[low, boundary)** contains values ≤ pivot.
- **[boundary, scan)** contains values > pivot.
- **[scan, high)** is unknown.

Randomizing the pivot makes the bad case unlikely for ordinary data. Three-way partitioning creates **less than**, **equal to**, and **greater than** pivot regions and performs well with many duplicates.

Quicksort is commonly fast because of locality and low constants, but production library sorts provide stronger guarantees and handle corner cases carefully.
      `,
      diagram: `flowchart LR
        A["< pivot"] --> B["= pivot"] --> C["> pivot"] --> D["unknown"]
        D --> E["Classify next value"]
        E --> A`,
      code: `from random import randrange

def quicksort(values, low=0, high=None):
    if high is None:
        high = len(values) - 1
    if low >= high:
        return

    pivot_index = randrange(low, high + 1)
    values[pivot_index], values[high] = values[high], values[pivot_index]
    pivot = values[high]
    boundary = low

    for scan in range(low, high):
        if values[scan] <= pivot:
            values[boundary], values[scan] = values[scan], values[boundary]
            boundary += 1

    values[boundary], values[high] = values[high], values[boundary]
    quicksort(values, low, boundary - 1)
    quicksort(values, boundary + 1, high)`,
    },
    {
      id: "heap-counting-radix",
      title: "Heap Sort, Counting Sort, and Radix Sort",
      type: "theory",
      content: `
## Different assumptions produce different guarantees

### Heap sort

Build a max heap in O(n), repeatedly swap the root with the last active item, and restore the heap in O(log n). Total time is O(n log n), auxiliary space is O(1), and it is not stable.

### Counting sort

Count each integer key, accumulate positions, then place values. Time and space are O(n+k), where k is the key range. It is excellent when k is close to n and wasteful when keys span billions.

### Radix sort

Stably sort by one digit at a time, from least significant to most significant. With d digits and base b, time is O(d(n+b)). Correctness depends on the per-digit sort being stable.

These are not violations of the Ω(n log n) comparison bound because they inspect key structure rather than treating comparisons as the only allowed operation.
      `,
      diagram: `flowchart LR
        A["170, 45, 75, 90"] --> B["Stable sort by ones"]
        B --> C["Stable sort by tens"]
        C --> D["Stable sort by hundreds"]
        D --> E["45, 75, 90, 170"]`,
      code: `def counting_sort(values):
    if not values:
        return []
    minimum, maximum = min(values), max(values)
    counts = [0] * (maximum - minimum + 1)
    for value in values:
        counts[value - minimum] += 1

    result = []
    for offset, count in enumerate(counts):
        result.extend([offset + minimum] * count)
    return result`,
    },
    {
      id: "quickselect",
      title: "Quickselect and Order Statistics",
      type: "theory",
      content: `
## Find one rank without sorting everything

Quickselect uses quicksort's partition step but recurses into only the side containing the desired rank. Expected time is O(n), worst-case O(n²), and extra space can be O(1) iteratively.

For the kth largest in an array of length n, search for zero-based sorted index **n-k**.

### Choose among three approaches

| Approach | Time | Space | Best when |
|---|---:|---:|---|
| Sort | O(n log n) | depends | Need full order or simplest solution |
| Heap of size k | O(n log k) | O(k) | Streaming or small k |
| Quickselect | O(n) expected | O(1) | In-memory array, only one rank |

Median-of-medians can guarantee linear worst-case time, but its constants and complexity make it uncommon in interviews.
      `,
      diagram: `flowchart TD
        A["Partition"] --> B{"pivot index = k?"}
        B -->|yes| C["Return pivot"]
        B -->|k smaller| D["Keep left partition"]
        B -->|k larger| E["Keep right partition"]
        D --> A
        E --> A`,
      code: `from random import randrange

def kth_largest(values, k):
    target = len(values) - k
    left, right = 0, len(values) - 1

    while left <= right:
        pivot_index = randrange(left, right + 1)
        values[pivot_index], values[right] = values[right], values[pivot_index]
        pivot = values[right]
        boundary = left

        for i in range(left, right):
            if values[i] <= pivot:
                values[boundary], values[i] = values[i], values[boundary]
                boundary += 1
        values[boundary], values[right] = values[right], values[boundary]

        if boundary == target:
            return values[boundary]
        if boundary < target:
            left = boundary + 1
        else:
            right = boundary - 1

    raise ValueError("k is out of range")`,
    },
    {
      id: "divide-and-conquer",
      title: "Divide and Conquer Beyond Sorting",
      type: "theory",
      content: `
## Divide and conquer has three obligations

1. **Divide** into smaller instances.
2. **Conquer** them recursively.
3. **Combine** their answers efficiently.

The split alone does not guarantee speed. The number and size of subproblems plus combine cost determine the recurrence.

| Recurrence | Example | Complexity |
|---|---|---:|
| T(n)=T(n/2)+O(1) | Binary search | O(log n) |
| T(n)=2T(n/2)+O(n) | Merge sort | O(n log n) |
| T(n)=2T(n/2)+O(1) | Tree-style recurrence | O(n) |
| T(n)=T(n-1)+O(n) | Bad quicksort | O(n²) |

Other examples include fast exponentiation, closest pair of points, Karatsuba multiplication, and divide-and-conquer DP optimization.

Always define a base case, prove subproblems are smaller, and count the combine work at every recursion level.
      `,
      diagram: `flowchart TD
        A["Size n"] --> B["Subproblem n/2"]
        A --> C["Subproblem n/2"]
        B --> D["Solve"]
        C --> E["Solve"]
        D --> F["Combine in O(n)"]
        E --> F`,
      code: `def power(base, exponent):
    if exponent == 0:
        return 1
    half = power(base, exponent // 2)
    result = half * half
    if exponent % 2 == 1:
        result *= base
    return result`,
    },
  ],
};
