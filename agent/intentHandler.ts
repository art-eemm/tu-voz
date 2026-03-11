import { refreshOverlay } from "@/browser/overlayManager";
import { narratePage } from "./pageNarrator";
import { speakAction } from "./voiceHandler";
import { openNewTab, switchTab, closeTab } from "@/browser/tabManager";
import { smartType } from "@/browser/actions";
import { getSiteProfile } from "./getSiteProfile";

export async function handleIntent(intent, page, elements) {
  // -----------------------------
  // SEARCH (context aware)
  // -----------------------------
  if (intent.type === "search") {
    const url = page.url();

    const profile = getSiteProfile(url);

    const query = intent.query;

    // --------------------------------
    // SITE PROFILE SEARCH
    // --------------------------------

    if (profile?.searchInput) {
      const input = await page.$(profile.searchInput);

      if (input) {
        await input.fill(query);

        await page.keyboard.press("Enter");

        await refreshOverlay(page);

        await narratePage(page);

        speakAction("search_page", { query });

        return {
          status: "site-search",
          site: profile.name,
        };
      }
    }

    // --------------------------------
    // GENERIC SEARCH INPUT
    // --------------------------------

    const searchInput = elements.find((el) => {
      const text = (
        (el.label || "") +
        (el.placeholder || "") +
        (el.name || "") +
        (el.domId || "")
      ).toLowerCase();

      return (
        el.tag === "input" &&
        (el.type === "search" ||
          text.includes("search") ||
          text.includes("buscar"))
      );
    });

    if (searchInput) {
      await smartType(page, searchInput.id, query);

      await page.keyboard.press("Enter");

      await refreshOverlay(page);

      await narratePage(page);

      speakAction("search_page", { query });

      return {
        status: "page-search",
        query,
      };
    }

    // --------------------------------
    // FALLBACK SEARCH ENGINE
    // --------------------------------

    const encoded = encodeURIComponent(query);

    await page.goto(`https://search.brave.com/search?q=${encoded}`, {
      waitUntil: "domcontentloaded",
    });

    await refreshOverlay(page);

    await narratePage(page);

    speakAction("search", { query });

    return {
      status: "search-executed",
      query,
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

  // -----------------------------
  // NEW TAB
  // -----------------------------
  if (intent.type === "new_tab") {
    await openNewTab();

    speakAction("new_tab");

    return {
      status: "tab-opened",
    };
  }

  // -----------------------------
  // SWITCH TAB
  // -----------------------------
  if (intent.type === "switch_tab") {
    const ok = switchTab(intent.index - 1);

    if (!ok) return null;

    speakAction("switch_tab", { index: intent.index });

    return {
      status: "tab-switched",
    };
  }

  // -----------------------------
  // CLOSE TAB
  // -----------------------------
  if (intent.type === "close_tab") {
    await closeTab();

    speakAction("close_tab");

    return {
      status: "tab-closed",
    };
  }

  // -----------------------------
  // PAUSE VIDEO
  // -----------------------------
  if (intent.type === "pause_video") {
    const profile = getSiteProfile(page.url());

    if (profile?.video) {
      await page.evaluate(() => {
        const video = document.querySelector("video");
        if (video) video.pause();
      });

      speakAction("pause_video");

      return { status: "video-paused" };
    }
  }

  // -----------------------------
  // PLAY VIDEO
  // -----------------------------
  if (intent.type === "play_video") {
    const profile = getSiteProfile(page.url());

    if (profile?.video) {
      await page.evaluate(() => {
        const video = document.querySelector("video");
        if (video) video.play();
      });

      speakAction("play_video");

      return { status: "video-playing" };
    }
  }

  return null;
}
