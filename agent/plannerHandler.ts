import { createPlan } from "./taskPlanner";
import { executePlan } from "./planExecutor";
import { refreshOverlay } from "@/browser/overlayManager";

export async function handlePlanner(command, context, page) {
  const plan = await createPlan(command, context);

  if (!plan.steps?.length) return null;

  await executePlan(page, plan.steps, command, context);

  await refreshOverlay(page);

  return {
    status: "plan-executed",
    steps: plan.steps.length,
  };
}
