"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cosineSimilarity = cosineSimilarity;
function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a ** 2, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b ** 2, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}
