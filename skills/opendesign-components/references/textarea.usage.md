> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](textarea.visual.md) · [样式定制](textarea.style.md)

# OTextarea 多行文本输入框 — 代码使用

### 导入方式

```vue
<script setup>
import { OTextarea } from '@opensig/opendesign';
</script>
```

---

### 类型定义

```typescript
type TextareaResizeT = 'both' | 'horizontal' | 'h' | 'vertical' | 'v' | 'none';
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| modelValue | `string` | — | — | 输入内容（v-model 双向绑定）。 |
| defaultValue | `string` | — | — | 非受控模式下的默认值。 |
| size | `SizeT` | `'large'` / `'medium'` / `'small'` | — | 输入框尺寸。"large" 大号、"medium" 中号、"small" 小号。 |
| round | `RoundT` | `'pill'` / CSS 值 | — | 圆角值。"pill" 映射为较大圆角（radius_control-l），也可传 CSS 值。 |
| color | `Color2T` | `'normal'` / `'success'` / `'warning'` / `'danger'` | `'normal'` | 颜色。"normal" 默认、"success" 成功、"warning" 警告、"danger" 错误。默认 normal。在表单中由校验结果自动覆盖。 |
| variant | `VariantT` | `'solid'` / `'outline'` / `'text'` | `'outline'` | 样式变体。"solid" 实心、"outline" 线框、"text" 纯文字。默认 outline。 |
| placeholder | `string` | — | — | 占位文本 |
| disabled | `boolean` | — | `false` | 禁用 |
| readonly | `boolean` | — | `false` | 只读 |
| clearable | `boolean` | — | `false` | 可清空 |
| rows | `number` | — | `4` | 文本域行数。默认 4 行。 | v1.1.0（默认值从无改为4） |
| cols | `number` | — | — | 列数 |
| autoSize | `boolean` | — | `false` | 是否根据内容自动调整高度。 |
| resize | `TextareaResizeT` | `'both'` / `'horizontal'` / `'vertical'` / `'none'` | `'vertical'` | 是否允许拖拽调整大小。"both" 双向、"horizontal"/"h" 水平、"vertical"/"v" 垂直、"none" 不可调。默认 vertical。 |
| maxLength | `number` | — | — | 最大字符长度 |
| minLength | `number` | — | — | 最小字符长度 |
| showLength | `string` | `'always'` / `'auto'` / `'never'` | `'auto'` | 是否显示字符计数。"always" 始终显示、"auto" 设置了 maxLength/minLength 时显示、"never" 不显示。默认 auto。 | v1.1.0 |
| getLength | `(val: string) => number` | — | — | 自定义获取字符长度的方法。 |
| inputOnOutlimit | `boolean` | — | `true` | 超过最大长度时是否仍允许输入。默认允许。 |
| format | `(value: string) => string` | — | — | 格式化函数，控制显示格式。 |
| validate | `(value: string) => boolean` | — | — | 校验函数，返回 false 视为无效输入。 |
| valueOnInvalidChange | `boolean \| ((input: string, lastValid: string) => string)` | — | 无效输入在失焦时的纠正方式。true 恢复上次合法值；函数则使用返回值纠正。 | 无效值纠正 |
| scrollbar | `boolean \| Partial<BaseScrollerPropsT>` | — | 滚动条配置。布尔值或 OScrollbar 配置对象。默认 true。 | 滚动条配置 |
| textareaId | `string` | — | — | textarea 的 id，用于关联 label 标签。 |

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:modelValue | `(value: string)` | 值变化时 |
| change | `(value: string)` | 值改变时触发（失焦或回车）。 |
| input | `(evt: Event)` | 输入时 |
| focus | `(evt: FocusEvent)` | 获取焦点 |
| blur | `(evt: FocusEvent)` | 失去焦点 |
| clear | `(evt?: Event)` | 清空时 |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| prepend | — | 有插槽时 | 前置区域 | 无 |
| append | — | 有插槽时 | 后置区域 | 无 |
| suffix | — | 有插槽时 | 后缀区域 | 无 |

---

### 暴露方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| focus() | — | 聚焦 |
| blur() | — | 失焦 |
| clear() | — | 清空内容 |
| inputEl | — | 获取原生 textarea 元素 |

---

### 典型使用场景与调用模板

**场景 1：基础文本域**
适用于：多行文本输入
```vue
<script setup>
import { ref } from 'vue';
const content = ref('');
</script>
<template>
  <OTextarea v-model="content" placeholder="请输入内容" />
</template>
```

**场景 2：带字符计数限制**
适用于：评论、备注等限字场景
```vue
<OTextarea v-model="content" :max-length="200" show-length="always" />
```

**场景 3：自动高度**
适用于：内容量不确定的输入
```vue
<OTextarea v-model="content" auto-size resize="none" />
```

**场景 4：可清空 + 禁止调整大小**
适用于：固定布局的表单
```vue
<OTextarea v-model="content" clearable resize="none" :rows="6" />
```

**场景 5：不同样式**
适用于：适配不同设计场景
```vue
<OTextarea v-model="content" variant="solid" color="normal" />
<OTextarea v-model="content" variant="text" />
```

---

### ⚠️ 使用注意事项

- **⚠️ 错误状态 / 必填星号 → 用 OFormItem 包裹**：设计稿中文本域边框变红（错误态）或标签旁有红色星号（必填），应将 OTextarea 放入 `<OFormItem>` 实现，**不要**直接设 `color="danger"` 或手写星号。详见 form.md。

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础输入 | `v-model` + `placeholder` | 最常见 |
| 字符限制 | `:max-length` + `show-length="always"` | 限字显示 |
| 自动高度 | `auto-size` + `resize="none"` | 自适应 |
| 固定高度 | `:rows` + `resize="none"` | 固定 |
| 可清空 | `clearable` | 清空按钮 |
| 表单联动 | 与 OFormItem 配合 | 自动校验颜色 |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| v1.2.4 | 修复 | 宽度显示问题已修复 |
| v1.1.0 | 新增 | 新增 `showLength` prop 和 `length` 插槽；rows 默认值改为 4；移除 min-height 样式 |
