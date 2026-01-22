import { TaskListWidget } from "../../features/tasks/widgets/task-list-widget";

export function TasksPage() {
  return (
    <section className="p-6">
      <h1 className="text-xl font-bold mb-4">My Tasks</h1>
      <TaskListWidget />
    </section>
  );
}
