import type { DashboardData } from '@bunstack-playground/shared';

export abstract class DashboardRepository {
  abstract getDashboardData(days?: number): Promise<DashboardData>;
}
