import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import type { QueryClient } from "@tanstack/react-query";
import { tasksLoader } from "../loaders/tasksLoader";

const TaskListPage = lazy(() =>
  import("@screens/tasks/tasks.page").then((module) => ({
    default: module.TasksPage,
  })),
);

export const tasksRoutes = (queryClient: QueryClient): RouteObject[] => [
  {
    path: "/tasks",
    element: <TaskListPage />,
    loader: tasksLoader(queryClient),
  },
];
