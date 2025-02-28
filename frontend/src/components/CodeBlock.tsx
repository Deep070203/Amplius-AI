import React, { useState } from 'react';
import { FaRegCopy, FaCheck, FaChartLine } from 'react-icons/fa';

interface CodeBlockProps {
  value: string;
  language?: string | null;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ value, language }) => {
  const [copied, setCopied] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const isMermaid = language === 'mermaid';

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRenderMermaid = () => {
    setShowImage(!showImage);
  };

  // Generate Mermaid diagram URL using mermaid.ink
  const getMermaidImageUrl = () => {
    // Use btoa for base64 encoding (browser-compatible)
    const encodedMermaid = btoa(value);
    return `https://mermaid.ink/img/${encodedMermaid}?bgColor=white`;
  };

  return (
    <div className="code-block-container ">
      <div className="code-header">
        <span className="">{language || 'code'}</span>
        <div className="">
          {isMermaid && (
            <button 
              onClick={handleRenderMermaid} 
              className="copy-button"
              aria-label="Render diagram"
              title="Toggle diagram view"
            >
              <FaChartLine />
            </button>
          )}
          <button 
            onClick={handleCopy} 
            className="copy-button"
            aria-label="Copy code"
            title="Copy to clipboard"
          >
            {copied ? <FaCheck /> : <FaRegCopy />}
          </button>
        </div>
      </div>
      
      {isMermaid && showImage ? (
        <div className="mermaid-image-container">
          <img 
            src={getMermaidImageUrl()} 
            alt="Mermaid diagram" 
            className=""
            onError={(e) => {
              console.error("Failed to load Mermaid diagram", e);
              setShowImage(false);
            }}
          />
        </div>
      ) : (
        <pre className="">
          <code className={language ? `language-${language}` : ''}>
            {value}
          </code>
        </pre>
      )}
    </div>
  );
};

export default CodeBlock;
