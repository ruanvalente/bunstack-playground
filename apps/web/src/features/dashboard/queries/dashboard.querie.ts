import type { DashboardResponseDTO } from '@bunstack-playground/shared/http';

import { API_VERSION } from '@shared/config/supabase';
import { axiosInstance } from '@shared/http/axios-client';

export async function getDashboardData(
  days = 30
): Promise<DashboardResponseDTO> {
  try {
    const response = await axiosInstance.get<DashboardResponseDTO>(
      `/api/${API_VERSION}/dashboard?days=${days}`
    );
    return response.data;
  } catch (err) {
    throw new Error(
      'Not is possible to fetch dashboard data. Please try again later.',
      { cause: err }
    );
  }
}
