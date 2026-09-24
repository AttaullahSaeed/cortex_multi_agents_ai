import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenRouter } from "@langchain/openrouter";

import dotenv from "dotenv";

dotenv.config();
const grok = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: process.env.GROQ_API_KEY,
});

const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
});
const openRouter = new ChatOpenRouter({
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens: 2500,
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const getModel = async (agent) => {
  switch (agent) {
    case "chat":
      return grok;
    case "search":
      return grok;
    case "coding":
      return openRouter;
    default:
      return grok;
  }
};
