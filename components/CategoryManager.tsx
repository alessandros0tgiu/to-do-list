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
    if (!newCat || newCat.trim().length === 0) {
      setCatError("Inserisci un nome per la cartella");
      return;
    }

    const trimmed = newCat.trim();

    // AGGIUNTO: Controllo che ignora maiuscole/minuscole
    const exists = categories.some(
      (cat) => cat.toLowerCase() === trimmed.toLowerCase()
    );

    if (!exists) {
      setCatError(null);
      const updated = [...categories, trimmed];
      setCategories(updated);
      saveCategories(updated);
      setNewCat("");
      if (onCategoryChange) onCategoryChange();
    } else {
      setCatError("Questa cartella esiste già");
    }
  };

  const removeCategory = (cat: string) => {
    const confirmText = 
      `⚠️ AZIONE IRREVERSIBILE\n\n` +
      `Stai eliminando la cartella: ${cat.toUpperCase()}\n\n` +
      `Tutti i task associati verranno cancellati permanentemente.\n` +
      `Vuoi continuare?`;

    if (window.confirm(confirmText)) {
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
    <div className="category-manager-card" style={{ marginTop: '30px', padding: '24px', background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
      <h3 style={{ fontSize: '0.9rem', marginBottom: '20px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        📁 Crea Cartelle
      </h3>
      
      {catError && <div className="error-message"> {catError}</div>}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <input 
          value={newCat} 
          onChange={(e) => {
            setNewCat(e.target.value);
            if(catError) setCatError(null);
          }}
          placeholder="Aggiungi categoria..."
          className="input-field"
        />
        <button type="button" onClick={addCategory} className="btn-black" style={{ width: '60px', borderRadius: '14px', fontSize: '1.2rem' }}>+</button>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <div key={cat} className="badge-category">
            {cat}
            <button onClick={() => removeCategory(cat)} className="btn-delete-cat">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}