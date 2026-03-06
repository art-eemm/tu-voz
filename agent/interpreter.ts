export type Command =
  | { type: "navigate"; url: string }
  | { type: "click"; text: string }
  | { type: "type"; text: string };

export function interpretCommand(input: string): Command | null {
  const lower = input.toLowerCase();

  if (lower.includes("wikipedia")) {
    return {
      type: "navigate",
      url: "https://wikipedia.org",
    };
  }

  if (lower.startsWith("haz clic en")) {
    const text = input.replace(/haz clic en/i, "").trim();

    return {
      type: "click",
      text,
    };
  }

  if (lower.startsWith("escribe")) {
    const text = input.replace(/escribe/i, "").trim();

    return {
      type: "type",
      text,
    };
  }

  return null;
}
