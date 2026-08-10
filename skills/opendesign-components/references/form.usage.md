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

**场景 3：自定义校验规则**
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

**场景 4：自定义标签和消息插槽**
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
| 带校验 | `field` + `rules` + `:model` | 自动校验 |
| **多列栅格表单** | `layout="h"` + `label-width="96px"` | 控件宽度由 OForm 自动管理，无需额外设置 |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
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
| hasRequired | `boolean` | — | `false` | 是否有必填项，用于统一缩进对齐（预留必填星号的空间）。默认关闭。 | — |
| layout | `string` | `'h'` / `'v'` / `'inline'` | `'h'` | 表单布局方式。"h" 水平布局，标签与控件同行；"v" 垂直布局，标签在控件上方；"inline" 行内布局，多个表单项在同一行。默认水平。 | — |
| labelAlign | `string` | `'top'` / `'center'` / `'bottom'` | — | 标签与控件的垂直对齐方式。"top" 顶部对齐、"center" 居中对齐、"bottom" 底部对齐。 | — |
| labelJustify | `string` | `'left'` / `'center'` / `'right'` | — | 标签的水平对齐方式。"left" 左对齐、"center" 居中、"right" 右对齐。 | — |
| labelWidth | `string` | CSS 值 | — | 标签宽度，CSS 值。OForm 上统一设置，OFormItem 可单独覆盖。 | — |

---

### OFormItem Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|---------|
| field | `string` | — | — | 对应 model 中的字段名（支持路径格式如 "a.b"）。使用 rules 校验时必填。 | — |
| label | `string` | — | — | 标签文字 | — |
| required | `boolean` | — | `false` | 是否为必填项，显示红色星号。默认关闭。 | — |
| labelAlign | `string` | `'top'` / `'center'` / `'bottom'` | 继承 OForm | 标签与控件的垂直对齐方式。"top" 顶部对齐、"center" 居中对齐、"bottom" 底部对齐。 | — |
| labelJustify | `string` | `'left'` / `'center'` / `'right'` | 继承 OForm | 标签的水平对齐方式。"left" 左对齐、"center" 居中、"right" 右对齐。 | — |
| labelWidth | `string` | CSS 值 | 继承 OForm | 标签宽度，CSS 值。OForm 上统一设置，OFormItem 可单独覆盖。 | — |
| rules | `RulesT[]` | — | — | 校验规则数组。支持三种规则类型：必填规则（required + message）、类型规则（type + message）、自定义校验函数（validator 返回 danger/warning/success）。每条规则可设置触发时机（change/input/blur/focus）。 | — |
| defaultTrigger | `TriggerT` | `'change'` / `'input'` / `'blur'` / `'focus'` | — | 默认校验触发事件。手动校验或提交时未指定触发方式时使用。 | — |

---

### OForm Events 表

| 事件名 | 参数 | 触发时机 | 引入版本 |
|--------|------|---------|---------|
| submit | `(results: FieldResultT[])` | 表单提交时触发（自动校验所有字段），可获取校验结果。 | — |
| validate | `(results: FieldResultT[])` | 手动调用 validate 后 | — |
| clear | `(filed?: string \| string[])` | 清除校验状态后 | — |
| reset | `(filed?: string \| string[])` | 重置表单后 | — |

---

### 暴露方法（OForm）

| 方法名 | 参数 | 说明 |
|--------|------|------|
| validate(filed?) | `filed?: string \| string[]` | 校验表单（可指定字段） |
| resetFields(filed?) | `filed?: string \| string[]` | 重置表单（清除校验 + 恢复初始值） |
| clearValidate(filed?) | `filed?: string \| string[]` | 仅清除校验状态 |
