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

  const onSubmit = (data: FormData) => {
    // Passiamo i dati al padre (AddPage) anche se il testo è vuoto
    onAdd(data.text, data.dueDate);
    
    // Resettiamo il campo solo se l'inserimento è andato a buon fine 
    // (opzionale: potresti voler resettare solo se data.text non è vuoto)
    if (data.text.trim().length > 0) {
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "grid", gap: "16px" }}
    >
      <input
        {...register("text")} // 👈 Rimosso { required: true }
        className="input-field"
        placeholder="Cosa devi fare?"
        autoFocus
      />

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