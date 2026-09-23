> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](carousel.visual.md) · [代码使用](carousel.usage.md)

# OCarousel 幻灯片 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--carousel-arrow-size` | `var(--o-icon_size_control-l)` | 箭头图标大小 |
| `--carousel-arrow-color` | `var(--o-color-info1)` | 箭头图标颜色 |
| `--carousel-arrow-color-hover` | `var(--o-color-info2)` | 箭头悬停颜色 |
| `--carousel-arrow-color-active` | `var(--o-color-info3)` | 箭头按下颜色 |
| `--carousel-indicator-width` | `48px` | 指示器宽度（>1200px 默认值） |
| `--carousel-indicator-height` | `3px` | 指示器高度 |
| `--carousel-indicator-gap` | `12px` | 指示器之间的间距 |
| `--carousel-indicator-offset` | `19px` | 指示器距底部的偏移量 |
| `--carousel-indicator-bg-color` | `var(--o-color-control1)` | 指示器默认背景色 |
| `--carousel-indicator-bg-color-hover` | `var(--o-color-primary2)` | 指示器悬停背景色 |
| `--carousel-indicator-bg-color-active` | `var(--o-color-primary3)` | 指示器按下背景色 |
| `--carousel-indicator-bg-color-selected` | `var(--o-color-primary1)` | 指示器选中背景色 |

**使用示例**：
```vue
<OCarousel style="--carousel-indicator-width: 32px; --carousel-indicator-bg-color-selected: var(--o-color-danger1)">
  <OCarouselItem v-for="i in 4" :key="i">内容 {{ i }}</OCarouselItem>
</OCarousel>
```

---

### 响应式行为表

| 维度 | ≤600px | 601–840px | 841–1200px | >1200px |
|------|--------|----------|-----------|---------|
| 指示器宽度 | 16px | 24px | 40px | 56px |
| 指示器高度 | 2px | 2px | 3px | 4px |
| 箭头图标大小 | — | 缩小 | 标准 | 标准 |

---

### 组件布局结构

```yaml
# OCarousel 布局结构
root: .o-carousel
  direction: column (隐式，内部通过定位实现层叠)
  children:
    - .o-carousel-wrap:
        role: 幻灯片内容容器
        children:
          - .o-carousel-container-gallery | .o-carousel-container-toggle:
              role: 幻灯片列表
              direction: row (gallery 模式，通过 transform 滑动)
              children:
                - slot[default] → OCarouselItem × N
                  # OCarouselItem 根节点 class 因 effect 而异：
                  # effect="gallery"  → .o-carousel-item-gallery
                  # effect="toggle"   → .o-carousel-item-toggle
                  # 注意：没有通用的 .o-carousel-item 类，Playwright 选择器必须带 effect 后缀
    - .o-carousel-indicator-wrap:
        role: 指示器栏
        condition: hideIndicator !== true
        direction: row (居中)
        children:
          - .o-carousel-indicator-item × N:
              children:
                - slot[indicator] || .o-carousel-indicator-bar
        tokens:
          gap: var(--carousel-indicator-gap)  # 12px (>1200px) → 8px (840-1200px) → 4px (≤840px)
          offset-bottom: var(--carousel-indicator-offset)  # 19px → 11px → 7px
    - .o-carousel-arrow-wrap:
        role: 箭头导航
        condition: arrow !== 'never'
        position: absolute, 左右两侧垂直居中
        children:
          - div > slot[arrow-prev] || .o-carousel-arrow-prev > .o-carousel-arrow-icon > slot[arrow-prev-icon] || IconChevronLeft
          - div > slot[arrow-next] || .o-carousel-arrow-next > .o-carousel-arrow-icon > slot[arrow-next-icon] || IconChevronRight
        tokens:
          icon-size: var(--carousel-arrow-size)  # var(--o-icon_size_control-l) (>840px) → var(--o-icon_size_control-xs) (≤840px)
          color: var(--carousel-arrow-color)  # var(--o-color-info1)

# 响应式断点 Token 值
breakpoints:
  ">1200px":
    --carousel-indicator-width: 48px
    --carousel-indicator-height: 3px
    --carousel-indicator-gap: 12px
    --carousel-indicator-offset: 19px
    --carousel-arrow-size: var(--o-icon_size_control-l)
  "840-1200px":
    --carousel-indicator-width: 40px
    --carousel-indicator-height: 3px
    --carousel-indicator-gap: 8px
    --carousel-indicator-offset: 11px
    --carousel-arrow-size: var(--o-icon_size_control-l)
  "600-840px":
    --carousel-indicator-width: 24px
    --carousel-indicator-height: 2px
    --carousel-indicator-gap: 4px
    --carousel-indicator-offset: 7px
    --carousel-arrow-size: var(--o-icon_size_control-xs)
  "≤600px":
    --carousel-indicator-width: 16px
    --carousel-indicator-height: 2px
    --carousel-indicator-gap: 4px
    --carousel-indicator-offset: 7px
    --carousel-arrow-size: var(--o-icon_size_control-xs)
```
