> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](skeleton.visual.md) · [样式定制](skeleton.style.md)

# OSkeleton 骨架屏 — 代码使用

### 导入方式

```vue
<script setup>
import { OSkeleton, OSkeletonText, OSkeletonAvatar, OSkeletonFigure } from '@opensig/opendesign';
</script>
```

---

### 类型定义

```typescript
type SkeletonAvatarSizeT = 'large' | 'medium' | 'small' | 'mini';
```

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| template | — | loading 为 true 时 | 自定义骨架屏布局。使用后 rows 属性失效，可自由组合 OSkeletonText、OSkeletonAvatar、OSkeletonFigure。 | `<OSkeletonText :rows />` |
| default | — | loading 为 false 时 | 加载完成后显示的真实内容。仅在 loading 为 false 时渲染。 | 无 |

---

### 插槽层级关系

```
OSkeleton
├── template（loading=true 时显示）
│   ├── OSkeletonText
│   ├── OSkeletonAvatar
│   └── OSkeletonFigure
└── default（loading=false 时显示）
```

---

### 典型使用场景与调用模板

**场景 1：基础文本骨架**
适用于：文章加载占位
```vue
<OSkeleton :loading="loading" :rows="4">
  <p>加载完成的文本内容</p>
</OSkeleton>
```

**场景 2：带头像的骨架**
适用于：用户信息卡片
```vue
<OSkeleton :loading="loading" animation>
  <template #template>
    <OSkeletonAvatar size="large" />
    <OSkeletonText :rows="3" />
  </template>
  <div>用户信息内容</div>
</OSkeleton>
```

**场景 3：带图片占位的骨架**
适用于：图文内容加载
```vue
<OSkeleton :loading="loading" animation>
  <template #template>
    <OSkeletonFigure />
    <OSkeletonAvatar size="large" />
    <OSkeletonText :rows="3" />
  </template>
  <div>图文内容</div>
</OSkeleton>
```

**场景 4：受控切换**
适用于：手动控制加载状态
```vue
<script setup>
import { ref } from 'vue';
const loading = ref(true);
</script>
<template>
  <OSwitch v-model="loading" />
  <OSkeleton :loading="loading" animation>
    <template #template>
      <OSkeletonFigure />
      <OSkeletonText :rows="2" />
    </template>
    <p>真实内容</p>
  </OSkeleton>
</template>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础占位 | `:loading` + `:rows` | 纯文本骨架 |
| 带动画 | `animation` | 闪烁效果 |
| 自定义布局 | `#template` 插槽 | 自由组合子组件 |
| 圆角头像 | OSkeletonAvatar `round="pill"` | 默认圆形 |
| 方形头像 | OSkeletonAvatar `round="8px"` | 方角 |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| v1.2.4 | 样式 | 动画背景颜色调整 |

---

### OSkeleton Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| loading | `boolean` | — | `true` | 是否显示骨架屏。true 时显示骨架占位，false 时显示真实内容（default 插槽）。默认 true。 |
| animation | `boolean` | — | `false` | 是否显示加载动画（闪烁效果）。默认关闭。 |
| rows | `number` | — | `3` | 文本行数。默认 3。 |

---

### OSkeletonText Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| rows | `number` | — | `3` | 文本行数。默认 3。 |

---

### OSkeletonAvatar Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| size | `SkeletonAvatarSizeT` | `'large'` / `'medium'` / `'small'` / `'mini'` | `'medium'` | 头像尺寸。"large"、"medium"、"small"、"mini"。默认 medium。 |
| round | `RoundT` | `'pill'` / CSS 值 | `'pill'` | 圆角值。默认 "pill"（圆形）。 |
