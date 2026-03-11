import { Page } from "playwright";

export async function extractLinks(page: Page) {
  return page.evaluate(() => {
    const links = Array.from(document.querySelectorAll("a"));

    return links
      .map((el) => ({
        text: el.textContent?.trim(),
        href: (el as HTMLAnchorElement).href,
      }))
      .filter((l) => l.text && l.text.length > 2)
      .slice(0, 50);
  });
}
