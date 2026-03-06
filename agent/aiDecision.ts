import { groq } from "./groqClient";
import { TOOLS_DESCRIPTION } from "./tools";
import { formatContext } from "./contextFormatter";
import { getNavigationState } from "./navigationMemory";

export async function decideAction(command: string, context: any) {
  const lower = command.toLowerCase();

  if (
    lower.includes("baja") ||
    lower.includes("scroll") ||
    lower.includes("down")
  ) {
    return { action: "scroll" };
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

  const prompt = `
${TOOLS_DESCRIPTION}

User command:
${command}

Navigation state:
${JSON.stringify(memory, null, 2)}

Page context:
${JSON.stringify(formatted, null, 2)}

Available elements:
${JSON.stringify(context.elements.slice(0, 15), null, 2)}

Respond ONLY with JSON.
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
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
