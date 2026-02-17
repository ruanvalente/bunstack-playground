import { useUserSettings } from "@features/settings/hooks/use-user-settings";
import { useAuthStore } from "@features/auth/store/auth.store";
import type { FormEvent } from "react";

export function ProfileSection() {
  const { profile, updateProfile } = useUserSettings();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateProfile({
      username: formData.get("name") as string,
      email: formData.get("email") as string,
    });
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <header className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
          👤 Perfil
        </h2>
      </header>

      <form className="p-6 space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome
            </label>
            <input
              name="name"
              value={profile.username}
              onChange={(e) => updateProfile({ username: e.target.value })}
              disabled={isAuthenticated}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                         transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Seu nome completo"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={profile.email}
              onChange={(e) => updateProfile({ email: e.target.value })}
              disabled={isAuthenticated}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                         transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="seu@email.com"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isAuthenticated}
            className="w-full md:w-fit px-6 py-2.5 bg-blue-600 hover:bg-blue-700
                     text-white font-medium rounded-lg
                     focus:ring-2 focus:ring-blue-500/40 focus:outline-none
                     transition-all duration-200 shadow-sm hover:shadow hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAuthenticated ? "Gerenciado pelo Auth" : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </section>
  );
}
