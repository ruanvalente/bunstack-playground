import { Elysia, file } from "elysia";
import { staticPlugin } from '@elysiajs/static'

import { cors } from "@elysiajs/cors";

import { taskRoutes } from "./modules/tasks/task.routes";

import { healthSchema } from "@bunstack-playground/shared/http";

export const app = new Elysia({ name: "bunstack-api" })
  .use(
    staticPlugin({
      assets: "../web/dist",
      prefix: "/",
    }),
  )
  .get("/", () => file('../web/dist/index.html'))
  .get("/health", () => healthSchema)
  .use(taskRoutes)
  .use(cors());
