> ← [组件索引](../SKILL.md#组件索引) · [代码使用](popup.usage.md) · [样式定制](popup.style.md)

# OPopup 弹出层 — 视觉识别

OPopup 是通用弹出层组件，是 OPopover、ODropdown、OSelect 等组件的基础。提供精确的位置计算、12 个弹出方向、7 种触发方式、自适应边缘翻转、锚点箭头等功能。通常不直接使用，而是通过封装组件使用。

📱 **响应式行为**：本组件无响应式差异（由外层封装组件处理）。

🧩 **布局结构**：OPopup 由触发元素（target 插槽，用 OChildOnly 包裹）和弹出浮层两部分组成。浮层通过 Teleport 挂载到 wrapper 容器（默认 body），内部为过渡动画包裹的 wrap 层（含内容体 body 和可选锚点箭头 anchor）。浮层位置通过 JS 动态计算，支持 12 个方向和自适应翻转。
```yaml
# 简化结构摘要（完整版见 Part B）
direction: vertical
regions: [target(触发元素), popup(浮层: wrap > body + anchor)]
```

### 设计稿识别指南

**视觉特征指纹**

1. 目标元素附近弹出的浮层容器 + 无固定内容格式 + 点击触发 → 可能使用 OPopup（底层组件）
2. 通常不直接在设计稿中识别，而是通过上层封装组件（OPopover、ODropdown、OSelect 等）间接使用

**设计 Token → Prop 值映射表**

| 设计稿属性 | 值 / 范围 | 对应 Prop | Prop 值 | 备注 |
|-----------|----------|----------|---------|------|
| 触发方式 | 点击 | trigger | `'click'` | 默认 |
| 触发方式 | 悬停 | trigger | `'hover'` | — |
| 触发方式 | 右键 | trigger | `'contextmenu'` | — |
| 触发方式 | 聚焦 | trigger | `'focus'` | — |
| 箭头 | 无三角箭头 | anchor | `false` | 默认 |
| 箭头 | 有三角箭头 | anchor | `true` | — |
| 弹出方向 | 上方 | position | `'top'` | 默认 |
| 弹出方向 | 下方 | position | `'bottom'` | — |
| 弹出方向 | 左/右 | position | `'left'`/`'right'` | — |
| 偏移距离 | 0px | offset | `0` | 默认 |

**易混淆组件区分表**

| 本组件 | 易混淆组件 | 关键区分依据 |
|--------|-----------|-------------|
| OPopup | OPopover | OPopup 是底层组件（click 触发、无箭头、0 偏移），OPopover 是封装组件（hover 触发、有箭头、8px 偏移），适合轻量提示 |
| OPopup | ODialog | ODialog 是居中模态弹窗有遮罩层覆盖全屏，OPopup 是定位到目标元素附近的非模态浮层 |
| OPopup | ODropdown | ODropdown 基于 OPopup 封装，专用于下拉菜单列表（含 OOption），OPopup 是通用容器 |

---

## 版本变更记录

| 版本 | 变更内容 |
|------|---------|
| v1.2.6 | `beforeShow`/`beforeHide` 回调文档完善，明确为纯函数不应包含副作用；触摸设备 trigger 兜底策略由过滤替换改为追加 click |
| v1.2.2 | 修复目标元素更新时浮层位置未同步的问题 |
| v1.1.0 | 调整边框位置 |
| v0.0.75 | 新增 `adaptive` prop，空间不足时自动翻转弹出方向 |
