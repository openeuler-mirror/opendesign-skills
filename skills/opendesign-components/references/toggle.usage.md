> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](toggle.visual.md) · [样式定制](toggle.style.md)

# OToggle 选择块 — 代码使用

### 导入方式

```vue
<script setup>
import { OToggle } from '@opensig/opendesign';
</script>
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| checked | `boolean` | — | `undefined` | 是否选中（v-model:checked 双向绑定）。受控模式下由外部控制选中状态。 | — |
| defaultChecked | `boolean` | — | `false` | 非受控模式下是否默认选中。默认不选中。 | — |
| round | `RoundT` | `'pill'` / CSS 值 | — | 圆角值。"pill" 半圆或 CSS 值。 | — |
| icon | `Component` | — | — | 前缀图标组件。也可通过 icon 插槽自定义。 | — |
| disabled | `boolean` | — | `false` | 是否禁用。禁用后点击无效。默认关闭。 | — |

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:checked | `(val: boolean)` | 选中状态变化时 |
| change | `(val: boolean, ev: MouseEvent)` | 独立使用时，选中状态变化后触发。可获取新的选中值和原始事件。 |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| icon | — | 有 icon prop 或 icon 插槽时 | 前缀图标区域。使用后 icon 属性失效。 | `<component :is="icon" />` |
| default | — | 始终 | 按钮文字 | 无 |

---

### 典型使用场景与调用模板

**场景 1：独立使用**
适用于：单个选项切换
```vue
<script setup>
import { ref } from 'vue';
const selected = ref(false);
</script>
<template>
  <OToggle v-model:checked="selected">选项 A</OToggle>
</template>
```

**场景 2：带图标**
适用于：图标+文字的选择按钮
```vue
<OToggle v-model:checked="selected" :icon="OIconStar">收藏</OToggle>
```

**场景 3：作为 Checkbox 自定义渲染**
适用于：多选的按钮式选择
```vue
<OCheckboxGroup v-model="selectedFruits">
  <OCheckbox value="apple"><OToggle>苹果</OToggle></OCheckbox>
  <OCheckbox value="banana"><OToggle>香蕉</OToggle></OCheckbox>
  <OCheckbox value="orange"><OToggle>橘子</OToggle></OCheckbox>
</OCheckboxGroup>
```

**场景 4：作为 Radio 自定义渲染（单选按钮组）**
适用于：单选的按钮式选择，设计稿中无 radio 圆圈指示器，只有 Toggle 样式按钮
> ⚠️ 必须使用 ORadio 的 `#radio` 插槽（完全替换整个选中指示器+文字区域）。
> 若放在 default slot 中，ORadio 的圆形指示器仍会渲染，需额外 CSS 隐藏。
```vue
<ORadioGroup v-model="selected">
  <ORadio value="monthly">
    <template #radio="{ checked }">
      <OToggle :checked="checked">月付</OToggle>
    </template>
  </ORadio>
  <ORadio value="yearly">
    <template #radio="{ checked }">
      <OToggle :checked="checked">年付</OToggle>
    </template>
  </ORadio>
</ORadioGroup>
```

**场景 5：圆角胶囊**
适用于：紧凑标签式选择
```vue
<OToggle v-model:checked="selected" round="pill">标签</OToggle>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础切换 | `v-model:checked` | 独立使用 |
| 带图标 | `:icon` 或 `#icon` 插槽 | 图标+文字 |
| 胶囊 | `round="pill"` | 圆角按钮 |
| 多选组 | 作为 OCheckbox 子组件 | 自身 change 屏蔽 |
| 单选组 | 作为 ORadio `#radio` 插槽 | 自身 change 屏蔽，radio 圆圈被替换 |
