"use client";
import { useForm } from "react-hook-form";

export function TodoForm({ onAdd }: { onAdd: (text: string) => void }) {
  const { register, handleSubmit, reset } = useForm<{ text: string }>();

  return (
    <form onSubmit={handleSubmit((data) => { onAdd(data.text); reset(); })} 
          style={{ display: 'grid', gap: '16px' }}>
      <input 
        {...register("text", { required: true })} 
        className="input-field"
        placeholder="Cosa devi fare?"
        autoFocus
      />
      <button type="submit" className="btn-black">
        Aggiungi alla lista
      </button>
    </form>
  );
}