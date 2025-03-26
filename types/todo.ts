export interface Todo {
  id: string;
  title: string;
  color: string;
  time: string;
  completed: boolean;
}

export type TodoContextType = {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, "id" | "completed">) => void;
  toggleTodo: (id: string) => void;
};
