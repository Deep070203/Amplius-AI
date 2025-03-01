import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { api } from '../api';

interface GuidancePopupProps {
  onClose: () => void;
}


const GuidancePopup: React.FC<GuidancePopupProps> = ({ onClose }) => {
  const [guidance, setGuidance] = useState("");
  const { agentId } = useParams<{ agentId: string }>();

  useEffect(() => {
    loadGuidance();
  }, [agentId]);

  const loadGuidance = async () => {
    try {
      if (agentId) {
        const gd = await api.getAgentGuideance(agentId);
        setGuidance(gd);
      }
      
    } catch (error) {
      console.error("Error loading documents:", error);
    }
  };


  const handleSubmit = async () => {
    if (!agentId) return;

    try {
        await api.updateAgentGuidance(agentId, guidance);
    } catch (error) {
        console.error("Error updating guidance: ", error);
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

        <h2 className="">Edit Guidance</h2>
        
        <textarea
          id="guidance"
          value={guidance}
          onChange={(e) => setGuidance(e.target.value)}
          className="textarea"
          placeholder="Enter agent guidance"
          rows={1}
        />

        <button
          onClick={handleSubmit}
          className=""
          aria-label="Add"
        >
            Submit
        </button>
      </div>
    </div>
  );
};

export default GuidancePopup;
