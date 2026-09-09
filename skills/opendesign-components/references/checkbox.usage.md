> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](checkbox.visual.md) · [样式定制](checkbox.style.md)

# OCheckbox 多选框 — 代码使用

### 导入方式

```vue
<script setup>
import { OCheckbox, OCheckboxGroup } from '@opensig/opendesign';
</script>
```

---

### Events 表

#### OCheckbox Events

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:modelValue | `(val: Array<string \| number>)` | 勾选状态变化时 |
| change | `(val: Array<string \| number>, ev: Event)` | 勾选状态变化后（nextTick） |

#### OCheckboxGroup Events

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:modelValue | `(val: Array<string \| number>)` | 勾选状态变化时 |
| change | `(val: Array<string \| number>, ev: Event)` | 勾选状态变化后 |

---

### Slots 表

#### OCheckbox Slots

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| checkbox | `{ checked: boolean, disabled: boolean }` | 始终 | 勾选框 + 标签整体 | 默认勾选框 + 标签 |
| default | — | checkbox 插槽未被替换时 | 标签文字 | 无 |

#### OCheckboxGroup Slots

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 多选框列表 | 无 |

---

### 插槽层级关系

```
checkbox（使用后内部全部失效）
├── 勾选框图标区域
└── default（标签文字）
```

---

### 典型使用场景与调用模板

**场景 1：基础多选框组（无 OCheckboxGroup）**
适用于：多个多选框共享同一 v-model 数组
```vue
<script setup>
import { ref } from 'vue';
const selected = ref(['1']);
</script>
<template>
  <OCheckbox v-model="selected" value="1">选项 1</OCheckbox>
  <OCheckbox v-model="selected" value="2">选项 2</OCheckbox>
  <OCheckbox v-model="selected" value="3">选项 3</OCheckbox>
</template>
```

**场景 2：使用 OCheckboxGroup（带数量限制）**
适用于：需要统一管理 + min/max 约束
```vue
<script setup>
import { ref } from 'vue';
const selected = ref(['1']);
</script>
<template>
  <OCheckboxGroup v-model="selected" :min="1" :max="3" direction="v">
    <OCheckbox value="1">选项 1</OCheckbox>
    <OCheckbox value="2">选项 2</OCheckbox>
    <OCheckbox value="3">选项 3</OCheckbox>
    <OCheckbox value="4">选项 4</OCheckbox>
  </OCheckboxGroup>
</template>
```

**场景 3：全选与半选**
适用于：全选控件 + 子项列表
```vue
<script setup>
import { ref, computed } from 'vue';
const selected = ref([]);
const options = [
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
  { label: '选项3', value: 3 },
];
const allState = computed(() => {
  const count = options.filter(o => selected.value.includes(o.value)).length;
  return {
    all: count === options.length,
    indeterminate: count > 0 && count < options.length,
  };
});
const handleChangeAll = () => {
  selected.value = allState.value.all ? [] : options.map(o => o.value);
};
</script>
<template>
  <OCheckbox
    :model-value="allState.all ? ['all'] : []"
    value="all"
    :indeterminate="allState.indeterminate"
    @change="handleChangeAll"
  >全选</OCheckbox>
  <OCheckbox v-for="o in options" v-model="selected" :key="o.value" :value="o.value">
    {{ o.label }}
  </OCheckbox>
</template>
```

**场景 4：自定义勾选框外观**
适用于：需要完全自定义勾选框的视觉样式
```vue
<OCheckbox v-model="selected" value="custom">
  <template #checkbox="{ checked, disabled }">
    <div :class="['custom-check', { active: checked, disabled }]">
      <span v-if="checked">✓</span>
    </div>
    <span>自定义外观</span>
  </template>
</OCheckbox>
```

---

### ⚠️ 使用注意事项

- **⚠️ 必填星号 → 用 OFormItem 包裹**：设计稿中勾选框旁边的标签有红色星号（必填），应将 OCheckbox/OCheckboxGroup 放入 `<OFormItem required>` 实现，**不要**手写星号。详见 form.md。

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础多选 | `v-model` + `value` | 最常见用法 |
| 多选框组 | OCheckboxGroup + `v-model` | 统一管理 |
| 数量限制 | OCheckboxGroup + `min` / `max` | 控制可选范围 |
| 全选控件 | `indeterminate` + `@change` | 配合计算属性 |
| 垂直排列 | OCheckboxGroup + `direction="v"` | 垂直布局 |

---

### OCheckbox Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| value | `string \| number` | — | 该多选框代表的值。当勾选时，该值会被加入 modelValue 数组；取消勾选时移除。必填。 | 多选框的值（必填） | — |
| modelValue | `Array<string \| number>` | — | 选中值数组（v-model 双向绑定）。 | 选中值数组（v-model） | — |
| defaultChecked | `boolean` | — | `false` | 非受控模式下，初始是否选中。默认不选中。 | — |
| disabled | `boolean` | — | 继承表单容器 | 禁用整个多选框组。默认关闭。未设置时继承表单容器（详见 [OForm 表单级统一管控](form.usage.md)）。 | — |
| indeterminate | `boolean` | — | `false` | 半选状态，显示一条横线而非勾号。通常用于"全选"控件：部分子项选中时显示半选。半选仅影响外观，不影响实际选中值。默认关闭。 | — |
| inputId | `string` | — | 自动生成 | 内部 input 元素的 id | — |

---

### OCheckboxGroup Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| modelValue | `Array<string \| number>` | — | 选中值数组（v-model 双向绑定）。 | 选中值数组（v-model） | — |
| defaultValue | `Array<string \| number>` | — | 非受控模式下的默认选中值数组。默认空数组。 | 非受控时默认值 | — |
| disabled | `boolean` | — | 继承表单容器 | 禁用整个多选框组。默认关闭。未设置时继承表单容器（详见 [OForm 表单级统一管控](form.usage.md)）。 | — |
| direction | `DirectionT` | `'h'` / `'v'` | `'h'` | 多选框排列方向。"h" 水平排列、"v" 垂直排列。默认水平。 | — |
| min | `number` | — | — | 最少必须勾选的数量。达到下限时，已选中项不可取消。 | — |
| max | `number` | — | — | 最多可勾选的数量。达到上限时，未选中项不可勾选。 | — |

---

### 暴露属性

| 属性名 | 类型 | 说明 |
|--------|------|------|
| checked | `ComputedRef<boolean>` | 当前是否选中 |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| 1.2.7 | 更新 | OCheckboxGroup `disabled` 接入表单继承系统（详见 [OForm 表单级统一管控](form.usage.md)） |
