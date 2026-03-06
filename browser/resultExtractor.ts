import { Page } from "playwright";

export async function extractResults(page: Page) {
  const results = await page.evaluate(() => {
    function visible(el: Element) {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height < 0;
    }

    const links = Array.from(document.querySelectorAll("a"));

    const visibleLinks = links
      .filter(visible)
      .slice(0, 20)
      .map((el, index) => ({
        id: `result_${index + 1}`,
        text: el.textContent?.trim() || "",
        href: (el as HTMLAnchorElement).href,
      }));

    return visibleLinks;
  });

  return results;
}
