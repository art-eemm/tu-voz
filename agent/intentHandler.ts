import { refreshOverlay } from "@/browser/overlayManager";
import { narratePage } from "./pageNarrator";
import { speakAction } from "./voiceHandler";
import { openNewTab, switchTab, closeTab } from "@/browser/tabManager";

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

  if (intent.type === "new_tab") {
    const page = await openNewTab();

    speakAction("new_tab");

    return { status: "tab-opened" };
  }

  if (intent.type === "switch_tab") {
    const ok = switchTab(intent.index - 1);

    if (!ok) return null;

    speakAction("switch_tab", { index: intent.index });

    return { status: "tab-switched" };
  }

  if (intent.type === "close_tab") {
    await closeTab();

    speakAction("close_tab");

    return { status: "tab-closed" };
  }

  return null;
}
