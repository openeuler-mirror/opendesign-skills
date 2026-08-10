> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](avatar.visual.md) · [样式定制](avatar.style.md)

# OAvatar 头像 — 代码使用

### 导入方式

```vue
<script setup>
import { OAvatar, OAvatarGroup } from '@opensig/opendesign';
</script>
```

---

### 插槽层级关系

```
OAvatar:
  name（名称文字，url 不存在时生效）
  triggerIcon（可点击遮罩图标，clickable=true 时生效）

OAvatarGroup:
  more（溢出头像内容，溢出数量 > 0 时生效）

OAvatarGroup 内部使用 createReusableTemplate 渲染溢出头像，
溢出头像的 #name 插槽由 OAvatarGroup 的 #more 插槽替代。
```

---

### 典型使用场景与调用模板

**场景 1：图片头像**
适用于：展示用户真实头像
```vue
<OAvatar :size="56" url="https://example.com/avatar.jpg" object-fit="cover" />
```

**场景 2：名称首字符头像**
适用于：无图片时显示用户名首字母
```vue
<OAvatar name="Alice" />
<OAvatar name="Alice" background="#e6f7ff" />
```

**场景 3：默认头像图标**
适用于：无图片无名称时的占位展示
```vue
<OAvatar />
```

**场景 4：可点击头像（编辑头像）**
适用于：点击头像触发编辑操作
```vue
<script setup>
const handleAvatarClick = (e) => {
  console.log('编辑头像');
};
</script>
<template>
  <OAvatar :size="56" url="https://example.com/avatar.jpg" clickable @click="handleAvatarClick" />
</template>
```

**场景 5：自定义名称渲染**
适用于：名称需要显示多字符或自定义样式
```vue
<script setup>
import { h } from 'vue';
const customFormatter = ({ name }) => h('div', { style: { color: '#fff', fontWeight: 'bold' } }, name);
</script>
<template>
  <OAvatar :size="56" name="Alice" :name-formatter="customFormatter" />
</template>
```

**场景 6：头像组 - 水平堆叠**
适用于：协作成员列表、项目参与者等
```vue
<script setup>
const urlList = [
  { url: 'https://example.com/a.jpg', name: 'Alice' },
  { url: 'https://example.com/b.jpg', name: 'Bob' },
  { name: 'Carol' },
  { name: 'Dave' },
  { name: 'Eve' },
];
</script>
<template>
  <OAvatarGroup :url-list="urlList" size="60px" />
  <OAvatarGroup :url-list="urlList" size="60px" overflow-type="count" />
</template>
```

**场景 7：头像组 - 对称网格**
适用于：群组标识、多人协作图标
```vue
<script setup>
const urlList = [
  { url: 'https://example.com/a.jpg', name: 'Alice' },
  { url: 'https://example.com/b.jpg', name: 'Bob' },
  { url: 'https://example.com/c.jpg', name: 'Carol' },
  { url: 'https://example.com/d.jpg', name: 'Dave' },
];
</script>
<template>
  <OAvatarGroup layout="symmetric" :url-list="urlList" size="60px" />
</template>
```

**场景 8：自定义溢出内容**
适用于：头像组溢出需要展示更多信息
```vue
<script setup>
const urlList = Array.from({ length: 10 }, (_, i) => ({ name: `User${i + 1}` }));
</script>
<template>
  <OAvatarGroup :url-list="urlList" size="60px">
    <template #more>
      <span style="font-size: 12px; color: #999">更多...</span>
    </template>
  </OAvatarGroup>
</template>
```

**场景 9：图片加载失败处理**
适用于：头像图片可能加载失败
```vue
<script setup>
import { ref } from 'vue';
const handleError = () => {
  console.log('头像图片加载失败');
};
const handleLoad = () => {
  console.log('头像图片加载成功');
};
</script>
<template>
  <OAvatar url="https://invalid-url.com/avatar.jpg" @error="handleError" @load="handleLoad" />
</template>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 用户头像 | `url` + `object-fit="cover"` + `size` | 最常见用法 |
| 名称头像 | `name` + `background`(可选) | 随机彩色背景 + 首字符 |
| 可编辑头像 | `url` + `clickable` + `@click` | hover 显示编辑遮罩 |
| 头像组默认 | `urlList` + `size` | 水平堆叠 + 省略号溢出 |
| 头像组计数 | `urlList` + `size` + `overflow-type="count"` | 水平堆叠 + +N 溢出 |
| 头像组网格 | `urlList` + `size` + `layout="symmetric"` | 对称网格排列 |
| 自定义名称 | `name` + `nameFormatter` | 全名或多字符渲染 |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| 1.2.3 | 新增 | OAvatar 与 OAvatarGroup 组件首次发布，支持图片/文字/默认三种模式、clickable 交互、horizontal/symmetric 布局 |

---

### OAvatar Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 引入版本 | 说明 |
|--------|------|--------|--------|---------|------|
| size | `number | string` | — | `'var(--o-icon_size-4xl)'` | 头像尺寸。支持数字（自动加 px）、CSS 变量（如 `var(--o-icon_size-4xl)`）或带单位的字符串（如 `56px`）。OAvatar 默认 `var(--o-icon_size-4xl)`，OAvatarGroup 默认 `var(--o-icon_size-s)`。 | 尺寸，支持数字/变量/带单位值 |
| background | `string` | — | — | 1.2.3 | 头像背景色。仅在文字模式（有 name 无 url）时生效。未指定时，文字模式背景随机分配 `--o-color-auxiliary1~8` 之一；图片模式背景为 `--o-color-fill2`。 |
| url | `string` | — | — | 1.2.3 | 头像图片地址。有 url 时展示图片；图片加载失败回退为默认头像图标，并触发 error 事件。 |
| name | `string` | — | — | 1.2.3 | 头像名称。无 url 时展示 name 的首字符；无 url 无 name 时展示默认头像图标（IconAvatar）。 |
| nameFormatter | `(data: { name?: string }) => VNode` | — | — | 1.2.3 | 组内头像的名称渲染函数，透传至每个 OAvatar。 |
| clickable | `boolean` | — | `false` | 1.2.3 | 是否可点击。开启后 hover 时显示半透明遮罩层（`--avatar-mask`）+ 编辑图标（IconEdit）。遮罩层 opacity 从 0 到 1 过渡，transition 为 `var(--o-duration-s) var(--o-easing-standard)`。默认关闭。 |
| objectFit | `'fill' | 'contain' | 'cover' | 'none' | 组内头像的图片填充方式，透传至每个 OAvatar。 | — | `'fill'` | 1.2.3 | 图片填充方式 |

---

### OAvatar Events 表

| 事件名 | 参数 | 引入版本 | 触发时机 |
|--------|------|---------|---------|
| click | `(evt: MouseEvent)` | 1.2.3 | 点击头像时触发。仅在 clickable=true 时生效。 |
| error | — | 1.2.3 | 图片加载失败 |
| load | — | 1.2.3 | 图片加载成功 |

---

### OAvatar Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| name | — | 无 url 有 name 时渲染 | 自定义名称文字区域。默认回退内容为 nameFormatter 渲染结果或 `name[0]` 首字符。 | `nameFormatter` 渲染结果或 `name[0]` 首字符 |
| triggerIcon | — | clickable=true 时渲染 | 自定义可点击遮罩层上的触发图标。默认为 IconEdit 编辑图标。 | IconEdit 编辑图标 |

---

### OAvatarGroup Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 引入版本 | 说明 |
|--------|------|--------|--------|---------|------|
| urlList | `AvatarItem[]` | — | `[]` | 1.2.3 | 头像列表数据，每项为 `{ url?, name?, background? }` 的 AvatarItem 对象。 |
| size | `number | string` | — | `'var(--o-icon_size-s)'` | 头像尺寸。支持数字（自动加 px）、CSS 变量（如 `var(--o-icon_size-4xl)`）或带单位的字符串（如 `56px`）。OAvatar 默认 `var(--o-icon_size-4xl)`，OAvatarGroup 默认 `var(--o-icon_size-s)`。 | 组内所有头像的统一尺寸 |
| layout | `'horizontal' | 'symmetric'` | — | `'horizontal'` | 布局模式。"horizontal" 水平堆叠（最多显示 2 个真实头像 + 1 个溢出提示，负 margin 重叠排列）、"symmetric" 对称网格（1 个水平居中、2 个横排、3 个等腰三角、4 个 2x2 方阵、>=5 个 2x2 + 溢出）。默认 horizontal。 | 布局模式 |
| overflowType | `'ellipsis' | 'count'` | — | `'ellipsis'` | 溢出头像展示方式。"ellipsis" 显示省略号图标（IconEllipsis）、"count" 显示 +N 数量（超过 99 显示 99+）。默认 ellipsis。 | 溢出展示方式 |
| nameFormatter | `(data: { name?: string }) => VNode` | — | — | 1.2.3 | 组内头像的名称渲染函数，透传至每个 OAvatar。 |
| objectFit | `'fill' | 'contain' | 'cover' | 'none' | 组内头像的图片填充方式，透传至每个 OAvatar。 | — | `'fill'` | 1.2.3 | 图片填充方式，透传至每个头像 |

---

### OAvatarGroup Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| more | — | 溢出数量 > 0 时渲染 | 自定义溢出头像的内容。默认回退为省略号图标或 +N 计数文字。 | 省略号图标（ellipsis）或 +N 计数文字（count） |
