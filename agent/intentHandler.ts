import { smartType } from "@/browser/actions";
import { refreshOverlay } from "@/browser/overlayManager";
import { narratePage } from "./pageNarrator";
import { speakAction } from "./voiceHandler";

export async function handleIntent(intent, page, elements) {
  if (intent.type === "search") {
    const searchInput = elements.find(
      (e) => e.tag === "input" && (e.type === "search" || e.type === "text"),
    );

    if (!searchInput) return null;

    await smartType(page, searchInput.id, intent.query);

    await page.keyboard.press("Enter");

    await refreshOverlay(page);

    await narratePage(page);

    speakAction("search", { query: intent.query });

    return { status: "search-executed" };
  }

  if (intent.type === "go_back") {
    await page.goBack({ waitUntil: "domcontentloaded" }).catch(() => {});

    await refreshOverlay(page);

    speakAction("go_back");

    return { status: "went-back" };
  }

  if (intent.type === "scroll") {
    const amount = intent.direction === "up" ? -800 : 800;

    await page.mouse.wheel(0, amount);

    await refreshOverlay(page);

    speakAction("scroll");

    return { status: "scrolled" };
  }

  return null;
}
