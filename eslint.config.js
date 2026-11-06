import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';

export default [
  { ignores: ['dist', 'node_modules', '.next', '.vite', 'public/*.js'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        console: 'readonly', process: 'readonly', Buffer: 'readonly',
        __dirname: 'readonly', __filename: 'readonly', global: 'readonly',
        window: 'readonly', document: 'readonly', navigator: 'readonly',
        localStorage: 'readonly', sessionStorage: 'readonly', CustomEvent: 'readonly',
        Element: 'readonly', Event: 'readonly', MouseEvent: 'readonly',
        EventTarget: 'readonly', HTMLElement: 'readonly', HTMLAnchorElement: 'readonly',
        HTMLDivElement: 'readonly', HTMLButtonElement: 'readonly', HTMLInputElement: 'readonly',
        HTMLSpanElement: 'readonly', HTMLParagraphElement: 'readonly', HTMLHeadingElement: 'readonly',
        HTMLTableElement: 'readonly', HTMLTableSectionElement: 'readonly', HTMLTableRowElement: 'readonly',
        HTMLTableCellElement: 'readonly', HTMLTableCaptionElement: 'readonly',
        URL: 'readonly', fetch: 'readonly', requestAnimationFrame: 'readonly',
        setInterval: 'readonly', clearInterval: 'readonly', MutationObserver: 'readonly',
        HTMLImageElement: 'readonly', HTMLVideoElement: 'readonly', HTMLSourceElement: 'readonly',
        location: 'readonly', MessageEvent: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly',
        queueMicrotask: 'readonly', Request: 'readonly', Response: 'readonly', HTMLMediaElement: 'readonly', alert: 'readonly',
      },
    },
    plugins: { react, 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    settings: { react: { version: 'detect' } },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': ['error', { args: 'none', argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'react/jsx-key': 'off',
      'react/no-unknown-property': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-useless-escape': 'off',
      'no-dupe-keys': 'off',
    },
  },
];
