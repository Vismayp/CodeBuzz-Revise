import React from "react";
import { useParams } from "react-router-dom";
import { subjects } from "../data/subjects";
import CodeBlock from "../components/CodeBlock";
import MermaidDiagram from "../components/MermaidDiagram";
import { motion } from "framer-motion";

const TopicPage = () => {
  const { subjectId, topicId, sectionId } = useParams();

  const subject = subjects.find((s) => s.id === subjectId);
  const topic = subject?.topics.find((t) => t.id === topicId);
  const section = topic?.sections.find((s) => s.id === sectionId);

  if (!subject || !topic || !section)
    return (
      <div style={{ padding: "2rem" }}>Select a topic from the sidebar.</div>
    );

  const parseContent = (text) => {
    return text.split("\n").map((line, i) => {
      // Headers
      if (line.startsWith("### "))
        return <h3 key={i}>{line.replace("### ", "")}</h3>;
      if (line.startsWith("#### "))
        return (
          <h4
            key={i}
            style={{ marginTop: "1rem", color: "var(--text-primary)" }}
          >
            {line.replace("#### ", "")}
          </h4>
        );

      // List items
      const trimmed = line.trim();
      if (trimmed.match(/^\d+\. /)) {
        // Ordered list
        const number = trimmed.match(/^(\d+)\. /)[1];
        return (
          <div
            key={i}
            style={{
              marginLeft: "1.5rem",
              marginBottom: "0.5rem",
              color: "var(--text-secondary)",
            }}
          >
            {number}.{" "}
            <span
              dangerouslySetInnerHTML={createMarkup(
                trimmed.replace(/^\d+\. /, "")
              )}
            />
          </div>
        );
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        // Unordered list
        return (
          <div
            key={i}
            style={{
              marginLeft: "1.5rem",
              marginBottom: "0.5rem",
              color: "var(--text-secondary)",
            }}
          >
            •{" "}
            <span
              dangerouslySetInnerHTML={createMarkup(
                trimmed.replace(/^[-*] /, "")
              )}
            />
          </div>
        );
      }

      // Empty lines
      if (line.trim() === "")
        return <div key={i} style={{ height: "0.8rem" }} />;

      // Paragraphs
      return <p key={i} dangerouslySetInnerHTML={createMarkup(line)} />;
    });
  };

  const createMarkup = (text) => {
    const html = text
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong style="color: var(--text-primary)">$1</strong>'
      )
      .replace(
        /`(.*?)`/g,
        '<code style="background:var(--bg-hover); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: var(--font-mono); font-size: 0.9em; color: var(--accent)">$1</code>'
      );
    return { __html: html };
  };

  return (
    <motion.div
      key={section.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      style={{ paddingBottom: "4rem" }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <span
            style={{
              color: "var(--accent)",
              fontWeight: 600,
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              background: "var(--accent-glow)",
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
            }}
          >
            {topic.title}
          </span>
        </div>
        <h1>{section.title}</h1>
      </div>

      {/* Main Description */}
      <div className="card" style={{ lineHeight: "1.7" }}>
        {parseContent(section.content)}
      </div>

      {/* Visual Diagram */}
      {section.diagram && (
        <div style={{ margin: "3rem 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <h3>Visual Concept</h3>
          </div>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Diagram representation of the concept:
          </p>
          <MermaidDiagram chart={section.diagram} />
        </div>
      )}

      {/* Code Example */}
      {section.code && (
        <div style={{ marginTop: "2rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3>Example Implementation</h3>
          </div>
          <CodeBlock code={section.code} />
        </div>
      )}
    </motion.div>
  );
};

export default TopicPage;
