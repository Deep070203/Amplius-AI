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
    <div className="code-block-container relative my-4 rounded-md overflow-hidden">
      <div className="code-header bg-gray-800 px-4 py-2 flex justify-between items-center">
        <span className="text-gray-400 text-sm">{language || 'code'}</span>
        <div className="flex gap-2">
          {isMermaid && (
            <button 
              onClick={handleRenderMermaid} 
              className="copy-button text-gray-400 hover:text-white transition-colors"
              aria-label="Render diagram"
              title="Toggle diagram view"
            >
              <FaChartLine />
            </button>
          )}
          <button 
            onClick={handleCopy} 
            className="copy-button text-gray-400 hover:text-white transition-colors"
            aria-label="Copy code"
            title="Copy to clipboard"
          >
            {copied ? <FaCheck /> : <FaRegCopy />}
          </button>
        </div>
      </div>
      
      {isMermaid && showImage ? (
        <div className="mermaid-image-container bg-white p-4 flex justify-center">
          <img 
            src={getMermaidImageUrl()} 
            alt="Mermaid diagram" 
            className="max-w-full"
            onError={(e) => {
              console.error("Failed to load Mermaid diagram", e);
              setShowImage(false);
            }}
          />
        </div>
      ) : (
        <pre className="bg-gray-900 p-4 overflow-x-auto">
          <code className={language ? `language-${language}` : ''}>
            {value}
          </code>
        </pre>
      )}
    </div>
  );
};

export default CodeBlock;
