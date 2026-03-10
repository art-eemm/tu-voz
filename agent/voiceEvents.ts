declare global {
  var __VOICE_EVENT__: string | null | undefined;
}

if (globalThis.__VOICE_EVENT__ === undefined) {
  globalThis.__VOICE_EVENT__ = null;
}

export function pushVoiceEvent(text: string) {
  if (!text) return;

  console.log("VOICE EVENT:", text);

  globalThis.__VOICE_EVENT__ = text;
}

export function getVoiceEvent() {
  const event = globalThis.__VOICE_EVENT__;

  globalThis.__VOICE_EVENT__ = null;

  return event;
}
