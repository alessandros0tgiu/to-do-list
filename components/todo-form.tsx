"use client";
import { useForm } from "react-hook-form";

type FormData = {
  text: string;
  dueDate: string;
};

export function TodoForm({
  onAdd,
}: {
  onAdd: (text: string, dueDate?: string) => void;
}) {
  const { register, handleSubmit, reset } = useForm<FormData>();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onAdd(data.text, data.dueDate);
        reset();
      })}
      style={{ display: "grid", gap: "16px" }}
    >
      <input
        {...register("text", { required: true })}
        className="input-field"
        placeholder="Cosa devi fare?"
        autoFocus
      />

      {/* 🗓️ calendario opzionale */}
      <input
        type="date"
        {...register("dueDate")}
        className="input-field"
      />

      <button type="submit" className="btn-black">
        Aggiungi alla lista
      </button>
    </form>
  );
}