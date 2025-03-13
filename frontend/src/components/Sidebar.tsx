import React, { useEffect, useRef, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { BiRename } from 'react-icons/bi';
import { FiPlus, FiMessageSquare, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface SidebarProps {
  chats: Array<{ id: string; name: string }>;
  currentChatId: string | null;
  selectChat: (id: string) => void;
  newChat: () => void;
  deleteChat: (id: string) => void;
  renameChat: (id: string, newName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ chats, currentChatId, selectChat, newChat, deleteChat, renameChat }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming) {
      renameInputRef.current?.focus();
    }
  }, [isRenaming]);

  const handleRenameClick = (e: React.MouseEvent, chatId: string, currentName: string) => {
    e.stopPropagation();
    setIsRenaming(chatId);
    setNewName(currentName);
  };

  const handleDeleteClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    deleteChat(chatId);
  };

  const handleRenameSubmit = (chatId: string) => {
    if (newName.trim()) {
      renameChat(chatId, newName.trim());
      setIsRenaming(null);
      setNewName("");
    }
  };

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
          <div key={chat.id} className="selected-chat">
            <button
              key={chat.id}
              className={`sidebar-button ${chat.id === currentChatId ? 'active' : ''}`}
              onClick={() => selectChat(chat.id)}
              
            >
            <div className="chat-name">
                <FiMessageSquare />
                {isExpanded && (
                  isRenaming === chat.id ? (
                    <input
                      ref={renameInputRef}
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onBlur={() => handleRenameSubmit(chat.id)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleRenameSubmit(chat.id);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Enter new name"
                    />
                  ) : (
                    <span>{chat.name}</span>
                  )
                )}
              </div>
            {isExpanded && (
               <div className="edit-buttons">
                 <button
                   onClick={(e) => handleRenameClick(e, chat.id, chat.name)}
                   className="chat-sd-button"
                   title="Rename chat"
                   aria-label="Rename chat"
                 >
                   <BiRename className="mr-2" />
                 </button>
                 <button
                   onClick={(e) => handleDeleteClick(e, chat.id)}
                   className="chat-sd-button"
                   title="Delete chat"
                   aria-label="Delete chat"
                 >
                   <FaTrash className="mr-2" />
                 </button>
               </div>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;