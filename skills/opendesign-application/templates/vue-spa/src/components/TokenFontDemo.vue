<script setup lang="ts">
/**
 * @description 字体 Token 展示 + 实际应用。
 * 响应式字号通过 font.scss mixin（全局已注入）使用，字重 / 字体族通过 CSS 变量使用。
 */
const sizes = [
  {mixin: 'display1', desc: '数据展示'},
  {mixin: 'h1', desc: '一级标题'},
  {mixin: 'h2', desc: '二级标题'},
  {mixin: 'text1', desc: '正文'},
  {mixin: 'tip1', desc: '提示'},
]

const weights = [
  {w: '--o-font_weight-light', l: 'light · 300', italic: false},
  {w: '--o-font_weight-regular', l: 'regular · 400', italic: false},
  {w: '--o-font_weight-medium', l: 'medium · 500', italic: false},
  {w: '--o-font_weight-bold', l: 'bold · 700', italic: false},
  {w: '--o-font_weight-regular', l: 'regular italic · 400', italic: true},
  {w: '--o-font_weight-bold', l: 'bold italic · 700', italic: true},
]
</script>

<template>
  <!-- 响应式字号 mixin -->
  <div class="block">
      <h3 class="block-title">响应式字号 · font.scss mixin</h3>

      <!-- 配置说明 -->
      <div class="config-note">
        <p class="config-text">
          <code>vite.config.ts</code> 中通过 <code>additionalData</code> 全局注入了
          <code>font.scss</code>，所有 <code>&lt;style lang="scss"&gt;</code> 中可直接
          <code>@include</code> 调用，无需手动导入。缩放窗口可见字号自动变化。
        </p>
        <pre class="config-code"><code>// vite.config.ts
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `
        @use "@/assets/styles/mixin/font.scss" as *;
      `
    }
  }
}</code></pre>
      </div>

      <!-- 两种用法 -->
      <div class="usage-row">
        <div class="usage-item">
          <p class="usage-label">直接应用</p>
          <pre class="usage-code"><code>.title {
  @include h1;  <span class="c">// 输出 font-size + line-height</span>
}</code></pre>
        </div>
        <div class="usage-item">
          <p class="usage-label">仅暴露变量（加前缀）</p>
          <pre class="usage-code"><code>.card {
  @include h1('card-');
  <span class="c">// 只生成 --card-font-size / --card-line-height</span>
  <span class="c">// 不输出 font-size / line-height 属性</span>
}</code></pre>
        </div>
      </div>

      <!-- 效果预览 -->
      <div class="size-list">
        <div v-for="s in sizes" :key="s.mixin" class="size-item">
          <span class="size-preview" :class="`preview-${s.mixin}`">OpenDesign 设计系统</span>
          <div class="size-meta">
            <code class="size-mixin">@include {{ s.mixin }};</code>
            <span class="size-desc">{{ s.desc }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 实际应用：仪表盘卡片 -->
    <div class="block">
      <h3 class="block-title">应用示例 · 仪表盘数据卡</h3>
      <div class="stat-grid">
        <div class="stat-card">
          <span class="stat-label">总用户数</span>
          <span class="stat-value">128,560</span>
          <span class="stat-change trend-up">+12.5%</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">服务器负载</span>
          <span class="stat-value">63.7%</span>
          <span class="stat-change trend-down">-3.1%</span>
        </div>
      </div>
    </div>

    <!-- 字重 & 斜体 -->
    <div class="block">
      <h3 class="block-title">字重 & 斜体</h3>
      <div class="weight-list">
        <div v-for="w in weights" :key="w.l" class="weight-item">
          <span
              class="weight-text"
              :style="{ fontWeight: `var(${w.w})`, fontStyle: w.italic ? 'italic' : 'normal' }"
          >HarmonyOS Sans 鸿蒙黑体</span>
          <code class="weight-label">{{ w.l }}</code>
        </div>
      </div>
    </div>

    <!-- 字体族 -->
    <div class="block">
      <h3 class="block-title">字体族</h3>
      <div class="family-list">
        <div class="family-item">
          <p class="family-text" style="font-family: var(--o-font_family);">常规字体：The quick brown fox 鸿蒙黑体</p>
          <code class="family-var">--o-font_family</code>
        </div>
        <div class="family-item">
          <p class="family-text" style="font-family: var(--o-font_family-code);">代码字体：const x = await fetch(url)</p>
          <code class="family-var">--o-font_family-code</code>
        </div>
      </div>
    </div>
</template>

<style lang="scss" scoped>
.block {
  @include demo-block;
}

.block-title {
  @include demo-block-title;
}

/* ===== 配置说明 ===== */
.config-note {
  background-color: var(--o-color-fill3);
  border-radius: var(--o-radius-m);
  padding: var(--o-gap-3);
  margin-bottom: var(--o-gap-3);
}

.config-text {
  @include tip1;
  color: var(--o-color-info3);
  margin: 0 0 var(--o-gap-2);
  line-height: var(--o-r-line_height-tip1);

  code {
    font-family: var(--o-font_family-code);
    font-size: 0.85em;
    color: var(--o-color-danger1);
    background-color: var(--o-color-fill1);
    padding: 1px var(--o-gap-1);
    border-radius: var(--o-radius-xs);
  }
}

.config-code,
.usage-code {
  margin: 0;
  padding: var(--o-gap-2) var(--o-gap-3);
  background-color: var(--o-color-fill1);
  border-radius: var(--o-radius-s);
  font-family: var(--o-font_family-code);
  font-size: var(--o-font_size-tip2);
  line-height: var(--o-line_height-tip2);
  color: var(--o-color-info2);
  overflow-x: auto;

  .c {
    color: var(--o-color-info4);
  }
}

/* ===== 两种用法 ===== */
.usage-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--o-gap-3);
  margin-bottom: var(--o-gap-4);

  @include respond('<=pad_v') {
    grid-template-columns: 1fr;
  }
}

.usage-item {
  display: flex;
  flex-direction: column;
  gap: var(--o-gap-1);
}

.usage-label {
  @include tip1;
  font-weight: var(--o-font_weight-medium);
  color: var(--o-color-info2);
  margin: 0;
}

/* ===== 字号预览：使用 mixin ===== */
.size-list {
  display: flex;
  flex-direction: column;
  gap: var(--o-gap-2);
}

.size-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--o-gap-3);
  padding-bottom: var(--o-gap-1);
  border-bottom: 1px dashed var(--o-color-control4);

  &:last-child {
    border-bottom: none;
  }

  @include respond('<=pad_v') {
    flex-direction: column;
    gap: var(--o-gap-1);
  }
}

/* 每个预览类直接 @include 对应 mixin */
.preview-display1 {
  @include display1;
}

.preview-h1 {
  @include h1;
}

.preview-h2 {
  @include h2;
}

.preview-text1 {
  @include text1;
}

.preview-tip1 {
  @include tip1;
}

.size-preview {
  color: var(--o-color-info1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.size-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;

  @include respond('<=pad_v') {
    align-items: flex-start;
  }
}

.size-mixin {
  font-family: var(--o-font_family-code);
  font-size: var(--o-font_size-tip2);
  color: var(--o-color-primary1);
}

.size-desc {
  @include tip2;
  color: var(--o-color-info4);
}

/* ===== 仪表盘卡片 ===== */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--o-gap-3);
}

.stat-card {
  background-color: var(--o-color-fill3);
  border-radius: var(--o-radius-m);
  padding: var(--o-gap-3);
  display: flex;
  flex-direction: column;
  gap: var(--o-gap-1);
}

.stat-label {
  @include tip1;
  color: var(--o-color-info3);
}

.stat-value {
  @include display3;
  font-weight: var(--o-font_weight-semibold);
  color: var(--o-color-info1);
}

.stat-change {
  @include tip1;
  font-weight: var(--o-font_weight-medium);

  &.trend-up {
    color: var(--o-color-success1);
  }

  &.trend-down {
    color: var(--o-color-danger1);
  }
}

/* ===== 字重 ===== */
.weight-list {
  display: flex;
  flex-direction: column;
  gap: var(--o-gap-1);
}

.weight-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--o-gap-3);
  padding: var(--o-gap-1) var(--o-gap-2);
  border-radius: var(--o-radius-s);

  @include hoverable {
    background-color: var(--o-color-fill3);
  }
}

.weight-text {
  @include text2;
  color: var(--o-color-info1);
}

.weight-label {
  font-family: var(--o-font_family-code);
  font-size: var(--o-font_size-tip2);
  color: var(--o-color-info4);
}

/* ===== 字体族 ===== */
.family-list {
  display: flex;
  flex-direction: column;
  gap: var(--o-gap-2);
}

.family-item {
  padding: var(--o-gap-3);
  background-color: var(--o-color-fill3);
  border-radius: var(--o-radius-m);
}

.family-text {
  color: var(--o-color-info2);
  margin: 0 0 var(--o-gap-1);
}

.family-var {
  font-family: var(--o-font_family-code);
  font-size: var(--o-font_size-tip2);
  color: var(--o-color-info4);
}
</style>
