> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](radio.visual.md) · [代码使用](radio.usage.md)

# ORadio 单选框 — 样式定制

### 可覆盖的 CSS 变量

在调用处通过覆盖以下变量调整组件外观，**无需 `:deep` hack**：

**ORadioGroup 变量**

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--radio-group-gap` | 水平 `24px` / 垂直 `16px` | Radio 子项之间的间距 |

**ORadio 变量**

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--radio-label-gap` | `8px` | 圆形指示器与文字标签的间距 |
| `--radio-text-size` | `var(--o-font_size-text1)` | 文字字号 |
| `--radio-input-wrap-size` | `var(--o-control_size-s)` | 圆形指示器容器尺寸 |

**使用示例**：
```vue
<!-- 将 Radio 组间距覆盖为设计稿对应的 token（不要用硬编码 px） -->
<ORadioGroup v-model="value" style="--radio-group-gap: var(--o-gap-2)">
  <ORadio value="a">选项 A</ORadio>
  <ORadio value="b">选项 B</ORadio>
</ORadioGroup>
```

> ⚠️ **注意**：
> - 覆盖值必须使用 token 变量（如 `var(--r-o-gap-2)`），不要直接写 `8px`。token 变量在不同断点下会自动缩放，硬编码 px 不会。
> - 若同时在父元素上设置 `gap`（flex/grid），会与 `--radio-group-gap`（margin 实现）叠加，导致间距偏大。只需覆盖 `--radio-group-gap`，不要额外设置 `gap`。

---

### 响应式行为表

| 维度 | ≤1440px | >1440px |
|------|---------|---------|
| 文字 | tip1 | 标准 |

---

### 组件布局结构

**ORadio 单个单选框**
```yaml
layout:
  tag: label
  direction: horizontal
  align: center
  regions:
    - name: radio-wrap
      direction: horizontal
      align: center
      children:
        - name: radio-input-wrap
          description: 圆形选中指示器容器
          size: var(--radio-input-wrap-size)  # 控件 s
          children:
            - name: radio-input
              description: 圆形指示器
              size: var(--radio-input-size)  # 控件 xs
              border: 1px solid var(--radio-input-bd-color)
              border-radius: 50%
              bg-color: var(--radio-input-bg-color)
              checked:
                bg-color: var(--radio-input-bg-color-checked)
                inner-dot: var(--radio-input-icon-size) 白色圆点
        - name: radio-label
          description: 文字标签
          gap: var(--radio-label-gap)  # 8px
          font-size: var(--radio-text-size)  # text1
          line-height: var(--radio-text-height)
          children:
            - { type: slot, name: default }
  states:
    checked: radio-input 填充主题色 + 白色内圆点
    disabled: 整体灰色，不可点击
  custom-slot: { name: radio, replaces: 整个 radio-input-wrap + radio-label }
```

**ORadioGroup 单选框组**
```yaml
layout:
  tag: div
  direction: horizontal | vertical  # 由 direction prop 决定
  class: o-radio-group-h | o-radio-group-v
  children:
    - { type: slot, name: default }  # ORadio 子项
```

**≤1440px**
```yaml
# 文字缩小
# --radio-text-size: tip1
# --radio-text-height: tip1
```
