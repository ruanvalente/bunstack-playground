import { z } from 'zod';

/** Health check response
 */
export const healthSchema = {
  status: 'ok',
  uptime: new Date().toISOString(),
};

/**
 * Task HTTP representation
 */
export const taskSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  title: z.string().min(3),
  completed: z.boolean(),
  categoryId: z.string().uuid().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const taskSchemaWithDate = taskSchema.transform((data) => ({
  ...data,
  createdAt: new Date(data.createdAt).toISOString(),
  updatedAt: new Date(data.updatedAt).toISOString(),
}));

/**
 * Payload to create a task
 */
export const createTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  categoryId: z.string().uuid().optional(),
});

/**
 * Payload to update a task
 */
export const updateTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3),
  categoryId: z.string().uuid().optional(),
});

/**
 * Payload to edit task title (form)
 */
export const editTaskTitleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
});

/**
 * Payload to complete a task
 */
export const completeTaskSchema = z.object({
  id: z.string().uuid(),
  completed: z.boolean(),
  description: 'Task ID to be completed',
  example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
});

/**
 * Payload to delete a task
 */
export const deleteTaskSchema = z.object({
  id: z.string().uuid(),
  description: 'Task id to be deleted',
  example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
});

/**
 * Pagination query params schema
 */
export const paginationQuerySchema = z.object({
  page: z.optional(
    z.coerce.number().min(1, 'Page must be at least 1').default(1)
  ),
  pageSize: z.optional(
    z.coerce
      .number()
      .min(1, 'Page size must be at least 1')
      .max(100, 'The page size should be a maximum of 100.')
      .default(10)
  ),
  sortOrder: z
    .optional(z.enum({ ASC: 'ASC', DESC: 'DESC' }, 'Classification order'))
    .default('DESC'),
  statusFilter: z
    .optional(z.enum({ completed: 'completed', pending: 'pending' }))
    .optional(),
  categoryFilter: z.optional(z.string().uuid()).optional(),
  sortBy: z
    .optional(z.enum({ created_at: 'created_at', updated_at: 'updated_at' }))
    .default('created_at'),
});

/**
 * Pagination metadata schema
 */
export const paginationMetaSchema = z.object({
  sortBy: z.string(),
  sortOrder: z.string(),
  timestamp: z.iso.datetime(),
});

/**
 * Pagination info schema
 */
export const paginationSchema = z.object({
  total: z.coerce.number().min(0),
  page: z.coerce.number().int().min(1),
  pageSize: z.coerce.number().int().min(1),
  totalPages: z.coerce.number().int().min(0),
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

export const paginatedTaskDomain = z.object({
  data: z.array(taskSchemaWithDate),
  pagination: paginationSchema,
  meta: paginationMetaSchema,
});

/**
 * Types inferred from schemas
 */
export type TaskDTO = z.infer<typeof taskSchema>;
export type TaskDTOWithDate = z.infer<typeof taskSchemaWithDate>;
export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>;
export type EditTaskTitleDTO = z.infer<typeof editTaskTitleSchema>;
export type CompleteTaskDTO = z.infer<typeof completeTaskSchema>;
export type DeleteTaskDTO = z.infer<typeof deleteTaskSchema>;
export type PaginationQueryDTO = z.infer<typeof paginationQuerySchema>;
export type PaginatedTasksResponseDTO = z.infer<
  typeof paginatedTasksResponseSchema
>;
export type PaginatedTasksDomain = z.infer<typeof paginatedTaskDomain>;
export type HealthResponseDTO = typeof healthSchema;

export const categorySchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  createdAt: z.iso.datetime(),
});

export const categorySchemaWithDate = categorySchema.transform((data) => ({
  ...data,
  createdAt: new Date(data.createdAt).toISOString(),
}));

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be at most 50 characters'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format')
    .default('#3B82F6'),
});

export const deleteCategorySchema = z.object({
  id: z.string().uuid(),
});

export type CategoryDTO = z.infer<typeof categorySchema>;
export type CategoryDTOWithDate = z.infer<typeof categorySchemaWithDate>;
export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
export type DeleteCategoryDTO = z.infer<typeof deleteCategorySchema>;
