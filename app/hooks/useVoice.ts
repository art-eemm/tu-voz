"use client";

import { useEffect, useRef } from "react";
import { isSpeaking } from "../utils/voice";

export function useVoice(onCommand: (text: string) => void) {
  const recognitionRef = useRef<any>(null);

  function startListening() {
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

      onCommand(text);
    };

    recognition.start();

    recognitionRef.current = recognition;
  }

  function stopListening() {
    recognitionRef.current?.stop();
  }

  return {
    startListening,
    stopListening,
  };
}
