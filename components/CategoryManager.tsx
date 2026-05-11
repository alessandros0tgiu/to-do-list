"use client";
import { useState, useEffect } from "react";
import { getCategories, saveCategories, getTodos, saveTodos } from "@/lib/storage";

interface CategoryManagerProps {
  onCategoryChange?: () => void;
}

export function CategoryManager({ onCategoryChange }: CategoryManagerProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCat, setNewCat] = useState("");
  const [catError, setCatError] = useState<string | null>(null);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  const addCategory = () => {
    // Validazione nome cartella vuoto
    if (!newCat || newCat.trim().length === 0) {
      setCatError("Il nome della cartella non può essere vuoto");
      return;
    }

    if (!categories.includes(newCat.trim())) {
      setCatError(null);
      const updated = [...categories, newCat.trim()];
      setCategories(updated);
      saveCategories(updated);
      setNewCat("");
      if (onCategoryChange) onCategoryChange();
    } else {
      setCatError("Questa cartella esiste già");
    }
  };

  const removeCategory = (cat: string) => {
    if (confirm(`Attenzione: eliminando la cartella "${cat}" cancellerai anche tutti i task contenuti al suo interno.`)) {
      const updatedCats = categories.filter(c => c !== cat);
      setCategories(updatedCats);
      saveCategories(updatedCats);

      const allTodos = getTodos();
      const remainingTodos = allTodos.filter(todo => todo.category !== cat);
      saveTodos(remainingTodos);

      if (onCategoryChange) onCategoryChange();
    }
  };

  return (
    <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.5)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>📁 Gestione Cartelle</h3>
      
      {/* Messaggio di errore per le cartelle */}
      {catError && <div className="error-message" style={{ color: '#ef4444', marginBottom: '10px', fontSize: '0.8rem' }}>{catError}</div>}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
        <input 
          value={newCat} 
          onChange={(e) => {
            setNewCat(e.target.value);
            if(catError) setCatError(null);
          }}
          placeholder="Nome nuova cartella..."
          className="input-field"
        />
        <button type="button" onClick={addCategory} className="btn-black" style={{ width: '60px' }}>+</button>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <div key={cat} className="badge-category" style={{ background: '#000', color: '#fff', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {cat}
            <button type="button" onClick={() => removeCategory(cat)} style={{ border: 'none', background: 'none', color: '#ff4444', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}