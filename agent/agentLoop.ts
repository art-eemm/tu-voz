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
import { updateNavigationState, setLastCommand } from "./navigationMemory";
import { findLinkByText } from "@/browser/linkDetector";
import { drawOverlay } from "@/browser/visualOverlay";
import { refreshOverlay } from "@/browser/overlayManager";
import { extractReadableContent } from "@/browser/contentExtractor";
import { readPageContent } from "./pageReader";
import { updateAgentState, addConversation } from "./agentState";
import { clearTracking, trackElement } from "@/browser/elementTracker";

export async function runAgent(command: string) {
  setLastCommand(command);

  addConversation("user", command);

  const page = await browserController.getPage();

  console.log("USER COMMAND:", command);

  // extraer elementos interactivos
  const rawElements = await extractInteractiveElements(page);

  const elements = rankElements(rawElements);

  console.log("RANKED ELEMENTS:", elements);

  trackElement(elements, page.url());

  await drawOverlay(page, elements);

  registerElements(elements);

  // contexto de la página
  const context = await buildFocusedDom(page);

  const results = await extractResults(page);

  registerResults(results);
  console.log("VISIBLE RESULTS:", results);

  const lower = command.toLowerCase();

  const screenshotBuffer = await page.screenshot({
    type: "jpeg",
  });

  const screenshot = screenshotBuffer.toString("base64");

  if (
    lower.startsWith("ve a") ||
    lower.startsWith("ir a") ||
    lower.startsWith("go to")
  ) {
    const target = lower
      .replace("ve a", "")
      .replace("ir a", "")
      .replace("go to", "")
      .trim();

    console.log("SEMANTIC LINK NAVIGATION:", target);

    const clicked = await findLinkByText(page, target);

    if (clicked) {
      await page.waitForLoadState("domcontentloaded").catch(() => {});

      return { status: "link-opened", target };
    }
  }

  // decisión del modelo
  const decision = await decideAction(
    command,
    {
      ...context,
      elements,
      results,
    },
    screenshot,
  );

  console.log("AI DECISION:", decision);

  if (!decision || decision.action === "none") {
    console.log("Agent finished: no action");
    return { status: "no-action" };
  }

  console.log("EXECUTING ACTION:", decision.action);
  console.log("TARGET:", decision.target);

  try {
    const action = decision.action?.toLowerCase();
    const rawElements = await extractInteractiveElements(page);
    const elements = rankElements(rawElements);

    if (action === "navigate") {
      clearTracking();
    }

    if (action === "click_xy") {
      await page.mouse.click(decision.x, decision.y);

      await refreshOverlay(page);

      updateAgentState({
        lastCommand: command,
        lastPage: page.url(),
        lastAction: action,
      });

      return {
        status: "clicked_xy",
      };
    }

    if (action === "type_xy") {
      await page.mouse.click(decision.x, decision.y);

      await page.keyboard.type(decision.text || "", { delay: 40 });

      await page.keyboard.press("Enter");

      await refreshOverlay(page);

      updateAgentState({
        lastCommand: command,
        lastPage: page.url(),
        lastAction: action,
      });

      return {
        status: "typed_xy",
      };
    }

    if (action === "click") {
      await smartClick(page, decision.target);
      await refreshOverlay(page);

      updateAgentState({
        lastCommand: command,
        lastPage: page.url(),
        lastAction: action,
      });
    }

    if (action === "type") {
      if (!decision.target) {
        console.log("NO TARGET FOR TYPE → using first search input");

        const fallbackInput = elements.find(
          (e) =>
            e.tag === "input" && (e.type === "search" || e.type === "text"),
        );

        if (fallbackInput) {
          decision.target = fallbackInput.id;
        } else {
          console.log("NO INPUT FOUND");
          return { status: "no-input-found" };
        }
      }

      await smartType(page, decision.target, decision.text);

      await page.keyboard.press("Enter");

      await refreshOverlay(page);

      updateAgentState({
        lastCommand: command,
        lastPage: page.url(),
        lastAction: action,
      });
    }

    if (action === "navigate") {
      await page.goto(decision.url, { waitUntil: "domcontentloaded" });
      await refreshOverlay(page);

      updateAgentState({
        lastCommand: command,
        lastPage: page.url(),
        lastAction: action,
      });
    }

    if (action === "scroll") {
      if (decision.direction === "up") {
        await page.mouse.wheel(0, -800);
      } else {
        await page.mouse.wheel(0, 800);
      }

      updateAgentState({
        lastCommand: command,
        lastPage: page.url(),
        lastAction: action,
      });

      await refreshOverlay(page);
    }

    if (action === "open_result") {
      await openResult(page, decision.target);
      await refreshOverlay(page);

      updateAgentState({
        lastCommand: command,
        lastPage: page.url(),
        lastAction: action,
      });
    }

    if (action === "click" && decision.targetText) {
      await clickByText(page, decision.targetText);
      await refreshOverlay(page);

      updateAgentState({
        lastCommand: command,
        lastPage: page.url(),
        lastAction: action,
      });
      return;
    }

    if (action === "read_page") {
      const content = await extractReadableContent(page);

      const answer = await readPageContent(command, content);

      console.log("PAGE READER:", answer);

      if (answer) {
        addConversation("assistant", answer);
      }

      updateAgentState({
        lastCommand: command,
        lastPage: page.url(),
        lastAction: action,
      });

      return {
        status: "read",
        response: answer,
      };
    }

    if (action === "go_back") {
      await page.goBack({ waitUntil: "domcontentloaded" }).catch(() => {});

      await refreshOverlay(page);

      updateAgentState({
        lastCommand: command,
        lastPage: page.url(),
        lastAction: action,
      });

      return {
        status: "went-back",
      };
    }

    await page.waitForLoadState("domcontentloaded").catch(() => {});

    updateNavigationState(page);

    registerElements(elements);
    console.log("UPDATED ELEMENTS:", elements);
  } catch (error) {
    console.log("ACTION ERROR:", error);
  }

  return {
    status: "completed",
    action: decision.action,
  };
}
