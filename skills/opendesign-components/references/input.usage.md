> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](input.visual.md) · [样式定制](input.style.md)

# OInput 输入框 — 代码使用

### 导入方式

```vue
<script setup>
import { OInput } from '@opensig/opendesign';
</script>
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|---------|
| modelValue | `string \| number` | — | 输入框的值（v-model 双向绑定）。 | 输入值（v-model）  | — |
| defaultValue | `string \| number` | — | 非受控模式下的默认值。 | 非受控默认值  | — |
| size | `SizeT` | `'small'` / `'medium'` / `'large'` | — | 输入框尺寸。"small"、"medium"、"large"。 | — |
| round | `RoundT` | `'pill'` / CSS 值 | — | 圆角值。"pill" 半圆或 CSS 值。 | — |
| color | `Color2T` | `'normal'` / `'success'` / `'warning'` / `'danger'` | `'normal'` | 输入框颜色状态。"normal" 默认、"success" 成功、"warning" 警告、"danger" 错误。在 OFormItem 内会自动跟随校验状态变色。默认 normal。 | — |
| variant | `VariantT` | `'solid'` / `'outline'` / `'text'` | `'outline'` | 输入框样式。"solid" 实心、"outline" 线框、"text" 无边框。默认 outline。 | — |
| disabled | `boolean` | — | `false` | 禁用输入框。默认关闭。 | — |
| readonly | `boolean` | — | `false` | 只读模式。默认关闭。 | — |
| clearable | `boolean` | — | `false` | 是否显示清空按钮。默认关闭。 | — |
| type | `string` | `'text'` / `'password'` | `'text'` | 输入框类型。"text" 文本、"password" 密码。默认 text。 | — |
| placeholder | `string` | — | — | 占位文本  | — |
| inputId | `string` | — | — | input 元素 id，用于 label 关联  | — |
| maxLength | `number` | — | — | 最大字符数  | — |
| minLength | `number` | — | — | 最小字符数  | — |
| showLength | `string` | `'always'` / `'auto'` / `'never'` | `'auto'` | 字数统计显示模式。"always" 始终显示、"auto" 设置了 minLength/maxLength 时自动显示、"never" 不显示。默认 auto。 | 1.1.0 |
| getLength | `(val: string) => number` | — | — | 自定义获取字符长度的方法。接受字符串参数，返回长度数值。 | — |
| inputOnOutlimit | `boolean` | — | `true` | 超出最大字符数时是否允许继续输入。为 false 时输入长度超出 maxLength 会被截断。默认允许。 | — |
| autoWidth | `boolean` | — | `false` | 宽度随内容自适应。默认关闭。 | — |
| format | `(value: string) => string` | — | — | 值格式化函数，控制显示格式。接受字符串参数，返回格式化后的字符串。 | — |
| validate | `(value: string) => boolean` | — | — | 值有效性判断函数。接受字符串参数，返回布尔值表示是否有效。 | — |
| valueOnInvalidChange | `boolean \| (inputValue: string, lastValidInputValue: string) => string` | — | 输入无效值时在 blur/pressEnter 时的处理方式。true 纠正为上一次合法值；false/undefined 不处理；函数则使用返回值作为纠正值。 | 无效值处理方式  | — |
| showPasswordEvent | `string` | `'click'` / `'pointerdown'` | `'pointerdown'` | 密码显示切换的触发方式。"click" 点击切换、"pointerdown" 按住显示松开隐藏。默认 pointerdown。 | — |
| passwordPlaceholder | `string` | — | `'\u2022'` | 密码模式下单个字符的占位符。默认为圆点字符。 | — |
| noKeyboard | `boolean` | — | `false` | 禁止调起移动端虚拟键盘。适用于日期选择器等场景，输入框只用于展示而非手动输入。 | 1.2.3-sp2 |

---

### Events 表

| 事件名 | 参数 | 触发时机 | 引入版本 |
|--------|------|---------|---------|
| update:modelValue | `(value: string)` | 值变化时  | — |
| change | `(value: string)` | 值改变且失焦  | — |
| input | `(evt: Event, value: string)` | 实时输入时触发。v1.2.3-sp2 修复：`input` 事件现在在 `update:model-value` 之后触发（v1.1.0 引入了错误的触发顺序）。 | — |
| focus | `(evt: FocusEvent)` | 聚焦  | — |
| blur | `(evt: FocusEvent)` | 失焦  | — |
| clear | `(evt?: Event)` | 点击清空按钮时触发。 | — |
| pressEnter | `(evt: KeyboardEvent)` | 按下回车  | — |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| prepend | — | 始终 | 输入框前置区域（外部，含边框）。适合放固定文字如 "https://"。 | 无 |
| append | — | 始终 | 输入框后置区域（外部，含边框）。适合放后缀如 ".com"。 | 无 |
| prefix | — | 始终 | 输入框内部前缀图标。 | 无 |
| suffix | — | 始终 | 输入框内部后缀图标。 | 无 |
| extra | — | 始终 | 输入框后缀区域的额外内容（位于清空按钮、密码图标、字数统计之后）。 | 无 |
| length | — | isShowLength 时 | 字数统计区域的替换插槽。 | 默认字数统计 |

---

### 暴露方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| focus() | — | 聚焦输入框 |
| blur() | — | 移除焦点 |
| clear() | — | 清空内容 |
| inputEl() | — | 获取原生 input 元素 |
| togglePassword() | — | 切换密码显示 |

---

### 典型使用场景与调用模板

**场景 1：基础输入框**
适用于：通用文本输入
```vue
<script setup>
import { ref } from 'vue';
const value = ref('');
</script>
<template>
  <OInput v-model="value" placeholder="请输入" />
</template>
```

**场景 2：带清空和字数统计**
适用于：有长度限制的输入
```vue
<OInput v-model="value" clearable show-length="always" :max-length="100" />
```

**场景 3：带前后缀图标**
适用于：搜索框
```vue
<OInput v-model="search" placeholder="搜索">
  <template #prefix><OIconSearch /></template>
</OInput>
```

**场景 4：带前置/后置内容**
适用于：URL 输入等（前置是**静态文字**）
```vue
<OInput v-model="domain" placeholder="输入域名">
  <template #prepend>https://</template>
  <template #append>.com</template>
</OInput>
```

**场景 5：手机号 + 区号下拉（Group-number 模式）**
适用于：输入框左侧有可点击/可选择的区号前缀（下拉选择）
⚠️ **不要**用 `#prepend` 静态文字；应将 `OSelect` 和 `OInput` 作为兄弟元素并排，用 CSS 去掉拼接处圆角和重叠边框：
```vue
<script setup>
import { ref } from 'vue';
import { OSelect, OOption, OInput } from '@opensig/opendesign';
const selectedVal = ref('+86(中国)');
const inputVal = ref('');
</script>
<template>
  <div class="input-wrap">
    <!-- OSelect 右侧无圆角，OInput 左侧无圆角，两者边框重叠 1px -->
    <OSelect v-model="selectedVal" size="large" class="phone-select" @click.stop>
      <OOption label="+86(中国)" value="+86(中国)" />
      <OOption label="+81(日本)" value="+81(日本)" />
    </OSelect>
    <OInput class="phone-input" v-model="inputVal" size="large" placeholder="请输入手机号" />
  </div>
</template>
<style scoped lang="scss">
.input-wrap {
  display: flex;
  align-items: center;
}
.phone-select {
  --select-icon-gap: 4px;
  --select-padding: 0 7px;
  z-index: 0;
  width: 120px;
  margin-right: -1px;           /* 边框重叠避免双线 */
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  &:hover { z-index: 2; }
}
.phone-input {
  position: relative;
  z-index: 1;
  width: 220px;
  :deep(.o_box-main) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
</style>
```

**场景 6：验证码输入框（Group-btn 模式）**
适用于：输入框内右侧有"发送验证码"等文字操作按钮
⚠️ 用 `#suffix` 插槽放 `OLink`（文字链样式），**不要**用 `#extra` 放 `OButton`：
```vue
<script setup>
import { ref } from 'vue';
import { OInput, OLink } from '@opensig/opendesign';
const codeValue = ref('');
const verifingCode = ref(false);
const sendLabel = ref('发送验证码');
const sendCode = async () => { /* 发送逻辑 + 倒计时 */ };
</script>
<template>
  <OInput v-model="codeValue" size="large" placeholder="请输入验证码">
    <template #suffix>
      <OLink
        tag="button"
        :color="verifingCode ? 'normal' : 'primary'"
        :disabled="verifingCode"
        @click="sendCode"
      >{{ sendLabel }}</OLink>
    </template>
  </OInput>
</template>
```

**场景 7：密码框**
适用于：密码输入
```vue
<OInput v-model="password" type="password" />
```

---

### ⚠️ 使用注意事项

- **⚠️ 错误状态 / 必填星号 → 用 OFormItem 包裹**：设计稿中输入框边框变红（错误态）或标签旁有红色星号（必填），应将 OInput 放入 `<OFormItem>` 实现（必填 → `required` prop；错误态 → `rules` 校验自动驱动颜色），**不要**直接设 `color="danger"` 或手写星号 HTML。详见 form.md。
- **color="danger" 仅用于无表单联动的孤立展示场景**：当 OInput 不在 OForm/OFormItem 内且需要错误态红色边框时，可设 `color="danger"`。在 OForm 内应通过 `rules` 校验自动驱动颜色，不要手动设 `color="danger"`。

---

### 常见 prop 组合速查

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| 1.1.0 | feature | 新增 `showLength` 属性和 `length` 插槽 |
| 1.1.0 | bug | `input` 事件触发顺序变为先于 `update:model-value`（后续在 1.2.3-sp2 修复） |
| 1.2.3-sp2 | fix | `input` 事件现在在 `update:model-value` 之后触发（修正 v1.1.0 引入的错误顺序） |
| 1.2.3-sp2 | feature | 内部 InInput 组件新增 `noKeyboard` 属性（禁止移动端虚拟键盘） |
| 1.2.4 | docs | OInput.vue 所有事件和暴露方法添加 JSDoc 注释 |
| 1.2.6 | feature | `extra` 插槽添加到 defineSlots 声明；修复背景色 |
