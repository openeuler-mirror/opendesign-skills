> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](button.visual.md) · [样式定制](button.style.md)

# OButton 按钮 — 代码使用

### 导入方式

```vue
<script setup>
import { OButton } from '@opensig/opendesign';
</script>
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| color | `ButtonColorT` | `'normal'` / `'primary'` / `'success'` / `'warning'` / `'danger'` / `'brand'` | `'normal'` | 按钮的颜色主题。"normal" 默认灰色、"primary" 品牌蓝、"success" 成功绿、"warning" 警告橙、"danger" 危险红、"brand" 品牌色（与 primary 不同的品牌专属色）。默认 normal。 |
| variant | `VariantT` | `'solid'` / `'outline'` / `'text'` | `'outline'`（仅图标时为 `'text'`） | 按钮的视觉形状。"solid" 实心填充、"outline" 线框描边、"text" 纯文字无背景。默认 outline。注意：当按钮仅含图标（无文字内容）时，默认自动切换为 text 样式。 |
| size | `SizeT` | `'small'` / `'medium'` / `'large'` | `'medium'` | 按钮尺寸。"small" 小号、"medium" 中号、"large" 大号。默认 medium。 |
| round | `RoundT` | `'pill'` / CSS 值 | — | 按钮圆角。"pill" 半圆角，也可传入任意 CSS border-radius 值（如 "12px"）。 |
| loading | `boolean` | — | `false` | 加载状态，按钮显示旋转加载图标并不可点击。加载时图标插槽会被替换为加载动画。默认关闭。 |
| disabled | `boolean` | — | `false` | 禁用状态，按钮不可点击。默认关闭。 |
| href | `string` | — | — | 设置后按钮渲染为 `<a>` 标签，可用于链接跳转。 |
| icon | `Component` | — | — | 前缀图标组件。也可以通过 icon 插槽传入自定义图标。 |
| tag | `string` | — | `'button'` | 自定义按钮渲染的 HTML 标签。默认 "button"。 |

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| click | `(evt: MouseEvent)` | 点击按钮时（disabled/loading 状态不触发） |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 按钮的文字内容。不传时按钮变为纯图标按钮。 | 无（变为纯图标按钮） |
| icon | — | 有 icon prop 或 icon slot 时 | 替换按钮前缀图标区域。替换后 icon 属性失效。加载状态时此插槽被加载动画覆盖。 | `<component :is="icon" />` |
| suffix | — | 有 suffix slot 时 | 按钮后缀区域，通常放置右侧图标（如下拉箭头）。 | 无 |

---

### 插槽层级关系

```
OButton
├── icon（前缀图标，loading 时被加载动画覆盖）
├── default（按钮文字）
└── suffix（后缀图标）
```

---

### ⚠️ 使用注意事项

- **⚠️ 设计稿"文字按钮"命名陷阱**：设计师在 Pixso/Figma 中标注为"文字按钮"的元素，**通常对应 OLink**（行内纯文字链接），而非 OButton variant="text"。两者关键差异：OButton text 变体仍有 padding、min-width 和 hover 背景色矩形区域；OLink 是行内元素，无矩形容器边界，hover 仅有文字颜色或下划线变化。辨别方法：若设计稿中该元素与正文文字等高、无可见点击边界 → 用 OLink；若有明确的矩形可点击区域但去掉了背景/边框 → 用 OButton text。

---

### 典型使用场景与调用模板

**场景 1：强调按钮 / 主操作按钮**
适用于：页面核心操作（如提交、确认）。实心背景色（primary1），文字为反色。`round="pill"` 按设计图决定，加不加均可。
```vue
<OButton color="primary" variant="solid">确认提交</OButton>
```

**场景 2：普通按钮**
适用于：次要操作（如取消、返回）。无背景色，有边框（primary1）。`round="pill"` 按设计图决定，加不加均可。
```vue
<OButton color="primary">取消</OButton>
```

**场景 3：带图标的按钮**
适用于：需要图标辅助说明
```vue
<OButton variant="outline">
  <template #icon><OIconAdd /></template>
  新建
</OButton>
```

**场景 4：纯图标按钮**
适用于：工具栏操作
```vue
<OButton :icon="OIconEdit" size="small" />
```

**场景 5：带后缀的下拉按钮**
适用于：下拉菜单触发器
```vue
<OButton color="brand" round="pill">
  下拉选项
  <template #suffix>
    <OIconChevronDown />
  </template>
</OButton>
```

**场景 6：加载状态**
适用于：异步操作等待中
```vue
<OButton color="primary" variant="solid" :loading="isLoading" @click="handleSubmit">
  提交
</OButton>
```

**场景 7：链接按钮**
适用于：需要跳转的按钮
```vue
<OButton href="https://openeuler.org" color="primary" variant="solid" round="pill">
  访问官网
</OButton>
```

**场景 8：表格操作列（推荐使用 OLink）**
适用于：数据表格的操作列（编辑、删除等文字操作）。**推荐使用 OLink 组件**而非 OButton，主要操作用 `color="primary"`，危险操作用 `color="danger"`。
```vue
<!-- 推荐：表格操作列使用 OLink -->
<template #cell-operations="{ row }">
  <OLink color="primary" @click="handleEdit(row)">编辑</OLink>
  <OLink color="danger" @click="handleDelete(row)">删除</OLink>
</template>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 主操作 | `color="primary"` + `variant="solid"` | 实心品牌色 |
| 辅助操作 | `color="primary"` + `variant="outline"` | 线框品牌色 |
| 纯文字操作按钮 | `variant="text"` | 有 padding/hover 背景，与 OLink 不同；设计稿中的"文字按钮"标注请优先考虑 OLink |
| 运营活动 | `round="pill"` + class `c-btn-activity` | 社区主题运营按钮 |
| 图标按钮 | `:icon="OIconXxx"` 或 `#icon` | 不传 default 插槽 |
| 危险操作 | `color="danger"` + `variant="solid"` | 红色警告 |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| v1.2.4 | 样式 | 文字按钮 hover 颜色从 primary1 改为 primary2；纯图标按钮新增 hover 状态颜色和边框颜色；移除 brand 模式 disabled 边框 |
| v1.2.3-sp1 | 修复 | 昇腾/鲲鹏主题运营色样式、solid 字体颜色、disabled 选项样式修正 |
| v1.1.0 | 样式 | 文字按钮移除 hover 背景；图标按钮新增 hover 背景 |
