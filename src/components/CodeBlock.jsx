import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Terminal } from "lucide-react";

const CodeBlock = ({ code, language = "javascript" }) => {
  const [copied, setCopied] = useState(false);
  const [activeLang, setActiveLang] = useState("js");

  const isDual = typeof code === "object" && code !== null && !Array.isArray(code);
  const displayCode = isDual ? (activeLang === "js" ? code.js : code.ts) : code;
  const displayLang = isDual
    ? activeLang === "js" ? "javascript" : "typescript"
    : language;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langLabel = isDual
    ? null
    : language === "go" ? "GO" : language.toUpperCase();

  return (
    <div className="code-wrapper">
      <div className="code-header" style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Terminal size={13} style={{ color: "var(--accent-secondary)", opacity: 0.7 }} />
          {isDual ? (
            <div style={{
              display: "flex", gap: "2px",
              background: "rgba(255,255,255,0.06)", padding: "2px",
              borderRadius: "4px",
            }}>
              {["js", "ts"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  style={{
                    background: activeLang === lang ? "var(--accent-glow)" : "transparent",
                    border: activeLang === lang ? "1px solid rgba(0,212,255,0.2)" : "1px solid transparent",
                    color: activeLang === lang ? "var(--accent)" : "var(--text-muted)",
                    padding: "2px 10px", borderRadius: "3px",
                    cursor: "pointer", fontSize: "0.75rem",
                    fontFamily: "var(--font-mono)", fontWeight: activeLang === lang ? 700 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          ) : (
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "0.75rem",
              color: "var(--accent)", opacity: 0.8,
            }}>
              {langLabel}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: copied ? "var(--accent-secondary)" : "var(--text-muted)",
            display: "flex", alignItems: "center", gap: 4,
            fontSize: "0.75rem", fontFamily: "var(--font-mono)",
            transition: "color 0.2s",
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={displayLang}
        style={vscDarkPlus}
        customStyle={{
          margin: 0, padding: "1rem",
          background: "transparent", fontSize: "0.85rem",
          lineHeight: 1.6,
        }}
        wrapLongLines={true}
      >
        {displayCode ? displayCode.trim() : ""}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
