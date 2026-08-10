> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](layer.visual.md) · [样式定制](layer.style.md)

# OLayer 浮层 — 代码使用

### 导入方式

```vue
<script setup>
import { OLayer } from '@opensig/opendesign';
</script>
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| visible | `boolean` | — | `false` | 控制浮层是否显示（v-model 双向绑定）。默认关闭。 | — |
| wrapper | `string \| HTMLElement \| null` | 浮层挂载的容器。"body" 渲染到 body 下（position: fixed）；CSS 选择器或 HTMLElement 渲染到指定元素下；null 渲染到当前位置（position: absolute），此时需确保父元素有 position: relative。默认 body。 | `'body'` | 挂载容器 | — |
| unmountOnHide | `boolean` | — | `true` | 隐藏时是否销毁 DOM。默认开启。 | — |
| mainClass | `string \| object \| array` | 内容容器自定义类名。 | — | 内容容器类名 | — |
| mainTransition | `string` | — | `'o-zoom-fade2'` | 内容区域的过渡动画名。默认 "o-zoom-fade2"。 | — |
| maskTransition | `string` | — | `'o-fade-in'` | 遮罩层的过渡动画名。默认 "o-fade-in"。 | — |
| transitionOrign | `string` | `'mouse'` / `'css'` | `'mouse'` | 缩放动画的变换原点。"mouse" 从鼠标点击位置展开（桌面端体验更好）；"css" 使用 CSS 变量 --layer-origin 设置（默认 center）。默认 mouse。 | — |
| mask | `boolean` | — | `true` | 是否渲染遮罩层。默认显示。 | — |
| maskClose | `boolean` | — | `true` | 点击遮罩层是否关闭浮层。默认允许。 | — |
| buttonClose | `boolean` | — | `false` | 是否显示关闭按钮。默认不显示。 | @since 0.0.72（默认值曾为 true，v0.0.73 改为 false） |
| beforeShow | `() => Promise<boolean> \| boolean` | — | 打开前的拦截回调。返回 false 阻止打开。 | 打开前拦截 | — |
| beforeHide | `() => Promise<boolean> \| boolean` | — | 关闭前的拦截回调。返回 false 阻止关闭。 | 关闭前拦截 | — |

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:visible | `(value: boolean, evt?: MouseEvent)` | 可见状态变化 |
| change | `(visible: boolean)` | 浮层显示/隐藏状态变化时触发。 |
| click:mask | `(evt: MouseEvent)` | 点击遮罩 |
| click:button | `(evt: MouseEvent)` | 点击关闭按钮 |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 浮层主体内容 | 无 |
| close | — | buttonClose 为 true | 替换关闭按钮。仅 buttonClose 为 true 时渲染。 | 默认关闭图标 |

---

### 暴露方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| toggle(show?) | `show?: boolean` | 切换浮层显示状态 |

---

### 典型使用场景与调用模板

**场景 1：基础浮层**
适用于：自定义弹出层（推荐优先考虑 ODialog）
```vue
<script setup>
import { ref } from 'vue';
const visible = ref(false);
</script>
<template>
  <OButton @click="visible = true">打开</OButton>
  <OLayer v-model:visible="visible">
    <div class="custom-panel">自定义内容</div>
  </OLayer>
</template>
```

**场景 2：图片预览浮层**
适用于：全屏图片查看
```vue
<OLayer v-model:visible="visible" button-close>
  <img :src="imageSrc" />
</OLayer>
```

**场景 3：局部浮层**
适用于：在特定容器内弹出
```vue
<div style="position: relative;">
  <OLayer v-model:visible="visible" :wrapper="null">
    <div>局部内容</div>
  </OLayer>
</div>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 模态浮层 | `mask` + `mask-close` | 默认行为 |
| 无遮罩 | `:mask="false"` | 无背景遮罩 |
| 带关闭按钮 | `button-close` | 右上角关闭 |
| 局部浮层 | `:wrapper="null"` | 父容器内弹出 |
| 阻止关闭 | `before-hide` | 拦截关闭 |
