module.exports = {
    env: { browser: true, es2020: true },
    extends: [
      'eslint:recommended',
      'plugin:react-hooks/recommended',
      'plugin:react-refresh/recommended',
    ],
    parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    settings: { react: { version: '18.3' } },
    plugins: ['react-refresh'],
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  };