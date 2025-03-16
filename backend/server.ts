import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import multer from "multer";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import { dbService } from './services/db';
import { DocumentProcessor } from './services/documentProcessor';
import { mcpClient } from './mcp/client';
import { applyToolCalls, mapToolstoGroqTools } from './mcp/groqtool_utils';
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface DocumentContext {
    content: string;
    source: Promise<string>;
}

interface AgentUpdates {
    name?: string;
    description?: string;
    guidance?: string;
}

// Agent endpoints
app.post("/agents", async (req, res) => {
    try {
        const { name, description, guidance } = req.body;
        const agent = await dbService.createAgent(name, description, guidance);
        res.json(agent);
    } catch (error) {
        console.error("Error creating agent:", error);
        res.status(500).json({ error: "Failed to create agent" });
    }
});

app.get("/agents", async (req, res) => {
    try {
        const agents = await dbService.getAllAgents();
        res.json(agents);
    } catch (error) {
        console.error("Error fetching agents:", error);
        res.status(500).json({ error: "Failed to fetch agents" });
    }
});

app.get("/agents/:agentId/chats", async (req, res) => {
    try {
        const chats = await dbService.getAgentChats(req.params.agentId);
        res.json(chats);
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).json({ error: "Failed to fetch chats" });
    }
});

app.patch("/agents/:agentId", async (req, res) => {
    try {
        const { agentId } = req.params;
        const updates = req.body;
        
        // Validate that at least one field is being updated
        // if (Object.keys(updates).length === 0) {
        //    return res.status(400).json({ error: "No update fields provided" });
        // }

        // Only allow updates to valid fields
        const validUpdates: AgentUpdates = {
            name: updates.name,
            description: updates.description,
            guidance: updates.guidance
        };

        // Remove undefined fields
        (Object.keys(validUpdates) as (keyof AgentUpdates)[]).forEach(key => {
            if (validUpdates[key] === undefined) {
                delete validUpdates[key];
            }
        });

        const updatedAgent = await dbService.updateAgent(agentId, validUpdates);
        res.json(updatedAgent);
    } catch (error) {
        console.error("Error updating agent:", error);
        res.status(500).json({ error: "Failed to update agent" });
    }
});

app.delete("/agents/:agentId", async (req, res) => {
    try {
        const { agentId } = req.params;
        await dbService.deleteAgent(agentId);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting agent:", error);
        res.status(500).json({ error: "Failed to delete agent" });
    }
});

// Chat endpoints
app.post("/chat", async (req, res) => {
    const { chatId, messages } = req.body;
    
    try {
        const chat = await dbService.getChat(chatId);
        if (!chat){
            console.log("Chat not found");
        }
        const agent = await dbService.getAgent(chat!.agentId);
        if (!agent){
            console.log("Agent not found");
        }
        // console.log("message: ", messages);
        // console.log("chat: ", chat);
        // Get the latest user message
        const userMessage = messages[messages.length - 1];
        
        // Search for relevant chunks if the agent has documents
        let context: DocumentContext[] = [];
         if (agent!.documents.length > 0) {
             const relevantChunks = await DocumentProcessor.searchRelevantChunks(
                 userMessage.content,
                 chat!.agentId
             );

             context = relevantChunks.map(chunk => ({
                 content: chunk.content,
                 source: dbService.getDocument(chunk.documentId)!.then(doc => doc!.filename).catch(() => "Unknown")
             }));
         }

        // Create system message with guidance and context
        const systemMessage = {
            role: "system",
            content: `You are an AI assistant. You have the ability to create code and mermaid diagram. You also have the ability to use tools. If the last message is by tool, then first print the "content" and thenjust explain what it did.
            Guidance:
             ${agent!.guidance || "Be helpful."}
            Context:
             ${
                 context.length > 0 
                     ? `Context from relevant documents:\n${context.map(c => 
                         `Source: ${c.source}\nContent: ${c.content}\n`).join('\n')}\n
                       When using information from the context, cite the source.`
                     : ''
             }`
        };
        const simplifiedMessages = messages.map(({ role, content }: any) => ({ role, content }));
        // Combine system message with user messages
        const fullMessages = [systemMessage, ...simplifiedMessages];
        
        // console.log("fullMessages: ", fullMessages);
        // Store user message
        await dbService.addMessage(chatId, messages[messages.length - 1]);

        // const response = await axios.post(
        //     GROQ_API_URL,
        //     {
        //         model: "llama-3.1-8b-instant",
        //         messages: fullMessages,
        //         temperature: 0.7
        //     },
        //     { headers: { Authorization: `Bearer ${GROQ_API_KEY}` } }
        // );

        const mcpTools = await mcpClient.listTools();
        const groqTools = mapToolstoGroqTools(mcpTools);
        // console.log(groqTools);

        const testres = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: fullMessages,
            tools: groqTools,
            temperature: 0.7
        });
        const toolCallResponse = await applyToolCalls(testres);
        
        if (toolCallResponse.length === 0){
            // console.log(testres.choices[0].message);
            // Store assistant message
            const assistantMessage = testres.choices[0].message;
            await dbService.addMessage(chatId, assistantMessage as any);

            // console.log(assistantMessage);
            // console.log("context: ", context);
            res.json({
                ...testres,
                sources: context.map(c => c.source)
            });
        }
        else{
            // console.log(toolCallResponse);
            for (const response of toolCallResponse){
                fullMessages.push(response);
            }

            // console.log(fullMessages[fullMessages.length - 1]);

            const secondres = await groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: fullMessages,
                temperature: 0.7
            });

            // Store assistant message
            const assistantMessage = secondres.choices[0].message;
            await dbService.addMessage(chatId, assistantMessage as any);

            // console.log(assistantMessage);

            res.json({
                ...secondres,
                sources: context.map(c => c.source)
            });
        }
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to process request" });
    }
});

app.get("/agents/:agentId", async (req, res) => {
    try {
        const agent = await dbService.getAgent(req.params.agentId);
        res.json(agent);
    } catch (error) {
        console.error("Error fetching agent:", error);
        res.status(500).json({ error: "Failed to fetch agent" });
    }
});

app.post("/chats", async (req, res) => {
    try {
        const { agentId, name } = req.body;
        const chat = await dbService.createChat(agentId, name);
        res.json(chat);
    } catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).json({ error: "Failed to create chat" });
    }
});

app.get("/chats/:chatId/messages", async (req, res) => {
    try {
        const messages = await dbService.getChatMessages(req.params.chatId);
        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

app.patch("/chats/:chatId", async (req, res) => {
    try {
        const { chatId } = req.params;
        const { name } = req.body;
        const updatedChat = await dbService.renameChat(chatId, name);
        res.json(updatedChat);
    } catch (error) {
        console.error("Error renaming chat:", error);
        res.status(500).json({ error: "Failed to rename chat" });
    }
});

app.delete("/chats/:chatId", async (req, res) => {
    try {
        const { chatId } = req.params;
        await dbService.deleteChat(chatId);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting chat:", error);
        res.status(500).json({ error: "Failed to delete chat" });
    }
});

app.post("/agents/:agentId/documents", async (req, res) => {
    try {
        const { agentId, filename } = req.body;
        const document = await dbService.addDocument(agentId, filename);
        res.json(document);
    } catch (error) {
        console.error("Error adding document:", error);
        res.status(500).json({ error: "Failed to add document" });
    }
});

app.get("/agents/:agentId/documents", async (req, res) => {
    try {
        const { agentId } = req.params;
        const document = await dbService.getAgentDocuments(agentId);
        res.json(document);
    } catch (error) {
        console.error("Error adding document:", error);
        res.status(500).json({ error: "Failed to add document" });
    }
});

app.get("/agents/:agentId/guidance", async (req, res) => {
    try {
        const agent = await dbService.getAgent(req.params.agentId);
        res.json(agent!.guidance);
    } catch (error) {
        console.error("Error fetching guidance:", error);
        res.status(500).json({ error: "Failed to fetch guidance" });
    }
});

const upload = multer({ dest: "uploads/" }); // This will save files in 'uploads/' folder

// Handle file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        // if (!req.file) {
        //     return res.status(400).json({ error: "No file uploaded" });
        // }

        const docId = req.body.doc;
        const fileBuffer = fs.readFileSync(req.file!.path);
        const agentId = req.body.agentId;
        const pdfData = await pdfParse(fileBuffer);

        res.json({ message: "PDF uploaded successfully", content: pdfData.text });
        await DocumentProcessor.processDocument(docId, pdfData.text, agentId);
        
        
    } catch (error) {
        res.status(500).json({ error: "Failed to upload file" });
    }
});

export default app;
