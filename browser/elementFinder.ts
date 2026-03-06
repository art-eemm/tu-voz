import { Page, Locator } from "playwright";

export async function findInput(
  page: Page,
  target: string,
): Promise<Locator | null> {
  const inputs = page.locator("input, textarea");
  const count = await inputs.count();

  const targetLower = target.toLowerCase();

  for (let i = 0; i < count; i++) {
    const el = inputs.nth(i);

    const visible = await el.isVisible().catch(() => false);
    if (!visible) continue;

    const placeholder = (await el.getAttribute("placeholder"))?.toLowerCase();
    const name = (await el.getAttribute("name"))?.toLowerCase();
    const type = (await el.getAttribute("type"))?.toLowerCase();

    if (
      placeholder?.includes(targetLower) ||
      name?.includes(targetLower) ||
      type === "search"
    ) {
      return el;
    }
  }

  return null;
}

export async function findClickable(
  page: Page,
  text: string,
): Promise<Locator | null> {
  const elements = page.locator(
    "a, button, [role='button'], input[type='submit']",
  );
  const count = await elements.count();

  const targetLower = text.toLowerCase();

  for (let i = 0; i < count; i++) {
    const el = elements.nth(i);

    const visible = await el.isVisible().catch(() => false);
    if (!visible) continue;

    const label = (await el.innerText().catch(() => ""))?.toLowerCase();

    if (label?.includes(targetLower)) {
      return el;
    }
  }

  return null;
}
