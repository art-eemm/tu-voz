import { Page } from "playwright";

export async function getVisibleLinks(page: Page) {
  return page.evaluate(() => {
    const links = Array.from(document.querySelectorAll("a"));

    return links
      .map((el) => el.textContent?.trim())
      .filter(Boolean)
      .filter((text) => text!.length > 2)
      .slice(0, 40);
  });
}
