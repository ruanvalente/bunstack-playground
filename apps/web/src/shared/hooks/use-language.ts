import { useCallback, useMemo } from 'react';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { en, type Language, ptBR, type Translations } from '../i18n';

const LANGUAGE_STORAGE_KEY = 'bunstack-language';

const translations: Record<Language, Translations> = {
  en,
  'pt-BR': ptBR,
};

type LanguageState = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const store = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: LANGUAGE_STORAGE_KEY,
    }
  )
);

export function useLanguage() {
  const language = store((s) => s.language);

  const t = useMemo(() => translations[language], [language]);

  const changeLanguage = useCallback((lang: Language) => {
    store.getState().setLanguage(lang);
  }, []);

  return {
    language,
    setLanguage: changeLanguage,
    t,
  };
}

export type { Language };
