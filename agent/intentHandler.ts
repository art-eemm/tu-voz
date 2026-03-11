import { refreshOverlay } from "@/browser/overlayManager";
import { narratePage } from "./pageNarrator";
import { speakAction } from "./voiceHandler";

export async function handleIntent(intent, page, elements) {
  // -----------------------------
  // SEARCH (Brave Search)
  // -----------------------------
  if (intent.type === "search") {
    const query = encodeURIComponent(intent.query);

    await page.goto(`https://search.brave.com/search?q=${query}`, {
      waitUntil: "domcontentloaded",
    });

    await refreshOverlay(page);

    await narratePage(page);

    speakAction("search", { query: intent.query });

    return {
      status: "search-executed",
      query: intent.query,
    };
  }

  // -----------------------------
  // GO BACK
  // -----------------------------
  if (intent.type === "go_back") {
    await page.goBack({ waitUntil: "domcontentloaded" }).catch(() => {});

    await refreshOverlay(page);

    speakAction("go_back");

    return {
      status: "went-back",
    };
  }

  // -----------------------------
  // SCROLL
  // -----------------------------
  if (intent.type === "scroll") {
    const amount = intent.direction === "up" ? -800 : 800;

    await page.mouse.wheel(0, amount);

    await refreshOverlay(page);

    speakAction("scroll");

    return {
      status: "scrolled",
      direction: intent.direction,
    };
  }

  return null;
}
