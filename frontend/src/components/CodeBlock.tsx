import React, { useState } from 'react';
import { FaRegCopy, FaCheck } from 'react-icons/fa';

interface CodeBlockProps {
  value: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ value, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-container relative my-4 rounded-md overflow-hidden">
      <div className="code-header bg-gray-800 px-4 py-2 flex justify-between items-center">
        {language && <span className="text-gray-400 text-sm">{language}</span>}
        <button 
          onClick={handleCopy} 
          className="copy-button text-gray-400 hover:text-white transition-colors"
          aria-label="Copy code"
        >
          {copied ? <FaCheck /> : <FaRegCopy />}
        </button>
      </div>
      <pre className="bg-gray-900 p-4 overflow-x-auto">
        <code className={language ? `language-${language}` : ''}>
          {value}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;