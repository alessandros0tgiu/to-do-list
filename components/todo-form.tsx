"use client";
import { useForm } from "react-hook-form";

type FormData = {
  text: string;
  dueDate: string;
  dueTime: string; // 👈 Aggiunto orario
};

export function TodoForm({
  onAdd,
}: {
  onAdd: (text: string, dueDate?: string, dueTime?: string) => void;
}) {
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    onAdd(data.text, data.dueDate, data.dueTime);
    if (data.text.trim().length > 0) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: "16px" }}>
      <input
        {...register("text")}
        className="input-field"
        placeholder="Cosa devi fare?"
        autoFocus
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="date"
          {...register("dueDate")}
          className="input-field"
          style={{ flex: 2 }}
        />
        <input
          type="time"
          {...register("dueTime")}
          className="input-field"
          style={{ flex: 1 }}
        />
      </div>

      <button type="submit" className="btn-black">
        Aggiungi alla lista
      </button>
    </form>
  );
}