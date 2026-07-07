<script setup lang="ts">
/**
 * @description 间距 Token 展示。固定 --o-gap-* 与响应式 --o-r-gap-* 对比。
 */
const fixedGaps = [1, 4, 6, 8].map(n => ({varName: `--o-gap-${n}`, n}))
const responsiveGaps = [2, 5, 8].map(n => ({varName: `--o-r-gap-${n}`, n}))
</script>

<template>
  <div class="dual-row">
      <div class="block">
        <h3 class="block-title">固定间距 <code class="inline">--o-gap-*</code></h3>
        <div class="gap-list">
          <div v-for="g in fixedGaps" :key="g.varName" class="gap-item">
            <div class="gap-visual">
              <div class="gap-box"></div>
              <div class="gap-bar" :style="{ width: `var(${g.varName})` }"></div>
              <div class="gap-box"></div>
            </div>
            <code class="gap-var">{{ g.varName }}</code>
          </div>
        </div>
      </div>

      <div class="block">
        <h3 class="block-title">响应式间距 <code class="inline">--o-r-gap-*</code></h3>
        <p class="block-hint">↔ 缩放窗口观察变化</p>
        <div class="gap-list">
          <div v-for="g in responsiveGaps" :key="g.varName" class="gap-item">
            <div class="gap-visual">
              <div class="gap-box alt"></div>
              <div class="gap-bar alt" :style="{ width: `var(${g.varName})` }"></div>
              <div class="gap-box alt"></div>
            </div>
            <code class="gap-var">{{ g.varName }}</code>
          </div>
        </div>
      </div>
    </div>
</template>

<style lang="scss" scoped>
.dual-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--o-gap-4);
  margin-bottom: var(--o-gap-4);

  @include respond('<=pad_v') {
    grid-template-columns: 1fr;
  }
}

.block {
  background-color: var(--o-color-fill2);
  border-radius: var(--o-radius-l);
  padding: var(--o-gap-4);
  box-shadow: var(--o-shadow-1);
}

.block-title {
  @include h4;
  color: var(--o-color-info1);
  margin: 0 0 var(--o-gap-3);
  padding-bottom: var(--o-gap-2);
  border-bottom: 1px solid var(--o-color-control1);

  .inline {
    font-family: var(--o-font_family-code);
    font-size: var(--o-font_size-tip2);
    color: var(--o-color-info4);
    font-weight: var(--o-font_weight-regular);
  }
}

.block-hint {
  @include tip2;
  color: var(--o-color-warning1);
  margin: 0 0 var(--o-gap-2);
}

.gap-list {
  display: flex;
  flex-direction: column;
  gap: var(--o-gap-2);
}

.gap-item {
  display: flex;
  align-items: center;
  gap: var(--o-gap-3);
}

.gap-visual {
  display: flex;
  align-items: center;
  flex: 1;
}

.gap-box {
  width: var(--o-control_size-s);
  height: var(--o-control_size-s);
  background-color: var(--o-color-primary1);
  border-radius: var(--o-radius-xs);
  flex-shrink: 0;

  &.alt {
    background-color: var(--o-color-auxiliary5);
  }
}

.gap-bar {
  height: var(--o-control_size-2xs);
  background-color: var(--o-color-primary1-light);
  border-radius: var(--o-radius-xs);

  &.alt {
    background-color: var(--o-color-primary4-light);
  }
}

.gap-var {
  font-family: var(--o-font_family-code);
  font-size: var(--o-font_size-tip2);
  color: var(--o-color-info4);
  flex-shrink: 0;
  width: 120px;
  text-align: right;
}
</style>
