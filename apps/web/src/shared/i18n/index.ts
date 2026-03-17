export type Language = 'en' | 'pt-BR';

export type Translations = typeof import('./locales/en').en & {
  landing: (typeof import('./locales/en').en)['landing'];
};

export { en } from './locales/en';
export { ptBR } from './locales/pt-BR';
