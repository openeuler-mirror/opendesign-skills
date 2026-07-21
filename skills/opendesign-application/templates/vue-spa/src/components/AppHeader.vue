<script setup lang="ts">
/**
 * @description 顶部导航栏组件。内含品牌 Logo 与主题切换按钮，
 *   使用 o-r-grid-container 做水平居中，消费设计令牌承担导航栏高度、间距与排版规范。
 */
import ThemeToggle from '@/components/ThemeToggle.vue'
</script>

<template>
  <header class="page-header">
    <div class="o-r-grid-container header-inner">
      <slot name="brand">
        <div class="header-brand">
          <svg
            class="brand-logo"
            viewBox="0 0 32 32"
            width="28"
            height="28"
            fill="currentColor"
          >
            <path
              d="M14.667 4c5.891 0 10.667 4.776 10.667 10.667 0 2.464-.836 4.733-2.239 6.539l4.448 4.451-1.886 1.886-4.449-4.449a10.62 10.62 0 0 1-6.541 2.24C8.776 25.334 4 20.558 4 14.667S8.776 4 14.667 4zm0 2.667a8 8 0 1 0 0 16 8 8 0 0 0 0-16z"/>
          </svg>
          <h1 class="brand-title">OpenDesign Token</h1>
        </div>
      </slot>
      <slot name="actions">
        <ThemeToggle/>
      </slot>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--o-color-fill2);
  border-bottom: 1px solid var(--o-color-control1);
  box-shadow: var(--o-shadow-1);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--o-control_size-2xl);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: var(--o-gap-2);
}

.brand-logo {
  color: var(--o-color-primary1);
  flex-shrink: 0;
}

.brand-title {
  @include h3;
  color: var(--o-color-info1);
  margin: 0;
}
</style>
