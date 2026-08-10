> ← [组件索引](../SKILL.md#组件索引) · [视觉识别](breadcrumb.visual.md) · [样式定制](breadcrumb.style.md)

# OBreadcrumb 面包屑 — 代码使用

### 导入方式

```vue
<script setup>
import { OBreadcrumb, OBreadcrumbItem } from '@opensig/opendesign';
</script>
```

---

### Events 表

本组件无自定义事件。

---

### Slots 表

**OBreadcrumb：**

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 面包屑项列表 | 无 |

**OBreadcrumbItem：**

| 插槽名 | Slot Props | 触发条件 | 替换范围 | 回退内容 |
|--------|-----------|---------|---------|---------|
| default | — | 始终 | 面包屑项的文本内容 | 无 |
| separator | — | 始终 | 分隔符区域 | separator 属性值或默认箭头图标 |

---

### 插槽层级关系

```
OBreadcrumb default
└── OBreadcrumbItem
    ├── default（面包屑项内容）
    └── separator（分隔符，使用后属性失效）
```

---

### 典型使用场景与调用模板

**场景 1：基础面包屑**
适用于：简单页面层级导航
```vue
<OBreadcrumb>
  <OBreadcrumbItem href="/">首页</OBreadcrumbItem>
  <OBreadcrumbItem href="/products">产品列表</OBreadcrumbItem>
  <OBreadcrumbItem>当前页面</OBreadcrumbItem>
</OBreadcrumb>
```

**场景 2：配合 Vue Router**
适用于：SPA 应用内部导航
```vue
<OBreadcrumb>
  <OBreadcrumbItem to="/">首页</OBreadcrumbItem>
  <OBreadcrumbItem :to="{ name: 'products' }">产品列表</OBreadcrumbItem>
  <OBreadcrumbItem>当前页面</OBreadcrumbItem>
</OBreadcrumb>
```

**场景 3：自定义分隔符**
适用于：需要不同于默认箭头的分隔样式
```vue
<OBreadcrumb separator="/">
  <OBreadcrumbItem href="/">首页</OBreadcrumbItem>
  <OBreadcrumbItem>当前页面</OBreadcrumbItem>
</OBreadcrumb>
```

**场景 4：带图标的面包屑项**
适用于：首页等特殊项需要图标装饰
```vue
<OBreadcrumb>
  <OBreadcrumbItem href="/">
    <OIconHome style="margin-right: 4px; font-size: 16px;" />首页
  </OBreadcrumbItem>
  <OBreadcrumbItem>当前页面</OBreadcrumbItem>
</OBreadcrumb>
```

---

### 常见 prop 组合速查

| 场景 | 推荐 prop 组合 | 说明 |
|------|---------------|------|
| 普通链接导航 | `href` + `target="_self"` | 最常见用法 |
| SPA 路由导航 | `to` | 使用 Vue Router |
| 新窗口打开 | `href` + `target="_blank"` | 外部链接 |
| 当前页面（末尾项） | 不设 href/to | 渲染为纯文本 span |

---

### OBreadcrumb Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| separator | `string \| number` | — | 该项的分隔符字符，会覆盖父级 OBreadcrumb 的 separator 设置。 | 全局分隔符字符，不传时显示默认箭头图标 | — |

---

### OBreadcrumbItem Props 表

| 参数名 | 类型 | 可选值 | 默认值 | 说明 | 引入版本 |
|--------|------|--------|--------|------|--------|
| href | `string` | — | — | 链接跳转地址。设置后该项渲染为 `<a>` 标签，可点击跳转。不设置时渲染为普通文本 `<span>`，有利于 SEO。 | — |
| target | `string` | `'_blank'` / `'_parent'` / `'_self'` / `'_top'` | `'_self'` | 链接打开方式，与 href 配合使用。"_self" 当前窗口、"_blank" 新窗口等。默认 "_self"。 | — |
| to | `string \| object` | — | Vue Router 路由跳转对象。设置后该项渲染为 `<router-link>` 组件，实现 SPA 内部导航。当 href 和 to 同时存在时，优先使用 to 进行跳转。 | Vue Router 路由对象，设置后渲染为 `<router-link>` | — |
| replace | `boolean` | — | `false` | 路由跳转时是否替换浏览器历史记录（而非新增），与 to 配合使用。默认关闭。 | — |
| separator | `string \| number` | — | 该项的分隔符字符，会覆盖父级 OBreadcrumb 的 separator 设置。 | 分隔符字符，覆盖父级设置 | — |

---

### 渲染标签优先级

| 条件 | 渲染标签 | 说明 |
|------|---------|------|
| `to` 已设置 | `<router-link>` | SPA 内部导航，优先级最高 |
| `href` 已设置 | `<a>` | 普通链接跳转 |
| 均未设置 | `<span>` | 纯文本，有利于 SEO |
