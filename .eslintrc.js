module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier', // Para desactivar reglas que podrían entrar en conflicto con Prettier
    'plugin:prettier/recommended', // Activa Prettier como regla de ESLint
  ],
  rules: {
    'semi': 'error',
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'no-unused-vars': 'warn',
    'no-console': ['warn', { allow: ['error', 'info'] }],
    'no-var': 'error',
    'prefer-const': 'error',
    'prettier/prettier': ['error', { singleQuote: true, semi: true, trailingComma: 'es5' }], // Configuración personalizada de Prettier
  },
  ignorePatterns: ['node_modules/'],
  env: {
    node: true,
    browser: true,
  },
};
