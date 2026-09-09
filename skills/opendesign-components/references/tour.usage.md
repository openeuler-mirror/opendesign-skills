> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](tour.visual.md) · [样式定制](tour.style.md)

# OTour 漫游引导 — 代码使用

### 导入方式

```vue
<script setup>
import { OTour, OTourStep } from '@opensig/opendesign';
</script>
```

---

### OTour Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| visible | `boolean`（v-model:visible） | — | `false` | 引导显隐，双向绑定 | 1.2.7 |
| current | `number`（v-model:current） | — | `0` | 当前步骤下标，双向绑定。关闭时自动重置为 0 | 1.2.7 |
| position | `TourPositionT` | `'top'` / `'tl'` / `'tr'` / `'bottom'` / `'bl'` / `'br'` / `'left'` / `'lt'` / `'lb'` / `'right'` / `'rt'` / `'rb'` | `'bottom'` | 引导卡片相对目标元素的位置（全局默认，步骤可覆盖） | 1.2.7 |
| showArrow | `boolean` | — | `true` | 是否显示箭头（步骤可覆盖）。无目标时强制无箭头 | 1.2.7 |
| arrowClass | `string \| array \| object` | — | — | 箭头自定义类名 | 1.2.7 |
| popupClass | `string` | — | — | 引导卡片容器自定义类名 | 1.2.7 |
| showClose | `boolean` | — | `true` | 是否显示关闭按钮（步骤可覆盖） | 1.2.7 |
| mask | `boolean` | — | `true` | 是否启用遮罩层；`false` 为非模态模式（步骤可覆盖） | 1.2.7 |
| spotlightRadius | `string` | `'pill'` 或任意 CSS 长度 | `4px` | 镂空区域圆角。`'pill'` 为胶囊形（圆角=短边一半），其余按 CSS 长度解析（如 `'8px'`、`'2em'`） | 1.2.7 |
| closeOnPressEscape | `boolean` | — | `true` | 按 ESC 关闭 | 1.2.7 |
| contentStyle | `CSSProperties` | — | — | 引导卡片内容自定义样式（步骤可覆盖） | 1.2.7 |
| wrapper | `string \| HTMLElement` | — | `'body'` | Teleport 目标 | 1.2.7 |

### OTourStep Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| target | `string \| HTMLElement \| (() => HTMLElement \| null)` | — | — | 引导指向的目标元素：CSS 选择器、DOM 元素或返回元素的函数。**不传时卡片在视口居中显示、无镂空** | 1.2.7 |
| title | `string` | — | — | 步骤标题 | 1.2.7 |
| detail | `string` | — | — | 步骤详情 | 1.2.7 |
| img | `string` | — | — | 步骤图片地址（显示时卡片左图右文，箭头自动取图片边缘色） | 1.2.7 |
| showClose | `boolean` | — | 继承 Tour | 是否显示关闭按钮，优先级高于 Tour | 1.2.7 |
| showArrow | `boolean` | — | 继承 Tour | 是否显示箭头，优先级高于 Tour | 1.2.7 |
| position | `TourPositionT` | 同 Tour | 继承 Tour | 卡片位置，优先级高于 Tour | 1.2.7 |
| mask | `boolean` | — | 继承 Tour | 是否启用遮罩，优先级高于 Tour | 1.2.7 |
| contentStyle | `CSSProperties` | — | 继承 Tour | 卡片内容自定义样式，优先级高于 Tour | 1.2.7 |
| prevButtonProps | `TourBtnProps` | — | — | 上一步按钮属性（OButton props + `children` 按钮文本 + `onClick`） | 1.2.7 |
| nextButtonProps | `TourBtnProps` | — | — | 下一步按钮属性（同上；最后一步默认文案为"完成"） | 1.2.7 |

---

### Events 表（OTour）

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| change | `(current: number)` | 步骤切换后触发，返回当前下标 |
| close | `(current: number)` | 关闭时触发（关闭按钮 / ESC），返回关闭时步骤下标 |
| finish | — | 最后一步点击"下一步"时触发，组件随后自动关闭 |

### Slots 表（OTourStep）

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| title | — | 始终可用 | 替换步骤标题 | `title` prop 内容 |
| detail | — | 始终可用 | 替换步骤详情 | `detail` prop 内容 |
| img | — | 始终可用 | 替换步骤图片区 | `img` prop 图片 |
| left | — | 始终可用 | 卡片内容区左侧附加内容（与 img 并列） | 无 |
| skip | — | 始终可用 | 底部左侧"跳过"区域 | 无 |
| indicators | `{ current, total }` | 多步或插槽存在时 | 替换步骤指示器 | `n/m` 文本 |
| footer | `{ current, total, onPrev, onNext }` | 始终可用 | **整体替换**底部按钮区 | 上一步/下一步按钮组 |

---

### 插槽层级关系

```
OTour
└── OTourStep（每步一个，仅渲染当前步骤）
    ├── img（图片区）
    ├── left（内容区左侧附加）
    ├── title / detail（标题 / 详情）
    └── footer（底部按钮区，整体替换后内部结构自定义）
        └── （替换 footer 后）skip / indicators 不再渲染
```

---

### 典型使用场景与调用模板

**场景 1：基础分步引导（模态遮罩）**

适用于：新功能上手引导，依次高亮页面各功能区域
```vue
<script setup>
import { ref } from 'vue';
import { OTour, OTourStep } from '@opensig/opendesign';

const show = ref(false);
</script>
<template>
  <OButton color="primary" @click="show = true">开启引导</OButton>
  <OTour v-model:visible="show">
    <OTourStep target="#tour-step1" title="区域一" detail="这里是功能区域一的介绍。" />
    <OTourStep target="#tour-step2" title="区域二" detail="这里是功能区域二的介绍。" position="top" />
    <OTourStep target="#tour-step3" title="区域三" detail="引导最后一步。" :spotlight-radius="'pill'" />
  </OTour>
</template>
```

**场景 2：无目标居中展示**

适用于：整体介绍、无明确指向对象的开屏欢迎
```vue
<OTour v-model:visible="show">
  <OTourStep title="欢迎使用漫游引导" detail="不设置 target 时卡片在视口居中显示。">
    <template #skip>
      <OLink :hover-underline="false" @click="show = false">跳过</OLink>
    </template>
  </OTourStep>
</OTour>
```

**场景 3：非模态模式（无遮罩）**

适用于：允许用户同时操作页面其余部分的轻量引导
```vue
<OTour v-model:visible="show" :mask="false" position="right">
  <OTourStep target="#help-entry" title="帮助中心" detail="点击这里查看帮助文档。" />
</OTour>
```

**场景 4：带图步骤 + 自定义按钮**

适用于：营销风格引导（左图右文）、自定义按钮文案与回调
```vue
<OTour v-model:visible="show">
  <OTourStep
    target="#banner"
    img="/guide-banner.png"
    title="全新改版"
    detail="本次改版新增了以下能力。"
    :prev-button-props="{ children: '上一步' }"
    :next-button-props="{ children: '知道了' }"
  />
</OTour>
```

**场景 5：受控步骤（切换前拦截）**

适用于：需要校验或埋点后再进入下一步
```vue
<script setup>
import { ref, watch } from 'vue';
const show = ref(false);
const current = ref(0);
watch(current, (val) => {
  /* 按需回退 current 或打点 */
});
</script>
<template>
  <OTour v-model:visible="show" v-model:current="current" @finish="onFinish" @close="onClose">
    <OTourStep target="#a" title="A" detail="..." />
    <OTourStep target="#b" title="B" detail="..." />
  </OTour>
</template>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 标准引导 | `v-model:visible` + 步骤 `target` | 模态遮罩 + 镂空聚光 |
| 胶囊镂空 | `spotlightRadius="pill"` | 镂空圆角为短边一半 |
| 无遮罩轻引导 | `:mask="false"` | 页面可正常操作，卡片更紧凑 |
| 居中欢迎页 | OTourStep 不传 `target` | 卡片视口居中、无镂空 |
| 步骤微调 | 步骤级 `position` / `mask` / `showArrow` | 优先级高于 Tour 全局 |
| 记住步骤位置 | 监听 `close`/`finish` 保存 `current`，重开时 `v-model:current` 恢复 | 默认关闭后重置为 0 |
| 锁定背景滚动 | `body.o-tour-open { overflow: hidden }` | 遮罩开启期间 body 自动带此类 |

---

### 行为要点

- **键盘导航**：显示期间 `←` 上一步、`→` 下一步；焦点在 `input`/`textarea`/`select`/`contentEditable` 内时不劫持方向键
- **按钮回调时序**：`prevButtonProps.onClick` / `nextButtonProps.onClick` 在步骤切换**完成后**调用，不能用于阻止切换；需切换前拦截请用 `v-model:current` + watch 自行控制
- **自动关闭**：最后一步点"下一步"触发 `finish` 并自动关闭；ESC 关闭触发 `close(current)`
- **关闭重置**：`visible` 变 `false` 时 `current` 自动重置 0，下次从第一步开始
- **遮罩 body class**：`mask=true` 且可见期间 `<body>` 挂 `o-tour-open` 类，可据此锁定滚动
- **SSR**：组件内部已处理渲染守卫，无需调用方包 ClientOnly

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| 1.2.7 | 新增 | 组件新增（详见上表） |
