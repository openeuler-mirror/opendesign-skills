<script setup lang="ts">
/**
 * @description 应用入口。只负责路由出口编排与 OPlusConfigProvider 包裹，
 *   不承载任何页面骨架或楼层内容。骨架由 DefaultLayout 承担，
 *   楼层内容由 pages/*.vue 承担。路由出口通过 <RouterView /> 注入。
 *   主题由 main.ts 中的 createTheme 插件统一管理。
 *   OPlusConfigProvider 为 @opendesign-plus 组件（OHeader/OFooter 等）提供 locale/theme 上下文。
 */
import { OPlusConfigProvider } from '@opendesign-plus/components'
import { useTheme } from '@opendesign-plus/composables'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const { theme } = useTheme()
</script>

<template>
  <OPlusConfigProvider :theme="theme">
    <DefaultLayout>
      <RouterView/>
    </DefaultLayout>
  </OPlusConfigProvider>
</template>

