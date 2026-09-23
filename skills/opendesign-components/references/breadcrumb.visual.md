> ← [组件索引](../SKILL.md#组件索引) · [代码使用](breadcrumb.usage.md) · [样式定制](breadcrumb.style.md)

# OBreadcrumb 面包屑 — 视觉识别

OBreadcrumb 是面包屑导航组件，显示当前页面在站点层级中的位置路径，帮助用户快速回到上级页面。包含两个组件：OBreadcrumb（容器）和 OBreadcrumbItem（面包屑项）。

📱 **响应式行为**：在笔记本尺寸及以下（≤1200px），文字变小、分隔符图标缩小。

🧩 **布局结构**：外层 `.o-breadcrumb` 为水平 flex 容器，内部排列多个 `.o-breadcrumb-item`。每个 item 内含 label（文字链接/文本）和 separator（分隔符箭头或自定义字符），水平排列。最后一项的分隔符在视觉上隐藏。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: row
regions: [breadcrumb-item*(label + separator)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 水平排列的多段小号文字（tip1/tip2），之间由">"右箭头图标或自定义字符分隔
2. 前面各项为可点击链接（info3 灰色，hover 变品牌蓝），最后一项为当前页面（品牌蓝色，不可点击或纯文本）
3. 通常位于页面顶部、标题上方，呈 "首页 > 分类 > 当前页" 路径结构

**设计 Token → Prop 值映射表**

| 设计特征 | Token / 视觉值 | Prop | Prop 值 |
|---------|---------------|------|--------|
| 分隔符为">"箭头图标 | IconChevronRight | — | 默认（不设 separator） |
| 分隔符为"/"等文字 | 自定义字符 | `separator` | `"/"` 等 |
| 项目可点击跳转 | 渲染为 `<a>` | `href` | URL 字符串 |
| 项目 SPA 路由跳转 | 渲染为 `<router-link>` | `to` | 路由对象 |
| 末尾项不可点击 | 渲染为 `<span>` | — | 不设 href/to |
| 文字颜色灰色 | `--o-color-info3` | — | 默认 |
| 当前项蓝色 | `--o-color-primary1` | — | 选中态 |

**易混淆组件区分表**

| 对比组件 | 相似点 | 区分方法 |
|---------|-------|---------|
| OTab 标签页 | 都是水平排列的文字项 | 面包屑有分隔符箭头且表示层级路径；Tab 表示同级切换且有下划线/背景选中态 |
| OMenu 导航 | 都用于页面导航 | 面包屑是辅助导航显示当前位置路径；OMenu 是主导航条含菜单项 |
| 纯文字链接列表 | 都是水平链接 | 面包屑有统一分隔符、固定路径语义、最后一项为当前页 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.1.0 | 调整 hover/active 颜色变量（`--breadcrumb-color-hover`、`--breadcrumb-color-active`） |
| v1.0.2 | 修复 CSS 变量拼写：`--breadcrumb-seperator-size` 更正为 `--breadcrumb-separator-size` |
