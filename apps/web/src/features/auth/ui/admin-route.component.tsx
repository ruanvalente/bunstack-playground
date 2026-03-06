import { Navigate } from 'react-router';

import { useAuthStore } from '@features/auth/store/auth.store';

type AdminRouteProps = {
  children: React.ReactNode;
};

export function AdminRoute({ children }: AdminRouteProps) {
  const userRole = useAuthStore((state) => state.userRole);

  if (userRole !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
