export function classifyElement(el) {
  const text = (
    (el.label || "") +
    (el.placeholder || "") +
    (el.name || "") +
    (el.domId || "")
  ).toLowerCase();

  if (el.tag === "input" && el.type === "search") {
    return "search";
  }

  if (text.includes("search") || text.includes("buscar")) {
    return "search";
  }

  if (el.tag === "button" || el.type === "button" || el.role === "button") {
    return "button";
  }

  if (el.tag === "a") {
    return "link";
  }

  if (el.tag === "input") {
    return "input";
  }

  return "generic";
}
