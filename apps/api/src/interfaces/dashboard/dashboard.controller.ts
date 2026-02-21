import { openapi } from '@elysiajs/openapi';
import { Elysia } from 'elysia';
import { z } from 'zod';

import { API_VERSION } from '@bunstack-playground/shared';
import { dashboardResponseSchema } from '@bunstack-playground/shared/http';
import { getDashboardRepository } from '@/api/infrastructure/repositories/factory/dashboard.repository.factory';
import { GetDashboardUseCase } from '@/api/application/dashboard';

const dashboardRepository = getDashboardRepository();
const getDashboardUseCase = new GetDashboardUseCase(dashboardRepository);

const dashboardQuerySchema = z.object({
  days: z.optional(z.coerce.number().min(1).max(365).default(30)),
});

export const dashboardController = new Elysia({
  prefix: `api/${API_VERSION}/dashboard`,
})
  .get(
    '/',
    async ({ query }) => {
      const days = Number(query.days ?? 30);
      const result = await getDashboardUseCase.execute(days);

      return {
        kpis: result.kpis,
        charts: result.charts,
        totals: result.totals,
      };
    },
    {
      query: dashboardQuerySchema,
      response: {
        200: dashboardResponseSchema,
      },
      detail: {
        tags: ['Dashboard'],
        summary: 'Get dashboard data',
        description: 'Returns KPIs, charts and totals based on tasks data',
      },
    }
  )
  .use(openapi());
