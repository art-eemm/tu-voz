import { smartClick, smartType } from "@/browser/actions";
import { extractReadableContent } from "@/browser/contentExtractor";
import { readPageContent } from "./pageReader";
import { pushVoiceEvent } from "./voiceBus";
import { addConversation } from "./agentState";

export async function executeAction(page, decision, command) {
  const action = decision.action?.toLowerCase();

  if (action === "click") {
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
