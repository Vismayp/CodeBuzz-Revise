import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Box,
  Code,
  Cpu,
  Zap,
  Server,
} from "lucide-react";
import { topics, todos } from "../data/topics";

const iconMap = {
  BookOpen,
  Box,
  Code,
  Cpu,
  Zap,
  Server,
};

const Home = () => {
  const navigate = useNavigate();

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
            Master JavaScript & Node.js
          </span>
          <br />
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: "0.8em",
              fontWeight: 500,
            }}
          >
            Basics to Advanced Patterns
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
          A curated, minimalistic collection of concepts, examples, and
          interview questions to help you revise efficiently.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            marginBottom: "4rem",
          }}
        >
          <button
            className="btn"
            style={{ fontSize: "1.1rem", padding: "0.8rem 2rem" }}
            onClick={() =>
              navigate(`/topic/${topics[0].id}/${topics[0].sections[0].id}`)
            }
          >
            Start Reading <ArrowRight size={20} />
          </button>

          <button
            style={{
              fontSize: "1.1rem",
              padding: "0.8rem 2rem",
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 500,
            }}
            onClick={() => navigate("/interview")}
          >
            Interview Q&A
          </button>
        </div>
      </motion.div>

      <div style={{ marginBottom: "5rem" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "var(--text-primary)",
          }}
        >
          Choose what to revise
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {topics.map((topic, index) => {
            const Icon = iconMap[topic.icon] || Box;
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, borderColor: "var(--accent)" }}
                onClick={() =>
                  navigate(`/topic/${topic.id}/${topic.sections[0].id}`)
                }
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "var(--accent-glow)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.2rem",
                    color: "var(--accent)",
                  }}
                >
                  <Icon size={24} />
                </div>
                <h3
                  style={{
                    marginBottom: "0.5rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {topic.title}
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                  }}
                >
                  {topic.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h3
          style={{
            marginBottom: "1.5rem",
            color: "var(--text-primary)",
            fontSize: "1.2rem",
          }}
        >
          📌 Pending Topics (Todos)
        </h3>
        <div
          style={{
            background: "var(--bg-tertiary)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            overflow: "hidden",
          }}
        >
          {todos.map((todo, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem",
                borderBottom:
                  i !== todos.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "4px",
                  border: "2px solid var(--text-muted)",
                  flexShrink: 0,
                }}
              ></div>
              <span style={{ color: "var(--text-secondary)" }}>{todo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
