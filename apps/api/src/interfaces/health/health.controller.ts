import { openapi } from '@elysiajs/openapi';
import { Elysia, t } from 'elysia';

const healthSchema = {
  status: 'ok',
  uptime: new Date().toISOString(),
};

export const healthController = new Elysia({ name: 'health' })
  .get('/health', () => healthSchema, {
    detail: {
      tags: ['Health'],
      summary: 'Health check',
      description: 'Returns the health status of the API',
      responses: {
        '200': {
          description: 'API is healthy',
          content: {
            'application/json': {
              example: {
                status: 'ok',
                uptime: '2025-01-01T00:00:00.000Z',
              },
            },
          },
        },
      },
    },
  })
  .use(openapi());

export { healthSchema };
