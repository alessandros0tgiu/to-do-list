export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
  dueTime?: string;
  category?: string; // Può essere il nome di una cartella o "Nessuna"
};