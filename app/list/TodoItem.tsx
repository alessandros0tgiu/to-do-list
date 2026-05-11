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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentX.current = e.touches[0].clientX;
    const diff = touchCurrentX.current - touchStartX.current;

    if (cardRef.current) {
      // Muoviamo la card seguendo il dito
      cardRef.current.style.transform = `translateX(${diff}px)`;

      // Cambiamo il colore di sfondo dello swipe-wrapper sottostante per feedback visivo
      const parent = cardRef.current.parentElement;
      if (parent) {
        if (diff > 0) parent.style.background = "#dcfce7"; // Verde (Completa)
        else if (diff < 0) parent.style.background = "#fee2e2"; // Rosso (Elimina)
      }
    }
  };

  const handleTouchEnd = () => {
    const diff = touchCurrentX.current - touchStartX.current;

    // Reset stili visivi
    if (cardRef.current) {
      cardRef.current.style.transform = "";
      const parent = cardRef.current.parentElement;
      if (parent) parent.style.background = "";
    }

    // Azioni in base alla distanza dello swipe (soglia 100px)
    if (diff > 100) {
      onToggle(todo.id);
    } else if (diff < -100) {
      onDelete(todo.id);
    }

    // Reset coordinate
    touchStartX.current = 0;
    touchCurrentX.current = 0;
  };

  return (
    <div className="swipe-wrapper">
      {/* Sfondo che appare durante lo swipe */}
      <div className="swipe-bg">
        <span className="swipe-action left">✔</span>
        <span className="swipe-action right">🗑</span>
      </div>

      {/* Card principale del Task */}
      <div
        ref={cardRef}
        className={`todo-item-card ${overdue ? "overdue" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <label className="todo-left">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="custom-checkbox"
          />

          <div className="todo-text-wrapper">
            <span className={`todo-text ${todo.completed ? "completed" : ""}`}>
              {todo.text}
            </span>

            {todo.dueDate && (
              <small className="todo-date">
                📅 {todo.dueDate} {todo.dueTime && ` 🕒 ${todo.dueTime}`}
              </small>
            )}
          </div>
        </label>

        <button
          onClick={() => onDelete(todo.id)}
          className="delete-btn"
        >
          ✕
        </button>
      </div>
    </div>
  );
}