export async function visionClick(page, element) {
  if (!element) return false;

  const x = element.x + element.width / 2;
  const y = element.y + element.height / 2;

  const clicked = await page.evaluate(
    ({ x, y }) => {
      const el = document.elementFromPoint(x, y);

      if (!el) return false;

      const clickable = el.closest(
        "a, button, [role='button'], input, textarea",
      );

      if (!clickable) return false;

      clickable.click();

      return true;
    },
    { x, y },
  );

  return clicked;
}
