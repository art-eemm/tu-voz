export const resultStore: Record<string, any> = {};

export function registerResults(results: any[]) {
  results.forEach((r) => {
    resultStore[r.id] = r;
  });
}

export function getResults(id: string) {
  return resultStore[id];
}
