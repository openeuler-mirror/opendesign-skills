<script setup lang="ts">
/**
 * @description 应用入口。只负责主题初始化与页面编排，
 *   不承载任何页面骨架或楼层内容。骨架由 DefaultLayout 承担，
 *   楼层内容由 pages/*.vue 承担。
 */
import {useThemeStore} from '@/stores/theme'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomePage from '@/pages/HomePage.vue'

// 初始化主题 store：副作用（将 data-o-theme 同步到 <html>）在 store 内部注册，
// 任意组件首次 useThemeStore() 即可触发。这里显式调用一次确保在挂载前生效。
useThemeStore()
</script>

<template>
  <DefaultLayout>
    <HomePage/>
  </DefaultLayout>
</template>

