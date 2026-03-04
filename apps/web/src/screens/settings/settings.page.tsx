import { AppearanceSection } from '@features/settings/widgets/appearance-section.widget';
import { DangerZoneSection } from '@features/settings/widgets/danger-zone-section.widget';
import { LanguageSection } from '@features/settings/widgets/language-section.widget';
import { NotificationsSection } from '@features/settings/widgets/notifications-section.widget';
import { ProfileSection } from '@features/settings/widgets/profile-section.widget';

import { useLanguage } from '@shared/hooks/use-language';

export default function SettingsPage() {
  const { t } = useLanguage();

  return (
    <section className="p-6">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-950 mb-2">
          {t.settings.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t.settings.subtitle}
        </p>
      </header>

      <div className="space-y-6">
        <ProfileSection />
        <NotificationsSection />
        <AppearanceSection />
        <LanguageSection />
        <DangerZoneSection />
      </div>
    </section>
  );
}
