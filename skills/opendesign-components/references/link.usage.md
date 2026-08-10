> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](link.visual.md) · [样式定制](link.style.md)

# OLink 链接 — 代码使用

### 导入方式

```vue
<script setup>
import { OLink } from '@opensig/opendesign';
</script>
```

---

### Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 引入版本 | 说明 |
|--------|------|--------|--------|---------|------|
| href | `string` | — | — | — | 链接 URL（to 存在时不生效） |
| target | `string` | `'_blank'` / `'_parent'` / `'_self'` / `'_top'` | — | — | 链接打开方式。"_blank" 新窗口、"_parent" 父框架、"_self" 当前页面、"_top" 顶层框架。 |
| to | `string | Record<string, unknown>` | — | — | 路由跳转目标。传入路由路径字符串或路由对象后，OLink 将渲染为 `<router-link>` 而非 `<a>` 标签，适用于 Vue Router 项目内的页面跳转。与 href 互斥——传入 to 时 href 不生效。*(v1.2.4 新增)* | 路由跳转目标，传入后渲染为 router-link |
| replace | `boolean` | — | `false` | 1.2.4 | 路由跳转时是否替换浏览器历史记录（而非追加）。仅在传入 to 时生效，作为 `<router-link>` 的 replace 属性。默认关闭。*(v1.2.4 新增)* |
| loading | `boolean` | — | `false` | — | 加载中状态。开启后前缀图标替换为旋转加载图标，点击无效。默认关闭。 |
| color | `ColorT` | `'normal'` / `'primary'` / `'success'` / `'warning'` / `'danger'` | `'normal'` | — | 链接颜色主题。"normal" 默认色、"primary" 品牌色、"success" 成功绿色、"warning" 警告橙色、"danger" 危险红色。默认 normal。 |
| size | `LinkSizeT` | `'large'` / `'medium'` / `'small'` / `'auto'` | `'auto'` | — | 链接尺寸。"large" 大号、"medium" 中号、"small" 小号、"auto" 自动继承父级字号。默认 auto。 |
| disabled | `boolean` | — | `false` | — | 禁用链接。禁用后点击无效、样式变灰。默认关闭。 |
| icon | `Component` | — | — | — | 前缀图标组件。loading 开启时图标被替换为加载图标。 |
| suffix | `boolean` | — | `false` | — | 是否显示后缀箭头图标。默认关闭。 |
| hoverBg | `boolean` | — | `false` | — | 悬停时是否显示背景色块。默认关闭。 |
| hoverUnderline | `boolean` | — | `true` | — | 悬停时是否显示下划线。默认开启。 |
| tag | `string` | — | `'a'` | — | 渲染的 HTML 标签。默认为 "a" 标签。可改为 "span"、"div" 等。传入 to 时 tag 不生效，组件渲染为 `<router-link>`。 |
| global | `boolean` | — | `true` | — | 是否启用全局配置回调。开启后点击链接会触发 OConfigProvider 中配置的 link.click 回调。默认开启。 |

---

### Events 表

| 事件名 | 参数 | 触发时机 |
|--------|------|---------|
| click | `(val: MouseEvent)` | 点击链接时触发。禁用或加载状态下不触发。 |

---

### Slots 表

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 链接文字区域 | 无 |
| icon | — | 有 icon prop 或 icon 插槽或 loading 时渲染 | 替换前缀图标区域。使用后 icon 属性失效。loading 开启时此插槽也会被替换为加载图标。 | `<component :is="props.icon" />` |
| suffix | — | 有 suffix prop 或 suffix 插槽时渲染 | 替换后缀区域。使用后 suffix 属性的默认箭头失效，渲染自定义内容。 | `<IconLinkArrow />` 箭头图标 |

---

### 插槽层级关系

```
default（链接文字）
icon（前缀图标，loading 时强制替换为 IconLoading）
suffix（后缀图标）
```

三个插槽互不嵌套，各自独立。

---

### 典型使用场景与调用模板

**场景 1：基础链接**
适用于：页面跳转
```vue
<OLink href="https://example.com" target="_blank" color="primary">查看更多</OLink>
```

**场景 2：带前缀图标**
适用于：强调链接功能
```vue
<OLink color="warning" size="medium">
  <template #icon><OIconEye /></template>
  了解更多
</OLink>
```

**场景 3：带后缀箭头**
适用于：导航类链接
```vue
<OLink color="primary" suffix>查看详情</OLink>
```

**场景 4：自定义前后缀**
适用于：丰富的链接样式
```vue
<OLink color="warning" size="medium">
  <template #icon><OIconEye /></template>
  <template #suffix><OIconChevronRight /></template>
  了解更多
</OLink>
```

**场景 5：加载状态**
适用于：点击后异步操作
```vue
<script setup>
import { ref } from 'vue';
const loading = ref(false);
const handleClick = () => {
  loading.value = true;
  setTimeout(() => { loading.value = false; }, 3000);
};
</script>
<template>
  <OLink color="primary" :loading="loading" @click="handleClick">点击加载</OLink>
</template>
```

**场景 6：全局配置回调**
适用于：统一拦截链接行为（如埋点）
```vue
<OConfigProvider :link="{ click: (e, params, attrs) => { console.log(params.href); } }">
  <OLink href="/page" color="primary">带全局回调的链接</OLink>
</OConfigProvider>
```

**场景 7：表格操作列**
适用于：数据表格的操作列（编辑、删除、详情等）
```vue
<template>
  <ODataTable :columns="columns" :data="data">
    <template #cell-operations="{ row }">
      <OLink color="primary" @click="handleEdit(row)">编辑</OLink>
      <OLink color="danger" @click="handleDelete(row)">删除</OLink>
    </template>
  </ODataTable>
</template>
```

**场景 8：Vue Router 页内跳转**
适用于：SPA 项目内路由导航（v1.2.4+）
```vue
<OLink to="/dashboard" color="primary">前往控制台</OLink>
<OLink :to="{ name: 'UserProfile', params: { id: 1 } }" color="primary" replace>用户详情</OLink>
```

---

### ⚠️ 使用注意事项

- **⚠️ 设计师术语"文字按钮"= OLink**：设计师在 Pixso/Figma 中将蓝色可点击文字标注为"文字按钮"时，代码中应使用 OLink，而不是 OButton variant="text"。OLink 是行内元素，无矩形按钮容器和 padding；OButton text 变体虽然视觉上也"没有背景"，但仍有 padding、min-width 和 hover 背景色矩形区域，两者行为不同。

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 普通跳转 | `href` + `target` + `color` | 最常见用法 |
| 路由跳转 | `to` + `color` | SPA 内导航，渲染为 router-link（v1.2.4+） |
| 路由替换 | `to` + `replace` + `color` | 跳转且不追加浏览器历史（v1.2.4+） |
| 带图标 | `#icon` 插槽 + `size` | 图标 + 文字 |
| 导航箭头 | `suffix` | 显示右箭头 |
| 悬停效果 | `hover-bg` + `:hover-underline="false"` | 背景高亮代替下划线 |
| 异步操作 | `:loading` + `@click` | 点击后显示加载 |
| 表格主要操作 | `color="primary"` | 表格操作列中的主要操作（编辑、详情等） |
| 表格危险操作 | `color="danger"` | 表格操作列中的危险操作（删除等） |

---

### 版本变更记录

| 版本 | 变更类型 | 变更内容 |
|------|---------|---------|
| 1.2.4 | 新增 | `to` 属性支持 router-link 跳转；`replace` 属性控制路由历史替换 |
| 1.2.3-sp1 | 修复 | 图标对齐问题修复 |
| 1.1.0 | 样式 | hoverUnderline 默认值改为 true；normal 态文本颜色改用 o-color-link1；large 图标尺寸变更 |
