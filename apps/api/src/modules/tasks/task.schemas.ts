import { z } from "zod";

export const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3),
  completed: z.boolean(),
  createdAt: z.date(),
});

export const createTaskSchema = z.object({
  title: z.string().min(3),
  description: "Título da tarefa",
  example: "Estudar Bun",
});

export const updateTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3),
  descripotion: "Título atualizado da tarefa",
  example: "Estudar Bun com Elysia",
});

export const completeTaskSchema = z.object({
  id: z.string().uuid(),
  description: "ID da tarefa a ser concluída",
  example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
});

export const deleteTaskSchema = z.object({
  id: z.string().uuid(),
  description: "ID da tarefa a ser deletada",
  example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
});
