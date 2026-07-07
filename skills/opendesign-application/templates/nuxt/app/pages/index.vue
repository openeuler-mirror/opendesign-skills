<script setup lang="ts">
/**
 * @description 首页。展示 opendesign-token 库的各类 Token 用法示例。
 *   页面骨架（header / footer）由 layouts/default.vue 承担，
 *   本页面只负责楼层内容编排。
 */
</script>

<template>
  <!-- 楼层：页面标题 -->
  <AppSection title="Token 库使用示例" :header-justify-center="false">
    <template #subtitle>
      <p class="hero-subtitle">
        本页面所有组件均使用 <code>@opensig/opendesign-token</code> 提供的 CSS 变量。
        点击右上角按钮切换 light / dark 主题，观察所有组件自动响应。
      </p>
    </template>
  </AppSection>

  <!-- 各楼层：每个组件独立一层 -->
  <AppSection title="色彩 Token"><TokenPalette/></AppSection>
  <AppSection title="字体 Token"><TokenFontDemo/></AppSection>
  <AppSection title="间距 Token"><TokenSpacing/></AppSection>
  <AppSection title="响应式栅格 Token" subtitle="当前断点列数随窗口缩放变化">
    <TokenGridShowcase/>
  </AppSection>
  <AppSection title="表单宽度 Token" subtitle="绑定栅格 Token，各断点自动缩放">
    <TokenFormWidth/>
  </AppSection>
  <AppSection title="响应式检测能力" subtitle="useScreen() composable 与 SCSS 暗色/hover mixin 用法">
    <ScreenDetector/>
  </AppSection>
</template>

<style lang="scss" scoped>
.hero-subtitle {
  @include text2;
  color: var(--o-color-info3);
  margin: 0;
  max-width: 600px;

  code {
    @include inline-code;
  }
}
</style>
