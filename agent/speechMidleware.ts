export function speechForAction(action: string, data?: any) {
  switch (action) {
    case "search":
      return `Buscando ${data?.query || ""}`;

    case "navigate":
      return "Abriendo página";

    case "click":
      return "Haciendo clic";

    case "scroll":
      return "Desplazando la página";

    case "go_back":
      return "Regresando a la página anterior";

    case "read_page":
      return data?.text;

    case "new_tab":
      return "Nueva pestaña abierta";

    case "switch_tab":
      return `Cambiando a la pestaña ${data.index}`;

    case "close_tab":
      return "Pestaña cerrada";

    default:
      return "";
  }
}
