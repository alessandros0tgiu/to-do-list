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
    // Validazione task vuoto
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

    // RESET LOCALE: Invece di router.push, forziamo il reset del form cambiando la key
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="page-wrapper">
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" className="btn-ghost">← Dashboard</Link>
          {/* Nuovo tasto per andare alla lista */}
          <Link href="/list" className="btn-ghost" style={{ background: '#f1f5f9' }}>Vai alla Lista →</Link>
        </div>

        <div style={{ marginTop: "24px" }}>
          <h1 className="h1-super">Crea Task</h1>
          
          {/* Messaggio di errore per i task */}
          {error && <div className="error-message" style={{ color: '#ef4444', marginBottom: '10px', fontSize: '0.9rem' }}>{error}</div>}

          <TodoForm key={refreshKey} onAdd={handleAdd} />
          
          <CategoryManager onCategoryChange={() => setRefreshKey(prev => prev + 1)} />
        </div>
      </div>
    </div>
  );
}