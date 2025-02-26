import React, { useState, useRef, useEffect } from "react";
import { IoSendSharp } from "react-icons/io5";
import { api } from "../api";
import { Message } from "../types";
import Markdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { CodeProps } from 'react-markdown/lib/ast-to-react';
import CodeBlock from "./CodeBlock";

interface ChatProps {
  chatId: string;
  messages: Message[];
  updateMessages: (chatId: string, newMessages: Message[]) => void;
}

const Chat: React.FC<ChatProps> = ({ chatId, messages, updateMessages }) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const newMessages: Message[] = [...messages, { role: "user", content: input.trim() }];
      updateMessages(chatId, newMessages);
      setInput("");

      const response = await api.sendMessage(chatId, newMessages);
      updateMessages(chatId, [...newMessages, response]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-screen">
      <div className="current-chat">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-4 ${
                msg.role === "user" ? "user-input" : "assistant-input"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                <Markdown 
                  remarkPlugins={[remarkGfm, remarkParse]}
                  components={{
                    code(props: CodeProps) {
                      const { className, children, node, ...rest } = props;
                      const match = /language-(\w+)/.exec(className || '');
                      // console.log("match: ",match);
                      return !props.inline ? (
                        <CodeBlock
                          value={String(children).replace(/\n$/, '')}
                          language={match && match[1]}
                        />
                      ) : (
                        <code className={className} {...rest}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {msg.content}
                </Markdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
      </div>
      <div id="footer">
          <textarea
            className="input-container"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-blue-500 text-white p-2 rounded-lg disabled:opacity-50"
          >
            <IoSendSharp size={20} />
          </button>
        </div>
    </div>
  );
};

export default Chat;
