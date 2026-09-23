> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](grid.visual.md) · [样式定制](grid.style.md)

# ORow/OCol 栅格布局 — 代码使用

### 导入方式

```vue
<script setup>
import { ORow, OCol } from '@opensig/opendesign';
</script>
```

---

### Events 表

本组件无事件。

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| ORow default | — | 始终 | 列列表 | 无 |
| OCol default | — | 始终 | 列内容 | 无 |

---

### 典型使用场景与调用模板

**场景 1：基础两列布局**
适用于：左右分栏
```vue
<ORow gap="24px">
  <OCol flex="0 0 50%">左侧内容</OCol>
  <OCol flex="0 0 50%">右侧内容</OCol>
</ORow>
```

**场景 2：响应式三列变一列**
适用于：桌面三列、移动端一列
```vue
<ORow gap="24px" :pad-v="{ gap: '16px' }">
  <OCol flex="0 0 33.33%" :pad-v="{ flex: '0 0 100%' }">
    卡片 1
  </OCol>
  <OCol flex="0 0 33.33%" :pad-v="{ flex: '0 0 100%' }">
    卡片 2
  </OCol>
  <OCol flex="0 0 33.33%" :pad-v="{ flex: '0 0 100%' }">
    卡片 3
  </OCol>
</ORow>
```

**场景 3：居中对齐**
适用于：垂直居中的行
```vue
<ORow align="center" justify="center" gap="16px">
  <OCol flex="0 0 auto">项目 A</OCol>
  <OCol flex="0 0 auto">项目 B</OCol>
</ORow>
```

**场景 4：自适应列 + 固定列**
适用于：侧边栏 + 主内容
```vue
<ORow gap="24px">
  <OCol flex="0 0 240px">侧边栏</OCol>
  <OCol flex="1">主内容（自适应）</OCol>
</ORow>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 等分多列 | `flex="0 0 {百分比}"` | 如 33.33% 三列 |
| 响应式列宽 | `flex` + `:pad-v` + `:phone` | 断点下覆盖 |
| 间距响应式 | `gap` + `:pad` + `:phone` | 断点下缩小间距 |
| 自适应宽度 | `flex="1"` | 占满剩余空间 |

---

### ORow Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| inline | `boolean` | — | `false` | 是否使用 inline-flex 显示。默认 flex。 | — |
| align | `string` | `'center'` / `'flex-start'` / `'flex-end'` / `'stretch'` / `'baseline'` / `'inherit'` / `'initial'` | — | 自身在交叉轴的对齐方式。同 CSS align-self。 | — |
| justify | `string` | `'center'` / `'flex-start'` / `'flex-end'` / `'space-between'` / `'space-around'` / `'space-evenly'` / `'inherit'` / `'initial'` | — | 主轴对齐方式。同 CSS justify-content，如 "center"、"space-between" 等。 | — |
| wrap | `string` | `'nowrap'` / `'wrap'` / `'wrap-reverse'` / `'initial'` / `'inherit'` | `'wrap'` | 是否换行。同 CSS flex-wrap。默认 "wrap"（自动换行）。 | — |
| direction | `string` | `'row'` / `'row-reverse'` / `'column'` / `'column-reverse'` | — | 排列方向。同 CSS flex-direction，如 "row"、"column" 等。 | — |
| gap | `string` | CSS 值 | — | 间距（横纵） | — |
| gapX | `string` | CSS 值 | — | 横向间距 | — |
| gapY | `string` | CSS 值 | — | 纵向间距 | — |
| pcS | `RowMediaT` | `{ gap?, gapX?, gapY? }` | — | ≤1680px 间距 | @since 1.1.0 |
| laptop | `RowMediaT` | `{ gap?, gapX?, gapY? }` | — | ≤1440px 间距 | — |
| pad | `RowMediaT` | `{ gap?, gapX?, gapY? }` | — | ≤1200px 间距 | — |
| padV | `RowMediaT` | `{ gap?, gapX?, gapY? }` | — | ≤840px 间距 | — |
| phone | `RowMediaT` | `{ gap?, gapX?, gapY? }` | — | ≤600px 间距 | — |

---

### OCol Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| flex | `string` | CSS flex 值 | `'1 0 auto'` | 列的弹性布局值。同 CSS flex。默认 "1 0 auto"（自动撑满）。常用值如 "0 0 50%" 表示占一半宽度、"1" 表示自适应。 | — |
| align | `string` | `'center'` / `'flex-start'` / `'flex-end'` / `'stretch'` / `'baseline'` / `'inherit'` / `'initial'` | — | 自身在交叉轴的对齐方式。同 CSS align-self。 | — |
| pcS | `ColMediaT` | `{ flex: string }` | — | ≤1680px flex | @since 1.1.0 |
| laptop | `ColMediaT` | `{ flex: string }` | — | ≤1440px flex | — |
| pad | `ColMediaT` | `{ flex: string }` | — | ≤1200px flex | — |
| padV | `ColMediaT` | `{ flex: string }` | — | ≤840px flex | — |
| phone | `ColMediaT` | `{ flex: string }` | — | ≤600px flex | — |
