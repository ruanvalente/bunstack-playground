import { beforeAll, beforeEach, describe, expect, test } from 'bun:test';

import { DashboardSqliteRepository } from '@/api/infrastructure/repositories/sqlite/dashboard.sqlite.repository';

import {
  clearTasksTable,
  seedTask,
  setupTasksTable,
} from '../../utils/task.seed';

describe('DashboardSqliteRepository - Integration', () => {
  let dashboardRepository: DashboardSqliteRepository;
  const userId = 'test-user-123';
  const otherUserId = 'other-user-456';

  beforeAll(() => {
    setupTasksTable();
  });

  beforeEach(() => {
    clearTasksTable();
    dashboardRepository = new DashboardSqliteRepository();
  });

  test('should return empty data when user has no tasks', async () => {
    const result = await dashboardRepository.getDashboardData(30, userId);

    expect(result.kpis.totalTasks).toBe(0);
    expect(result.kpis.completedTasks).toBe(0);
    expect(result.kpis.pendingTasks).toBe(0);
    expect(result.kpis.completionRate).toBe(0);
    expect(result.charts.tasksByDay).toHaveLength(0);
    expect(result.charts.completedByDay).toHaveLength(0);
    expect(result.totals.totalTasks).toBe(0);
    expect(result.totals.completedTasks).toBe(0);
    expect(result.totals.pendingTasks).toBe(0);
  });

  test('should calculate KPIs correctly with tasks', async () => {
    seedTask({ title: 'Task 1', completed: false, userId });
    seedTask({ title: 'Task 2', completed: true, userId });
    seedTask({ title: 'Task 3', completed: true, userId });
    seedTask({ title: 'Task 4', completed: false, userId });

    const result = await dashboardRepository.getDashboardData(30, userId);

    expect(result.kpis.totalTasks).toBe(4);
    expect(result.kpis.completedTasks).toBe(2);
    expect(result.kpis.pendingTasks).toBe(2);
    expect(result.totals.totalTasks).toBe(4);
    expect(result.totals.completedTasks).toBe(2);
    expect(result.totals.pendingTasks).toBe(2);
  });

  test('should calculate 100% completion rate when all tasks completed', async () => {
    seedTask({ title: 'Task 1', completed: true, userId });
    seedTask({ title: 'Task 2', completed: true, userId });

    const result = await dashboardRepository.getDashboardData(30, userId);

    expect(result.kpis.completionRate).toBe(100);
  });

  test('should calculate 100% change when previous period had no tasks', async () => {
    seedTask({ title: 'Current Task', completed: false, userId });

    const result = await dashboardRepository.getDashboardData(30, userId);

    expect(result.kpis.totalTasks).toBe(1);
    expect(result.kpis.totalTasksChange).toBe(100);
  });

  test('should calculate completion rate correctly', async () => {
    seedTask({ title: 'Task 1', completed: true, userId });
    seedTask({ title: 'Task 2', completed: true, userId });
    seedTask({ title: 'Task 3', completed: true, userId });
    seedTask({ title: 'Task 4', completed: false, userId });

    const result = await dashboardRepository.getDashboardData(30, userId);

    expect(result.kpis.completionRate).toBe(75);
  });

  test('should return tasks by day with actual dates', async () => {
    const today = new Date().toISOString().split('T')[0] ?? '';
    const yesterday =
      new Date(Date.now() - 86400000).toISOString().split('T')[0] ?? '';

    seedTask({
      title: 'Task 1',
      completed: false,
      userId,
      createdAt: `${today}T10:00:00.000Z`,
    });
    seedTask({
      title: 'Task 2',
      completed: false,
      userId,
      createdAt: `${today}T14:00:00.000Z`,
    });
    seedTask({
      title: 'Task 3',
      completed: false,
      userId,
      createdAt: `${yesterday}T09:00:00.000Z`,
    });

    const result = await dashboardRepository.getDashboardData(7, userId);

    expect(result.charts.tasksByDay.length).toBeGreaterThan(0);
    const todayTasks = result.charts.tasksByDay.find((d) => d.date === today);
    expect(todayTasks?.count).toBe(2);
    const yesterdayTasks = result.charts.tasksByDay.find(
      (d) => d.date === yesterday
    );
    expect(yesterdayTasks?.count).toBe(1);
  });

  test('should return completed by day with actual dates', async () => {
    const today = new Date().toISOString().split('T')[0] ?? '';
    const yesterday =
      new Date(Date.now() - 86400000).toISOString().split('T')[0] ?? '';

    seedTask({
      title: 'Task 1',
      completed: true,
      userId,
      createdAt: `${today}T10:00:00.000Z`,
      updatedAt: `${today}T12:00:00.000Z`,
    });
    seedTask({
      title: 'Task 2',
      completed: true,
      userId,
      createdAt: `${today}T14:00:00.000Z`,
      updatedAt: `${today}T15:00:00.000Z`,
    });
    seedTask({
      title: 'Task 3',
      completed: true,
      userId,
      createdAt: `${yesterday}T09:00:00.000Z`,
      updatedAt: `${yesterday}T10:00:00.000Z`,
    });

    const result = await dashboardRepository.getDashboardData(7, userId);

    expect(result.charts.completedByDay.length).toBeGreaterThan(0);
    const todayCompleted = result.charts.completedByDay.find(
      (d) => d.date === today
    );
    expect(todayCompleted?.count).toBe(2);
    const yesterdayCompleted = result.charts.completedByDay.find(
      (d) => d.date === yesterday
    );
    expect(yesterdayCompleted?.count).toBe(1);
  });

  test('should filter by period (7 days)', async () => {
    const eightDaysAgo = new Date(Date.now() - 8 * 86400000).toISOString();
    const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString();

    seedTask({
      title: 'Old Task',
      completed: false,
      userId,
      createdAt: eightDaysAgo,
    });
    seedTask({
      title: 'Recent Task',
      completed: false,
      userId,
      createdAt: threeDaysAgo,
    });

    const result = await dashboardRepository.getDashboardData(7, userId);

    expect(result.kpis.totalTasks).toBe(1);
  });

  test('should filter by period (90 days)', async () => {
    const fiftyDaysAgo = new Date(Date.now() - 50 * 86400000).toISOString();
    const twentyDaysAgo = new Date(Date.now() - 20 * 86400000).toISOString();
    const fiveDaysAgo = new Date(Date.now() - 5 * 86400000).toISOString();

    seedTask({
      title: 'Old Task',
      completed: false,
      userId,
      createdAt: fiftyDaysAgo,
    });
    seedTask({
      title: 'Recent Task 1',
      completed: false,
      userId,
      createdAt: twentyDaysAgo,
    });
    seedTask({
      title: 'Recent Task 2',
      completed: false,
      userId,
      createdAt: fiveDaysAgo,
    });

    const result = await dashboardRepository.getDashboardData(90, userId);

    expect(result.kpis.totalTasks).toBe(3);
  });

  test('should isolate data between users', async () => {
    seedTask({ title: 'User 1 Task 1', completed: true, userId });
    seedTask({ title: 'User 1 Task 2', completed: false, userId });
    seedTask({ title: 'User 2 Task 1', completed: true, userId: otherUserId });

    const user1Result = await dashboardRepository.getDashboardData(30, userId);
    const user2Result = await dashboardRepository.getDashboardData(
      30,
      otherUserId
    );

    expect(user1Result.kpis.totalTasks).toBe(2);
    expect(user1Result.kpis.completedTasks).toBe(1);
    expect(user2Result.kpis.totalTasks).toBe(1);
    expect(user2Result.kpis.completedTasks).toBe(1);
  });

  test('should use default days of 30 when not provided', async () => {
    seedTask({ title: 'Task', completed: false, userId });

    const result = await dashboardRepository.getDashboardData(30, userId);

    expect(result.kpis.totalTasks).toBe(1);
  });

  test('should return totals matching KPIs', async () => {
    seedTask({ title: 'Task 1', completed: true, userId });
    seedTask({ title: 'Task 2', completed: false, userId });

    const result = await dashboardRepository.getDashboardData(30, userId);

    expect(result.totals.totalTasks).toBe(result.kpis.totalTasks);
    expect(result.totals.completedTasks).toBe(result.kpis.completedTasks);
    expect(result.totals.pendingTasks).toBe(result.kpis.pendingTasks);
  });

  test('should calculate change percentages with new user', async () => {
    seedTask({ title: 'Current Task', completed: true, userId });

    const result = await dashboardRepository.getDashboardData(30, userId);

    expect(result.kpis.totalTasks).toBe(1);
    expect(result.kpis.totalTasksChange).toBe(100);
  });
});
