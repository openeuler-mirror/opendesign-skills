> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](figure.visual.md) · [样式定制](figure.style.md)

# OFigure 图片 — 代码使用

### 导入方式

```vue
<script setup>
import { OFigure } from '@opensig/opendesign';
</script>
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| src | `string` | — | — | 图片地址（必填） | — |
| ratio | `number` | — | — | 图片宽高比（宽/高）。设置后通过 padding-top 百分比实现固定宽高比，需确保容器有明确宽度。 | — |
| fit | `string` | `'cover'` / `'contain'` / `'fill'` / `'none'` / `'scale-down'` | — | 图片填充方式。img 模式下对应 object-fit（cover/contain/fill/none/scale-down）；背景图模式下对应 background-size（cover/contain/auto/自定义值）。 | — |
| alt | `string` | — | — | 图片描述文字，同 img 的 alt 属性。 | — |
| background | `boolean` | — | `false` | 是否以 CSS 背景图形式渲染（而非 img 标签）。默认使用 img 标签。背景图模式下可能导致宽高坍塌，需显式设置尺寸。 | — |
| hoverable | `boolean` | — | `false` | 鼠标悬停时图片放大效果。设置 href、preview 或 videoPoster 时自动启用，无需单独设置。默认关闭。 | — |
| href | `string` | — | — | 点击跳转链接。设置后组件渲染为 a 标签。与 preview 互斥。 | — |
| colorful | `boolean` | — | `false` | 加载完成前显示随机彩色背景。默认关闭。 | — |
| preview | `boolean` | — | `false` | 点击图片后全屏预览。与 href 互斥，不可同时使用。默认关闭。 | — |
| lazyPreview | `boolean` | — | `false` | 启用预览功能但不自动响应点击，需通过组件实例的 preview() 方法手动控制预览。默认关闭。 | — |
| videoPoster | `boolean` | — | `false` | 视频海报模式。开启后自动添加居中播放图标和悬停放大效果。默认关闭。 | — |
| previewClose | `string \| string[]` | `'none'` / `'button'` / `'mask'` / `'body'` | 预览关闭方式。"none" 禁用关闭、"button" 点击按钮关闭、"mask" 点击遮罩关闭、"body" 点击预览图关闭。支持数组组合。电脑端默认 mask+button，平板/手机端默认 mask+button+body。 | 预览关闭方式 | @since v0.0.70 |
| lazy | `boolean \| IntersectionObserverInit` | — | 图片懒加载。img 模式下使用原生 loading="lazy"；背景图模式下使用 IntersectionObserver。可传对象配置 IntersectionObserverInit 参数。默认关闭。 | 懒加载 | @since v0.0.70 |

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| load | — | 图片加载成功 |
| error | — | 图片加载失败 |
| preview | `(visible: boolean)` | 预览显示/隐藏时触发，可获取当前可见状态。 |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 有 default/content/title 插槽或 videoPoster 时 | 图片上方覆盖层 | 无 |
| content | — | 有 content 或 title 插槽时 | 底部描述区域 | title 插槽内容 |
| title | — | content 插槽未使用时 | 图片底部标题（在 content 插槽内部）。传入 content 插槽后 title 插槽失效。 | 无 |
| error | — | 图片加载失败时 | 加载失败时的替代内容。默认显示错误图标。 | 错误图标 |
| play-icon | — | videoPoster 为 true 时 | 替换默认播放图标。仅视频海报模式有效。 | 默认播放图标 |
| preview | `{ image: string }` | preview 或 lazyPreview 为 true 时 | 自定义预览内容（如视频播放器）。可获取当前图片地址。 | 预览图片 |
| preview-extra | — | preview 或 lazyPreview 为 true 时 | 预览区域底部的附加内容（如控制按钮）。 | 无 |

---

### 插槽层级关系

```
OFigure
├── error（加载失败时替代图片）
├── default（覆盖层）
├── play-icon（视频海报播放图标）
├── content（使用后 title 失效）
│   └── title（底部标题）
└── preview（预览内容）
    └── preview-extra（预览底部附加）
```

---

### 暴露方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| preview(visible?) | `visible?: boolean` | 手动控制预览（需启用 lazyPreview） |

---

### 典型使用场景与调用模板

**场景 1：基础图片展示（固定宽高比）**
适用于：列表中的图片卡片
```vue
<OFigure src="/photo.jpg" :ratio="16/9" fit="cover" style="width: 100%;" />
```

**场景 2：可点击预览**
适用于：图片详情查看
```vue
<OFigure src="/photo.jpg" preview :ratio="4/3" style="width: 300px;" />
```

**场景 3：视频海报（带自定义预览）**
适用于：视频封面 + 点击播放
```vue
<OFigure src="/poster.jpg" video-poster preview>
  <template #preview>
    <video src="/video.mp4" autoplay muted controls style="width: 100%;" />
  </template>
</OFigure>
```

**场景 4：懒加载背景图**
适用于：长列表中的图片
```vue
<OFigure src="/photo.jpg" :lazy="true" background :ratio="16/9" style="width: 100%;" />
```

**场景 5：手动控制预览**
适用于：通过外部按钮触发预览
```vue
<script setup>
import { useTemplateRef } from 'vue';
const figure = useTemplateRef('figure');
</script>
<template>
  <OButton @click="figure?.preview(true)">预览</OButton>
  <OFigure ref="figure" src="/photo.jpg" lazy-preview preview-close="none">
    <template #preview-extra>
      <OButton @click="figure?.preview(false)">关闭</OButton>
    </template>
  </OFigure>
</template>
```

**场景 6：加载失败自定义**
适用于：自定义错误显示
```vue
<OFigure src="/not-exist.jpg" :ratio="16/9" style="width: 300px;">
  <template #error>加载失败</template>
</OFigure>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 固定宽高比 | `src` + `ratio` + `fit="cover"` | 最常见用法 |
| 图片预览 | `preview` | 点击全屏查看 |
| 视频封面 | `video-poster` + `preview` | 播放图标 + 预览 |
| 懒加载 | `lazy` + `background` | 长列表性能优化 |
| 彩色占位 | `colorful` | 加载前随机彩色 |
| 链接图片 | `href` + `hoverable` | 点击跳转 |

---

### 互斥约束

- `preview` 和 `href` 不可同时使用（均接管点击事件）
- `hoverable` 在 `href`/`preview`/`videoPoster` 存在时自动启用
