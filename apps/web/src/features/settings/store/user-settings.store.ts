import { create } from "zustand";
import { persist } from "zustand/middleware";
import { USER_SETTINGS_KEY } from "@shared/config/constants/storage.config";
import type {
  NotificationSettings,
  ProfileSettings,
  UserSettingsState,
} from "../types/user-settings.types";

const defaultProfile: ProfileSettings = {
  username: "",
  email: "",
};

const defaultNotifications: NotificationSettings = {
  emailNotifications: true,
  taskReminders: false,
};

export const useUserSettingsStore = create<UserSettingsState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      notifications: defaultNotifications,
      theme: "light",

      // TODO: integração Supabase – atualização de profile do usuário

      updateProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
        })),

      updateNotifications: (settings) =>
        // TODO: integração Supabase – atualização de notificaçõe do usuário
        set((state) => ({
          notifications: { ...state.notifications, ...settings },
        })),

      setTheme: (theme) => set({ theme }),

      deleteAccount: async () => {
        // TODO: integração Supabase – auth + remoção de dados do usuário
        set({
          profile: defaultProfile,
          notifications: defaultNotifications,
          theme: "light",
        });
      },
    }),
    {
      name: USER_SETTINGS_KEY,
      partialize: (state) => ({
        profile: state.profile,
        notifications: state.notifications,
        theme: state.theme,
      }),
    },
  ),
);
