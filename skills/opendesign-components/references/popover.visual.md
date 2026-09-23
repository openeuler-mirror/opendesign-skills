> ← [组件索引](../SKILL.md#组件索引) · [代码使用](popover.usage.md) · [样式定制](popover.style.md)

# OPopover 气泡卡片 — 视觉识别

OPopover 是气泡卡片组件，基于 OPopup 封装，用于在目标元素附近弹出轻量级浮层展示提示信息。与 OPopup 的主要区别是默认以悬停触发、默认显示锚点箭头、默认有 8px 偏移距离。

📱 **响应式行为**：在笔记本尺寸及以下（≤1440px），气泡文字缩小、内边距减少。

🧩 **布局结构**：OPopover 基于 OPopup 封装，由触发元素（target 插槽）和浮层两部分组成。浮层通过 Teleport 挂载到指定容器（默认 body），包含内容体（default 插槽包裹在 div 中）和锚点箭头（默认显示，指向触发元素）。浮层有圆角、边框、阴影，内边距 9px 16px。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: vertical  # 浮层内容纵向排列
regions: [target(触发元素), popup-body(气泡内容+锚点箭头)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 目标元素附近弹出的带三角箭头的小浮层 + 有边框阴影 → 匹配 OPopover
2. 鼠标悬停时出现的气泡卡片 + 可承载富文本或交互内容 → 匹配 OPopover
3. 无箭头但悬停触发的浮层 → 匹配 OPopover（anchor=false）

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 浮层位置 | 目标上方 | position | `'top'` | 默认 |
| 浮层位置 | 目标下方 | position | `'bottom'` | — |
| 浮层位置 | 目标左侧 | position | `'left'` | — |
| 浮层位置 | 目标右侧 | position | `'right'` | — |
| 浮层位置 | 左上/右下等细分方向 | position | `'tl'`/`'tr'`/`'bl'`/`'br'`/`'lt'`/`'lb'`/`'rt'`/`'rb'` | 12 方向 |
| 箭头 | 有三角箭头 | anchor | `true` | 默认 |
| 箭头 | 无三角箭头 | anchor | `false` | — |
| 触发方式 | 悬停触发 | trigger | `'hover'` | 默认 |
| 触发方式 | 点击触发 | trigger | `'click'` | — |
| 触发方式 | 右键触发 | trigger | `'contextmenu'` | — |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OPopover | OPopup | OPopover 默认 hover 触发+有箭头+8px 偏移，适合轻量提示；OPopup 默认 click 触发+无箭头+0 偏移，是底层通用弹出层 |
| OPopover | ODropdown | ODropdown 是下拉菜单列表（含 OOption），OPopover 是自由内容气泡卡片 |
| OPopover | ODialog | ODialog 是居中模态弹窗有遮罩，OPopover 是非模态的目标元素附近浮层 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.2 | 修复目标元素更新时浮层位置未同步的问题 |
| v1.1.0 | 调整 ≤1680px 断点下字号 |
| v0.0.75 | 新增 `adaptive` prop，空间不足时自动翻转弹出方向 |
