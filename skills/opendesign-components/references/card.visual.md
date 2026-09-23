> ← [组件索引](../SKILL.md#组件索引) · [代码使用](card.usage.md) · [样式定制](card.style.md)

# OCard 卡片 — 视觉识别

OCard 是卡片容器组件，用于展示图文内容。支持图文卡片（带封面图）和图标卡片（带图标），可横向或纵向排列，有丰富的插槽自定义能力。

📱 **响应式行为**：卡片在不同屏幕尺寸下会自动调整圆角、间距、字号。笔记本（≤1680px）标题字号缩小、内边距缩小；平板横屏（≤1200px）进一步缩小；平板竖屏（≤840px）各区域间距和字号最小化。可通过 noResponsive 禁用。

🧩 **布局结构**：外层 `.o-card` 为圆角填充容器。垂直模式（layout=v）封面在上、内容区在下，纵向排列；水平模式（layout=h）封面在左、内容区在右，横向排列。内容区（`.o-card-main`）内部纵向排列：可选图标区 → 主包装区（header 标题区 → content 正文区 → footer 底部区）。图标卡片时图标与主包装区横向排列。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: column (v) | row (h/hr)
regions: [cover(封面图), main(icon + main-wrap(header, content, footer))]
```

### 设计稿识别指南

**视觉特征指纹**

1. 圆角矩形容器，浅色填充背景（fill2），内部有明确的封面图/图标区 + 标题 + 正文的分区结构
2. 图文卡片：顶部或侧边有大面积封面图，图片内嵌于卡片容器中（有内边距），下方为标题+正文
3. 图标卡片：无封面图，左侧或上方有小图标（icon_size-2xl），右侧为标题+正文，整体更紧凑
4. 悬停态出现阴影（shadow-2），可选手型光标

**设计 Token → Prop 值映射表**

| 设计特征 | Token / 视觉值 | Prop | Prop 值 |
|---------|---------------|------|--------|
| 图片在上、文字在下 | 纵向排列 | `layout` | `"v"` |
| 图片在左、文字在右 | 横向排列 | `layout` | `"h"` |
| 图片在右、文字在左 | 反向横向 | `layout` | `"hr"` |
| 有大封面图 | 图片区域 | `cover` | 图片 URL |
| 有小图标 | icon_size-2xl | `icon` | 图标 URL 或组件 |
| 标题前有小图标 | icon_size-l | `titleIcon` | 图标 URL 或组件 |
| 悬停阴影 | --o-shadow-2 | `hoverable` | `true` |
| 整卡可点击 | `<a>` 标签 | `href` | 链接 URL |
| 圆角 l | --o-radius_control-l | — | 默认 (>1680px) |
| 圆角 m | --o-radius_control-m | — | laptop 断点 |
| 圆角 s | --o-radius_control-s | — | pad_h/pad_v 断点 |
| 正文渐隐消失 | 渐隐遮罩 | `textOverflow` | `"fade"` |
| 正文省略号截断 | "..." | `textOverflow` | `"ellipsis"` |

**易混淆组件区分表**

| 对比组件 | 相似点 | 区分方法 |
|---------|-------|---------|
| ORow / OCol | 都是圆角矩形容器 | Card 有封面图/图标 + 标题 + 正文的固定语义分区和插槽；ORow/OCol 是通用栅格容器无固定内部结构 |
| OTable（单列模式） | 都可展示多条内容 | Card 是独立的卡片容器，有封面图和圆角阴影；OTable 单列模式的行是行级元素，无封面图和独立卡片样式 |
