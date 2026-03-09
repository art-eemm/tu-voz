export function validateStep(step: any, context: any) {
  if (!step || !step.action) return null;

  const action = step.action.toLowerCase();

  if (action === "click" || action === "type") {
    const exists = context.elements?.some((el: any) => el.id === step.target);

    if (!exists) {
      console.log("STEP VALIDATION FAILED:", step);
      return null;
    }
  }

  if (action === "type" && !step.text) {
    console.log("TYPE WITHOUT TEXT");
    return null;
  }

  if (action === "click_xy") {
    if (typeof step.x !== "number" || typeof step.y !== "number") {
      return null;
    }
  }

  return step;
}
