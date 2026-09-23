> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](progress.visual.md) · [样式定制](progress.style.md)

# OProgress 进度条 — 代码使用

### 导入方式

```vue
<script setup>
import { OProgress } from '@opensig/opendesign';
</script>
```

---

### 类型定义

```typescript
type ProgressVariantT = 'line' | 'circle';
type ProgressSizeT = 'medium' | 'small';
type ProgressColorT = 'primary' | 'success' | 'warning' | 'danger';
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| variant | `ProgressVariantT` | `'line'` / `'circle'` | `'line'` | 进度条类型。"line" 线形水平进度条、"circle" 环形进度条。默认 line。 | — |
| percentage | `number` | 0-100 | `0` | 进度百分比，范围 0-100。默认 0。 | — |
| strokeWidth | `number` | — | medium:8, small:4 | 进度条线宽（px）。不传时跟随 size 自动设置。 | — |
| size | `ProgressSizeT` | `'medium'` / `'small'` | `'medium'` | 进度条尺寸。"medium" 中号、"small" 小号。默认 medium。中号线宽默认 8px，小号默认 4px。 | — |
| color | `ProgressColorT` | `'primary'` / `'success'` / `'warning'` / `'danger'` | `'primary'` | 进度条颜色。"primary" 品牌色、"success" 成功绿色、"warning" 警告橙色、"danger" 危险红色。默认 primary。 | — |
| trackWidth | `number \| string` | — | 轨道宽度。线形时支持数字（px）和字符串（CSS 值）；环形时仅支持数字，同时决定环形的直径。 | 轨道宽度 | — |
| format | `(percentage: number) => string` | — | `(p) => p + '%'` | 自定义格式化进度文字的函数，接收 percentage 返回显示字符串。默认显示 "{percentage}%"。 | — |
| showLabel | `boolean` | — | `true` | 是否显示进度文字。默认显示。 | — |
| labelInside | `boolean` | — | `false` | 仅环形进度条（variant="circle"）可用，不适用于线形。 | — |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | `{ percentage: number }` | showLabel 为 true 时 | 替换进度文字。可获取当前 percentage。使用后 format 属性失效。 | `format(percentage)` |
| icon | `{ percentage: number }` | showLabel 为 true 时 | 替换整个文字区域为图标。可获取当前 percentage。使用后 default 插槽和 format 属性失效。适合用状态图标替换百分比文字。 | default 插槽内容 |

---

### 插槽层级关系

```
icon（使用后 default 失效）
└── default
```

---

### 典型使用场景与调用模板

**场景 1：基础线形进度条**
适用于：文件上传、任务进度
```vue
<OProgress :percentage="50" />
```

**场景 2：环形进度条**
适用于：统计数据、仪表盘
```vue
<OProgress variant="circle" :percentage="75" color="success" />
```

**场景 3：自定义格式化文字**
适用于：显示自定义文字
```vue
<OProgress :percentage="80" :format="(p) => p >= 100 ? '完成' : `${p}%`" />
```

**场景 4：带状态图标（环形）**
适用于：完成/失败状态展示
```vue
<OProgress :percentage="100" color="danger">
  <template #icon>
    <OIconDanger />
  </template>
</OProgress>
```

**场景 6：小号进度条**
适用于：列表项中的进度展示
```vue
<OProgress size="small" :percentage="30" :track-width="200" />
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础进度 | `:percentage` | 最简用法 |
| 环形 | `variant="circle"` + `:percentage` | 圆形进度 |
| 颜色状态 | `color="success/danger"` | 状态反馈 |
| 内部文字 | `label-inside`（仅 circle） | 环形百分比文字始终在内部 |
| 无文字 | `:show-label="false"` | 纯进度条 |
| 指定轨道宽 | `:track-width="300"` | 固定宽度 |
