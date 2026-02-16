import { TaskListWidget } from "../../features/tasks/widgets/task-list-widget";

export default function TasksPage() {
  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-950 mb-2">
        My Tasks
      </h1>
      <TaskListWidget />
    </section>
  );
}
