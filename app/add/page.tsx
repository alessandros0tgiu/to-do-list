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

  if (!isMounted) return null;

  return (
    <main className="add-page-container">
      <div className="add-glass-panel">
        <header className="add-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', width: '100%' }}>
          
          {/* LOGO E NOME A SINISTRA */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
            <div className="brand-icon" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/favicon.ico" alt="L" style={{ width: '100%', height: '100%' }} />
            </div>
            <h2 className="brand-name" style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>TaskFlow</h2>
          </Link>

          {/* BOTTONI SPOSTATI A DESTRA */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/" className="btn-back-home" style={{ whiteSpace: 'nowrap' }}>← Dashboard</Link>
            <Link href="/list" className="btn-go-list" style={{ whiteSpace: 'nowrap' }}>Vai alla Lista →</Link>
          </div>
        </header>

        <div className="form-content">
          <h1 className="add-title">Crea Task</h1>

          {error && <div className="error-message">{error}</div>}

          <div key={refreshKey} className="fade-in">
            <TodoForm onAdd={handleAdd} refreshTrigger={refreshKey} />
            <div className="separator">Oppure</div>
            <CategoryManager onCategoryChange={() => setRefreshKey(prev => prev + 1)} />
          </div>
        </div>
      </div>
    </main>
  );
}