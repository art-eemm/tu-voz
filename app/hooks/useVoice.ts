"use client";

import { useEffect, useRef } from "react";
import { isSpeaking, speak } from "../utils/voice";

export function useVoice(onCommand: (text: string) => void) {
  const recognitionRef = useRef<any>(null);
  const commandRef = useRef(onCommand);

  // mantener referencia estable del callback
  useEffect(() => {
    commandRef.current = onCommand;
  }, [onCommand]);

  useEffect(() => {
    if (recognitionRef.current) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "es-ES";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log("VOICE STARTED");
    };

    recognition.onend = () => {
      console.log("VOICE STOPPED");
    };

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];

      if (!result || !result[0]) return;

      const text = result[0].transcript.trim().toLowerCase();

      console.log("VOICE COMMAND:", text);

      if (isSpeaking()) return;

      commandRef.current(text);
    };

    recognitionRef.current = recognition;
  }, []);

  // escuchar eventos de voz del backend
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/voice-events");
        const data = await res.json();

        if (data?.text) {
          speak(data.text);
        }
      } catch {}
    }, 800);

    return () => clearInterval(interval);
  }, []);

  function startListening() {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.start();
    } catch {}
  }

  function stopListening() {
    recognitionRef.current?.stop();
  }

  return {
    startListening,
    stopListening,
  };
}
