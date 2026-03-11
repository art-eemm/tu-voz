export function generateStableId(el: {
  tag?: string;
  label?: string;
  placeholder?: string;
  name?: string;
  domId?: string;
  x?: number;
  y?: number;
}) {
  const text = (el.label || el.placeholder || el.name || el.domId || "")
    .toLowerCase()
    .trim();

  const base = `${el.tag}_${text}_${Math.round(el.x || 0)}_${Math.round(el.y || 0)}`;

  let hash = 0;

  for (let i = 0; i < base.length; i++) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0;
  }

  return "el_" + Math.abs(hash);
}
