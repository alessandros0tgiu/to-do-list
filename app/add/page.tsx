"use client";

import { useState } from "react";
import { TodoForm } from "@/components/todo-form";
import { getTodos, saveTodos } from "@/lib/storage";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { parseInput } from "@/lib/parse";

export default function AddPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleAdd = (text: string, dueDate?: string, dueTime?: string) => {
    // 1. Validazione testo vuoto
    if (!text || text.trim().length === 0) {
      setError("Il testo del task non può essere vuoto");
      return;
    }

    setError(null);
    const todos = getTodos();
    
    // 2. Parsing intelligente (se scrivi "Latte domani" estrae la data dal testo)
    const parsed = parseInput(text);

    // 3. Salvataggio con i nuovi campi
    saveTodos([
      {
        id: crypto.randomUUID(),
        text: parsed.text, 
        completed: false,
        dueDate: parsed.dueDate || dueDate || undefined,
        dueTime: dueTime || undefined, // Salvataggio orario preciso
      },
      ...todos,
    ]);

    // 4. Torna alla lista
    router.push("/list");
  };

  return (
    <div className="page-wrapper">
      <div className="glass-panel">
        <Link href="/" className="btn-ghost" style={{ width: "fit-content" }}>
          ← Dashboard
        </Link>

        <div style={{ marginTop: "24px" }}>
          <h1 className="h1-super" style={{ fontSize: "1.8rem" }}>
            Crea Task
          </h1>
          <p className="p-muted" style={{ marginBottom: "30px" }}>
            Dai un nome alla tua prossima attività.
          </p>

          {/* Messaggio di errore con animazione (se presente nel CSS) */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <TodoForm onAdd={handleAdd} />
        </div>
      </div>
    </div>
  );
}