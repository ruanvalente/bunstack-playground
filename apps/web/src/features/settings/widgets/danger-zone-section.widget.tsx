import { useUserSettings } from "@features/settings/hooks/use-user-settings";

export function DangerZoneSection() {
  const { deleteAccount } = useUserSettings();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: refactor to toast component
    if (
      window.confirm(
        "Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.",
      )
    ) {
      void deleteAccount();
    }
  };

  return (
    <section className="rounded-xl border border-red-600 dark:border-red-800/50 overflow-hidden">
      <header className="px-6 py-5 bg-red-100 dark:bg-red-800/30 border-b border-red-600 dark:border-red-800/70">
        <h2 className="text-xl font-semibold text-red-800 dark:text-red-600 flex items-center gap-3">
          ⚠️ Zona de Perigo
        </h2>
      </header>

      <div className="p-6 bg-red-25 dark:bg-red-950/10">
        <p className="text-sm text-red-700 dark:text-red-400 mb-5">
          Ao deletar sua conta, todos os seus dados serão permanentemente
          removidos. Essa ação não pode ser desfeita.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-full md:w-fit px-6 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800
                       text-white font-medium rounded-lg
                       focus:ring-2 focus:ring-red-500/40 focus:outline-none
                       transition-all duration-200 shadow-sm hover:shadow hover:cursor-pointer"
            >
              Deletar Minha Conta
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
