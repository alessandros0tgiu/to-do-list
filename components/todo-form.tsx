"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const todoSchema = z.object({
  text: z.string().min(2, "Scrivi almeno 2 caratteri"),
});

type TodoFormData = z.infer<typeof todoSchema>;

export function TodoForm({ onAdd }: { onAdd: (text: string) => void }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
  });

  const onSubmit = (data: TodoFormData) => {
    onAdd(data.text);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div className="flex gap-2">
        <Input 
          placeholder="Cosa vuoi ricordare?" 
          {...register("text")} 
          className={errors.text ? "border-red-500" : ""}
        />
        <Button type="submit">Aggiungi</Button>
      </div>
      {errors.text && <p className="text-red-500 text-xs mt-1">{errors.text.message}</p>}
    </form>
  );
}