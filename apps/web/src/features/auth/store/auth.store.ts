import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AUTH_API_URL } from "@shared/config/supabase";

type User = unknown;

type Session = {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
}

type AuthState = {
  user: User;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setSession: (session) => set({ session }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: async () => {
        const { session } = get();
        try {
          if (session?.access_token) {
            await fetch(`${AUTH_API_URL}/logout`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            });
          }
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({
            user: null,
            session: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
