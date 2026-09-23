> ← [组件索引](../SKILL.md#组件索引) · [代码使用](date-picker.usage.md) · [样式定制](date-picker.style.md)

# ODatePicker 日期选择器 — 视觉识别

日期选择器组件家族包含 8 个子组件，用于日期/时间/月份/年份的单选与范围选择。所有组件继承 InBox 边框系统，使用 dayjs 进行日期格式化与计算。移动端范围选择器建议拆分为两个独立单选器 + minDate/maxDate 约束。

📱 **响应式行为**：有 media.scss 断点规则。

- **pad_v ~ laptop 区间**：large 面板 header/footer padding 缩小为 28px/40px/tip1；body padding 缩小；cell gap 缩小为 8px/12px/12px；字号 tip1。
- **触控设备**：面板标记 `.o-date-panel-touch`，面板宽度 100%，时间列显示项数缩小为 5（默认 9）。
- **范围选择器移动端降级**：建议在 pad_v 及以下使用两个独立单选器替代范围选择器，通过 minDate/maxDate 约束保证时间顺序。

🧩 **布局结构**：单选组件根元素为 InBox（继承边框/圆角/颜色/尺寸），内部为 InnerDatePicker（InInput + 日历图标 + OPopup 面板）。范围选择器根元素为 InBox，内部为两个 InInput（start + end）+ 中间分隔线 "-" + 日历图标/清除按钮。面板由 DatePanel/TimePanel 等内部组件渲染，包含 header（年份/月份切换按钮）、body（日期/月份/年份网格）、footer（确认/取消按钮）、shortcut 区域（可选）。
```yaml
# 简化结构摘要
direction(单选): InBox水平排列 [InnerDatePicker(input+icon+popup)]
direction(范围): InBox水平排列 [start-InInput | divider(-) | end-InInput | suffix-icon(calendar/clear)]
note: 面板内部包含 header(年份月份切换) + body(网格) + footer(确认取消) + shortcut(快捷选项,可选)
```

### 设计稿识别指南

**视觉特征指纹**

1. 输入框 + 右侧日历图标 → 匹配 DatePicker 系列
2. 两个输入框 + 中间 "-" 分隔 + 日历图标 → 匹配 RangePicker 系列
3. 日历网格面板（7列含星期头） → date/datetime 模式
4. 4列月网格面板 → month 模式
5. 4列年网格面板 → year 模式
6. 日历网格 + 下方 3 列时间滚动列表 → datetime 模式
7. 面板左侧快捷选项文字链接 → shortcut 插槽
8. 选中日期蓝色背景 + 反色文字 → date-panel-cell-bg-active: primary1
9. 范围中间日期浅色背景 → date-panel-cell-bg-range: control2-light
10. 今日日期边框色 → date-panel-cell-today-bd-color: primary1

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 选择框边框 | 有边框 | variant | `'outline'` | 默认 |
| 选择框背景 | 实心填充 | variant | `'solid'` | — |
| 选择框无边框 | 纯文字 | variant | `'text'` | — |
| 圆角 | 全圆角 | round | `'pill'` | — |
| 尺寸 | 大/中/小 | size | `'large'`/`'medium'`/`'small'` | — |
| 禁用 | 灰色不可交互 | disabled | `true` | — |
| 清除按钮 | hover 显示 × | clearable | `true` | — |
| 显示格式 | YYYY/MM/DD | format | `'YYYY/MM/DD'` | DatePicker 默认 |
| 显示格式 | YYYY/MM/DD HH:mm:ss | format | `'YYYY/MM/DD HH:mm:ss'` | DateTimePicker 默认 |
| 禁用日期 | 部分灰色 | disabledDate | 函数 | — |
| 周起始日 | 周一开始 | dayStartOfWeek | `1` | 默认 |
| 快捷选项 | 面板左侧文字链接 | #shortcut | 插槽 | setValue + emitChange |
| 红色边框 | 校验错误 | color | `'danger'` | OForm 内自动继承 |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| ODatePicker | OInput | DatePicker 有日历图标和弹出面板，Input 是纯输入框 |
| ODatePicker | OTimePicker | DatePicker 面板包含日期网格，TimePicker 只有时间滚动列 |
| ODateTimePicker | ODatePicker | DateTimePicker 面板在日期网格下方有时间选择区域 |
| ODateRangePicker | ODatePicker | RangePicker 是两个输入框 + "-" 分隔，DatePicker 是单个输入框 |
| ODatePicker | OCascaderV2 | DatePicker 面板是日历网格，Cascader 是多列级联菜单 |
