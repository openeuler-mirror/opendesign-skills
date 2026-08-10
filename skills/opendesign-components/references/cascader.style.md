> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](cascader.visual.md) · [代码使用](cascader.usage.md)

# OCascader 级联选择 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--cascader-height` | `auto` | 级联选择器整体高度 |
| `--option-list-max-height` | `378px` | 选项列表最大高度 |
| `--cascader-options-bd-color` | `var(--o-color-control1-light)` | 选项列之间的分隔线颜色 |
| `--cascader-options-gap` | `8px` | 选项列表内部间距 |
| `--cascader-option-color` | `var(--o-color-info2)` | 选项文字颜色 |
| `--cascader-option-color-hover` | `var(--o-color-info2)` | 选项悬停文字颜色 |
| `--cascader-option-color-selected` | `var(--o-color-primary1)` | 选项选中文字颜色 |
| `--cascader-option-text-size` | `var(--o-font_size-text1)` | 选项文字大小（>1200px 默认值） |
| `--cascader-option-text-height` | `var(--o-line_height-text1)` | 选项文字行高 |
| `--cascader-option-padding` | `7px 12px` | 选项内边距（>1200px 默认值） |
| `--cascader-option-radius` | `var(--o-radius_control-s)` | 选项圆角 |
| `--cascader-option-bg-color` | `transparent` | 选项默认背景色 |
| `--cascader-option-bg-color-hover` | `var(--o-color-control2-light)` | 选项悬停背景色 |
| `--cascader-option-bg-color-selected` | `var(--o-color-control3-light)` | 选项选中背景色 |
| `--cascader-option-icon-size` | `var(--o-icon_size-m)` | 展开箭头图标大小 |
| `--cascader-option-gap` | `2px` | 选项内子元素间距 |
| `--cascader-option-icon-gap` | `var(--o-gap-2)` | 选项图标与文字间距 |

**使用示例**：
```vue
<OCascader v-model="val" :options="options" style="--option-list-max-height: 240px;" />
```

---

### 响应式行为表

| 维度 | ≤1200px | >1200px |
|------|---------|---------|
| 选项字号 | 缩小（tip1） | 标准（text1） |
| 选项内边距 | 6px 12px | 7px 12px |
| 选项图标 | 缩小 | 标准 |

---

### 组件布局结构

```yaml
# OCascader 布局结构
root: OCascader
  children:
    - OSelect (触发按钮):
        role: 下拉触发器，显示选中值或 placeholder
        props-passthrough: round, variant, size, placeholder, trigger, optionPosition
    - .o-cascader (弹出面板，挂载于 OSelect 的下拉区域):
        children:
          - .o-cascader-panel:
              direction: row (横向排列多级列表)
              children:
                - .o-cascader-options (ul) × N级:
                    direction: column
                    border-right: var(--cascader-options-bd-color) # var(--o-color-control1-light)
                    gap: var(--cascader-options-gap) # 8px
                    children:
                      - .o-cascader-option (li) × M项:
                          direction: row
                          padding: var(--cascader-option-padding)  # 7px 12px (>1200px) → 6px 12px (≤1200px)
                          border-radius: var(--cascader-option-radius)  # var(--o-radius_control-s)
                          children:
                            - .o-cascader-option-label (span): 选项文字
                            - .o-cascader-option-arrow (span): IconChevronRight (仅非叶子节点)
                          tokens:
                            text-size: var(--cascader-option-text-size)  # var(--o-font_size-text1) → var(--o-font_size-tip1)
                            text-height: var(--cascader-option-text-height)  # var(--o-line_height-text1) → var(--o-line_height-tip1)
                            icon-size: var(--cascader-option-icon-size)  # var(--o-icon_size-m) → var(--o-icon_size-s)
                            color: var(--cascader-option-color)  # var(--o-color-info2)
                            color-selected: var(--cascader-option-color-selected)  # var(--o-color-primary1)
                            bg-hover: var(--cascader-option-bg-color-hover)  # var(--o-color-control2-light)
                            bg-selected: var(--cascader-option-bg-color-selected)  # var(--o-color-control3-light)

# 响应式断点 Token 值
breakpoints:
  ">1200px":
    --cascader-option-text-size: var(--o-font_size-text1)
    --cascader-option-text-height: var(--o-line_height-text1)
    --cascader-option-padding: 7px 12px
    --cascader-option-icon-size: var(--o-icon_size-m)
  "≤1200px":
    --cascader-option-text-size: var(--o-font_size-tip1)
    --cascader-option-text-height: var(--o-line_height-tip1)
    --cascader-option-padding: 6px 12px
    --cascader-option-icon-size: var(--o-icon_size-s)
```
