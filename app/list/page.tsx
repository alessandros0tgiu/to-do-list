"use client";

import { useEffect, useState } from "react";
import { Todo } from "@/types/todo";
import { getTodos, saveTodos } from "@/lib/storage";
import Link from "next/link";

export default function ListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTodos(getTodos());
    setMounted(true);
  }, []);

  const toggleTodo = (id: string) => {
    const updated = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTodos(updated);
    saveTodos(updated);
  };

  const deleteTodo = (id: string) => {
    const updated = todos.filter(t => t.id !== id);
    setTodos(updated);
    saveTodos(updated);
  };

  if (!mounted) return null;

  return (
    <div className="page-wrapper" style={{ maxWidth: '600px' }}>
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <Link href="/" className="btn-ghost">← Dashboard</Link>
          <Link href="/add" className="btn-black" style={{ padding: '10px 20px', width: 'auto', borderRadius: '12px' }}>
            + Nuovo
          </Link>
        </div>
        
        <header style={{ marginBottom: '32px' }}>
          <h1 className="h1-super" style={{ fontSize: '2.2rem' }}>I tuoi Task</h1>
          <p className="p-muted">Hai {todos.filter(t => !t.completed).length} attività in sospeso.</p>
        </header>
        
        <div className="todo-list-container" style={{ display: 'grid', gap: '12px' }}>
          {todos.map((todo) => (
            <div key={todo.id} className="todo-item-card">
              <label style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={todo.completed} 
                  onChange={() => toggleTodo(todo.id)}
                  className="custom-checkbox"
                />
                <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                  {todo.text}
                </span>
              </label>
              <button 
                onClick={() => deleteTodo(todo.id)}
                className="delete-btn"
                title="Elimina task"
              >
                ✕
              </button>
            </div>
          ))}

          {todos.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', border: '2px dashed #e2e8f0', borderRadius: '20px' }}>
              <p className="p-muted" style={{ margin: 0 }}>Nessun impegno per ora. Rilassati! ☕</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}