> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](toggle.visual.md) · [代码使用](toggle.usage.md)

# OToggle 选择块 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--toggle-size` | `var(--o-control_size-m)`（桌面 36px） | 按钮高度 |
| `--toggle-padding` | `0 15px` | 水平内边距 |
| `--toggle-radius` | `var(--o-radius_control-s)` | 圆角（pill 时为 `var(--o-control_size-l)`） |
| `--toggle-gap` | `4px` | 图标与文字间距 |
| `--toggle-text-size` | `var(--o-font_size-text1)` | 文字字号 |
| `--toggle-icon-size` | `var(--o-icon_size_control-m)` | 图标尺寸 |

**使用示例**：
```vue
<!-- 将 Toggle 内边距从默认 0 15px 改为 0 8px -->
<OToggle style="--toggle-padding: 0 8px">标签</OToggle>
```

---

### 响应式行为表

| 维度 | ≤840px | 841–1440px | >1440px |
|------|--------|-----------|---------|
| 按钮高度 | 28px | 28px | 36px |
| 文字 | tip1 | tip1 | text1 |
| 图标 | 控件 xs | 控件 xs | 控件 m |
| 内边距 | 0 11px | 0 15px | 0 15px |

---

### 组件布局结构

**桌面端 >1440px**
```yaml
layout:
  element: div.o-toggle
  direction: horizontal
  align: center
  height: 36px  # --toggle-size, var(--o-control_size-m)
  padding: 0 15px  # --toggle-padding
  border-radius: var(--o-radius_control-s)  # --toggle-radius
  gap: 4px  # --toggle-gap
  regions:
    - name: prefix
      element: span.o-toggle-prefix
      condition: 有 icon prop 或 icon 插槽时
      children:
        - { type: slot, name: icon }  # 或 component :is="icon"
      icon-size: var(--o-icon_size_control-m)  # --toggle-icon-size
    - name: content
      children:
        - { type: slot, name: default }  # 按钮文字
      font-size: text1
  states:
    unchecked:
      color: var(--o-color-info1)
      bg: var(--o-color-fill1)
      border: var(--o-color-fill1)
    checked:
      color: var(--o-color-primary1)
      bg: transparent
      border: var(--o-color-primary1)
    disabled:
      color: var(--o-color-info4)
      bg: transparent
      border: transparent
  variants:
    pill: { border-radius: "var(--o-control_size-l)" }
```

**≤1440px**
```yaml
# height: 28px, font-size: tip1, icon-size: xs
```

**≤840px**
```yaml
# padding: 0 11px
```
