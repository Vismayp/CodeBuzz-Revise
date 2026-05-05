// DSA Topic Aggregation
import { roadmapTopic as roadmapTopicBase } from "./roadmap.js";
import { masterclassTopic } from "./masterclass.js";
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

export const roadmapTopic = enrichDsaTopic(roadmapTopicBase);
export const complexityTopic = enrichDsaTopic(complexityTopicBase);
export const arraysTopic = enrichDsaTopic(arraysTopicBase);
export const stringsTopic = enrichDsaTopic(stringsTopicBase);
export const linkedListsTopic = enrichDsaTopic(linkedListsTopicBase);
export const stacksTopic = enrichDsaTopic(stacksTopicBase);
export const recursionTopic = enrichDsaTopic(recursionTopicBase);
export const treesTopic = enrichDsaTopic(treesTopicBase);
export const heapsTopic = enrichDsaTopic(heapsTopicBase);
export const graphsTopic = enrichDsaTopic(graphsTopicBase);
export const dpTopic = enrichDsaTopic(dpTopicBase);
export const greedyTopic = enrichDsaTopic(greedyTopicBase);
export const advancedTopic = enrichDsaTopic(advancedTopicBase);

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

export { masterclassTopic };
