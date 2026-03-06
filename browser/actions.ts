import { Page } from "playwright";
import { elementStore } from "./elementStore";
import { resultStore } from "./resultStore";

export async function openResult(page, id) {
  const result = resultStore[id];

  if (!result) {
    console.log("RESULT NOT FOUND:", id);
    return;
  }

  await page.goto(result.href, {
    waitUntil: "domcontentloaded",
  });
}

export async function smartClick(page: Page, id: string) {
  const element = elementStore[id];

  if (!element) {
    console.log("ELEMENT NOT FOUND:", id);
    return;
  }

  const clickable = page.locator(
    "a, button, [role='button'], input[type='submit']",
  );

  const count = await clickable.count();

  let visible: any[] = [];

  for (let i = 0; i < count; i++) {
    const el = clickable.nth(i);

    const isVisible = await el.isVisible().catch(() => false);

    if (isVisible) {
      visible.push(el);
    }
  }

  const index = parseInt(id.split("_")[1]) - 1;

  const locator = visible[index];

  if (!locator) {
    console.log("VISIBLE CLICKABLE NOT FOUND:", id);
    return;
  }

  await locator.click();
}

export async function smartType(page: Page, id: string, text: string) {
  const element = elementStore[id];

  if (!element) {
    console.log("ELEMENT NOT FOUND:", id);
    return;
  }

  const inputs = page.locator("input, textarea");

  const count = await inputs.count();

  let textInputs = [];

  for (let i = 0; i < count; i++) {
    const el = inputs.nth(i);

    const visible = await el.isVisible().catch(() => false);

    if (!visible) continue;

    const type = await el.getAttribute("type");

    // aceptar solo campos de texto
    const allowed =
      !type ||
      type === "text" ||
      type === "search" ||
      type === "email" ||
      type === "url" ||
      type === "tel" ||
      type === "password";

    if (!allowed) continue;

    textInputs.push(el);
  }

  if (textInputs.length === 0) {
    console.log("NO VISIBLE INPUT FOUND");
    return;
  }

  // buscar por label del elemento detectado
  let locator = textInputs.find(async (el) => {
    const placeholder = await el.getAttribute("placeholder");
    const name = await el.getAttribute("name");

    return (
      placeholder?.toLowerCase().includes(element.label) ||
      name?.toLowerCase().includes(element.label)
    );
  });

  if (!locator) {
    locator = textInputs[0];
  }

  await locator.click();

  await locator.fill("");

  await locator.type(text, { delay: 40 });

  // presionar enter para enviar búsqueda
  await locator.press("Enter");
}

export async function clickByText(page: Page, text: string) {
  const locator = page.locator(`text=${text}`).first();

  if (await locator.count()) {
    await locator.scrollIntoViewIfNeeded();

    await locator.click();
  }
}
