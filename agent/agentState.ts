type Message = {
  role: "user" | "assistant";
  content: string;
};

type AgentState = {
  lastCommand: string | null;
  lastPage: string | null;
  lastAction: string | null;
  conversation: Message[];
};

let state: AgentState = {
  lastCommand: null,
  lastPage: null,
  lastAction: null,
  conversation: [],
};

export function updateAgentState(data: Partial<AgentState>) {
  state = {
    ...state,
    ...data,
  };
}

export function addConversation(role: "user" | "assistant", content: string) {
  state.conversation.push({ role, content });

  state.conversation = state.conversation.slice(-8);
}

export function getAgentState() {
  return state;
}
