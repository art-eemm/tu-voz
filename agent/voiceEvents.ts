const events: string[] = [];

export function pushVoiceEvent(text: string) {
  if (!text) return;

  events.push(text);

  if (events.length > 20) {
    events.shift();
  }
}

export function popVoiceEvent() {
  return events.shift();
}
