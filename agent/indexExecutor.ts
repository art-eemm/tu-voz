import { visionClick } from "@/browser/visionClick";

export async function executeIndexAction(page, decision, elements) {
  if (decision.action === "click_index") {
    const element = elements[decision.index - 1];

    if (!element) return null;

    const success = await visionClick(page, element);

    if (!success) {
      await page.mouse.click(
        element.x + element.width / 2,
        element.y + element.height / 2,
      );
    }

    return {
      status: "clicked_index",
      index: decision.index,
    };
  }

  return null;
}
