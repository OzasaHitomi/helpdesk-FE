import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
// Reactを使うためのeslintの追加
import eslintReact from '@eslint-react/eslint-plugin'
// eslintとprettierの競合差分調整
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
  // dist:本番環境にあげる時に変換されたファイル（ビルドしたもの）を格納しているファイル
  globalIgnores(['dist', 'src/components/ui']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      // tseslint.configs.recommended, これの代わりに以下の2つを入れている。これだけだとTSの型チェックまではしてくれない。
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      // import eslintReact from '@eslint-react/eslint-plugin'のインポートを使うために追加
      eslintReact.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      // import eslintConfigPrettier from 'eslint-config-prettier'のインポートを使うために追加
      eslintConfigPrettier,
    ],
    languageOptions: {
      globals: globals.browser,
      // projectに記載しているファイルを参考に型チェックする
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json', './tsconfig.test.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
])
