import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, BookOpen, Box, Code, Cpu, Zap, Server, FileJson,
  Brain, Network, Database, Globe, Layout, Terminal, Lock, Key,
  Shield, Activity, Layers, Type, Link, MousePointer2, Hash,
  RotateCw, Search, GitBranch, Target, Share2, Hexagon,
} from "lucide-react";
import { subjects } from "../data/subjects";

const iconMap = {
  BookOpen, Box, Code, Cpu, Zap, Server, FileJson, Brain, Network,
  Database, Globe, Layout, Terminal, Lock, Key, Shield, Activity,
  Layers, Type, Link, MousePointer2, Hash, RotateCw, Search,
  GitBranch, Target, Share2, Hexagon,
};

const SubjectPage = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const subject = subjects.find((s) => s.id === subjectId);

  if (!subject) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <h1>Subject not found</h1>
        <button className="btn" onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  const { topics, title, description } = subject;
  const totalSections = topics.reduce((sum, t) => sum + (t.sections?.length || 0), 0);

  return (
    <div style={{ padding: "3rem 0" }}>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center" }}
      >
        <div className="glow-badge" style={{ marginBottom: "1.5rem" }}>📚 Subject Guide</div>

        <h1 style={{
          fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
          marginTop: 0, marginBottom: "1rem", lineHeight: 1.15,
        }}>
          <span className="gradient-text">{title}</span>
        </h1>

        <p style={{
          fontSize: "1.1rem", margin: "0 auto 1.5rem",
          color: "var(--text-secondary)", maxWidth: "550px",
        }}>
          {description}
        </p>

        <div style={{
          display: "flex", gap: "1rem", justifyContent: "center",
          flexWrap: "wrap", marginBottom: "1rem",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.85rem",
            color: "var(--text-muted)", padding: "0.3rem 0.75rem",
            background: "var(--bg-tertiary)", borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border)",
          }}>
            {topics.length} modules · {totalSections} sections
          </span>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "3rem" }}>
          <button
            className="btn"
            style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}
            onClick={() => navigate(`/${subjectId}/topic/${topics[0].id}/${topics[0].sections[0].id}`)}
          >
            Start Reading <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>

      <div style={{ marginBottom: "5rem" }}>
        <h2 style={{
          textAlign: "center", marginBottom: "2rem",
          color: "var(--text-primary)", fontSize: "1.3rem",
        }}>
          <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>{'>'}</span> Topics Covered
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1.25rem",
        }}>
          {topics.map((topic, index) => {
            const Icon = iconMap[topic.icon] || Box;
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -3 }}
                onClick={() => navigate(`/${subjectId}/topic/${topic.id}/${topic.sections[0].id}`)}
                className="subject-card"
              >
                <div className="subject-card-icon" style={{
                  background: "var(--accent-glow)",
                  border: "1px solid rgba(0,212,255,0.15)",
                  color: "var(--accent)",
                }}>
                  <Icon size={22} />
                </div>
                <h3 style={{
                  marginBottom: "0.4rem", color: "var(--text-primary)",
                  fontSize: "1.05rem",
                }}>
                  {topic.title}
                </h3>
                <p style={{
                  color: "var(--text-secondary)", fontSize: "0.85rem",
                  lineHeight: 1.5, marginBottom: "0.75rem",
                }}>
                  {topic.description}
                </p>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.75rem",
                    color: "var(--text-muted)",
                  }}>
                    {topic.sections?.length || 0} sections
                  </span>
                  <ArrowRight size={14} style={{ color: "var(--accent)" }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubjectPage;
