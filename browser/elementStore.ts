export const elementStore: Record<string, any> = {};

export function registerElements(elements: any[]) {
  for (const el of elements) {
    elementStore[el.id] = el;
  }
}

export function getElement(id: string) {
  console.log("GET ELEMENT:", id, elementStore[id]);
  return elementStore[id];
}
