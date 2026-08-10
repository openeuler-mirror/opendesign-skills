<script setup lang="ts">
/**
 * @description 应用入口。负责 Nuxt 入口编排（OPlusConfigProvider + RouteAnnouncer + Layout + Page）
 *   与 SSR 主题默认值设置。骨架由 layouts/default.vue 承担，
 *   楼层内容由 pages/*.vue 承担。主题由 plugins/theme.ts 管理（SSR 提供 inject + 客户端接管 DOM）。
 *   OPlusConfigProvider 为 @opendesign-plus 组件（OHeader/OFooter 等）提供 locale/theme 上下文。
 */
import { OPlusConfigProvider } from '@opendesign-plus/components'
import { useTheme } from '@opendesign-plus/composables'

const { theme } = useTheme()

// SSR 默认主题：设置 data-o-theme="e.light"，与客户端 createTheme 初始值对齐，
// 避免 hydration 不匹配。客户端 hydrate 后由 plugins/theme.ts 接管。
useHead({
  htmlAttrs: {
    'data-o-theme': 'e.light',
  },
})
</script>

<template>
  <OPlusConfigProvider :theme="theme">
    <NuxtLayout>
      <NuxtRouteAnnouncer/>
      <NuxtPage/>
    </NuxtLayout>
  </OPlusConfigProvider>
</template>

