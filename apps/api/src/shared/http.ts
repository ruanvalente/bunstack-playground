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

/**
 * Pagination query params schema
 */
export const paginationQuerySchema = t.Object({
  page: t.Optional(
    t.Number({
      minimum: 1,
      description: "Página atual",
      example: 1,
    }),
  ),
  pageSize: t.Optional(
    t.Number({
      minimum: 1,
      maximum: 100,
      description: "Itens por página",
      example: 10,
    }),
  ),
  sortOrder: t.Optional(
    t.Enum(
      { ASC: "ASC", DESC: "DESC" },
      {
        description: "Ordem de classificação",
        example: "DESC",
      },
    ),
  ),
});

/**
 * Pagination metadata schema
 */
export const paginationMetaSchema = t.Object({
  sortBy: t.String(),
  sortOrder: t.String(),
  timestamp: t.String({ format: "date-time" }),
});

/**
 * Pagination info schema
 */
export const paginationSchema = t.Object({
  total: t.Number(),
  page: t.Number(),
  pageSize: t.Number(),
  totalPages: t.Number(),
  hasNextPage: t.Boolean(),
  hasPrevPage: t.Boolean(),
});

/**
 * Paginated response schema
 */
export const paginatedTasksResponseSchema = t.Object({
  data: t.Array(taskHttpSchema),
  pagination: paginationSchema,
  meta: paginationMetaSchema,
});
