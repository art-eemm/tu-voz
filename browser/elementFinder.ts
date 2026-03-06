import { Page } from "playwright";

export async function findInput(page: Page, target: string) {
  const locator = page.locator(`input[placeholder*="${target}"]`);

  if (await locator.count()) {
    return locator.first();
  }

  const byName = page.locator(`input[name*="${target}"]`);

  if (await byName.count()) {
    return byName.first();
  }

  return page.locator("input").first();
}

export async function findClickable(page: Page, text: string) {
  const locator = page.locator(`text=${text}`);

  if (await locator.count()) {
    return locator.first();
  }

  return null;
}
