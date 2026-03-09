import { Page } from "playwright";

export async function drawDebugOverlay(page: Page, data: any) {
  await page.evaluate((data) => {
    const old = document.getElementById("ai-debug");
    if (old) old.remove();

    const panel = document.createElement("div");

    panel.id = "ai-debug";

    panel.style.position = "fixed";
    panel.style.right = "10px";
    panel.style.bottom = "100px";
    panel.style.width = "320px";
    panel.style.maxHeight = "40vh";

    panel.style.overflow = "auto";

    panel.style.background = "rgba(0,0,0,0.85)";
    panel.style.color = "white";
    panel.style.fontFamily = "monospace";
    panel.style.fontSize = "12px";

    panel.style.padding = "10px";
    panel.style.borderRadius = "8px";
    panel.style.zIndex = "999999";

    panel.innerText =
      "COMMAND:\n" +
      (data.command || "") +
      "\n\nPLAN:\n" +
      JSON.stringify(data.plan || [], null, 2) +
      "\n\nSTEP:\n" +
      JSON.stringify(data.step || {}, null, 2) +
      "\n\nREFLECTION:\n" +
      JSON.stringify(data.reflection || {}, null, 2);

    document.body.appendChild(panel);
  }, data);
}
