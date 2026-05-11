"use client";
import React, { useRef, useState, useEffect } from "react";
import { Todo } from "@/types/todo";
import { getCategories } from "@/lib/storage";

interface TodoItemProps {
  todo: Todo;
  overdue: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newText: string, newCategory?: string) => void;
}

export function TodoItem({ todo, overdue, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editCat, setEditCat] = useState(todo.category || "Nessuna");
  const [availableCats, setAvailableCats] = useState<string[]>([]);

  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing) setAvailableCats(getCategories());
  }, [isEditing]);

  const handleSave = () => {
    if (editText.trim() !== "") {
      onUpdate(todo.id, editText, editCat);
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  };

  // --- LOGICA SWIPE ORIGINALE ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentX.current = e.touches[0].clientX;
    const diff = touchCurrentX.current - touchStartX.current;

    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${diff}px)`;
      const parent = cardRef.current.parentElement;
      if (parent) {
        if (diff > 0) parent.style.background = "#dcfce7"; 
        else if (diff < 0) parent.style.background = "#fee2e2";
      }
    }
  };

  const handleTouchEnd = () => {
    const diff = touchCurrentX.current - touchStartX.current;
    if (cardRef.current) {
      cardRef.current.style.transform = "";
      const parent = cardRef.current.parentElement;
      if (parent) parent.style.background = "";
    }
    if (diff > 100) onToggle(todo.id);
    else if (diff < -100) onDelete(todo.id);
    touchStartX.current = 0;
    touchCurrentX.current = 0;
  };

  return (
    <div className="swipe-wrapper">
      <div className="swipe-bg">
        <span className="swipe-action left">✔</span>
        <span className="swipe-action right">🗑️</span>
      </div>

      <div
        ref={cardRef}
        className={`todo-item-card ${overdue ? "overdue" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="todo-left">
          <input 
            type="checkbox" 
            checked={todo.completed} 
            onChange={() => onToggle(todo.id)} 
            className="custom-checkbox" 
          />

          <div className="todo-text-wrapper">
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                <input
                  autoFocus
                  className="input-field"
                  style={{ padding: '8px', fontSize: '0.9rem' }}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />
                <select
                  className="input-field"
                  style={{ padding: '4px', fontSize: '0.8rem', height: 'auto' }}
                  value={editCat}
                  onChange={(e) => setEditCat(e.target.value)}
                  onBlur={handleSave}
                >
                  <option value="Nessuna">📂 Nessuna cartella</option>
                  {availableCats.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <span 
                  className={`todo-text ${todo.completed ? "completed" : ""}`} 
                  onClick={() => setIsEditing(true)}
                >
                  {todo.text}
                </span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {/* Badge per cartella esistente o placeholder per task senza cartella */}
                  <span 
                    className="badge-category" 
                    onClick={() => setIsEditing(true)}
                    style={{ 
                      cursor: 'pointer', 
                      background: (!todo.category || todo.category === "Nessuna") ? "#f1f5f9" : "#000",
                      color: (!todo.category || todo.category === "Nessuna") ? "#64748b" : "#fff",
                      border: (!todo.category || todo.category === "Nessuna") ? "1px dashed #cbd5e1" : "none"
                    }}
                  >
                    {todo.category && todo.category !== "Nessuna" ? todo.category : "📁 + Cartella"}
                  </span>
                  
                  {todo.dueDate && (
                    <small className="todo-date">
                      📅 {todo.dueDate} {todo.dueTime && `🕒 ${todo.dueTime}`}
                    </small>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <button onClick={() => onDelete(todo.id)} className="delete-btn">✕</button>
      </div>
    </div>
  );
}