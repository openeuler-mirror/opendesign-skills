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
| 下拉选择 | `OSelect` | `v-model`；选项 `:options` 数组（扁平/分组）或 `<OOption :value :label>`；搜索 `filterable`、大数据 `virtual` |
| 多行文本 | `OTextarea` | `v-model`、`rows`、`maxlength` |
| 单选 / 复选 / 开关 | `ORadioGroup`+`ORadio` / `OCheckbox` / `OSwitch` | `v-model` |
| 数据表格 | `ODataTable` | `:columns`(`{label,key,formatter}`)、`:data`；单元格自定义渲染用 `column.formatter`（返回函数式组件），表头 `column.label` |
| 分页 | `OPagination` | `:total`、`:page`、`:page-size`、`:page-sizes`、`@change` |
| 标签页 | `OTab` + `OTabPane` | `v-model`；`<OTabPane :value :label>` |
| 弹窗 | `ODialog` | `v-model:visible`、`#header`/`#footer` |
| 图标 | `OIcon` | `<OIcon><IconXxx /></OIcon>`，图标来自工程的 `~icons/...` 或 svg 导入 |
| 分割线 | `ODivider` | `direction`、`align` |
| 图片放大查看 | `OFigure` | `preview`（内置 OImageViewer 预览层，缩放/旋转/切图）；`:preview="{ showProgress: true }"` 透传查看器配置 |
| 新手引导 / 功能漫游 | `OTour` + `OTourStep` | `v-model:visible`、步骤 `target`/`title`/`detail`、`mask`(非模态 false)、`spotlightRadius` |

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

### 表格（ODataTable schema 风格：columns + formatter，不推荐 #td_ 插槽）
```vue
<script setup lang="ts">
import { h } from 'vue';
import { ODataTable, OTag, OLink } from '@opensig/opendesign';
import type { DataTableColumnT } from '@opensig/opendesign';

const columns: DataTableColumnT[] = [
  { label: t('demo.colName'), key: 'name' },
  {
    label: t('demo.colStatus'), key: 'status',
    // 单元格自定义渲染：formatter 返回函数式组件，每次渲染读取最新 row 值
    formatter: ({ row }) => () => h(OTag, { color: row.status === 'active' ? 'success' : 'warning' }, () => row.statusLabel),
  },
  {
    label: t('demo.colAction'), key: 'action',
    formatter: ({ row }) => () => h(OLink, { color: 'primary', href: 'javascript:void(0)' }, () => t('demo.detail')),
  },
];
const rows = ref([/* { id, name, status, statusLabel } */]);
</script>

<template>
  <ODataTable :columns="columns" :data="rows" />
</template>
```

> ODataTable 用 schema 风格：列配置 `formatter` 返回函数式组件做单元格渲染，操作列用 OLink（主要操作 `color="primary"`、危险操作 `color="danger"`）；`#td_<key>` 插槽已不推荐。formatter 也可用 JSX（`<script setup lang="tsx">`），见 [opendesign-components → ODataTable](../../opendesign-components/SKILL.md#odatatable) 场景 12/13。
> ⚠️ 不要 `:deep()` 改 ODataTable / OButton 内部结构；视觉差异用组件 props + 主题 token。
