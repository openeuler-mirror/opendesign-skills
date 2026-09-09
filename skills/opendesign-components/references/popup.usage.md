> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](popup.visual.md) · [样式定制](popup.style.md)

# OPopup 弹出层 — 代码使用

### 导入方式

```vue
<script setup>
import { OPopup } from '@opensig/opendesign';
</script>
```

---

### 类型定义

```typescript
type PopupPositionT = 'top' | 'tl' | 'tr' | 'bottom' | 'bl' | 'br' | 'left' | 'lt' | 'lb' | 'right' | 'rt' | 'rb';
type PopupTriggerT = 'none' | 'click' | 'click-outclick' | 'hover' | 'hover-outclick' | 'focus' | 'contextmenu';
// 虚拟元素，用于 OTour 等无真实 DOM 的定位场景：仅需提供 getBoundingClientRect 方法
interface VirtualElement {
  getBoundingClientRect(): DOMRect;
}
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| visible | `boolean` | — | — | 弹出层是否可见（v-model 双向绑定）。 | — |
| position | `PopupPositionT` | 12 个方向 | `'top'` | 弹出位置。12 个方向：top/tl/tr/bottom/bl/br/left/lt/lb/right/rt/rb。默认 top。 | — |
| trigger | `PopupTriggerT \| PopupTriggerT[]` | 7 种触发方式 | 触发弹出的方式，可传单个或数组。"click" 点击、"click-outclick" 点击显示/点击外部关闭、"hover" 悬停、"hover-outclick" 悬停显示/点击外部关闭、"focus" 聚焦、"contextmenu" 右键、"none" 不自动触发（手动控制）。默认 click。 | 触发方式 | — |
| target | `string \| ComponentPublicInstance \| HTMLElement` | 触发元素，可传入组件实例、DOM 元素或选择器字符串。也可通过 target 插槽指定。 | `null` | 触发元素 | — |
| targetRect | `VirtualElement` | — | `null` | 目标矩形，**优先级高于 target**。用于 OTour 等无真实 DOM 的定位场景：仅需提供 `getBoundingClientRect()` 返回 DOMRect。传入后跳过 scroll/resize/intersection 监听与 trigger 绑定。 | 1.2.7 |
| disabled | `boolean` | — | `false` | 是否禁用弹出层。 | — |
| wrapper | `string \| HTMLElement` | — | 弹出层挂载容器。默认 "body"。 | 挂载容器 | — |
| offset | `number` | — | `0` | 距触发元素的偏移距离（px）。默认 0。 | — |
| edgeOffset | `number` | — | `0` | 距屏幕边缘的最小偏移量。默认 0。 | — |
| hoverDelay | `number` | — | `100` | hover 事件延迟触发时间（毫秒）。默认 100ms。 | — |
| anchor | `boolean` | — | `false` | 是否计算并显示锚点箭头。默认关闭。 | — |
| anchorClass | `string \| object \| array` | 锚点自定义类名。 | — | 锚点类名 | — |
| unmountOnHide | `boolean` | — | `true` | 隐藏时是否卸载组件。默认开启。 | — |
| wrapClass | `string \| object \| array` | 弹出层外层容器自定义类名。 | — | 容器类名 | — |
| bodyClass | `string \| object \| array` | 弹出层内容体自定义类名。 | — | 内容体类名 | — |
| adjustMinWidth | `boolean` | — | `true` | 弹出层最小宽度是否匹配触发元素宽度。默认开启。 | — |
| adjustWidth | `boolean` | — | `true` | 弹出层宽度是否匹配触发元素宽度。默认开启。 | — |
| transition | `string` | — | `'o-zoom-fade'` | 过渡动画名称。默认 "o-zoom-fade"。 | — |
| autoHide | `boolean` | — | `true` | 点击外部时是否自动隐藏。默认开启。 | — |
| adaptive | `boolean` | — | `true` | 空间不够时是否自动翻转位置。默认开启。 | @since 0.0.75 |
| beforeShow | `() => Promise<boolean> \| boolean` | — | 显示前的回调函数。返回 `false` 取消显示，返回 `true` 或 `undefined`（或 Promise resolve 为 `true`/`undefined`）则继续显示。注意：该函数中不应包含副作用，仅用于判断。 | 显示前回调，返回 false 取消显示。纯函数，不应包含副作用 | — |
| beforeHide | `() => Promise<boolean> \| boolean` | — | 隐藏前的回调函数。返回 `false` 取消隐藏，返回 `true` 或 `undefined`（或 Promise resolve 为 `true`/`undefined`）则继续隐藏。注意：该函数中不应包含副作用，仅用于判断。 | 隐藏前回调，返回 false 取消隐藏。纯函数，不应包含副作用 | — |
| hideWhenTargetInvisible | `boolean` | — | `true` | 触发元素滚出视口时是否自动隐藏。默认开启。 | — |

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:visible | `(val: boolean)` | 显示状态变化时 |
| change | `(val: boolean)` | 显示/隐藏状态变化时 |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 弹出内容 | 无 |
| target | — | 始终 | 触发弹出的目标元素。 | 无 |
| anchor | — | anchor 为 true 时 | 自定义锚点箭头内容。仅在 anchor 属性开启时生效。 | 无（仅显示空箭头容器） |

---

### 典型使用场景与调用模板

**场景 1：基础弹出层**
适用于：自定义弹出交互
```vue
<OPopup position="bottom">
  <div>弹出内容</div>
  <template #target>
    <OButton>点击弹出</OButton>
  </template>
</OPopup>
```

**场景 2：带锚点箭头**
适用于：Tooltip 类交互
```vue
<OPopup trigger="hover" anchor :offset="8" position="top">
  <div>提示文字</div>
  <template #target>
    <span>悬停目标</span>
  </template>
</OPopup>
```

**场景 3：自定义样式**
适用于：覆盖默认外观
```vue
<OPopup wrap-class="my-popup" body-class="my-popup-body">
  <div>自定义内容</div>
  <template #target>
    <OButton>触发</OButton>
  </template>
</OPopup>
```

**场景 4：受控模式**
适用于：程序完全控制
```vue
<script setup>
import { ref } from 'vue';
const visible = ref(false);
</script>
<template>
  <OPopup v-model:visible="visible" trigger="none">
    <div>受控内容</div>
    <template #target>
      <OButton @click="visible = !visible">切换</OButton>
    </template>
  </OPopup>
</template>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 点击弹出 | 默认即可 | click 触发 |
| 悬停提示 | `trigger="hover"` + `anchor` + `:offset="8"` | 类 Tooltip |
| 右键菜单 | `trigger="contextmenu"` | 右键弹出 |
| 手动控制 | `v-model:visible` + `trigger="none"` | 完全受控 |
| 不自适应 | `:adaptive="false"` | 固定位置 |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| 1.2.7 | 新增 | 新增 `targetRect` 属性（`VirtualElement`），支持无实际 DOM 时的定位计算（优先级高于 `target`），供 OTour 等场景使用 |
