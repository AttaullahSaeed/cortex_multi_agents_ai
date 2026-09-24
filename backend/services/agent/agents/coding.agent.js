import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import { getMemory } from "../config/memory.js";

// Multi-file code generation support ke saath updated System Prompt
const SYSTEM_PROMPT = new SystemMessage(`
You are CortexAI's coding agent, an expert full-stack software engineer AI assistant.

Rules:

- Always respond with clean, production-ready, functional code.
- FOR MULTI-FILE CODE GENERATION:
  * Structure each file clearly with a file path line before every code block (e.g. **File: src/App.jsx**).
  * Use fenced code blocks with proper language tags (e.g. \`\`\`jsx, \`\`\`javascript, \`\`\`python).
  * Never mix multiple files into a single code block.
  * Provide a brief setup instruction (e.g. terminal commands for package installation) before listing the files.
- Explain your approach briefly in plain text before the code, not inside comments.
- Keep explanations short and focused; do not repeat code back in prose.
- For bug fixes, point out what was wrong before showing the corrected code.
- Prefer modern, idiomatic syntax for the requested framework/language.
- Never generate large walls of unbroken text; break steps into short paragraphs or numbered lists.
- Do not fabricate library names, APIs, or functions that do not exist.
`);

// Intent guidance object
const INTENT_GUIDANCE = {
  CODE_GENERATION:
    "The user wants code or a full application built. If multiple files are needed (e.g., frontend/backend, component structures), generate complete, runnable code for each file separately with clear filenames.",
  CODE_REVIEW:
    "The user wants their existing code reviewed. Point out issues (bugs, style, performance, security) in a short list, then show corrected code only where needed.",
  CODE_EXPLANATION:
    "The user wants code explained. Walk through what it does in plain language; reference code snippets only when necessary.",
  DEBUGGING:
    "The user has a bug. Identify the root cause in 1-2 sentences, then provide the fixed file(s) with explanation.",
  OPTIMIZATION:
    "The user wants code optimized. Explain the bottleneck first, then show the optimized file/code block.",
  CONVERSION:
    "The user wants code converted. Preserve behavior, handle dependencies, and output complete converted files.",
  DOCUMENTATION:
    "The user wants documentation (README.md, comments, or docstrings). Follow standard repo/project structure.",
};

// Intent classifier function
const classifyIntent = async (intentLlm, prompt) => {
  try {
    const intentRes = await intentLlm.invoke(`
You are an intent classifier.

Return ONLY one of these values:
CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

User Request:
${prompt}
    `);

    const intent = intentRes.content?.trim().toUpperCase();
    return INTENT_GUIDANCE[intent] ? intent : "CODE_GENERATION";
  } catch (err) {
    console.error("Intent classification failed:", err);
    return "CODE_GENERATION";
  }
};

export const codingAgent = async (state) => {
  const { conversationId, prompt, searchResults } = state;

  // Search Context check
  const searchContext = searchResults
    ? `Reference Material:\n\n${JSON.stringify(searchResults)}`
    : "";

  // Parallel fetches for performance
  const [llm, intentLlm, rawHistory] = await Promise.all([
    getModel("coding"),
    getModel("intent"),
    conversationId ? getMemory(conversationId) : Promise.resolve([]),
  ]);

  const intent = await classifyIntent(intentLlm, prompt);

  const history = Array.isArray(rawHistory) ? rawHistory : [];

  // Format historical messages safely
  const formattedHistory = history
    .map((msg) => {
      if (!msg || typeof msg !== "object") return null;

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
    .filter(Boolean);

  // Construct structured user prompt
  const finalUserPrompt = [
    searchContext,
    `Detected intent: ${intent}\n${INTENT_GUIDANCE[intent]}`,
    `User Request: ${prompt}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const messages = [
    SYSTEM_PROMPT,
    ...formattedHistory,
    new HumanMessage(finalUserPrompt),
  ];

  const response = await llm.invoke(messages);

  return {
    ...state,
    intent,
    aiResponse: response.content,
    artifacts: [],
  };
};
