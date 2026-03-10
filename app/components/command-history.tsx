export function CommandHistory({ history }) {
  return (
    <div className="bg-zinc-900 p-4 rounded-xl">
      <p className="text-sm text-gray-400 mb-2">Historial de comandos</p>
      <div className="space-y-1">
        {history.length === 0 && (
          <p className="text-gray-500 text-sm">Sin comandos aún</p>
        )}

        {history.map((cmd, i) => (
          <p key={i} className="text-sm">
            {cmd}
          </p>
        ))}
      </div>
    </div>
  );
}
