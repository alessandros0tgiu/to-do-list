// lib/storage.ts
import { Todo } from "@/types/todo";

const STORAGE_KEY = "my-todos-v1";

export const getTodos = (): Todo[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTodos = (todos: Todo[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }
};