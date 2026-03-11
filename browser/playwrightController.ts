import { chromium, Browser, Page } from "playwright";
import {
  registerBrowser,
  registerInitialPage,
  getActivePage,
} from "./tabManager";
import { pushVoiceEvent } from "@/agent/voiceBus";

class PlaywrightController {
  browser: Browser | null = null;

  async start() {
    if (this.browser) {
      return getActivePage();
    }

    this.browser = await chromium.launch({
      headless: false,
    });

    registerBrowser(this.browser);

    const context = await this.browser.newContext();

    const page = await context.newPage();

    page.on("framenavigated", async () => {
      const title = await page.title();

      pushVoiceEvent(`Nueva página: ${title}`);
    });

    registerInitialPage(page);

    return page;
  }

  async goto(url: string) {
    const page = getActivePage();

    await page.goto(url);

    await page.waitForLoadState("domcontentloaded");
  }

  async getPage(): Promise<Page> {
    return getActivePage();
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
