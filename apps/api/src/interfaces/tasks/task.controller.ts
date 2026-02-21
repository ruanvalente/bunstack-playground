import { Elysia, t } from 'elysia';
import { openapi } from '@elysiajs/openapi';
import { AppError, HttpStatus } from '@/api/shared/errors';
import {
  createTaskSchema,
  paginatedTasksResponseSchema,
  paginationQuerySchema,
  taskSchema,
} from '@bunstack-playground/shared/http';
import { API_VERSION } from '@bunstack-playground/shared';
import { getTaskRepository } from '@/api/infrastructure/database/task.repository.factory';
import {
  ListTasksUseCase,
  CreateTaskUseCase,
  UpdateTaskUseCase,
  CompleteTaskUseCase,
  DeleteTaskUseCase,
} from '@/api/application/tasks';

const taskRepository = getTaskRepository();
const listTasksUseCase = new ListTasksUseCase(taskRepository);
const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
const completeTaskUseCase = new CompleteTaskUseCase(taskRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);

export const taskController = new Elysia({
  prefix: `api/${API_VERSION}/tasks`,
})

  .get(
    '/',
    async ({ query }) => {
      const page = query.page ?? 1;
      const pageSize = query.pageSize ?? 10;
      const sortOrder = (query.sortOrder ?? 'DESC') as 'ASC' | 'DESC';
      const sortBy = (query.sortBy ?? 'created_at') as
        | 'created_at'
        | 'updated_at';
      const statusFilter = query.statusFilter;

      const result = await listTasksUseCase.execute({
        page,
        pageSize,
        sortOrder,
        sortBy,
        statusFilter,
      });

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
    async ({ body, set }) => {
      try {
        const task = await createTaskUseCase.execute(body.title);
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
      body: createTaskSchema,
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
    async ({ params, body, set }) => {
      try {
        const bodyTyped = body as { title: string };
        const task = await updateTaskUseCase.execute(
          params.id,
          bodyTyped.title
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
    async ({ body, set }) => {
      try {
        const bodyTyped = body as { id: string; completed: boolean };
        const task = await completeTaskUseCase.execute(
          bodyTyped.id,
          bodyTyped.completed
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
    async ({ params, set }) => {
      try {
        await deleteTaskUseCase.execute(params.id);
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
