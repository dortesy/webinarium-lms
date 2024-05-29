
export default {
  "extends": "next/core-web-vitals",
  'check-file/filename-naming-convention': [
    'error',
    {
        '**/*.{ts,tsx}': 'KEBAB_CASE',
    },
    {
        // ignore the middle extensions of the filename to support filename like bable.config.js or smoke.spec.ts
        ignoreMiddleExtensions: true,
    },
  ],
  'check-file/folder-naming-convention': [
    'error',
    {
      // all folders within src (except __tests__)should be named in kebab-case
      'src/**/!(__tests__)': 'KEBAB_CASE',
    },
  ],
}



module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  ignorePatterns: [
    'node_modules/*',
    'public/mockServiceWorker.js',
    'generators/*',
  ],
  extends: ['eslint:recommended'],
  plugins: ['check-file'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      settings: {
        react: { version: 'detect' },
        'import/resolver': {
          typescript: {},
        },
      },
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      extends: [
        'next/core-web-vitals',
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:prettier/recommended',
        'plugin:testing-library/react',
        'plugin:jest-dom/recommended',
        'plugin:tailwindcss/recommended',
        'plugin:vitest/legacy-recommended',
      ],
      
    },
    {
      plugins: ['check-file'],
      files: ['src/**/!(__tests__)/*'],
      rules: {
        'check-file/filename-naming-convention': [
          'error',
          {
              '**/*.{ts,tsx}': 'KEBAB_CASE',
          },
          {
              // ignore the middle extensions of the filename to support filename like bable.config.js or smoke.spec.ts
              ignoreMiddleExtensions: true,
          },
        ],
        'check-file/folder-naming-convention': [
          'error',
          {
            // all folders within src (except __tests__)should be named in kebab-case
            'src/**/!(__tests__)': 'KEBAB_CASE',
          },
        ],
      },
    },
  ],
};