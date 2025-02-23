import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiPlus } from 'react-icons/fi';
import AgentPopup from './AgentPopup';
import { Document } from '../types';

interface Agent {
  id: string;
  name: string;
  description?: string;
  guidance?: string;
  context?: Document[];
}

interface DashboardProps {
  agents: Agent[];
  onNewAgent: (agentData: { name: string; description: string; guidance: string; context: Document[] }) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ agents, onNewAgent }) => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleAgentClick = (agentId: string) => {
    navigate(`/agent/${agentId}`);
  };

  return (
    <>
      {showPopup && <AgentPopup onClose={() => setShowPopup(false)} onSubmit={onNewAgent} />}{showPopup && (
        <AgentPopup
          onClose={() => setShowPopup(false)}
          onSubmit={onNewAgent}
        />
      )}
        <div className="dashboard-wrapper">
        
            <div className="dashboard-container">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="dashboard-title">Your AI Agents</h1>
                    <button 
                    onClick={() => setShowPopup(true)}
                    className="add-button"
                    >
                    <FiPlus size={20} className="inline-block mr-2" />
                    <span>New Agent</span>
                    </button>
                </div>

                <div className="agent-container">
                    {agents.map((agent) => (
                    <div
                        key={agent.id}
                        onClick={() => handleAgentClick(agent.id)}
                        className="text-left bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors w-full"
                    >
                        <div className="agent-box">
                        <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                            <FiUser size={24} />
                        </div>
                        <h3>{agent.name}</h3>
                        {agent.description && (
                            <p>{agent.description}</p>
                        )}
                        </div>
                    </div>
                    ))}
                    
                    {agents.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-400">No agents found. Create your first agent to get started!</p>
                    </div>
                    )}
                </div>
        </div>
        
      </div>
    </>
  );
};

export default Dashboard;
