import { browserController } from "@/browser/playwrightController";
import { clickByText } from "@/browser/actions";

export async function POST(req: Request) {
  const { text } = await req.json();

  const page = await browserController.getPage();

  await clickByText(page, text);

  return Response.json({
    status: "clicked",
    text,
  });
}
