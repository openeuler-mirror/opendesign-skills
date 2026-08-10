> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](tag.visual.md) · [样式定制](tag.style.md)

# OTag 标签 — 代码使用

### 导入方式

```vue
<script setup>
import { OTag } from '@opensig/opendesign';
</script>
```

---

### 类型定义

```typescript
type TagColorT = 'normal' | 'info' | 'primary' | 'success' | 'warning' | 'danger' | 'pending' | 'disabled' | 'main2';
type TagVariantT = 'solid' | 'outline';
type SizeT = 'large' | 'medium' | 'small';
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| color | `TagColorT` | `'normal'` / `'info'` / `'primary'` / `'success'` / `'warning'` / `'danger'` / `'pending'` / `'disabled'` / `'main2'` | `'normal'` | 标签颜色。"normal" 默认灰色、"info" 信息（同 normal 外观，语义区分用）、"primary" 主色蓝、"success" 成功绿、"warning" 警告橙、"danger" 危险红、"pending" 待处理蓝（v1.2.6 新增，使用 `--o-blue-6`）、"disabled" 禁用灰（v1.2.6 新增，无 hover 交互态）、"main2" 品牌渐变色（v1.2.6 新增，使用 `--o-color-main2` 渐变，outline 模式下文字和边框均为渐变效果）。默认 normal。 | `'pending'`/`'disabled'`/`'main2'` 为 v1.2.6 新增 |
| variant | `TagVariantT` | `'solid'` / `'outline'` | `'solid'` | 标签样式。"solid" 实心填充、"outline" 线框描边。默认 solid。 | — |
| size | `SizeT` | `'large'` / `'medium'` / `'small'` | `'large'` | 标签尺寸。"large" 大号（高度 24px，≤1680px 断点下收缩为 20px）、"medium" 中号（高度 20px，≤840px 收缩为 16px）、"small" 小号（高度 16px，文字通过 scale(0.833) 视觉缩小至约 10px）。默认 large。 | — |
| round | `RoundT` | `'pill'` / CSS 值 | — | 圆角值。"pill" 胶囊全圆（组件 JS 注入内联样式 `--tag-radius: 100vh`，不受 CSS 变量覆盖影响）；也可传任意 CSS 长度值。 | — |
| interactive | `boolean` | — | `false` | 是否可交互，用于渲染不同的交互态样式（v1.2.6 新增）。设为 true 后标签在 hover 时会有背景色、边框色变化。当 `closable` 为 true 时自动开启。默认 false。 | 1.2.6 |
| closable | `boolean` | — | `false` | 是否显示关闭按钮。默认关闭。 | — |
| visible | `boolean` | — | `undefined` | 是否可见（v-model 双向绑定）。用于受控模式。 | — |
| defaultVisible | `boolean` | — | `true` | 非受控模式下是否默认可见。默认可见。 | — |
| beforeClose | `() => Promise<boolean> \| boolean` | — | 关闭前的钩子函数。返回 true 或 Promise\<true\> 允许关闭，返回 false 或 Promise\<false\> 阻止关闭。 | 关闭前拦截 | — |

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:visible | `(val: boolean)` | 可见状态变化时 |
| close | `(ev: MouseEvent)` | 关闭按钮点击后触发（beforeClose 允许后）。 |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| icon | — | 有 icon 插槽时 | 左侧图标 | 无 |
| default | — | 始终 | 标签文字 | 无 |

---

### 典型使用场景与调用模板

**场景 1：基础标签**
适用于：分类标记
```vue
<OTag>默认标签</OTag>
<OTag color="primary">主色标签</OTag>
<OTag color="success">成功标签</OTag>
<OTag color="danger">危险标签</OTag>
```

**场景 2：线框样式**
适用于：轻量标记
```vue
<OTag variant="outline" color="primary">线框标签</OTag>
```

**场景 3：带图标**
适用于：图标+文字组合标记
```vue
<OTag color="info">
  <template #icon><OIconInfo /></template>
  信息标签
</OTag>
```

**场景 4：可关闭标签**
适用于：标签可移除场景
```vue
<script setup>
import { ref } from 'vue';
const visible = ref(true);
</script>
<template>
  <OTag v-model:visible="visible" closable color="primary">可关闭标签</OTag>
</template>
```

**场景 5：关闭前确认**
适用于：需要确认才能移除的标签
```vue
<OTag closable :before-close="() => confirm('确定删除？')">需确认</OTag>
```

**场景 6：不同尺寸**
适用于：适配不同场景
```vue
<OTag size="large">大号</OTag>
<OTag size="medium">中号</OTag>
<OTag size="small">小号</OTag>
```

**场景 7：待处理/禁用状态标签（v1.2.6）**
适用于：标记任务状态
```vue
<OTag color="pending">待审核</OTag>
<OTag color="disabled">已禁用</OTag>
```

**场景 8：品牌渐变色标签（v1.2.6）**
适用于：品牌专属标识，使用渐变背景
```vue
<!-- 实心渐变 -->
<OTag color="main2">品牌标签</OTag>
<!-- 渐变描边（文字和边框均为渐变效果） -->
<OTag color="main2" variant="outline">品牌标签</OTag>
```

**场景 9：交互态标签（v1.2.6）**
适用于：需要 hover 反馈的非关闭标签
```vue
<!-- 手动开启交互态 -->
<OTag color="normal" interactive>可交互标签</OTag>
<!-- closable 自动开启交互态 -->
<OTag color="primary" closable>可关闭标签（自动交互态）</OTag>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础标记 | `color` | 分类标签 |
| 轻量标记 | `variant="outline"` + `color` | 线框 |
| 可移除 | `closable` + `v-model:visible` | 动态标签 |
| 带确认 | `closable` + `:before-close` | 安全删除 |
| 小号圆角 | `size="small"` + `round="pill"` | 紧凑胶囊 |
