> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](radio.visual.md) · [样式定制](radio.style.md)

# ORadio 单选框 — 代码使用

### 导入方式

```vue
<script setup>
import { ORadio, ORadioGroup } from '@opensig/opendesign';
</script>
```

---

### Slots 表

#### ORadio Slots

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| radio | `{ checked: boolean, disabled: boolean }` | 始终 | 整个单选框（圆点+文字） | 默认圆点 + label |
| default | — | 未使用 radio 插槽时 | 文字标签 | 无 |

#### ORadioGroup Slots

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 单选框列表 | 无 |

---

### 典型使用场景与调用模板

**场景 1：独立单选框**
适用于：两个选项的简单选择
```vue
<script setup>
import { ref } from 'vue';
const value = ref(1);
</script>
<template>
  <ORadio v-model="value" :value="1">选项1</ORadio>
  <ORadio v-model="value" :value="2">选项2</ORadio>
</template>
```

**场景 2：单选框组**
适用于：多选项单选
```vue
<script setup>
import { ref } from 'vue';
const value = ref('a');
</script>
<template>
  <ORadioGroup v-model="value">
    <ORadio value="a">选项 A</ORadio>
    <ORadio value="b">选项 B</ORadio>
    <ORadio value="c">选项 C</ORadio>
  </ORadioGroup>
</template>
```

**场景 3：垂直排列**
适用于：表单中的垂直选项列表
```vue
<ORadioGroup v-model="value" direction="v">
  <ORadio value="a">选项 A</ORadio>
  <ORadio value="b">选项 B</ORadio>
</ORadioGroup>
```

**场景 4：禁用状态**
适用于：不可操作的选项
```vue
<ORadio v-model="value" :value="1" disabled>已禁用</ORadio>
```

**场景 5：自定义渲染**
适用于：卡片式选择、图标式选择等
```vue
<ORadio v-model="value" :value="1">
  <template #radio="{ checked }">
    <div :class="['custom-radio', { active: checked }]">
      自定义选项 {{ checked ? '✓' : '' }}
    </div>
  </template>
</ORadio>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础单选 | ORadioGroup + `v-model` | 最常见用法 |
| 垂直排列 | `direction="v"` | 纵向列表 |
| 整组禁用 | ORadioGroup `disabled` | 一键禁用 |
| 自定义外观 | `#radio` 插槽 | 完全自定义 |
| 表单校验 | ORadioGroup 放在 OFormItem 内 | 自动校验 |

---

### ORadio Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| value | `string \| number \| boolean` | 该单选框代表的值。必填。点击时此值被设为 modelValue。 | — | 单选框值（必填） | — |
| modelValue | `string \| number \| boolean` | 选中的值（v-model 双向绑定）。 | — | 绑定值（v-model） | — |
| defaultChecked | `boolean` | — | `false` | 非受控模式下是否默认选中。默认关闭。 | — |
| disabled | `boolean` | — | 继承表单容器 | 整组禁用。默认关闭。未设置时继承表单容器（详见 [OForm 表单级统一管控](form.usage.md)）。 | — |
| inputId | `string` | — | 自动生成 | input 元素 id | — |

---

### ORadioGroup Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| modelValue | `string \| number \| boolean` | 选中的值（v-model 双向绑定）。 | — | 绑定值（v-model） | — |
| defaultValue | `string \| number \| boolean` | 非受控模式下的默认值。 | `''` | 默认值 | — |
| disabled | `boolean` | — | 继承表单容器 | 整组禁用。默认关闭。未设置时继承表单容器（详见 [OForm 表单级统一管控](form.usage.md)）。 | — |
| direction | `DirectionT` | `'h'` / `'v'` | `'h'` | 排列方向。"h" 水平排列、"v" 垂直排列。默认水平。 | — |

---

### ORadio Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:modelValue | `(val: string \| number \| boolean)` | 选中时 |
| change | `(val: string \| 选中值变化时触发。可获取新选中的值和原始事件。 | boolean, ev: Event)` | 选中变化时 |

---

### ORadioGroup Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:modelValue | `(val: string \| number \| boolean)` | 选中值变化 |
| change | `(val: string \| 选中值变化时触发。可获取新选中的值和原始事件。 | boolean, ev: Event)` | 选中值变化 |

---

### 暴露属性

| 属性名 | 类型 | 说明 |
|--------|------|------|
| checked | `ComputedRef<boolean>` | 当前是否选中 |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| 1.2.7 | 更新 | ORadioGroup `disabled` 接入表单继承系统（详见 [OForm 表单级统一管控](form.usage.md)） |
