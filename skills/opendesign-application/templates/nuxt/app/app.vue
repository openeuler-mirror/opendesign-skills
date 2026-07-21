<script setup lang="ts">
/**
 * @description 应用入口。只负责 Nuxt 入口编排（RouteAnnouncer + Layout + Page），
 *   不承载任何页面骨架或楼层内容。骨架由 layouts/default.vue 承担，
 *   楼层内容由 pages/*.vue 承担。
 */
</script>

<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer/>
    <NuxtPage/>
  </NuxtLayout>
</template>

