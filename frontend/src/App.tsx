import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AgentChatPage from "./components/AgentChatPage";
import { api } from "./api";
import { Document, Agent } from "./types";


const App: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const agentList = await api.getAllAgents();
      console.log("agentList", agentList);
      setAgents(agentList);
    } catch (error) {
      console.error("Error loading agents:", error);
    }
  };

  const handleNewAgent = async (agentData: {
    name: string;
    description?: string;
    guidance?: string;
    context?: Document[];
  }) => {
    try {
      const newAgent = await api.createAgent(agentData.name, agentData.description, agentData.guidance, agentData.context);
      setAgents(prevAgents => [...prevAgents, newAgent]);
    } catch (error) {
      console.error("Error creating agent:", error);
    }
  };

  return (
    <Router>
      <div className="">
        <Routes>
          <Route 
            path="/" 
            element={
              <Dashboard
                agents={agents}
                onNewAgent={handleNewAgent}
              />
            } 
          />
          <Route 
            path="/agent/:agentId" 
            element={<AgentChatPage />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
