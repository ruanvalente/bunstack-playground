import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom';

import { authRoutes } from '@features/auth/routes';
import { dashboardRoutes } from '@features/dashboard/routes';
import { settingsRoutes } from '@features/settings/routes';
import { tasksRoutes } from '@features/tasks/routes';
import { QueryClient } from '@tanstack/react-query';

import MainLayout from '@shared/layouts/main.layout';
import { ProtectedRoute } from '@/web/features/auth/ui/protected-route.component';
import { usersRoutes } from '@/web/features/users/routes';

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
