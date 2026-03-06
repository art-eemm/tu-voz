import { Page } from "playwright";

export async function extractInteractiveElements(page: Page) {
  const elements = await page.evaluate(() => {
    function visible(el: Element) {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }

    const buttons = Array.from(document.querySelectorAll("button"))
      .filter(visible)
      .map((el, index) => ({
        id: `button-${index}`,
        type: "button",
        text: el.textContent?.trim(),
      }));

    const links = Array.from(document.querySelectorAll("a"))
      .filter(visible)
      .slice(0, 30)
      .map((el, index) => ({
        id: `link-${index}`,
        type: "link",
        text: el.textContent?.trim(),
        href: el.getAttribute("href"),
      }));

    const inputs = Array.from(document.querySelectorAll("input"))
      .filter(visible)
      .map((el, index) => ({
        id: `input-${index}`,
        type: "input",
        placeholder: el.getAttribute("placeholder"),
      }));

    return { buttons, links, inputs };
  });

  return elements;
}
