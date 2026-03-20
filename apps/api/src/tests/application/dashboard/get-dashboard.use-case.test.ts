import { beforeEach, describe, expect, test } from 'bun:test';

import { GetDashboardUseCase } from '@/api/application/dashboard/get-dashboard.use-case';

import {
  createMockDashboardData,
  createMockKPIs,
  DashboardRepositoryMock,
} from '../../mocks';

describe('GetDashboardUseCase', () => {
  let dashboardRepositoryMock: DashboardRepositoryMock;
  let getDashboardUseCase: GetDashboardUseCase;

  beforeEach(() => {
    dashboardRepositoryMock = new DashboardRepositoryMock();
    getDashboardUseCase = new GetDashboardUseCase(dashboardRepositoryMock);
  });

  test('should return dashboard data successfully with default days', async () => {
    const mockData = createMockDashboardData({
      kpis: createMockKPIs({
        totalTasks: 15,
        completedTasks: 10,
        pendingTasks: 5,
      }),
    });

    dashboardRepositoryMock.getDashboardData.mockResolvedValue(mockData);

    const result = await getDashboardUseCase.execute(30, 'user-123');

    expect(result.kpis.totalTasks).toBe(15);
    expect(result.kpis.completedTasks).toBe(10);
    expect(result.kpis.pendingTasks).toBe(5);
    expect(dashboardRepositoryMock.getDashboardData).toHaveBeenCalledWith(
      30,
      'user-123'
    );
  });

  test('should accept custom days parameter', async () => {
    const mockData = createMockDashboardData();
    dashboardRepositoryMock.getDashboardData.mockResolvedValue(mockData);

    await getDashboardUseCase.execute(7, 'user-456');

    expect(dashboardRepositoryMock.getDashboardData).toHaveBeenCalledWith(
      7,
      'user-456'
    );
  });

  test('should return KPIs with changes', async () => {
    const mockData = createMockDashboardData({
      kpis: {
        totalTasks: 20,
        totalTasksChange: 25.5,
        completedTasks: 15,
        completedTasksChange: 33.3,
        pendingTasks: 5,
        pendingTasksChange: -16.7,
        completionRate: 75.0,
        completionRateChange: 10.5,
      },
    });

    dashboardRepositoryMock.getDashboardData.mockResolvedValue(mockData);

    const result = await getDashboardUseCase.execute(30, 'user-123');

    expect(result.kpis.totalTasksChange).toBe(25.5);
    expect(result.kpis.completedTasksChange).toBe(33.3);
    expect(result.kpis.pendingTasksChange).toBe(-16.7);
    expect(result.kpis.completionRateChange).toBe(10.5);
  });

  test('should return charts data', async () => {
    const mockData = createMockDashboardData({
      charts: {
        tasksByDay: [
          { date: '2024-01-10', count: 5 },
          { date: '2024-01-11', count: 3 },
        ],
        completedByDay: [
          { date: '2024-01-10', count: 2 },
          { date: '2024-01-11', count: 1 },
        ],
      },
    });

    dashboardRepositoryMock.getDashboardData.mockResolvedValue(mockData);

    const result = await getDashboardUseCase.execute(30, 'user-123');

    expect(result.charts.tasksByDay).toHaveLength(2);
    expect(result.charts.completedByDay).toHaveLength(2);
    expect(result.charts.tasksByDay[0]!.date).toBe('2024-01-10');
    expect(result.charts.tasksByDay[0]!.count).toBe(5);
  });

  test('should return totals data', async () => {
    const mockData = createMockDashboardData({
      totals: {
        totalTasks: 25,
        completedTasks: 18,
        pendingTasks: 7,
      },
    });

    dashboardRepositoryMock.getDashboardData.mockResolvedValue(mockData);

    const result = await getDashboardUseCase.execute(30, 'user-123');

    expect(result.totals.totalTasks).toBe(25);
    expect(result.totals.completedTasks).toBe(18);
    expect(result.totals.pendingTasks).toBe(7);
  });

  test('should propagate error from repository', async () => {
    dashboardRepositoryMock.getDashboardData.mockRejectedValue(
      new Error('Database error')
    );

    await expect(getDashboardUseCase.execute(30, 'user-123')).rejects.toThrow(
      'Database error'
    );
  });
});
