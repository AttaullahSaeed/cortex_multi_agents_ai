import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import { getMemory } from "../config/memory.js";

// System prompt ko function ke bahar declare kiya hai taaki har request par re-creation na ho
const SYSTEM_PROMPT = new SystemMessage(`
You are CortexAI, an intelligent AI assistant.

Rules:

- For simple questions, greetings, and short queries, respond naturally in plain text.
- For technical, educational, coding, or detailed topics, use clean Markdown.

Formatting:

- Use # for titles and ## for sections.
- Leave a blank line after headings.
- Use bullet points for lists.
- Use numbered lists for steps.
- Use fenced code blocks with language tags for code.
- Keep paragraphs short and readable.
- Never write headings and content on the same line.
- Never generate large walls of text.
`);

export const chatAgent = async (state) => {
  const { conversationId, prompt, searchResults } = state;

  // Search Context check aur inject karein[cite: 3]
  const searchContext = searchResults
    ? `Web Search Results:\n\n${JSON.stringify(searchResults)}`
    : "";

  // LLM model aur Redis history ko parallel fetch karein performance optimize karne ke liye
  const [llm, rawHistory] = await Promise.all([
    getModel("chat"),
    conversationId ? getMemory(conversationId) : Promise.resolve([]),
  ]);

  const history = Array.isArray(rawHistory) ? rawHistory : [];

  // Defensive formatting: Undefined content ya missing fields ko safely handle karein
  const formattedHistory = history
    .map((msg) => {
      if (!msg || typeof msg !== "object") return null;

      // Fallback check agar content missing ho ya alternate key 'resp' me ho
      const textContent = msg.content || msg.resp || "";
      if (!textContent) return null;

      if (msg.role === "user") {
        return new HumanMessage(textContent);
      }
      if (msg.role === "assistant") {
        return new AIMessage(textContent);
      }
      return null;
    })
    .filter(Boolean); // Null items ko array se drop karein

  // Current user prompt ke saath search context append karein agar present ho
  const finalUserPrompt = searchContext
    ? `${searchContext}\n\nUser Question: ${prompt}`
    : prompt;

  // Final LangChain message sequence
  const messages = [
    SYSTEM_PROMPT,
    ...formattedHistory,
    new HumanMessage(finalUserPrompt),
  ];

  // AI Invoke Call
  const response = await llm.invoke(messages);

  return {
    ...state,
    aiResponse: response.content,
  };
};
