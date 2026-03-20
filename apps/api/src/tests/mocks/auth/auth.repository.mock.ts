import { mock } from 'bun:test';

export interface MockUser {
  id: string;
  email: string;
  user_metadata?: Record<string, unknown>;
  role?: string;
}

export interface MockSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: MockUser;
}

export interface MockAuthResponse {
  data: {
    user: MockUser | null;
    session: MockSession | null;
  };
  error: { message: string } | null;
}

export interface MockOAuthResponse {
  data: { url: string };
  error: { message: string } | null;
}

export interface MockUserResponse {
  data: { user: MockUser };
  error: { message: string } | null;
}

export interface MockSignOutResponse {
  error: { message: string } | null;
}

const DEFAULT_USER: MockUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  user_metadata: { name: 'Test User' },
};

const DEFAULT_SESSION: MockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  user: DEFAULT_USER,
};

export const createMockAuthSuccess = (
  overrides?: Partial<MockAuthResponse['data']>
): MockAuthResponse => ({
  data: {
    user: { ...DEFAULT_USER, ...overrides?.user },
    session: overrides?.session ?? DEFAULT_SESSION,
  },
  error: null,
});

export const createMockAuthError = (message: string): MockAuthResponse => ({
  data: { user: null, session: null },
  error: { message },
});

export const createMockOAuthSuccess = (
  url: string = 'https://github.com/login/oauth/authorize'
): MockOAuthResponse => ({
  data: { url },
  error: null,
});

export const createMockOAuthError = (message: string): MockOAuthResponse => ({
  data: { url: '' },
  error: { message },
});

export const createMockUserResponse = (
  user: MockUser = DEFAULT_USER
): MockUserResponse => ({
  data: { user },
  error: null,
});

export const createMockUserError = (message: string): MockUserResponse => ({
  data: { user: { id: '', email: '' } },
  error: { message },
});

export const createMockSignOutSuccess = (): MockSignOutResponse => ({
  error: null,
});

export const createMockSignOutError = (
  message: string
): MockSignOutResponse => ({
  error: { message },
});

export const createMockSupabaseAuth = () => {
  const auth = {
    signUp: mock<() => Promise<MockAuthResponse>>(async () =>
      createMockAuthSuccess()
    ),
    signInWithPassword: mock<() => Promise<MockAuthResponse>>(async () =>
      createMockAuthSuccess()
    ),
    signOut: mock<() => Promise<MockSignOutResponse>>(async () =>
      createMockSignOutSuccess()
    ),
    getUser: mock<() => Promise<MockUserResponse>>(async () =>
      createMockUserResponse()
    ),
    signInWithOAuth: mock<() => Promise<MockOAuthResponse>>(async () =>
      createMockOAuthSuccess()
    ),
  };

  return auth;
};

export interface MockSupabaseAdmin {
  from: (table: string) => {
    select: (columns?: string) => {
      eq: (
        column: string,
        value: string
      ) => {
        single: () => Promise<{
          data: unknown;
          error: { message: string } | null;
        }>;
      };
    };
  };
}

export const createMockSupabaseAdmin = (userData?: Record<string, unknown>) => {
  const defaultUserData = {
    role: 'USER',
    name: 'Test User',
    email: 'test@example.com',
    ...userData,
  };

  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: defaultUserData,
            error: null,
          }),
        }),
      }),
    }),
  } as MockSupabaseAdmin;
};

export const createMockSupabaseAdminWithError = (errorMessage: string) => {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: null,
            error: { message: errorMessage },
          }),
        }),
      }),
    }),
  } as MockSupabaseAdmin;
};
