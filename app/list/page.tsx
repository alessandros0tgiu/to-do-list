"use client";
import { useEffect, useState } from "react";
import { Todo } from "@/types/todo";
import { getTodos, saveTodos, getCategories, saveCategories } from "@/lib/storage";
import Link from "next/link";
import { isToday, isThisWeek, isOverdue } from "@/lib/date";
import { TodoItem } from "@/components/TodoItem";
import "./list.css";

export default function ListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [availableCats, setAvailableCats] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setTodos(getTodos());
    setAvailableCats(getCategories());
    const handleResize = () => {
      if (window.innerWidth < 768) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Gestione eliminazione task (Cestino / Definitiva)
  const deleteTodo = (id: string) => {
    const updated = todos.map((t) => {
      if (t.id === id) {
        if (t.deletedAt) return null; // Elimina definitivamente
        return { ...t, deletedAt: Date.now() }; // Sposta nel cestino
      }
      return t;
    }).filter((t): t is Todo => t !== null);

    setTodos(updated);
    saveTodos(updated);
  };

  // ELIMINAZIONE CARTELLA PROFESSIONALE
  const removeCategory = (cat: string) => {
    const confirmText = 
      `⚠️ AZIONE IRREVERSIBILE\n\n` +
      `Stai eliminando la cartella: ${cat.toUpperCase()}\n\n` +
      `Tutti i task associati verranno cancellati permanentemente.\n` +
      `Vuoi continuare?`;

    if (window.confirm(confirmText)) {
      // 1. Rimuovi la categoria dal database
      const allCats = getCategories();
      const updatedCats = allCats.filter(c => c !== cat);
      saveCategories(updatedCats);
      setAvailableCats(updatedCats);

      // 2. Rimuovi tutti i task legati a quella categoria
      const allTodos = getTodos();
      const remainingTodos = allTodos.filter(todo => todo.category !== cat);
      saveTodos(remainingTodos);
      setTodos(remainingTodos);

      // Se eravamo dentro quella categoria, torniamo a "Tutte"
      if (catFilter === cat) setCatFilter("all");
    }
  };

  const toggleTodo = (id: string) => {
    const updated = todos.map((t) => {
      if (t.id === id) {
        if (t.deletedAt) return { ...t, completed: false, deletedAt: undefined };
        return { ...t, completed: !t.completed };
      }
      return t;
    });
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
      return 0;
    });

  return (
    <main className={`dashboard-container ${!isSidebarOpen ? "sidebar-closed" : ""}`}>
      <div className={`sidebar-overlay ${isSidebarOpen ? "visible" : ""}`} onClick={() => setIsSidebarOpen(false)}></div>

      <aside className={`sidebar ${!isSidebarOpen ? "collapsed" : "mobile-open"}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'space-between' : 'center', width: '100%', marginBottom: '40px', gap: '10px' }}>
          <Link href="/" className="sidebar-brand">
            <div className="brand-icon"><img src="/favicon.ico" alt="L" style={{ width: '24px', height: '24px' }} /></div>
            {isSidebarOpen && <h2 className="brand-name">TaskFlow</h2>}
          </Link>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="toggle-sidebar-btn desktop-only">
            {isSidebarOpen ? "«" : "»"}
          </button>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">{isSidebarOpen ? "Categorie" : "•••"}</p>
          
          <button className={`nav-item ${catFilter === "all" ? "active" : ""}`} onClick={() => setCatFilter("all")}>
            <span className="nav-icon">📂</span>
            {isSidebarOpen && <span>Tutte le cartelle</span>}
          </button>

          {availableCats.map((c) => (
            <div key={c} className="nav-item-container" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button 
                className={`nav-item ${catFilter === c ? "active" : ""}`} 
                onClick={() => setCatFilter(c)}
                style={{ flex: 1 }}
              >
                <span className="nav-icon">🏷️</span>
                {isSidebarOpen && <span>{c}</span>}
              </button>
              
              {/* Tasto elimina cartella */}
              {isSidebarOpen && (
                <button 
                  onClick={(e) => { e.stopPropagation(); removeCategory(c); }} 
                  className="btn-delete-small"
                  title="Elimina cartella"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </nav>
      </aside>

      <section className="main-content">
        <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? "✕" : "☰"}
        </button>

        <div style={{ marginBottom: '32px' }}>
          <Link href="/add" className="btn-black" style={{ padding: '12px 24px', borderRadius: '12px', width: 'fit-content', display: 'flex', gap: '10px', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.2rem' }}>+</span> Nuovo Promemoria
          </Link>
        </div>

        <header style={{ marginBottom: '40px' }}>
          <h1 className="h1-super">Le tue attività</h1>
          <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1.1rem' }}>{completedCount} di {totalCount} completati</p>
        </header>

        <div className="progress-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: 700 }}>
            <span>Progresso Totale</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

        <div className="filter-tabs">
          {[
            { id: "all", label: "Tutti" },
            { id: "today", label: "Oggi" },
            { id: "week", label: "Settimana" },
            { id: "overdue", label: "Scaduti" },
            { id: "trash", label: "Cestino" }
          ].map((f) => (
            <button key={f.id} className={`tab-btn ${filter === f.id ? "active" : ""}`} onClick={() => setFilter(f.id)}>{f.label}</button>
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
            <div className="empty-box"><p className="p-muted">Nessun task trovato in questa sezione.</p></div>
          )}
        </div>
      </section>
    </main>
  );
}