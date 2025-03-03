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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const db_1 = require("./services/db");
const documentProcessor_1 = require("./services/documentProcessor");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
// Agent endpoints
app.post("/agents", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, guidance } = req.body;
        const agent = yield db_1.dbService.createAgent(name, description, guidance);
        res.json(agent);
    }
    catch (error) {
        console.error("Error creating agent:", error);
        res.status(500).json({ error: "Failed to create agent" });
    }
}));
app.get("/agents", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agents = yield db_1.dbService.getAllAgents();
        res.json(agents);
    }
    catch (error) {
        console.error("Error fetching agents:", error);
        res.status(500).json({ error: "Failed to fetch agents" });
    }
}));
app.get("/agents/:agentId/chats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = yield db_1.dbService.getAgentChats(req.params.agentId);
        res.json(chats);
    }
    catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).json({ error: "Failed to fetch chats" });
    }
}));
app.patch("/agents/:agentId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { agentId } = req.params;
        const updates = req.body;
        // Validate that at least one field is being updated
        // if (Object.keys(updates).length === 0) {
        //    return res.status(400).json({ error: "No update fields provided" });
        // }
        // Only allow updates to valid fields
        const validUpdates = {
            name: updates.name,
            description: updates.description,
            guidance: updates.guidance
        };
        // Remove undefined fields
        Object.keys(validUpdates).forEach(key => {
            if (validUpdates[key] === undefined) {
                delete validUpdates[key];
            }
        });
        const updatedAgent = yield db_1.dbService.updateAgent(agentId, validUpdates);
        res.json(updatedAgent);
    }
    catch (error) {
        console.error("Error updating agent:", error);
        res.status(500).json({ error: "Failed to update agent" });
    }
}));
app.delete("/agents/:agentId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { agentId } = req.params;
        yield db_1.dbService.deleteAgent(agentId);
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting agent:", error);
        res.status(500).json({ error: "Failed to delete agent" });
    }
}));
// Chat endpoints
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, messages } = req.body;
    try {
        const chat = yield db_1.dbService.getChat(chatId);
        if (!chat) {
            console.log("Chat not found");
        }
        const agent = yield db_1.dbService.getAgent(chat.agentId);
        if (!agent) {
            console.log("Agent not found");
        }
        // Get the latest user message
        const userMessage = messages[messages.length - 1];
        // Search for relevant chunks if the agent has documents
        let context = [];
        if (agent.documents.length > 0) {
            const relevantChunks = yield documentProcessor_1.DocumentProcessor.searchRelevantChunks(userMessage.content, chat.agentId);
            context = relevantChunks.map(chunk => ({
                content: chunk.content,
                source: chunk.documentId
            }));
        }
        // Create system message with guidance and context
        const systemMessage = {
            role: "system",
            content: `${agent.guidance || "You are a helpful AI assistant."}
             ${context.length > 0
                ? `Context from relevant documents:\n${context.map(c => `Source: ${c.source}\nContent: ${c.content}\n`).join('\n')}\n
                       When using information from the context, cite the source.`
                : ''}`
        };
        // Combine system message with user messages
        const fullMessages = [systemMessage, ...messages];
        // Store user message
        yield db_1.dbService.addMessage(chatId, messages[messages.length - 1]);
        const response = yield axios_1.default.post(GROQ_API_URL, {
            model: "mixtral-8x7b-32768",
            messages: fullMessages,
            temperature: 0.7
        }, { headers: { Authorization: `Bearer ${GROQ_API_KEY}` } });
        // Store assistant message
        const assistantMessage = response.data.choices[0].message;
        yield db_1.dbService.addMessage(chatId, assistantMessage);
        res.json(Object.assign(Object.assign({}, response.data), { sources: context.map(c => c.source) }));
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to process request" });
    }
}));
app.get("/agents/:agentId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agent = yield db_1.dbService.getAgent(req.params.agentId);
        res.json(agent);
    }
    catch (error) {
        console.error("Error fetching agent:", error);
        res.status(500).json({ error: "Failed to fetch agent" });
    }
}));
app.post("/chats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { agentId, name } = req.body;
        const chat = yield db_1.dbService.createChat(agentId, name);
        res.json(chat);
    }
    catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).json({ error: "Failed to create chat" });
    }
}));
app.get("/chats/:chatId/messages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield db_1.dbService.getChatMessages(req.params.chatId);
        res.json(messages);
    }
    catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
}));
app.post("/agents/:agentId/documents", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { agentId, filename } = req.body;
        const document = yield db_1.dbService.addDocument(agentId, filename);
        res.json(document);
    }
    catch (error) {
        console.error("Error adding document:", error);
        res.status(500).json({ error: "Failed to add document" });
    }
}));
app.get("/agents/:agentId/documents", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { agentId } = req.body;
        const document = yield db_1.dbService.getAgentDocuments(agentId);
        res.json(document);
    }
    catch (error) {
        console.error("Error adding document:", error);
        res.status(500).json({ error: "Failed to add document" });
    }
}));
app.get("/agents/:agentId/guidance", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agent = yield db_1.dbService.getAgent(req.params.agentId);
        res.json(agent.guidance);
    }
    catch (error) {
        console.error("Error fetching guidance:", error);
        res.status(500).json({ error: "Failed to fetch guidance" });
    }
}));
const upload = (0, multer_1.default)({ dest: "uploads/" }); // This will save files in 'uploads/' folder
// Handle file uploads
app.post("/upload", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // if (!req.file) {
        //     return res.status(400).json({ error: "No file uploaded" });
        // }
        const docId = req.body.doc;
        const fileBuffer = fs_1.default.readFileSync(req.file.path);
        const agentId = req.body.agentId;
        const pdfData = yield (0, pdf_parse_1.default)(fileBuffer);
        res.json({ message: "PDF uploaded successfully", content: pdfData.text });
        yield documentProcessor_1.DocumentProcessor.processDocument(docId, pdfData.text, agentId);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to upload file" });
    }
}));
exports.default = app;
