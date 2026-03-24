import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';

import { API_VERSION } from '@bunstack-playground/shared/http';

type UserResponse = {
  user: { id: string; email: string; user_metadata: { name: string } };
  role: string;
  name: string;
  email: string;
};

type ErrorResponse = {
  message: string;
};

type SupabaseUserData = {
  id: string;
  email: string;
  user_metadata: { name: string };
};

type UserTableData = {
  role?: string;
  name?: string;
  email?: string;
};

const validToken = 'valid-jwt-token';
const validUserId = 'user-123';
const testEmail = 'test@example.com';
const testName = 'Test User';

const mockGetUser = mock<
  (token: string) => Promise<{
    data: { user: SupabaseUserData | null };
    error: { message: string } | null;
  }>
>();
const mockFromSelect = mock<
  (table: string) => {
    select: (columns?: string) => {
      eq: (
        column: string,
        value: string
      ) => {
        single: () => Promise<{ data: UserTableData | null; error: null }>;
      };
    };
  }
>();

mock.module('@/api/infrastructure/supabase/supabase.auth.client', () => ({
  supabaseAuth: {
    auth: {
      getUser: mockGetUser,
      signUp: mock(() => Promise.resolve({ data: null, error: null })),
      signInWithPassword: mock(() =>
        Promise.resolve({ data: null, error: null })
      ),
      signOut: mock(() => Promise.resolve({ error: null })),
      signInWithOAuth: mock(() => Promise.resolve({ data: null, error: null })),
    },
  },
}));

mock.module('@/api/infrastructure/supabase/supabase.client', () => ({
  supabaseAdmin: { from: mockFromSelect },
}));

function setupValidUserMock(userData: Partial<UserTableData> = {}) {
  mockGetUser.mockImplementation(async () => ({
    data: {
      user: {
        id: validUserId,
        email: testEmail,
        user_metadata: { name: testName },
      },
    },
    error: null,
  }));

  mockFromSelect.mockReturnValue({
    select: () => ({
      eq: () => ({
        single: async () => ({
          data: { role: 'USER', name: testName, email: testEmail, ...userData },
          error: null,
        }),
      }),
    }),
  } as any);
}

function setupNoUserTableDataMock() {
  mockGetUser.mockImplementation(async () => ({
    data: {
      user: {
        id: validUserId,
        email: testEmail,
        user_metadata: { name: testName },
      },
    },
    error: null,
  }));

  mockFromSelect.mockReturnValue({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
      }),
    }),
  } as any);
}

function makeRequest(token?: string): Request {
  return new Request(`http://localhost/api/${API_VERSION}/auth/user`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

function makeRequestWithoutBearerPrefix(token: string): Request {
  return new Request(`http://localhost/api/${API_VERSION}/auth/user`, {
    headers: { Authorization: token },
  });
}

describe('GET /auth/user', () => {
  let authController: any;

  beforeEach(async () => {
    mockGetUser.mockImplementation(async () => ({
      data: { user: null },
      error: { message: 'Not authenticated' },
    }));

    mockFromSelect.mockReturnValue({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
    } as any);

    const mod = await import('@/api/interfaces/auth/auth.controller');
    authController = mod.authController;
  });

  afterEach(() => {
    mockGetUser.mockReset();
    mockFromSelect.mockReset();
  });

  describe('Authentication', () => {
    test('should return 401 without authorization header', async () => {
      const response = await authController.handle(makeRequest());
      const body = (await response.json()) as ErrorResponse;

      expect(response.status).toBe(401);
      expect(body.message).toBe('No token provided');
    });

    test('should return 401 without Bearer prefix', async () => {
      const response = await authController.handle(
        makeRequestWithoutBearerPrefix(validToken)
      );
      const body = (await response.json()) as ErrorResponse;

      expect(response.status).toBe(401);
      expect(body.message).toBe('No token provided');
    });

    test('should return 401 with invalid token', async () => {
      mockGetUser.mockImplementation(async () => ({
        data: { user: null },
        error: { message: 'Invalid token' },
      }));

      const response = await authController.handle(
        makeRequest('invalid-token')
      );
      const body = (await response.json()) as ErrorResponse;

      expect(response.status).toBe(401);
      expect(body.message).toBe('Invalid token');
    });
  });

  describe('Successful Response', () => {
    test('should return user data with valid token', async () => {
      setupValidUserMock();

      const response = await authController.handle(makeRequest(validToken));
      const body = (await response.json()) as UserResponse;

      expect(response.status).toBe(200);
      expect(body).toHaveProperty('user');
      expect(body).toHaveProperty('role');
      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('email');
      expect(body.user.id).toBe(validUserId);
    });

    test('should include correct user properties in response', async () => {
      setupValidUserMock();

      const response = await authController.handle(makeRequest(validToken));
      const body = (await response.json()) as UserResponse;

      expect(body.name).toBe(testName);
      expect(body.email).toBe(testEmail);
      expect(body.role).toBe('USER');
    });

    test('should include role from user table', async () => {
      setupValidUserMock({
        role: 'ADMIN',
        name: 'Admin User',
        email: 'admin@example.com',
      });

      const response = await authController.handle(makeRequest(validToken));
      const body = (await response.json()) as UserResponse;

      expect(body.role).toBe('ADMIN');
    });

    test('should use USER as default role when not found in user table', async () => {
      setupNoUserTableDataMock();

      const response = await authController.handle(makeRequest(validToken));
      const body = (await response.json()) as UserResponse;

      expect(body.role).toBe('USER');
    });

    test('should fall back to metadata name when user table has no name', async () => {
      mockGetUser.mockImplementation(async () => ({
        data: {
          user: {
            id: validUserId,
            email: testEmail,
            user_metadata: { name: 'Metadata Name' },
          },
        },
        error: null,
      }));

      mockFromSelect.mockReturnValue({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: { role: 'USER', email: testEmail },
              error: null,
            }),
          }),
        }),
      } as any);

      const response = await authController.handle(makeRequest(validToken));
      const body = (await response.json()) as UserResponse;

      expect(body.name).toBe('Metadata Name');
    });
  });

  describe('Mock Verification', () => {
    test('should call supabaseAuth.auth.getUser with correct token', async () => {
      setupValidUserMock();

      await authController.handle(makeRequest(validToken));

      expect(mockGetUser).toHaveBeenCalledWith(validToken);
    });

    test('should call supabaseAdmin with users table', async () => {
      setupValidUserMock();

      await authController.handle(makeRequest(validToken));

      expect(mockFromSelect).toHaveBeenCalledWith('users');
    });
  });
});
