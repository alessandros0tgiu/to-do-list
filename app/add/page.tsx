"use client";

import { useState } from "react"; // Aggiunto useState
import { TodoForm } from "@/components/todo-form";
import { getTodos, saveTodos } from "@/lib/storage";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { parseInput } from "@/lib/parse";

export default function AddPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null); // Stato per l'errore

  const handleAdd = (text: string, dueDate?: string) => {
    // 1. Validazione: rimuove gli spazi vuoti e controlla se la stringa è vuota
    if (!text || text.trim().length === 0) {
      setError("Il testo del task non può essere vuoto");
      return;
    }

    // Reset dell'errore se la validazione passa
    setError(null);

    const todos = getTodos();

    // 🧠 PARSING INTELLIGENTE
    const parsed = parseInput(text);

    saveTodos([
      {
        id: crypto.randomUUID(),
        text: parsed.text, 
        completed: false,
        dueDate: parsed.dueDate || dueDate || undefined,
      },
      ...todos,
    ]);

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

          {/* MESSAGGIO DI ERRORE VISIVO */}
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