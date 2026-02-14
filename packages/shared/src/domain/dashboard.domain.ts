export type DashboardKPIs = {
  totalTasks: number;
  totalTasksChange: number;
  completedTasks: number;
  completedTasksChange: number;
  pendingTasks: number;
  pendingTasksChange: number;
  completionRate: number;
  completionRateChange: number;
};

export type ChartDataPoint = {
  date: string;
  count: number;
};

export type DashboardCharts = {
  tasksByDay: ChartDataPoint[];
  completedByDay: ChartDataPoint[];
};

export type DashboardTotals = {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
};

export type DashboardData = {
  kpis: DashboardKPIs;
  charts: DashboardCharts;
  totals: DashboardTotals;
};
