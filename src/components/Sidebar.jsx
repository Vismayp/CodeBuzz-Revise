import React from "react";
import { NavLink } from "react-router-dom";
import { topics } from "../data/topics";
import {
  BookOpen,
  Box,
  Code,
  Cpu,
  Zap,
  HelpCircle,
  Server,
  X,
} from "lucide-react";

const iconMap = {
  BookOpen,
  Box,
  Code,
  Cpu,
  Zap,
  Server,
};

const Sidebar = ({ isOpen = false, onClose }) => {
  return (
    <aside
      className={`sidebar ${isOpen ? "open" : ""}`}
      aria-label="Sidebar navigation"
    >
      <div className="sidebar-header">
        <h1
          style={{
            fontSize: "1.5rem",
            margin: 0,
            background: "linear-gradient(to right, #fff, #a1a1aa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          JS Revision
        </h1>
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
        {topics.map((topic) => {
          const Icon = iconMap[topic.icon] || Box;
          return (
            <div key={topic.id} style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  padding: "0 1rem 0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                <Icon
                  size={18}
                  className="text-accent"
                  style={{ color: "var(--accent)" }}
                />
                {topic.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {topic.sections.map((section) => (
                  <NavLink
                    key={section.id}
                    to={`/topic/${topic.id}/${section.id}`}
                    className={({ isActive }) =>
                      `nav-item ${isActive ? "active" : ""}`
                    }
                    style={{ paddingLeft: "2.5rem" }}
                  >
                    {section.title}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}

        <div
          style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}
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
