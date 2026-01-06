import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { subjects } from "../data/subjects";

const Home = () => {
  const navigate = useNavigate();

  // Group subjects by category
  const categories = {
    "Web Development": subjects.filter((subject) =>
      ["javascript", "typescript", "react", "graphql", "prisma"].includes(
        subject.id
      )
    ),
    "AI & Machine Learning": subjects.filter((subject) =>
      ["ai", "machine-learning", "langchain"].includes(subject.id)
    ),
    "Databases & Storage": subjects.filter((subject) =>
      ["redis"].includes(subject.id)
    ),
    "Messaging & Streaming": subjects.filter((subject) =>
      ["kafka"].includes(subject.id)
    ),
    Security: subjects.filter((subject) =>
      ["jwt", "cors"].includes(subject.id)
    ),
    "Programming Fundamentals": subjects.filter((subject) =>
      ["oop", "python"].includes(subject.id)
    ),
  };

  return (
    <div style={{ padding: "4rem 0" }}>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: "center" }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            borderRadius: "50px",
            background: "var(--bg-tertiary)",
            marginBottom: "1.5rem",
            border: "1px solid var(--border)",
          }}
        >
          <span
            style={{
              color: "var(--accent)",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            🚀 Ultimate Revision Guide
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            marginTop: "0",
            marginBottom: "1.5rem",
            lineHeight: 1.1,
          }}
        >
          <span
            style={{
              background: "linear-gradient(to bottom right, #fff, #94a3b8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Select Your Path
          </span>
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            margin: "0 auto 3rem",
            color: "var(--text-secondary)",
            maxWidth: "600px",
          }}
        >
          Choose a subject to start your revision journey.
        </p>
      </motion.div>

      <div style={{ marginBottom: "5rem" }}>
        {Object.entries(categories).map(
          ([categoryName, categorySubjects], categoryIndex) => (
            <motion.div
              key={categoryName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.2 }}
              style={{ marginBottom: "4rem" }}
            >
              <h2
                style={{
                  fontSize: "1.8rem",
                  marginBottom: "2rem",
                  color: "var(--text-primary)",
                  textAlign: "center",
                  borderBottom: "2px solid var(--border)",
                  paddingBottom: "1rem",
                }}
              >
                {categoryName}
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "2rem",
                  maxWidth: "1000px",
                  margin: "0 auto",
                }}
              >
                {categorySubjects.map((subject, index) => {
                  const Icon = subject.icon;
                  return (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: categoryIndex * 0.2 + index * 0.1 }}
                      whileHover={{ y: -5, borderColor: "var(--accent)" }}
                      onClick={() => navigate(`/${subject.id}`)}
                      style={{
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border)",
                        borderRadius: "16px",
                        padding: "2rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "16px",
                          background: `linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary))`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "1.5rem",
                          color: "var(--accent)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <Icon size={32} />
                      </div>
                      <h3
                        style={{
                          marginBottom: "0.5rem",
                          color: "var(--text-primary)",
                          fontSize: "1.5rem",
                        }}
                      >
                        {subject.title}
                      </h3>
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "1rem",
                          lineHeight: "1.5",
                        }}
                      >
                        {subject.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
};

export default Home;
