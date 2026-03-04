import { useState } from 'react';

import { type Language, useLanguage } from '@shared/hooks/use-language';
import { FlagBR, FlagUS } from '@shared/ui/flags';

const languages: { value: Language; label: string; flag: React.ReactNode }[] = [
  { value: 'en', label: 'English', flag: <FlagUS /> },
  { value: 'pt-BR', label: 'Português (BR)', flag: <FlagBR /> },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const selectedLang = languages.find((l) => l.value === language);
  const displayLang = selectedLang ?? languages[0]!;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
      >
        <span className="flex items-center">{displayLang.flag}</span>
        <span className="text-sm text-gray-700 dark:text-gray-200">
          {displayLang.label}
        </span>
        <svg
          className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.value}
              onClick={() => {
                setLanguage(lang.value);
                setIsOpen(false);
              }}
              aria-label={lang.label}
              className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer first:rounded-t-lg last:rounded-b-lg ${
                language === lang.value
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-200'
              }`}
            >
              <span className="flex items-center">{lang.flag}</span>
              <span className="text-sm">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
