import React, { createContext, useContext, useState } from "react";
import { Todo, TodoContextType } from "@/types/todo";

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (todo: Omit<Todo, "id" | "completed">) => {
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
      completed: false,
      timerStartTime: todo.isTimerTask ? new Date().toISOString() : undefined,
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const updateTimerStatus = (id: string, isActive: boolean) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            timerStartTime: isActive ? new Date().toISOString() : undefined,
          };
        }
        return todo;
      })
    );
  };

  return (
    <TodoContext.Provider
      value={{ todos, addTodo, toggleTodo, updateTimerStatus }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
}
