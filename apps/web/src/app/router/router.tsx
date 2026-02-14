import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "@shared/layouts/main.layout";
import { QueryClient } from "@tanstack/react-query";

import { dashboardRoutes } from "@features/dashboard/routes";
import { tasksRoutes } from "@features/tasks/routes";
import { settingsRoutes } from "@features/settings/routes";
import { usersRoutes } from "@/web/features/users/routes";

const router = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <Navigate to={"/dashboard"} replace />,
        },
        ...dashboardRoutes(queryClient),
        ...tasksRoutes(queryClient),
        ...settingsRoutes,
        ...usersRoutes,
      ],
    },
  ]);

export function AppRouter({ queryClient }: { queryClient: QueryClient }) {
  return <RouterProvider router={router(queryClient)} />;
}
