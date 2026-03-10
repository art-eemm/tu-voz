"use client";

import { useEffect, useRef } from "react";
import { isSpeaking } from "../utils/voice";

export function useVoice(onCommand: (text: string) => void) {
  const recognitionRef = useRef<any>(null);
  const listeningRef = useRef(false);

  useEffect(() => {
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
      listeningRef.current = true;
    };

    recognition.onend = () => {
      console.log("VOICE STOPPED");
      listeningRef.current = false;

      // escuchar continuamente
      // if (!isSpeaking()) {
      //   try {
      //     recognition.start();
      //   } catch {}
      // }
    };

    recognition.onresult = (event: any) => {
      if (isSpeaking()) return;

      const result = event.results[event.results.length - 1];

      if (!result || !result[0]) return;

      const text = result[0].transcript.trim().toLowerCase();

      console.log("VOICE COMMAND:", text);

      onCommand(text);
    };

    recognitionRef.current = recognition;
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
