import { Page } from "playwright";

export async function buildSemanticDom(page: Page) {
  const context = await page.evaluate(() => {
    function visible(el: Element) {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }

    const inputs = Array.from(document.querySelectorAll("input, textarea"))
      .filter(visible)
      .map((el) => ({
        placeholder: el.getAttribute("placeholder"),
        name: el.getAttribute("name"),
        type: el.getAttribute("type"),
      }));

    const buttons = Array.from(
      document.querySelectorAll(
        "button, [role='button'], input[type='submit']",
      ),
    )
      .filter(visible)
      .map((el) => el.textContent?.trim());

    const links = Array.from(document.querySelectorAll("a"))
      .filter(visible)
      .slice(0, 30)
      .map((el) => el.textContent?.trim());

    const headings = Array.from(document.querySelectorAll("h1, h2, h3")).map(
      (el) => el.textContent?.trim(),
    );

    const visibleText = document.body.innerText.slice(0, 2000);

    return {
      url: window.location.href,
      title: document.title,
      inputs,
      buttons,
      links,
      headings,
      visibleText,
    };
  });

  return context;
}
