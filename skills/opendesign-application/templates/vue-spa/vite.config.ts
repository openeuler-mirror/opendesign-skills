import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // 图标组件入口别名：指向 gen:icon 产物目录（src/icon-components/index.ts）
      '#icons': fileURLToPath(new URL('./src/icon-components', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ['@opensig/opendesign', '@vueuse/core'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        // —— 全局注入 mixin，所有 <style lang="scss"> 中可直接 @include 调用 ——
        additionalData: [
          `@use "@/assets/styles/mixin/common.scss" as *;`,
          `@use "@/assets/styles/mixin/font.scss" as *;`,
          `@use "@/assets/styles/mixin/screen.scss" as *;`,
        ].join('\n'),
      },
    },
  },
})
