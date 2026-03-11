import { Browser, Page } from "playwright";

let browserInstance: Browser | null = null;
let tabs: Page[] = [];
let activeTabIndex = 0;

export function registerBrowser(browser: Browser) {
  browserInstance = browser;
}

export function registerInitialPage(page: Page) {
  tabs = [page];
  activeTabIndex = 0;
}

export function getActivePage(): Page {
  return tabs[activeTabIndex];
}

export function getTabs() {
  return tabs;
}

export async function openNewTab(url?: string) {
  if (!browserInstance) throw new Error("Browser not initialized");

  const context = browserInstance.contexts()[0];

  const page = await context.newPage();

  if (url) {
    await page.goto(url);
  }

  tabs.push(page);
  activeTabIndex = tabs.length - 1;

  return page;
}

export function switchTab(index: number) {
  if (index < 0 || index >= tabs.length) return false;

  activeTabIndex = index;
  return true;
}

export async function closeTab(index?: number) {
  const i = index ?? activeTabIndex;

  if (!tabs[i]) return;

  await tabs[i].close();

  tabs.splice(i, 1);

  if (activeTabIndex >= tabs.length) {
    activeTabIndex = tabs.length - 1;
  }
}

export function getActiveTabIndex() {
  return activeTabIndex;
}
