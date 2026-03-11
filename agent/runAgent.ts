import { browserController } from "@/browser/playwrightController";
import { buildFocusedDom } from "@/browser/focusedDom";
import { extractInteractiveElements } from "@/browser/interactiveElements";
import { registerElements } from "@/browser/elementStore";
import { rankElements } from "./elementRanking";
import { extractResults } from "@/browser/resultExtractor";
import { registerResults } from "@/browser/resultStore";
import { drawOverlay } from "@/browser/visualOverlay";
import { runPipeline } from "./agentPipeline";
import { addMessage } from "./conversationMemory";

export async function runAgent(command: string) {
  addMessage("user", command);

  const page = await browserController.getPage();

  const rawElements = await extractInteractiveElements(page);

  const elements = rankElements(rawElements);

  await drawOverlay(page, elements);

  registerElements(elements);

  const context = await buildFocusedDom(page);

  const results = await extractResults(page);

  registerResults(results);

  return runPipeline(
    command,
    {
      ...context,
      elements,
      results,
    },
    page,
    elements,
  );
}
