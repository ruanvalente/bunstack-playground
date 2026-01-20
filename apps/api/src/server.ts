import { app } from "./app";
import { API_PORT } from "../../../packages/shared/src";
import openapi from "@elysiajs/openapi";

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
app.get("/", () => "Welcome to bunstack-playground API!");
app.listen(API_PORT, () => {
  console.log(
    `🚀 bunstack-playground API is running in http://localhost:${API_PORT}`,
  );
});
