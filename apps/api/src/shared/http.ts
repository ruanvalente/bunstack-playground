export const healthResponse = {
  status: "ok",
  uptime: process.uptime(),
};

import { t } from "elysia";

export const taskHttpSchema = t.Object({
  id: t.String({ format: "uuid" }),
  title: t.String({ minLength: 3 }),
  completed: t.Boolean(),
  createdAt: t.String({ format: "date-time" }),
});

export const createTaskHttpSchema = t.Object({
  title: t.String({
    minLength: 3,
    description: "Título da tarefa",
    example: "Estudar Bun",
  }),
});

export const updateTaskHttpSchema = t.Object({
  id: t.String({ format: "uuid" }),
  title: t.String({
    minLength: 3,
    description: "Título atualizado da tarefa",
    example: "Estudar Bun com Elysia",
  }),
});

export const completeTaskHttpSchema = t.Object({
  id: t.String({
    format: "uuid",
    description: "ID da tarefa a ser concluída",
    example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  }),
});

export const deleteTaskHttpSchema = t.Object({
  id: t.String({
    format: "uuid",
    description: "ID da tarefa a ser deletada",
    example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  }),
});
