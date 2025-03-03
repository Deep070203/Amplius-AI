import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiMoreHorizontal, FiEdit2, FiTrash2 } from 'react-icons/fi';
import AgentPopup from './AgentPopup';
import { Document } from '../types';
import { api } from '../api';

interface Agent {
  id: string;
  name: string;
  description?: string;
  guidance?: string;
  context?: Document[];
}

interface DashboardProps {
  agents: Agent[];
  onNewAgent: (agentData: { name: string; description: string; guidance?: string; context?: Document[] }) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ agents, onNewAgent }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAgentClick = (agentId: string) => {
    navigate(`/agent/${agentId}`);
  };

  const toggleMenu = (e: React.MouseEvent, agentId: string) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === agentId ? null : agentId);
  };

  const handleEdit = (e: React.MouseEvent, agent: Agent) => {
    e.stopPropagation();
    setSelectedAgent(agent);
    setShowEditPopup(true);
    setActiveMenu(null);
  };

  const handleDelete = async (e: React.MouseEvent, agentId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await api.deleteAgent(agentId);
        // Refresh the agents list - you'll need to implement this
        window.location.reload();
      } catch (error) {
        console.error('Error deleting agent:', error);
      }
    }
    setActiveMenu(null);
  };

  const handleUpdate = async (agentData: { name: string; description: string }) => {
    if (!selectedAgent) return;
    
    try {
      await api.updateAgent(selectedAgent.id, agentData);
      // Refresh the agents list
      window.location.reload();
    } catch (error) {
      console.error('Error updating agent:', error);
    }
    setShowEditPopup(false);
    setSelectedAgent(null);
  };

  return (
    <>
      {showPopup && <AgentPopup onClose={() => setShowPopup(false)} onSubmit={onNewAgent} />}
      {showEditPopup && selectedAgent && (
        <AgentPopup 
          onClose={() => {
            setShowEditPopup(false);
            setSelectedAgent(null);
          }}
          onSubmit={handleUpdate}
          initialData={selectedAgent}
          isEditing={true}
        />
      )}
      <div className="dashboard-wrapper">
        <div className="dashboard-container">
          <div className="">
            <h1 className="dashboard-title">Your AI Agents</h1>
            <button 
              onClick={() => setShowPopup(true)}
              className="add-button"
            >
              <FiPlus size={20} className="" />
              <span>New Agent</span>
            </button>
          </div>

          <div className="agent-container">
            {agents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => handleAgentClick(agent.id)}
                className="agent-card"
              >
                <div className="agent-box">
                  <div className="top-section">
                    <button
                    onClick={(e) => toggleMenu(e, agent.id)}
                    className="menu-button"
                    aria-label="Open menu"
                    >
                      <FiMoreHorizontal size={20} />
                    </button>
                  </div>
                  <div className='details'>
                    <h3>{agent.name}</h3>
                    {agent.description && (
                      <p>{agent.description}</p>
                    )}
                  </div>
                  
                  {activeMenu === agent.id && (
                    <div className="menu-dropdown absolute top-10 right-2 bg-white shadow-lg rounded-md py-1">
                      <button
                        onClick={(e) => handleEdit(e, agent)}
                        className="menu-item"
                      >
                        <FiEdit2 size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, agent.id)}
                        className="menu-item text-red-600"
                      >
                        <FiTrash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {agents.length === 0 && (
              <div className="">
                <p className="">No agents found. Create your first agent to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
