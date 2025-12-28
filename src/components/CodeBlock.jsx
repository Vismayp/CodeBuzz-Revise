import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

const CodeBlock = ({ code, language = "javascript" }) => {
  const [copied, setCopied] = useState(false);
  const [activeLang, setActiveLang] = useState("js"); // 'js' or 'ts'

  // Determine if we have dual language support
  const isDual =
    typeof code === "object" && code !== null && !Array.isArray(code);

  // Get the actual code to display
  const displayCode = isDual ? (activeLang === "js" ? code.js : code.ts) : code;
  const displayLang = isDual
    ? activeLang === "js"
      ? "javascript"
      : "typescript"
    : language;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-wrapper">
      <div
        className="code-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {isDual ? (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                background: "rgba(255,255,255,0.1)",
                padding: "2px",
                borderRadius: "4px",
              }}
            >
              <button
                onClick={() => setActiveLang("js")}
                style={{
                  background:
                    activeLang === "js"
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                  border: "none",
                  color: "inherit",
                  padding: "2px 8px",
                  borderRadius: "2px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: activeLang === "js" ? "bold" : "normal",
                }}
              >
                JS
              </button>
              <button
                onClick={() => setActiveLang("ts")}
                style={{
                  background:
                    activeLang === "ts"
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                  border: "none",
                  color: "inherit",
                  padding: "2px 8px",
                  borderRadius: "2px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: activeLang === "ts" ? "bold" : "normal",
                }}
              >
                TS
              </button>
            </div>
          ) : (
            <span>{language.toUpperCase()}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "inherit",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={displayLang}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "transparent",
          fontSize: "0.9rem",
        }}
        wrapLongLines={true}
      >
        {displayCode ? displayCode.trim() : ""}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
