> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](select.visual.md) · [样式定制](select.style.md)

# OSelect 选择器 — 代码使用

### 导入方式

```vue
<script setup>
import { OSelect, OOption, OOptionGroup } from '@opensig/opendesign';
</script>
```

---

### 类型定义

```typescript
type OptionWidthModeT = 'auto' | 'min-width' | 'width';
type SelectValueT = string | number | string[] | number[] | (string | number)[];
```

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:modelValue | `(value: SelectValueT)` | 选中值变化时 |
| change | `(value: SelectValueT)` | 选中值变化时 |
| options-visible-change | `(value: boolean)` | 选项面板显隐变化时触发。 |
| clear | `(evt: Event)` | 点击清空 |

---

### 典型使用场景与调用模板

**场景 1：基础单选**
适用于：从选项列表选择一项
```vue
<script setup>
import { ref } from 'vue';
const value = ref('');
</script>
<template>
  <OSelect v-model="value" placeholder="请选择">
    <OOption label="选项一" value="1" />
    <OOption label="选项二" value="2" />
    <OOption label="选项三" value="3" />
  </OSelect>
</template>
```

**场景 2：多选**
适用于：选择多个标签
```vue
<OSelect v-model="values" multiple clearable :max-tag-count="3">
  <OOption label="标签一" value="1" />
  <OOption label="标签二" value="2" />
  <OOption label="标签三" value="3" />
  <OOption label="标签四" value="4" />
</OSelect>
```

**场景 3：可清空 + 禁用选项**
适用于：部分选项不可选
```vue
<OSelect v-model="value" clearable>
  <OOption label="可选" value="1" />
  <OOption label="禁用" value="2" disabled />
</OSelect>
```

**场景 4：文字变体**
适用于：紧凑的行内选择
```vue
<OSelect v-model="value" variant="text">
  <OOption label="中文" value="zh" />
  <OOption label="English" value="en" />
</OSelect>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础单选 | `v-model` + `placeholder` | 最常见 |
| 多选 | `multiple` + `clearable` | 标签模式 |
| 限制标签数 | `multiple` + `:max-tag-count` | 折叠多余 |
| 纯文字 | `variant="text"` | 无边框 |
| 禁用响应式 | `no-responsive` | 移动端也用 Popup |

---

### OSelect Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| modelValue | `SelectValueT` | — | — | 选中值（v-model 双向绑定）。单选时为 string 或 number；多选时为数组。 | — |
| defaultValue | `SelectValueT` | — | — | 非受控模式下的默认值。 | — |
| size | `SizeT` | `'small'` / `'medium'` / `'large'` | — | 选择器尺寸。"small"、"medium"、"large"。 | — |
| round | `RoundT` | `'pill'` / CSS 值 | — | 圆角值。"pill" 半圆或 CSS 值。 | — |
| color | `Color2T` | `'normal'` / `'success'` / `'warning'` / `'danger'` | `'normal'` | 选择器颜色。"normal" 默认、"success" 成功、"warning" 警告、"danger" 错误。默认 normal。 | — |
| variant | `VariantT` | `'solid'` / `'outline'` / `'text'` | `'outline'` | 选择器样式。"solid" 实心、"outline" 线框、"text" 纯文字。默认 outline。 | — |
| placeholder | `string` | — | — | 占位文本 | — |
| multiple | `boolean` | — | `false` | 是否支持多选。开启后选中值为数组，选项以标签形式展示。 | — |
| maxTagCount | `number` | — | — | 多选模式下标签最大显示数量。超出的折叠显示。 | — |
| clearable | `boolean` | — | `false` | 可清空 | — |
| disabled | `boolean` | — | `false` | 是否禁用该选项。 | — |
| loading | `boolean` | — | `false` | 加载中 | — |
| trigger | `PopupTriggerT` | — | `'click'` | 选项面板触发方式。默认 click。 | — |
| optionPosition | `PopupPositionT` | — | `'bl'` | 选项面板弹出位置。默认 bl（底部左对齐）。 | — |
| optionWidthMode | `OptionWidthModeT` | `'auto'` / `'min-width'` / `'width'` | `'min-width'` | 选项面板宽度模式。"auto" 自动、"min-width" 最小宽度与选择器一致、"width" 宽度与选择器一致。默认 min-width。 | — |
| optionWrapClass | `string \| object \| array` | 选项面板自定义类名。 | — | 面板类名 | — |
| unmountOnHide | `boolean` | — | `true` | 面板隐藏时是否销毁 DOM。默认开启。 | — |
| scrollbar | `Partial<BaseScrollerPropsT>` | — | — | 滚动条配置（原名 scroller，v0.0.69 改名） | @since 0.0.69（改名） |
| optionsWrapper | `string \| HTMLElement` | — | 选项面板挂载容器。默认 body。 | 面板挂载容器 | — |
| foldLabel | `(tags: SelectOptionT[]) => string` | — | — | 多选超过最大标签数时的自定义文字函数。 | — |
| showFoldTags | `boolean \| 'hover' \| 'click'` | 是否在悬停时显示折叠的标签。"hover" 悬停显示、"click" 点击显示、true/false。默认 hover。 | `'hover'` | 折叠标签显示 | — |
| optionTitle | `string` | — | — | 移动端面板标题 | — |
| noResponsive | `boolean` | — | `false` | 是否禁用响应式（移动端 Dialog 模式）。 | — |
| beforeSelect | `Function` | — | — | 选择前回调。返回 false 阻止选择。 | — |
| beforeOptionsShow | `Function` | — | — | 显示前回调 | — |
| beforeOptionsHide | `Function` | — | — | 隐藏前回调 | — |
| transition | `string` | — | — | 选项面板的过渡动画名称。 | — |

---

### OOption Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| label | `string` | — | `''` | 显示文本 |
| value | `string \| number` | — | `''` | 选项值 |
| disabled | `boolean` | — | `false` | 是否禁用该选项。 |
| indeterminate | `boolean` | — | `false` | 多选模式下是否为半选状态（复选框样式）。 |

---

### OOptionGroup Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| name | `string` | — | — | 分组名称（必填） |

---

### OOptionGroup Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| name | — | 始终 | 替换分组标题。默认显示 name 属性的文本。 | 显示 name 属性文本 |
| default | — | 始终 | 放置分组内的 OOption 组件。 | 无 |

---

### OSelect Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 放置分组内的 OOption 组件。 | 空数据提示 |
| arrow | `{ active: boolean }` | 始终 | 替换下拉箭头图标。可获取 active（面板是否展开）。 | `<IconChevronDown />` |
| suffix | `{ active: boolean }` | 始终 | 选择框后缀区域，位于箭头右侧。可获取 active（面板是否展开）。 | 无 |
| tag-fold | — | 多选且有折叠标签时 | 多选模式下折叠标签的显示内容。默认显示 "+N..." 文本。 | `+N...` 文本 |
| empty | — | 无选项时 | 无选项时的空数据提示内容。 | 国际化空文本 |
| action | — | 始终 | 选项面板底部操作区域 | 无 |

---

### ⚠️ 使用注意事项

- **⚠️ 错误状态 / 必填星号 → 用 OFormItem 包裹**：设计稿中选择框边框变红（错误态）或标签旁有红色星号（必填），应将 OSelect 放入 `<OFormItem>` 实现，**不要**直接设 `color="danger"` 或手写星号。详见 form.md。

---

### 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.6 | 背景色 CSS 变量从 control5-light/control4-light 改为 fill2；关闭按钮（clear icon）尺寸跟随 `--select-icon-size`；内部改用 defineSlots 替代 useSlots；响应式判定从 isPhonePad 改为 isPhonePadSize |
| v0.0.69 | scrollbar 参数从 `scroller` 改名为 `scrollbar` |
| v0.0.64 | 修复多选 v-model 绑定问题 |
| v0.0.63 | 新增下拉分组（OOptionGroup） |
