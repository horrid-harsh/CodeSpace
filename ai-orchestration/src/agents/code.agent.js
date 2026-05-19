import "dotenv/config";
import { ChatMistralAI } from "@langchain/mistralai";
import { createAgent } from "langchain";
import { updateFiles, listFiles, readFiles, deleteFiles } from "./tools.js";

const model = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: process.env.MISTRAL_API_KEY,
    temperature: 0.7
});

const agent = createAgent({
    model,
    tools: [listFiles, readFiles, updateFiles, deleteFiles],
});

export default agent;