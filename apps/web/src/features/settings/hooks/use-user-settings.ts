import { useUserSettingsStore } from "../store/user-settings.store";
import { useAuthStore } from "@features/auth/store/auth.store";
import { useMemo } from "react";

export function useUserSettings() {
  const store = useUserSettingsStore();
  const authUser = useAuthStore((state) => state.user) as Record<string, unknown> | null;

  const profile = useMemo(() => {
    if (authUser) {
      const userMetadata = authUser.user_metadata as Record<string, unknown> | undefined;
      const email = (authUser.email as string) || (userMetadata?.email as string) || "";
      const name = (userMetadata?.full_name as string) || (userMetadata?.preferred_username as string) || email.split('@')[0] || "";
      return {
        username: name,
        email: email,
      };
    }
    return store.profile;
  }, [authUser, store.profile]);

  const updateProfile = (data: Partial<{ username: string; email: string }>) => {
    if (!authUser) {
      store.updateProfile(data);
    }
  };

  return {
    profile,
    updateProfile,
    notifications: store.notifications,
    updateNotifications: store.updateNotifications,
    theme: store.theme,
    setTheme: store.setTheme,
    deleteAccount: store.deleteAccount,
  };
}
