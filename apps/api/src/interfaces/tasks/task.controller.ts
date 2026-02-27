import { openapi } from '@elysiajs/openapi';
import { Elysia, t } from 'elysia';

import { API_VERSION } from '@bunstack-playground/shared';
import {
  createTaskSchema,
  paginatedTasksResponseSchema,
  paginationQuerySchema,
  taskSchema,
} from '@bunstack-playground/shared/http';

import {
  CompleteTaskUseCase,
  CreateTaskUseCase,
  DeleteTaskUseCase,
  ListTasksUseCase,
  UpdateTaskUseCase,
} from '@/api/application/tasks';
import { AppError, HttpStatus, UnauthorizedError } from '@/api/domain/erros';
import { getTaskRepository } from '@/api/infrastructure/repositories/factory/task.repository.factory';
import { supabaseAuth } from '@/api/infrastructure/supabase/supabase.auth.client';

const taskRepository = getTaskRepository();
const listTasksUseCase = new ListTasksUseCase(taskRepository);
const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
const completeTaskUseCase = new CompleteTaskUseCase(taskRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);

async function authenticateUser(
  headers: Record<string, unknown>
): Promise<string> {
  const authHeader = headers.authorization as string | undefined;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided');
  }

  const token = authHeader.replace('Bearer ', '');

  const { data: user, error } = await supabaseAuth.auth.getUser(token);

  if (error || !user?.user) {
    throw new UnauthorizedError('Invalid or expired token');
  }

  return user.user.id;
}

export const taskController = new Elysia({
  prefix: `api/${API_VERSION}/tasks`,
})

  .get(
    '/',
    async ({ query, headers }) => {
      const userId = await authenticateUser(headers);
      const page = query.page ?? 1;
      const pageSize = query.pageSize ?? 10;
      const sortOrder = (query.sortOrder ?? 'DESC') as 'ASC' | 'DESC';
      const sortBy = (query.sortBy ?? 'created_at') as
        | 'created_at'
        | 'updated_at';
      const statusFilter = query.statusFilter;
      const categoryFilter = query.categoryFilter;

      const result = await listTasksUseCase.execute(
        {
          page,
          pageSize,
          sortOrder,
          sortBy,
          statusFilter,
          categoryFilter,
        },
        userId
      );

      const { pagination } = result;

      return {
        data: result.data.map((task) => ({
          ...task,
          createdAt: task.createdAt,
        })),

        pagination: {
          total: pagination.total,
          page: pagination.page,
          pageSize: pagination.pageSize,
          totalPages: pagination.totalPages,
          hasNextPage: pagination.hasNextPage,
          hasPrevPage: pagination.hasPrevPage,
        },
        meta: {
          sortBy,
          sortOrder,
          timestamp: new Date().toISOString(),
        },
      };
    },
    {
      query: paginationQuerySchema,
      response: {
        200: paginatedTasksResponseSchema,
      },
      detail: {
        tags: ['Tasks'],
        summary: 'Lists all tasks with pagination',
        description: 'Return all tasks with pagination, sorting and metadata',
      },
    }
  )

  .post(
    '/',
    async ({ body, set, headers }) => {
      try {
        const userId = await authenticateUser(headers);
        const bodyTyped = body as { title: string; categoryId?: string };
        const task = await createTaskUseCase.execute(
          bodyTyped.title,
          userId,
          bodyTyped.categoryId
        );
        set.status = HttpStatus.CREATED;
        return task;
      } catch (error) {
        if (error instanceof AppError) {
          set.status = error.statusCode;
          return { message: error.message };
        }
        set.status = HttpStatus.INTERNAL_SERVER_ERROR;
        return { message: 'Internal server error' };
      }
    },
    {
      body: t.Object({
        title: t.String({
          minLength: 3,
          description: 'Título da tarefa',
        }),
        categoryId: t.Optional(t.String({ format: 'uuid' })),
      }),
      response: {
        201: taskSchema,
      },
      detail: {
        tags: ['Tasks'],
        summary: 'Create Task',
        description: 'Create a new task with the given title',
      },
    }
  )

  .put(
    '/:id',
    async ({ params, body, set, headers }) => {
      try {
        const userId = await authenticateUser(headers);
        const bodyTyped = body as { title: string; categoryId?: string };
        const task = await updateTaskUseCase.execute(
          params.id,
          bodyTyped.title,
          userId,
          bodyTyped.categoryId
        );

        return { ...task, createdAt: task.createdAt };
      } catch (error) {
        if (error instanceof AppError) {
          set.status = error.statusCode;
          return { message: error.message };
        }
        set.status = HttpStatus.INTERNAL_SERVER_ERROR;
        return { message: 'Internal server error' };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: 'uuid' }),
      }),
      body: t.Object({
        title: t.String({
          minLength: 3,
          description: 'Título atualizado da tarefa',
        }),
        categoryId: t.Optional(t.String({ format: 'uuid' })),
      }),
      response: {
        200: taskSchema,
        404: t.Object({ message: t.String() }),
        400: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ['Tasks'],
        summary: 'Update task',
        description: "Update a task's title by ID",
      },
    }
  )

  .patch(
    '/:id/complete',
    async ({ body, set, headers }) => {
      try {
        const userId = await authenticateUser(headers);
        const bodyTyped = body as { id: string; completed: boolean };
        const task = await completeTaskUseCase.execute(
          bodyTyped.id,
          bodyTyped.completed,
          userId
        );
        return { ...task, createdAt: task.createdAt };
      } catch (error) {
        if (error instanceof AppError) {
          set.status = error.statusCode;
          return { message: error.message };
        }
        set.status = HttpStatus.INTERNAL_SERVER_ERROR;
        return { message: 'Internal server error' };
      }
    },
    {
      body: t.Object({
        id: t.String({ format: 'uuid' }),
        completed: t.Boolean({ description: 'New completion status' }),
      }),
      response: {
        200: taskSchema,
        404: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ['Tasks'],
        summary: 'Completed task',
        description: 'Checked a task as completed by ID',
      },
    }
  )

  .delete(
    '/:id',
    async ({ params, set, headers }) => {
      try {
        const userId = await authenticateUser(headers);
        await deleteTaskUseCase.execute(params.id, userId);
        set.status = HttpStatus.NO_CONTENT;
        return null;
      } catch (error) {
        if (error instanceof AppError) {
          set.status = error.statusCode;
          return { message: error.message };
        }
        set.status = HttpStatus.INTERNAL_SERVER_ERROR;
        return { message: 'Internal server error' };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: 'uuid' }),
      }),
      response: {
        204: t.Null(),
        404: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ['Tasks'],
        summary: 'Remove task',
        description: 'Remove a task by ID',
      },
    }
  )

  .use(openapi());
