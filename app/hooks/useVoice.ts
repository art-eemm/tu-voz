"use client";

import { useEffect, useRef } from "react";
import { isSpeaking } from "../utils/voice";

export function useVoice(onCommand: (text: string) => void) {
  const recognitionRef = useRef<any>(null);

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
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;

      console.log("VOICE COMMAND:", text);

      if (!isSpeaking()) {
        onCommand(text);
      }
    };

    recognition.onend = () => {
      console.log("Voice recognition ended");
    };

    recognitionRef.current = recognition;
  }, [onCommand]);

  const startListening = () => {
    try {
      recognitionRef.current?.start();
    } catch {}
  };

  return { startListening };
}
