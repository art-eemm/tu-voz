import { detectIntent } from "./intentDetector";
import { handleIntent } from "./intentHandler";
import { handlePlanner } from "./plannerHandler";
import { handleDecision } from "./decisionHandler";

export async function runPipeline(command, context, page, elements) {
  const intent = detectIntent(command);

  const intentResult = await handleIntent(intent, page, elements);

  if (intentResult) return intentResult;

  const plannerResult = await handlePlanner(command, context, page);

  if (plannerResult) return plannerResult;

  return handleDecision(command, context, page);
}
