let speaking = false;

function splitText(text: string, max = 180) {
  const parts = [];
  let current = "";

  const words = text.split(" ");

  for (const word of words) {
    if ((current + word).length > max) {
      parts.push(current);
      current = "";
    }

    current += word + " ";
  }

  if (current) parts.push(current);

  return parts;
}

export function speak(text: string) {
  if (!text) return;

  const chunks = splitText(text);

  window.speechSynthesis.cancel();

  speaking = true;

  chunks.forEach((chunk, i) => {
    const utterance = new SpeechSynthesisUtterance(chunk);

    utterance.lang = "es-ES";
    utterance.rate = 1;

    if (i === chunks.length - 1) {
      utterance.onend = () => {
        speaking = false;
      };
    }

    window.speechSynthesis.speak(utterance);
  });
}

export function isSpeaking() {
  return speaking;
}
