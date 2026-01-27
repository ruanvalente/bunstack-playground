import openapi from "@elysiajs/openapi";
import { API_PORT } from "../../../packages/shared/src";
import { app } from "./app";
import { config } from "./config";

import { runMigrations } from "./infra/database/migrations";
import { runSeeds } from "./infra/database/seeds";

async function start() {
  try {
    if (config.shouldRunSeeds()) {
      runSeeds();
    }
    runMigrations();

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


    app.listen(API_PORT, () => {
      console.log(
        `🚀 bunstack-playground API is running in http://localhost:${API_PORT}`,
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

start();
