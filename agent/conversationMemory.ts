type Message = {
  role: "user" | "assistant";
  content: string;
};

let memory: Message[] = [];

const MAX_MEMORY = 10;

export function addMessage(role: "user" | "assistant", content: string) {
  memory.push({ role, content });

  if (memory.length > MAX_MEMORY) {
    memory.shift();
  }
}

export function getConversation() {
  return memory;
}

export function clearConversation() {
  memory = [];
}
