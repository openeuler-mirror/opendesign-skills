> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](collapse.visual.md) · [代码使用](collapse.usage.md)

# OCollapse 折叠面板 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--collapse-radius` | `var(--o-radius_control-l)` | 容器圆角 |
| `--collapse-bg-color` | `var(--o-color-fill2)` | 容器背景色 |
| `--collapse-padding` | `8px 32px` | 容器内边距 |
| `--collapse-division-color` | `var(--o-color-control4)` | 面板项分割线颜色 |
| `--collapse-item-header-padding` | `25px 0px` | 标题区域内边距 |
| `--collapse-item-title-color` | `var(--o-color-info1)` | 标题文字颜色（收起态） |
| `--collapse-item-title-color_expanded` | `var(--o-color-primary1)` | 标题文字颜色（展开态） |
| `--collapse-item-title-text-size` | `var(--o-font_size-h3)` | 标题字号 |
| `--collapse-item-title-text-height` | `var(--o-line_height-h3)` | 标题行高 |
| `--collapse-item-body-text-size` | `var(--o-font_size-text1)` | 内容区文字字号 |
| `--collapse-item-body-text-height` | `var(--o-line_height-text1)` | 内容区文字行高 |
| `--collapse-item-icon-color` | `var(--o-color-info1)` | 展开图标颜色 |
| `--collapse-item-icon-size` | `var(--o-icon_size_control-m)` | 展开图标大小 |
| `--collapse-item-gap` | `var(--o-gap-5)` | 内容区底部间距 |

**使用示例**��
```vue
<OCollapse style="--collapse-bg-color: transparent; --collapse-padding: 0">
  <OCollapseItem title="面板" :value="1">内容</OCollapseItem>
</OCollapse>
```

---

### CSS 变量定制

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `--collapse-radius` | 圆角大小 | `var(--o-radius_control-l)` |
| `--collapse-bg-color` | 背景色 | `var(--o-color-fill2)` |
| `--collapse-padding` | 容器内边距 | `8px 32px` |
| `--collapse-division-color` | 分割线颜色 | `var(--o-color-control4)` |
| `--collapse-item-header-padding` | 标题区域内边距 | `25px 0` |
| `--collapse-item-title-color` | 标题文字颜色 | `var(--o-color-info1)` |
| `--collapse-item-title-text-size` | 标题字号 | `var(--o-font_size-h3)` |
| `--collapse-item-body-text-size` | 正文字号 | `var(--o-font_size-text1)` |
| `--collapse-item-icon-color` | 展开图标颜色 | `var(--o-color-info1)` |
| `--collapse-item-icon-size` | 展开图标大小 | `var(--o-icon_size_control-m)` |
| `--collapse-item-gap` | 内容区域底部间距 | `var(--o-gap-5)` |

---

### 响应式行为表

| 维度 | ≤840px | 841–1200px | >1200px |
|------|--------|-----------|---------|
| 容器内边距 | 0 16px | 8px 24px | 8px 32px |
| 标题区域内边距 | 16px 0 | 19px 0 | 25px 0 |
| 标题字号 | text1 | text2 | h3 |
| 正文字号 | tip1 | tip1 | text1 |
| 内容间距 | gap-3 | gap-4 | gap-5 |
| 圆角 | radius-s | radius-l | radius-l |

---

### 组件布局结构

```yaml
component: OCollapse
root: .o-collapse
  direction: column  # 内部slot纵向排列OCollapseItem
  background-color: var(--collapse-bg-color)  # var(--o-color-fill2)
  padding: var(--collapse-padding)  # 8px 32px
  border-radius: var(--collapse-radius)  # var(--o-radius_control-l)
  children:
    - component: OCollapseItem
      root: .o-collapse-item
        border-bottom: 1px solid var(--collapse-division-color)  # var(--o-color-control4)，最后一项透明
        children:
          - region: header
            class: .o-collapse-item-header
            display: flex
            flex-direction: row-reverse  # 图标在DOM前、标题在后，视觉上标题左+图标右
            justify-content: space-between
            padding: var(--collapse-item-header-padding)  # 25px 0
            cursor: pointer
            children:
              - region: icon
                class: .o-collapse-item-icon
                font-size: var(--collapse-item-icon-size)  # var(--o-icon_size_control-m)
                color: var(--collapse-item-icon-color)  # var(--o-color-info1)
                transform: rotate(90deg)  # 收起态，展开态rotate(-90deg)
                transition: transform var(--o-duration-m2) var(--o-easing-standard)
              - region: title
                class: .o-collapse-item-title
                font-size: var(--collapse-item-title-text-size)  # var(--o-font_size-h3)
                line-height: var(--collapse-item-title-text-height)  # var(--o-line_height-h3)
                color: var(--collapse-item-title-color)  # var(--o-color-info1)
                overflow: hidden; text-overflow: ellipsis; white-space: nowrap
          - region: body
            class: .o-collapse-item-body
            v-show: isExpanded  # 通过Transition动画控制展开/收起
            font-size: var(--collapse-item-body-text-size)  # var(--o-font_size-text1)
            line-height: var(--collapse-item-body-text-height)  # var(--o-line_height-text1)
            margin-bottom: var(--collapse-item-gap)  # var(--o-gap-5)
            transition: height var(--o-duration-m2) var(--o-easing-standard)

  # 展开态样式(.o-collapse-item-expanded)
  expanded-state:
    title:
      font-weight: 600
      color: var(--collapse-item-title-color_expanded)  # var(--o-color-primary1)
    icon:
      transform: rotate(-90deg)
```
