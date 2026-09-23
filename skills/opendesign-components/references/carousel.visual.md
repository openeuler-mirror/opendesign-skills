> ← [组件索引](../SKILL.md#组件索引) · [代码使用](carousel.usage.md) · [样式定制](carousel.style.md)

# OCarousel 幻灯片 — 视觉识别

OCarousel 是幻灯片/轮播组件，用于在有限空间内循环展示多组内容（图片、卡片等）。支持滚动和切换两种动效，可自动播放、手动箭头/指示器切换。包含 OCarousel（容器）和 OCarouselItem（幻灯片项）。

📱 **响应式行为**：在平板到笔记本（840-1200px）指示器宽度缩至 40px、高度 3px；平板竖屏及以下（≤840px）箭头图标缩小、指示器进一步缩至 24px；手机（≤600px）指示器缩至 16px。

🧩 **布局结构**：外层容器纵向排列，内部分三层——幻灯片内容区（gallery 模式下横向排列多个 CarouselItem，toggle 模式下堆叠切换）、底部指示器栏（横向排列多个指示条）、左右箭头导航（绝对定位于内容区两侧）。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: column
regions: [carousel-wrap(内容容器), indicator-wrap(指示器栏), arrow-wrap(箭头导航)]
```

### 设计稿识别指南

**视觉特征指纹**
1. 大面积矩形内容区，同一时刻仅展示一个（toggle）或一个主要+两侧部分露出（gallery）的内容面板
2. 底部居中排列的短横条指示器，当前激活项颜色高亮（主题色 `--o-color-primary1`），其余为浅色（`--o-color-control1`）
3. 内容区左右两侧各有一个箭头图标（`<` / `>`），悬停时显示或常驻可见

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值/范围 | 对应Prop | Prop值 | 备注 |
|-----------|---------|---------|--------|------|
| 相邻内容部分露出 | 两侧可见边缘 | effect | `'gallery'` | 默认值 |
| 内容直接切换无滑动 | 同一位置替换 | effect | `'toggle'` | — |
| 箭头始终可见 | 非悬停态也显示 | arrow | `'always'` | — |
| 箭头悬停显示 | 鼠标悬停出现 | arrow | `'hover'` | 默认值 |
| 无箭头 | 不显示箭头 | arrow | `'never'` | — |
| 无底部指示器 | 无指示条 | hideIndicator | `true` | — |
| 指示器可点击 | 指示器有交互态 | indicatorClick | `true` | — |
| 自动轮播 | 内容自动切换 | autoPlay | `true` | 配合 interval |
| 指示器宽 48px 高 3px | 大屏默认尺寸 | — | — | >1200px 默认 |
| 指示器宽 16px | 最小屏尺寸 | — | — | ≤600px 响应式 |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|------------|
| OCarousel | OTab（标签页） | OCarousel 底部是短横条指示器，OTab 底部是文字标签栏；OCarousel 内容通过动画滑动切换 |
| OCarousel | 图片列表/网格 | OCarousel 同时只展示一项（或少量）内容，带指示器和箭头导航控件 |
| OCarousel | OCollapse（折叠面板） | OCarousel 内容水平切换，OCollapse 内容垂直展开收起 |
