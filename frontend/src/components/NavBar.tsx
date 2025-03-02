import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import ContextPopup from './ContextPopup';
import GuidancePopup from './GuidancePopup';


interface NavBarProps {
  agentName: string;
}

const NavBar: React.FC<NavBarProps> = ({
  agentName,
}) => {
  const navigate = useNavigate();
  const [showGuidance, setShowGuidance] = useState(false);
  const [showPopup, setShowPopup] = useState(false);


  return (
    <>
    {showPopup && <ContextPopup onClose={() => setShowPopup(false)} />}{showPopup && (
      <ContextPopup
        onClose={() => setShowPopup(false)}
      />
    )}
    {showGuidance && <GuidancePopup onClose={() => setShowGuidance(false)} />}{showGuidance && (
      <GuidancePopup
        onClose={() => setShowGuidance(false)}
      />
    )}
    <div className='topnav'>
      <nav className="nav">
        <button
          onClick={() => navigate('/')}
          className=""
          aria-label="Back to dashboard"
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
            onClick={() => setShowGuidance(true)}
            className="nav-button"
          >
            <span className="ml-2">Guidance</span>
          </button>
        </div>
        
      </nav>

      
    </div>
    </>
  );
};

export default NavBar;