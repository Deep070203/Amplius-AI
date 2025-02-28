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
      <div className="">
        <button
          onClick={onClose}
          className=""
          aria-label="Close popup"
        >
          <FiX size={24} />
        </button>

        <h2 className="">Create New Agent</h2>

        <form onSubmit={handleSubmit} >
          <div className="">
            <label htmlFor="name" className="">
              Agent Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className=""
              placeholder="Enter agent name"
              required
            />
          </div>

          <div className="">
            <label htmlFor="description" className="">
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
          <div className="">
            <label htmlFor="guidance" className="">
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
          

          <div className="">
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
