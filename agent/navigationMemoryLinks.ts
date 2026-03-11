type LinkMemory = {
  text: string;
  href: string;
};

let memory: LinkMemory[] = [];

export function storeLinks(links: LinkMemory[]) {
  for (const link of links) {
    const exists = memory.find(
      (l) => l.text.toLowerCase() === link.text.toLowerCase(),
    );

    if (!exists) {
      memory.push(link);
    }
  }

  // evitar memoria infinita
  if (memory.length > 200) {
    memory = memory.slice(-200);
  }
}

export function findLink(query: string) {
  const q = query.toLowerCase();

  const match = memory.find((l) => l.text.toLowerCase().includes(q));

  return match || null;
}

export function getMemory() {
  return memory;
}
