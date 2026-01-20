import { Elysia, t } from "elysia";
import openapi from "@elysiajs/openapi";

import { taskService } from "./task.service";

import { taskHttpSchema, createTaskHttpSchema } from "../../shared/http";

export const taskRoutes = new Elysia({ prefix: "/tasks" })

  /**
   * LIST TASKS
   */
  .get(
    "/",
    () => {
      const tasks = taskService.list();
      return tasks.map((task) => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
      }));
    },
    {
      response: {
        200: t.Array(taskHttpSchema),
      },
      detail: {
        tags: ["Tasks"],
        summary: "Lists all tasks",
        description: "Return all tasks",
      },
    },
  )

  /**
   * CREATE TASK
   */
  .post("/", ({ body }) => taskService.create(body.title), {
    body: createTaskHttpSchema,
    response: {
      201: taskHttpSchema,
    },
    detail: {
      tags: ["Tasks"],
      summary: "Create Task",
      description: "Create a new task with the given title",
    },
  })

  /**
   * UPDATE TASK
   */
  .put(
    "/:id",
    ({ params, body, set }) => {
      const task = taskService.update(params.id, body.title);
      if (!task) {
        set.status = 404;
        return [];
      }
      return { ...task, createdAt: task.createdAt.toISOString() };
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
        200: taskHttpSchema,
        404: t.Array(taskHttpSchema),
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
    ({ params }) => {
      const task = taskService.complete(params.id);
      return task ? { ...task, createdAt: task.createdAt.toISOString() } : null;
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      response: {
        200: taskHttpSchema,
        404: t.Null(),
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
  .delete("/:id", ({ params }) => taskService.delete(params.id), {
    params: t.Object({
      id: t.String({ format: "uuid" }),
    }),
    response: {
      204: t.Null(),
    },
    detail: {
      tags: ["Tasks"],
      summary: "Remove task",
      description: "Remove a task by ID",
    },
  })

  .use(openapi());
