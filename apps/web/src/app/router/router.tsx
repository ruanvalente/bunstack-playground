import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom';
import MainLayout from '@shared/layouts/main.layout';
import { QueryClient } from '@tanstack/react-query';

import { dashboardRoutes } from '@features/dashboard/routes';
import { tasksRoutes } from '@features/tasks/routes';
import { settingsRoutes } from '@features/settings/routes';
import { usersRoutes } from '@/web/features/users/routes';
import { authRoutes } from '@features/auth/routes';
import { ProtectedRoute } from '@/web/features/auth/ui/protected-route.component';

const router = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: '/auth',
      element: <AuthLayout />,
      children: authRoutes.map((route) => ({
        ...route,
        element: route.element,
      })),
    },
    {
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/',
          element: <Navigate to={'/dashboard'} replace />,
        },
        ...dashboardRoutes(queryClient),
        ...tasksRoutes(queryClient),
        ...settingsRoutes,
        ...usersRoutes,
      ],
    },
  ]);

function AuthLayout() {
  return <Outlet />;
}

export function AppRouter({ queryClient }: { queryClient: QueryClient }) {
  return <RouterProvider router={router(queryClient)} />;
}
