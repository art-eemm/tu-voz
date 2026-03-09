import { groq } from "./groqClient";

export async function reflect(command: string, context: any) {
  const prompt = `
    User goal:
    ${command}

    Page context:
    ${JSON.stringify(context, null, 2)}

    Did the browser accomplish the user goal?

    Return JSON:
    {
        "success": true
    }
    
    or

    {
        "success": false,
        "reason": "..."
    }
    `;

  const completion = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [{ role: "user", content: prompt }],
  });

  const content = completion.choices[0].message.content || "";

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) return { success: true };

    return JSON.parse(jsonMatch[0]);
  } catch {
    return { success: true };
  }
}
