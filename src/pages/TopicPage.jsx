import React from "react";
import { useParams } from "react-router-dom";
import { subjects } from "../data/subjects";
import CodeBlock from "../components/CodeBlock";
import MermaidDiagram from "../components/MermaidDiagram";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";

const stripIndent = (str) => {
  if (!str) return str;
  const lines = str.split("\n");

  // Find minimum indent, ignoring empty lines
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim().length === 0) continue;
    const indent = line.search(/\S/);
    if (indent !== -1 && indent < minIndent) {
      minIndent = indent;
    }
  }

  if (minIndent === Infinity) return str;

  // Remove indent from all lines
  return lines
    .map((line) => {
      if (line.trim().length === 0) return "";
      return line.slice(minIndent);
    })
    .join("\n");
};

const TopicPage = () => {
  const { subjectId, topicId, sectionId } = useParams();

  const subject = subjects.find((s) => s.id === subjectId);
  const topic = subject?.topics.find((t) => t.id === topicId);
  const section = topic?.sections.find((s) => s.id === sectionId);

  if (!subject || !topic || !section)
    return (
      <div style={{ padding: "2rem" }}>Select a topic from the sidebar.</div>
    );

  const MarkdownComponents = {
    table: ({ node, ...props }) => (
      <div style={{ overflowX: "auto", margin: "1.5rem 0" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.95rem",
            color: "var(--text-secondary)",
          }}
          {...props}
        />
      </div>
    ),
    thead: ({ node, ...props }) => (
      <thead style={{ background: "var(--bg-hover)" }} {...props} />
    ),
    th: ({ node, ...props }) => (
      <th
        style={{
          padding: "0.75rem 1rem",
          border: "1px solid var(--border)",
          textAlign: "left",
          color: "var(--text-primary)",
          fontWeight: 600,
        }}
        {...props}
      />
    ),
    td: ({ node, ...props }) => (
      <td
        style={{
          padding: "0.75rem 1rem",
          border: "1px solid var(--border)",
        }}
        {...props}
      />
    ),
    ul: ({ node, ...props }) => (
      <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }} {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }} {...props} />
    ),
    li: ({ node, ...props }) => (
      <li style={{ marginBottom: "0.25rem" }} {...props} />
    ),
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <CodeBlock
          code={String(children).replace(/\n$/, "")}
          language={match[1]}
        />
      ) : (
        <code
          className={className}
          style={{
            background: "var(--bg-hover)",
            padding: "0.2rem 0.4rem",
            borderRadius: "4px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.9em",
            color: "var(--accent)",
          }}
          {...props}
        >
          {children}
        </code>
      );
    },
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h1>{section.title}</h1>
        </div>
      </div>

      <div>
        {/* Main Description */}
        <div className="card" style={{ lineHeight: "1.7" }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeRaw, rehypeKatex]}
            components={MarkdownComponents}
          >
            {stripIndent(section.content)}
          </ReactMarkdown>
        </div>

        {/* Visual Diagram */}
        {section.diagram && (
          <div style={{ margin: "3rem 0" }}>
            <h3 style={{ marginBottom: "1rem" }}>Visual Representation</h3>
            <div
              className="card"
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "2rem",
                background: "var(--bg-secondary)",
              }}
            >
              <MermaidDiagram chart={section.diagram} />
            </div>
          </div>
        )}

        {/* Illustrative Image */}
        {section.image && (
          <div style={{ margin: "3rem 0" }}>
            <h3 style={{ marginBottom: "1rem" }}>Illustration</h3>
            <div
              className="card"
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                padding: "1rem",
              }}
            >
              <img
                src={section.image}
                alt={section.title}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>
        )}

        {/* Implementation Code */}
        {section.code && (
          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>Example Implementation</h3>
            <CodeBlock code={section.code} />
          </div>
        )}

        {/* Problems Section */}
        {section.problems && (
          <div style={{ marginTop: "4rem" }}>
            <h2
              style={{
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>🎯</span> Interview Problems
            </h2>
            <div className="card" style={{ lineHeight: "1.7" }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={MarkdownComponents}
              >
                {section.problems}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TopicPage;
