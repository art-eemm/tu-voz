import { Browser, Page } from "playwright";

let browserInstance: Browser | null = null;

let tabs: Page[] = [];

let activeTabIndex = 0;

// registrar browser
export function registerBrowser(browser: Browser) {
  browserInstance = browser;
}

// registrar primera página
export function registerInitialPage(page: Page) {
  tabs = [page];
  activeTabIndex = 0;
}

// obtener página actual
export function getActivePage(): Page {
  const page = tabs[activeTabIndex];

  if (!page) {
    throw new Error("No active tab");
  }

  return page;
}

// abrir nueva tab
export async function openNewTab(): Promise<Page> {
  if (!browserInstance) {
    throw new Error("Browser not initialized");
  }

  const context = browserInstance.contexts()[0];

  const page = await context.newPage();

  tabs.push(page);

  activeTabIndex = tabs.length - 1;

  return page;
}

// cambiar tab
export function switchTab(index: number): Page | null {
  if (index < 0 || index >= tabs.length) {
    return null;
  }

  activeTabIndex = index;

  return tabs[activeTabIndex];
}

// cerrar tab
export async function closeTab(): Promise<void> {
  if (tabs.length <= 1) return;

  const page = tabs[activeTabIndex];

  await page.close();

  tabs.splice(activeTabIndex, 1);

  activeTabIndex = Math.max(0, activeTabIndex - 1);
}

// listar tabs
export function listTabs() {
  return tabs.map((page, i) => ({
    index: i + 1,
    url: page.url(),
    active: i === activeTabIndex,
  }));
}
