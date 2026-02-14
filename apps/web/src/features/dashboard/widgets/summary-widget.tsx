import type { DashboardTotalsDTO } from "@bunstack-playground/shared/http";

type SummaryWidgetProps = {
  totals: DashboardTotalsDTO;
};

export function SummaryWidget({ totals }: SummaryWidgetProps) {
  return (
    <section className="mt-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {totals.totalTasks}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {totals.completedTasks}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {totals.pendingTasks}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
