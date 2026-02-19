import { openapi } from "@elysiajs/openapi";
import { app } from "./app";
import { config } from "./config";

import { runMigrations } from "@/api/infra/database/migrations";
import { runSeeds } from "@/api/infra/database/seeds";
import { API_PORT } from "@bunstack-playground/shared";

const PORT = Number(process.env.PORT) || API_PORT;

async function start() {
  try {
    if (config.shouldRunSeeds()) {
      runSeeds();
    }
    if (config.shouldRunMigrations()) {
      runMigrations();
    }

    app.use(
      openapi({
        path: "/swagger-ui",
        documentation: {
          info: {
            title: "Task API",
            description: "API para gerenciamento de tarefas",
            version: "1.0.0",
          },
          tags: [{ name: "Tasks", description: "API for task management" }],
        },
      }),
    );

    Bun.serve({
      port: PORT,
      fetch: app.handle,
    });
  } catch {
    process.exit(1);
  }
}

start();

export default app;
