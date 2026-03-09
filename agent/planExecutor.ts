import { smartClick, smartType } from "@/browser/actions";
import { replan } from "./replanner";
import { validateStep } from "./stepValidator";

function elementExists(elements: any[], id: string) {
  return elements.some((el) => el.id === id);
}

export async function executePlan(
  page: any,
  steps: any[],
  command: string,
  context: any,
) {
  for (const step of steps) {
    try {
      const action = step.action?.toLowerCase();
      const validStep = validateStep(step, context);

      if (!validStep) {
        console.log("INVALID STEP -> REPLANNING");

        const newStep = await replan(command, context, "invalid step");

        if (newStep) {
          steps.unshift(newStep);
          continue;
        }
        return;
      }

      if (action === "click") {
        if (!elementExists(context.elements, validStep.target)) {
          console.log("INVALID TARGET → REPLANNING:", validStep.target);

          const newStep = await replan(command, context, "element not found");

          if (newStep) {
            console.log("NEW STEP:", newStep);
            steps.unshift(newStep);
            continue;
          }

          return;
        }

        await smartClick(page, validStep.target);
      }

      if (action === "type") {
        if (!elementExists(context.elements, validStep.target)) {
          const newStep = await replan(command, context, "input not found");

          if (newStep) {
            steps.unshift(newStep);
            continue;
          }

          return;
        }

        await smartType(page, validStep.target, validStep.text || "");
        await page.keyboard.press("Enter");
      }

      if (action === "click_xy") {
        await page.mouse.click(validStep.x, validStep.y);
      }

      await page.waitForLoadState("domcontentloaded").catch(() => {});
    } catch (error: any) {
      console.log("STEP FAILED → REPLANNING");

      const newStep = await replan(command, context, error.message);

      if (!newStep) {
        console.log("REPLAN FAILED");
        return;
      }

      console.log("NEW STEP:", newStep);

      steps.unshift(newStep);
    }
  }
}
