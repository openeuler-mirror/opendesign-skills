> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](scrollbar.visual.md) · [样式定制](scrollbar.style.md)

# OScrollbar 滚动条 — 代码使用

### 导入方式

```vue
<script setup>
import { OScrollbar, OScroller } from '@opensig/opendesign';
</script>
```

> OScrollbar：挂载到已有滚动容器上的滚动条。
> OScroller：自带滚动容器的组合组件（容器 + 滚动条）。

---

### 典型使用场景与调用模板

**场景 1：为已有容器添加滚动条**
适用于：已有滚动容器需要美化滚动条
```vue
<script setup>
import { ref } from 'vue';
const container = ref();
</script>
<template>
  <div ref="container" style="height: 300px; overflow: auto; position: relative;">
    <div style="height: 1000px;">长内容</div>
    <OScrollbar :target="container" :disabled-x="true" show-type="always" />
  </div>
</template>
```

**场景 2：使用 OScroller 一体化组件**
适用于：新建滚动区域
```vue
<OScroller style="height: 300px;" show-type="always">
  <div style="height: 1000px;">长内容</div>
</OScroller>
```

**场景 3：小号悬停显示**
适用于：空间紧凑的区域
```vue
<OScrollbar :target="container" size="small" show-type="hover" />
```

**场景 4：关联 body 滚动**
适用于：全局页面滚动条
```vue
<OScrollbar target="body" show-type="always" />
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 始终可见 | `show-type="always"` | 一直显示 |
| 滚动时显示 | `show-type="auto"`（默认） | 滚动后自动隐藏 |
| 悬停显示 | `show-type="hover"` + `size="small"` | 紧凑悬停 |
| 仅纵向 | `:disabled-x="true"` | 隐藏横向 |
| body 滚动条 | `target="body"` | 全页滚动 |

---

### OScrollbar Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| target | `HTMLElement \| ComponentPublicInstance \| string` | 滚动条关联的滚动容器。可传入 HTMLElement、组件实例或 "body" 字符串。滚动条会根据该容器的滚动状态同步更新。 | `null` | 关联的滚动容器 | — |
| size | `ScrollerSizeT` | `'medium'` / `'small'` | `'medium'` | 滚动条粗细。"medium" 中号（6px，悬停 10px）、"small" 小号（3px，悬停 6px）。默认 medium。 | — |
| showType | `string` | `'auto'` / `'always'` / `'hover'` / `'never'` | `'auto'` | 滚动条何时可见。"auto" 滚动时和悬停时显示、"always" 一直显示、"hover" 仅悬停容器时显示、"never" 不显示。默认 auto。 | — |
| duration | `number` | — | `600` | 滚动停止后滚动条持续显示的时间（毫秒）。默认 600ms。 | — |
| disabledX | `boolean` | — | `false` | 隐藏横向滚动条 | — |
| disabledY | `boolean` | — | `false` | 隐藏纵向滚动条 | — |
| autoUpdateOnScrollSize | `boolean` | — | `false` | showType 为 always 时，是否根据滚动内容高度变化自动刷新滚动条。 | — |
| barClass | `string \| object \| array` | 滚动条自定义类名。 | — | 自定义类名 | @since 1.2.0 |

---

### OScroller Props 表

OScroller 继承 OScrollbar 的所有 props（除 target），额外支持：

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| wrapClass | `string \| object \| array` | — | — | 滚动容器类名 | — |

---

### OScroller Events 表

| 事件名 | 参数 | 触发时机 | 引入版本 |
|--------|------|---------|--------|
| scroll | `(event: Event)` | 滚动容器滚动时 | @since 1.2.0 |

---

### OScrollbar Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| thumb | — | 始终 | 滚动条滑块 | 默认滑块 |
| track | — | 始终 | 滚动条轨道 | 默认轨道 |

---

### OScroller Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 滚动容器内容 | 无 |
| thumb | — | 始终 | 滚动条滑块 | 默认滑块 |
| track | — | 始终 | 滚动条轨道 | 默认轨道 |

---

### OScrollbar 暴露方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| update() | — | 手动刷新滚动条状态 |

---

### OScroller 暴露方法

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| scrollTo(options?) | `ScrollToOptions` | — | 滚动到指定位置 |
| scrollBy(options) | `ScrollToOptions` | — | 按偏移量滚动（@since 1.2.4） |
| getContainerEl() | — | `HTMLElement \| null` | 获取滚动容器 DOM 元素 |
