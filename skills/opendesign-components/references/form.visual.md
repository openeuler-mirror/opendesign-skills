> ← [组件索引](../SKILL.md#组件索引) · [代码使用](form.usage.md) · [样式定制](form.style.md)

# OForm 表单 — 视觉识别

OForm 是表单组件，用于收集和校验用户输入。包含 OForm（表单容器）和 OFormItem（表单项）。支持水平、垂直、行内三种布局，内置验证规则系统。

📱 **响应式行为**：在笔记本尺寸（≤1440px），表单项间距和标签间距缩小；平板横屏（841–1200px）间距进一步缩小，控件宽度随 `--o-r-grid-*` token 自动收窄；平板竖屏及以下（≤840px），控件宽度自动收窄为 `min(var(--o-r-grid-6), 100%)`，标签与控件间距缩至 8px；手机（≤600px），控件宽度进一步收窄为 `min(var(--o-r-grid-4), 100%)`，校验消息边距调整。v1.2.3-sp1 为 601–840px 和 ≤600px 断点新增了 `--form-item-main-box-width-standard` / `--form-item-main-box-width-wide` 变量，从原来的 `100%` 改为 `min()` 函数约束。

🧩 **布局结构**：外层 `.o-form` 为 `<form>` 元素，通过 `layout` 属性切换水平（h，标签与控件同行 flex 排列）、垂直（v，标签在上控件在下 block 排列）、行内（inline，表单项横向排列 flex wrap）三种模式。每个 OFormItem 内部由标签区（`.o-form-item-label`，含必填星号 + 标签文字）和主区域（`.o-form-item-main`，含控件 + 校验消息 + 额外提示）组成，通常label为顶对齐。
```yaml
# 简化结构摘要（完整版见 Part B）
tag: form
layout: h(flex-row) | v(block) | inline(flex-wrap)
item: [label(symbol+text), main(control+message+extra)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 纵向排列的表单项列表，每项由标签（左侧或上方）+ 表单控件（右侧或下方）组成
2. 水平模式：标签和控件在同一行，标签固定宽度（默认 20%，最大 240px），控件区自适应撑满
3. 垂直模式：标签在控件上方，标签宽度 100%，适合移动端窄屏
4. 必填项标签前有红色星号（*），星号使用 monospace 字体、tip2 字号、danger1 颜色
5. 校验失败时控件下方出现提示文字：danger 红色、warning 黄色，tip2 字号
6. 行内模式：多个表单项横向排列，自动换行

**设计 Token → Prop 值映射表**

| 设计特征 | Token / 视觉值 | Prop | Prop 值 |
|---------|---------------|------|--------|
| 标签在左、控件在右 | flex 同行 | `layout` | `"h"`（默认） |
| 标签在上、控件在下 | block 上下 | `layout` | `"v"` |
| 多个表单项同行 | flex-wrap | `layout` | `"inline"` |
| 标签前红色星号 | --o-color-danger1 | `required` + `hasRequired` | `true` |
| 标签固定宽度 | --form-label-width | `labelWidth` | CSS 值如 `"120px"` |
| 标签右对齐 | justify-content: flex-end | `labelJustify` | `"right"` |
| 标签居中对齐 | justify-content: center | `labelJustify` | `"center"` |
| 标签垂直顶部对齐 | align-items: flex-start | `labelAlign` | `"top"` |
| 标签垂直居中 | align-items: center | `labelAlign` | `"center"` |
| 控件下方红色文字 | --o-color-danger1 | `rules` | 校验结果 type=danger |
| 控件下方黄色文字 | --o-color-warning1 | `rules` | 校验结果 type=warning |
| 表单项间距 24px | --form-item-gap | — | 默认值（>1440px） |
| 标签控件间距 32px | --form-label-main-gap | — | 默认值（>1440px） |

**易混淆组件区分表**

| 对比组件 | 相似点 | 区分方法 |
|---------|-------|---------|
| ORow/OCol | 都可实现左右排列布局 | Form 专用于标签-控件对齐的表单场景，有校验系统和 submit 事件；ORow/OCol 是通用多列栅格系统，无表单语义 |
| div + flex 手动排列 | 都可排列元素 | Form 是 `<form>` 语义标签，内置校验系统（rules/validate/resetFields），支持全局标签配置继承 |
| OInput / OSelect 等 | 常一起使用 | Form/FormItem 是容器和布局组件，管理标签对齐和校验；Input/Select 是具体的输入控件，放在 FormItem 的默认插槽内 |
