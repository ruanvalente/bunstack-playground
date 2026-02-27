import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';

import { Skeleton } from '@/web/shared/ui/skeleton';

const SettingsPage = lazy(() =>
  import('@screens/settings/settings.page').then((module) => ({
    default: module.default,
  }))
);

export const settingsRoutes: RouteObject[] = [
  {
    path: '/dashboard/settings',
    element: (
      <Suspense fallback={<Skeleton />}>
        <SettingsPage />
      </Suspense>
    ),
  },
];
