import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import parser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts'], // Aplica solo a archivos .ts
    languageOptions: {
      parser: parser,
      globals: {
        node: true,
        browser: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      prettier: prettierPlugin, // Usa Prettier como plugin
    },
    rules: {
      // Reglas de ESLint recomendadas (manual)
      'no-console': [
        'warn',
        {
          allow: ['info', 'error'], // Permite console.info y console.error
        },
      ],
      eqeqeq: 'error', // Ejemplo de regla adicional de ESLint

      // Reglas de TypeScript recomendadas
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Reglas de Prettier (aplicadas por ESLint como regla)
      'prettier/prettier': [
        'error',
        { singleQuote: true, semi: true, trailingComma: 'es5' }, // Estilo Prettier
      ],

      // Reglas personalizadas
      'prefer-const': 'error',
      'no-var': 'error',
      semi: 'error',
      quotes: ['error', 'single'],
      indent: ['error', 2],
    },
    ignores: ['node_modules/'], // Ignora node_modules
  },
];
