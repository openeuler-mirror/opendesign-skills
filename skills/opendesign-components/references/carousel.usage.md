> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](carousel.visual.md) · [样式定制](carousel.style.md)

# OCarousel 幻灯片 — 代码使用

### 导入方式

```vue
<script setup>
import { OCarousel, OCarouselItem } from '@opensig/opendesign';
</script>
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| activeIndex | `number` | — | `0` | 当前激活的幻灯片索引（v-model 双向绑定）。 |
| effect | `string` | `'gallery'` / `'toggle'` | `'gallery'` | 幻灯片切换效果。"gallery" 滚动效果，相邻幻灯片可部分露出；"toggle" 直接切换，一次只显示一张。默认 gallery。gallery 模式下可以将 OCarouselItem 宽度设为略小于 OCarousel，使两侧幻灯片部分可见。 |
| autoPlay | `boolean` | — | `false` | 是否自动播放。默认关闭。 |
| interval | `number` | — | `5000` | 自动播放间隔时间（毫秒）。默认 5000。 |
| arrow | `string` | `'always'` / `'hover'` / `'never'` | `'hover'` | 箭头显示方式。"hover" 鼠标悬停时显示、"always" 始终显示、"never" 不显示。默认 hover。 |
| arrowWrapClass | `string \| object \| array` | 箭头容器自定义类名。 | — | 箭头容器类名 |
| hideIndicator | `boolean` | — | `false` | 是否隐藏底部指示器。默认显示。 |
| indicatorClick | `boolean` | — | `false` | 是否允许点击指示器切换幻灯片。默认关闭。 |
| indicatorWrapClass | `string \| object \| array` | 指示器容器自定义类名。 | — | 指示器容器类名 |
| clickToSwitch | `boolean` | — | `false` | 是否允许点击非激活的幻灯片来切换。在 gallery 模式下露出两侧幻灯片时尤其有用。默认关闭。 |
| manualInit | `boolean` | — | `false` | 是否手动初始化。开启后需要调用暴露的 init() 方法才会初始化。默认关闭。 |
| activeClass | `string \| object \| array` | — | — | 自定义激活类名 |
| pauseOnHover | `boolean` | — | `false` | 鼠标悬停时是否暂停自动播放。默认关闭。 |

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:activeIndex | `(value: number)` | 激活索引变化时 |
| before-change | `(to: number, from: number)` | 幻灯片切换动画开始前触发。 |
| change | `(to: number, from: number)` | 幻灯片切换完成后触发，可获取新旧索引。 |
| pause | `(value: number)` | 自动播放暂停时 |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 放置 OCarouselItem 子项。 | 无 |
| indicator | `{ active: boolean, index: number }` | 未隐藏指示器时 | 自定义每个指示器项的渲染。可获取 active（是否激活）和 index（索引）。 | 默认指示条 |
| arrow-prev | — | arrow 非 never | 左箭头整体 | 默认左箭头 |
| arrow-next | — | arrow 非 never | 右箭头整体 | 默认右箭头 |
| arrow-prev-icon | — | arrow 非 never | 左箭头图标 | `<IconChevronLeft />` |
| arrow-next-icon | — | arrow 非 never | 右箭头图标 | `<IconChevronRight />` |

---

### 暴露方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| init() | — | 手动初始化（manualInit 为 true 时使用） |
| play() | — | 开始自动播放 |
| pause() | — | 暂停自动播放 |
| active(index) | `index: number` | 切换到指定索引 |

---

### ⚠️ 使用注意事项

#### ⚠️ toggle 模式必须显式设置高度

**`effect="toggle"` 模式下，所有 OCarouselItem 均为 `position: absolute; height: 100%`，整条高度链依赖父容器——若 `.o-carousel` 未定义高度，实际高度为 0。**

后果：
- 幻灯片内容 overflow 出来，视觉上可见（.o-carousel 无 overflow:hidden）
- 箭头：`top: 50%` of 0-height → 贴顶显示，看起来"在内容区"
- **指示器：`bottom: 19px` of 0-height → 跑到容器顶部以上 19px，被页面其他元素遮盖，不可见**

```css
/* ✅ 必须给 OCarousel 设置显式高度（toggle 模式） */
.my-carousel {
  height: 360px;   /* 根据设计稿的 banner 高度设定 */
}

/* ✅ 同时让 banner-slide 填满该高度 */
.my-slide {
  height: 100%;
  overflow: hidden;
}
```

> **为什么 gallery 模式没有此问题？** gallery 模式下 OCarouselItem 通过 transform 水平排列，高度由内容自然撑开（非 position:absolute），无需显式设置高度。仅 toggle 模式有此限制。

#### Banner 区域轮播检测清单

**页面顶部的大幅 Banner 区域（首屏 Hero 区）极大概率是轮播图，不可直接按静态 HTML 实现。**

在分析设计稿时，凡遇到以下情况之一，**必须**对该区域执行轮播检测清单：
- 页面顶部有全宽或大幅背景图/渐变色块
- 该区域高度明显大于普通内容行（通常 ≥ 300px）
- 该区域视觉上与普通内容区隔离、独立成块

**轮播检测清单**（逐项检查 Pixso DSL，任意一项成立 → 使用 OCarousel）：

| 检测项 | 在 DSL 中的信号 |
|--------|---------------|
| ① 图层命名 | 节点 `name` 含 `carousel`、`slider`、`轮播`、`Swiper`，或子项命名为 `Slide N`、`Item N`、`Banner N` |
| ② 多个平级同结构子项 | 容器直接子节点有 2+ 个同类型同结构的 Frame/Group（每个都有独立背景/图片/文字） |
| ③ 底部指示器层 | 容器内有一层包含 3+ 个等宽小矩形或圆点的横排组，且其中一个颜色与其他不同 |
| ④ 左右箭头层 | 容器内有两个绝对定位的图标节点，分别位于左侧和右侧，内容为 `<`/`>` 或箭头图形 |
| ⑤ Pixso 交互 | 节点上绑定了 Auto-animate 或 Navigate 交互（DSL `interactions` 字段非空） |

> **静默陷阱**：设计稿通常只展示轮播的第一帧，指示器、箭头可能因设计稿状态而不明显。若图层名或子项数量出现②，即使没有看到指示器也应使用 OCarousel。

---

### 典型使用场景与调用模板

**场景 1：基础轮播（Gallery 效果）**
适用于：Banner 轮播图
```vue
<OCarousel auto-play :interval="3000" indicator-click>
  <OCarouselItem v-for="i in 5" :key="i">
    <img :src="`/banner-${i}.jpg`" />
  </OCarouselItem>
</OCarousel>
```

**场景 2：切换效果**
适用于：全屏幻灯片
```vue
<OCarousel effect="toggle" auto-play pause-on-hover>
  <OCarouselItem v-for="i in 3" :key="i">
    <div class="slide-content">第 {{ i }} 页</div>
  </OCarouselItem>
</OCarousel>
```

**场景 3：Gallery 露出两侧**
适用于：点击切换卡片轮播
```vue
<OCarousel click-to-switch arrow="always">
  <OCarouselItem v-for="i in 5" :key="i" style="width: 80%;">
    <img :src="`/card-${i}.jpg`" />
  </OCarouselItem>
</OCarousel>
```

**场景 4：自定义指示器**
适用于：使用自定义样式的指示器
```vue
<OCarousel indicator-click>
  <OCarouselItem v-for="i in 4" :key="i">
    <div>内容 {{ i }}</div>
  </OCarouselItem>
  <template #indicator="{ active, index }">
    <div :class="['my-dot', { 'my-dot-active': active }]">{{ index + 1 }}</div>
  </template>
</OCarousel>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 自动轮播 Banner | `auto-play` + `indicator-click` + `pause-on-hover` | 最常见用法 |
| 手动切换 | `arrow="always"` + `indicator-click` | 用户主动控制 |
| 卡片轮播 | `click-to-switch` + Gallery 模式 | OCarouselItem 宽度 < 100% |
| 全屏切换 | `effect="toggle"` | 直接切换 |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| v1.2.4 | 修复 | 初始化后动态添加的幻灯片页现在能被正确处理（不再被忽略） |
| v1.2.6 | 修复 | 使用 normalizeClass 重构 activeClass 处理逻辑 |
| v1.1.0 | 修复 | hover 暂停时指示器现在能正确显示激活态样式 |
