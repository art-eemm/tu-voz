type Message = {
  role: "user" | "assistant";
  content: string;
};

let history: Message[] = [];

export function addUserMessage(text: string) {
  history.push({
    role: "user",
    content: text,
  });

  history = history.slice(-6);
}

export function addAssistantMessage(text: string) {
  history.push({
    role: "assistant",
    content: text,
  });

  history = history.slice(-10);
}

export function getConversationHistory() {
  return history;
}
