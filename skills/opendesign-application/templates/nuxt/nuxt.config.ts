// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-01',
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
  alias: {
    // 图标组件入口别名：指向 gen:icon 产物目录（app/icon-components/index.ts）
    '#icons': fileURLToPath(new URL('./app/icon-components', import.meta.url)),
  },
  css: [
    // —— CSS Reset（归零 UA 默认样式，必须在 Token 之前确保归零最早生效）——
    '~/assets/styles/reset.scss',
    // —— OpenDesign 样式（顺序不可调换：Token 必须先于组件样式）——
    // 1. 主题 Token：提供 --o-color-* / --o-r-* 等 CSS 变量，并自动 @import 响应式 token
    '@opensig/opendesign-token/themes/e.light.token.css',
    '@opensig/opendesign-token/themes/e.dark.token.css',
    // 2. 鸿蒙字体（分片加载，按 unicode-range 切片懒加载）—— body font-family 由 global.scss 应用）
    // 会在 Nuxt dev/SSR 经 Node 原生 ESM loader 加载，Node 无法识别 .css 扩展名导致启动报错
    '@opensig/opendesign-token/fonts/font-harmony.css',
    // 3. OpenDesign 组件库样式（使用上述 Token 变量）
    '@opensig/opendesign/es/index.css',
    // 4. 项目全局样式（可在上述基础上覆盖）
    '~/assets/styles/global.scss',
  ],
  // 让 Nuxt 在生成的 tsconfig.node.json 中包含 Node.js 类型声明，
  // 避免 nuxt.config.ts 中的 node:url 等 Node 内置模块报 TS2307
  typescript: {
    nodeTsConfig: {
      compilerOptions: {
        types: ['node'],
      },
    },
  },

  vite: {
    optimizeDeps: {
      include: ['@opensig/opendesign', '@vueuse/core'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/styles/mixin/common.scss" as *;
            @use "~/assets/styles/mixin/font.scss" as *;
            @use "~/assets/styles/mixin/screen.scss" as *;
          `,
        },
      },
    },
  },
})
