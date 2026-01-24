import { Elysia, t } from "elysia";
import openapi from "@elysiajs/openapi";

import { AppError, HttpStatus } from "../../shared/errors";
import { taskService } from "./task.service";

import {
  createTaskSchema,
  paginatedTasksResponseSchema,
  paginationQuerySchema,
  taskSchema,
} from "@bunstack-playground/shared/http";

export const taskRoutes = new Elysia({ prefix: "/tasks" })

  /**
   * LIST TASKS
   */
  .get(
    "/",
    async ({ query }) => {
      // Set default values
      const page = query.page ?? 1;
      const pageSize = query.pageSize ?? 10;
      const sortOrder = (query.sortOrder ?? "DESC") as "ASC" | "DESC";

      const result = await taskService.list({
        page,
        pageSize,
        sortOrder,
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
          sortBy: "createdAt",
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
        tags: ["Tasks"],
        summary: "Lists all tasks with pagination",
        description: "Return all tasks with pagination, sorting and metadata",
      },
    },
  )

  /**
   * CREATE TASK
   */
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const task = await taskService.create(body.title);
        set.status = HttpStatus.CREATED;
        return task;
      } catch (error) {
        if (error instanceof AppError) {
          set.status = error.statusCode;
          return { message: error.message };
        }
        set.status = HttpStatus.INTERNAL_SERVER_ERROR;
        return { message: "Internal server error" };
      }
    },
    {
      body: createTaskSchema,
      response: {
        201: taskSchema,
      },
      detail: {
        tags: ["Tasks"],
        summary: "Create Task",
        description: "Create a new task with the given title",
      },
    },
  )

  /**
   * UPDATE TASK
   */
  .put(
    "/:id",
    async ({ params, body, set }) => {
      try {
        const task = await taskService.update(params.id, body.title);
        return { ...task, createdAt: task.createdAt };
      } catch (error) {
        if (error instanceof AppError) {
          set.status = error.statusCode;
          return { message: error.message };
        }
        set.status = HttpStatus.INTERNAL_SERVER_ERROR;
        return { message: "Internal server error" };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      body: t.Object({
        title: t.String({
          minLength: 3,
          description: "Título atualizado da tarefa",
        }),
      }),
      response: {
        200: taskSchema,
        404: t.Object({ message: t.String() }),
        400: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ["Tasks"],
        summary: "Update task",
        description: "Update a task's title by ID",
      },
    },
  )

  /**
   * COMPLETE TASK
   */
  .patch(
    "/:id/complete",
    async ({ body, set }) => {
      try {
        const task = await taskService.complete(body.id, body.completed);
        return { ...task, createdAt: task.createdAt };
      } catch (error) {
        if (error instanceof AppError) {
          set.status = error.statusCode;
          return { message: error.message };
        }
        set.status = HttpStatus.INTERNAL_SERVER_ERROR;
        return { message: "Internal server error" };
      }
    },
    {
      
      body: t.Object({
        id: t.String({ format: "uuid" }),
        completed: t.Boolean({ description: "New completion status" }),
      }),
      response: {
        200: taskSchema,
        404: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ["Tasks"],
        summary: "Completed task",
        description: "Checked a task as completed by ID",
      },
    },
  )

  /**
   * DELETE TASK
   */
  .delete(
    "/:id",
    async ({ params, set }) => {
      try {
        await taskService.delete(params.id);
        set.status = HttpStatus.NO_CONTENT;
        return null;
      } catch (error) {
        if (error instanceof AppError) {
          set.status = error.statusCode;
          return { message: error.message };
        }
        set.status = HttpStatus.INTERNAL_SERVER_ERROR;
        return { message: "Internal server error" };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      response: {
        204: t.Null(),
        404: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ["Tasks"],
        summary: "Remove task",
        description: "Remove a task by ID",
      },
    },
  )

  .use(openapi());
