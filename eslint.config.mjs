import { defineConfig } from 'eslint-define-config';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';

export default defineConfig({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: {
    react, // Add the React plugin
    prettier, // Add the Prettier plugin
  },
  rules: {
    'prettier/prettier': 'error', // Prettier integration
  },
  baseConfigs: [
    'eslint:recommended', // Use ESLint's default recommended configuration
  ],
});
