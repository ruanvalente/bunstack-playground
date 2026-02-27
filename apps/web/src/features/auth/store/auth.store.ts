import { create } from 'zustand';
import type { StateStorage } from 'zustand/middleware';
import { createJSONStorage, persist } from 'zustand/middleware';

import { AUTH_API_URL } from '@shared/config/supabase';
import { decrypt, encrypt } from '@shared/utils/helpers/crypto.helper';

type Session = {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
};

type UserMetadata = {
  name?: string;
  full_name?: string;
  avatar_url?: string;
  email?: string;
  preferred_username?: string;
};

type AuthState = {
  userId: string | null;
  user: UserMetadata | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUserId: (userId: string | null) => void;
  setUser: (user: UserMetadata | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
};

const encryptedStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const encryptedData = localStorage.getItem(name);
    if (!encryptedData) return null;

    try {
      const decrypted = await decrypt(encryptedData);
      return decrypted;
    } catch {
      localStorage.removeItem(name);
      return null;
    }
  },

  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const encrypted = await encrypt(value);
      localStorage.setItem(name, encrypted);
    } catch (error) {
      console.error('Failed to encrypt data:', error);
    }
  },

  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userId: null,
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: true,
      setUserId: (userId) => set({ userId, isAuthenticated: !!userId }),
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: async () => {
        const { session } = get();
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
          set({
            userId: null,
            user: null,
            session: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => encryptedStorage),
      partialize: (state) => ({
        userId: state.userId,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
