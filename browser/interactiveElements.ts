import { Page } from "playwright";

export async function extractInteractiveElements(page: Page) {
  await page.waitForLoadState("domcontentloaded").catch(() => {});

  const elements = await page.evaluate(() => {
    function visible(el: Element) {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }

    function clean(text: string | null) {
      if (!text) return "";
      return text.trim().replace(/\s+/g, " ");
    }

    const result: any[] = [];
    let idCounter = 1;

    const interactive = document.querySelectorAll(
      "input, textarea, button, a, [role='button']",
    );

    interactive.forEach((el: any) => {
      if (!visible(el)) return;

      const rect = el.getBoundingClientRect();

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

      result.push({
        id: `el_${idCounter++}`,
        tag: el.tagName.toLowerCase(),
        type,
        label: clean(label),
        placeholder: clean(placeholder),
        name,
        domId: id,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      });
    });

    return result;
  });

  return elements;
}
