export interface Todo {
  id: string;
  title: string;
  description?: string;
  color: string;
  time: string;
  completed: boolean;
  isTimerTask?: boolean;
  timerDuration?: number; // in seconds
  timerStartTime?: string;
}

export type TodoContextType = {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, "id" | "completed">) => void;
  toggleTodo: (id: string) => void;
  updateTimerStatus: (id: string, isActive: boolean) => void;
};
