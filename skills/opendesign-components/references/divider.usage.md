> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](divider.visual.md) · [样式定制](divider.style.md)

# ODivider 分割线 — 代码使用

### 导入方式

```vue
<script setup>
import { ODivider } from '@opensig/opendesign';
</script>
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| variant | `DividerVariantT` | `'solid'` / `'dashed'` / `'dotted'` | `'solid'` | 分割线样式。"solid" 实线、"dashed" 虚线、"dotted" 点线。默认实线。 | — |
| direction | `DirectionT` | `'h'` / `'v'` | `'h'` | 分割线方向。"h" 水平方向，宽度撑满容器；"v" 垂直方向，高度默认 1em。默认水平。 | — |
| labelPosition | `string` | `'left'` / `'center'` / `'right'` | `'center'` | 标签在分割线上的位置。"left" 靠左、"center" 居中、"right" 靠右。默认居中。仅水平方向有效。 | — |
| darker | `boolean` | — | `false` | 是否使用深色分割线。默认浅色。 | — |

---

### Events 表

本组件无事件。

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 仅水平方向（`direction="h"`） | 分割线上的标签文字。仅水平方向生效。传入内容后分割线变为两段，中间显示标签。 | 无（不传则为纯分割线） |

---

### 典型使用场景与调用模板

**场景 1：基础水平分割线**
适用于：内容段落之间的分隔
```vue
<p>上方内容</p>
<ODivider />
<p>下方内容</p>
```

**场景 2：带标签的分割线**
适用于：分割线上显示文字说明
```vue
<ODivider>或</ODivider>
<ODivider label-position="left">开始</ODivider>
```

**场景 3：虚线分割**
适用于：视觉上较轻的分隔
```vue
<ODivider variant="dashed" />
```

**场景 4：垂直分割线**
适用于：行内元素之间的分隔
```vue
<span>项目 A</span>
<ODivider direction="v" />
<span>项目 B</span>
```

**场景 5：深色分割线**
适用于：需要更强视觉分隔效果
```vue
<ODivider darker />
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础分割 | 默认即可 | 水平实线 |
| 带文字分割 | `default` 插槽 + `label-position` | 水平方向有效 |
| 垂直分割 | `direction="v"` | 行内分隔 |
| 虚线/点线 | `variant="dashed"` / `variant="dotted"` | 样式变体 |
| 强调分割 | `darker` | 深色线 |
