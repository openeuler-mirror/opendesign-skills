> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](tab.visual.md) · [样式定制](tab.style.md)

# OTab 标签页 — 代码使用

### 导入方式

```vue
<script setup>
import { OTab, OTabPane } from "@opensig/opendesign";
</script>
```

---

### 类型定义

```typescript
type TabVariantT = "solid" | "text" | "button";
type SizeT = "large" | "medium" | "small";
```

---

### Events 表

| 事件名            | 参数                                                     | 触发时机     | 引入版本 |
| ----------------- | -------------------------------------------------------- | ------------ | -------- |
| update:modelValue | `(value: string \| number)`                              | 选中值变化时 | —        |
| change            | `(value: string \| number, oldValue?: string \| number)` | 切换页签后   | —        |
| delete            | `(value: string \| 删除页签时触发。可获取被删除页签的值。 | 删除页签时   | —        |
| add               | `(evt: MouseEvent)`                                      | 点击添加按钮 | —        |

---

### Slots 表

**OTab 插槽：**

| 插槽名  | Slot Props | 触发条件          | 替换范围   | 回退内容   |
| ------- | ---------- | ----------------- | ---------- | ---------- |
| default | —          | 始终              | 面板区域   | 无         |
| prefix  | —          | 有插槽时          | 导航栏左侧 | 无         |
| suffix  | —          | 有插槽时          | 导航栏右侧 | 无         |
| anchor  | —          | variant="text" 时 | 指示线     | 默认滑动线 |

**OTabPane 插槽：**

| 插槽名  | Slot Props | 触发条件   | 替换范围 | 回退内容                |
| ------- | ---------- | ---------- | -------- | ----------------------- |
| default | —          | 面板挂载时 | 面板内容 | 无                      |
| nav     | —          | 始终       | 导航标签 | `label \|\| value` 文字 |

---

### 典型使用场景与调用模板

**场景 1：基础标签页**
适用于：内容区域切换

```vue
<script setup>
import { ref } from "vue";
const activeTab = ref("tab1");
</script>
<template>
  <OTab v-model="activeTab">
    <OTabPane value="tab1" label="标签一">内容一</OTabPane>
    <OTabPane value="tab2" label="标签二">内容二</OTabPane>
    <OTabPane value="tab3" label="标签三">内容三</OTabPane>
  </OTab>
</template>
```

**场景 2：按钮风格**
适用于：工具栏式切换

```vue
<OTab v-model="activeTab" variant="button" round="pill">
  <OTabPane value="all" label="全部" />
  <OTabPane value="published" label="已发布" />
  <OTabPane value="draft" label="草稿" />
</OTab>
```

**场景 3：自定义导航标签**
适用于：图标+文字的复杂导航

```vue
<OTab v-model="activeTab">
  <OTabPane value="home">
    <template #nav><OIconHome /> 首页</template>
    首页内容
  </OTabPane>
  <OTabPane value="settings">
    <template #nav><OIconSettings /> 设置</template>
    设置内容
  </OTabPane>
</OTab>
```

**场景 4：可增删页签**
适用于：动态标签页管理

```vue
<script setup>
import { ref } from "vue";
const tabs = ref([{ value: "tab1", label: "标签一" }]);
let count = 1;
const onAdd = () => {
  count++;
  tabs.value.push({ value: `tab${count}`, label: `标签${count}` });
};
const onDelete = (val) => {
  tabs.value = tabs.value.filter((t) => t.value !== val);
};
</script>
<template>
  <OTab addable @add="onAdd" @delete="onDelete">
    <OTabPane
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      :label="tab.label"
      closable
    >
      {{ tab.label }} 的内容
    </OTabPane>
  </OTab>
</template>
```

**场景 5：溢出更多菜单**
适用于：大量标签页需要折叠

```vue
<OTab v-model="activeTab" :max-show="5" more-label="展开更多">
  <OTabPane v-for="i in 10" :key="i" :value="`tab${i}`" :label="`标签 ${i}`">
    内容 {{ i }}
  </OTabPane>
</OTab>
```

**场景 6：懒加载**
适用于：面板内容较重时延迟渲染

```vue
<OTab v-model="activeTab" lazy>
  <OTabPane value="tab1" label="基础信息">基础信息内容</OTabPane>
  <OTabPane value="tab2" label="详细数据" unmount-on-hide>详细数据（每次切走都卸载）</OTabPane>
</OTab>
```

**场景 7：导航栏左对齐**
适用于：页签导航栏需要左对齐而非默认居中（通过 CSS 变量覆盖，无需 `:deep`）

```vue
<OTab v-model="activeTab" class="my-tab">
  <OTabPane label="标签一">内容一</OTabPane>
  <OTabPane label="标签二">内容二</OTabPane>
</OTab>

<style lang="scss">
.my-tab {
  --tab-nav-justify: flex-start;
}
</style>
```

---

### ⚠️ 使用注意事项

- ⚠️ **溢出排查优先级**：当标签出现不符合期望的溢出（如过早折叠到"更多"菜单），应首先排查：
  1. **父容器宽度是否被限制**：如父元素被设置了 `flex`、固定宽度、`max-width` 等，导致 OTab 无法获得足够的自然宽度
  2. **OTab 自身样式是否被修改**：如给 `.o-tab` 设置了 `flex`、`width` 等样式，干扰了组件内部的宽度计算

  排查以上两点后再考虑调整 `maxShow` 等溢出属性。

---

### 常见 prop 组合速查

| 场景         | 推荐 prop 组合                                         | 说明             |
| ------------ | ------------------------------------------------------ | ---------------- |
| 基础文字标签 | `v-model` + `variant="text"`（默认）                   | 最常见           |
| 按钮风格     | `variant="button"` + `round="pill"`                    | 工具栏           |
| 反色按钮     | `variant="button"` + `button-inverse`                  | 深色背景         |
| 可增删       | `addable` + `@add` + `@delete` + `closable`（TabPane） | 动态管理         |
| 溢出折叠     | `:max-show` + `more-label`                             | 大量标签         |
| 延迟渲染     | `lazy`                                                 | 首次激活才渲染   |
| 自定义导航   | OTabPane `#nav` 插槽                                   | 图标+文字        |
| 导航栏左对齐 | `--tab-nav-justify: flex-start`                        | 默认居中，需覆盖 |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| 1.2.5-sp3 / 1.2.7 | fix | 去除移动端溢出时的阴影；scrollActiveIntoView 改用容器 scrollLeft 滚动，避免移动端页面垂直滚动 |
| 1.2.0 | breaking | 内部 DOM 结构修改，支持溢出/数量限制功能 |
| 1.2.0 | feature | 新增 variant button 模式、round、maxShow、moreLabel、line、buttonInverse、headerClass 属性 |
| 1.2.2 | fix | 修复 `--tab-nav-justify` 不生效问题 |
| 1.2.3-sp1 | fix | 修复溢出计算逻辑；修复移动端 SSR 水合错误；修复 lazy 模式导航渲染问题 |
| 1.2.3-sp2 | fix | 再次修复 `--tab-nav-justify` 不生效；修复 teleport 渲染顺序；修复按需导入缺失样式 |
| 1.2.4 | docs | 文档注释改进 |
| 1.2.5-sp1 | fix | 移动端页签溢出改为横向滚动模式，移除 ODialog 依赖；新增 `--tab-nav-ellipsis-shadow-color` 和 `--tab-nav-ellipsis-shadow-gradient` CSS 变量；≤840px 下溢出阴影遮罩宽度扩大为 48px |
| 1.2.6 | fix | 修复 gtPadV 但触摸屏时的溢出气泡显示问题 |

---

### OTab Props 表

| 参数名        | 类型                        | 可选值                             | 默认值      | 说明                    | 引入版本          |
| ------------- | --------------------------- | ---------------------------------- | ----------- | ----------------------- | ----------------- |
| modelValue    | `string \| number`          | —                                  | 当前选中的页签值（v-model 双向绑定）。未设置时默认激活第一个页签。 | 选中页签值（v-model）   | —                 |
| variant       | `TabVariantT`               | `'solid'` / `'text'` / `'button'`  | `'text'`    | 页签风格。"text" 文字型（带底部指示线滑动动画）、"solid" 实心型、"button" 按钮型。默认 text。 | 1.2.0（新增 button） |
| size          | `SizeT`                     | `'large'` / `'medium'` / `'small'` | —           | 页签尺寸。"large" 大号、"medium" 中号、"small" 小号。 | —                 |
| round         | `RoundT`                    | `'pill'` / CSS 值                  | —           | 圆角值。仅 button 模式可用。"pill" 半圆或 CSS 值。 | 1.2.0             |
| lazy          | `boolean`                   | —                                  | `false`     | 该面板是否在首次激活时才渲染（单独设置，优先级高于 OTab 的 lazy）。默认关闭。 | —                 |
| addable       | `boolean`                   | —                                  | `false`     | 是否在导航栏末尾显示添加按钮。默认关闭。 | —                 |
| addInactive   | `boolean`                   | —                                  | `false`     | 新增页签后是否不自动激活。默认关闭（即默认自动激活新页签）。 | —                 |
| maxShow       | `number`                    | —                                  | —           | 最大显示页签数量。超出的页签收入"更多"菜单，桌面端为 Popup 弹出，移动端为横向滚动模式（v1.2.5-sp1 起，溢出页签区域改为横向滚动，移除了对 ODialog 的依赖）。 | 1.2.0             |
| moreLabel     | `string`                    | —                                  | `'更多'`    | 超出时"更多"按钮的文案。默认"更多"。 | 1.2.0             |
| line          | `boolean`                   | —                                  | `true`      | 是否显示底部分隔线。button 模式不可用。默认开启。 | 1.2.0             |
| buttonInverse | `boolean`                   | —                                  | `false`     | button 模式下是否使用反色风格。默认关闭。 | 1.2.0             |
| headerClass   | `string \| object \| array` | 标签导航栏自定义类名。 | —           | 导航栏类名              | 1.2.0             |

---

### OTabPane Props 表

| 参数名        | 类型               | 可选值 | 默认值        | 说明           | 引入版本 |
| ------------- | ------------------ | ------ | ------------- | -------------- | -------- |
| value         | `string \| number` | —      | `undefined`   | 页签标识值     | —        |
| label         | `string`           | —      | `undefined`   | 页签显示标题。未传 value 时用作标识。 | —        |
| transition    | `string`           | —      | `'o-fade-in'` | 页签切换过渡动画名。默认 "o-fade-in"。 | —        |
| disabled      | `boolean`          | —      | `false`       | 是否禁用该页签。默认关闭。 | —        |
| closable      | `boolean`          | —      | `false`       | 是否可删除该页签。开启后页签上出现关闭图标。默认关闭。 | —        |
| lazy          | `boolean`          | —      | `false`       | 该面板是否在首次激活时才渲染（单独设置，优先级高于 OTab 的 lazy）。默认关闭。 | —        |
| unmountOnHide | `boolean`          | —      | `false`       | 隐藏时是否卸载面板内容。默认关闭。 | —        |
