> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](link.visual.md) · [代码使用](link.usage.md)

# OLink 链接 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--link-gap` | `4px` | 前缀图标、文字、后缀图标之间的间距 |
| `--link-icon-size` | `1.14em` | 图标尺寸（medium/small 为 `var(--o-icon_size_control-xs)`，large 为 `var(--o-icon_size_control-s)`） |
| `--link-icon-align` | `-0.05em` | 图标垂直对齐偏移（medium/small 为 `-0.08em`，large 为 `-0.1em`） |
| `--link-color` | `var(--o-color-link1)`（normal） | 链接文字颜色（随 color prop 变化） |
| `--link-color-hover` | `var(--o-color-link2)`（normal） | 悬停时文字颜色 |
| `--link-color-active` | `var(--o-color-link3)`（normal） | 激活时文字颜色 |
| `--link-color-disabled` | `var(--o-color-info4)`（normal） | 禁用时文字颜色 |
| `--link-bg-color-hover` | `var(--o-color-control1-light)`（normal） | 悬停时背景色（hoverBg=true 时生效） |
| `--link-bg-color-active` | `var(--o-color-control2-light)`（normal） | 激活时背景色 |
| `--link-text-size` | — | 文字大小（medium/small 为 `var(--o-font_size-tip1)`） |
| `--link-text-height` | — | 文字行高（medium/small 为 `var(--o-line_height-tip1)`） |

**使用示例**:
```vue
<OLink color="primary" style="--link-gap: 8px; --link-icon-size: 1.5em">查看详情</OLink>
```

---

### 响应式行为表

| 维度 | ≤1440px | >1440px |
|------|---------|---------|
| large 字号 | 缩小（tip1） | 标准 |
| large 图标 | 缩小（xs） | 标准 |

---

### 组件布局结构

**桌面端 >1440px**
```yaml
layout:
  component: a.o-link  # 或自定义 tag；传入 to 时为 <router-link>
  direction: horizontal(inline)
  align: center
  gap: 4px  # --link-gap
  regions:
    - name: prefix
      element: span.o-link-prefix
      condition: icon prop 或 icon 插槽 或 loading=true
      children:
        - { type: icon, name: IconLoading(旋转), condition: "loading=true" }
        - { type: slot, name: icon, condition: "loading=false" }
      icon-size: 1.14em  # --link-icon-size
    - name: main
      element: span.o-link-main
      children:
        - element: span.o-link-label  # 仅 hoverUnderline=true 时
          children:
            - { type: slot, name: default }
    - name: suffix
      element: span.o-link-suffix
      condition: suffix prop=true 或 suffix 插槽
      children:
        - { type: slot, name: suffix, fallback: "IconLinkArrow" }
  variants:
    large: { font-size: text1, line-height: text1, icon-size: control-s }
    medium: { font-size: tip1, line-height: tip1, icon-size: control-xs }
    small: { font-size: tip1, line-height: tip1, icon-size: control-xs }
    auto: { font-size: inherit }
  color-themes:
    normal: { color: var(--o-color-link1), hover: link2, active: link3, disabled: info4 }
    primary: { color: var(--o-color-primary1), hover: primary2, active: primary3 }
    success: { color: var(--o-color-success1) }
    warning: { color: var(--o-color-warning1) }
    danger: { color: var(--o-color-danger1) }
```

**≤1440px (laptop)**
```yaml
# large: font-size tip1, line-height tip1, icon-size xs
```
