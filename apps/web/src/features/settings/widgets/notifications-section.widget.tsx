import { useUserSettings } from "@features/settings/hooks/use-user-settings";
import type { FormEvent } from "react";

export function NotificationsSection() {
  const { notifications, updateNotifications } = useUserSettings();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <header className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
          🔔 Notificações
        </h2>
      </header>

      <form className="p-6 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <label className="flex items-center justify-between group">
            <span className="text-gray-700 dark:text-gray-300">
              Notificações por email
            </span>
            <input
              name="emailNotifications"
              type="checkbox"
              checked={notifications.emailNotifications}
              onChange={(e) =>
                updateNotifications({ emailNotifications: e.target.checked })
              }
              className="w-5 h-5 accent-blue-600 cursor-pointer rounded border-gray-300 dark:border-gray-600
                         focus:ring-blue-500/30"
            />
          </label>

          <label className="flex items-center justify-between group">
            <span className="text-gray-700 dark:text-gray-300">
              Recordatórios de tarefas
            </span>
            <input
              name="taskReminders"
              type="checkbox"
              checked={notifications.taskReminders}
              onChange={(e) =>
                updateNotifications({ taskReminders: e.target.checked })
              }
              className="w-5 h-5 accent-blue-600 cursor-pointer rounded border-gray-300 dark:border-gray-600
                         focus:ring-blue-500/30"
            />
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
            Salvar Preferências
          </button>
        </div>
      </form>
    </section>
  );
}
