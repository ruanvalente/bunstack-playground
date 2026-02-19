import { Elysia, file } from "elysia";
import { staticPlugin } from '@elysiajs/static'

import { cors } from "@elysiajs/cors";

import { taskRoutes } from "./modules/tasks/task.routes";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes";
import { authRoutes } from "./modules/auth/auth.routes";

import { healthSchema } from "@bunstack-playground/shared/http";

const isProduction = process.env.NODE_ENV === "production";
const isRailway = process.env.RAILWAY_STATIC_URL !== undefined;
const serveStatic = isProduction || isRailway;

const app = new Elysia({ name: "bunstack-api" });

if (serveStatic) {
  app.use(
    staticPlugin({
      assets: "apps/web/dist",
      prefix: "/",
    }),
  );
}

app
  .use(cors())
  .use(taskRoutes)
  .use(dashboardRoutes)
  .use(authRoutes)
  .get("/health", () => healthSchema);

if (serveStatic) {
  app.get("/", () => file('apps/web/dist/index.html'));
  app.get("/*", () => file('apps/web/dist/index.html'));
} else {
  app.get("/", () => "OK");
}

export { app };
