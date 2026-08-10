> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](input-number.visual.md) · [代码使用](input-number.usage.md)

# OInputNumber 数字输入框 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--input-number-btn-color` | `var(--o-color-info3)` | 加减按钮默认图标颜色 |
| `--input-number-btn-color-hover` | `var(--o-color-info1)` | 加减按钮悬停图标颜色 |
| `--input-number-btn-color-active` | `var(--o-color-info1)` | 加减按钮激活图标颜色 |
| `--input-number-btn-color-disabled` | `var(--o-color-info4)` | 加减按钮禁用图标颜色 |
| `--input-number-btn-bg-color` | `transparent` | 加减按钮默认背景色 |
| `--input-number-btn-bg-color-hover` | `var(--o-color-control1-light)` | 加减按钮悬停背景色 |
| `--input-number-btn-bg-color-active` | `var(--o-color-control2-light)` | 加减按钮激活背景色 |
| `--input-number-btn-bg-color-disabled` | `var(--o-color-control4-light)` | 加减按钮禁用背景色 |
| `--input-number-btn-pill-fix` | `2px` | pill 圆角模式下按钮区域的内边距修正值 |

**使用示例**：
```vue
<OInputNumber v-model="count" style="--input-number-btn-color: var(--o-color-brand1)" />
```

---

### 响应式行为表

无独立的响应式断点逻辑。OInputNumber 的尺寸及响应式行为继承自底层 OInput 组件。不同 size 对应不同默认宽度（small: 90px, medium: 120px, large: 160px），该宽度在 autoWidth 模式下不生效。

---

### 组件布局结构

**桌面端 >1200px**
```yaml
layout:
  # OInputNumber 封装 OInput，外层 .o-input-number 包裹 InBox (.o_box)
  direction: horizontal
  align: center
  regions:
    - name: prepend (NumberControl 左侧)
      class: o-input-number-btn-wrap
      condition: "controls='both' 或 controls='left'"
      display: flex
      flex-wrap: wrap
      min-width: var(--_box-height)  # 等于输入框高度
      font-size: 16px
      color: var(--input-number-btn-color)  # var(--o-color-info3)
      children:
        - name: plus-btn (controls='both' 时为上箭头)
          class: o-input-number-btn
          height: "50%"  # controls='both' 时上下各半
          # controls='left' 时为 controls='both' 内的加减按钮
          background: var(--input-number-btn-bg-color)  # transparent
          hover: { color: var(--o-color-info1), bg: var(--o-color-control1-light) }
          active: { color: var(--o-color-info1), bg: var(--o-color-control2-light) }
          disabled: { color: var(--o-color-info4), bg: var(--o-color-control4-light) }
          children:
            - { type: slot, name: plus, fallback: IconChevronUp }
        - name: minus-btn
          class: o-input-number-btn
          height: "50%"
          children:
            - { type: slot, name: minus, fallback: IconChevronDown }
    - name: main (输入区域)
      class: o_box-main
      flex: 1
      children:
        - name: prefix
          condition: "$slots.prefix 存在"
          children: [{ type: slot, name: prefix }]
        - name: input
          children: [{ type: element, tag: input, only-numeric-input: true }]
        - name: suffix
          condition: "$slots.suffix 存在"
          children: [{ type: slot, name: suffix }]
    - name: append (NumberControl 右侧)
      class: o-input-number-btn-wrap
      condition: "controls='both' 或 controls='right'"
      min-width: var(--_box-height)
      children:
        - name: plus-btn
          class: o-input-number-btn
          height: "50%"  # controls='right'/'both' 上下排列
          children:
            - { type: slot, name: plus, fallback: "IconChevronUp(both) 或 IconAdd(单侧)" }
        - name: minus-btn
          class: o-input-number-btn
          height: "50%"
          children:
            - { type: slot, name: minus, fallback: "IconChevronDown(both) 或 IconMinus(单侧)" }
  variants:
    small: { width: 90px, height: "继承 OInput small" }
    medium: { width: 120px, height: "继承 OInput medium" }
    large: { width: 160px, height: "继承 OInput large" }
    controls-both:
      # prepend 内为 minus 按钮（单个，height 100%），append 内为 plus 按钮（单个，height 100%）
      prepend-type: minus  # 左侧仅减号
      append-type: plus    # 右侧仅加号
    controls-left:
      # prepend 内为加减两个按钮上下排列，无 append
      prepend-type: both
    controls-right:
      # 无 prepend，append 内为加减两个按钮上下排列
      append-type: both
    controls-none:
      # 无 prepend 和 append
    pill:
      # 按钮区域增加 padding-left/right 2px 修正（--input-number-btn-pill-fix）
```

**响应式断点**
```yaml
# 继承 OInput 的响应式行为，无独立断点
# 按钮区域 min-width 跟随 --_box-height 自动适配
```
