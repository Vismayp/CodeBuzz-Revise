export const heapsTopic = {
  id: "heaps",
  title: "Heaps & Priority Queues",
  description:
    "Master heap operations, top-k problems, and priority queue applications.",
  icon: "Pyramid",
  sections: [
    // ============== THEORY SECTIONS ==============
    {
      id: "heap-fundamentals",
      title: "Heap Fundamentals",
      type: "theory",
      content: `
## Heaps: Complete Binary Trees with Heap Property

A heap is a complete binary tree that satisfies the heap property.

### Types of Heaps
| Type | Property | Use |
|------|----------|-----|
| **Max Heap** | Parent ≥ Children | Find maximum |
| **Min Heap** | Parent ≤ Children | Find minimum |

### Complete Binary Tree Property
- All levels filled except possibly the last
- Last level filled left to right
- Can be efficiently stored in array!

### Array Representation
For node at index $i$:
- **Parent**: $\\lfloor (i-1)/2 \\rfloor$
- **Left Child**: $2i + 1$
- **Right Child**: $2i + 2$

### Time Complexity
| Operation | Time |
|-----------|------|
| Insert | O(log n) |
| Extract Min/Max | O(log n) |
| Peek Min/Max | O(1) |
| Build Heap | O(n) |
| Heapify | O(log n) |

### When to Use Heaps
1. Find k largest/smallest elements
2. Merge k sorted lists
3. Continuous median tracking
4. Priority scheduling
5. Dijkstra's shortest path
      `,
      diagram: `
graph TD
    subgraph "Max Heap Array: [100, 19, 36, 17, 3, 25, 1, 2, 7]"
    A[100] --> B[19]
    A --> C[36]
    B --> D[17]
    B --> E[3]
    C --> F[25]
    C --> G[1]
    D --> H[2]
    D --> I[7]
    end
      `,
      code: `// MinHeap Implementation
class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    // Helper methods
    getParentIndex(i) { return Math.floor((i - 1) / 2); }
    getLeftChildIndex(i) { return 2 * i + 1; }
    getRightChildIndex(i) { return 2 * i + 2; }
    
    hasParent(i) { return this.getParentIndex(i) >= 0; }
    hasLeftChild(i) { return this.getLeftChildIndex(i) < this.heap.length; }
    hasRightChild(i) { return this.getRightChildIndex(i) < this.heap.length; }
    
    parent(i) { return this.heap[this.getParentIndex(i)]; }
    leftChild(i) { return this.heap[this.getLeftChildIndex(i)]; }
    rightChild(i) { return this.heap[this.getRightChildIndex(i)]; }
    
    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
    
    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }
    
    size() {
        return this.heap.length;
    }
    
    // Insert - O(log n)
    insert(value) {
        this.heap.push(value);
        this.heapifyUp();
    }
    
    heapifyUp() {
        let index = this.heap.length - 1;
        
        while (this.hasParent(index) && this.parent(index) > this.heap[index]) {
            this.swap(this.getParentIndex(index), index);
            index = this.getParentIndex(index);
        }
    }
    
    // Extract Min - O(log n)
    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown();
        
        return min;
    }
    
    heapifyDown() {
        let index = 0;
        
        while (this.hasLeftChild(index)) {
            let smallerChildIndex = this.getLeftChildIndex(index);
            
            if (this.hasRightChild(index) && 
                this.rightChild(index) < this.leftChild(index)) {
                smallerChildIndex = this.getRightChildIndex(index);
            }
            
            if (this.heap[index] <= this.heap[smallerChildIndex]) {
                break;
            }
            
            this.swap(index, smallerChildIndex);
            index = smallerChildIndex;
        }
    }
}

// Usage
const minHeap = new MinHeap();
minHeap.insert(10);
minHeap.insert(5);
minHeap.insert(15);
minHeap.insert(3);
// Heap: [3, 5, 15, 10]
console.log(minHeap.extractMin()); // 3
// Heap: [5, 10, 15]`,
    },
    {
      id: "heap-applications",
      title: "Heap Applications & Patterns",
      type: "theory",
      content: `
## Common Heap Patterns

### Pattern 1: Top K Elements
- **K Largest**: Use Min Heap of size K
- **K Smallest**: Use Max Heap of size K

Why opposite? When finding K largest, we keep removing smallest from our candidates.

### Pattern 2: K-Way Merge
Merge K sorted arrays:
1. Insert first element from each array into min heap
2. Extract min, add next element from same array
3. Repeat until all elements processed

### Pattern 3: Two Heaps (Median)
Use two heaps to track running median:
- Max Heap: Lower half (get max of lower)
- Min Heap: Upper half (get min of upper)
- Median = (maxHeap.top + minHeap.top) / 2

### JavaScript Priority Queue
Use array with custom sorting, or use a library like \`heap-js\`.
      `,
      code: `// Pattern 1: Find K Largest Elements
function findKLargest(nums, k) {
    const minHeap = new MinHeap();
    
    for (const num of nums) {
        minHeap.insert(num);
        
        // Keep only k elements
        if (minHeap.size() > k) {
            minHeap.extractMin();
        }
    }
    
    // Heap contains k largest elements
    const result = [];
    while (minHeap.size() > 0) {
        result.push(minHeap.extractMin());
    }
    return result.reverse(); // Largest to smallest
}

// Pattern 2: Merge K Sorted Arrays
function mergeKSortedArrays(arrays) {
    const result = [];
    const minHeap = new MinHeap(); // Store {val, arrayIndex, elementIndex}
    
    // Initialize with first element of each array
    for (let i = 0; i < arrays.length; i++) {
        if (arrays[i].length > 0) {
            minHeap.insert({val: arrays[i][0], arr: i, idx: 0});
        }
    }
    
    while (minHeap.size() > 0) {
        const {val, arr, idx} = minHeap.extractMin();
        result.push(val);
        
        // Add next element from same array
        if (idx + 1 < arrays[arr].length) {
            minHeap.insert({
                val: arrays[arr][idx + 1],
                arr: arr,
                idx: idx + 1
            });
        }
    }
    
    return result;
}

// Pattern 3: Running Median using Two Heaps
class MedianFinder {
    constructor() {
        this.maxHeap = new MaxHeap(); // Lower half
        this.minHeap = new MinHeap(); // Upper half
    }
    
    addNum(num) {
        // Add to maxHeap (lower half) first
        this.maxHeap.insert(num);
        
        // Balance: move max of lower to upper
        this.minHeap.insert(this.maxHeap.extractMax());
        
        // Ensure maxHeap has more or equal elements
        if (this.maxHeap.size() < this.minHeap.size()) {
            this.maxHeap.insert(this.minHeap.extractMin());
        }
    }
    
    findMedian() {
        if (this.maxHeap.size() > this.minHeap.size()) {
            return this.maxHeap.peek();
        }
        return (this.maxHeap.peek() + this.minHeap.peek()) / 2;
    }
}

// Using built-in sort (simpler but less efficient for large data)
function kthLargestSimple(nums, k) {
    nums.sort((a, b) => b - a);
    return nums[k - 1];
}`,
    },
    // ============== PROBLEM SECTIONS ==============
    {
      id: "problem-kth-largest",
      title: "Kth Largest Element in Array",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Facebook", "Microsoft", "Google", "Apple"],
      leetcode:
        "https://leetcode.com/problems/kth-largest-element-in-an-array/",
      content: `
## LeetCode #215: Kth Largest Element in an Array

Given an integer array nums and an integer k, return the kth largest element.

### Example
\`\`\`
Input: nums = [3,2,1,5,6,4], k = 2
Output: 5
\`\`\`

### Three Approaches
1. **Sort**: O(n log n)
2. **Min Heap of size k**: O(n log k)
3. **QuickSelect**: O(n) average
      `,
      code: `// Approach 1: Sort - O(n log n)
function findKthLargest1(nums, k) {
    nums.sort((a, b) => b - a);
    return nums[k - 1];
}

// Approach 2: Min Heap of size K - O(n log k)
function findKthLargest2(nums, k) {
    const minHeap = new MinHeap();
    
    for (const num of nums) {
        minHeap.insert(num);
        if (minHeap.size() > k) {
            minHeap.extractMin();
        }
    }
    
    return minHeap.peek();
}

// Dry Run: nums = [3,2,1,5,6,4], k = 2
// Insert 3: heap = [3]
// Insert 2: heap = [2, 3]
// Insert 1: heap = [1, 3, 2], size > 2, extract 1 → heap = [2, 3]
// Insert 5: heap = [2, 3, 5], size > 2, extract 2 → heap = [3, 5]
// Insert 6: heap = [3, 5, 6], size > 2, extract 3 → heap = [5, 6]
// Insert 4: heap = [4, 6, 5], size > 2, extract 4 → heap = [5, 6]
// Return peek = 5 (2nd largest)

// Approach 3: QuickSelect - O(n) average
function findKthLargest3(nums, k) {
    // Convert to "kth smallest from end"
    const targetIndex = nums.length - k;
    
    function quickSelect(left, right) {
        const pivot = nums[right];
        let partitionIndex = left;
        
        for (let i = left; i < right; i++) {
            if (nums[i] <= pivot) {
                [nums[i], nums[partitionIndex]] = [nums[partitionIndex], nums[i]];
                partitionIndex++;
            }
        }
        
        [nums[partitionIndex], nums[right]] = [nums[right], nums[partitionIndex]];
        
        if (partitionIndex === targetIndex) {
            return nums[partitionIndex];
        } else if (partitionIndex < targetIndex) {
            return quickSelect(partitionIndex + 1, right);
        } else {
            return quickSelect(left, partitionIndex - 1);
        }
    }
    
    return quickSelect(0, nums.length - 1);
}`,
    },
    {
      id: "problem-top-k-frequent",
      title: "Top K Frequent Elements",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Facebook", "Google", "Microsoft", "Apple"],
      leetcode: "https://leetcode.com/problems/top-k-frequent-elements/",
      content: `
## LeetCode #347: Top K Frequent Elements

Given an integer array nums and an integer k, return the k most frequent elements.

### Example
\`\`\`
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]
\`\`\`

### Approaches
1. **Hash Map + Sort**: O(n log n)
2. **Min Heap**: O(n log k)
3. **Bucket Sort**: O(n) - Best!
      `,
      code: `// Approach 1: Hash Map + Min Heap - O(n log k)
function topKFrequent(nums, k) {
    // Count frequencies
    const freqMap = new Map();
    for (const num of nums) {
        freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }
    
    // Use min heap of size k
    // Store {freq, num}
    const minHeap = [];
    
    const heapPush = (item) => {
        minHeap.push(item);
        let i = minHeap.length - 1;
        while (i > 0 && minHeap[i].freq < minHeap[Math.floor((i-1)/2)].freq) {
            [minHeap[i], minHeap[Math.floor((i-1)/2)]] = 
                [minHeap[Math.floor((i-1)/2)], minHeap[i]];
            i = Math.floor((i-1)/2);
        }
    };
    
    const heapPop = () => {
        const min = minHeap[0];
        const last = minHeap.pop();
        if (minHeap.length > 0) {
            minHeap[0] = last;
            let i = 0;
            while (true) {
                let smallest = i;
                const left = 2*i + 1, right = 2*i + 2;
                if (left < minHeap.length && minHeap[left].freq < minHeap[smallest].freq) {
                    smallest = left;
                }
                if (right < minHeap.length && minHeap[right].freq < minHeap[smallest].freq) {
                    smallest = right;
                }
                if (smallest === i) break;
                [minHeap[i], minHeap[smallest]] = [minHeap[smallest], minHeap[i]];
                i = smallest;
            }
        }
        return min;
    };
    
    for (const [num, freq] of freqMap) {
        heapPush({num, freq});
        if (minHeap.length > k) heapPop();
    }
    
    return minHeap.map(item => item.num);
}

// Approach 2: Bucket Sort - O(n)
function topKFrequentBucket(nums, k) {
    // Count frequencies
    const freqMap = new Map();
    for (const num of nums) {
        freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }
    
    // Create buckets where index = frequency
    const buckets = Array(nums.length + 1).fill(null).map(() => []);
    
    for (const [num, freq] of freqMap) {
        buckets[freq].push(num);
    }
    
    // Collect k most frequent (from highest frequency)
    const result = [];
    for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
        result.push(...buckets[i]);
    }
    
    return result.slice(0, k);
}

// Dry Run: nums = [1,1,1,2,2,3], k = 2
// freqMap: {1: 3, 2: 2, 3: 1}
// buckets: [[], [3], [2], [1], [], [], []]
//           0    1    2    3   4   5   6
// From end: bucket[3] = [1] → result = [1]
//           bucket[2] = [2] → result = [1, 2]
// Return [1, 2]`,
    },
    {
      id: "problem-merge-k-lists",
      title: "Merge K Sorted Lists",
      type: "problem",
      difficulty: "Hard",
      companies: ["Amazon", "Facebook", "Microsoft", "Google", "Apple"],
      leetcode: "https://leetcode.com/problems/merge-k-sorted-lists/",
      content: `
## LeetCode #23: Merge k Sorted Lists

Merge k sorted linked lists and return it as one sorted list.

### Example
\`\`\`
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]
\`\`\`

### Approaches
1. **Min Heap**: O(n log k) - Push heads, extract min, push next
2. **Divide and Conquer**: O(n log k) - Merge pairs recursively
      `,
      code: `// Approach 1: Min Heap - O(n log k)
function mergeKLists(lists) {
    const minHeap = new MinPriorityQueue({ priority: x => x.val });
    
    // Add all list heads to heap
    for (const head of lists) {
        if (head) minHeap.enqueue(head);
    }
    
    const dummy = new ListNode(0);
    let current = dummy;
    
    while (!minHeap.isEmpty()) {
        const node = minHeap.dequeue().element;
        current.next = node;
        current = current.next;
        
        if (node.next) {
            minHeap.enqueue(node.next);
        }
    }
    
    return dummy.next;
}

// Approach 2: Divide and Conquer - O(n log k)
function mergeKListsDC(lists) {
    if (lists.length === 0) return null;
    
    while (lists.length > 1) {
        const mergedLists = [];
        
        for (let i = 0; i < lists.length; i += 2) {
            const l1 = lists[i];
            const l2 = i + 1 < lists.length ? lists[i + 1] : null;
            mergedLists.push(mergeTwoLists(l1, l2));
        }
        
        lists = mergedLists;
    }
    
    return lists[0];
}

function mergeTwoLists(l1, l2) {
    const dummy = new ListNode(0);
    let current = dummy;
    
    while (l1 && l2) {
        if (l1.val <= l2.val) {
            current.next = l1;
            l1 = l1.next;
        } else {
            current.next = l2;
            l2 = l2.next;
        }
        current = current.next;
    }
    
    current.next = l1 || l2;
    return dummy.next;
}

// Dry Run for [[1,4,5],[1,3,4],[2,6]]:
// Heap approach:
// Initial heap: [1(list0), 1(list1), 2(list2)]
// Extract 1(list0), push 4 → heap: [1(list1), 2(list2), 4(list0)]
// Extract 1(list1), push 3 → heap: [2(list2), 3(list1), 4(list0)]
// Extract 2(list2), push 6 → heap: [3(list1), 4(list0), 6(list2)]
// Continue...
// Result: 1 → 1 → 2 → 3 → 4 → 4 → 5 → 6`,
    },
    {
      id: "problem-find-median",
      title: "Find Median from Data Stream",
      type: "problem",
      difficulty: "Hard",
      companies: ["Amazon", "Microsoft", "Google", "Facebook", "Apple"],
      leetcode: "https://leetcode.com/problems/find-median-from-data-stream/",
      content: `
## LeetCode #295: Find Median from Data Stream

Design a data structure that supports adding integers and finding the median.

### Key Insight: Two Heaps
- **Max Heap**: Stores smaller half
- **Min Heap**: Stores larger half
- Keep sizes balanced (maxHeap can have 1 more)
- Median = maxHeap.top (odd) or average of both tops (even)
      `,
      code: `class MedianFinder {
    constructor() {
        // Max heap for lower half (store negatives for max behavior)
        this.maxHeap = new MinPriorityQueue();
        // Min heap for upper half
        this.minHeap = new MinPriorityQueue();
    }
    
    addNum(num) {
        // Add to max heap (lower half) - negate for max behavior
        this.maxHeap.enqueue(-num);
        
        // Balance: move max of lower to upper
        this.minHeap.enqueue(-this.maxHeap.dequeue().element);
        
        // Ensure maxHeap has >= elements
        if (this.maxHeap.size() < this.minHeap.size()) {
            this.maxHeap.enqueue(-this.minHeap.dequeue().element);
        }
    }
    
    findMedian() {
        if (this.maxHeap.size() > this.minHeap.size()) {
            return -this.maxHeap.front().element;
        }
        return (-this.maxHeap.front().element + this.minHeap.front().element) / 2;
    }
}

// Manual implementation without library
class MedianFinderManual {
    constructor() {
        this.lower = []; // Max heap (store negatives)
        this.upper = []; // Min heap
    }
    
    addNum(num) {
        // Add to lower (max heap)
        this._heapPush(this.lower, -num);
        
        // Move max of lower to upper
        this._heapPush(this.upper, -this._heapPop(this.lower));
        
        // Balance sizes
        if (this.lower.length < this.upper.length) {
            this._heapPush(this.lower, -this._heapPop(this.upper));
        }
    }
    
    findMedian() {
        if (this.lower.length > this.upper.length) {
            return -this.lower[0];
        }
        return (-this.lower[0] + this.upper[0]) / 2;
    }
    
    _heapPush(heap, val) {
        heap.push(val);
        let i = heap.length - 1;
        while (i > 0) {
            const parent = Math.floor((i - 1) / 2);
            if (heap[parent] <= heap[i]) break;
            [heap[parent], heap[i]] = [heap[i], heap[parent]];
            i = parent;
        }
    }
    
    _heapPop(heap) {
        const min = heap[0];
        const last = heap.pop();
        if (heap.length > 0) {
            heap[0] = last;
            let i = 0;
            while (true) {
                let smallest = i;
                const left = 2 * i + 1;
                const right = 2 * i + 2;
                if (left < heap.length && heap[left] < heap[smallest]) smallest = left;
                if (right < heap.length && heap[right] < heap[smallest]) smallest = right;
                if (smallest === i) break;
                [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
                i = smallest;
            }
        }
        return min;
    }
}

// Dry Run: addNum sequence [1, 2, 3]
// Add 1: lower = [-1], upper = []
//        After balance: lower = [-1], upper = []
//        Median = -(-1) = 1
// Add 2: lower = [-1], upper = [2]
//        Median = (1 + 2) / 2 = 1.5
// Add 3: lower = [-2, -1], upper = [3]
//        Median = -(-2) = 2`,
    },
    {
      id: "problem-task-scheduler",
      title: "Task Scheduler",
      type: "problem",
      difficulty: "Medium",
      companies: ["Amazon", "Facebook", "Microsoft", "Google", "Bloomberg"],
      leetcode: "https://leetcode.com/problems/task-scheduler/",
      content: `
## LeetCode #621: Task Scheduler

Given tasks array and cooldown n, find minimum intervals to finish all tasks.
Same tasks must be n intervals apart.

### Example
\`\`\`
Input: tasks = ["A","A","A","B","B","B"], n = 2
Output: 8
Explanation: A → B → idle → A → B → idle → A → B
\`\`\`

### Key Insight: Max Heap
Always schedule the most frequent task first.
Use heap to track remaining counts.
      `,
      code: `function leastInterval(tasks, n) {
    // Count frequencies
    const freq = new Array(26).fill(0);
    for (const task of tasks) {
        freq[task.charCodeAt(0) - 65]++;
    }
    
    // Max heap (use negative for max behavior with min heap)
    const maxHeap = [];
    for (const f of freq) {
        if (f > 0) maxHeap.push(-f);
    }
    heapify(maxHeap);
    
    let time = 0;
    const cooldownQueue = []; // [count, availableTime]
    
    while (maxHeap.length > 0 || cooldownQueue.length > 0) {
        time++;
        
        if (maxHeap.length > 0) {
            const count = -heapPop(maxHeap) - 1;
            if (count > 0) {
                cooldownQueue.push([count, time + n]);
            }
        }
        
        // Check if any task is ready
        if (cooldownQueue.length > 0 && cooldownQueue[0][1] === time) {
            heapPush(maxHeap, -cooldownQueue.shift()[0]);
        }
    }
    
    return time;
}

// Alternative: Math approach - O(n)
function leastIntervalMath(tasks, n) {
    const freq = new Array(26).fill(0);
    let maxFreq = 0;
    
    for (const task of tasks) {
        freq[task.charCodeAt(0) - 65]++;
        maxFreq = Math.max(maxFreq, freq[task.charCodeAt(0) - 65]);
    }
    
    // Count tasks with max frequency
    let maxCount = 0;
    for (const f of freq) {
        if (f === maxFreq) maxCount++;
    }
    
    // Minimum time needed:
    // (maxFreq - 1) chunks of (n + 1) slots + maxCount for last chunk
    const minTime = (maxFreq - 1) * (n + 1) + maxCount;
    
    // Can't be less than total tasks
    return Math.max(minTime, tasks.length);
}

// Dry Run: tasks = ["A","A","A","B","B","B"], n = 2
// freq: A=3, B=3, maxFreq=3, maxCount=2
// minTime = (3-1) * (2+1) + 2 = 2 * 3 + 2 = 8
// tasks.length = 6
// return max(8, 6) = 8
//
// Visual:
// [A] [B] [_] [A] [B] [_] [A] [B]
//  1   2   3   4   5   6   7   8`,
    },
  ],
};
