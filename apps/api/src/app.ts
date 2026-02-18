import { Elysia, file } from "elysia";
import { staticPlugin } from '@elysiajs/static'

import { cors } from "@elysiajs/cors";

import { taskRoutes } from "./modules/tasks/task.routes";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes";
import { authRoutes } from "./modules/auth/auth.routes";

import { healthSchema } from "@bunstack-playground/shared/http";

export const app = new Elysia({ name: "bunstack-api" })
  .use(cors())
  .use(taskRoutes)
  .use(dashboardRoutes)
  .use(authRoutes)
  .get("/health", () => healthSchema)
  .use(
    staticPlugin({
      assets: "../../apps/web/dist",
      prefix: "/",
    }),
  )
  .get("/", () => file('../../apps/web/dist/index.html'))
  .get("/*", () => file('../../apps/web/dist/index.html'));
