import { groq } from "./groqClient";

export async function readPageContent(command: string, content: any) {
  const prompt = `
You are assisting a visually impaired user.

User request:
${command}

Page title:
${content.title}

Headings:
${content.headings.join("\n")}

Paragraphs:
${content.paragraphs.join("\n")}

Answer the user request clearly.
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

  return completion.choices[0].message.content;
}
