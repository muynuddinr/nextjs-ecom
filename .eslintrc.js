module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-var': 'off',
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/ban-types': 'off'
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    next: {
      rootDir: './'
    }
  },
  ignorePatterns: ['.next/', 'node_modules/', '*.config.js', '*.config.mjs']
} 