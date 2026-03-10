import { extractReadableContent } from "@/browser/contentExtractor";
import { readPageContent } from "./pageReader";
import { pushVoiceEvent } from "./voiceEvents";
import { narrateContext } from "./contextNarrator";

let lastNarratedUrl: string | null = null;

export async function narratePage(page: any) {
  const url = page.url();

  if (url === lastNarratedUrl) return;

  lastNarratedUrl = url;

  try {
    const content = await extractReadableContent(page);

    const summary = await readPageContent(
      "Explica brevemente de qué trata esta página",
      content,
    );

    const voice = `Nueva página. ${summary}`;

    pushVoiceEvent(voice);

    await narrateContext(page);

    pushVoiceEvent(voice);
  } catch (error) {
    console.log("PAGE NARRATOR ERROR:", error);
  }
}
