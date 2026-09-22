module.exports = {
  extends: [
    '@rocketseat/eslint-config/node',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  plugins: ['simple-import-sort', 'import'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
        alwaysTryTypes: true,
      },
      node: true,
    },
  },
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-namespace': 'off',
    'no-use-before-define': 'off',
    'no-new': 'off',
    'import/no-named-as-default': 'off',
    'import/no-restricted-paths': [
      'error',
      {
        basePath: __dirname,
        zones: [
          {
            target: './src/domain',
            from: ['./'],
            except: ['./src/domain'],
            message:
              'The domain layer must not depend on application, infrastructure, external, or external libraries',
          },
          {
            target: './src/application',
            from: ['./'],
            except: ['./src/application', './src/domain'],
            message:
              'The application layer must not depend on infrastructure, external, or external libraries',
          },
          {
            target: './src/adapters',
            from: ['./'],
            except: ['./src/adapters', './src/application', './src/domain'],
            message:
              'The infrastructure layer must not depend on external or external libraries',
          },
        ],
      },
    ],
  },
}
