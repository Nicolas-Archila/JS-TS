const {
  defineConfig,
  globalIgnores,
} = require("eslint/config"); // API de configuración plana (Flat Config)

const tsParser = require("@typescript-eslint/parser"); // Parser para entender sintaxis TS
const globals = require("globals"); // Conjuntos de variables globales por entorno (node, browser, etc.)
const typescriptEslint = require("@typescript-eslint/eslint-plugin"); // Reglas específicas para TS
const js = require("@eslint/js"); // Conjuntos recomendados de ESLint para JS

const { FlatCompat } = require("@eslint/eslintrc"); // Compatibilidad para 'extends' clásicos

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        // Importante: si este archivo no está en la raíz del proyecto o
        // si hay múltiples tsconfig, ajustar estas rutas.
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },

      globals: {
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    extends: compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier",
    ),
    rules: {
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: false,
        },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
      "prefer-const": "error",
    },
  },
  globalIgnores([
    "**/dist",
    "**/node_modules",
    "**/prisma",
    "**/scripts",
    "./eslint.config.cjs",
  ])]);
