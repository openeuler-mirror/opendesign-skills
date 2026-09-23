> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](slider.visual.md) · [样式定制](slider.style.md)

# OSlider 滑动条 — 代码使用

### 导入方式

```vue
<script setup>
import { OSlider } from '@opensig/opendesign';
</script>
```

---

### 类型定义

```typescript
type Arrayable<T> = T | T[];
type DirectionT = 'h' | 'v';
type SizeT = 'large' | 'medium' | 'small';
type PopupPositionT = 'top' | 'tl' | 'tr' | 'bottom' | 'bl' | 'br' | 'left' | 'lt' | 'lb' | 'right' | 'rt' | 'rb';
```

---

### 插槽层级关系

```
OSlider
├── [轨道区域（自动渲染）]
│   ├── OSliderButton（第一个滑块，始终存在）
│   ├── OSliderButton（第二个滑块，range 模式时存在）
│   ├── 间隔刻度点（showStops 时显示）
│   └── OSliderMarker 标记列表（marks 时显示）
├── [输入框区域（showInput 且非 range 时显示）]
│   ├── OInputNumber
│   └── unit 插槽 / unit 属性文字
```

---

### 典型使用场景与调用模板

**场景 1：基础连续滑动条**
适用于：简单数值选择
```vue
<script setup>
import { ref } from 'vue';
const value = ref(0);
</script>
<template>
  <OSlider v-model="value" />
</template>
```

**场景 2：带输入框和单位的滑动条**
适用于：精确数值选择，如重量、温度
```vue
<script setup>
import { ref } from 'vue';
const weight = ref(0);
const marks = { 0: '0kg', 100: '100kg' };
</script>
<template>
  <OSlider v-model="weight" :marks="marks" show-input unit="kg" />
</template>
```

**场景 3：间隔（分段）滑动条**
适用于：离散值选择，如等级、档位
```vue
<script setup>
import { ref } from 'vue';
const level = ref(0);
</script>
<template>
  <OSlider v-model="level" show-stops :step="10" show-input unit="M" />
</template>
```

**场景 4：带标记的间隔滑动条**
适用于：离散档位且需显示每档标签
```vue
<script setup>
import { ref } from 'vue';
const val = ref(0);
const marks = { 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5' };
</script>
<template>
  <OSlider v-model="val" show-stops :max="5" :marks="marks" />
</template>
```

**场景 5：禁用滑动条**
适用于：只读展示
```vue
<OSlider v-model="value" disabled />
<OSlider v-model="value" show-stops :step="10" disabled />
```

**场景 6：隐藏气泡的滑动条**
适用于：不需要悬浮数值提示
```vue
<OSlider v-model="value" :show-popover="false" />
```

**场景 7：范围选择**
适用于：价格区间、时间段
```vue
<script setup>
import { ref } from 'vue';
const rangeVal = ref([20, 60]);
</script>
<template>
  <OSlider v-model="rangeVal" range />
</template>
```

**场景 8：自定义标记样式**
适用于：标记需要特殊视觉效果
```vue
<script setup>
import { ref } from 'vue';
const val = ref(0);
const marks = {
  0: { style: { color: 'red' }, label: '起点' },
  50: '中间',
  100: { style: { color: 'green' }, label: '终点' },
};
</script>
<template>
  <OSlider v-model="val" :marks="marks" />
</template>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础滑动 | `v-model` | 最简用法 |
| 带输入框 | `show-input` + `unit` | 精确数值 |
| 间隔分段 | `show-stops` + `:step` | 离散选择 |
| 带标记 | `:marks` + `show-stops` | 档位标签 |
| 范围选择 | `range` + `v-model="[min, max]"` | 区间选择 |
| 禁用 | `disabled` | 只读 |
| 无气泡 | `:show-popover="false"` | 隐藏提示 |
| 自定义范围 | `:min` + `:max` + `:step` | 限定范围 |
| 自定义单位插槽 | `show-input` + `#unit` | 复杂单位内容 |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| v1.2.4 | 样式 | 滑块按钮（o-slider-btn）新增阴影 |
| v1.2.0 | 新增 | OSlider 为新增组件 |

---

### OSlider Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| modelValue | `Arrayable<number>` | — | `0` | 双向绑定值（v-model），范围模式传数组 |
| min | `number` | — | `0` | 滑动条最小值。默认 0。 |
| max | `number` | — | `100` | 滑动条最大值。默认 100。 |
| step | `number` | — | `1` | 每次滑动的步长值。默认 1。 |
| disabled | `boolean` | — | `false` | 禁用 |
| range | `boolean` | — | `false` | 是否启用范围选择模式。开启后出现两个滑块，modelValue 应为数组。默认关闭。 |
| direction | `DirectionT` | `'h'` / `'v'` | `'h'` | 方向。默认 "h"。 |
| height | `string` | — | — | 垂直方向时滑动条的高度。仅 direction="v" 时生效。 |
| showInput | `boolean` | — | `false` | 是否在滑动条右侧显示数值输入框。仅在非范围模式下可用。默认关闭。 |
| inputSize | `SizeT` | `'large'` / `'medium'` / `'small'` | — | 输入框尺寸。"large" 大号、"medium" 中号、"small" 小号。 |
| showInputControls | `boolean` | — | `false` | 是否显示输入框的增减控制器。默认关闭。 |
| showStops | `boolean` | — | `false` | 是否显示间隔刻度点。开启后轨道上按步长显示刻度圆点，滑块按钮变为带实心内圆样式，轨道加粗。默认关闭。 |
| showPopover | `boolean` | — | `true` | 显示数值气泡 |
| position | `PopupPositionT` | 12 个方向 | `'bottom'` | 气泡定位方向。默认 "top"。 |
| wrapClass | `string` | — | — | 气泡容器自定义类名 |
| marks | `Record<number, string \| { style: CSSProperties; label: any }>` | — | 在轨道下方显示自定义标记文字。传入对象，键为数值位置，值为文字字符串或 { style, label } 对象。点击标记可跳转到对应位置。 | 标记对象 |
| unit | `string` | — | — | 输入框右侧的单位文字。 |

---

### OSlider Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:modelValue | `(value: Arrayable<number>)` | 值变化时 |
| input | `(value: Arrayable<number>)` | 滑动过程中实时触发 |
| change | `(value: Arrayable<number>)` | 滑动结束（鼠标松开或输入框失焦）后触发。 |

---

### OSlider Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| unit | — | showInput 为 true 时 | 替换输入框右侧的单位文字。使用后 unit 属性失效。 | `props.unit` 文字 |

---

### OSlider Expose

| 名称 | 类型 | 说明 |
|------|------|------|
| onSliderClick | `(event: MouseEvent \| TouchEvent) => void` | 手动触发滑动条点击 |

---

### OSliderButton Props 表（内部子组件）

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| modelValue | `number` | — | `0` | 当前值 |
| position | `PopupPositionT` | 12 个方向 | `'top'` | 气泡定位方向。默认 "top"。 |
| direction | `DirectionT` | `'h'` / `'v'` | `'h'` | 方向。默认 "h"。 |
| showSolidCircle | `boolean` | — | `false` | 是否显示按钮中心的实心小圆。间隔模式自动开启。 |
| showPopover | `boolean` | — | `false` | 显示气泡 |
| wrapClass | `string` | — | — | 气泡容器自定义类名 |

---

### OSliderButton Expose

| 名称 | 类型 | 说明 |
|------|------|------|
| onButtonDown | `(event: MouseEvent \| TouchEvent) => void` | 手动触发拖拽 |
| onKeyDown | `(event: KeyboardEvent) => void` | 手动触发键盘事件 |
| setPosition | `(newPosition: number) => Promise<void>` | 按百分比设置位置 |
| hovering | `boolean` | 是否悬浮中 |
| dragging | `boolean` | 是否拖拽中 |

---

### OSliderMarker Props 表（内部子组件）

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| mark | `string \| { style: CSSProperties; label: any }` | — | 标记内容。字符串或 { style, label } 对象。 | 标记内容 |
