import tseslint from 'typescript-eslint';
import cypress from 'eslint-plugin-cypress';

export default tseslint.config(
  {
    ignores: ['node_modules/', 'cypress/screenshots/', 'cypress/videos/', 'cypress/downloads/'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['cypress/**/*.ts', 'cypress.config.ts'],
    ...cypress.configs.recommended,
    languageOptions: {
      ...cypress.configs.recommended.languageOptions,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...cypress.configs.recommended.rules,
      'cypress/no-unnecessary-waiting': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.object.name=/^(describe|it|context)$/][callee.property.name='only']",
          message: '.only must not be committed.',
        },
      ],
    },
  },
);
