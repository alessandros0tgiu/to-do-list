"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTodos } from "@/lib/storage";
import { isToday, isOverdue } from "@/lib/date";
import { Todo } from "@/types/todo";
import "./home.css";

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    setTodos(getTodos());
  }, []);

  const todayCount = todos.filter(t => isToday(t.dueDate) && !t.completed).length;
  const overdueCount = todos.filter(t => isOverdue(t.dueDate) && !t.completed).length;

  return (
    <main className="page-wrapper">
      <div className="glass-panel">
        
        <header style={{ textAlign: 'center' }}>
          {/* Logo e Titolo affiancati */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '12px', 
            marginBottom: '8px' 
          }}>
            <img 
              src="/favicon.ico" 
              alt="Logo" 
              style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
            />
            <h1 className="h1-super" style={{ margin: 0 }}>TaskFlow</h1>
          </div>

          <p className="p-muted">
            Gestisci i tuoi impegni quotidiani <br /> 
            con un'interfaccia pulita e veloce.
          </p>

          {/* 📊 QUICK STATS PILLS */}
          <div className="quick-stats-container">
            <Link href="/list?filter=today" className="stat-pill">
              <span>📅 Oggi</span>
              <strong>{todayCount}</strong>
            </Link>
            
            <Link href="/list?filter=overdue" className={`stat-pill ${overdueCount > 0 ? 'red' : ''}`}>
              <span>⚠️ Scaduti</span>
              <strong>{overdueCount}</strong>
            </Link>
          </div>
        </header>
        
        {/* NAV - Responsive Stack */}
        <nav className="cta-container">
          <Link href="/add" className="btn-black">
            <span>+</span> Nuovo Promemoria
          </Link>
          
          <Link href="/list" className="btn-black">
            Vai alla Lista
          </Link>
        </nav>

        {/* Footer discreto */}
        <footer style={{ marginTop: '40px', textAlign: 'center', opacity: 0.4, fontSize: '0.8rem' }}>
          Totale task salvati: {todos.length}
        </footer>
      </div>
    </main>
  );
}