import React, { useState } from 'react';
import { FiPlus, FiMessageSquare, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface SidebarProps {
  chats: Array<{ id: string; name: string }>;
  currentChatId: string | null;
  selectChat: (id: string) => void;
  newChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ chats, currentChatId, selectChat, newChat }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        <button className="button" onClick={newChat}>
          <FiPlus />
          {isExpanded && <span>New Chat</span>}
        </button>
      </div>

      <button 
        className="sidebar-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
      </button>

      <div className="sidebar-content">
        {chats.map((chat) => (
          <button
            key={chat.id}
            className={`sidebar-button ${chat.id === currentChatId ? 'active' : ''}`}
            onClick={() => selectChat(chat.id)}
          >
            <FiMessageSquare />
            {isExpanded && <span>{chat.name}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;