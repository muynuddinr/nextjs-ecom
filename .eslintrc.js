module.exports = {
    extends: [
      'next/core-web-vitals'
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_'
      }],
      'no-var': ['error', { 'allowInGlobalScope': false }],
      '@next/next/no-img-element': 'error'
    },
    parserOptions: {
      project: './tsconfig.json'
    },
    settings: {
      next: {
        rootDir: './'
      }
    },
    ignorePatterns: ['.next/', 'node_modules/']
  } 