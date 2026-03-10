export function detectContextCommand(command: string) {
  const lower = command.toLowerCase();

  const match = lower.match(/(primer|segundo|tercer|cuarto|quinto|\d+)/);

  if (lower.includes("resultado")) {
    const index = parseIndex(match?.[0]);

    return {
      type: "open_result_index",
      index,
    };
  }

  if (lower.includes("botón") || lower.includes("boton")) {
    const index = parseIndex(match?.[0]);

    return {
      type: "click_button_index",
      index,
    };
  }

  return null;
}

function parseIndex(word?: string) {
  if (!word) return 1;

  const map: any = {
    primer: 1,
    primero: 1,
    segundo: 2,
    tercer: 3,
    tercero: 3,
    cuarto: 4,
    quinto: 5,
  };

  if (map[word]) return map[word];

  const num = parseInt(word);

  if (!isNaN(num)) return num;

  return 1;
}
