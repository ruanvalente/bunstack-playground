import type {
  ChartDataPoint,
  DashboardData,
} from '@bunstack-playground/shared';

import type { IDashboardRepository } from '@/api/domain/repositories';
import { supabase } from '@/api/infrastructure/supabase';

const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error(
      'Supabase client is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.'
    );
  }
  return supabase;
};

type PeriodStats = {
  total: number;
  completed: number;
  pending: number;
};

export class DashboardSupabaseRepository implements IDashboardRepository {
  async getDashboardData(
    days: number = 30,
    userId: string
  ): Promise<DashboardData> {
    const currentStats = await this.getCurrentPeriodStats(days, userId);
    const previousStats = await this.getPreviousPeriodStats(days, userId);
    const tasksByDay = await this.getTasksByDay(days, userId);
    const completedByDay = await this.getCompletedByDay(days, userId);

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

  private async getCurrentPeriodStats(
    days: number,
    userId: string
  ): Promise<PeriodStats> {
    const { data, error } = await getSupabaseClient().rpc(
      'get_dashboard_tasks',
      {
        p_user_id: userId,
        p_days: days,
      }
    );

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }

    const tasks = data || [];
    const total = tasks.length;
    const completed = tasks.filter(
      (t: any) =>
        t.completed === true || t.completed === 'true' || t.completed === 1
    ).length;
    const pending = total - completed;

    return { total, completed, pending };
  }

  private async getPreviousPeriodStats(
    days: number,
    userId: string
  ): Promise<PeriodStats> {
    const { data, error } = await getSupabaseClient().rpc(
      'get_dashboard_tasks',
      {
        p_user_id: userId,
        p_days: days * 2,
      }
    );

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }

    const tasks = data || [];
    const total = tasks.length;
    const completed = tasks.filter(
      (t: any) =>
        t.completed === true || t.completed === 'true' || t.completed === 1
    ).length;
    const pending = total - completed;

    return { total, completed, pending };
  }

  private async getTasksByDay(
    days: number,
    userId: string
  ): Promise<ChartDataPoint[]> {
    const { data, error } = await getSupabaseClient().rpc(
      'get_dashboard_tasks',
      {
        p_user_id: userId,
        p_days: days,
      }
    );

    if (error) {
      throw new Error('Failed to fetch tasks by day');
    }

    const tasks = data || [];
    const grouped = tasks.reduce(
      (acc: Record<string, number>, task: any) => {
        const date =
          new Date(task.created_at).toISOString().split('T')[0] || '';
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return (Object.entries(grouped) as [string, number][])
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private async getCompletedByDay(
    days: number,
    userId: string
  ): Promise<ChartDataPoint[]> {
    const { data, error } = await getSupabaseClient().rpc(
      'get_dashboard_tasks',
      {
        p_user_id: userId,
        p_days: days,
      }
    );

    if (error) {
      throw new Error('Failed to fetch completed tasks by day');
    }

    const tasks = data || [];
    const completedTasks = tasks.filter(
      (t: any) =>
        t.completed === true || t.completed === 'true' || t.completed === 1
    );

    const grouped = completedTasks.reduce(
      (acc: Record<string, number>, task: any) => {
        const date =
          new Date(task.updated_at).toISOString().split('T')[0] || '';
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return (Object.entries(grouped) as [string, number][])
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
