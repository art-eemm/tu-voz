type Intent =
  | { type: "search"; query: string }
  | { type: "go_back" }
  | { type: "scroll"; direction: "up" | "down" }
  | { type: "read_page" }
  | { type: "navigate_text"; target: string }
  | { type: "new_tab" }
  | { type: "close_tab" }
  | { type: "switch_tab"; index: number }
  | { type: "none" };

export function detectIntent(command: string): Intent {
  const lower = command.toLowerCase().trim();

  // búsqueda
  if (
    lower.startsWith("busca ") ||
    lower.startsWith("buscar ") ||
    lower.startsWith("search ")
  ) {
    const query = lower
      .replace("busca", "")
      .replace("buscar", "")
      .replace("search", "")
      .trim();

    return { type: "search", query };
  }

  // navegación atrás
  if (
    lower.includes("regresa") ||
    lower.includes("volver") ||
    lower.includes("atrás") ||
    lower.includes("anterior")
  ) {
    return { type: "go_back" };
  }

  // scroll
  if (lower.includes("baja") || lower.includes("scroll down")) {
    return { type: "scroll", direction: "down" };
  }

  if (lower.includes("sube") || lower.includes("scroll up")) {
    return { type: "scroll", direction: "up" };
  }

  // lectura
  if (
    lower.includes("qué dice") ||
    lower.includes("que dice") ||
    lower.includes("lee esta página") ||
    lower.includes("resume")
  ) {
    return { type: "read_page" };
  }

  // navegación por texto de enlace
  if (
    lower.startsWith("ve a ") ||
    lower.startsWith("ir a ") ||
    lower.startsWith("abre ")
  ) {
    const target = lower
      .replace("ve a", "")
      .replace("ir a", "")
      .replace("abre", "")
      .trim();

    if (target.length > 1) {
      return { type: "navigate_text", target };
    }
  }

  if (lower.includes("nueva pestaña") || lower.includes("abre pestaña")) {
    return { type: "new_tab" };
  }

  if (lower.includes("cierra pestaña")) {
    return { type: "close_tab" };
  }

  if (lower.includes("cambia a la pestaña")) {
    const num = parseInt(lower.replace(/\D/g, ""));
    return { type: "switch_tab", index: num };
  }

  return { type: "none" };
}
