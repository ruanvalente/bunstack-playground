import type { DashboardData } from '@bunstack-playground/shared';
import type { IDashboardRepository } from '@/api/domain/repositories';

export class GetDashboardUseCase {
  constructor(private readonly dashboardRepository: IDashboardRepository) {}

  async execute(days?: number): Promise<DashboardData> {
    return this.dashboardRepository.getDashboardData(days);
  }
}
