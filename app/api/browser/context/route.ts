import { browserController } from "@/browser/playwrightController";
import { buildPageContext } from "@/browser/pageContext";

export async function GET() {
  const page = await browserController.getPage();

  const context = await buildPageContext(page);

  return Response.json(context);
}
