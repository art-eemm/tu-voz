import { Page } from "playwright";

export async function extractInteractiveElements(page: Page) {
  await page.waitForLoadState("domcontentloaded").catch(() => {});

  const elements = await page.evaluate(() => {
    function classifyElement(el) {
      const text = (
        (el.label || "") +
        (el.placeholder || "") +
        (el.name || "") +
        (el.domId || "")
      ).toLowerCase();

      if (el.tag === "input" && el.type === "search") return "search";

      if (text.includes("search") || text.includes("buscar")) return "search";

      if (el.tag === "button" || el.type === "button") return "button";

      if (el.tag === "a") return "link";

      if (el.tag === "input") return "input";

      return "generic";
    }

    function visible(el: Element) {
      const rect = el.getBoundingClientRect();

      return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0
      );
    }

    function clean(text: string | null) {
      if (!text) return "";
      return text.trim().replace(/\s+/g, " ");
    }

    const result: any[] = [];
    let idCounter = 1;

    const interactive = document.querySelectorAll(
      "input, textarea, button, select, [role='button'], [onclick], a[href]",
    );

    interactive.forEach((el: any) => {
      if (!visible(el)) return;

      const rect = el.getBoundingClientRect();

      if (rect.width > window.innerWidth * 0.8) return;
      if (rect.width < 20 || rect.height < 20) return;

      const placeholder = el.placeholder || "";
      const name = el.name || "";
      const id = el.id || "";
      const type = el.type || "";

      const label =
        placeholder ||
        el.innerText ||
        el.getAttribute("aria-label") ||
        name ||
        "";

      const aria = el.getAttribute("aria-label") || "";

      if (!el.innerText && !aria && !placeholder) return;

      const semanticType = classifyElement({
        tag: el.tagName.toLowerCase(),
        type,
        label,
        placeholder,
        name,
        domId: id,
      });

      result.push({
        id: `el_${idCounter++}`,
        tag: el.tagName.toLowerCase(),
        type,
        semanticType,
        label: clean(label),
        placeholder: clean(placeholder),
        name,
        domId: id,
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });
    });

    return result;
  });

  return elements;
}
