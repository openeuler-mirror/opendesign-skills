> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](form.visual.md) · [样式定制](form.style.md)

# OForm 表单 — 代码使用

### 导入方式

```vue
<script setup>
import { OForm, OFormItem } from '@opensig/opendesign';
</script>
```

---

### 类型定义

```typescript
type ValidatorResultTypeT = 'danger' | 'warning' | 'success';
type TriggerT = 'change' | 'input' | 'blur' | 'focus' | `e-${string}`;
type ValidateStatusT = '' | 'danger' | 'warning' | 'validating' | 'success';

type ValidatorRuleT = {
  triggers?: TriggerT | TriggerT[];
  validator?: (value: any) => { type: ValidatorResultTypeT; message?: string } | void;
};
type RequiredRuleT = {
  required: boolean;
  message?: string;
  triggers?: TriggerT | TriggerT[];
};
type TypeRuleT = {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  message?: string;
  triggers?: TriggerT | TriggerT[];
};
type RulesT = ValidatorRuleT | RequiredRuleT | TypeRuleT;
// 全局校验规则（OForm rules prop），按字段名匹配 FormItem
type FormRulesT = Record<string, RulesT | RulesT[]>;
```

---

### Slots 表

#### OForm Slots

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 表单项列表 | 无 |

#### OFormItem Slots

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| label | — | 始终 | 标签文字区域 | `{{ label }}` |
| symbol | — | 始终 | 必填星号 | `*` |
| default | — | 始终 | 表单控件区域 | 无 |
| message | `{ message: string[], type: string }` | 校验失败时 | 错误消息区域 | 消息列表 |
| extra | — | 始终（不传则不渲染） | 底部提示区域 | 无 |

---

### 典型使用场景与调用模板

**场景 1：基础表单（带校验）**
适用于：用户注册、信息填写
```vue
<script setup>
import { ref, reactive } from 'vue';
const formRef = ref();
const formData = reactive({ name: '', email: '' });
const rules = [
  { required: true, message: '请输入', triggers: 'blur' },
];
const onSubmit = (results) => {
  const hasError = results.some(r => r?.type === 'danger');
  if (!hasError) { /* 提交数据 */ }
};
</script>
<template>
  <OForm ref="formRef" :model="formData" has-required @submit="onSubmit">
    <OFormItem field="name" label="姓名" required :rules="rules">
      <OInput v-model="formData.name" />
    </OFormItem>
    <OFormItem field="email" label="邮箱" :rules="rules">
      <OInput v-model="formData.email" />
    </OFormItem>
    <OButton html-type="submit" color="primary">提交</OButton>
  </OForm>
</template>
```

**场景 2：垂直布局表单**
适用于：移动端或窄空间
```vue
<OForm :model="formData" layout="v">
  <OFormItem field="name" label="姓名">
    <OInput v-model="formData.name" />
  </OFormItem>
</OForm>
```

**场景 3：全局 rules（表单级统一校验规则）**
适用于：规则集中定义在 OForm 上，按字段名下发给各 FormItem；与 FormItem 局部 `rules` 合并（都生效）
```vue
<script setup>
const formRules = {
  name: [{ required: true, message: '请输入姓名', triggers: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'string', message: '格式不正确' },
  ],
};
</script>
<template>
  <OForm :model="formData" :rules="formRules">
    <OFormItem field="name" label="姓名"><OInput v-model="formData.name" /></OFormItem>
    <OFormItem field="email" label="邮箱"><OInput v-model="formData.email" /></OFormItem>
  </OForm>
</template>
```

**场景 4：表单级统一管控（disabled/size/round/clearable 继承）**
适用于：一处声明统一管控整表控件状态，无需逐控件配置；控件自身设置优先于表单级声明
```vue
<template>
  <!-- 整表禁用 -->
  <OForm :model="formData" disabled> … </OForm>
  <!-- 整表统一尺寸与小圆角，仅 checkbox 保持可清空 -->
  <OForm :model="formData" size="small" round="pill">
    <OFormItem field="level" label="等级"><OInputNumber v-model="formData.level" /></OFormItem>
    <OFormItem field="note" label="备注"><OInput v-model="formData.note" clearable /></OFormItem>
  </OForm>
</template>
```

**场景 5：labelWidth 自动对齐**
适用于：标签宽度不固定、希望按最宽标签自动对齐（默认行为 `label-width="auto"`）
```vue
<template>
  <!-- 默认 auto：自动测量最宽标签对齐；也可固定值覆盖 -->
  <OForm :model="formData" label-width="auto"> … </OForm>
  <OForm :model="formData" label-width="96px"> … </OForm>
</template>
```

**场景 6：仅星号模式 + 手动状态**
适用于：自定义校验逻辑（如异步校验、服务端校验），只需星号不需要内置 required 校验；或外部直接控制错误显示
```vue
<template>
  <OForm :model="formData" required-icon>
    <OFormItem field="phone" label="手机号"><OInput v-model="formData.phone" /></OFormItem>
    <!-- 手动设置校验状态：设置后立即显示错误 -->
    <OFormItem field="code" label="验证码" validate-status="danger" error="验证码错误">
      <OInput v-model="formData.code" />
    </OFormItem>
  </OForm>
</template>
```

**场景 7：validateField 事件 + 失败自动滚动**
适用于：逐字段收集校验结果；校验失败自动滚动到首个错误项
```vue
<script setup>
const onValidateField = ({ field, isValid, message }) => {
  console.log(field, isValid ? '通过' : message);
};
</script>
<template>
  <OForm :model="formData" :rules="formRules" scroll-to-error @validate-field="onValidateField"> … </OForm>
</template>
```

**场景 8：自定义校验规则（FormItem 局部）**
适用于：密码确认等复杂校验
```vue
<OFormItem field="confirmPwd" label="确认密码" :rules="[
  { required: true, message: '请确认密码' },
  { validator: (val) => val !== formData.password
    ? { type: 'danger', message: '两次密码不一致' }
    : undefined,
    triggers: 'blur'
  }
]">
  <OInput v-model="formData.confirmPwd" type="password" />
</OFormItem>
```

**场景 9：自定义标签和消息插槽**
适用于：标签需图标或消息需特殊展示
```vue
<OFormItem field="name">
  <template #symbol><OIconStar /></template>
  <template #label><OIconUser /> 用户名</template>
  <OInput v-model="formData.name" />
  <template #message="{ message, type }">
    <ul><li v-for="msg in message" :key="msg">{{ msg }}</li></ul>
  </template>
  <template #extra>用户名长度 4-20 个字符</template>
</OFormItem>
```

**场景 5：多列栅格表单（PC 4列 / 平板 3列 / 移动单列）**
适用于：信息录入类 PC 表单，字段数 2–7 个的分组

**Step 1：在项目全局样式中应用宽度变量（推荐一次性配置，整个项目复用）**

OForm 提供响应式宽度变量，需在项目全局样式中主动应用到控件上（如果项目中已有此配置则跳过）：

```scss
// src/styles/form-controls.scss
.o-form {
  // 将 OForm 提供的响应式宽度变量应用到各输入控件
  .o-input, .o-select, .o-input-number, .o-cascader, .o-ip-input {
    width: var(--form-item-main-box-width-standard);
  }
  .o-textarea {
    width: var(--form-item-main-box-width-wide);
  }

  // 若需覆盖默认宽度，在此声明（按项目设计稿调整）
  // --form-item-main-box-width-standard: 280px;
  // --form-item-main-box-width-wide: 560px;

  // 同 OFormItem 内多输入框：控件 slot 内用 div.form-inline 包裹
  .form-inline {
    display: flex;
    align-items: center;
    gap: var(--form-item-main-box-inline-gap);

    .o-input, .o-select, .o-input-number {
      width: var(--form-item-main-box-width-min);
      flex: 1 1 var(--form-item-main-box-width-min);
      min-width: 0;
    }

    @media (max-width: 840px) {
      flex-direction: column;
      align-items: stretch;
      .o-input, .o-select, .o-input-number { width: 100%; flex: none; }
    }
  }
}
```

**Step 2：在 main.ts 导入（一次性）**
```ts
import './styles/form-controls.scss'
```

**Step 3：模板写法（全局样式已处理宽度，模板中无需再设置 width）**
```vue
<template>
  <OForm has-required layout="h" label-width="96px" :model="formData">

    <!-- OInput / OSelect 等：全局样式已应用 --form-item-main-box-width-standard，此处无需写 width -->
    <OFormItem label="字段一" required field="f1">
      <OSelect v-model="formData.f1" placeholder="请选择" />
    </OFormItem>
    <OFormItem label="字段二" required field="f2">
      <OInput v-model="formData.f2" placeholder="请输入" />
    </OFormItem>

    <!-- 同行双输入（范围输入）：控件 slot 内用 div.form-inline 包裹 -->
    <OFormItem label="日期范围" field="dateRange">
      <div class="form-inline">
        <OInput v-model="formData.startDate" placeholder="开始日期" />
        <span>至</span>
        <OInput v-model="formData.endDate" placeholder="结束日期" />
      </div>
    </OFormItem>

    <!-- OTextarea：全局样式已应用 --form-item-main-box-width-wide（较宽），label-align="top" 避免标签悬空 -->
    <OFormItem label="描述" label-align="top" field="desc">
      <OTextarea v-model="formData.desc" />
    </OFormItem>
  </OForm>
</template>
```

---

### ⚠️ 使用注意事项

- **⚠️ 多列表单布局**：设计稿中表单项并排显示时，使用 `OForm layout="h"`（保持单列堆叠，标签左置）。OForm 提供 `--form-item-main-box-width-standard`/`--form-item-main-box-width-wide` 等响应式变量，**推荐在项目全局样式中统一应用**（见「全局调用建议」），模板中无需对每个控件单独设 width（OButton 除外）。
- **⚠️ 输入类控件的错误状态 / 必填星号 → 统一用 OFormItem 包裹**（适用于所有输入类控件：OInput、OSelect、OTextarea、OInputNumber、OCheckbox、ORadio、OSlider、OSwitch、OCascader、ORate 等）：设计稿中控件边框变红（错误态）或标签旁有红色星号（必填），应将控件放入 `<OFormItem>` 实现（必填 → `required` prop；错误态 → `rules` 校验自动驱动颜色），**不要**直接设 `color="danger"` 或手写星号 HTML。

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础表单 | `model` + `has-required` + `layout="h"` | 最常见用法 |
| 垂直布局 | `layout="v"` | 移动端友好 |
| 行内表单 | `layout="inline"` | 搜索栏等 |
| 右对齐标签 | `label-justify="right"` + `label-width="96px"` | 标签对齐（PC 多列标准） |
| 标签自适应 | `label-width="auto"` | 自动测量最宽标签对齐（默认） |
| 带校验 | `field` + `rules` + `:model` | 自动校验；规则多时用 OForm 全局 `rules` |
| 统一管控控件状态 | OForm 上 `disabled`/`size`/`round`/`clearable` | 一处声明整表生效，控件自身设置优先 |
| 仅星号自定义校验 | `required-icon` + FormItem `error`/`validate-status` | 星号不触发内置 required |
| **多列栅格表单** | `layout="h"` + `label-width="96px"` | 控件宽度由 OForm 自动管理，无需额外设置 |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| 1.2.7 | 新增 | 表单容器统一管控：`disabled`/`size`/`round`/`clearable` 表单级属性经 useFormField 下发全部表单控件（控件自身设置优先），OInput/OSelect/OInputNumber/OTextarea/OCheckbox/ORadio/OUpload/OSwitch/ODatePicker 系列等已接入；全局 `rules` 与 `requiredIcon` 仅星号模式；`validateField` 事件（载荷 `{ field, isValid, message }`），原 `validate` 事件废弃（保持兼容并输出废弃警告，推荐迁移）；暴露 `scrollToField`/`validateField`/`setInitialValues`，校验失败可自动滚动（`scrollToError`）；`labelWidth` 支持 `'auto'` 且成为默认值；FormItem 新增 `error`/`validateStatus`/`showMessage` |
| 1.2.3-sp1 | fix | 601–840px 断点：`--form-item-main-box-width-standard` 和 `--form-item-main-box-width-wide` 从 `100%` 改为 `min(var(--o-r-grid-6), 100%)` |
| 1.2.3-sp1 | fix | ≤600px 断点：`--form-item-main-box-width-standard` 和 `--form-item-main-box-width-wide` 从 `100%` 改为 `min(var(--o-r-grid-4), 100%)` |

---

### ⚡ 全局调用建议

OForm 通过 CSS 变量为各控件提供随断点响应的标准宽度，**推荐在项目全局样式中统一应用**，之后所有表单内的控件宽度自动跟随断点变化，模板中无需再写 `style="width:..."` 或 `:style`（OButton 除外，宽度由调用方自行决定）：

```scss
// 在项目全局样式中一次性配置（如 src/styles/form-controls.scss）
.o-form {
  .o-input, .o-select, .o-input-number, .o-cascader, .o-ip-input {
    width: var(--form-item-main-box-width-standard);
  }
  .o-textarea {
    width: var(--form-item-main-box-width-wide);
  }
}
```

OForm 提供的宽度变量及其响应式行为：

| CSS 变量 | 桌面端默认值 | 平板横屏（841–1200px） | 平板竖屏（601–840px） | 手机（≤600px） |
|---------|------------|----------------------|---------------------|--------------|
| `--form-item-main-box-width-standard` | `min(var(--o-r-grid-6), 100%)` | `min(var(--o-r-grid-4), 100%)` | `min(var(--o-r-grid-6), 100%)` | `min(var(--o-r-grid-4), 100%)` |
| `--form-item-main-box-width-wide` | `min(var(--o-r-grid-14), 100%)` | `min(var(--o-r-grid-8), 100%)` | `min(var(--o-r-grid-6), 100%)` | `min(var(--o-r-grid-4), 100%)` |
| `--form-item-main-box-inline-gap` | `--o3-gap-4` | — | — | — |
| `--form-item-main-box-width-min` | `(standard - gap) / 2` | — | — | — |

若项目设计稿与默认值不符，全局覆盖变量即可：
```css
.o-form {
  --form-item-main-box-width-standard: 280px;
  --form-item-main-box-width-wide: 560px;
}
```

---

### OForm Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|---------|
| model | `object` | — | — | 表单数据对象。传入后，OFormItem 通过 field 属性关联模型中的字段，实现自动校验和重置。 | — |
| rules | `FormRulesT` | — | — | 全局校验规则，按字段名匹配 FormItem（`Record<field, RulesT \| RulesT[]>`），与 FormItem 局部 rules 合并。 | 1.2.7 |
| hasRequired | `boolean` | — | `false` | 是否有必填项，用于统一缩进对齐（预留必填星号的空间）。默认关闭。 | — |
| requiredIcon | `boolean` | — | `false` | 仅展示必填星号而不触发默认 required 校验，适用于自定义校验逻辑的场景。FormItem 可单独覆盖。 | 1.2.7 |
| layout | `string` | `'h'` / `'v'` / `'inline'` | `'h'` | 表单布局方式。"h" 水平布局，标签与控件同行；"v" 垂直布局，标签在控件上方；"inline" 行内布局，多个表单项在同一行。默认水平。 | — |
| labelAlign | `string` | `'top'` / `'center'` / `'bottom'` | — | 标签与控件的垂直对齐方式。"top" 顶部对齐、"center" 居中对齐、"bottom" 底部对齐。 | — |
| labelJustify | `string` | `'left'` / `'center'` / `'right'` | — | 标签的水平对齐方式。"left" 左对齐、"center" 居中、"right" 右对齐。 | — |
| labelWidth | `string` | CSS 值 / `'auto'` | `'auto'` | 标签宽度。`'auto'` 自动测量最宽标签对齐；也可传固定 CSS 值。OForm 上统一设置，OFormItem 可单独覆盖。默认值 v1.2.7 起为 `'auto'`（旧版无默认，未设置时由 CSS 变量 `--form-label-width: 20%` 控制）。 | 1.2.7（`'auto'`） |
| showMessage | `boolean` | — | `true` | 是否显示校验错误消息。FormItem 可单独覆盖。 | 1.2.7 |
| validateOnRuleChange | `boolean` | — | `true` | rules 变更时是否自动触发校验。 | 1.2.7 |
| scrollToError | `boolean` | — | `false` | 校验失败时自动滚动到首个错误项。 | 1.2.7 |
| disabled | `boolean` | — | — | 禁用表单内所有控件，经 useFormField 下发（控件自身设置优先）。 | 1.2.7 |
| size | `SizeT` | `'small'` / `'medium'` / `'large'` | — | 表单内控件尺寸，经 useFormField 下发（控件自身设置优先）。 | 1.2.7 |
| round | `RoundT` | `'pill'` / CSS 值 | — | 表单内控件圆角模式，经 useFormField 下发（控件自身设置优先）。 | 1.2.7 |
| clearable | `boolean` | — | — | 表单内控件是否可清空，经 useFormField 下发（控件自身设置优先）。 | 1.2.7 |

---

### OFormItem Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|---------|
| field | `string` | — | — | 对应 model 中的字段名（支持路径格式如 "a.b"）。使用 rules 校验时必填。 | — |
| label | `string` | — | — | 标签文字 | — |
| required | `boolean` | — | `false` | 是否为必填项，显示红色星号。默认关闭。 | — |
| requiredIcon | `boolean` | — | 继承 OForm | 仅展示必填星号而不触发默认 required 校验。未设置时继承 Form 的 requiredIcon。 | 1.2.7 |
| labelAlign | `string` | `'top'` / `'center'` / `'bottom'` | 继承 OForm | 标签与控件的垂直对齐方式。"top" 顶部对齐、"center" 居中对齐、"bottom" 底部对齐。 | — |
| labelJustify | `string` | `'left'` / `'center'` / `'right'` | 继承 OForm | 标签的水平对齐方式。"left" 左对齐、"center" 居中、"right" 右对齐。 | — |
| labelWidth | `string` | CSS 值 / `'auto'` | 继承 OForm | 标签宽度，支持 `'auto'` 自动测量。OForm 上统一设置，OFormItem 可单独覆盖。 | 1.2.7（`'auto'`） |
| rules | `RulesT[]` | — | — | 局部校验规则数组，与 OForm 全局 rules（按 field 匹配）合并。支持三种规则类型：必填规则（required + message）、类型规则（type + message）、自定义校验函数（validator 返回 danger/warning/success）。每条规则可设置触发时机（change/input/blur/focus）。 | — |
| defaultTrigger | `TriggerT` | `'change'` / `'input'` / `'blur'` / `'focus'` | — | 默认校验触发事件。手动校验或提交时未指定触发方式时使用。 | — |
| error | `string` | — | — | 手动设置校验错误信息，设置后立即显示错误状态。 | 1.2.7 |
| validateStatus | `ValidateStatusT` | `''` / `'danger'` / `'warning'` / `'validating'` / `'success'` | — | 手动设置校验状态。 | 1.2.7 |
| showMessage | `boolean` | — | 继承 OForm | 是否显示校验消息。未设置时继承 Form 的 showMessage。 | 1.2.7 |
| disabled / size / round / clearable | 同控件 | — | 继承 OForm | 表单级统一管控的继承入口：控件自身设置优先于 Form 声明。 | 1.2.7 |

---

### OForm Events 表

| 事件名 | 参数 | 触发时机 | 引入版本 |
|--------|------|---------|---------|
| submit | `(results: FieldResultT[])` | 表单提交时触发（自动校验所有字段），可获取校验结果。 | — |
| validateField | `(payload: { field: string; isValid: boolean; message: string })` | 任一表单项校验完成后触发，返回字段名、是否通过、错误消息。**推荐使用**。 | 1.2.7 |
| validate | `(results: FieldResultT[])` | 表单校验完成后触发，返回所有已校验项的结果数组。**已废弃**（v1.2.7 起监听会输出废弃警告，当前版本保持兼容），推荐改用 `validateField`。 | — |
| clear | `(filed?: string \| string[])` | 清除校验状态后 | — |
| reset | `(filed?: string \| string[])` | 重置表单后 | — |

---

### 暴露方法（OForm）

| 方法名 | 参数 | 说明 | 引入版本 |
|--------|------|------|--------|
| validate(filed?, trigger?) | `filed?: string \| string[]`；`trigger?: TriggerT` | 校验表单（可指定字段与触发事件）。校验失败时若 `scrollToError` 开启自动滚动到首个错误项 | — |
| validateField(field, trigger?) | `field: string \| string[]` | 校验指定字段 | 1.2.7 |
| scrollToField(field) | `field: string` | 滚动定位到指定字段对应的表单项 | 1.2.7 |
| setInitialValues(values) | `Record<field, value>` | 设置表单初始值，同时写入 model 和重置基准 | 1.2.7 |
| resetFields(filed?) | `filed?: string \| string[]` | 重置表单（清除校验 + 恢复初始值） | — |
| clearValidate(filed?) | `filed?: string \| string[]` | 仅清除校验状态 | — |
