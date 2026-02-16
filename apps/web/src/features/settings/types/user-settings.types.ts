export type ThemeMode = "light" | "dark" | "system";

export type ProfileSettings = {
  username: string;
  email: string;
};

export type NotificationSettings = {
  emailNotifications: boolean;
  taskReminders: boolean;
};

export type UserSettingsState = {
  profile: ProfileSettings;
  notifications: NotificationSettings;
  theme: ThemeMode;

  updateProfile: (profile: Partial<ProfileSettings>) => void;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  setTheme: (theme: ThemeMode) => void;
  deleteAccount: () => Promise<void>;
};
