"use client";
import { useState } from "react";
import { TodoForm } from "@/components/todo-form";
import { CategoryManager } from "@/components/CategoryManager";
import { getTodos, saveTodos } from "@/lib/storage";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { parseInput } from "@/lib/parse";

export default function AddPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdd = (text: string, dueDate?: string, dueTime?: string, category?: string) => {
    if (!text || text.trim().length === 0) {
      setError("Il testo non può essere vuoto");
      return;
    }
    const todos = getTodos();
    const parsed = parseInput(text);

    saveTodos([
      {
        id: crypto.randomUUID(),
        text: parsed.text, 
        completed: false,
        dueDate: parsed.dueDate || dueDate || undefined,
        dueTime: dueTime || undefined, // Orario salvato correttamente
        category: category || "Nessuna",
      },
      ...todos,
    ]);
    router.push("/list");
  };

  return (
    <div className="page-wrapper">
      <div className="glass-panel">
        <Link href="/" className="btn-ghost">← Dashboard</Link>
        <div style={{ marginTop: "24px" }}>
          <h1 className="h1-super">Crea Task</h1>
          {error && <div className="error-message">{error}</div>}

          <TodoForm key={refreshKey} onAdd={handleAdd} />
          
          <CategoryManager onCategoryChange={() => setRefreshKey(prev => prev + 1)} />
        </div>
      </div>
    </div>
  );
}