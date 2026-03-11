import { decideAction } from "./aiDecision";
import { executeAction } from "./actionExecutor";
import { executeIndexAction } from "./indexExecutor";

export async function handleDecision(command, context, page) {
  const screenshotBuffer = await page.screenshot({ type: "jpeg" });

  const screenshot = screenshotBuffer.toString("base64");

  const decision = await decideAction(command, context, screenshot);

  const indexResult = await executeIndexAction(
    page,
    decision,
    context.elements,
  );

  if (!indexResult) return indexResult;

  if (!decision || decision.action === "none") {
    return { status: "no-action" };
  }

  return executeAction(page, decision, command);
}
