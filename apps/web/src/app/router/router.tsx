import { createBrowserRouter, RouterProvider } from "react-router";

import { tasksRoutes } from "../../features/tasks/routes";
import { settingsRoutes } from "../../features/settings/routes";

import MainLayout from "../../shared/layouts/main.layout";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [...tasksRoutes, ...settingsRoutes],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
