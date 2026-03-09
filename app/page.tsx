"use client";

import { useVoice } from "./hooks/useVoice";

export default function Page() {
  useVoice(async (command) => {
    console.log("COMMAND", command);

    await fetch("/api/command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ command }),
    });
  });

  return (
    <div>
      <h1>Tu Voz Guía</h1>
      <p>Escuchando comandos...</p>
    </div>
  );
}
