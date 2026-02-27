import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';

import { Skeleton } from '@/web/shared/ui/skeleton';

const UsersPage = lazy(() =>
  import('@/web/screens/users/users.page').then((module) => ({
    default: module.default,
  }))
);

export const usersRoutes: RouteObject[] = [
  {
    path: '/dashboard/users',
    element: (
      <Suspense fallback={<Skeleton />}>
        <UsersPage />
      </Suspense>
    ),
  },
];
