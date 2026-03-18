import { mock } from 'bun:test';

import type {
  ChartDataPoint,
  DashboardData,
} from '@bunstack-playground/shared';

import type { IDashboardRepository } from '@/api/domain/repositories';

type GetDashboardDataParams = (
  days: number,
  userId: string
) => Promise<DashboardData>;

const DEFAULT_CHART_DATA_POINT: ChartDataPoint = {
  date: new Date().toISOString().split('T')[0] ?? '',
  count: 0,
};

const DEFAULT_KPIS: DashboardData['kpis'] = {
  totalTasks: 0,
  totalTasksChange: 0,
  completedTasks: 0,
  completedTasksChange: 0,
  pendingTasks: 0,
  pendingTasksChange: 0,
  completionRate: 0,
  completionRateChange: 0,
};

const DEFAULT_CHARTS: DashboardData['charts'] = {
  tasksByDay: [],
  completedByDay: [],
};

const DEFAULT_TOTALS: DashboardData['totals'] = {
  totalTasks: 0,
  completedTasks: 0,
  pendingTasks: 0,
};

const DEFAULT_DASHBOARD_DATA: DashboardData = {
  kpis: DEFAULT_KPIS,
  charts: DEFAULT_CHARTS,
  totals: DEFAULT_TOTALS,
};

export class DashboardRepositoryMock implements IDashboardRepository {
  getDashboardData = mock<GetDashboardDataParams>(async () => ({
    ...DEFAULT_DASHBOARD_DATA,
  }));

  clear(): void {
    this.getDashboardData.mockClear();
  }
}

export type MockDashboardDataOverrides = Partial<DashboardData>;
export type MockKPIsOverrides = Partial<DashboardData['kpis']>;
export type MockChartsOverrides = Partial<DashboardData['charts']>;
export type MockTotalsOverrides = Partial<DashboardData['totals']>;
export type MockChartDataPointOverrides = Partial<ChartDataPoint>;

export const createMockChartDataPoint = (
  overrides?: MockChartDataPointOverrides
): ChartDataPoint => ({
  date: '2024-01-15',
  count: 5,
  ...overrides,
});

export const createMockKPIs = (
  overrides?: MockKPIsOverrides
): DashboardData['kpis'] => ({
  totalTasks: 10,
  totalTasksChange: 15.5,
  completedTasks: 7,
  completedTasksChange: 20.0,
  pendingTasks: 3,
  pendingTasksChange: -25.0,
  completionRate: 70.0,
  completionRateChange: 5.5,
  ...overrides,
});

export const createMockCharts = (
  overrides?: MockChartsOverrides
): DashboardData['charts'] => ({
  tasksByDay: [
    createMockChartDataPoint({ date: '2024-01-10', count: 3 }),
    createMockChartDataPoint({ date: '2024-01-11', count: 5 }),
    createMockChartDataPoint({ date: '2024-01-12', count: 2 }),
  ],
  completedByDay: [
    createMockChartDataPoint({ date: '2024-01-10', count: 1 }),
    createMockChartDataPoint({ date: '2024-01-11', count: 3 }),
    createMockChartDataPoint({ date: '2024-01-12', count: 1 }),
  ],
  ...overrides,
});

export const createMockTotals = (
  overrides?: MockTotalsOverrides
): DashboardData['totals'] => ({
  totalTasks: 10,
  completedTasks: 7,
  pendingTasks: 3,
  ...overrides,
});

export const createMockDashboardData = (
  overrides?: MockDashboardDataOverrides
): DashboardData => ({
  kpis: createMockKPIs(overrides?.kpis),
  charts: createMockCharts(overrides?.charts),
  totals: createMockTotals(overrides?.totals),
});

export const createEmptyDashboardData = (): DashboardData => ({
  kpis: {
    totalTasks: 0,
    totalTasksChange: 0,
    completedTasks: 0,
    completedTasksChange: 0,
    pendingTasks: 0,
    pendingTasksChange: 0,
    completionRate: 0,
    completionRateChange: 0,
  },
  charts: {
    tasksByDay: [],
    completedByDay: [],
  },
  totals: {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  },
});

export const createDashboardDataWithIncrease = (
  currentTotal: number,
  currentCompleted: number,
  previousTotal: number,
  previousCompleted: number
): DashboardData => {
  const currentPending = currentTotal - currentCompleted;
  const previousPending = previousTotal - previousCompleted;
  const currentRate =
    currentTotal > 0
      ? Math.round((currentCompleted / currentTotal) * 100 * 10) / 10
      : 0;
  const previousRate =
    previousTotal > 0
      ? Math.round((previousCompleted / previousTotal) * 100 * 10) / 10
      : 0;

  const calculateChange = (current: number, previous: number): number => {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return Math.round(((current - previous) / previous) * 100 * 10) / 10;
  };

  return {
    kpis: {
      totalTasks: currentTotal,
      totalTasksChange: calculateChange(currentTotal, previousTotal),
      completedTasks: currentCompleted,
      completedTasksChange: calculateChange(
        currentCompleted,
        previousCompleted
      ),
      pendingTasks: currentPending,
      pendingTasksChange: calculateChange(currentPending, previousPending),
      completionRate: currentRate,
      completionRateChange: Math.round((currentRate - previousRate) * 10) / 10,
    },
    charts: { tasksByDay: [], completedByDay: [] },
    totals: {
      totalTasks: currentTotal,
      completedTasks: currentCompleted,
      pendingTasks: currentPending,
    },
  };
};
