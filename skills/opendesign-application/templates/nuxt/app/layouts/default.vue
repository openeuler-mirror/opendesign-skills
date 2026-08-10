<script setup lang="ts">
/**
 * @description 默认布局。包含页面骨架结构（AppHeader + 内容区 + AppFooter），
 *   页面内容通过 <slot /> 注入。AppHeader 内部使用 OHeader 组件处理导航与主题切换，
 *   AppFooter 使用 OFooter 组件渲染深色页脚。
 */
</script>

<template>
  <div class="app-layout">
    <AppHeader/>

    <main class="app-main">
      <slot/>
    </main>

    <AppFooter/>
  </div>
</template>

<style lang="scss" scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  // OHeader 固定定位高度 72px，主内容区需要等量偏移
  padding-top: 72px;
}
</style>
