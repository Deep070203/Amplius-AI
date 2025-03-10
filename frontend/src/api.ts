import axios from "axios";
import { Message, Chat, Agent, Document } from "./types";

const API_URL = "http://localhost:5002";

export const api = {
    async createAgent(name: string, description?: string, guidance?: string, context?: Document[]): Promise<Agent> {
        const response = await axios.post(`${API_URL}/agents`, { name, description, guidance, context });
        return response.data;
    },
    
    async getAllAgents(): Promise<Agent[]> {
        const response = await axios.get(`${API_URL}/agents`);
        return response.data;
    },
    
    async getAgent(agentId: string): Promise<Agent> {
        const response = await axios.get(`${API_URL}/agents/${agentId}`);
        console.log("agent", response.data);
        return response.data;
    },
    
    async updateAgent(agentId: string, updates: { name?: string; description?: string; guidance?: string }): Promise<Agent> {
        const response = await axios.patch(`${API_URL}/agents/${agentId}`, updates);
        return response.data;
    },
    // Chat endpoints
    async createChat(agentId: string, name: string): Promise<Chat> {
        const response = await axios.post(`${API_URL}/chats`, { agentId, name });
        return response.data;
    },
    
    async getAgentChats(agentId: string): Promise<Chat[]> {
        const response = await axios.get(`${API_URL}/agents/${agentId}/chats`);
        return response.data;
    },

    async getChatMessages(chatId: string): Promise<Message[]> {
        const response = await axios.get(`${API_URL}/chats/${chatId}/messages`);
        return response.data;
    },

    async sendMessage(chatId: string, messages: Message[]): Promise<Message> {
        try {
            const response = await axios.post(`${API_URL}/chat`, { 
                chatId, 
                messages 
            });
            return response.data.choices[0].message;
        } catch (error) {
            console.error("Error sending message:", error);
            return { role: "assistant", content: "Error: Failed to get response." };
        }
    },


    // Document endpoints
    async addDocument(agentId: string, filename: string): Promise<Document> {
        const response = await axios.post(`${API_URL}/agents/${agentId}/documents`, { agentId, filename });
        return response.data;
    },

    async getAgentDocuments(agentId: string): Promise<Document[]> {
        const response = await axios.get(`${API_URL}/agents/${agentId}/documents`);
        return response.data;
    },

    async uploadDocument(file: File, agentId: string): Promise<Document> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('agentId', agentId);

        const response = await fetch(`/api/documents/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload document');
        }

        return response.json();
    },

    async deleteAgent(agentId: string): Promise<void> {
        await axios.delete(`${API_URL}/agents/${agentId}`);
    },
};
