import { getModel } from "../config/llmModels.js";

export const pdfAgent = async (state) => {
  const intentLlm = await getModel("intent");
  const llm = await getModel("pdf");

  // Step 1: Classify User Intent
  const intentRes = await intentLlm.invoke(`
    You are an intent classifier for PDF requests.

Return ONLY one of these values.

PDF_GENERATION
PDF_SUMMARIZATION
PDF_EXTRACTION
PDF_QNA
PDF_ANALYSIS

User Request: ${state.prompt}
  `);

  const intent = intentRes.content.trim();

  // Step 2: Handle PDF Generation (Returns structured PDF layout schema / HTML content to render PDF)
  if (intent === "PDF_GENERATION") {
    const prompt = `
You are CortexAI PDF Agent.

Generate a professionally styled single-page or multi-page document structure for a PDF based on the user request.

Rules:
- High contrast typography
- Beautiful spacing and margins
- Professional colors and structure
- Clean tables/lists if required

Return ONLY valid JSON.

Schema:
{
  "files": [
    {
      "name": "document.html",
      "content": "..."
    },
    {
      "name": "document.css",
      "content": "..."
    }
  ]
}

Strict Output Rules:
- Output must start with {
- Output must end with }
- No markdown formatting (no \`\`\`)
- No explanation or extra text

User Request:
${state.prompt}
`;

    const res = await llm.invoke(prompt);

    let data;
    try {
      data = JSON.parse(res.content);
    } catch (error) {
      // Fallback cleanup if model adds backticks
      const cleanJson = res.content.replace(/```json|```/g, "").trim();
      data = JSON.parse(cleanJson);
    }

    return {
      ...state,
      aiResponse: "PDF Generated Successfully",
      artifacts: [
        {
          id: Date.now(),
          type: "pdf",
          files: data?.files || [],
          title: state.prompt,
        },
      ],
    };
  }

  // Step 3: Handle PDF Analysis / Summarization / QnA (Markdown Output)
  const res = await llm.invoke(`
  The user's request is: ${state.prompt}

  Intent: ${intent}

  Return Markdown only.

  Never generate project files.

  Use headings like:

  # Document Overview

  ## Summary / Key Takeaways

  ## Detailed Analysis

  ## Extracted Insights

  ## Next Steps / Recommendations

  User Request:
  ${state.prompt}
  `);

  const data = res.content;

  return {
    ...state,
    aiResponse: data,
    artifacts: [],
  };
};
