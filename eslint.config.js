import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist', 'node_modules', '.next', '.vite'] },
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
      },
    },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];
