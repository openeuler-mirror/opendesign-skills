> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](dropdown.visual.md) · [样式定制](dropdown.style.md)

# ODropdown 下拉菜单 — 代码使用

### 导入方式

```vue
<script setup>
import { ODropdown, ODropdownItem } from '@opensig/opendesign';
</script>
```

---

### Events 表

#### ODropdown Events

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:visible | `(val: boolean)` | 可见状态变化时 |
| visible-change | `(val: boolean)` | 可见状态变化时 |

---

### Slots 表

#### ODropdown Slots

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 触发元素 | 无 |
| dropdown | — | 菜单可见时 | 下拉选项列表 | 无 |

#### ODropdownItem Slots

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 选项内容 | `{{ label \|\| value }}` |

---

### 插槽层级关系

```
ODropdown
├── default（触发元素，如按钮）
└── dropdown（下拉选项列表）
    └── ODropdownItem × N
        └── default（选项自定义内容）
```

---

### 典型使用场景与调用模板

**场景 1：强调下拉按钮 / 主操作**
适用于：核心操作的下拉菜单。触发按钮为实心背景色（primary1）。`round="pill"` 按设计图决定，加不加均可。
```vue
<script setup>
import { ref } from 'vue';
const visible = ref(false);
</script>
<template>
  <ODropdown v-model:visible="visible" trigger="click-outclick">
    <OButton color="primary" variant="solid">
      操作
      <template #suffix>
        <OIconChevronDown :class="{ active: visible }" />
      </template>
    </OButton>
    <template #dropdown>
      <ODropdownItem label="编辑" value="edit" />
      <ODropdownItem label="复制" value="copy" />
      <ODropdownItem label="删除" value="delete" />
    </template>
  </ODropdown>
</template>
```

**场景 2：普通下拉按钮**
适用于：次要操作的下拉菜单。触发按钮为无背景色、有边框（primary1）。`round="pill"` 按设计图决定，加不加均可。
```vue
<ODropdown trigger="click-outclick">
  <OButton color="primary">
    操作
    <template #suffix><OIconChevronDown /></template>
  </OButton>
  <template #dropdown>
    <ODropdownItem label="选项一" value="opt1" />
    <ODropdownItem label="选项二" value="opt2" />
  </template>
</ODropdown>
```

**场景 3：禁用下拉**
适用于：按钮禁用时阻止下拉
```vue
<ODropdown trigger="none">
  <OButton disabled>禁用按钮</OButton>
  <template #dropdown>
    <ODropdownItem label="选项" value="opt" />
  </template>
</ODropdown>
```

**场景 4：文本下拉按钮**
适用于：轻量级下拉操作
```vue
<ODropdown trigger="click-outclick" class="o-dropdown-link-wrap">
  <OButton variant="text" color="primary">
    文本下拉
    <template #suffix><OIconChevronDown /></template>
  </OButton>
  <template #dropdown>
    <ODropdownItem label="选项一" value="opt1" />
    <ODropdownItem label="选项二" value="opt2" />
  </template>
</ODropdown>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础下拉 | `trigger="click-outclick"` | 点击打开、外部点击关闭 |
| 悬停下拉 | `trigger="hover"` | 鼠标悬停时显示 |
| 禁用下拉 | `trigger="none"` + 按钮 disabled | 阻止触发 |
| 自定义宽度 | `option-width-mode="width"` | 面板宽度与触发元素一致 |
| 运营主题按钮 | `color="brand"` + `variant="solid"` | 品牌色实心样式 |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| v1.2.4 | 修复 | 移除 brand 模式 disabled 状态下的边框（与 Button 共享修复） |
| v1.2.3-sp1 | 修复 | 昇腾/鲲鹏主题运营色样式、solid 字体颜色、disabled 选项样式修正 |

---

### ODropdown Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| visible | `boolean` | — | — | 下拉菜单是否可见（v-model 双向绑定）。 |
| defaultVisible | `boolean` | — | `false` | 非受控模式下是否默认可见。默认关闭。 |
| size | `SizeT` | `'small'` / `'medium'` / `'large'` | `'large'` | 下拉列表的尺寸。"small"、"medium"、"large"。不同尺寸影响选项文字大小和内边距。默认 large。 |
| round | `RoundT` | `'pill'` / CSS 值 | — | 圆角 |
| trigger | `PopupTriggerT` | `'click'` / `'click-outclick'` / `'hover'` / `'hover-outclick'` / `'focus'` / `'contextmenu'` / `'none'` | `'click'` | 触发下拉菜单的方式。"click" 点击触发、"click-outclick" 点击触发+外部点击关闭、"hover" 悬停触发、"hover-outclick" 悬停触发+外部点击关闭、"focus" 聚焦触发、"contextmenu" 右键触发、"none" 不触发（需手动控制）。默认 click。 |
| optionPosition | `PopupPositionT` | `'bl'` / `'br'` / `'tl'` / `'tr'` / `'top'` / `'bottom'` 等 | `'bl'` | 下拉面板弹出位置。支持 top/bottom/left/right 及组合值如 bl（底部左对齐）、tr（顶部右对齐）等。默认 bl。 |
| optionWidthMode | `string` | `'auto'` / `'min-width'` / `'width'` | `'min-width'` | 下拉面板宽度规则。"auto" 自适应内容宽度、"min-width" 最小宽度与触发元素一致、"width" 宽度与触发元素一致。默认 min-width。 |
| optionWrapClass | `string \| object \| array` | 下拉面板容器自定义类名。 | — | 面板容器类名 |
| optionsWrapper | `string \| HTMLElement \| null` | 下拉面板挂载容器。默认 body。 | `'body'` | 面板挂载容器 |
| unmountOnHide | `boolean` | — | `true` | 面板隐藏时是否销毁 DOM。默认开启。 |
| transition | `string` | — | — | 过渡动画名 |

---

### ODropdownItem Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| label | `string` | — | `''` | 选项显示文本 |
| value | `string \| number` | — | `''` | 选项值 |
| disabled | `boolean` | — | `false` | 禁用选项，不可点击且样式变灰。默认关闭。 |
