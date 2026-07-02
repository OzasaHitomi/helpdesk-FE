import { defineConfig as defineViteConfig, mergeConfig } from 'vite'
import { defineConfig as defineVitestConfig } from 'vitest/config'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/

// 本番環境用の設定
const viteConfig = defineViteConfig({
  plugins: [react(), tsconfigPaths(), babel({ presets: [reactCompilerPreset()] })],
})

// テスト用の設定
const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
  },
})

// viteに上記2つの設定を適用させるように伝えている
export default mergeConfig(viteConfig, vitestConfig)
