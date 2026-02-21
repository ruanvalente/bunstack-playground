import type {
  DashboardData,
  ChartDataPoint,
} from '@bunstack-playground/shared';
import type { IDashboardRepository } from '@/api/domain/repositories';
import { supabase } from '@/api/infra/database/supabase';

type PeriodStats = {
  total: number;
  completed: number;
  pending: number;
};

export class DashboardSupabaseRepository implements IDashboardRepository {
  async getDashboardData(days: number = 30): Promise<DashboardData> {
    const currentStats = await this.getCurrentPeriodStats(days);
    const previousStats = await this.getPreviousPeriodStats(days);
    const tasksByDay = await this.getTasksByDay(days);
    const completedByDay = await this.getCompletedByDay(days);

    const totals = {
      totalTasks: currentStats.total,
      completedTasks: currentStats.completed,
      pendingTasks: currentStats.pending,
    };

    const kpis = this.calculateKPIs(currentStats, previousStats);

    const charts = {
      tasksByDay,
      completedByDay,
    };

    return { kpis, charts, totals };
  }

  private async getCurrentPeriodStats(days: number): Promise<PeriodStats> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString();

    const { data: allTasks, error: allError } = await supabase
      .from('tasks')
      .select('completed')
      .gte('created_at', startDateStr);

    if (allError) {
      throw new Error(`Failed to fetch tasks: ${allError.message}`);
    }

    const total = allTasks?.length || 0;
    const completed =
      allTasks?.filter(
        (t) =>
          t.completed === true || t.completed === 'true' || t.completed === 1
      ).length || 0;
    const pending = total - completed;

    return { total, completed, pending };
  }

  private async getPreviousPeriodStats(days: number): Promise<PeriodStats> {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - days);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days * 2);

    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();

    const { data: allTasks, error: allError } = await supabase
      .from('tasks')
      .select('completed')
      .gte('created_at', startDateStr)
      .lt('created_at', endDateStr);

    if (allError) {
      throw new Error(`Failed to fetch tasks: ${allError.message}`);
    }

    const total = allTasks?.length || 0;
    const completed =
      allTasks?.filter(
        (t) =>
          t.completed === true || t.completed === 'true' || t.completed === 1
      ).length || 0;
    const pending = total - completed;

    return { total, completed, pending };
  }

  private async getTasksByDay(days: number): Promise<ChartDataPoint[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0] ?? '';

    const { data, error } = await supabase
      .from('tasks')
      .select('created_at')
      .gte('created_at', startDateStr);

    if (error) {
      throw new Error('Failed to fetch tasks by day');
    }

    const grouped = data.reduce(
      (acc, task) => {
        const date =
          new Date(task.created_at).toISOString().split('T')[0] ?? '';
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private async getCompletedByDay(days: number): Promise<ChartDataPoint[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0] ?? '';

    const { data, error } = await supabase
      .from('tasks')
      .select('updated_at, completed')
      .gte('updated_at', startDateStr);

    if (error) {
      throw new Error('Failed to fetch completed tasks by day');
    }

    const completedTasks =
      data?.filter(
        (t) =>
          t.completed === true || t.completed === 'true' || t.completed === 1
      ) || [];

    const grouped = completedTasks.reduce(
      (acc, task) => {
        const date =
          new Date(task.updated_at).toISOString().split('T')[0] ?? '';
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private calculateKPIs(
    current: PeriodStats,
    previous: PeriodStats
  ): DashboardData['kpis'] {
    const calculateChange = (current: number, previous: number): number => {
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }
      return Math.round(((current - previous) / previous) * 100 * 10) / 10;
    };

    const currentRate =
      current.total > 0
        ? Math.round((current.completed / current.total) * 100 * 10) / 10
        : 0;
    const previousRate =
      previous.total > 0
        ? Math.round((previous.completed / previous.total) * 100 * 10) / 10
        : 0;

    return {
      totalTasks: current.total,
      totalTasksChange: calculateChange(current.total, previous.total),
      completedTasks: current.completed,
      completedTasksChange: calculateChange(
        current.completed,
        previous.completed
      ),
      pendingTasks: current.pending,
      pendingTasksChange: calculateChange(current.pending, previous.pending),
      completionRate: currentRate,
      completionRateChange: Math.round((currentRate - previousRate) * 10) / 10,
    };
  }
}
