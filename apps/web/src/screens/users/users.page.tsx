import { UsersListWidget } from "@/web/features/users/widgets/users-list.widget";

export default function UsersPage() {
  return (
    <section className="p-6">
      <h1 className="text-xl font-bold mb-4">Users Page</h1>
      <UsersListWidget />
    </section>
  );
}
