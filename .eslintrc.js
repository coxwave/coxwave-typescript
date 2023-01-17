module.exports = {
  root: true,
  env: {
    es6: true,
    'jest/globals': true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    project: 'packages/*/tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'jest', 'import',  'unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jest/recommended',
    'prettier',
  ],
  rules: {
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'unused-imports/no-unused-imports': 'warn',
    'import/newline-after-import': 'error',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
        groups: [
          'builtin',
          'external',
          'internal',
          'unknown',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
      },
    ],
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'none', ignoreRestSiblings: true }],
    '@typescript-eslint/semi': 0,
    '@typescript-eslint/space-before-function-paren': 0,
    '@typescript-eslint/require-await': 0,
    'comma-dangle': 0,
    'new-cap': 0,
    'eol-last': [2, 'always'],
    'no-multiple-empty-lines': [2, { max: 1, maxEOF: 0 }],
    'no-restricted-globals': [
      'error',
      {
        name: 'globalThis',
        message: 'Unsafe access to `globalThis`.',
      },
      {
        name: 'window',
        message: 'Unsafe access to `window`.',
      },
      {
        name: 'self',
        message: 'Unsafe access to `self`.',
      },
    ],
  },
  settings: {
    'import/parsers': {
      [require.resolve('@typescript-eslint/parser')]: ['.ts', '.d.ts'],
    },
    'import/resolver': {
      [require.resolve('eslint-import-resolver-node')]: {
        extensions: ['.js', '.ts'],
      },
      [require.resolve('eslint-import-resolver-typescript')]: {
        alwaysTryTypes: true,
      },
    },
  },
  overrides: [
    {
      // Allow test files to access globals
      files: '*.test.ts',
      rules: {
        'no-restricted-globals': 'off',
      },
    },
  ],
};
