import { groq } from "./groqClient";
import { TOOLS_DESCRIPTION } from "./tools";
import { formatContext } from "./contextFormatter";
import { getNavigationState } from "./navigationMemory";
import { getMemory } from "./taskMemory";
import { getAgentState } from "./agentState";
import { getTrackedElements } from "@/browser/elementTracker";
import { getConversation } from "./conversationMemory";

export async function decideAction(
  command: string,
  context: any,
  screenshot?: string,
) {
  const lower = command.toLowerCase();

  const state = getAgentState();

  const tracked = getTrackedElements();

  if (
    lower.includes("qué dice") ||
    lower.includes("que dice") ||
    lower.includes("lee esta página") ||
    lower.includes("lee la página") ||
    lower.includes("resume esta página") ||
    lower.includes("explica esta página") ||
    lower.includes("lee") ||
    lower.includes("resume") ||
    lower.includes("explica")
  ) {
    return { action: "read_page" };
  }

  if (
    lower.includes("regresa") ||
    lower.includes("volver") ||
    lower.includes("ve al anterior") ||
    lower.includes("atrás") ||
    lower.includes("retrocede") ||
    lower.includes("back")
  ) {
    return { action: "go_back" };
  }

  if (
    lower.includes("baja") ||
    lower.includes("scroll") ||
    lower.includes("down")
  ) {
    return { action: "scroll", direction: "down" };
  }

  if (
    lower.includes("sube") ||
    lower.includes("arriba") ||
    lower.includes("scroll up") ||
    lower.includes("up")
  ) {
    return { action: "scroll", direction: "up" };
  }

  if (
    lower.startsWith("ve a") ||
    lower.startsWith("ir a") ||
    lower.startsWith("go to")
  ) {
    const target = lower
      .replace("ve a", "")
      .replace("ir a", "")
      .replace("go to", "")
      .trim();

    return {
      action: "click",
      targetText: target,
    };
  }

  const formatted = formatContext(context);

  const memory = getNavigationState();

  const history = getConversation().slice(-6);

  const prompt = `
${TOOLS_DESCRIPTION}

Conversation history:
${JSON.stringify(history, null, 2)}

User command:
${command}

Agent state:
${JSON.stringify(state, null, 2)}

Navigation state:
${JSON.stringify(memory, null, 2)}

Page context:
${JSON.stringify(formatted, null, 2)}

Visible elements (number corresponds to overlay label):
${context.elements
  .slice(0, 15)
  .map((el, i) => `[${i + 1}] ${el.tag} ${el.label || el.placeholder || ""}`)
  .join("\n")}

Tracked elements from previous steps:
${JSON.stringify(tracked, null, 2)}

You may reference elements by number.

Example:

{
  "action": "click_index",
  "index": 2
}

When using the "type" action you MUST include a target element id.

Example:
{
 "action": "type",
 "target": "el_13",
 "text": "youtube"
}

Respond ONLY with JSON.
`;

  const completion = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          ...(screenshot
            ? [
                {
                  type: "image_url" as const,
                  image_url: {
                    url: `data:image/jpeg;base64,${screenshot}`,
                  },
                },
              ]
            : []),
        ],
      },
    ],
  });

  const content = completion.choices[0].message.content || "";

  console.log("RAW MODEL RESPONSE:", content);

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.log("No JSON found in model response");
      return { action: "none" };
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // normalizar acción
    parsed.action = parsed.action?.toLowerCase();

    console.log("AI DECISION:", parsed);

    return parsed;
  } catch (error) {
    console.log("JSON PARSE ERROR:", error);

    return { action: "none" };
  }
}
