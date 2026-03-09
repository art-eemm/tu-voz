import { groq } from "./groqClient";
import { getAgentState } from "./agentState";

export async function createPlan(command: string, context: any) {
  const state = getAgentState();

  const prompt = `
    You control a web browser

    Create a short plan to accomplish the user goal.

    If the user mentions a link text like "Discusión", "Editar", "History", use:
    {
      "action": "click",
      "targetText": "Discusión"
    }

    User command:
    ${command}

    Page context:
    ${JSON.stringify(context, null, 2)}

    Conversation state:
    ${JSON.stringify(state, null, 2)}

    Return JSON:
    {
        "steps": [
            { "action": "click", "target": "el_5" },
            { "action": "type", "target": "el_13", "text": "hello" },
        ]
    }
    `;

  const completion = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = completion.choices[0].message.content || "";

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) return { steps: [] };

    return JSON.parse(jsonMatch[0]);
  } catch {
    return { steps: [] };
  }
}
