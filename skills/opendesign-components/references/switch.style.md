> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](switch.visual.md) · [代码使用](switch.usage.md)

# OSwitch 开关 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--switch-radius` | `var(--o-control_size-s)` | 开关轨道圆角半径（pill 模式下为 control_size-l） |
| `--switch-color` | `var(--o-color-info4)` | 开关文字/图标颜色（选中后为 info1-inverse） |
| `--switch-bg-color` | `var(--o-color-control1-light)` | 未选中状态背景色 |
| `--switch-bg-color-hover` | `var(--o-color-control2-light)` | 未选中 hover 背景色 |
| `--switch-bg-color-active` | `var(--o-color-control3-light)` | 未选中 active 背景色 |
| `--switch-bg-color-disabled` | `var(--o-color-control4-light)` | 未选中禁用背景色 |
| `--switch-bg-color-checked` | `var(--o-color-primary1)` | 选中状态背景色 |
| `--switch-bg-color-checked-hover` | `var(--o-color-primary2)` | 选中 hover 背景色 |
| `--switch-bg-color-checked-active` | `var(--o-color-primary3)` | 选中 active 背景色 |
| `--switch-bg-color-checked-disabled` | `var(--o-color-primary4)` | 选中禁用背景色 |
| `--switch-handler-bg-color` | `var(--o-color-white)` | 滑块背景色 |
| `--switch-icon-loading-color` | `var(--o-color-primary1)` | 加载图标颜色 |
| `--switch-min-width` | `40px`（medium）/ `28px`（small） | 开关最小宽度 |
| `--switch-size` | `var(--o-control_size-s)`（medium） | 开关轨道高度 |
| `--switch-text-size` | `var(--o-font_size-text1)`（medium） | 文字标签字号 |
| `--switch-text-height` | `var(--o-line_height-text1)`（medium） | 文字标签行高 |
| `--switch-handler-size` | `var(--o-control_size-xs)`（medium） | 滑块尺寸 |
| `--switch-handler-offset` | `4px` | 滑块与轨道边缘距离 |
| `--switch-label-padding` | `6px`（medium）/ `4px`（small） | 文字标签与轨道的间距 |

**使用示例**:
```vue
<OSwitch style="--switch-bg-color-checked: var(--o-color-success1)" v-model="enabled" />
```

---

### CSS 变量

| 变量名 | 说明 |
|--------|------|
| `--switch-color` | 开关颜色 |
| `--switch-text-size` | 文字大小 |
| `--switch-text-height` | 文字行高 |

---

### 响应式行为表

本组件无响应式差异。

---

### 组件布局结构

**桌面端（无响应式变化）**
```yaml
layout:
  direction: horizontal
  class: o-switch o-switch-{size}
  min-width: 40px  # medium; small 为 28px
  height: var(--o-control_size-s)  # medium 32px; small 24px
  border-radius: var(--o-control_size-s)  # pill 模式为 control_size-l
  cursor: pointer
  regions:
    - name: wrap
      class: o-switch-wrap
      direction: horizontal
      align: center
      children:
        - name: handler
          class: o-switch-handler
          width: var(--o-control_size-xs)  # medium; small 为 control_size-2xs - 4px
          height: 同 width
          border-radius: 50%
          background: var(--o-color-white)
          offset: 4px  # --switch-handler-offset
          transition: 左右滑动
          children:
            - name: loading-icon
              condition: loading=true
              class: o-switch-icon-loading o-rotating
              type: IconLoading
            - name: icon-wrap
              condition: "(active/inactive 插槽存在) && loading=false"
              class: o-switch-icon-wrap
              children:
                - { type: slot, name: active, condition: "checked" }
                - { type: slot, name: inactive, condition: "!checked" }
        - name: label
          class: o-switch-label
          condition: "on/off 插槽存在"
          padding-left: 6px  # medium; small 为 4px
          children:
            - { type: slot, name: "on", condition: "checked" }
            - { type: slot, name: "off", condition: "!checked" }
  states:
    unchecked:
      background: var(--o-color-control1-light)
      handler-position: left
    checked:
      background: var(--o-color-primary1)
      handler-position: right
    disabled:
      cursor: not-allowed
      handler-bg: "rgba(white, 0.6)"
    loading:
      cursor: not-allowed
      handler-icon: rotating spinner
  custom-icon-mode:
    description: "当有 active/inactive 插槽时，滑块背景变为 primary1，checked 时轨道背景不变"
    handler-bg: var(--o-color-primary1)
    handler-color: var(--o-color-info1-inverse)
```
