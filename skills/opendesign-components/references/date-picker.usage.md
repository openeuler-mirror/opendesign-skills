> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](date-picker.visual.md) · [样式定制](date-picker.style.md)

# ODatePicker 日期选择器 — 代码使用

### 导入方式

```vue
<script setup>
import {
  ODatePicker,
  ODateTimePicker,
  OMonthPicker,
  OYearPicker,
  ODateRangePicker,
  ODateTimeRangePicker,
  OMonthRangePicker,
  OYearRangePicker,
} from '@opensig/opendesign';
import dayjs from 'dayjs'; // 运行时依赖
</script>
```

---

### 子组件一览

| 子组件 | 选择粒度 | v-model 方式 | 默认 format |
|--------|---------|-------------|------------|
| OYearPicker | 年 | `v-model="val"` | `'YYYY'` |
| OMonthPicker | 年月 | `v-model="val"` | `'YYYY/MM'` |
| ODatePicker | 年月日 | `v-model="val"` | `'YYYY/MM/DD'` |
| ODateTimePicker | 年月日时分秒 | `v-model="val"` | `'YYYY/MM/DD HH:mm:ss'` |
| OYearRangePicker | 年范围 | `v-model:start="s" v-model:end="e"` | `'YYYY'` |
| OMonthRangePicker | 年月范围 | `v-model:start="s" v-model:end="e"` | `'YYYY/MM'` |
| ODateRangePicker | 年月日范围 | `v-model:start="s" v-model:end="e"` | `'YYYY/MM/DD'` |
| ODateTimeRangePicker | 年月日时分秒范围 | `v-model:start="s" v-model:end="e"` | `'YYYY/MM/DD HH:mm:ss'` |

---

### Events 表

**单选组件通用事件**：

| 事件名 | 参数 | 引入版本 | 触发时机 |
|--------|------|---------|---------|
| change | `(newVal: DateModelValue, oldVal: DateModelValue)` | 1.2.4 | 值变化 |
| focus | `(evt: FocusEvent)` | 1.2.4 | 获得焦点 |
| blur | — | 1.2.4 | 失去焦点 |
| clear | `(evt?: Event)` | 1.2.4 | 清空 |
| pressEnter | — | 1.2.4 | 按下回车 |

**范围选择器事件**：

| 事件名 | 参数 | 引入版本 | 触发时机 |
|--------|------|---------|---------|
| change | `(start: DateModelValue, end: DateModelValue)` | 1.2.4 | 值变化 |
| focus | `(evt: FocusEvent)` | 1.2.4 | 任一输入框获得焦点 |
| blur | — | 1.2.4 | 两个输入框都失去焦点 |
| clear | `(evt?: Event)` | 1.2.4 | 清空 |

---

### Slots 表

**单选组件插槽**：

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| prepend | — | 始终 | InBox 前置区域 | 无 |
| append | — | 始终 | InBox 后置区域 | 无 |
| shortcut | `{ setValue, emitChange }` | 始终 | 快捷选项区域 | 无 |

**范围选择器插槽**：

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| prepend | — | 始终 | InBox 前置区域 | 无 |
| append | — | 始终 | InBox 后置区域 | 无 |
| shortcut | `{ setValue(start?, end?), emitChange }` | 始终 | 快捷选项区域 | 无 |

---

### 插槽层级关系

```
InBox:
  prepend（前置区域）
  InnerDatePicker / RangeInputs:
    shortcut（快捷选项区域，面板内）
  append（后置区域）
```

⚠️ **SSR 水合注意**：不要在 `<script setup>` 顶层用 `new Date()` 或 `Date.now()` 初始化 v-model 绑定值（如 `const val = ref(Date.now())`）。服务端与客户端时间不同会导致水合不匹配。应在 `onMounted` 之后赋值：

```vue
<script setup>
import { ref, onMounted } from 'vue';
const val = ref();
onMounted(() => {
  val.value = Date.now();
});
</script>
```

---

### 典型使用场景与调用模板

**场景 1：日期选择**
适用于：选择年月日
```vue
<script setup>
import { ref } from 'vue';
const val = ref();
</script>
<template>
  <ODatePicker v-model="val" clearable placeholder="选择日期" />
</template>
```

**场景 2：日期时间选择**
适用于：选择年月日时分秒
```vue
<script setup>
import { ref } from 'vue';
const val = ref();
</script>
<template>
  <ODateTimePicker v-model="val" clearable placeholder="选择日期时间" />
</template>
```

**场景 3：月份选择**
适用于：选择年月
```vue
<OMonthPicker v-model="val" clearable placeholder="选择月份" />
```

**场景 4：年份选择**
适用于：选择年份
```vue
<OYearPicker v-model="val" clearable placeholder="选择年份" />
```

**场景 5：日期范围选择**
适用于：选择起止日期
```vue
<script setup>
import { ref } from 'vue';
const start = ref();
const end = ref();
</script>
<template>
  <ODateRangePicker v-model:start="start" v-model:end="end" clearable />
</template>
```

**场景 6：范围选择 + 快捷选项**
适用于：预设时间区间快速选择
```vue
<script setup>
import { ref } from 'vue';
import dayjs from 'dayjs';
const start = ref();
const end = ref();
</script>
<template>
  <ODateRangePicker v-model:start="start" v-model:end="end" clearable>
    <template #shortcut="{ setValue, emitChange }">
      <OLink @click="setValue(dayjs().startOf('day').valueOf(), dayjs().endOf('day').valueOf()); emitChange()">今天</OLink>
      <OLink @click="setValue(dayjs().subtract(6, 'day').startOf('day').valueOf(), dayjs().endOf('day').valueOf()); emitChange()">最近7天</OLink>
    </template>
  </ODateRangePicker>
</template>
```

**场景 7：禁用特定日期**
适用于：限制可选日期范围
```vue
<script setup>
const disabledDate = ({ date, day }) => day === 0 || day === 6; // 禁用周六周日
const disabledDateFuture = ({ date }) => date > new Date(); // 禁用未来日期
</script>
<template>
  <ODatePicker v-model="val" :disabled-date="disabledDateFuture" clearable />
</template>
```

**场景 8：自定义格式**
适用于：需要特定日期格式
```vue
<ODatePicker v-model="val" format="YYYY-MM-DD" value-format="YYYY-MM-DD" clearable />
<ODateTimePicker v-model="val" format="YYYY年MM月DD日 HH时mm分" clearable />
```

**场景 9：时间约束**
适用于：DateTimePicker 限制时间选择
```vue
<script setup>
const disabledHours = () => [0, 1, 2, 3, 4, 5]; // 禁用 0-5 时
const disabledMinutes = (hour) => hour === 12 ? [0, 30] : []; // 12时禁用 0分和30分
</script>
<template>
  <ODateTimePicker v-model="val" :disabled-hours="disabledHours" :disabled-minutes="disabledMinutes" min-time="06:00:00" max-time="23:59:59" clearable />
</template>
```

**场景 10：移动端范围选择降级**
适用于：小屏幕下使用两个独立选择器
```vue
<script setup>
import { ref } from 'vue';
const start = ref();
const end = ref();
</script>
<template>
  <OFormItem label="开始">
    <ODatePicker v-model="start" :max-date="end" clearable />
  </OFormItem>
  <OFormItem label="结束">
    <ODatePicker v-model="end" :min-date="start" clearable />
  </OFormItem>
</template>
```

**场景 11：OForm 内使用**
适用于：表单校验
```vue
<OForm :model="formData">
  <OFormItem label="日期" name="date" :rules="[{ required: true, message: '请选择日期' }]">
    <ODatePicker v-model="formData.date" clearable />
  </OFormItem>
</OForm>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 sub-component + 组合 | 说明 |
|------|--------------------------|------|
| 选择日期 | ODatePicker + `v-model` + `clearable` | 最常见 |
| 选择日期时间 | ODateTimePicker + `v-model` + `clearable` | 含时分秒 |
| 选择月份 | OMonthPicker + `v-model` + `clearable` | — |
| 选择年份 | OYearPicker + `v-model` + `clearable` | — |
| 日期范围 | ODateRangePicker + `v-model:start` + `v-model:end` | — |
| 日期时间范围 | ODateTimeRangePicker + `v-model:start` + `v-model:end` | — |
| 禁用日期 | ODatePicker + `:disabled-date` 或 `minDate` + `maxDate` | — |
| 快捷选项 | RangePicker + `#shortcut` 插槽 | setValue + emitChange |
| 移动端范围 | 两个 ODatePicker + `:min-date` / `:max-date` | 降级方案 |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| 1.2.7 | 更新 | `clearable` 接入表单继承系统（详见 [OForm 表单级统一管控](form.usage.md)） |
| 1.2.4 | 新增 | 8 个日期选择器子组件首次发布：ODatePicker/ODateTimePicker/OMonthPicker/OYearPicker + 4 个 RangePicker，依赖 dayjs 运行时 |

---

### 共享 Props 表（所有子组件通用）

| 参数名 | 类型 | 可选值 | 默认值 | 引入版本 | 说明 |
|--------|------|--------|--------|---------|------|
| placeholder | `string` | — | — | 1.2.4 | 占位文本。单选组件使用。继承自 inputProps。 |
| inputId | `string` | — | — | 1.2.4 | 输入框 ID |
| disabled | `boolean` | — | — | 1.2.4 | 禁用。继承自 inputProps。 |
| readonly | `boolean` | — | — | 1.2.4 | 只读。继承自 inputProps。 |
| size | `SizeT` | `'large'` / `'medium'` / `'small'` | — | 1.2.4 | 尺寸。"large" 大号、"medium" 中号、"small" 小号。继承自 inputProps。 |
| round | `RoundT` | `'pill'` / CSS值 | — | 1.2.4 | 圆角值。"pill" 全圆角胶囊形，或 CSS border-radius 值。继承自 inputProps。 |
| color | `'normal'` / `'success'` / `'warning'` / `'danger'` | — | `'normal'` | 1.2.4 | 颜色。"normal" 默认、"success" 成功、"warning" 警告、"danger" 危险。OForm 内自动继承校验状态。 |
| variant | `'outline'` / `'solid'` / `'text'` | — | `'outline'` | 1.2.4 | 输入框类型。"outline" 有边框轮廓、"solid" 实心填充、"text" 无边框。继承自 inputProps。 |
| format | `string` | dayjs format | 各组件不同 | 1.2.4 | 输入框显示格式。支持 dayjs format 允许的值。各组件有不同的默认值（见上表）。 |
| valueFormat | `string` | dayjs format / `'x'` | `'x'` | 1.2.4 | 绑定值格式。支持 dayjs format 值，'x' 代表时间戳。默认 'x'（毫秒时间戳）。 |
| clearable | `boolean` | — | 继承表单容器 | 1.2.4 | 可清空。悬停时显示清除图标替换日历图标。未设置时继承表单容器（详见 [OForm 表单级统一管控](form.usage.md)）。 |
| noResponsive | `boolean` | — | — | 1.2.4 | 是否禁用响应式。继承自 selectProps。 |
| optionTitle | `string` | — | — | 1.2.4 | 浮层标题。继承自 selectProps。 |
| trigger | `PopupTriggerT` | — | `'click'` | 1.2.4 | 浮层触发方式。"click"（默认）等 PopupTriggerT 值。 |
| popupPosition | `PopupPositionT` | `'bl'` 等 | `'bl'` | 1.2.4 | 浮层位置。"bl" 左下（默认）等 PopupPositionT 值。 |
| popupWrapper | `string | HTMLElement | null` | — | 浮层挂载容器。默认 "body"。 | 1.2.4 | 浮层挂载容器 |
| unmountOnHide | `boolean` | — | `true` | 1.2.4 | 关闭时卸载 DOM。默认 true。 |
| transition | `string` | — | — | 1.2.4 | 过渡动画 |
| defaultValue | `Date` (单选) / `Date[]` (范围) | — | `1970/01/01 00:00:00` (单选) / `[1970/01/01, 1970/12/31]` (范围) | 1.2.4 | 补全时间戳的默认值。单选为 Date 对象（默认 1970/01/01 00:00:00），范围选择器为 [Date, Date]（默认 [1970/01/01 00:00:00, 1970/12/31 23:59:59]）。 |

---

### 约束 Props 表（按适用组件标注）

| 参数名 | 类型 | 适用组件 | 默认值 | 引入版本 | 说明 |
|--------|------|---------|--------|---------|------|
| disabledDate | `DisabledDateFn` | DatePicker, DateTimePicker, DateRangePicker, DateTimeRangePicker | — | 1.2.4 | 禁用日期判断函数。接收 `{ date, year, month(0-indexed), day }`，返回 boolean。 |
| disabledMonth | `DisabledMonthFn` | MonthPicker, MonthRangePicker | — | 1.2.4 | 禁用月份判断函数。接收 `{ date, year, month(0-indexed) }`。MonthPicker/MonthRangePicker 使用。 |
| disabledYear | `DisabledYearFn` | YearPicker, MonthPicker, DatePicker 等 | — | 1.2.4 | 禁用年份判断函数。接收 `{ date, year }`。YearPicker/MonthPicker/DatePicker 等使用。 |
| minDate | `DateModelValue` | DatePicker, DateTimePicker, DateRangePicker 等 | — | 1.2.4 | 最小可选日期 |
| maxDate | `DateModelValue` | DatePicker, DateTimePicker, DateRangePicker 等 | — | 1.2.4 | 最大可选日期 |
| dayStartOfWeek | `number` (0-6) | DatePicker, DateTimePicker 等 | `1` | 1.2.4 | 每周起始日。0=周日，1=周一（默认），...6=周六。 |
| hourStep | `number` | DateTimePicker, DateTimeRangePicker | — | 1.2.4 | 小时步进 |
| minuteStep | `number` | DateTimePicker, DateTimeRangePicker | — | 1.2.4 | 分钟步进 |
| secondStep | `number` | DateTimePicker, DateTimeRangePicker | — | 1.2.4 | 秒步进 |
| disabledHours | `DisabledHoursFn` | DateTimePicker, DateTimeRangePicker | — | 1.2.4 | 禁用小时 |
| disabledMinutes | `DisabledMinutesFn` | DateTimePicker, DateTimeRangePicker | — | 1.2.4 | 禁用分钟 |
| disabledSeconds | `DisabledSecondsFn` | DateTimePicker, DateTimeRangePicker | — | 1.2.4 | 禁用秒 |
| minTime | `string` | DateTimePicker, DateTimeRangePicker | — | 1.2.4 | 最小可选时间 |
| maxTime | `string` | DateTimePicker, DateTimeRangePicker | — | 1.2.4 | 最大可选时间 |

---

### 范围选择器专属 Props 表

| 参数名 | 类型 | 默认值 | 引入版本 | 说明 |
|--------|------|--------|---------|------|
| placeholderStart | `string` | — | 1.2.4 | 开始日期占位文本 |
| placeholderEnd | `string` | — | 1.2.4 | 结束日期占位文本 |

---

### 各组件 format 默认值对照

| 子组件 | format 默认值 | 说明 |
|--------|-------------|------|
| OYearPicker | `'YYYY'` | 仅年份 |
| OMonthPicker | `'YYYY/MM'` | 年月 |
| ODatePicker | `'YYYY/MM/DD'` | 年月日 |
| ODateTimePicker | `'YYYY/MM/DD HH:mm:ss'` | 年月日时分秒 |
| OYearRangePicker | `'YYYY'` | 仅年份 |
| OMonthRangePicker | `'YYYY/MM'` | 年月 |
| ODateRangePicker | `'YYYY/MM/DD'` | 年月日 |
| ODateTimeRangePicker | `'YYYY/MM/DD HH:mm:ss'` | 年月日时分秒 |
