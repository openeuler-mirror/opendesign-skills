> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](checkbox.visual.md) · [代码使用](checkbox.usage.md)

# OCheckbox 多选框 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

**OCheckbox 变量：**

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--checkbox-text-size` | `var(--o-font_size-text1)` | 标签文字大小（>1200px 默认值） |
| `--checkbox-text-height` | `var(--o-line_height-text1)` | 标签文字行高 |
| `--checkbox-label-gap` | `8px` | 勾选框与文字标签的间距 |
| `--checkbox-align` | `center` | 勾选框与标签的垂直对齐方式 |
| `--checkbox-color` | `var(--o-color-info1)` | 标签文字颜色 |
| `--checkbox-color-disabled` | `var(--o-color-info4)` | 禁用状态文字颜色 |
| `--checkbox-radius` | `var(--o-radius_control-xs)` | 勾选框圆角 |
| `--checkbox-input-wrap-size` | `var(--o-control_size-s)` | 勾选框外层容器尺寸 |
| `--checkbox-input-size` | `var(--o-control_size-xs)` | 勾选框实际尺寸 |
| `--checkbox-input-bg-color` | `var(--o-color-control5-light)` | 勾选框未选中背景色 |
| `--checkbox-input-bg-color-disabled` | `var(--o-color-control4-light)` | 勾选框禁用背景色 |
| `--checkbox-input-bg-color-checked` | `var(--o-color-primary1)` | 勾选框选中背景色 |
| `--checkbox-input-bg-color-checked-hover` | `var(--o-color-primary2)` | 勾选框选中悬停背景色 |
| `--checkbox-input-bg-color-checked-active` | `var(--o-color-primary3)` | 勾选框选中按下背景色 |
| `--checkbox-input-bg-color-checked-disabled` | `var(--o-color-primary4)` | 勾选框选中禁用背景色 |
| `--checkbox-input-bd-color` | `var(--o-color-control1)` | 勾选框未选中边框颜色 |
| `--checkbox-input-bd-color-hover` | `var(--o-color-primary2)` | 勾选框未选中悬停边框颜色 |
| `--checkbox-input-bd-color-active` | `var(--o-color-primary3)` | 勾选框未选中按下边框颜色 |
| `--checkbox-input-bd-color-disabled` | `var(--o-color-control4)` | 勾选框禁用边框颜色 |
| `--checkbox-input-bd-color-checked` | `var(--o-color-primary1)` | 勾选框选中边框颜色 |
| `--checkbox-input-bd-color-checked-hover` | `var(--o-color-primary2)` | 勾选框选中悬停边框颜色 |
| `--checkbox-input-bd-color-checked-active` | `var(--o-color-primary3)` | 勾选框选中按下边框颜色 |
| `--checkbox-input-bd-color-checked-disabled` | `var(--o-color-primary4)` | 勾选框选中禁用边框颜色 |
| `--checkbox-input-icon-size` | `calc(var(--checkbox-input-size) / 2)` | 勾号/横线图标大小 |
| `--checkbox-input-icon-color` | `var(--o-color-fill2)` | 勾号/横线图标颜色 |

**OCheckboxGroup 变量：**

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--checkbox-group-gap` | `24px`（水平）/ `16px`（垂直） | 多选框之间的间距 |

**使用示例**：
```vue
<OCheckbox v-model="selected" value="1" style="--checkbox-input-bg-color-checked: var(--o-color-success1); --checkbox-input-bd-color-checked: var(--o-color-success1)">
  自定义颜色
</OCheckbox>
```

---

### 响应式行为表

| 维度 | ≤1200px | >1200px |
|------|---------|---------|
| 文字大小 | 缩小（tip1） | 标准 |
| 行高 | 缩小（tip1） | 标准 |

---

### 组件布局结构

```yaml
# OCheckbox 布局结构
root: label.o-checkbox
  direction: row (隐式，由 .o-checkbox-wrap 内部 inline 排列)
  children:
    - .o-checkbox-wrap:
        role: 勾选框整体容器
        children:
          - input[type=checkbox]: 隐藏的原生 checkbox（用于无障碍）
          - slot[checkbox] || 默认内容:
              children:
                - .o-checkbox-input-wrap:
                    role: 勾选框图标容器
                    size: var(--checkbox-input-wrap-size)  # var(--o-control_size-s)
                    children:
                      - .o-checkbox-input:
                          size: var(--checkbox-input-size)  # var(--o-control_size-xs)
                          border-radius: var(--checkbox-radius)  # var(--o-radius_control-xs)
                          bg: var(--checkbox-input-bg-color)  # var(--o-color-control5-light)
                          bg-checked: var(--checkbox-input-bg-color-checked)  # var(--o-color-primary1)
                          border: var(--checkbox-input-bd-color)  # var(--o-color-control1)
                          border-checked: var(--checkbox-input-bd-color-checked)  # var(--o-color-primary1)
                          children:
                            - span.o-checkbox-input-icon-indeterminate (半选横线) | IconChecked (勾号)
                - .o-checkbox-label:
                    role: 文字标签
                    gap-left: var(--checkbox-label-gap)  # 8px
                    children:
                      - slot[default]
                    tokens:
                      font-size: var(--checkbox-text-size)  # var(--o-font_size-text1) → var(--o-font_size-tip1)
                      line-height: var(--checkbox-text-height)  # var(--o-line_height-text1) → var(--o-line_height-tip1)
                      color: var(--checkbox-color)  # var(--o-color-info1)
                      color-disabled: var(--checkbox-color-disabled)  # var(--o-color-info4)

# OCheckboxGroup 布局结构
root: div.o-checkbox-group
  direction: row (.o-checkbox-group-h) | column (.o-checkbox-group-v)
  gap: var(--checkbox-group-gap)  # 24px (水平) | 16px (垂直)
  children:
    - slot[default] → OCheckbox × N

# 响应式断点 Token 值
breakpoints:
  ">1200px":
    --checkbox-text-size: var(--o-font_size-text1)
    --checkbox-text-height: var(--o-line_height-text1)
  "≤1200px":
    --checkbox-text-size: var(--o-font_size-tip1)
    --checkbox-text-height: var(--o-line_height-tip1)
```
