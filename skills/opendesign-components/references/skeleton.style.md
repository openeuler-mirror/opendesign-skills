> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](skeleton.visual.md) · [代码使用](skeleton.usage.md)

# OSkeleton 骨架屏 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--skeleton-bg-color` | `var(--o-color-control4-light)` | 骨架块背景色（静态）；animation=true 时为渐变色 |
| `--skeleton-item-gap` | `24px` | 骨架项目之间的间距 |
| `--skeleton-width` | 组件类型决定（文本 100%，图片 320px，头像按 size） | 骨架块宽度 |
| `--skeleton-height` | 组件类型决定（文本为 `var(--o-font_size-text1)`，图片 180px） | 骨架块高度 |
| `--skeleton-radius` | `var(--o-radius_control-xs)` | 骨架块圆角 |
| `--skeleton-last-line-width` | `50%` | 文本占位最后一行的宽度（OSkeletonText） |
| `--skeleton-line-gap` | `calc(var(--o-line_height-text1) - var(--o-font_size-text1))` | 文本行间距（OSkeletonText） |

**使用示例**：
```vue
<OSkeleton :loading="true" style="--skeleton-bg-color: #e0e0e0; --skeleton-item-gap: 16px" />
```

---

### 响应式行为表

|------|---------|-------------|---------|
| large 头像 | 64px | 64px | 标准 |
| medium 头像 | 40px | 48px | 标准 |
| small 头像 | 32px | 32px | 标准 |

---

### 组件布局结构

**桌面端 >1440px**
```yaml
layout:
  direction: vertical
  class: o-skeleton
  condition: loading=true 时显示骨架，否则显示 default 插槽
  regions:
    - name: template
      type: slot
      description: 骨架占位区域，自由组合子组件
      default: OSkeletonText(:rows)
      children:
        - name: OSkeletonFigure
          width: 320px
          height: 180px
          border-radius: var(--o-radius_control-xs)
        - name: OSkeletonAvatar
          shape: circle(pill) | square
          variants:
            large: { width: 80px, height: 80px }
            medium: { width: 64px, height: 64px }
            small: { width: 40px, height: 40px }
            mini: { width: 24px, height: 24px }
        - name: OSkeletonText
          rows: 3  # 默认
          line-height: var(--o-font_size-text1)
          last-line-width: 50%
          line-gap: "calc(line_height-text1 - font_size-text1)"
    - name: default
      type: slot
      condition: loading=false
      description: 真实内容
  animation:
    type: gradient-shimmer
    direction: "90deg"
    colors: [control2-light, control1-light, control2-light]
    condition: animation=true
```

**≤1440px**
```yaml
# large 头像: 64px; medium 头像: 48px; small 头像: 32px
```

**≤1200px**
```yaml
# medium 头像: 40px
```
