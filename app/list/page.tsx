"use client";

import { useEffect, useState } from "react";
import { Todo } from "@/types/todo";
import { getTodos, saveTodos } from "@/lib/storage";
import Link from "next/link";
import { isToday, isThisWeek, isOverdue } from "@/lib/date";
import { TodoItem } from "./TodoItem"; // Importante: deve puntare al file creato prima

// AGGIUNTO: export default è fondamentale per Next.js
export default function ListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<string>("all");

  // Carica i task dal localStorage all'avvio
  useEffect(() => {
    setTodos(getTodos());
  }, []);

  // Gestione eliminazione
  const deleteTodo = (id: string) => {
    const updated = todos.filter((t) => t.id !== id);
    setTodos(updated);
    saveTodos(updated);
  };

  // Gestione completamento
  const toggleTodo = (id: string) => {
    const updated = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos(updated);
    saveTodos(updated);
  };

  // Logica di filtraggio
  const filtered = todos.filter((todo) => {
    if (filter === "today") return isToday(todo.dueDate);
    if (filter === "week") return isThisWeek(todo.dueDate);
    if (filter === "overdue") return isOverdue(todo.dueDate) && !todo.completed;
    return true; // "all"
  });

  return (
    <main className="page-wrapper">
      <div className="glass-panel">
        <header className="top-bar">
          <Link href="/" className="btn-ghost">← Torna Home</Link>
          <h1 className="h1-super" style={{ fontSize: '1.5rem', margin: 0 }}>I miei Task</h1>
        </header>

        {/* Barra dei Filtri */}
        <div className="filter-bar">
          {["all", "today", "week", "overdue"].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Lista dei Task con il nuovo componente TodoItem */}
        <div className="todo-list-container">
          {filtered.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              overdue={isOverdue(todo.dueDate)}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))}

          {filtered.length === 0 && (
            <div className="empty-box">
              <p className="p-muted">Nessun task trovato ✨</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}