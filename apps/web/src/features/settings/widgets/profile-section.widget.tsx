import { useUserSettings } from "@shared/hooks/use-user-settings";

export function ProfileSection() {
  const { profile, updateProfile } = useUserSettings();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nameEl = form.elements.namedItem("name");
    const emailEl = form.elements.namedItem("email");
    if (nameEl && "value" in nameEl && emailEl && "value" in emailEl) {
      updateProfile({ username: nameEl.value, email: emailEl.value });
    }
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
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                         transition-all duration-200 outline-none"
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
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                         transition-all duration-200 outline-none"
              placeholder="seu@email.com"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full md:w-fit px-6 py-2.5 bg-blue-600 hover:bg-blue-700
                     text-white font-medium rounded-lg
                     focus:ring-2 focus:ring-blue-500/40 focus:outline-none
                     transition-all duration-200 shadow-sm hover:shadow hover:cursor-pointer"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </section>
  );
}
