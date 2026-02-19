import type { DashboardResponseDTO } from "@bunstack-playground/shared/http";

import { httpClient } from "@shared/http/http-client";
import { API_URL, API_VERSION } from "@bunstack-playground/shared/config/";

export async function getDashboardData(
  days = 30,
): Promise<DashboardResponseDTO> {
  try {
    const response = await httpClient<DashboardResponseDTO>(
      `${API_URL}/api/${API_VERSION}/dashboard?days=${days}`,
    );
    return response;
  } catch (err) {
    throw new Error(
      "Not is possible to fetch dashboard data. Please try again later.",
      { cause: err },
    );
  }
}
