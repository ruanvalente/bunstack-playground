import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';

import { API_VERSION } from '@bunstack-playground/shared/http';

const mockSignInWithOAuth = mock<() => Promise<{ data: any; error: any }>>();

mock.module('@/api/infrastructure/supabase/supabase.auth.client', () => ({
  supabaseAuth: {
    auth: {
      getUser: mock(() => Promise.resolve({ data: null, error: null })),
      signUp: mock(() => Promise.resolve({ data: null, error: null })),
      signInWithPassword: mock(() =>
        Promise.resolve({ data: null, error: null })
      ),
      signOut: mock(() => Promise.resolve({ error: null })),
      signInWithOAuth: mockSignInWithOAuth,
    },
  },
}));

mock.module('@/api/infrastructure/supabase/supabase.client', () => ({
  supabaseAdmin: {
    from: mock(() => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
    })),
  },
}));

describe('GET /auth/github', () => {
  let authController: any;

  beforeEach(async () => {
    const mod = await import('@/api/interfaces/auth/auth.controller');
    authController = mod.authController;
    mockSignInWithOAuth.mockClear();
  });

  afterEach(() => {
    mockSignInWithOAuth.mockReset();
  });

  test('should return OAuth URL on success', async () => {
    const oauthUrl = 'https://github.com/login/oauth/authorize?client_id=xxx';
    mockSignInWithOAuth.mockImplementation(async () => ({
      data: { url: oauthUrl },
      error: null,
    }));

    const response = await authController.handle(
      new Request(`http://localhost/api/${API_VERSION}/auth/github`)
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveProperty('url');
    expect(body.url).toBe(oauthUrl);
  });

  test('should return 400 when provider fails', async () => {
    mockSignInWithOAuth.mockImplementation(async () => ({
      data: { url: '' },
      error: { message: 'OAuth provider error' },
    }));

    const response = await authController.handle(
      new Request(`http://localhost/api/${API_VERSION}/auth/github`)
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe('OAuth provider error');
  });

  test('should include correct redirect URL', async () => {
    const expectedRedirectTo = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback`;
    mockSignInWithOAuth.mockImplementation(async () => ({
      data: { url: 'https://github.com/login/oauth/authorize' },
      error: null,
    }));

    await authController.handle(
      new Request(`http://localhost/api/${API_VERSION}/auth/github`)
    );

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'github',
      options: expect.objectContaining({
        redirectTo: expect.stringContaining('/auth/callback'),
      }),
    });
  });

  test('should include correct scopes', async () => {
    mockSignInWithOAuth.mockImplementation(async () => ({
      data: { url: 'https://github.com/login/oauth/authorize' },
      error: null,
    }));

    await authController.handle(
      new Request(`http://localhost/api/${API_VERSION}/auth/github`)
    );

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'github',
      options: expect.objectContaining({
        scopes: 'read:user user:email',
      }),
    });
  });

  test('should use github as OAuth provider', async () => {
    mockSignInWithOAuth.mockImplementation(async () => ({
      data: { url: 'https://github.com/login/oauth/authorize' },
      error: null,
    }));

    await authController.handle(
      new Request(`http://localhost/api/${API_VERSION}/auth/github`)
    );

    expect(mockSignInWithOAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'github',
      })
    );
  });

  test('should return JSON content type', async () => {
    mockSignInWithOAuth.mockImplementation(async () => ({
      data: { url: 'https://github.com/login/oauth/authorize' },
      error: null,
    }));

    const response = await authController.handle(
      new Request(`http://localhost/api/${API_VERSION}/auth/github`)
    );

    expect(response.headers.get('content-type')).toContain('application/json');
  });

  test('should handle empty URL with error', async () => {
    mockSignInWithOAuth.mockImplementation(async () => ({
      data: { url: '' },
      error: { message: 'Failed to generate OAuth URL' },
    }));

    const response = await authController.handle(
      new Request(`http://localhost/api/${API_VERSION}/auth/github`)
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toHaveProperty('message');
  });
});
