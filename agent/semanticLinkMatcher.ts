import { groq } from "./groqClient";

export async function semanticMatchLink(command: string, links: string[]) {
  if (!links.length) return null;

  const prompt = `
User command:
${command}

Choose the link that best matches the user intent.

Links:
${links.map((l, i) => `${i + 1}. ${l}`).join("\n")}

Return ONLY the number.

Example:
3
`;

  const completion = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [{ role: "user", content: prompt }],
  });

  const text = completion.choices[0]?.message?.content?.trim();

  const index = Number(text);

  if (isNaN(index)) return null;

  return links[index - 1] || null;
}
