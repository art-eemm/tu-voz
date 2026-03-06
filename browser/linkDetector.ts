import { Page } from "playwright";

export async function findLinkByText(page: Page, text: string) {
  const locator = page.locator(`a:has-text("${text}")`).first();

  if (await locator.count()) {
    await locator.scrollIntoViewIfNeeded();

    await locator.click();

    return true;
  }

  return false;
}
