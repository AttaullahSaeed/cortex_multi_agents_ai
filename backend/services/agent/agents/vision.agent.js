import { getModel } from "../config/llmModels.js";

export const visionAgent = async (state) => {
  const intentLlm = await getModel("intent");
  const llm = await getModel("chat");

  const intentRes = await intentLlm.invoke(`
    You are an intent classifier for image requests.
    Return ONLY one of these values: IMAGE_GENERATION, IMAGE_EXPLANATION
    User Request: ${state.prompt}
  `);

  const intent = intentRes.content.trim();

  if (intent === "IMAGE_GENERATION") {
    // Clean prompt for image generation
    const enhancedPrompt = state.prompt.replace(/[^a-zA-Z0-9 ]/g, "");

    // Reliable image generation URL
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      enhancedPrompt,
    )}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;

    return {
      ...state,
      aiResponse: "Here is your generated image:",
      images: [imageUrl],
      artifacts: [],
    };
  }

  // Handle General Text / Explanation (Strict Rule: No Markdown Images)
  const res = await llm.invoke(`
    User Request: ${state.prompt}
    
    Rules:
    - Return Markdown text only.
    - NEVER include any images, HTML img tags, or Markdown image syntax like ![text](url).
  `);

  return {
    ...state,
    aiResponse: res.content,
    images: state.images || [],
    artifacts: [],
  };
};
