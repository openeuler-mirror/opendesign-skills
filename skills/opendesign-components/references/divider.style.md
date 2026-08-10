> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](divider.visual.md) · [代码使用](divider.usage.md)

# ODivider 分割线 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--o-divider-color` | `var(--o-color-info1)` | 标签文字颜色 |
| `--o-divider-text-size` | `var(--o-font_size-text1)` | 标签文字字号 |
| `--o-divider-text-height` | `var(--o-line_height-text1)` | 标签文字行高 |
| `--o-divider-label-gap` | `0 12px` | 标签左右外边距（水平分割线） / 垂直分割线左右外边距 |
| `--o-divider-bd-color` | `var(--o-color-control4)` | 分割线颜色（deeper 时为 `var(--o-color-control1)`） |
| `--o-divider-gap` | `12px` | 水平分割线上下外边距 / 垂直分割线左右外边距 |

**使用示例**：
```vue
<ODivider style="--o-divider-bd-color: var(--o-color-primary1); --o-divider-gap: 24px" />
```

---

### 响应式行为表

| 维度 | ≤840px | 841–1200px | >1200px |
|------|--------|-----------|---------|
| 标签字号 | tip1 | tip1 | 标准 |
| 水平线粗细 | 0.5px（scaleY） | 标准 | 标准 |
| 垂直线粗细 | 0.5px（scaleX） | 标准 | 标准 |

---

### 组件布局结构

**桌面端 >1200px**
```yaml
layout:
  horizontal:  # direction="h"
    element: .o-divider.o-divider-h
    display: flex
    align-items: center
    width: 100%
    margin: 12px 0  # --o-divider-gap
    role: separator
    regions:
      - name: line-left
        element: .o-divider-line
        width: 100%  # 无标签时仅此一段
        height: 1px
        border-top: 1px {variant} var(--o-divider-bd-color)
      - name: label  # 仅有 default 插槽时渲染
        element: .o-divider-label
        white-space: nowrap
        margin: 0 12px  # --o-divider-label-gap
        font-size: var(--o-font_size-text1)
        font-weight: 500
        children:
          - { type: slot, name: default }
      - name: line-right  # 仅有 default 插槽时渲染
        element: .o-divider-line
        width: 100%
        height: 1px
    label-position:
      left: { line-left-width: 28px, line-right-width: 100% }
      center: { line-left-width: 100%, line-right-width: 100% }
      right: { line-left-width: 100%, line-right-width: 28px }
  vertical:  # direction="v"
    element: .o-divider.o-divider-v
    display: inline-block
    width: 1px
    height: 1em
    margin: 0 12px  # --o-divider-label-gap
    vertical-align: middle
    border-left: 1px {variant} var(--o-divider-bd-color)
  variants:
    solid: { border-style: solid }
    dashed: { border-style: dashed }
    dotted: { border-style: dotted }
    darker: { border-color: "var(--o-color-control1)" }
```

**≤1200px**
```yaml
# label font-size: tip1
```

**≤840px**
```yaml
# 水平线: transform scaleY(0.5) — 视觉上变为 0.5px
# 垂直线: transform scaleX(0.5) — 视觉上变为 0.5px
```
