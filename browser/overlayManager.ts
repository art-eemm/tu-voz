import { extractInteractiveElements } from "./interactiveElements";
import { rankElements } from "@/agent/elementRanking";
import { registerElements } from "./elementStore";
import { drawOverlay } from "./visualOverlay";

export async function refreshOverlay(page) {
  const raw = await extractInteractiveElements(page);

  const elements = rankElements(raw);

  registerElements(elements);

  await drawOverlay(page, elements);
}
