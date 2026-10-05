import js from '@eslint/js';
import globals from 'globals';
import svelte from 'eslint-plugin-svelte';

export default [
  js.configs.recommended,
  ...svelte.configs['flat/recommended'],
  {
    ignores: ['dist/**', 'node_modules/**', '.svelte-kit/**', 'coverage/**'],
  },
  {
    files: ['src/components/ShortcutContent.svelte'],
    rules: {
      'svelte/no-at-html-tags': 'off',
    },
  },
  {
    files: ['**/*.{js,svelte}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.vitest,
      },
    },
    rules: {
      camelcase: ['error', { properties: 'never' }],
      'comma-dangle': ['error', 'always-multiline'],
      'eol-last': ['error', 'always'],
      eqeqeq: ['error', 'always'],
      indent: ['error', 2, { SwitchCase: 1 }],
      'max-len': ['error', { code: 100, ignoreUrls: true }],
      'no-console': 'warn',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'prefer-const': 'error',
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
    },
  },
];
