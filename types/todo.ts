export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  dueDate?: string;
  dueTime?: string;
  deletedAt?: number; // Aggiungi questa riga
}