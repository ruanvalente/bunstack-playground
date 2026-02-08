import { useUserSettingsStore } from "../../features/settings/store/user-settings.store";

/**
 * Hook de configuração do usuário (perfil, notificações, aparência).
 * Estado persistido em localStorage; preparado para futura sincronização com Supabase.
 */
export function useUserSettings() {
  return useUserSettingsStore();
}
