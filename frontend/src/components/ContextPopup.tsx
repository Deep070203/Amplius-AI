import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { Document } from '../types';
import { api } from '../api';

interface ContextPopupProps {
  onClose: () => void;
}


const ContextPopup: React.FC<ContextPopupProps> = ({ onClose }) => {
  const [context, setContext] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { agentId } = useParams<{ agentId: string }>();
  const [fileContent, setFileContent] = useState("");

  useEffect(() => {
    loadDocuments();
  }, [agentId]);

  const loadDocuments = async () => {
    try {
      if (agentId) {
        const docList = await api.getAgentDocuments(agentId);
        console.log("Documents loaded:", docList);
        setContext(docList);
      }
      
    } catch (error) {
      console.error("Error loading documents:", error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFiles(files);
    if (!agentId || files.length === 0) return;
  };


  const handleSubmit = async () => {
    if (!agentId) return;

    setIsLoading(true);
    try {
        for (const file of files) {
            const doc = await api.addDocument(agentId, file.name);
            setContext(prev => [...prev, doc]);
            console.log("document: ", doc);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("doc", doc.id);
            formData.append("agentId", agentId);

            const response = await fetch("http://localhost:5002/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setFileContent(data.content);
            console.log("Content:", fileContent);
        }
      console.log("Added documents:", context);
    } catch (error) {
      console.error("Error uploading docs: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='popup'>
      <div className="">
        <button
          onClick={onClose}
          className=""
          aria-label="Close popup"
        >
          <FiX size={24} />
        </button>

        <h2 className="">Upload Documents</h2>
        
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          className=""
          disabled={isLoading}
        />


        <button
          onClick={handleSubmit}
          className=""
          aria-label="Add"
        >
            Add Documents
        </button>
        {isLoading && (
          <p className="">Uploading documents...</p>
        )}

        <div className="">
          <h3 className="">Uploaded Documents:</h3>
          {context.length > 0 ? (
            <ul className="">
              {context.map(file => (
                <li key={file.filename} className="">
                  {file.filename}
                </li>
              ))}
            </ul>
          ) : (
            <p className="">No documents uploaded yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContextPopup;
