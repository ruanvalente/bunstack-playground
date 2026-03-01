import { Link, useNavigate } from 'react-router-dom';

import { useAuthStore } from '@features/auth/store/auth.store';

import { useHeader } from '@shared/hooks/use-header';

export function Header() {
  const { title, showMenu, user, toggleMenu, closeMenu } = useHeader();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate('/auth');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {title}
        </h1>

        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex items-center gap-3 px-4 py-2 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
          >
            <img
              className="rounded-full"
              src={user.avatar}
              alt={user.name}
              width={40}
              height={40}
            />
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              {user.fullName}
            </span>
            <svg
              className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
                showMenu ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>

              <nav className="p-2 space-y-1">
                <Link
                  to={'/dashboard/settings'}
                  onClick={closeMenu}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  Configurações
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 hover:cursor-pointer rounded-lg transition-colors duration-200"
                >
                  Sair
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
