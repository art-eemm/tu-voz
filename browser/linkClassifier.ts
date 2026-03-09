export function classifyLink(text: string, href: string) {
  const t = text.toLowerCase();
  const h = href.toLowerCase();

  if (
    t.includes("discusión") ||
    t.includes("editar") ||
    t.includes("historial") ||
    t.includes("history") ||
    t.includes("edit")
  ) {
    return "navigation";
  }

  if (
    t.includes("donar") ||
    t.includes("donate") ||
    t.includes("login") ||
    t.includes("sign in") ||
    t.includes("account")
  ) {
    return "utility";
  }

  if (h.includes("/wiki/") || h.includes("/article/")) {
    return "content";
  }

  return "result";
}
