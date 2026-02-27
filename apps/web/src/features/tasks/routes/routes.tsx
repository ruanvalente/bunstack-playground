import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';

import type { QueryClient } from '@tanstack/react-query';

import { Skeleton } from '@/web/shared/ui/skeleton';

import { tasksLoader } from '../loaders/tasksLoader';

const TaskListPage = lazy(() =>
  import('@screens/tasks/tasks.page').then((module) => ({
    default: module.default,
  }))
);

export const tasksRoutes = (queryClient: QueryClient): RouteObject[] => [
  {
    path: '/dashboard/tasks',
    element: (
      <Suspense fallback={<Skeleton />}>
        <TaskListPage />
      </Suspense>
    ),
    loader: tasksLoader(queryClient),
  },
];
