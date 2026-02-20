import type { DashboardTotalsDTO } from '@bunstack-playground/shared/http';

type SummaryWidgetProps = {
  totals: DashboardTotalsDTO;
};

export function SummaryWidget({ totals }: SummaryWidgetProps) {
  return (
    <section className="mt-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Tasks
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {totals.totalTasks}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Completed
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
              {totals.completedTasks}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
              {totals.pendingTasks}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
