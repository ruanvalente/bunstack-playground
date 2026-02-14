import type { DashboardChartsDTO } from "@bunstack-playground/shared/http";
import { BarChartWidget } from "./bar-chart.widget";
import { LineChartWidget } from "./line-chart.widget";

type ChartsWidgetProps = {
  charts: DashboardChartsDTO;
};

export function ChartsWidget({ charts }: ChartsWidgetProps) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Tasks Created</h3>
        <p className="text-sm text-gray-500 mt-1">
          Tasks created per day (last 30 days)
        </p>
        <div className="mt-6 h-64">
          <BarChartWidget data={charts.tasksByDay} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Tasks Completed</h3>
        <p className="text-sm text-gray-500 mt-1">
          Tasks completed per day (last 30 days)
        </p>
        <div className="mt-6 h-64">
          <LineChartWidget data={charts.completedByDay} />
        </div>
      </div>
    </section>
  );
}
