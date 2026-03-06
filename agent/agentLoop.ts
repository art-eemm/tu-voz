import { browserController } from "@/browser/playwrightController";
import { buildSemanticDom } from "@/browser/semanticDom";
import { decideAction } from "./aiDecision";
import { smartClick, smartType } from "@/browser/actions";

export async function runAgent(command: string) {
  const page = await browserController.getPage();

  let steps = 0;
  const maxSteps = 5;

  while (steps < maxSteps) {
    const context = await buildSemanticDom(page);

    const decision = await decideAction(command, context);

    console.log("Agent stop:", steps, decision);

    if (decision.action === "none") {
      break;
    }

    if (decision.action === "click") {
      await smartClick(page, decision.target);
    }

    if (decision.action === "type") {
      await smartType(page, decision.target, decision.text);
      await page.keyboard.press("Enter");
    }

    if (decision.action === "navigate") {
      await page.goto(decision.url);
    }

    if (decision.action === "scroll") {
      await page.mouse.wheel(0, 800);
    }

    await page.waitForLoadState("domcontentloaded");

    steps++;
  }

  return { status: "completed", steps };
}
