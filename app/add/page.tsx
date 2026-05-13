"use client";
import { useState, useEffect } from "react";
import { TodoForm } from "@/components/todo-form";
import { CategoryManager } from "@/components/CategoryManager";
import { getTodos, saveTodos } from "@/lib/storage";
import Link from "next/link";
import { parseInput } from "@/lib/parse";
import "./add.css";

export default function AddPage() {
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Questo useEffect assicura che la pagina venga renderizzata 
  // solo quando il client è pronto, evitando il cambio colori al refresh
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

    // Reset del form senza ricaricare la pagina
    setRefreshKey(prev => prev + 1);
  };

  // Se la pagina sta ancora caricando "lato server", non mostriamo nulla
  // per evitare il glitch dei colori
  if (!isMounted) return null;

  return (
    <main className="add-page-container">
      <div className="add-glass-panel">
        <header className="add-header">
          <Link href="/" className="btn-back-home">← Dashboard</Link>
          <Link href="/list" className="btn-go-list">Vai alla Lista →</Link>
        </header>

        <div className="form-content">
          <h1 className="add-title">Crea Task</h1>

          {error && <div className="error-message">{error}</div>}

          <div key={refreshKey} className="fade-in">
            <TodoForm onAdd={handleAdd} />
            <div className="separator">Oppure gestisci</div>
            <CategoryManager />
          </div>
        </div>
      </div>
    </main>
  );
}