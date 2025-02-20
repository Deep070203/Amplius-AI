export interface Message {
    id?: string;
    role: "system" | "user" | "assistant";
    content: string;
    source?: string;
    createdAt?: string;
}

export interface Chat {
    id: string;
    agentId: string;
    name: string;
    created_at: string;
    messages?: Message[];
}

export interface Agent {
    id: string;
    name: string;
    description?: string;
    guidance?: string;
    documents?: Document[];
    createdAt: string;
    chats?: Chat[];
  
}

export interface Document {
    id: string;
    filename: string;
    agentId: string;
}