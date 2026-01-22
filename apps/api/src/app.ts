import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { taskRoutes } from "./modules/tasks/task.routes";
import { healthResponse } from "./shared/http";

export const app = new Elysia({ name: "bunstack-api" })
  .get("/health", () => healthResponse)
  .use(taskRoutes)
  .use(cors());
