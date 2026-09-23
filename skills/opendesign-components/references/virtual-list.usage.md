> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](virtual-list.visual.md) · [样式定制](virtual-list.style.md)

# OVirtualList 虚拟滚动列表 — 代码使用

### 导入方式

```vue
<script setup>
import { OVirtualList } from '@opensig/opendesign';
</script>
```

---

### 类型定义

```typescript
interface RenderIndexInfo {
  start: number;   // 渲染起始索引（含 buffer）
  end: number;     // 渲染结束索引（含 buffer）
  visible: number; // 可视区域起始索引
  count: number;   // 可视区域项数
}

type Alignment = 'start' | 'end' | 'center' | 'nearest' | number;
type Layout = 'vertical' | 'horizontal';
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| list | `unknown[]` | — | `[]` | 列表数据数组。每项需包含唯一 id。动态追加数据时 id 用于保持滚动位置。必填。 | — |
| itemSize | `number \| ((item: unknown, index: number) => number)` | — | 每项的高度。传数字为定高模式（所有项等高，性能最优）；传函数为按项定高模式（函数接收 item 和 index 参数，返回该项的高度）；不传为不定高模式（运行时通过 ResizeObserver 测量）。 | 项高度。数字=定高；函数=按项定高；不传=不定高 | v1.2.6 重构（原为 number） |
| defaultItemSize | `number` | — | `80` | 不定高模式下每项的预估默认高度。用于初始渲染计算。默认 80。 | — |
| defaultStartIndex | `number` | — | `0` | 初始滚动到第几项。默认 0（最顶部）。 | — |
| buffer | `number` | — | `1` | 前后预留的额外渲染项数。增大可减少快速滚动时的白屏。默认 1。 | — |
| scrollbar | `boolean \| Partial<BaseScrollerPropsT>` | — | 滚动条配置。true 使用默认配置（always 显示、medium 尺寸），传对象可自定义。默认 true。 | 滚动条配置 | — |
| layout | `Layout` | `'vertical'` / `'horizontal'` | `'vertical'` | 布局方向（v1.2.6 新增）。`'vertical'` 垂直滚动（默认）、`'horizontal'` 水平滚动。 | 1.2.6 |
| threshold | `number \| null` | — | 数据量阈值（v1.2.6 新增）。当列表数据量低于此值时不启用虚拟化（直接全量渲染），null 表示始终启用虚拟化。默认 null。 | 数据量阈值，低于此值不启用虚拟化 | 1.2.6 |

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| renderChange | `(renderIndex: RenderIndexInfo)` | 可视区域渲染范围变化时触发。可获取 start（渲染起始）、end（渲染结束）、visible（可视起始）、count（可视数量）。 |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | `{ item: any, index: number }` | 始终 | 列表项渲染内容。接收 item（当前项数据）和 index（索引）两个插槽参数。 | 无 |

---

### 暴露方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| scrollToView(index, align?, behavior?) | `index: number, align?: Alignment, behavior?: ScrollBehavior` | 滚动到指定项。align 支持 `'start'`/`'end'`/`'center'`/`'nearest'`/数字偏移量，默认 `'start'`。behavior 默认 `'instant'`，不定高模式自动降级 |
| scrollToOffset(px) | `px: number` | 滚动到指定像素偏移量（v1.2.6 新增）。自动 clamp 到 [0, maxScroll] |

---

### 典型使用场景与调用模板

**场景 1：固定高度列表**
适用于：所有项等高的大数据列表
```vue
<script setup>
import { ref } from 'vue';
const list = ref(Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `项目 ${i}` })));
</script>
<template>
  <OVirtualList :list="list" :item-size="48" style="height: 400px;">
    <template #default="{ item, index }">
      <div style="height: 48px; padding: 12px;">{{ item.name }}</div>
    </template>
  </OVirtualList>
</template>
```

**场景 2：不定高度列表**
适用于：每项高度不同的列表
```vue
<OVirtualList :list="list" :default-item-size="80" :buffer="3" style="height: 500px;">
  <template #default="{ item }">
    <div style="padding: 16px;">{{ item.content }}</div>
  </template>
</OVirtualList>
```

**场景 3：滚动到指定位置**
适用于：跳转到某一项
```vue
<script setup>
import { ref } from 'vue';
const virtualListRef = ref();
const jumpTo = (index) => {
  virtualListRef.value?.scrollToView(index, 'center');
};
</script>
<template>
  <OButton @click="jumpTo(500)">跳到第 500 项</OButton>
  <OVirtualList ref="virtualListRef" :list="list" :item-size="48" style="height: 400px;">
    <template #default="{ item }">
      <div style="height: 48px;">{{ item.name }}</div>
    </template>
  </OVirtualList>
</template>
```

**场景 4：自定义滚动条**
适用于：自定义滚动条外观
```vue
<OVirtualList :list="list" :item-size="48" :scrollbar="{ showType: 'hover', size: 'small' }" style="height: 400px;">
  <template #default="{ item }">
    <div style="height: 48px;">{{ item.name }}</div>
  </template>
</OVirtualList>
```

**场景 5：水平虚拟列表（v1.2.6）**
适用于：大量数据的水平滚动
```vue
<OVirtualList :list="list" :item-size="200" layout="horizontal" style="width: 100%; height: 200px;">
  <template #default="{ item }">
    <div style="width: 200px; height: 100%;">{{ item.name }}</div>
  </template>
</OVirtualList>
```

**场景 6：按项定高模式（v1.2.6）**
适用于：每项高度已知但不一致
```vue
<OVirtualList :list="list" :item-size="getItemHeight" style="height: 400px;">
  <template #default="{ item }">
    <div :style="{ height: getItemHeight(item) + 'px' }">{{ item.name }}</div>
  </template>
</OVirtualList>
```

**场景 7：阈值控制（v1.2.6）**
适用于：少量数据时不启用虚拟化，避免不必要的复杂度
```vue
<!-- 少于 50 条时全量渲染 -->
<OVirtualList :list="list" :threshold="50" style="height: 400px;">
  <template #default="{ item }">
    <div>{{ item.name }}</div>
  </template>
</OVirtualList>
```

**场景 8：滚动到指定偏移量（v1.2.6）**
适用于：精确控制滚动位置
```vue
<script setup>
import { ref } from 'vue';
const virtualListRef = ref();
const scrollToTop = () => virtualListRef.value?.scrollToOffset(0);
const scrollDown = () => virtualListRef.value?.scrollToOffset(500);
</script>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 固定高度 | `:list` + `:item-size` | 性能最优 |
| 按项定高 | `:list` + `:item-size="(item) => item.height"` | 每项高度已知但不一致 |
| 不定高度 | `:list` + `:default-item-size` | 动态测量 |
| 大量数据 | `:buffer="3"` | 减少白屏 |
| 初始位置 | `:default-start-index` | 从中间开始 |
| 隐藏滚动条 | `:scrollbar="false"` | 无滚动条 |
| 水平滚动 | `layout="horizontal"` + `:item-size` | 水平布局 |
| 少量数据优化 | `:threshold="50"` | 低于阈值不启用虚拟化 |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| 1.2.7 | 更新 | `scrollbar` 开启时改用 OScrollbar 组件渲染（替代 v-scrollbar 指令），滚动条获得响应性；渲染条件与 props 数据源统一由 `scrollbar` prop 控制 |
