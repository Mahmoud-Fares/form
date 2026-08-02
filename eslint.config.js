import js from '@eslint/js';
import checkFile from 'eslint-plugin-check-file';
import nPlugin from 'eslint-plugin-n';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import { projectStructurePlugin } from 'eslint-plugin-project-structure';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
   globalIgnores(['dist']),
   {
      files: ['**/*.{ts,tsx}'],
      extends: [
         js.configs.recommended,
         tseslint.configs.recommended,
         tseslint.configs.recommendedTypeChecked,
         tseslint.configs.stylisticTypeChecked,
         reactHooks.configs.flat.recommended,
         reactRefresh.configs.vite,
      ],
      languageOptions: {
         ecmaVersion: 2020,
         globals: globals.browser,
         parserOptions: {
            projectService: true,
         },
      },
   },
   {
      files: ['**/*.{ts,tsx}'],
      ignores: ['**/*.d.ts'],
      rules: {
         'prefer-arrow-callback': 'error',
         'prefer-template': 'error',

         '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
         '@typescript-eslint/consistent-type-imports': [
            'warn',
            { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
         ],
         '@typescript-eslint/no-floating-promises': 'error',
         '@typescript-eslint/no-unnecessary-condition': 'warn',
         '@typescript-eslint/prefer-nullish-coalescing': 'warn',
         '@typescript-eslint/switch-exhaustiveness-check': 'error',
         '@typescript-eslint/no-misused-promises': [
            'error',
            { checksVoidReturn: { attributes: false } },
         ],
      },
   },
   {
      files: ['**/*.{ts,tsx}'],
      plugins: {
         'no-relative-import-paths': noRelativeImportPaths,
      },
      rules: {
         'no-relative-import-paths/no-relative-import-paths': [
            'warn',
            { allowSameFolder: true, rootDir: 'src', prefix: '@' },
         ],
      },
   },
   {
      files: ['**/*.{ts,tsx}'],
      ignores: ['**/env.ts'],
      plugins: {
         n: nPlugin,
      },
      rules: {
         'n/no-process-env': ['error'],
         'no-restricted-syntax': [
            'error',
            {
               selector:
                  'MemberExpression[object.property.name="env"][object.object.type="MetaProperty"]',
               message: 'Use env from @/env instead of import.meta.env',
            },
         ],
      },
   },
   {
      files: ['**/*.{ts,tsx}'],
      plugins: {
         'check-file': checkFile,
      },
      rules: {
         'check-file/filename-naming-convention': [
            'error',
            {
               '**/*.{ts,tsx}': 'KEBAB_CASE',
            },
            {
               ignoreMiddleExtensions: true,
            },
         ],
         'check-file/folder-naming-convention': [
            'error',
            {
               'src/**': 'KEBAB_CASE',
            },
         ],
      },
   },
   {
      files: ['**/*.{ts,tsx}'],
      plugins: {
         'project-structure': projectStructurePlugin,
      },
      settings: {
         'project-structure/independent-modules-config-path':
            'independentModules.json',
      },
      rules: {
         'project-structure/independent-modules': 'error',
         ...reactHooks.configs.recommended.rules,
      },
   },
]);
