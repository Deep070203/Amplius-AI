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
exports.DocumentProcessor = void 0;
const client_1 = require("@prisma/client");
const text_splitter_1 = require("langchain/text_splitter");
const ml_distance_1 = require("ml-distance");
const huggingface_transformers_1 = require("@langchain/community/embeddings/huggingface_transformers");
const prisma = new client_1.PrismaClient();
const embeddings = new huggingface_transformers_1.HuggingFaceTransformersEmbeddings({
    model: "Xenova/all-MiniLM-L6-v2",
});
class DocumentProcessor {
    static processDocument(documentId, content, agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Split content into chunks
                const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
                    chunkSize: 1000,
                    chunkOverlap: 200,
                });
                const chunks = yield splitter.createDocuments([content]);
                // Process each chunk
                for (const chunk of chunks) {
                    const embedding = yield embeddings.embedQuery(chunk.pageContent);
                    yield prisma.documentChunk.create({
                        data: {
                            content: chunk.pageContent,
                            embedding: JSON.stringify(embedding),
                            documentId: documentId,
                            agentId,
                        }
                    });
                }
                return documentId;
            }
            catch (error) {
                console.error('Error processing document:', error);
                throw error;
            }
        });
    }
    static searchRelevantChunks(query_1, agentId_1) {
        return __awaiter(this, arguments, void 0, function* (query, agentId, limit = 3) {
            const queryEmbedding = yield embeddings.embedQuery(query);
            const chunks = yield prisma.documentChunk.findMany({
                where: { agentId },
                include: {
                    document: true,
                }
            });
            const chunksWithSimilarity = chunks.map((chunk) => (Object.assign(Object.assign({}, chunk), { similarity: ml_distance_1.similarity.cosine(queryEmbedding, JSON.parse(chunk.embedding)) })));
            return chunksWithSimilarity
                .sort((a, b) => b.similarity - a.similarity)
                .slice(0, limit);
        });
    }
}
exports.DocumentProcessor = DocumentProcessor;
