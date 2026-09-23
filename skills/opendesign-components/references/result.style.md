> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](result.visual.md) · [代码使用](result.usage.md)

# OResult 结果页 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--result-image-width` | `240px` | 顶部图片区域宽度 |
| `--result-image-height` | `210px` | 顶部图片区域高度 |
| `--result-image-gap` | `16px` | 图片与下方内容的间距 |
| `--result-icon-size` | `var(--o-icon_size_control-xl)` | 状态图标尺寸 |
| `--result-icon-gap` | `12px` | 图标与标题文字的间距 |
| `--result-icon-color` | 跟随 `status` prop | 状态图标颜色 |
| `--result-title-color` | `var(--o-color-info1)` | 标题文字颜色 |
| `--result-title-text-size` | `var(--o-font_size-h3)` | 标题字号 |
| `--result-title-text-height` | `var(--o-line_height-h3)` | 标题行高 |
| `--result-desc-color` | `var(--o-color-info3)` | 描述文字颜色 |
| `--result-desc-text-size` | `var(--o-font_size-text1)` | 描述字号 |
| `--result-desc-text-height` | `var(--o-line_height-text1)` | 描述行高 |
| `--result-desc-gap` | `12px` | 描述与标题的间距 |
| `--result-extra-gap` | `24px` | 操作按钮区与描述的间距 |

**使用示例**：
```vue
<OResult status="success" title="完成" style="--result-title-color: #7c3aed; --result-extra-gap: 32px" />
```

---

### 响应式行为表

| 维度 | ≤840px | 841–1440px | >1440px |
|------|--------|-----------|---------|
| 图片尺寸 | 160×140px | 160×140px | 标准 |
| 图标尺寸 | 48px | 控件 l | 标准 |
| 标题文字 | text1 | text2 | 标准 |
| 描述文字 | tip2 | tip1 | 标准 |
| 标题布局 | 垂直（图标在上） | 水平 | 水平 |

---

### 组件布局结构

**桌面端 >1440px**
```yaml
layout:
  tag: div
  direction: vertical
  align: center
  class: o-result o-result-{status}
  regions:
    - name: result-image
      condition: $slots.image
      description: 顶部图片/插画区域
      size: var(--result-image-width) × var(--result-image-height)  # 240×210px
      gap-bottom: var(--result-image-gap)  # 16px
      children:
        - { type: slot, name: image }
    - name: result-header
      condition: status || $slots.icon || title || $slots.title
      direction: horizontal
      align: center
      children:
        - name: result-icon
          condition: status || $slots.icon
          size: var(--result-icon-size)  # 控件 xl
          color: var(--result-icon-color)  # 跟随 status
          gap-right: var(--result-icon-gap)  # 12px
          children:
            - { type: slot, name: icon, fallback: "状态对应默认图标" }
        - name: result-title
          font-size: var(--result-title-text-size)  # h3
          line-height: var(--result-title-text-height)
          color: var(--result-title-color)
          children:
            - { type: slot, name: title, fallback: "{{ title }}" }
    - name: result-description
      condition: description || $slots.description
      font-size: var(--result-desc-text-size)  # text1
      line-height: var(--result-desc-text-height)
      color: var(--result-desc-color)  # info3
      gap-top: var(--result-desc-gap)  # 12px
      children:
        - { type: slot, name: description, fallback: "{{ description }}" }
    - name: result-extra
      condition: $slots.extra
      gap-top: var(--result-extra-gap)  # 24px
      children:
        - { type: slot, name: extra }  # 操作按钮区
    - name: result-content
      condition: $slots.default
      children:
        - { type: slot, name: default }  # 详细内容区
  status-colors:
    info: "var(--o-color-primary1)"
    success: "var(--o-color-success1)"
    warning: "var(--o-color-warning1)"
    danger: "var(--o-color-danger1)"
```

**841–1440px**
```yaml
# 图片: 160×140px, gap 8px
# 图标: 控件 l
# 标题: text2
# 描述: tip1, gap 8px
```

**≤840px**
```yaml
# 图标: 48px, gap 8px
# 标题: text1
# 描述: tip2, gap 8px
# header 由 horizontal 变为 vertical (flex-direction: column)
# 图标 margin-right: 0, margin-bottom: gap
```
