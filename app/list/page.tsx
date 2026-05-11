"use client";

import { useEffect, useState } from "react";
import { Todo } from "@/types/todo";
import { getTodos, saveTodos } from "@/lib/storage";
import Link from "next/link";
import { isToday, isThisWeek, isOverdue } from "@/lib/date";
import { TodoItem } from "./TodoItem";

export default function ListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    setTodos(getTodos());
  }, []);

  const deleteTodo = (id: string) => {
    const updated = todos.filter((t) => t.id !== id);
    setTodos(updated);
    saveTodos(updated);
  };

  const toggleTodo = (id: string) => {
    const updated = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos(updated);
    saveTodos(updated);
  };

  // CALCOLO PROGRESSO (Fondamentale per far funzionare la barra)
  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filtered = todos.filter((todo) => {
    if (filter === "today") return isToday(todo.dueDate);
    if (filter === "week") return isThisWeek(todo.dueDate);
    if (filter === "overdue") return isOverdue(todo.dueDate) && !todo.completed;
    return true;
  });

  return (
    <main className="page-wrapper">
      <div className="glass-panel">
        <header className="top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Link href="/" className="btn-ghost" style={{ width: 'auto', padding: '8px 16px' }}>← Home</Link>
          <h1 className="h1-super" style={{ fontSize: '1.4rem', margin: 0 }}>I miei Task</h1>
        </header>

        {/* 📊 DASHBOARD STATISTICHE */}
        <div className="stats-card">
          <div className="stats-row">
            <div className="stat-box">
              <span className="stat-number">{totalCount}</span>
              <span className="stat-label">Tasks</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">{completedCount}</span>
              <span className="stat-label">Fatti</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">{progressPercentage}%</span>
              <span className="stat-label">Completato</span>
            </div>
          </div>
          <div className="progress-bar">
            {/* LARGHEZZA DINAMICA APPLICATA QUI */}
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="filter-bar">
          {["all", "today", "week", "overdue"].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "Tutti" : f === "today" ? "Oggi" : f === "week" ? "Settimana" : "Scaduti"}
            </button>
          ))}
        </div>

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
            <div className="empty-box" style={{ textAlign: 'center', padding: '40px 0' }}>
              <p className="p-muted">Nessun task trovato ✨</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}