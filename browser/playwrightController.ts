import { chromium, Browser, Page } from "playwright";
import { registerBrowser, registerInitialPage } from "./tabManager";

class PlaywrightController {
  browser: Browser | null = null;
  page: Page | null = null;

  async start() {
    if (this.browser && this.page) {
      return this.page;
    }

    this.browser = await chromium.launch({
      headless: false,
    });

    registerBrowser(this.browser);

    const context = await this.browser.newContext();

    this.page = await context.newPage();

    registerInitialPage(this.page);

    return this.page;
  }

  async goto(url: string) {
    if (!this.page) throw new Error("Browser not started");

    await this.page.goto(url);
    await this.page.waitForLoadState("domcontentloaded");
  }

  async getPage() {
    if (!this.page) throw new Error("Browser not started");

    return this.page;
  }
}

/*
IMPORTANTE
usamos globalThis para mantener la instancia
entre requests
*/

const globalForBrowser = globalThis as unknown as {
  browserController?: PlaywrightController;
};

export const browserController =
  globalForBrowser.browserController ?? new PlaywrightController();

if (!globalForBrowser.browserController) {
  globalForBrowser.browserController = browserController;
}
