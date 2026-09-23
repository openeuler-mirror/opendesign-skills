> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](image-viewer.visual.md) · [样式定制](image-viewer.style.md)

# OImageViewer 图片预览 — 代码使用

### 导入方式

```vue
<script setup>
import { OImageViewer, useImageViewer } from '@opensig/opendesign';
</script>
```

---

### 类型定义

```ts
// 工具栏按钮集合
type ImageViewerToolbarItem = 'zoomIn' | 'zoomOut' | 'reset' | 'rotateLeft' | 'rotateRight' | 'close';
// crossorigin 属性
type ImageViewerCrossorigin = 'anonymous' | 'use-credentials' | '';
// 内部 OLayer 透传配置（排除 visible，其余与 OLayer props 一致）
type ImageViewerLayerOptions = Partial<Omit<LayerPropsT, 'visible'>>;
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| previewList | `string[]` | — | `[]` | 预览图片地址数组 | 1.2.7 |
| visible | `boolean`（v-model:visible） | — | `false` | 预览显隐，双向绑定 | 1.2.7 |
| currentIndex | `number`（v-model） | — | `0` | 当前预览图片下标，越界自动回退 0 | 1.2.7 |
| scale | `number`（v-model） | — | 未传 | 当前缩放比例。**传入时**图片加载后保持该比例、不自动适屏；**不传时**自动适屏（小图放大至 200%，大图缩小至整屏可见） | 1.2.7 |
| zoomRate | `number` | — | `1.2` | 每次缩放的倍率 | 1.2.7 |
| minScale | `number` | — | `0.1` | 手动缩放下限。适屏比例低于此值时下限自动扩展到适屏比例 | 1.2.7 |
| maxScale | `number` | — | `8` | 手动缩放上限 | 1.2.7 |
| showZoomRatio | `boolean` | — | `true` | 是否显示缩放百分比提示框（黑色胶囊） | 1.2.7 |
| duration | `number` | — | `500` | 缩放百分比提示的显示时长（ms） | 1.2.7 |
| infinite | `boolean` | — | `true` | 是否无限循环切换图片（首尾相接） | 1.2.7 |
| crossorigin | `string` | `'anonymous'` / `'use-credentials'` / `''` | `''` | 图片 crossorigin 属性，影响箭头取色等跨域 canvas 操作 | 1.2.7 |
| showProgress | `boolean` | — | `false` | 是否显示图片切换进度指示器 | 1.2.7 |
| toolbar | `boolean \| ImageViewerToolbarItem[]` | — | `['zoomOut','zoomIn','reset','close']` | 工具栏配置：`true` 全部按钮；`false` 或空数组隐藏整个操作区；数组按给定顺序渲染 | 1.2.7 |
| closeOnPressEscape | `boolean` | — | `true` | 按 ESC 关闭预览 | 1.2.7 |
| focusTrap | `boolean` | — | `true` | 是否启用焦点陷阱（无障碍） | 1.2.7 |
| scalable | `boolean` | — | `true` | 是否允许缩放。`false` 时非移动端锁定适屏比例，隐藏缩放类工具栏按钮（zoomIn/zoomOut/reset，仅剩 close 时隐藏整个操作区）；移动端仍可双指缩放 | 1.2.7 |
| bodyClose | `boolean` | — | `false` | 点击图片关闭预览（拖拽后不触发） | 1.2.7 |
| layerOptions | `ImageViewerLayerOptions` | — | `{ mask: true, maskClose: false, buttonClose: true, wrapper: null }` | 内部 OLayer 属性透传，控制遮罩/关闭按钮/teleport 等浮层行为 | 1.2.7 |
| wrapperClass | `string \| string[] \| object` | — | `''` | 预览包裹层追加类名（OFigure 传入 `o-figure-preview-wrapper`） | 1.2.7 |
| containerClass | `string \| string[] \| object` | — | `''` | 图片容器追加类名（OFigure 传入 `o-figure-preview-img`） | 1.2.7 |

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| close | — | 预览关闭时触发 |
| switch | `(index: number)` | 预览图片切换后触发，返回新下标 |
| rotate | `(deg: number)` | 图片旋转后触发，返回当前角度 |
| zoom-drag | `(value: boolean)` | 拖拽状态变化时触发；`true` 表示发生了拖拽，`false` 表示仅为点击 |
| error | `(evt: Event)` | 图片加载失败时触发 |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| preview | `{ src: string }` | 始终可用 | **整体替换**图片查看器 UI（如换成视频播放器）。可获取当前图片地址 | 默认查看器 UI |
| default | — | 始终可用 | 渲染在预览包裹层内、图片容器外，用于叠加自定义覆盖内容（如播放控制按钮） | 无 |
| toolbar | `{ actions, prev, next, reset, activeIndex, setActiveItem }` | 始终可用 | 自定义工具栏。`actions(action, options?)` 执行缩放/旋转操作 | 默认工具栏 |
| progress | `{ activeIndex, total }` | 始终可用 | 自定义进度指示器 | 默认进度文本 |
| error | `{ activeIndex, src }` | 图片加载失败时 | 自定义错误提示 | 默认错误提示 |

---

### 插槽层级关系

```
OImageViewer
├── preview（整体替换查看器 UI，含图片区）
│   └── error（加载失败时替代图片，位于默认查看器内）
├── default（预览层内、图片外的覆盖内容）
├── toolbar（底部工具栏）
├── progress（进度指示器）
└── error（加载失败替代内容）
```

---

### 暴露方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| setActiveItem(index) | `index: number` | 手动切换到指定图片 |
| prev() | — | 切换到上一张 |
| next() | — | 切换到下一张 |
| handleActions(action, options?) | `action: ImageViewerAction`；`options?: { zoomRate?, rotateDeg?, enableTransition? }` | 执行缩放（zoomIn/zoomOut）或旋转（rotateLeft/rotateRight）操作 |
| resetTransform() | — | 重置缩放、位移与旋转状态 |

---

### useImageViewer 函数式调用

在 `setup` 中命令式管理图片预览，无需模板声明。返回句柄：`visible`（Ref）、`open()` / `close()` / `unmount()`（均幂等）。

- **入参**：全部组件 props（`visible` 除外）均支持 `MaybeRefOrGetter`（ref / getter / 原始值），源变化时正在显示的预览响应式同步；事件回调为普通函数：`onClose` / `onSwitch` / `onRotate` / `onZoomDrag` / `onError`
- **autoDestroyOnClose**（composable 专属，不透传给组件）：`true` 时 `close()` 卸载实例释放 DOM，下次 `open()` 重新挂载；`false` 时仅切换 `visible` 保留实例复用。默认在 effect scope 内为 `false`，作用域外为 `true`
- ⚠️ 在 effect scope 作用域外（事件回调、工具函数中）调用时，必须手动调用 `unmount()` 释放 DOM，否则内存泄漏

---

### 典型使用场景与调用模板

**场景 1：按钮触发的独立预览（组件式）**

适用于：页面中点击按钮/缩略图打开大图查看
```vue
<script setup>
import { ref } from 'vue';
import { OImageViewer, OButton } from '@opensig/opendesign';

const imgList = ['/img/1.png', '/img/2.png'];
const visible = ref(false);
</script>
<template>
  <OButton color="primary" @click="visible = true">查看大图</OButton>
  <OImageViewer
    v-model:visible="visible"
    :preview-list="imgList"
    :layer-options="{ mask: true, maskClose: true, buttonClose: true, wrapper: 'body' }"
  />
</template>
```

**场景 2：函数式调用（异步数据）**

适用于：点击后请求数据再预览、事件回调中触发预览
```vue
<script setup>
import { ref } from 'vue';
import { useImageViewer } from '@opensig/opendesign';

const imgList = ref<string[]>([]);
const viewer = useImageViewer({
  previewList: imgList,
  onClose: () => console.log('closed'),
});

async function preview() {
  imgList.value = await fetchImages();
  viewer.open();
}
</script>
<template>
  <OButton @click="preview">预览</OButton>
</template>
```

**场景 3：受控缩放 + 自定义工具栏**

适用于：需要固定初始倍率或定制操作区
```vue
<template>
  <OImageViewer
    v-model:visible="visible"
    v-model:scale="scale"
    :preview-list="imgList"
    :toolbar="['zoomOut', 'zoomIn', 'reset']"
  >
    <template #progress="{ activeIndex, total }">第 {{ activeIndex + 1 }} 张 / 共 {{ total }} 张</template>
  </OImageViewer>
</template>
```

**场景 4：预览替换为视频播放器**

适用于：封面图点开播放视频
```vue
<template>
  <OImageViewer v-model:visible="visible" :preview-list="[poster]">
    <template #preview>
      <video src="/video.mp4" autoplay muted controls style="width: 80%;" />
    </template>
    <template #default>
      <OButton @click="visible = false" style="position: absolute; right: 24px; top: 24px;">关闭</OButton>
    </template>
  </OImageViewer>
</template>
```

**场景 5：搭配 OFigure 使用（推荐）**

适用于：普通页面图片，点击即全屏预览。OFigure 的 preview 属性对象形式可直接透传 OImageViewer 配置
```vue
<template>
  <OFigure src="/photo.jpg" :preview="{ showProgress: true, layerOptions: { maskClose: true } }" :ratio="16/9" />
</template>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础预览 | `v-model:visible` + `previewList` | 最小用法 |
| 点遮罩可关 | `layerOptions.maskClose=true` | 默认遮罩点击不关闭 |
| teleport 到 body | `layerOptions.wrapper='body'` | 嵌套在 overflow 裁剪容器内时使用 |
| 固定初始倍率 | `scale=2` | 跳过自动适屏（小图 200% / 大图适屏） |
| 只看不改 | `scalable=false` 或 `toolbar=false` | 锁定适屏比例 / 隐藏操作区 |
| 多图进度 | `showProgress` + `infinite` | 循环切换 + 进度显示 |
| 键盘 Esc 关闭 | `closeOnPressEscape` | 默认开启 |

---

### 交互与手势

| 操作 | 非移动端（hover + 精确指针） | 移动端（触摸） |
|------|------------------------------|----------------|
| 缩放 | 滚轮 / 工具栏按钮 | 双指捏合 |
| 平移 | 按住拖拽 | 单指拖拽 |
| 切图 | 左右导航按钮 / 键盘 ← → | 紧凑屏 swipe 滑动 |
| 关闭 | 关闭按钮 / ESC | OLayer 关闭按钮 |
| 到边滑动的行为 | 无限循环时绕回；`infinite=false` 时拖拽超界有回弹，导航按钮禁用 | 同左 |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| 1.2.7 | 新增 | 组件新增（详见上表）；无障碍增强：role=dialog、aria-modal、焦点陷阱 |
