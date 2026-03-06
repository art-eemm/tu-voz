import { browserController } from "@/browser/playwrightController";
import { refreshOverlay } from "@/browser/overlayManager";

export async function GET() {
  await browserController.start();

  const page = await browserController.getPage();

  page.on("framenavigated", async () => {
    await refreshOverlay(page);
  });

  await page.goto("https://wikipedia.org", {
    waitUntil: "domcontentloaded",
  });

  await refreshOverlay(page);

  return Response.json({
    status: "browser started",
  });
}
