import type { DashboardData } from "@bunstack-playground/shared";
import type { DashboardSqliteRepository } from "./dashboard.sqlite.repository";

export class DashboardService {
  constructor(private readonly dashboardSqliteRepository: DashboardSqliteRepository) {}

  async getDashboardData(days?: number): Promise<DashboardData> {
    return this.dashboardSqliteRepository.getDashboardData(days);
  }
}
