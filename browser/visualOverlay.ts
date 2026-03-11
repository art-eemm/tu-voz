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
    container.style.zIndex = "999999";
    container.style.pointerEvents = "none";

    elements.forEach((el, index) => {
      const marker = document.createElement("div");

      marker.innerText = String(index + 1);

      marker.style.position = "absolute";
      marker.style.left = el.x + "px";
      marker.style.top = el.y + "px";

      marker.style.background = "red";
      marker.style.color = "white";
      marker.style.fontSize = "12px";
      marker.style.padding = "2px 6px";
      marker.style.borderRadius = "4px";
      marker.style.fontWeight = "bold";

      container.appendChild(marker);
    });

    document.body.appendChild(container);
  }, elements);
}
