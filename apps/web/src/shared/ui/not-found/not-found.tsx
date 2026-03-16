import { Link } from 'react-router';

import { useAuth } from '@/web/features/auth/hooks/use-auth';
import { useLanguage } from '@/web/shared/hooks/use-language';

export function NotFound() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const notFound = t.notFound;

  const destination = isAuthenticated ? '/app/dashboard' : '/';

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center px-8">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-900 mb-3">
          {notFound.title}
        </p>
        <p className="text-gray-500 mb-8">{notFound.description}</p>
        <Link
          to={destination}
          className="inline-block px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          {notFound.goHome}
        </Link>
      </div>
    </div>
  );
}
