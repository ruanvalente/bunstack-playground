import type { DashboardData } from '@bunstack-playground/shared';

export interface IDashboardRepository {
  getDashboardData(days: number, userId: string): Promise<DashboardData>;
}
