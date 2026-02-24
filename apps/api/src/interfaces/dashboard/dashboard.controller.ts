import { openapi } from '@elysiajs/openapi';
import { Elysia } from 'elysia';
import { z } from 'zod';

import { API_VERSION } from '@bunstack-playground/shared';
import { dashboardResponseSchema } from '@bunstack-playground/shared/http';
import { getDashboardRepository } from '@/api/infrastructure/repositories/factory/dashboard.repository.factory';
import { GetDashboardUseCase } from '@/api/application/dashboard';
import { supabaseAuth } from '@/api/infrastructure/supabase/supabase.auth.client';
import { UnauthorizedError } from '@/api/domain/erros';

const dashboardRepository = getDashboardRepository();
const getDashboardUseCase = new GetDashboardUseCase(dashboardRepository);

const dashboardQuerySchema = z.object({
  days: z.optional(z.coerce.number().min(1).max(365).default(30)),
});

async function authenticateUser(
  headers: Record<string, unknown>
): Promise<string> {
  const authHeader = headers.authorization as string | undefined;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided');
  }

  const token = authHeader.replace('Bearer ', '');

  const { data: user, error } = await supabaseAuth.auth.getUser(token);

  if (error || !user?.user) {
    throw new UnauthorizedError('Invalid or expired token');
  }

  return user.user.id;
}

export const dashboardController = new Elysia({
  prefix: `api/${API_VERSION}/dashboard`,
})
  .get(
    '/',
    async ({ query, headers }) => {
      const userId = await authenticateUser(headers);
      const days = Number(query.days ?? 30);
      const result = await getDashboardUseCase.execute(days, userId);

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
