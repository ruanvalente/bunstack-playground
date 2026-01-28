import { createBrowserRouter, RouterProvider } from "react-router";

import MainLayout from "@shared/layouts/main.layout";

import { tasksRoutes } from "@features/tasks/routes";
import { settingsRoutes } from "@features/settings/routes";
import { dashboardRoutes } from "@features/dashboard/routes";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [...dashboardRoutes, ...tasksRoutes, ...settingsRoutes],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
