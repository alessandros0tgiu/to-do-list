"use client";

import { useEffect, useState } from "react";
import { Todo } from "@/types/todo";
import { getTodos, saveTodos } from "@/lib/storage";
import { TodoForm } from "@/components/todo-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carica i task dal localStorage all'avvio
  useEffect(() => {
    setTodos(getTodos());
    setIsLoaded(true);
  }, []);

  // Salva i task ogni volta che la lista cambia
  useEffect(() => {
    if (isLoaded) saveTodos(todos);
  }, [todos, isLoaded]);

  const addTodo = (text: string) => {
    const newTodo: Todo = { 
      id: crypto.randomUUID(), 
      text, 
      completed: false 
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-slate-800">
            My Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <TodoForm onAdd={addTodo} />
          
          <div className="space-y-3">
            {todos.map((todo) => (
              <div 
                key={todo.id} 
                className="flex items-center justify-between p-3 border rounded-xl bg-white hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <input 
                    type="checkbox" 
                    checked={todo.completed} 
                    onChange={() => toggleTodo(todo.id)}
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className={`truncate ${todo.completed ? "line-through text-slate-400" : "text-slate-700 font-medium"}`}>
                    {todo.text}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => deleteTodo(todo.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  ✕
                </Button>
              </div>
            ))}
            
            {isLoaded && todos.length === 0 && (
              <div className="text-center py-10">
                <p className="text-slate-400 italic">Non hai ancora aggiunto nessun task.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}