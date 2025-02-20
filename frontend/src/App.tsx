import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import { api } from "./api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
}

const App: React.FC = () => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const chatList = await api.getAllChats();
      setChats(chatList.map(chat => ({ ...chat, messages: [] })));
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  };

  const loadChatMessages = async (chatId: string) => {
    try {
      const messages = await api.getChatMessages(chatId);
      setChats(prev => 
        prev.map(chat => 
          chat.id === chatId ? { ...chat, messages } : chat
        )
      );
      setCurrentChat(prev => 
        prev?.id === chatId ? { ...prev, messages } : prev
      );
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const newChat = async () => {
    try {
      const chat = await api.createChat(`Chat ${chats.length + 1}`);
      const newChat = { ...chat, messages: [] };
      setChats(prev => [...prev, newChat]);
      setCurrentChat(newChat);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const selectChat = async (id: string) => {
    const selected = chats.find(c => c.id === id);
    if (selected) {
      setCurrentChat(selected);
      if (selected.messages.length === 0) {
        await loadChatMessages(id);
      }
    }
  };

  const updateMessages = async (chatId: string, newMessages: Message[]) => {
    setChats(prev =>
      prev.map(c => (c.id === chatId ? { ...c, messages: newMessages } : c))
    );
    setCurrentChat(prev => 
      prev?.id === chatId ? { ...prev, messages: newMessages } : prev
    );
  };

  return (
    <div className="app-container">
      <Sidebar 
        chats={chats} 
        selectChat={selectChat} 
        newChat={newChat}
        currentChatId={currentChat?.id}
      />
      <div className="chat-container">
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
            <button onClick={newChat} className="button">
              Start New Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
