> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](menu.visual.md) · [样式定制](menu.style.md)

# OMenu 菜单 — 代码使用

### 导入方式

```vue
<script setup>
import { OMenu, OSubMenu, OMenuItem } from '@opensig/opendesign';
</script>
```

---

### Slots 表

#### OMenu Slots

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 菜单内容区域 | 无 |

#### OSubMenu Slots

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| icon | — | 有 icon prop 或 icon 插槽时 | 标题前缀图标 | `<component :is="props.icon" />` |
| title | — | 始终 | 标题文字区域 | 无 |
| default | — | 始终 | 子菜单内容 | 无 |

#### OMenuItem Slots

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| icon | — | 有 icon prop 或 icon 插槽时 | 前缀图标 | `<component :is="props.icon" />` |
| default | — | 始终 | 菜单项文字 | 无 |

---

### 典型使用场景与调用模板

**场景 1：基础菜单**
适用于：侧边栏导航
```vue
<script setup>
import { ref } from 'vue';
const selected = ref('item1');
</script>
<template>
  <OMenu v-model="selected">
    <OSubMenu value="sub1">
      <template #title>分组一</template>
      <OMenuItem value="item1">菜单项 1</OMenuItem>
      <OMenuItem value="item2">菜单项 2</OMenuItem>
    </OSubMenu>
    <OSubMenu value="sub2">
      <template #title>分组二</template>
      <OMenuItem value="item3">菜单项 3</OMenuItem>
    </OSubMenu>
  </OMenu>
</template>
```

**场景 2：手风琴模式**
适用于：空间有限的侧边栏
```vue
<OMenu v-model="selected" accordion>
  <OSubMenu value="sub1">
    <template #title>分组一</template>
    <OMenuItem value="item1">菜单项 1</OMenuItem>
  </OSubMenu>
  <OSubMenu value="sub2">
    <template #title>分组二</template>
    <OMenuItem value="item2">菜单项 2</OMenuItem>
  </OSubMenu>
</OMenu>
```

**场景 3：带图标的菜单**
适用于：功能丰富的管理后台
```vue
<OMenu v-model="selected">
  <OSubMenu value="sub1">
    <template #icon><OIconEdit /></template>
    <template #title>编辑管理</template>
    <OMenuItem value="item1" :icon="OIconCalendar">日程管理</OMenuItem>
  </OSubMenu>
  <OMenuItem value="item2">
    <template #icon><OIconEye /></template>
    查看详情
  </OMenuItem>
</OMenu>
```

**场景 4：左侧箭头 + 小尺寸**
适用于：紧凑型侧栏
```vue
<OMenu v-model="selected" size="small" arrow-position="left">
  <OSubMenu value="sub1">
    <template #title>子菜单</template>
    <OMenuItem value="item1">菜单项</OMenuItem>
  </OSubMenu>
</OMenu>
```

**场景 5：多级嵌套**
适用于：复杂层级导航
```vue
<OMenu v-model="selected" :default-expanded="['sub1', 'sub1-1']">
  <OSubMenu value="sub1">
    <template #title>一级菜单</template>
    <OSubMenu value="sub1-1">
      <template #title>二级菜单</template>
      <OMenuItem value="item1">三级菜单项</OMenuItem>
    </OSubMenu>
  </OSubMenu>
</OMenu>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 基础导航 | `v-model` + OSubMenu/OMenuItem | 最常见用法 |
| 手风琴 | `accordion` | 同级只展开一个 |
| 受控展开 | `v-model:expanded` | 精确控制展开项 |
| 左箭头 | `arrow-position="left"` | 箭头在标题左侧 |
| 紧凑菜单 | `size="small"` | 小号文字和间距 |
| 禁用项 | OMenuItem `disabled` | 禁止点击（OSubMenu 无 disabled，需用 MenuItem 替代） |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| v1.2.4 | 修复 | 点击子菜单空白区域不再关闭整个菜单 |
| v1.2.3-sp1 | 修复 | SSR 场景下溢出 tooltip 内容为空的问题 |
| v1.1.0 | 破坏性变更 | Menu 重构：新增引导线样式、arrowPosition；移除 levelIndent；CSS 变量按层级而非按 item/sub 重组 |

---

### OMenu Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| size | `MenuSizeT` | `'medium'` / `'small'` | `'medium'` | 菜单整体尺寸。"medium" 中号、"small" 小号。默认 medium。 |
| accordion | `boolean` | — | `false` | 是否开启手风琴模式。开启后同级只能展开一个子菜单，展开新的会自动收起其他同级。默认关闭。 |
| modelValue | `string` | — | — | 当前选中的菜单项值（v-model 双向绑定）。 |
| defaultValue | `string` | — | `''` | 非受控模式下的默认选中值。 |
| expanded | `string[]` | — | — | 当前展开的子菜单值数组（v-model:expanded 双向绑定）。 |
| defaultExpanded | `string[]` | — | `[]` | 非受控模式下默认展开的子菜单值数组。 |
| selectStrictly | `boolean` | — | `false` | 父子节点是否关联。开启后点击子菜单项时，其父级子菜单也会标记为关联选中状态（高亮显示路径）。默认关闭。 |
| arrowPosition | `string` | `'left'` / `'right'` | `'right'` | 子菜单折叠箭头的位置。"left" 在标题左侧、"right" 在标题右侧。默认 right。 |

---

### OSubMenu Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| value | `string` | — | — | 菜单项唯一标识值。必填。点击时该值会被设置为 OMenu 的选中值。 |
| selectable | `boolean` | — | `false` | 点击子菜单标题是否同时选中该子菜单（除展开/收起外还触发选中）。默认关闭。 |
| icon | `Component` | — | — | 菜单项前缀图标组件。 |

> ⚠️ **OSubMenu 不支持 `disabled`**：若子菜单项需要呈现为禁用态，请改用 `OMenuItem` 的 `disabled` 属性。

---

### OMenuItem Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| value | `string` | — | — | 菜单项唯一标识值。必填。点击时该值会被设置为 OMenu 的选中值。 |
| icon | `Component` | — | — | 菜单项前缀图标组件。 |
| disabled | `boolean` | — | `false` | 是否禁用菜单项。禁用后点击无效、样式变灰。默认关闭。 |

---

### OMenu Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| update:modelValue | `(val: string)` | 选中值变化时 |
| change | `(val: string)` | 选中菜单项变化时触发，可获取新选中的值。 |
| update:expanded | `(val: string[])` | 展开状态变化时 |
| expanded-change | `(val: string[])` | 展开的子菜单变化时触发，可获取当前展开的子菜单值数组。 |

---

### OMenuItem Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| click | `(ev: Event)` | 点击菜单项（非禁用时） |

---

### 特殊行为

- 菜单项文字超出容器宽度时，自动截断并在 hover 时通过 Popover 显示完整文字
- 子菜单嵌套深度通过 CSS 变量 `--menu-level` 控制缩进
- 手风琴模式仅影响同级子菜单，不同层级的子菜单互不影响
