import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: ['dist', 'node_modules', '.vite', 'build']
  },
{
  files: ['**/*.{js,jsx}'],
  languageOptions: {
    ecmaVersion: 2022,
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.es2021
    },
    parserOptions: {
      ecmaFeatures: { jsx: true },
      sourceType: 'module'
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  plugins: {
    react,
    'react-hooks': reactHooks
    // ❌ ELIMINADO: 'react-refresh'
  },
  rules: {
    ...js.configs.recommended.rules,
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
    ...reactHooks.configs.recommended.rules,
    'react/jsx-no-target-blank': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-console': 'off',
    'no-debugger': 'off'
  }
}
];
