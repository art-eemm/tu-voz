import { pushVoiceEvent } from "./voiceBus";

export function narrate(text?: string) {
  if (!text) return;

  const clean = text.trim();

  if (!clean) return;

  console.log("VOICE:", clean);

  pushVoiceEvent(clean);
}
