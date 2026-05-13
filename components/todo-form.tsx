"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getCategories } from "@/lib/storage";

type FormData = {
  text: string;
  dueDate: string;
  dueTime: string;
  category: string;
};

export function TodoForm({
  onAdd,
  refreshTrigger, // AGGIUNTO
}: {
  onAdd: (text: string, dueDate?: string, dueTime?: string, category?: string) => void;
  refreshTrigger?: number; // AGGIUNGI
}) {
  const [myCategories, setMyCategories] = useState<string[]>([]);
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { category: "Nessuna" }
  });

  // AGGIORNATO: Ora reagisce al refreshTrigger
  useEffect(() => {
    setMyCategories(getCategories());
  }, [refreshTrigger]);

  const onSubmit = (data: FormData) => {
    onAdd(data.text, data.dueDate, data.dueTime, data.category);
    if (data.text.trim().length > 0) reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: "16px" }}>
      <input {...register("text")} className="input-field" placeholder="Cosa devi fare?" autoFocus />
      
      <div style={{ display: "flex", gap: "10px" }}>
        <input type="date" {...register("dueDate")} className="input-field" style={{ flex: 1.5 }} />
        <input type="time" {...register("dueTime")} className="input-field" style={{ flex: 1 }} />
      </div>

      <select {...register("category")} className="input-field">
        <option value="Nessuna">📁 Nessuna cartella</option>
        {myCategories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <button type="submit" className="btn-black" style={{ padding: '18px', borderRadius: '16px', fontWeight: '800' }}>
        CREA TASK
      </button>
    </form>
  );
}