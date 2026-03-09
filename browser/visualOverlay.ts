import { Page } from "playwright";

export async function drawOverlay(page: Page, elements: any[]) {
  await page.evaluate((elements) => {
    const old = document.getElementById("ai-overlay");
    if (old) old.remove();

    const container = document.createElement("div");
    container.id = "ai-overlay";

    container.style.position = "absolute";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.zIndex = "999999";
    container.style.pointerEvents = "none";

    elements.forEach((el) => {
      const marker = document.createElement("div");

      const box = document.createElement("div");

      box.style.position = "absolute";
      box.style.left = el.x + "px";
      box.style.top = el.y + "px";
      box.style.width = el.width + "px";
      box.style.height = el.height + "px";

      box.style.border = "2px dashed red";
      box.style.pointerEvents = "none";

      container.appendChild(box);

      // usar el ID real
      marker.innerText = el.id;

      marker.style.position = "absolute";
      marker.style.left = el.x + "px";
      marker.style.top = el.y + "px";

      marker.style.background = "rgba(255,0,0,0.9)";
      marker.style.color = "white";

      marker.style.fontSize = "11px";
      marker.style.fontWeight = "bold";

      marker.style.padding = "3px 6px";
      marker.style.borderRadius = "6px";

      marker.style.border = "1px solid white";

      marker.style.boxShadow = "0 0 4px rgba(0,0,0,0.5)";

      marker.style.fontFamily = "monospace";

      container.appendChild(marker);
    });

    document.body.appendChild(container);
  }, elements);
}
