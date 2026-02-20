import { UsersListWidget } from '@/web/features/users/widgets/users-list.widget';

export default function UsersPage() {
  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-950 mb-2">
        Users Page
      </h1>
      <UsersListWidget />
    </section>
  );
}
