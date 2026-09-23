> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](cascader.visual.md) · [样式定制](cascader.style.md)

# OCascader 级联选择 — 代码使用

### 导入方式

```vue
<script setup>
import { OCascader, OCascaderPanel } from '@opensig/opendesign';
</script>
```

---

### 类型定义

```typescript
type CascaderNodeValueT = string | number;
type CascaderNodePathT = Array<CascaderNodeValueT>;
type CascaderValueT = CascaderNodeValueT | CascaderNodePathT;

type CascaderOptionT = {
  value: CascaderNodeValueT;
  label?: string;
  children?: CascaderOptionT[];
};
```

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:modelValue | `(val: CascaderValueT)` | 选中值变化时 |
| change | `(val: CascaderValueT)` | 选中值变化时触发，可获取新选中的值（路径模式为数组，否则为叶子值）。 |

---

### Slots 表

本组件无自定义插槽。

---

### 典型使用场景与调用模板

**场景 1：基础级联选择**
适用于：分类选择（如省市区）
```vue
<script setup>
import { ref } from 'vue';
const selected = ref('');
const options = [
  { label: '选项1', value: '1', children: [
    { label: '子项1-1', value: '1-1', children: [
      { label: '子项1-1-1', value: '1-1-1' },
    ]},
  ]},
  { label: '选项2', value: '2', children: [
    { label: '子项2-1', value: '2-1' },
  ]},
];
</script>
<template>
  <OCascader v-model="selected" :options="options" />
</template>
```

**场景 2：路径模式**
适用于：需要获取完整选择路径
```vue
<OCascader v-model="pathValue" :options="options" path-mode />
<!-- pathValue: ['1', '1-1', '1-1-1'] -->
```

**场景 3：悬停展开子菜单**
适用于：快速浏览选项
```vue
<OCascader v-model="selected" :options="options" expand-trigger="hover" />
```

**场景 4：自定义面板（高级用法）**
适用于：需要在选项面板中加入推荐标签等自定义内容
```vue
<OSelect v-model="selected">
  <div class="custom-wrapper">
    <div>推荐选项：</div>
    <div><OTag @click="selected = '1-1-1'">推荐1</OTag></div>
    <ODivider />
    <OCascaderPanel v-model="selected" :key="selected" :options="options" />
  </div>
</OSelect>
```

---

### ⚠️ 使用注意事项

- > ⚠️ **v1.2.4 新增 OCascaderV2（PC端重构版），旧版 OCascader 仍可用但建议迁移至 v2。**
- **⚠️ 错误状态 / 必填星号 → 用 OFormItem 包裹**：设计稿中级联选择器边框变红（错误态）或标签旁有红色星号（必填），应将 OCascader 放入 `<OFormItem>` 实现，**不要**手写星号。详见 form.md。

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础选择 | `v-model` + `:options` | 最常见用法 |
| 路径模式 | `path-mode` | modelValue 为路径数组 |
| 快速浏览 | `expand-trigger="hover"` | 悬停展开子菜单 |
| 触控友好 | 默认即可 | hover 自动降级为 click |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| v1.2.4 | 新增 | 新增 OCascaderV2（PC端重构版），含 OCascaderV2Panel 和 OCascaderV2Label，旧版 OCascader 仍可用 |
| v1.0.2 | 新增 | 新增 `expandTrigger` prop，支持 hover 触发子菜单展开；修复触发和数据回显 bug；修复 CSS 变量拼写错误 |

---

### OCascader Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| modelValue | `CascaderValueT` | — | `''` | 选中值（v-model 双向绑定）。默认模式下为叶子节点的 value 值（字符串或数字）；路径模式下为从根到叶子的路径数组。 |
| options | `CascaderOptionT[]` | — | — | 选项数据，树形结构数组。每项包含 value（值）、label（显示文本）、children（子项数组，可选）。 |
| pathMode | `boolean` | — | `false` | 是否使用路径模式。开启后 modelValue 为完整路径数组（如 `['1', '1-1', '1-1-1']`），否则仅为叶子节点的 value 值。默认关闭。 |
| round | `RoundT` | `'pill'` / CSS 值 | — | 圆角值。"pill" 半圆或 CSS 值。 |
| variant | `VariantT` | `'solid'` / `'outline'` / `'text'` | `'outline'` | 选择器按钮样式。"solid" 实心、"outline" 线框、"text" 纯文字。默认 outline。 |
| size | `SizeT` | `'small'` / `'medium'` / `'large'` | `'large'` | 选择器尺寸。"small"、"medium"、"large"。默认 large。 |
| placeholder | `string` | — | — | 占位文本 |
| trigger | `PopupTriggerT` | `'click'` / `'hover'` 等 | `'click'` | 弹出级联菜单的触发方式。默认 "click"。触控设备上 hover 自动降级为 click。 |
| expandTrigger | `string` | `'click'` / `'hover'` | `'click'` | 展开子菜单选项的触发方式。"click" 点击展开、"hover" 悬停展开。默认 click。触控设备上统一为 click。 | v1.0.2 |
| optionPosition | `PopupPositionT` | `'bl'` / `'br'` / `'tl'` / `'tr'` 等 | `'bl'` | 选项面板弹出位置。支持 top/bottom/left/right 及组合值如 bl（底部左对齐）、tr（顶部右对齐）等。默认 bl。 |
| optionWrapClass | `string \| object \| array` | 选项面板容器自定义类名。 | — | 选项容器类名 |
| unmountOnHide | `boolean` | — | `true` | 面板隐藏时是否销毁 DOM。默认开启。 |
| transition | `string` | — | — | 过渡动画名 |

---

### OCascaderPanel Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| modelValue | `CascaderValueT` | — | `''` | 选中值（v-model 双向绑定）。默认模式下为叶子节点的 value 值（字符串或数字）；路径模式下为从根到叶子的路径数组。 |
| options | `CascaderOptionT[]` | — | — | 选项数据，树形结构数组。每项包含 value（值）、label（显示文本）、children（子项数组，可选）。 |
| pathMode | `boolean` | — | `false` | 是否使用路径模式。开启后 modelValue 为完整路径数组（如 `['1', '1-1', '1-1-1']`），否则仅为叶子节点的 value 值。默认关闭。 |
| expandTrigger | `string` | `'click'` / `'hover'` | `'click'` | 展开子菜单选项的触发方式。"click" 点击展开、"hover" 悬停展开。默认 click。触控设备上统一为 click。 | v1.0.2 |
