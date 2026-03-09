export function rankElements(elements: any[]) {
  const viewportWidth = 1280;
  const viewportHeight = 800;

  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2;

  return elements
    .map((el) => {
      let score = 0;

      const label = (el.label || "").toLowerCase();
      const placeholder = (el.placeholder || "").toLowerCase();
      const name = (el.name || "").toLowerCase();
      const domId = (el.domId || "").toLowerCase();

      const text = `${label} ${placeholder} ${name} ${domId}`;

      if (el.y < viewportHeight && el.y + el.height > 0) {
        score += 2;
      }

      const area = el.width * el.height;

      if (area > 20000) score += 3;
      else if (area > 8000) score += 2;
      else if (area > 2000) score += 1;

      const elementCenterX = el.x + el.width / 2;
      const elementCenterY = el.y + el.height / 2;

      const distance = Math.sqrt(
        Math.pow(elementCenterX - centerX, 2) +
          Math.pow(elementCenterY - centerY, 2),
      );

      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

      const centerScore = 1 - distance / maxDistance;

      score += centerScore * 4;

      if (el.tag === "input" && el.type === "search") score += 10;

      if (text.includes("search")) score += 8;
      if (text.includes("buscar")) score += 8;

      if (text.includes("query")) score += 5;
      if (text.includes("find")) score += 5;

      if (el.tag === "button" && text.includes("search")) score += 6;

      if (el.tag === "input") score += 3;
      if (el.tag === "button") score += 2;
      if (el.tag === "a") score += 1;

      if (el.type === "navigation") score += 4;
      if (el.type === "content") score += 3;
      if (el.type === "result") score += 2;
      if (el.type === "utility") score -= 1;

      return {
        ...el,
        score: Math.round(score * 100) / 100,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);
}
