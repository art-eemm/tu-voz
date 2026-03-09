import { browserController } from "@/browser/playwrightController";

export async function GET() {
  const page = await browserController.getPage();

  const title = await page.title();
  const url = page.url();

  return Response.json({
    title,
    url,
  });
}
