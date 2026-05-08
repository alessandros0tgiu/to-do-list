"use client";

import { TodoForm } from "@/components/todo-form";
import { getTodos, saveTodos } from "@/lib/storage";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { parseInput } from "@/lib/parse";

export default function AddPage() {
  const router = useRouter();

  const handleAdd = (text: string, dueDate?: string) => {
    const todos = getTodos();

    // 🧠 PARSING INTELLIGENTE
    const parsed = parseInput(text);

    saveTodos([
      {
        id: crypto.randomUUID(),
        text: parsed.text, // 👈 testo pulito
        completed: false,
        dueDate: parsed.dueDate || dueDate || undefined, // 👈 priorità parsing
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
          <h1 className="h1-super" style={{ fontSize: "1.8rem" }}>
            Crea Task
          </h1>
          <p className="p-muted" style={{ marginBottom: "40px" }}>
            Dai un nome alla tua prossima attività.
          </p>

          <TodoForm onAdd={handleAdd} />
        </div>
      </div>
    </div>
  );
}