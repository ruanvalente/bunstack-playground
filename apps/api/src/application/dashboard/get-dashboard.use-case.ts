import type { DashboardData } from '@bunstack-playground/shared';
import type { IDashboardRepository } from '@/api/domain/repositories';

export class GetDashboardUseCase {
  constructor(private readonly dashboardRepository: IDashboardRepository) {}

  async execute(days: number, userId: string): Promise<DashboardData> {
    return this.dashboardRepository.getDashboardData(days, userId);
  }
}
