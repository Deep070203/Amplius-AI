import { PrismaClient } from '@prisma/client';
import { OpenAIEmbeddings } from '@langchain/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { similarity } from 'ml-distance';
import  { dbService }  from './db';

const prisma = new PrismaClient();
const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
});

export class DocumentProcessor {
    static async processDocument(file: Buffer, filename: string, agentId: string) {
        try {
            // Extract text content from the file
            const content = file.toString('utf-8');

            // Create document record
            const document = await dbService.getAgentDocuments(agentId);
            if (!document) {
                throw new Error('Failed to create document');
            }

            // Split content into chunks
            const splitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200,
            });
            const chunks = await splitter.createDocuments([content]);

            // Process each chunk
            // for (const chunk of chunks) {
            //     const embedding = await embeddings.embedQuery(chunk.pageContent);
                
            //     await prisma.documentChunk.create({
            //         data: {
            //             content: chunk.pageContent,
            //             embedding: JSON.stringify(embedding),
            //             documentId: document.id,
            //             agentId,
            //         }
            //     });
            // }

            return document;
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
