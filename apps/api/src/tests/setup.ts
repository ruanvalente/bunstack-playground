import { afterAll, beforeAll } from 'bun:test';

beforeAll(() => {
  console.log('[Test Suite] Starting tests...');
});

afterAll(() => {
  console.log('[Test Suite] Tests completed.');
});
