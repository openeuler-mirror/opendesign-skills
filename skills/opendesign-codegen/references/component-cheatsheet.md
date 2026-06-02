# 设计意图 → OpenDesign 组件 速查

AI 直出代码时，按设计意图选用真实组件（从 `@opensig/opendesign` 导入），**不要用原生 HTML 元素或手写 div 替代**。完整 Props/Events/Slots 见 [`../../opendesign-components/SKILL.md`](../../opendesign-components/SKILL.md)。

---

## 选用表

| 设计意图 / 视觉 | 组件 | 关键 props / slots |
|----------------|------|--------------------|
| 主操作 / 次操作按钮 | `OButton` | `variant`(solid/outline/text)、`color`(primary/danger…)、`size`、`disabled`、`loading` |
| 行内文字链接、表格操作列 | `OLink` | `href`、`color`、`size` |
| 卡片 / 内容容器 | `OCard` | 默认插槽；`#header`/`#footer` |
| 状态标签 / 分类标签 | `OTag` | `color`(success/warning/danger…)、`variant`、`size`、`round` |
| 单行输入 / 搜索框 | `OInput` | `v-model`、`clearable`、`size`、`#prefix`(放 OIcon) |
| 下拉选择 | `OSelect` + `OOption` | `v-model`；选项 `<OOption :value :label>` |
| 多行文本 | `OTextarea` | `v-model`、`rows`、`maxlength` |
| 单选 / 复选 / 开关 | `ORadioGroup`+`ORadio` / `OCheckbox` / `OSwitch` | `v-model` |
| 数据表格 | `OTable` | `:columns`(`{label,key}`)、`:data`；单元格 `#td_<key>="{ row }"`、表头 `#header` |
| 分页 | `OPagination` | `:total`、`:page`、`:page-size`、`:page-sizes`、`@change` |
| 标签页 | `OTabs` + `OTabPane` | `v-model`；`<OTabPane :value :label>` |
| 弹窗 | `ODialog` | `v-model:visible`、`#header`/`#footer` |
| 图标 | `OIcon` | `<OIcon><IconXxx /></OIcon>`，图标来自工程的 `~icons/...` 或 svg 导入 |
| 分割线 | `ODivider` | `direction`、`align` |

> 纯布局容器（栅格、楼层、文字区块）用语义化标签（`<section>/<header>/<div>`）+ scoped 样式即可，无需组件。

---

## 直出代码片段示例

### 按钮组
```vue
<script setup lang="ts">
import { OButton } from '@opensig/opendesign';
const onStart = () => {/* ... */};
</script>

<template>
  <div class="actions">
    <OButton variant="solid" color="primary" @click="onStart">{{ t('demo.start') }}</OButton>
    <OButton variant="outline">{{ t('demo.viewSpec') }}</OButton>
  </div>
</template>

<style lang="scss" scoped>
.actions {
  display: flex;
  gap: var(--o-r-gap-3);
}
</style>
```

### 卡片栅格
```vue
<script setup lang="ts">
import { OCard, OTag } from '@opensig/opendesign';
const features = ref([/* { id, title, text, tag } */]);
</script>

<template>
  <div class="card-row">
    <OCard v-for="item in features" :key="item.id" class="feature-card">
      <h3 class="feature-card__title">{{ item.title }}</h3>
      <p class="feature-card__text">{{ item.text }}</p>
      <OTag color="primary">{{ item.tag }}</OTag>
    </OCard>
  </div>
</template>

<style lang="scss" scoped>
.card-row {
  display: flex;
  gap: var(--o-r-grid-column-gutter);
}
.feature-card {
  flex: 1;
  &__title {
    color: var(--o-color-info1);
    font-size: var(--o-r-font_size-h3);
    line-height: var(--o-r-line_height-h3);
  }
}
</style>
```

### 表格（OTable 真实 API：columns{label,key} + #td_<key> 插槽）
```vue
<script setup lang="ts">
import { OTable, OTag, OLink } from '@opensig/opendesign';
const columns = [
  { label: t('demo.colName'), key: 'name' },
  { label: t('demo.colStatus'), key: 'status' },
  { label: t('demo.colAction'), key: 'action' },
];
const rows = ref([/* { id, name, status } */]);
</script>

<template>
  <OTable :columns="columns" :data="rows">
    <template #td_status="{ row }">
      <OTag :color="row.status === 'active' ? 'success' : 'warning'">{{ row.statusLabel }}</OTag>
    </template>
    <template #td_action="{ row }">
      <OLink color="primary" href="javascript:void(0)">{{ t('demo.detail') }}</OLink>
    </template>
  </OTable>
</template>
```

> ⚠️ 不要 `:deep()` 改 OTable / OButton 内部结构；视觉差异用组件 props + 主题 token。
