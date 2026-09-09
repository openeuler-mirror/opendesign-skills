> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](select.visual.md) · [样式定制](select.style.md)

# OSelect 选择器 — 代码使用

### 导入方式

```vue
<script setup>
import { OSelect, OOption, OOptionGroup } from '@opensig/opendesign';
</script>
```

### 两种数据来源（二选一）

- **插槽式**：模板中手写 `<OOption>` / `<OOptionGroup>` 子组件
- **数据驱动**：`:options` 传入数组（扁平或分组结构），配合 `fieldNames` 适配后端数据结构、无需手动转换。`options` 与 default 插槽同时存在时**插槽优先、options 被忽略并输出警告**

```ts
// 数据驱动的选项结构（SelectOptionData 带索引签名，可携带任意自定义字段）
interface SelectOptionData {
  label: string;              // 保持纯字符串：用于过滤匹配、input 显示与读屏
  value: string | number;
  disabled?: boolean;
  [key: string]: unknown;     // 自定义字段（icon/color 等）供 renderLabel / #option-label 使用
}
// 分组选项
interface SelectOptionGroupData {
  type: 'group';
  key: string | number;       // 缺失时按索引兜底
  label: string;
  children: SelectOptionData[];
}
// 自定义字段名映射（仅 options 模式生效，插槽模式不介入）
interface SelectFieldNames {
  value?: string; label?: string; disabled?: string; children?: string;
}
```

**`label` 纯字符串原则**：自定义视觉内容（图标、色块）通过额外自定义字段携带，经 `renderLabel` / `#option-label` 渲染；`label` 本身专用于过滤匹配、输入框回显与无障碍读屏。

---

### 类型定义

```typescript
type OptionWidthModeT = 'auto' | 'min-width' | 'width';
type SelectValueT = string | number | string[] | number[] | (string | number)[];
// 虚拟元素（OPopup targetRect）等通用类型见各组件文档
```

---

### Events 表

| 事件名 | 参数 | 触发时机 | 引入版本 |
|--------|------|---------|---------|
| update:modelValue | `(value: SelectValueT)` | 选中值变化时 | — |
| change | `(value: SelectValueT, option: { value, label }[])` | 选中值变化时。新增第二参数：轻量选中项数组（仅 `{ value, label }`，**不含 options 中的自定义字段**），可直接读取 label；单选 0~1 个元素、多选任意个。同时触发表单校验联动 | 1.2.7 |
| options-visible-change | `(value: boolean)` | 选项面板显隐变化时触发。 | — |
| clear | `(evt: Event)` | 点击清空。同时清空值与已选缓存；有搜索词时一并清空并派发 `update:inputValue('')` | — |
| search | `(value: string)` | `filterable` 开启时输入变化触发（IME 组合输入期间不触发）。**防抖由调用者自行实现**（推荐 `useDebounceFn`） | 1.2.7 |
| create | `(value: string)` | 创建新选项时触发（点击创建项或分词产生新 token），参数为创建的原始输入值 | 1.2.7 |
| exceed-limit | `(value: string \| number)` | `limit` 开启时，已达上限仍尝试选择未选中项触发，参数为该选项的 value | 1.2.7 |
| remove-tag | `(value: string \| number)` | 多选移除某个标签时触发（tag 的 × / 折叠浮层内的 × / renderTag 的 onClose）；disabled 状态不触发 | 1.2.7 |
| update:inputValue | `(value: string)` | 搜索词变化（输入、清空、分词后清空、关闭面板清空）时触发，配合 `v-model:inputValue` 受控使用 | 1.2.7 |
| focus / blur | `(evt: FocusEvent)` | 输入框聚焦 / 失焦时触发，并联动表单校验 | 1.2.7 |
| scroll | `(evt: Event)` | 选项列表滚动时触发 | 1.2.7 |
| scroll-to-bottom | `(evt: Event)` | 选项列表滚动到底部时触发（距底 2px 容差），配合远程分页加载 | 1.2.7 |

---

### 典型使用场景与调用模板

**场景 1：基础单选（插槽式）**
适用于：从选项列表选择一项
```vue
<script setup>
import { ref } from 'vue';
const value = ref('');
</script>
<template>
  <OSelect v-model="value" placeholder="请选择">
    <OOption label="选项一" value="1" />
    <OOption label="选项二" value="2" />
    <OOption label="选项三" value="3" />
  </OSelect>
</template>
```

**场景 2：数据驱动——扁平 / 分组 / 自定义字段名**
适用于：选项来自接口。`fieldNames` 直接适配后端字段，无需转换；动态更新直接改数组（响应式）
```vue
<script setup>
import { ref } from 'vue';
const value = ref('');
const groupOptions = [
  { type: 'group', key: 'g1', label: '前端', children: [
    { label: 'Vue', value: 'vue' }, { label: 'React', value: 'react' },
  ]},
  { label: 'Go', value: 'go' },
];
// 后端异构数据：字段名映射
const customOptions = ref([
  { name: '选项一', code: '1', isDisabled: false },
]);
const fieldNames = { value: 'code', label: 'name', disabled: 'isDisabled' };
</script>
<template>
  <OSelect v-model="value" :options="groupOptions" placeholder="请选择" />
  <OSelect v-model="value" :options="customOptions" :field-names="fieldNames" placeholder="自定义字段" />
</template>
```

**场景 3：可搜索过滤（本地）**
适用于：选项较多需按关键词过滤。`filterSort` 对过滤结果排序（分组时 children 内部排序）
```vue
<OSelect
  v-model="value" :options="options" filterable
  :filter-sort="(a, b) => a.label.localeCompare(b.label)"
  placeholder="输入可搜索"
/>
<!-- 自定义匹配：首字母 startsWith -->
<OSelect v-model="value" :options="options" filterable
  :filter-option="(input, opt) => opt.label.toLowerCase().startsWith(input.toLowerCase())" />
```

**场景 4：远程搜索**
适用于：选项在服务端。标准组合：`filter-option=false` 关闭本地过滤 + `@search`（自管防抖）+ `loading` + 可选 `v-model:input-value`
```vue
<script setup>
import { ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';
const searchValue = ref('');
const remoteOptions = ref([]);
const remoteLoading = ref(false);
const onRemoteSearch = useDebounceFn(async (q) => {
  remoteLoading.value = true;
  remoteOptions.value = await fetchOptions(q);
  remoteLoading.value = false;
}, 300);
</script>
<template>
  <OSelect
    v-model="value" v-model:input-value="searchValue"
    filterable :filter-option="false" :options="remoteOptions"
    :loading="remoteLoading" @search="onRemoteSearch"
    placeholder="输入关键词远程搜索"
  />
</template>
```

**场景 5：创建选项 + 分词批量创建**
适用于：允许输入列表中不存在的值。**`allowCreate` 依赖 `filterable`**；创建项持久化到选项列表（重新展开面板仍可见）；多选下创建项以 tag 展示、可逐个删除
```vue
<OSelect
  v-model="value" :options="options" filterable allow-create
  :create-label="(input) => `➕ 添加语言: ${input}`"
  placeholder="输入编程语言"
  @create="onCreate"
/>
<!-- 分词批量创建：需 multiple + allowCreate，支持中文逗号等多字节分隔符 -->
<OSelect
  v-model="values" multiple :options="tokenOptions" filterable allow-create
  :token-separators="[',', '，', ';']"
/>
<!-- autoTagInMultiple：多选下回车直接把输入转标签（默认 false，需显式开启） -->
<OSelect v-model="values" multiple :options="options" filterable allow-create auto-tag-in-multiple />
```

**场景 6：多选 + 数量上限 + 折叠策略**
适用于：标签数量受控。`limit` 达上限后未选项自动禁用（视觉禁用但仍可点击以触发 `exceed-limit`）；折叠策略二选一——数字固定折叠 / `'responsive'` 随容器宽度自适应
```vue
<OSelect
  v-model="values" multiple clearable :limit="3" :options="options"
  @exceed-limit="(v) => (msg = `已达上限，无法选择 ${v}`)"
  @remove-tag="(v) => (log = `移除 ${v}`)"
/>
<!-- 响应式折叠：容器变窄自动折叠、变宽自动展开（ResizeObserver） -->
<OSelect v-model="values" multiple :options="options" max-tag-count="responsive" :style="{ width: '280px' }" />
<!-- 固定折叠 + 自定义折叠文案 -->
<OSelect v-model="values" multiple :options="options" :max-tag-count="3"
  :fold-label="(tags) => `等 ${tags.length + 3} 项`" />
```

**场景 7：虚拟滚动大数据**
适用于：选项上千。**仅支持 options 数据驱动**（插槽模式下虚拟不生效，显示空态）；`virtualListProps.itemSize` 为数字时走定高模式、性能最佳，不传为运行时测量；可与多选/搜索/创建/自定义渲染自由组合；预置 v-model 值可定位滚动到选中项
```vue
<script setup>
const largeOptions = Array.from({ length: 1000 }, (_, i) => ({ label: `选项 ${i + 1}`, value: i }));
const value = ref(500); // 预选值，展开时自动滚动定位
</script>
<template>
  <OSelect v-model="value" :options="largeOptions" :virtual="true"
    :virtual-list-props="{ itemSize: 36 }" clearable placeholder="1000+ 选项" />
</template>
```

**场景 8：异步回显兜底（fallbackOption）**
适用于：值先到、选项后到的时序。组件内部维护已选缓存——选项卸载后已选值的 label 仍保留；`fallbackOption` 只消费返回对象的 `label`（补充 value→label 映射），兜底项不出现在下拉列表中
```vue
<script setup>
const asyncOptions = ref([]); // 初始为空，onMounted 后异步填充
const value = ref('x-42');    // 预选值不在选项中
</script>
<template>
  <OSelect v-model="value" :options="asyncOptions" clearable
    :fallback-option="(v) => ({ label: '加载中…', value: v })" />
  <!-- 或 :fallback-option="true" 用 value 本身作为 label 展示 -->
</template>
```

**场景 9：自定义选项渲染（renderLabel / renderTag / 插槽）**
适用于：选项或选中标签需要图标、色块等富内容。**函数与插槽二选一，插槽优先**；`label` 保持纯字符串供过滤与读屏
```vue
<script setup>
import { h } from 'vue';
// 注意：必须返回 VNode（<component :is> 不支持纯字符串）；根节点用 flex 而非 inline-flex，
// 否则 inline-flex 在 line box 中因 baseline 对齐导致 checkbox 与文字 1px 垂直偏差
const renderIconLabel = (option) =>
  h('span', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
    h(option.icon), option.label,
  ]);
// renderTag 只收到 { value, label }，自定义字段需按 value 从原始数据回查
const renderIconTag = (option, onClose) =>
  h('span', { onClick: onClose }, [h(findIcon(option.value)), option.label]);
</script>
<template>
  <OSelect v-model="value" :options="iconOptions" :render-label="renderIconLabel" />
  <OSelect v-model="values" multiple :options="iconOptions" :render-tag="renderIconTag" />
  <!-- 插槽等价形式：#option-label 在 OOption 内部渲染，保留点击/键盘/无障碍能力，无需手动绑事件 -->
  <OSelect v-model="value" :options="iconOptions">
    <template #option-label="{ option, selected }">
      <span :style="{ display: 'flex', alignItems: 'center', gap: '8px', outline: selected ? '1px solid' : 'none' }">
        <component :is="option.icon" /> {{ option.label }}
      </span>
    </template>
  </OSelect>
</template>
```

**场景 10：受控搜索词**
适用于：外部需要读取/重置搜索框内容
```vue
<OSelect v-model="value" :options="options" filterable v-model:input-value="keyword" />
<!-- retain-input-value：关闭下拉时保留搜索词（默认 false 清空；受控模式下组件不代为清空） -->
<OSelect v-model="value" :options="options" filterable retain-input-value />
```

**场景 11：文字变体**
适用于：紧凑的行内选择
```vue
<OSelect v-model="value" variant="text">
  <OOption label="中文" value="zh" />
  <OOption label="English" value="en" />
</OSelect>
```

**场景 12：表单提交与 SEO（name / itemprop）**
适用于：传统表单提交、结构化数据。属性绑定到组件内部隐藏的原生 `<select>`（始终渲染，视觉零影响），无需额外配置
```vue
<OSelect v-model="value" :options="options" name="dept" itemprop="department" />
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础单选 | `v-model` + `placeholder` | 最常见 |
| 数据驱动 | `:options`（+ `fieldNames`） | 替代手写 OOption，后端字段免转换 |
| 多选 | `multiple` + `clearable` | 标签模式 |
| 限制标签数 | `multiple` + `:max-tag-count`（数字 / `'responsive'`） | 固定折叠 / 随容器宽度自适应 |
| 数量上限 | `multiple` + `:limit` + `@exceed-limit` | 超限未选项自动禁用 |
| 本地搜索 | `filterable`（+ `filterOption` / `filterSort`） | 默认 label 包含匹配 |
| 远程搜索 | `filterable` + `:filter-option="false"` + `@search` + `:loading` | 防抖自管（`useDebounceFn`） |
| 大数据 | `:options` + `:virtual="true"`（+ `virtualListProps.itemSize`） | 虚拟滚动，仅 options 驱动 |
| 创建选项 | `filterable` + `allow-create`（+ `tokenSeparators` / `autoTagInMultiple`） | 创建项持久化 |
| 异步回显 | `:fallback-option` | 值不在列表时兜底显示 |
| 富内容选项 | `renderLabel` 或 `#option-label` | 插槽优先；label 保持纯字符串 |
| 富内容标签 | `renderTag`（多选） | 只收 `{ value, label }`，自定义字段按 value 回查 |
| 受控搜索词 | `filterable` + `v-model:input-value` | 配合 `retain-input-value` |
| 纯文字 | `variant="text"` | 无边框 |
| 禁用响应式 | `no-responsive` | 移动端（≤840px）也用 Popup，搜索/创建能力生效 |
| 表单统一管控 | 放入 OForm，通过表单级 `disabled`/`size`/`round`/`clearable` 下发 | 控件自身设置优先，详见 [OForm 表单级统一管控](form.usage.md) |
| 表单提交 / GEO | `name` / `itemprop` | 绑定内部隐藏原生 select |

---

### OSelect Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| modelValue | `SelectValueT` | — | — | 选中值（v-model 双向绑定）。单选时为 string 或 number；多选时为数组。单选收到数组时取最后一个元素。 | — |
| defaultValue | `SelectValueT` | — | — | 非受控模式下的默认值。 | — |
| size | `SizeT` | `'small'` / `'medium'` / `'large'` | 继承表单容器 | 选择器尺寸。未设置时继承表单容器。 | — |
| round | `RoundT` | `'pill'` / CSS 值 | 继承表单容器 | 圆角值。未设置时继承表单容器。 | — |
| color | `Color2T` | `'normal'` / `'success'` / `'warning'` / `'danger'` | `'normal'` | 选择器颜色。 | — |
| variant | `VariantT` | `'solid'` / `'outline'` / `'text'` | `'outline'` | 选择器样式。 | — |
| placeholder | `string` | — | — | 占位文本 | — |
| multiple | `boolean` | — | `false` | 是否支持多选。开启后选中值为数组，选项以标签形式展示。 | — |
| maxTagCount | `number \| 'responsive'` | — | — | 多选标签最大显示数量。数字 = 固定显示前 N 个、其余折叠 `+N...`；`'responsive'` = ResizeObserver 监听容器宽度动态计算（变窄折叠、变宽展开；SSR 下保守渲染全部标签，客户端水合后再折叠）。仅多选可用。 | —（`'responsive'` @1.2.7） |
| foldLabel | `(tags: SelectOptionT[]) => string` | — | — | 自定义折叠文案函数，收到折叠部分的 `{ value, label }[]`。默认 `` `+N...` ``。 | — |
| showFoldTags | `boolean \| 'hover' \| 'click'` | — | `'hover'` | 折叠标签弹出层的查看方式（字符串值作为 OPopover trigger）；`false` 时折叠指示器整体不渲染。 | — |
| clearable | `boolean` | — | 继承表单容器 | 可清空。 | — |
| disabled | `boolean` | — | 继承表单容器 | 是否禁用。 | — |
| options | `SelectMixedOption[]` | — | — | 数据驱动的选项数组（扁平或分组结构）。与 default 插槽同时存在时插槽优先、options 被忽略并输出警告。 | 1.2.7 |
| fieldNames | `SelectFieldNames` | — | — | 自定义 options 的字段名映射（value/label/disabled/children），与默认字段名浅合并；分组 label/children 亦可定制。仅 options 模式生效。 | 1.2.7 |
| filterable | `boolean` | — | `false` | 是否可搜索过滤。插槽模式下不生效（输出警告）；移动端响应式模式（≤840px）下搜索 input 不渲染、此能力不生效。 | 1.2.7 |
| filterOption | `boolean \| (inputValue, option) => boolean` | — | `true` | 过滤规则：`true` 内置 label 包含匹配（不区分大小写）；`false` 关闭本地过滤（远程搜索用）；传函数自定义匹配。`filterMethod` 优先级更高。 | 1.2.7 |
| filterMethod | `(query: string) => void` | — | — | **通知式回调**：输入变化时调用（副作用），本地不做任何过滤、原样返回列表，由业务自行更新 options 数据。优先级高于 `filterOption`。 | 1.2.7 |
| filterSort | `(a, b) => number` | — | — | 过滤结果排序函数（类似 Array.sort）。分组时 children 内部排序，顶层分组间比较返回 0（保持原序）。 | 1.2.7 |
| inputValue | `string`（v-model:inputValue） | — | — | 受控搜索词。受控优先于内部值；受控时关闭面板组件不代为清空。 | 1.2.7 |
| retainInputValue | `boolean` | — | `false` | 关闭下拉时是否保留搜索词（默认清空）。仅作用于非受控搜索词。 | 1.2.7 |
| allowCreate | `boolean` | — | `false` | 输入不存在选项时快速创建，**依赖 `filterable`**。创建项持久化到选项列表；移动端响应式模式下不生效。 | 1.2.7 |
| createLabel | `(input: string) => string` | — | — | 自定义创建项文案（不传走 i18n 默认「创建 xxx」）。 | 1.2.7 |
| autoTagInMultiple | `boolean` | — | `false` | 多选模式下自动开启 tag 创建行为（回车直接转标签）。需显式开启；移动端不生效。 | 1.2.7 |
| tokenSeparators | `string[]` | — | `[]` | 分词分隔符数组，输入或粘贴含分隔符时自动拆分批量创建。**需 `multiple` + `allowCreate`**；支持中文逗号等多字节分隔符；IME 组合输入中不触发。 | 1.2.7 |
| virtual | `boolean` | — | `false` | 虚拟滚动渲染选项。**仅 options 数据驱动可用**（插槽模式下显示空态）。可与多选/搜索/创建/自定义渲染组合。 | 1.2.7 |
| virtualListProps | `Partial<typeof virtualListProps>` | — | — | 透传 OVirtualList 配置（`itemSize`（数字=定高性能最佳）/ `buffer` / `threshold` 等）；移动端自动覆盖滚动条为 never。 | 1.2.7 |
| limit | `number` | — | `0` | 多选数量上限，`0` 不限制。达上限后未选项自动禁用（视觉/aria 层面，仍可点击以触发 `exceed-limit`）。 | 1.2.7 |
| fallbackOption | `boolean \| (value) => SelectOptionData` | — | `false` | 选中值不在选项列表时的显示兜底：`true` 用 value 作为 label；传函数返回 option（**仅消费其 `label`** 补充映射）。兜底项不出现在下拉列表。 | 1.2.7 |
| renderLabel | `(option, selected) => VNodeChild` | — | — | 自定义选项 label 渲染（下拉项与选中值回显；单选 overlay 中 selected 恒为 true）。收到的 option 保留自定义字段。与 `#option-label` 插槽同时存在时插槽优先；与 default 插槽同用时被忽略（警告）。 | 1.2.7 |
| renderTag | `(option, onClose) => VNodeChild` | — | — | 多选自定义已选标签渲染。**只收到 `{ value, label }`，不含自定义字段**，需按 value 从原始数据回查；`onClose` 由组件注入，调用即移除对应 tag。 | 1.2.7 |
| loading | `boolean` | — | `false` | 加载中 | — |
| trigger | `PopupTriggerT` | — | `'click'` | 选项面板触发方式。 | — |
| optionPosition | `PopupPositionT` | — | `'bl'` | 选项面板弹出位置。 | — |
| optionWidthMode | `OptionWidthModeT` | `'auto'` / `'min-width'` / `'width'` | `'min-width'` | 选项面板宽度模式。 | — |
| optionWrapClass | `string \| object \| array` | — | — | 选项面板自定义类名。 | — |
| unmountOnHide | `boolean` | — | `true` | 面板隐藏时是否销毁 DOM。 | — |
| scrollbar | `Partial<BaseScrollerPropsT>` | — | — | 滚动条配置（原名 scroller，v0.0.69 改名） | @since 0.0.69（改名） |
| optionsWrapper | `string \| HTMLElement` | — | `'body'` | 选项面板挂载容器。 | — |
| optionTitle | `string` | — | — | 移动端面板标题（ODialog header）。 | — |
| noResponsive | `boolean` | — | `false` | 禁用移动端响应式（≤840px 面板变为 ODialog）。设 `true` 后移动端仍用 Popup，搜索/创建/分词能力生效。 | — |
| beforeSelect | `(value, currentValue) => boolean \| Promise \| any` | — | — | 选择前回调（单/多选均调用）。返回 `false` 中止；**非布尔返回值替换本次选中值**。第二参数为本次选择前的当前值。 | — |
| beforeOptionsShow / beforeOptionsHide | `() => Promise<boolean> \| boolean` | — | — | 面板显示 / 隐藏前回调。 | — |
| transition | `string` | — | — | 选项面板的过渡动画名称。 | — |
| name | `string` | — | — | 表单字段名，绑定到内部隐藏的原生 `<select>`，供传统表单提交。 | 1.2.7 |
| itemprop | `string` | — | — | Schema.org itemprop，绑定到内部隐藏原生 select，供结构化数据 / GEO 爬虫读取。 | 1.2.7 |

---

### OOption Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| label | `string` | — | `''` | 显示文本（falsy 时回退 `${value}`）。保持纯字符串供过滤匹配与读屏 |
| value | `string \| number` | — | `''` | 选项值 |
| disabled | `boolean` | — | `false` | 禁用该选项（**直接阻止点击**，与 limit 禁用不同——limit 禁用仍可点击以触发 `exceed-limit`） |
| indeterminate | `boolean` | — | `false` | 多选模式下是否为半选状态（复选框样式） |

> 数据驱动模式下 OOption 由 OSelect 内部渲染并自动透传原始自定义字段（`raw`）；OOption 组件仍可用于插槽式写法。

---

### OOptionGroup Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| name | `string` | — | — | 分组名称（必填） |

---

### OOptionGroup Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| name | — | 始终 | 替换分组标题。默认显示 name 属性的文本。 | 显示 name 属性文本 |
| default | — | 始终 | 放置分组内的 OOption 组件。 | 无 |

---

### OSelect Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 手写 OOption/OOptionGroup 选项。存在时优先于 `options` 数据（options 被忽略并警告）；`virtual` 模式下不渲染。 | 空数据提示 |
| prefix | — | 始终 | 选择框前缀区域（箭头左侧）。 | 无 |
| option-label | `{ option, selected }` | 始终 | 自定义下拉选项与选中值回显的 label 渲染（`option` 保留自定义字段；输入框回显处 `selected` 恒为 true）。在 OOption 内部渲染，保留点击/键盘/无障碍能力。与 `renderLabel` 同时存在时插槽优先。 | 默认 label 文本 |
| group-label | `{ item }` | 数据驱动有分组时 | 自定义分组标题渲染。**item 结构随模式变化**：非虚拟为 `SelectOptionGroupData`（含 children），虚拟为 `SelectVirtualItem`（`type: 'group-header'`，仅 label/groupKey，无 children）。 | 分组 label 文本 |
| arrow | `{ active: boolean }` | 始终 | 替换下拉箭头图标。 | `<IconChevronDown />` |
| suffix | `{ active: boolean }` | 始终 | 选择框后缀区域，位于箭头右侧。 | 无 |
| tag-fold | — | 多选且有折叠标签时 | 多选折叠标签的显示内容。默认显示 `foldLabel` 计算的 `+N...` 文本。 | `+N...` 文本 |
| empty | — | 无选项时 | 无选项时的空数据提示内容。 | 国际化空文本 |
| action | — | 始终 | 选项面板底部操作区域。 | 无 |

---

### 暴露方法

| 方法名 | 参数 | 说明 | 引入版本 |
|--------|------|------|--------|
| focus() | — | 聚焦内部 input（自动指向当前渲染的那个：主 input 与多选 tag 内联 input 互斥渲染） | 1.2.7 |
| blur() | — | 移除内部 input 焦点 | 1.2.7 |
| scrollTo(target) | `number \| { index?: number; key?: string \| number }` | 编程式滚动到指定选项。`key` = 选项 value；index/key 互斥，同时传以 key 为准。索引基于 options 展平数组（分组头不计入）；**过滤激活时索引与 DOM 可能错位**。虚拟模式走 virtualListRef.scrollToView | 1.2.7 |
| selectRef | — | 选择器根元素引用 | — |
| isSelecting | `Ref<boolean>` | 是否正在选择中（面板展开态） | — |
| virtualListRef | `ComputedRef` | 虚拟列表实例引用（可调用 scrollToView 等），未开启 `virtual` 时为空 | 1.2.7 |

---

### 移动端行为（≤840px，未设 `noResponsive`）

| 维度 | 行为 |
|------|------|
| 选项容器 | OPopup 换为 ODialog 底部弹出（`optionTitle` 作标题） |
| 单选 | 选中立即提交并关闭弹窗 |
| 多选 | **草稿-确认语义**：期间选中值为草稿，弹窗底部「取消 / 确认」按钮——取消恢复原值，确认才派发 change（tag 区不显示草稿值） |
| 搜索 / 创建 / 分词 | 搜索 input 不渲染，`filterable` / `allowCreate` / `autoTagInMultiple` / `tokenSeparators` **全部不生效**；需启用请设 `no-responsive` |
| 触发 | 点击选择框直接打开弹窗（`inputmode="none"` 不唤起键盘） |

### 多选 Tag 状态下的搜索输入

- 多选已有标签时主输入框（`.o-select-input`）**不渲染**，改为 tag 区内联搜索 input（`.o-select-input--tag`），两者互斥——**勿用 querySelector 依赖固定 input 位置**
- 仅 `filterable` 或 `allowCreate` 任一开启时渲染内联 input（两者均关闭时不渲染，避免无意义换行）
- input 宽度随输入内容镜像撑宽（最小 80px）；展开面板自动聚焦，多选首次选中后焦点不丢失；关闭面板即从 DOM 移除（干净收起）

---

### ⚠️ 使用注意事项

- **⚠️ 错误状态 / 必填星号 → 用 OFormItem 包裹**：设计稿中选择框边框变红（错误态）或标签旁有红色星号（必填），应将 OSelect 放入 `<OFormItem>` 实现，**不要**直接设 `color="danger"` 或手写星号。详见 form.usage.md。
- **⚠️ 同用告警（三者均输出开发警告）**：`options` + default 插槽同用 → 忽略 options；`renderLabel` + default 插槽同用 → 忽略 renderLabel；`filterable` 在插槽模式下不生效。
- **⚠️ 虚拟模式仅支持 `:options` 数据驱动**：插槽模式下 `virtual` 显示空态。
- **⚠️ `label` 保持纯字符串**：过滤匹配、输入回显与读屏都依赖它；视觉定制走自定义字段 + `renderLabel`/`#option-label`。
- **⚠️ `renderLabel` 必须返回 VNode** 且根节点用 `display: flex`（inline-flex 在多选 checkbox 的 line box 中因 baseline 对齐产生 1px 垂直偏差）。
- **⚠️ `change` 第二参数与 `renderTag` 只含 `{ value, label }`**：需要自定义字段时从原始 options 数据按 value 回查。
- 大数据量（≥500 项）优先 `:options` + `:virtual`，并给 `virtualListProps.itemSize` 定高。
- `@search` 防抖由调用者实现（推荐 `useDebounceFn`）。

---

### 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| 1.2.7 | 数据驱动（`options`/`fieldNames`，扁平与分组）；搜索过滤（`filterable`/`filterOption`/`filterMethod`/`filterSort`/远程搜索/`inputValue` 受控/`retainInputValue`）；虚拟滚动（`virtual`/`virtualListProps`，仅 options 驱动）；创建选项（`allowCreate`/`createLabel`/`tokenSeparators`/`autoTagInMultiple` + `create` 事件，创建项持久化）；多选增强（`limit` + `exceed-limit`、`maxTagCount='responsive'` 容器自适应折叠（SSR 保守渲染）、`renderTag`、`change` 新增第二参数、`remove-tag` 事件）；自定义渲染（`renderLabel`/`#option-label`/`#group-label`）；无障碍（listbox role 与 aria 属性）与移动端交互适配（ODialog 草稿-确认、搜索/创建能力移动端失效）；表单兜底（`fallbackOption`）；表单提交与 GEO（`name`/`itemprop` 绑定内部原生 select）；暴露 `focus`/`blur`/`scrollTo`/`virtualListRef`；`disabled`/`clearable`/`size`/`round` 接入表单继承；OOption 子组件：支持 `renderLabel` 注入、limit 达上限未选项自动禁用、卸载时自动注销（已选 label 经缓存保留） |
| 1.2.6 | 背景色 CSS 变量从 control5-light/control4-light 改为 fill2；关闭按钮（clear icon）尺寸跟随 `--select-icon-size`；内部改用 defineSlots 替代 useSlots；响应式判定从 isPhonePad 改为 isPhonePadSize |
| 0.0.69 | scrollbar 参数从 `scroller` 改名为 `scrollbar` |
| 0.0.64 | 修复多选 v-model 绑定问题 |
| 0.0.63 | 新增下拉分组（OOptionGroup） |
