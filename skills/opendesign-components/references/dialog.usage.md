> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](dialog.visual.md) · [样式定制](dialog.style.md)

# ODialog 对话框 — 代码使用

### 导入方式

```vue
<script setup>
import { ODialog } from '@opensig/opendesign';
</script>
```

---

### 类型定义

```typescript
type DialogSizeT = 'exlarge' | 'large' | 'medium' | 'small' | 'auto';

interface DialogActionT {
  id: string | number;
  color?: ColorT;        // 'normal' | 'primary' | 'success' | 'warning' | 'danger'
  variant?: VariantT;    // 'solid' | 'outline' | 'text'
  size?: SizeT;
  label?: string;
  round?: RoundT;
  icon?: Component;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| visible | `boolean` | — | `false` | 控制对话框是否显示（v-model 双向绑定）。默认关闭。 |
| size | `DialogSizeT` | `'exlarge'` / `'large'` / `'medium'` / `'small'` / `'auto'` | `'auto'` | 对话框尺寸。"auto" 根据内容自适应；"small" 小尺寸；"medium" 中尺寸；"large" 大尺寸；"exlarge" 超大尺寸。各尺寸在不同屏幕下有对应的宽度和高度范围。默认 auto。 |
| hideClose | `boolean` | — | `false` | 是否隐藏右上角关闭按钮。默认显示。 |
| actions | `DialogActionT[]` | — | — | 底部操作按钮数组。每个按钮可配置颜色、样式、尺寸、加载态、禁用态和点击回调。在手机/平板尺寸下，未指定样式的按钮自动变为文字样式。 |
| noResponsive | `boolean` | — | `false` | 是否禁用响应式自适应。开启后对话框在所有屏幕上保持一致尺寸。默认关闭。 |
| phoneHalfFull | `boolean` | — | `false` | 手机尺寸下是否以半屏形式从底部弹出。宽度铺满、高度占一半。默认关闭。 |
| scrollbar | `boolean \| Partial<BaseScrollerPropsT>` | — | 是否启用内容区域滚动条。传 true 启用默认配置，传对象可自定义滚动条参数，传 false 禁用。默认启用。 | 内容滚动条 |
| wrapper | `string \| HTMLElement \| null` | 对话框挂载的容器节点。默认挂载到 body。传 null 则挂载到父容器（局部对话框）。 | `'body'` | 挂载容器 |
| unmountOnHide | `boolean` | — | `true` | 隐藏时是否销毁对话框 DOM。默认开启。 |
| mask | `boolean` | — | `true` | 是否显示背景遮罩层。默认显示。 |
| maskClose | `boolean` | — | `true` | 点击遮罩层是否关闭对话框。默认允许。 |
| mainClass | `string \| object \| array` | — | — | 内容容器类名 |
| mainTransition | `string` | — | `'o-zoom-fade2'` | 内容区域的过渡动画名。默认 "o-zoom-fade2"。 |
| maskTransition | `string` | — | `'o-fade-in'` | 遮罩层的过渡动画名。默认 "o-fade-in"。 |
| beforeShow | `() => Promise<boolean> \| boolean` | — | 对话框打开前的拦截回调。返回 false 可阻止打开。 | 打开前拦截 |
| beforeHide | `() => Promise<boolean> \| boolean` | — | 对话框关闭前的拦截回调。返回 false 可阻止关闭，适合"确定要关闭吗？"场景。 | 关闭前拦截 |

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:visible | `(value: boolean, evt?: MouseEvent)` | 可见状态变化时 |
| change | `(visible: boolean)` | 对话框显示/隐藏状态变化时触发，可获取当前可见状态。 |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| header | — | 始终（不传则不渲染头部） | 对话框顶部标题区域。不传则不渲染头部。 | 无 |
| default | — | 始终 | 对话框主体内容，自带滚动条支持。 | 无 |
| actions | `{ isPhonePad: boolean }` | 有 actions 属性或插槽时 | 替换底部按钮区域，可获取 isPhonePad（是否为手机平板）来做差异化渲染。 | actions 属性渲染的按钮 |
| footer | — | 有 footer 插槽或 actions 时 | 替换整个底部区域（包含按钮区域）。优先级高于 actions 插槽和 actions 属性。 | actions 区域 |

---

### 插槽层级关系

```
header（标题区域，不传则不渲染）
default（主体内容，带滚动条）
footer（使用后 actions 全部失效）
└── actions（按钮区域）
```

---

### 暴露方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| toggle(show?) | `show?: boolean` | 切换对话框显示状态 |

---

### 典型使用场景与调用模板

**场景 1：基础确认对话框**
适用于：简单确认/取消操作
```vue
<script setup>
import { ref } from 'vue';
const visible = ref(false);
const actions = [
  { id: 'confirm', label: '确认', color: 'primary', variant: 'solid', onClick: () => { visible.value = false; } },
  { id: 'cancel', label: '取消', onClick: () => { visible.value = false; } },
];
</script>
<template>
  <OButton @click="visible = true">打开对话框</OButton>
  <ODialog v-model:visible="visible" :actions="actions">
    <template #header>确认操作</template>
    <p>确定要执行此操作吗？</p>
  </ODialog>
</template>
```

**场景 2：表单对话框（超大尺寸）**
适用于：在对话框内填写表单
```vue
<ODialog v-model:visible="visible" size="exlarge" hide-close>
  <template #header>
    <span>编辑信息</span>
    <OButton variant="text" @click="visible = false">关闭</OButton>
  </template>
  <OForm>
    <OFormItem label="名称"><OInput v-model="name" /></OFormItem>
  </OForm>
  <template #footer>
    <OButton color="primary" @click="save">保存</OButton>
  </template>
</ODialog>
```

**场景 3：自定义操作按钮（响应式适配）**
适用于：根据设备类型差异化渲染按钮
```vue
<ODialog v-model:visible="visible">
  <template #header>评价</template>
  <ORate v-model="rating" />
  <template #actions="{ isPhonePad }">
    <OButton color="primary" :variant="isPhonePad ? 'text' : 'solid'" @click="submit">提交</OButton>
    <ODivider v-if="isPhonePad" direction="v" />
    <OButton :variant="isPhonePad ? 'text' : 'outline'" @click="visible = false">取消</OButton>
  </template>
</ODialog>
```

**场景 4：手机半屏对话框**
适用于：移动端底部弹出
```vue
<ODialog v-model:visible="visible" size="medium" phone-half-full>
  <template #header>选择选项</template>
  <div>选项内容...</div>
</ODialog>
```

**场景 5：局部对话框**
适用于：对话框挂载在某个容器内而非 body
```vue
<div id="local-container" style="position: relative;">
  <ODialog v-model:visible="visible" :wrapper="null">
    <p>我在父容器内</p>
  </ODialog>
</div>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 简单确认 | `v-model:visible` + `actions` | 最常见用法 |
| 表单对话框 | `size="exlarge"` + `hide-close` | 大尺寸 + 自定义关闭 |
| 移动端底部弹出 | `phone-half-full` + `size="medium"` | 手机半屏 |
| 固定尺寸 | `no-responsive` | 禁用自适应 |
| 阻止意外关闭 | `:mask-close="false"` + `before-hide` | 需要确认才能关闭 |
| 局部对话框 | `:wrapper="null"` | 挂载到父容器 |

---

### 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.6 | 优化圆角响应式策略：`--dlg-radius` 默认值从 control-l 改为 control-xs，由断点和主题共同决定（≤840px 断点下使用 control-s）；`--dlg-margin` 默认值从 0 改为 24px |
