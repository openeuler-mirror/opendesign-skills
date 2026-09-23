> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](rate.visual.md) · [样式定制](rate.style.md)

# ORate 评分 — 代码使用

### 导入方式

```vue
<script setup>
import { ORate } from '@opensig/opendesign';
</script>
```

---

### 类型定义

```typescript
type RateSizeT = 'large' | 'medium';
type RateItemStatusT = 'full' | 'half' | 'empty';
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| count | `number` | — | `5` | 评分总数（星星个数）。默认 5。 | — |
| modelValue | `number` | — | — | 选中的评分值（v-model 双向绑定）。如 3 表示选了 3 颗星。 | — |
| defaultValue | `number` | — | `0` | 非受控模式下的默认评分值。默认 0。 | — |
| size | `RateSizeT` | `'large'` / `'medium'` | — | 图标尺寸。"large" 大号、"medium" 中号。 | — |
| color | `ColorT` | `'normal'` / `'primary'` / `'success'` / `'warning'` / `'danger'` | `'normal'` | 选中颜色。"normal" 默认黄色、"primary" 品牌色、"success" 绿色、"warning" 橙色、"danger" 红色。默认 normal。 | — |
| readonly | `boolean` | — | `false` | 是否只读。开启后不可点击修改。默认关闭。 | — |
| allowHalf | `boolean` | — | `false` | 是否支持半星选择。默认关闭。 | — |
| clearable | `boolean` | — | `false` | 是否可清空（再次点击当前值取消选择）。默认关闭。 | — |
| labels | `string[]` | — | — | 提示文字数组，长度必须等于 count。传入后悬停每颗星时显示对应的文字提示气泡。 | — |

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:modelValue | `(val: number)` | 评分变化时 |
| change | `(val: number)` | 评分变化时 |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| icon | `{ index: number, status: RateItemStatusT }` | 始终 | 替换默认的星星图标。可获取 index（当前图标索引）和 status（"full"/"half"/""）。自定义 SVG 需要包含三个子元素：外框线、左半边、全部填充。 | `<IconStar />` |

---

### 典型使用场景与调用模板

**场景 1：基础评分**
适用于：用户评分
```vue
<script setup>
import { ref } from 'vue';
const score = ref(3);
</script>
<template>
  <ORate v-model="score" size="large" />
</template>
```

**场景 2：半星评分**
适用于：精细评分
```vue
<ORate v-model="score" allow-half size="large" />
```

**场景 3：可清空评分**
适用于：允许取消评分
```vue
<ORate v-model="score" clearable size="large" />
```

**场景 4：只读展示**
适用于：评分结果展示
```vue
<ORate :default-value="4" readonly size="medium" color="primary" />
```

**场景 5：带文字提示**
适用于：评价等级说明
```vue
<ORate
  v-model="score"
  size="large"
  color="primary"
  :labels="['非常不满意', '不满意', '一般', '满意', '非常满意']"
/>
```

**场景 6：自定义图标**
适用于：非星星图标的评分
```vue
<ORate size="large" color="success" allow-half>
  <template #icon>
    <svg viewBox="0 0 24 24" style="width: 1em; height: 1em;">
      <circle cx="12" cy="12" r="10.5" stroke="currentColor" stroke-width="1" fill="none" />
      <path d="M 12,2 A 10,10,0,0,0,12,22 Z" fill="currentColor" />
      <path d="M 12,2 A 10,10,0,0,1,12,22 Z" fill="currentColor" />
    </svg>
  </template>
</ORate>
```

---

### ⚠️ 使用注意事项

- **⚠️ 必填星号 → 用 OFormItem 包裹**：设计稿中评分控件标签旁有红色星号（必填），应将 ORate 放入 `<OFormItem required>` 实现，**不要**手写星号。详见 form.md。

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 可操作评分 | `v-model` + `size="large"` + `color="primary"` | 交互评分 |
| 只读展示 | `readonly` + `size="medium"` + `:default-value` | 结果展示 |
| 精细评分 | `allow-half` | 支持 0.5 精度 |
| 带提示 | `:labels="[...]"` | 悬停文字 |
| 可取消 | `clearable` | 再次点击清空 |
