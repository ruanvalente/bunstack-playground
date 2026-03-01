import type { DashboardKPIsDTO } from '@bunstack-playground/shared/http';

import { KPICard } from './kpi-card.widget';

type KPIWidgetProps = {
  kpis: DashboardKPIsDTO;
};

export function KPIWidget({ kpis }: KPIWidgetProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Total Tasks"
        value={kpis.totalTasks}
        change={kpis.totalTasksChange}
        icon="tasks"
      />
      <KPICard
        title="Completed Tasks"
        value={kpis.completedTasks}
        change={kpis.completedTasksChange}
        icon="completed"
      />
      <KPICard
        title="Pending Tasks"
        value={kpis.pendingTasks}
        change={kpis.pendingTasksChange}
        icon="pending"
      />
      <KPICard
        title="Completion Rate"
        value={`${kpis.completionRate}%`}
        change={kpis.completionRateChange}
        icon="rate"
      />
    </section>
  );
}
