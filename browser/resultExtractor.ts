import { Page } from "playwright";
import { classifyLink } from "./linkClassifier";

export async function extractResults(page: Page) {
  const rawResults = await page.evaluate(() => {
    function visible(el: Element) {
      const rect = el.getBoundingClientRect();

      return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.top < window.innerHeight &&
        rect.bottom > 0
      );
    }

    function clean(text: string | null) {
      if (!text) return "";

      return text.replace(/\s+/g, " ").trim().slice(0, 120);
    }

    const links = Array.from(document.querySelectorAll("a"));

    const visibleLinks = links
      .filter((el) => {
        if (!visible(el)) return false;

        const href = (el as HTMLAnchorElement).href;

        if (!href) return false;

        if (
          href.startsWith("javascript:") ||
          href.startsWith("about:") ||
          href.startsWith("file:") ||
          href.startsWith("#")
        ) {
          return false;
        }

        const text = clean(el.textContent);

        if (!text || text.length < 2) return false;

        return true;
      })
      .slice(0, 25)
      .map((el, index) => {
        const rect = el.getBoundingClientRect();

        return {
          id: `result_${index + 1}`,
          text: clean(el.textContent),
          href: (el as HTMLAnchorElement).href,
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      });

    return visibleLinks;
  });

  // clasificación fuera del evaluate
  const classifiedResults = rawResults.map((r) => ({
    ...r,
    type: classifyLink(r.text, r.href),
  }));

  return classifiedResults;
}
