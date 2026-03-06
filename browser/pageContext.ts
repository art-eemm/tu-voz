import { Page } from "playwright";

export async function buildPageContext(page: Page) {
  const context = await page.evaluate(() => {
    function visible(el: Element) {
      const rect = el.getBoundingClientRect();

      return rect.width > 0 && rect.height > 0;
    }

    const inputs = Array.from(document.querySelectorAll("input"))
      .filter(visible)
      .map((el, index) => ({
        id: `input-${index}`,
        placeholder: el.getAttribute("placeholder"),
        name: el.getAttribute("name"),
      }));

    const buttons = Array.from(document.querySelectorAll("button"))
      .filter(visible)
      .map((el, index) => ({
        id: `button-${index}`,
        text: el.textContent?.trim(),
      }));

    const links = Array.from(document.querySelectorAll("a"))
      .filter(visible)
      .slice(0, 40)
      .map((el, index) => ({
        id: `link-${index}`,
        text: el.textContent?.trim(),
        href: el.getAttribute("href"),
      }));

    return {
      url: window.location.href,
      title: document.title,
      inputs,
      buttons,
      links,
    };
  });

  return context;
}
