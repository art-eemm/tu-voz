"use client";

import { useVoice } from "./hooks/useVoice";

export default function Page() {
  useVoice(async (command) => {
    await fetch("/api/command", {
      method: "POST",
      body: JSON.stringify({ command }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  return (
    <div>
      <h1>Tu Voz Guía</h1>
      <p>Escuchando comandos...</p>
    </div>
  );
}
