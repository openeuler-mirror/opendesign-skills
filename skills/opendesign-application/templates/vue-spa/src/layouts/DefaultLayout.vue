<script setup lang="ts">
/**
 * @description 默认布局。包含页面骨架结构（AppHeader + 内容区 + AppFooter），
 *   页面内容通过 <slot /> 注入。App.vue 不再直接承载骨架，仅负责应用初始化与页面编排。
 */
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <div>
    <AppHeader/>

    <main>
      <slot/>
    </main>

    <AppFooter/>
  </div>
</template>
