import { decideAction } from "./aiDecision";
import { executeAction } from "./actionExecutor";
import { executeIndexAction } from "./indexExecutor";
import { findLink } from "./navigationMemoryLinks";

export async function handleDecision(command, context, page) {
  const memoryLink = findLink(command);

  if (memoryLink) {
    console.log("NAVIGATION MEMORY HIT:", memoryLink);

    await page.goto(memoryLink.href, { waitUntil: "domcontentloaded" });

    return {
      status: "memory-navigation",
      target: memoryLink.text,
    };
  }

  const screenshotBuffer = await page.screenshot({ type: "jpeg" });

  const screenshot = screenshotBuffer.toString("base64");

  const decision = await decideAction(command, context, screenshot);

  const indexResult = await executeIndexAction(
    page,
    decision,
    context.elements,
  );

  if (indexResult) return indexResult;

  if (!decision || decision.action === "none") {
    return { status: "no-action" };
  }

  return executeAction(page, decision, command, context);
}
