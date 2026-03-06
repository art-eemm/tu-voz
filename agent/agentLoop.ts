import { browserController } from "@/browser/playwrightController";
import { buildFocusedDom } from "@/browser/focusedDom";
import { decideAction } from "./aiDecision";
import { smartClick, smartType } from "@/browser/actions";
import { extractInteractiveElements } from "@/browser/interactiveElements";
import { registerElements } from "@/browser/elementStore";
import { rankElements } from "./elementRanking";
import { extractResults } from "@/browser/resultExtractor";
import { registerResults } from "@/browser/resultStore";
import { openResult, clickByText } from "@/browser/actions";

export async function runAgent(command: string) {
  const page = await browserController.getPage();

  console.log("USER COMMAND:", command);

  // extraer elementos interactivos
  const rawElements = await extractInteractiveElements(page);

  const elements = rankElements(rawElements);

  console.log("RANKED ELEMENTS:", elements);

  registerElements(elements);

  // contexto de la página
  const context = await buildFocusedDom(page);

  const results = await extractResults(page);

  registerResults(results);
  console.log("VISIBLE RESULTS:", results);

  // decisión del modelo
  const decision = await decideAction(command, {
    ...context,
    elements,
    results,
  });

  console.log("AI DECISION:", decision);

  if (!decision || decision.action === "none") {
    console.log("Agent finished: no action");
    return { status: "no-action" };
  }

  console.log("EXECUTING ACTION:", decision.action);
  console.log("TARGET:", decision.target);

  try {
    const action = decision.action?.toLowerCase();

    if (action === "click") {
      await smartClick(page, decision.target);
    }

    if (action === "type") {
      await smartType(page, decision.target, decision.text);

      await page.keyboard.press("Enter");
    }

    if (action === "navigate") {
      await page.goto(decision.url, { waitUntil: "domcontentloaded" });
    }

    if (action === "scroll") {
      await page.mouse.wheel(0, 800);
    }

    if (action === "open_result") {
      await openResult(page, decision.target);
    }

    if (action === "click" && decision.targetText) {
      await clickByText(page, decision.targetText);
      return;
    }

    await page.waitForLoadState("domcontentloaded").catch(() => {});
  } catch (error) {
    console.log("ACTION ERROR:", error);
  }

  return {
    status: "completed",
    action: decision.action,
  };
}
