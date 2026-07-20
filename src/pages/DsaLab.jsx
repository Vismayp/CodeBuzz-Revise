import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const labs = {
  pointers: {
    label: "Two pointers",
    title: "Two Sum in a sorted array",
    meta: "target = 15",
    takeaway: "Sorted order makes each pointer move safe: it removes a whole group of impossible pairs.",
    invariant: "If a solution remains, it lies between left and right.",
    steps: [
      { values: [1, 2, 4, 7, 11, 15], left: 0, right: 5, note: "1 + 15 = 16 is too large. Any pair using 15 with a later left value is also too large, so move right." },
      { values: [1, 2, 4, 7, 11, 15], left: 0, right: 4, note: "1 + 11 = 12 is too small. Pairing 1 with any smaller right value cannot reach 15, so move left." },
      { values: [1, 2, 4, 7, 11, 15], left: 1, right: 4, note: "2 + 11 = 13 is still too small. Move left again." },
      { values: [1, 2, 4, 7, 11, 15], left: 2, right: 4, found: true, note: "4 + 11 = 15. The target pair is found." },
    ],
  },
  binary: {
    label: "Binary search",
    title: "Find 23 by halving the interval",
    meta: "target = 23",
    takeaway: "Binary search is justified by a monotonic order, not by memorizing midpoint code.",
    invariant: "If 23 exists, its index is inside the highlighted interval.",
    steps: [
      { values: [3, 7, 11, 15, 19, 23, 27, 31], left: 0, right: 7, mid: 3, note: "Middle value 15 is smaller than 23. Sorted order eliminates indices 0 through 3." },
      { values: [3, 7, 11, 15, 19, 23, 27, 31], left: 4, right: 7, mid: 5, found: true, note: "Middle value 23 matches the target. Return index 5." },
    ],
  },
  sorting: {
    label: "Insertion sort",
    title: "Grow a sorted prefix",
    meta: "insert key = 3",
    takeaway: "Insertion sort is O(n²) in general but nearly linear when only a few values are out of place.",
    invariant: "Everything left of the key position is already sorted.",
    steps: [
      { values: [2, 5, 7, 3, 9], sortedEnd: 2, active: 3, note: "The prefix [2, 5, 7] is sorted. Save key 3 before shifting values." },
      { values: [2, 5, 7, 7, 9], sortedEnd: 2, active: 2, moving: [2, 3], note: "7 is larger than 3, so shift 7 one place right." },
      { values: [2, 5, 5, 7, 9], sortedEnd: 1, active: 1, moving: [1, 2], note: "5 is also larger than 3, so shift 5 right." },
      { values: [2, 3, 5, 7, 9], sortedEnd: 3, active: 1, found: true, note: "Insert 3 after 2. The sorted prefix has grown by one item." },
    ],
  },
  bfs: {
    label: "BFS",
    title: "Explore a graph level by level",
    meta: "unweighted shortest paths",
    takeaway: "Because a queue is first-in, first-out, BFS discovers every node at its minimum number of edges from the source.",
    invariant: "Queued nodes have known shortest distances, in nondecreasing order.",
    steps: [
      { nodes: ["A", "B", "C", "D", "E"], queue: ["A"], visited: ["A"], active: "A", levels: { A: 0 }, note: "Start at A: mark it visited with distance 0 and place it in the queue." },
      { nodes: ["A", "B", "C", "D", "E"], queue: ["B", "C"], visited: ["A", "B", "C"], active: "A", levels: { A: 0, B: 1, C: 1 }, note: "Remove A and discover B and C. Both are one edge from the start." },
      { nodes: ["A", "B", "C", "D", "E"], queue: ["C", "D"], visited: ["A", "B", "C", "D"], active: "B", levels: { A: 0, B: 1, C: 1, D: 2 }, note: "Remove B. D is new, so record distance 2 and enqueue it." },
      { nodes: ["A", "B", "C", "D", "E"], queue: ["D", "E"], visited: ["A", "B", "C", "D", "E"], active: "C", levels: { A: 0, B: 1, C: 1, D: 2, E: 2 }, found: true, note: "Remove C and discover E at distance 2. Every node now has its shortest level." },
    ],
  },
  dp: {
    label: "DP · 1D",
    title: "Build climbing-stairs states",
    meta: "ways(n) = ways(n-1) + ways(n-2)",
    takeaway: "DP becomes concrete when every table cell has a complete sentence definition.",
    invariant: "Before computing state i, the two smaller states it depends on are correct.",
    steps: [
      { values: [1, 1, null, null, null, null], active: 1, note: "Base states: there is one way to stand before the stairs and one way to reach step 1." },
      { values: [1, 1, 2, null, null, null], active: 2, parents: [0, 1], note: "Step 2 can be reached from step 1 or step 0: 1 + 1 = 2 ways." },
      { values: [1, 1, 2, 3, null, null], active: 3, parents: [1, 2], note: "Step 3 uses the two previous solved states: 1 + 2 = 3 ways." },
      { values: [1, 1, 2, 3, 5, null], active: 4, parents: [2, 3], note: "Step 4 has 2 + 3 = 5 ways." },
      { values: [1, 1, 2, 3, 5, 8], active: 5, parents: [3, 4], found: true, note: "Step 5 has 3 + 5 = 8 ways. Only the previous two values are needed, so space can be O(1)." },
    ],
  },
  dp_grid: {
    label: "DP · Grid",
    title: "Count paths around an obstacle",
    meta: "cell = top + left",
    takeaway: "A right-and-down grid is a DAG. Row-major order works because top and left dependencies are already solved.",
    invariant: "Every completed cell equals the number of valid paths from the start to that cell.",
    steps: [
      { matrix: [[1, null, null, null], [null, "×", null, null], [null, null, null, null]], active: [0, 0], dependencies: [], note: "The start has one empty path. The × cell is blocked and will always contribute zero." },
      { matrix: [[1, 1, 1, 1], [1, "×", null, null], [1, null, null, null]], active: [1, 0], dependencies: [[0, 0]], note: "Along an open boundary there is only one direction of arrival, so every reachable boundary cell has one path." },
      { matrix: [[1, 1, 1, 1], [1, "×", 1, 2], [1, 1, null, null]], active: [1, 3], dependencies: [[0, 3], [1, 2]], note: "At row 1, column 3: top contributes 1 and left contributes 1, giving 2 paths." },
      { matrix: [[1, 1, 1, 1], [1, "×", 1, 2], [1, 1, 2, 4]], active: [2, 3], dependencies: [[1, 3], [2, 2]], found: true, note: "The destination receives 2 paths from above and 2 from the left: 4 valid paths in total." },
    ],
  },
  dp_lcs: {
    label: "DP · LCS",
    title: "Align two sequence prefixes",
    meta: "A = ABC · B = AC",
    takeaway: "A two-sequence DP cell summarizes complete prefixes, so a mismatch can safely discard one final character.",
    invariant: "dp[i][j] is the LCS length of A[:i] and B[:j].",
    rowLabels: ["∅", "A", "B", "C"],
    colLabels: ["∅", "A", "C"],
    steps: [
      { matrix: [[0, 0, 0], [0, null, null], [0, null, null], [0, null, null]], active: [0, 0], dependencies: [], note: "Any sequence paired with an empty prefix has common-subsequence length 0." },
      { matrix: [[0, 0, 0], [0, 1, null], [0, null, null], [0, null, null]], active: [1, 1], dependencies: [[0, 0]], note: "A matches A, so take 1 plus the diagonal empty-prefix answer." },
      { matrix: [[0, 0, 0], [0, 1, 1], [0, 1, 1], [0, null, null]], active: [2, 2], dependencies: [[1, 2], [2, 1]], note: "B does not match C. Keep the better of excluding B or excluding C: max(1, 1)." },
      { matrix: [[0, 0, 0], [0, 1, 1], [0, 1, 1], [0, 1, 2]], active: [3, 2], dependencies: [[2, 1]], found: true, note: "C matches C, so add one to the diagonal answer. The LCS is AC with length 2." },
    ],
  },
  dp_knapsack: {
    label: "DP · Knapsack",
    title: "Update 0/1 capacity backward",
    meta: "item weight 3 · value 4",
    takeaway: "Backward capacity order preserves the previous item layer, preventing one 0/1 item from being reused in the same iteration.",
    invariant: "Before capacity c is updated, dp[c-3] still excludes the current item.",
    steps: [
      { values: [0, 0, 3, 3, 3, 3, 3], active: 6, parents: [3], note: "Existing states came from earlier items. Start at capacity 6 and compare skip=3 with take=dp[3]+4=7." },
      { values: [0, 0, 3, 3, 3, 3, 7], active: 5, parents: [2], note: "Move backward to capacity 5. Read dp[2]=3 from the previous layer, producing value 7." },
      { values: [0, 0, 3, 3, 3, 7, 7], active: 4, parents: [1], note: "At capacity 4, take gives dp[1]+4=4, which beats the old value 3." },
      { values: [0, 0, 3, 4, 4, 7, 7], active: 3, parents: [0], found: true, note: "Capacity 3 becomes 4. Stop at the item weight. Forward order would incorrectly reuse this item." },
    ],
  },
  greedy_interval: {
    label: "Greedy · Intervals",
    title: "Keep the earliest finishing activity",
    meta: "maximize non-overlapping count",
    takeaway: "Earliest finish is safe because it leaves at least as much room for every possible future activity.",
    invariant: "The selected prefix can be extended to an optimal schedule, and lastEnd is as early as possible.",
    steps: [
      { intervals: [[1, 3], [2, 5], [4, 6], [6, 8], [5, 9]], active: 0, chosen: [], rejected: [], note: "Sort by end time. Activity [1,3] finishes first, so inspect it before every later-finishing candidate." },
      { intervals: [[1, 3], [2, 5], [4, 6], [6, 8], [5, 9]], active: 1, chosen: [0], rejected: [], note: "Choose [1,3]. The next activity [2,5] overlaps because 2 < lastEnd 3, so it cannot follow the chosen prefix." },
      { intervals: [[1, 3], [2, 5], [4, 6], [6, 8], [5, 9]], active: 2, chosen: [0], rejected: [1], note: "Activity [4,6] starts after lastEnd 3. Choose it and move the frontier to 6." },
      { intervals: [[1, 3], [2, 5], [4, 6], [6, 8], [5, 9]], active: 4, chosen: [0, 2, 3], rejected: [1, 4], found: true, note: "The final schedule is [1,3], [4,6], [6,8]. Three activities is optimal; rejected [5,9] overlaps the last choice." },
    ],
  },
  greedy_jump: {
    label: "Greedy · Reach",
    title: "Jump Game: maintain the farthest frontier",
    meta: "values = maximum jump lengths",
    takeaway: "The exact path is unnecessary. Every index up to farthest is reachable, so only the best frontier must be retained.",
    invariant: "Every index through farthest can be reached from the processed prefix.",
    steps: [
      { values: [2, 3, 1, 1, 4], active: 0, reach: 2, note: "From index 0, jump length 2 makes every index through 2 reachable." },
      { values: [2, 3, 1, 1, 4], active: 1, reach: 4, note: "Index 1 is reachable. Its frontier is 1 + 3 = 4, so update farthest from 2 to 4." },
      { values: [2, 3, 1, 1, 4], active: 2, reach: 4, note: "Index 2 adds no farther reach: 2 + 1 = 3. Keep the existing frontier 4." },
      { values: [2, 3, 1, 1, 4], active: 4, reach: 4, found: true, note: "The last index lies inside the reachable frontier. Return true without constructing a particular jump path." },
    ],
  },
  greedy_huffman: {
    label: "Greedy · Huffman",
    title: "Merge the two smallest frequencies",
    meta: "optimal prefix-code merge cost",
    takeaway: "Low-frequency symbols can safely be deepest siblings; merging the two smallest reduces the problem to a smaller instance.",
    invariant: "The heap represents roots of optimal partial prefix-code trees.",
    steps: [
      { values: [5, 9, 12, 13], active: 0, parents: [1], note: "The two smallest frequencies are 5 and 9. Any optimal tree can place them as deepest siblings." },
      { values: [12, 13, 14], active: 2, parents: [0, 1], note: "Merge 5 + 9 into a subtree of weight 14, then return it to the min-heap." },
      { values: [14, 25], active: 1, parents: [0], note: "Merge 12 + 13 = 25. The remaining roots have weights 14 and 25." },
      { values: [39], active: 0, parents: [], found: true, note: "Merge 14 + 25 = 39. One root remains, completing the optimal prefix tree." },
    ],
  },
  union: {
    label: "Union-find",
    title: "Merge connected components",
    meta: "union by size + path compression",
    takeaway: "Union-find answers dynamic connectivity almost constantly on average; it does not recover the actual path between nodes.",
    invariant: "Every member reaches one representative root for its component.",
    steps: [
      { groups: [[0], [1], [2], [3], [4], [5]], edge: null, note: "Initially every node is the representative of its own component." },
      { groups: [[0, 1], [2], [3], [4], [5]], edge: [0, 1], note: "Union(0, 1): attach one root to the other. There are now five components." },
      { groups: [[0, 1], [2, 3], [4], [5]], edge: [2, 3], note: "Union(2, 3): create a second two-node component." },
      { groups: [[0, 1, 2, 3], [4], [5]], edge: [1, 3], note: "Union(1, 3): find both representatives, then merge the two components." },
      { groups: [[0, 1, 2, 3], [4, 5]], edge: [4, 5], found: true, note: "Union(4, 5): two components remain. find(0) equals find(3), but differs from find(5)." },
    ],
  },
};

function ArrayVisual({ mode, current }) {
  const max = Math.max(...current.values.filter((value) => value !== null));
  const isBar = mode === "sorting";

  return (
    <div className={`array-track ${isBar ? "bar-track" : ""}`} aria-label={`${labs[mode].title}, current values ${current.values.join(", ")}`}>
      {current.values.map((value, index) => {
        const outside = mode === "binary" && (index < current.left || index > current.right);
        const classNames = [
          "array-cell",
          index === current.left ? "left" : "",
          index === current.right ? "right" : "",
          index === current.mid || index === current.active ? "active-cell" : "",
          current.parents?.includes(index) ? "dependency" : "",
          current.moving?.includes(index) ? "moving" : "",
          current.reach !== undefined && index <= current.reach ? "reachable" : "",
          outside ? "eliminated" : "",
          isBar && index <= current.sortedEnd ? "sorted" : "",
        ].filter(Boolean).join(" ");

        return (
          <div className={classNames} key={index} style={isBar ? { minHeight: `${54 + ((value || 0) / max) * 110}px` } : undefined}>
            <small>{mode === "dp" ? `dp[${index}]` : index === current.left ? "left" : index === current.right ? "right" : index === current.mid ? "mid" : index}</small>
            <b>{value ?? "?"}</b>
          </div>
        );
      })}
    </div>
  );
}

function IntervalVisual({ current }) {
  return (
    <div className="interval-track" role="img" aria-label="Greedy interval scheduling timeline from time 1 to 9">
      {current.intervals.map(([start, end], index) => {
        const state = current.chosen.includes(index) ? "chosen" : current.rejected.includes(index) ? "rejected" : index === current.active ? "active" : "pending";
        return <div className="interval-row" key={`${start}-${end}-${index}`}><small>{state}</small><div className="interval-axis"><span className={`interval-mark ${state}`} style={{ left: `${((start - 1) / 8) * 100}%`, width: `${((end - start) / 8) * 100}%` }}>[{start},{end}]</span></div></div>;
      })}
      <div className="interval-ticks">{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => <span key={value}>{value}</span>)}</div>
    </div>
  );
}

function GraphVisual({ current }) {
  return <>
    <div className="graph-track" aria-label="Graph traversal state">
      {current.nodes.map((node) => (
        <div key={node} className={`graph-node ${current.visited.includes(node) ? "visited" : ""} ${current.active === node ? "active" : ""}`}>
          <b>{node}</b><small>{current.levels[node] === undefined ? "∞" : `d=${current.levels[node]}`}</small>
        </div>
      ))}
    </div>
    <div className="queue-track"><span>queue · front first</span>{current.queue.map((item) => <b key={item}>{item}</b>)}</div>
  </>;
}

function MatrixVisual({ lab, current }) {
  const columns = current.matrix[0].length;
  const dependencyKeys = new Set(current.dependencies.map(([row, col]) => `${row}-${col}`));
  return (
    <div className="matrix-wrap">
      {lab.colLabels && <div className="matrix-column-labels" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>{lab.colLabels.map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}</div>}
      <div className="matrix-with-rows">
        {lab.rowLabels && <div className="matrix-row-labels">{lab.rowLabels.map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}</div>}
        <div className="matrix-track" style={{ gridTemplateColumns: `repeat(${columns}, minmax(42px, 1fr))` }} role="img" aria-label={`${lab.title}; current dynamic programming table`}>
          {current.matrix.flatMap((row, rowIndex) => row.map((value, colIndex) => {
            const active = current.active[0] === rowIndex && current.active[1] === colIndex;
            const dependency = dependencyKeys.has(`${rowIndex}-${colIndex}`);
            return <div key={`${rowIndex}-${colIndex}`} className={`matrix-cell ${active ? "active" : ""} ${dependency ? "dependency" : ""} ${value === "×" ? "blocked" : ""}`}><small>{rowIndex},{colIndex}</small><b>{value ?? "?"}</b></div>;
          }))}
        </div>
      </div>
    </div>
  );
}

function UnionVisual({ current }) {
  return (
    <div className="union-track" aria-label={`${current.groups.length} connected components`}>
      {current.groups.map((group) => (
        <div className="union-group" key={group.join("-")}>
          <small>root {group[0]}</small>
          <div>{group.map((node) => <b key={node}>{node}</b>)}</div>
          {current.edge && group.includes(current.edge[0]) && group.includes(current.edge[1]) && <span>merged {current.edge.join(" ↔ ")}</span>}
        </div>
      ))}
    </div>
  );
}

const DsaLab = () => {
  const [mode, setMode] = useState("pointers");
  const [step, setStep] = useState(0);
  const lab = labs[mode];
  const current = lab.steps[step];
  const complete = step === lab.steps.length - 1;
  const progress = ((step + 1) / lab.steps.length) * 100;
  const equation = useMemo(() => {
    if (mode !== "pointers") return null;
    return `${current.values[current.left]} + ${current.values[current.right]} = ${current.values[current.left] + current.values[current.right]}`;
  }, [current, mode]);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setStep(0);
  };

  return (
    <div className="dsa-lab">
      <Link className="lab-back" to="/dsa"><ArrowLeft size={16} /> Back to DSA guide</Link>
      <div className="lab-heading">
        <div><span className="eyebrow">Interactive algorithm lab</span><h1>See the state change.</h1><p>Move one step at a time. Predict the next state, then check the reasoning and invariant.</p></div>
        <Sparkles aria-hidden="true" size={34} />
      </div>

      <div className="lab-tabs" role="tablist" aria-label="Choose an algorithm visual">
        {Object.entries(labs).map(([id, item]) => (
          <button type="button" role="tab" aria-selected={mode === id} key={id} onClick={() => switchMode(id)}>{item.label}</button>
        ))}
      </div>

      <section className="lab-surface" aria-live="polite">
        <div className="lab-meta"><span>{lab.title}</span><strong>{lab.meta}</strong></div>
        <div className="lab-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>

        {current.matrix ? <MatrixVisual lab={lab} current={current} /> : current.intervals ? <IntervalVisual current={current} /> : mode === "bfs" ? <GraphVisual current={current} /> : mode === "union" ? <UnionVisual current={current} /> : <ArrayVisual mode={mode} current={current} />}
        {equation && <div className="equation">{equation} {current.found && <CheckCircle2 size={18} />}</div>}

        <div className="invariant-line"><span>Invariant</span><p>{lab.invariant}</p></div>
        <div className="step-note"><span>Step {step + 1} of {lab.steps.length}</span><p>{current.note}</p></div>
        <div className="lab-actions">
          <button type="button" className="lab-secondary" onClick={() => setStep(0)}><RotateCcw size={15} /> Reset</button>
          <div className="lab-step-buttons">
            <button type="button" className="lab-secondary" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}><ArrowLeft size={15} /> Previous</button>
            <button type="button" className="btn" disabled={complete} onClick={() => setStep((value) => Math.min(value + 1, lab.steps.length - 1))}>{complete ? "Trace complete" : "Next step"} <ArrowRight size={16} /></button>
          </div>
        </div>
      </section>

      <section className="lab-takeaway"><h2>What to remember</h2><p>{lab.takeaway}</p><ol><li>Describe what every visual element represents.</li><li>State why the next move cannot lose a valid answer.</li><li>Recreate the trace on paper before coding.</li></ol></section>
    </div>
  );
};

export default DsaLab;
