import type { DashboardData, ChartDataPoint } from "@bunstack-playground/shared";
import { db } from "@/api/infra/database";
import type { DashboardRepository } from "./dashboard.repository";

interface PeriodStats {
  total: number;
  completed: number;
  pending: number;
}

export class DashboardSqliteRepository implements DashboardRepository {
  async getDashboardData(days: number = 30): Promise<DashboardData> {
    const currentStats = this.getCurrentPeriodStats(days);
    const previousStats = this.getPreviousPeriodStats(days);
    const tasksByDay = this.getTasksByDay(days);
    const completedByDay = this.getCompletedByDay(days);

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

  private getCurrentPeriodStats(days: number): PeriodStats {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString();

    const totalResult = db
      .prepare("SELECT COUNT(*) as count FROM tasks WHERE created_at >= ?")
      .get(startDateStr) as { count: number };

    const completedResult = db
      .prepare(
        "SELECT COUNT(*) as count FROM tasks WHERE completed = 1 AND created_at >= ?",
      )
      .get(startDateStr) as { count: number };

    return {
      total: totalResult.count,
      completed: completedResult.count,
      pending: totalResult.count - completedResult.count,
    };
  }

  private getPreviousPeriodStats(days: number): PeriodStats {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - days);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days * 2);

    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();

    const totalResult = db
      .prepare(
        "SELECT COUNT(*) as count FROM tasks WHERE created_at >= ? AND created_at < ?",
      )
      .get(startDateStr, endDateStr) as { count: number };

    const completedResult = db
      .prepare(
        "SELECT COUNT(*) as count FROM tasks WHERE completed = 1 AND created_at >= ? AND created_at < ?",
      )
      .get(startDateStr, endDateStr) as { count: number };

    return {
      total: totalResult.count,
      completed: completedResult.count,
      pending: totalResult.count - completedResult.count,
    };
  }

  private getTasksByDay(days: number): ChartDataPoint[] {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split("T")[0] ?? "";

    const rows = db
      .prepare(
        `
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM tasks
      WHERE DATE(created_at) >= ?
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
      )
      .all(startDateStr) as { date: string; count: number }[];

    return rows.map((row) => ({
      date: row.date,
      count: row.count,
    }));
  }

  private getCompletedByDay(days: number): ChartDataPoint[] {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split("T")[0] ?? "";

    const rows = db
      .prepare(
        `
      SELECT DATE(updated_at) as date, COUNT(*) as count
      FROM tasks
      WHERE completed = 1 AND DATE(updated_at) >= ?
      GROUP BY DATE(updated_at)
      ORDER BY date ASC
    `,
      )
      .all(startDateStr) as { date: string; count: number }[];

    return rows.map((row) => ({
      date: row.date,
      count: row.count,
    }));
  }

  private calculateKPIs(
    current: PeriodStats,
    previous: PeriodStats,
  ): DashboardData["kpis"] {
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
      completedTasksChange: calculateChange(current.completed, previous.completed),
      pendingTasks: current.pending,
      pendingTasksChange: calculateChange(current.pending, previous.pending),
      completionRate: currentRate,
      completionRateChange: Math.round((currentRate - previousRate) * 10) / 10,
    };
  }
}
