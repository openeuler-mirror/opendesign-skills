> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](step.visual.md) · [样式定制](step.style.md)

# OStep 步骤条 — 代码使用

### 导入方式

```vue
<script setup>
import { OStep, OStepItem } from '@opensig/opendesign';
</script>
```

---

### 类型定义

```typescript
type DirectionT = 'h' | 'v';
type StepItemStatusT = 'finished' | 'processing' | 'waiting' | 'failed';
```

---

### Events 表

无自定义事件。OStep 和 OStepItem 均未定义 emits。

---

### Slots 表

**OStep Slots**

| 插槽名 | Slot Props | 说明 |
|--------|-----------|------|
| default | — | 放置 OStepItem 子组件 |

**OStepItem Slots**

| 插槽名 | Slot Props | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|
| icon | — | 圆形标识内容 | icon 属性逻辑或步骤序号 |
| title | — | 标题区域 | `props.title` |
| default | — | 描述区域 | `props.description` |

---

### 插槽层级关系

```
OStep
└── default ─── OStepItem (多个)
                 ├── icon ─── 替换圆形标识内容
                 ├── title ── 替换标题
                 └── default ─ 替换描述
```

---

### 典型使用场景与调用模板

**场景 1：基础水平步骤条**
适用于：流程引导、注册步骤
```vue
<OStep direction="h">
  <OStepItem :step-index="0" title="步骤一" description="描述信息" status="finished" :icon="true" />
  <OStepItem :step-index="1" title="步骤二" description="描述信息" status="processing" />
  <OStepItem :step-index="2" title="步骤三" description="描述信息" status="waiting" />
</OStep>
```

**场景 2：垂直步骤条**
适用于：侧边栏流程导航
```vue
<OStep direction="v">
  <OStepItem :step-index="0" title="步骤一" description="描述信息" status="finished" :icon="true" style="height: 80px" />
  <OStepItem :step-index="1" title="步骤二" description="描述信息" status="processing" style="height: 80px" />
  <OStepItem :step-index="2" title="步骤三" description="描述信息" status="waiting" style="height: 80px" />
</OStep>
```

**场景 3：带失败状态**
适用于：流程异常提示
```vue
<OStep direction="h">
  <OStepItem :step-index="0" title="提交" status="finished" :icon="true" />
  <OStepItem :step-index="1" title="审核" status="failed" :icon="true" />
  <OStepItem :step-index="2" title="完成" status="waiting" />
</OStep>
```

**场景 4：自定义图标**
适用于：品牌化步骤条、特殊图标需求
```vue
<script setup>
import { OStep, OStepItem, OIconFile } from '@opensig/opendesign';
</script>

<OStep direction="h">
  <OStepItem :step-index="0" title="上传文件" status="finished">
    <template #icon>
      <OIconFile class="o-step-item-icon" />
    </template>
  </OStepItem>
  <OStepItem :step-index="1" title="处理中" status="processing">
    <template #icon>
      <OIconFile class="o-step-item-icon" />
    </template>
  </OStepItem>
</OStep>
```

**场景 5：数据驱动 v-for 渲染**
适用于：动态步骤列表
```vue
<script setup>
import { OStep, OStepItem } from '@opensig/opendesign';

const steps = [
  { title: '步骤一', description: '描述', status: 'finished', icon: true },
  { title: '步骤二', description: '描述', status: 'processing', icon: false },
  { title: '步骤三', description: '描述', status: 'waiting', icon: false },
];
</script>

<OStep direction="h">
  <OStepItem
    v-for="(item, idx) in steps"
    :key="idx"
    :step-index="idx"
    :title="item.title"
    :description="item.description"
    :status="item.status"
    :icon="item.icon"
  />
</OStep>
```

**场景 6：可点击步骤条（自定义样式）**
适用于：允许用户点击跳转步骤
```vue
<script setup>
import { ref } from 'vue';
import { OStep, OStepItem, OIconFile } from '@opensig/opendesign';

const activeIndex = ref(0);
</script>

<OStep direction="h">
  <OStepItem
    v-for="(item, idx) in steps"
    :key="idx"
    :step-index="idx"
    :title="item.title"
    :class="{ active: activeIndex === idx }"
    class="clickable-step"
    @click="activeIndex = idx"
  >
    <template #icon>
      <OIconFile class="o-step-item-icon" />
    </template>
  </OStepItem>
</OStep>

<style scoped>
.clickable-step {
  --step-item-head-color: var(--o-color-info3);
  cursor: pointer;
}
.active {
  --step-item-head-color: var(--o-color-primary1);
  --step-item-title-color: var(--o-color-primary1);
  --step-item-title-font-weight: 600;
}
</style>
```

---

### ⚠️ 使用注意事项

- ⚠️ **finished 状态圆圈内是数字还是对勾，必须看设计图！** 两种情况都是绿色圆形，不能默认用 `icon=true`。如果设计图中圆圈内显示的是步骤数字（如"1"），则不传 `icon`（默认显示序号）；如果圆圈内显示的是对勾图标，才传 `:icon="true"`。

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础水平步骤 | `direction="h"` + `:step-index` + `status` + `title` | 最简用法 |
| 垂直步骤 | `direction="v"` + `style="height: 80px"` | 垂直时需给 item 设高度 |
| 显示状态图标 | `:icon="true"` | 已完成显示对勾，失败显示感叹号 |
| 传入自定义图标组件 | `:icon="MyIcon"` | 直接传递组件对象 |
| 自定义图标插槽 | `#icon` + `class="o-step-item-icon"` | 圆形背景取消，需自行加 class |
| 带描述 | `title` + `description` | 标题 + 描述文字 |
| 纯标题 | `title`（不传 description） | 仅显示标题 |

---

### OStep Props 表

| 参数名 | 类型 | 必填 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|------|--------|--------|------|--------|
| direction | `DirectionT` | 否 | `'h'` / `'v'` | `'h'` | 步骤条的排列方向。"h" 水平排列，步骤项从左到右依次展示；"v" 垂直排列，步骤项从上到下依次展示。默认水平方向。 | — |

---

### OStepItem Props 表

| 参数名 | 类型 | 必填 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|------|--------|--------|------|--------|
| stepIndex | `number` | 是 | — | — | 标识当前是第几步，从 0 开始计数，需在各步骤间保持连续。默认在圆形标识中显示步骤序号（stepIndex + 1）。 | — |
| status | `StepItemStatusT` | 否 | `'finished'` / `'processing'` / `'waiting'` / `'failed'` | `'finished'` | 步骤状态 | — |
| title | `string` | 否 | — | — | 步骤标题 | — |
| description | `string` | 否 | — | — | 步骤描述 | — |
| icon | `boolean \| Component` | 否 | — | 控制圆形标识中的内容。传 true 时根据状态自动选择图标（已完成显示对勾、失败显示感叹号）；传一个组件时使用该组件作为图标；不传或传 false 时显示步骤序号数字。 | 步骤图标；true 为状态默认图标，传组件则渲染该组件，false/不传则显示序号 | — |
