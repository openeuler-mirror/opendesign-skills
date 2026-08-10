> ← [组件索引](../SKILL.md#组件索引) · [代码使用](button.usage.md) · [样式定制](button.style.md)

# OButton 按钮 — 视觉识别

OButton 是通用按钮组件，用于触发操作或导航。支持多种颜色、形状、尺寸、圆角，可承载图标和文字。

📱 **响应式行为**：在笔记本尺寸及以下（≤1200px），large 按钮高度缩小至 36px、字号缩小，medium 按钮高度缩至 28px。在平板竖屏及以下（≤840px），large 按钮进一步缩至 32px。

🧩 **布局结构**：按钮内部水平排列，从左到右依次为：前缀图标区（可被 loading 动画替换）、文字内容区（弹性伸缩）、后缀图标区。图标与文字间距 8px（small 为 4px）。按钮高度由 size 决定（small 28px / medium 32px / large 40px），水平内边距 15–23px。纯图标按钮无内边距，宽高相等。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: horizontal
regions: [icon(前缀图标), default(文字内容), suffix(后缀图标)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 矩形可点击区域 + 内含文字/图标 + 有填充背景或描边边框 → 匹配 OButton（solid/outline 变体）
2. 有 padding 的可点击区域、去掉背景/边框但保留矩形容器语义（hover 有背景色块）→ 匹配 OButton（text 变体）；若设计稿中该元素直接标注为"文字按钮"并与行内文字等高，则改用 OLink
3. 圆角方形 + 仅含图标无文字 → 匹配 OButton（icon-only 模式）

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 背景色 | 实心填充（如 `--o-color-primary1`） | variant | `'solid'` | — |
| 背景色 | 透明，仅边框 | variant | `'outline'` | — |
| 背景色 | 透明，无边框 | variant | `'text'` | — |
| fill 颜色 | `--o-color-primary1` 蓝色系 | color | `'primary'` | — |
| fill 颜色 | `--o-color-success1` 绿色系 | color | `'success'` | — |
| fill 颜色 | `--o-color-warning1` 橙色系 | color | `'warning'` | — |
| fill 颜色 | `--o-color-danger1` 红色系 | color | `'danger'` | — |
| fill 颜色 | 渐变（`--o-color-main2`） | color | `'brand'` | 仅 solid 有渐变 |
| fill 颜色 | `--o-color-control1` 灰色系 | color | `'normal'` | 默认 |
| height | 40px | size | `'large'` | — |
| height | 32px | size | `'medium'` | — |
| height | 28px | size | `'small'` | — |
| border-radius | 全圆角（≥高度值） | round | `'pill'` | — |
| border-radius | `--o-radius_control-s` | round | — | 默认样式 |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OButton | OLink | OLink 是行内文字链接无容器边界，OButton 有明确的矩形可点击区域 |
| OButton | OTag | OTag 是静态标签展示（无 click 交互），OButton 是操作触发器 |
| OButton（text） | OLink | OButton text 变体有 padding 和 hover 背景色变化，OLink 仅文字颜色变化 |
| OButton（icon-only） | OIcon | OIcon 是纯展示图标无交互容器，OButton icon-only 有 hover/active 态 |
| OButton | OLink（表格操作列） | 表格操作列推荐使用 OLink（主要操作 primary，危险操作 danger），OButton 适用于工具栏图标按钮或批量操作按钮 |
