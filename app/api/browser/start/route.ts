import { browserController } from "@/browser/playwrightController";

export async function GET() {
  const page = await browserController.start();

  await browserController.goto("https://wikipedia.org");

  return Response.json({
    status: "browser started",
  });
}
