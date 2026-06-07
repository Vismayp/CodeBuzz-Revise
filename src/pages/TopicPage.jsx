import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { subjects } from "../data/subjects";
import CodeBlock from "../components/CodeBlock";
import MermaidDiagram from "../components/MermaidDiagram";
import { motion as Motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { asPythonFirstCode } from "../utils/pythonifyCode";

const processContent = (str) => {
  if (!str) return str;
  const lines = str.split("\n");
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim().length === 0) continue;
    const indent = line.search(/\S/);
    if (indent !== -1 && indent < minIndent) minIndent = indent;
  }
  if (minIndent === Infinity) return str;
  const unindented = lines
    .map((line) => (line.trim().length === 0 ? "" : line.slice(minIndent)))
    .join("\n");
  return unindented.replace(/>\s*[\r\n]+\s*</g, ">\n<");
};

const markdownProps = (props) => {
  const cleanProps = { ...props };
  delete cleanProps.node;
  return cleanProps;
};

const TopicPage = () => {
  const { subjectId, topicId, sectionId } = useParams();
  const navigate = useNavigate();

  const subject = subjects.find((s) => s.id === subjectId);
  const topic = subject?.topics.find((t) => t.id === topicId);
  const section = topic?.sections.find((s) => s.id === sectionId);

  // Navigation helpers
  const allSections = [];
  subject?.topics.forEach((t) => {
    t.sections.forEach((s) => {
      allSections.push({ topicId: t.id, sectionId: s.id, title: s.title });
    });
  });
  const currentIdx = allSections.findIndex(
    (s) => s.topicId === topicId && s.sectionId === sectionId
  );
  const prevSection = currentIdx > 0 ? allSections[currentIdx - 1] : null;
  const nextSection = currentIdx < allSections.length - 1 ? allSections[currentIdx + 1] : null;

  if (!subject || !topic || !section)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Select a topic from the sidebar.</p>
      </div>
    );

  const MarkdownComponents = {
    table: (props) => (
      <div style={{ overflowX: "auto", margin: "1.5rem 0" }}>
        <table style={{
          width: "100%", borderCollapse: "collapse",
          fontSize: "0.9rem", color: "var(--text-secondary)",
        }} {...markdownProps(props)} />
      </div>
    ),
    thead: (props) => (
      <thead style={{ background: "var(--bg-hover)" }} {...markdownProps(props)} />
    ),
    th: (props) => (
      <th style={{
        padding: "0.6rem 0.85rem", border: "1px solid var(--border)",
        textAlign: "left", color: "var(--accent)", fontWeight: 600,
        fontFamily: "var(--font-mono)", fontSize: "0.85rem",
      }} {...markdownProps(props)} />
    ),
    td: (props) => (
      <td style={{
        padding: "0.6rem 0.85rem", border: "1px solid var(--border)",
      }} {...markdownProps(props)} />
    ),
    ul: (props) => (
      <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }} {...markdownProps(props)} />
    ),
    ol: (props) => (
      <ol style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }} {...markdownProps(props)} />
    ),
    li: (props) => (
      <li style={{ marginBottom: "0.3rem" }} {...markdownProps(props)} />
    ),
    blockquote: (props) => (
      <blockquote style={{
        borderLeft: "3px solid var(--accent)",
        padding: "0.75rem 1rem", margin: "1rem 0",
        background: "var(--accent-glow)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
        color: "var(--text-secondary)", fontStyle: "italic",
      }} {...markdownProps(props)} />
    ),
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const rawCode = String(children).replace(/\n$/, "");
      return !inline && match ? (
        <CodeBlock
          code={
            subjectId === "dsa" && match[1] === "javascript"
              ? asPythonFirstCode(rawCode)
              : rawCode
          }
          language={subjectId === "dsa" && match[1] === "javascript" ? "python" : match[1]}
        />
      ) : (
        <code className={className} style={{
          background: "var(--bg-hover)", padding: "0.15rem 0.4rem",
          borderRadius: "4px", fontFamily: "var(--font-mono)",
          fontSize: "0.88em", color: "var(--accent)",
          border: "1px solid var(--border)",
        }} {...markdownProps(props)}>
          {children}
        </code>
      );
    },
  };

  return (
    <Motion.div
      key={section.id}
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      style={{ paddingBottom: "4rem" }}
    >
      {/* Breadcrumb */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          marginBottom: "0.75rem", flexWrap: "wrap",
        }}>
          <span className="glow-badge" style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem" }}>
            {topic.title}
          </span>
          {currentIdx >= 0 && (
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "0.75rem",
              color: "var(--text-muted)",
            }}>
              {currentIdx + 1} / {allSections.length}
            </span>
          )}
        </div>
        <h1 style={{ marginBottom: "0.25rem" }}>{section.title}</h1>
      </div>

      <div>
        <div className="card" style={{ lineHeight: "1.75" }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeRaw, rehypeKatex]}
            components={MarkdownComponents}
          >
            {processContent(section.content)}
          </ReactMarkdown>
        </div>

        {section.diagram && (
          <div style={{ margin: "2.5rem 0" }}>
            <h3 style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: "var(--accent)" }}>◈</span> Visual Representation
            </h3>
            <div className="diagram-panel">
              <MermaidDiagram chart={section.diagram} title={section.title} />
            </div>
          </div>
        )}

        {section.image && (
          <div style={{ margin: "2.5rem 0" }}>
            <h3 style={{ marginBottom: "0.75rem" }}>
              <span style={{ color: "var(--accent)" }}>◈</span> Illustration
            </h3>
            <div className="card" style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", padding: "0.75rem" }}>
              <img src={section.image} alt={section.title}
                style={{ width: "100%", height: "auto", display: "block", borderRadius: "var(--radius-md)" }} />
            </div>
          </div>
        )}

        {section.code && (
          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ marginBottom: "0.75rem" }}>
              <span style={{ color: "var(--accent-secondary)" }}>⟩</span> Implementation
            </h3>
            <CodeBlock 
              code={section.code} 
              language={section.language || (
                subjectId === "sql" ? "sql" : 
                subjectId === "dotnet" ? "csharp" : 
                subjectId === "python" ? "python" : 
                subjectId === "golang" ? "go" : 
                "javascript"
              )} 
            />
          </div>
        )}

        {section.problems && (
          <div style={{ marginTop: "3rem" }}>
            <h2 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              🎯 Interview Problems
            </h2>
            <div className="card" style={{ lineHeight: "1.75" }}>
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

        {/* Navigation */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          marginTop: "3rem", paddingTop: "1.5rem",
          borderTop: "1px solid var(--border)", gap: "1rem", flexWrap: "wrap",
        }}>
          {prevSection ? (
            <button
              onClick={() => navigate(`/${subjectId}/topic/${prevSection.topicId}/${prevSection.sectionId}`)}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                background: "var(--bg-tertiary)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)", padding: "0.6rem 1rem",
                color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.85rem",
                fontFamily: "var(--font-sans)", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.color = "var(--accent)"; }}
              onMouseLeave={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--text-secondary)"; }}
            >
              <ArrowLeft size={14} /> {prevSection.title}
            </button>
          ) : <div />}
          {nextSection && (
            <button
              onClick={() => navigate(`/${subjectId}/topic/${nextSection.topicId}/${nextSection.sectionId}`)}
              className="btn"
              style={{ fontSize: "0.85rem", padding: "0.6rem 1rem" }}
            >
              {nextSection.title} <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </Motion.div>
  );
};

export default TopicPage;
