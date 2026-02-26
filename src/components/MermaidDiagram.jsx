import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: '"DM Sans", sans-serif',
  themeVariables: {
    primaryColor: '#111922',
    primaryTextColor: '#e6edf3',
    primaryBorderColor: '#00d4ff',
    lineColor: '#484f58',
    secondaryColor: '#161f2b',
    tertiaryColor: '#111922',
  }
});

const MermaidDiagram = ({ chart }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.contentLoaded();
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      ref.current.innerHTML = '';
      mermaid.render(id, chart).then((result) => {
        if (ref.current) ref.current.innerHTML = result.svg;
      }).catch(error => {
        console.error("Mermaid error:", error);
        if (ref.current) ref.current.innerHTML = `<div style="color: var(--accent-warm); padding: 1rem; border: 1px solid var(--accent-warm); border-radius: 8px; font-family: var(--font-mono); font-size: 0.85rem;">Diagram Error: ${error.message}</div>`;
      });
    }
  }, [chart]);

  return (
    <div
      ref={ref}
      className="mermaid-wrapper"
      style={{
        display: 'flex',
        justifyContent: 'center',
        background: 'var(--bg-secondary)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-md)',
        margin: '1.5rem 0',
        border: '1px solid var(--border)',
        overflowX: 'auto',
      }}
    />
  );
};

export default MermaidDiagram;
