import { extractInteractiveElements } from "@/browser/interactiveElements";
import { pushVoiceEvent } from "./voiceEvents";

export async function narrateContext(page: any) {
  try {
    const elements = await extractInteractiveElements(page);

    const inputs = elements.filter((e: any) => e.tag === "input");
    const buttons = elements.filter((e: any) => e.tag === "button");
    const links = elements.filter((e: any) => e.tag === "a");

    let description = "";

    if (inputs.length) {
      description += `Hay ${inputs.length} campos de entrada.`;
    }

    if (buttons.length) {
      description += `Hay ${buttons.length} botones visibles.`;
    }

    if (links.length) {
      description += `Hay ${links.length} enlaces en la página.`;
    }

    const firstLink = links.find((l: any) => l.label && l.label.length > 2);

    if (firstLink) {
      description += `El primer enlace es ${firstLink.label}.`;
    }

    if (description.length > 0) {
      pushVoiceEvent(description);
    }
  } catch (error) {
    console.log("CONTENT NARRATOR ERROR:", error);
  }
}
