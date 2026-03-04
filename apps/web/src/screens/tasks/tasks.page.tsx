import { useState } from 'react';

import { Upload } from 'lucide-react';

import { useLanguage } from '@shared/hooks/use-language';
import {
  DEFAULT_FILTERS,
  FilterWidget,
  type TaskFilterState,
} from '@shared/ui/filter/filter';
import { CreateTaskWidget } from '@/web/features/tasks/widgets/create-task-widget';

import { ImportCsvWidget } from '../../features/tasks/widgets/import-csv.widget';
import { TaskListWidget } from '../../features/tasks/widgets/task-list-widget';

export default function TasksPage() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState<TaskFilterState>(DEFAULT_FILTERS);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleFilterChange = (newFilters: TaskFilterState) => {
    setFilters(newFilters);
  };

  return (
    <section className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-950">
          {t.tasks.myTasks}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            {t.import.importCsv}
          </button>
          <FilterWidget filters={filters} onFilterChange={handleFilterChange} />
          <CreateTaskWidget />
        </div>
      </div>
      <TaskListWidget filters={filters} />
      <ImportCsvWidget
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </section>
  );
}
