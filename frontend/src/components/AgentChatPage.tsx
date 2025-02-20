import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Chat from './Chat';
import { api } from '../api';
import NavBar from './NavBar';
import { Message, Chat as ChatType, Agent } from '../types';
import  PdfViewer  from './PdfViewer';

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
}

const AgentChatPage: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);

  useEffect(() => {
    if (agentId) {
      console.log("agentId", agentId);
      loadAgentChats(agentId);
      loadAgentDetails(agentId);
    }
  }, [agentId]);

  const loadAgentDetails = async (agentId: string) => {
    try {
      const agentDetails = await api.getAgent(agentId);
      setAgent(agentDetails);
      console.log("agent", agent);
    } catch (error) {
      console.error("Error loading agent details:", error);
    }
  };

  const loadAgentChats = async (agentId: string) => {
    try {
      const agentChats = await api.getAgentChats(agentId);
      setChats(agentChats.map(chat => ({ ...chat, messages: [] })));
    } catch (error) {
      console.error("Error loading agent chats:", error);
    }
  };

  const handleUpdateGuidance = async (newGuidance: string) => {
    if (!agent || !agentId) return;
    try {
      await api.updateAgent(agentId, { guidance: newGuidance });
      setAgent(prev => prev ? { ...prev, guidance: newGuidance } : null);
    } catch (error) {
      console.error("Error updating guidance:", error);
    }
  };


  const handleCreateChat = async () => {
    if (!agentId) return;
    try {
      const chat = await api.createChat(agentId, `Chat ${chats.length + 1}`);
      const newChat = { ...chat, messages: [] };
      setChats(prev => [...prev, newChat]);
      setCurrentChat(newChat);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleChatSelect = async (id: string) => {
    const selected = chats.find(c => c.id === id);
    if (selected) {
      setCurrentChat(selected);
      if (selected.messages.length === 0) {
        try {
          const messages = await api.getChatMessages(id);
          updateMessages(id, messages);
        } catch (error) {
          console.error("Error loading messages:", error);
        }
      }
    }
  };

  const updateMessages = (chatId: string, newMessages: Message[]) => {
    setChats(prev =>
      prev.map(c => (c.id === chatId ? { ...c, messages: newMessages } : c))
    );
    setCurrentChat(prev => 
      prev?.id === chatId ? { ...prev, messages: newMessages } : prev
    );
  };

  return (
    <div className="screen">
      {agent && (
        <NavBar
          agentName={agent.name}
          guidance={agent.guidance??""}
          onUpdateGuidance={handleUpdateGuidance}
        />
      )}
      <div className='app-container'>
        <Sidebar
          chats={chats}
          currentChatId={currentChat?.id ?? null}
          selectChat={handleChatSelect}
          newChat={handleCreateChat}
        />
        <div className='chat-container'>
          {currentChat ? (
            <Chat
              chatId={currentChat.id}
              messages={currentChat.messages}
              updateMessages={updateMessages}
            />
          ) : (
            <div className="welcome-screen">
              <h2>Welcome to Chat</h2>
              <p>Select a chat or create a new one to get started</p>
              <button onClick={handleCreateChat} className="button">
                Start New Chat
              </button>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default AgentChatPage;
