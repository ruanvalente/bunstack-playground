import { useCallback, useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { AUTH_API_URL } from '@shared/config/supabase';

type LoginCredentials = {
  email: string;
  password: string;
}

type RegisterCredentials = {
  email: string;
  password: string;
  name?: string;
}

export function useAuth() {
  const { user, session, isAuthenticated, isLoading, setUser, setSession, setLoading, logout } = useAuthStore();

  const login = useCallback(async (credentials: LoginCredentials) => {
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
        setUser(data.user);
        setSession(data.session);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    } finally {
      setLoading(false);
    }
  }, [setUser, setSession, setLoading]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
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
      return { success: false, error: error instanceof Error ? error.message : 'Registration failed' };
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const logoutUser = useCallback(async () => {
    try {
      if (session?.access_token) {
        await fetch(`${AUTH_API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
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
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${AUTH_API_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setUser(data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [session, setUser, setLoading, logout]);

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
    user,
    session,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout: logoutUser,
    loginWithGithub,
    fetchUser,
  };
}
