import { useCallback, useEffect } from 'react';

import { AUTH_API_URL } from '@shared/config/supabase';

import { useAuthStore } from '../store/auth.store';

type LoginCredentials = {
  email: string;
  password: string;
};

type RegisterCredentials = {
  email: string;
  password: string;
  name?: string;
};

export function useAuth() {
  const {
    userId,
    session,
    isAuthenticated,
    isLoading,
    userRole,
    setUserId,
    setUser,
    setSession,
    setLoading,
    setUserRole,
    logout,
  } = useAuthStore();

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true);
      try {
        const response = await fetch(`${AUTH_API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        if (data.user && data.session) {
          const userMetadata = data.user.user_metadata;
          setUserId(data.user.id);
          setUser(
            userMetadata
              ? {
                  name: userMetadata.name as string,
                  full_name: userMetadata.full_name as string,
                  avatar_url: userMetadata.avatar_url as string,
                  email: userMetadata.email as string,
                  preferred_username: userMetadata.preferred_username as string,
                }
              : null
          );
          setSession(data.session);
        }

        return { success: true, data };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Login failed',
        };
      } finally {
        setLoading(false);
      }
    },
    [setUserId, setUser, setSession, setLoading]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      setLoading(true);
      try {
        const response = await fetch(`${AUTH_API_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        return { success: true, data };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Registration failed',
        };
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const logoutUser = useCallback(async () => {
    try {
      if (session?.access_token) {
        await fetch(`${AUTH_API_URL}/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
    }
  }, [session, logout]);

  const fetchUser = useCallback(async () => {
    if (!session?.access_token) {
      setUserId(null);
      setUser(null);
      setUserRole(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${AUTH_API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.user) {
        const userMetadata = data.user.user_metadata;
        setUserId(data.user.id);
        setUser(
          userMetadata
            ? {
                name: userMetadata.name as string,
                full_name: userMetadata.full_name as string,
                avatar_url: userMetadata.avatar_url as string,
                email: userMetadata.email as string,
                preferred_username: userMetadata.preferred_username as string,
                role: (data.role as 'ADMIN' | 'USER') || 'USER',
              }
            : null
        );
        setUserRole((data.role as 'ADMIN' | 'USER') || 'USER');
      } else {
        logout();
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [session, setUserId, setUser, setUserRole, setLoading, logout]);

  const loginWithGithub = useCallback(async () => {
    try {
      const response = await fetch(`${AUTH_API_URL}/github`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'GitHub login failed');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('GitHub login error:', error);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    userId,
    session,
    isAuthenticated,
    isLoading,
    userRole,
    login,
    register,
    logout: logoutUser,
    loginWithGithub,
    fetchUser,
  };
}
