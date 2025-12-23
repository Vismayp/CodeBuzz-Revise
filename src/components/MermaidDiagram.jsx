import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'var(--font-sans)',
  themeVariables: {
    primaryColor: '#0a0a0a',
    primaryTextColor: '#ededed',
    primaryBorderColor: '#8b5cf6',
    lineColor: '#52525b',
    secondaryColor: '#171717',
    tertiaryColor: '#0f0f0f',
  }
});

const MermaidDiagram = ({ chart }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.contentLoaded();
      // Force re-render of diagrams
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      ref.current.innerHTML = '';
      mermaid.render(id, chart).then((result) => {
        if (ref.current) ref.current.innerHTML = result.svg;
      }).catch(error => {
        console.error("Mermaid error:", error);
        if (ref.current) ref.current.innerHTML = `<div style="color: red; padding: 1rem; border: 1px solid red;">Diagram Syntax Error: ${error.message}</div>`;
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
        background: 'var(--bg-tertiary)', 
        padding: '2rem', 
        borderRadius: '8px', 
        margin: '1.5rem 0',
        border: '1px solid var(--border)',
        overflowX: 'auto'
      }}
    />
  );
};

export default MermaidDiagram;
