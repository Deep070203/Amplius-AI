"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.dbService = {
    // Agent related functions
    createAgent(name, description, guidance) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.agent.create({
                data: {
                    name,
                    description,
                    guidance,
                },
            });
        });
    },
    getAgent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.agent.findUnique({
                where: { id },
                include: {
                    documents: true,
                },
            });
        });
    },
    updateAgent(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.agent.update({
                where: { id },
                data,
            });
        });
    },
    getAllAgents() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.agent.findMany();
        });
    },
    // Chat related functions
    createChat(agentId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.chat.create({
                data: {
                    agentId,
                    name,
                },
            });
        });
    },
    getChat(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.chat.findUnique({
                where: { id },
                include: {
                    agent: true,
                    messages: true,
                },
            });
        });
    },
    getAgentChats(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    },
    // Message related functions
    addMessage(chatId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.message.create({
                data: {
                    chatId,
                    role: message.role,
                    content: message.content,
                    source: message.source,
                },
            });
        });
    },
    getChatMessages(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.message.findMany({
                where: { chatId },
                orderBy: {
                    createdAt: 'asc',
                },
            });
        });
    },
    // Document related functions
    addDocument(agentId, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const document = yield prisma.document.create({
                data: {
                    agentId,
                    filename,
                },
            });
            return document;
        });
    },
    addDocumentChunk(documentId, agentId, content, embedding) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.documentChunk.create({
                data: {
                    documentId,
                    agentId,
                    content,
                    embedding,
                },
            });
        });
    },
    getAgentDocuments(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.document.findMany({
                where: { agentId },
                include: {
                    chunks: true,
                },
            });
        });
    },
};
