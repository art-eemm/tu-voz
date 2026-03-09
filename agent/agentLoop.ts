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
import { detectIntent } from "./intentDetector";
import { createPlan } from "./taskPlanner";
import { executePlan } from "./planExecutor";
import { reflect } from "./selfReflection";
import { drawDebugOverlay } from "@/browser/debugOverlay";
import { speechForAction } from "./speechMidleware";

export async function runAgent(command: string) {
  setLastCommand(command);
  addConversation("user", command);

  const page = await browserController.getPage();

  console.log("USER COMMAND:", command);

  await drawDebugOverlay(page, { command });

  const intent = detectIntent(command);

  // --------------------------------
  // EXTRAER ELEMENTOS
  // --------------------------------

  const rawElements = await extractInteractiveElements(page);
  const elements = rankElements(rawElements);

  trackElement(elements, page.url());

  await drawOverlay(page, elements);

  registerElements(elements);

  const context = await buildFocusedDom(page);

  const results = await extractResults(page);

  registerResults(results);

  console.log("RANKED ELEMENTS:", elements);
  console.log("VISIBLE RESULTS:", results);

  // --------------------------------
  // INTENT DETECTION
  // --------------------------------

  if (intent.type === "search") {
    console.log("INTENT: search", intent.query);

    const searchInput = elements.find(
      (e) => e.tag === "input" && (e.type === "search" || e.type === "text"),
    );

    if (searchInput) {
      await smartType(page, searchInput.id, intent.query);

      await page.keyboard.press("Enter");

      await refreshOverlay(page);

      return {
        status: "search-executed",
        voice: speechForAction("search", { query: intent.query }),
      };
    }
  }

  if (intent.type === "go_back") {
    await page.goBack({ waitUntil: "domcontentloaded" }).catch(() => {});

    await refreshOverlay(page);

    return { status: "went-back", voice: speechForAction("go_back") };
  }

  if (intent.type === "scroll") {
    const amount = intent.direction === "up" ? -800 : 800;

    await page.mouse.wheel(0, amount);

    await refreshOverlay(page);

    return { status: "scrolled", voice: speechForAction("scroll") };
  }

  if (intent.type === "read_page") {
    const content = await extractReadableContent(page);

    const answer = await readPageContent(command, content);

    if (answer) addConversation("assistant", answer);

    await drawDebugOverlay(page, {
      command,
      reflection: { success: true },
    });

    return {
      status: "read",
      response: answer,
      voice: speechForAction("read_page", { query: answer }),
    };
  }

  if (intent.type === "navigate_text") {
    const clicked = await findLinkByText(page, intent.target);

    if (clicked) {
      await page.waitForLoadState("domcontentloaded").catch(() => {});

      await refreshOverlay(page);

      updateAgentState({
        lastCommand: command,
        lastPage: page.url(),
        lastAction: "navigate_text",
      });

      return {
        status: "link-opened",
        target: intent.target,
        voice: speechForAction("navigate", { query: intent.target }),
      };
    }
  }

  // --------------------------------
  // TASK PLANNING
  // --------------------------------

  const plan = await createPlan(command, {
    ...context,
    elements,
    results,
  });

  console.log("PLAN:", plan);

  await drawDebugOverlay(page, {
    command,
    plan: plan.steps,
  });

  if (plan.steps?.length) {
    await executePlan(page, plan.steps, command, {
      ...context,
      elements,
      results,
    });

    await refreshOverlay(page);

    // --------------------------------
    // SELF REFLECTION
    // --------------------------------

    const reflection = await reflect(command, {
      ...context,
      elements,
      results,
    });

    console.log("REFLECTION:", reflection);

    await drawDebugOverlay(page, {
      command,
      plan: plan.steps,
      reflection,
    });

    if (!reflection.success) {
      console.log("GOAL NOT ACHIEVED → REPLANNING");

      const newPlan = await createPlan(command, {
        ...context,
        elements,
        results,
      });

      if (newPlan.steps?.length) {
        await executePlan(page, newPlan.steps, command, {
          ...context,
          elements,
          results,
        });
      }
    }

    return {
      status: "plan-executed",
      steps: plan.steps.length,
    };
  }

  // --------------------------------
  // FALLBACK LLM DECISION
  // --------------------------------

  const screenshotBuffer = await page.screenshot({ type: "jpeg" });
  const screenshot = screenshotBuffer.toString("base64");

  const decision = await decideAction(
    command,
    { ...context, elements, results },
    screenshot,
  );

  console.log("AI DECISION:", decision);

  if (!decision || decision.action === "none") {
    console.log("Agent finished: no action");

    return { status: "no-action" };
  }

  console.log("EXECUTING ACTION:", decision.action);

  try {
    const action = decision.action?.toLowerCase();

    await drawDebugOverlay(page, {
      command,
      step: decision,
    });

    if (action === "click" && decision.targetText) {
      console.log("SEMANTIC CLICK:", decision.targetText);

      const clicked = await findLinkByText(page, decision.targetText);

      if (clicked) {
        await page.waitForLoadState("domcontentloaded").catch(() => {});

        await refreshOverlay(page);

        updateAgentState({
          lastCommand: command,
          lastPage: page.url(),
          lastAction: action,
        });

        return {
          status: "link-opened",
          target: decision.targetText,
        };
      }
    }

    if (action === "click") {
      await smartClick(page, decision.target);
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

    if (action === "type") {
      await smartType(page, decision.target, decision.text);

      await page.keyboard.press("Enter");
    }

    if (action === "click_xy") {
      await page.mouse.click(decision.x, decision.y);
    }

    if (action === "type_xy") {
      await page.mouse.click(decision.x, decision.y);

      await page.keyboard.type(decision.text || "", { delay: 40 });

      await page.keyboard.press("Enter");
    }

    if (action === "navigate") {
      clearTracking();

      await page.goto(decision.url, { waitUntil: "domcontentloaded" });
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
        voice: answer || "No pude obtener el contenido de la página",
      };
    }

    await refreshOverlay(page);

    updateAgentState({
      lastCommand: command,
      lastPage: page.url(),
      lastAction: action,
    });
  } catch (error) {
    console.log("ACTION ERROR:", error);
  }

  return {
    status: "completed",
    action: decision.action,
  };
}
