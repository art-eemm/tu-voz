"use client";

import { useEffect, useRef } from "react";

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
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const text = event.results[event.results.length - 1][0].transcript;

      console.log("VOICE COMMAND:", text);

      onCommand(text);
    };

    recognition.start();

    recognitionRef.current = recognition;
  }, [onCommand]);
}
