import { PrismaClient } from '@prisma/client';
import { OpenAIEmbeddings } from '@langchain/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { similarity } from 'ml-distance';
import  { dbService }  from './db';
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";

const prisma = new PrismaClient();
const embeddings = new HuggingFaceTransformersEmbeddings({
    model: "Xenova/all-MiniLM-L6-v2",
  });

export class DocumentProcessor {
    static async processDocument(documentId: string, content: string, agentId: string) {
        try {

            // Split content into chunks
            const splitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200,
            });
            const chunks = await splitter.createDocuments([content]);

            // Process each chunk
            for (const chunk of chunks) {
                const embedding = await embeddings.embedQuery(chunk.pageContent);
                
                await prisma.documentChunk.create({
                    data: {
                        content: chunk.pageContent,
                        embedding: JSON.stringify(embedding),
                        documentId: documentId,
                        agentId,
                    }
                });
            }

            return documentId;
        } catch (error) {
            console.error('Error processing document:', error);
            throw error;
        }
    }

    static async searchRelevantChunks(query: string, agentId: string, limit = 3) {
        const queryEmbedding = await embeddings.embedQuery(query);

        const chunks = await prisma.documentChunk.findMany({
            where: { agentId },
            include: {
                document: true,
            }
        });

        const chunksWithSimilarity = chunks.map((chunk: any) => ({
            ...chunk,
            similarity: similarity.cosine(
                queryEmbedding,
                JSON.parse(chunk.embedding)
            )
        }));

        return chunksWithSimilarity
            .sort((a: any, b: any) => b.similarity - a.similarity)
            .slice(0, limit);
    }
}
