export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
  dueTime?: string; // 👈 Aggiunto orario
};