export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string; // 👈 nuova data opzionale
};