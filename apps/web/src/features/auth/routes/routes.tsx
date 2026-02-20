import { lazy, Suspense } from 'react';
import { Skeleton } from '@/web/shared/ui/skeleton';

const AuthPage = lazy(() =>
  import('../pages/auth.page').then((module) => ({
    default: module.AuthPage,
  }))
);

const CallbackPage = lazy(() =>
  import('../pages/callback.page').then((module) => ({
    default: module.CallbackPage,
  }))
);

export const authRoutes = [
  {
    path: '/auth',
    element: (
      <Suspense fallback={<Skeleton className="min-h-screen" />}>
        <AuthPage />
      </Suspense>
    ),
  },
  {
    path: '/auth/callback',
    element: (
      <Suspense fallback={<Skeleton className="min-h-screen" />}>
        <CallbackPage />
      </Suspense>
    ),
  },
];
