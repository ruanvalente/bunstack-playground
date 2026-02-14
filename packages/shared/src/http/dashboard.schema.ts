import { z } from "zod";

export const chartDataPointSchema = z.object({
  date: z.string(),
  count: z.number().int().min(0),
});

export const dashboardKPISchema = z.object({
  totalTasks: z.number().int().min(0),
  totalTasksChange: z.number(),
  completedTasks: z.number().int().min(0),
  completedTasksChange: z.number(),
  pendingTasks: z.number().int().min(0),
  pendingTasksChange: z.number(),
  completionRate: z.number().min(0).max(100),
  completionRateChange: z.number(),
});

export const dashboardChartsSchema = z.object({
  tasksByDay: z.array(chartDataPointSchema),
  completedByDay: z.array(chartDataPointSchema),
});

export const dashboardTotalsSchema = z.object({
  totalTasks: z.number().int().min(0),
  completedTasks: z.number().int().min(0),
  pendingTasks: z.number().int().min(0),
});

export const dashboardResponseSchema = z.object({
  kpis: dashboardKPISchema,
  charts: dashboardChartsSchema,
  totals: dashboardTotalsSchema,
});

export type DashboardKPIsDTO = z.infer<typeof dashboardKPISchema>;
export type ChartDataPointDTO = z.infer<typeof chartDataPointSchema>;
export type DashboardChartsDTO = z.infer<typeof dashboardChartsSchema>;
export type DashboardTotalsDTO = z.infer<typeof dashboardTotalsSchema>;
export type DashboardResponseDTO = z.infer<typeof dashboardResponseSchema>;
