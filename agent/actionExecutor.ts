import { smartClick, smartType } from "@/browser/actions";
import { extractReadableContent } from "@/browser/contentExtractor";
import { readPageContent } from "./pageReader";
import { addConversation } from "./agentState";
import { visionClick } from "@/browser/visionClick";
import { semanticMatchLink } from "./semanticLinkMatcher";
import { getVisibleLinks } from "@/browser/visibleLinks";
import { extractLinks } from "@/browser/extractLinks";
import { storeLinks } from "./navigationMemoryLinks";
import { narrate } from "./voiceNarrator";

export async function executeAction(page, decision, command, context) {
  const action = decision.action?.toLowerCase();

  if (action === "click") {
    narrate("Haciendo clic");
    // -----------------------------
    // 1️⃣ CLICK POR ÍNDICE
    // -----------------------------
    if (!isNaN(Number(decision.target))) {
      const index = Number(decision.target) - 1;

      const element = context.elements[index];

      if (!element) return { status: "element-not-found" };

      await page
        .waitForSelector("a, button, [role='button']", { timeout: 2000 })
        .catch(() => {});

      await page.evaluate(
        ({ x, y, w, h }) => {
          const el = document.elementFromPoint(x + w / 2, y + h / 2);

          if (el) (el as HTMLElement).click();
        },
        {
          x: element.x,
          y: element.y,
          w: element.width,
          h: element.height,
        },
      );

      return {
        status: "clicked-index",
        index: index + 1,
      };
    }

    // -----------------------------
    // 2️⃣ CLICK POR ID (el_3)
    // -----------------------------
    const element = context.elements.find((e) => e.id === decision.target);

    if (element) {
      const success = await visionClick(page, element);

      if (!success) {
        await smartClick(page, decision.target);
      }

      return {
        status: "clicked-element",
        id: decision.target,
      };
    }

    // -----------------------------
    // 3️⃣ CLICK POR TEXTO
    // -----------------------------
    if (decision.targetText) {
      const links = await getVisibleLinks(page);

      const bestMatch = await semanticMatchLink(decision.targetText, links);

      if (bestMatch) {
        const clicked = await page.evaluate((text) => {
          function normalize(str) {
            return str?.toLowerCase().replace(/\s+/g, " ").trim();
          }

          const targetText = normalize(text);

          const clickable = Array.from(
            document.querySelectorAll("a, button, [role='button']"),
          );

          const target = clickable.find(
            (el) => normalize(el.textContent) === targetText,
          );

          if (target) {
            (target as HTMLElement).click();
            return true;
          }

          return false;
        }, bestMatch);

        if (clicked) {
          return {
            status: "clicked-semantic",
            text: bestMatch,
          };
        }
      }
    }
  }

  if (action === "type") {
    narrate(`Escribiendo ${decision.text}`);
    await smartType(page, decision.target, decision.text);

    await page.keyboard.press("Enter");
  }

  if (action === "navigate") {
    narrate("Abriendo página");
    await page.goto(decision.url, {
      waitUntil: "domcontentloaded",
    });

    const links = await extractLinks(page);
    storeLinks(links);
  }

  if (action === "read_page") {
    const content = await extractReadableContent(page);

    const answer = await readPageContent(command, content);

    if (answer) addConversation("assistant", answer);

    const voice = answer?.slice(0, 700);

    narrate(voice);

    return {
      status: "read",
      response: answer,
      // voice,
    };
  }

  return {
    status: "completed",
    action,
  };
}
