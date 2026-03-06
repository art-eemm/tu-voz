import { Page } from "playwright";
import { findInput, findClickable } from "./elementFinder";

export async function smartClick(page: Page, text: string) {
  const element = await findClickable(page, text);

  if (!element) return;

  await element.click();
}

export async function smartType(page: Page, target: string, text: string) {
  const input = await findInput(page, target);

  if (!input) return;

  await input.fill(text);
}
