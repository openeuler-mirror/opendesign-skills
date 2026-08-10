> ← [组件索引](../SKILL.md#组件索引) · [代码使用](divider.usage.md) · [样式定制](divider.style.md)

# ODivider 分割线 — 视觉识别

ODivider 是分割线组件，用于在内容之间添加视觉分隔。支持水平和垂直方向，支持实线、虚线、点线三种样式，水平方向还可以在线上放置文字标签。

📱 **响应式行为**：在平板及以下尺寸（≤1200px），标签文字缩小。在平板竖屏及以下（≤840px），水平分割线视觉上变细（scaleY 0.5），垂直分割线同理（scaleX 0.5）。

🧩 **布局结构**：水平分割线（direction="h"）为 flex 水平布局，宽度撑满容器，上下外边距 12px。无标签时仅渲染一条线；有标签时变为"线段 + 标签 + 线段"三段结构，标签左右间距 12px。垂直分割线（direction="v"）为 inline-block 元素，宽 1px、高 1em，左右外边距 12px，垂直居中对齐。线条粗细 1px，由 border 绘制。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: horizontal(默认) | vertical
horizontal-regions: [line(左线段), label(标签文字,可选), line(右线段)]
vertical: inline-block, width=1px, height=1em
```

### 设计稿识别指南

**视觉特征指纹**

1. 一条横跨容器宽度的水平细线（浅灰色，1px） → 匹配 ODivider（direction="h"）
2. 水平线中间有文字标签，线被分为左右两段 → 匹配 ODivider（带 default 插槽）
3. 两个行内元素之间的短竖线（高度约 1em） → 匹配 ODivider（direction="v"）
4. 虚线段分割 → 匹配 ODivider（variant="dashed"）；点状线 → variant="dotted"

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 线条样式 | 实线 | variant | `'solid'` | 默认 |
| 线条样式 | 虚线段 | variant | `'dashed'` | — |
| 线条样式 | 圆点 | variant | `'dotted'` | — |
| 方向 | 水平 | direction | `'h'` | 默认 |
| 方向 | 垂直 | direction | `'v'` | — |
| 线条颜色 | `--o-color-control4`（浅灰） | darker | `false` | 默认 |
| 线条颜色 | `--o-color-control1`（深灰） | darker | `true` | — |
| 标签位置 | 文字靠左 | labelPosition | `'left'` | 左侧线段固定 28px |
| 标签位置 | 文字居中 | labelPosition | `'center'` | 默认 |
| 标签位置 | 文字靠右 | labelPosition | `'right'` | 右侧线段固定 28px |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| ODivider | CSS border | ODivider 有 role="separator" 语义，支持标签文字和响应式变细，border 仅是装饰线 |
| ODivider（垂直） | 竖线字符 `\|` | ODivider 是 DOM 元素有设计 Token 控制颜色和粗细，字符竖线无法自适应 |
| ODivider | ORow/OCol gap | ORow/OCol 的 gap 是不可见间距，ODivider 是可见的分隔线条 |
| ODivider（带标签） | 标题+下划线 | ODivider 标签是线条中间的嵌入文字，标题+下划线是文字下方的装饰线 |

---

## 版本变更记录

本组件近期无重大版本变更。
