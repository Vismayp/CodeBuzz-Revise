// DSA Topic Aggregation
import { roadmapTopic as roadmapTopicBase } from "./roadmap.js";
import { masterclassTopic as masterclassTopicBase } from "./masterclass.js";
import { foundationsTopic as foundationsTopicBase } from "./foundations.js";
import { sortingSearchingTopic as sortingSearchingTopicBase } from "./sorting_searching.js";
import { advancedAlgorithmsTopic as advancedAlgorithmsTopicBase } from "./advanced_algorithms.js";
import { complexityTopic as complexityTopicBase } from "./complexity.js";
import { arraysTopic as arraysTopicBase } from "./arrays.js";
import { stringsTopic as stringsTopicBase } from "./strings.js";
import { linkedListsTopic as linkedListsTopicBase } from "./linkedlists.js";
import { stacksTopic as stacksTopicBase } from "./stacks.js";
import { expandedStackQueueSections } from "./stacks_queues_expanded.js";
import { recursionTopic as recursionTopicBase } from "./recursion.js";
import { treesTopic as treesTopicBase } from "./trees.js";
import { expandedTreeSections } from "./trees_expanded.js";
import { heapsTopic as heapsTopicBase } from "./heaps.js";
import { expandedHeapSections } from "./heaps_expanded.js";
import { graphsTopic as graphsTopicBase } from "./graphs.js";
import { expandedGraphSections } from "./graphs_expanded.js";
import { dpTopic as dpTopicBase } from "./dp.js";
import { expandedDpSections } from "./dp_expanded.js";
import { greedyTopic as greedyTopicBase } from "./greedy.js";
import { expandedGreedySections } from "./greedy_expanded.js";
import { advancedTopic as advancedTopicBase } from "./advanced.js";
import { enrichDsaTopic } from "./enrichment.js";
import { asPythonFirstCode } from "../../utils/pythonifyCode.js";

const withPythonImplementations = (topic) => ({
  ...topic,
  sections: topic.sections.map((section) => ({
    ...section,
    code: asPythonFirstCode(section.code),
    language: section.code ? "python" : section.language,
  })),
});

export const roadmapTopic = withPythonImplementations(enrichDsaTopic(roadmapTopicBase));
export const masterclassTopic = withPythonImplementations(masterclassTopicBase);
export const foundationsTopic = withPythonImplementations(foundationsTopicBase);
export const complexityTopic = withPythonImplementations(enrichDsaTopic(complexityTopicBase));
export const arraysTopic = withPythonImplementations(enrichDsaTopic(arraysTopicBase));
export const stringsTopic = withPythonImplementations(enrichDsaTopic(stringsTopicBase));
export const linkedListsTopic = withPythonImplementations(enrichDsaTopic(linkedListsTopicBase));
export const stacksTopic = withPythonImplementations(enrichDsaTopic({
  ...stacksTopicBase,
  description: "Stacks, queues, and deques from LIFO/FIFO fundamentals through parsing, monotonic structures, circular buffers, design invariants, amortized analysis, and testing",
  sections: [...stacksTopicBase.sections, ...expandedStackQueueSections],
}));
export const recursionTopic = withPythonImplementations(enrichDsaTopic(recursionTopicBase));
export const treesTopic = withPythonImplementations(enrichDsaTopic({
  ...treesTopicBase,
  description: "Trees from recursive first principles through traversals, BST invariants, path patterns, LCA, serialization, tree DP, Euler tours, binary lifting, and correctness",
  sections: [...treesTopicBase.sections, ...expandedTreeSections],
}));
export const heapsTopic = withPythonImplementations(enrichDsaTopic({
  ...heapsTopicBase,
  description: "Heaps and priority queues from array invariants and linear-time heapify through top-k, k-way merge, running medians, lazy deletion, scheduling, graph frontiers, and testing",
  sections: [...heapsTopicBase.sections, ...expandedHeapSections],
}));
export const graphsTopic = withPythonImplementations(enrichDsaTopic({
  ...graphsTopicBase,
  description: "Graph modeling and traversal through shortest paths, DAGs, connectivity, MSTs, decomposition, flows, implicit state graphs, proofs, and testing",
  sections: [...graphsTopicBase.sections, ...expandedGraphSections],
}));
export const dpTopic = withPythonImplementations(enrichDsaTopic({
  ...dpTopicBase,
  description: "Dynamic programming from first principles through state design, reconstruction, sequence/grid/interval/tree/digit DP, and advanced optimization",
  sections: [...dpTopicBase.sections, ...expandedDpSections],
}));
export const greedyTopic = withPythonImplementations(enrichDsaTopic({
  ...greedyTopicBase,
  description: "Greedy algorithms from local-choice intuition through exchange proofs, interval scheduling, Huffman coding, MSTs, Dijkstra, heaps, matroids, approximations, and counterexample testing",
  sections: [...greedyTopicBase.sections, ...expandedGreedySections],
}));
export const sortingSearchingTopic = withPythonImplementations(sortingSearchingTopicBase);
export const advancedAlgorithmsTopic = withPythonImplementations(advancedAlgorithmsTopicBase);
export const advancedTopic = withPythonImplementations(enrichDsaTopic(advancedTopicBase));

export const dsaTopics = [
  roadmapTopic,
  masterclassTopic,
  foundationsTopic,
  complexityTopic,
  sortingSearchingTopic,
  arraysTopic,
  stringsTopic,
  linkedListsTopic,
  stacksTopic,
  recursionTopic,
  treesTopic,
  heapsTopic,
  graphsTopic,
  dpTopic,
  greedyTopic,
  advancedTopic,
  advancedAlgorithmsTopic,
];

export const dsaSubject = {
  id: "dsa",
  title: "Data Structures & Algorithms",
  description:
    "Complete DSA preparation for coding interviews - from basics to advanced with LeetCode problems",
  icon: "Code2",
  topics: dsaTopics,
};
