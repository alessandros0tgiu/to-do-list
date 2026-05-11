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
}: {
  onAdd: (text: string, dueDate?: string, dueTime?: string, category?: string) => void;
}) {
  const [myCategories, setMyCategories] = useState<string[]>([]);
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { category: "Nessuna" }
  });

  useEffect(() => {
    setMyCategories(getCategories());
  }, []);

  const onSubmit = (data: FormData) => {
    onAdd(data.text, data.dueDate, data.dueTime, data.category);
    if (data.text.trim().length > 0) reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: "16px" }}>
      <input {...register("text")} className="input-field" placeholder="Cosa devi fare?" autoFocus />
      
      <div style={{ display: "flex", gap: "10px" }}>
        <input type="date" {...register("dueDate")} className="input-field" style={{ flex: 1.5 }} />
        {/* Campo ORA ripristinato */}
        <input type="time" {...register("dueTime")} className="input-field" style={{ flex: 1 }} />
      </div>

      <select {...register("category")} className="input-field">
        <option value="Nessuna">📂 Nessuna cartella</option>
        {myCategories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <button type="submit" className="btn-black">Aggiungi Task</button>
    </form>
  );
}