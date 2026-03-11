import { Page } from "playwright";
import { generateStableId } from "@/agent/stableElementId";
import { classifyElement } from "@/agent/semanticClassifier";

export async function extractInteractiveElements(page: Page) {
  await page.waitForLoadState("domcontentloaded").catch(() => {});

  const rawElements = await page.evaluate(() => {
    function visible(el) {
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

    function clean(text) {
      if (!text) return "";
      return text.trim().replace(/\s+/g, " ");
    }

    const result = [];

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

      result.push({
        tag: el.tagName.toLowerCase(),
        type,
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

  const elements = rawElements.map((el) => {
    const semanticType = classifyElement(el);

    const stableId = generateStableId(el);

    return {
      ...el,
      id: stableId,
      semanticType,
    };
  });

  return elements;
}
