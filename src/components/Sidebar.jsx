import React from "react";
import { NavLink, Link, useParams } from "react-router-dom";
import { subjects } from "../data/subjects";
import {
  BookOpen,
  Box,
  Code,
  Cpu,
  Zap,
  HelpCircle,
  Server,
  X,
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
  ShieldCheck,
  List,
  ChevronDown,
  ChevronRight,
  Atom,
  Activity,
  Anchor,
  Layers,
} from "lucide-react";

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
  ShieldCheck,
  List,
  Atom,
  Activity,
  Anchor,
  Layers,
};

const Sidebar = ({ isOpen = false, onClose }) => {
  const { subjectId } = useParams();

  return (
    <aside
      className={`sidebar ${isOpen ? "open" : ""}`}
      aria-label="Sidebar navigation"
    >
      <div className="sidebar-header">
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1
            style={{
              fontSize: "1.5rem",
              margin: 0,
              background: "linear-gradient(to right, #fff, #a1a1aa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CodeBuzz
          </h1>
        </Link>
        <button
          type="button"
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      <nav style={{ flex: 1, overflowY: "auto", padding: "1rem 0" }}>
        {subjects.map((subj) => {
          const isActiveSubject = subj.id === subjectId;
          const SubjIcon = iconMap[subj.icon] || Box;

          return (
            <div key={subj.id} style={{ marginBottom: "0.5rem" }}>
              {/* Subject Header / Link */}
              <NavLink
                to={`/${subj.id}`}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
                style={{
                  justifyContent: "space-between",
                  fontWeight: 600,
                  color: isActiveSubject
                    ? "var(--accent)"
                    : "var(--text-primary)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <SubjIcon size={20} />
                  <span>{subj.title}</span>
                </div>
                {isActiveSubject ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </NavLink>

              {/* Topics List (Only if active) */}
              {isActiveSubject && (
                <div
                  style={{
                    marginLeft: "1rem",
                    borderLeft: "1px solid var(--border)",
                    marginBottom: "1rem",
                    paddingLeft: "0.5rem",
                  }}
                >
                  {subj.topics.map((topic) => {
                    const TopicIcon = iconMap[topic.icon] || Box;
                    return (
                      <div key={topic.id} style={{ marginTop: "1rem" }}>
                        <div
                          style={{
                            padding: "0.25rem 0.5rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            color: "var(--text-secondary)",
                            fontSize: "0.85rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            fontWeight: 600,
                          }}
                        >
                          <TopicIcon size={14} />
                          {topic.title}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginTop: "0.25rem",
                          }}
                        >
                          {topic.sections.map((section) => (
                            <NavLink
                              key={section.id}
                              to={`/${subj.id}/topic/${topic.id}/${section.id}`}
                              className={({ isActive }) =>
                                `nav-item ${isActive ? "active" : ""}`
                              }
                              style={{
                                padding: "0.4rem 0.5rem 0.4rem 2rem",
                                fontSize: "0.95rem",
                                borderLeft: "none",
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

        {/* Global Links */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            margin: "1rem 1rem 0",
            paddingTop: "1rem",
          }}
        >
          <NavLink
            to="/interview"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <HelpCircle size={18} style={{ color: "var(--accent)" }} />
            Interview Q&A
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
