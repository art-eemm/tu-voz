import { browserController } from "@/browser/playwrightController";
import { clickByText } from "@/browser/actions";
import { buildPageContext } from "@/browser/pageContext";
import { decideAction } from "./aiDecision";
import { getActivePage } from "@/browser/tabManager";

export async function executeCommand(command: string) {
  const page = getActivePage();

  const context = await buildPageContext(page);

  const decision = await decideAction(command, context);

  console.log("AI decision:", decision);

  if (decision.action === "click") {
    await clickByText(page, decision.target);
  }

  if (decision.action === "type") {
    await page.keyboard.type(decision.text);
  }

  if (decision.action === "navigate") {
    await page.goto(decision.url);
  }

  if (decision.action === "scroll") {
    await page.mouse.wheel(0, 800);
  }
}
