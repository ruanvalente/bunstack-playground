import { beforeEach, describe, expect, test } from 'bun:test';

import {
  healthController,
  healthSchema,
} from '@/api/interfaces/health/health.controller';

type HealthResponse = {
  status: string;
  uptime: string;
};

const REGEX_ISO_8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

describe('HealthController', () => {
  let response: Response;
  let body: HealthResponse;

  beforeEach(async () => {
    response = await healthController.handle(
      new Request('http://localhost/health')
    );
    body = (await response.json()) as HealthResponse;
  });

  describe('GET /health', () => {
    test('should return 200 status code', () => {
      expect(response.status).toBe(200);
    });

    test('should return JSON content type', () => {
      expect(response.headers.get('content-type')).toContain(
        'application/json'
      );
    });

    test('should return health object with status and uptime', () => {
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('uptime');
    });

    test('should have status "ok"', () => {
      expect(body.status).toBe('ok');
    });

    test('should have valid ISO 8601 uptime timestamp', () => {
      const isoDateRegex = REGEX_ISO_8601;
      expect(body.uptime).toMatch(isoDateRegex);
    });

    test('should not require authentication', () => {
      expect(response.status).toBe(200);
    });
  });

  describe('healthSchema', () => {
    test('should have status "ok"', () => {
      expect(healthSchema.status).toBe('ok');
    });

    test('should have string uptime', () => {
      expect(typeof healthSchema.uptime).toBe('string');
    });
  });
});
