type TaskMemory = {
  lastCommand: string | null;
  lastPage: string | null;
  lastAction: string | null;
};

let memory: TaskMemory = {
  lastCommand: null,
  lastPage: null,
  lastAction: null,
};

export function updateMemory(data: Partial<TaskMemory>) {
  memory = {
    ...memory,
    ...data,
  };
}

export function getMemory() {
  return memory;
}
