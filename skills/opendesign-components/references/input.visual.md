> ← [组件索引](../SKILL.md#组件索引) · [代码使用](input.usage.md) · [样式定制](input.style.md)

# OInput 输入框 — 视觉识别

OInput 是单行输入框组件，支持多种外观样式、校验状态、密码框、字数统计等功能。可与 OForm 配合实现自动校验。

📱 **响应式行为**：在笔记本尺寸及以下（≤1200px），大尺寸输入框高度从标准缩至 36px、文字变小、图标缩小；中尺寸高度缩至 28px。在平板竖屏及以下（≤840px），大尺寸高度恢复标准控件尺寸、图标使用中号。手机（≤600px）内边距进一步缩小。

🧩 **布局结构**：输入框整体水平排列，从左到右依次为：prepend 前置区域（外部，如 "https://"）、主体区域（含 prefix 前缀图标、input 输入区、suffix 后缀区域含清空/密码/字数统计/extra）、append 后置区域（外部，如 ".com"）。主体区域有边框/背景，prepend/append 是独立的外部附加块。输入框高度由 size 决定（small var(--o-control_size-s) / medium var(--o-control_size-m) / large var(--o-control_size-l)）。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: horizontal
regions: [prepend(前置区域), main(prefix + input + suffix), append(后置区域)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 矩形带边框的单行文本输入区域，可能含前缀图标或后缀按钮（清空 ×、密码眼睛、字数统计） → 匹配 OInput
2. 输入区域左右有灰色背景的附加文字块（如 "https://"、".com"、下拉选择区域） → 使用 prepend/append 插槽
3. 输入区域右侧有密码眼睛图标、点击可切换文字显示 → type="password"

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 边框 | `--o-color-control1` 灰色边框，透明背景 | variant | `'outline'` | 默认 |
| 背景 | `--o-color-control1-light` 灰色填充 | variant | `'solid'` | — |
| 边框+背景 | 均透明 | variant | `'text'` | — |
| 边框颜色 | `--o-color-danger1` 红色 | color | `'danger'` | 错误状态 |
| 边框颜色 | `--o-color-success1` 绿色 | color | `'success'` | 成功状态 |
| 边框颜色 | `--o-color-warning1` 橙色 | color | `'warning'` | 警告状态 |
| 高度 | var(--o-control_size-l) | size | `'large'` | — |
| 高度 | var(--o-control_size-m) | size | `'medium'` | — |
| 高度 | var(--o-control_size-s) | size | `'small'` | — |
| border-radius | 全圆角 | round | `'pill'` | — |
| 右侧有 × 图标 | 可见 | clearable | `true` | — |
| 右侧有眼睛图标 | 可见 | type | `'password'` | — |
| 右侧有 "3/20" 文字 | 字数统计 | showLength | `'always'` | 配合 maxLength |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OInput | OInputNumber | OInputNumber 有加减控制按钮（上下箭头或 ±），OInput 无步进按钮 |
| OInput | OTextarea | OTextarea 是多行输入且高度可变，OInput 是单行固定高度 |
| OInput | OSelect | OSelect 右侧有下拉箭头且点击展开面板，OInput 无下拉功能 |
| OInput | OIpInput | OIpInput 有 4 段点分输入格式，OInput 是单段连续输入 |
