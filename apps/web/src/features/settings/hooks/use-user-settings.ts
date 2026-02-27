import { useMemo } from 'react';

import { useAuthStore } from '@features/auth/store/auth.store';

import { useUserSettingsStore } from '../store/user-settings.store';

export function useUserSettings() {
  const store = useUserSettingsStore();
  const user = useAuthStore((state) => state.user);

  const profile = useMemo(() => {
    if (user) {
      return {
        fullName: user.full_name || '',
        username: user.preferred_username || user.name || '',
        email: user.email || '',
      };
    }
    return store.profile;
  }, [user, store.profile]);

  const updateProfile = (
    data: Partial<{ username: string; email: string; fullName: string }>
  ) => {
    if (!user) {
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
