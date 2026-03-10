type Listener = (text: string) => void;

declare global {
  var __VOICE_LISTENERS__: Listener[] | undefined;
}

if (!globalThis.__VOICE_LISTENERS__) {
  globalThis.__VOICE_LISTENERS__ = [];
}

export function pushVoiceEvent(text: string) {
  if (!text) return;

  console.log("VOICE EVENT:", text);

  for (const listener of globalThis.__VOICE_LISTENERS__!) {
    listener(text);
  }
}

export function subscribeVoice(listener: Listener) {
  globalThis.__VOICE_LISTENERS__!.push(listener);

  return () => {
    globalThis.__VOICE_LISTENERS__ = globalThis.__VOICE_LISTENERS__!.filter(
      (l) => l !== listener,
    );
  };
}
