import { ChatVertexAI } from "@langchain/google-vertexai";
import { configDotenv } from "dotenv";

configDotenv({ path: "../../../.env" });

const llmFalse = new ChatVertexAI({
    model: "gemini-2.5-flash",
    temperature: 0,
    maxRetries: 2,
});

const llmPro = new ChatVertexAI({
    model: "gemini-2.5-flash",
    temperature: 0,
    maxRetries: 2,
});

export { llmFalse, llmPro };