> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](pagination.visual.md) · [样式定制](pagination.style.md)

# OPagination 分页 — 代码使用

### 导入方式

```vue
<script setup>
import { OPagination } from '@opensig/opendesign';
</script>
```

---

### 类型定义

```typescript
type PaginationVariantT = 'solid' | 'outline';
type PaginationLayoutT = Array<'total' | 'pagesize' | 'pager' | 'jumper'>;
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| layout | `PaginationLayoutT` | `'total'` / `'pagesize'` / `'pager'` / `'jumper'` 组合 | `['pagesize', 'pager', 'jumper']` | 显示哪些控件，通过数组组合。可选 "total"（总数标签）、"pagesize"（每页条数选择器）、"pager"（页码按钮）、"jumper"（跳转输入框）。默认包含 pagesize、pager、jumper。 | — |
| variant | `PaginationVariantT` | `'solid'` / `'outline'` | `'outline'` | 按钮样式。"outline" 线框、"solid" 实心。默认 outline。 | — |
| round | `RoundT` | `'pill'` / CSS 值 | — | 圆角值。"pill" 半圆或 CSS 值。 | — |
| pageSizes | `number[]` | — | `[6, 12, 24, 48]` | 每页条数的可选项数组。默认 [6, 12, 24, 48]。 | — |
| pageSize | `number` | — | `6`（pageSizes[0]） | 每页数据条数（v-model:pageSize 双向绑定）。默认为 pageSizes 数组的第一项。 | — |
| total | `number` | — | `0` | 数据总条数。默认 0。 | — |
| page | `number` | — | `1` | 当前页码（v-model:page 双向绑定）。默认 1。 | — |
| showPageCount | `number` | — | `9` | 最多显示多少个页码按钮。超出部分显示省略号。默认 9。 | — |
| showMore | `boolean` | — | `true` | 省略号按钮上悬停时是否弹出隐藏的页码列表（页码超过 50 项时使用虚拟列表）。默认开启。 | — |
| showTotal | `boolean` | — | — | 是否显示总数据量（已废弃，请在 layout 中配置 'total'） | @deprecated 1.2.2 |
| simple | `boolean` | — | `false` | 是否使用简洁布局。开启后只显示页码区域（上/下页 + 当前页/总页数输入框），layout 和 showPageCount 属性失效。默认关闭。 | — |

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:page | `(val: number)` | 页码变化时 |
| update:pageSize | `(val: number)` | 每页条数变化时 |
| change | `(newValue: { page, pageSize }, oldValue: { page, pageSize })` | 页码或每页条数变化时触发。可获取变化前后的 page 和 pageSize。 |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| total | `{ total: number, pageCount: number }` | layout 包含 'total' | 替换总数标签区域。可获取 total（总条数）和 pageCount（总页数），用于自定义展示格式。需 layout 包含 "total"。 | `共 {total} 条` |

---

### 典型使用场景与调用模板

**场景 1：基础分页**
适用于：最常见的列表分页
```vue
<script setup>
import { ref } from 'vue';
const page = ref(1);
const pageSize = ref(12);
</script>
<template>
  <OPagination v-model:page="page" v-model:page-size="pageSize" :total="100" />
</template>
```

**场景 2：完整布局（含总数）**
适用于：需显示总数据量
```vue
<OPagination
  v-model:page="page"
  v-model:page-size="pageSize"
  :total="200"
  :layout="['total', 'pagesize', 'pager', 'jumper']"
/>
```

**场景 3：自定义总数标签**
适用于：定制化展示
```vue
<OPagination :total="100" :page-size="10" :layout="['total', 'pager']">
  <template #total="{ total, pageCount }">
    共 <b>{{ total }}</b> 条，<b>{{ pageCount }}</b> 页
  </template>
</OPagination>
```

**场景 4：简洁模式**
适用于：空间有限的场景
```vue
<OPagination :total="100" simple />
```

**场景 5：自定义每页条数选项**
适用于：特定业务需求
```vue
<OPagination :total="500" :page-sizes="[10, 20, 50, 100]" />
```

**场景 6：圆角按钮**
适用于：风格定制
```vue
<OPagination :total="100" round="pill" />
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础分页 | `v-model:page` + `:total` | 最常见 |
| 带总数 | `:layout="['total', 'pagesize', 'pager', 'jumper']"` | 完整控件 |
| 简洁模式 | `simple` | 极简分页 |
| 实心按钮 | `variant="solid"` | 填充风格 |
| 自定义条数 | `:page-sizes="[10, 20, 50]"` | 自定义选项 |
| 监听变化 | `@change` | 获取前后值对比 |

---

### 暴露属性

| 属性名 | 类型 | 说明 |
|--------|------|------|
| pageCount | `ComputedRef<number>` | 总页数 |
