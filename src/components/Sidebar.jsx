import React from "react";
import { NavLink, Link, useParams } from "react-router-dom";
import { subjects } from "../data/subjects";
import {
  BookOpen, Box, Code, Cpu, Zap, HelpCircle, Server, X, FileJson,
  Brain, Network, Database, Globe, Layout, Terminal, Lock, Key,
  Shield, ShieldCheck, List, ChevronDown, ChevronRight, Atom,
  Activity, Anchor, Layers, Share2, Users, Target, Variable,
  Library, Home, TrendingUp, Codepen, Camera, MessageSquare,
  Maximize, Smile, Type, Link as LinkIcon, MousePointer2, Hash,
  RotateCw, Search, GitBranch, Hexagon,
} from "lucide-react";

const iconMap = {
  BookOpen, Box, Code, Cpu, Zap, Server, FileJson, Brain, Network,
  Database, Globe, Layout, Terminal, Lock, Key, Shield, ShieldCheck,
  List, Atom, Activity, Anchor, Layers, Share2, Users, Target,
  Variable, Library, Home, TrendingUp, Codepen, Camera,
  MessageSquare, Maximize, Smile, Type, Link: LinkIcon,
  MousePointer2, Hash, RotateCw, Search, GitBranch, Hexagon,
};

const Sidebar = ({ isOpen = false, onClose }) => {
  const { subjectId } = useParams();

  const grouped = subjects.reduce((acc, subject) => {
    const category = subject.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(subject);
    return acc;
  }, {});

  const sortOrder = [
    "Generative AI & LLMs",
    "Python & Data Science",
    "Backend & Architecture",
    "Web Development",
    "Algorithms & Core CS",
  ];

  const sorted = Object.entries(grouped).sort(([a], [b]) => {
    const ia = sortOrder.indexOf(a);
    const ib = sortOrder.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`} aria-label="Sidebar navigation">
      <div className="sidebar-header">
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img
            src="/favicon.jpg"
            alt="CodeBuzz Logo"
            style={{
              width: "30px", height: "30px", borderRadius: "8px",
              boxShadow: "0 0 12px var(--accent-glow)",
              border: "1px solid var(--border)",
            }}
          />
          <h1 style={{
            fontSize: "1.3rem", margin: 0,
            fontFamily: "var(--font-mono)", fontWeight: 700,
            background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            CodeBuzz
          </h1>
        </Link>
        <button type="button" className="sidebar-close" onClick={onClose} aria-label="Close navigation">
          <X size={18} />
        </button>
      </div>

      <nav style={{ flex: 1, overflowY: "auto", padding: "0.75rem 0" }}>
        {sorted.map(([category, categorySubjects]) => (
          <div key={category} style={{ marginBottom: "1.25rem" }}>
            <div className="category-label">{category}</div>
            {categorySubjects.map((subj) => {
              const isActiveSubject = subj.id === subjectId;
              const SubjIcon = iconMap[subj.icon] || Box;

              return (
                <div key={subj.id} style={{ marginBottom: "0.15rem" }}>
                  <NavLink
                    to={`/${subj.id}`}
                    className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                    style={{
                      justifyContent: "space-between", fontWeight: 500,
                      color: isActiveSubject ? "var(--accent)" : "var(--text-primary)",
                      fontSize: "0.9rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <SubjIcon size={16} />
                      <span>{subj.title}</span>
                    </div>
                    {isActiveSubject ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </NavLink>

                  {isActiveSubject && (
                    <div style={{
                      marginLeft: "1.2rem", borderLeft: "1px solid var(--border)",
                      marginBottom: "0.75rem", paddingLeft: "0.5rem",
                    }}>
                      {subj.topics.map((topic) => {
                        const TopicIcon = iconMap[topic.icon] || Box;
                        return (
                          <div key={topic.id} style={{ marginTop: "0.75rem" }}>
                            <div style={{
                              padding: "0.2rem 0.5rem",
                              display: "flex", alignItems: "center", gap: "0.4rem",
                              color: "var(--text-muted)", fontSize: "0.7rem",
                              textTransform: "uppercase", letterSpacing: "0.08em",
                              fontFamily: "var(--font-mono)", fontWeight: 700,
                            }}>
                              <TopicIcon size={12} />
                              {topic.title}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", marginTop: "0.15rem" }}>
                              {topic.sections.map((section) => (
                                <NavLink
                                  key={section.id}
                                  to={`/${subj.id}/topic/${topic.id}/${section.id}`}
                                  className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                                  style={{
                                    padding: "0.35rem 0.5rem 0.35rem 1.75rem",
                                    fontSize: "0.85rem", borderLeft: "none",
                                  }}
                                >
                                  {section.title}
                                </NavLink>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Global Links */}
        <div style={{
          borderTop: "1px solid var(--border)",
          margin: "0.75rem 1rem 0", paddingTop: "0.75rem",
        }}>
          <NavLink
            to="/interview"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <HelpCircle size={16} style={{ color: "var(--accent-warm)" }} />
            Interview Q&A
          </NavLink>
        </div>
      </nav>

      {/* Footer */}
      <div style={{
        padding: "0.75rem 1.25rem",
        borderTop: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: "0.5rem",
      }}>
        <div className="pulse-dot" />
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.7rem",
          color: "var(--text-muted)", letterSpacing: "0.05em",
        }}>
          v2.0 — always learning
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;
