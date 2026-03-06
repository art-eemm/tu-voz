export function rankElements(elements: any[]) {
  return elements
    .map((el) => {
      let score = 0;

      // tamaño
      if (el.width > 200) score += 2;
      if (el.height > 30) score += 1;

      // posición en viewport
      if (el.y < 800) score += 2;

      const text = (
        el.label +
        el.placeholder +
        el.name +
        el.domId
      ).toLowerCase();

      // detección de buscador
      if (el.tag === "input" && el.type === "search") score += 10;

      if (text.includes("search")) score += 8;

      if (text.includes("buscar")) score += 8;

      if (text.includes("query")) score += 5;

      if (text.includes("find")) score += 5;

      // botones de búsqueda
      if (el.tag === "button" && text.includes("search")) score += 6;

      // inputs en general
      if (el.tag === "input") score += 3;

      return {
        ...el,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);
}
