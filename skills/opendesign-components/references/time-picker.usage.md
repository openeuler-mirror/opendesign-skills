> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](time-picker.visual.md) · [样式定制](time-picker.style.md)

# OTimePicker 时间选择器 — 代码使用

### 导入方式

```vue
<script setup>
import { OTimePicker, OTimeRangePicker } from '@opensig/opendesign';
import dayjs from 'dayjs'; // 运行时依赖
</script>
```

---

### 子组件一览

| 子组件 | 选择粒度 | v-model 方式 | 默认 format |
|--------|---------|-------------|------------|
| OTimePicker | 时分秒 | `v-model="val"` | `'HH:mm:ss'` |
| OTimeRangePicker | 时分秒范围 | `v-model:start="s" v-model:end="e"` | `'HH:mm:ss'` |

---

### Events 表

**OTimePicker 事件**：

| 事件名 | 参数 | 引入版本 | 触发时机 |
|--------|------|---------|---------|
| change | `(newVal: string | undefined, oldVal: string | undefined)` | 1.2.4 | 值变化 |
| focus | `(evt: FocusEvent)` | 1.2.4 | 获得焦点 |
| blur | — | 1.2.4 | 失去焦点 |
| clear | `(evt?: Event)` | 1.2.4 | 清空 |
| pressEnter | — | 1.2.4 | 按下回车 |

**OTimeRangePicker 事件**：

| 事件名 | 参数 | 引入版本 | 触发时机 |
|--------|------|---------|---------|
| change | `(newVal: TimeRangeValue, oldVal: TimeRangeValue)` | 1.2.4 | 值变化（start/end 都有值或都无值时） |
| focus | `(evt: FocusEvent)` | 1.2.4 | 任一输入框获得焦点 |
| blur | — | 1.2.4 | 两个输入框都失去焦点 |
| clear | — | 1.2.4 | 清空 |
| pressEnter | — | 1.2.4 | 按下回车（两端值合法时） |

---

### Slots 表

**OTimePicker 插槽**：

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| prepend | — | 始终 | InBox 前置区域 | 无 |
| append | — | 始终 | InBox 后置区域 | 无 |
| shortcut | `{ setValue, emitChange }` | 始终 | 面板快捷选项区域 | 无 |

**OTimeRangePicker 插槽**：

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| prepend | — | 始终 | InBox 前置区域 | 无 |
| append | — | 始终 | InBox 后置区域 | 无 |
| shortcut | `{ setValue(start?, end?), emitChange }` | 始终 | 面板快捷选项区域 | 无 |

---

### 插槽层级关系

```
InBox:
  prepend（前置区域）
  InInput / RangeInputs:
    shortcut（快捷选项，面板内）
  append（后置区域）
```

⚠️ **SSR 水合注意**：不要在 `<script setup>` 顶层用 `new Date()` 或 `Date.now()` 初始化 v-model 绑定值。服务端与客户端时间不同会导致水合不匹配。应在 `onMounted` 之后赋值：

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

**场景 1：基础时间选择**
适用于：选择时分秒
```vue
<script setup>
import { ref } from 'vue';
const val = ref();
</script>
<template>
  <OTimePicker v-model="val" clearable placeholder="选择时间" />
</template>
```

**场景 2：仅时分选择**
适用于：不需要秒精度
```vue
<OTimePicker v-model="val" format="HH:mm" clearable placeholder="选择时分" />
```

**场景 3：步进设置**
适用于：小时/分钟/秒按固定间隔选择
```vue
<OTimePicker v-model="val" :hour-step="2" :minute-step="15" :second-step="10" clearable />
```

**场景 4：禁用特定时间**
适用于：精确限制可选时间
```vue
<script setup>
const disabledHours = () => [0, 1, 2, 3, 4, 5, 6]; // 禁用 0-6 时
const disabledMinutes = (hour) => hour === 12 ? [0, 30] : [];
</script>
<template>
  <OTimePicker v-model="val" :disabled-hours="disabledHours" :disabled-minutes="disabledMinutes" clearable />
</template>
```

**场景 5：minTime/maxTime 约束**
适用于：快速限制可选时间范围
```vue
<OTimePicker v-model="val" min-time="09:30:00" max-time="18:30:00" clearable />
```

**场景 6：时间范围选择**
适用于：选择起止时间
```vue
<script setup>
import { ref } from 'vue';
const start = ref();
const end = ref();
</script>
<template>
  <OTimeRangePicker v-model:start="start" v-model:end="end" clearable />
</template>
```

**场景 7：范围选择 + 快捷选项**
适用于：预设时间区间快速选择
```vue
<script setup>
import { ref } from 'vue';
const start = ref();
const end = ref();
</script>
<template>
  <OTimeRangePicker v-model:start="start" v-model:end="end" clearable>
    <template #shortcut="{ setValue, emitChange }">
      <OLink @click="setValue('09:00:00', '18:00:00'); emitChange()">工作时间</OLink>
    </template>
  </OTimeRangePicker>
</template>
```

**场景 8：移动端范围选择降级**
适用于：小屏幕下使用两个独立选择器
```vue
<OFormItem label="开始">
  <OTimePicker v-model="start" :max-time="end" clearable />
</OFormItem>
<OFormItem label="结束">
  <OTimePicker v-model="end" :min-time="start" clearable />
</OFormItem>
```

**场景 9：OForm 内使用**
适用于：表单校验
```vue
<OForm :model="formData">
  <OFormItem label="时间" name="time" :rules="[{ required: true, message: '请选择时间' }]">
    <OTimePicker v-model="formData.time" clearable />
  </OFormItem>
</OForm>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 sub-component + 组合 | 说明 |
|------|--------------------------|------|
| 选择时分秒 | OTimePicker + `v-model` + `clearable` | 最常见 |
| 仅时分 | OTimePicker + `format="HH:mm"` | 无秒列 |
| 步进选择 | OTimePicker + `hourStep` + `minuteStep` | 间隔选项 |
| 禁用特定时间 | OTimePicker + `disabledHours/Minutes/Seconds` | 精确控制 |
| 时间范围 | OTimePicker + `minTime` + `maxTime` | 快速范围约束 |
| 时间范围选择 | OTimeRangePicker + `v-model:start` + `v-model:end` | 起止时间 |
| 快捷选项 | RangePicker + `#shortcut` | setValue + emitChange |
| 移动端范围 | 两个 OTimePicker + `minTime/maxTime` | 降级方案 |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| 1.2.7 | 更新 | `clearable` 接入表单继承系统（详见 [OForm 表单级统一管控](form.usage.md)） |
| 1.2.4 | 新增 | OTimePicker 与 OTimeRangePicker 组件首次发布，支持时分秒选择、步进、时间约束、键盘导航、范围选择 |

---

### OTimePicker Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 引入版本 | 说明 |
|--------|------|--------|--------|---------|------|
| modelValue | `string | undefined` | — | `undefined` | 1.2.4 | v-model 时间值 |
| placeholder | `string` | — | — | 1.2.4 | 占位文本。单选使用。继承自 inputProps。 |
| inputId | `string` | — | — | 1.2.4 | 输入框 ID |
| disabled | `boolean` | — | — | 1.2.4 | 禁用。继承自 inputProps。 |
| readonly | `boolean` | — | — | 1.2.4 | 只读。继承自 inputProps。 |
| size | `SizeT` | `'large'` / `'medium'` / `'small'` | — | 1.2.4 | 尺寸。"large" 大号、"medium" 中号、"small" 小号。继承自 inputProps。 |
| round | `RoundT` | `'pill'` / CSS值 | — | 1.2.4 | 圆角值。"pill" 全圆角胶囊形，或 CSS border-radius 值。继承自 inputProps。 |
| color | `'normal'` / `'success'` / `'warning'` / `'danger'` | — | `'normal'` | 1.2.4 | 颜色。"normal" 默认、"success" 成功、"warning" 警告、"danger" 危险。OForm 内自动继承校验状态。 |
| variant | `'outline'` / `'solid'` / `'text'` | — | `'outline'` | 1.2.4 | 输入框类型。"outline" 有边框轮廓、"solid" 实心填充、"text" 无边框。继承自 inputProps。 |
| format | `string` | dayjs time format | `'HH:mm:ss'` | 1.2.4 | 时间格式。支持 dayjs format。"HH:mm:ss"（默认）或 "HH:mm"（仅时分）。format 中不含 ss 时秒列不显示。 |
| clearable | `boolean` | — | 继承表单容器 | 1.2.4 | 可清空。悬停时显示清除图标替换时间图标。未设置时继承表单容器（详见 [OForm 表单级统一管控](form.usage.md)）。 |
| noResponsive | `boolean` | — | — | 1.2.4 | 是否禁用响应式。继承自 selectProps。 |
| optionTitle | `string` | — | — | 1.2.4 | 浮层标题。继承自 selectProps。 |
| trigger | `PopupTriggerT` | — | `'click'` | 1.2.4 | 浮层触发方式。"click"（默认）等 PopupTriggerT 值。 |
| popupPosition | `PopupPositionT` | `'bl'` 等 | `'bl'` | 1.2.4 | 浮层位置。"bl" 左下（默认）等 PopupPositionT 值。 |
| popupWrapper | `string | HTMLElement | null` | — | 浮层挂载容器。默认 "body"。 | 1.2.4 | 浮层挂载容器 |
| unmountOnHide | `boolean` | — | `true` | 1.2.4 | 关闭时卸载 DOM。默认 true。 |
| transition | `string` | — | — | 1.2.4 | 过渡动画 |
| hourStep | `number` | — | `1` | 1.2.4 | 小时步进。默认 1。设为 2 时选项为 0, 2, 4, ...22。 |
| minuteStep | `number` | — | `1` | 1.2.4 | 分钟步进。默认 1。设为 15 时选项为 0, 15, 30, 45。 |
| secondStep | `number` | — | `1` | 1.2.4 | 秒步进。默认 1。 |
| disabledHours | `DisabledHoursFn` | — | — | 1.2.4 | 禁用小时函数。返回被禁用的小时数组，如 `[0, 1, 2, 12, 13]`。 |
| disabledMinutes | `DisabledMinutesFn` | — | — | 1.2.4 | 禁用分钟函数。接收当前小时 `(hour: number)`，返回被禁用的分钟数组。 |
| disabledSeconds | `DisabledSecondsFn` | — | — | 1.2.4 | 禁用秒函数。接收当前小时和分钟 `(hour: number, minute: number)`，返回被禁用的秒数组。 |
| minTime | `string` | — | — | 1.2.4 | 最小可选时间。字符串格式如 "09:30:00"。与 disabledHours 等同时设置时约束取并集。 |
| maxTime | `string` | — | — | 1.2.4 | 最大可选时间。字符串格式如 "18:30:00"。与 disabledHours 等同时设置时约束取并集。 |

---

### OTimeRangePicker Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 引入版本 | 说明 |
|--------|------|--------|--------|---------|------|
| start | `string | undefined` | — | `undefined` | 1.2.4 | v-model 开始时间 |
| end | `string | undefined` | — | `undefined` | 1.2.4 | v-model 结束时间 |
| placeholderStart | `string` | — | — | 1.2.4 | 开始时间占位文本 |
| placeholderEnd | `string` | — | — | 1.2.4 | 结束时间占位文本 |
| inputId | `string` | — | — | 1.2.4 | 输入框 ID |
| disabled | `boolean` | — | — | 1.2.4 | 禁用。继承自 inputProps。 |
| readonly | `boolean` | — | — | 1.2.4 | 只读。继承自 inputProps。 |
| size | `SizeT` | `'large'` / `'medium'` / `'small'` | — | 1.2.4 | 尺寸。"large" 大号、"medium" 中号、"small" 小号。继承自 inputProps。 |
| round | `RoundT` | `'pill'` / CSS值 | — | 1.2.4 | 圆角值。"pill" 全圆角胶囊形，或 CSS border-radius 值。继承自 inputProps。 |
| color | `'normal'` / `'success'` / `'warning'` / `'danger'` | — | `'normal'` | 1.2.4 | 颜色。"normal" 默认、"success" 成功、"warning" 警告、"danger" 危险。OForm 内自动继承校验状态。 |
| variant | `'outline'` / `'solid'` / `'text'` | — | `'outline'` | 1.2.4 | 输入框类型。"outline" 有边框轮廓、"solid" 实心填充、"text" 无边框。继承自 inputProps。 |
| format | `string` | — | `'HH:mm:ss'` | 1.2.4 | 时间格式。支持 dayjs format。"HH:mm:ss"（默认）或 "HH:mm"（仅时分）。format 中不含 ss 时秒列不显示。 |
| clearable | `boolean` | — | 继承表单容器 | 1.2.4 | 可清空。悬停时显示清除图标替换时间图标。未设置时继承表单容器（详见 [OForm 表单级统一管控](form.usage.md)）。 |
| noResponsive | `boolean` | — | — | 1.2.4 | 是否禁用响应式。继承自 selectProps。 |
| optionTitle | `string` | — | — | 1.2.4 | 浮层标题。继承自 selectProps。 |
| trigger | `PopupTriggerT` | — | `'click'` | 1.2.4 | 浮层触发方式。"click"（默认）等 PopupTriggerT 值。 |
| popupPosition | `PopupPositionT` | `'bl'` 等 | `'bl'` | 1.2.4 | 浮层位置。"bl" 左下（默认）等 PopupPositionT 值。 |
| popupWrapper | `string | HTMLElement | null` | — | 浮层挂载容器。默认 "body"。 | 1.2.4 | 浮层挂载容器 |
| unmountOnHide | `boolean` | — | `true` | 1.2.4 | 关闭时卸载 DOM。默认 true。 |
| transition | `string` | — | — | 1.2.4 | 过渡动画 |
| hourStep | `number` | — | `1` | 1.2.4 | 小时步进。默认 1。设为 2 时选项为 0, 2, 4, ...22。 |
| minuteStep | `number` | — | `1` | 1.2.4 | 分钟步进。默认 1。设为 15 时选项为 0, 15, 30, 45。 |
| secondStep | `number` | — | `1` | 1.2.4 | 秒步进。默认 1。 |
| disabledHours | `DisabledHoursFn` | — | — | 1.2.4 | 禁用小时函数。返回被禁用的小时数组，如 `[0, 1, 2, 12, 13]`。 |
| disabledMinutes | `DisabledMinutesFn` | — | — | 1.2.4 | 禁用分钟函数。接收当前小时 `(hour: number)`，返回被禁用的分钟数组。 |
| disabledSeconds | `DisabledSecondsFn` | — | — | 1.2.4 | 禁用秒函数。接收当前小时和分钟 `(hour: number, minute: number)`，返回被禁用的秒数组。 |
| minTime | `string` | — | — | 1.2.4 | 最小可选时间。字符串格式如 "09:30:00"。与 disabledHours 等同时设置时约束取并集。 |
| maxTime | `string` | — | — | 1.2.4 | 最大可选时间。字符串格式如 "18:30:00"。与 disabledHours 等同时设置时约束取并集。 |
