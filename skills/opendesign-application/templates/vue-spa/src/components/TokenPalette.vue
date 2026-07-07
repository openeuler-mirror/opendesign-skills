<script setup lang="ts">
/**
 * @description 色彩 Token 展示。按语义分组，每组仅取代表性色阶。
 */
const groups = [
  {
    title: '主色 Primary', items: [
      {v: '--o-color-primary1', l: '常规'},
      {v: '--o-color-primary2', l: '悬浮'},
      {v: '--o-color-primary4', l: '禁用'},
    ]
  },
  {
    title: '功能色 Functional', items: [
      {v: '--o-color-success1', l: '成功'},
      {v: '--o-color-warning1', l: '警告'},
      {v: '--o-color-danger1', l: '危险'},
    ]
  },
  {
    title: '文字 Info', items: [
      {v: '--o-color-info1', l: '标题'},
      {v: '--o-color-info2', l: '正文'},
      {v: '--o-color-info4', l: '禁用'},
    ]
  },
  {
    title: '填充 Fill', items: [
      {v: '--o-color-fill1', l: '页面'},
      {v: '--o-color-fill2', l: '卡片'},
      {v: '--o-color-fill3', l: '容器'},
    ]
  },
  {
    title: '辅助色 Auxiliary', items: [
      {v: '--o-color-auxiliary1', l: '深蓝'},
      {v: '--o-color-auxiliary2', l: '紫色'},
      {v: '--o-color-auxiliary5', l: '蓝色'},
    ]
  },
]
</script>

<template>
  <div class="palette-grid">
    <div v-for="g in groups" :key="g.title" class="palette-group">
      <h3 class="group-title">{{ g.title }}</h3>
      <div class="color-row">
        <div v-for="c in g.items" :key="c.v" class="color-item">
          <div class="color-swatch" :style="{ backgroundColor: `var(${c.v})` }"></div>
          <div class="color-info">
            <span class="color-label">{{ c.l }}</span>
            <code class="color-var">{{ c.v }}</code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.palette-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--o-gap-4);
}

.palette-group {
  @include demo-block;
  margin-bottom: 0; // 脱离 margin-bottom，由外层 grid gap 控制
}

.group-title {
  @include demo-block-title;
}

.color-row {
  display: flex;
  flex-direction: column;
  gap: var(--o-gap-2);
}

.color-item {
  display: flex;
  align-items: center;
  gap: var(--o-gap-2);
}

.color-swatch {
  width: var(--o-control_size-l);
  height: var(--o-control_size-l);
  border-radius: var(--o-radius-m);
  border: 1px solid var(--o-color-control1);
  flex-shrink: 0;
}

.color-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.color-label {
  @include tip1;
  font-weight: var(--o-font_weight-medium);
  color: var(--o-color-info2);
}

.color-var {
  font-family: var(--o-font_family-code);
  font-size: var(--o-font_size-tip2);
  color: var(--o-color-info4);
}
</style>
