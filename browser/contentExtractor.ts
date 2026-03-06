import { Page } from "playwright";

export async function extractReadableContent(page: Page) {
  const content = await page.evaluate(() => {
    function clean(text: string) {
      return text.replace(/\s+/g, " ").trim();
    }

    const article =
      document.querySelector("article") ||
      document.querySelector("main") ||
      document.body;

    const headings = Array.from(article.querySelectorAll("h1, h2, h3"))
      .slice(0, 10)
      .map((el) => clean(el.textContent || ""));

    const paragraphs = Array.from(article.querySelectorAll("p"))
      .slice(0, 20)
      .map((el) => clean(el.textContent || ""));

    return {
      title: document.title,
      headings,
      paragraphs,
    };
  });

  return content;
}
