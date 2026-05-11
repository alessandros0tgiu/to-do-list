import { Todo } from "@/types/todo";

const STORAGE_KEY = "my-todos-v1";
const CAT_STORAGE_KEY = "my-categories-v1";

export const getTodos = (): Todo[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  let todos: Todo[] = data ? JSON.parse(data) : [];

  // Pulizia automatica Cestino: rimuove task eliminati da più di 24 ore
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  
  const cleanedTodos = todos.filter(t => {
    if (t.deletedAt) {
      return (now - t.deletedAt) < oneDay;
    }
    return true;
  });

  // Se abbiamo rimosso task scaduti dal cestino, salviamo lo stato pulito
  if (cleanedTodos.length !== todos.length) {
    saveTodos(cleanedTodos);
  }

  return cleanedTodos;
};

export const saveTodos = (todos: Todo[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }
};

export const getCategories = (): string[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CAT_STORAGE_KEY);
  return data ? JSON.parse(data) : []; 
};

export const saveCategories = (categories: string[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CAT_STORAGE_KEY, JSON.stringify(categories));
  }
};