import { langchainTopics } from "./langchain/langchain_core.js";
import { langgraphTopics } from "./langchain/langgraph.js";
import { langfuseTopics } from "./langchain/langfuse.js";

// Kept as one subject so learners can move from application building, through
// orchestration, to observability without losing the narrative thread.
export const topics = [
  ...langchainTopics,
  ...langgraphTopics,
  ...langfuseTopics,
];

