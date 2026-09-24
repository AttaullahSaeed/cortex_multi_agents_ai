import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/memory.js";

export const agent = async (req, res) => {
  try {
    const { prompt, conversationId, agent } = req.body;

    if (!prompt || !conversationId) {
      return res
        .status(400)
        .json({ message: "prompt and conversationId are required" });
    }

    await addMessage(conversationId, "user", prompt);

    // Save to Database Service asynchronously
    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role: "user",
      content: prompt,
    });

    // 2. Invoke Graph Execution
    const result = await graph.invoke({
      prompt,
      conversationId,
      agent,
    });
    const resp = result.aiResponse;
    const images = result.images || [];

    // 3. Save Assistant Response with correct parameters
    await addMessage(conversationId, "assistant", resp);

    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role: "assistant",
      content: resp,
      images,
    });

    return res.status(200).json({
      answer: resp,
      images: images,
    });
  } catch (error) {
    console.error("Agent Handler Error:", error);
    return res
      .status(500)
      .json({ message: `agent error: ${error.message || error}` });
  }
};
