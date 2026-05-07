"use client";
import { TodoForm } from "@/components/todo-form";
import { getTodos, saveTodos } from "@/lib/storage";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddPage() {
  const router = useRouter();

  const handleAdd = (text: string, dueDate?: string) => {
    const todos = getTodos();

    saveTodos([
      {
        id: crypto.randomUUID(),
        text,
        completed: false,
        dueDate: dueDate || undefined,
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