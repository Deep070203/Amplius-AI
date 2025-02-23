import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { Document } from '../types';

interface AgentPopupProps {
  onClose: () => void;
  onSubmit: (agentData: { name: string; description: string; guidance: string; context: Document[] } ) => void; // name: string, description: string ) => void;
}

const AgentPopup: React.FC<AgentPopupProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [guidance, setGuidance] = useState('');
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      guidance: guidance.trim(),
      context: []
    });
    onClose();
  };

  return (
    <>
    <div className='popup'>
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label="Close popup"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-xl font-bold mb-6">Create New Agent</h2>

        <form onSubmit={handleSubmit} >
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Agent Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter agent name"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea"
              placeholder="Enter agent description"
              rows={3}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="guidance" className="block text-sm font-medium mb-2">
              Guidance
            </label>
            <textarea
              id="guidance"
              value={guidance}
              onChange={(e) => setGuidance(e.target.value)}
              className="textarea"
              placeholder="Enter agent guidance"
              rows={1}
            />
          </div>
          

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="btn"
              disabled={!name.trim()}
            >
              Create Agent
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </>
  );
};

export default AgentPopup;
