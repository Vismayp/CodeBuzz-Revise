import React, { useEffect, useId, useRef, useState } from "react";
import mermaid from "mermaid";
import { Maximize2, X } from "lucide-react";

mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  securityLevel: "loose",
  fontFamily: '"DM Sans", system-ui, sans-serif',
  flowchart: {
    htmlLabels: true,
    curve: "basis",
    padding: 8,
    nodeSpacing: 28,
    rankSpacing: 34,
  },
  themeVariables: {
    background: "#f8fafc",
    primaryColor: "#ffffff",
    primaryTextColor: "#0f172a",
    primaryBorderColor: "#2563eb",
    secondaryColor: "#e0f2fe",
    secondaryTextColor: "#0f172a",
    secondaryBorderColor: "#0284c7",
    tertiaryColor: "#ecfdf5",
    tertiaryTextColor: "#0f172a",
    tertiaryBorderColor: "#059669",
    lineColor: "#334155",
    textColor: "#0f172a",
    mainBkg: "#ffffff",
    secondBkg: "#e0f2fe",
    tertiaryBkg: "#ecfdf5",
    nodeBorder: "#2563eb",
    clusterBkg: "#f1f5f9",
    clusterBorder: "#94a3b8",
    edgeLabelBackground: "#ffffff",
    fontSize: "11px",
  },
});

const enhanceSvg = (svg) =>
  svg
    .replace("<svg ", '<svg class="mermaid-svg" role="img" ')
    .replace(
      /preserveAspectRatio="[^"]*"/,
      'preserveAspectRatio="xMidYMid meet"'
    );

const MermaidDiagram = ({ chart, title = "Diagram" }) => {
  const reactId = useId();
  const idRef = useRef(`mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`);
  const [renderState, setRenderState] = useState({
    chart: "",
    error: "",
    svg: "",
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    mermaid
      .render(`${idRef.current}-${Date.now()}`, chart)
      .then((result) => {
        if (isMounted) {
          setRenderState({
            chart,
            error: "",
            svg: enhanceSvg(result.svg),
          });
        }
      })
      .catch((renderError) => {
        console.error("Mermaid error:", renderError);
        if (isMounted) {
          setRenderState({
            chart,
            error: renderError.message,
            svg: "",
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [chart]);

  useEffect(() => {
    if (!isExpanded) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsExpanded(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  const renderDiagramContent = () => {
    const isCurrent = renderState.chart === chart;

    if (isCurrent && renderState.error) {
      return (
        <div className="mermaid-error">
          <strong>Diagram Error</strong>
          <span>{renderState.error}</span>
        </div>
      );
    }

    if (isCurrent && renderState.svg) {
      return (
        <div
          className="mermaid-svg-frame"
          dangerouslySetInnerHTML={{ __html: renderState.svg }}
        />
      );
    }

    return <div className="mermaid-loading">Rendering diagram...</div>;
  };

  return (
    <>
      <div className="mermaid-shell">
        <div className="mermaid-toolbar">
          <span className="mermaid-toolbar-title">{title}</span>
          <button
            type="button"
            className="icon-button"
            onClick={() => setIsExpanded(true)}
            aria-label="Expand diagram"
            title="Expand diagram"
          >
            <Maximize2 size={17} />
          </button>
        </div>
        <div className="mermaid-canvas">{renderDiagramContent()}</div>
      </div>

      {isExpanded && (
        <div
          className="mermaid-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} expanded view`}
        >
          <div className="mermaid-modal">
            <div className="mermaid-modal-header">
              <span>{title}</span>
              <button
                type="button"
                className="icon-button"
                onClick={() => setIsExpanded(false)}
                aria-label="Close expanded diagram"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mermaid-modal-canvas">{renderDiagramContent()}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default MermaidDiagram;
