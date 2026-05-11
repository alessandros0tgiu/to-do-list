"use client";
import { useEffect, useState } from "react";
import { Todo } from "@/types/todo";
import { getTodos, saveTodos, getCategories } from "@/lib/storage";
import Link from "next/link";
import { isToday, isThisWeek, isOverdue } from "@/lib/date";
import { TodoItem } from "@/components/TodoItem";

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
    const updated = todos.map((t) => {
      if (t.id === id) {
        // Se è già nel cestino (ha deletedAt), lo eliminiamo definitivamente
        if (t.deletedAt) return null; 
        // Altrimenti lo spostiamo nel cestino aggiungendo il timestamp
        return { ...t, deletedAt: Date.now() };
      }
      return t;
    }).filter((t): t is Todo => t !== null);
    
    setTodos(updated);
    saveTodos(updated);
  };

  const toggleTodo = (id: string) => {
    const updated = todos.map((t) => 
      t.id === id ? { ...t, completed: !t.completed, deletedAt: undefined } : t
    );
    setTodos(updated);
    saveTodos(updated);
  };

  const updateTodoText = (id: string, newText: string, newCategory?: string) => {
    const updated = todos.map((t) =>
      t.id === id ? { ...t, text: newText, category: newCategory || t.category } : t
    );
    setTodos(updated);
    saveTodos(updated);
  };

  const activeTodos = todos.filter(t => !t.deletedAt);
  const trashTodos = todos.filter(t => !!t.deletedAt);

  const completedCount = activeTodos.filter((t) => t.completed).length;
  const totalCount = activeTodos.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filtered = (filter === "trash" ? trashTodos : activeTodos)
    .filter((todo) => {
      if (filter === "trash") return true;
      let timeMatch = true;
      if (filter === "today") timeMatch = isToday(todo.dueDate);
      else if (filter === "week") timeMatch = isThisWeek(todo.dueDate);
      else if (filter === "overdue") timeMatch = isOverdue(todo.dueDate, todo.dueTime) && !todo.completed;

      let catMatch = true;
      if (catFilter !== "all") catMatch = (todo.category || "Nessuna") === catFilter;
      return timeMatch && catMatch;
    })
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const aOverdue = isOverdue(a.dueDate, a.dueTime);
      const bOverdue = isOverdue(b.dueDate, b.dueTime);
      if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });

  return (
    <main className="page-wrapper">
      <div className="glass-panel">
        <header className="top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Link href="/" className="btn-ghost">← Dashboard</Link>
          <Link href="/add" className="btn-black" style={{ width: 'auto', padding: '8px 16px', fontSize: '0.9rem' }}>+ Nuovo Task</Link>
        </header>

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

        <div className="filter-bar">
          {["all", "today", "week", "overdue", "trash"].map((f) => (
            <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f === "all" ? "Tutti" : f === "today" ? "Oggi" : f === "week" ? "Settimana" : f === "overdue" ? "Scaduti" : "Cestino 🗑️"}
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
          {filtered.length > 0 ? (
            filtered.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                overdue={isOverdue(todo.dueDate, todo.dueTime)}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={updateTodoText}
              />
            ))
          ) : (
            <div className="empty-box">
              <p className="p-muted">
                {filter === "trash" ? "Il cestino è vuoto" : "Non hai nessuna task"}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}