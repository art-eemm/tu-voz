let queue: string[] = [];
let speaking = false;

function splitText(text: string, maxLength = 160) {
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];

  const parts: string[] = [];

  for (const s of sentences) {
    if (s.length <= maxLength) {
      parts.push(s.trim());
      continue;
    }

    const words = s.split(" ");
    let current = "";

    for (const w of words) {
      if ((current + w).length > maxLength) {
        parts.push(current.trim());
        current = "";
      }

      current += w + " ";
    }

    if (current.trim()) parts.push(current.trim());
  }

  return parts;
}

function speakNext() {
  if (!queue.length) {
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
    setTimeout(() => {
      speakNext();
    }, 150);
  };

  utterance.onerror = () => {
    speaking = false;
    speakNext();
  };

  window.speechSynthesis.speak(utterance);
}

export function speak(text: string) {
  if (!text) return;

  const parts = splitText(text);

  queue.push(...parts);

  if (!speaking) {
    window.speechSynthesis.cancel();

    setTimeout(() => {
      speakNext();
    }, 100);
  }
}

export function isSpeaking() {
  return speaking;
}
