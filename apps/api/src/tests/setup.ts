process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY = 'test-key';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

import { afterAll, beforeAll } from 'bun:test';

beforeAll(() => {
  console.log('[Test Suite] Starting tests...');
});

afterAll(() => {
  console.log('[Test Suite] Tests completed.');
});
