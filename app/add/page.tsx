"use client";
import { useState, useEffect } from "react";
import { TodoForm } from "@/components/todo-form";
import { CategoryManager } from "@/components/CategoryManager";
import { getTodos, saveTodos } from "@/lib/storage";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { parseInput } from "@/lib/parse";
import "./add.css";

export default function AddPage() {
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Assicura che il CSS e il layout siano pronti prima di renderizzare componenti complessi
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAdd = (text: string, dueDate?: string, dueTime?: string, category?: string) => {
    if (!text || text.trim().length === 0) {
      setError("Il testo del task non può essere vuoto");
      return;
    }
    
    setError(null);
    const todos = getTodos();
    const parsed = parseInput(text);

    saveTodos([
      {
        id: crypto.randomUUID(),
        text: parsed.text, 
        completed: false,
        dueDate: parsed.dueDate || dueDate || undefined,
        dueTime: dueTime || undefined,
        category: category || "Nessuna",
      },
      ...todos,
    ]);

    setRefreshKey(prev => prev + 1);
  };

  if (!isMounted) return null; // Previene il flash di contenuto senza CSS

  return (
    <main className="page-wrapper add-page-container">
      <div className="glass-panel form-container">
        <header className="form-header">
          <Link href="/" className="btn-ghost">← Dashboard</Link>
          <Link href="/list" className="btn-ghost secondary">Vai alla Lista →</Link>
        </header>

        <div className="form-content">
          <h1 className="h1-super">Crea Task</h1>
          
          {error && <div className="error-message">{error}</div>}

          <div key={refreshKey} className="fade-in">
            <TodoForm onAdd={handleAdd} />
            <div className="separator">oppure gestisci</div>
            <CategoryManager />
          </div>
        </div>
      </div>
    </main>
  );
}