export const topics = [
  {
    id: "reinforcement-learning",
    title: "8.1 Reinforcement Learning (RL)",
    description: "Learning through trial and error.",
    icon: "Target",
    sections: [
      {
        id: "rl-concepts",
        title: "Core Concepts",
        content: `
### The Loop
1.  **Agent:** The learner.
2.  **Environment:** The world it interacts with.
3.  **Action:** What the agent does.
4.  **Reward:** Feedback (positive or negative).
5.  **State:** Current situation.

**Goal:** Maximize cumulative reward over time.
**RLHF (Reinforcement Learning from Human Feedback):** Used to align LLMs (like ChatGPT) to be helpful and safe. Humans rank outputs -> Train Reward Model -> Fine-tune LLM via PPO.
        `,
        diagram: `graph LR
    Agent --Action--> Env[Environment]
    Env --State + Reward--> Agent`,
      },
    ],
  },
  {
    id: "computer-vision",
    title: "8.2 Computer Vision",
    description: "Seeing the world with YOLO and SAM.",
    icon: "Eye",
    sections: [
      {
        id: "cv-models",
        title: "Modern CV Models",
        content: `
### Key Tasks
1.  **Classification:** "Is this a cat?" (ResNet, ViT).
2.  **Object Detection:** "Where are the cats?" (YOLO - You Only Look Once).
    *   YOLO is famous for real-time speed.
3.  **Segmentation:** "Which pixels belong to the cat?" (SAM - Segment Anything Model).
    *   SAM (by Meta) is a foundation model for segmentation. Prompt it with a click or box, and it masks the object.
        `,
      },
    ],
  },
  {
    id: "speech-ai",
    title: "8.3 Speech AI",
    description: "Hearing and Speaking.",
    icon: "Mic",
    sections: [
      {
        id: "asr-tts",
        title: "ASR & TTS",
        content: `
### ASR (Automatic Speech Recognition)
**Whisper (OpenAI):** The gold standard for open-source ASR.
*   Trained on 680k hours of multilingual audio.
*   Robust to accents and background noise.

### TTS (Text-to-Speech)
Modern TTS sounds indistinguishable from humans.
*   **ElevenLabs:** SOTA commercial API. Voice cloning.
*   **Tortoise / Bark:** Open-source generative audio.
        `,
      },
    ],
  },
  {
    id: "multi-agent",
    title: "8.4 Multi-Agent Systems",
    description: "Agents collaborating to solve complex tasks.",
    icon: "Users",
    sections: [
      {
        id: "agent-collab",
        title: "Planner-Executor Pattern",
        content: `
One LLM can get confused by complex tasks. Multi-agent systems assign roles.

### Roles
1.  **Planner:** Breaks down high-level goal into steps.
2.  **Executor:** executes a specific step (writes code, searches web).
3.  **Critic:** Reviews the output and requests changes.

**Frameworks:** LangGraph, AutoGen, CrewAI.
        `,
        diagram: `graph TD
    User --> Planner
    Planner --Plan--> Executor
    Executor --Result--> Critic
    Critic --Feedback--> Executor
    Critic --Approved--> User`,
      },
    ],
  },
  {
    id: "capstone",
    title: "Capstone: AI SaaS Product",
    description: "Building an end-to-end AI product.",
    icon: "Briefcase",
    sections: [
      {
        id: "product-ideas",
        title: "Product Ideas",
        content: `
1.  **AI Resume Reviewer:**
    *   Upload PDF -> Extract Text -> Match against JD -> Score & Suggest Improvements.
2.  **AI Tutor (JEE/NEET):**
    *   RAG over standard textbooks. Step-by-step problem solving.
3.  **AI Code Reviewer:**
    *   GitHub App -> On PR -> Read Diff -> LLM Analysis -> Comment on PR.
4.  **Mock Interview Bot:**
    *   Audio In (Whisper) -> LLM (Interviewer Persona) -> Audio Out (TTS). Real-time conversation.
        `,
      },
    ],
  },
];
