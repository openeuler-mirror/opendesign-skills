> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](switch.visual.md) · [样式定制](switch.style.md)

# OSwitch 开关 — 代码使用

### 导入方式

```vue
<script setup>
import { OSwitch } from '@opensig/opendesign';
</script>
```

---

### 类型定义

```typescript
type SwitchSizeT = 'medium' | 'small';
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| modelValue | `string \| number \| boolean` | 开关的值（v-model 双向绑定）。等于 checkedValue 时为开启状态，等于 uncheckedValue 时为关闭状态。 | `undefined` | 绑定值（v-model） | — |
| defaultChecked | `boolean` | — | `false` | 非受控模式下是否默认开启。默认关闭。 | — |
| checkedValue | `string \| number \| boolean` | 开启状态对应的值。默认 true。 | `true` | 开启状态值 | — |
| uncheckedValue | `string \| number \| boolean` | 关闭状态对应的值。默认 false。 | `false` | 关闭状态值 | — |
| size | `SwitchSizeT` | `'medium'` / `'small'` | `'medium'` | 开关尺寸。"medium" 中号、"small" 小号。默认 medium。 | — |
| round | `RoundT` | `'pill'` / CSS 值 | — | 圆角值。"pill" 半圆或 CSS 值。 | — |
| disabled | `boolean` | — | `false` | 是否禁用。禁用后点击无效。默认关闭。 | — |
| loading | `boolean` | — | `false` | 是否加载中。加载时滑块显示旋转图标，同时自动禁用点击。默认关闭。 | — |
| beforeChange | `(val: boolean) => Promise<boolean> \| boolean` | — | 状态改变前的钩子函数。返回 true 或 Promise\<true\> 允许切换，返回 false 或 Promise\<false\> 阻止切换。适合异步确认场景。 | 切换前拦截 | — |

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:modelValue | `(val: string \| number \| boolean)` | 状态变化时 |
| change | `(val: string \| 状态切换后触发。可获取新的值和原始事件。 | boolean, ev: Event)` | 状态切换后 |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| active | — | 开启状态且未 loading 时 | 开启状态时滑块内的图标。loading 时被加载图标替换。 | 无 |
| inactive | — | 关闭状态且未 loading 时 | 关闭状态时滑块内的图标。loading 时被加载图标替换。 | 无 |
| on | — | 开启状态时 | 开启状态时开关右侧的文字/图标标签。 | 无 |
| off | — | 关闭状态时 | 关闭状态时开关右侧的文字/图标标签。 | 无 |

---

### 典型使用场景与调用模板

**场景 1：基础开关**
适用于：功能启用/禁用
```vue
<script setup>
import { ref } from 'vue';
const enabled = ref(false);
</script>
<template>
  <OSwitch v-model="enabled" />
</template>
```

**场景 2：自定义值**
适用于：非布尔值切换
```vue
<OSwitch v-model="fruit" checked-value="apple" unchecked-value="banana" />
```

**场景 3：带状态文字**
适用于：明确标识当前状态
```vue
<OSwitch v-model="enabled">
  <template #on>ON</template>
  <template #off>OFF</template>
</OSwitch>
```

**场景 4：带图标的主题切换**
适用于：深色/浅色模式切换
```vue
<OSwitch v-model="isDark" default-checked>
  <template #active><OIconSun /></template>
  <template #inactive><OIconMoon /></template>
  <template #on><OIconMoon /></template>
  <template #off><OIconSun /></template>
</OSwitch>
```

**场景 5：异步切换确认**
适用于：需要后端验证的切换
```vue
<script setup>
import { ref } from 'vue';
const loading = ref(false);
const beforeChange = (val) => {
  return new Promise((resolve) => {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
      resolve(true);
    }, 1000);
  });
};
</script>
<template>
  <OSwitch :before-change="beforeChange" :loading="loading" />
</template>
```

---

### ⚠️ 使用注意事项

- **⚠️ 必填星号 → 用 OFormItem 包裹**：设计稿中开关控件标签旁有红色星号（必填），应将 OSwitch 放入 `<OFormItem required>` 实现，**不要**手写星号。详见 form.md。

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础开关 | `v-model` | 最常见 |
| 自定义值 | `checked-value` + `unchecked-value` | 非布尔值 |
| 带文字 | `#on` + `#off` 插槽 | 状态标签 |
| 异步切换 | `:before-change` + `:loading` | 后端验证 |
| 圆角 | `round="pill"` | 半圆按钮 |
| 小号 | `size="small"` | 紧凑场景 |
