> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](input.visual.md) · [代码使用](input.usage.md)

# OInput 输入框 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值（medium size） | 说明 |
|--------|----------------------|------|
| `--_box-height` | `var(--o-control_size-m)` | 输入框高度 |
| `--_box-padding` | `0 15px` | 水平内边距（s: `0 7px`，l: `0 15px`） |
| `--input-icon-size` | `var(--o-icon_size-m)` | 前缀/后缀图标尺寸 |

> **注意**：`width` 不由组件变量控制，直接在调用处设置 `style="width: 120px"` 或用 CSS class 设置即可。

---

### 响应式行为表

| 维度 | ≤600px | 601–840px | 841–1200px | >1200px |
|------|--------|----------|-----------|---------|
| 大尺寸高度 | 标准控件尺寸 | 标准控件尺寸 | 36px | 标准 |
| 大尺寸文字 | tip1 | tip1 | tip1 | 标准 |
| 中尺寸高度 | 28px | 28px | 28px | 标准 |
| 大尺寸内边距 | 0 11px | 0 11px | 标准 | 标准 |

---

### 组件布局结构

**桌面端 >1200px**
```yaml
layout:
  # 外层容器 .o-input → InBox (.o_box)
  display: inline-flex
  direction: horizontal
  regions:
    - name: prepend
      class: o_box-prepend
      condition: "$slots.prepend 存在"
      border: 1px solid var(--o-color-control1)  # --_box-prepend-append-bd
      background: var(--o-color-control5-light)  # --_box-prepend-append-bg-color
      children:
        - { type: slot, name: prepend }
    - name: main
      class: o_box-main
      flex: 1
      border: 1px solid var(--_box-bd-color)  # outline 模式为 var(--o-color-control1)
      background: var(--o-color-control5-light)  # --_box-bg-color
      border-radius: var(--o-radius_control-s)  # medium
      children:
        # 内层 InInput (.o_input) 是 label 元素
        - name: prefix
          class: o_input-prefix
          condition: "$slots.prefix 存在"
          children:
            - { type: slot, name: prefix }
        - name: input-wrap
          class: o_input-wrap
          flex: 1
          children:
            - { type: element, tag: input }
        - name: suffix
          class: o_input-suffix
          condition: "有 suffix 插槽/clearable/password/showLength"
          children:
            - { type: slot, name: suffix, class: o_input-suffix-icon }
            - { type: icon, name: clear, class: o_input-clear, condition: "clearable && 有值" }
            - { type: icon, name: eye, class: o_input-eye, condition: "type=password" }
            - { type: text, name: length, class: o_input-limit, condition: "isShowLength" }
            - { type: slot, name: extra }
    - name: append
      class: o_box-append
      condition: "$slots.append 存在"
      border: 1px solid var(--o-color-control1)
      background: var(--o-color-control5-light)
      children:
        - { type: slot, name: append }
  variants:
    small:
      height: var(--o-control_size-s)
      padding: "0 7px"
      font-size: var(--o-font_size-tip1)
      border-radius: var(--o-radius_control-xs)
      icon-size: var(--o-icon_size_control-xs)
    medium:
      height: var(--o-control_size-m)
      padding: "0 15px"
      font-size: var(--o-font_size-tip1)
      border-radius: var(--o-radius_control-s)
      icon-size: var(--o-icon_size_control-xs)
    large:
      height: var(--o-control_size-l)
      padding: "0 15px"
      font-size: var(--o-font_size-text1)
      border-radius: var(--o-radius_control-l)
      icon-size: var(--o-icon_size-m)  # --input-icon-size
    pill: { border-radius: "var(--o-control_size-l)" }
```

**≤1200px（笔记本）**
```yaml
# large: height 36px, font-size tip1, line-height tip1, icon-size var(--o-icon_size-s)
# medium: height 28px
```

**≤840px（平板竖屏）**
```yaml
# large: height var(--o-control_size-l)（恢复标准）, icon-size var(--o-icon_size-m)
```

**≤600px（手机）**
```yaml
# small: padding "0 5px"
# medium: padding "0 11px"
# large: padding "0 11px"
```
