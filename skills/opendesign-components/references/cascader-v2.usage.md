> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](cascader-v2.visual.md) · [样式定制](cascader-v2.style.md)

# OCascaderV2 级联选择器（V2） — 代码使用

### 导入方式

```vue
<script setup>
import { OCascaderV2, OCascaderV2Panel } from '@opensig/opendesign';
</script>
```

---

### 插槽层级关系

```
OCascaderV2:
  default（整个下拉面板，替换 OCascaderV2Panel）
  tagFold（折叠 tag 文本，多选折叠时）
  arrow（下拉箭头图标）
  suffix（后缀区域）

OCascaderV2Panel 内部不暴露外部插槽。
OCascaderV2Label 内部使用 OCheckbox/ORadio + OPopover(文本溢出提示)，均为内部组件。
```

---

### 典型使用场景与调用模板

**场景 1：基础单选**
适用于：省市区三级联动等
```vue
<script setup>
import { ref } from 'vue';
const val = ref();
const options = [
  { label: '浙江', value: 'zj', children: [
    { label: '杭州', value: 'hz', children: [
      { label: '西湖', value: 'xh' },
    ] },
  ] },
  { label: '江苏', value: 'js', children: [
    { label: '南京', value: 'nj' },
  ] },
];
</script>
<template>
  <OCascaderV2 v-model="val" :options="options" clearable placeholder="请选择" />
</template>
```

**场景 2：多选**
适用于：多标签筛选
```vue
<script setup>
import { ref } from 'vue';
const val = ref([]);
const options = [
  { label: '前端', value: 'fe', children: [
    { label: 'Vue', value: 'vue' },
    { label: 'React', value: 'react' },
  ] },
];
</script>
<template>
  <OCascaderV2 v-model="val" :options="options" multiple clearable placeholder="请选择多个" />
</template>
```

**场景 3：多选 + maxTagCount**
适用于：多选标签过多时折叠显示
```vue
<script setup>
import { ref } from 'vue';
import type { SelectOptionT } from '@opensig/opendesign';
const val = ref([]);
const foldLabel = (tags: Array<SelectOptionT>) => `还有 ${tags.length} 项`;
</script>
<template>
  <OCascaderV2 v-model="val" :options="options" multiple :max-tag-count="1" :fold-label="foldLabel" show-fold-tags="hover" clearable />
</template>
```

**场景 4：可搜索**
适用于：选项较多需要搜索
```vue
<OCascaderV2 v-model="val" :options="options" filterable clearable placeholder="输入搜索" />
```

**场景 5：emitPath 路径模式**
适用于：需要完整路径数据
```vue
<!-- 单选 emitPath=true: val = ['zj', 'hz', 'xh'] -->
<OCascaderV2 v-model="val" :options="options" emit-path clearable />
<!-- 多选 emitPath=true: val = [['zj', 'hz', 'xh'], ...] -->
<OCascaderV2 v-model="val" :options="options" multiple emit-path clearable />
```

**场景 6：hover 展开**
适用于：层级深节点密集的场景
```vue
<OCascaderV2 v-model="val" :options="options" expand-trigger="hover" clearable />
```

**场景 7：任意层级选中**
适用于：非叶子节点也需要作为独立选中项
```vue
<OCascaderV2 v-model="val" :options="options" allow-select-any-node clearable />
```

**场景 8：选择前拦截**
适用于：选中前需要确认或改写
```vue
<script setup>
const beforeSelect = (value, currentValue) => {
  if (value === 'blocked') return false; // 阻止
  if (value === 'rewrite') return 'new-value'; // 改写
  return true; // 放行
};
</script>
<template>
  <OCascaderV2 v-model="val" :options="options" :before-select="beforeSelect" clearable />
</template>
```

**场景 9：懒加载**
适用于：选项数据异步获取
```vue
<script setup>
import { ref } from 'vue';
const val = ref();
const lazyload = (node, resolve, reject) => {
  if (node.value === null) {
    // 根节点
    setTimeout(() => resolve([{ value: '1', label: 'Option 1', leaf: false }]), 800);
  } else {
    // 子节点
    setTimeout(() => resolve([{ value: '1-1', label: 'Sub 1-1', leaf: true }]), 800);
  }
};
</script>
<template>
  <OCascaderV2 v-model="val" lazy :lazyload="lazyload" clearable placeholder="请选择" @lazyload-error="(node) => console.log('加载失败', node)" />
</template>
```

**场景 10：Panel 独立使用**
适用于：面板直接嵌入页面
```vue
<script setup>
import { OCascaderV2Panel } from '@opensig/opendesign';
</script>
<template>
  <OCascaderV2Panel v-model="val" :options="options" size="large" />
</template>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础单选 | `v-model` + `options` + `clearable` | 最常见用法 |
| 多选 | `v-model` + `options` + `multiple` + `clearable` | 多选标签模式 |
| 多选折叠 | `v-model` + `options` + `multiple` + `maxTagCount` + `foldLabel` | 标签过多时 |
| 可搜索 | `v-model` + `options` + `filterable` | 搜索筛选 |
| 路径值 | `v-model` + `options` + `emitPath` | 返回完整路径 |
| hover 展开 | `v-model` + `options` + `expandTrigger="hover"` | 悬停展开子级 |
| 任意节点 | `v-model` + `options` + `allowSelectAnyNode` | 非叶子可选 |
| 懒加载 | `v-model` + `lazy` + `lazyload` | 异步加载选项 |
| 拦截选中 | `v-model` + `options` + `beforeSelect` | 选中前确认 |
| 表单内 | `v-model` + `options` + OFormItem 包裹 | 自动继承校验 |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| 1.2.4 | 新增 | OCascaderV2 / OCascaderV2Panel / OCascaderV2Label 组件首次发布，支持单选/多选/可搜索/懒加载/选择前拦截/路径值/任意层级选中 |

---

### OCascaderV2 Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 引入版本 | 说明 |
|--------|------|--------|--------|---------|------|
| modelValue | `CascaderV2ValueT` | — | — | 1.2.4 | 选中值。形态由 emitPath + multiple 组合决定： - 单选 + emitPath=false → 叶子 value（string\|number） - 单选 + emitPath=true → 从根到叶子的路径数组 - 多选 + emitPath=false → 叶子 value 数组 - 多选 + emitPath=true → 路径数组 的数组 |
| options | `Array<CascaderV2OptionT>` | — | — | 1.2.4 | 级联选项树数据，每项 `{ value: string\|number, label?: string, children?: Array<CascaderV2OptionT>, disabled?: boolean, leaf?: boolean }`。value 必填，children 存在时可展开下一级。 |
| size | `'large' | 'medium'` | — | `'large'` | 选择框尺寸。"large" 大号（默认）、"medium" 中号。不支持 small。 | 选择框尺寸 |
| round | `RoundT` | `'pill'` / CSS值 | — | 1.2.4 | 圆角值。"pill" 全圆角胶囊形，或自定义 CSS 值。 |
| color | `'normal' | 'success' | 'warning' | 'danger'` | 选择框颜色。"normal" 默认、"success" 成功、"warning" 警告、"danger" 危险。OForm 内自动继承校验状态。默认 normal。 | `'normal'` | 1.2.4 | 颜色（OForm 内自动继承） |
| variant | `'outline' | 'solid' | 'text'` | — | 选择框类型。"outline" 有边框轮廓（默认）、"solid" 实心填充、"text" 无边框。 | 1.2.4 | 选择框类型 |
| disabled | `boolean` | — | — | 1.2.4 | 整体禁用，不可交互。默认继承 select 的 disabled 配置。 |
| loading | `boolean` | — | — | 1.2.4 | 加载中状态，显示旋转加载图标，不可交互。默认继承 select 的 loading 配置。 |
| clearable | `boolean` | — | — | 1.2.4 | 可一键清空。开启后悬停时显示清除图标（IconClose）替换下拉箭头。默认继承 select 的 clearable 配置。 |
| multiple | `boolean` | — | — | 1.2.4 | 多选模式。开启后选项使用 OCheckbox 渲染，选中值以 tag 展示在输入框内。默认继承 select 的 multiple 配置（false）。 |
| placeholder | `string` | — | — | 1.2.4 | 选择框提示文本。默认继承 select 的 placeholder 配置。 |
| filterable | `boolean` | — | `false` | 1.2.4 | 可搜索。开启后输入框变为可编辑输入，输入关键词自动筛选匹配的叶子节点（allowSelectAnyNode=true 时搜索所有层级）。关键词高亮显示（primary 色 + font-weight:600）。默认关闭。 |
| maxTagCount | `number` | — | — | 1.2.4 | 多选标签最大显示数量。超出部分折叠为 +N。默认不限制。 |
| foldLabel | `(tags: Array<SelectOptionT>) => string` | — | — | 1.2.4 | 自定义折叠文本。接收折叠的 tag 数组，返回字符串。默认显示 `+N`。 |
| showFoldTags | `boolean | 'hover' | 'click'` | — | 折叠 tag 的展开方式。true/hover（默认）悬停展开、click 点击展开、false 不展开。折叠 tag 通过 OPopover 浮层展示。 | 1.2.4 | 折叠 tag 展开方式 |
| beforeSelect | `CascaderV2BeforeSelectFn` | — | — | 1.2.4 | 选择前拦截回调。接收 `(value, currentValue)` 返回 true/false/string\|number/Promise。true 放行、false 阻止、返回新值改写选中项、Promise 支持异步确认。 |
| transition | `string` | — | — | 1.2.4 | 浮层过渡动画 |
| unmountOnHide | `boolean` | — | `true` | 1.2.4 | 关闭浮层时卸载所有选项 DOM。默认 true。 |
| optionPosition | `PopupPositionT` | `'bl'`/`'tl'`/`'tr'`/`'bottom'`/`'br'` 等 | `'bl'` | 1.2.4 | 浮层位置。"bl" 左下（默认）、"tl"/"tr"/"bottom"/"br"/"left"/"right" 等所有 PopupPositionT 值。 |
| optionsWrapper | `string | HTMLElement | null` | — | 浮层挂载容器。默认 "body"，可传 HTMLElement 或 null。 | 1.2.4 | 浮层挂载容器 |
| trigger | `PopupTriggerT` | `'click-outclick'` 等 | `'click-outclick'` | 1.2.4 | 选项浮层触发方式。"click-outclick"（默认）点击打开外部点击关闭、支持 OPopup 所有 trigger 值。 |
| optionWidthMode | `'auto' | 'min-width' | 'width'` | — | 浮层宽度模式。"auto" 自适应（默认）、"min-width" 最小宽度与选择框一致、"width" 宽度与选择框一致。 | 1.2.4 | 浮层宽度模式 |
| beforeOptionsShow | `() => Promise<boolean> | boolean` | — | — | 浮层显示前回调，返回 false 阻止显示。 | 浮层显示前回调 |
| beforeOptionsHide | `() => Promise<boolean> | boolean` | — | — | 浮层隐藏前回调，返回 false 阻止隐藏。filterable 模式下点击 InBox 内部自动阻止关闭。 | 浮层隐藏前回调 |
| pathMode | `boolean` | — | `false` | 1.2.4 | Panel 内部事件派发时是否使用路径模式。与 emitPath 对应，用于 OCascaderV2Panel 独立使用场景。默认 false。 |
| expandTrigger | `'click' | 'hover'` | — | `'click'` | 次级菜单展开触发方式。"click" 点击展开（默认）、"hover" 鼠标悬停展开。触控设备强制降级为 click。 | 展开触发方式 |
| showAllLevels | `boolean` | — | `true` | 1.2.4 | 输入框中是否显示完整路径（如"浙江省 / 杭州 / 西湖"）。true 显示全路径，false 只显示当前层级 label。默认 true。 |
| emitPath | `boolean` | — | `true` | 1.2.4 | 选中值是否返回路径数组。true 时 change/update:modelValue 返回完整路径，false 时只返回叶子值。默认 true。 |
| allowSelectAnyNode | `boolean` | — | `false` | 1.2.4 | 是否允许选中任意层级节点。false（默认）时仅叶子节点可选中，父节点显示半选/全选汇总态；true 时任意节点可独立选中。单选模式下 allowSelectAnyNode=true 时使用 ORadio 渲染，false 时无 Radio/Checkbox。 |
| lazy | `boolean` | — | `false` | 1.2.4 | 是否启用懒加载。开启后 options 最初可为空/仅根级，通过 lazyload 动态加载子节点。默认 false。 |
| lazyload | `CascaderV2LazyloadFn` | — | — | 1.2.4 | 懒加载回调。接收 `(node, resolve, reject)` 或返回 Promise。node 包含 `{ value, level, isLeaf, data, path, label }`（根节点 value 为 null）。resolve 传入子节点数组，reject 失败回调。 |

---

### OCascaderV2Panel Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 引入版本 | 说明 |
|--------|------|--------|--------|---------|------|
| modelValue | `CascaderV2ValueT` | — | `''` | 1.2.4 | 选中值。形态由 emitPath + multiple 组合决定： - 单选 + emitPath=false → 叶子 value（string\|number） - 单选 + emitPath=true → 从根到叶子的路径数组 - 多选 + emitPath=false → 叶子 value 数组 - 多选 + emitPath=true → 路径数组 的数组 |
| options | `Array<CascaderV2OptionT>` | — | — | 1.2.4 | 级联选项树数据，每项 `{ value: string\|number, label?: string, children?: Array<CascaderV2OptionT>, disabled?: boolean, leaf?: boolean }`。value 必填，children 存在时可展开下一级。 |
| pathMode | `boolean` | — | `false` | 1.2.4 | Panel 内部事件派发时是否使用路径模式。与 emitPath 对应，用于 OCascaderV2Panel 独立使用场景。默认 false。 |
| expandTrigger | `'click' | 'hover'` | — | `'click'` | 次级菜单展开触发方式。"click" 点击展开（默认）、"hover" 鼠标悬停展开。触控设备强制降级为 click。 | 展开触发方式 |
| size | `'large' | 'medium'` | — | `'large'` | 选择框尺寸。"large" 大号（默认）、"medium" 中号。不支持 small。 | 面板尺寸 |
| showAllLevels | `boolean` | — | `true` | 1.2.4 | 输入框中是否显示完整路径（如"浙江省 / 杭州 / 西湖"）。true 显示全路径，false 只显示当前层级 label。默认 true。 |
| filterable | `boolean` | — | — | 1.2.4 | 可搜索。开启后输入框变为可编辑输入，输入关键词自动筛选匹配的叶子节点（allowSelectAnyNode=true 时搜索所有层级）。关键词高亮显示（primary 色 + font-weight:600）。默认关闭。 |
| lazy | `boolean` | — | `false` | 1.2.4 | 是否启用懒加载。开启后 options 最初可为空/仅根级，通过 lazyload 动态加载子节点。默认 false。 |
| lazyload | `CascaderV2LazyloadFn` | — | — | 1.2.4 | 懒加载回调。接收 `(node, resolve, reject)` 或返回 Promise。node 包含 `{ value, level, isLeaf, data, path, label }`（根节点 value 为 null）。resolve 传入子节点数组，reject 失败回调。 |

---

### Events 表（OCascaderV2）

| 事件名 | 参数 | 引入版本 | 触发时机 |
|--------|------|---------|---------|
| update:modelValue | `CascaderV2NodeValueT | CascaderV2NodePathT | v-model 值更新，形态随 emitPath/multiple 变化。 | undefined` | 1.2.4 | v-model 值更新 |
| change | 同 update:modelValue | 1.2.4 | 选中值变化，参数与 update:modelValue 一致。 |
| options-visible-change | `(visible: boolean)` | 1.2.4 | 浮层显示/隐藏切换，参数 boolean。 |
| clear | `(evt: Event)` | 1.2.4 | 清空按钮点击，参数原始 DOM Event。 |
| lazyload-error | `(node: CascaderV2LazyNodeT)` | 1.2.4 | 懒加载失败，参数 CascaderV2LazyNodeT 节点信息。 |

---

### Slots 表（OCascaderV2）

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 自定义整个下拉面板内容，替换 OCascaderV2Panel。 | OCascaderV2Panel |
| tagFold | — | 多选折叠 tag 时 | 自定义折叠 tag 文本，替换默认 `+N`。 | `+N` |
| arrow | `{ active: boolean }` | 始终 | 自定义下拉箭头图标，Slot Props `{ active: boolean }` 表示面板是否展开。 | IconChevronDown（active 时旋转180°） |
| suffix | `{ active: boolean }` | 始终 | 自定义后缀区域，Slot Props `{ active: boolean }`。 | 无 |
