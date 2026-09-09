> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](select.visual.md) · [代码使用](select.usage.md)

# OSelect 选择器 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

| 变量名 | 默认值（medium size） | 说明 |
|--------|----------------------|------|
| `--select-height` | `var(--o-control_size-m)` | 选择框高度 |
| `--select-padding` | `0 15px` | 水平内边距（s: `0 8px`） |
| `--select-radius` | `var(--o-radius_control-s)` | 圆角 |
| `--select-text-size` | `var(--o-font_size-tip1)` | 文字字号 |
| `--select-icon-size` | `var(--o-icon_size_control-xs)` | 箭头图标尺寸 |
| `--select-icon-gap` | `var(--o-gap-2)` | 图标与文字间距 |
| `--select-multiple-max-height` | `64px` | 多选时输入框最大高度 |
| `--select-tag-padding` | `2px 8px` | 多选标签内边距 |
| `--select-tag-radius` | `24px` | 多选标签圆角 |
| `--select-bg-color` | `var(--o-color-fill2)` | 选择框背景色（v1.2.6 从 control5-light 改为 fill2） |
| `--select-bg-color-hover` | `var(--o-color-fill2)` | hover 背景色（v1.2.6 从 control5-light 改为 fill2） |
| `--select-bg-color-focus` | `var(--o-color-fill2)` | 聚焦背景色（v1.2.6 从 control5-light 改为 fill2） |
| `--select-bg-color-disabled` | `var(--o-color-fill2)` | 禁用背景色（v1.2.6 从 control4-light 改为 fill2） |

> **注意**：`width` 不由组件变量控制，直接在调用处设置 CSS `width` 即可。

---

**1.2.7 新增 / 注意**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--option-list-max-height-default` | `302px` | 虚拟滚动模式下选项列表的默认最大高度 |
| `--select-tag-margin` | `2px 0 2px 4px` | 多选标签外边距（v1.2.7 方向调整） |
| `--select-tag-popover-max-width` | `360px` | 折叠标签弹出层最大宽度 |
| `--_overlay-left` / `--_overlay-right` | `0` | 内部变量：`renderLabel` 选中值浮层相对选择框的左右偏移，由 JS 测量主 input 后注入（SSR 回退 0），一般无需覆盖 |

> ⚠️ `--select-radius` 会被 `round` prop 的 inline 样式覆盖——通过 `round` prop 设置圆角时，仅改 CSS 变量无效。

### 响应式行为表

| 维度 | ≤840px | 841–1440px | >1440px |
|------|--------|-----------|---------|
| large 高度 | 标准控件尺寸 | 36px | 标准 |
| large 文字 | 标准 | tip1 | 标准 |
| large 图标 | 控件 m | 控件 s | 标准 |
| medium 高度 | 28px | 28px | 标准 |
| 选项面板 | Dialog 底部弹出 | Popup 下拉 | Popup 下拉 |

---

### 组件布局结构

**OSelect 选择器（触发器部分）**
```yaml
layout:
  tag: div
  direction: horizontal
  align: center
  class: o-select o-select-{color} o-select-{variant} o-select-{size}
  border: 1px solid var(--select-bd-color)
  border-radius: var(--select-radius)
  height: var(--select-height)
  bg-color: var(--select-bg-color)
  regions:
    - name: select-input (单选模式)
      condition: !multiple || (multiple && valueList.length === 0)
      flex: 1
      children:
        - tag: input[readonly]
          placeholder: var(--select-placeholder)
          font-size: var(--select-text-size)
    - name: select-tags (多选模式)
      condition: multiple && valueList.length > 0
      flex: 1
      component: OScroller
      class: o-select-tags-scroller
      children:
        - name: select-tags-wrap
          direction: horizontal
          wrap: wrap
          max-height: var(--select-multiple-max-height)
          children:
            - name: select-tag (× N)
              bg-color: var(--select-tag-bg-color)
              border-radius: var(--select-tag-radius)  # 24px
              padding: var(--select-tag-padding)
              children:
                - text: optionLabels[value]
                - name: tag-remove
                  icon: IconClose
            - name: fold-tag (超出 maxTagCount)
              condition: showFoldTags && valueListFold.length > 0
              component: OPopover
              children:
                - { type: slot, name: tag-fold, fallback: "+N..." }
    - name: select-suffix
      direction: horizontal
      align: center
      gap: var(--select-icon-gap)
      children:
        - name: select-loading
          condition: loading
          icon: IconLoading (rotating)
        - name: select-clear
          condition: clearable && !disabled && hasValue
          icon: IconClose
          click: clearClick
        - name: select-arrow
          icon-size: var(--select-icon-size)
          children:
            - { type: slot, name: arrow, fallback: IconChevronDown }
        - name: suffix-slot
          children:
            - { type: slot, name: suffix }
  variants:
    large: { height: "控件 l (40px)", padding: "0 15px", icon-size: "控件 m", radius: "控件 l" }
    medium: { height: "控件 m (32px)", padding: "0 15px", icon-size: "控件 xs", radius: "控件 s" }
    small: { height: "控件 s (28px)", padding: "0 8px", icon-size: "控件 xs", radius: "控件 xs" }
```

**选项面板（桌面端 OPopup）**
```yaml
layout:
  component: OPopup
  position: var(--optionPosition)  # 默认 bl
  width-mode: var(--optionWidthMode)  # 默认 min-width
  children:
    - name: SelectOption
      component: OOptionList + OScroller
      class: o-select-options o-select-options-{size}
      children:
        - name: option-list
          children:
            - { type: slot, name: default }  # OOption / OOptionGroup 子项
        - name: select-actions
          condition: $slots.action
          children:
            - { type: slot, name: action }
```

**选项面板（移动端 ODialog）**
```yaml
layout:
  component: ODialog
  size: small
  position: bottom
  children:
    - header: optionTitle
    - body: SelectOption (同桌面端)
    - actions (多选模式): [取消按钮, 确认按钮]
```

**OOption 选项**
```yaml
layout:
  tag: div
  class: o-option
  children:
    - name: option-item
      direction: horizontal
      align: center
      states:
        active: 选中高亮
        disabled: 灰色不可点击
      children (单选):
        - { type: slot, name: default, fallback: "{{ label }}" }
      children (多选):
        - component: OCheckbox
        - { type: slot, name: default, fallback: "{{ label }}" }
```

**OOptionGroup 选项分组**
```yaml
layout:
  tag: div
  class: o-option-group
  children:
    - name: option-group-name
      children:
        - { type: slot, name: name, fallback: "{{ name }}" }
    - name: option-group-items
      children:
        - { type: slot, name: default }  # OOption 子项
```

**≤1440px**
```yaml
# large: height 36px, text-size tip1, icon-size 控件 s
# medium: height 28px
```

**≤840px**
```yaml
# large: height 恢复标准控件尺寸, icon-size 控件 m
# 选项面板: ODialog 底部弹出替代 OPopup
# 多选模式: checkbox 布局反转 (row-reverse)，选项间有底部分割线
```

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.7 | 多选标签间距方向调整（`--select-tag-margin`）；新增内部变量 `--_overlay-left`/`--_overlay-right`（renderLabel 浮层定位，JS 测量注入，一般无需覆盖） |
| v1.2.6 | 背景色 CSS 变量从 control5-light/control4-light 改为 fill2；关闭按钮尺寸跟随 `--select-icon-size` |
