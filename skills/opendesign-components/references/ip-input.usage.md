> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](ip-input.visual.md) · [样式定制](ip-input.style.md)

# OIpInput IP地址输入框 — 代码使用

### 导入方式

```vue
<script setup>
import { OIpInput } from '@opensig/opendesign';
</script>
```

---

### Props 表

| 参数名 | 类型 | 必填 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|------|--------|--------|------|--------|
| modelValue | `string` | 否 | — | — | IP 地址字符串（v-model 双向绑定），格式如 "192.168.1.1"。当所有分段均为合法 0-255 数字时，输出完整 IP 字符串；否则输出空字符串。 | — |
| disabled | `boolean` | 否 | — | `false` | 禁用整个 IP 输入框。禁用后不响应键盘事件。默认关闭。 | — |
| segmentsLen | `number` | 否 | — | `4` | IP 地址的分段数量。默认 4（标准 IPv4）。可自定义为其他值以适应特殊需求。 | — |
| size | `SizeT` | 否 | `'small'` / `'medium'` / `'large'` | — | 组件尺寸。"small"、"medium"、"large"。不同尺寸有不同的内边距和高度。 | — |
| round | `RoundT` | 否 | `'pill'` / CSS 值 | — | 圆角值。"pill" 半圆或 CSS 值。 | — |
| color | `Color2T` | 否 | `'normal'` / `'success'` / `'warning'` / `'danger'` | `'normal'` | 外框颜色状态。"normal" 默认、"success" 成功、"warning" 警告、"danger" 错误。在 OFormItem 内会自动跟随校验状态变色。默认 normal。 | — |
| readonly | `boolean` | 否 | — | `false` | 只读模式。默认关闭。 | — |
| variant | `VariantT` | 否 | `'solid'` / `'outline'` / `'text'` | `'outline'` | 外框样式。"solid" 实心、"outline" 线框、"text" 无边框。默认 outline。外框样式同时应用于整体容器和每个分段输入框。 | — |

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:modelValue | `(value: string)` | IP 值变化时（v-model 同步） |
| change | `(valid: boolean, ip: string)` | IP 值变化时触发，携带校验结果（是否合法）和当前 IP 字符串。 |

---

### Slots 表

无自定义插槽。组件内部使用 InBox 的默认插槽渲染分段输入框和分隔符，不对外暴露插槽。

---

### 典型使用场景与调用模板

**场景 1：基础 IPv4 地址输入**
适用于：网络配置中输入 IP 地址
```vue
<script setup>
import { ref } from 'vue';
import { OIpInput } from '@opensig/opendesign';

const ip = ref('192.168.1.1');
</script>
<template>
  <OIpInput v-model="ip" />
</template>
```

**场景 2：监听校验结果**
适用于：需要知道 IP 是否合法
```vue
<script setup>
import { ref } from 'vue';
import { OIpInput } from '@opensig/opendesign';

const ip = ref('');
const isValid = ref(false);

function onIpChange(valid: boolean, value: string) {
  isValid.value = valid;
}
</script>
<template>
  <OIpInput v-model="ip" @change="onIpChange" />
  <p v-if="!isValid">请输入合法的 IP 地址</p>
</template>
```

**场景 3：禁用状态**
适用于：展示但不允许编辑的场景
```vue
<OIpInput v-model="ip" disabled />
```

**场景 4：在表单中使用**
适用于：表单校验场景
```vue
<script setup>
import { ref } from 'vue';
import { OIpInput, OForm, OFormItem } from '@opensig/opendesign';

const ip = ref('');
</script>
<template>
  <OForm :model="{ ip }">
    <OFormItem label="IP 地址" prop="ip">
      <OIpInput v-model="ip" />
    </OFormItem>
  </OForm>
</template>
```

**场景 5：不同尺寸和样式**
适用于：视觉适配
```vue
<OIpInput v-model="ip" size="small" variant="solid" round="pill" />
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础 IP 输入 | `v-model` | 最常见用法，默认 4 段 |
| 禁用展示 | `v-model` + `disabled` | 只读展示 IP |
| 表单校验 | `v-model` + `@change` | 监听 valid 判断合法性 |
| 错误状态 | `color="danger"` | 红色边框提示错误 |
| 小尺寸 | `size="small"` | 紧凑布局 |
| 实心样式 | `variant="solid"` | 实心背景风格 |

---

### Expose 方法表

无。组件未使用 defineExpose 暴露方法。
