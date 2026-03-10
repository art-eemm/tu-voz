export function TranscriptPanel({ transcript }) {
  return (
    <div className="bg-zinc-900 p-4 rounded-xl">
      <p className="text-sm text-gray-400">Transcripción</p>

      <p className="text-lg">{transcript || "Esperando comando..."}</p>
    </div>
  );
}
