import { ProfileSection } from "@features/settings/widgets/profile-section.widget";
import { NotificationsSection } from "@features/settings/widgets/notifications-section.widget";
import { AppearanceSection } from "@features/settings/widgets/appearance-section.widget";
import { DangerZoneSection } from "@features/settings/widgets/danger-zone-section.widget";

export default function SettingsPage() {
  return (
    <section className="p-6">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Configurações
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie suas preferências e configurações da aplicação
        </p>
      </header>

      <div className="space-y-6">
        <ProfileSection />
        <NotificationsSection />
        <AppearanceSection />
        <DangerZoneSection />
      </div>
    </section>
  );
}
