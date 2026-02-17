import { AuthPage } from '../pages/auth.page';
import { CallbackPage } from '../pages/callback.page';

export const authRoutes = [
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/auth/callback',
    element: <CallbackPage />,
  },
];
