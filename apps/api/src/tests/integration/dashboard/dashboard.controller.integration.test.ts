import { describe, expect, test } from 'bun:test';

import { GetDashboardUseCase } from '@/api/application/dashboard/get-dashboard.use-case';

import {
  createMockDashboardData,
  createMockKPIs,
  DashboardRepositoryMock,
} from '../../mocks';

describe('Dashboard Controller - Get Dashboard Flow', () => {
  test('should return dashboard data with default days', async () => {
    const mockData = createMockDashboardData({
      kpis: createMockKPIs({
        totalTasks: 15,
        completedTasks: 10,
        pendingTasks: 5,
        completionRate: 66.7,
      }),
      totals: {
        totalTasks: 15,
        completedTasks: 10,
        pendingTasks: 5,
      },
    });

    const mockRepo = new DashboardRepositoryMock();
    mockRepo.getDashboardData.mockResolvedValue(mockData);

    const getDashboardUseCase = new GetDashboardUseCase(mockRepo);

    const result = await getDashboardUseCase.execute(30, 'user-123');

    expect(result.kpis.totalTasks).toBe(15);
    expect(result.kpis.completedTasks).toBe(10);
    expect(result.kpis.pendingTasks).toBe(5);
    expect(result.totals.totalTasks).toBe(15);
    expect(result.totals.completedTasks).toBe(10);
    expect(result.totals.pendingTasks).toBe(5);
    expect(mockRepo.getDashboardData).toHaveBeenCalledWith(30, 'user-123');
  });

  test('should return dashboard data with custom days parameter', async () => {
    const mockData = createMockDashboardData();
    const mockRepo = new DashboardRepositoryMock();
    mockRepo.getDashboardData.mockResolvedValue(mockData);

    const getDashboardUseCase = new GetDashboardUseCase(mockRepo);

    await getDashboardUseCase.execute(7, 'user-123');

    expect(mockRepo.getDashboardData).toHaveBeenCalledWith(7, 'user-123');
  });

  test('should return KPIs with change percentages', async () => {
    const mockData = createMockDashboardData({
      kpis: {
        totalTasks: 20,
        totalTasksChange: 25.5,
        completedTasks: 15,
        completedTasksChange: 50.0,
        pendingTasks: 5,
        pendingTasksChange: -37.5,
        completionRate: 75.0,
        completionRateChange: 12.5,
      },
    });

    const mockRepo = new DashboardRepositoryMock();
    mockRepo.getDashboardData.mockResolvedValue(mockData);

    const getDashboardUseCase = new GetDashboardUseCase(mockRepo);

    const result = await getDashboardUseCase.execute(30, 'user-123');

    expect(result.kpis.totalTasksChange).toBe(25.5);
    expect(result.kpis.completedTasksChange).toBe(50.0);
    expect(result.kpis.pendingTasksChange).toBe(-37.5);
    expect(result.kpis.completionRateChange).toBe(12.5);
  });

  test('should return charts data with tasks by day', async () => {
    const mockData = createMockDashboardData({
      charts: {
        tasksByDay: [
          { date: '2024-01-10', count: 5 },
          { date: '2024-01-11', count: 3 },
          { date: '2024-01-12', count: 7 },
        ],
        completedByDay: [
          { date: '2024-01-10', count: 2 },
          { date: '2024-01-11', count: 1 },
          { date: '2024-01-12', count: 5 },
        ],
      },
    });

    const mockRepo = new DashboardRepositoryMock();
    mockRepo.getDashboardData.mockResolvedValue(mockData);

    const getDashboardUseCase = new GetDashboardUseCase(mockRepo);

    const result = await getDashboardUseCase.execute(30, 'user-123');

    expect(result.charts.tasksByDay).toHaveLength(3);
    expect(result.charts.tasksByDay[0]!.date).toBe('2024-01-10');
    expect(result.charts.tasksByDay[0]!.count).toBe(5);
    expect(result.charts.completedByDay).toHaveLength(3);
  });

  test('should return empty data for user with no tasks', async () => {
    const mockData = createMockDashboardData({
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

    const mockRepo = new DashboardRepositoryMock();
    mockRepo.getDashboardData.mockResolvedValue(mockData);

    const getDashboardUseCase = new GetDashboardUseCase(mockRepo);

    const result = await getDashboardUseCase.execute(30, 'user-with-no-tasks');

    expect(result.kpis.totalTasks).toBe(0);
    expect(result.kpis.completedTasks).toBe(0);
    expect(result.kpis.pendingTasks).toBe(0);
    expect(result.charts.tasksByDay).toHaveLength(0);
    expect(result.charts.completedByDay).toHaveLength(0);
    expect(result.totals.totalTasks).toBe(0);
  });

  test('should handle large days parameter (365)', async () => {
    const mockData = createMockDashboardData();
    const mockRepo = new DashboardRepositoryMock();
    mockRepo.getDashboardData.mockResolvedValue(mockData);

    const getDashboardUseCase = new GetDashboardUseCase(mockRepo);

    await getDashboardUseCase.execute(365, 'user-123');

    expect(mockRepo.getDashboardData).toHaveBeenCalledWith(365, 'user-123');
  });

  test('should handle small days parameter (1)', async () => {
    const mockData = createMockDashboardData();
    const mockRepo = new DashboardRepositoryMock();
    mockRepo.getDashboardData.mockResolvedValue(mockData);

    const getDashboardUseCase = new GetDashboardUseCase(mockRepo);

    await getDashboardUseCase.execute(1, 'user-123');

    expect(mockRepo.getDashboardData).toHaveBeenCalledWith(1, 'user-123');
  });

  test('should propagate repository errors', async () => {
    const mockRepo = new DashboardRepositoryMock();
    mockRepo.getDashboardData.mockRejectedValue(
      new Error('Database connection failed')
    );

    const getDashboardUseCase = new GetDashboardUseCase(mockRepo);

    await expect(getDashboardUseCase.execute(30, 'user-123')).rejects.toThrow(
      'Database connection failed'
    );
  });
});
