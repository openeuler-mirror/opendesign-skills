> ← [组件索引](../SKILL.md#组件索引) · [代码使用](time-picker.usage.md) · [样式定制](time-picker.style.md)

# OTimePicker 时间选择器 — 视觉识别

OTimePicker 是时间选择组件，支持时分秒的选择和范围选择。面板由 3 列滚动列表（时/分/秒）组成，继承 InBox 边框系统，依赖 dayjs 运行时。OTimeRangePicker 支持键盘导航（Tab/ArrowLeft/ArrowRight 在两个输入框间切换）。

📱 **响应式行为**：有 media.scss 断点规则。

- **≤1440px (laptop)**：large 面板时间项字号缩小为 tip1、行高 tip1。
- **触控设备**：面板标记 `.o-time-panel-touch`，时间列显示项数缩小为 5（默认 8）、项高度增大为 48px、无间距、全宽。
- **范围选择器移动端降级**：建议在 pad_v 及以下使用两个独立 OTimePicker 替代 OTimeRangePicker。

🧩 **布局结构**：OTimePicker 根元素为 InBox（继承边框/圆角/颜色/尺寸），内部为 InInput（输入框 + 时间图标 IconTime + 清除按钮 + OPopup 面板）。面板由 TimePanel 渲染，包含 3 列滚动列表（时 OScroller + 分 OScroller + 秒 OScroller）+ footer（确认/取消按钮）+ shortcut 区域。OTimeRangePicker 根元素为 InBox，内部为两个 InInput（start + end）+ 中间分隔线 "-" + 时间图标/清除按钮。
```yaml
# 简化结构摘要
direction(单选): InBox → [prepend | InInput(input+IconTime+clear+TimePanel) | append]
direction(范围): InBox → [prepend | start-InInput | divider(-) | end-InInput | suffix-icon(IconTime/clear) | append]
note: 面板为3列横向排列的时间滚动列表(时/分/秒) + footer(确认取消) + shortcut(可选)
```

### 设计稿识别指南

**视觉特征指纹**

1. 输入框 + 右侧时钟图标 → 匹配 OTimePicker
2. 两个输入框 + 中间 "-" 分隔 + 时钟图标 → 匹配 OTimeRangePicker
3. 弹出 3 列滚动列表（时/分/秒） → format="HH:mm:ss"
4. 弹出 2 列滚动列表（时/分） → format="HH:mm"
5. 时间列中选项间隔有规律（如 0,2,4...） → hourStep/minuteStep/secondStep
6. 面板下方有确认/取消按钮 → 所有 TimePicker 的 footer
7. 面板左侧快捷文字链接 → shortcut 插槽
8. 选中项蓝色文字 + 浅色背景 → item-color-active: primary1 + item-bg-active: control3-light

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 选择框边框 | 有边框 | variant | `'outline'` | 默认 |
| 选择框背景 | 实心填充 | variant | `'solid'` | — |
| 选择框无边框 | 纯文字 | variant | `'text'` | — |
| 圆角 | 全圆角 | round | `'pill'` | — |
| 尺寸 | 大/中/小 | size | `'large'`/`'medium'`/`'small'` | — |
| 禁用 | 灰色不可交互 | disabled | `true` | — |
| 清除按钮 | hover × | clearable | `true` | — |
| 格式 | HH:mm:ss | format | `'HH:mm:ss'` | 默认 |
| 格式 | HH:mm（无秒列） | format | `'HH:mm'` | — |
| 步进 | 小时 2 小时间隔 | hourStep | `2` | — |
| 步进 | 分钟 15 分钟间隔 | minuteStep | `15` | — |
| 时间范围 | 09:30 ~ 18:30 | minTime/maxTime | `'09:30:00'`/`'18:30:00'` | — |
| 红色边框 | 校验错误 | color | `'danger'` | OForm 内自动继承 |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OTimePicker | ODatePicker | TimePicker 面板是 3 列时间滚动列表，DatePicker 面板是日历网格 |
| OTimePicker | OInput | TimePicker 有时钟图标和时间弹出面板 |
| OTimePicker | OSelect | TimePicker 面板是时间滚动列表，Select 是下拉选项列表 |
| OTimeRangePicker | ODateRangePicker | TimeRange 面板是双组 3 列时间列表，DateRange 面板是日历网格 |
