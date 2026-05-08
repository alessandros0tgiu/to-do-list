"use client";

import { useEffect, useState, useRef } from "react";
import { Todo } from "@/types/todo";
import { getTodos, saveTodos } from "@/lib/storage";
import Link from "next/link";
import { isToday, isThisWeek, isOverdue } from "@/lib/date";

type Filter = "all" | "today" | "week" | "overdue";

export default function ListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  // ✅ FIX swipe stabile
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);

  useEffect(() => {
    setTodos(getTodos());
    setMounted(true);
  }, []);

  const toggleTodo = (id: string) => {
    const updated = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos(updated);
    saveTodos(updated);
  };

  const deleteTodo = (id: string) => {
    const updated = todos.filter((t) => t.id !== id);
    setTodos(updated);
    saveTodos(updated);
  };

  const filtered = todos.filter((t) => {
    if (filter === "today") return isToday(t.dueDate);
    if (filter === "week") return isThisWeek(t.dueDate);
    if (filter === "overdue") return isOverdue(t.dueDate);
    return true;
  });

  const completed = todos.filter((t) => t.completed).length;
  const pending = todos.filter((t) => !t.completed).length;
  const progress = todos.length
    ? Math.round((completed / todos.length) * 100)
    : 0;

  if (!mounted) return null;

  return (
    <div
      className="page-wrapper"
      style={{
        maxWidth: "600px",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="glass-panel">

        {/* HEADER NAV */}
        <div className="top-bar">
          <Link href="/" className="btn-ghost">
            ← Home
          </Link>

          <Link href="/add" className="btn-primary">
            + Nuovo
          </Link>
        </div>

        {/* TITLE */}
        <header style={{ marginBottom: "20px" }}>
          <h1 className="h1-super">I tuoi Task</h1>
          <p className="p-muted">
            Hai {pending} attività in sospeso
          </p>
        </header>

        {/* 📊 STATS */}
        <div className="stats-card">
          <div className="stats-row">
            <div className="stat-box">
              <span className="stat-number">{progress}%</span>
              <span className="stat-label">Completati</span>
            </div>

            <div className="stat-box">
              <span className="stat-number">{pending}</span>
              <span className="stat-label">Da fare</span>
            </div>

            <div className="stat-box">
              <span className="stat-number">{completed}</span>
              <span className="stat-label">Fatti</span>
            </div>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* FILTRI */}
        <div className="filter-bar">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Tutti
          </button>

          <button
            className={`filter-btn ${filter === "today" ? "active" : ""}`}
            onClick={() => setFilter("today")}
          >
            Oggi
          </button>

          <button
            className={`filter-btn ${filter === "week" ? "active" : ""}`}
            onClick={() => setFilter("week")}
          >
            Settimana
          </button>

          <button
            className={`filter-btn ${filter === "overdue" ? "active" : ""}`}
            onClick={() => setFilter("overdue")}
          >
            Scaduti
          </button>
        </div>

        {/* LISTA */}
        <div className="todo-list-container">
          {filtered.map((todo) => {
            const overdue = isOverdue(todo.dueDate);

            const handleTouchStart = (e: React.TouchEvent) => {
              touchStartX.current = e.touches[0].clientX;
            };

            const handleTouchMove = (e: React.TouchEvent) => {
              touchCurrentX.current = e.touches[0].clientX;
              const diff = touchCurrentX.current - touchStartX.current;

              const el = e.currentTarget as HTMLDivElement;
              el.style.transform = `translateX(${diff}px)`;

              if (diff > 0) {
                el.style.background = "#dcfce7";
              } else if (diff < 0) {
                el.style.background = "#fee2e2";
              }
            };

            const handleTouchEnd = (e: React.TouchEvent) => {
              const diff = touchCurrentX.current - touchStartX.current;
              const el = e.currentTarget as HTMLDivElement;

              el.style.transform = "";
              el.style.background = "";

              if (diff > 80) {
                toggleTodo(todo.id);
              } else if (diff < -80) {
                deleteTodo(todo.id);
              }
            };

            return (
              <div className="swipe-wrapper" key={todo.id}>
                <div className="swipe-bg">
                  <span className="swipe-action left">✔</span>
                  <span className="swipe-action right">🗑</span>
                </div>

                <div
                  className={`todo-item-card ${overdue ? "overdue" : ""}`}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <label className="todo-left">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="custom-checkbox"
                    />

                    <div className="todo-text-wrapper">
                      <span className={`todo-text ${todo.completed ? "completed" : ""}`}>
                        {todo.text}
                      </span>

                      {todo.dueDate && (
                        <small className="todo-date">
                          📅 {todo.dueDate}
                        </small>
                      )}
                    </div>
                  </label>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-btn"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="empty-box">
              <p className="p-muted">Nessun task qui ✨</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}