import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import ContextPopup from './ContextPopup';


interface NavBarProps {
  agentName: string;
  guidance: string;
  onUpdateGuidance: (newGuidance: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({
  agentName,
  guidance,
  onUpdateGuidance,
}) => {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [editGuidance, setEditGuidance] = useState(guidance);
  const [showPopup, setShowPopup] = useState(false);

  const handleSaveSettings = () => {
    onUpdateGuidance(editGuidance);
    setShowSettings(false);
  };


  return (
    <>
    {showPopup && <ContextPopup onClose={() => setShowPopup(false)} />}{showPopup && (
      <ContextPopup
        onClose={() => setShowPopup(false)}
      />
    )}
    <div className='topnav'>
      <nav className="nav">
        <button
          onClick={() => navigate('/')}
          className=""
        >
          <FiArrowLeft size={24} />
        </button>

        <h1 className="agent-name">{agentName}</h1>
        <div className="nav-buttons">
          <button 
              onClick={() => setShowPopup(true)}
              className="nav-button"
              >
              <span>Context</span>
              </button>
          <button
            onClick={() => setShowSettings(true)}
            className="nav-button"
          >
            <span className="ml-2">Guidance</span>
          </button>
        </div>
        
      </nav>

      {showSettings && (
        <div className="">
          <div className="">
            <h2 className="">Agent Settings</h2>
            
            <div className="mb-4">
              <label className="">
                Guidance
              </label>
              <textarea
                value={editGuidance}
                onChange={(e) => setEditGuidance(e.target.value)}
                className=""
                rows={3}
              />
            </div>

            <div className="">
              <button
                onClick={() => setShowSettings(false)}
                className=""
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className=""
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default NavBar;