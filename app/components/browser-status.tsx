export function BrowserStatus({ status }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-4 h-4 rounded-full ${status === "ready" ? "bg-green-500" : "bg-yellow-500"}`}
      />
      <span>
        {status === "ready" ? "Navegador listo" : "Inicializando navegador"}
      </span>
    </div>
  );
}
