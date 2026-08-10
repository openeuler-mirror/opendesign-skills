> ← [组件索引](../SKILL.md#组件索引) · [代码使用](textarea.usage.md) · [样式定制](textarea.style.md)

# OTextarea 多行文本输入框 — 视觉识别

OTextarea 是多行文本输入框组件，基于 InBox + InTextarea 内部组件组合而成。支持尺寸、圆角、颜色、样式变体、字符长度限制与显示、自动高度、清空、格式化校验等功能。与 OForm 表单联动时自动获取校验颜色。

📱 **响应式行为**：在笔记本尺寸及以下（≤1440px），最小高度缩至 116px、字号缩小至 tip1；在平板竖屏及以下（≤840px），large 水平内边距缩至 12px。

🧩 **布局结构**：文本域由外层容器（InBox）和内层输入区（InTextarea）组合而成。外层容器提供边框、圆角、颜色主题；内层包含多行文本输入区和可选的字符计数显示。支持前置区域（prepend）、后置区域（append）、后缀区域（suffix）三个插槽扩展。文本域最小高度 126px，最小宽度 xl 控件尺寸。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: vertical
regions: [prepend(前置区域), textarea(文本输入区+字符计数), append(后置区域)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 多行文本输入框 + 边框包围 + 高度大于单行输入框 → 匹配 OTextarea
2. 右下角 "n/m" 字符计数 → 匹配 OTextarea（showLength + maxLength）
3. 右下角有可拖拽调整大小的手柄 → 匹配 OTextarea（resize 非 none）

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 背景色 | 实心填充 | variant | `'solid'` | — |
| 背景色 | 透明，仅边框 | variant | `'outline'` | 默认 |
| 背景色 | 透明，无边框 | variant | `'text'` | — |
| 边框颜色 | 绿色 | color | `'success'` | 或表单校验 |
| 边框颜色 | 橙色 | color | `'warning'` | 或表单校验 |
| 边框颜色 | 红色 | color | `'danger'` | 或表单校验 |
| 右下角计数 | 有 "n/m" 显示 | showLength + maxLength | `'always'` + 数值 | — |
| 灰色占位文字 | 有 | placeholder | 字符串值 | — |
| 拖拽手柄 | 可纵向拖拽 | resize | `'vertical'` | 默认 |
| 拖拽手柄 | 不可拖拽 | resize | `'none'` | — |
| 清除图标 | 有 × | clearable | `true` | — |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OTextarea | OInput | OInput 是单行输入框（高度约 28–40px），OTextarea 是多行（高度 ≥ 116px） |
| OTextarea | 纯 HTML textarea | OTextarea 有 InBox 外壳提供统一边框、颜色、圆角等样式主题 |
| OTextarea | OInput（textarea 模式） | OTextarea 是独立组件，非 OInput 的变体 |
