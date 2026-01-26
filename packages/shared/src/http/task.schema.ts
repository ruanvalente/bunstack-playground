import { z } from "zod";

/** Health check response
 */
export const healthSchema = {
  status: "ok",
  uptime: new Date().toISOString(),
};

/**
 * Task HTTP representation
 */
export const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3),
  completed: z.boolean(),
  createdAt: z.string().datetime(),
});

/**
 * Payload to create a task
 */
export const createTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
});

/**
 * Payload to update a task
 */
export const updateTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3),
});

/**
 * Payload to complete a task
 */
export const completeTaskSchema = z.object({
  id: z.string().uuid(),
  completed: z.boolean(),
  description: "Task ID to be completed",
  example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
});

/**
 * Payload to delete a task
 */
export const deleteTaskSchema = z.object({
  id: z.string().uuid(),
  description: "Task id to be deleted",
  example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
});

/**
 * Pagination query params schema
 */
export const paginationQuerySchema = z.object({
  page: z.optional(z.number().min(1, "Page must be at least 1").default(1)),
  pageSize: z.optional(
    z
      .number()
      .min(1, "Page size must be at least 1")
      .max(100, "The page size should be a maximum of 100.")
      .default(10),
  ),
  sortOrder: z
    .optional(z.enum({ ASC: "ASC", DESC: "DESC" }, "Classification order"))
    .default("ASC"),
});

/**
 * Pagination metadata schema
 */
export const paginationMetaSchema = z.object({
  sortBy: z.string(),
  sortOrder: z.string(),
  timestamp: z.string().datetime(),
});

/**
 * Pagination info schema
 */
export const paginationSchema = z.object({
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

/**
 * Paginated response schema
 */
export const paginatedTasksResponseSchema = z.object({
  data: z.array(taskSchema),
  pagination: paginationSchema,
  meta: paginationMetaSchema,
});

/**
 * Types inferred from schemas
 */
export type TaskDTO = z.infer<typeof taskSchema>;
export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>;
export type CompleteTaskDTO = z.infer<typeof completeTaskSchema>;
export type DeleteTaskDTO = z.infer<typeof deleteTaskSchema>;
export type PaginationQueryDTO = z.infer<typeof paginationQuerySchema>;
export type PaginatedTasksResponseDTO = z.infer<
  typeof paginatedTasksResponseSchema
>;
export type HealthResponseDTO = typeof healthSchema;
