<script setup lang="ts">
/**
 * @description 响应式检测能力展示。
 * 演示 useScreen() composable（isPhonePad / isPhonePadSize / isTouchDevice）
 * 和 SCSS @include in-dark { ... } 暗色模式包装器的用法。
 * useScreen() 是 OpenDesign 组件库内部做运行时响应式分支判断的核心 composable，
 * 业务代码可用它做条件渲染（v-if）或条件样式绑定。
 * ⚠️ Nuxt 中 useScreen() 涉及 matchMedia，需在 ClientOnly 中使用或在 app:mounted 后访问。
 */
import { useScreen } from '@opensig/opendesign'

const { isPhonePad, isPhonePadSize, isPhoneSize, isPadSize, isTouchDevice } = useScreen()
</script>

<template>
  <p class="section-desc">
      <code>useScreen()</code> 是组件库内部做运行时响应式判断的核心 composable，
      业务代码可用它做条件渲染或样式绑定。
    </p>

    <!-- 断点状态 -->
    <div class="block">
      <h3 class="block-title">断点状态 · useScreen()</h3>
      <div class="detector-grid">
        <div class="detector-item">
          <span class="detector-label">isPhonePad</span>
          <span class="detector-desc">≤1200px（触控设备）</span>
          <span class="detector-value" :class="{ active: isPhonePad }">
            {{ isPhonePad ? '✓ 小屏/触控' : '✗ 桌面' }}
          </span>
        </div>
        <div class="detector-item">
          <span class="detector-label">isPhonePadSize</span>
          <span class="detector-desc">≤840px（屏幕尺寸）</span>
          <span class="detector-value" :class="{ active: isPhonePadSize }">
            {{ isPhonePadSize ? '✓ 紧凑布局' : '✗ 标准布局' }}
          </span>
        </div>
        <div class="detector-item">
          <span class="detector-label">isPhoneSize</span>
          <span class="detector-desc">≤600px（手机）</span>
          <span class="detector-value" :class="{ active: isPhoneSize }">
            {{ isPhoneSize ? '✓ 手机' : '✗ 非手机' }}
          </span>
        </div>
        <div class="detector-item">
          <span class="detector-label">isPadSize</span>
          <span class="detector-desc">601–1200px（平板）</span>
          <span class="detector-value" :class="{ active: isPadSize }">
            {{ isPadSize ? '✓ 平板' : '✗ 非平板' }}
          </span>
        </div>
        <div class="detector-item">
          <span class="detector-label">isTouchDevice</span>
          <span class="detector-desc">触控设备</span>
          <span class="detector-value" :class="{ active: isTouchDevice }">
            {{ isTouchDevice ? '✓ 触控' : '✗ 指针' }}
          </span>
        </div>

      </div>
    </div>

    <!-- 条件渲染示例 -->
    <div class="block">
      <h3 class="block-title">条件渲染示例</h3>
      <div class="demo-area">
        <!-- ⚠️ Nuxt SSR 中 useScreen() 的 matchMedia 不可用，默认值与客户端不同。
             含 useScreen() 条件渲染的组件建议用 <ClientOnly> 包裹或延迟到 app:mounted 后 -->
        <ClientOnly>
          <div v-if="isPhonePadSize" class="compact-layout">
            <span class="demo-badge compact">紧凑模式</span>
            <p class="demo-text">≤840px：使用简化布局、更少操作入口</p>
          </div>
          <div v-else class="standard-layout">
            <span class="demo-badge standard">标准模式</span>
            <p class="demo-text">>840px：使用完整布局、更多交互能力</p>
          </div>
          <template #fallback>
            <div class="standard-layout">
              <span class="demo-badge standard">加载中...</span>
              <p class="demo-text">检测断点...</p>
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>

    <!-- in-dark 暗色模式包装器 -->
    <div class="block">
      <h3 class="block-title">暗色模式包装器 · @include in-dark</h3>
      <p class="block-hint">
        <code>common.scss</code> 的 <code>@include in-dark { ... }</code> mixin
        在 dark 模式下追加样式。切换主题观察边框变化。
      </p>
      <div class="dark-demo-card">
        <span class="dark-demo-label">优先用语义 token（自带 light/dark 适配）</span>
        <span class="dark-demo-note">仅在需要 dark 专属微调时用 in-dark</span>
      </div>
    </div>

    <!-- 安全 hover 示例 -->
    <div class="block">
      <h3 class="block-title">安全 hover · @include hover</h3>
      <p class="block-hint">
        <code>@include hover { ... }</code> 仅在指针设备 :hover 时追加样式，触控设备不粘连。
        对比 <code>@include hoverable { ... }</code>（整个块仅在 hover 设备生效）。
      </p>
      <div class="hover-demo-row">
        <div class="hover-item safe-hover">
          <span>安全 hover</span>
          <code>@include hover { opacity: 1; }</code>
        </div>
        <div class="hover-item hoverable-block">
          <span>hoverable 整块</span>
          <code>@include hoverable { background: ...; }</code>
        </div>
      </div>
    </div>
</template>

<style lang="scss" scoped>
.section-desc {
  @include text2;
  color: var(--o-color-info3);
  margin: 0 0 var(--o-gap-5);

  code {
    @include inline-code;
  }
}

.block {
  @include demo-block;
}

.block-title {
  @include demo-block-title;
}

.block-hint {
  @include tip2;
  color: var(--o-color-warning1);
  margin: 0 0 var(--o-gap-3);

  code {
    @include inline-code;
  }
}

/* 断点检测 */
.detector-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--o-gap-3);
}

.detector-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--o-gap-3);
  background-color: var(--o-color-fill3);
  border-radius: var(--o-radius-m);
}

.detector-label {
  @include tip1;
  font-weight: var(--o-font_weight-medium);
  color: var(--o-color-info2);
  font-family: var(--o-font_family-code);
}

.detector-desc {
  @include tip2;
  color: var(--o-color-info4);
}

.detector-value {
  @include tip1;
  font-weight: var(--o-font_weight-medium);
  color: var(--o-color-info4);
  padding-top: var(--o-gap-1);

  &.active {
    color: var(--o-color-primary1);
  }
}

/* 条件渲染 */
.demo-area {
  padding: var(--o-gap-3);
  background-color: var(--o-color-fill3);
  border-radius: var(--o-radius-m);
}

.compact-layout,
.standard-layout {
  display: flex;
  align-items: center;
  gap: var(--o-gap-3);
}

.demo-badge {
  @include tip1;
  font-weight: var(--o-font_weight-medium);
  padding: var(--o-gap-1) var(--o-gap-2);
  border-radius: var(--o-radius_control-l);

  &.compact {
    background-color: var(--o-color-warning1);
    color: var(--o-color-info1-inverse);
  }

  &.standard {
    background-color: var(--o-color-primary1);
    color: var(--o-color-info1-inverse);
  }
}

.demo-text {
  @include text2;
  color: var(--o-color-info3);
  margin: 0;
}

/* in-dark 暗色模式包装器 */
.dark-demo-card {
  padding: var(--o-gap-4);
  background-color: var(--o-color-fill3);
  border-radius: var(--o-radius-m);
  border: 2px solid var(--o-color-control1);

  // 仅 dark 模式下追加的样式
  @include in-dark {
    border-color: var(--o-color-auxiliary1);
    background-color: var(--o-color-fill2);
  }
}

.dark-demo-label {
  @include text1;
  color: var(--o-color-info2);
  display: block;
  margin-bottom: var(--o-gap-1);
}

.dark-demo-note {
  @include tip2;
  color: var(--o-color-info4);
  display: block;
}

/* 安全 hover */
.hover-demo-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--o-gap-3);

  @include respond('<=pad_v') {
    grid-template-columns: 1fr;
  }
}

.hover-item {
  display: flex;
  flex-direction: column;
  gap: var(--o-gap-2);
  padding: var(--o-gap-3);
  background-color: var(--o-color-fill3);
  border-radius: var(--o-radius-m);
  cursor: default;

  code {
    font-family: var(--o-font_family-code);
    font-size: var(--o-font_size-tip2);
    color: var(--o-color-info4);
  }
}

// 安全 hover：仅在指针设备 :hover 时追加样式，触控不粘连
.safe-hover {
  opacity: 0.7;

  @include hover {
    opacity: 1;
    box-shadow: var(--o-shadow-2);
  }
}

// hoverable 整块：仅在 hover 设备下整个样式块生效
.hoverable-block {
  @include hoverable {
    background-color: var(--o-color-primary4-light);
    border: 1px solid var(--o-color-primary1);
  }
}
</style>
