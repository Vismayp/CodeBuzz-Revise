import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { subjects } from "../data/subjects";
import { ArrowRight, Sparkles, BookOpen, Terminal, Zap } from "lucide-react";

const TYPING_WORDS = ["Backend Engineering", "Go & GIN", "Microservices", "System Design", "AI & ML", "React.js", "DSA", "SQL Mastery", ".NET & C#"];

const TypingEffect = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = TYPING_WORDS[wordIndex];
    const speed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setText(word.slice(0, text.length + 1));
        if (text === word) setTimeout(() => setIsDeleting(true), 1500);
      } else {
        setText(word.slice(0, text.length - 1));
        if (text === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % TYPING_WORDS.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex]);

  return (
    <span style={{ color: "var(--accent-secondary)", fontFamily: "var(--font-mono)" }}>
      {text}<span style={{ animation: "pulse-dot 1s step-end infinite", color: "var(--accent)" }}>|</span>
    </span>
  );
};

const StatBadge = ({ icon: Icon, label, value }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: "0.6rem",
    padding: "0.5rem 1rem", borderRadius: "var(--radius-md)",
    background: "var(--bg-tertiary)", border: "1px solid var(--border)",
  }}>
    <Icon size={16} style={{ color: "var(--accent)" }} />
    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{label}</span>
    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--accent-secondary)", fontSize: "0.9rem" }}>{value}</span>
  </div>
);

const Home = () => {
  const navigate = useNavigate();

  const categories = {};
  subjects.forEach((subject) => {
    const cat = subject.category || "Other";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(subject);
  });

  const totalTopics = subjects.reduce((sum, s) => sum + (s.topics?.length || 0), 0);

  const categoryColors = {
    "Generative AI & LLMs": { accent: "#ff6ec7", glow: "rgba(255,110,199,0.12)" },
    "Python & Data Science": { accent: "#39ff14", glow: "rgba(57,255,20,0.12)" },
    "Web Development": { accent: "#00d4ff", glow: "rgba(0,212,255,0.12)" },
    "Backend & Architecture": { accent: "#ffb300", glow: "rgba(255,179,0,0.12)" },
    "DevOps & Containers": { accent: "#61dafb", glow: "rgba(97,218,251,0.12)" },
    "System Design": { accent: "#2dd4bf", glow: "rgba(45,212,191,0.12)" },
    "Databases": { accent: "#38bdf8", glow: "rgba(56,189,248,0.12)" },
    ".NET & C#": { accent: "#a78bfa", glow: "rgba(167,139,250,0.12)" },
    "Algorithms & Core CS": { accent: "#ff5252", glow: "rgba(255,82,82,0.12)" },
  };

  return (
    <div style={{ padding: "2rem 0 4rem" }}>
      {/* Hero */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", marginBottom: "4rem" }}
      >
        <div className="glow-badge" style={{ marginBottom: "1.5rem" }}>
          <Sparkles size={14} /> REVISION HUB v2.0
        </div>

        <h1 style={{
          fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
          marginTop: 0, marginBottom: "1rem", lineHeight: 1.15,
        }}>
          <span style={{
            background: "linear-gradient(135deg, #e6edf3 30%, #8b949e 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Master
          </span>
          <br />
          <TypingEffect />
        </h1>

        <p style={{
          fontSize: "1.15rem", margin: "0 auto 2rem",
          color: "var(--text-secondary)", maxWidth: "550px", lineHeight: 1.7,
        }}>
          Your interactive study companion — from fundamentals to interview-ready expertise.
        </p>

        <div style={{
          display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1rem",
        }}>
          <StatBadge icon={BookOpen} label="Subjects" value={subjects.length} />
          <StatBadge icon={Terminal} label="Topics" value={totalTopics} />
          <StatBadge icon={Zap} label="Examples" value="500+" />
        </div>
      </motion.div>

      {/* Categories */}
      <div style={{ marginBottom: "5rem" }}>
        {Object.entries(categories).map(([categoryName, categorySubjects], categoryIndex) => {
          const colors = categoryColors[categoryName] || { accent: "var(--accent)", glow: "var(--accent-glow)" };
          return (
            <motion.div
              key={categoryName}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + categoryIndex * 0.15, duration: 0.5 }}
              style={{ marginBottom: "3.5rem" }}
            >
              <div style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                marginBottom: "1.5rem", paddingBottom: "0.75rem",
                borderBottom: `1px solid var(--border)`,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: colors.accent,
                  boxShadow: `0 0 10px ${colors.accent}`,
                }} />
                <h2 style={{
                  fontSize: "1.2rem", margin: 0, fontFamily: "var(--font-mono)",
                  color: "var(--text-primary)", letterSpacing: "0.02em",
                }}>
                  {categoryName}
                </h2>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.75rem",
                  color: "var(--text-muted)", marginLeft: "auto",
                }}>
                  [{categorySubjects.length.toString().padStart(2, "0")}]
                </span>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.25rem",
              }}>
                {categorySubjects.map((subject, index) => {
                  const Icon = subject.icon;
                  return (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + categoryIndex * 0.15 + index * 0.07 }}
                      whileHover={{ y: -4 }}
                      onClick={() => navigate(`/${subject.id}`)}
                      className="subject-card"
                    >
                      <div className="subject-card-icon" style={{
                        background: colors.glow,
                        border: `1px solid ${colors.accent}22`,
                        color: colors.accent,
                      }}>
                        <Icon size={26} />
                      </div>
                      <h3 style={{
                        marginBottom: "0.4rem", color: "var(--text-primary)",
                        fontSize: "1.15rem", fontWeight: 600,
                      }}>
                        {subject.title}
                      </h3>
                      <p style={{
                        color: "var(--text-secondary)", fontSize: "0.9rem",
                        lineHeight: 1.5, marginBottom: "1rem",
                      }}>
                        {subject.description}
                      </p>
                      <div style={{
                        display: "flex", alignItems: "center", gap: "0.5rem",
                        color: colors.accent, fontSize: "0.8rem",
                        fontFamily: "var(--font-mono)", fontWeight: 600,
                      }}>
                        <span>{subject.topics?.length || 0} topics</span>
                        <ArrowRight size={14} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
