const KEY = "revision-hub-learner-state-v1";
const REVIEW_DAYS = [1, 3, 7, 14, 30];

export const nextReviewDate = (confidence = 3) => {
  const days = REVIEW_DAYS[Math.max(0, Math.min(4, confidence - 1))];
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export const readLearnerState = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
};

export const updateLessonState = (id, patch) => {
  const state = readLearnerState();
  state[id] = { ...state[id], ...patch, updatedAt: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("learner-state-changed"));
  return state;
};

export const lessonKey = (subjectId, topicId, sectionId) => `${subjectId}/${topicId}/${sectionId}`;
