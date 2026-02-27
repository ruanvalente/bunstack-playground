import { useState } from 'react';

import {
  DEFAULT_FILTERS,
  FilterWidget,
  type TaskFilterState,
} from '@shared/ui/filter/filter';
import { CreateTaskWidget } from '@/web/features/tasks/widgets/create-task-widget';

import { TaskListWidget } from '../../features/tasks/widgets/task-list-widget';

export default function TasksPage() {
  const [filters, setFilters] = useState<TaskFilterState>(DEFAULT_FILTERS);

  const handleFilterChange = (newFilters: TaskFilterState) => {
    setFilters(newFilters);
  };

  return (
    <section className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-950">
          My Tasks
        </h1>
        <div className="flex items-center gap-2">
          <FilterWidget filters={filters} onFilterChange={handleFilterChange} />
          <CreateTaskWidget />
        </div>
      </div>
      <TaskListWidget filters={filters} />
    </section>
  );
}
