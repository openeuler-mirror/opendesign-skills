> ← [组件索引](../SKILL.md#组件索引) · [代码使用](icon.usage.md) · [样式定制](icon.style.md)

# OIcon 图标 — 视觉识别

OIcon 是通用图标容器组件，用于展示 SVG 图标。它既可以作为纯展示图标，也可以作为可交互的图标按钮。支持加载状态，在加载时自动显示旋转加载动画。

🧩 **布局结构**：图标组件是一个 inline-flex 容器，内部居中放置单个 SVG 图标（或 loading 旋转动画、或自定义插槽内容）。没有多区域布局，尺寸由 font-size 继承控制（默认 1em）。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: none  # 单一居中容器，无方向性布局
regions: [default(图标内容)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 单个 SVG 图标元素，无矩形容器背景、无边框 → 匹配 OIcon
2. 图标有悬停变色效果（信息色系 info1→info2→info3）且光标变为 pointer → 匹配 OIcon button 模式
3. 图标区域显示旋转动画 → 匹配 OIcon loading 状态

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 图标颜色 | `--o-color-info1` 且有交互态 | button | `true` | 图标按钮模式 |
| 图标颜色 | 继承父级，无交互态 | button | `false`（默认） | 纯展示模式 |
| 图标尺寸 | 由外层 font-size 决定 | — | — | 通过 style 或 --icon-size 控制 |
| 旋转动画 | 可见旋转 | loading | `true` | 替换原图标 |
| 灰色/不可点击 | `--o-color-info4` | disabled | `true` | 配合 button 使用 |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OIcon | OButton（icon-only） | OButton 有矩形容器、padding、hover 背景变化；OIcon 无容器背景，仅图标本身变色 |
| OIcon（button） | OButton（icon-only） | OIcon button 无 padding 无背景，OButton 有固定宽高和背景色 |
| OIcon | 内联 SVG | OIcon 提供 loading、button 交互能力，内联 SVG 无这些封装 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.1.0 | 新增 zoom 类图标（放大/缩小/还原等） |
