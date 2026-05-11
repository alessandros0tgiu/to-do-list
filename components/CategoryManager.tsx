"use client";
import { useState, useEffect } from "react";
import { getCategories, saveCategories } from "@/lib/storage";

interface CategoryManagerProps {
  onCategoryChange?: () => void;
}

export function CategoryManager({ onCategoryChange }: CategoryManagerProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCat, setNewCat] = useState("");

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  const addCategory = () => {
    if (newCat.trim() && !categories.includes(newCat.trim())) {
      const updated = [...categories, newCat.trim()];
      setCategories(updated);
      saveCategories(updated);
      setNewCat("");
      if (onCategoryChange) onCategoryChange(); // ⚡️ Avvisa subito il form
    }
  };

  const removeCategory = (cat: string) => {
    if (confirm(`Vuoi eliminare la cartella "${cat}"?`)) {
      const updated = categories.filter(c => c !== cat);
      setCategories(updated);
      saveCategories(updated);
      if (onCategoryChange) onCategoryChange(); // ⚡️ Avvisa subito il form
    }
  };

  return (
    <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.5)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>📁 Le mie Cartelle</h3>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
        <input 
          value={newCat} 
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="Nome nuova cartella..."
          className="input-field"
        />
        <button type="button" onClick={addCategory} className="btn-black" style={{ width: '60px' }}>+</button>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <div key={cat} className="badge-category" style={{ background: '#000', color: '#fff', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {cat}
            <button type="button" onClick={() => removeCategory(cat)} style={{ border: 'none', background: 'none', color: '#ff4444', cursor: 'pointer' }}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}