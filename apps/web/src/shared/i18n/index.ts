export type Language = 'en' | 'pt-BR';

export type Translations = typeof import('./locales/en').en;

export { en } from './locales/en';
export { ptBR } from './locales/pt-BR';
