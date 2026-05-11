"use client";
import { useEffect, useState } from "react";
import { Todo } from "@/types/todo";
import { getTodos, saveTodos, getCategories } from "@/lib/storage";
import Link from "next/link";
import { isToday, isThisWeek, isOverdue } from "@/lib/date";
import { TodoItem } from "@/components/TodoItem"; // Import corretto

export default function ListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [availableCats, setAvailableCats] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [catFilter, setCatFilter] = useState<string>("all");

  useEffect(() => {
    setTodos(getTodos());
    setAvailableCats(getCategories());
  }, []);

  const deleteTodo = (id: string) => {
    const updated = todos.filter((t) => t.id !== id);
    setTodos(updated);
    saveTodos(updated);
  };

  const toggleTodo = (id: string) => {
    const updated = todos.map((t) => t.id === id ? { ...t, completed: !t.completed } : t);
    setTodos(updated);
    saveTodos(updated);
  };

  // Calcolo progresso per il grafico
  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filtered = todos.filter((todo) => {
    let timeMatch = true;
    if (filter === "today") timeMatch = isToday(todo.dueDate);
    else if (filter === "week") timeMatch = isThisWeek(todo.dueDate);
    else if (filter === "overdue") timeMatch = isOverdue(todo.dueDate, todo.dueTime) && !todo.completed;

    let catMatch = true;
    if (catFilter !== "all") {
      catMatch = (todo.category || "Nessuna") === catFilter;
    }
    return timeMatch && catMatch;
  });

  return (
    <main className="page-wrapper">
      <div className="glass-panel">
        <header className="top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Link href="/" className="btn-ghost">← Home</Link>
          <h1 className="h1-super" style={{ fontSize: '1.4rem' }}>I miei Task</h1>
        </header>

        {/* Grafico Stats */}
        <div className="stats-card">
          <div className="stats-row">
            <div className="stat-box"><span className="stat-number">{totalCount}</span><span className="stat-label">Tasks</span></div>
            <div className="stat-box"><span className="stat-number">{completedCount}</span><span className="stat-label">Fatti</span></div>
            <div className="stat-box"><span className="stat-number">{progressPercentage}%</span><span className="stat-label">Completato</span></div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

        {/* Filtri */}
        <div className="filter-bar">
          {["all", "today", "week", "overdue"].map((f) => (
            <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f === "all" ? "Tutti" : f === "today" ? "Oggi" : f === "week" ? "Settimana" : "Scaduti"}
            </button>
          ))}
        </div>

        <div className="filter-bar" style={{ marginTop: '8px', borderTop: 'none', paddingTop: 0, overflowX: 'auto' }}>
          {["all", "Nessuna", ...availableCats].map((c) => (
            <button key={c} className={`filter-btn-sm ${catFilter === c ? "active" : ""}`} onClick={() => setCatFilter(c)}>
              {c === "all" ? "Tutte" : c}
            </button>
          ))}
        </div>

        <div className="todo-list-container">
          {filtered.map((todo) => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              overdue={isOverdue(todo.dueDate, todo.dueTime)} 
              onToggle={toggleTodo} 
              onDelete={deleteTodo} 
            />
          ))}
        </div>
      </div>
    </main>
  );
}