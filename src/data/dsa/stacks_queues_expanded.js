export const expandedStackQueueSections = [
  {
    id: "stack-queue-mental-models",
    title: "LIFO and FIFO: The Mental Models",
    type: "theory",
    content: `
## A data structure is a promise about removal order

A **stack** promises that the most recently inserted unfinished item leaves first (LIFO). A **queue** promises that the oldest waiting item leaves first (FIFO). The promise—not the container—is the abstraction. Python lists, linked nodes, and circular arrays can all implement it.

### Think in unresolved work

- A stack stores work that is **nested**: function calls, open brackets, DFS branches, undo history.
- A queue stores work that is **waiting in discovery order**: BFS frontiers, requests, simulations, and producer-consumer buffers.
- A deque permits both ends and is useful when candidates can expire at the front while weaker candidates are removed at the back.

### Complexity contract

| Structure | Add | Remove | Inspect | Space |
|---|---:|---:|---:|---:|
| Stack | O(1) amortized | O(1) | O(1) | O(n) |
| Queue with deque/circular buffer | O(1) | O(1) | O(1) | O(n) |
| Python list used as queue | O(1) append | O(n) pop(0) | O(1) | O(n) |

Dynamic arrays occasionally resize, so a single push may cost O(n), but a sequence of pushes costs O(1) **amortized** per operation. Choose the structure by the order your algorithm must preserve.
    `,
    diagram: `flowchart LR
      A["arrival: A then B then C"] --> S["stack top: C, B, A"]
      A --> Q["queue front: A, B, C"]
      S --> SO["removal: C then B then A"]
      Q --> QO["removal: A then B then C"]`,
    code: `from collections import deque

stack = []
for item in "ABC":
    stack.append(item)
stack_order = [stack.pop() for _ in range(len(stack))]

queue = deque("ABC")
queue_order = [queue.popleft() for _ in range(len(queue))]

assert stack_order == ["C", "B", "A"]
assert queue_order == ["A", "B", "C"]`,
  },
  {
    id: "stack-deferred-obligations",
    title: "Stacks as Deferred Obligations",
    type: "theory",
    content: `
## Why nested problems naturally need a stack

When an opening event creates an obligation that must be completed after all newer obligations, the obligations are nested. The latest opening must close first. That is exactly LIFO.

For bracket validation, the stack contains the opening brackets that have not yet been matched. Its invariant is: **after processing a prefix, the stack is precisely the unmatched openings in their original order**. A closing bracket must match the top because no older opening can close while a newer one remains open.

The same idea explains the runtime call stack. Each frame stores a return address, local variables, and the point at which the caller resumes. Recursion is therefore an implicit stack; iterative DFS makes that stack explicit. Explicit stacks avoid recursion-depth limits and allow the program to store only the state it needs.

### Failure cases

- Closing while the stack is empty: there is no obligation to satisfy.
- Closing with the wrong type: nesting order is broken.
- Nonempty stack at the end: some obligations were never completed.

This invariant gives both the implementation and its correctness proof.
    `,
    diagram: `flowchart TD
      I["read token"] --> O{"opening?"}
      O -->|yes| P["push expected closer"]
      O -->|no| M{"equals stack top?"}
      M -->|yes| R["pop obligation"]
      M -->|no| F["invalid"]
      P --> I
      R --> I`,
    code: `def valid_brackets(text: str) -> bool:
    expected = {"(": ")", "[": "]", "{": "}"}
    stack: list[str] = []

    for char in text:
        if char in expected:
            stack.append(expected[char])
        elif char in ")]}":
            if not stack or stack.pop() != char:
                return False
    return not stack

assert valid_brackets("([{}])")
assert not valid_brackets("([)]")`,
  },
  {
    id: "expression-stacks",
    title: "Expression Parsing and Evaluation",
    type: "theory",
    content: `
## Stacks turn syntax into executable order

Postfix notation places an operator after its operands, so evaluation needs one value stack. Read left to right: push numbers; for an operator, pop the **right** operand and then the **left** operand, compute, and push the result. After valid input, exactly one value remains.

In infix notation, precedence and parentheses delay operators. The shunting-yard method uses an output sequence plus an operator stack. Before pushing a new operator, pop operators that bind more tightly (or equally tightly for left-associative operators). Parentheses act as barriers rather than appearing in the postfix output.

This is the same pipeline used by simple calculators and a miniature version of compiler parsing:

1. **Tokenize** characters into numbers, names, and operators.
2. **Parse** according to precedence and associativity.
3. **Evaluate** directly or construct an abstract syntax tree.

Watch operand order for subtraction and division, reject insufficient operands, and verify that one final value remains.
    `,
    diagram: `flowchart LR
      T["tokens: 3 4 2 * +"] --> V["value stack"]
      V --> A["push 3, 4, 2"]
      A --> B["* pops 2 and 4; pushes 8"]
      B --> C["+ pops 8 and 3; pushes 11"]`,
    code: `import operator

def evaluate_postfix(tokens: list[str]) -> int:
    operations = {
        "+": operator.add, "-": operator.sub,
        "*": operator.mul, "/": lambda a, b: int(a / b),
    }
    values: list[int] = []
    for token in tokens:
        if token not in operations:
            values.append(int(token))
            continue
        right = values.pop()
        left = values.pop()
        values.append(operations[token](left, right))
    if len(values) != 1:
        raise ValueError("malformed expression")
    return values[0]

assert evaluate_postfix(["3", "4", "2", "*", "+"]) == 11`,
  },
  {
    id: "monotonic-stack-invariant-expanded",
    title: "Monotonic Stack: Candidates, Not Sorting",
    type: "theory",
    content: `
## Keep only candidates whose answer is still unknown

A monotonic stack is not used to sort the input. It compresses a prefix into elements that might still matter. For next-greater-to-the-right, scan left to right and store indices whose warmer/larger successor is unknown. When a new value is larger than the top candidate, it resolves that candidate; keep popping while it resolves more.

The invariant for Daily Temperatures is: **indices in the stack are increasing, their temperatures are nonincreasing, and none has found a warmer day yet**. Once index i is popped by index j, j is the first warmer day: any earlier day after i would already have popped i.

Each index is pushed once and popped at most once, so the nested while-loop is O(n), not O(n²). This accounting argument is a standard amortized proof.

### Four-direction checklist

Choose next or previous, greater or smaller, strict or non-strict. Duplicate handling follows the problem: popping equal values changes whether an equal element is accepted as a boundary.
    `,
    diagram: `flowchart LR
      A["73 waits"] --> B["74 arrives"]
      B --> C["pop 73; answer distance 1"]
      C --> D["75 arrives"]
      D --> E["pop 74; answer distance 1"]
      E --> F["stack now holds unresolved 75"]`,
    code: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    answer = [0] * len(temperatures)
    unresolved: list[int] = []

    for today, temperature in enumerate(temperatures):
        while unresolved and temperatures[unresolved[-1]] < temperature:
            earlier = unresolved.pop()
            answer[earlier] = today - earlier
        unresolved.append(today)
    return answer

assert daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]) == [1, 1, 4, 2, 1, 1, 0, 0]`,
  },
  {
    id: "histogram-boundaries",
    title: "Histogram Boundaries and Contribution Patterns",
    type: "theory",
    content: `
## A pop event reveals a maximal span

In the largest-rectangle problem, keep indices of nondecreasing heights. When a shorter bar arrives, every taller bar on top can extend no farther right. After popping index k, the current index i is the first smaller boundary on the right, and the new stack top is the first smaller boundary on the left. Therefore width is i - stack[-1] - 1, or i when the stack becomes empty.

Append an imaginary height 0 sentinel to flush all remaining bars. The sentinel removes a separate cleanup loop without changing any real optimum.

This **contribution** viewpoint generalizes. Instead of asking for the answer at each position, ask: for which interval is this element the controlling minimum or maximum? Previous-smaller and next-smaller boundaries appear in sum-of-subarray-minimums, maximal rectangles, and visibility problems.

With duplicates, make one boundary strict and the other non-strict so every subarray is assigned to exactly one equal element. Otherwise contributions may be double-counted.
    `,
    diagram: `flowchart TD
      S["increasing indices: 1, 5, 6"] --> X["height 2 arrives"]
      X --> P1["pop 6: right boundary found"]
      P1 --> P2["pop 5: width extends back to height 1"]
      P2 --> K["push height 2 as new candidate"]`,
    code: `def largest_rectangle(heights: list[int]) -> int:
    best = 0
    stack: list[int] = []
    extended = heights + [0]

    for right, height in enumerate(extended):
        while stack and extended[stack[-1]] > height:
            bar = stack.pop()
            left = stack[-1] if stack else -1
            width = right - left - 1
            best = max(best, extended[bar] * width)
        stack.append(right)
    return best

assert largest_rectangle([2, 1, 5, 6, 2, 3]) == 10`,
  },
  {
    id: "circular-queue-deque",
    title: "Circular Queues and Deques",
    type: "theory",
    content: `
## Reuse storage instead of shifting it

Removing index 0 from an array shifts every remaining value and costs O(n). A circular queue stores a fixed array plus a front index and a size. Logical position k maps to physical index (front + k) modulo capacity, so both ends wrap around without moving existing elements.

Track **size** explicitly to distinguish full from empty when front and rear coincide. With capacity c: enqueue writes at (front + size) mod c and increments size; dequeue reads front, advances it modulo c, and decrements size.

A deque adds operations at both ends. Python's collections.deque is implemented for O(1) appends and pops on either side. Use it for BFS, 0-1 BFS, sliding-window extrema, and schedulers. Do not assume random indexing is cheap: a deque is designed around its ends.

Circular buffers are also useful in systems: bounded logs, audio buffers, network packets, and producer-consumer queues. A bounded buffer must define what happens when full—reject, block, resize, or overwrite.
    `,
    diagram: `flowchart LR
      A["physical slots: 0 1 2 3 4"] --> B["front = 3, size = 3"]
      B --> C["logical queue: slot 3, slot 4, slot 0"]
      C --> D["next enqueue writes slot 1"]`,
    code: `class CircularQueue:
    def __init__(self, capacity: int):
        if capacity <= 0:
            raise ValueError("capacity must be positive")
        self.data = [None] * capacity
        self.front = 0
        self.size = 0

    def enqueue(self, value: int) -> None:
        if self.size == len(self.data):
            raise OverflowError("queue is full")
        rear = (self.front + self.size) % len(self.data)
        self.data[rear] = value
        self.size += 1

    def dequeue(self) -> int:
        if self.size == 0:
            raise IndexError("queue is empty")
        value = self.data[self.front]
        self.front = (self.front + 1) % len(self.data)
        self.size -= 1
        return value`,
  },
  {
    id: "monotonic-deque-expanded",
    title: "Monotonic Deque for Sliding Windows",
    type: "theory",
    content: `
## Maintain the best live candidate at the front

For each window maximum, a deque stores indices in decreasing value order. Before inserting index i:

1. Remove the front while it lies outside the window.
2. Remove the back while its value is no larger than the new value.
3. Append i; the front is now the maximum.

Why can weaker values be discarded? A smaller earlier value expires sooner and can never beat the newer larger value in any future window. It is permanently dominated.

The invariant is: **indices increase from front to back, values decrease, and every stored index is inside the current window**. Each index enters and leaves once, giving O(n) time and O(k) space.

Do not confuse this with a heap solution. A heap can also produce maxima, but expired entries may remain and require lazy deletion, giving O(n log n) or O(n log k). The deque exploits the special one-directional movement of a fixed-width window to achieve linear time.
    `,
    diagram: `flowchart LR
      W["window values: 1, 3, -1"] --> D["deque indices: 1, 2"]
      D --> M["front value 3 is maximum"]
      N["next value -3"] --> E["expire old front when outside; remove dominated backs"]`,
    code: `from collections import deque

def sliding_window_maximum(nums: list[int], k: int) -> list[int]:
    if k <= 0 or k > len(nums):
        raise ValueError("invalid window size")
    candidates: deque[int] = deque()
    answer: list[int] = []

    for right, value in enumerate(nums):
        left = right - k + 1
        while candidates and candidates[0] < left:
            candidates.popleft()
        while candidates and nums[candidates[-1]] <= value:
            candidates.pop()
        candidates.append(right)
        if left >= 0:
            answer.append(nums[candidates[0]])
    return answer

assert sliding_window_maximum([1,3,-1,-3,5,3,6,7], 3) == [3,3,5,5,6,7]`,
  },
  {
    id: "stack-queue-design-and-testing",
    title: "Design Problems, Correctness, and Testing",
    type: "theory",
    content: `
## Transformations work by moving order between structures

A queue made from two stacks uses an input stack for new items and an output stack for removals. Transfer only when output is empty. Reversing the input stack makes its oldest item the output top. Although one transfer is O(n), each item moves at most once between stacks, so operations are O(1) amortized.

A min-stack augments each pushed value with the minimum of the entire prefix below it. The top pair therefore answers both top and minimum in O(1). This is a general design technique: store enough summary information at each state to undo safely.

### Testing checklist

- Empty operations and single-element transitions.
- Duplicate minima, equal monotonic values, and negative numbers.
- Circular wrap-around and full capacity.
- Long alternating sequences that force repeated transfers.
- Compare randomized operations against a simple reference model.

State the invariant before coding. For the two-stack queue: output top is the oldest transferable item; if output is empty, reversing all input restores FIFO order.
    `,
    diagram: `flowchart LR
      IN["input stack: newest on top"] -->|"transfer only if output empty"| OUT["output stack: oldest on top"]
      OUT --> D["dequeue oldest"]
      A["enqueue"] --> IN`,
    code: `class QueueWithStacks:
    def __init__(self):
        self.inbox: list[int] = []
        self.outbox: list[int] = []

    def enqueue(self, value: int) -> None:
        self.inbox.append(value)

    def _prepare(self) -> None:
        if not self.outbox:
            while self.inbox:
                self.outbox.append(self.inbox.pop())

    def dequeue(self) -> int:
        self._prepare()
        if not self.outbox:
            raise IndexError("queue is empty")
        return self.outbox.pop()

    def peek(self) -> int:
        self._prepare()
        if not self.outbox:
            raise IndexError("queue is empty")
        return self.outbox[-1]`,
  },
];
