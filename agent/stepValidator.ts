export function validateStep(step: any, context: any) {
  if (!step || !step.action) return null;

  const action = step.action.toLowerCase();

  // -----------------------------
  // CLICK
  // -----------------------------
  if (action === "click") {
    // click por texto
    if (step.targetText) {
      return step;
    }

    // click por índice (overlay)
    if (!isNaN(Number(step.target))) {
      return step;
    }

    // click por id (el_5)
    const exists = context.elements?.some((el: any) => el.id === step.target);

    if (!exists) {
      console.log("STEP VALIDATION FAILED:", step);
      return null;
    }

    return step;
  }

  // -----------------------------
  // TYPE
  // -----------------------------
  if (action === "type") {
    if (!step.text) {
      console.log("TYPE WITHOUT TEXT");
      return null;
    }

    const exists = context.elements?.some((el: any) => el.id === step.target);

    if (!exists) {
      console.log("TYPE TARGET NOT FOUND:", step);
      return null;
    }

    return step;
  }

  // -----------------------------
  // CLICK XY (vision click)
  // -----------------------------
  if (action === "click_xy") {
    if (typeof step.x !== "number" || typeof step.y !== "number") {
      return null;
    }

    return step;
  }

  return step;
}
