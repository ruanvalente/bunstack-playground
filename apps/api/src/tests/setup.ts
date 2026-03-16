import { afterAll, beforeAll } from 'bun:test';

beforeAll(() => {
  console.log('[Test Suite] Starting tests...');

  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY = 'test-key';
  process.env.SUPABASE_ANON_KEY = 'test-anon-key';
});

afterAll(() => {
  console.log('[Test Suite] Tests completed.');
});
