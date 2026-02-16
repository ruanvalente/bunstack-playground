import { useUserSettings } from "@features/settings/hooks/use-user-settings";
import { useState } from "react";
import type { ThemeMode } from "../types/user-settings.types";

export function AppearanceSection() {
  const { theme: currentTheme, setTheme } = useUserSettings();
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(currentTheme);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTheme(selectedTheme);
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <header className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
          🎨 Aparência
        </h2>
      </header>

      <form className="p-6 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="theme"
              value="light"
              checked={selectedTheme === "light"}
              onChange={() => setSelectedTheme("light")}
              className="w-5 h-5 accent-blue-600 border-gray-300 dark:border-gray-600
                         focus:ring-blue-500/30"
            />
            <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Tema Claro
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={selectedTheme === "dark"}
              onChange={() => setSelectedTheme("dark")}
              className="w-5 h-5 accent-blue-600 border-gray-300 dark:border-gray-600
                         focus:ring-blue-500/30"
            />
            <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Tema Escuro
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="theme"
              value="system"
              checked={selectedTheme === "system"}
              onChange={() => setSelectedTheme("system")}
              className="w-5 h-5 accent-blue-600 border-gray-300 dark:border-gray-600
                         focus:ring-blue-500/30"
            />
            <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Tema do Sistema
            </span>
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full md:w-fit px-6 py-2.5 bg-blue-600 hover:bg-blue-700
                     text-white font-medium rounded-lg
                     focus:ring-2 focus:ring-blue-500/40 focus:outline-none
                     transition-all duration-200 shadow-sm hover:shadow hover:cursor-pointer"
          >
            Aplicar Tema
          </button>
        </div>
      </form>
    </section>
  );
}
