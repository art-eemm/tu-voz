import { groq } from "./groqClient";

export async function readPageContent(command: string, content: any) {
  const prompt = `
You are an accessibility assistant.

Explain the webpage briefly in Spanish.

Structure your response like this:

Título:
Resumen:
Secciones principales:

Title:
${content.title}

Headings:
${content.headings.join("\n")}

Paragraphs:
${content.paragraphs.join("\n")}

User request:
${command}

Rules:
- Maximum 4 sentences.
- Simple language.
- Suitable for voice narration.
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

  return completion.choices[0].message.content;
}
