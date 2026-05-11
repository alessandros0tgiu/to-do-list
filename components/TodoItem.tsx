"use client";
import React, { useRef } from "react";
import { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  overdue: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, overdue, onToggle, onDelete }: TodoItemProps) {
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
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
    if (!cardRef.current) return;
    const diff = touchCurrentX.current - touchStartX.current;
    cardRef.current.style.transform = `translateX(0px)`;
    if (diff > 100) onToggle(todo.id);
    else if (diff < -100) onDelete(todo.id);
    touchStartX.current = 0; touchCurrentX.current = 0;
  };

  return (
    <div className="swipe-wrapper">
      <div className="swipe-bg">
        <span className="swipe-action left">✔</span>
        <span className="swipe-action right">🗑</span>
      </div>
      <div
        ref={cardRef}
        className={`todo-item-card ${overdue ? "overdue" : ""}`}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}
      >
        <label style={{ display: 'flex', gap: '12px', flex: 1, cursor: 'pointer' }}>
          <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} className="custom-checkbox" />
          <div className="todo-text-wrapper">
            <span className={`todo-text ${todo.completed ? "completed" : ""}`}>{todo.text}</span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
              {todo.category && todo.category !== "Nessuna" && (
                <span className="badge-category" style={{ background: '#000', color: '#fff', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px' }}>
                  {todo.category}
                </span>
              )}
              {todo.dueDate && <small>📅 {todo.dueDate}</small>}
            </div>
          </div>
        </label>
        <button onClick={() => onDelete(todo.id)} className="delete-btn">✕</button>
      </div>
    </div>
  );
}