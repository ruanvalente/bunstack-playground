import { useEffect, useSyncExternalStore } from 'react';
import { useUserSettingsStore } from '../store/user-settings.store';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function subscribeToSystemTheme(callback: () => void) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => callback();
  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}

function useSystemThemeStore() {
  return useSyncExternalStore(
    subscribeToSystemTheme,
    () => getSystemTheme(),
    () => 'light'
  );
}

function applyTheme(theme: string) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
}

export function useTheme() {
  const theme = useUserSettingsStore((s) => s.theme);
  const systemTheme = useSystemThemeStore();

  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, []);

  return {
    theme,
    resolvedTheme,
    setTheme: useUserSettingsStore((s) => s.setTheme),
  };
}
