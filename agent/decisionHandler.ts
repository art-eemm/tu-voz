import { decideAction } from "./aiDecision";
import { executeAction } from "./actionExecutor";

export async function handleDecision(command, context, page) {
  const screenshotBuffer = await page.screenshot({ type: "jpeg" });

  const screenshot = screenshotBuffer.toString("base64");

  const decision = await decideAction(command, context, screenshot);

  if (!decision || decision.action === "none") {
    return { status: "no-action" };
  }

  return executeAction(page, decision, command);
}
