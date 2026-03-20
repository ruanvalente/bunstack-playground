import { beforeAll, describe, expect, test } from 'bun:test';

import {
  createMockAuthError,
  createMockAuthSuccess,
  createMockOAuthError,
  createMockOAuthSuccess,
  createMockSignOutError,
  createMockSignOutSuccess,
  createMockSupabaseAdmin,
  createMockSupabaseAdminWithError,
  createMockUserError,
  createMockUserResponse,
} from '../../mocks';

type Route = {
  path: string;
  method: string;
};

describe('Auth Controller - Endpoints Definition', () => {
  let authController: any;

  beforeAll(async () => {
    const { authController: controller } =
      await import('@/api/interfaces/auth/auth.controller');
    authController = controller;
  });

  test('should have all auth endpoints defined', () => {
    const routes = authController.routes;
    const paths = routes.map((r: Route) => r.path);

    expect(paths).toContain('/api/v1/auth/register');
    expect(paths).toContain('/api/v1/auth/login');
    expect(paths).toContain('/api/v1/auth/logout');
    expect(paths).toContain('/api/v1/auth/user');
    expect(paths).toContain('/api/v1/auth/github');
  });

  test('should have register as POST method', () => {
    const registerRoute = authController.routes.find(
      (r: Route) => r.path === '/api/v1/auth/register'
    );
    expect(registerRoute?.method).toBe('POST');
  });

  test('should have login as POST method', () => {
    const loginRoute = authController.routes.find(
      (r: Route) => r.path === '/api/v1/auth/login'
    );
    expect(loginRoute?.method).toBe('POST');
  });

  test('should have logout as POST method', () => {
    const logoutRoute = authController.routes.find(
      (r: Route) => r.path === '/api/v1/auth/logout'
    );
    expect(logoutRoute?.method).toBe('POST');
  });

  test('should have user as GET method', () => {
    const userRoute = authController.routes.find(
      (r: Route) => r.path === '/api/v1/auth/user'
    );
    expect(userRoute?.method).toBe('GET');
  });

  test('should have github as GET method', () => {
    const githubRoute = authController.routes.find(
      (r: Route) => r.path === '/api/v1/auth/github'
    );
    expect(githubRoute?.method).toBe('GET');
  });
});

describe('Auth Flows - Mock Tests', () => {
  const mockAuthSuccess = createMockAuthSuccess();
  const mockAuthErrorInvalidCredentials = createMockAuthError(
    'Invalid login credentials'
  );
  const mockAuthErrorUserExists = createMockAuthError(
    'User already registered'
  );
  const mockUserResponse = createMockUserResponse();
  const mockUserError = createMockUserError('Invalid token');
  const mockSignOutSuccess = createMockSignOutSuccess();
  const mockSignOutError = createMockSignOutError('Failed to sign out');
  const mockOAuthSuccess = createMockOAuthSuccess(
    'https://github.com/login/oauth/authorize'
  );
  const mockOAuthError = createMockOAuthError('OAuth provider error');

  test('should create mock auth success response', () => {
    expect(mockAuthSuccess.data.user).toBeDefined();
    expect(mockAuthSuccess.data.session).toBeDefined();
    expect(mockAuthSuccess.error).toBeNull();
  });

  test('should create mock auth error for invalid credentials', () => {
    expect(mockAuthErrorInvalidCredentials.error?.message).toBe(
      'Invalid login credentials'
    );
    expect(mockAuthErrorInvalidCredentials.data.user).toBeNull();
  });

  test('should create mock auth error for user already exists', () => {
    expect(mockAuthErrorUserExists.error?.message).toBe(
      'User already registered'
    );
  });

  test('should create mock user response', () => {
    expect(mockUserResponse.data.user).toBeDefined();
    expect(mockUserResponse.error).toBeNull();
  });

  test('should create mock user error', () => {
    expect(mockUserError.error?.message).toBe('Invalid token');
    expect(mockUserError.data.user).toBeDefined();
  });

  test('should create mock sign out success', () => {
    expect(mockSignOutSuccess.error).toBeNull();
  });

  test('should create mock sign out error', () => {
    expect(mockSignOutError.error?.message).toBe('Failed to sign out');
  });

  test('should create mock OAuth success', () => {
    expect(mockOAuthSuccess.data.url).toContain('github.com');
    expect(mockOAuthSuccess.error).toBeNull();
  });

  test('should create mock OAuth error', () => {
    expect(mockOAuthError.error?.message).toBe('OAuth provider error');
  });

  test('should create mock supabase admin', () => {
    const admin = createMockSupabaseAdmin({});
    expect(admin.from).toBeDefined();
  });

  test('should create mock supabase admin with error', () => {
    const admin = createMockSupabaseAdminWithError('Database error');
    expect(admin.from).toBeDefined();
  });
});
