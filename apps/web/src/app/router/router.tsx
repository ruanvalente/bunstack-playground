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
import { AdminRoute } from '@/web/features/auth/ui/admin-route.component';
import { ProtectedRoute } from '@/web/features/auth/ui/protected-route.component';
import { usersRoutes } from '@/web/features/users/routes';
import { LandingPage } from '@/web/landing/lading-page';
import { NotFound } from '@/web/shared/ui/not-found/not-found';

const router = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: '/',
      element: <LandingPage />,
    },
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
          path: '/app',
          element: <Navigate to={'/app/dashboard'} replace />,
        },
        ...dashboardRoutes(queryClient).map((route) => ({
          ...route,
          path: `/app${route.path}`,
        })),
        ...tasksRoutes(queryClient).map((route) => ({
          ...route,
          path: `/app${route.path}`,
        })),
        ...settingsRoutes.map((route) => ({
          ...route,
          path: `/app${route.path}`,
        })),
        ...usersRoutes.map((route) => ({
          ...route,
          path: `/app${route.path}`,
          element: <AdminRoute>{route.element}</AdminRoute>,
        })),
      ],
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

function AuthLayout() {
  return <Outlet />;
}

export function AppRouter({ queryClient }: { queryClient: QueryClient }) {
  return <RouterProvider router={router(queryClient)} />;
}
