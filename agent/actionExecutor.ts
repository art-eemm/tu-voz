import { smartClick, smartType } from "@/browser/actions";
import { extractReadableContent } from "@/browser/contentExtractor";
import { readPageContent } from "./pageReader";
import { pushVoiceEvent } from "./voiceBus";
import { addConversation } from "./agentState";

export async function executeAction(page, decision, command, context) {
  const action = decision.action?.toLowerCase();

  if (action === "click") {
    if (!isNaN(Number(decision.target))) {
      const index = Number(decision.target) - 1;

      const element = context.elements[index];

      if (!element) return { status: "element-not-found" };

      await page.evaluate(
        ({ x, y, w, h }) => {
          const el = document.elementFromPoint(x + w / 2, y + h / 2);

          if (el) {
            (el as HTMLElement).click();
          }
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

    await smartClick(page, decision.target);
  }

  if (action === "type") {
    await smartType(page, decision.target, decision.text);

    await page.keyboard.press("Enter");
  }

  if (action === "navigate") {
    await page.goto(decision.url, {
      waitUntil: "domcontentloaded",
    });
  }

  if (action === "read_page") {
    const content = await extractReadableContent(page);

    const answer = await readPageContent(command, content);

    if (answer) addConversation("assistant", answer);

    const voice = answer?.slice(0, 700);

    pushVoiceEvent(voice);

    return {
      status: "read",
      response: answer,
      voice,
    };
  }

  return {
    status: "completed",
    action,
  };
}
