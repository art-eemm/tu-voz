import { Page } from "playwright";

export async function buildFocusedDom(page: Page) {
  try {
    await page.waitForLoadState("domcontentloaded");

    const context = await page.evaluate(() => {
      function visible(el: Element) {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }

      function clean(text: string | null) {
        if (!text) return "";
        return text.trim().replace(/\s+/g, " ");
      }

      const searchInputs = Array.from(
        document.querySelectorAll(
          "input[type='search'], input[placeholder*='search']",
        ),
      )
        .filter(visible)
        .map((el) => clean(el.getAttribute("placeholder")));

      const primaryButtons = Array.from(
        document.querySelectorAll("button, input[type='submit']"),
      )
        .filter(visible)
        .slice(0, 10)
        .map((el) => clean(el.textContent));

      const navigationLinks = Array.from(document.querySelectorAll("a"))
        .filter(visible)
        .slice(0, 20)
        .map((el) => clean(el.textContent));

      const headings = Array.from(document.querySelectorAll("h1, h2, h3"))
        .slice(0, 10)
        .map((el) => clean(el.textContent));

      const mainText = document.body.innerText.slice(0, 1500);

      return {
        url: window.location.href,
        title: document.title,
        searchInputs,
        primaryButtons,
        navigationLinks,
        headings,
        mainText,
      };
    });

    return context;
  } catch (error) {
    console.log("DOM extraction failed:", error);

    return {
      url: "",
      title: "",
      searchInputs: [],
      primaryButtons: [],
      navigationLinks: [],
      headings: [],
      mainText: "",
    };
  }
}
