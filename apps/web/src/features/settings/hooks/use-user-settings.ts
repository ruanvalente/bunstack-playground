import { useUserSettingsStore } from "../store/user-settings.store";

export function useUserSettings() {
  return useUserSettingsStore();
}
