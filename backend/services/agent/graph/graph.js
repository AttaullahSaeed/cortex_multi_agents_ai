import { StateGraph, END, START } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { chatAgent } from "../agents/chat.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { visionAgent } from "../agents/vision.agent.js";

const workflow = new StateGraph(agentState);

// 1. Register Nodes
workflow.addNode("router", router);
workflow.addNode("chat", chatAgent);
workflow.addNode("search", searchAgent);
workflow.addNode("coding", codingAgent);
workflow.addNode("pdf", pdfAgent);
workflow.addNode("vision", visionAgent);

// 2. Set Entry Edge
workflow.addEdge(START, "router");

// 3. Define Conditional Routing based on State
workflow.addConditionalEdges(
  "router",
  (state) => {
    switch (state.agent) {
      case "chat":
        return "chat";
      case "search":
        return "search";
      case "coding":
        return "coding";
      case "pdf":
        return "pdf";

      case "vision":
        return "vision";
      default:
        return "chat"; // Default fallback route
    }
  },
  {
    chat: "chat",
    search: "search",
    coding: "coding",
    pdf: "pdf",
    vision: "vision",
  },
);

// 4. Connect Worker Nodes
// IMPORTANT FIX: search agent search karne ke baad chat agent ko pass karega
workflow.addEdge("search", "chat");

workflow.addEdge("chat", END);
workflow.addEdge("coding", END);
workflow.addEdge("pdf", END);
workflow.addEdge("vision", END);

// 5. Compile and Export the Graph
export const graph = workflow.compile();
