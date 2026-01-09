import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Box,
  Code,
  Cpu,
  Zap,
  Server,
  FileJson,
  Brain,
  Network,
  Database,
  Globe,
  Layout,
  Terminal,
  Lock,
  Key,
  Shield,
  Activity,
  Layers,
  Type,
  Link,
  MousePointer2,
  Hash,
  RotateCw,
  Search,
  GitBranch,
  Target,
  Share2,
} from "lucide-react";
import { subjects } from "../data/subjects";

const iconMap = {
  BookOpen,
  Box,
  Code,
  Cpu,
  Zap,
  Server,
  FileJson,
  Brain,
  Network,
  Database,
  Globe,
  Layout,
  Terminal,
  Lock,
  Key,
  Shield,
  Activity,
  Layers,
  Type,
  Link,
  MousePointer2,
  Hash,
  RotateCw,
  Search,
  GitBranch,
  Target,
  Share2,
};

const SubjectPage = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const subject = subjects.find((s) => s.id === subjectId);

  if (!subject) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <h1>Subject not found</h1>
        <button className="btn" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );
  }

  const { topics, title, description } = subject;

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
            📚 Subject Guide
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
              background: `linear-gradient(to bottom right, #fff, #94a3b8)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {title}
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
          {description}
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
              navigate(
                `/${subjectId}/topic/${topics[0].id}/${topics[0].sections[0].id}`
              )
            }
          >
            Start Reading <ArrowRight size={20} />
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
          Topics Covered
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
                  navigate(
                    `/${subjectId}/topic/${topic.id}/${topic.sections[0].id}`
                  )
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
    </div>
  );
};

export default SubjectPage;
