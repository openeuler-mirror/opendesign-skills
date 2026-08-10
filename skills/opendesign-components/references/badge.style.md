> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](badge.visual.md) · [代码使用](badge.usage.md)

# OBadge 徽标 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--badge-text-size` | `var(--o-font_size-tip2)` | 徽标文字大小 |
| `--badge-text-height` | `var(--o-line_height-tip2)` | 徽标文字行高 |
| `--badge-radius` | `var(--o-control_size-l)` | 徽标圆角（默认全圆角） |
| `--badge-padding` | `2px` | 徽标内边距 |
| `--badge-min-width` | `12px` | 徽标最小宽度 |
| `--badge-dot-size` | `6px` | 小红点尺寸（dot 模式） |
| `--badge-height` | `12px` | 徽标高度 |
| `--badge-color` | `var(--o-color-white)` | 徽标文字颜色（由 color prop 决定） |
| `--badge-bg-color` | `var(--o-color-primary1)` | 徽标背景色（由 color prop 决定） |

**使用示例**：
```vue
<OBadge :value="9" style="--badge-height: 16px; --badge-min-width: 16px;" />
```

---

### 响应式行为表

本组件无显著响应式差异。

---

### 组件布局结构

```yaml
# layout: inline（唯一布局模式）
root: .o-badge
  direction: inline
  children:
    - slot-default:
        desc: 被装饰的主体内容（按钮、头像等）
        optional: true  # 不传时为独立模式 .o-badge-only
    - sup.o-badge-content:
        position: absolute (top + right，受 offset 偏移)
        # 独立模式时变为 static 行内展示
        children:
          - slot-content:
              fallback: .o-badge-label {{ content }}

# 变体
dot-mode:  # dot=true
  .o-badge-content:
    size: 6px × 6px (--badge-dot-size)
    content: 无（隐藏 label）

normal-mode:  # dot=false
  .o-badge-content:
    min-width: 12px (--badge-min-width)
    height: 12px (--badge-height)
    padding: 2px (--badge-padding)
    border-radius: --o-control_size-l (全圆角)
    font-size: --o-font_size-tip2
    color: --badge-color (白色)
    background: --badge-bg-color (随 color prop 变化)

# 响应式
breakpoints:
  "<=840px":
    badge-dot-size: 6px  # 保持不变
```
