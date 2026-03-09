export function speak(text: string) {
  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = "es-ES";

  window.speechSynthesis.speak(utterance);
}
