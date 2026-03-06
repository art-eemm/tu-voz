import { browserController } from "@/browser/playwrightController";
import { extractInteractiveElements } from "@/browser/domExtractor";

export async function GET() {
  const page = await browserController.getPage();

  await page.waitForLoadState("domcontentloaded");

  const elements = await extractInteractiveElements(page);

  return Response.json(elements);
}
