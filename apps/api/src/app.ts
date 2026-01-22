import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { taskRoutes } from "./modules/tasks/task.routes";

import { healthSchema } from "@bunstack-playground/shared/http";

export const app = new Elysia({ name: "bunstack-api" })
  .get("/health", () => healthSchema)
  .use(taskRoutes)
  .use(cors());
