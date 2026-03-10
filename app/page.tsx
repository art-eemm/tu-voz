"use client";

import { useEffect, useState } from "react";
import { useVoice } from "./hooks/useVoice";
import { speak } from "./utils/voice";
import { motion } from "framer-motion";

import { TranscriptPanel } from "./components/transcript-panel";
import { BrowserStatus } from "./components/browser-status";
import { CommandHistory } from "./components/command-history";
import { VoiceButton } from "./components/voice-button";

export default function Page() {
  const [browserStatus, setBrowserStatus] = useState("loading");
  const [transcript, setTranscript] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [response, setResponse] = useState("");
  const [listening, setListening] = useState(false);

  useEffect(() => {
    async function startBrowser() {
      setBrowserStatus("loading");
      await fetch("/api/browser/start");
      setBrowserStatus("ready");
    }

    startBrowser();
  }, []);

  const { startListening, stopListening } = useVoice(async (command) => {
    setTranscript(command);

    setHistory((prev) => [command, ...prev]);

    const res = await fetch("/api/command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ command }),
    });

    const data = await res.json();

    if (data.voice) {
      setResponse(data.voice);
      speak(data.voice);
    }
  });

  function toggleVoice() {
    if (listening) {
      stopListening();
      setListening(false);
    } else {
      startListening();
      setListening(true);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">Tu Voz Guía</h1>

        <BrowserStatus status={browserStatus} />

        <div className="flex justify-center py-6">
          <VoiceButton listening={listening} onClick={toggleVoice} />
        </div>

        <TranscriptPanel transcript={transcript} />

        <div className="bg-zinc-900 p-4 rounded-xl">
          <p className="text-sm text-gray-400 mb-1">Respuesta del sistema</p>

          <motion.p
            key={response}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-lg"
          >
            {response || "-"}
          </motion.p>
        </div>

        <CommandHistory history={history} />
      </div>
    </main>
  );
}
