import { groq } from "./groqClient";
import { TOOLS_DESCRIPTION } from "./tools";
import { formatContext } from "./contextFormatter";

export async function decideAction(command: string, context: any) {
  const formatted = formatContext(context);

  const prompt = `
${TOOLS_DESCRIPTION}

User command:
${command}

Page context:
${JSON.stringify(formatted, null, 2)}

Respond only with JSON.
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

  const content = completion.choices[0].message.content;

  try {
    return JSON.parse(content || "{}");
  } catch {
    return { action: "none" };
  }
}
