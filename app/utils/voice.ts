let queue: string[] = [];
let speaking = false;

function splitText(text: string, maxLength = 180) {
  const parts: string[] = [];

  let current = "";

  const words = text.split(" ");

  for (const word of words) {
    if ((current + word).length > maxLength) {
      parts.push(current.trim());
      current = "";
    }

    current += word + " ";
  }

  if (current.trim().length) {
    parts.push(current.trim());
  }

  return parts;
}

function speakNext() {
  if (queue.length === 0) {
    speaking = false;
    return;
  }

  speaking = true;

  const text = queue.shift()!;

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = "es-ES";
  utterance.rate = 1;
  utterance.pitch = 1;

  utterance.onend = () => {
    speakNext();
  };

  window.speechSynthesis.speak(utterance);
}

export function speak(text: string) {
  if (!text) return;

  const parts = splitText(text);

  queue.push(...parts);

  if (!speaking) {
    speakNext();
  }
}

export function isSpeaking() {
  return speaking;
}
