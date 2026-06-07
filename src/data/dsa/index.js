// DSA Topic Aggregation
import { roadmapTopic as roadmapTopicBase } from "./roadmap.js";
import { masterclassTopic as masterclassTopicBase } from "./masterclass.js";
import { complexityTopic as complexityTopicBase } from "./complexity.js";
import { arraysTopic as arraysTopicBase } from "./arrays.js";
import { stringsTopic as stringsTopicBase } from "./strings.js";
import { linkedListsTopic as linkedListsTopicBase } from "./linkedlists.js";
import { stacksTopic as stacksTopicBase } from "./stacks.js";
import { recursionTopic as recursionTopicBase } from "./recursion.js";
import { treesTopic as treesTopicBase } from "./trees.js";
import { heapsTopic as heapsTopicBase } from "./heaps.js";
import { graphsTopic as graphsTopicBase } from "./graphs.js";
import { dpTopic as dpTopicBase } from "./dp.js";
import { greedyTopic as greedyTopicBase } from "./greedy.js";
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
export const complexityTopic = withPythonImplementations(enrichDsaTopic(complexityTopicBase));
export const arraysTopic = withPythonImplementations(enrichDsaTopic(arraysTopicBase));
export const stringsTopic = withPythonImplementations(enrichDsaTopic(stringsTopicBase));
export const linkedListsTopic = withPythonImplementations(enrichDsaTopic(linkedListsTopicBase));
export const stacksTopic = withPythonImplementations(enrichDsaTopic(stacksTopicBase));
export const recursionTopic = withPythonImplementations(enrichDsaTopic(recursionTopicBase));
export const treesTopic = withPythonImplementations(enrichDsaTopic(treesTopicBase));
export const heapsTopic = withPythonImplementations(enrichDsaTopic(heapsTopicBase));
export const graphsTopic = withPythonImplementations(enrichDsaTopic(graphsTopicBase));
export const dpTopic = withPythonImplementations(enrichDsaTopic(dpTopicBase));
export const greedyTopic = withPythonImplementations(enrichDsaTopic(greedyTopicBase));
export const advancedTopic = withPythonImplementations(enrichDsaTopic(advancedTopicBase));

export const dsaTopics = [
  roadmapTopic,
  masterclassTopic,
  complexityTopic,
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
];

export const dsaSubject = {
  id: "dsa",
  title: "Data Structures & Algorithms",
  description:
    "Complete DSA preparation for coding interviews - from basics to advanced with LeetCode problems",
  icon: "Code2",
  topics: dsaTopics,
};
