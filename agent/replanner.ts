import { groq } from "./groqClient";
import { getAgentState } from "./agentState";

export async function replan(command: string, context: any, error: string) {
  const state = getAgentState();

  const prompt = `
    A previous browser action failed.

    User goal:
    ${command}

    Error:
    ${error}

    Page context:
    ${JSON.stringify(context, null, 2)}

    Conversation state:
    ${JSON.stringify(state, null, 2)}

    Generate ONE corrective step.

    Return JSON:
    {
        "action": "click",
        "target": "el_5"
    }
    `;

  const completion = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [{ role: "user", content: prompt }],
  });

  const content = completion.choices[0].message.content || "";

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]);
  } catch {
    return null;
  }
}
