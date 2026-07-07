<script setup lang="ts">
/**
 * @description 响应式栅格 Token 展示。使用 --o-r-grid-* 和 .o-r-grid-container。
 */
import {useScreen} from '@opensig/opendesign'

const {isPhoneSize, isPadSize} = useScreen()
const columnTotal = computed(() => isPhoneSize.value ? 4 : isPadSize.value ? 12 : 24)

const vars = [
  {l: '列总数', v: '--o-r-grid-column-total'},
  {l: '单列宽', v: '--o-r-grid-column-width'},
  {l: '水槽宽', v: '--o-r-grid-column-gutter'},
  {l: '外侧留白', v: '--o-r-grid-padding'},
]
</script>

<template>
  <p class="section-desc">
      当前断点：<strong>{{ columnTotal }}</strong> 列。缩放窗口观察变化。
    </p>

    <!-- 变量 -->
    <div class="block">
      <h3 class="block-title">核心变量</h3>
      <div class="var-grid">
        <div v-for="v in vars" :key="v.v" class="var-item">
          <span class="var-label">{{ v.l }}</span>
          <code class="var-code">{{ v.v }}</code>
        </div>
      </div>
    </div>

    <!-- 布局演示 -->
    <div class="block">
      <h3 class="block-title">栅格布局</h3>
      <p class="block-hint">↔ 缩放窗口观察列数变化</p>
      <div class="grid-inner">
        <div class="grid-cell color-primary grid-full">
          <span class="cell-text">全宽</span>
          <code class="cell-var">--o-r-grid-24</code>
        </div>
        <div class="grid-cell color-aux1 grid-half">
          <span class="cell-text">1/2</span>
          <code class="cell-var">--o-r-grid-12</code>
        </div>
        <div class="grid-cell color-aux2 grid-half">
          <span class="cell-text">1/2</span>
          <code class="cell-var">--o-r-grid-12</code>
        </div>
        <div class="grid-cell color-aux3 grid-third">
          <span class="cell-text">1/3</span>
          <code class="cell-var">--o-r-grid-8</code>
        </div>
        <div class="grid-cell color-aux5 grid-third">
          <span class="cell-text">1/3</span>
          <code class="cell-var">--o-r-grid-8</code>
        </div>
        <div class="grid-cell color-aux6 grid-third">
          <span class="cell-text">1/3</span>
          <code class="cell-var">--o-r-grid-8</code>
        </div>
      </div>
    </div>
</template>

<style lang="scss" scoped>
.section-desc {
  @include text2;
  color: var(--o-color-info3);
  margin: 0 0 var(--o-gap-5);

  strong {
    color: var(--o-color-primary1);
    font-weight: var(--o-font_weight-bold);
  }
}

.block {
  @include demo-block;
}

.block-title {
  @include demo-block-title;
}

/* 变量 */
.var-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--o-gap-2);
}

.var-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--o-gap-2);
  background-color: var(--o-color-fill3);
  border-radius: var(--o-radius-m);
}

.var-label {
  @include tip1;
  font-weight: var(--o-font_weight-medium);
  color: var(--o-color-info2);
}

.var-code {
  font-family: var(--o-font_family-code);
  font-size: var(--o-font_size-tip2);
  color: var(--o-color-info4);
}

/* 栅格布局 */
.block-hint {
  @include tip2;
  color: var(--o-color-warning1);
  margin: 0 0 var(--o-gap-3);
}

.grid-inner {
  display: flex;
  flex-wrap: wrap;
  gap: var(--o-r-grid-column-gutter);
}

.grid-cell {
  border-radius: var(--o-radius-m);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--o-gap-2);
  min-height: var(--o-control_size-l);
  box-sizing: border-box;
}

/* 用 flex-basis 引用栅格变量，flex-shrink:1 自适应容器实际宽度 */
.grid-full {
  flex: 1 0 100%;
}

.grid-half {
  flex: 0 1 var(--o-r-grid-12);
}

.grid-third {
  flex: 0 1 var(--o-r-grid-8);
}

/* pad_v 以下全部撑满 */
@include respond('<=pad_v') {
  .grid-half,
  .grid-third {
    flex: 1 0 100%;
  }
}

.cell-text {
  @include tip1;
  font-weight: var(--o-font_weight-medium);
  color: var(--o-color-info1-inverse);
}

.cell-var {
  font-family: var(--o-font_family-code);
  font-size: var(--o-font_size-tip2);
  color: var(--o-color-info1-inverse);
  opacity: 0.8;
}

.color-primary {
  background-color: var(--o-color-primary1);
}

.color-aux1 {
  background-color: var(--o-color-auxiliary1);
}

.color-aux2 {
  background-color: var(--o-color-auxiliary2);
}

.color-aux3 {
  background-color: var(--o-color-auxiliary3);
}

.color-aux5 {
  background-color: var(--o-color-auxiliary5);
}

.color-aux6 {
  background-color: var(--o-color-auxiliary6);
}
</style>
