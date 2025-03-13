import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dbService = {
  // Agent related functions
  async createAgent(name: string, description?: string, guidance?: string) {
    return prisma.agent.create({
      data: {
        name,
        description,
        guidance,
      },
    });
  },

  async getAgent(id: string) {
    return prisma.agent.findUnique({
      where: { id },
      include: {
        documents: true,
      },
    });
  },

  async updateAgent(id: string, data: {
    name?: string;
    description?: string;
    guidance?: string;
  }) {
    return prisma.agent.update({
      where: { id },
      data,
    });
  },

  async deleteAgent(id: string) {
    return prisma.agent.delete({
      where: { id },
    });
  },

  async getAllAgents() {
    return prisma.agent.findMany();
  },

  // Chat related functions
  async createChat(agentId: string, name: string) {
    return prisma.chat.create({
      data: {
        agentId,
        name,
      },
    });
  },

  async renameChat(chatId: string, newName: string) {
    return prisma.chat.update({
      where: { id: chatId },
      data: { name: newName },
    });
  },

  async deleteChat(chatId: string) {
    return prisma.chat.delete({
      where: { id: chatId },
    });
  },

  async getChat(id: string) {
    return prisma.chat.findUnique({
      where: { id },
      include: {
        agent: true,
        messages: true,
      },
    });
  },

  async getAgentChats(agentId: string) {
    return prisma.chat.findMany({
      where: { agentId },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  },

  // Message related functions
  async addMessage(chatId: string, message: { role: string; content: string; source?: string }) {
    return prisma.message.create({
      data: {
        chatId,
        role: message.role,
        content: message.content,
        source: message.source,
      },
    });
  },

  async getChatMessages(chatId: string) {
    return prisma.message.findMany({
      where: { chatId },
      orderBy: {
        createdAt: 'asc',
      },
    });
  },

  // Document related functions
  async addDocument(agentId: string, filename: string) {
    const document = await prisma.document.create({
      data: {
        agentId,
        filename,
      },
    });
    return document;
  },

  async addDocumentChunk(documentId: string, agentId: string, content: string, embedding: string) {
    return prisma.documentChunk.create({
      data: {
        documentId,
        agentId,
        content,
        embedding,
      },
    });
  },

  async getAgentDocuments(agentId: string) {
    return prisma.document.findMany({
      where: { agentId },
      include: {
        chunks: true,
      },
    });
  },
};
