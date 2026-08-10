> ← [组件索引](../SKILL.md#组件索引) · [代码使用](link.usage.md) · [样式定制](link.style.md)

# OLink 链接 — 视觉识别

OLink 是链接组件，用于页面间导航或触发操作。支持五种颜色主题、四种尺寸、前后缀图标、加载状态，以及全局配置回调。

📱 **响应式行为**：在笔记本尺寸及以下（≤1440px），大号链接的文字和图标缩小。

🧩 **布局结构**：根元素为 `<a>`（或自定义 tag）行内元素，传入 `to` 时为 `<router-link>`。内部水平排列三个区域：前缀图标 `.o-link-prefix`（可选，loading 时强制为旋转加载图标）、文字主体 `.o-link-main`（默认插槽，hoverUnderline 时额外包一层 `.o-link-label`）、后缀图标 `.o-link-suffix`（可选，默认箭头图标）。三区域间距由 `--link-gap` 控制。传入 `to` 时整个组件渲染为 `<router-link>`，内部结构不变。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: horizontal(inline)
regions: [prefix(前缀图标,可选), main(文字内容), suffix(后缀图标,可选)]
note: 传入to时根元素由<a>变为<router-link>，内部结构不变
```

### 设计稿识别指南

**视觉特征指纹**

1. 行内文字 + 有颜色（非黑色正文色）+ hover 态有下划线 → 匹配 OLink（默认 hoverUnderline）
2. 行内文字 + hover 态有背景色块（无下划线）→ 匹配 OLink（hoverBg=true, hoverUnderline=false）
3. 行内文字 + 右侧小箭头图标 → 匹配 OLink（suffix=true）
4. 行内文字 + 左侧有旋转加载图标 → 匹配 OLink（loading=true）
5. **设计稿标注为"文字按钮"** → 优先匹配 OLink（`color="primary"`），而非 OButton text 变体
6. **表格操作列中的文字操作** → 匹配 OLink，主要操作用 `color="primary"`，危险操作（删除等）用 `color="danger"`

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 文字颜色 | `--o-color-link1` 链接蓝 | color | `'normal'` | 默认 |
| 文字颜色 | `--o-color-primary1` 品牌蓝 | color | `'primary'` | — |
| 文字颜色 | `--o-color-success1` 绿色 | color | `'success'` | — |
| 文字颜色 | `--o-color-warning1` 橙色 | color | `'warning'` | — |
| 文字颜色 | `--o-color-danger1` 红色 | color | `'danger'` | — |
| font-size | text1 | size | `'large'` | — |
| font-size | tip1 | size | `'medium'` 或 `'small'` | 视觉一致 |
| font-size | 继承父级 | size | `'auto'` | 默认 |
| hover 效果 | 下划线 | hoverUnderline | `true` | 默认 |
| hover 效果 | 背景色块 | hoverBg | `true` | 常与 hoverUnderline=false 搭配 |
| 后缀 | 右箭头图标 | suffix | `true` | — |
| 前缀图标 | 旋转加载圈 | loading | `true` | — |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OLink | OButton(text) | OLink 是行内文字无容器边界，OButton text 有 padding 和 hover 背景色矩形区域 |
| OLink | OBreadcrumb 链接 | OBreadcrumb 是多级路径导航用 "/" 分隔，OLink 是独立单个链接 |
| OLink | 原生 `<a>` | OLink 有标准化颜色主题、loading 状态、图标插槽、全局回调 |
| OLink(to) | OLink(href) | 传入 `to` 渲染为 `<router-link>`（SPA 页内跳转），传入 `href` 渲染为 `<a>`（外部跳转） |
