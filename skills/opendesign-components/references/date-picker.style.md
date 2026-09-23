> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](date-picker.visual.md) · [代码使用](date-picker.usage.md)

# ODatePicker 日期选择器 — 样式定制

### 可覆盖的 CSS 变量

在调用处覆盖以下变量调整组件外观，**无需 `:deep` hack**：

**选择器触发器变量**（继承 InBox/OInput 变量）：

| 变量名 | 说明 |
|--------|------|
| `--date-range-picker-bg-color-focus` | 范围选择器中间分隔区域聚焦时的背景色，默认 `var(--o-color-control2-light)` |

**面板变量**：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--date-panel-bg` | `var(--o-color-fill2)` | 面板背景色 |
| `--date-panel-shadow` | `var(--o-shadow-2)` | 面板阴影 |
| `--date-panel-operation-padding-x` | `28px` | header/footer 横向 padding |
| `--date-panel-operation-height` | `40px` | header/footer 高度 |
| `--date-panel-operation-text-size` | `var(--o-font_size-tip1)` | header/footer 字号 |
| `--date-panel-text-size` | `var(--o-font_size-tip1)` | 日期网格字号 |
| `--date-panel-body-padding-date` | `16px 16px 8px 16px` | 日期 body padding |
| `--date-panel-body-padding-month` | `12px 28px` | 月份 body padding |
| `--date-panel-body-padding-year` | `12px 32px` | 年份 body padding |
| `--date-panel-cell-gap-date-y` | `8px` | 日期行间距 |
| `--date-panel-cell-gap-month-x` | `32px` | 月份列间距 |
| `--date-panel-cell-gap-year-x` | `40px` | 年份列间距 |
| `--date-panel-cell-width-date` | `40px` | 日期单元格宽度 |
| `--date-panel-cell-width-month` | `64px` | 月份单元格宽度 |
| `--date-panel-cell-width-year` | `56px` | 年份单元格宽度 |
| `--date-panel-cell-color` | `var(--o-color-info1)` | 普通日期文字色 |
| `--date-panel-cell-color-active` | `var(--o-color-info1-inverse)` | 选中日期文字反色 |
| `--date-panel-cell-color-disabled` | `var(--o-color-info4)` | 禁用日期文字色 |
| `--date-panel-cell-bg-hover` | `var(--o-color-control2-light)` | hover 背景色 |
| `--date-panel-cell-bg-active` | `var(--o-color-primary1)` | 选中背景色 |
| `--date-panel-cell-bg-range` | `var(--o-color-control2-light)` | 范围中间日期背景色 |
| `--date-panel-cell-today-bd-color` | `var(--o-color-primary1)` | 今日日期边框色 |
| `--date-panel-shortcut-text-size` | `var(--o-font_size-tip1)` | 快捷选项字号 |

**使用示例**:
```vue
<ODatePicker v-model="val" style="--date-panel-cell-bg-active: #1a73e8" />
```

---

### 响应式行为表

| 维度 | pad_v ~ laptop | 触控设备 | > laptop |
|------|---------------|---------|---------|
| large 面板 header padding | 28px | 28px | 24px |
| large 面板 header 高度 | 40px | 40px | 48px |
| large 面板字号 | tip1 | tip1 | text1 |
| large 日期行间距 | 8px | 8px | 12px |
| 时间列显示项数 | 9 | 5（touch） | 9 |
| 范围选择器 | 建议拆为两个独立选择器 | 建议拆为两个 | 正常范围选择器 |

---

### 组件布局结构

**单选选择器**
```yaml
layout:
  component: InBox.o-date-picker.o-input
  direction: horizontal
  regions:
    - prepend(#prepend 插槽, 可选)
    - InnerDatePicker(InInput + 日历图标 + OPopup 面板)
      - input(readonly, 显示 format 格式化值)
      - icon(IconCalendar, has-icon=true)
      - panel(OPopup)
        - InnerPanel(DatePanel/TimePanel)
          - header(年份月份切换按钮)
          - body(日期/月份/年份网格)
          - footer(确认/取消按钮, datetime模式)
          - shortcut(#shortcut 插槽, 可选)
    - append(#append 插槽, 可选)
```

**范围选择器**
```yaml
layout:
  component: InBox.o-date-range-picker.o-input
  direction: horizontal
  regions:
    - prepend(#prepend 插槽, 可选)
    - start-InInput(开始日期输入框, readonly)
      - panel(DateRangePanel)
        - shortcut(#shortcut 插槽, 可选)
    - divider(span.o-date-range-picker-divider, 文字 "-")
    - end-InInput(结束日期输入框, readonly)
    - suffix-icon(IconCalendar / IconClose(clearable时hover))
    - append(#append 插槽, 可选)
```
