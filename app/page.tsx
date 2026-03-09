"use client";

import { useVoice } from "./hooks/useVoice";
import { speak } from "./utils/voice";

export default function Page() {
  const { startListening } = useVoice(async (command) => {
    console.log("COMMAND", command);
    const res = await fetch("/api/command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ command }),
    });

    const data = await res.json();

    console.log("AGENT RESPONSE:", data);

    if (data.voice) speak(data.voice);
  });

  return (
    <div style={{ padding: 40 }}>
      <h1>Tu Voz Guía</h1>

      <button
        onClick={startListening}
        style={{
          fontSize: 22,
          padding: "15px 30px",
          borderRadius: 10,
        }}
      >
        🎤 Hablar
      </button>
    </div>
  );
}
