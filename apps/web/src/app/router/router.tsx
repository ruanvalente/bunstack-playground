import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "@shared/layouts/main.layout";
import { QueryClient } from "@tanstack/react-query";

import { dashboardRoutes } from "@features/dashboard/routes";
import { tasksRoutes } from "@features/tasks/routes";
import { settingsRoutes } from "@features/settings/routes";

const router = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      element: <MainLayout />,
      children: [
        ...dashboardRoutes,
        ...tasksRoutes(queryClient),
        ...settingsRoutes,
      ],
    },
  ]);

export function AppRouter({ queryClient }: { queryClient: QueryClient }) {
  return <RouterProvider router={router(queryClient)} />;
}
