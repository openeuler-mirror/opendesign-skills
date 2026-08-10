> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](rate.visual.md) · [代码使用](rate.usage.md)

# ORate 评分 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--rate-color` | `var(--o-color-control1)` | 未选中图标颜色 |
| `--rate-color-selected` | 跟随 `color` prop（normal 时为 `rgb(var(--o-yellow-6))`） | 选中图标颜色 |
| `--rate-size` | `var(--o-icon_size_control-xs)`（medium） | 图标尺寸 |
| `--rate-gap` | `8px`（medium） | 图标间距 |
| `--rate-popover-color` | `var(--o-color-info1)` | 气泡文字颜色 |
| `--rate-popover-text-size` | `var(--o-font_size-tip1)` | 气泡文字字号 |
| `--rate-popover-text-height` | `var(--o-line_height-tip2)` | 气泡文字行高 |
| `--rate-popover-radius` | `var(--o-radius_control-s)` | 气泡圆角 |
| `--rate-popover-padding` | `2px 8px` | 气泡内边距 |

**使用示例**：
```vue
<ORate v-model="score" style="--rate-color-selected: #7c3aed; --rate-gap: 16px" />
```

---

### 响应式行为表

本组件无响应式差异。

---

### 组件布局结构

**ORate 评分**
```yaml
layout:
  tag: div
  direction: horizontal
  align: center
  gap: var(--rate-gap)  # large: 12px, medium: 8px
  class: o-rate o-rate-{color} o-rate-{size}
  regions:
    - name: rate-items
      repeat: count  # 默认 5
      children:
        - name: rate-item (ORateItem)
          description: 单个评分图标
          size: var(--rate-size)  # large: 控件 l, medium: 控件 xs
          color: var(--rate-color) 或 var(--rate-color-selected)
          states:
            full: 整个图标填充选中色
            half: 左半填充选中色，右半灰色
            empty: 整个图标灰色描边
          children:
            - { type: slot, name: icon }  # 默认 IconStar
  with-labels:
    description: 传入 labels 后每个 rate-item 外包 OPopover
    children:
      - name: popover-wrapper
        children:
          - { type: component, name: OPopover }
          - target: rate-item
          - content: labels[index] 文字
  variants:
    large: { icon-size: "控件 l", gap: 12px }
    medium: { icon-size: "控件 xs", gap: 8px }
  color-variants:
    normal: { selected-color: "rgb(var(--o-yellow-6))" }
    primary: { selected-color: "var(--o-color-main1)" }
    success: { selected-color: "var(--o-color-success1)" }
    warning: { selected-color: "var(--o-color-warning1)" }
    danger: { selected-color: "var(--o-color-danger1)" }
```
