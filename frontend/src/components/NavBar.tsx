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
          className="flex items-center text-gray-700 hover:text-gray-900"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Agent Settings</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guidance
              </label>
              <textarea
                value={editGuidance}
                onChange={(e) => setEditGuidance(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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