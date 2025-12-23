import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

const CodeBlock = ({ code, language = 'javascript' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-wrapper">
      <div className="code-header">
        <span>{language.toUpperCase()}</span>
        <button onClick={handleCopy} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
          {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter 
        language={language} 
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: '1rem', background: 'transparent', fontSize: '0.9rem' }}
        wrapLongLines={true}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
