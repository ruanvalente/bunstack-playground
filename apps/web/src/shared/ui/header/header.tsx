import { Link } from "react-router";
import { useHeader } from "../../hooks/use-header";

export function Header() {
  const { title, showMenu, user, toggleMenu, closeMenu } = useHeader();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>

        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <img
              className="rounded-full"
              src={user.avatar}
              alt={user.name}
              width={40}
              height={40}
            />
            <span className="text-gray-700 font-medium">{user.name}</span>
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform ${
                showMenu ? "rotate-180" : ""
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
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">user@example.com</p>
              </div>

              <nav className="p-2 space-y-1">
                <Link
                  to={"/settings"}
                  onClick={closeMenu}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  Configurações
                </Link>

                <button
                  onClick={closeMenu}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:cursor-pointer rounded-lg transition-colors duration-200"
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
