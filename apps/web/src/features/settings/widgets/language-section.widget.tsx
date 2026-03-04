import { useState } from 'react';

import { type Language, useLanguage } from '@shared/hooks/use-language';

const languages: { value: Language; labelKey: 'en' | 'ptBR' }[] = [
  { value: 'en', labelKey: 'en' },
  { value: 'pt-BR', labelKey: 'ptBR' },
];

export function LanguageSection() {
  const { language, setLanguage, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<Language>(language);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLanguage(selectedLang);
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <header className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
          🌐 {t.settings.language}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t.settings.languageSubtitle}
        </p>
      </header>

      <form className="p-6 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-3">
          {languages.map((lang) => (
            <label
              key={lang.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="language"
                value={lang.value}
                checked={selectedLang === lang.value}
                onChange={() => setSelectedLang(lang.value)}
                className="w-5 h-5 accent-blue-600 border-gray-300 dark:border-gray-600
                           focus:ring-blue-500/30"
              />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {t.language[lang.labelKey]}
              </span>
            </label>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full md:w-fit px-6 py-2.5 bg-blue-600 hover:bg-blue-700
                     text-white font-medium rounded-lg
                     focus:ring-2 focus:ring-blue-500/40 focus:outline-none
                     transition-all duration-200 shadow-sm hover:shadow hover:cursor-pointer"
          >
            {t.common.save}
          </button>
        </div>
      </form>
    </section>
  );
}
