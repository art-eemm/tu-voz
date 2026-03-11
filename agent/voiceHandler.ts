import { pushVoiceEvent } from "./voiceBus";
import { speechForAction } from "./speechMidleware";
import { addMessage } from "./conversationMemory";

export function speakAction(type: string, data?: any) {
  const voice = speechForAction(type, data);

  if (!voice) return;

  addMessage("assistant", voice);

  pushVoiceEvent(voice);
}
