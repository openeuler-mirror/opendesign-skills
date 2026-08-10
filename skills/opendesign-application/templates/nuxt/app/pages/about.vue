<script setup lang="ts">
/**
 * @description 关于页。展示项目信息与 OpenDesign 设计系统概述。
 *   页面骨架（header / footer）由 layouts/default.vue 承担，
 *   本页面只负责楼层内容编排。
 */
</script>

<template>
  <!-- 楼层：页面标题 -->
  <AppSection title="关于本项目" :header-justify-center="false">
    <template #subtitle>
      <p class="about-subtitle">
        本脚手架基于 <code>Nuxt 4 + Vue 3 + Pinia</code>，
        集成 <code>@opensig/opendesign</code> 设计系统。
      </p>
    </template>

    <p class="about-text">
      OpenDesign 是一套面向华为产品设计场景的设计系统，
      提供 46 个 Vue 3 UI 组件、6 套主题令牌、完整的响应式断点体系。
      本脚手架演示了如何在 SSR 项目中集成 OpenDesign 设计系统，
      包括主题切换、响应式栅格、设计令牌使用等核心能力。
    </p>
  </AppSection>

  <!-- 楼层：技术栈 -->
  <AppSection title="技术栈" subtitle="本脚手架使用的关键技术">
    <ul class="tech-list">
      <li><strong>Nuxt 4</strong> — SSR / 静态生成 + 文件路由</li>
      <li><strong>Vue 3</strong> — Composition API + &lt;script setup&gt;</li>
      <li><strong>Pinia</strong> — 状态管理（@pinia/nuxt 模块自动注册）</li>
      <li><strong>SCSS</strong> — 三套 mixin（common / font / screen）全局注入</li>
      <li><strong>@opensig/opendesign</strong> — 46 个 UI 组件</li>
      <li><strong>@opensig/opendesign-token</strong> — 6 套主题 CSS 变量</li>
    </ul>
  </AppSection>
</template>

<style lang="scss" scoped>
.about-subtitle {
  @include text2;
  color: var(--o-color-info3);
  margin: 0;
  max-width: 600px;

  code {
    @include inline-code;
  }
}

.about-text {
  @include text1;
  color: var(--o-color-info2);
  line-height: 1.8;
  margin: 0;
}

.tech-list {
  @include text1;
  color: var(--o-color-info2);
  line-height: 2;
  margin: 0;
  padding-left: var(--o-gap-5);

  li {
    margin-bottom: var(--o-gap-1);
  }

  strong {
    color: var(--o-color-info1);
  }
}
</style>
