import { UsersListWidget } from '@/web/features/users/widgets/users-list.widget';
import { useLanguage } from '@/web/shared/hooks/use-language';

export default function UsersPage() {
  const { t } = useLanguage();

  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-950 mb-2">
        {t.users.title}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {t.users.subtitle}
      </p>
      <UsersListWidget />
    </section>
  );
}
