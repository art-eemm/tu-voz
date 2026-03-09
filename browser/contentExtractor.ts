import { Page } from "playwright";

export async function extractReadableContent(page: Page) {
  const content = await page.evaluate(() => {
    function clean(text: string | null) {
      if (!text) return "";
      return text.replace(/\s+/g, " ").trim();
    }

    function getMainContainer(): Element {
      const main =
        document.querySelector("main") ||
        document.querySelector("article") ||
        document.querySelector("[role='main']");

      return main || document.body;
    }

    const container = getMainContainer();

    const title = document.title;

    const headings = Array.from(container.querySelectorAll("h1, h2, h3"))
      .slice(0, 8)
      .map((el) => clean(el.textContent));

    const paragraphs = Array.from(container.querySelectorAll("p"))
      .map((el) => clean(el.textContent))
      .filter((p) => p.length > 60)
      .slice(0, 10);

    return {
      title,
      headings,
      paragraphs,
    };
  });

  return content;
}
