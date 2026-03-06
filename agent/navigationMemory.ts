// guardamos ultimo link y ultimo comando

type NavigationState = {
  url: string | null;
  title: string | null;
  lastCommand: string | null;
};

let state: NavigationState = {
  url: null,
  title: null,
  lastCommand: null,
};

export function updateNavigationState(page) {
  state.url = page.url();
}

export function setLastCommand(command: string) {
  state.lastCommand = command;
}

export function getNavigationState() {
  return state;
}
