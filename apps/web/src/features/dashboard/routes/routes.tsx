import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import type { QueryClient } from '@tanstack/react-query';

import { Skeleton } from '@/web/shared/ui/skeleton';
import { dashboardLoader } from '../loaders/dashboard.loader';

const DashboardPage = lazy(() =>
  import('@screens/dashboard/dashboard.page').then((module) => ({
    default: module.default,
  }))
);

export const dashboardRoutes = (queryClient: QueryClient): RouteObject[] => [
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<Skeleton />}>
        <DashboardPage />
      </Suspense>
    ),
    loader: dashboardLoader(queryClient),
  },
];
