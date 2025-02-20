/*
  Warnings:

  - You are about to drop the column `agentId` on the `DocumentChunk` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "DocumentChunk" DROP CONSTRAINT "DocumentChunk_agentId_fkey";

-- AlterTable
ALTER TABLE "DocumentChunk" DROP COLUMN "agentId";
