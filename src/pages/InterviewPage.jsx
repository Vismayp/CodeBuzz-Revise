import React, { useState } from "react";
import { interviewQuestions } from "../data/javascript";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const InterviewPage = () => {
  const [openId, setOpenId] = useState(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "2rem 0 4rem" }}>
      <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        <div className="glow-badge" style={{ marginBottom: "1rem" }}>
          <MessageSquare size={14} /> INTERVIEW PREP
        </div>
        <h1 style={{ marginBottom: "0.5rem" }}>
          <span className="gradient-text">Top {interviewQuestions.length} Questions</span>
        </h1>
        <p style={{ margin: "0 auto", maxWidth: "450px" }}>
          Master these concepts to ace your JavaScript interview.
        </p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {interviewQuestions.map((q, idx) => {
          const isOpen = openId === q.id;
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              style={{
                marginBottom: "0.6rem",
                border: `1px solid ${isOpen ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                background: isOpen ? "var(--bg-tertiary)" : "var(--bg-secondary)",
                transition: "all 0.25s ease",
              }}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : q.id)}
                style={{
                  width: "100%", textAlign: "left", padding: "1rem 1.25rem",
                  background: "none", border: "none",
                  color: isOpen ? "var(--text-primary)" : "var(--text-secondary)",
                  cursor: "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  fontWeight: isOpen ? 600 : 400,
                  fontSize: "1rem", fontFamily: "var(--font-sans)",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <span style={{
                    color: "var(--accent)", fontWeight: 700,
                    fontFamily: "var(--font-mono)", fontSize: "0.8rem",
                    minWidth: "28px",
                    background: "var(--accent-glow)",
                    padding: "0.15rem 0.4rem", borderRadius: "4px",
                    textAlign: "center",
                  }}>
                    {q.id.toString().padStart(2, "0")}
                  </span>
                  {q.question}
                </div>
                {isOpen ? (
                  <ChevronUp size={18} color="var(--accent)" />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{
                      padding: "0 1.25rem 1.25rem 3.75rem",
                      color: "var(--text-secondary)", lineHeight: 1.7,
                      borderTop: "1px solid var(--border)",
                      paddingTop: "1rem",
                    }}>
                      {q.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default InterviewPage;
