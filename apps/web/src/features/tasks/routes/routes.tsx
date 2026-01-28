import { lazy } from "react";
import type { RouteObject } from "react-router";

const TaskListPage = lazy(() =>
  import("@screens/tasks/tasks.page").then((module) => ({
    default: module.TasksPage,
  })),
);

export const tasksRoutes: RouteObject[] = [
  {
    path: "/tasks",
    element: <TaskListPage />,
  },
];
