import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
// @eslint/js is a transitive dep of eslint@9 — no separate install needed
import js from "./node_modules/@eslint/js/src/index.js";
// globals is a transitive dep of eslint@9
import globals from "./node_modules/globals/index.js";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "docs/preview.html"],
  },
  js.configs.recommended,
  // Legacy CJS config file — needs CommonJS globals
  {
    files: ["**/*.cjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: { ...globals.node, ...globals.commonjs },
    },
  },
  // All other JS/MJS files (build scripts, etc.) — ESM + Node globals
  {
    files: ["**/*.mjs", "**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.node,
    },
  },
  // TypeScript source files
  {
    files: ["src/**/*.ts", "src/**/*.mts", "src/**/*.cts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 2022, sourceType: "module" },
      globals: globals.node,
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  // TypeScript test files
  {
    files: ["test/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 2022, sourceType: "module" },
      globals: globals.node,
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];
