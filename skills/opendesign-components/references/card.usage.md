> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](card.visual.md) · [样式定制](card.style.md)

# OCard 卡片 — 代码使用

### 导入方式

```vue
<script setup>
import { OCard } from '@opensig/opendesign';
</script>
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| layout | `CardDirectionT` | `'v'` / `'h'` / `'hr'` | `'v'` | 卡片方向。"v" 垂直（封面在上、内容在下）、"h" 水平（封面在左、内容在右）、"hr" 反向水平（封面在右、内容在左）。默认 v。 |
| cover | `string` | — | — | 封面图片的 URL。设置后在卡片顶部（垂直模式）或侧边（水平模式）显示封面图。 |
| coverRatio | `number` | — | — | 封面图片的宽高比（数值，如 1.7）。不设置时图片撑满封面区域。 |
| coverFit | `CardCoverFitT` | `'cover'` / `'contain'` / `'fill'` / `'none'` / `'scale-down'` | `'cover'` | 封面图片的填充方式。"cover" 裁剪填满、"contain" 完整显示、"fill" 拉伸填满、"none" 原始尺寸、"scale-down" 缩小。默认 cover。 |
| coverClass | `string \| object \| array` | 封面盒子的自定义 CSS 类名，用于定制封面样式。 | — | 封面盒子自定义类名 |
| icon | `string \| Component` | — | 卡片图标。可以是图片 URL 字符串或 Vue 组件。设置后在内容区左侧显示图标。与 cover 是两种不同的卡片风格。 | 卡片图标（URL 或组件） |
| titleIcon | `string \| Component` | — | 标题前的行内图标，可以是图片 URL 或 Vue 组件。 | 标题前缀图标 |
| title | `string` | — | — | 标题文字 |
| titleRow | `number` | — | — | 标题的固定行数（影响标题盒子高度）。 |
| titleMaxRow | `number` | — | — | 标题最大显示行数，超出部分以省略号截断。通常 titleRow 和 titleMaxRow 设为相同值。 |
| detail | `string` | — | — | 正文内容 |
| detailRow | `number` | — | — | 正文的固定行数（影响正文盒子高度）。 |
| detailMaxRow | `number` | — | — | 正文最大显示行数，超出部分以渐隐或省略号截断。 |
| textOverflow | `TexTOverflowT` | `'fade'` / `'ellipsis'` | `'fade'` | 正文超出时的溢出效果。"fade" 渐隐消失、"ellipsis" 显示省略号。默认 fade。 | v1.1.0 |
| hoverable | `boolean` | — | `false` | 鼠标悬停时是否显示阴影效果。设置 href 时自动生效。 |
| cursor | `CardHoverCursorT` | `'auto'` / `'pointer'` | `'auto'` | 鼠标悬停时的光标样式。"auto" 自动（有 href 时为手型）、"pointer" 手型。默认 auto。 |
| href | `string` | — | — | 跳转链接（渲染为 `<a>` 标签） |
| noResponsive | `boolean` | — | `false` | 是否禁用响应式尺寸调整。开启后卡片间距、字号不随视口变化。 |

---

### Events 表

本组件无自定义事件。

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| card | — | 始终 | 替换卡片内部所有默认结构（封面 + 内容区）。替换后所有其他属性和插槽均失效。 | 封面 + 内容区 |
| cover | — | 有 cover prop 或 cover slot 时 | 替换整个封面区域的渲染。替换后 cover、coverRatio、coverFit 属性均失效。 | `<OFigure>` 封面图 |
| main | — | 有内容区存在时 | 整个内容区（图标+标题+正文+底部） | 默认结构 |
| icon | — | 有 icon prop 或 icon slot 时 | 替换图标区域。替换后 icon 属性失效。 | icon 属性渲染 |
| header | — | 有 title 或 header/title slot 时 | 替换整个标题区域（包括标题图标和标题文字）。替换后 title、titleIcon、title 插槽均失效。 | titleIcon + title |
| title | — | 有 title prop 时 | 替换标题文字内容，但保留标题图标和标题容器结构。 | `{{ title }}` |
| detail | — | 有 detail prop 或 detail slot 时 | 替换正文内容。替换后 detail 属性失效。 | `{{ detail }}` |
| default | — | 始终 | 在 detail 下方追加额外的自定义内容（不替换 detail）。 | 无 |
| footer | — | 有 footer slot 时 | 卡片底部区域。仅当提供此插槽时才渲染底部。 | 不渲染 |

---

### 插槽层级关系

```
card（使用后内部全部失效）
├── cover（封面区域）
└── main（使用后内部全部失效）
    ├── icon（图标区域）
    ├── header（使用后内部全部失效）
    │   ├── titleIcon
    │   └── title（标题文字）
    ├── detail（正文内容）
    ├── default（额外内容）
    └── footer（底部区域）
```

---

### 典型使用场景与调用模板

**场景 1：基础图文卡片**
适用于：文章列表、产品展示
```vue
<OCard
  cover="/card-cover.jpg"
  :cover-ratio="1.7"
  title="文章标题"
  :title-row="2"
  :title-max-row="2"
  detail="文章摘要内容..."
  :detail-row="2"
  :detail-max-row="2"
  hoverable
/>
```

**场景 2：图标卡片**
适用于：功能入口、特性展示
```vue
<OCard
  icon="/feature-icon.svg"
  title="功能名称"
  detail="功能描述..."
/>
```

**场景 3：水平布局卡片**
适用于：新闻列表、横向展示
```vue
<OCard
  layout="h"
  cover="/card-cover.jpg"
  :cover-ratio="1"
  title="标题"
  detail="详情"
  hoverable
/>
```

**场景 4：自定义 header + footer**
适用于：复杂业务卡片（如带标签、评分）
```vue
<OCard hoverable cursor="pointer" :detail="detailText">
  <template #header>
    <span style="font-weight: 500;">自定义标题</span>
    <div><OTag>标签1</OTag><OTag>标签2</OTag></div>
  </template>
  <template #footer>
    <ORate color="primary" :default-value="4" readonly />
    <span>4.0</span>
  </template>
</OCard>
```

**场景 5：链接卡片**
适用于：可点击跳转的卡片
```vue
<OCard
  href="/detail/123"
  cover="/card-cover.jpg"
  title="点击查看详情"
  detail="描述信息"
/>
```

**场景 6：完全自定义（card 插槽）**
适用于：现有属性无法满足需求
```vue
<OCard>
  <template #card>
    <div class="custom-card-content">
      完全自定义内容
    </div>
  </template>
</OCard>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 图文卡片 | `cover` + `title` + `detail` | 最常见用法 |
| 图标卡片 | `icon` + `title` + `detail` | 功能入口 |
| 横向卡片 | `layout="h"` + `cover` | 新闻列表 |
| 可点击卡片 | `href` + `hoverable` | 自动 a 标签 + 手型光标 |
| 固定尺寸 | `noResponsive` | 不随屏幕缩放 |
| 文字省略 | `:title-row="2"` + `:title-max-row="2"` | 行数和最大行数一致 |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| v1.2.4 | 样式 | 标题文字字重从 500 改为 600；`--card-header-text-weight` 提升为 CSS 变量 |
| v1.1.0 | 新增 | 新增 `textOverflow` prop，支持正文溢出效果（fade/ellipsis） |
