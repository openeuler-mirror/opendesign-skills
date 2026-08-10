> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](time-picker.visual.md) · [代码使用](time-picker.usage.md)

# OTimePicker 时间选择器 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

**选择器触发器变量**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--time-range-picker-bg-color-focus` | `var(--o-color-control2-light)` | 范围选择器分隔区域聚焦时背景色 |

**面板变量**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--time-panel-bg` | `var(--o-color-fill2)` | 面板背景色 |
| `--time-panel-shadow` | `var(--o-shadow-2)` | 面板阴影 |
| `--time-panel-content-padding` | `6px 0` | 内容区域 padding |
| `--time-panel-footer-padding` | `8px 16px` | footer padding |
| `--time-panel-item-height` | `24px` | 时间项高度 |
| `--time-panel-item-width` | `40px` | 时间项宽度 |
| `--time-panel-item-gap` | `4px` | 时间项间距 |
| `--time-panel-col-width` | `96px` | 时间列宽度 |
| `--time-panel-col-show-item-count` | `8` | 时间列显示项数 |
| `--time-panel-col-height` | `calc(showItemCount * (itemHeight + gap))` | 时间列高度（自动计算） |
| `--time-panel-item-color` | `var(--o-color-info1)` | 普通项文字色 |
| `--time-panel-item-color-active` | `var(--o-color-primary1)` | 选中项文字色 |
| `--time-panel-item-color-disabled` | `var(--o-color-info4)` | 禁用项文字色 |
| `--time-panel-item-bg-hover` | `var(--o-color-control2-light)` | hover 背景色 |
| `--time-panel-item-bg-active` | `var(--o-color-control3-light)` | 选中背景色 |
| `--time-panel-text-size` | `var(--o-font_size-tip1)` | 面板字号 |
| `--time-panel-item-text-size` | `var(--o-font_size-tip1)` | 时间项字号 |

large 面板专属变量：

| 变量名 | large 默认值 | 说明 |
|--------|-------------|------|
| `--time-panel-item-text-size` | `var(--o-font_size-text1)` | 时间项字号增大 |

**使用示例**:
```vue
<OTimePicker v-model="val" style="--time-panel-col-width: 120px; --time-panel-col-show-item-count: 10" />
```

---

### 响应式行为表

| 维度 | ≤1440px (laptop) | 触控设备 | >1440px |
|------|-----------------|---------|---------|
| large 时间项字号 | tip1 | text1 | text1 |
| large 时间项行高 | tip1 | text1 | text1 |
| 时间列显示项数 | 8 | 5（touch） | 8 |
| 时间项高度 | 24px | 48px（touch） | 24px |
| 时间项间距 | 4px | 0px（touch） | 4px |
| 范围选择器 | 建议拆为两个独立选择器 | 同 | 正常范围选择器 |

---

### 组件布局结构

**OTimePicker**
```yaml
layout:
  component: InBox.o-time-picker.o-input
  direction: horizontal
  regions:
    - prepend(#prepend 插槽, 可选)
    - InInput(input + suffix)
      - input(时间值输入, maxlength=format.length, readonly可通过面板交互)
      - suffix(IconTime, clearable时hover显示IconClose)
      - panel(OPopup → TimePanel)
        - content: 3列横向 OScroller(时/分/秒)
          - 每列: ul > li 时间项(可选中/禁用)
          - format不含ss时秒列不显示
        - footer(确认/取消按钮)
        - shortcut(#shortcut 插槽, 可选)
    - append(#append 插槽, 可选)
```

**OTimeRangePicker**
```yaml
layout:
  component: InBox.o-time-picker.o-time-range-picker.o-input
  direction: horizontal
  regions:
    - prepend(#prepend 插槽, 可选)
    - start-InInput(开始时间输入框, readonly)
      - panel(OPopup → TimeRangePanel)
        - shortcut(#shortcut 插槽, 可选)
    - divider(span.o-time-range-picker-divider, 文字 "-")
    - end-InInput(结束时间输入框, readonly)
    - suffix(IconTime + clearable时IconClose)
    - append(#append 插槽, 可选)
  keyboard-navigation:
    Tab: start → end → 离开组件
    ArrowRight: start 末尾 → end
    ArrowLeft: end 开头 → start
```
