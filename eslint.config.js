import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default tseslint.config(
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      eslintConfigPrettier,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: {
      prettier,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
      'prettier/prettier': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. React and react-related
            ['^react$', '^react-dom', '^react-router', '^react-router-dom'],
            // 2. External libraries (starting with letter or @)
            ['^[a-z@]'],
            // 3. @bunstack-playground (shared do mono repo)
            ['^@bunstack-playground'],
            // 4. @shared and @web (componentes internos)
            ['^@shared', '^@web', '^@/'],
            // 5. Relative imports
            ['^\\.\\.'],
            ['^\\.'],
          ],
        },
      ],
    },
  },
  {
    ignores: ['dist', 'node_modules', '.git'],
  }
);
