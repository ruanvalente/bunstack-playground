
import { useSidebar } from "@shared/hooks/use-sidebar";

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { isOpen, toggle } = useSidebar();

  return (
    <>
      <div className="p-6 border-b border-gray-700 flex items-center justify-between">
        {isOpen ? (
          <h2 className="text-2xl font-bold text-white flex gap-2">
            <span className="text-blue-400">📋</span> My System
          </h2>
        ) : (
          <div className="w-full text-center text-3xl">📋</div>
        )}
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2">{children}</nav>

      <div className="p-4 border-t border-gray-700 flex items-center gap-2">
        <p className="text-xs text-gray-400 flex-1">
          {isOpen ? "Frontend Boilerplate v1.0.0" : "•"}
        </p>

        <button
          onClick={toggle}
          title={isOpen ? "Fechar menu" : "Abrir menu"}
          className="p-2 hover:bg-gray-700 rounded-lg"
        >
          <svg
            className={`w-5 h-5 text-gray-300 transition-transform ${
              !isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
