type Listener = (text: string) => void;

declare global {
  var __VOICE_LISTENERS__: Set<Listener> | undefined;
  var __LAST_VOICE__: string | undefined;
}

if (!globalThis.__VOICE_LISTENERS__) {
  globalThis.__VOICE_LISTENERS__ = new Set();
}

export function pushVoiceEvent(text: string) {
  if (!text) return;

  // evitar repetir mismo mensaje
  if (globalThis.__LAST_VOICE__ === text) return;

  globalThis.__LAST_VOICE__ = text;

  console.log("VOICE EVENT:", text);

  for (const listener of [...globalThis.__VOICE_LISTENERS__!]) {
    try {
      listener(text);
    } catch {
      globalThis.__VOICE_LISTENERS__!.delete(listener);
    }
  }
}

export function subscribeVoice(listener: Listener) {
  globalThis.__VOICE_LISTENERS__!.add(listener);

  return () => {
    globalThis.__VOICE_LISTENERS__!.delete(listener);
  };
}
